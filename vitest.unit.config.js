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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
var vitest_config_ts_1 = require("./vitest.config.ts");
var baseTest = (_a = vitest_config_ts_1.default.test) !== null && _a !== void 0 ? _a : {};
var include = (_b = baseTest.include) !== null && _b !== void 0 ? _b : [
    "src/**/*.test.ts",
    "extensions/**/*.test.ts",
    "test/format-error.test.ts",
];
var exclude = (_c = baseTest.exclude) !== null && _c !== void 0 ? _c : [];
exports.default = (0, config_1.defineConfig)(__assign(__assign({}, vitest_config_ts_1.default), { test: __assign(__assign({}, baseTest), { include: include, exclude: __spreadArray(__spreadArray([], exclude, true), ["src/gateway/**", "extensions/**"], false) }) }));
