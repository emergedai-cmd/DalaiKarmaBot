"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectZalouserStatusIssues = collectZalouserStatusIssues;
var isRecord = function (value) {
    return Boolean(value && typeof value === "object");
};
var asString = function (value) {
    return typeof value === "string" ? value : typeof value === "number" ? String(value) : undefined;
};
function readZalouserAccountStatus(value) {
    if (!isRecord(value)) {
        return null;
    }
    return {
        accountId: value.accountId,
        enabled: value.enabled,
        configured: value.configured,
        dmPolicy: value.dmPolicy,
        lastError: value.lastError,
    };
}
function isMissingZca(lastError) {
    if (!lastError) {
        return false;
    }
    var lower = lastError.toLowerCase();
    return lower.includes("zca") && (lower.includes("not found") || lower.includes("enoent"));
}
function collectZalouserStatusIssues(accounts) {
    var _a, _b;
    var issues = [];
    for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
        var entry = accounts_1[_i];
        var account = readZalouserAccountStatus(entry);
        if (!account) {
            continue;
        }
        var accountId = (_a = asString(account.accountId)) !== null && _a !== void 0 ? _a : "default";
        var enabled = account.enabled !== false;
        if (!enabled) {
            continue;
        }
        var configured = account.configured === true;
        var lastError = (_b = asString(account.lastError)) === null || _b === void 0 ? void 0 : _b.trim();
        if (!configured) {
            if (isMissingZca(lastError)) {
                issues.push({
                    channel: "zalouser",
                    accountId: accountId,
                    kind: "runtime",
                    message: "zca CLI not found in PATH.",
                    fix: "Install zca-cli and ensure it is on PATH for the Gateway process.",
                });
            }
            else {
                issues.push({
                    channel: "zalouser",
                    accountId: accountId,
                    kind: "auth",
                    message: "Not authenticated (no zca session).",
                    fix: "Run: openclaw channels login --channel zalouser",
                });
            }
            continue;
        }
        if (account.dmPolicy === "open") {
            issues.push({
                channel: "zalouser",
                accountId: accountId,
                kind: "config",
                message: 'Zalo Personal dmPolicy is "open", allowing any user to message the bot without pairing.',
                fix: 'Set channels.zalouser.dmPolicy to "pairing" or "allowlist" to restrict access.',
            });
        }
    }
    return issues;
}
