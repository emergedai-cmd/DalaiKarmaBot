"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSignalMessagingTarget = normalizeSignalMessagingTarget;
exports.looksLikeSignalTargetId = looksLikeSignalTargetId;
function normalizeSignalMessagingTarget(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return undefined;
    }
    var normalized = trimmed;
    if (normalized.toLowerCase().startsWith("signal:")) {
        normalized = normalized.slice("signal:".length).trim();
    }
    if (!normalized) {
        return undefined;
    }
    var lower = normalized.toLowerCase();
    if (lower.startsWith("group:")) {
        var id = normalized.slice("group:".length).trim();
        return id ? "group:".concat(id).toLowerCase() : undefined;
    }
    if (lower.startsWith("username:")) {
        var id = normalized.slice("username:".length).trim();
        return id ? "username:".concat(id).toLowerCase() : undefined;
    }
    if (lower.startsWith("u:")) {
        var id = normalized.slice("u:".length).trim();
        return id ? "username:".concat(id).toLowerCase() : undefined;
    }
    if (lower.startsWith("uuid:")) {
        var id = normalized.slice("uuid:".length).trim();
        return id ? id.toLowerCase() : undefined;
    }
    return normalized.toLowerCase();
}
// UUID pattern for signal-cli recipient IDs
var UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var UUID_COMPACT_PATTERN = /^[0-9a-f]{32}$/i;
function looksLikeSignalTargetId(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return false;
    }
    if (/^(signal:)?(group:|username:|u:)/i.test(trimmed)) {
        return true;
    }
    if (/^(signal:)?uuid:/i.test(trimmed)) {
        var stripped = trimmed
            .replace(/^signal:/i, "")
            .replace(/^uuid:/i, "")
            .trim();
        if (!stripped) {
            return false;
        }
        return UUID_PATTERN.test(stripped) || UUID_COMPACT_PATTERN.test(stripped);
    }
    // Accept UUIDs (used by signal-cli for reactions)
    if (UUID_PATTERN.test(trimmed) || UUID_COMPACT_PATTERN.test(trimmed)) {
        return true;
    }
    return /^\+?\d{3,}$/.test(trimmed);
}
