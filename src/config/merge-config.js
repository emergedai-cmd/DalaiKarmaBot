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
exports.mergeConfigSection = mergeConfigSection;
exports.mergeWhatsAppConfig = mergeWhatsAppConfig;
function mergeConfigSection(base, patch, options) {
    var _a;
    if (options === void 0) { options = {}; }
    var next = __assign({}, (base !== null && base !== void 0 ? base : undefined));
    for (var _i = 0, _b = Object.entries(patch); _i < _b.length; _i++) {
        var _c = _b[_i], key = _c[0], value = _c[1];
        if (value === undefined) {
            if ((_a = options.unsetOnUndefined) === null || _a === void 0 ? void 0 : _a.includes(key)) {
                delete next[key];
            }
            continue;
        }
        next[key] = value;
    }
    return next;
}
function mergeWhatsAppConfig(cfg, patch, options) {
    var _a;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { whatsapp: mergeConfigSection((_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.whatsapp, patch, options) }) });
}
