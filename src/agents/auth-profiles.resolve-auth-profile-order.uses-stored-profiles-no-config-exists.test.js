"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var auth_profiles_js_1 = require("./auth-profiles.js");
(0, vitest_1.describe)("resolveAuthProfileOrder", function () {
    var store = {
        version: 1,
        profiles: {
            "anthropic:default": {
                type: "api_key",
                provider: "anthropic",
                key: "sk-default",
            },
            "anthropic:work": {
                type: "api_key",
                provider: "anthropic",
                key: "sk-work",
            },
        },
    };
    var cfg = {
        auth: {
            profiles: {
                "anthropic:default": { provider: "anthropic", mode: "api_key" },
                "anthropic:work": { provider: "anthropic", mode: "api_key" },
            },
        },
    };
    (0, vitest_1.it)("uses stored profiles when no config exists", function () {
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            store: store,
            provider: "anthropic",
        });
        (0, vitest_1.expect)(order).toEqual(["anthropic:default", "anthropic:work"]);
    });
    (0, vitest_1.it)("prioritizes preferred profiles", function () {
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: cfg,
            store: store,
            provider: "anthropic",
            preferredProfile: "anthropic:work",
        });
        (0, vitest_1.expect)(order[0]).toBe("anthropic:work");
        (0, vitest_1.expect)(order).toContain("anthropic:default");
    });
    (0, vitest_1.it)("drops explicit order entries that are missing from the store", function () {
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: {
                auth: {
                    order: {
                        minimax: ["minimax:default", "minimax:prod"],
                    },
                },
            },
            store: {
                version: 1,
                profiles: {
                    "minimax:prod": {
                        type: "api_key",
                        provider: "minimax",
                        key: "sk-prod",
                    },
                },
            },
            provider: "minimax",
        });
        (0, vitest_1.expect)(order).toEqual(["minimax:prod"]);
    });
    (0, vitest_1.it)("drops explicit order entries that belong to another provider", function () {
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: {
                auth: {
                    order: {
                        minimax: ["openai:default", "minimax:prod"],
                    },
                },
            },
            store: {
                version: 1,
                profiles: {
                    "openai:default": {
                        type: "api_key",
                        provider: "openai",
                        key: "sk-openai",
                    },
                    "minimax:prod": {
                        type: "api_key",
                        provider: "minimax",
                        key: "sk-mini",
                    },
                },
            },
            provider: "minimax",
        });
        (0, vitest_1.expect)(order).toEqual(["minimax:prod"]);
    });
    (0, vitest_1.it)("drops token profiles with empty credentials", function () {
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: {
                auth: {
                    order: {
                        minimax: ["minimax:default"],
                    },
                },
            },
            store: {
                version: 1,
                profiles: {
                    "minimax:default": {
                        type: "token",
                        provider: "minimax",
                        token: "   ",
                    },
                },
            },
            provider: "minimax",
        });
        (0, vitest_1.expect)(order).toEqual([]);
    });
    (0, vitest_1.it)("drops token profiles that are already expired", function () {
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: {
                auth: {
                    order: {
                        minimax: ["minimax:default"],
                    },
                },
            },
            store: {
                version: 1,
                profiles: {
                    "minimax:default": {
                        type: "token",
                        provider: "minimax",
                        token: "sk-minimax",
                        expires: Date.now() - 1000,
                    },
                },
            },
            provider: "minimax",
        });
        (0, vitest_1.expect)(order).toEqual([]);
    });
    (0, vitest_1.it)("keeps oauth profiles that can refresh", function () {
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: {
                auth: {
                    order: {
                        anthropic: ["anthropic:oauth"],
                    },
                },
            },
            store: {
                version: 1,
                profiles: {
                    "anthropic:oauth": {
                        type: "oauth",
                        provider: "anthropic",
                        access: "",
                        refresh: "refresh-token",
                        expires: Date.now() - 1000,
                    },
                },
            },
            provider: "anthropic",
        });
        (0, vitest_1.expect)(order).toEqual(["anthropic:oauth"]);
    });
});
