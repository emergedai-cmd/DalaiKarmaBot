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
var tui_event_handlers_js_1 = require("./tui-event-handlers.js");
(0, vitest_1.describe)("tui-event-handlers: handleAgentEvent", function () {
    var makeState = function (overrides) { return (__assign({ agentDefaultId: "main", sessionMainKey: "agent:main:main", sessionScope: "global", agents: [], currentAgentId: "main", currentSessionKey: "agent:main:main", currentSessionId: "session-1", activeChatRunId: "run-1", historyLoaded: true, sessionInfo: {}, initialSessionApplied: true, isConnected: true, autoMessageSent: false, toolsExpanded: false, showThinking: false, connectionStatus: "connected", activityStatus: "idle", statusTimeout: null, lastCtrlCAt: 0 }, overrides)); };
    var makeContext = function (state) {
        var chatLog = {
            startTool: vitest_1.vi.fn(),
            updateToolResult: vitest_1.vi.fn(),
            addSystem: vitest_1.vi.fn(),
            updateAssistant: vitest_1.vi.fn(),
            finalizeAssistant: vitest_1.vi.fn(),
        };
        var tui = { requestRender: vitest_1.vi.fn() };
        var setActivityStatus = vitest_1.vi.fn();
        return { chatLog: chatLog, tui: tui, state: state, setActivityStatus: setActivityStatus };
    };
    (0, vitest_1.it)("processes tool events when runId matches activeChatRunId (even if sessionId differs)", function () {
        var state = makeState({ currentSessionId: "session-xyz", activeChatRunId: "run-123" });
        var _a = makeContext(state), chatLog = _a.chatLog, tui = _a.tui, setActivityStatus = _a.setActivityStatus;
        var handleAgentEvent = (0, tui_event_handlers_js_1.createEventHandlers)({
            // Casts are fine here: TUI runtime shape is larger than we need in unit tests.
            // oxlint-disable-next-line typescript/no-explicit-any
            chatLog: chatLog,
            // oxlint-disable-next-line typescript/no-explicit-any
            tui: tui,
            state: state,
            setActivityStatus: setActivityStatus,
        }).handleAgentEvent;
        var evt = {
            runId: "run-123",
            stream: "tool",
            data: {
                phase: "start",
                toolCallId: "tc1",
                name: "exec",
                args: { command: "echo hi" },
            },
        };
        handleAgentEvent(evt);
        (0, vitest_1.expect)(chatLog.startTool).toHaveBeenCalledWith("tc1", "exec", { command: "echo hi" });
        (0, vitest_1.expect)(tui.requestRender).toHaveBeenCalledTimes(1);
    });
    (0, vitest_1.it)("ignores tool events when runId does not match activeChatRunId", function () {
        var state = makeState({ activeChatRunId: "run-1" });
        var _a = makeContext(state), chatLog = _a.chatLog, tui = _a.tui, setActivityStatus = _a.setActivityStatus;
        var handleAgentEvent = (0, tui_event_handlers_js_1.createEventHandlers)({
            // oxlint-disable-next-line typescript/no-explicit-any
            chatLog: chatLog,
            // oxlint-disable-next-line typescript/no-explicit-any
            tui: tui,
            state: state,
            setActivityStatus: setActivityStatus,
        }).handleAgentEvent;
        var evt = {
            runId: "run-2",
            stream: "tool",
            data: { phase: "start", toolCallId: "tc1", name: "exec" },
        };
        handleAgentEvent(evt);
        (0, vitest_1.expect)(chatLog.startTool).not.toHaveBeenCalled();
        (0, vitest_1.expect)(chatLog.updateToolResult).not.toHaveBeenCalled();
        (0, vitest_1.expect)(tui.requestRender).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("processes lifecycle events when runId matches activeChatRunId", function () {
        var state = makeState({ activeChatRunId: "run-9" });
        var _a = makeContext(state), tui = _a.tui, setActivityStatus = _a.setActivityStatus;
        var handleAgentEvent = (0, tui_event_handlers_js_1.createEventHandlers)({
            // oxlint-disable-next-line typescript/no-explicit-any
            chatLog: { startTool: vitest_1.vi.fn(), updateToolResult: vitest_1.vi.fn() },
            // oxlint-disable-next-line typescript/no-explicit-any
            tui: tui,
            state: state,
            setActivityStatus: setActivityStatus,
        }).handleAgentEvent;
        var evt = {
            runId: "run-9",
            stream: "lifecycle",
            data: { phase: "start" },
        };
        handleAgentEvent(evt);
        (0, vitest_1.expect)(setActivityStatus).toHaveBeenCalledWith("running");
        (0, vitest_1.expect)(tui.requestRender).toHaveBeenCalledTimes(1);
    });
    (0, vitest_1.it)("captures runId from chat events when activeChatRunId is unset", function () {
        var state = makeState({ activeChatRunId: null });
        var _a = makeContext(state), chatLog = _a.chatLog, tui = _a.tui, setActivityStatus = _a.setActivityStatus;
        var _b = (0, tui_event_handlers_js_1.createEventHandlers)({
            // oxlint-disable-next-line typescript/no-explicit-any
            chatLog: chatLog,
            // oxlint-disable-next-line typescript/no-explicit-any
            tui: tui,
            state: state,
            setActivityStatus: setActivityStatus,
        }), handleChatEvent = _b.handleChatEvent, handleAgentEvent = _b.handleAgentEvent;
        var chatEvt = {
            runId: "run-42",
            sessionKey: state.currentSessionKey,
            state: "delta",
            message: { content: "hello" },
        };
        handleChatEvent(chatEvt);
        (0, vitest_1.expect)(state.activeChatRunId).toBe("run-42");
        var agentEvt = {
            runId: "run-42",
            stream: "tool",
            data: { phase: "start", toolCallId: "tc1", name: "exec" },
        };
        handleAgentEvent(agentEvt);
        (0, vitest_1.expect)(chatLog.startTool).toHaveBeenCalledWith("tc1", "exec", undefined);
    });
    (0, vitest_1.it)("clears run mapping when the session changes", function () {
        var state = makeState({ activeChatRunId: null });
        var _a = makeContext(state), chatLog = _a.chatLog, tui = _a.tui, setActivityStatus = _a.setActivityStatus;
        var _b = (0, tui_event_handlers_js_1.createEventHandlers)({
            // oxlint-disable-next-line typescript/no-explicit-any
            chatLog: chatLog,
            // oxlint-disable-next-line typescript/no-explicit-any
            tui: tui,
            state: state,
            setActivityStatus: setActivityStatus,
        }), handleChatEvent = _b.handleChatEvent, handleAgentEvent = _b.handleAgentEvent;
        handleChatEvent({
            runId: "run-old",
            sessionKey: state.currentSessionKey,
            state: "delta",
            message: { content: "hello" },
        });
        state.currentSessionKey = "agent:main:other";
        state.activeChatRunId = null;
        tui.requestRender.mockClear();
        handleAgentEvent({
            runId: "run-old",
            stream: "tool",
            data: { phase: "start", toolCallId: "tc2", name: "exec" },
        });
        (0, vitest_1.expect)(chatLog.startTool).not.toHaveBeenCalled();
        (0, vitest_1.expect)(tui.requestRender).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("ignores lifecycle updates for non-active runs in the same session", function () {
        var state = makeState({ activeChatRunId: "run-active" });
        var _a = makeContext(state), chatLog = _a.chatLog, tui = _a.tui, setActivityStatus = _a.setActivityStatus;
        var _b = (0, tui_event_handlers_js_1.createEventHandlers)({
            // oxlint-disable-next-line typescript/no-explicit-any
            chatLog: chatLog,
            // oxlint-disable-next-line typescript/no-explicit-any
            tui: tui,
            state: state,
            setActivityStatus: setActivityStatus,
        }), handleChatEvent = _b.handleChatEvent, handleAgentEvent = _b.handleAgentEvent;
        handleChatEvent({
            runId: "run-other",
            sessionKey: state.currentSessionKey,
            state: "delta",
            message: { content: "hello" },
        });
        setActivityStatus.mockClear();
        tui.requestRender.mockClear();
        handleAgentEvent({
            runId: "run-other",
            stream: "lifecycle",
            data: { phase: "end" },
        });
        (0, vitest_1.expect)(setActivityStatus).not.toHaveBeenCalled();
        (0, vitest_1.expect)(tui.requestRender).not.toHaveBeenCalled();
    });
});
