"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var config_js_1 = require("./config.js");
(0, vitest_1.describe)("Telegram webhook config", function () {
    (0, vitest_1.it)("accepts webhookUrl when webhookSecret is configured", function () {
        var res = (0, config_js_1.validateConfigObject)({
            channels: {
                telegram: {
                    webhookUrl: "https://example.com/telegram-webhook",
                    webhookSecret: "secret",
                },
            },
        });
        (0, vitest_1.expect)(res.ok).toBe(true);
    });
    (0, vitest_1.it)("rejects webhookUrl without webhookSecret", function () {
        var _a;
        var res = (0, config_js_1.validateConfigObject)({
            channels: {
                telegram: {
                    webhookUrl: "https://example.com/telegram-webhook",
                },
            },
        });
        (0, vitest_1.expect)(res.ok).toBe(false);
        if (!res.ok) {
            (0, vitest_1.expect)((_a = res.issues[0]) === null || _a === void 0 ? void 0 : _a.path).toBe("channels.telegram.webhookSecret");
        }
    });
    (0, vitest_1.it)("accepts account webhookUrl when base webhookSecret is configured", function () {
        var res = (0, config_js_1.validateConfigObject)({
            channels: {
                telegram: {
                    webhookSecret: "secret",
                    accounts: {
                        ops: {
                            webhookUrl: "https://example.com/telegram-webhook",
                        },
                    },
                },
            },
        });
        (0, vitest_1.expect)(res.ok).toBe(true);
    });
    (0, vitest_1.it)("rejects account webhookUrl without webhookSecret", function () {
        var _a;
        var res = (0, config_js_1.validateConfigObject)({
            channels: {
                telegram: {
                    accounts: {
                        ops: {
                            webhookUrl: "https://example.com/telegram-webhook",
                        },
                    },
                },
            },
        });
        (0, vitest_1.expect)(res.ok).toBe(false);
        if (!res.ok) {
            (0, vitest_1.expect)((_a = res.issues[0]) === null || _a === void 0 ? void 0 : _a.path).toBe("channels.telegram.accounts.ops.webhookSecret");
        }
    });
});
