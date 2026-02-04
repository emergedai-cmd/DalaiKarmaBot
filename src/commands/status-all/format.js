"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDuration = exports.formatAge = void 0;
exports.formatGatewayAuthUsed = formatGatewayAuthUsed;
exports.redactSecrets = redactSecrets;
var formatAge = function (ms) {
    if (!ms || ms < 0) {
        return "unknown";
    }
    var minutes = Math.round(ms / 60000);
    if (minutes < 1) {
        return "just now";
    }
    if (minutes < 60) {
        return "".concat(minutes, "m ago");
    }
    var hours = Math.round(minutes / 60);
    if (hours < 48) {
        return "".concat(hours, "h ago");
    }
    var days = Math.round(hours / 24);
    return "".concat(days, "d ago");
};
exports.formatAge = formatAge;
var formatDuration = function (ms) {
    if (ms == null || !Number.isFinite(ms)) {
        return "unknown";
    }
    if (ms < 1000) {
        return "".concat(Math.round(ms), "ms");
    }
    return "".concat((ms / 1000).toFixed(1), "s");
};
exports.formatDuration = formatDuration;
function formatGatewayAuthUsed(auth) {
    var _a, _b;
    var hasToken = Boolean((_a = auth === null || auth === void 0 ? void 0 : auth.token) === null || _a === void 0 ? void 0 : _a.trim());
    var hasPassword = Boolean((_b = auth === null || auth === void 0 ? void 0 : auth.password) === null || _b === void 0 ? void 0 : _b.trim());
    if (hasToken && hasPassword) {
        return "token+password";
    }
    if (hasToken) {
        return "token";
    }
    if (hasPassword) {
        return "password";
    }
    return "none";
}
function redactSecrets(text) {
    if (!text) {
        return text;
    }
    var out = text;
    out = out.replace(/(\b(?:access[_-]?token|refresh[_-]?token|token|password|secret|api[_-]?key)\b\s*[:=]\s*)("?)([^"\\s]+)("?)/gi, "$1$2***$4");
    out = out.replace(/\bBearer\s+[A-Za-z0-9._-]+\b/g, "Bearer ***");
    out = out.replace(/\bsk-[A-Za-z0-9]{10,}\b/g, "sk-***");
    return out;
}
