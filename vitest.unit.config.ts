import base from "./vitest.config";
import { defineConfig } from "vitest/config";

/**
 * Unit test config (keeps base setupFiles by default).
 * If you still hit CJS/ESM issues due to setup, set setupFiles: [] here too.
 */
export default defineConfig({
  // @ts-expect-error vitest config typing for default import
  ...base,
  test: {
    // @ts-expect-error vitest config typing for default import
    ...(base as any).test,
    include: ["src/**/*.test.ts", "test/format-error.test.ts"],
    passWithNoTests: true,
  },
});
