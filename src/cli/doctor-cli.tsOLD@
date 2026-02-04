import fs from "node:fs/promises";
import { getPaths } from "./plan.js";

type DoctorOpts = {
  timeoutMs: number;
  pingModels?: boolean;
  strict?: boolean;
  json?: boolean;
  quiet?: boolean;
};

type Config = {
  providers?: Record<string, { baseUrl?: string }>;
};

function normalizeBaseUrl(u?: string): string | null {
  if (!u) return null;
  const s = u.trim();
  if (!s) return null;
  return s.replace(/\/+$/, "");
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<{ ok: boolean; status?: number; error?: string; text?: string }> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    const text = await res.text().catch(() => "");
    return { ok: res.ok, status: res.status, text };
  } catch (e: any) {
    return { ok: false, error: e?.name === "AbortError" ? "timeout" : (e?.message ?? "fetch failed") };
  } finally {
    clearTimeout(t);
  }
}

function env(name: string): string | null {
  const v = process.env[name];
  if (!v) return null;
  const s = v.trim();
  return s ? s : null;
}

type CheckResult =
  | { name: string; kind: "skip"; reason: string }
  | { name: string; kind: "ok"; details: string }
  | { name: string; kind: "warn"; details: string }
  | { name: string; kind: "fail"; details: string };

function printHuman(results: CheckResult[]) {
  const failures = results.filter((r) => r.kind === "fail").length;
  const warns = results.filter((r) => r.kind === "warn").length;

  console.log("🩺 DalaiKarmaBot doctor\n");
  for (const r of results) {
    const prefix =
      r.kind === "ok" ? "✅" :
      r.kind === "warn" ? "⚠️" :
      r.kind === "fail" ? "❌" : "⏭️";
    const msg = r.kind === "skip" ? r.reason : r.details;
    console.log(`${prefix} ${r.name}: ${msg}`);
  }

  console.log("");
  if (failures > 0) console.log(`❌ ${failures} failing check(s).`);
  else if (warns > 0) console.log(`⚠️ ${warns} warning(s).`);
  else console.log("✅ All checks passed.");
}

