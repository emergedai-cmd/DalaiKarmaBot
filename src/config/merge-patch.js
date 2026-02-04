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
exports.applyMergePatch = applyMergePatch;
function isPlainObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function applyMergePatch(base, patch) {
    if (!isPlainObject(patch)) {
        return patch;
    }
    var result = isPlainObject(base) ? __assign({}, base) : {};
    for (var _i = 0, _a = Object.entries(patch); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (value === null) {
            delete result[key];
            continue;
        }
        if (isPlainObject(value)) {
            var baseValue = result[key];
            result[key] = applyMergePatch(isPlainObject(baseValue) ? baseValue : {}, value);
            continue;
        }
        result[key] = value;
    }
    return result;
}
