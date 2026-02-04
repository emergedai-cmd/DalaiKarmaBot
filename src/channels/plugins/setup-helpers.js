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
exports.applyAccountNameToChannelSection = applyAccountNameToChannelSection;
exports.migrateBaseNameToDefaultAccount = migrateBaseNameToDefaultAccount;
var session_key_js_1 = require("../../routing/session-key.js");
function channelHasAccounts(cfg, channelKey) {
    var channels = cfg.channels;
    var base = channels === null || channels === void 0 ? void 0 : channels[channelKey];
    return Boolean((base === null || base === void 0 ? void 0 : base.accounts) && Object.keys(base.accounts).length > 0);
}
function shouldStoreNameInAccounts(params) {
    if (params.alwaysUseAccounts) {
        return true;
    }
    if (params.accountId !== session_key_js_1.DEFAULT_ACCOUNT_ID) {
        return true;
    }
    return channelHasAccounts(params.cfg, params.channelKey);
}
function applyAccountNameToChannelSection(params) {
    var _a, _b, _c;
    var _d, _e, _f;
    var trimmed = (_d = params.name) === null || _d === void 0 ? void 0 : _d.trim();
    if (!trimmed) {
        return params.cfg;
    }
    var accountId = (0, session_key_js_1.normalizeAccountId)(params.accountId);
    var channels = params.cfg.channels;
    var baseConfig = channels === null || channels === void 0 ? void 0 : channels[params.channelKey];
    var base = typeof baseConfig === "object" && baseConfig ? baseConfig : undefined;
    var useAccounts = shouldStoreNameInAccounts({
        cfg: params.cfg,
        channelKey: params.channelKey,
        accountId: accountId,
        alwaysUseAccounts: params.alwaysUseAccounts,
    });
    if (!useAccounts && accountId === session_key_js_1.DEFAULT_ACCOUNT_ID) {
        var safeBase = base !== null && base !== void 0 ? base : {};
        return __assign(__assign({}, params.cfg), { channels: __assign(__assign({}, params.cfg.channels), (_a = {}, _a[params.channelKey] = __assign(__assign({}, safeBase), { name: trimmed }), _a)) });
    }
    var baseAccounts = (_e = base === null || base === void 0 ? void 0 : base.accounts) !== null && _e !== void 0 ? _e : {};
    var existingAccount = (_f = baseAccounts[accountId]) !== null && _f !== void 0 ? _f : {};
    var baseWithoutName = accountId === session_key_js_1.DEFAULT_ACCOUNT_ID
        ? (function (_a) {
            var _ignored = _a.name, rest = __rest(_a, ["name"]);
            return rest;
        })(base !== null && base !== void 0 ? base : {})
        : (base !== null && base !== void 0 ? base : {});
    return __assign(__assign({}, params.cfg), { channels: __assign(__assign({}, params.cfg.channels), (_b = {}, _b[params.channelKey] = __assign(__assign({}, baseWithoutName), { accounts: __assign(__assign({}, baseAccounts), (_c = {}, _c[accountId] = __assign(__assign({}, existingAccount), { name: trimmed }), _c)) }), _b)) });
}
function migrateBaseNameToDefaultAccount(params) {
    var _a;
    var _b, _c;
    if (params.alwaysUseAccounts) {
        return params.cfg;
    }
    var channels = params.cfg.channels;
    var base = channels === null || channels === void 0 ? void 0 : channels[params.channelKey];
    var baseName = (_b = base === null || base === void 0 ? void 0 : base.name) === null || _b === void 0 ? void 0 : _b.trim();
    if (!baseName) {
        return params.cfg;
    }
    var accounts = __assign({}, base === null || base === void 0 ? void 0 : base.accounts);
    var defaultAccount = (_c = accounts[session_key_js_1.DEFAULT_ACCOUNT_ID]) !== null && _c !== void 0 ? _c : {};
    if (!defaultAccount.name) {
        accounts[session_key_js_1.DEFAULT_ACCOUNT_ID] = __assign(__assign({}, defaultAccount), { name: baseName });
    }
    var _d = base !== null && base !== void 0 ? base : {}, _ignored = _d.name, rest = __rest(_d, ["name"]);
    return __assign(__assign({}, params.cfg), { channels: __assign(__assign({}, params.cfg.channels), (_a = {}, _a[params.channelKey] = __assign(__assign({}, rest), { accounts: accounts }), _a)) });
}
