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
    (0, vitest_1.it)("orders by lastUsed when no explicit order exists", function () {
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            store: {
                version: 1,
                profiles: {
                    "anthropic:a": {
                        type: "oauth",
                        provider: "anthropic",
                        access: "access-token",
                        refresh: "refresh-token",
                        expires: Date.now() + 60000,
                    },
                    "anthropic:b": {
                        type: "api_key",
                        provider: "anthropic",
                        key: "sk-b",
                    },
                    "anthropic:c": {
                        type: "api_key",
                        provider: "anthropic",
                        key: "sk-c",
                    },
                },
                usageStats: {
                    "anthropic:a": { lastUsed: 200 },
                    "anthropic:b": { lastUsed: 100 },
                    "anthropic:c": { lastUsed: 300 },
                },
            },
            provider: "anthropic",
        });
        (0, vitest_1.expect)(order).toEqual(["anthropic:a", "anthropic:b", "anthropic:c"]);
    });
    (0, vitest_1.it)("pushes cooldown profiles to the end, ordered by cooldown expiry", function () {
        var now = Date.now();
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            store: {
                version: 1,
                profiles: {
                    "anthropic:ready": {
                        type: "api_key",
                        provider: "anthropic",
                        key: "sk-ready",
                    },
                    "anthropic:cool1": {
                        type: "oauth",
                        provider: "anthropic",
                        access: "access-token",
                        refresh: "refresh-token",
                        expires: now + 60000,
                    },
                    "anthropic:cool2": {
                        type: "api_key",
                        provider: "anthropic",
                        key: "sk-cool",
                    },
                },
                usageStats: {
                    "anthropic:ready": { lastUsed: 50 },
                    "anthropic:cool1": { cooldownUntil: now + 5000 },
                    "anthropic:cool2": { cooldownUntil: now + 1000 },
                },
            },
            provider: "anthropic",
        });
        (0, vitest_1.expect)(order).toEqual(["anthropic:ready", "anthropic:cool2", "anthropic:cool1"]);
    });
});
