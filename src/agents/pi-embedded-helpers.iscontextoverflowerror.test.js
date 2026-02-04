"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
(0, vitest_1.describe)("isContextOverflowError", function () {
    (0, vitest_1.it)("matches known overflow hints", function () {
        var samples = [
            "request_too_large",
            "Request exceeds the maximum size",
            "context length exceeded",
            "Maximum context length",
            "prompt is too long: 208423 tokens > 200000 maximum",
            "Context overflow: Summarization failed",
            "413 Request Entity Too Large",
        ];
        for (var _i = 0, samples_1 = samples; _i < samples_1.length; _i++) {
            var sample = samples_1[_i];
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isContextOverflowError)(sample)).toBe(true);
        }
    });
    (0, vitest_1.it)("matches Anthropic 'Request size exceeds model context window' error", function () {
        // Anthropic returns this error format when the prompt exceeds the context window.
        // Without this fix, auto-compaction is NOT triggered because neither
        // isContextOverflowError nor pi-ai's isContextOverflow recognizes this pattern.
        // The user sees: "LLM request rejected: Request size exceeds model context window"
        // instead of automatic compaction + retry.
        var anthropicRawError = '{"type":"error","error":{"type":"invalid_request_error","message":"Request size exceeds model context window"}}';
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isContextOverflowError)(anthropicRawError)).toBe(true);
    });
    (0, vitest_1.it)("matches 'exceeds model context window' in various formats", function () {
        var samples = [
            "Request size exceeds model context window",
            "request size exceeds model context window",
            '400 {"type":"error","error":{"type":"invalid_request_error","message":"Request size exceeds model context window"}}',
            "The request size exceeds model context window limit",
        ];
        for (var _i = 0, samples_2 = samples; _i < samples_2.length; _i++) {
            var sample = samples_2[_i];
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isContextOverflowError)(sample)).toBe(true);
        }
    });
    (0, vitest_1.it)("ignores unrelated errors", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isContextOverflowError)("rate limit exceeded")).toBe(false);
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isContextOverflowError)("request size exceeds upload limit")).toBe(false);
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isContextOverflowError)("model not found")).toBe(false);
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isContextOverflowError)("authentication failed")).toBe(false);
    });
});
