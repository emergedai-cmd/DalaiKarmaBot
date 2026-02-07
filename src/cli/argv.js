/**
 * CLI argv helpers (ESM-only).
 *
 * Deterministic. No side effects.
 */

export function getPrimaryCommand(argv) {
  // argv is like: ["node","bin", "run", ...] or already normalized
  // We search for the first non-flag token after the first 2 entries.
  for (let i = 2; i < argv.length; i++) {
    const t = argv[i];
    if (!t) continue;
    if (t === "--") return argv[i + 1] || "";
    if (t.startsWith("-")) continue;
    return t;
  }
  return "";
}

export function hasHelpOrVersion(argv) {
  return argv.includes("--help") || argv.includes("-h") || argv.includes("--version") || argv.includes("-V");
}
