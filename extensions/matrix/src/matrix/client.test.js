"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var client_js_1 = require("./client.js");
(0, vitest_1.describe)("resolveMatrixConfig", function () {
    (0, vitest_1.it)("prefers config over env", function () {
        var cfg = {
            channels: {
                matrix: {
                    homeserver: "https://cfg.example.org",
                    userId: "@cfg:example.org",
                    accessToken: "cfg-token",
                    password: "cfg-pass",
                    deviceName: "CfgDevice",
                    initialSyncLimit: 5,
                },
            },
        };
        var env = {
            MATRIX_HOMESERVER: "https://env.example.org",
            MATRIX_USER_ID: "@env:example.org",
            MATRIX_ACCESS_TOKEN: "env-token",
            MATRIX_PASSWORD: "env-pass",
            MATRIX_DEVICE_NAME: "EnvDevice",
        };
        var resolved = (0, client_js_1.resolveMatrixConfig)(cfg, env);
        (0, vitest_1.expect)(resolved).toEqual({
            homeserver: "https://cfg.example.org",
            userId: "@cfg:example.org",
            accessToken: "cfg-token",
            password: "cfg-pass",
            deviceName: "CfgDevice",
            initialSyncLimit: 5,
            encryption: false,
        });
    });
    (0, vitest_1.it)("uses env when config is missing", function () {
        var cfg = {};
        var env = {
            MATRIX_HOMESERVER: "https://env.example.org",
            MATRIX_USER_ID: "@env:example.org",
            MATRIX_ACCESS_TOKEN: "env-token",
            MATRIX_PASSWORD: "env-pass",
            MATRIX_DEVICE_NAME: "EnvDevice",
        };
        var resolved = (0, client_js_1.resolveMatrixConfig)(cfg, env);
        (0, vitest_1.expect)(resolved.homeserver).toBe("https://env.example.org");
        (0, vitest_1.expect)(resolved.userId).toBe("@env:example.org");
        (0, vitest_1.expect)(resolved.accessToken).toBe("env-token");
        (0, vitest_1.expect)(resolved.password).toBe("env-pass");
        (0, vitest_1.expect)(resolved.deviceName).toBe("EnvDevice");
        (0, vitest_1.expect)(resolved.initialSyncLimit).toBeUndefined();
        (0, vitest_1.expect)(resolved.encryption).toBe(false);
    });
});
