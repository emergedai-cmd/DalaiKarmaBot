"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSessionKeyForRun = resolveSessionKeyForRun;
var config_js_1 = require("../config/config.js");
var sessions_js_1 = require("../config/sessions.js");
var agent_events_js_1 = require("../infra/agent-events.js");
var session_key_js_1 = require("../routing/session-key.js");
function resolveSessionKeyForRun(runId) {
    var _a, _b, _c;
    var cached = (_a = (0, agent_events_js_1.getAgentRunContext)(runId)) === null || _a === void 0 ? void 0 : _a.sessionKey;
    if (cached) {
        return cached;
    }
    var cfg = (0, config_js_1.loadConfig)();
    var storePath = (0, sessions_js_1.resolveStorePath)((_b = cfg.session) === null || _b === void 0 ? void 0 : _b.store);
    var store = (0, sessions_js_1.loadSessionStore)(storePath);
    var found = Object.entries(store).find(function (_a) {
        var entry = _a[1];
        return (entry === null || entry === void 0 ? void 0 : entry.sessionId) === runId;
    });
    var storeKey = found === null || found === void 0 ? void 0 : found[0];
    if (storeKey) {
        var sessionKey = (_c = (0, session_key_js_1.toAgentRequestSessionKey)(storeKey)) !== null && _c !== void 0 ? _c : storeKey;
        (0, agent_events_js_1.registerAgentRunContext)(runId, { sessionKey: sessionKey });
        return sessionKey;
    }
    return undefined;
}
