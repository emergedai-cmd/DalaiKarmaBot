"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var tui_formatters_js_1 = require("./tui-formatters.js");
(0, vitest_1.describe)("extractTextFromMessage", function () {
    (0, vitest_1.it)("renders errorMessage when assistant content is empty", function () {
        var text = (0, tui_formatters_js_1.extractTextFromMessage)({
            role: "assistant",
            content: [],
            stopReason: "error",
            errorMessage: '429 {"type":"error","error":{"type":"rate_limit_error","message":"This request would exceed your account\\u0027s rate limit. Please try again later."},"request_id":"req_123"}',
        });
        (0, vitest_1.expect)(text).toContain("HTTP 429");
        (0, vitest_1.expect)(text).toContain("rate_limit_error");
        (0, vitest_1.expect)(text).toContain("req_123");
    });
    (0, vitest_1.it)("falls back to a generic message when errorMessage is missing", function () {
        var text = (0, tui_formatters_js_1.extractTextFromMessage)({
            role: "assistant",
            content: [],
            stopReason: "error",
            errorMessage: "",
        });
        (0, vitest_1.expect)(text).toContain("unknown error");
    });
    (0, vitest_1.it)("joins multiple text blocks with single newlines", function () {
        var text = (0, tui_formatters_js_1.extractTextFromMessage)({
            role: "assistant",
            content: [
                { type: "text", text: "first" },
                { type: "text", text: "second" },
            ],
        });
        (0, vitest_1.expect)(text).toBe("first\nsecond");
    });
    (0, vitest_1.it)("places thinking before content when included", function () {
        var text = (0, tui_formatters_js_1.extractTextFromMessage)({
            role: "assistant",
            content: [
                { type: "text", text: "hello" },
                { type: "thinking", thinking: "ponder" },
            ],
        }, { includeThinking: true });
        (0, vitest_1.expect)(text).toBe("[thinking]\nponder\n\nhello");
    });
});
(0, vitest_1.describe)("extractThinkingFromMessage", function () {
    (0, vitest_1.it)("collects only thinking blocks", function () {
        var text = (0, tui_formatters_js_1.extractThinkingFromMessage)({
            role: "assistant",
            content: [
                { type: "thinking", thinking: "alpha" },
                { type: "text", text: "hello" },
                { type: "thinking", thinking: "beta" },
            ],
        });
        (0, vitest_1.expect)(text).toBe("alpha\nbeta");
    });
});
(0, vitest_1.describe)("extractContentFromMessage", function () {
    (0, vitest_1.it)("collects only text blocks", function () {
        var text = (0, tui_formatters_js_1.extractContentFromMessage)({
            role: "assistant",
            content: [
                { type: "thinking", thinking: "alpha" },
                { type: "text", text: "hello" },
            ],
        });
        (0, vitest_1.expect)(text).toBe("hello");
    });
    (0, vitest_1.it)("renders error text when stopReason is error and content is not an array", function () {
        var text = (0, tui_formatters_js_1.extractContentFromMessage)({
            role: "assistant",
            stopReason: "error",
            errorMessage: '429 {"error":{"message":"rate limit"}}',
        });
        (0, vitest_1.expect)(text).toContain("HTTP 429");
    });
});
(0, vitest_1.describe)("isCommandMessage", function () {
    (0, vitest_1.it)("detects command-marked messages", function () {
        (0, vitest_1.expect)((0, tui_formatters_js_1.isCommandMessage)({ command: true })).toBe(true);
        (0, vitest_1.expect)((0, tui_formatters_js_1.isCommandMessage)({ command: false })).toBe(false);
        (0, vitest_1.expect)((0, tui_formatters_js_1.isCommandMessage)({})).toBe(false);
    });
});
