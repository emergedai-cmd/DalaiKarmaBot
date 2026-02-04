import fs from "node:fs/promises";
import readline from "node:readline";
import { getPaths } from "./plan.js";

type RunOpts = {
  provider: string;
  model: string;
  prompt?: string;
  timeoutMs: number;
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

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

async function ollamaChat(
  baseUrl: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  timeoutMs: number
) {
  const url = `${baseUrl}/api/chat`;
  const body = { model, messages, stream: false };

  const res = await fetchWithTimeout(
    url,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
    timeoutMs
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Ollama HTTP ${res.status}: ${text || res.statusText}`);
  }

  const json = (await res.json()) as any;
  const content = json?.message?.content;
  if (typeof content !== "string") throw new Error("Unexpected Ollama response shape (missing message.content)");
  return content;
}

async function openAiCompatChat(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  timeoutMs: number,
  extraHeaders?: Record<string, string>
) {
  const url = `${baseUrl}/chat/completions`;
  const body = { model, messages, stream: false };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    ...extraHeaders
  };

  const res = await fetchWithTimeout(url, { method: "POST", headers, body: JSON.stringify(body) }, timeoutMs);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }

  const json = (await res.json()) as any;
  const content = json?.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("Unexpected response shape (missing choices[0].message.content)");
  return content;
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

export async function runRun(cwd: string, opts: RunOpts) {
  const cfg = await readConfig(cwd);
  if (!cfg) {
    console.error("❌ Config not found or invalid JSON. Run: dalaikarmabot init");
    process.exitCode = 2;
    return;
  }

  const provider = (opts.provider || "").toLowerCase().trim();
  if (!provider) {
    console.error("❌ Missing --provider");
    process.exitCode = 2;
    return;
  }

  if (!opts.model) {
    console.error("❌ Missing --model. Example: dalaikarmabot run --provider ollama --model llama3");
    process.exitCode = 2;
    return;
  }

  const timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : 15000;

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
    console.error(`❌ Unsupported provider: ${opts.provider}. Supported: ollama, groq, openrouter, deepseek, mistral.`);
    process.exitCode = 2;
    return;
  }

  const messages: Array<{ role: string; content: string }> = [];

  const invokeOnce = async (input: string) => {
    messages.push({ role: "user", content: input });

    if (provider === "ollama") {
      const out = await ollamaChat(baseUrl, opts.model, messages, timeoutMs);
      messages.push({ role: "assistant", content: out });
      return out;
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

    const out = await openAiCompatChat(baseUrl, apiKey, opts.model, messages, timeoutMs, extraHeaders);
    messages.push({ role: "assistant", content: out });
    return out;
  };

  // One-shot mode
  if (opts.prompt && opts.prompt.trim()) {
    try {
      const out = await invokeOnce(opts.prompt.trim());
      process.stdout.write(out + "\n");
    } catch (e: any) {
      console.error(`❌ Error: ${e?.message ?? String(e)}`);
      process.exitCode = 1;
    }
    return;
  }

  // Interactive mode
  console.log(`🤖 DalaiKarmaBot run (provider=${provider}, model=${opts.model})`);
  console.log(`Endpoint: ${baseUrl}`);
  if (provider !== "ollama") {
    const keyPresent = !!getEnvKeyForProvider(provider);
    console.log(`Auth: ${keyPresent ? "API key present" : "API key MISSING"}`);
  }
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
        const out = await invokeOnce(input);
        console.log(out + "\n");
      } catch (e: any) {
        console.error(`❌ Error: ${e?.message ?? String(e)}`);
      }
    }
  } finally {
    rl.close();
  }
}
