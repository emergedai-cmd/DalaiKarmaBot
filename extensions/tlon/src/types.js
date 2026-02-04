"use strict";
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
exports.resolveTlonAccount = resolveTlonAccount;
exports.listTlonAccountIds = listTlonAccountIds;
function resolveTlonAccount(cfg, accountId) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    var base = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.tlon;
    if (!base) {
        return {
            accountId: accountId || "default",
            name: null,
            enabled: false,
            configured: false,
            ship: null,
            url: null,
            code: null,
            groupChannels: [],
            dmAllowlist: [],
            autoDiscoverChannels: null,
            showModelSignature: null,
        };
    }
    var useDefault = !accountId || accountId === "default";
    var account = useDefault ? base : (_b = base.accounts) === null || _b === void 0 ? void 0 : _b[accountId];
    var ship = ((_d = (_c = account === null || account === void 0 ? void 0 : account.ship) !== null && _c !== void 0 ? _c : base.ship) !== null && _d !== void 0 ? _d : null);
    var url = ((_f = (_e = account === null || account === void 0 ? void 0 : account.url) !== null && _e !== void 0 ? _e : base.url) !== null && _f !== void 0 ? _f : null);
    var code = ((_h = (_g = account === null || account === void 0 ? void 0 : account.code) !== null && _g !== void 0 ? _g : base.code) !== null && _h !== void 0 ? _h : null);
    var groupChannels = ((_k = (_j = account === null || account === void 0 ? void 0 : account.groupChannels) !== null && _j !== void 0 ? _j : base.groupChannels) !== null && _k !== void 0 ? _k : []);
    var dmAllowlist = ((_m = (_l = account === null || account === void 0 ? void 0 : account.dmAllowlist) !== null && _l !== void 0 ? _l : base.dmAllowlist) !== null && _m !== void 0 ? _m : []);
    var autoDiscoverChannels = ((_p = (_o = account === null || account === void 0 ? void 0 : account.autoDiscoverChannels) !== null && _o !== void 0 ? _o : base.autoDiscoverChannels) !== null && _p !== void 0 ? _p : null);
    var showModelSignature = ((_r = (_q = account === null || account === void 0 ? void 0 : account.showModelSignature) !== null && _q !== void 0 ? _q : base.showModelSignature) !== null && _r !== void 0 ? _r : null);
    var configured = Boolean(ship && url && code);
    return {
        accountId: accountId || "default",
        name: ((_t = (_s = account === null || account === void 0 ? void 0 : account.name) !== null && _s !== void 0 ? _s : base.name) !== null && _t !== void 0 ? _t : null),
        enabled: ((_v = (_u = account === null || account === void 0 ? void 0 : account.enabled) !== null && _u !== void 0 ? _u : base.enabled) !== null && _v !== void 0 ? _v : true) !== false,
        configured: configured,
        ship: ship,
        url: url,
        code: code,
        groupChannels: groupChannels,
        dmAllowlist: dmAllowlist,
        autoDiscoverChannels: autoDiscoverChannels,
        showModelSignature: showModelSignature,
    };
}
function listTlonAccountIds(cfg) {
    var _a, _b;
    var base = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.tlon;
    if (!base) {
        return [];
    }
    var accounts = (_b = base.accounts) !== null && _b !== void 0 ? _b : {};
    return __spreadArray(__spreadArray([], (base.ship ? ["default"] : []), true), Object.keys(accounts), true);
}
