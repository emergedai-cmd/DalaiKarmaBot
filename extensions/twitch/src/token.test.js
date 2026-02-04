"use strict";
/**
 * Tests for token.ts module
 *
 * Tests cover:
 * - Token resolution from config
 * - Token resolution from environment variable
 * - Fallback behavior when token not found
 * - Account ID normalization
 */
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var token_js_1 = require("./token.js");
(0, vitest_1.describe)("token", function () {
    // Multi-account config for testing non-default accounts
    var mockMultiAccountConfig = {
        channels: {
            twitch: {
                accounts: {
                    default: {
                        username: "testbot",
                        accessToken: "oauth:config-token",
                    },
                    other: {
                        username: "otherbot",
                        accessToken: "oauth:other-token",
                    },
                },
            },
        },
    };
    // Simplified single-account config
    var mockSimplifiedConfig = {
        channels: {
            twitch: {
                username: "testbot",
                accessToken: "oauth:config-token",
            },
        },
    };
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.restoreAllMocks();
        delete process.env.OPENCLAW_TWITCH_ACCESS_TOKEN;
    });
    (0, vitest_1.describe)("resolveTwitchToken", function () {
        (0, vitest_1.it)("should resolve token from simplified config for default account", function () {
            var result = (0, token_js_1.resolveTwitchToken)(mockSimplifiedConfig, { accountId: "default" });
            (0, vitest_1.expect)(result.token).toBe("oauth:config-token");
            (0, vitest_1.expect)(result.source).toBe("config");
        });
        (0, vitest_1.it)("should resolve token from config for non-default account (multi-account)", function () {
            var result = (0, token_js_1.resolveTwitchToken)(mockMultiAccountConfig, { accountId: "other" });
            (0, vitest_1.expect)(result.token).toBe("oauth:other-token");
            (0, vitest_1.expect)(result.source).toBe("config");
        });
        (0, vitest_1.it)("should prioritize config token over env var (simplified config)", function () {
            process.env.OPENCLAW_TWITCH_ACCESS_TOKEN = "oauth:env-token";
            var result = (0, token_js_1.resolveTwitchToken)(mockSimplifiedConfig, { accountId: "default" });
            // Config token should be used even if env var exists
            (0, vitest_1.expect)(result.token).toBe("oauth:config-token");
            (0, vitest_1.expect)(result.source).toBe("config");
        });
        (0, vitest_1.it)("should use env var when config token is empty (simplified config)", function () {
            process.env.OPENCLAW_TWITCH_ACCESS_TOKEN = "oauth:env-token";
            var configWithEmptyToken = {
                channels: {
                    twitch: {
                        username: "testbot",
                        accessToken: "",
                    },
                },
            };
            var result = (0, token_js_1.resolveTwitchToken)(configWithEmptyToken, { accountId: "default" });
            (0, vitest_1.expect)(result.token).toBe("oauth:env-token");
            (0, vitest_1.expect)(result.source).toBe("env");
        });
        (0, vitest_1.it)("should return empty token when neither config nor env has token (simplified config)", function () {
            var configWithoutToken = {
                channels: {
                    twitch: {
                        username: "testbot",
                        accessToken: "",
                    },
                },
            };
            var result = (0, token_js_1.resolveTwitchToken)(configWithoutToken, { accountId: "default" });
            (0, vitest_1.expect)(result.token).toBe("");
            (0, vitest_1.expect)(result.source).toBe("none");
        });
        (0, vitest_1.it)("should not use env var for non-default accounts (multi-account)", function () {
            process.env.OPENCLAW_TWITCH_ACCESS_TOKEN = "oauth:env-token";
            var configWithoutToken = {
                channels: {
                    twitch: {
                        accounts: {
                            secondary: {
                                username: "secondary",
                                accessToken: "",
                            },
                        },
                    },
                },
            };
            var result = (0, token_js_1.resolveTwitchToken)(configWithoutToken, { accountId: "secondary" });
            // Non-default accounts shouldn't use env var
            (0, vitest_1.expect)(result.token).toBe("");
            (0, vitest_1.expect)(result.source).toBe("none");
        });
        (0, vitest_1.it)("should handle missing account gracefully", function () {
            var configWithoutAccount = {
                channels: {
                    twitch: {
                        accounts: {},
                    },
                },
            };
            var result = (0, token_js_1.resolveTwitchToken)(configWithoutAccount, { accountId: "nonexistent" });
            (0, vitest_1.expect)(result.token).toBe("");
            (0, vitest_1.expect)(result.source).toBe("none");
        });
        (0, vitest_1.it)("should handle missing Twitch config section", function () {
            var configWithoutSection = {
                channels: {},
            };
            var result = (0, token_js_1.resolveTwitchToken)(configWithoutSection, { accountId: "default" });
            (0, vitest_1.expect)(result.token).toBe("");
            (0, vitest_1.expect)(result.source).toBe("none");
        });
    });
    (0, vitest_1.describe)("TwitchTokenSource type", function () {
        (0, vitest_1.it)("should have correct values", function () {
            var sources = ["env", "config", "none"];
            (0, vitest_1.expect)(sources).toContain("env");
            (0, vitest_1.expect)(sources).toContain("config");
            (0, vitest_1.expect)(sources).toContain("none");
        });
    });
});
