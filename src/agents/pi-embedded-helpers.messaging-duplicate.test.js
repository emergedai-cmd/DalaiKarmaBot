"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
(0, vitest_1.describe)("normalizeTextForComparison", function () {
    (0, vitest_1.it)("lowercases text", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.normalizeTextForComparison)("Hello World")).toBe("hello world");
    });
    (0, vitest_1.it)("trims whitespace", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.normalizeTextForComparison)("  hello  ")).toBe("hello");
    });
    (0, vitest_1.it)("collapses multiple spaces", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.normalizeTextForComparison)("hello    world")).toBe("hello world");
    });
    (0, vitest_1.it)("strips emoji", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.normalizeTextForComparison)("Hello 👋 World 🌍")).toBe("hello world");
    });
    (0, vitest_1.it)("handles mixed normalization", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.normalizeTextForComparison)("  Hello 👋   WORLD  🌍  ")).toBe("hello world");
    });
});
(0, vitest_1.describe)("isMessagingToolDuplicate", function () {
    (0, vitest_1.it)("returns false for empty sentTexts", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isMessagingToolDuplicate)("hello world", [])).toBe(false);
    });
    (0, vitest_1.it)("returns false for short texts", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isMessagingToolDuplicate)("short", ["short"])).toBe(false);
    });
    (0, vitest_1.it)("detects exact duplicates", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isMessagingToolDuplicate)("Hello, this is a test message!", [
            "Hello, this is a test message!",
        ])).toBe(true);
    });
    (0, vitest_1.it)("detects duplicates with different casing", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isMessagingToolDuplicate)("HELLO, THIS IS A TEST MESSAGE!", [
            "hello, this is a test message!",
        ])).toBe(true);
    });
    (0, vitest_1.it)("detects duplicates with emoji variations", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isMessagingToolDuplicate)("Hello! 👋 This is a test message!", [
            "Hello! This is a test message!",
        ])).toBe(true);
    });
    (0, vitest_1.it)("detects substring duplicates (LLM elaboration)", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isMessagingToolDuplicate)('I sent the message: "Hello, this is a test message!"', [
            "Hello, this is a test message!",
        ])).toBe(true);
    });
    (0, vitest_1.it)("detects when sent text contains block reply (reverse substring)", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isMessagingToolDuplicate)("Hello, this is a test message!", [
            'I sent the message: "Hello, this is a test message!"',
        ])).toBe(true);
    });
    (0, vitest_1.it)("returns false for non-matching texts", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isMessagingToolDuplicate)("This is completely different content.", [
            "Hello, this is a test message!",
        ])).toBe(false);
    });
});
