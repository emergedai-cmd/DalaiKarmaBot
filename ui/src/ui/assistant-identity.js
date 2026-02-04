"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ASSISTANT_AVATAR = exports.DEFAULT_ASSISTANT_NAME = void 0;
exports.normalizeAssistantIdentity = normalizeAssistantIdentity;
exports.resolveInjectedAssistantIdentity = resolveInjectedAssistantIdentity;
var MAX_ASSISTANT_NAME = 50;
var MAX_ASSISTANT_AVATAR = 200;
exports.DEFAULT_ASSISTANT_NAME = "Assistant";
exports.DEFAULT_ASSISTANT_AVATAR = "A";
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
function normalizeAssistantIdentity(input) {
    var _a, _b, _c;
    var name = (_a = coerceIdentityValue(input === null || input === void 0 ? void 0 : input.name, MAX_ASSISTANT_NAME)) !== null && _a !== void 0 ? _a : exports.DEFAULT_ASSISTANT_NAME;
    var avatar = (_c = coerceIdentityValue((_b = input === null || input === void 0 ? void 0 : input.avatar) !== null && _b !== void 0 ? _b : undefined, MAX_ASSISTANT_AVATAR)) !== null && _c !== void 0 ? _c : null;
    var agentId = typeof (input === null || input === void 0 ? void 0 : input.agentId) === "string" && input.agentId.trim() ? input.agentId.trim() : null;
    return { agentId: agentId, name: name, avatar: avatar };
}
function resolveInjectedAssistantIdentity() {
    if (typeof window === "undefined") {
        return normalizeAssistantIdentity({});
    }
    return normalizeAssistantIdentity({
        name: window.__OPENCLAW_ASSISTANT_NAME__,
        avatar: window.__OPENCLAW_ASSISTANT_AVATAR__,
    });
}
