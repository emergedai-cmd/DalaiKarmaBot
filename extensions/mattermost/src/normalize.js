"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeMattermostMessagingTarget = normalizeMattermostMessagingTarget;
exports.looksLikeMattermostTargetId = looksLikeMattermostTargetId;
function normalizeMattermostMessagingTarget(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return undefined;
    }
    var lower = trimmed.toLowerCase();
    if (lower.startsWith("channel:")) {
        var id = trimmed.slice("channel:".length).trim();
        return id ? "channel:".concat(id) : undefined;
    }
    if (lower.startsWith("group:")) {
        var id = trimmed.slice("group:".length).trim();
        return id ? "channel:".concat(id) : undefined;
    }
    if (lower.startsWith("user:")) {
        var id = trimmed.slice("user:".length).trim();
        return id ? "user:".concat(id) : undefined;
    }
    if (lower.startsWith("mattermost:")) {
        var id = trimmed.slice("mattermost:".length).trim();
        return id ? "user:".concat(id) : undefined;
    }
    if (trimmed.startsWith("@")) {
        var id = trimmed.slice(1).trim();
        return id ? "@".concat(id) : undefined;
    }
    if (trimmed.startsWith("#")) {
        var id = trimmed.slice(1).trim();
        return id ? "channel:".concat(id) : undefined;
    }
    return "channel:".concat(trimmed);
}
function looksLikeMattermostTargetId(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return false;
    }
    if (/^(user|channel|group|mattermost):/i.test(trimmed)) {
        return true;
    }
    if (/^[@#]/.test(trimmed)) {
        return true;
    }
    return /^[a-z0-9]{8,}$/i.test(trimmed);
}
