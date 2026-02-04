"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var config_js_1 = require("./config.js");
(0, vitest_1.describe)("Slack HTTP mode config", function () {
    (0, vitest_1.it)("accepts HTTP mode when signing secret is configured", function () {
        var res = (0, config_js_1.validateConfigObject)({
            channels: {
                slack: {
                    mode: "http",
                    signingSecret: "secret",
                },
            },
        });
        (0, vitest_1.expect)(res.ok).toBe(true);
    });
    (0, vitest_1.it)("rejects HTTP mode without signing secret", function () {
        var _a;
        var res = (0, config_js_1.validateConfigObject)({
            channels: {
                slack: {
                    mode: "http",
                },
            },
        });
        (0, vitest_1.expect)(res.ok).toBe(false);
        if (!res.ok) {
            (0, vitest_1.expect)((_a = res.issues[0]) === null || _a === void 0 ? void 0 : _a.path).toBe("channels.slack.signingSecret");
        }
    });
    (0, vitest_1.it)("accepts account HTTP mode when base signing secret is set", function () {
        var res = (0, config_js_1.validateConfigObject)({
            channels: {
                slack: {
                    signingSecret: "secret",
                    accounts: {
                        ops: {
                            mode: "http",
                        },
                    },
                },
            },
        });
        (0, vitest_1.expect)(res.ok).toBe(true);
    });
    (0, vitest_1.it)("rejects account HTTP mode without signing secret", function () {
        var _a;
        var res = (0, config_js_1.validateConfigObject)({
            channels: {
                slack: {
                    accounts: {
                        ops: {
                            mode: "http",
                        },
                    },
                },
            },
        });
        (0, vitest_1.expect)(res.ok).toBe(false);
        if (!res.ok) {
            (0, vitest_1.expect)((_a = res.issues[0]) === null || _a === void 0 ? void 0 : _a.path).toBe("channels.slack.accounts.ops.signingSecret");
        }
    });
});
