"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var message_normalizer_1 = require("./message-normalizer");
(0, vitest_1.describe)("message-normalizer", function () {
    (0, vitest_1.describe)("normalizeMessage", function () {
        (0, vitest_1.beforeEach)(function () {
            vitest_1.vi.useFakeTimers();
            vitest_1.vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
        });
        (0, vitest_1.afterEach)(function () {
            vitest_1.vi.useRealTimers();
        });
        (0, vitest_1.it)("normalizes message with string content", function () {
            var result = (0, message_normalizer_1.normalizeMessage)({
                role: "user",
                content: "Hello world",
                timestamp: 1000,
                id: "msg-1",
            });
            (0, vitest_1.expect)(result).toEqual({
                role: "user",
                content: [{ type: "text", text: "Hello world" }],
                timestamp: 1000,
                id: "msg-1",
            });
        });
        (0, vitest_1.it)("normalizes message with array content", function () {
            var result = (0, message_normalizer_1.normalizeMessage)({
                role: "assistant",
                content: [
                    { type: "text", text: "Here is the result" },
                    { type: "tool_use", name: "bash", args: { command: "ls" } },
                ],
                timestamp: 2000,
            });
            (0, vitest_1.expect)(result.role).toBe("assistant");
            (0, vitest_1.expect)(result.content).toHaveLength(2);
            (0, vitest_1.expect)(result.content[0]).toEqual({
                type: "text",
                text: "Here is the result",
                name: undefined,
                args: undefined,
            });
            (0, vitest_1.expect)(result.content[1]).toEqual({
                type: "tool_use",
                text: undefined,
                name: "bash",
                args: { command: "ls" },
            });
        });
        (0, vitest_1.it)("normalizes message with text field (alternative format)", function () {
            var result = (0, message_normalizer_1.normalizeMessage)({
                role: "user",
                text: "Alternative format",
            });
            (0, vitest_1.expect)(result.content).toEqual([{ type: "text", text: "Alternative format" }]);
        });
        (0, vitest_1.it)("detects tool result by toolCallId", function () {
            var result = (0, message_normalizer_1.normalizeMessage)({
                role: "assistant",
                toolCallId: "call-123",
                content: "Tool output",
            });
            (0, vitest_1.expect)(result.role).toBe("toolResult");
        });
        (0, vitest_1.it)("detects tool result by tool_call_id (snake_case)", function () {
            var result = (0, message_normalizer_1.normalizeMessage)({
                role: "assistant",
                tool_call_id: "call-456",
                content: "Tool output",
            });
            (0, vitest_1.expect)(result.role).toBe("toolResult");
        });
        (0, vitest_1.it)("handles missing role", function () {
            var result = (0, message_normalizer_1.normalizeMessage)({ content: "No role" });
            (0, vitest_1.expect)(result.role).toBe("unknown");
        });
        (0, vitest_1.it)("handles missing content", function () {
            var result = (0, message_normalizer_1.normalizeMessage)({ role: "user" });
            (0, vitest_1.expect)(result.content).toEqual([]);
        });
        (0, vitest_1.it)("uses current timestamp when not provided", function () {
            var result = (0, message_normalizer_1.normalizeMessage)({ role: "user", content: "Test" });
            (0, vitest_1.expect)(result.timestamp).toBe(Date.now());
        });
        (0, vitest_1.it)("handles arguments field (alternative to args)", function () {
            var result = (0, message_normalizer_1.normalizeMessage)({
                role: "assistant",
                content: [{ type: "tool_use", name: "test", arguments: { foo: "bar" } }],
            });
            (0, vitest_1.expect)(result.content[0].args).toEqual({ foo: "bar" });
        });
    });
    (0, vitest_1.describe)("normalizeRoleForGrouping", function () {
        (0, vitest_1.it)("returns tool for toolresult", function () {
            (0, vitest_1.expect)((0, message_normalizer_1.normalizeRoleForGrouping)("toolresult")).toBe("tool");
            (0, vitest_1.expect)((0, message_normalizer_1.normalizeRoleForGrouping)("toolResult")).toBe("tool");
            (0, vitest_1.expect)((0, message_normalizer_1.normalizeRoleForGrouping)("TOOLRESULT")).toBe("tool");
        });
        (0, vitest_1.it)("returns tool for tool_result", function () {
            (0, vitest_1.expect)((0, message_normalizer_1.normalizeRoleForGrouping)("tool_result")).toBe("tool");
            (0, vitest_1.expect)((0, message_normalizer_1.normalizeRoleForGrouping)("TOOL_RESULT")).toBe("tool");
        });
        (0, vitest_1.it)("returns tool for tool", function () {
            (0, vitest_1.expect)((0, message_normalizer_1.normalizeRoleForGrouping)("tool")).toBe("tool");
            (0, vitest_1.expect)((0, message_normalizer_1.normalizeRoleForGrouping)("Tool")).toBe("tool");
        });
        (0, vitest_1.it)("returns tool for function", function () {
            (0, vitest_1.expect)((0, message_normalizer_1.normalizeRoleForGrouping)("function")).toBe("tool");
            (0, vitest_1.expect)((0, message_normalizer_1.normalizeRoleForGrouping)("Function")).toBe("tool");
        });
        (0, vitest_1.it)("preserves user role", function () {
            (0, vitest_1.expect)((0, message_normalizer_1.normalizeRoleForGrouping)("user")).toBe("user");
            (0, vitest_1.expect)((0, message_normalizer_1.normalizeRoleForGrouping)("User")).toBe("User");
        });
        (0, vitest_1.it)("preserves assistant role", function () {
            (0, vitest_1.expect)((0, message_normalizer_1.normalizeRoleForGrouping)("assistant")).toBe("assistant");
        });
        (0, vitest_1.it)("preserves system role", function () {
            (0, vitest_1.expect)((0, message_normalizer_1.normalizeRoleForGrouping)("system")).toBe("system");
        });
    });
    (0, vitest_1.describe)("isToolResultMessage", function () {
        (0, vitest_1.it)("returns true for toolresult role", function () {
            (0, vitest_1.expect)((0, message_normalizer_1.isToolResultMessage)({ role: "toolresult" })).toBe(true);
            (0, vitest_1.expect)((0, message_normalizer_1.isToolResultMessage)({ role: "toolResult" })).toBe(true);
            (0, vitest_1.expect)((0, message_normalizer_1.isToolResultMessage)({ role: "TOOLRESULT" })).toBe(true);
        });
        (0, vitest_1.it)("returns true for tool_result role", function () {
            (0, vitest_1.expect)((0, message_normalizer_1.isToolResultMessage)({ role: "tool_result" })).toBe(true);
            (0, vitest_1.expect)((0, message_normalizer_1.isToolResultMessage)({ role: "TOOL_RESULT" })).toBe(true);
        });
        (0, vitest_1.it)("returns false for other roles", function () {
            (0, vitest_1.expect)((0, message_normalizer_1.isToolResultMessage)({ role: "user" })).toBe(false);
            (0, vitest_1.expect)((0, message_normalizer_1.isToolResultMessage)({ role: "assistant" })).toBe(false);
            (0, vitest_1.expect)((0, message_normalizer_1.isToolResultMessage)({ role: "tool" })).toBe(false);
        });
        (0, vitest_1.it)("returns false for missing role", function () {
            (0, vitest_1.expect)((0, message_normalizer_1.isToolResultMessage)({})).toBe(false);
            (0, vitest_1.expect)((0, message_normalizer_1.isToolResultMessage)({ content: "test" })).toBe(false);
        });
        (0, vitest_1.it)("returns false for non-string role", function () {
            (0, vitest_1.expect)((0, message_normalizer_1.isToolResultMessage)({ role: 123 })).toBe(false);
            (0, vitest_1.expect)((0, message_normalizer_1.isToolResultMessage)({ role: null })).toBe(false);
        });
    });
});
