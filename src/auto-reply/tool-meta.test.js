"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var tool_meta_js_1 = require("./tool-meta.js");
(0, vitest_1.describe)("tool meta formatting", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.unstubAllEnvs();
    });
    (0, vitest_1.it)("shortens paths under HOME", function () {
        vitest_1.vi.stubEnv("HOME", "/Users/test");
        (0, vitest_1.expect)((0, tool_meta_js_1.shortenPath)("/Users/test")).toBe("~");
        (0, vitest_1.expect)((0, tool_meta_js_1.shortenPath)("/Users/test/a/b.txt")).toBe("~/a/b.txt");
        (0, vitest_1.expect)((0, tool_meta_js_1.shortenPath)("/opt/x")).toBe("/opt/x");
    });
    (0, vitest_1.it)("shortens meta strings with optional colon suffix", function () {
        vitest_1.vi.stubEnv("HOME", "/Users/test");
        (0, vitest_1.expect)((0, tool_meta_js_1.shortenMeta)("/Users/test/a.txt")).toBe("~/a.txt");
        (0, vitest_1.expect)((0, tool_meta_js_1.shortenMeta)("/Users/test/a.txt:12")).toBe("~/a.txt:12");
        (0, vitest_1.expect)((0, tool_meta_js_1.shortenMeta)("cd /Users/test/dir && ls")).toBe("cd ~/dir && ls");
        (0, vitest_1.expect)((0, tool_meta_js_1.shortenMeta)("")).toBe("");
    });
    (0, vitest_1.it)("formats aggregates with grouping and brace-collapse", function () {
        vitest_1.vi.stubEnv("HOME", "/Users/test");
        var out = (0, tool_meta_js_1.formatToolAggregate)("  fs  ", [
            "/Users/test/dir/a.txt",
            "/Users/test/dir/b.txt",
            "note",
            "a→b",
        ]);
        (0, vitest_1.expect)(out).toMatch(/^🧩 Fs/);
        (0, vitest_1.expect)(out).toContain("~/dir/{a.txt, b.txt}");
        (0, vitest_1.expect)(out).toContain("note");
        (0, vitest_1.expect)(out).toContain("a→b");
    });
    (0, vitest_1.it)("wraps aggregate meta in backticks when markdown is enabled", function () {
        vitest_1.vi.stubEnv("HOME", "/Users/test");
        var out = (0, tool_meta_js_1.formatToolAggregate)("fs", ["/Users/test/dir/a.txt"], { markdown: true });
        (0, vitest_1.expect)(out).toContain("`~/dir/a.txt`");
    });
    (0, vitest_1.it)("keeps exec flags outside markdown and moves them to the front", function () {
        vitest_1.vi.stubEnv("HOME", "/Users/test");
        var out = (0, tool_meta_js_1.formatToolAggregate)("exec", ["cd /Users/test/dir && gemini 2>&1 · elevated"], {
            markdown: true,
        });
        (0, vitest_1.expect)(out).toBe("🛠️ Exec: elevated · `cd ~/dir && gemini 2>&1`");
    });
    (0, vitest_1.it)("formats prefixes with default labels", function () {
        vitest_1.vi.stubEnv("HOME", "/Users/test");
        (0, vitest_1.expect)((0, tool_meta_js_1.formatToolPrefix)(undefined, undefined)).toBe("🧩 Tool");
        (0, vitest_1.expect)((0, tool_meta_js_1.formatToolPrefix)("x", "/Users/test/a.txt")).toBe("🧩 X: ~/a.txt");
    });
});
