import base from "./vitest.config";
import { defineConfig } from "vitest/config";
import commonjs from "@rollup/plugin-commonjs";

/**
 * DalaiKarmaBot-focused test config (v2).
 *
 * This fork is a security-first CLI. Upstream OpenClaw includes many test suites
 * for features we are intentionally NOT shipping (browser extension installer, pairing,
 * daemon, exec approvals, etc.).
 *
 * This config runs ONLY the CLI tests that correspond to DalaiKarmaBot's shipped surface:
 *   - init / where / explain / doctor / run (and run-main JSON contract)
 *
 * Keep it boring and deterministic.
 */
export default defineConfig({
  // Bring in shared defaults…
  // @ts-expect-error vitest config typing for default import
  ...base,

  // …but DO NOT inherit a plugin chain that tries to treat our ESM source as CJS.
  // Restrict CommonJS conversion to dependencies only.
  plugins: [
    commonjs({
      include: [/node_modules/],
    }),
  ],

  // Ensure transforms target Node (CLI), not browser.
  esbuild: {
    target: "node18",
  },

  test: {
    // @ts-expect-error vitest config typing for default import
    ...(base as any).test,

    environment: "node",

    // Minimal, ESM-safe setup (no legacy CJS imports).
    setupFiles: ["test.dkb-setup.ts"],

    // ONLY run DalaiKarmaBot CLI tests.
    include: [
      "src/cli/init*.test.ts",
      "src/cli/where*.test.ts",
      "src/cli/explain*.test.ts",
      "src/cli/doctor*.test.ts",
      "src/cli/run-main*.test.ts",
      // Optional: add run-cli tests if/when they exist
      "src/cli/run-cli*.test.ts",
      "test/format-error.test.ts",
    ],

    // Do not fail if a file registers 0 tests (some are env-gated).
    passWithNoTests: true,

    // Extra guard: never accidentally include upstream-only suites.
    exclude: [
      "**/node_modules/**",
      "dist/**",
      "extensions/**",
      // Explicitly exclude upstream CLI suites not shipped in this fork:
      "src/cli/browser-*.test.ts",
      "src/cli/pairing-*.test.ts",
      "src/cli/daemon-*.test.ts",
      "src/cli/models-*.test.ts",
      "src/cli/exec-approvals-*.test.ts",
      "src/cli/nodes-*.test.ts",
      "src/cli/logs-*.test.ts",
      "src/cli/skills-*.test.ts",
      "src/cli/update-*.test.ts",
      "src/cli/wait*.test.ts",
      "src/cli/program/register.subclis.test.ts",
      // Prompt tests are upstream-specific and currently depend on the full runtime container.
      "src/cli/prompt.test.ts",
    ],
  },
});
