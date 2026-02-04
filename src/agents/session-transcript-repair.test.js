"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var session_transcript_repair_js_1 = require("./session-transcript-repair.js");
(0, vitest_1.describe)("sanitizeToolUseResultPairing", function () {
    (0, vitest_1.it)("moves tool results directly after tool calls and inserts missing results", function () {
        var _a, _b, _c, _d;
        var input = [
            {
                role: "assistant",
                content: [
                    { type: "toolCall", id: "call_1", name: "read", arguments: {} },
                    { type: "toolCall", id: "call_2", name: "exec", arguments: {} },
                ],
            },
            { role: "user", content: "user message that should come after tool use" },
            {
                role: "toolResult",
                toolCallId: "call_2",
                toolName: "exec",
                content: [{ type: "text", text: "ok" }],
                isError: false,
            },
        ];
        var out = (0, session_transcript_repair_js_1.sanitizeToolUseResultPairing)(input);
        (0, vitest_1.expect)((_a = out[0]) === null || _a === void 0 ? void 0 : _a.role).toBe("assistant");
        (0, vitest_1.expect)((_b = out[1]) === null || _b === void 0 ? void 0 : _b.role).toBe("toolResult");
        (0, vitest_1.expect)(out[1].toolCallId).toBe("call_1");
        (0, vitest_1.expect)((_c = out[2]) === null || _c === void 0 ? void 0 : _c.role).toBe("toolResult");
        (0, vitest_1.expect)(out[2].toolCallId).toBe("call_2");
        (0, vitest_1.expect)((_d = out[3]) === null || _d === void 0 ? void 0 : _d.role).toBe("user");
    });
    (0, vitest_1.it)("drops duplicate tool results for the same id within a span", function () {
        var input = [
            {
                role: "assistant",
                content: [{ type: "toolCall", id: "call_1", name: "read", arguments: {} }],
            },
            {
                role: "toolResult",
                toolCallId: "call_1",
                toolName: "read",
                content: [{ type: "text", text: "first" }],
                isError: false,
            },
            {
                role: "toolResult",
                toolCallId: "call_1",
                toolName: "read",
                content: [{ type: "text", text: "second" }],
                isError: false,
            },
            { role: "user", content: "ok" },
        ];
        var out = (0, session_transcript_repair_js_1.sanitizeToolUseResultPairing)(input);
        (0, vitest_1.expect)(out.filter(function (m) { return m.role === "toolResult"; })).toHaveLength(1);
    });
    (0, vitest_1.it)("drops duplicate tool results for the same id across the transcript", function () {
        var _a;
        var input = [
            {
                role: "assistant",
                content: [{ type: "toolCall", id: "call_1", name: "read", arguments: {} }],
            },
            {
                role: "toolResult",
                toolCallId: "call_1",
                toolName: "read",
                content: [{ type: "text", text: "first" }],
                isError: false,
            },
            { role: "assistant", content: [{ type: "text", text: "ok" }] },
            {
                role: "toolResult",
                toolCallId: "call_1",
                toolName: "read",
                content: [{ type: "text", text: "second (duplicate)" }],
                isError: false,
            },
        ];
        var out = (0, session_transcript_repair_js_1.sanitizeToolUseResultPairing)(input);
        var results = out.filter(function (m) { return m.role === "toolResult"; });
        (0, vitest_1.expect)(results).toHaveLength(1);
        (0, vitest_1.expect)((_a = results[0]) === null || _a === void 0 ? void 0 : _a.toolCallId).toBe("call_1");
    });
    (0, vitest_1.it)("drops orphan tool results that do not match any tool call", function () {
        var input = [
            { role: "user", content: "hello" },
            {
                role: "toolResult",
                toolCallId: "call_orphan",
                toolName: "read",
                content: [{ type: "text", text: "orphan" }],
                isError: false,
            },
            {
                role: "assistant",
                content: [{ type: "text", text: "ok" }],
            },
        ];
        var out = (0, session_transcript_repair_js_1.sanitizeToolUseResultPairing)(input);
        (0, vitest_1.expect)(out.some(function (m) { return m.role === "toolResult"; })).toBe(false);
        (0, vitest_1.expect)(out.map(function (m) { return m.role; })).toEqual(["user", "assistant"]);
    });
});
