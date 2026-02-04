"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeader = getHeader;
exports.getBearerToken = getBearerToken;
exports.resolveAgentIdFromHeader = resolveAgentIdFromHeader;
exports.resolveAgentIdFromModel = resolveAgentIdFromModel;
exports.resolveAgentIdForRequest = resolveAgentIdForRequest;
exports.resolveSessionKey = resolveSessionKey;
var node_crypto_1 = require("node:crypto");
var session_key_js_1 = require("../routing/session-key.js");
function getHeader(req, name) {
    var raw = req.headers[name.toLowerCase()];
    if (typeof raw === "string") {
        return raw;
    }
    if (Array.isArray(raw)) {
        return raw[0];
    }
    return undefined;
}
function getBearerToken(req) {
    var _a, _b;
    var raw = (_b = (_a = getHeader(req, "authorization")) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
    if (!raw.toLowerCase().startsWith("bearer ")) {
        return undefined;
    }
    var token = raw.slice(7).trim();
    return token || undefined;
}
function resolveAgentIdFromHeader(req) {
    var _a, _b;
    var raw = ((_a = getHeader(req, "x-openclaw-agent-id")) === null || _a === void 0 ? void 0 : _a.trim()) ||
        ((_b = getHeader(req, "x-openclaw-agent")) === null || _b === void 0 ? void 0 : _b.trim()) ||
        "";
    if (!raw) {
        return undefined;
    }
    return (0, session_key_js_1.normalizeAgentId)(raw);
}
function resolveAgentIdFromModel(model) {
    var _a, _b;
    var raw = model === null || model === void 0 ? void 0 : model.trim();
    if (!raw) {
        return undefined;
    }
    var m = (_a = raw.match(/^openclaw[:/](?<agentId>[a-z0-9][a-z0-9_-]{0,63})$/i)) !== null && _a !== void 0 ? _a : raw.match(/^agent:(?<agentId>[a-z0-9][a-z0-9_-]{0,63})$/i);
    var agentId = (_b = m === null || m === void 0 ? void 0 : m.groups) === null || _b === void 0 ? void 0 : _b.agentId;
    if (!agentId) {
        return undefined;
    }
    return (0, session_key_js_1.normalizeAgentId)(agentId);
}
function resolveAgentIdForRequest(params) {
    var fromHeader = resolveAgentIdFromHeader(params.req);
    if (fromHeader) {
        return fromHeader;
    }
    var fromModel = resolveAgentIdFromModel(params.model);
    return fromModel !== null && fromModel !== void 0 ? fromModel : "main";
}
function resolveSessionKey(params) {
    var _a, _b;
    var explicit = (_a = getHeader(params.req, "x-openclaw-session-key")) === null || _a === void 0 ? void 0 : _a.trim();
    if (explicit) {
        return explicit;
    }
    var user = (_b = params.user) === null || _b === void 0 ? void 0 : _b.trim();
    var mainKey = user ? "".concat(params.prefix, "-user:").concat(user) : "".concat(params.prefix, ":").concat((0, node_crypto_1.randomUUID)());
    return (0, session_key_js_1.buildAgentMainSessionKey)({ agentId: params.agentId, mainKey: mainKey });
}
