"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectTelegramStatusIssues = collectTelegramStatusIssues;
var shared_js_1 = require("./shared.js");
function readTelegramAccountStatus(value) {
    if (!(0, shared_js_1.isRecord)(value)) {
        return null;
    }
    return {
        accountId: value.accountId,
        enabled: value.enabled,
        configured: value.configured,
        allowUnmentionedGroups: value.allowUnmentionedGroups,
        audit: value.audit,
    };
}
function readTelegramGroupMembershipAuditSummary(value) {
    if (!(0, shared_js_1.isRecord)(value)) {
        return {};
    }
    var unresolvedGroups = typeof value.unresolvedGroups === "number" && Number.isFinite(value.unresolvedGroups)
        ? value.unresolvedGroups
        : undefined;
    var hasWildcardUnmentionedGroups = typeof value.hasWildcardUnmentionedGroups === "boolean"
        ? value.hasWildcardUnmentionedGroups
        : undefined;
    var groupsRaw = value.groups;
    var groups = Array.isArray(groupsRaw)
        ? groupsRaw
            .map(function (entry) {
            var _a, _b, _c, _d;
            if (!(0, shared_js_1.isRecord)(entry)) {
                return null;
            }
            var chatId = (0, shared_js_1.asString)(entry.chatId);
            if (!chatId) {
                return null;
            }
            var ok = typeof entry.ok === "boolean" ? entry.ok : undefined;
            var status = (_a = (0, shared_js_1.asString)(entry.status)) !== null && _a !== void 0 ? _a : null;
            var error = (_b = (0, shared_js_1.asString)(entry.error)) !== null && _b !== void 0 ? _b : null;
            var matchKey = (_c = (0, shared_js_1.asString)(entry.matchKey)) !== null && _c !== void 0 ? _c : undefined;
            var matchSource = (_d = (0, shared_js_1.asString)(entry.matchSource)) !== null && _d !== void 0 ? _d : undefined;
            return { chatId: chatId, ok: ok, status: status, error: error, matchKey: matchKey, matchSource: matchSource };
        })
            .filter(Boolean)
        : undefined;
    return { unresolvedGroups: unresolvedGroups, hasWildcardUnmentionedGroups: hasWildcardUnmentionedGroups, groups: groups };
}
function collectTelegramStatusIssues(accounts) {
    var _a, _b;
    var issues = [];
    for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
        var entry = accounts_1[_i];
        var account = readTelegramAccountStatus(entry);
        if (!account) {
            continue;
        }
        var accountId = (_a = (0, shared_js_1.asString)(account.accountId)) !== null && _a !== void 0 ? _a : "default";
        var enabled = account.enabled !== false;
        var configured = account.configured === true;
        if (!enabled || !configured) {
            continue;
        }
        if (account.allowUnmentionedGroups === true) {
            issues.push({
                channel: "telegram",
                accountId: accountId,
                kind: "config",
                message: "Config allows unmentioned group messages (requireMention=false). Telegram Bot API privacy mode will block most group messages unless disabled.",
                fix: "In BotFather run /setprivacy → Disable for this bot (then restart the gateway).",
            });
        }
        var audit = readTelegramGroupMembershipAuditSummary(account.audit);
        if (audit.hasWildcardUnmentionedGroups === true) {
            issues.push({
                channel: "telegram",
                accountId: accountId,
                kind: "config",
                message: 'Telegram groups config uses "*" with requireMention=false; membership probing is not possible without explicit group IDs.',
                fix: "Add explicit numeric group ids under channels.telegram.groups (or per-account groups) to enable probing.",
            });
        }
        if (audit.unresolvedGroups && audit.unresolvedGroups > 0) {
            issues.push({
                channel: "telegram",
                accountId: accountId,
                kind: "config",
                message: "Some configured Telegram groups are not numeric IDs (unresolvedGroups=".concat(audit.unresolvedGroups, "). Membership probe can only check numeric group IDs."),
                fix: "Use numeric chat IDs (e.g. -100...) as keys in channels.telegram.groups for requireMention=false groups.",
            });
        }
        for (var _c = 0, _d = (_b = audit.groups) !== null && _b !== void 0 ? _b : []; _c < _d.length; _c++) {
            var group = _d[_c];
            if (group.ok === true) {
                continue;
            }
            var status_1 = group.status ? " status=".concat(group.status) : "";
            var err = group.error ? ": ".concat(group.error) : "";
            var baseMessage = "Group ".concat(group.chatId, " not reachable by bot.").concat(status_1).concat(err);
            issues.push({
                channel: "telegram",
                accountId: accountId,
                kind: "runtime",
                message: (0, shared_js_1.appendMatchMetadata)(baseMessage, {
                    matchKey: group.matchKey,
                    matchSource: group.matchSource,
                }),
                fix: "Invite the bot to the group, then DM the bot once (/start) and restart the gateway.",
            });
        }
    }
    return issues;
}
