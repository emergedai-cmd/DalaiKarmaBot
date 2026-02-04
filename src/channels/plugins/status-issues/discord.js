"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectDiscordStatusIssues = collectDiscordStatusIssues;
var shared_js_1 = require("./shared.js");
function readDiscordAccountStatus(value) {
    if (!(0, shared_js_1.isRecord)(value)) {
        return null;
    }
    return {
        accountId: value.accountId,
        enabled: value.enabled,
        configured: value.configured,
        application: value.application,
        audit: value.audit,
    };
}
function readDiscordApplicationSummary(value) {
    if (!(0, shared_js_1.isRecord)(value)) {
        return {};
    }
    var intentsRaw = value.intents;
    if (!(0, shared_js_1.isRecord)(intentsRaw)) {
        return {};
    }
    return {
        intents: {
            messageContent: intentsRaw.messageContent === "enabled" ||
                intentsRaw.messageContent === "limited" ||
                intentsRaw.messageContent === "disabled"
                ? intentsRaw.messageContent
                : undefined,
        },
    };
}
function readDiscordPermissionsAuditSummary(value) {
    if (!(0, shared_js_1.isRecord)(value)) {
        return {};
    }
    var unresolvedChannels = typeof value.unresolvedChannels === "number" && Number.isFinite(value.unresolvedChannels)
        ? value.unresolvedChannels
        : undefined;
    var channelsRaw = value.channels;
    var channels = Array.isArray(channelsRaw)
        ? channelsRaw
            .map(function (entry) {
            var _a, _b, _c;
            if (!(0, shared_js_1.isRecord)(entry)) {
                return null;
            }
            var channelId = (0, shared_js_1.asString)(entry.channelId);
            if (!channelId) {
                return null;
            }
            var ok = typeof entry.ok === "boolean" ? entry.ok : undefined;
            var missing = Array.isArray(entry.missing)
                ? entry.missing.map(function (v) { return (0, shared_js_1.asString)(v); }).filter(Boolean)
                : undefined;
            var error = (_a = (0, shared_js_1.asString)(entry.error)) !== null && _a !== void 0 ? _a : null;
            var matchKey = (_b = (0, shared_js_1.asString)(entry.matchKey)) !== null && _b !== void 0 ? _b : undefined;
            var matchSource = (_c = (0, shared_js_1.asString)(entry.matchSource)) !== null && _c !== void 0 ? _c : undefined;
            return {
                channelId: channelId,
                ok: ok,
                missing: (missing === null || missing === void 0 ? void 0 : missing.length) ? missing : undefined,
                error: error,
                matchKey: matchKey,
                matchSource: matchSource,
            };
        })
            .filter(Boolean)
        : undefined;
    return { unresolvedChannels: unresolvedChannels, channels: channels };
}
function collectDiscordStatusIssues(accounts) {
    var _a, _b, _c, _d;
    var issues = [];
    for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
        var entry = accounts_1[_i];
        var account = readDiscordAccountStatus(entry);
        if (!account) {
            continue;
        }
        var accountId = (_a = (0, shared_js_1.asString)(account.accountId)) !== null && _a !== void 0 ? _a : "default";
        var enabled = account.enabled !== false;
        var configured = account.configured === true;
        if (!enabled || !configured) {
            continue;
        }
        var app = readDiscordApplicationSummary(account.application);
        var messageContent = (_b = app.intents) === null || _b === void 0 ? void 0 : _b.messageContent;
        if (messageContent === "disabled") {
            issues.push({
                channel: "discord",
                accountId: accountId,
                kind: "intent",
                message: "Message Content Intent is disabled. Bot may not see normal channel messages.",
                fix: "Enable Message Content Intent in Discord Dev Portal → Bot → Privileged Gateway Intents, or require mention-only operation.",
            });
        }
        var audit = readDiscordPermissionsAuditSummary(account.audit);
        if (audit.unresolvedChannels && audit.unresolvedChannels > 0) {
            issues.push({
                channel: "discord",
                accountId: accountId,
                kind: "config",
                message: "Some configured guild channels are not numeric IDs (unresolvedChannels=".concat(audit.unresolvedChannels, "). Permission audit can only check numeric channel IDs."),
                fix: "Use numeric channel IDs as keys in channels.discord.guilds.*.channels (then rerun channels status --probe).",
            });
        }
        for (var _e = 0, _f = (_c = audit.channels) !== null && _c !== void 0 ? _c : []; _e < _f.length; _e++) {
            var channel = _f[_e];
            if (channel.ok === true) {
                continue;
            }
            var missing = ((_d = channel.missing) === null || _d === void 0 ? void 0 : _d.length) ? " missing ".concat(channel.missing.join(", ")) : "";
            var error = channel.error ? ": ".concat(channel.error) : "";
            var baseMessage = "Channel ".concat(channel.channelId, " permission check failed.").concat(missing).concat(error);
            issues.push({
                channel: "discord",
                accountId: accountId,
                kind: "permissions",
                message: (0, shared_js_1.appendMatchMetadata)(baseMessage, {
                    matchKey: channel.matchKey,
                    matchSource: channel.matchSource,
                }),
                fix: "Ensure the bot role can view + send in this channel (and that channel overrides don't deny it).",
            });
        }
    }
    return issues;
}
