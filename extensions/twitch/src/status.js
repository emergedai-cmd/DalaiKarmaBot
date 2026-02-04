"use strict";
/**
 * Twitch status issues collector.
 *
 * Detects and reports configuration issues for Twitch accounts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectTwitchStatusIssues = collectTwitchStatusIssues;
var config_js_1 = require("./config.js");
var token_js_1 = require("./token.js");
var twitch_js_1 = require("./utils/twitch.js");
/**
 * Collect status issues for Twitch accounts.
 *
 * Analyzes account snapshots and detects configuration problems,
 * authentication issues, and other potential problems.
 *
 * @param accounts - Array of account snapshots to analyze
 * @param getCfg - Optional function to get full config for additional checks
 * @returns Array of detected status issues
 *
 * @example
 * const issues = collectTwitchStatusIssues(accountSnapshots);
 * if (issues.length > 0) {
 *   console.warn("Twitch configuration issues detected:");
 *   issues.forEach(issue => console.warn(`- ${issue.message}`));
 * }
 */
function collectTwitchStatusIssues(accounts, getCfg) {
    var _a, _b;
    var issues = [];
    for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
        var entry = accounts_1[_i];
        var accountId = entry.accountId;
        if (!accountId) {
            continue;
        }
        var account = null;
        var cfg = void 0;
        if (getCfg) {
            try {
                cfg = getCfg();
                account = (0, config_js_1.getAccountConfig)(cfg, accountId);
            }
            catch (_c) {
                // Ignore config access errors
            }
        }
        if (!entry.configured) {
            issues.push({
                channel: "twitch",
                accountId: accountId,
                kind: "config",
                message: "Twitch account is not properly configured",
                fix: "Add required fields: username, accessToken, and clientId to your account configuration",
            });
            continue;
        }
        if (entry.enabled === false) {
            issues.push({
                channel: "twitch",
                accountId: accountId,
                kind: "config",
                message: "Twitch account is disabled",
                fix: "Set enabled: true in your account configuration to enable this account",
            });
            continue;
        }
        if (account && account.username && account.accessToken && !account.clientId) {
            issues.push({
                channel: "twitch",
                accountId: accountId,
                kind: "config",
                message: "Twitch client ID is required",
                fix: "Add clientId to your Twitch account configuration (from Twitch Developer Portal)",
            });
        }
        var tokenResolution = cfg
            ? (0, token_js_1.resolveTwitchToken)(cfg, { accountId: accountId })
            : { token: "", source: "none" };
        if (account && (0, twitch_js_1.isAccountConfigured)(account, tokenResolution.token)) {
            if ((_a = account.accessToken) === null || _a === void 0 ? void 0 : _a.startsWith("oauth:")) {
                issues.push({
                    channel: "twitch",
                    accountId: accountId,
                    kind: "config",
                    message: "Token contains 'oauth:' prefix (will be stripped)",
                    fix: "The 'oauth:' prefix is optional. You can use just the token value, or keep it as-is (it will be normalized automatically).",
                });
            }
            if (account.clientSecret && !account.refreshToken) {
                issues.push({
                    channel: "twitch",
                    accountId: accountId,
                    kind: "config",
                    message: "clientSecret provided without refreshToken",
                    fix: "For automatic token refresh, provide both clientSecret and refreshToken. Otherwise, clientSecret is not needed.",
                });
            }
            if (account.allowFrom && account.allowFrom.length === 0) {
                issues.push({
                    channel: "twitch",
                    accountId: accountId,
                    kind: "config",
                    message: "allowFrom is configured but empty",
                    fix: "Either add user IDs to allowFrom, remove the allowFrom field, or use allowedRoles instead.",
                });
            }
            if (((_b = account.allowedRoles) === null || _b === void 0 ? void 0 : _b.includes("all")) &&
                account.allowFrom &&
                account.allowFrom.length > 0) {
                issues.push({
                    channel: "twitch",
                    accountId: accountId,
                    kind: "intent",
                    message: "allowedRoles is set to 'all' but allowFrom is also configured",
                    fix: "When allowedRoles is 'all', the allowFrom list is not needed. Remove allowFrom or set allowedRoles to specific roles.",
                });
            }
        }
        if (entry.lastError) {
            issues.push({
                channel: "twitch",
                accountId: accountId,
                kind: "runtime",
                message: "Last error: ".concat(entry.lastError),
                fix: "Check your token validity and network connection. Ensure the bot has the required OAuth scopes.",
            });
        }
        if (entry.configured &&
            !entry.running &&
            !entry.lastStartAt &&
            !entry.lastInboundAt &&
            !entry.lastOutboundAt) {
            issues.push({
                channel: "twitch",
                accountId: accountId,
                kind: "runtime",
                message: "Account has never connected successfully",
                fix: "Start the Twitch gateway to begin receiving messages. Check logs for connection errors.",
            });
        }
        if (entry.running && entry.lastStartAt) {
            var uptime = Date.now() - entry.lastStartAt;
            var daysSinceStart = uptime / (1000 * 60 * 60 * 24);
            if (daysSinceStart > 7) {
                issues.push({
                    channel: "twitch",
                    accountId: accountId,
                    kind: "runtime",
                    message: "Connection has been running for ".concat(Math.floor(daysSinceStart), " days"),
                    fix: "Consider restarting the connection periodically to refresh the connection. Twitch tokens may expire after long periods.",
                });
            }
        }
    }
    return issues;
}
