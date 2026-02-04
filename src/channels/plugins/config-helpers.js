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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAccountEnabledInConfigSection = setAccountEnabledInConfigSection;
exports.deleteAccountFromConfigSection = deleteAccountFromConfigSection;
var session_key_js_1 = require("../../routing/session-key.js");
function setAccountEnabledInConfigSection(params) {
    var _a, _b, _c;
    var _d, _e;
    var accountKey = params.accountId || session_key_js_1.DEFAULT_ACCOUNT_ID;
    var channels = params.cfg.channels;
    var base = channels === null || channels === void 0 ? void 0 : channels[params.sectionKey];
    var hasAccounts = Boolean(base === null || base === void 0 ? void 0 : base.accounts);
    if (params.allowTopLevel && accountKey === session_key_js_1.DEFAULT_ACCOUNT_ID && !hasAccounts) {
        return __assign(__assign({}, params.cfg), { channels: __assign(__assign({}, params.cfg.channels), (_a = {}, _a[params.sectionKey] = __assign(__assign({}, base), { enabled: params.enabled }), _a)) });
    }
    var baseAccounts = (_d = base === null || base === void 0 ? void 0 : base.accounts) !== null && _d !== void 0 ? _d : {};
    var existing = (_e = baseAccounts[accountKey]) !== null && _e !== void 0 ? _e : {};
    return __assign(__assign({}, params.cfg), { channels: __assign(__assign({}, params.cfg.channels), (_b = {}, _b[params.sectionKey] = __assign(__assign({}, base), { accounts: __assign(__assign({}, baseAccounts), (_c = {}, _c[accountKey] = __assign(__assign({}, existing), { enabled: params.enabled }), _c)) }), _b)) });
}
function deleteAccountFromConfigSection(params) {
    var _a, _b;
    var _c;
    var accountKey = params.accountId || session_key_js_1.DEFAULT_ACCOUNT_ID;
    var channels = params.cfg.channels;
    var base = channels === null || channels === void 0 ? void 0 : channels[params.sectionKey];
    if (!base) {
        return params.cfg;
    }
    var baseAccounts = base.accounts && typeof base.accounts === "object" ? __assign({}, base.accounts) : undefined;
    if (accountKey !== session_key_js_1.DEFAULT_ACCOUNT_ID) {
        var accounts = baseAccounts ? __assign({}, baseAccounts) : {};
        delete accounts[accountKey];
        return __assign(__assign({}, params.cfg), { channels: __assign(__assign({}, params.cfg.channels), (_a = {}, _a[params.sectionKey] = __assign(__assign({}, base), { accounts: Object.keys(accounts).length ? accounts : undefined }), _a)) });
    }
    if (baseAccounts && Object.keys(baseAccounts).length > 0) {
        delete baseAccounts[accountKey];
        var baseRecord = __assign({}, base);
        for (var _i = 0, _d = (_c = params.clearBaseFields) !== null && _c !== void 0 ? _c : []; _i < _d.length; _i++) {
            var field = _d[_i];
            if (field in baseRecord) {
                baseRecord[field] = undefined;
            }
        }
        return __assign(__assign({}, params.cfg), { channels: __assign(__assign({}, params.cfg.channels), (_b = {}, _b[params.sectionKey] = __assign(__assign({}, baseRecord), { accounts: Object.keys(baseAccounts).length ? baseAccounts : undefined }), _b)) });
    }
    var nextChannels = __assign({}, params.cfg.channels);
    delete nextChannels[params.sectionKey];
    var nextCfg = __assign({}, params.cfg);
    if (Object.keys(nextChannels).length > 0) {
        nextCfg.channels = nextChannels;
    }
    else {
        delete nextCfg.channels;
    }
    return nextCfg;
}
