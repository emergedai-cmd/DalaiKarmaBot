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
    (0, vitest_1.it)("does not prioritize lastGood over round-robin ordering", function () {
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: cfg,
            store: __assign(__assign({}, store), { lastGood: { anthropic: "anthropic:work" }, usageStats: {
                    "anthropic:default": { lastUsed: 100 },
                    "anthropic:work": { lastUsed: 200 },
                } }),
            provider: "anthropic",
        });
        (0, vitest_1.expect)(order[0]).toBe("anthropic:default");
    });
    (0, vitest_1.it)("uses explicit profiles when order is missing", function () {
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: cfg,
            store: store,
            provider: "anthropic",
        });
        (0, vitest_1.expect)(order).toEqual(["anthropic:default", "anthropic:work"]);
    });
    (0, vitest_1.it)("uses configured order when provided", function () {
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: {
                auth: {
                    order: { anthropic: ["anthropic:work", "anthropic:default"] },
                    profiles: cfg.auth.profiles,
                },
            },
            store: store,
            provider: "anthropic",
        });
        (0, vitest_1.expect)(order).toEqual(["anthropic:work", "anthropic:default"]);
    });
    (0, vitest_1.it)("prefers store order over config order", function () {
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: {
                auth: {
                    order: { anthropic: ["anthropic:default", "anthropic:work"] },
                    profiles: cfg.auth.profiles,
                },
            },
            store: __assign(__assign({}, store), { order: { anthropic: ["anthropic:work", "anthropic:default"] } }),
            provider: "anthropic",
        });
        (0, vitest_1.expect)(order).toEqual(["anthropic:work", "anthropic:default"]);
    });
    (0, vitest_1.it)("pushes cooldown profiles to the end even with store order", function () {
        var now = Date.now();
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            store: __assign(__assign({}, store), { order: { anthropic: ["anthropic:default", "anthropic:work"] }, usageStats: {
                    "anthropic:default": { cooldownUntil: now + 60000 },
                    "anthropic:work": { lastUsed: 1 },
                } }),
            provider: "anthropic",
        });
        (0, vitest_1.expect)(order).toEqual(["anthropic:work", "anthropic:default"]);
    });
    (0, vitest_1.it)("pushes cooldown profiles to the end even with configured order", function () {
        var now = Date.now();
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: {
                auth: {
                    order: { anthropic: ["anthropic:default", "anthropic:work"] },
                    profiles: cfg.auth.profiles,
                },
            },
            store: __assign(__assign({}, store), { usageStats: {
                    "anthropic:default": { cooldownUntil: now + 60000 },
                    "anthropic:work": { lastUsed: 1 },
                } }),
            provider: "anthropic",
        });
        (0, vitest_1.expect)(order).toEqual(["anthropic:work", "anthropic:default"]);
    });
    (0, vitest_1.it)("pushes disabled profiles to the end even with store order", function () {
        var now = Date.now();
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            store: __assign(__assign({}, store), { order: { anthropic: ["anthropic:default", "anthropic:work"] }, usageStats: {
                    "anthropic:default": {
                        disabledUntil: now + 60000,
                        disabledReason: "billing",
                    },
                    "anthropic:work": { lastUsed: 1 },
                } }),
            provider: "anthropic",
        });
        (0, vitest_1.expect)(order).toEqual(["anthropic:work", "anthropic:default"]);
    });
    (0, vitest_1.it)("pushes disabled profiles to the end even with configured order", function () {
        var now = Date.now();
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: {
                auth: {
                    order: { anthropic: ["anthropic:default", "anthropic:work"] },
                    profiles: cfg.auth.profiles,
                },
            },
            store: __assign(__assign({}, store), { usageStats: {
                    "anthropic:default": {
                        disabledUntil: now + 60000,
                        disabledReason: "billing",
                    },
                    "anthropic:work": { lastUsed: 1 },
                } }),
            provider: "anthropic",
        });
        (0, vitest_1.expect)(order).toEqual(["anthropic:work", "anthropic:default"]);
    });
    (0, vitest_1.it)("mode: oauth config accepts both oauth and token credentials (issue #559)", function () {
        var now = Date.now();
        var storeWithBothTypes = {
            version: 1,
            profiles: {
                "anthropic:oauth-cred": {
                    type: "oauth",
                    provider: "anthropic",
                    access: "access-token",
                    refresh: "refresh-token",
                    expires: now + 60000,
                },
                "anthropic:token-cred": {
                    type: "token",
                    provider: "anthropic",
                    token: "just-a-token",
                    expires: now + 60000,
                },
            },
        };
        var orderOauthCred = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            store: storeWithBothTypes,
            provider: "anthropic",
            cfg: {
                auth: {
                    profiles: {
                        "anthropic:oauth-cred": { provider: "anthropic", mode: "oauth" },
                    },
                },
            },
        });
        (0, vitest_1.expect)(orderOauthCred).toContain("anthropic:oauth-cred");
        var orderTokenCred = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            store: storeWithBothTypes,
            provider: "anthropic",
            cfg: {
                auth: {
                    profiles: {
                        "anthropic:token-cred": { provider: "anthropic", mode: "oauth" },
                    },
                },
            },
        });
        (0, vitest_1.expect)(orderTokenCred).toContain("anthropic:token-cred");
    });
    (0, vitest_1.it)("mode: token config rejects oauth credentials (issue #559 root cause)", function () {
        var now = Date.now();
        var storeWithOauth = {
            version: 1,
            profiles: {
                "anthropic:oauth-cred": {
                    type: "oauth",
                    provider: "anthropic",
                    access: "access-token",
                    refresh: "refresh-token",
                    expires: now + 60000,
                },
            },
        };
        var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            store: storeWithOauth,
            provider: "anthropic",
            cfg: {
                auth: {
                    profiles: {
                        "anthropic:oauth-cred": { provider: "anthropic", mode: "token" },
                    },
                },
            },
        });
        (0, vitest_1.expect)(order).not.toContain("anthropic:oauth-cred");
    });
});
