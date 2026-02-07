import fs from "node:fs/promises";
import readline from "node:readline";
import { getPaths } from "./plan.js";
import { normalizeThrownError, toRunCliErrorShape, safePreview } from "./errors.js";

type RunOpts = {
  provider: string;
  model: string;
  prompt?: string;

  // Output mode
  json?: boolean;
  quiet?: boolean;

  // Automation handoff (no interactivity; strict JSON suitable for webhook ingestion)
  n8n?: boolean;

  // Tuning (best-effort across providers)
  temperature?: number;
  maxTokens?: number;

  // Network
  timeoutMs?: number;
};

type Config = {
  providers?: {
    ollama?: { baseUrl?: string };
    groq?: { baseUrl?: string };
    openrouter?: { baseUrl?: string };
    deepseek?: { baseUrl?: string };
    mistral?: { baseUrl?: string };
  };
};

type ProviderName = "ollama" | "groq" | "openrouter" | "deepseek" | "mistral";

type Usage = {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  raw?: unknown; // pass-through for auditing if needed
};

type RunSuccess = {
  ok: true;
  mode: "cli" | "n8n";
  provider: ProviderName;
  model: string;
  endpoint: string;
  prompt?: string; // included only in n8n mode
  output: string;
  usage?: Usage;
  meta: {
    timeoutMs: number;
    temperature: number;
    maxTokens: number;
    retries: number;
  };
};

type RunError = {
  ok: false;
  mode: "cli" | "n8n";
  provider: ProviderName | string;
  model?: string;
  endpoint?: string;
  error: {
    kind: "network" | "timeout" | "provider" | "config" | "validation" | "unknown";
    message: string;
    httpStatus?: number;
    code?: string;
    retryable?: boolean;
    details?: {
      request?: { method: string; url: string };
      responseTextPreview?: string; // truncated; never includes prompt/system content
    };
  };
  meta?: {
    timeoutMs?: number;
    temperature?: number;
    maxTokens?: number;
    retries?: number;
  };
};

function normalizeBaseUrl(u?: string): string | null {
  if (!u) return null;
  const s = u.trim();
  if (!s) return null;
  return s.replace(/\/+$/, "");
}

