"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectZaloStatusIssues = collectZaloStatusIssues;
var isRecord = function (value) {
    return Boolean(value && typeof value === "object");
};
var asString = function (value) {
    return typeof value === "string" ? value : typeof value === "number" ? String(value) : undefined;
};
function readZaloAccountStatus(value) {
    if (!isRecord(value)) {
        return null;
    }
    return {
        accountId: value.accountId,
        enabled: value.enabled,
        configured: value.configured,
        dmPolicy: value.dmPolicy,
    };
}
function collectZaloStatusIssues(accounts) {
    var _a;
    var issues = [];
    for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
        var entry = accounts_1[_i];
        var account = readZaloAccountStatus(entry);
        if (!account) {
            continue;
        }
        var accountId = (_a = asString(account.accountId)) !== null && _a !== void 0 ? _a : "default";
        var enabled = account.enabled !== false;
        var configured = account.configured === true;
        if (!enabled || !configured) {
            continue;
        }
        if (account.dmPolicy === "open") {
            issues.push({
                channel: "zalo",
                accountId: accountId,
                kind: "config",
                message: 'Zalo dmPolicy is "open", allowing any user to message the bot without pairing.',
                fix: 'Set channels.zalo.dmPolicy to "pairing" or "allowlist" to restrict access.',
            });
        }
    }
    return issues;
}
