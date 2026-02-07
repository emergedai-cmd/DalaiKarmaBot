import fs from "fs";
import path from "path";
import process from "process";
import os from "os";
import { isTruthyEnvValue } from "./env.js";

/**
 * Best-effort PATH bootstrap so the CLI binary can be discovered in minimal
 * environments (CI, launchd, etc.). Quiet and deterministic.
 */
export function ensureOpenClawCliOnPath(opts = {}) {
  if (isTruthyEnvValue(process.env.OPENCLAW_PATH_BOOTSTRAPPED)) return;
  process.env.OPENCLAW_PATH_BOOTSTRAPPED = "1";

  const existing = opts.pathEnv ?? process.env.PATH ?? "";
  const cwd = opts.cwd ?? safeCwd();
  const home = opts.homeDir ?? safeHomeDir();
  const platform = opts.platform ?? process.platform;

  const prepend = candidateBinDirs({ cwd, home, platform, execPath: opts.execPath ?? process.execPath });
  if (prepend.length === 0) return;

  const merged = mergePath(existing, prepend);
  if (merged) process.env.PATH = merged;
}

function safeCwd() {
  try {
    return process.cwd();
  } catch {
    return "";
  }
}

function safeHomeDir() {
  return process.env.HOME || process.env.USERPROFILE || (typeof os.homedir === "function" ? os.homedir() : "");
}

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function isFile(p) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

function candidateBinDirs({ cwd, home, platform, execPath }) {
  const out = [];

  // Local project bin
  if (cwd) {
    const localBin = path.join(cwd, "node_modules", ".bin");
    if (isDirectory(localBin)) out.push(localBin);
  }

  // Common per-user bins
  if (home) {
    out.push(path.join(home, ".local", "bin"));
    out.push(path.join(home, ".local", "share", "pnpm"));
    out.push(path.join(home, ".yarn", "bin"));
    out.push(path.join(home, ".bun", "bin"));
    if (platform === "darwin") out.push(path.join(home, "Library", "pnpm"));
  }

  // Sibling to executable (bundled app scenarios)
  try {
    if (execPath) {
      const execDir = path.dirname(execPath);
      if (isDirectory(execDir)) out.push(execDir);
    }
  } catch {
    // ignore
  }

  // Common system bins
  out.push("/usr/local/bin", "/usr/bin", "/bin");
  if (platform === "win32") {
    // On Windows, PATH delimiter is ';' and typical installs are already in PATH.
    // Keep list minimal to avoid bogus entries.
  } else {
    out.push("/opt/homebrew/bin");
  }

  // Deduplicate and keep only existing dirs
  const seen = new Set();
  return out
    .map((p) => (p || "").trim())
    .filter(Boolean)
    .filter((p) => {
      const key = p;
      if (seen.has(key)) return false;
      seen.add(key);
      return isDirectory(p);
    });
}

function mergePath(existing, prepend) {
  const partsExisting = String(existing)
    .split(path.delimiter)
    .map((p) => p.trim())
    .filter(Boolean);

  const partsPrepend = prepend.map((p) => p.trim()).filter(Boolean);

  const seen = new Set();
  const merged = [];
  for (const part of [...partsPrepend, ...partsExisting]) {
    if (!seen.has(part)) {
      seen.add(part);
      merged.push(part);
    }
  }
  return merged.join(path.delimiter);
}
