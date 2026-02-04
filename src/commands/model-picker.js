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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.promptDefaultModel = promptDefaultModel;
exports.promptModelAllowlist = promptModelAllowlist;
exports.applyPrimaryModel = applyPrimaryModel;
exports.applyModelAllowlist = applyModelAllowlist;
exports.applyModelFallbacksFromSelection = applyModelFallbacksFromSelection;
var auth_profiles_js_1 = require("../agents/auth-profiles.js");
var defaults_js_1 = require("../agents/defaults.js");
var model_auth_js_1 = require("../agents/model-auth.js");
var model_catalog_js_1 = require("../agents/model-catalog.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var shared_js_1 = require("./models/shared.js");
var KEEP_VALUE = "__keep__";
var MANUAL_VALUE = "__manual__";
var PROVIDER_FILTER_THRESHOLD = 30;
// Models that are internal routing features and should not be shown in selection lists.
// These may be valid as defaults (e.g., set automatically during auth flow) but are not
// directly callable via API and would cause "Unknown model" errors if selected manually.
var HIDDEN_ROUTER_MODELS = new Set(["openrouter/auto"]);
function hasAuthForProvider(provider, cfg, store) {
    if ((0, auth_profiles_js_1.listProfilesForProvider)(store, provider).length > 0) {
        return true;
    }
    if ((0, model_auth_js_1.resolveEnvApiKey)(provider)) {
        return true;
    }
    if ((0, model_auth_js_1.getCustomProviderApiKey)(cfg, provider)) {
        return true;
    }
    return false;
}
function resolveConfiguredModelRaw(cfg) {
    var _a, _b, _c, _d;
    var raw = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model;
    if (typeof raw === "string") {
        return raw.trim();
    }
    return (_d = (_c = raw === null || raw === void 0 ? void 0 : raw.primary) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : "";
}
function resolveConfiguredModelKeys(cfg) {
    var _a, _b, _c;
    var models = (_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models) !== null && _c !== void 0 ? _c : {};
    return Object.keys(models)
        .map(function (key) { return String(key !== null && key !== void 0 ? key : "").trim(); })
        .filter(function (key) { return key.length > 0; });
}
function normalizeModelKeys(values) {
    var seen = new Set();
    var next = [];
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var raw = values_1[_i];
        var value = String(raw !== null && raw !== void 0 ? raw : "").trim();
        if (!value || seen.has(value)) {
            continue;
        }
        seen.add(value);
        next.push(value);
    }
    return next;
}
function promptManualModel(params) {
    return __awaiter(this, void 0, void 0, function () {
        var modelInput, model;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, params.prompter.text({
                        message: params.allowBlank ? "Default model (blank to keep)" : "Default model",
                        initialValue: params.initialValue,
                        placeholder: "provider/model",
                        validate: params.allowBlank ? undefined : function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                    })];
                case 1:
                    modelInput = _a.sent();
                    model = String(modelInput !== null && modelInput !== void 0 ? modelInput : "").trim();
                    if (!model) {
                        return [2 /*return*/, {}];
                    }
                    return [2 /*return*/, { model: model }];
            }
        });
    });
}
function promptDefaultModel(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, allowKeep, includeManual, ignoreAllowlist, preferredProviderRaw, preferredProvider, configuredRaw, resolved, resolvedKey, configuredKey, catalog, aliasIndex, models, allowedCatalog, providers, hasPreferredProvider, shouldPromptProvider, selection_1, authStore, authCache, hasAuth, options, seen, addModelOption, _i, models_1, entry, initialValue, firstModel, selection;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    cfg = params.config;
                    allowKeep = (_a = params.allowKeep) !== null && _a !== void 0 ? _a : true;
                    includeManual = (_b = params.includeManual) !== null && _b !== void 0 ? _b : true;
                    ignoreAllowlist = (_c = params.ignoreAllowlist) !== null && _c !== void 0 ? _c : false;
                    preferredProviderRaw = (_d = params.preferredProvider) === null || _d === void 0 ? void 0 : _d.trim();
                    preferredProvider = preferredProviderRaw
                        ? (0, model_selection_js_1.normalizeProviderId)(preferredProviderRaw)
                        : undefined;
                    configuredRaw = resolveConfiguredModelRaw(cfg);
                    resolved = (0, model_selection_js_1.resolveConfiguredModelRef)({
                        cfg: cfg,
                        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                        defaultModel: defaults_js_1.DEFAULT_MODEL,
                    });
                    resolvedKey = (0, model_selection_js_1.modelKey)(resolved.provider, resolved.model);
                    configuredKey = configuredRaw ? resolvedKey : "";
                    return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: cfg, useCache: false })];
                case 1:
                    catalog = _f.sent();
                    if (catalog.length === 0) {
                        return [2 /*return*/, promptManualModel({
                                prompter: params.prompter,
                                allowBlank: allowKeep,
                                initialValue: configuredRaw || resolvedKey || undefined,
                            })];
                    }
                    aliasIndex = (0, model_selection_js_1.buildModelAliasIndex)({
                        cfg: cfg,
                        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                    });
                    models = catalog;
                    if (!ignoreAllowlist) {
                        allowedCatalog = (0, model_selection_js_1.buildAllowedModelSet)({
                            cfg: cfg,
                            catalog: catalog,
                            defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                        }).allowedCatalog;
                        models = allowedCatalog.length > 0 ? allowedCatalog : catalog;
                    }
                    if (models.length === 0) {
                        return [2 /*return*/, promptManualModel({
                                prompter: params.prompter,
                                allowBlank: allowKeep,
                                initialValue: configuredRaw || resolvedKey || undefined,
                            })];
                    }
                    providers = Array.from(new Set(models.map(function (entry) { return entry.provider; }))).toSorted(function (a, b) {
                        return a.localeCompare(b);
                    });
                    hasPreferredProvider = preferredProvider ? providers.includes(preferredProvider) : false;
                    shouldPromptProvider = !hasPreferredProvider && providers.length > 1 && models.length > PROVIDER_FILTER_THRESHOLD;
                    if (!shouldPromptProvider) return [3 /*break*/, 3];
                    return [4 /*yield*/, params.prompter.select({
                            message: "Filter models by provider",
                            options: __spreadArray([
                                { value: "*", label: "All providers" }
                            ], providers.map(function (provider) {
                                var count = models.filter(function (entry) { return entry.provider === provider; }).length;
                                return {
                                    value: provider,
                                    label: provider,
                                    hint: "".concat(count, " model").concat(count === 1 ? "" : "s"),
                                };
                            }), true),
                        })];
                case 2:
                    selection_1 = _f.sent();
                    if (selection_1 !== "*") {
                        models = models.filter(function (entry) { return entry.provider === selection_1; });
                    }
                    _f.label = 3;
                case 3:
                    if (hasPreferredProvider && preferredProvider) {
                        models = models.filter(function (entry) { return entry.provider === preferredProvider; });
                    }
                    authStore = (0, auth_profiles_js_1.ensureAuthProfileStore)(params.agentDir, {
                        allowKeychainPrompt: false,
                    });
                    authCache = new Map();
                    hasAuth = function (provider) {
                        var cached = authCache.get(provider);
                        if (cached !== undefined) {
                            return cached;
                        }
                        var value = hasAuthForProvider(provider, cfg, authStore);
                        authCache.set(provider, value);
                        return value;
                    };
                    options = [];
                    if (allowKeep) {
                        options.push({
                            value: KEEP_VALUE,
                            label: configuredRaw
                                ? "Keep current (".concat(configuredRaw, ")")
                                : "Keep current (default: ".concat(resolvedKey, ")"),
                            hint: configuredRaw && configuredRaw !== resolvedKey ? "resolves to ".concat(resolvedKey) : undefined,
                        });
                    }
                    if (includeManual) {
                        options.push({ value: MANUAL_VALUE, label: "Enter model manually" });
                    }
                    seen = new Set();
                    addModelOption = function (entry) {
                        var key = (0, model_selection_js_1.modelKey)(entry.provider, entry.id);
                        if (seen.has(key)) {
                            return;
                        }
                        // Skip internal router models that can't be directly called via API.
                        if (HIDDEN_ROUTER_MODELS.has(key)) {
                            return;
                        }
                        var hints = [];
                        if (entry.name && entry.name !== entry.id) {
                            hints.push(entry.name);
                        }
                        if (entry.contextWindow) {
                            hints.push("ctx ".concat((0, shared_js_1.formatTokenK)(entry.contextWindow)));
                        }
                        if (entry.reasoning) {
                            hints.push("reasoning");
                        }
                        var aliases = aliasIndex.byKey.get(key);
                        if (aliases === null || aliases === void 0 ? void 0 : aliases.length) {
                            hints.push("alias: ".concat(aliases.join(", ")));
                        }
                        if (!hasAuth(entry.provider)) {
                            hints.push("auth missing");
                        }
                        options.push({
                            value: key,
                            label: key,
                            hint: hints.length > 0 ? hints.join(" · ") : undefined,
                        });
                        seen.add(key);
                    };
                    for (_i = 0, models_1 = models; _i < models_1.length; _i++) {
                        entry = models_1[_i];
                        addModelOption(entry);
                    }
                    if (configuredKey && !seen.has(configuredKey)) {
                        options.push({
                            value: configuredKey,
                            label: configuredKey,
                            hint: "current (not in catalog)",
                        });
                    }
                    initialValue = allowKeep ? KEEP_VALUE : configuredKey || undefined;
                    if (allowKeep &&
                        hasPreferredProvider &&
                        preferredProvider &&
                        resolved.provider !== preferredProvider) {
                        firstModel = models[0];
                        if (firstModel) {
                            initialValue = (0, model_selection_js_1.modelKey)(firstModel.provider, firstModel.id);
                        }
                    }
                    return [4 /*yield*/, params.prompter.select({
                            message: (_e = params.message) !== null && _e !== void 0 ? _e : "Default model",
                            options: options,
                            initialValue: initialValue,
                        })];
                case 4:
                    selection = _f.sent();
                    if (selection === KEEP_VALUE) {
                        return [2 /*return*/, {}];
                    }
                    if (selection === MANUAL_VALUE) {
                        return [2 /*return*/, promptManualModel({
                                prompter: params.prompter,
                                allowBlank: false,
                                initialValue: configuredRaw || resolvedKey || undefined,
                            })];
                    }
                    return [2 /*return*/, { model: String(selection) }];
            }
        });
    });
}
function promptModelAllowlist(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, existingKeys, allowedKeys, allowedKeySet, resolved, resolvedKey, initialSeeds, initialKeys, catalog, raw, parsed, aliasIndex, authStore, authCache, hasAuth, options, seen, addModelOption, filteredCatalog, _i, filteredCatalog_1, entry, supplementalKeys, _a, supplementalKeys_1, key, selection, selected, confirmClear;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    cfg = params.config;
                    existingKeys = resolveConfiguredModelKeys(cfg);
                    allowedKeys = normalizeModelKeys((_b = params.allowedKeys) !== null && _b !== void 0 ? _b : []);
                    allowedKeySet = allowedKeys.length > 0 ? new Set(allowedKeys) : null;
                    resolved = (0, model_selection_js_1.resolveConfiguredModelRef)({
                        cfg: cfg,
                        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                        defaultModel: defaults_js_1.DEFAULT_MODEL,
                    });
                    resolvedKey = (0, model_selection_js_1.modelKey)(resolved.provider, resolved.model);
                    initialSeeds = normalizeModelKeys(__spreadArray(__spreadArray(__spreadArray([], existingKeys, true), [
                        resolvedKey
                    ], false), ((_c = params.initialSelections) !== null && _c !== void 0 ? _c : []), true));
                    initialKeys = allowedKeySet
                        ? initialSeeds.filter(function (key) { return allowedKeySet.has(key); })
                        : initialSeeds;
                    return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: cfg, useCache: false })];
                case 1:
                    catalog = _f.sent();
                    if (!(catalog.length === 0 && allowedKeys.length === 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, params.prompter.text({
                            message: (_d = params.message) !== null && _d !== void 0 ? _d : "Allowlist models (comma-separated provider/model; blank to keep current)",
                            initialValue: existingKeys.join(", "),
                            placeholder: "openai-codex/gpt-5.2, anthropic/claude-opus-4-5",
                        })];
                case 2:
                    raw = _f.sent();
                    parsed = String(raw !== null && raw !== void 0 ? raw : "")
                        .split(",")
                        .map(function (value) { return value.trim(); })
                        .filter(function (value) { return value.length > 0; });
                    if (parsed.length === 0) {
                        return [2 /*return*/, {}];
                    }
                    return [2 /*return*/, { models: normalizeModelKeys(parsed) }];
                case 3:
                    aliasIndex = (0, model_selection_js_1.buildModelAliasIndex)({
                        cfg: cfg,
                        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                    });
                    authStore = (0, auth_profiles_js_1.ensureAuthProfileStore)(params.agentDir, {
                        allowKeychainPrompt: false,
                    });
                    authCache = new Map();
                    hasAuth = function (provider) {
                        var cached = authCache.get(provider);
                        if (cached !== undefined) {
                            return cached;
                        }
                        var value = hasAuthForProvider(provider, cfg, authStore);
                        authCache.set(provider, value);
                        return value;
                    };
                    options = [];
                    seen = new Set();
                    addModelOption = function (entry) {
                        var key = (0, model_selection_js_1.modelKey)(entry.provider, entry.id);
                        if (seen.has(key)) {
                            return;
                        }
                        if (HIDDEN_ROUTER_MODELS.has(key)) {
                            return;
                        }
                        var hints = [];
                        if (entry.name && entry.name !== entry.id) {
                            hints.push(entry.name);
                        }
                        if (entry.contextWindow) {
                            hints.push("ctx ".concat((0, shared_js_1.formatTokenK)(entry.contextWindow)));
                        }
                        if (entry.reasoning) {
                            hints.push("reasoning");
                        }
                        var aliases = aliasIndex.byKey.get(key);
                        if (aliases === null || aliases === void 0 ? void 0 : aliases.length) {
                            hints.push("alias: ".concat(aliases.join(", ")));
                        }
                        if (!hasAuth(entry.provider)) {
                            hints.push("auth missing");
                        }
                        options.push({
                            value: key,
                            label: key,
                            hint: hints.length > 0 ? hints.join(" · ") : undefined,
                        });
                        seen.add(key);
                    };
                    filteredCatalog = allowedKeySet
                        ? catalog.filter(function (entry) { return allowedKeySet.has((0, model_selection_js_1.modelKey)(entry.provider, entry.id)); })
                        : catalog;
                    for (_i = 0, filteredCatalog_1 = filteredCatalog; _i < filteredCatalog_1.length; _i++) {
                        entry = filteredCatalog_1[_i];
                        addModelOption(entry);
                    }
                    supplementalKeys = allowedKeySet ? allowedKeys : existingKeys;
                    for (_a = 0, supplementalKeys_1 = supplementalKeys; _a < supplementalKeys_1.length; _a++) {
                        key = supplementalKeys_1[_a];
                        if (seen.has(key)) {
                            continue;
                        }
                        options.push({
                            value: key,
                            label: key,
                            hint: allowedKeySet ? "allowed (not in catalog)" : "configured (not in catalog)",
                        });
                        seen.add(key);
                    }
                    if (options.length === 0) {
                        return [2 /*return*/, {}];
                    }
                    return [4 /*yield*/, params.prompter.multiselect({
                            message: (_e = params.message) !== null && _e !== void 0 ? _e : "Models in /model picker (multi-select)",
                            options: options,
                            initialValues: initialKeys.length > 0 ? initialKeys : undefined,
                        })];
                case 4:
                    selection = _f.sent();
                    selected = normalizeModelKeys(selection.map(function (value) { return String(value); }));
                    if (selected.length > 0) {
                        return [2 /*return*/, { models: selected }];
                    }
                    if (existingKeys.length === 0) {
                        return [2 /*return*/, { models: [] }];
                    }
                    return [4 /*yield*/, params.prompter.confirm({
                            message: "Clear the model allowlist? (shows all models)",
                            initialValue: false,
                        })];
                case 5:
                    confirmClear = _f.sent();
                    if (!confirmClear) {
                        return [2 /*return*/, {}];
                    }
                    return [2 /*return*/, { models: [] }];
            }
        });
    });
}
function applyPrimaryModel(cfg, model) {
    var _a;
    var _b, _c;
    var defaults = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.defaults;
    var existingModel = defaults === null || defaults === void 0 ? void 0 : defaults.model;
    var existingModels = defaults === null || defaults === void 0 ? void 0 : defaults.models;
    var fallbacks = typeof existingModel === "object" && existingModel !== null && "fallbacks" in existingModel
        ? existingModel.fallbacks
        : undefined;
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, defaults), { model: __assign(__assign({}, (fallbacks ? { fallbacks: fallbacks } : undefined)), { primary: model }), models: __assign(__assign({}, existingModels), (_a = {}, _a[model] = (_c = existingModels === null || existingModels === void 0 ? void 0 : existingModels[model]) !== null && _c !== void 0 ? _c : {}, _a)) }) }) });
}
function applyModelAllowlist(cfg, models) {
    var _a, _b, _c;
    var defaults = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults;
    var normalized = normalizeModelKeys(models);
    if (normalized.length === 0) {
        if (!(defaults === null || defaults === void 0 ? void 0 : defaults.models)) {
            return cfg;
        }
        var _ignored = defaults.models, restDefaults = __rest(defaults, ["models"]);
        return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: restDefaults }) });
    }
    var existingModels = (_b = defaults === null || defaults === void 0 ? void 0 : defaults.models) !== null && _b !== void 0 ? _b : {};
    var nextModels = {};
    for (var _i = 0, normalized_1 = normalized; _i < normalized_1.length; _i++) {
        var key = normalized_1[_i];
        nextModels[key] = (_c = existingModels[key]) !== null && _c !== void 0 ? _c : {};
    }
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, defaults), { models: nextModels }) }) });
}
function applyModelFallbacksFromSelection(cfg, selection) {
    var _a;
    var normalized = normalizeModelKeys(selection);
    if (normalized.length <= 1) {
        return cfg;
    }
    var resolved = (0, model_selection_js_1.resolveConfiguredModelRef)({
        cfg: cfg,
        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
        defaultModel: defaults_js_1.DEFAULT_MODEL,
    });
    var resolvedKey = (0, model_selection_js_1.modelKey)(resolved.provider, resolved.model);
    if (!normalized.includes(resolvedKey)) {
        return cfg;
    }
    var defaults = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults;
    var existingModel = defaults === null || defaults === void 0 ? void 0 : defaults.model;
    var existingPrimary = typeof existingModel === "string"
        ? existingModel
        : existingModel && typeof existingModel === "object"
            ? existingModel.primary
            : undefined;
    var fallbacks = normalized.filter(function (key) { return key !== resolvedKey; });
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, defaults), { model: __assign(__assign({}, (typeof existingModel === "object" ? existingModel : undefined)), { primary: existingPrimary !== null && existingPrimary !== void 0 ? existingPrimary : resolvedKey, fallbacks: fallbacks }) }) }) });
}
