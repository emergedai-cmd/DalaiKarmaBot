"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var configure_js_1 = require("./configure.js");
(0, vitest_1.describe)("buildGatewayAuthConfig", function () {
    (0, vitest_1.it)("preserves allowTailscale when switching to token", function () {
        var result = (0, configure_js_1.buildGatewayAuthConfig)({
            existing: {
                mode: "password",
                password: "secret",
                allowTailscale: true,
            },
            mode: "token",
            token: "abc",
        });
        (0, vitest_1.expect)(result).toEqual({ mode: "token", token: "abc", allowTailscale: true });
    });
    (0, vitest_1.it)("drops password when switching to token", function () {
        var result = (0, configure_js_1.buildGatewayAuthConfig)({
            existing: {
                mode: "password",
                password: "secret",
                allowTailscale: false,
            },
            mode: "token",
            token: "abc",
        });
        (0, vitest_1.expect)(result).toEqual({
            mode: "token",
            token: "abc",
            allowTailscale: false,
        });
    });
    (0, vitest_1.it)("drops token when switching to password", function () {
        var result = (0, configure_js_1.buildGatewayAuthConfig)({
            existing: { mode: "token", token: "abc" },
            mode: "password",
            password: "secret",
        });
        (0, vitest_1.expect)(result).toEqual({ mode: "password", password: "secret" });
    });
});
