"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var format_1 = require("./format");
(0, vitest_1.describe)("stripThinkingTags", function () {
    (0, vitest_1.it)("strips <think>…</think> segments", function () {
        var input = ["<think>", "secret", "</think>", "", "Hello"].join("\n");
        (0, vitest_1.expect)((0, format_1.stripThinkingTags)(input)).toBe("Hello");
    });
    (0, vitest_1.it)("strips <thinking>…</thinking> segments", function () {
        var input = ["<thinking>", "secret", "</thinking>", "", "Hello"].join("\n");
        (0, vitest_1.expect)((0, format_1.stripThinkingTags)(input)).toBe("Hello");
    });
    (0, vitest_1.it)("keeps text when tags are unpaired", function () {
        (0, vitest_1.expect)((0, format_1.stripThinkingTags)("<think>\nsecret\nHello")).toBe("secret\nHello");
        (0, vitest_1.expect)((0, format_1.stripThinkingTags)("Hello\n</think>")).toBe("Hello\n");
    });
    (0, vitest_1.it)("returns original text when no tags exist", function () {
        (0, vitest_1.expect)((0, format_1.stripThinkingTags)("Hello")).toBe("Hello");
    });
    (0, vitest_1.it)("strips <final>…</final> segments", function () {
        var input = "<final>\n\nHello there\n\n</final>";
        (0, vitest_1.expect)((0, format_1.stripThinkingTags)(input)).toBe("Hello there\n\n");
    });
    (0, vitest_1.it)("strips mixed <think> and <final> tags", function () {
        var input = "<think>reasoning</think>\n\n<final>Hello</final>";
        (0, vitest_1.expect)((0, format_1.stripThinkingTags)(input)).toBe("Hello");
    });
    (0, vitest_1.it)("handles incomplete <final tag gracefully", function () {
        // When streaming splits mid-tag, we may see "<final" without closing ">"
        // This should not crash and should handle gracefully
        (0, vitest_1.expect)((0, format_1.stripThinkingTags)("<final\nHello")).toBe("<final\nHello");
        (0, vitest_1.expect)((0, format_1.stripThinkingTags)("Hello</final>")).toBe("Hello");
    });
});
