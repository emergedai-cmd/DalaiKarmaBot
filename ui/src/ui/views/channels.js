"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderChannels = renderChannels;
var lit_1 = require("lit");
var format_1 = require("../format");
var channels_config_1 = require("./channels.config");
var channels_discord_1 = require("./channels.discord");
var channels_googlechat_1 = require("./channels.googlechat");
var channels_imessage_1 = require("./channels.imessage");
var channels_nostr_1 = require("./channels.nostr");
var channels_shared_1 = require("./channels.shared");
var channels_signal_1 = require("./channels.signal");
var channels_slack_1 = require("./channels.slack");
var channels_telegram_1 = require("./channels.telegram");
var channels_whatsapp_1 = require("./channels.whatsapp");
function renderChannels(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var channels = (_a = props.snapshot) === null || _a === void 0 ? void 0 : _a.channels;
    var whatsapp = ((_b = channels === null || channels === void 0 ? void 0 : channels.whatsapp) !== null && _b !== void 0 ? _b : undefined);
    var telegram = ((_c = channels === null || channels === void 0 ? void 0 : channels.telegram) !== null && _c !== void 0 ? _c : undefined);
    var discord = ((_d = channels === null || channels === void 0 ? void 0 : channels.discord) !== null && _d !== void 0 ? _d : null);
    var googlechat = ((_e = channels === null || channels === void 0 ? void 0 : channels.googlechat) !== null && _e !== void 0 ? _e : null);
    var slack = ((_f = channels === null || channels === void 0 ? void 0 : channels.slack) !== null && _f !== void 0 ? _f : null);
    var signal = ((_g = channels === null || channels === void 0 ? void 0 : channels.signal) !== null && _g !== void 0 ? _g : null);
    var imessage = ((_h = channels === null || channels === void 0 ? void 0 : channels.imessage) !== null && _h !== void 0 ? _h : null);
    var nostr = ((_j = channels === null || channels === void 0 ? void 0 : channels.nostr) !== null && _j !== void 0 ? _j : null);
    var channelOrder = resolveChannelOrder(props.snapshot);
    var orderedChannels = channelOrder
        .map(function (key, index) { return ({
        key: key,
        enabled: (0, channels_shared_1.channelEnabled)(key, props),
        order: index,
    }); })
        .toSorted(function (a, b) {
        if (a.enabled !== b.enabled) {
            return a.enabled ? -1 : 1;
        }
        return a.order - b.order;
    });
    return (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    <section class=\"grid grid-cols-2\">\n      ", "\n    </section>\n\n    <section class=\"card\" style=\"margin-top: 18px;\">\n      <div class=\"row\" style=\"justify-content: space-between;\">\n        <div>\n          <div class=\"card-title\">Channel health</div>\n          <div class=\"card-sub\">Channel status snapshots from the gateway.</div>\n        </div>\n        <div class=\"muted\">", "</div>\n      </div>\n      ", "\n      <pre class=\"code-block\" style=\"margin-top: 12px;\">\n", "\n      </pre>\n    </section>\n  "], ["\n    <section class=\"grid grid-cols-2\">\n      ", "\n    </section>\n\n    <section class=\"card\" style=\"margin-top: 18px;\">\n      <div class=\"row\" style=\"justify-content: space-between;\">\n        <div>\n          <div class=\"card-title\">Channel health</div>\n          <div class=\"card-sub\">Channel status snapshots from the gateway.</div>\n        </div>\n        <div class=\"muted\">", "</div>\n      </div>\n      ", "\n      <pre class=\"code-block\" style=\"margin-top: 12px;\">\n", "\n      </pre>\n    </section>\n  "])), orderedChannels.map(function (channel) {
        var _a, _b;
        return renderChannel(channel.key, props, {
            whatsapp: whatsapp,
            telegram: telegram,
            discord: discord,
            googlechat: googlechat,
            slack: slack,
            signal: signal,
            imessage: imessage,
            nostr: nostr,
            channelAccounts: (_b = (_a = props.snapshot) === null || _a === void 0 ? void 0 : _a.channelAccounts) !== null && _b !== void 0 ? _b : null,
        });
    }), props.lastSuccessAt ? (0, format_1.formatAgo)(props.lastSuccessAt) : "n/a", props.lastError
        ? (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<div class=\"callout danger\" style=\"margin-top: 12px;\">\n            ", "\n          </div>"], ["<div class=\"callout danger\" style=\"margin-top: 12px;\">\n            ", "\n          </div>"])), props.lastError) : lit_1.nothing, props.snapshot ? JSON.stringify(props.snapshot, null, 2) : "No snapshot yet.");
}
function resolveChannelOrder(snapshot) {
    var _a, _b;
    if ((_a = snapshot === null || snapshot === void 0 ? void 0 : snapshot.channelMeta) === null || _a === void 0 ? void 0 : _a.length) {
        return snapshot.channelMeta.map(function (entry) { return entry.id; });
    }
    if ((_b = snapshot === null || snapshot === void 0 ? void 0 : snapshot.channelOrder) === null || _b === void 0 ? void 0 : _b.length) {
        return snapshot.channelOrder;
    }
    return ["whatsapp", "telegram", "discord", "googlechat", "slack", "signal", "imessage", "nostr"];
}
function renderChannel(key, props, data) {
    var _a, _b, _c, _d, _e, _f, _g;
    var accountCountLabel = (0, channels_shared_1.renderChannelAccountCount)(key, data.channelAccounts);
    switch (key) {
        case "whatsapp":
            return (0, channels_whatsapp_1.renderWhatsAppCard)({
                props: props,
                whatsapp: data.whatsapp,
                accountCountLabel: accountCountLabel,
            });
        case "telegram":
            return (0, channels_telegram_1.renderTelegramCard)({
                props: props,
                telegram: data.telegram,
                telegramAccounts: (_b = (_a = data.channelAccounts) === null || _a === void 0 ? void 0 : _a.telegram) !== null && _b !== void 0 ? _b : [],
                accountCountLabel: accountCountLabel,
            });
        case "discord":
            return (0, channels_discord_1.renderDiscordCard)({
                props: props,
                discord: data.discord,
                accountCountLabel: accountCountLabel,
            });
        case "googlechat":
            return (0, channels_googlechat_1.renderGoogleChatCard)({
                props: props,
                googlechat: data.googlechat,
                accountCountLabel: accountCountLabel,
            });
        case "slack":
            return (0, channels_slack_1.renderSlackCard)({
                props: props,
                slack: data.slack,
                accountCountLabel: accountCountLabel,
            });
        case "signal":
            return (0, channels_signal_1.renderSignalCard)({
                props: props,
                signal: data.signal,
                accountCountLabel: accountCountLabel,
            });
        case "imessage":
            return (0, channels_imessage_1.renderIMessageCard)({
                props: props,
                imessage: data.imessage,
                accountCountLabel: accountCountLabel,
            });
        case "nostr": {
            var nostrAccounts = (_d = (_c = data.channelAccounts) === null || _c === void 0 ? void 0 : _c.nostr) !== null && _d !== void 0 ? _d : [];
            var primaryAccount = nostrAccounts[0];
            var accountId_1 = (_e = primaryAccount === null || primaryAccount === void 0 ? void 0 : primaryAccount.accountId) !== null && _e !== void 0 ? _e : "default";
            var profile_1 = (_f = primaryAccount === null || primaryAccount === void 0 ? void 0 : primaryAccount.profile) !== null && _f !== void 0 ? _f : null;
            var showForm = props.nostrProfileAccountId === accountId_1 ? props.nostrProfileFormState : null;
            var profileFormCallbacks = showForm
                ? {
                    onFieldChange: props.onNostrProfileFieldChange,
                    onSave: props.onNostrProfileSave,
                    onImport: props.onNostrProfileImport,
                    onCancel: props.onNostrProfileCancel,
                    onToggleAdvanced: props.onNostrProfileToggleAdvanced,
                }
                : null;
            return (0, channels_nostr_1.renderNostrCard)({
                props: props,
                nostr: data.nostr,
                nostrAccounts: nostrAccounts,
                accountCountLabel: accountCountLabel,
                profileFormState: showForm,
                profileFormCallbacks: profileFormCallbacks,
                onEditProfile: function () { return props.onNostrProfileEdit(accountId_1, profile_1); },
            });
        }
        default:
            return renderGenericChannelCard(key, props, (_g = data.channelAccounts) !== null && _g !== void 0 ? _g : {});
    }
}
function renderGenericChannelCard(key, props, channelAccounts) {
    var _a, _b, _c;
    var label = resolveChannelLabel(props.snapshot, key);
    var status = (_b = (_a = props.snapshot) === null || _a === void 0 ? void 0 : _a.channels) === null || _b === void 0 ? void 0 : _b[key];
    var configured = typeof (status === null || status === void 0 ? void 0 : status.configured) === "boolean" ? status.configured : undefined;
    var running = typeof (status === null || status === void 0 ? void 0 : status.running) === "boolean" ? status.running : undefined;
    var connected = typeof (status === null || status === void 0 ? void 0 : status.connected) === "boolean" ? status.connected : undefined;
    var lastError = typeof (status === null || status === void 0 ? void 0 : status.lastError) === "string" ? status.lastError : undefined;
    var accounts = (_c = channelAccounts[key]) !== null && _c !== void 0 ? _c : [];
    var accountCountLabel = (0, channels_shared_1.renderChannelAccountCount)(key, channelAccounts);
    return (0, lit_1.html)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    <div class=\"card\">\n      <div class=\"card-title\">", "</div>\n      <div class=\"card-sub\">Channel status and configuration.</div>\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n    </div>\n  "], ["\n    <div class=\"card\">\n      <div class=\"card-title\">", "</div>\n      <div class=\"card-sub\">Channel status and configuration.</div>\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n    </div>\n  "])), label, accountCountLabel, accounts.length > 0
        ? (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n            <div class=\"account-card-list\">\n              ", "\n            </div>\n          "], ["\n            <div class=\"account-card-list\">\n              ", "\n            </div>\n          "])), accounts.map(function (account) { return renderGenericAccount(account); })) : (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n            <div class=\"status-list\" style=\"margin-top: 16px;\">\n              <div>\n                <span class=\"label\">Configured</span>\n                <span>", "</span>\n              </div>\n              <div>\n                <span class=\"label\">Running</span>\n                <span>", "</span>\n              </div>\n              <div>\n                <span class=\"label\">Connected</span>\n                <span>", "</span>\n              </div>\n            </div>\n          "], ["\n            <div class=\"status-list\" style=\"margin-top: 16px;\">\n              <div>\n                <span class=\"label\">Configured</span>\n                <span>", "</span>\n              </div>\n              <div>\n                <span class=\"label\">Running</span>\n                <span>", "</span>\n              </div>\n              <div>\n                <span class=\"label\">Connected</span>\n                <span>", "</span>\n              </div>\n            </div>\n          "])), configured == null ? "n/a" : configured ? "Yes" : "No", running == null ? "n/a" : running ? "Yes" : "No", connected == null ? "n/a" : connected ? "Yes" : "No"), lastError
        ? (0, lit_1.html)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["<div class=\"callout danger\" style=\"margin-top: 12px;\">\n            ", "\n          </div>"], ["<div class=\"callout danger\" style=\"margin-top: 12px;\">\n            ", "\n          </div>"])), lastError) : lit_1.nothing, (0, channels_config_1.renderChannelConfigSection)({ channelId: key, props: props }));
}
function resolveChannelMetaMap(snapshot) {
    var _a;
    if (!((_a = snapshot === null || snapshot === void 0 ? void 0 : snapshot.channelMeta) === null || _a === void 0 ? void 0 : _a.length)) {
        return {};
    }
    return Object.fromEntries(snapshot.channelMeta.map(function (entry) { return [entry.id, entry]; }));
}
function resolveChannelLabel(snapshot, key) {
    var _a, _b, _c;
    var meta = resolveChannelMetaMap(snapshot)[key];
    return (_c = (_a = meta === null || meta === void 0 ? void 0 : meta.label) !== null && _a !== void 0 ? _a : (_b = snapshot === null || snapshot === void 0 ? void 0 : snapshot.channelLabels) === null || _b === void 0 ? void 0 : _b[key]) !== null && _c !== void 0 ? _c : key;
}
var RECENT_ACTIVITY_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes
function hasRecentActivity(account) {
    if (!account.lastInboundAt) {
        return false;
    }
    return Date.now() - account.lastInboundAt < RECENT_ACTIVITY_THRESHOLD_MS;
}
function deriveRunningStatus(account) {
    if (account.running) {
        return "Yes";
    }
    // If we have recent inbound activity, the channel is effectively running
    if (hasRecentActivity(account)) {
        return "Active";
    }
    return "No";
}
function deriveConnectedStatus(account) {
    if (account.connected === true) {
        return "Yes";
    }
    if (account.connected === false) {
        return "No";
    }
    // If connected is null/undefined but we have recent activity, show as active
    if (hasRecentActivity(account)) {
        return "Active";
    }
    return "n/a";
}
function renderGenericAccount(account) {
    var runningStatus = deriveRunningStatus(account);
    var connectedStatus = deriveConnectedStatus(account);
    return (0, lit_1.html)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n    <div class=\"account-card\">\n      <div class=\"account-card-header\">\n        <div class=\"account-card-title\">", "</div>\n        <div class=\"account-card-id\">", "</div>\n      </div>\n      <div class=\"status-list account-card-status\">\n        <div>\n          <span class=\"label\">Running</span>\n          <span>", "</span>\n        </div>\n        <div>\n          <span class=\"label\">Configured</span>\n          <span>", "</span>\n        </div>\n        <div>\n          <span class=\"label\">Connected</span>\n          <span>", "</span>\n        </div>\n        <div>\n          <span class=\"label\">Last inbound</span>\n          <span>", "</span>\n        </div>\n        ", "\n      </div>\n    </div>\n  "], ["\n    <div class=\"account-card\">\n      <div class=\"account-card-header\">\n        <div class=\"account-card-title\">", "</div>\n        <div class=\"account-card-id\">", "</div>\n      </div>\n      <div class=\"status-list account-card-status\">\n        <div>\n          <span class=\"label\">Running</span>\n          <span>", "</span>\n        </div>\n        <div>\n          <span class=\"label\">Configured</span>\n          <span>", "</span>\n        </div>\n        <div>\n          <span class=\"label\">Connected</span>\n          <span>", "</span>\n        </div>\n        <div>\n          <span class=\"label\">Last inbound</span>\n          <span>", "</span>\n        </div>\n        ", "\n      </div>\n    </div>\n  "])), account.name || account.accountId, account.accountId, runningStatus, account.configured ? "Yes" : "No", connectedStatus, account.lastInboundAt ? (0, format_1.formatAgo)(account.lastInboundAt) : "n/a", account.lastError
        ? (0, lit_1.html)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n              <div class=\"account-card-error\">\n                ", "\n              </div>\n            "], ["\n              <div class=\"account-card-error\">\n                ", "\n              </div>\n            "])), account.lastError) : lit_1.nothing);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
