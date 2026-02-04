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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.modelsStatusCommand = modelsStatusCommand;
var node_path_1 = require("node:path");
var agent_paths_js_1 = require("../../agents/agent-paths.js");
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var auth_health_js_1 = require("../../agents/auth-health.js");
var auth_profiles_js_1 = require("../../agents/auth-profiles.js");
var model_auth_js_1 = require("../../agents/model-auth.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var command_format_js_1 = require("../../cli/command-format.js");
var progress_js_1 = require("../../cli/progress.js");
var config_js_1 = require("../../config/config.js");
var provider_usage_js_1 = require("../../infra/provider-usage.js");
var shell_env_js_1 = require("../../infra/shell-env.js");
var table_js_1 = require("../../terminal/table.js");
var theme_js_1 = require("../../terminal/theme.js");
var utils_js_1 = require("../../utils.js");
var list_auth_overview_js_1 = require("./list.auth-overview.js");
var list_format_js_1 = require("./list.format.js");
var list_probe_js_1 = require("./list.probe.js");
var shared_js_1 = require("./shared.js");
function modelsStatusCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, agentId, agentDir, agentModelPrimary, agentFallbacksOverride, resolved, modelConfig, imageConfig, rawDefaultsModel, rawModel, resolvedLabel, defaultLabel, defaultsFallbacks, fallbacks, imageModel, imageFallbacks, aliases, allowed, store, modelsPath, providersFromStore, providersFromConfig, providersFromModels, providersInUse, _i, _a, raw, parsed, _b, _c, raw, parsed, providersFromEnv, envProbeProviders, _d, envProbeProviders_1, provider, providers, applied, shellFallbackEnabled, providerAuth, providerAuthMap, missingProvidersInUse, probeProfileIds, probeTimeoutMs, probeConcurrency, probeMaxTokens, aliasIndex, rawCandidates, resolvedCandidates, modelCandidates, probeSummary, providersWithOauth, authHealth, oauthProfiles, unusableProfiles, checkStatus, rich, label, labelWithSource, displayDefault, formatKey, formatKeyValue, formatSeparator, _e, providerAuth_1, entry, separator, bits, _f, missingProvidersInUse_1, provider, hint, usageByProvider, usageProviders, usageSummary, _g, _h, snapshot, formatted, _j, formatStatus, profilesByProvider, _k, oauthProfiles_1, profile, current, _l, profilesByProvider_1, _m, provider, profiles, usageKey, usage, usageSuffix, _o, profiles_1, profile, labelText, label_1, status_1, expiry, tableWidth, sorted, statusColor_1, rows;
        var _this = this;
        var _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
        return __generator(this, function (_10) {
            switch (_10.label) {
                case 0:
                    (0, shared_js_1.ensureFlagCompatibility)(opts);
                    if (opts.plain && opts.probe) {
                        throw new Error("--probe cannot be used with --plain output.");
                    }
                    cfg = (0, config_js_1.loadConfig)();
                    agentId = (0, shared_js_1.resolveKnownAgentId)({ cfg: cfg, rawAgentId: opts.agent });
                    agentDir = agentId ? (0, agent_scope_js_1.resolveAgentDir)(cfg, agentId) : (0, agent_paths_js_1.resolveOpenClawAgentDir)();
                    agentModelPrimary = agentId ? (0, agent_scope_js_1.resolveAgentModelPrimary)(cfg, agentId) : undefined;
                    agentFallbacksOverride = agentId
                        ? (0, agent_scope_js_1.resolveAgentModelFallbacksOverride)(cfg, agentId)
                        : undefined;
                    resolved = agentId
                        ? (0, model_selection_js_1.resolveDefaultModelForAgent)({ cfg: cfg, agentId: agentId })
                        : (0, model_selection_js_1.resolveConfiguredModelRef)({
                            cfg: cfg,
                            defaultProvider: shared_js_1.DEFAULT_PROVIDER,
                            defaultModel: shared_js_1.DEFAULT_MODEL,
                        });
                    modelConfig = (_q = (_p = cfg.agents) === null || _p === void 0 ? void 0 : _p.defaults) === null || _q === void 0 ? void 0 : _q.model;
                    imageConfig = (_s = (_r = cfg.agents) === null || _r === void 0 ? void 0 : _r.defaults) === null || _s === void 0 ? void 0 : _s.imageModel;
                    rawDefaultsModel = typeof modelConfig === "string" ? modelConfig.trim() : ((_u = (_t = modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.primary) === null || _t === void 0 ? void 0 : _t.trim()) !== null && _u !== void 0 ? _u : "");
                    rawModel = agentModelPrimary !== null && agentModelPrimary !== void 0 ? agentModelPrimary : rawDefaultsModel;
                    resolvedLabel = "".concat(resolved.provider, "/").concat(resolved.model);
                    defaultLabel = rawModel || resolvedLabel;
                    defaultsFallbacks = typeof modelConfig === "object" ? ((_v = modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.fallbacks) !== null && _v !== void 0 ? _v : []) : [];
                    fallbacks = agentFallbacksOverride !== null && agentFallbacksOverride !== void 0 ? agentFallbacksOverride : defaultsFallbacks;
                    imageModel = typeof imageConfig === "string" ? imageConfig.trim() : ((_x = (_w = imageConfig === null || imageConfig === void 0 ? void 0 : imageConfig.primary) === null || _w === void 0 ? void 0 : _w.trim()) !== null && _x !== void 0 ? _x : "");
                    imageFallbacks = typeof imageConfig === "object" ? ((_y = imageConfig === null || imageConfig === void 0 ? void 0 : imageConfig.fallbacks) !== null && _y !== void 0 ? _y : []) : [];
                    aliases = Object.entries((_1 = (_0 = (_z = cfg.agents) === null || _z === void 0 ? void 0 : _z.defaults) === null || _0 === void 0 ? void 0 : _0.models) !== null && _1 !== void 0 ? _1 : {}).reduce(function (acc, _a) {
                        var _b;
                        var key = _a[0], entry = _a[1];
                        var alias = (_b = entry === null || entry === void 0 ? void 0 : entry.alias) === null || _b === void 0 ? void 0 : _b.trim();
                        if (alias) {
                            acc[alias] = key;
                        }
                        return acc;
                    }, {});
                    allowed = Object.keys((_4 = (_3 = (_2 = cfg.agents) === null || _2 === void 0 ? void 0 : _2.defaults) === null || _3 === void 0 ? void 0 : _3.models) !== null && _4 !== void 0 ? _4 : {});
                    store = (0, auth_profiles_js_1.ensureAuthProfileStore)(agentDir);
                    modelsPath = node_path_1.default.join(agentDir, "models.json");
                    providersFromStore = new Set(Object.values(store.profiles)
                        .map(function (profile) { return profile.provider; })
                        .filter(function (p) { return Boolean(p); }));
                    providersFromConfig = new Set(Object.keys((_6 = (_5 = cfg.models) === null || _5 === void 0 ? void 0 : _5.providers) !== null && _6 !== void 0 ? _6 : {})
                        .map(function (p) { return p.trim(); })
                        .filter(Boolean));
                    providersFromModels = new Set();
                    providersInUse = new Set();
                    for (_i = 0, _a = __spreadArray(__spreadArray(__spreadArray(__spreadArray([defaultLabel], fallbacks, true), [imageModel], false), imageFallbacks, true), allowed, true); _i < _a.length; _i++) {
                        raw = _a[_i];
                        parsed = (0, model_selection_js_1.parseModelRef)(String(raw !== null && raw !== void 0 ? raw : ""), shared_js_1.DEFAULT_PROVIDER);
                        if (parsed === null || parsed === void 0 ? void 0 : parsed.provider) {
                            providersFromModels.add(parsed.provider);
                        }
                    }
                    for (_b = 0, _c = __spreadArray(__spreadArray(__spreadArray([defaultLabel], fallbacks, true), [imageModel], false), imageFallbacks, true); _b < _c.length; _b++) {
                        raw = _c[_b];
                        parsed = (0, model_selection_js_1.parseModelRef)(String(raw !== null && raw !== void 0 ? raw : ""), shared_js_1.DEFAULT_PROVIDER);
                        if (parsed === null || parsed === void 0 ? void 0 : parsed.provider) {
                            providersInUse.add(parsed.provider);
                        }
                    }
                    providersFromEnv = new Set();
                    envProbeProviders = [
                        "anthropic",
                        "github-copilot",
                        "google-vertex",
                        "openai",
                        "google",
                        "groq",
                        "cerebras",
                        "xai",
                        "openrouter",
                        "zai",
                        "mistral",
                        "synthetic",
                    ];
                    for (_d = 0, envProbeProviders_1 = envProbeProviders; _d < envProbeProviders_1.length; _d++) {
                        provider = envProbeProviders_1[_d];
                        if ((0, model_auth_js_1.resolveEnvApiKey)(provider)) {
                            providersFromEnv.add(provider);
                        }
                    }
                    providers = Array.from(new Set(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], providersFromStore, true), providersFromConfig, true), providersFromModels, true), providersFromEnv, true)))
                        .map(function (p) { return p.trim(); })
                        .filter(Boolean)
                        .toSorted(function (a, b) { return a.localeCompare(b); });
                    applied = (0, shell_env_js_1.getShellEnvAppliedKeys)();
                    shellFallbackEnabled = (0, shell_env_js_1.shouldEnableShellEnvFallback)(process.env) || ((_8 = (_7 = cfg.env) === null || _7 === void 0 ? void 0 : _7.shellEnv) === null || _8 === void 0 ? void 0 : _8.enabled) === true;
                    providerAuth = providers
                        .map(function (provider) { return (0, list_auth_overview_js_1.resolveProviderAuthOverview)({ provider: provider, cfg: cfg, store: store, modelsPath: modelsPath }); })
                        .filter(function (entry) {
                        var hasAny = entry.profiles.count > 0 || Boolean(entry.env) || Boolean(entry.modelsJson);
                        return hasAny;
                    });
                    providerAuthMap = new Map(providerAuth.map(function (entry) { return [entry.provider, entry]; }));
                    missingProvidersInUse = Array.from(providersInUse)
                        .filter(function (provider) { return !providerAuthMap.has(provider); })
                        .toSorted(function (a, b) { return a.localeCompare(b); });
                    probeProfileIds = (function () {
                        if (!opts.probeProfile) {
                            return [];
                        }
                        var raw = Array.isArray(opts.probeProfile) ? opts.probeProfile : [opts.probeProfile];
                        return raw
                            .flatMap(function (value) { return String(value !== null && value !== void 0 ? value : "").split(","); })
                            .map(function (value) { return value.trim(); })
                            .filter(Boolean);
                    })();
                    probeTimeoutMs = opts.probeTimeout ? Number(opts.probeTimeout) : 8000;
                    if (!Number.isFinite(probeTimeoutMs) || probeTimeoutMs <= 0) {
                        throw new Error("--probe-timeout must be a positive number (ms).");
                    }
                    probeConcurrency = opts.probeConcurrency ? Number(opts.probeConcurrency) : 2;
                    if (!Number.isFinite(probeConcurrency) || probeConcurrency <= 0) {
                        throw new Error("--probe-concurrency must be > 0.");
                    }
                    probeMaxTokens = opts.probeMaxTokens ? Number(opts.probeMaxTokens) : 8;
                    if (!Number.isFinite(probeMaxTokens) || probeMaxTokens <= 0) {
                        throw new Error("--probe-max-tokens must be > 0.");
                    }
                    aliasIndex = (0, model_selection_js_1.buildModelAliasIndex)({ cfg: cfg, defaultProvider: shared_js_1.DEFAULT_PROVIDER });
                    rawCandidates = __spreadArray(__spreadArray(__spreadArray(__spreadArray([
                        rawModel || resolvedLabel
                    ], fallbacks, true), [
                        imageModel
                    ], false), imageFallbacks, true), allowed, true).filter(Boolean);
                    resolvedCandidates = rawCandidates
                        .map(function (raw) {
                        var _a;
                        return (_a = (0, model_selection_js_1.resolveModelRefFromString)({
                            raw: String(raw !== null && raw !== void 0 ? raw : ""),
                            defaultProvider: shared_js_1.DEFAULT_PROVIDER,
                            aliasIndex: aliasIndex,
                        })) === null || _a === void 0 ? void 0 : _a.ref;
                    })
                        .filter(function (ref) { return Boolean(ref); });
                    modelCandidates = resolvedCandidates.map(function (ref) { return "".concat(ref.provider, "/").concat(ref.model); });
                    if (!opts.probe) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, progress_js_1.withProgressTotals)({ label: "Probing auth profiles…", total: 1 }, function (update) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, list_probe_js_1.runAuthProbes)({
                                            cfg: cfg,
                                            providers: providers,
                                            modelCandidates: modelCandidates,
                                            options: {
                                                provider: opts.probeProvider,
                                                profileIds: probeProfileIds,
                                                timeoutMs: probeTimeoutMs,
                                                concurrency: probeConcurrency,
                                                maxTokens: probeMaxTokens,
                                            },
                                            onProgress: update,
                                        })];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 1:
                    probeSummary = _10.sent();
                    _10.label = 2;
                case 2:
                    providersWithOauth = providerAuth
                        .filter(function (entry) { var _a; return entry.profiles.oauth > 0 || entry.profiles.token > 0 || ((_a = entry.env) === null || _a === void 0 ? void 0 : _a.value) === "OAuth (env)"; })
                        .map(function (entry) {
                        var _a;
                        var count = entry.profiles.oauth + entry.profiles.token + (((_a = entry.env) === null || _a === void 0 ? void 0 : _a.value) === "OAuth (env)" ? 1 : 0);
                        return "".concat(entry.provider, " (").concat(count, ")");
                    });
                    authHealth = (0, auth_health_js_1.buildAuthHealthSummary)({
                        store: store,
                        cfg: cfg,
                        warnAfterMs: auth_health_js_1.DEFAULT_OAUTH_WARN_MS,
                        providers: providers,
                    });
                    oauthProfiles = authHealth.profiles.filter(function (profile) { return profile.type === "oauth" || profile.type === "token"; });
                    unusableProfiles = (function () {
                        var _a, _b, _c;
                        var now = Date.now();
                        var out = [];
                        for (var _i = 0, _d = Object.keys((_a = store.usageStats) !== null && _a !== void 0 ? _a : {}); _i < _d.length; _i++) {
                            var profileId = _d[_i];
                            var unusableUntil = (0, auth_profiles_js_1.resolveProfileUnusableUntilForDisplay)(store, profileId);
                            if (!unusableUntil || now >= unusableUntil) {
                                continue;
                            }
                            var stats = (_b = store.usageStats) === null || _b === void 0 ? void 0 : _b[profileId];
                            var kind = typeof (stats === null || stats === void 0 ? void 0 : stats.disabledUntil) === "number" && now < stats.disabledUntil
                                ? "disabled"
                                : "cooldown";
                            out.push({
                                profileId: profileId,
                                provider: (_c = store.profiles[profileId]) === null || _c === void 0 ? void 0 : _c.provider,
                                kind: kind,
                                reason: stats === null || stats === void 0 ? void 0 : stats.disabledReason,
                                until: unusableUntil,
                                remainingMs: unusableUntil - now,
                            });
                        }
                        return out.toSorted(function (a, b) { return a.remainingMs - b.remainingMs; });
                    })();
                    checkStatus = (function () {
                        var hasExpiredOrMissing = oauthProfiles.some(function (profile) { return ["expired", "missing"].includes(profile.status); }) ||
                            missingProvidersInUse.length > 0;
                        var hasExpiring = oauthProfiles.some(function (profile) { return profile.status === "expiring"; });
                        if (hasExpiredOrMissing) {
                            return 1;
                        }
                        if (hasExpiring) {
                            return 2;
                        }
                        return 0;
                    })();
                    if (opts.json) {
                        runtime.log(JSON.stringify(__assign(__assign(__assign(__assign({ configPath: config_js_1.CONFIG_PATH }, (agentId ? { agentId: agentId } : {})), { agentDir: agentDir, defaultModel: defaultLabel, resolvedDefault: resolvedLabel, fallbacks: fallbacks, imageModel: imageModel || null, imageFallbacks: imageFallbacks }), (agentId
                            ? {
                                modelConfig: {
                                    defaultSource: agentModelPrimary ? "agent" : "defaults",
                                    fallbacksSource: agentFallbacksOverride !== undefined ? "agent" : "defaults",
                                },
                            }
                            : {})), { aliases: aliases, allowed: allowed, auth: {
                                storePath: (0, auth_profiles_js_1.resolveAuthStorePathForDisplay)(agentDir),
                                shellEnvFallback: {
                                    enabled: shellFallbackEnabled,
                                    appliedKeys: applied,
                                },
                                providersWithOAuth: providersWithOauth,
                                missingProvidersInUse: missingProvidersInUse,
                                providers: providerAuth,
                                unusableProfiles: unusableProfiles,
                                oauth: {
                                    warnAfterMs: authHealth.warnAfterMs,
                                    profiles: authHealth.profiles,
                                    providers: authHealth.providers,
                                },
                                probes: probeSummary,
                            } }), null, 2));
                        if (opts.check) {
                            runtime.exit(checkStatus);
                        }
                        return [2 /*return*/];
                    }
                    if (opts.plain) {
                        runtime.log(resolvedLabel);
                        if (opts.check) {
                            runtime.exit(checkStatus);
                        }
                        return [2 /*return*/];
                    }
                    rich = (0, list_format_js_1.isRich)(opts);
                    label = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.accent, value.padEnd(14)); };
                    labelWithSource = function (value, source) {
                        return label(source ? "".concat(value, " (").concat(source, ")") : value);
                    };
                    displayDefault = rawModel && rawModel !== resolvedLabel ? "".concat(resolvedLabel, " (from ").concat(rawModel, ")") : resolvedLabel;
                    runtime.log("".concat(label("Config")).concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, ":"), " ").concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.info, (0, utils_js_1.shortenHomePath)(config_js_1.CONFIG_PATH))));
                    runtime.log("".concat(label("Agent dir")).concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, ":"), " ").concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.info, (0, utils_js_1.shortenHomePath)(agentDir))));
                    runtime.log("".concat(labelWithSource("Default", agentId ? (agentModelPrimary ? "agent" : "defaults") : undefined)).concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, ":"), " ").concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.success, displayDefault)));
                    runtime.log("".concat(labelWithSource("Fallbacks (".concat(fallbacks.length || 0, ")"), agentId ? (agentFallbacksOverride !== undefined ? "agent" : "defaults") : undefined)).concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, ":"), " ").concat((0, theme_js_1.colorize)(rich, fallbacks.length ? theme_js_1.theme.warn : theme_js_1.theme.muted, fallbacks.length ? fallbacks.join(", ") : "-")));
                    runtime.log("".concat(labelWithSource("Image model", agentId ? "defaults" : undefined)).concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, ":"), " ").concat((0, theme_js_1.colorize)(rich, imageModel ? theme_js_1.theme.accentBright : theme_js_1.theme.muted, imageModel || "-")));
                    runtime.log("".concat(labelWithSource("Image fallbacks (".concat(imageFallbacks.length || 0, ")"), agentId ? "defaults" : undefined)).concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, ":"), " ").concat((0, theme_js_1.colorize)(rich, imageFallbacks.length ? theme_js_1.theme.accentBright : theme_js_1.theme.muted, imageFallbacks.length ? imageFallbacks.join(", ") : "-")));
                    runtime.log("".concat(label("Aliases (".concat(Object.keys(aliases).length || 0, ")"))).concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, ":"), " ").concat((0, theme_js_1.colorize)(rich, Object.keys(aliases).length ? theme_js_1.theme.accent : theme_js_1.theme.muted, Object.keys(aliases).length
                        ? Object.entries(aliases)
                            .map(function (_a) {
                            var alias = _a[0], target = _a[1];
                            return rich
                                ? "".concat(theme_js_1.theme.accentDim(alias), " ").concat(theme_js_1.theme.muted("->"), " ").concat(theme_js_1.theme.info(target))
                                : "".concat(alias, " -> ").concat(target);
                        })
                            .join(", ")
                        : "-")));
                    runtime.log("".concat(label("Configured models (".concat(allowed.length || 0, ")"))).concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, ":"), " ").concat((0, theme_js_1.colorize)(rich, allowed.length ? theme_js_1.theme.info : theme_js_1.theme.muted, allowed.length ? allowed.join(", ") : "all")));
                    runtime.log("");
                    runtime.log((0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, "Auth overview"));
                    runtime.log("".concat(label("Auth store")).concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, ":"), " ").concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.info, (0, utils_js_1.shortenHomePath)((0, auth_profiles_js_1.resolveAuthStorePathForDisplay)(agentDir)))));
                    runtime.log("".concat(label("Shell env")).concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, ":"), " ").concat((0, theme_js_1.colorize)(rich, shellFallbackEnabled ? theme_js_1.theme.success : theme_js_1.theme.muted, shellFallbackEnabled ? "on" : "off")).concat(applied.length ? (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, " (applied: ".concat(applied.join(", "), ")")) : ""));
                    runtime.log("".concat(label("Providers w/ OAuth/tokens (".concat(providersWithOauth.length || 0, ")"))).concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, ":"), " ").concat((0, theme_js_1.colorize)(rich, providersWithOauth.length ? theme_js_1.theme.info : theme_js_1.theme.muted, providersWithOauth.length ? providersWithOauth.join(", ") : "-")));
                    formatKey = function (key) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.warn, key); };
                    formatKeyValue = function (key, value) {
                        return "".concat(formatKey(key), "=").concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.info, value));
                    };
                    formatSeparator = function () { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, " | "); };
                    for (_e = 0, providerAuth_1 = providerAuth; _e < providerAuth_1.length; _e++) {
                        entry = providerAuth_1[_e];
                        separator = formatSeparator();
                        bits = [];
                        bits.push(formatKeyValue("effective", "".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.accentBright, entry.effective.kind), ":").concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, entry.effective.detail))));
                        if (entry.profiles.count > 0) {
                            bits.push(formatKeyValue("profiles", "".concat(entry.profiles.count, " (oauth=").concat(entry.profiles.oauth, ", token=").concat(entry.profiles.token, ", api_key=").concat(entry.profiles.apiKey, ")")));
                            if (entry.profiles.labels.length > 0) {
                                bits.push((0, theme_js_1.colorize)(rich, theme_js_1.theme.info, entry.profiles.labels.join(", ")));
                            }
                        }
                        if (entry.env) {
                            bits.push(formatKeyValue("env", "".concat(entry.env.value).concat(separator).concat(formatKeyValue("source", entry.env.source))));
                        }
                        if (entry.modelsJson) {
                            bits.push(formatKeyValue("models.json", "".concat(entry.modelsJson.value).concat(separator).concat(formatKeyValue("source", entry.modelsJson.source))));
                        }
                        runtime.log("- ".concat(theme_js_1.theme.heading(entry.provider), " ").concat(bits.join(separator)));
                    }
                    if (missingProvidersInUse.length > 0) {
                        runtime.log("");
                        runtime.log((0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, "Missing auth"));
                        for (_f = 0, missingProvidersInUse_1 = missingProvidersInUse; _f < missingProvidersInUse_1.length; _f++) {
                            provider = missingProvidersInUse_1[_f];
                            hint = provider === "anthropic"
                                ? "Run `claude setup-token`, then `".concat((0, command_format_js_1.formatCliCommand)("openclaw models auth setup-token"), "` or `").concat((0, command_format_js_1.formatCliCommand)("openclaw configure"), "`.")
                                : "Run `".concat((0, command_format_js_1.formatCliCommand)("openclaw configure"), "` or set an API key env var.");
                            runtime.log("- ".concat(theme_js_1.theme.heading(provider), " ").concat(hint));
                        }
                    }
                    runtime.log("");
                    runtime.log((0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, "OAuth/token status"));
                    if (!(oauthProfiles.length === 0)) return [3 /*break*/, 3];
                    runtime.log((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "- none"));
                    return [3 /*break*/, 8];
                case 3:
                    usageByProvider = new Map();
                    usageProviders = Array.from(new Set(oauthProfiles
                        .map(function (profile) { return (0, provider_usage_js_1.resolveUsageProviderId)(profile.provider); })
                        .filter(function (provider) { return Boolean(provider); })));
                    if (!(usageProviders.length > 0)) return [3 /*break*/, 7];
                    _10.label = 4;
                case 4:
                    _10.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, provider_usage_js_1.loadProviderUsageSummary)({
                            providers: usageProviders,
                            agentDir: agentDir,
                            timeoutMs: 3500,
                        })];
                case 5:
                    usageSummary = _10.sent();
                    for (_g = 0, _h = usageSummary.providers; _g < _h.length; _g++) {
                        snapshot = _h[_g];
                        formatted = (0, provider_usage_js_1.formatUsageWindowSummary)(snapshot, {
                            now: Date.now(),
                            maxWindows: 2,
                            includeResets: true,
                        });
                        if (formatted) {
                            usageByProvider.set(snapshot.provider, formatted);
                        }
                    }
                    return [3 /*break*/, 7];
                case 6:
                    _j = _10.sent();
                    return [3 /*break*/, 7];
                case 7:
                    formatStatus = function (status) {
                        if (status === "ok") {
                            return (0, theme_js_1.colorize)(rich, theme_js_1.theme.success, "ok");
                        }
                        if (status === "static") {
                            return (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "static");
                        }
                        if (status === "expiring") {
                            return (0, theme_js_1.colorize)(rich, theme_js_1.theme.warn, "expiring");
                        }
                        if (status === "missing") {
                            return (0, theme_js_1.colorize)(rich, theme_js_1.theme.warn, "unknown");
                        }
                        return (0, theme_js_1.colorize)(rich, theme_js_1.theme.error, "expired");
                    };
                    profilesByProvider = new Map();
                    for (_k = 0, oauthProfiles_1 = oauthProfiles; _k < oauthProfiles_1.length; _k++) {
                        profile = oauthProfiles_1[_k];
                        current = profilesByProvider.get(profile.provider);
                        if (current) {
                            current.push(profile);
                        }
                        else {
                            profilesByProvider.set(profile.provider, [profile]);
                        }
                    }
                    for (_l = 0, profilesByProvider_1 = profilesByProvider; _l < profilesByProvider_1.length; _l++) {
                        _m = profilesByProvider_1[_l], provider = _m[0], profiles = _m[1];
                        usageKey = (0, provider_usage_js_1.resolveUsageProviderId)(provider);
                        usage = usageKey ? usageByProvider.get(usageKey) : undefined;
                        usageSuffix = usage ? (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, " usage: ".concat(usage)) : "";
                        runtime.log("- ".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, provider)).concat(usageSuffix));
                        for (_o = 0, profiles_1 = profiles; _o < profiles_1.length; _o++) {
                            profile = profiles_1[_o];
                            labelText = profile.label || profile.profileId;
                            label_1 = (0, theme_js_1.colorize)(rich, theme_js_1.theme.accent, labelText);
                            status_1 = formatStatus(profile.status);
                            expiry = profile.status === "static"
                                ? ""
                                : profile.expiresAt
                                    ? " expires in ".concat((0, auth_health_js_1.formatRemainingShort)(profile.remainingMs))
                                    : " expires unknown";
                            runtime.log("  - ".concat(label_1, " ").concat(status_1).concat(expiry));
                        }
                    }
                    _10.label = 8;
                case 8:
                    if (probeSummary) {
                        runtime.log("");
                        runtime.log((0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, "Auth probes"));
                        if (probeSummary.results.length === 0) {
                            runtime.log((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "- none"));
                        }
                        else {
                            tableWidth = Math.max(60, ((_9 = process.stdout.columns) !== null && _9 !== void 0 ? _9 : 120) - 1);
                            sorted = (0, list_probe_js_1.sortProbeResults)(probeSummary.results);
                            statusColor_1 = function (status) {
                                if (status === "ok") {
                                    return theme_js_1.theme.success;
                                }
                                if (status === "rate_limit") {
                                    return theme_js_1.theme.warn;
                                }
                                if (status === "timeout" || status === "billing") {
                                    return theme_js_1.theme.warn;
                                }
                                if (status === "auth" || status === "format") {
                                    return theme_js_1.theme.error;
                                }
                                if (status === "no_model") {
                                    return theme_js_1.theme.muted;
                                }
                                return theme_js_1.theme.muted;
                            };
                            rows = sorted.map(function (result) {
                                var _a, _b;
                                var status = (0, theme_js_1.colorize)(rich, statusColor_1(result.status), result.status);
                                var latency = (0, list_probe_js_1.formatProbeLatency)(result.latencyMs);
                                var modelLabel = (_a = result.model) !== null && _a !== void 0 ? _a : "".concat(result.provider, "/-");
                                var modeLabel = result.mode ? " ".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "(".concat(result.mode, ")"))) : "";
                                var profile = "".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.accent, result.label)).concat(modeLabel);
                                var detail = (_b = result.error) === null || _b === void 0 ? void 0 : _b.trim();
                                var detailLabel = detail ? "\n".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "\u21B3 ".concat(detail))) : "";
                                var statusLabel = "".concat(status).concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, " \u00B7 ".concat(latency))).concat(detailLabel);
                                return {
                                    Model: (0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, modelLabel),
                                    Profile: profile,
                                    Status: statusLabel,
                                };
                            });
                            runtime.log((0, table_js_1.renderTable)({
                                width: tableWidth,
                                columns: [
                                    { key: "Model", header: "Model", minWidth: 18 },
                                    { key: "Profile", header: "Profile", minWidth: 24 },
                                    { key: "Status", header: "Status", minWidth: 12 },
                                ],
                                rows: rows,
                            }).trimEnd());
                            runtime.log((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, (0, list_probe_js_1.describeProbeSummary)(probeSummary)));
                        }
                    }
                    if (opts.check) {
                        runtime.exit(checkStatus);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
