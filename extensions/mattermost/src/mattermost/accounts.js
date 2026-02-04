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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMattermostAccountIds = listMattermostAccountIds;
exports.resolveDefaultMattermostAccountId = resolveDefaultMattermostAccountId;
exports.resolveMattermostAccount = resolveMattermostAccount;
exports.listEnabledMattermostAccounts = listEnabledMattermostAccounts;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var client_js_1 = require("./client.js");
function listConfiguredAccountIds(cfg) {
    var _a, _b;
    var accounts = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.mattermost) === null || _b === void 0 ? void 0 : _b.accounts;
    if (!accounts || typeof accounts !== "object") {
        return [];
    }
    return Object.keys(accounts).filter(Boolean);
}
function listMattermostAccountIds(cfg) {
    var ids = listConfiguredAccountIds(cfg);
    if (ids.length === 0) {
        return [plugin_sdk_1.DEFAULT_ACCOUNT_ID];
    }
    return ids.toSorted(function (a, b) { return a.localeCompare(b); });
}
function resolveDefaultMattermostAccountId(cfg) {
    var _a;
    var ids = listMattermostAccountIds(cfg);
    if (ids.includes(plugin_sdk_1.DEFAULT_ACCOUNT_ID)) {
        return plugin_sdk_1.DEFAULT_ACCOUNT_ID;
    }
    return (_a = ids[0]) !== null && _a !== void 0 ? _a : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
}
function resolveAccountConfig(cfg, accountId) {
    var _a, _b;
    var accounts = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.mattermost) === null || _b === void 0 ? void 0 : _b.accounts;
    if (!accounts || typeof accounts !== "object") {
        return undefined;
    }
    return accounts[accountId];
}
function mergeMattermostAccountConfig(cfg, accountId) {
    var _a, _b, _c;
    var _d = ((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.mattermost) !== null && _b !== void 0 ? _b : {}), _ignored = _d.accounts, base = __rest(_d, ["accounts"]);
    var account = (_c = resolveAccountConfig(cfg, accountId)) !== null && _c !== void 0 ? _c : {};
    return __assign(__assign({}, base), account);
}
function resolveMattermostRequireMention(config) {
    if (config.chatmode === "oncall") {
        return true;
    }
    if (config.chatmode === "onmessage") {
        return false;
    }
    if (config.chatmode === "onchar") {
        return true;
    }
    return config.requireMention;
}
function resolveMattermostAccount(params) {
    var _a, _b, _c, _d, _e, _f, _g;
    var accountId = (0, plugin_sdk_1.normalizeAccountId)(params.accountId);
    var baseEnabled = ((_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.mattermost) === null || _b === void 0 ? void 0 : _b.enabled) !== false;
    var merged = mergeMattermostAccountConfig(params.cfg, accountId);
    var accountEnabled = merged.enabled !== false;
    var enabled = baseEnabled && accountEnabled;
    var allowEnv = accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID;
    var envToken = allowEnv ? (_c = process.env.MATTERMOST_BOT_TOKEN) === null || _c === void 0 ? void 0 : _c.trim() : undefined;
    var envUrl = allowEnv ? (_d = process.env.MATTERMOST_URL) === null || _d === void 0 ? void 0 : _d.trim() : undefined;
    var configToken = (_e = merged.botToken) === null || _e === void 0 ? void 0 : _e.trim();
    var configUrl = (_f = merged.baseUrl) === null || _f === void 0 ? void 0 : _f.trim();
    var botToken = configToken || envToken;
    var baseUrl = (0, client_js_1.normalizeMattermostBaseUrl)(configUrl || envUrl);
    var requireMention = resolveMattermostRequireMention(merged);
    var botTokenSource = configToken ? "config" : envToken ? "env" : "none";
    var baseUrlSource = configUrl ? "config" : envUrl ? "env" : "none";
    return {
        accountId: accountId,
        enabled: enabled,
        name: ((_g = merged.name) === null || _g === void 0 ? void 0 : _g.trim()) || undefined,
        botToken: botToken,
        baseUrl: baseUrl,
        botTokenSource: botTokenSource,
        baseUrlSource: baseUrlSource,
        config: merged,
        chatmode: merged.chatmode,
        oncharPrefixes: merged.oncharPrefixes,
        requireMention: requireMention,
        textChunkLimit: merged.textChunkLimit,
        blockStreaming: merged.blockStreaming,
        blockStreamingCoalesce: merged.blockStreamingCoalesce,
    };
}
function listEnabledMattermostAccounts(cfg) {
    return listMattermostAccountIds(cfg)
        .map(function (accountId) { return resolveMattermostAccount({ cfg: cfg, accountId: accountId }); })
        .filter(function (account) { return account.enabled; });
}
