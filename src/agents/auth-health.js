"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OAUTH_WARN_MS = void 0;
exports.resolveAuthProfileSource = resolveAuthProfileSource;
exports.formatRemainingShort = formatRemainingShort;
exports.buildAuthHealthSummary = buildAuthHealthSummary;
var auth_profiles_js_1 = require("./auth-profiles.js");
exports.DEFAULT_OAUTH_WARN_MS = 24 * 60 * 60 * 1000;
function resolveAuthProfileSource(_profileId) {
    return "store";
}
function formatRemainingShort(remainingMs) {
    if (remainingMs === undefined || Number.isNaN(remainingMs)) {
        return "unknown";
    }
    if (remainingMs <= 0) {
        return "0m";
    }
    var minutes = Math.max(1, Math.round(remainingMs / 60000));
    if (minutes < 60) {
        return "".concat(minutes, "m");
    }
    var hours = Math.round(minutes / 60);
    if (hours < 48) {
        return "".concat(hours, "h");
    }
    var days = Math.round(hours / 24);
    return "".concat(days, "d");
}
function resolveOAuthStatus(expiresAt, now, warnAfterMs) {
    if (!expiresAt || !Number.isFinite(expiresAt) || expiresAt <= 0) {
        return { status: "missing" };
    }
    var remainingMs = expiresAt - now;
    if (remainingMs <= 0) {
        return { status: "expired", remainingMs: remainingMs };
    }
    if (remainingMs <= warnAfterMs) {
        return { status: "expiring", remainingMs: remainingMs };
    }
    return { status: "ok", remainingMs: remainingMs };
}
function buildProfileHealth(params) {
    var profileId = params.profileId, credential = params.credential, store = params.store, cfg = params.cfg, now = params.now, warnAfterMs = params.warnAfterMs;
    var label = (0, auth_profiles_js_1.resolveAuthProfileDisplayLabel)({ cfg: cfg, store: store, profileId: profileId });
    var source = resolveAuthProfileSource(profileId);
    if (credential.type === "api_key") {
        return {
            profileId: profileId,
            provider: credential.provider,
            type: "api_key",
            status: "static",
            source: source,
            label: label,
        };
    }
    if (credential.type === "token") {
        var expiresAt = typeof credential.expires === "number" && Number.isFinite(credential.expires)
            ? credential.expires
            : undefined;
        if (!expiresAt || expiresAt <= 0) {
            return {
                profileId: profileId,
                provider: credential.provider,
                type: "token",
                status: "static",
                source: source,
                label: label,
            };
        }
        var _a = resolveOAuthStatus(expiresAt, now, warnAfterMs), status_1 = _a.status, remainingMs_1 = _a.remainingMs;
        return {
            profileId: profileId,
            provider: credential.provider,
            type: "token",
            status: status_1,
            expiresAt: expiresAt,
            remainingMs: remainingMs_1,
            source: source,
            label: label,
        };
    }
    var hasRefreshToken = typeof credential.refresh === "string" && credential.refresh.length > 0;
    var _b = resolveOAuthStatus(credential.expires, now, warnAfterMs), rawStatus = _b.status, remainingMs = _b.remainingMs;
    // OAuth credentials with a valid refresh token auto-renew on first API call,
    // so don't warn about access token expiration.
    var status = hasRefreshToken && (rawStatus === "expired" || rawStatus === "expiring") ? "ok" : rawStatus;
    return {
        profileId: profileId,
        provider: credential.provider,
        type: "oauth",
        status: status,
        expiresAt: credential.expires,
        remainingMs: remainingMs,
        source: source,
        label: label,
    };
}
function buildAuthHealthSummary(params) {
    var _a;
    var now = Date.now();
    var warnAfterMs = (_a = params.warnAfterMs) !== null && _a !== void 0 ? _a : exports.DEFAULT_OAUTH_WARN_MS;
    var providerFilter = params.providers
        ? new Set(params.providers.map(function (p) { return p.trim(); }).filter(Boolean))
        : null;
    var profiles = Object.entries(params.store.profiles)
        .filter(function (_a) {
        var _ = _a[0], cred = _a[1];
        return (providerFilter ? providerFilter.has(cred.provider) : true);
    })
        .map(function (_a) {
        var profileId = _a[0], credential = _a[1];
        return buildProfileHealth({
            profileId: profileId,
            credential: credential,
            store: params.store,
            cfg: params.cfg,
            now: now,
            warnAfterMs: warnAfterMs,
        });
    })
        .toSorted(function (a, b) {
        if (a.provider !== b.provider) {
            return a.provider.localeCompare(b.provider);
        }
        return a.profileId.localeCompare(b.profileId);
    });
    var providersMap = new Map();
    for (var _i = 0, profiles_1 = profiles; _i < profiles_1.length; _i++) {
        var profile = profiles_1[_i];
        var existing = providersMap.get(profile.provider);
        if (!existing) {
            providersMap.set(profile.provider, {
                provider: profile.provider,
                status: "missing",
                profiles: [profile],
            });
        }
        else {
            existing.profiles.push(profile);
        }
    }
    if (providerFilter) {
        for (var _b = 0, providerFilter_1 = providerFilter; _b < providerFilter_1.length; _b++) {
            var provider = providerFilter_1[_b];
            if (!providersMap.has(provider)) {
                providersMap.set(provider, {
                    provider: provider,
                    status: "missing",
                    profiles: [],
                });
            }
        }
    }
    for (var _c = 0, _d = providersMap.values(); _c < _d.length; _c++) {
        var provider = _d[_c];
        if (provider.profiles.length === 0) {
            provider.status = "missing";
            continue;
        }
        var oauthProfiles = provider.profiles.filter(function (p) { return p.type === "oauth"; });
        var tokenProfiles = provider.profiles.filter(function (p) { return p.type === "token"; });
        var apiKeyProfiles = provider.profiles.filter(function (p) { return p.type === "api_key"; });
        var expirable = __spreadArray(__spreadArray([], oauthProfiles, true), tokenProfiles, true);
        if (expirable.length === 0) {
            provider.status = apiKeyProfiles.length > 0 ? "static" : "missing";
            continue;
        }
        var expiryCandidates = expirable
            .map(function (p) { return p.expiresAt; })
            .filter(function (v) { return typeof v === "number" && Number.isFinite(v); });
        if (expiryCandidates.length > 0) {
            provider.expiresAt = Math.min.apply(Math, expiryCandidates);
            provider.remainingMs = provider.expiresAt - now;
        }
        var statuses = new Set(expirable.map(function (p) { return p.status; }));
        if (statuses.has("expired") || statuses.has("missing")) {
            provider.status = "expired";
        }
        else if (statuses.has("expiring")) {
            provider.status = "expiring";
        }
        else {
            provider.status = "ok";
        }
    }
    var providers = Array.from(providersMap.values()).toSorted(function (a, b) {
        return a.provider.localeCompare(b.provider);
    });
    return { now: now, warnAfterMs: warnAfterMs, profiles: profiles, providers: providers };
}
