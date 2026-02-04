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
exports.resolveProviderAuthOverview = resolveProviderAuthOverview;
var auth_health_js_1 = require("../../agents/auth-health.js");
var auth_profiles_js_1 = require("../../agents/auth-profiles.js");
var model_auth_js_1 = require("../../agents/model-auth.js");
var utils_js_1 = require("../../utils.js");
var list_format_js_1 = require("./list.format.js");
function resolveProviderAuthOverview(params) {
    var provider = params.provider, cfg = params.cfg, store = params.store;
    var now = Date.now();
    var profiles = (0, auth_profiles_js_1.listProfilesForProvider)(store, provider);
    var withUnusableSuffix = function (base, profileId) {
        var _a;
        var unusableUntil = (0, auth_profiles_js_1.resolveProfileUnusableUntilForDisplay)(store, profileId);
        if (!unusableUntil || now >= unusableUntil) {
            return base;
        }
        var stats = (_a = store.usageStats) === null || _a === void 0 ? void 0 : _a[profileId];
        var kind = typeof (stats === null || stats === void 0 ? void 0 : stats.disabledUntil) === "number" && now < stats.disabledUntil
            ? "disabled".concat(stats.disabledReason ? ":".concat(stats.disabledReason) : "")
            : "cooldown";
        var remaining = (0, auth_health_js_1.formatRemainingShort)(unusableUntil - now);
        return "".concat(base, " [").concat(kind, " ").concat(remaining, "]");
    };
    var labels = profiles.map(function (profileId) {
        var profile = store.profiles[profileId];
        if (!profile) {
            return "".concat(profileId, "=missing");
        }
        if (profile.type === "api_key") {
            return withUnusableSuffix("".concat(profileId, "=").concat((0, list_format_js_1.maskApiKey)(profile.key)), profileId);
        }
        if (profile.type === "token") {
            return withUnusableSuffix("".concat(profileId, "=token:").concat((0, list_format_js_1.maskApiKey)(profile.token)), profileId);
        }
        var display = (0, auth_profiles_js_1.resolveAuthProfileDisplayLabel)({ cfg: cfg, store: store, profileId: profileId });
        var suffix = display === profileId
            ? ""
            : display.startsWith(profileId)
                ? display.slice(profileId.length).trim()
                : "(".concat(display, ")");
        var base = "".concat(profileId, "=OAuth").concat(suffix ? " ".concat(suffix) : "");
        return withUnusableSuffix(base, profileId);
    });
    var oauthCount = profiles.filter(function (id) { var _a; return ((_a = store.profiles[id]) === null || _a === void 0 ? void 0 : _a.type) === "oauth"; }).length;
    var tokenCount = profiles.filter(function (id) { var _a; return ((_a = store.profiles[id]) === null || _a === void 0 ? void 0 : _a.type) === "token"; }).length;
    var apiKeyCount = profiles.filter(function (id) { var _a; return ((_a = store.profiles[id]) === null || _a === void 0 ? void 0 : _a.type) === "api_key"; }).length;
    var envKey = (0, model_auth_js_1.resolveEnvApiKey)(provider);
    var customKey = (0, model_auth_js_1.getCustomProviderApiKey)(cfg, provider);
    var effective = (function () {
        if (profiles.length > 0) {
            return {
                kind: "profiles",
                detail: (0, utils_js_1.shortenHomePath)((0, auth_profiles_js_1.resolveAuthStorePathForDisplay)()),
            };
        }
        if (envKey) {
            var isOAuthEnv = envKey.source.includes("OAUTH_TOKEN") || envKey.source.toLowerCase().includes("oauth");
            return {
                kind: "env",
                detail: isOAuthEnv ? "OAuth (env)" : (0, list_format_js_1.maskApiKey)(envKey.apiKey),
            };
        }
        if (customKey) {
            return { kind: "models.json", detail: (0, list_format_js_1.maskApiKey)(customKey) };
        }
        return { kind: "missing", detail: "missing" };
    })();
    return __assign(__assign({ provider: provider, effective: effective, profiles: {
            count: profiles.length,
            oauth: oauthCount,
            token: tokenCount,
            apiKey: apiKeyCount,
            labels: labels,
        } }, (envKey
        ? {
            env: {
                value: envKey.source.includes("OAUTH_TOKEN") || envKey.source.toLowerCase().includes("oauth")
                    ? "OAuth (env)"
                    : (0, list_format_js_1.maskApiKey)(envKey.apiKey),
                source: envKey.source,
            },
        }
        : {})), (customKey
        ? {
            modelsJson: {
                value: (0, list_format_js_1.maskApiKey)(customKey),
                source: "models.json: ".concat((0, utils_js_1.shortenHomePath)(params.modelsPath)),
            },
        }
        : {}));
}
