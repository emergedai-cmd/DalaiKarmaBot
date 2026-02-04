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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
var vitest_config_ts_1 = require("./vitest.config.ts");
var baseTest = (_a = vitest_config_ts_1.default.test) !== null && _a !== void 0 ? _a : {};
var exclude = (_b = baseTest.exclude) !== null && _b !== void 0 ? _b : [];
exports.default = (0, config_1.defineConfig)(__assign(__assign({}, vitest_config_ts_1.default), { test: __assign(__assign({}, baseTest), { include: ["extensions/**/*.test.ts"], exclude: exclude }) }));
