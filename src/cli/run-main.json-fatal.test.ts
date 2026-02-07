import { describe, expect, it, vi } from "vitest";
import { __test__emitFatalJson } from "./run-main.js";

describe("run-main JSON fatal emitter", () => {
  it("emits a single-line JSON object without prefixes", () => {
    const writes: string[] = [];
    const spy = vi.spyOn(process.stdout, "write").mockImplementation(((chunk: any) => {
      writes.push(String(chunk));
      return true;
    }) as any);

    __test__emitFatalJson("CLI_FAILED", new Error("boom"));

    spy.mockRestore();

    expect(writes.length).toBe(1);
    const line = writes[0];

    // Must end with newline, and be valid JSON.
    expect(line.endsWith("\n")).toBe(true);

    const parsed = JSON.parse(line);
    expect(parsed).toMatchObject({
      ok: false,
      error: {
        kind: "cli",
        code: "CLI_FAILED",
      },
    });

    // No prefix noise, JSON starts immediately.
    expect(line.startsWith("{")).toBe(true);
  });
});
