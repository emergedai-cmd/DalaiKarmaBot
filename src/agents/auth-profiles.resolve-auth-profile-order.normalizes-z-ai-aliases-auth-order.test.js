"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var auth_profiles_js_1 = require("./auth-profiles.js");
(0, vitest_1.describe)("resolveAuthProfileOrder", function () {
    var _store = {
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
    var _cfg = {
        auth: {
            profiles: {
                "anthropic:default": { provider: "anthropic", mode: "api_key" },
                "anthropic:work": { provider: "anthropic", mode: "api_key" },
            },
        },
    };
    (0, vitest_1.it)("normalizes z.ai aliases in auth.order", function () {
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: {
                auth: {
                    order: { "z.ai": ["zai:work", "zai:default"] },
                    profiles: {
                        "zai:default": { provider: "zai", mode: "api_key" },
                        "zai:work": { provider: "zai", mode: "api_key" },
                    },
                },
            },
            store: {
                version: 1,
                profiles: {
                    "zai:default": {
                        type: "api_key",
                        provider: "zai",
                        key: "sk-default",
                    },
                    "zai:work": {
                        type: "api_key",
                        provider: "zai",
                        key: "sk-work",
                    },
                },
            },
            provider: "zai",
        });
        (0, vitest_1.expect)(order).toEqual(["zai:work", "zai:default"]);
    });
    (0, vitest_1.it)("normalizes provider casing in auth.order keys", function () {
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: {
                auth: {
                    order: { OpenAI: ["openai:work", "openai:default"] },
                    profiles: {
                        "openai:default": { provider: "openai", mode: "api_key" },
                        "openai:work": { provider: "openai", mode: "api_key" },
                    },
                },
            },
            store: {
                version: 1,
                profiles: {
                    "openai:default": {
                        type: "api_key",
                        provider: "openai",
                        key: "sk-default",
                    },
                    "openai:work": {
                        type: "api_key",
                        provider: "openai",
                        key: "sk-work",
                    },
                },
            },
            provider: "openai",
        });
        (0, vitest_1.expect)(order).toEqual(["openai:work", "openai:default"]);
    });
    (0, vitest_1.it)("normalizes z.ai aliases in auth.profiles", function () {
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: {
                auth: {
                    profiles: {
                        "zai:default": { provider: "z.ai", mode: "api_key" },
                        "zai:work": { provider: "Z.AI", mode: "api_key" },
                    },
                },
            },
            store: {
                version: 1,
                profiles: {
                    "zai:default": {
                        type: "api_key",
                        provider: "zai",
                        key: "sk-default",
                    },
                    "zai:work": {
                        type: "api_key",
                        provider: "zai",
                        key: "sk-work",
                    },
                },
            },
            provider: "zai",
        });
        (0, vitest_1.expect)(order).toEqual(["zai:default", "zai:work"]);
    });
    (0, vitest_1.it)("prioritizes oauth profiles when order missing", function () {
        var mixedStore = {
            version: 1,
            profiles: {
                "anthropic:default": {
                    type: "api_key",
                    provider: "anthropic",
                    key: "sk-default",
                },
                "anthropic:oauth": {
                    type: "oauth",
                    provider: "anthropic",
                    access: "access-token",
                    refresh: "refresh-token",
                    expires: Date.now() + 60000,
                },
            },
        };
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            store: mixedStore,
            provider: "anthropic",
        });
        (0, vitest_1.expect)(order).toEqual(["anthropic:oauth", "anthropic:default"]);
    });
});
