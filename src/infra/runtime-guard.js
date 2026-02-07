import process from "process";

/**
 * Runtime guard (ESM-only, deterministic).
 *
 * For unit tests, we keep this side-effect free and throw a normal Error when
 * unsupported. The CLI entrypoint can decide how to format/output.
 */

function getNodeMajor(version) {
  if (typeof version !== "string") return 0;
  const m = version.match(/(\d+)\./);
  if (!m) return 0;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : 0;
}

export function assertSupportedRuntime() {
  const major = getNodeMajor(process.version);
  // Keep conservative default. (You can raise this later without changing API.)
  if (major < 18) {
    throw new Error(`Unsupported Node.js version ${process.version}. DalaiKarmaBot requires Node.js >= 18.`);
  }
}
