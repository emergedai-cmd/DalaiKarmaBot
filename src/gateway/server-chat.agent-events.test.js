"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var server_chat_js_1 = require("./server-chat.js");
(0, vitest_1.describe)("agent event handler", function () {
    (0, vitest_1.it)("emits chat delta for assistant text-only events", function () {
        var _a, _b, _c, _d;
        var nowSpy = vitest_1.vi.spyOn(Date, "now").mockReturnValue(1000);
        var broadcast = vitest_1.vi.fn();
        var nodeSendToSession = vitest_1.vi.fn();
        var agentRunSeq = new Map();
        var chatRunState = (0, server_chat_js_1.createChatRunState)();
        chatRunState.registry.add("run-1", { sessionKey: "session-1", clientRunId: "client-1" });
        var handler = (0, server_chat_js_1.createAgentEventHandler)({
            broadcast: broadcast,
            nodeSendToSession: nodeSendToSession,
            agentRunSeq: agentRunSeq,
            chatRunState: chatRunState,
            resolveSessionKeyForRun: function () { return undefined; },
            clearAgentRunContext: vitest_1.vi.fn(),
        });
        handler({
            runId: "run-1",
            seq: 1,
            stream: "assistant",
            ts: Date.now(),
            data: { text: "Hello world" },
        });
        var chatCalls = broadcast.mock.calls.filter(function (_a) {
            var event = _a[0];
            return event === "chat";
        });
        (0, vitest_1.expect)(chatCalls).toHaveLength(1);
        var payload = (_a = chatCalls[0]) === null || _a === void 0 ? void 0 : _a[1];
        (0, vitest_1.expect)(payload.state).toBe("delta");
        (0, vitest_1.expect)((_d = (_c = (_b = payload.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.text).toBe("Hello world");
        var sessionChatCalls = nodeSendToSession.mock.calls.filter(function (_a) {
            var event = _a[1];
            return event === "chat";
        });
        (0, vitest_1.expect)(sessionChatCalls).toHaveLength(1);
        nowSpy.mockRestore();
    });
});
