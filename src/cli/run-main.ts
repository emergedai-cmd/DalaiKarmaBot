import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import { isMainModule } from "../infra/is-main.js";

// ---------------------------------------------------------------------------
// JSON fatal emitter (audit-first, deterministic)
//
// This exists primarily to support --json strict mode and CI-enforced tests.
// Requirements:
// - exactly one line of JSON
// - no prefixes or extra stdout noise
// - deterministic schema (no timestamps / random ids)
// - no side effects beyond stdout.write
// ---------------------------------------------------------------------------

type FatalJsonPayload = {
  ok: false;
  kind: string;
  error: {
    code: string;
    kind: "cli";
    name: string;
    message: string;
  };
};

function toErrorShape(err: unknown): { name: string; message: string } {
  if (err instanceof Error) {
    return { name: err.name || "Error", message: err.message || "" };
  }
  return { name: "Error", message: String(err ?? "") };
}

function emitFatalJson(kind: string, err: unknown): FatalJsonPayload {
  const { name, message } = toErrorShape(err);
  const payload: FatalJsonPayload = {
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
  process.stdout.write(JSON.stringify(payload) + "
");
  return payload;
}

// Test-only hook: required by src/cli/run-main.json-fatal.test.ts
export function __test_emitFatalJson(kind: string, err: unknown) {
  return emitFatalJson(kind, err);
}

// Back-compat alias expected by tests.
export { __test_emitFatalJson as __test__emitFatalJson };

// Alias for older test naming (double underscore after "test")

/**
 * DalaiKarmaBot CLI entrypoint (ESM-safe, test-friendly).
 *
 * SECURITY / DETERMINISM:
 * - Avoid side effects at module import time.
 * - Defer all non-trivial imports until runCli() is called.
 * - This prevents test harness failures caused by upstream global singletons/containers.
 */

export function rewriteUpdateFlagArgv(argv: string[]): string[] {
  const index = argv.indexOf("--update");
  if (index === -1) return argv;
  const next = [...argv];
  next.splice(index, 1, "update");
  return next;
}

/**
 * Main CLI runner.
 * NOTE: all heavy imports are inside this function by design.
 */
export async function runCli(argv: string[] = process.argv) {
  const normalizedArgv = stripWindowsNodeExec(argv);

  const { loadDotEnv } = await import("../infra/dotenv.js");
  const { normalizeEnv } = await import("../infra/env.js");
  const { ensureOpenClawCliOnPath } = await import("../infra/path-env.js");
  const { assertSupportedRuntime } = await import("../infra/runtime-guard.js");
  const { installUnhandledRejectionHandler } = await import("../infra/unhandled-rejections.js");
  const { formatUncaughtError } = await import("../infra/errors.js");
  const { enableConsoleCapture } = await import("../logging.js");
  const { getPrimaryCommand, hasHelpOrVersion } = await import("./argv.js");

  // IMPORTANT: route.js may pull in upstream container wiring in some builds.
  // Keep it lazy so importing this module in tests stays side-effect free.
  const { tryRouteCli } = await import("./route.js");

  loadDotEnv({ quiet: true });
  normalizeEnv();
  ensureOpenClawCliOnPath();

  // Enforce the minimum supported runtime before doing any work.
  assertSupportedRuntime();

  if (await tryRouteCli(normalizedArgv)) {
    return;
  }

  // Capture all console output into structured logs while keeping stdout/stderr behavior.
  enableConsoleCapture();

  const { buildProgram } = await import("./program.js");
  const program = buildProgram();

  // Global error handlers to prevent silent crashes from unhandled rejections/exceptions.
  installUnhandledRejectionHandler();

  process.on("uncaughtException", (error) => {
    console.error("[dalaikarmabot] Uncaught exception:", formatUncaughtError(error));
    process.exit(1);
  });

  const parseArgv = rewriteUpdateFlagArgv(normalizedArgv);

  // Register the primary subcommand if one exists (for lazy-loading)
  const primary = getPrimaryCommand(parseArgv);
  if (primary) {
    const { registerSubCliByName } = await import("./program/register.subclis.js");
    await registerSubCliByName(program, primary);
  }

  const shouldSkipPluginRegistration = !primary && hasHelpOrVersion(parseArgv);
  if (!shouldSkipPluginRegistration) {
    // Register plugin CLI commands before parsing
    const { registerPluginCliCommands } = await import("../plugins/cli.js");
    const { loadConfig } = await import("../config/config.js");
    registerPluginCliCommands(program, loadConfig());
  }

  await program.parseAsync(parseArgv);
}

/**
 * Windows-only argv cleanup for weird execPath artifacts.
 */
function stripWindowsNodeExec(argv: string[]): string[] {
  if (process.platform !== "win32") return argv;

  const stripControlChars = (value: string): string => {
    let out = "";
    for (let i = 0; i < value.length; i += 1) {
      const code = value.charCodeAt(i);
      if (code >= 32 && code !== 127) out += value[i];
    }
    return out;
  };

  const normalizeArg = (value: string): string =>
    stripControlChars(value).replace(/^['"]+|['"]+$/g, "").trim();

  const normalizeCandidate = (value: string): string =>
    normalizeArg(value).replace(/^\\\?\/, "");

  const execPath = normalizeCandidate(process.execPath);
  const execPathLower = execPath.toLowerCase();
  const execBase = path.basename(execPath).toLowerCase();

  const isExecPath = (value: string | undefined): boolean => {
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

export function isCliMainModule(): boolean {
  return isMainModule({ currentFile: fileURLToPath(import.meta.url) });
}
