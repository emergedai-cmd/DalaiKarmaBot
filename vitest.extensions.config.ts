import base from "./vitest.config";
import { defineConfig } from "vitest/config";

/**
 * Extensions test config (minimal + robust).
 *
 * We intentionally avoid base setupFiles here because the upstream OpenClaw test setup
 * pulls in legacy CommonJS modules (src/infra/warnings.js) which can break under
 * a type:"module" repo depending on transform order.
 *
 * Extensions tests should be self-contained; if a specific extension needs setup,
 * it should declare it in its own tests.
 */
export default defineConfig({
  // @ts-expect-error vitest config typing for default import
  ...base,
  test: {
    // @ts-expect-error vitest config typing for default import
    ...(base as any).test,
    include: ["extensions/**/*.test.ts"],
    passWithNoTests: true,
    // Critical: do not load global setup that imports legacy CJS.
    setupFiles: [],
  },
});
