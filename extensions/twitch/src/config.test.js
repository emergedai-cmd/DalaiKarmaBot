"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var config_js_1 = require("./config.js");
(0, vitest_1.describe)("getAccountConfig", function () {
    var mockMultiAccountConfig = {
        channels: {
            twitch: {
                accounts: {
                    default: {
                        username: "testbot",
                        accessToken: "oauth:test123",
                    },
                    secondary: {
                        username: "secondbot",
                        accessToken: "oauth:secondary",
                    },
                },
            },
        },
    };
    var mockSimplifiedConfig = {
        channels: {
            twitch: {
                username: "testbot",
                accessToken: "oauth:test123",
            },
        },
    };
    (0, vitest_1.it)("returns account config for valid account ID (multi-account)", function () {
        var result = (0, config_js_1.getAccountConfig)(mockMultiAccountConfig, "default");
        (0, vitest_1.expect)(result).not.toBeNull();
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.username).toBe("testbot");
    });
    (0, vitest_1.it)("returns account config for default account (simplified config)", function () {
        var result = (0, config_js_1.getAccountConfig)(mockSimplifiedConfig, "default");
        (0, vitest_1.expect)(result).not.toBeNull();
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.username).toBe("testbot");
    });
    (0, vitest_1.it)("returns non-default account from multi-account config", function () {
        var result = (0, config_js_1.getAccountConfig)(mockMultiAccountConfig, "secondary");
        (0, vitest_1.expect)(result).not.toBeNull();
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.username).toBe("secondbot");
    });
    (0, vitest_1.it)("returns null for non-existent account ID", function () {
        var result = (0, config_js_1.getAccountConfig)(mockMultiAccountConfig, "nonexistent");
        (0, vitest_1.expect)(result).toBeNull();
    });
    (0, vitest_1.it)("returns null when core config is null", function () {
        var result = (0, config_js_1.getAccountConfig)(null, "default");
        (0, vitest_1.expect)(result).toBeNull();
    });
    (0, vitest_1.it)("returns null when core config is undefined", function () {
        var result = (0, config_js_1.getAccountConfig)(undefined, "default");
        (0, vitest_1.expect)(result).toBeNull();
    });
    (0, vitest_1.it)("returns null when channels are not defined", function () {
        var result = (0, config_js_1.getAccountConfig)({}, "default");
        (0, vitest_1.expect)(result).toBeNull();
    });
    (0, vitest_1.it)("returns null when twitch is not defined", function () {
        var result = (0, config_js_1.getAccountConfig)({ channels: {} }, "default");
        (0, vitest_1.expect)(result).toBeNull();
    });
    (0, vitest_1.it)("returns null when accounts are not defined", function () {
        var result = (0, config_js_1.getAccountConfig)({ channels: { twitch: {} } }, "default");
        (0, vitest_1.expect)(result).toBeNull();
    });
});
