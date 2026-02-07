import process from "process";

// ESM-only env helpers (deterministic, quiet).

function parseBooleanValue(value) {
  if (value == null) return undefined;
  const v = String(value).trim().toLowerCase();
  if (!v) return undefined;

  if (v === "1" || v === "true" || v === "yes" || v === "y" || v === "on") return true;
  if (v === "0" || v === "false" || v === "no" || v === "n" || v === "off") return false;

  return undefined;
}

export function logAcceptedEnvOption(_option) {
  // Intentionally silent in DalaiKarmaBot core to avoid stdout/stderr noise.
}

export function normalizeZaiEnv() {
  if (!process.env.ZAI_API_KEY?.trim() && process.env.Z_AI_API_KEY?.trim()) {
    process.env.ZAI_API_KEY = process.env.Z_AI_API_KEY;
  }
}

export function isTruthyEnvValue(value) {
  return parseBooleanValue(value) === true;
}

export function normalizeEnv() {
  normalizeZaiEnv();
}
