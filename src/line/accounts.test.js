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
var vitest_1 = require("vitest");
var accounts_js_1 = require("./accounts.js");
(0, vitest_1.describe)("LINE accounts", function () {
    var originalEnv = __assign({}, process.env);
    (0, vitest_1.beforeEach)(function () {
        process.env = __assign({}, originalEnv);
        delete process.env.LINE_CHANNEL_ACCESS_TOKEN;
        delete process.env.LINE_CHANNEL_SECRET;
    });
    (0, vitest_1.afterEach)(function () {
        process.env = originalEnv;
    });
    (0, vitest_1.describe)("resolveLineAccount", function () {
        (0, vitest_1.it)("resolves account from config", function () {
            var cfg = {
                channels: {
                    line: {
                        enabled: true,
                        channelAccessToken: "test-token",
                        channelSecret: "test-secret",
                        name: "Test Bot",
                    },
                },
            };
            var account = (0, accounts_js_1.resolveLineAccount)({ cfg: cfg });
            (0, vitest_1.expect)(account.accountId).toBe(accounts_js_1.DEFAULT_ACCOUNT_ID);
            (0, vitest_1.expect)(account.enabled).toBe(true);
            (0, vitest_1.expect)(account.channelAccessToken).toBe("test-token");
            (0, vitest_1.expect)(account.channelSecret).toBe("test-secret");
            (0, vitest_1.expect)(account.name).toBe("Test Bot");
            (0, vitest_1.expect)(account.tokenSource).toBe("config");
        });
        (0, vitest_1.it)("resolves account from environment variables", function () {
            process.env.LINE_CHANNEL_ACCESS_TOKEN = "env-token";
            process.env.LINE_CHANNEL_SECRET = "env-secret";
            var cfg = {
                channels: {
                    line: {
                        enabled: true,
                    },
                },
            };
            var account = (0, accounts_js_1.resolveLineAccount)({ cfg: cfg });
            (0, vitest_1.expect)(account.channelAccessToken).toBe("env-token");
            (0, vitest_1.expect)(account.channelSecret).toBe("env-secret");
            (0, vitest_1.expect)(account.tokenSource).toBe("env");
        });
        (0, vitest_1.it)("resolves named account", function () {
            var cfg = {
                channels: {
                    line: {
                        enabled: true,
                        accounts: {
                            business: {
                                enabled: true,
                                channelAccessToken: "business-token",
                                channelSecret: "business-secret",
                                name: "Business Bot",
                            },
                        },
                    },
                },
            };
            var account = (0, accounts_js_1.resolveLineAccount)({ cfg: cfg, accountId: "business" });
            (0, vitest_1.expect)(account.accountId).toBe("business");
            (0, vitest_1.expect)(account.enabled).toBe(true);
            (0, vitest_1.expect)(account.channelAccessToken).toBe("business-token");
            (0, vitest_1.expect)(account.channelSecret).toBe("business-secret");
            (0, vitest_1.expect)(account.name).toBe("Business Bot");
        });
        (0, vitest_1.it)("returns empty token when not configured", function () {
            var cfg = {};
            var account = (0, accounts_js_1.resolveLineAccount)({ cfg: cfg });
            (0, vitest_1.expect)(account.channelAccessToken).toBe("");
            (0, vitest_1.expect)(account.channelSecret).toBe("");
            (0, vitest_1.expect)(account.tokenSource).toBe("none");
        });
    });
    (0, vitest_1.describe)("listLineAccountIds", function () {
        (0, vitest_1.it)("returns default account when configured at base level", function () {
            var cfg = {
                channels: {
                    line: {
                        channelAccessToken: "test-token",
                    },
                },
            };
            var ids = (0, accounts_js_1.listLineAccountIds)(cfg);
            (0, vitest_1.expect)(ids).toContain(accounts_js_1.DEFAULT_ACCOUNT_ID);
        });
        (0, vitest_1.it)("returns named accounts", function () {
            var cfg = {
                channels: {
                    line: {
                        accounts: {
                            business: { enabled: true },
                            personal: { enabled: true },
                        },
                    },
                },
            };
            var ids = (0, accounts_js_1.listLineAccountIds)(cfg);
            (0, vitest_1.expect)(ids).toContain("business");
            (0, vitest_1.expect)(ids).toContain("personal");
        });
        (0, vitest_1.it)("returns default from env", function () {
            process.env.LINE_CHANNEL_ACCESS_TOKEN = "env-token";
            var cfg = {};
            var ids = (0, accounts_js_1.listLineAccountIds)(cfg);
            (0, vitest_1.expect)(ids).toContain(accounts_js_1.DEFAULT_ACCOUNT_ID);
        });
    });
    (0, vitest_1.describe)("resolveDefaultLineAccountId", function () {
        (0, vitest_1.it)("returns default when configured", function () {
            var cfg = {
                channels: {
                    line: {
                        channelAccessToken: "test-token",
                    },
                },
            };
            var id = (0, accounts_js_1.resolveDefaultLineAccountId)(cfg);
            (0, vitest_1.expect)(id).toBe(accounts_js_1.DEFAULT_ACCOUNT_ID);
        });
        (0, vitest_1.it)("returns first named account when default not configured", function () {
            var cfg = {
                channels: {
                    line: {
                        accounts: {
                            business: { enabled: true },
                        },
                    },
                },
            };
            var id = (0, accounts_js_1.resolveDefaultLineAccountId)(cfg);
            (0, vitest_1.expect)(id).toBe("business");
        });
    });
    (0, vitest_1.describe)("normalizeAccountId", function () {
        (0, vitest_1.it)("normalizes undefined to default", function () {
            (0, vitest_1.expect)((0, accounts_js_1.normalizeAccountId)(undefined)).toBe(accounts_js_1.DEFAULT_ACCOUNT_ID);
        });
        (0, vitest_1.it)("normalizes 'default' to DEFAULT_ACCOUNT_ID", function () {
            (0, vitest_1.expect)((0, accounts_js_1.normalizeAccountId)("default")).toBe(accounts_js_1.DEFAULT_ACCOUNT_ID);
        });
        (0, vitest_1.it)("preserves other account ids", function () {
            (0, vitest_1.expect)((0, accounts_js_1.normalizeAccountId)("business")).toBe("business");
        });
        (0, vitest_1.it)("lowercases account ids", function () {
            (0, vitest_1.expect)((0, accounts_js_1.normalizeAccountId)("Business")).toBe("business");
        });
        (0, vitest_1.it)("trims whitespace", function () {
            (0, vitest_1.expect)((0, accounts_js_1.normalizeAccountId)("  business  ")).toBe("business");
        });
    });
});
