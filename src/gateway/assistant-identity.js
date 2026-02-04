"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ASSISTANT_IDENTITY = void 0;
exports.resolveAssistantIdentity = resolveAssistantIdentity;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var identity_js_1 = require("../agents/identity.js");
var agents_config_js_1 = require("../commands/agents.config.js");
var session_key_js_1 = require("../routing/session-key.js");
var MAX_ASSISTANT_NAME = 50;
var MAX_ASSISTANT_AVATAR = 200;
exports.DEFAULT_ASSISTANT_IDENTITY = {
    agentId: "main",
    name: "Assistant",
    avatar: "A",
};
function coerceIdentityValue(value, maxLength) {
    if (typeof value !== "string") {
        return undefined;
    }
    var trimmed = value.trim();
    if (!trimmed) {
        return undefined;
    }
    if (trimmed.length <= maxLength) {
        return trimmed;
    }
    return trimmed.slice(0, maxLength);
}
function isAvatarUrl(value) {
    return /^https?:\/\//i.test(value) || /^data:image\//i.test(value);
}
function looksLikeAvatarPath(value) {
    if (/[\\/]/.test(value)) {
        return true;
    }
    return /\.(png|jpe?g|gif|webp|svg|ico)$/i.test(value);
}
function normalizeAvatarValue(value) {
    if (!value) {
        return undefined;
    }
    var trimmed = value.trim();
    if (!trimmed) {
        return undefined;
    }
    if (isAvatarUrl(trimmed)) {
        return trimmed;
    }
    if (looksLikeAvatarPath(trimmed)) {
        return trimmed;
    }
    if (!/\s/.test(trimmed) && trimmed.length <= 4) {
        return trimmed;
    }
    return undefined;
}
function resolveAssistantIdentity(params) {
    var _a, _b, _c, _d, _e, _f, _g;
    var agentId = (0, session_key_js_1.normalizeAgentId)((_a = params.agentId) !== null && _a !== void 0 ? _a : (0, agent_scope_js_1.resolveDefaultAgentId)(params.cfg));
    var workspaceDir = (_b = params.workspaceDir) !== null && _b !== void 0 ? _b : (0, agent_scope_js_1.resolveAgentWorkspaceDir)(params.cfg, agentId);
    var configAssistant = (_c = params.cfg.ui) === null || _c === void 0 ? void 0 : _c.assistant;
    var agentIdentity = (0, identity_js_1.resolveAgentIdentity)(params.cfg, agentId);
    var fileIdentity = workspaceDir ? (0, agents_config_js_1.loadAgentIdentity)(workspaceDir) : null;
    var name = (_f = (_e = (_d = coerceIdentityValue(configAssistant === null || configAssistant === void 0 ? void 0 : configAssistant.name, MAX_ASSISTANT_NAME)) !== null && _d !== void 0 ? _d : coerceIdentityValue(agentIdentity === null || agentIdentity === void 0 ? void 0 : agentIdentity.name, MAX_ASSISTANT_NAME)) !== null && _e !== void 0 ? _e : coerceIdentityValue(fileIdentity === null || fileIdentity === void 0 ? void 0 : fileIdentity.name, MAX_ASSISTANT_NAME)) !== null && _f !== void 0 ? _f : exports.DEFAULT_ASSISTANT_IDENTITY.name;
    var avatarCandidates = [
        coerceIdentityValue(configAssistant === null || configAssistant === void 0 ? void 0 : configAssistant.avatar, MAX_ASSISTANT_AVATAR),
        coerceIdentityValue(agentIdentity === null || agentIdentity === void 0 ? void 0 : agentIdentity.avatar, MAX_ASSISTANT_AVATAR),
        coerceIdentityValue(agentIdentity === null || agentIdentity === void 0 ? void 0 : agentIdentity.emoji, MAX_ASSISTANT_AVATAR),
        coerceIdentityValue(fileIdentity === null || fileIdentity === void 0 ? void 0 : fileIdentity.avatar, MAX_ASSISTANT_AVATAR),
        coerceIdentityValue(fileIdentity === null || fileIdentity === void 0 ? void 0 : fileIdentity.emoji, MAX_ASSISTANT_AVATAR),
    ];
    var avatar = (_g = avatarCandidates.map(function (candidate) { return normalizeAvatarValue(candidate); }).find(Boolean)) !== null && _g !== void 0 ? _g : exports.DEFAULT_ASSISTANT_IDENTITY.avatar;
    return { agentId: agentId, name: name, avatar: avatar };
}
