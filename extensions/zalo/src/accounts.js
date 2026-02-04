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
exports.listZaloAccountIds = listZaloAccountIds;
exports.resolveDefaultZaloAccountId = resolveDefaultZaloAccountId;
exports.resolveZaloAccount = resolveZaloAccount;
exports.listEnabledZaloAccounts = listEnabledZaloAccounts;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var token_js_1 = require("./token.js");
function listConfiguredAccountIds(cfg) {
    var _a, _b;
    var accounts = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.zalo) === null || _b === void 0 ? void 0 : _b.accounts;
    if (!accounts || typeof accounts !== "object") {
        return [];
    }
    return Object.keys(accounts).filter(Boolean);
}
function listZaloAccountIds(cfg) {
    var ids = listConfiguredAccountIds(cfg);
    if (ids.length === 0) {
        return [plugin_sdk_1.DEFAULT_ACCOUNT_ID];
    }
    return ids.toSorted(function (a, b) { return a.localeCompare(b); });
}
function resolveDefaultZaloAccountId(cfg) {
    var _a, _b, _c;
    var zaloConfig = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.zalo;
    if ((_b = zaloConfig === null || zaloConfig === void 0 ? void 0 : zaloConfig.defaultAccount) === null || _b === void 0 ? void 0 : _b.trim()) {
        return zaloConfig.defaultAccount.trim();
    }
    var ids = listZaloAccountIds(cfg);
    if (ids.includes(plugin_sdk_1.DEFAULT_ACCOUNT_ID)) {
        return plugin_sdk_1.DEFAULT_ACCOUNT_ID;
    }
    return (_c = ids[0]) !== null && _c !== void 0 ? _c : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
}
function resolveAccountConfig(cfg, accountId) {
    var _a, _b;
    var accounts = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.zalo) === null || _b === void 0 ? void 0 : _b.accounts;
    if (!accounts || typeof accounts !== "object") {
        return undefined;
    }
    return accounts[accountId];
}
function mergeZaloAccountConfig(cfg, accountId) {
    var _a, _b, _c;
    var raw = ((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.zalo) !== null && _b !== void 0 ? _b : {});
    var _ignored = raw.accounts, _ignored2 = raw.defaultAccount, base = __rest(raw, ["accounts", "defaultAccount"]);
    var account = (_c = resolveAccountConfig(cfg, accountId)) !== null && _c !== void 0 ? _c : {};
    return __assign(__assign({}, base), account);
}
function resolveZaloAccount(params) {
    var _a, _b, _c, _d;
    var accountId = (0, plugin_sdk_1.normalizeAccountId)(params.accountId);
    var baseEnabled = ((_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.zalo) === null || _b === void 0 ? void 0 : _b.enabled) !== false;
    var merged = mergeZaloAccountConfig(params.cfg, accountId);
    var accountEnabled = merged.enabled !== false;
    var enabled = baseEnabled && accountEnabled;
    var tokenResolution = (0, token_js_1.resolveZaloToken)((_c = params.cfg.channels) === null || _c === void 0 ? void 0 : _c.zalo, accountId);
    return {
        accountId: accountId,
        name: ((_d = merged.name) === null || _d === void 0 ? void 0 : _d.trim()) || undefined,
        enabled: enabled,
        token: tokenResolution.token,
        tokenSource: tokenResolution.source,
        config: merged,
    };
}
function listEnabledZaloAccounts(cfg) {
    return listZaloAccountIds(cfg)
        .map(function (accountId) { return resolveZaloAccount({ cfg: cfg, accountId: accountId }); })
        .filter(function (account) { return account.enabled; });
}
