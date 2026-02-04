"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSessionKeyForRequest = resolveSessionKeyForRequest;
exports.resolveSession = resolveSession;
var node_crypto_1 = require("node:crypto");
var thinking_js_1 = require("../../auto-reply/thinking.js");
var sessions_js_1 = require("../../config/sessions.js");
var session_key_js_1 = require("../../routing/session-key.js");
function resolveSessionKeyForRequest(opts) {
    var _a, _b, _c, _d;
    var sessionCfg = opts.cfg.session;
    var scope = (_a = sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.scope) !== null && _a !== void 0 ? _a : "per-sender";
    var mainKey = (0, session_key_js_1.normalizeMainKey)(sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.mainKey);
    var explicitSessionKey = ((_b = opts.sessionKey) === null || _b === void 0 ? void 0 : _b.trim()) ||
        (0, sessions_js_1.resolveExplicitAgentSessionKey)({
            cfg: opts.cfg,
            agentId: opts.agentId,
        });
    var storeAgentId = (0, sessions_js_1.resolveAgentIdFromSessionKey)(explicitSessionKey);
    var storePath = (0, sessions_js_1.resolveStorePath)(sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.store, {
        agentId: storeAgentId,
    });
    var sessionStore = (0, sessions_js_1.loadSessionStore)(storePath);
    var ctx = ((_c = opts.to) === null || _c === void 0 ? void 0 : _c.trim()) ? { From: opts.to } : undefined;
    var sessionKey = explicitSessionKey !== null && explicitSessionKey !== void 0 ? explicitSessionKey : (ctx ? (0, sessions_js_1.resolveSessionKey)(scope, ctx, mainKey) : undefined);
    // If a session id was provided, prefer to re-use its entry (by id) even when no key was derived.
    if (!explicitSessionKey &&
        opts.sessionId &&
        (!sessionKey || ((_d = sessionStore[sessionKey]) === null || _d === void 0 ? void 0 : _d.sessionId) !== opts.sessionId)) {
        var foundKey = Object.keys(sessionStore).find(function (key) { var _a; return ((_a = sessionStore[key]) === null || _a === void 0 ? void 0 : _a.sessionId) === opts.sessionId; });
        if (foundKey) {
            sessionKey = foundKey;
        }
    }
    return { sessionKey: sessionKey, sessionStore: sessionStore, storePath: storePath };
}
function resolveSession(opts) {
    var _a, _b;
    var sessionCfg = opts.cfg.session;
    var _c = resolveSessionKeyForRequest({
        cfg: opts.cfg,
        to: opts.to,
        sessionId: opts.sessionId,
        sessionKey: opts.sessionKey,
        agentId: opts.agentId,
    }), sessionKey = _c.sessionKey, sessionStore = _c.sessionStore, storePath = _c.storePath;
    var now = Date.now();
    var sessionEntry = sessionKey ? sessionStore[sessionKey] : undefined;
    var resetType = (0, sessions_js_1.resolveSessionResetType)({ sessionKey: sessionKey });
    var channelReset = (0, sessions_js_1.resolveChannelResetConfig)({
        sessionCfg: sessionCfg,
        channel: (_a = sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.lastChannel) !== null && _a !== void 0 ? _a : sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.channel,
    });
    var resetPolicy = (0, sessions_js_1.resolveSessionResetPolicy)({
        sessionCfg: sessionCfg,
        resetType: resetType,
        resetOverride: channelReset,
    });
    var fresh = sessionEntry
        ? (0, sessions_js_1.evaluateSessionFreshness)({ updatedAt: sessionEntry.updatedAt, now: now, policy: resetPolicy })
            .fresh
        : false;
    var sessionId = ((_b = opts.sessionId) === null || _b === void 0 ? void 0 : _b.trim()) || (fresh ? sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.sessionId : undefined) || node_crypto_1.default.randomUUID();
    var isNewSession = !fresh && !opts.sessionId;
    var persistedThinking = fresh && (sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.thinkingLevel)
        ? (0, thinking_js_1.normalizeThinkLevel)(sessionEntry.thinkingLevel)
        : undefined;
    var persistedVerbose = fresh && (sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.verboseLevel)
        ? (0, thinking_js_1.normalizeVerboseLevel)(sessionEntry.verboseLevel)
        : undefined;
    return {
        sessionId: sessionId,
        sessionKey: sessionKey,
        sessionEntry: sessionEntry,
        sessionStore: sessionStore,
        storePath: storePath,
        isNewSession: isNewSession,
        persistedThinking: persistedThinking,
        persistedVerbose: persistedVerbose,
    };
}
