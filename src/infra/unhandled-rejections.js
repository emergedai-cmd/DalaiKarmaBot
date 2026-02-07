import process from "process";

/**
 * Install a deterministic handler for unhandled promise rejections.
 * ESM-only. No stdout noise.
 */
export function installUnhandledRejectionHandler() {
  if (process.__dkbUnhandledRejectionInstalled) return;
  process.__dkbUnhandledRejectionInstalled = true;

  process.on("unhandledRejection", () => {
    // Keep deterministic: just set exitCode. Do not print.
    process.exitCode = 1;
  });
}
