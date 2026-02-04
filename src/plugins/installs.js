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
exports.recordPluginInstall = recordPluginInstall;
function recordPluginInstall(cfg, update) {
    var _a, _b;
    var _c, _d, _e, _f;
    var pluginId = update.pluginId, record = __rest(update, ["pluginId"]);
    var installs = __assign(__assign({}, (_c = cfg.plugins) === null || _c === void 0 ? void 0 : _c.installs), (_a = {}, _a[pluginId] = __assign(__assign(__assign({}, (_e = (_d = cfg.plugins) === null || _d === void 0 ? void 0 : _d.installs) === null || _e === void 0 ? void 0 : _e[pluginId]), record), { installedAt: (_f = record.installedAt) !== null && _f !== void 0 ? _f : new Date().toISOString() }), _a));
    return __assign(__assign({}, cfg), { plugins: __assign(__assign({}, cfg.plugins), { installs: __assign(__assign({}, installs), (_b = {}, _b[pluginId] = installs[pluginId], _b)) }) });
}
