"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var vitest_1 = require("vitest");
var session_tool_result_guard_js_1 = require("./session-tool-result-guard.js");
var toolCallMessage = {
    role: "assistant",
    content: [{ type: "toolCall", id: "call_1", name: "read", arguments: {} }],
};
(0, vitest_1.describe)("installSessionToolResultGuard", function () {
    (0, vitest_1.it)("inserts synthetic toolResult before non-tool message when pending", function () {
        var _a, _b;
        var sm = pi_coding_agent_1.SessionManager.inMemory();
        (0, session_tool_result_guard_js_1.installSessionToolResultGuard)(sm);
        sm.appendMessage(toolCallMessage);
        sm.appendMessage({
            role: "assistant",
            content: [{ type: "text", text: "error" }],
            stopReason: "error",
        });
        var entries = sm
            .getEntries()
            .filter(function (e) { return e.type === "message"; })
            .map(function (e) { return e.message; });
        (0, vitest_1.expect)(entries.map(function (m) { return m.role; })).toEqual(["assistant", "toolResult", "assistant"]);
        var synthetic = entries[1];
        (0, vitest_1.expect)(synthetic.toolCallId).toBe("call_1");
        (0, vitest_1.expect)(synthetic.isError).toBe(true);
        (0, vitest_1.expect)((_b = (_a = synthetic.content) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text).toContain("missing tool result");
    });
    (0, vitest_1.it)("flushes pending tool calls when asked explicitly", function () {
        var sm = pi_coding_agent_1.SessionManager.inMemory();
        var guard = (0, session_tool_result_guard_js_1.installSessionToolResultGuard)(sm);
        sm.appendMessage(toolCallMessage);
        guard.flushPendingToolResults();
        var messages = sm
            .getEntries()
            .filter(function (e) { return e.type === "message"; })
            .map(function (e) { return e.message; });
        (0, vitest_1.expect)(messages.map(function (m) { return m.role; })).toEqual(["assistant", "toolResult"]);
    });
    (0, vitest_1.it)("does not add synthetic toolResult when a matching one exists", function () {
        var sm = pi_coding_agent_1.SessionManager.inMemory();
        (0, session_tool_result_guard_js_1.installSessionToolResultGuard)(sm);
        sm.appendMessage(toolCallMessage);
        sm.appendMessage({
            role: "toolResult",
            toolCallId: "call_1",
            content: [{ type: "text", text: "ok" }],
            isError: false,
        });
        var messages = sm
            .getEntries()
            .filter(function (e) { return e.type === "message"; })
            .map(function (e) { return e.message; });
        (0, vitest_1.expect)(messages.map(function (m) { return m.role; })).toEqual(["assistant", "toolResult"]);
    });
    (0, vitest_1.it)("preserves ordering with multiple tool calls and partial results", function () {
        var sm = pi_coding_agent_1.SessionManager.inMemory();
        var guard = (0, session_tool_result_guard_js_1.installSessionToolResultGuard)(sm);
        sm.appendMessage({
            role: "assistant",
            content: [
                { type: "toolCall", id: "call_a", name: "one", arguments: {} },
                { type: "toolUse", id: "call_b", name: "two", arguments: {} },
            ],
        });
        sm.appendMessage({
            role: "toolResult",
            toolUseId: "call_a",
            content: [{ type: "text", text: "a" }],
            isError: false,
        });
        sm.appendMessage({
            role: "assistant",
            content: [{ type: "text", text: "after tools" }],
        });
        var messages = sm
            .getEntries()
            .filter(function (e) { return e.type === "message"; })
            .map(function (e) { return e.message; });
        (0, vitest_1.expect)(messages.map(function (m) { return m.role; })).toEqual([
            "assistant", // tool calls
            "toolResult", // call_a real
            "toolResult", // synthetic for call_b
            "assistant", // text
        ]);
        (0, vitest_1.expect)(messages[2].toolCallId).toBe("call_b");
        (0, vitest_1.expect)(guard.getPendingIds()).toEqual([]);
    });
    (0, vitest_1.it)("flushes pending on guard when no toolResult arrived", function () {
        var sm = pi_coding_agent_1.SessionManager.inMemory();
        var guard = (0, session_tool_result_guard_js_1.installSessionToolResultGuard)(sm);
        sm.appendMessage(toolCallMessage);
        sm.appendMessage({
            role: "assistant",
            content: [{ type: "text", text: "hard error" }],
            stopReason: "error",
        });
        (0, vitest_1.expect)(guard.getPendingIds()).toEqual([]);
    });
    (0, vitest_1.it)("handles toolUseId on toolResult", function () {
        var sm = pi_coding_agent_1.SessionManager.inMemory();
        (0, session_tool_result_guard_js_1.installSessionToolResultGuard)(sm);
        sm.appendMessage({
            role: "assistant",
            content: [{ type: "toolUse", id: "use_1", name: "f", arguments: {} }],
        });
        sm.appendMessage({
            role: "toolResult",
            toolUseId: "use_1",
            content: [{ type: "text", text: "ok" }],
        });
        var messages = sm
            .getEntries()
            .filter(function (e) { return e.type === "message"; })
            .map(function (e) { return e.message; });
        (0, vitest_1.expect)(messages.map(function (m) { return m.role; })).toEqual(["assistant", "toolResult"]);
    });
});
