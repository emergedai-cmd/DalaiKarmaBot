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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNextcloudTalkAccountIds = listNextcloudTalkAccountIds;
exports.resolveDefaultNextcloudTalkAccountId = resolveDefaultNextcloudTalkAccountId;
exports.resolveNextcloudTalkAccount = resolveNextcloudTalkAccount;
exports.listEnabledNextcloudTalkAccounts = listEnabledNextcloudTalkAccounts;
var node_fs_1 = require("node:fs");
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var TRUTHY_ENV = new Set(["true", "1", "yes", "on"]);
function isTruthyEnvValue(value) {
    if (!value) {
        return false;
    }
    return TRUTHY_ENV.has(value.trim().toLowerCase());
}
var debugAccounts = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (isTruthyEnvValue(process.env.OPENCLAW_DEBUG_NEXTCLOUD_TALK_ACCOUNTS)) {
        console.warn.apply(console, __spreadArray(["[nextcloud-talk:accounts]"], args, false));
    }
};
function listConfiguredAccountIds(cfg) {
    var _a, _b;
    var accounts = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a["nextcloud-talk"]) === null || _b === void 0 ? void 0 : _b.accounts;
    if (!accounts || typeof accounts !== "object") {
        return [];
    }
    var ids = new Set();
    for (var _i = 0, _c = Object.keys(accounts); _i < _c.length; _i++) {
        var key = _c[_i];
        if (!key) {
            continue;
        }
        ids.add((0, plugin_sdk_1.normalizeAccountId)(key));
    }
    return __spreadArray([], ids, true);
}
function listNextcloudTalkAccountIds(cfg) {
    var ids = listConfiguredAccountIds(cfg);
    debugAccounts("listNextcloudTalkAccountIds", ids);
    if (ids.length === 0) {
        return [plugin_sdk_1.DEFAULT_ACCOUNT_ID];
    }
    return ids.toSorted(function (a, b) { return a.localeCompare(b); });
}
function resolveDefaultNextcloudTalkAccountId(cfg) {
    var _a;
    var ids = listNextcloudTalkAccountIds(cfg);
    if (ids.includes(plugin_sdk_1.DEFAULT_ACCOUNT_ID)) {
        return plugin_sdk_1.DEFAULT_ACCOUNT_ID;
    }
    return (_a = ids[0]) !== null && _a !== void 0 ? _a : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
}
function resolveAccountConfig(cfg, accountId) {
    var _a, _b;
    var accounts = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a["nextcloud-talk"]) === null || _b === void 0 ? void 0 : _b.accounts;
    if (!accounts || typeof accounts !== "object") {
        return undefined;
    }
    var direct = accounts[accountId];
    if (direct) {
        return direct;
    }
    var normalized = (0, plugin_sdk_1.normalizeAccountId)(accountId);
    var matchKey = Object.keys(accounts).find(function (key) { return (0, plugin_sdk_1.normalizeAccountId)(key) === normalized; });
    return matchKey ? accounts[matchKey] : undefined;
}
function mergeNextcloudTalkAccountConfig(cfg, accountId) {
    var _a, _b, _c;
    var _d = ((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a["nextcloud-talk"]) !== null && _b !== void 0 ? _b : {}), _ignored = _d.accounts, base = __rest(_d, ["accounts"]);
    var account = (_c = resolveAccountConfig(cfg, accountId)) !== null && _c !== void 0 ? _c : {};
    return __assign(__assign({}, base), account);
}
function resolveNextcloudTalkSecret(cfg, opts) {
    var _a, _b, _c;
    var merged = mergeNextcloudTalkAccountConfig(cfg, (_a = opts.accountId) !== null && _a !== void 0 ? _a : plugin_sdk_1.DEFAULT_ACCOUNT_ID);
    var envSecret = (_b = process.env.NEXTCLOUD_TALK_BOT_SECRET) === null || _b === void 0 ? void 0 : _b.trim();
    if (envSecret && (!opts.accountId || opts.accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID)) {
        return { secret: envSecret, source: "env" };
    }
    if (merged.botSecretFile) {
        try {
            var fileSecret = (0, node_fs_1.readFileSync)(merged.botSecretFile, "utf-8").trim();
            if (fileSecret) {
                return { secret: fileSecret, source: "secretFile" };
            }
        }
        catch (_d) {
            // File not found or unreadable, fall through.
        }
    }
    if ((_c = merged.botSecret) === null || _c === void 0 ? void 0 : _c.trim()) {
        return { secret: merged.botSecret.trim(), source: "config" };
    }
    return { secret: "", source: "none" };
}
function resolveNextcloudTalkAccount(params) {
    var _a, _b, _c;
    var hasExplicitAccountId = Boolean((_a = params.accountId) === null || _a === void 0 ? void 0 : _a.trim());
    var baseEnabled = ((_c = (_b = params.cfg.channels) === null || _b === void 0 ? void 0 : _b["nextcloud-talk"]) === null || _c === void 0 ? void 0 : _c.enabled) !== false;
    var resolve = function (accountId) {
        var _a, _b, _c, _d;
        var merged = mergeNextcloudTalkAccountConfig(params.cfg, accountId);
        var accountEnabled = merged.enabled !== false;
        var enabled = baseEnabled && accountEnabled;
        var secretResolution = resolveNextcloudTalkSecret(params.cfg, { accountId: accountId });
        var baseUrl = (_c = (_b = (_a = merged.baseUrl) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.replace(/\/$/, "")) !== null && _c !== void 0 ? _c : "";
        debugAccounts("resolve", {
            accountId: accountId,
            enabled: enabled,
            secretSource: secretResolution.source,
            baseUrl: baseUrl ? "[set]" : "[missing]",
        });
        return {
            accountId: accountId,
            enabled: enabled,
            name: ((_d = merged.name) === null || _d === void 0 ? void 0 : _d.trim()) || undefined,
            baseUrl: baseUrl,
            secret: secretResolution.secret,
            secretSource: secretResolution.source,
            config: merged,
        };
    };
    var normalized = (0, plugin_sdk_1.normalizeAccountId)(params.accountId);
    var primary = resolve(normalized);
    if (hasExplicitAccountId) {
        return primary;
    }
    if (primary.secretSource !== "none") {
        return primary;
    }
    var fallbackId = resolveDefaultNextcloudTalkAccountId(params.cfg);
    if (fallbackId === primary.accountId) {
        return primary;
    }
    var fallback = resolve(fallbackId);
    if (fallback.secretSource === "none") {
        return primary;
    }
    return fallback;
}
function listEnabledNextcloudTalkAccounts(cfg) {
    return listNextcloudTalkAccountIds(cfg)
        .map(function (accountId) { return resolveNextcloudTalkAccount({ cfg: cfg, accountId: accountId }); })
        .filter(function (account) { return account.enabled; });
}
