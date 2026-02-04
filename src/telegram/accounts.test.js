"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var accounts_js_1 = require("./accounts.js");
(0, vitest_1.describe)("resolveTelegramAccount", function () {
    (0, vitest_1.it)("falls back to the first configured account when accountId is omitted", function () {
        var prevTelegramToken = process.env.TELEGRAM_BOT_TOKEN;
        process.env.TELEGRAM_BOT_TOKEN = "";
        try {
            var cfg = {
                channels: {
                    telegram: { accounts: { work: { botToken: "tok-work" } } },
                },
            };
            var account = (0, accounts_js_1.resolveTelegramAccount)({ cfg: cfg });
            (0, vitest_1.expect)(account.accountId).toBe("work");
            (0, vitest_1.expect)(account.token).toBe("tok-work");
            (0, vitest_1.expect)(account.tokenSource).toBe("config");
        }
        finally {
            if (prevTelegramToken === undefined) {
                delete process.env.TELEGRAM_BOT_TOKEN;
            }
            else {
                process.env.TELEGRAM_BOT_TOKEN = prevTelegramToken;
            }
        }
    });
    (0, vitest_1.it)("uses TELEGRAM_BOT_TOKEN when default account config is missing", function () {
        var prevTelegramToken = process.env.TELEGRAM_BOT_TOKEN;
        process.env.TELEGRAM_BOT_TOKEN = "tok-env";
        try {
            var cfg = {
                channels: {
                    telegram: { accounts: { work: { botToken: "tok-work" } } },
                },
            };
            var account = (0, accounts_js_1.resolveTelegramAccount)({ cfg: cfg });
            (0, vitest_1.expect)(account.accountId).toBe("default");
            (0, vitest_1.expect)(account.token).toBe("tok-env");
            (0, vitest_1.expect)(account.tokenSource).toBe("env");
        }
        finally {
            if (prevTelegramToken === undefined) {
                delete process.env.TELEGRAM_BOT_TOKEN;
            }
            else {
                process.env.TELEGRAM_BOT_TOKEN = prevTelegramToken;
            }
        }
    });
    (0, vitest_1.it)("prefers default config token over TELEGRAM_BOT_TOKEN", function () {
        var prevTelegramToken = process.env.TELEGRAM_BOT_TOKEN;
        process.env.TELEGRAM_BOT_TOKEN = "tok-env";
        try {
            var cfg = {
                channels: {
                    telegram: { botToken: "tok-config" },
                },
            };
            var account = (0, accounts_js_1.resolveTelegramAccount)({ cfg: cfg });
            (0, vitest_1.expect)(account.accountId).toBe("default");
            (0, vitest_1.expect)(account.token).toBe("tok-config");
            (0, vitest_1.expect)(account.tokenSource).toBe("config");
        }
        finally {
            if (prevTelegramToken === undefined) {
                delete process.env.TELEGRAM_BOT_TOKEN;
            }
            else {
                process.env.TELEGRAM_BOT_TOKEN = prevTelegramToken;
            }
        }
    });
    (0, vitest_1.it)("does not fall back when accountId is explicitly provided", function () {
        var prevTelegramToken = process.env.TELEGRAM_BOT_TOKEN;
        process.env.TELEGRAM_BOT_TOKEN = "";
        try {
            var cfg = {
                channels: {
                    telegram: { accounts: { work: { botToken: "tok-work" } } },
                },
            };
            var account = (0, accounts_js_1.resolveTelegramAccount)({ cfg: cfg, accountId: "default" });
            (0, vitest_1.expect)(account.accountId).toBe("default");
            (0, vitest_1.expect)(account.tokenSource).toBe("none");
            (0, vitest_1.expect)(account.token).toBe("");
        }
        finally {
            if (prevTelegramToken === undefined) {
                delete process.env.TELEGRAM_BOT_TOKEN;
            }
            else {
                process.env.TELEGRAM_BOT_TOKEN = prevTelegramToken;
            }
        }
    });
});
