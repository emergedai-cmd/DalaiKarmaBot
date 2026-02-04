"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var chat_1 = require("./chat");
function createState(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ client: null, connected: true, sessionKey: "main", chatLoading: false, chatMessages: [], chatThinkingLevel: null, chatSending: false, chatMessage: "", chatRunId: null, chatStream: null, chatStreamStartedAt: null, lastError: null }, overrides);
}
(0, vitest_1.describe)("handleChatEvent", function () {
    (0, vitest_1.it)("returns null when payload is missing", function () {
        var state = createState();
        (0, vitest_1.expect)((0, chat_1.handleChatEvent)(state, undefined)).toBe(null);
    });
    (0, vitest_1.it)("returns null when sessionKey does not match", function () {
        var state = createState({ sessionKey: "main" });
        var payload = {
            runId: "run-1",
            sessionKey: "other",
            state: "final",
        };
        (0, vitest_1.expect)((0, chat_1.handleChatEvent)(state, payload)).toBe(null);
    });
    (0, vitest_1.it)("returns null for delta from another run", function () {
        var state = createState({
            sessionKey: "main",
            chatRunId: "run-user",
            chatStream: "Hello",
        });
        var payload = {
            runId: "run-announce",
            sessionKey: "main",
            state: "delta",
            message: { role: "assistant", content: [{ type: "text", text: "Done" }] },
        };
        (0, vitest_1.expect)((0, chat_1.handleChatEvent)(state, payload)).toBe(null);
        (0, vitest_1.expect)(state.chatRunId).toBe("run-user");
        (0, vitest_1.expect)(state.chatStream).toBe("Hello");
    });
    (0, vitest_1.it)("returns 'final' for final from another run (e.g. sub-agent announce) without clearing state", function () {
        var state = createState({
            sessionKey: "main",
            chatRunId: "run-user",
            chatStream: "Working...",
            chatStreamStartedAt: 123,
        });
        var payload = {
            runId: "run-announce",
            sessionKey: "main",
            state: "final",
            message: {
                role: "assistant",
                content: [{ type: "text", text: "Sub-agent findings" }],
            },
        };
        (0, vitest_1.expect)((0, chat_1.handleChatEvent)(state, payload)).toBe("final");
        (0, vitest_1.expect)(state.chatRunId).toBe("run-user");
        (0, vitest_1.expect)(state.chatStream).toBe("Working...");
        (0, vitest_1.expect)(state.chatStreamStartedAt).toBe(123);
    });
    (0, vitest_1.it)("processes final from own run and clears state", function () {
        var state = createState({
            sessionKey: "main",
            chatRunId: "run-1",
            chatStream: "Reply",
            chatStreamStartedAt: 100,
        });
        var payload = {
            runId: "run-1",
            sessionKey: "main",
            state: "final",
        };
        (0, vitest_1.expect)((0, chat_1.handleChatEvent)(state, payload)).toBe("final");
        (0, vitest_1.expect)(state.chatRunId).toBe(null);
        (0, vitest_1.expect)(state.chatStream).toBe(null);
        (0, vitest_1.expect)(state.chatStreamStartedAt).toBe(null);
    });
});
