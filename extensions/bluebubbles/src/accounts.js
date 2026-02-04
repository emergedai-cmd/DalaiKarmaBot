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
exports.listBlueBubblesAccountIds = listBlueBubblesAccountIds;
exports.resolveDefaultBlueBubblesAccountId = resolveDefaultBlueBubblesAccountId;
exports.resolveBlueBubblesAccount = resolveBlueBubblesAccount;
exports.listEnabledBlueBubblesAccounts = listEnabledBlueBubblesAccounts;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var types_js_1 = require("./types.js");
function listConfiguredAccountIds(cfg) {
    var _a, _b;
    var accounts = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.bluebubbles) === null || _b === void 0 ? void 0 : _b.accounts;
    if (!accounts || typeof accounts !== "object") {
        return [];
    }
    return Object.keys(accounts).filter(Boolean);
}
function listBlueBubblesAccountIds(cfg) {
    var ids = listConfiguredAccountIds(cfg);
    if (ids.length === 0) {
        return [plugin_sdk_1.DEFAULT_ACCOUNT_ID];
    }
    return ids.toSorted(function (a, b) { return a.localeCompare(b); });
}
function resolveDefaultBlueBubblesAccountId(cfg) {
    var _a;
    var ids = listBlueBubblesAccountIds(cfg);
    if (ids.includes(plugin_sdk_1.DEFAULT_ACCOUNT_ID)) {
        return plugin_sdk_1.DEFAULT_ACCOUNT_ID;
    }
    return (_a = ids[0]) !== null && _a !== void 0 ? _a : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
}
function resolveAccountConfig(cfg, accountId) {
    var _a, _b;
    var accounts = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.bluebubbles) === null || _b === void 0 ? void 0 : _b.accounts;
    if (!accounts || typeof accounts !== "object") {
        return undefined;
    }
    return accounts[accountId];
}
function mergeBlueBubblesAccountConfig(cfg, accountId) {
    var _a, _b, _c, _d, _e;
    var base = ((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.bluebubbles) !== null && _b !== void 0 ? _b : {});
    var _ignored = base.accounts, rest = __rest(base, ["accounts"]);
    var account = (_c = resolveAccountConfig(cfg, accountId)) !== null && _c !== void 0 ? _c : {};
    var chunkMode = (_e = (_d = account.chunkMode) !== null && _d !== void 0 ? _d : rest.chunkMode) !== null && _e !== void 0 ? _e : "length";
    return __assign(__assign(__assign({}, rest), account), { chunkMode: chunkMode });
}
function resolveBlueBubblesAccount(params) {
    var _a, _b, _c, _d, _e;
    var accountId = (0, plugin_sdk_1.normalizeAccountId)(params.accountId);
    var baseEnabled = (_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.bluebubbles) === null || _b === void 0 ? void 0 : _b.enabled;
    var merged = mergeBlueBubblesAccountConfig(params.cfg, accountId);
    var accountEnabled = merged.enabled !== false;
    var serverUrl = (_c = merged.serverUrl) === null || _c === void 0 ? void 0 : _c.trim();
    var password = (_d = merged.password) === null || _d === void 0 ? void 0 : _d.trim();
    var configured = Boolean(serverUrl && password);
    var baseUrl = serverUrl ? (0, types_js_1.normalizeBlueBubblesServerUrl)(serverUrl) : undefined;
    return {
        accountId: accountId,
        enabled: baseEnabled !== false && accountEnabled,
        name: ((_e = merged.name) === null || _e === void 0 ? void 0 : _e.trim()) || undefined,
        config: merged,
        configured: configured,
        baseUrl: baseUrl,
    };
}
function listEnabledBlueBubblesAccounts(cfg) {
    return listBlueBubblesAccountIds(cfg)
        .map(function (accountId) { return resolveBlueBubblesAccount({ cfg: cfg, accountId: accountId }); })
        .filter(function (account) { return account.enabled; });
}
