"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeNextcloudTalkMessagingTarget = normalizeNextcloudTalkMessagingTarget;
exports.looksLikeNextcloudTalkTargetId = looksLikeNextcloudTalkTargetId;
function normalizeNextcloudTalkMessagingTarget(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return undefined;
    }
    var normalized = trimmed;
    if (normalized.startsWith("nextcloud-talk:")) {
        normalized = normalized.slice("nextcloud-talk:".length).trim();
    }
    else if (normalized.startsWith("nc-talk:")) {
        normalized = normalized.slice("nc-talk:".length).trim();
    }
    else if (normalized.startsWith("nc:")) {
        normalized = normalized.slice("nc:".length).trim();
    }
    if (normalized.startsWith("room:")) {
        normalized = normalized.slice("room:".length).trim();
    }
    if (!normalized) {
        return undefined;
    }
    return "nextcloud-talk:".concat(normalized).toLowerCase();
}
function looksLikeNextcloudTalkTargetId(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return false;
    }
    if (/^(nextcloud-talk|nc-talk|nc):/i.test(trimmed)) {
        return true;
    }
    return /^[a-z0-9]{8,}$/i.test(trimmed);
}
