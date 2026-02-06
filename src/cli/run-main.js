import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import { isMainModule } from "../infra/is-main.js";

// ---------------------------------------------------------------------------
// JSON fatal emitter (audit-first, deterministic)
//
// Requirements:
// - exactly one line of JSON
// - no prefixes or extra stdout noise
// - deterministic schema (no timestamps / random ids)
// - no side effects beyond stdout.write
// ---------------------------------------------------------------------------

function toErrorShape(err) {
  if (err instanceof Error) {
    return { name: err.name || "Error", message: err.message || "" };
  }
  return { name: "Error", message: String(err ?? "") };
}

function emitFatalJson(kind, err) {
  const { name, message } = toErrorShape(err);
  const payload = {
    ok: false,
    kind,
    error: {
      code: kind,
      kind: "cli",
      name,
      message,
    },
  };

  // Exactly one JSON line, and no other stdout noise.
     process.stdout.write(`${JSON.stringify(payload)}\n`);

  return payload;
}

// Test-only hook: required by src/cli/run-main.json-fatal.test.ts
export function __test_emitFatalJson(kind, err) {
  return emitFatalJson(kind, err);
}

// Back-compat alias expected by tests.
export { __test_emitFatalJson as __test__emitFatalJson };

// Alias for older test naming (double underscore after "test")

/**
 * DalaiKarmaBot CLI entrypoint (ESM-safe, test-friendly).
 *
 * Defer all non-trivial imports until runCli() is called to avoid side-effects at import time.
 */

export function rewriteUpdateFlagArgv(argv) {
  const index = argv.indexOf("--update");
  if (index === -1) return argv;
  const next = [...argv];
  next.splice(index, 1, "update");
  return next;
}

export async function runCli(argv = process.argv) {
  const normalizedArgv = stripWindowsNodeExec(argv);

  const { loadDotEnv } = await import("../infra/dotenv.js");
  const { normalizeEnv } = await import("../infra/env.js");
  const { ensureOpenClawCliOnPath } = await import("../infra/path-env.js");
  const { assertSupportedRuntime } = await import("../infra/runtime-guard.js");
  const { installUnhandledRejectionHandler } = await import("../infra/unhandled-rejections.js");
  const { formatUncaughtError } = await import("../infra/errors.js");
  const { enableConsoleCapture } = await import("../logging.js");
  const { getPrimaryCommand, hasHelpOrVersion } = await import("./argv.js");
  const { tryRouteCli } = await import("./route.js");

  loadDotEnv({ quiet: true });
  normalizeEnv();
  ensureOpenClawCliOnPath();
  assertSupportedRuntime();

  if (await tryRouteCli(normalizedArgv)) return;

  enableConsoleCapture();

  const { buildProgram } = await import("./program.js");
  const program = buildProgram();

  installUnhandledRejectionHandler();

  process.on("uncaughtException", (error) => {
    console.error("[dalaikarmabot] Uncaught exception:", formatUncaughtError(error));
    process.exit(1);
  });

  const parseArgv = rewriteUpdateFlagArgv(normalizedArgv);

  const primary = getPrimaryCommand(parseArgv);
  if (primary) {
    const { registerSubCliByName } = await import("./program/register.subclis.js");
    await registerSubCliByName(program, primary);
  }

  const shouldSkipPluginRegistration = !primary && hasHelpOrVersion(parseArgv);
  if (!shouldSkipPluginRegistration) {
    const { registerPluginCliCommands } = await import("../plugins/cli.js");
    const { loadConfig } = await import("../config/config.js");
    registerPluginCliCommands(program, loadConfig());
  }

  await program.parseAsync(parseArgv);
}

function stripWindowsNodeExec(argv) {
  if (process.platform !== "win32") return argv;

  const stripControlChars = (value) => {
    let out = "";
    for (let i = 0; i < value.length; i += 1) {
      const code = value.charCodeAt(i);
      if (code >= 32 && code !== 127) out += value[i];
    }
    return out;
  };

  const normalizeArg = (value) => stripControlChars(value).replace(/^['"]+|['"]+$/g, "").trim();
  const normalizeCandidate = (value) => normalizeArg(value).replace(/^\\\\\\\\\\\\?\\\\/, "");

  const execPath = normalizeCandidate(process.execPath);
  const execPathLower = execPath.toLowerCase();
  const execBase = path.basename(execPath).toLowerCase();

  const isExecPath = (value) => {
    if (!value) return false;
    const normalized = normalizeCandidate(value);
    if (!normalized) return false;
    const lower = normalized.toLowerCase();
    return (
      lower === execPathLower ||
      path.basename(lower) === execBase ||
      lower.endsWith("\\node.exe") ||
      lower.endsWith("/node.exe") ||
      lower.includes("node.exe") ||
      (path.basename(lower) === "node.exe" && fs.existsSync(normalized))
    );
  };

  const filtered = argv.filter((arg, index) => index === 0 || !isExecPath(arg));
  if (filtered.length < 3) return filtered;

  const cleaned = [...filtered];
  if (isExecPath(cleaned[1])) cleaned.splice(1, 1);
  if (isExecPath(cleaned[2])) cleaned.splice(2, 1);
  return cleaned;
}

export function isCliMainModule() {
  return isMainModule({ currentFile: fileURLToPath(import.meta.url) });
}
