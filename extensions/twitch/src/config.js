"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ACCOUNT_ID = void 0;
exports.getAccountConfig = getAccountConfig;
exports.listAccountIds = listAccountIds;
/**
 * Default account ID for Twitch
 */
exports.DEFAULT_ACCOUNT_ID = "default";
/**
 * Get account config from core config
 *
 * Handles two patterns:
 * 1. Simplified single-account: base-level properties create implicit "default" account
 * 2. Multi-account: explicit accounts object
 *
 * For "default" account, base-level properties take precedence over accounts.default
 * For other accounts, only the accounts object is checked
 */
function getAccountConfig(coreConfig, accountId) {
    var _a;
    if (!coreConfig || typeof coreConfig !== "object") {
        return null;
    }
    var cfg = coreConfig;
    var twitch = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.twitch;
    // Access accounts via unknown to handle union type (single-account vs multi-account)
    var twitchRaw = twitch;
    var accounts = twitchRaw === null || twitchRaw === void 0 ? void 0 : twitchRaw.accounts;
    // For default account, check base-level config first
    if (accountId === exports.DEFAULT_ACCOUNT_ID) {
        var accountFromAccounts = accounts === null || accounts === void 0 ? void 0 : accounts[exports.DEFAULT_ACCOUNT_ID];
        // Base-level properties that can form an implicit default account
        var baseLevel = {
            username: typeof (twitchRaw === null || twitchRaw === void 0 ? void 0 : twitchRaw.username) === "string" ? twitchRaw.username : undefined,
            accessToken: typeof (twitchRaw === null || twitchRaw === void 0 ? void 0 : twitchRaw.accessToken) === "string" ? twitchRaw.accessToken : undefined,
            clientId: typeof (twitchRaw === null || twitchRaw === void 0 ? void 0 : twitchRaw.clientId) === "string" ? twitchRaw.clientId : undefined,
            channel: typeof (twitchRaw === null || twitchRaw === void 0 ? void 0 : twitchRaw.channel) === "string" ? twitchRaw.channel : undefined,
            enabled: typeof (twitchRaw === null || twitchRaw === void 0 ? void 0 : twitchRaw.enabled) === "boolean" ? twitchRaw.enabled : undefined,
            allowFrom: Array.isArray(twitchRaw === null || twitchRaw === void 0 ? void 0 : twitchRaw.allowFrom) ? twitchRaw.allowFrom : undefined,
            allowedRoles: Array.isArray(twitchRaw === null || twitchRaw === void 0 ? void 0 : twitchRaw.allowedRoles) ? twitchRaw.allowedRoles : undefined,
            requireMention: typeof (twitchRaw === null || twitchRaw === void 0 ? void 0 : twitchRaw.requireMention) === "boolean" ? twitchRaw.requireMention : undefined,
            clientSecret: typeof (twitchRaw === null || twitchRaw === void 0 ? void 0 : twitchRaw.clientSecret) === "string" ? twitchRaw.clientSecret : undefined,
            refreshToken: typeof (twitchRaw === null || twitchRaw === void 0 ? void 0 : twitchRaw.refreshToken) === "string" ? twitchRaw.refreshToken : undefined,
            expiresIn: typeof (twitchRaw === null || twitchRaw === void 0 ? void 0 : twitchRaw.expiresIn) === "number" ? twitchRaw.expiresIn : undefined,
            obtainmentTimestamp: typeof (twitchRaw === null || twitchRaw === void 0 ? void 0 : twitchRaw.obtainmentTimestamp) === "number"
                ? twitchRaw.obtainmentTimestamp
                : undefined,
        };
        // Merge: base-level takes precedence over accounts.default
        var merged = __assign(__assign({}, accountFromAccounts), baseLevel);
        // Only return if we have at least username
        if (merged.username) {
            return merged;
        }
        // Fall through to accounts.default if no base-level username
        if (accountFromAccounts) {
            return accountFromAccounts;
        }
        return null;
    }
    // For non-default accounts, only check accounts object
    if (!accounts || !accounts[accountId]) {
        return null;
    }
    return accounts[accountId];
}
/**
 * List all configured account IDs
 *
 * Includes both explicit accounts and implicit "default" from base-level config
 */
function listAccountIds(cfg) {
    var _a;
    var twitch = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.twitch;
    // Access accounts via unknown to handle union type (single-account vs multi-account)
    var twitchRaw = twitch;
    var accountMap = twitchRaw === null || twitchRaw === void 0 ? void 0 : twitchRaw.accounts;
    var ids = [];
    // Add explicit accounts
    if (accountMap) {
        ids.push.apply(ids, Object.keys(accountMap));
    }
    // Add implicit "default" if base-level config exists and "default" not already present
    var hasBaseLevelConfig = twitchRaw &&
        (typeof twitchRaw.username === "string" ||
            typeof twitchRaw.accessToken === "string" ||
            typeof twitchRaw.channel === "string");
    if (hasBaseLevelConfig && !ids.includes(exports.DEFAULT_ACCOUNT_ID)) {
        ids.push(exports.DEFAULT_ACCOUNT_ID);
    }
    return ids;
}