async function readConfig(cwd: string): Promise<Config | null> {
  const { configPath } = getPaths(cwd);
  try {
    const raw = await fs.readFile(configPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function toFiniteInt(n: unknown, fallback: number): number {
  const x = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(x)) return fallback;
  return Math.trunc(x);
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function providerDefaults(provider: ProviderName) {
  // Conservative, explicit defaults. (Boring is good.)
  const timeoutMs =
    provider === "ollama" ? 20_000 : provider === "groq" ? 15_000 : provider === "openrouter" ? 20_000 : 20_000;

  return {
    timeoutMs,
    temperature: 0.2,
    maxTokens: 512
  };
}

function validateTuning(provider: ProviderName, temperature: number, maxTokens: number) {
  // Best-effort, conservative constraints that remain CI-friendly.
  // If a provider supports wider ranges, it can still reject/accept server-side;
  // we keep client-side validation strict.
  const tempMin = 0;
  const tempMax = provider === "ollama" ? 2 : 2;

  const maxTokensMin = 1;
  const maxTokensMax =
    provider === "groq"
      ? 4096
      : provider === "mistral"
        ? 4096
        : provider === "deepseek"
          ? 4096
          : provider === "openrouter"
            ? 4096
            : 4096;

  if (!Number.isFinite(temperature) || temperature < tempMin || temperature > tempMax) {
    return `Invalid --temperature ${temperature}. Allowed range for ${provider}: ${tempMin}..${tempMax}`;
  }
  if (!Number.isFinite(maxTokens) || Math.trunc(maxTokens) !== maxTokens || maxTokens < maxTokensMin || maxTokens > maxTokensMax) {
    return `Invalid --max-tokens ${maxTokens}. Allowed range for ${provider}: ${maxTokensMin}..${maxTokensMax}`;
  }
  return null;
}

class HttpError extends Error {
  status: number;
  url: string;
  method: string;
  responseText?: string;
  constructor(args: { status: number; url: string; method: string; message: string; responseText?: string }) {
    super(args.message);
    this.name = "HttpError";
    this.status = args.status;
    this.url = args.url;
    this.method = args.method;
    this.responseText = args.responseText;
  }
}

class NetworkError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = "NetworkError";
    this.code = code;
  }
}

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

function classifyError(e: any, providerName?: string): RunError["error"] {
  // Keep the existing RunError schema stable, but derive it from our normalized CliError model.
  const normalized = normalizeThrownError({ provider: providerName, error: e });
  // Ensure previews stay deterministic and truncated.
  if (normalized.responseTextPreview) normalized.responseTextPreview = safePreview(normalized.responseTextPreview);
  return toRunCliErrorShape(normalized);
}

function mapErrorToExitCode(err: RunError["error"]): number {
  // CI-friendly exit codes:
  // 2 = config/validation, 3 = auth, 4 = rate limit, 5 = provider/server, 6 = network/timeout, 1 = generic
  if (err.kind === "config" || err.kind === "validation") return 2;
  if (err.httpStatus === 401 || err.httpStatus === 403) return 3;
  if (err.httpStatus === 429) return 4;
  if (err.httpStatus && err.httpStatus >= 500) return 5;
  if (err.kind === "network" || err.kind === "timeout") return 6;
  return 1;
}

async function fetchWithHardening(args: {
  url: string;
  init: RequestInit;
  timeoutMs: number;
  retries: number;
  retryDelaysMs: number[];
}) {
  const { url, init, timeoutMs, retries, retryDelaysMs } = args;

  let attempt = 0;
  while (true) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);

    try {
      const res = await fetch(url, { ...init, signal: ctrl.signal });

      if (res.ok) return res;

      // Non-OK: read text once for auditable previews (truncated later).
      const text = await res.text().catch(() => "");
      throw new HttpError({
        status: res.status,
        url,
        method: (init.method ?? "GET").toUpperCase(),
        message: `HTTP ${res.status}: ${res.statusText}`,
        responseText: text
      });
    } catch (e: any) {
      // Abort => timeout
      if (e?.name === "AbortError") {
        e = new TimeoutError(`Request timed out after ${timeoutMs}ms`);
      } else if (e instanceof TypeError) {
        // Node fetch network-ish failures often surface as TypeError
        e = new NetworkError(e.message || "Network error");
      }

      const normalized = normalizeThrownError({ error: e });

      // Deterministic bounded retry: rely on normalized.retryable (429/5xx/network/timeout).
      const canRetry = attempt < retries && normalized.retryable;

      if (!canRetry) throw e;

      const delay = retryDelaysMs[Math.min(attempt, retryDelaysMs.length - 1)] ?? 500;
      attempt += 1;
      await sleep(delay);
      continue;
    } finally {
      clearTimeout(t);
    }
  }
}

function extractUsageFromOpenAiCompat(json: any): Usage | undefined {
  const u = json?.usage;
  if (!u || typeof u !== "object") return undefined;

  // Prefer standard fields; keep a raw copy for auditing.
  const inputTokens = typeof u.prompt_tokens === "number" ? u.prompt_tokens : undefined;
  const outputTokens = typeof u.completion_tokens === "number" ? u.completion_tokens : undefined;
  const totalTokens = typeof u.total_tokens === "number" ? u.total_tokens : undefined;

  return { inputTokens, outputTokens, totalTokens, raw: u };
}

