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
exports.isChannelConfigured = isChannelConfigured;
exports.applyPluginAutoEnable = applyPluginAutoEnable;
var model_selection_js_1 = require("../agents/model-selection.js");
var catalog_js_1 = require("../channels/plugins/catalog.js");
var registry_js_1 = require("../channels/registry.js");
var accounts_js_1 = require("../web/accounts.js");
var CHANNEL_PLUGIN_IDS = Array.from(new Set(__spreadArray(__spreadArray([], (0, registry_js_1.listChatChannels)().map(function (meta) { return meta.id; }), true), (0, catalog_js_1.listChannelPluginCatalogEntries)().map(function (entry) { return entry.id; }), true)));
var PROVIDER_PLUGIN_IDS = [
    { pluginId: "google-antigravity-auth", providerId: "google-antigravity" },
    { pluginId: "google-gemini-cli-auth", providerId: "google-gemini-cli" },
    { pluginId: "qwen-portal-auth", providerId: "qwen-portal" },
    { pluginId: "copilot-proxy", providerId: "copilot-proxy" },
    { pluginId: "minimax-portal-auth", providerId: "minimax-portal" },
];
function isRecord(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function hasNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function recordHasKeys(value) {
    return isRecord(value) && Object.keys(value).length > 0;
}
function accountsHaveKeys(value, keys) {
    if (!isRecord(value)) {
        return false;
    }
    for (var _i = 0, _a = Object.values(value); _i < _a.length; _i++) {
        var account = _a[_i];
        if (!isRecord(account)) {
            continue;
        }
        for (var _b = 0, keys_1 = keys; _b < keys_1.length; _b++) {
            var key = keys_1[_b];
            if (hasNonEmptyString(account[key])) {
                return true;
            }
        }
    }
    return false;
}
function resolveChannelConfig(cfg, channelId) {
    var channels = cfg.channels;
    var entry = channels === null || channels === void 0 ? void 0 : channels[channelId];
    return isRecord(entry) ? entry : null;
}
function isTelegramConfigured(cfg, env) {
    if (hasNonEmptyString(env.TELEGRAM_BOT_TOKEN)) {
        return true;
    }
    var entry = resolveChannelConfig(cfg, "telegram");
    if (!entry) {
        return false;
    }
    if (hasNonEmptyString(entry.botToken) || hasNonEmptyString(entry.tokenFile)) {
        return true;
    }
    if (accountsHaveKeys(entry.accounts, ["botToken", "tokenFile"])) {
        return true;
    }
    return recordHasKeys(entry);
}
function isDiscordConfigured(cfg, env) {
    if (hasNonEmptyString(env.DISCORD_BOT_TOKEN)) {
        return true;
    }
    var entry = resolveChannelConfig(cfg, "discord");
    if (!entry) {
        return false;
    }
    if (hasNonEmptyString(entry.token)) {
        return true;
    }
    if (accountsHaveKeys(entry.accounts, ["token"])) {
        return true;
    }
    return recordHasKeys(entry);
}
function isSlackConfigured(cfg, env) {
    if (hasNonEmptyString(env.SLACK_BOT_TOKEN) ||
        hasNonEmptyString(env.SLACK_APP_TOKEN) ||
        hasNonEmptyString(env.SLACK_USER_TOKEN)) {
        return true;
    }
    var entry = resolveChannelConfig(cfg, "slack");
    if (!entry) {
        return false;
    }
    if (hasNonEmptyString(entry.botToken) ||
        hasNonEmptyString(entry.appToken) ||
        hasNonEmptyString(entry.userToken)) {
        return true;
    }
    if (accountsHaveKeys(entry.accounts, ["botToken", "appToken", "userToken"])) {
        return true;
    }
    return recordHasKeys(entry);
}
function isSignalConfigured(cfg) {
    var entry = resolveChannelConfig(cfg, "signal");
    if (!entry) {
        return false;
    }
    if (hasNonEmptyString(entry.account) ||
        hasNonEmptyString(entry.httpUrl) ||
        hasNonEmptyString(entry.httpHost) ||
        typeof entry.httpPort === "number" ||
        hasNonEmptyString(entry.cliPath)) {
        return true;
    }
    if (accountsHaveKeys(entry.accounts, ["account", "httpUrl", "httpHost", "cliPath"])) {
        return true;
    }
    return recordHasKeys(entry);
}
function isIMessageConfigured(cfg) {
    var entry = resolveChannelConfig(cfg, "imessage");
    if (!entry) {
        return false;
    }
    if (hasNonEmptyString(entry.cliPath)) {
        return true;
    }
    return recordHasKeys(entry);
}
function isWhatsAppConfigured(cfg) {
    if ((0, accounts_js_1.hasAnyWhatsAppAuth)(cfg)) {
        return true;
    }
    var entry = resolveChannelConfig(cfg, "whatsapp");
    if (!entry) {
        return false;
    }
    return recordHasKeys(entry);
}
function isGenericChannelConfigured(cfg, channelId) {
    var entry = resolveChannelConfig(cfg, channelId);
    return recordHasKeys(entry);
}
function isChannelConfigured(cfg, channelId, env) {
    if (env === void 0) { env = process.env; }
    switch (channelId) {
        case "whatsapp":
            return isWhatsAppConfigured(cfg);
        case "telegram":
            return isTelegramConfigured(cfg, env);
        case "discord":
            return isDiscordConfigured(cfg, env);
        case "slack":
            return isSlackConfigured(cfg, env);
        case "signal":
            return isSignalConfigured(cfg);
        case "imessage":
            return isIMessageConfigured(cfg);
        default:
            return isGenericChannelConfigured(cfg, channelId);
    }
}
function collectModelRefs(cfg) {
    var _a, _b;
    var refs = [];
    var pushModelRef = function (value) {
        if (typeof value === "string" && value.trim()) {
            refs.push(value.trim());
        }
    };
    var collectFromAgent = function (agent) {
        if (!agent) {
            return;
        }
        var model = agent.model;
        if (typeof model === "string") {
            pushModelRef(model);
        }
        else if (isRecord(model)) {
            pushModelRef(model.primary);
            var fallbacks = model.fallbacks;
            if (Array.isArray(fallbacks)) {
                for (var _i = 0, fallbacks_1 = fallbacks; _i < fallbacks_1.length; _i++) {
                    var entry = fallbacks_1[_i];
                    pushModelRef(entry);
                }
            }
        }
        var models = agent.models;
        if (isRecord(models)) {
            for (var _a = 0, _b = Object.keys(models); _a < _b.length; _a++) {
                var key = _b[_a];
                pushModelRef(key);
            }
        }
    };
    var defaults = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults;
    collectFromAgent(defaults);
    var list = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.list;
    if (Array.isArray(list)) {
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var entry = list_1[_i];
            if (isRecord(entry)) {
                collectFromAgent(entry);
            }
        }
    }
    return refs;
}
function extractProviderFromModelRef(value) {
    var trimmed = value.trim();
    var slash = trimmed.indexOf("/");
    if (slash <= 0) {
        return null;
    }
    return (0, model_selection_js_1.normalizeProviderId)(trimmed.slice(0, slash));
}
function isProviderConfigured(cfg, providerId) {
    var _a, _b, _c;
    var normalized = (0, model_selection_js_1.normalizeProviderId)(providerId);
    var profiles = (_a = cfg.auth) === null || _a === void 0 ? void 0 : _a.profiles;
    if (profiles && typeof profiles === "object") {
        for (var _i = 0, _d = Object.values(profiles); _i < _d.length; _i++) {
            var profile = _d[_i];
            if (!isRecord(profile)) {
                continue;
            }
            var provider = (0, model_selection_js_1.normalizeProviderId)(String((_b = profile.provider) !== null && _b !== void 0 ? _b : ""));
            if (provider === normalized) {
                return true;
            }
        }
    }
    var providerConfig = (_c = cfg.models) === null || _c === void 0 ? void 0 : _c.providers;
    if (providerConfig && typeof providerConfig === "object") {
        for (var _e = 0, _f = Object.keys(providerConfig); _e < _f.length; _e++) {
            var key = _f[_e];
            if ((0, model_selection_js_1.normalizeProviderId)(key) === normalized) {
                return true;
            }
        }
    }
    var modelRefs = collectModelRefs(cfg);
    for (var _g = 0, modelRefs_1 = modelRefs; _g < modelRefs_1.length; _g++) {
        var ref = modelRefs_1[_g];
        var provider = extractProviderFromModelRef(ref);
        if (provider && provider === normalized) {
            return true;
        }
    }
    return false;
}
function resolveConfiguredPlugins(cfg, env) {
    var changes = [];
    var channelIds = new Set(CHANNEL_PLUGIN_IDS);
    var configuredChannels = cfg.channels;
    if (configuredChannels && typeof configuredChannels === "object") {
        for (var _i = 0, _a = Object.keys(configuredChannels); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key === "defaults") {
                continue;
            }
            channelIds.add(key);
        }
    }
    for (var _b = 0, channelIds_1 = channelIds; _b < channelIds_1.length; _b++) {
        var channelId = channelIds_1[_b];
        if (!channelId) {
            continue;
        }
        if (isChannelConfigured(cfg, channelId, env)) {
            changes.push({
                pluginId: channelId,
                reason: "".concat(channelId, " configured"),
            });
        }
    }
    for (var _c = 0, PROVIDER_PLUGIN_IDS_1 = PROVIDER_PLUGIN_IDS; _c < PROVIDER_PLUGIN_IDS_1.length; _c++) {
        var mapping = PROVIDER_PLUGIN_IDS_1[_c];
        if (isProviderConfigured(cfg, mapping.providerId)) {
            changes.push({
                pluginId: mapping.pluginId,
                reason: "".concat(mapping.providerId, " auth configured"),
            });
        }
    }
    return changes;
}
function isPluginExplicitlyDisabled(cfg, pluginId) {
    var _a, _b;
    var entry = (_b = (_a = cfg.plugins) === null || _a === void 0 ? void 0 : _a.entries) === null || _b === void 0 ? void 0 : _b[pluginId];
    return (entry === null || entry === void 0 ? void 0 : entry.enabled) === false;
}
function isPluginDenied(cfg, pluginId) {
    var _a;
    var deny = (_a = cfg.plugins) === null || _a === void 0 ? void 0 : _a.deny;
    return Array.isArray(deny) && deny.includes(pluginId);
}
function resolvePreferredOverIds(pluginId) {
    var _a, _b;
    var normalized = (0, registry_js_1.normalizeChatChannelId)(pluginId);
    if (normalized) {
        return (_a = (0, registry_js_1.getChatChannelMeta)(normalized).preferOver) !== null && _a !== void 0 ? _a : [];
    }
    var catalogEntry = (0, catalog_js_1.getChannelPluginCatalogEntry)(pluginId);
    return (_b = catalogEntry === null || catalogEntry === void 0 ? void 0 : catalogEntry.meta.preferOver) !== null && _b !== void 0 ? _b : [];
}
function shouldSkipPreferredPluginAutoEnable(cfg, entry, configured) {
    for (var _i = 0, configured_1 = configured; _i < configured_1.length; _i++) {
        var other = configured_1[_i];
        if (other.pluginId === entry.pluginId) {
            continue;
        }
        if (isPluginDenied(cfg, other.pluginId)) {
            continue;
        }
        if (isPluginExplicitlyDisabled(cfg, other.pluginId)) {
            continue;
        }
        var preferOver = resolvePreferredOverIds(other.pluginId);
        if (preferOver.includes(entry.pluginId)) {
            return true;
        }
    }
    return false;
}
function ensureAllowlisted(cfg, pluginId) {
    var _a;
    var allow = (_a = cfg.plugins) === null || _a === void 0 ? void 0 : _a.allow;
    if (!Array.isArray(allow) || allow.includes(pluginId)) {
        return cfg;
    }
    return __assign(__assign({}, cfg), { plugins: __assign(__assign({}, cfg.plugins), { allow: __spreadArray(__spreadArray([], allow, true), [pluginId], false) }) });
}
function enablePluginEntry(cfg, pluginId) {
    var _a;
    var _b, _c, _d, _e;
    var entries = __assign(__assign({}, (_b = cfg.plugins) === null || _b === void 0 ? void 0 : _b.entries), (_a = {}, _a[pluginId] = __assign(__assign({}, (_d = (_c = cfg.plugins) === null || _c === void 0 ? void 0 : _c.entries) === null || _d === void 0 ? void 0 : _d[pluginId]), { enabled: true }), _a));
    return __assign(__assign({}, cfg), { plugins: __assign(__assign(__assign({}, cfg.plugins), { entries: entries }), (((_e = cfg.plugins) === null || _e === void 0 ? void 0 : _e.enabled) === false ? { enabled: true } : {})) });
}
function formatAutoEnableChange(entry) {
    var reason = entry.reason.trim();
    var channelId = (0, registry_js_1.normalizeChatChannelId)(entry.pluginId);
    if (channelId) {
        var label = (0, registry_js_1.getChatChannelMeta)(channelId).label;
        reason = reason.replace(new RegExp("^".concat(channelId, "\\b"), "i"), label);
    }
    return "".concat(reason, ", not enabled yet.");
}
function applyPluginAutoEnable(params) {
    var _a, _b, _c, _d, _e, _f;
    var env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
    var configured = resolveConfiguredPlugins(params.config, env);
    if (configured.length === 0) {
        return { config: params.config, changes: [] };
    }
    var next = params.config;
    var changes = [];
    if (((_b = next.plugins) === null || _b === void 0 ? void 0 : _b.enabled) === false) {
        return { config: next, changes: changes };
    }
    for (var _i = 0, configured_2 = configured; _i < configured_2.length; _i++) {
        var entry = configured_2[_i];
        if (isPluginDenied(next, entry.pluginId)) {
            continue;
        }
        if (isPluginExplicitlyDisabled(next, entry.pluginId)) {
            continue;
        }
        if (shouldSkipPreferredPluginAutoEnable(next, entry, configured)) {
            continue;
        }
        var allow = (_c = next.plugins) === null || _c === void 0 ? void 0 : _c.allow;
        var allowMissing = Array.isArray(allow) && !allow.includes(entry.pluginId);
        var alreadyEnabled = ((_f = (_e = (_d = next.plugins) === null || _d === void 0 ? void 0 : _d.entries) === null || _e === void 0 ? void 0 : _e[entry.pluginId]) === null || _f === void 0 ? void 0 : _f.enabled) === true;
        if (alreadyEnabled && !allowMissing) {
            continue;
        }
        next = enablePluginEntry(next, entry.pluginId);
        next = ensureAllowlisted(next, entry.pluginId);
        changes.push(formatAutoEnableChange(entry));
    }
    return { config: next, changes: changes };
}
