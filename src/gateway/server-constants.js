"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEDUPE_MAX = exports.DEDUPE_TTL_MS = exports.HEALTH_REFRESH_INTERVAL_MS = exports.TICK_INTERVAL_MS = exports.getHandshakeTimeoutMs = exports.DEFAULT_HANDSHAKE_TIMEOUT_MS = exports.__setMaxChatHistoryMessagesBytesForTest = exports.getMaxChatHistoryMessagesBytes = exports.MAX_BUFFERED_BYTES = exports.MAX_PAYLOAD_BYTES = void 0;
exports.MAX_PAYLOAD_BYTES = 512 * 1024; // cap incoming frame size
exports.MAX_BUFFERED_BYTES = 1.5 * 1024 * 1024; // per-connection send buffer limit
var DEFAULT_MAX_CHAT_HISTORY_MESSAGES_BYTES = 6 * 1024 * 1024; // keep history responses comfortably under client WS limits
var maxChatHistoryMessagesBytes = DEFAULT_MAX_CHAT_HISTORY_MESSAGES_BYTES;
var getMaxChatHistoryMessagesBytes = function () { return maxChatHistoryMessagesBytes; };
exports.getMaxChatHistoryMessagesBytes = getMaxChatHistoryMessagesBytes;
var __setMaxChatHistoryMessagesBytesForTest = function (value) {
    if (!process.env.VITEST && process.env.NODE_ENV !== "test") {
        return;
    }
    if (value === undefined) {
        maxChatHistoryMessagesBytes = DEFAULT_MAX_CHAT_HISTORY_MESSAGES_BYTES;
        return;
    }
    if (Number.isFinite(value) && value > 0) {
        maxChatHistoryMessagesBytes = value;
    }
};
exports.__setMaxChatHistoryMessagesBytesForTest = __setMaxChatHistoryMessagesBytesForTest;
exports.DEFAULT_HANDSHAKE_TIMEOUT_MS = 10000;
var getHandshakeTimeoutMs = function () {
    if (process.env.VITEST && process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS) {
        var parsed = Number(process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS);
        if (Number.isFinite(parsed) && parsed > 0) {
            return parsed;
        }
    }
    return exports.DEFAULT_HANDSHAKE_TIMEOUT_MS;
};
exports.getHandshakeTimeoutMs = getHandshakeTimeoutMs;
exports.TICK_INTERVAL_MS = 30000;
exports.HEALTH_REFRESH_INTERVAL_MS = 60000;
exports.DEDUPE_TTL_MS = 5 * 60000;
exports.DEDUPE_MAX = 1000;
