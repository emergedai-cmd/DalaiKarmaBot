"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGatewayMaintenanceTimers = startGatewayMaintenanceTimers;
var chat_abort_js_1 = require("./chat-abort.js");
var server_constants_js_1 = require("./server-constants.js");
var server_utils_js_1 = require("./server-utils.js");
var health_state_js_1 = require("./server/health-state.js");
function startGatewayMaintenanceTimers(params) {
    (0, health_state_js_1.setBroadcastHealthUpdate)(function (snap) {
        params.broadcast("health", snap, {
            stateVersion: {
                presence: params.getPresenceVersion(),
                health: params.getHealthVersion(),
            },
        });
        params.nodeSendToAllSubscribed("health", snap);
    });
    // periodic keepalive
    var tickInterval = setInterval(function () {
        var payload = { ts: Date.now() };
        params.broadcast("tick", payload, { dropIfSlow: true });
        params.nodeSendToAllSubscribed("tick", payload);
    }, server_constants_js_1.TICK_INTERVAL_MS);
    // periodic health refresh to keep cached snapshot warm
    var healthInterval = setInterval(function () {
        void params
            .refreshGatewayHealthSnapshot({ probe: true })
            .catch(function (err) { return params.logHealth.error("refresh failed: ".concat((0, server_utils_js_1.formatError)(err))); });
    }, server_constants_js_1.HEALTH_REFRESH_INTERVAL_MS);
    // Prime cache so first client gets a snapshot without waiting.
    void params
        .refreshGatewayHealthSnapshot({ probe: true })
        .catch(function (err) { return params.logHealth.error("initial refresh failed: ".concat((0, server_utils_js_1.formatError)(err))); });
    // dedupe cache cleanup
    var dedupeCleanup = setInterval(function () {
        var now = Date.now();
        for (var _i = 0, _a = params.dedupe; _i < _a.length; _i++) {
            var _b = _a[_i], k = _b[0], v = _b[1];
            if (now - v.ts > server_constants_js_1.DEDUPE_TTL_MS) {
                params.dedupe.delete(k);
            }
        }
        if (params.dedupe.size > server_constants_js_1.DEDUPE_MAX) {
            var entries = __spreadArray([], params.dedupe.entries(), true).toSorted(function (a, b) { return a[1].ts - b[1].ts; });
            for (var i = 0; i < params.dedupe.size - server_constants_js_1.DEDUPE_MAX; i++) {
                params.dedupe.delete(entries[i][0]);
            }
        }
        for (var _c = 0, _d = params.chatAbortControllers; _c < _d.length; _c++) {
            var _e = _d[_c], runId = _e[0], entry = _e[1];
            if (now <= entry.expiresAtMs) {
                continue;
            }
            (0, chat_abort_js_1.abortChatRunById)({
                chatAbortControllers: params.chatAbortControllers,
                chatRunBuffers: params.chatRunBuffers,
                chatDeltaSentAt: params.chatDeltaSentAt,
                chatAbortedRuns: params.chatRunState.abortedRuns,
                removeChatRun: params.removeChatRun,
                agentRunSeq: params.agentRunSeq,
                broadcast: params.broadcast,
                nodeSendToSession: params.nodeSendToSession,
            }, { runId: runId, sessionKey: entry.sessionKey, stopReason: "timeout" });
        }
        var ABORTED_RUN_TTL_MS = 60 * 60000;
        for (var _f = 0, _g = params.chatRunState.abortedRuns; _f < _g.length; _f++) {
            var _h = _g[_f], runId = _h[0], abortedAt = _h[1];
            if (now - abortedAt <= ABORTED_RUN_TTL_MS) {
                continue;
            }
            params.chatRunState.abortedRuns.delete(runId);
            params.chatRunBuffers.delete(runId);
            params.chatDeltaSentAt.delete(runId);
        }
    }, 60000);
    return { tickInterval: tickInterval, healthInterval: healthInterval, dedupeCleanup: dedupeCleanup };
}
