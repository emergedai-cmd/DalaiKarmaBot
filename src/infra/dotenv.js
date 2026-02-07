import fs from "fs";
import path from "path";
import os from "os";
import process from "process";

/**
 * ESM-only dotenv loader (no external deps).
 *
 * Loads:
 *  1) .env in current working directory
 *  2) optional global fallback: <configDir>/.env
 *
 * Deterministic, silent by default, and never overrides existing env.
 */
export function loadDotEnv(opts = {}) {
  const quiet = opts?.quiet ?? true;

  // 1) Local .env
  loadFileIntoEnv(path.resolve(process.cwd(), ".env"), { override: false, quiet });

  // 2) Global fallback .env
  const configDir = resolveConfigDir(process.env);
  if (!configDir) return;
  loadFileIntoEnv(path.join(configDir, ".env"), { override: false, quiet });
}

function loadFileIntoEnv(filePath, { override, quiet }) {
  let raw;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch {
    return;
  }

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    if (!key) continue;

    let value = trimmed.slice(eq + 1).trim();

    // Strip optional surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Basic escape handling for \n and \r
    value = value.replace(/\\n/g, "\n").replace(/\\r/g, "\r");

    if (!override && process.env[key] !== undefined) continue;
    process.env[key] = value;
  }

  // Intentionally no logging (even if quiet=false). Caller can log if desired.
  void quiet;
}

function resolveConfigDir(env) {
  // Explicit overrides
  if (env.DKB_CONFIG_DIR) return env.DKB_CONFIG_DIR;
  if (env.OPENCLAW_CONFIG_DIR) return env.OPENCLAW_CONFIG_DIR;

  // XDG base dir (Linux/macOS)
  if (env.XDG_CONFIG_HOME) return path.join(env.XDG_CONFIG_HOME, "dalaikarmabot");

  // Default: ~/.config/dalaikarmabot
  const home = env.HOME || (typeof os.homedir === "function" ? os.homedir() : "");
  if (!home) return null;
  return path.join(home, ".config", "dalaikarmabot");
}
