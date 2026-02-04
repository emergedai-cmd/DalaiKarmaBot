"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSessionKeyFromResolveParams = resolveSessionKeyFromResolveParams;
var sessions_js_1 = require("../config/sessions.js");
var session_label_js_1 = require("../sessions/session-label.js");
var index_js_1 = require("./protocol/index.js");
var session_utils_js_1 = require("./session-utils.js");
function resolveSessionKeyFromResolveParams(params) {
    var _a, _b, _c, _d;
    var cfg = params.cfg, p = params.p;
    var key = typeof p.key === "string" ? p.key.trim() : "";
    var hasKey = key.length > 0;
    var sessionId = typeof p.sessionId === "string" ? p.sessionId.trim() : "";
    var hasSessionId = sessionId.length > 0;
    var hasLabel = typeof p.label === "string" && p.label.trim().length > 0;
    var selectionCount = [hasKey, hasSessionId, hasLabel].filter(Boolean).length;
    if (selectionCount > 1) {
        return {
            ok: false,
            error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "Provide either key, sessionId, or label (not multiple)"),
        };
    }
    if (selectionCount === 0) {
        return {
            ok: false,
            error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "Either key, sessionId, or label is required"),
        };
    }
    if (hasKey) {
        var target = (0, session_utils_js_1.resolveGatewaySessionStoreTarget)({ cfg: cfg, key: key });
        var store_1 = (0, sessions_js_1.loadSessionStore)(target.storePath);
        var existingKey = target.storeKeys.find(function (candidate) { return store_1[candidate]; });
        if (!existingKey) {
            return {
                ok: false,
                error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "No session found: ".concat(key)),
            };
        }
        return { ok: true, key: target.canonicalKey };
    }
    if (hasSessionId) {
        var _e = (0, session_utils_js_1.loadCombinedSessionStoreForGateway)(cfg), storePath_1 = _e.storePath, store_2 = _e.store;
        var list_1 = (0, session_utils_js_1.listSessionsFromStore)({
            cfg: cfg,
            storePath: storePath_1,
            store: store_2,
            opts: {
                includeGlobal: p.includeGlobal === true,
                includeUnknown: p.includeUnknown === true,
                spawnedBy: p.spawnedBy,
                agentId: p.agentId,
                search: sessionId,
                limit: 8,
            },
        });
        var matches = list_1.sessions.filter(function (session) { return session.sessionId === sessionId || session.key === sessionId; });
        if (matches.length === 0) {
            return {
                ok: false,
                error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "No session found: ".concat(sessionId)),
            };
        }
        if (matches.length > 1) {
            var keys = matches.map(function (session) { return session.key; }).join(", ");
            return {
                ok: false,
                error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "Multiple sessions found for sessionId: ".concat(sessionId, " (").concat(keys, ")")),
            };
        }
        return { ok: true, key: String((_b = (_a = matches[0]) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : "") };
    }
    var parsedLabel = (0, session_label_js_1.parseSessionLabel)(p.label);
    if (!parsedLabel.ok) {
        return {
            ok: false,
            error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, parsedLabel.error),
        };
    }
    var _f = (0, session_utils_js_1.loadCombinedSessionStoreForGateway)(cfg), storePath = _f.storePath, store = _f.store;
    var list = (0, session_utils_js_1.listSessionsFromStore)({
        cfg: cfg,
        storePath: storePath,
        store: store,
        opts: {
            includeGlobal: p.includeGlobal === true,
            includeUnknown: p.includeUnknown === true,
            label: parsedLabel.label,
            agentId: p.agentId,
            spawnedBy: p.spawnedBy,
            limit: 2,
        },
    });
    if (list.sessions.length === 0) {
        return {
            ok: false,
            error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "No session found with label: ".concat(parsedLabel.label)),
        };
    }
    if (list.sessions.length > 1) {
        var keys = list.sessions.map(function (s) { return s.key; }).join(", ");
        return {
            ok: false,
            error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "Multiple sessions found with label: ".concat(parsedLabel.label, " (").concat(keys, ")")),
        };
    }
    return { ok: true, key: String((_d = (_c = list.sessions[0]) === null || _c === void 0 ? void 0 : _c.key) !== null && _d !== void 0 ? _d : "") };
}
