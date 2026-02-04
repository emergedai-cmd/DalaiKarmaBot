"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventHandlers = createEventHandlers;
var tui_formatters_js_1 = require("./tui-formatters.js");
var tui_stream_assembler_js_1 = require("./tui-stream-assembler.js");
function createEventHandlers(context) {
    var chatLog = context.chatLog, tui = context.tui, state = context.state, setActivityStatus = context.setActivityStatus, refreshSessionInfo = context.refreshSessionInfo;
    var finalizedRuns = new Map();
    var sessionRuns = new Map();
    var streamAssembler = new tui_stream_assembler_js_1.TuiStreamAssembler();
    var lastSessionKey = state.currentSessionKey;
    var pruneRunMap = function (runs) {
        if (runs.size <= 200) {
            return;
        }
        var keepUntil = Date.now() - 10 * 60 * 1000;
        for (var _i = 0, runs_1 = runs; _i < runs_1.length; _i++) {
            var _a = runs_1[_i], key = _a[0], ts = _a[1];
            if (runs.size <= 150) {
                break;
            }
            if (ts < keepUntil) {
                runs.delete(key);
            }
        }
        if (runs.size > 200) {
            for (var _b = 0, _c = runs.keys(); _b < _c.length; _b++) {
                var key = _c[_b];
                runs.delete(key);
                if (runs.size <= 150) {
                    break;
                }
            }
        }
    };
    var syncSessionKey = function () {
        if (state.currentSessionKey === lastSessionKey) {
            return;
        }
        lastSessionKey = state.currentSessionKey;
        finalizedRuns.clear();
        sessionRuns.clear();
        streamAssembler = new tui_stream_assembler_js_1.TuiStreamAssembler();
    };
    var noteSessionRun = function (runId) {
        sessionRuns.set(runId, Date.now());
        pruneRunMap(sessionRuns);
    };
    var noteFinalizedRun = function (runId) {
        finalizedRuns.set(runId, Date.now());
        sessionRuns.delete(runId);
        streamAssembler.drop(runId);
        pruneRunMap(finalizedRuns);
    };
    var handleChatEvent = function (payload) {
        var _a;
        if (!payload || typeof payload !== "object") {
            return;
        }
        var evt = payload;
        syncSessionKey();
        if (evt.sessionKey !== state.currentSessionKey) {
            return;
        }
        if (finalizedRuns.has(evt.runId)) {
            if (evt.state === "delta") {
                return;
            }
            if (evt.state === "final") {
                return;
            }
        }
        noteSessionRun(evt.runId);
        if (!state.activeChatRunId) {
            state.activeChatRunId = evt.runId;
        }
        if (evt.state === "delta") {
            var displayText = streamAssembler.ingestDelta(evt.runId, evt.message, state.showThinking);
            if (!displayText) {
                return;
            }
            chatLog.updateAssistant(displayText, evt.runId);
            setActivityStatus("streaming");
        }
        if (evt.state === "final") {
            if ((0, tui_formatters_js_1.isCommandMessage)(evt.message)) {
                var text = (0, tui_formatters_js_1.extractTextFromMessage)(evt.message);
                if (text) {
                    chatLog.addSystem(text);
                }
                streamAssembler.drop(evt.runId);
                noteFinalizedRun(evt.runId);
                state.activeChatRunId = null;
                setActivityStatus("idle");
                void (refreshSessionInfo === null || refreshSessionInfo === void 0 ? void 0 : refreshSessionInfo());
                tui.requestRender();
                return;
            }
            var stopReason = evt.message && typeof evt.message === "object" && !Array.isArray(evt.message)
                ? typeof evt.message.stopReason === "string"
                    ? evt.message.stopReason
                    : ""
                : "";
            var finalText = streamAssembler.finalize(evt.runId, evt.message, state.showThinking);
            chatLog.finalizeAssistant(finalText, evt.runId);
            noteFinalizedRun(evt.runId);
            state.activeChatRunId = null;
            setActivityStatus(stopReason === "error" ? "error" : "idle");
            // Refresh session info to update token counts in footer
            void (refreshSessionInfo === null || refreshSessionInfo === void 0 ? void 0 : refreshSessionInfo());
        }
        if (evt.state === "aborted") {
            chatLog.addSystem("run aborted");
            streamAssembler.drop(evt.runId);
            sessionRuns.delete(evt.runId);
            state.activeChatRunId = null;
            setActivityStatus("aborted");
            void (refreshSessionInfo === null || refreshSessionInfo === void 0 ? void 0 : refreshSessionInfo());
        }
        if (evt.state === "error") {
            chatLog.addSystem("run error: ".concat((_a = evt.errorMessage) !== null && _a !== void 0 ? _a : "unknown"));
            streamAssembler.drop(evt.runId);
            sessionRuns.delete(evt.runId);
            state.activeChatRunId = null;
            setActivityStatus("error");
            void (refreshSessionInfo === null || refreshSessionInfo === void 0 ? void 0 : refreshSessionInfo());
        }
        tui.requestRender();
    };
    var handleAgentEvent = function (payload) {
        var _a, _b;
        if (!payload || typeof payload !== "object") {
            return;
        }
        var evt = payload;
        syncSessionKey();
        // Agent events (tool streaming, lifecycle) are emitted per-run. Filter against the
        // active chat run id, not the session id.
        var isActiveRun = evt.runId === state.activeChatRunId;
        if (!isActiveRun && !sessionRuns.has(evt.runId)) {
            return;
        }
        if (evt.stream === "tool") {
            var data = (_a = evt.data) !== null && _a !== void 0 ? _a : {};
            var phase = (0, tui_formatters_js_1.asString)(data.phase, "");
            var toolCallId = (0, tui_formatters_js_1.asString)(data.toolCallId, "");
            var toolName = (0, tui_formatters_js_1.asString)(data.name, "tool");
            if (!toolCallId) {
                return;
            }
            if (phase === "start") {
                chatLog.startTool(toolCallId, toolName, data.args);
            }
            else if (phase === "update") {
                chatLog.updateToolResult(toolCallId, data.partialResult, {
                    partial: true,
                });
            }
            else if (phase === "result") {
                chatLog.updateToolResult(toolCallId, data.result, {
                    isError: Boolean(data.isError),
                });
            }
            tui.requestRender();
            return;
        }
        if (evt.stream === "lifecycle") {
            if (!isActiveRun) {
                return;
            }
            var phase = typeof ((_b = evt.data) === null || _b === void 0 ? void 0 : _b.phase) === "string" ? evt.data.phase : "";
            if (phase === "start") {
                setActivityStatus("running");
            }
            if (phase === "end") {
                setActivityStatus("idle");
            }
            if (phase === "error") {
                setActivityStatus("error");
            }
            tui.requestRender();
        }
    };
    return { handleChatEvent: handleChatEvent, handleAgentEvent: handleAgentEvent };
}