async function ollamaChat(args: {
  baseUrl: string;
  model: string;
  messages: Array<{ role: string; content: string }>;
  timeoutMs: number;
  temperature: number;
  maxTokens: number;
  retries: number;
}) {
  const url = `${args.baseUrl}/api/chat`;
  const body = {
    model: args.model,
    messages: args.messages,
    stream: false,
    options: {
      temperature: args.temperature,
      num_predict: args.maxTokens
    }
  };

  const res = await fetchWithHardening({
    url,
    init: { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
    timeoutMs: args.timeoutMs,
    retries: args.retries,
    retryDelaysMs: [250, 750]
  });

  const json = (await res.json()) as any;
  const content = json?.message?.content;
  if (typeof content !== "string") throw new Error("Unexpected Ollama response shape (missing message.content)");

  // Ollama has several token-ish fields depending on config; pass raw for auditing.
  const usage: Usage | undefined = json?.prompt_eval_count || json?.eval_count
    ? {
        inputTokens: typeof json.prompt_eval_count === "number" ? json.prompt_eval_count : undefined,
        outputTokens: typeof json.eval_count === "number" ? json.eval_count : undefined,
        totalTokens:
          typeof json.prompt_eval_count === "number" && typeof json.eval_count === "number"
            ? json.prompt_eval_count + json.eval_count
            : undefined,
        raw: {
          prompt_eval_count: json.prompt_eval_count,
          eval_count: json.eval_count,
          total_duration: json.total_duration,
          load_duration: json.load_duration,
          prompt_eval_duration: json.prompt_eval_duration,
          eval_duration: json.eval_duration
        }
      }
    : undefined;

  return { content, usage };
}

async function openAiCompatChat(args: {
  baseUrl: string;
  apiKey: string;
  model: string;
  messages: Array<{ role: string; content: string }>;
  timeoutMs: number;
  temperature: number;
  maxTokens: number;
  retries: number;
  extraHeaders?: Record<string, string>;
}) {
  const url = `${args.baseUrl}/chat/completions`;
  const body = {
    model: args.model,
    messages: args.messages,
    stream: false,
    temperature: args.temperature,
    max_tokens: args.maxTokens
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${args.apiKey}`,
    ...args.extraHeaders
  };

  const res = await fetchWithHardening({
    url,
    init: { method: "POST", headers, body: JSON.stringify(body) },
    timeoutMs: args.timeoutMs,
    retries: args.retries,
    retryDelaysMs: [250, 750]
  });

  const json = (await res.json()) as any;
  const content = json?.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("Unexpected response shape (missing choices[0].message.content)");

  const usage = extractUsageFromOpenAiCompat(json);
  return { content, usage };
}

function getEnvKeyForProvider(provider: string): string | null {
  switch (provider) {
    case "groq":
      return process.env.GROQ_API_KEY ? "GROQ_API_KEY" : null;
    case "openrouter":
      return process.env.OPENROUTER_API_KEY ? "OPENROUTER_API_KEY" : null;
    case "deepseek":
      return process.env.DEEPSEEK_API_KEY ? "DEEPSEEK_API_KEY" : null;
    case "mistral":
      return process.env.MISTRAL_API_KEY ? "MISTRAL_API_KEY" : null;
    default:
      return null;
  }
}

function getApiKey(provider: string): string | null {
  switch (provider) {
    case "groq":
      return process.env.GROQ_API_KEY ?? null;
    case "openrouter":
      return process.env.OPENROUTER_API_KEY ?? null;
    case "deepseek":
      return process.env.DEEPSEEK_API_KEY ?? null;
    case "mistral":
      return process.env.MISTRAL_API_KEY ?? null;
    default:
      return null;
  }
}

function emitJson(obj: unknown) {
  // Strict, deterministic JSON: single line, no trailing noise.
  process.stdout.write(JSON.stringify(obj) + "\n");
}


export async function runRun(cwd: string, opts: RunOpts) {
  const mode: "cli" | "n8n" = opts.n8n ? "n8n" : "cli";
  const forceJson = opts.json || opts.n8n;
  const quiet = opts.quiet || opts.n8n;

  const cfg = await readConfig(cwd);
  if (!cfg) {
    const err: RunError = {
      ok: false,
      mode,
      provider: opts.provider ?? "",
      model: opts.model,
      error: { kind: "config", message: "Config not found or invalid JSON. Run: dalaikarmabot init" }
    };
    if (forceJson) emitJson(err);
    else console.error("❌ " + err.error.message);
    process.exitCode = mapErrorToExitCode(err.error);
    return;
  }

  const provider = (opts.provider || "").toLowerCase().trim() as ProviderName;
  if (!provider) {
    const err: RunError = {
      ok: false,
      mode,
      provider: "",
      model: opts.model,
      error: { kind: "validation", message: "Missing --provider" }
    };
    if (forceJson) emitJson(err);
    else console.error("❌ " + err.error.message);
    process.exitCode = mapErrorToExitCode(err.error);
    return;
  }

  if (!opts.model) {
    const err: RunError = {
      ok: false,
      mode,
      provider,
      model: "",
      error: { kind: "validation", message: "Missing --model. Example: dalaikarmabot run --provider ollama --model llama3" }
    };
    if (forceJson) emitJson(err);
    else console.error("❌ " + err.error.message);
    process.exitCode = mapErrorToExitCode(err.error);
    return;
  }

  if (opts.n8n && (!opts.prompt || !opts.prompt.trim())) {
    const err: RunError = {
      ok: false,
      mode,
      provider,
      model: opts.model,
      error: { kind: "validation", message: "n8n mode requires --prompt (no interactive mode in handoff)" }
    };
    emitJson(err);
    process.exitCode = mapErrorToExitCode(err.error);
    return;
  }

  // Build router
  const providers = cfg.providers ?? {};
  const baseUrl =
    provider === "ollama"
      ? normalizeBaseUrl(providers.ollama?.baseUrl) ?? "http://localhost:11434"
      : provider === "groq"
        ? normalizeBaseUrl(providers.groq?.baseUrl) ?? "https://api.groq.com/openai/v1"
        : provider === "openrouter"
          ? normalizeBaseUrl(providers.openrouter?.baseUrl) ?? "https://openrouter.ai/api/v1"
          : provider === "deepseek"
            ? normalizeBaseUrl(providers.deepseek?.baseUrl) ?? "https://api.deepseek.com/v1"
            : provider === "mistral"
              ? normalizeBaseUrl(providers.mistral?.baseUrl) ?? "https://api.mistral.ai/v1"
              : null;

  if (!baseUrl) {
    const err: RunError = {
      ok: false,
      mode,
      provider: opts.provider,
      model: opts.model,
      error: {
        kind: "validation",
        message: `Unsupported provider: ${opts.provider}. Supported: ollama, groq, openrouter, deepseek, mistral.`
      }
    };
    if (forceJson) emitJson(err);
    else console.error("❌ " + err.error.message);
    process.exitCode = mapErrorToExitCode(err.error);
    return;
  }

  const defaults = providerDefaults(provider);
  const timeoutMs = clamp(toFiniteInt(opts.timeoutMs, defaults.timeoutMs), 1_000, 120_000);

  const temperature = opts.temperature ?? defaults.temperature;
  const maxTokens = opts.maxTokens ?? defaults.maxTokens;

  const validationErr = validateTuning(provider, temperature, maxTokens);
  if (validationErr) {
    const err: RunError = {
      ok: false,
      mode,
      provider,
      model: opts.model,
      endpoint: baseUrl,
      error: { kind: "validation", message: validationErr }
    };
    if (forceJson) emitJson(err);
    else console.error("❌ " + err.error.message);
    process.exitCode = mapErrorToExitCode(err.error);
    return;
  }

  const retries = 2; // safe default; never infinite

  const messages: Array<{ role: string; content: string }> = [];

  const invokeOnce = async (input: string) => {
    messages.push({ role: "user", content: input });

    if (provider === "ollama") {
      const { content, usage } = await ollamaChat({
        baseUrl,
        model: opts.model,
        messages,
        timeoutMs,
        temperature,
        maxTokens,
        retries
      });
      messages.push({ role: "assistant", content });
      return { output: content, usage };
    }

    const apiKey = getApiKey(provider);
    if (!apiKey) {
      const envName =
        provider === "groq"
          ? "GROQ_API_KEY"
          : provider === "openrouter"
            ? "OPENROUTER_API_KEY"
            : provider === "deepseek"
              ? "DEEPSEEK_API_KEY"
              : "MISTRAL_API_KEY";
      throw new Error(`Missing API key env var: ${envName}`);
    }

    const extraHeaders: Record<string, string> = {};
    if (provider === "openrouter") {
      // Optional attribution headers; harmless if unset
      const site = process.env.OPENROUTER_SITE_URL;
      const title = process.env.OPENROUTER_APP_NAME;
      if (site) extraHeaders["HTTP-Referer"] = site;
      if (title) extraHeaders["X-Title"] = title;
    }

    const { content, usage } = await openAiCompatChat({
      baseUrl,
      apiKey,
      model: opts.model,
      messages,
      timeoutMs,
      temperature,
      maxTokens,
      retries,
      extraHeaders
    });
    messages.push({ role: "assistant", content });
    return { output: content, usage };
  };

  const formatHumanError = (err: RunError["error"]) => {
    const status = err.httpStatus ? `HTTP ${err.httpStatus}` : err.code ? err.code : err.kind;
    const retryHint = err.retryable ? " (retryable)" : "";
    return `${status}${retryHint}: ${err.message}`;
  };

  const toRunErrorPayload = (e: any): RunError => {
    const error = classifyError(e, provider);
    return {
      ok: false,
      mode,
      provider,
      model: opts.model,
      endpoint: baseUrl,
      error,
      meta: { timeoutMs, temperature, maxTokens, retries }
    };
  };

  // One-shot mode (includes json/n8n)
  if (opts.prompt && opts.prompt.trim()) {
    try {
      const prompt = opts.prompt.trim();
      const { output, usage } = await invokeOnce(prompt);

      const MAX_OUTPUT_CHARS = 200_000; // streaming guardrail substitute in non-stream mode
      if (output.length > MAX_OUTPUT_CHARS) {
        throw new Error(`Model output exceeded ${MAX_OUTPUT_CHARS} characters; increase constraints or reduce prompt`);
      }

      if (forceJson) {
        const payload: RunSuccess = {
          ok: true,
          mode,
          provider,
          model: opts.model,
          endpoint: baseUrl,
          prompt: mode === "n8n" ? prompt : undefined,
          output,
          usage,
          meta: { timeoutMs, temperature, maxTokens, retries }
        };
        emitJson(payload);
      } else {
        process.stdout.write(output + "\n");
      }
    } catch (e: any) {
      const payload = toRunErrorPayload(e);
      if (forceJson) emitJson(payload);
      else console.error(`❌ Error: ${formatHumanError(payload.error)}`);
      process.exitCode = mapErrorToExitCode(payload.error);
    }
    return;
  }

  // Interactive mode (never in json/quiet/n8n)
  if (forceJson || quiet) {
    const err: RunError = {
      ok: false,
      mode,
      provider,
      model: opts.model,
      endpoint: baseUrl,
      error: { kind: "validation", message: "Interactive mode is disabled when --json, --quiet, or --n8n is set. Provide --prompt." }
    };
    if (forceJson) emitJson(err);
    else console.error("❌ " + err.error.message);
    process.exitCode = mapErrorToExitCode(err.error);
    return;
  }

  console.log(`🤖 DalaiKarmaBot run (provider=${provider}, model=${opts.model})`);
  console.log(`Endpoint: ${baseUrl}`);
  if (provider !== "ollama") {
    const keyPresent = !!getEnvKeyForProvider(provider);
    console.log(`Auth: ${keyPresent ? "API key present" : "API key MISSING"}`);
  }
  console.log(`Timeout: ${timeoutMs}ms | Temperature: ${temperature} | Max tokens: ${maxTokens} | Retries: ${retries}`);
  console.log("Type /exit to quit.\n");

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q: string) => new Promise<string>((resolve) => rl.question(q, resolve));

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const input = (await ask("> ")).trim();
      if (!input) continue;
      if (input === "/exit" || input === "/quit") break;

      try {
        const { output } = await invokeOnce(input);
        console.log(output + "\n");
      } catch (e: any) {
        const payload = toRunErrorPayload(e);
        console.error(`❌ Error: ${formatHumanError(payload.error)}`);
      }
    }
  } finally {
    rl.close();
  }
}
