"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTelegramMessagingTarget = normalizeTelegramMessagingTarget;
exports.looksLikeTelegramTargetId = looksLikeTelegramTargetId;
function normalizeTelegramMessagingTarget(raw) {
    var _a;
    var trimmed = raw.trim();
    if (!trimmed) {
        return undefined;
    }
    var normalized = trimmed;
    if (normalized.startsWith("telegram:")) {
        normalized = normalized.slice("telegram:".length).trim();
    }
    else if (normalized.startsWith("tg:")) {
        normalized = normalized.slice("tg:".length).trim();
    }
    if (!normalized) {
        return undefined;
    }
    var tmeMatch = (_a = /^https?:\/\/t\.me\/([A-Za-z0-9_]+)$/i.exec(normalized)) !== null && _a !== void 0 ? _a : /^t\.me\/([A-Za-z0-9_]+)$/i.exec(normalized);
    if (tmeMatch === null || tmeMatch === void 0 ? void 0 : tmeMatch[1]) {
        normalized = "@".concat(tmeMatch[1]);
    }
    if (!normalized) {
        return undefined;
    }
    return "telegram:".concat(normalized).toLowerCase();
}
function looksLikeTelegramTargetId(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return false;
    }
    if (/^(telegram|tg):/i.test(trimmed)) {
        return true;
    }
    if (trimmed.startsWith("@")) {
        return true;
    }
    return /^-?\d{6,}$/.test(trimmed);
}
