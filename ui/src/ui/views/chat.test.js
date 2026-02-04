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
var lit_1 = require("lit");
var vitest_1 = require("vitest");
var chat_1 = require("./chat");
function createSessions() {
    return {
        ts: 0,
        path: "",
        count: 0,
        defaults: { model: null, contextTokens: null },
        sessions: [],
    };
}
function createProps(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ sessionKey: "main", onSessionKeyChange: function () { return undefined; }, thinkingLevel: null, showThinking: false, loading: false, sending: false, canAbort: false, compactionStatus: null, messages: [], toolMessages: [], stream: null, streamStartedAt: null, assistantAvatarUrl: null, draft: "", queue: [], connected: true, canSend: true, disabledReason: null, error: null, sessions: createSessions(), focusMode: false, assistantName: "OpenClaw", assistantAvatar: null, onRefresh: function () { return undefined; }, onToggleFocusMode: function () { return undefined; }, onDraftChange: function () { return undefined; }, onSend: function () { return undefined; }, onQueueRemove: function () { return undefined; }, onNewSession: function () { return undefined; } }, overrides);
}
(0, vitest_1.describe)("chat view", function () {
    (0, vitest_1.it)("shows a stop button when aborting is available", function () {
        var container = document.createElement("div");
        var onAbort = vitest_1.vi.fn();
        (0, lit_1.render)((0, chat_1.renderChat)(createProps({
            canAbort: true,
            onAbort: onAbort,
        })), container);
        var stopButton = Array.from(container.querySelectorAll("button")).find(function (btn) { var _a; return ((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "Stop"; });
        (0, vitest_1.expect)(stopButton).not.toBeUndefined();
        stopButton === null || stopButton === void 0 ? void 0 : stopButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        (0, vitest_1.expect)(onAbort).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(container.textContent).not.toContain("New session");
    });
    (0, vitest_1.it)("shows a new session button when aborting is unavailable", function () {
        var container = document.createElement("div");
        var onNewSession = vitest_1.vi.fn();
        (0, lit_1.render)((0, chat_1.renderChat)(createProps({
            canAbort: false,
            onNewSession: onNewSession,
        })), container);
        var newSessionButton = Array.from(container.querySelectorAll("button")).find(function (btn) { var _a; return ((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "New session"; });
        (0, vitest_1.expect)(newSessionButton).not.toBeUndefined();
        newSessionButton === null || newSessionButton === void 0 ? void 0 : newSessionButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        (0, vitest_1.expect)(onNewSession).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(container.textContent).not.toContain("Stop");
    });
});
