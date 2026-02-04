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
exports.recordHookInstall = recordHookInstall;
function recordHookInstall(cfg, update) {
    var _a, _b;
    var _c, _d, _e, _f, _g, _h, _j;
    var hookId = update.hookId, record = __rest(update, ["hookId"]);
    var installs = __assign(__assign({}, (_d = (_c = cfg.hooks) === null || _c === void 0 ? void 0 : _c.internal) === null || _d === void 0 ? void 0 : _d.installs), (_a = {}, _a[hookId] = __assign(__assign(__assign({}, (_g = (_f = (_e = cfg.hooks) === null || _e === void 0 ? void 0 : _e.internal) === null || _f === void 0 ? void 0 : _f.installs) === null || _g === void 0 ? void 0 : _g[hookId]), record), { installedAt: (_h = record.installedAt) !== null && _h !== void 0 ? _h : new Date().toISOString() }), _a));
    return __assign(__assign({}, cfg), { hooks: __assign(__assign({}, cfg.hooks), { internal: __assign(__assign({}, (_j = cfg.hooks) === null || _j === void 0 ? void 0 : _j.internal), { installs: __assign(__assign({}, installs), (_b = {}, _b[hookId] = installs[hookId], _b)) }) }) });
}
