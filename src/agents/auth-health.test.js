"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var auth_health_js_1 = require("./auth-health.js");
(0, vitest_1.describe)("buildAuthHealthSummary", function () {
    var now = 1700000000000;
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)("classifies OAuth and API key profiles", function () {
        vitest_1.vi.spyOn(Date, "now").mockReturnValue(now);
        var store = {
            version: 1,
            profiles: {
                "anthropic:ok": {
                    type: "oauth",
                    provider: "anthropic",
                    access: "access",
                    refresh: "refresh",
                    expires: now + auth_health_js_1.DEFAULT_OAUTH_WARN_MS + 60000,
                },
                "anthropic:expiring": {
                    type: "oauth",
                    provider: "anthropic",
                    access: "access",
                    refresh: "refresh",
                    expires: now + 10000,
                },
                "anthropic:expired": {
                    type: "oauth",
                    provider: "anthropic",
                    access: "access",
                    refresh: "refresh",
                    expires: now - 10000,
                },
                "anthropic:api": {
                    type: "api_key",
                    provider: "anthropic",
                    key: "sk-ant-api",
                },
            },
        };
        var summary = (0, auth_health_js_1.buildAuthHealthSummary)({
            store: store,
            warnAfterMs: auth_health_js_1.DEFAULT_OAUTH_WARN_MS,
        });
        var statuses = Object.fromEntries(summary.profiles.map(function (profile) { return [profile.profileId, profile.status]; }));
        (0, vitest_1.expect)(statuses["anthropic:ok"]).toBe("ok");
        // OAuth credentials with refresh tokens are auto-renewable, so they report "ok"
        (0, vitest_1.expect)(statuses["anthropic:expiring"]).toBe("ok");
        (0, vitest_1.expect)(statuses["anthropic:expired"]).toBe("ok");
        (0, vitest_1.expect)(statuses["anthropic:api"]).toBe("static");
        var provider = summary.providers.find(function (entry) { return entry.provider === "anthropic"; });
        (0, vitest_1.expect)(provider === null || provider === void 0 ? void 0 : provider.status).toBe("ok");
    });
    (0, vitest_1.it)("reports expired for OAuth without a refresh token", function () {
        vitest_1.vi.spyOn(Date, "now").mockReturnValue(now);
        var store = {
            version: 1,
            profiles: {
                "google:no-refresh": {
                    type: "oauth",
                    provider: "google-antigravity",
                    access: "access",
                    refresh: "",
                    expires: now - 10000,
                },
            },
        };
        var summary = (0, auth_health_js_1.buildAuthHealthSummary)({
            store: store,
            warnAfterMs: auth_health_js_1.DEFAULT_OAUTH_WARN_MS,
        });
        var statuses = Object.fromEntries(summary.profiles.map(function (profile) { return [profile.profileId, profile.status]; }));
        (0, vitest_1.expect)(statuses["google:no-refresh"]).toBe("expired");
    });
});
