"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordMSTeamsSentMessage = recordMSTeamsSentMessage;
exports.wasMSTeamsMessageSent = wasMSTeamsMessageSent;
exports.clearMSTeamsSentMessageCache = clearMSTeamsSentMessageCache;
var TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
var sentMessages = new Map();
function cleanupExpired(entry) {
    var now = Date.now();
    for (var _i = 0, _a = entry.timestamps; _i < _a.length; _i++) {
        var _b = _a[_i], msgId = _b[0], timestamp = _b[1];
        if (now - timestamp > TTL_MS) {
            entry.messageIds.delete(msgId);
            entry.timestamps.delete(msgId);
        }
    }
}
function recordMSTeamsSentMessage(conversationId, messageId) {
    if (!conversationId || !messageId) {
        return;
    }
    var entry = sentMessages.get(conversationId);
    if (!entry) {
        entry = { messageIds: new Set(), timestamps: new Map() };
        sentMessages.set(conversationId, entry);
    }
    entry.messageIds.add(messageId);
    entry.timestamps.set(messageId, Date.now());
    if (entry.messageIds.size > 200) {
        cleanupExpired(entry);
    }
}
function wasMSTeamsMessageSent(conversationId, messageId) {
    var entry = sentMessages.get(conversationId);
    if (!entry) {
        return false;
    }
    cleanupExpired(entry);
    return entry.messageIds.has(messageId);
}
function clearMSTeamsSentMessageCache() {
    sentMessages.clear();
}
