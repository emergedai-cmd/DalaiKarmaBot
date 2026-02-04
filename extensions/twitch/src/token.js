"use strict";
/**
 * Twitch access token resolution with environment variable support.
 *
 * Supports reading Twitch OAuth access tokens from config or environment variable.
 * The OPENCLAW_TWITCH_ACCESS_TOKEN env var is only used for the default account.
 *
 * Token resolution priority:
 * 1. Account access token from merged config (accounts.{id} or base-level for default)
 * 2. Environment variable: OPENCLAW_TWITCH_ACCESS_TOKEN (default account only)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTwitchToken = resolveTwitchToken;
var session_key_js_1 = require("../../../src/routing/session-key.js");
/**
 * Normalize a Twitch OAuth token - ensure it has the oauth: prefix
 */
function normalizeTwitchToken(raw) {
    if (!raw) {
        return undefined;
    }
    var trimmed = raw.trim();
    if (!trimmed) {
        return undefined;
    }
    // Twitch tokens should have oauth: prefix
    return trimmed.startsWith("oauth:") ? trimmed : "oauth:".concat(trimmed);
}
/**
 * Resolve Twitch access token from config or environment variable.
 *
 * Priority:
 * 1. Account access token (from merged config - base-level for default, or accounts.{accountId})
 * 2. Environment variable: OPENCLAW_TWITCH_ACCESS_TOKEN (default account only)
 *
 * The getAccountConfig function handles merging base-level config with accounts.default,
 * so this logic works for both simplified and multi-account patterns.
 *
 * @param cfg - OpenClaw config
 * @param opts - Options including accountId and optional envToken override
 * @returns Token resolution with source
 */
function resolveTwitchToken(cfg, opts) {
    var _a, _b, _c, _d;
    if (opts === void 0) { opts = {}; }
    var accountId = (0, session_key_js_1.normalizeAccountId)(opts.accountId);
    // Get merged account config (handles both simplified and multi-account patterns)
    var twitchCfg = (_a = cfg === null || cfg === void 0 ? void 0 : cfg.channels) === null || _a === void 0 ? void 0 : _a.twitch;
    var accountCfg = accountId === session_key_js_1.DEFAULT_ACCOUNT_ID
        ? (_b = twitchCfg === null || twitchCfg === void 0 ? void 0 : twitchCfg.accounts) === null || _b === void 0 ? void 0 : _b[session_key_js_1.DEFAULT_ACCOUNT_ID]
        : (_c = twitchCfg === null || twitchCfg === void 0 ? void 0 : twitchCfg.accounts) === null || _c === void 0 ? void 0 : _c[accountId];
    // For default account, also check base-level config
    var token;
    if (accountId === session_key_js_1.DEFAULT_ACCOUNT_ID) {
        // Base-level config takes precedence
        token = normalizeTwitchToken((typeof (twitchCfg === null || twitchCfg === void 0 ? void 0 : twitchCfg.accessToken) === "string" ? twitchCfg.accessToken : undefined) ||
            (accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.accessToken));
    }
    else {
        // Non-default accounts only use accounts object
        token = normalizeTwitchToken(accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.accessToken);
    }
    if (token) {
        return { token: token, source: "config" };
    }
    // Environment variable (default account only)
    var allowEnv = accountId === session_key_js_1.DEFAULT_ACCOUNT_ID;
    var envToken = allowEnv
        ? normalizeTwitchToken((_d = opts.envToken) !== null && _d !== void 0 ? _d : process.env.OPENCLAW_TWITCH_ACCESS_TOKEN)
        : undefined;
    if (envToken) {
        return { token: envToken, source: "env" };
    }
    return { token: "", source: "none" };
}
