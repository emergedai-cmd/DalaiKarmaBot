"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var accounts_js_1 = require("./accounts.js");
vitest_1.vi.mock("./credentials.js", function () { return ({
    loadMatrixCredentials: function () { return null; },
    credentialsMatchConfig: function () { return false; },
}); });
var envKeys = [
    "MATRIX_HOMESERVER",
    "MATRIX_USER_ID",
    "MATRIX_ACCESS_TOKEN",
    "MATRIX_PASSWORD",
    "MATRIX_DEVICE_NAME",
];
(0, vitest_1.describe)("resolveMatrixAccount", function () {
    var prevEnv = {};
    (0, vitest_1.beforeEach)(function () {
        prevEnv = {};
        for (var _i = 0, envKeys_1 = envKeys; _i < envKeys_1.length; _i++) {
            var key = envKeys_1[_i];
            prevEnv[key] = process.env[key];
            delete process.env[key];
        }
    });
    (0, vitest_1.afterEach)(function () {
        for (var _i = 0, envKeys_2 = envKeys; _i < envKeys_2.length; _i++) {
            var key = envKeys_2[_i];
            var value = prevEnv[key];
            if (value === undefined) {
                delete process.env[key];
            }
            else {
                process.env[key] = value;
            }
        }
    });
    (0, vitest_1.it)("treats access-token-only config as configured", function () {
        var cfg = {
            channels: {
                matrix: {
                    homeserver: "https://matrix.example.org",
                    accessToken: "tok-access",
                },
            },
        };
        var account = (0, accounts_js_1.resolveMatrixAccount)({ cfg: cfg });
        (0, vitest_1.expect)(account.configured).toBe(true);
    });
    (0, vitest_1.it)("requires userId + password when no access token is set", function () {
        var cfg = {
            channels: {
                matrix: {
                    homeserver: "https://matrix.example.org",
                    userId: "@bot:example.org",
                },
            },
        };
        var account = (0, accounts_js_1.resolveMatrixAccount)({ cfg: cfg });
        (0, vitest_1.expect)(account.configured).toBe(false);
    });
    (0, vitest_1.it)("marks password auth as configured when userId is present", function () {
        var cfg = {
            channels: {
                matrix: {
                    homeserver: "https://matrix.example.org",
                    userId: "@bot:example.org",
                    password: "secret",
                },
            },
        };
        var account = (0, accounts_js_1.resolveMatrixAccount)({ cfg: cfg });
        (0, vitest_1.expect)(account.configured).toBe(true);
    });
});
