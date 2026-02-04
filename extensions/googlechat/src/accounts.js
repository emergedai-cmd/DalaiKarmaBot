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
exports.listGoogleChatAccountIds = listGoogleChatAccountIds;
exports.resolveDefaultGoogleChatAccountId = resolveDefaultGoogleChatAccountId;
exports.resolveGoogleChatAccount = resolveGoogleChatAccount;
exports.listEnabledGoogleChatAccounts = listEnabledGoogleChatAccounts;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var ENV_SERVICE_ACCOUNT = "GOOGLE_CHAT_SERVICE_ACCOUNT";
var ENV_SERVICE_ACCOUNT_FILE = "GOOGLE_CHAT_SERVICE_ACCOUNT_FILE";
function listConfiguredAccountIds(cfg) {
    var _a, _b;
    var accounts = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a["googlechat"]) === null || _b === void 0 ? void 0 : _b.accounts;
    if (!accounts || typeof accounts !== "object") {
        return [];
    }
    return Object.keys(accounts).filter(Boolean);
}
function listGoogleChatAccountIds(cfg) {
    var ids = listConfiguredAccountIds(cfg);
    if (ids.length === 0) {
        return [plugin_sdk_1.DEFAULT_ACCOUNT_ID];
    }
    return ids.toSorted(function (a, b) { return a.localeCompare(b); });
}
function resolveDefaultGoogleChatAccountId(cfg) {
    var _a, _b, _c;
    var channel = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a["googlechat"];
    if ((_b = channel === null || channel === void 0 ? void 0 : channel.defaultAccount) === null || _b === void 0 ? void 0 : _b.trim()) {
        return channel.defaultAccount.trim();
    }
    var ids = listGoogleChatAccountIds(cfg);
    if (ids.includes(plugin_sdk_1.DEFAULT_ACCOUNT_ID)) {
        return plugin_sdk_1.DEFAULT_ACCOUNT_ID;
    }
    return (_c = ids[0]) !== null && _c !== void 0 ? _c : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
}
function resolveAccountConfig(cfg, accountId) {
    var _a, _b;
    var accounts = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a["googlechat"]) === null || _b === void 0 ? void 0 : _b.accounts;
    if (!accounts || typeof accounts !== "object") {
        return undefined;
    }
    return accounts[accountId];
}
function mergeGoogleChatAccountConfig(cfg, accountId) {
    var _a, _b, _c;
    var raw = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a["googlechat"]) !== null && _b !== void 0 ? _b : {};
    var _ignored = raw.accounts, _ignored2 = raw.defaultAccount, base = __rest(raw, ["accounts", "defaultAccount"]);
    var account = (_c = resolveAccountConfig(cfg, accountId)) !== null && _c !== void 0 ? _c : {};
    return __assign(__assign({}, base), account);
}
function parseServiceAccount(value) {
    if (value && typeof value === "object") {
        return value;
    }
    if (typeof value !== "string") {
        return null;
    }
    var trimmed = value.trim();
    if (!trimmed) {
        return null;
    }
    try {
        return JSON.parse(trimmed);
    }
    catch (_a) {
        return null;
    }
}
function resolveCredentialsFromConfig(params) {
    var _a, _b;
    var account = params.account, accountId = params.accountId;
    var inline = parseServiceAccount(account.serviceAccount);
    if (inline) {
        return { credentials: inline, source: "inline" };
    }
    var file = (_a = account.serviceAccountFile) === null || _a === void 0 ? void 0 : _a.trim();
    if (file) {
        return { credentialsFile: file, source: "file" };
    }
    if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
        var envJson = process.env[ENV_SERVICE_ACCOUNT];
        var envInline = parseServiceAccount(envJson);
        if (envInline) {
            return { credentials: envInline, source: "env" };
        }
        var envFile = (_b = process.env[ENV_SERVICE_ACCOUNT_FILE]) === null || _b === void 0 ? void 0 : _b.trim();
        if (envFile) {
            return { credentialsFile: envFile, source: "env" };
        }
    }
    return { source: "none" };
}
function resolveGoogleChatAccount(params) {
    var _a, _b, _c;
    var accountId = (0, plugin_sdk_1.normalizeAccountId)(params.accountId);
    var baseEnabled = ((_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a["googlechat"]) === null || _b === void 0 ? void 0 : _b.enabled) !== false;
    var merged = mergeGoogleChatAccountConfig(params.cfg, accountId);
    var accountEnabled = merged.enabled !== false;
    var enabled = baseEnabled && accountEnabled;
    var credentials = resolveCredentialsFromConfig({ accountId: accountId, account: merged });
    return {
        accountId: accountId,
        name: ((_c = merged.name) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
        enabled: enabled,
        config: merged,
        credentialSource: credentials.source,
        credentials: credentials.credentials,
        credentialsFile: credentials.credentialsFile,
    };
}
function listEnabledGoogleChatAccounts(cfg) {
    return listGoogleChatAccountIds(cfg)
        .map(function (accountId) { return resolveGoogleChatAccount({ cfg: cfg, accountId: accountId }); })
        .filter(function (account) { return account.enabled; });
}