export async function runDoctor(cwd: string, opts: DoctorOpts) {
  const p = getPaths(cwd);

  let cfg: Config | null = null;
  try {
    const raw = await fs.readFile(p.configPath, "utf8");
    cfg = JSON.parse(raw);
  } catch {
    cfg = null;
  }

  if (!cfg) {
    const out = { ok: false, error: "Config not found or invalid JSON", configPath: p.configPath };
    if (opts.json) {
      console.log(JSON.stringify(out, null, 2));
    } else if (!opts.quiet) {
      console.log("❌ Config not found or invalid JSON. Run: dalaikarmabot init");
      console.log(`Config: ${p.configPath}`);
    }
    process.exitCode = 2;
    return;
  }

  const providers = cfg.providers ?? {};
  const timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : 1500;
  const strict = !!opts.strict;
  const pingModels = !!opts.pingModels;

  const results: CheckResult[] = [];

  // ---- Local providers ----
  const ollamaBase = normalizeBaseUrl(providers.ollama?.baseUrl) ?? "http://localhost:11434";
  const lmBase = normalizeBaseUrl(providers.lmstudio?.baseUrl);
  const n8nBase = normalizeBaseUrl(providers.n8n?.baseUrl);

  // Ollama connectivity (no auth)
  {
    const r = await fetchWithTimeout(`${ollamaBase}/api/tags`, { method: "GET" }, timeoutMs);
    if (r.ok) results.push({ name: "Ollama", kind: "ok", details: `reachable (${ollamaBase}) [HTTP ${r.status}]` });
    else results.push({ name: "Ollama", kind: "fail", details: `unreachable (${ollamaBase}) [${r.error ?? `HTTP ${r.status}`}]` });
  }

  // LM Studio connectivity (optional)
  if (lmBase) {
    const r = await fetchWithTimeout(`${lmBase}/v1/models`, { method: "GET" }, timeoutMs);
    if (r.ok) results.push({ name: "LM Studio", kind: "ok", details: `reachable (${lmBase}) [HTTP ${r.status}]` });
    else results.push({ name: "LM Studio", kind: "fail", details: `unreachable (${lmBase}) [${r.error ?? `HTTP ${r.status}`}]` });
  } else {
    results.push({ name: "LM Studio", kind: "skip", reason: "not configured (providers.lmstudio.baseUrl empty)" });
  }

  // n8n connectivity (optional)
  if (n8nBase) {
    const r = await fetchWithTimeout(`${n8nBase}`, { method: "GET" }, timeoutMs);
    if (r.ok) results.push({ name: "n8n", kind: "ok", details: `reachable (${n8nBase}) [HTTP ${r.status}]` });
    else results.push({ name: "n8n", kind: "fail", details: `unreachable (${n8nBase}) [${r.error ?? `HTTP ${r.status}`}]` });
  } else {
    results.push({ name: "n8n", kind: "skip", reason: "not configured (providers.n8n.baseUrl empty)" });
  }

  // ---- Hosted providers (OpenAI-compatible) ----
  type Hosted = {
    id: "groq" | "openrouter" | "deepseek" | "mistral";
    label: string;
    defaultBaseUrl: string;
    envKey: string;
    extraHeaders?: Record<string, string>;
  };

  const hosted: Hosted[] = [
    { id: "groq", label: "Groq", defaultBaseUrl: "https://api.groq.com/openai/v1", envKey: "GROQ_API_KEY" },
    {
      id: "openrouter",
      label: "OpenRouter",
      defaultBaseUrl: "https://openrouter.ai/api/v1",
      envKey: "OPENROUTER_API_KEY"
    },
    { id: "deepseek", label: "DeepSeek", defaultBaseUrl: "https://api.deepseek.com/v1", envKey: "DEEPSEEK_API_KEY" },
    { id: "mistral", label: "Mistral", defaultBaseUrl: "https://api.mistral.ai/v1", envKey: "MISTRAL_API_KEY" }
  ];

  for (const h of hosted) {
    const base = normalizeBaseUrl(providers[h.id]?.baseUrl) ?? h.defaultBaseUrl;
    const key = env(h.envKey);

    // Key presence check
    if (!key) {
      const msg = `missing env var ${h.envKey}`;
      if (strict) results.push({ name: h.label, kind: "fail", details: msg });
      else results.push({ name: h.label, kind: "warn", details: msg });
      // Without a key we can't safely ping /models
      continue;
    } else {
      results.push({ name: h.label, kind: "ok", details: `API key present (${h.envKey})` });
    }

    if (!pingModels) continue;

    // Optional /models ping (auth required)
    const headers: Record<string, string> = {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    };

    if (h.id === "openrouter") {
      const siteUrl = env("OPENROUTER_SITE_URL");
      const appName = env("OPENROUTER_APP_NAME");
      if (siteUrl) headers["HTTP-Referer"] = siteUrl;
      if (appName) headers["X-Title"] = appName;
    }

    const r = await fetchWithTimeout(`${base}/models`, { method: "GET", headers }, timeoutMs);
    if (r.ok) {
      results.push({ name: `${h.label} /models`, kind: "ok", details: `reachable (${base}/models) [HTTP ${r.status}]` });
    } else {
      results.push({
        name: `${h.label} /models`,
        kind: "fail",
        details: `unreachable (${base}/models) [${r.error ?? `HTTP ${r.status}`}]`
      });
    }
  }

  // Output
  const failureCount = results.filter((r) => r.kind === "fail").length;
  const warnCount = results.filter((r) => r.kind === "warn").length;

  if (opts.json) {
    console.log(
      JSON.stringify(
        {
          ok: failureCount === 0 && (strict ? warnCount === 0 : true),
          configPath: p.configPath,
          pingModels,
          strict,
          results
        },
        null,
        2
      )
    );
  } else if (!opts.quiet) {
    printHuman(results);
  }

  if (failureCount > 0) process.exitCode = 1;
  else if (strict && warnCount > 0) process.exitCode = 1;
}
