"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCronSession = resolveCronSession;
var node_crypto_1 = require("node:crypto");
var sessions_js_1 = require("../../config/sessions.js");
function resolveCronSession(params) {
    var sessionCfg = params.cfg.session;
    var storePath = (0, sessions_js_1.resolveStorePath)(sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.store, {
        agentId: params.agentId,
    });
    var store = (0, sessions_js_1.loadSessionStore)(storePath);
    var entry = store[params.sessionKey];
    var sessionId = node_crypto_1.default.randomUUID();
    var systemSent = false;
    var sessionEntry = {
        sessionId: sessionId,
        updatedAt: params.nowMs,
        systemSent: systemSent,
        thinkingLevel: entry === null || entry === void 0 ? void 0 : entry.thinkingLevel,
        verboseLevel: entry === null || entry === void 0 ? void 0 : entry.verboseLevel,
        model: entry === null || entry === void 0 ? void 0 : entry.model,
        contextTokens: entry === null || entry === void 0 ? void 0 : entry.contextTokens,
        sendPolicy: entry === null || entry === void 0 ? void 0 : entry.sendPolicy,
        lastChannel: entry === null || entry === void 0 ? void 0 : entry.lastChannel,
        lastTo: entry === null || entry === void 0 ? void 0 : entry.lastTo,
        lastAccountId: entry === null || entry === void 0 ? void 0 : entry.lastAccountId,
        skillsSnapshot: entry === null || entry === void 0 ? void 0 : entry.skillsSnapshot,
    };
    return { storePath: storePath, store: store, sessionEntry: sessionEntry, systemSent: systemSent, isNewSession: true };
}
