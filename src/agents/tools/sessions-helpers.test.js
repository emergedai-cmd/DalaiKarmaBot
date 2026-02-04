"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var sessions_helpers_js_1 = require("./sessions-helpers.js");
(0, vitest_1.describe)("sanitizeTextContent", function () {
    (0, vitest_1.it)("strips minimax tool call XML and downgraded markers", function () {
        var input = 'Hello <invoke name="tool">payload</invoke></minimax:tool_call> ' +
            "[Tool Call: foo (ID: 1)] world";
        var result = (0, sessions_helpers_js_1.sanitizeTextContent)(input).trim();
        (0, vitest_1.expect)(result).toBe("Hello  world");
        (0, vitest_1.expect)(result).not.toContain("invoke");
        (0, vitest_1.expect)(result).not.toContain("Tool Call");
    });
    (0, vitest_1.it)("strips thinking tags", function () {
        var input = "Before <think>secret</think> after";
        var result = (0, sessions_helpers_js_1.sanitizeTextContent)(input).trim();
        (0, vitest_1.expect)(result).toBe("Before  after");
    });
});
(0, vitest_1.describe)("extractAssistantText", function () {
    (0, vitest_1.it)("sanitizes blocks without injecting newlines", function () {
        var message = {
            role: "assistant",
            content: [
                { type: "text", text: "Hi " },
                { type: "text", text: "<think>secret</think>there" },
            ],
        };
        (0, vitest_1.expect)((0, sessions_helpers_js_1.extractAssistantText)(message)).toBe("Hi there");
    });
});
