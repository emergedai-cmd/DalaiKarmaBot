/**
 * DalaiKarmaBot test setup (minimal, ESM-safe).
 *
 * IMPORTANT:
 * Do NOT import src/infra/warnings.js here — it is legacy CommonJS and can break under
 * type:"module" in Vitest transforms (missing commonjsHelpers.js).
 *
 * Keep this file boring: only stable, deterministic setup.
 */
import { beforeAll } from "vitest";

beforeAll(() => {
  // Ensure tests never accidentally perform network I/O by default.
  // If a test needs network, it must opt-in explicitly.
  process.env.DKB_TEST_MODE = "1";
});
