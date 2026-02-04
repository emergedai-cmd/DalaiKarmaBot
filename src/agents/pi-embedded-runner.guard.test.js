"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var vitest_1 = require("vitest");
var session_tool_result_guard_wrapper_js_1 = require("./session-tool-result-guard-wrapper.js");
var session_transcript_repair_js_1 = require("./session-transcript-repair.js");
function assistantToolCall(id) {
    return {
        role: "assistant",
        content: [{ type: "toolCall", id: id, name: "n", arguments: {} }],
    };
}
(0, vitest_1.describe)("guardSessionManager integration", function () {
    (0, vitest_1.it)("persists synthetic toolResult before subsequent assistant message", function () {
        var sm = (0, session_tool_result_guard_wrapper_js_1.guardSessionManager)(pi_coding_agent_1.SessionManager.inMemory());
        sm.appendMessage(assistantToolCall("call_1"));
        sm.appendMessage({
            role: "assistant",
            content: [{ type: "text", text: "followup" }],
        });
        var messages = sm
            .getEntries()
            .filter(function (e) { return e.type === "message"; })
            .map(function (e) { return e.message; });
        (0, vitest_1.expect)(messages.map(function (m) { return m.role; })).toEqual(["assistant", "toolResult", "assistant"]);
        (0, vitest_1.expect)(messages[1].toolCallId).toBe("call_1");
        (0, vitest_1.expect)((0, session_transcript_repair_js_1.sanitizeToolUseResultPairing)(messages).map(function (m) { return m.role; })).toEqual([
            "assistant",
            "toolResult",
            "assistant",
        ]);
    });
});
