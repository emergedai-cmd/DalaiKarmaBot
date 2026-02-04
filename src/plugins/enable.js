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
exports.enablePluginInConfig = enablePluginInConfig;
function ensureAllowlisted(cfg, pluginId) {
    var _a;
    var allow = (_a = cfg.plugins) === null || _a === void 0 ? void 0 : _a.allow;
    if (!Array.isArray(allow) || allow.includes(pluginId)) {
        return cfg;
    }
    return __assign(__assign({}, cfg), { plugins: __assign(__assign({}, cfg.plugins), { allow: __spreadArray(__spreadArray([], allow, true), [pluginId], false) }) });
}
function enablePluginInConfig(cfg, pluginId) {
    var _a;
    var _b, _c, _d, _e, _f, _g;
    if (((_b = cfg.plugins) === null || _b === void 0 ? void 0 : _b.enabled) === false) {
        return { config: cfg, enabled: false, reason: "plugins disabled" };
    }
    if ((_d = (_c = cfg.plugins) === null || _c === void 0 ? void 0 : _c.deny) === null || _d === void 0 ? void 0 : _d.includes(pluginId)) {
        return { config: cfg, enabled: false, reason: "blocked by denylist" };
    }
    var entries = __assign(__assign({}, (_e = cfg.plugins) === null || _e === void 0 ? void 0 : _e.entries), (_a = {}, _a[pluginId] = __assign(__assign({}, (_g = (_f = cfg.plugins) === null || _f === void 0 ? void 0 : _f.entries) === null || _g === void 0 ? void 0 : _g[pluginId]), { enabled: true }), _a));
    var next = __assign(__assign({}, cfg), { plugins: __assign(__assign({}, cfg.plugins), { entries: entries }) });
    next = ensureAllowlisted(next, pluginId);
    return { config: next, enabled: true };
}
