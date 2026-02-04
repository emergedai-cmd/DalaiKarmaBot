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
exports.createChatRunRegistry = createChatRunRegistry;
exports.createChatRunState = createChatRunState;
exports.createAgentEventHandler = createAgentEventHandler;
var thinking_js_1 = require("../auto-reply/thinking.js");
var config_js_1 = require("../config/config.js");
var agent_events_js_1 = require("../infra/agent-events.js");
var heartbeat_visibility_js_1 = require("../infra/heartbeat-visibility.js");
var session_utils_js_1 = require("./session-utils.js");
var ws_log_js_1 = require("./ws-log.js");
/**
 * Check if webchat broadcasts should be suppressed for heartbeat runs.
 * Returns true if the run is a heartbeat and showOk is false.
 */
function shouldSuppressHeartbeatBroadcast(runId) {
    var runContext = (0, agent_events_js_1.getAgentRunContext)(runId);
    if (!(runContext === null || runContext === void 0 ? void 0 : runContext.isHeartbeat)) {
        return false;
    }
    try {
        var cfg = (0, config_js_1.loadConfig)();
        var visibility = (0, heartbeat_visibility_js_1.resolveHeartbeatVisibility)({ cfg: cfg, channel: "webchat" });
        return !visibility.showOk;
    }
    catch (_a) {
        // Default to suppressing if we can't load config
        return true;
    }
}
function createChatRunRegistry() {
    var chatRunSessions = new Map();
    var add = function (sessionId, entry) {
        var queue = chatRunSessions.get(sessionId);
        if (queue) {
            queue.push(entry);
        }
        else {
            chatRunSessions.set(sessionId, [entry]);
        }
    };
    var peek = function (sessionId) { var _a; return (_a = chatRunSessions.get(sessionId)) === null || _a === void 0 ? void 0 : _a[0]; };
    var shift = function (sessionId) {
        var queue = chatRunSessions.get(sessionId);
        if (!queue || queue.length === 0) {
            return undefined;
        }
        var entry = queue.shift();
        if (!queue.length) {
            chatRunSessions.delete(sessionId);
        }
        return entry;
    };
    var remove = function (sessionId, clientRunId, sessionKey) {
        var queue = chatRunSessions.get(sessionId);
        if (!queue || queue.length === 0) {
            return undefined;
        }
        var idx = queue.findIndex(function (entry) {
            return entry.clientRunId === clientRunId && (sessionKey ? entry.sessionKey === sessionKey : true);
        });
        if (idx < 0) {
            return undefined;
        }
        var entry = queue.splice(idx, 1)[0];
        if (!queue.length) {
            chatRunSessions.delete(sessionId);
        }
        return entry;
    };
    var clear = function () {
        chatRunSessions.clear();
    };
    return { add: add, peek: peek, shift: shift, remove: remove, clear: clear };
}
function createChatRunState() {
    var registry = createChatRunRegistry();
    var buffers = new Map();
    var deltaSentAt = new Map();
    var abortedRuns = new Map();
    var clear = function () {
        registry.clear();
        buffers.clear();
        deltaSentAt.clear();
        abortedRuns.clear();
    };
    return {
        registry: registry,
        buffers: buffers,
        deltaSentAt: deltaSentAt,
        abortedRuns: abortedRuns,
        clear: clear,
    };
}
function createAgentEventHandler(_a) {
    var broadcast = _a.broadcast, nodeSendToSession = _a.nodeSendToSession, agentRunSeq = _a.agentRunSeq, chatRunState = _a.chatRunState, resolveSessionKeyForRun = _a.resolveSessionKeyForRun, clearAgentRunContext = _a.clearAgentRunContext;
    var emitChatDelta = function (sessionKey, clientRunId, seq, text) {
        var _a;
        chatRunState.buffers.set(clientRunId, text);
        var now = Date.now();
        var last = (_a = chatRunState.deltaSentAt.get(clientRunId)) !== null && _a !== void 0 ? _a : 0;
        if (now - last < 150) {
            return;
        }
        chatRunState.deltaSentAt.set(clientRunId, now);
        var payload = {
            runId: clientRunId,
            sessionKey: sessionKey,
            seq: seq,
            state: "delta",
            message: {
                role: "assistant",
                content: [{ type: "text", text: text }],
                timestamp: now,
            },
        };
        // Suppress webchat broadcast for heartbeat runs when showOk is false
        if (!shouldSuppressHeartbeatBroadcast(clientRunId)) {
            broadcast("chat", payload, { dropIfSlow: true });
        }
        nodeSendToSession(sessionKey, "chat", payload);
    };
    var emitChatFinal = function (sessionKey, clientRunId, seq, jobState, error) {
        var _a, _b;
        var text = (_b = (_a = chatRunState.buffers.get(clientRunId)) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
        chatRunState.buffers.delete(clientRunId);
        chatRunState.deltaSentAt.delete(clientRunId);
        if (jobState === "done") {
            var payload_1 = {
                runId: clientRunId,
                sessionKey: sessionKey,
                seq: seq,
                state: "final",
                message: text
                    ? {
                        role: "assistant",
                        content: [{ type: "text", text: text }],
                        timestamp: Date.now(),
                    }
                    : undefined,
            };
            // Suppress webchat broadcast for heartbeat runs when showOk is false
            if (!shouldSuppressHeartbeatBroadcast(clientRunId)) {
                broadcast("chat", payload_1);
            }
            nodeSendToSession(sessionKey, "chat", payload_1);
            return;
        }
        var payload = {
            runId: clientRunId,
            sessionKey: sessionKey,
            seq: seq,
            state: "error",
            errorMessage: error ? (0, ws_log_js_1.formatForLog)(error) : undefined,
        };
        broadcast("chat", payload);
        nodeSendToSession(sessionKey, "chat", payload);
    };
    var shouldEmitToolEvents = function (runId, sessionKey) {
        var _a, _b;
        var runContext = (0, agent_events_js_1.getAgentRunContext)(runId);
        var runVerbose = (0, thinking_js_1.normalizeVerboseLevel)(runContext === null || runContext === void 0 ? void 0 : runContext.verboseLevel);
        if (runVerbose) {
            return runVerbose === "on";
        }
        if (!sessionKey) {
            return false;
        }
        try {
            var _c = (0, session_utils_js_1.loadSessionEntry)(sessionKey), cfg = _c.cfg, entry = _c.entry;
            var sessionVerbose = (0, thinking_js_1.normalizeVerboseLevel)(entry === null || entry === void 0 ? void 0 : entry.verboseLevel);
            if (sessionVerbose) {
                return sessionVerbose === "on";
            }
            var defaultVerbose = (0, thinking_js_1.normalizeVerboseLevel)((_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.verboseDefault);
            return defaultVerbose === "on";
        }
        catch (_d) {
            return false;
        }
    };
    return function (evt) {
        var _a, _b, _c, _d, _e, _f, _g;
        var chatLink = chatRunState.registry.peek(evt.runId);
        var sessionKey = (_a = chatLink === null || chatLink === void 0 ? void 0 : chatLink.sessionKey) !== null && _a !== void 0 ? _a : resolveSessionKeyForRun(evt.runId);
        var clientRunId = (_b = chatLink === null || chatLink === void 0 ? void 0 : chatLink.clientRunId) !== null && _b !== void 0 ? _b : evt.runId;
        var isAborted = chatRunState.abortedRuns.has(clientRunId) || chatRunState.abortedRuns.has(evt.runId);
        // Include sessionKey so Control UI can filter tool streams per session.
        var agentPayload = sessionKey ? __assign(__assign({}, evt), { sessionKey: sessionKey }) : evt;
        var last = (_c = agentRunSeq.get(evt.runId)) !== null && _c !== void 0 ? _c : 0;
        if (evt.stream === "tool" && !shouldEmitToolEvents(evt.runId, sessionKey)) {
            agentRunSeq.set(evt.runId, evt.seq);
            return;
        }
        if (evt.seq !== last + 1) {
            broadcast("agent", {
                runId: evt.runId,
                stream: "error",
                ts: Date.now(),
                sessionKey: sessionKey,
                data: {
                    reason: "seq gap",
                    expected: last + 1,
                    received: evt.seq,
                },
            });
        }
        agentRunSeq.set(evt.runId, evt.seq);
        broadcast("agent", agentPayload);
        var lifecyclePhase = evt.stream === "lifecycle" && typeof ((_d = evt.data) === null || _d === void 0 ? void 0 : _d.phase) === "string" ? evt.data.phase : null;
        if (sessionKey) {
            nodeSendToSession(sessionKey, "agent", agentPayload);
            if (!isAborted && evt.stream === "assistant" && typeof ((_e = evt.data) === null || _e === void 0 ? void 0 : _e.text) === "string") {
                emitChatDelta(sessionKey, clientRunId, evt.seq, evt.data.text);
            }
            else if (!isAborted && (lifecyclePhase === "end" || lifecyclePhase === "error")) {
                if (chatLink) {
                    var finished = chatRunState.registry.shift(evt.runId);
                    if (!finished) {
                        clearAgentRunContext(evt.runId);
                        return;
                    }
                    emitChatFinal(finished.sessionKey, finished.clientRunId, evt.seq, lifecyclePhase === "error" ? "error" : "done", (_f = evt.data) === null || _f === void 0 ? void 0 : _f.error);
                }
                else {
                    emitChatFinal(sessionKey, evt.runId, evt.seq, lifecyclePhase === "error" ? "error" : "done", (_g = evt.data) === null || _g === void 0 ? void 0 : _g.error);
                }
            }
            else if (isAborted && (lifecyclePhase === "end" || lifecyclePhase === "error")) {
                chatRunState.abortedRuns.delete(clientRunId);
                chatRunState.abortedRuns.delete(evt.runId);
                chatRunState.buffers.delete(clientRunId);
                chatRunState.deltaSentAt.delete(clientRunId);
                if (chatLink) {
                    chatRunState.registry.remove(evt.runId, clientRunId, sessionKey);
                }
            }
        }
        if (lifecyclePhase === "end" || lifecyclePhase === "error") {
            clearAgentRunContext(evt.runId);
        }
    };
}
