import path from "path";
import process from "process";

/**
 * ESM-safe replacement for CommonJS `require.main === module`.
 *
 * Deterministic. No stdout/stderr.
 */
export function isMainModule(opts) {
  try {
    const currentFile = typeof opts?.currentFile === "string" ? opts.currentFile : "";
    const entry = process.argv[1] ? path.resolve(process.argv[1]) : "";
    const cur = currentFile ? path.resolve(currentFile) : "";
    return Boolean(entry && cur) && entry === cur;
  } catch {
    return false;
  }
}

export default isMainModule;
