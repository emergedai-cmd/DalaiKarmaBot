"use strict";
/**
 * Twitch-specific utility functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTwitchChannel = normalizeTwitchChannel;
exports.missingTargetError = missingTargetError;
exports.generateMessageId = generateMessageId;
exports.normalizeToken = normalizeToken;
exports.isAccountConfigured = isAccountConfigured;
/**
 * Normalize Twitch channel names.
 *
 * Removes the '#' prefix if present, converts to lowercase, and trims whitespace.
 * Twitch channel names are case-insensitive and don't use the '#' prefix in the API.
 *
 * @param channel - The channel name to normalize
 * @returns Normalized channel name
 *
 * @example
 * normalizeTwitchChannel("#TwitchChannel") // "twitchchannel"
 * normalizeTwitchChannel("MyChannel") // "mychannel"
 */
function normalizeTwitchChannel(channel) {
    var trimmed = channel.trim().toLowerCase();
    return trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
}
/**
 * Create a standardized error message for missing target.
 *
 * @param provider - The provider name (e.g., "Twitch")
 * @param hint - Optional hint for how to fix the issue
 * @returns Error object with descriptive message
 */
function missingTargetError(provider, hint) {
    return new Error("Delivering to ".concat(provider, " requires target").concat(hint ? " ".concat(hint) : ""));
}
/**
 * Generate a unique message ID for Twitch messages.
 *
 * Twurple's say() doesn't return the message ID, so we generate one
 * for tracking purposes.
 *
 * @returns A unique message ID
 */
function generateMessageId() {
    return "".concat(Date.now(), "-").concat(Math.random().toString(36).substring(2, 15));
}
/**
 * Normalize OAuth token by removing the "oauth:" prefix if present.
 *
 * Twurple doesn't require the "oauth:" prefix, so we strip it for consistency.
 *
 * @param token - The OAuth token to normalize
 * @returns Normalized token without "oauth:" prefix
 *
 * @example
 * normalizeToken("oauth:abc123") // "abc123"
 * normalizeToken("abc123") // "abc123"
 */
function normalizeToken(token) {
    return token.startsWith("oauth:") ? token.slice(6) : token;
}
/**
 * Check if an account is properly configured with required credentials.
 *
 * @param account - The Twitch account config to check
 * @returns true if the account has required credentials
 */
function isAccountConfigured(account, resolvedToken) {
    var token = resolvedToken !== null && resolvedToken !== void 0 ? resolvedToken : account === null || account === void 0 ? void 0 : account.accessToken;
    return Boolean((account === null || account === void 0 ? void 0 : account.username) && token && (account === null || account === void 0 ? void 0 : account.clientId));
}
