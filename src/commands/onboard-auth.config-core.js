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
exports.applyZaiConfig = applyZaiConfig;
exports.applyOpenrouterProviderConfig = applyOpenrouterProviderConfig;
exports.applyVercelAiGatewayProviderConfig = applyVercelAiGatewayProviderConfig;
exports.applyVercelAiGatewayConfig = applyVercelAiGatewayConfig;
exports.applyOpenrouterConfig = applyOpenrouterConfig;
exports.applyMoonshotProviderConfig = applyMoonshotProviderConfig;
exports.applyMoonshotConfig = applyMoonshotConfig;
exports.applyKimiCodeProviderConfig = applyKimiCodeProviderConfig;
exports.applyKimiCodeConfig = applyKimiCodeConfig;
exports.applySyntheticProviderConfig = applySyntheticProviderConfig;
exports.applySyntheticConfig = applySyntheticConfig;
exports.applyXiaomiProviderConfig = applyXiaomiProviderConfig;
exports.applyXiaomiConfig = applyXiaomiConfig;
exports.applyVeniceProviderConfig = applyVeniceProviderConfig;
exports.applyVeniceConfig = applyVeniceConfig;
exports.applyAuthProfileConfig = applyAuthProfileConfig;
var models_config_providers_js_1 = require("../agents/models-config.providers.js");
var synthetic_models_js_1 = require("../agents/synthetic-models.js");
var venice_models_js_1 = require("../agents/venice-models.js");
var onboard_auth_credentials_js_1 = require("./onboard-auth.credentials.js");
var onboard_auth_models_js_1 = require("./onboard-auth.models.js");
function applyZaiConfig(cfg) {
    var _a, _b, _c, _d, _e, _f, _g;
    var models = __assign({}, (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models);
    models[onboard_auth_credentials_js_1.ZAI_DEFAULT_MODEL_REF] = __assign(__assign({}, models[onboard_auth_credentials_js_1.ZAI_DEFAULT_MODEL_REF]), { alias: (_d = (_c = models[onboard_auth_credentials_js_1.ZAI_DEFAULT_MODEL_REF]) === null || _c === void 0 ? void 0 : _c.alias) !== null && _d !== void 0 ? _d : "GLM" });
    var existingModel = (_f = (_e = cfg.agents) === null || _e === void 0 ? void 0 : _e.defaults) === null || _f === void 0 ? void 0 : _f.model;
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_g = cfg.agents) === null || _g === void 0 ? void 0 : _g.defaults), { models: models, model: __assign(__assign({}, (existingModel && "fallbacks" in existingModel
                    ? {
                        fallbacks: existingModel.fallbacks,
                    }
                    : undefined)), { primary: onboard_auth_credentials_js_1.ZAI_DEFAULT_MODEL_REF }) }) }) });
}
function applyOpenrouterProviderConfig(cfg) {
    var _a, _b, _c, _d, _e;
    var models = __assign({}, (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models);
    models[onboard_auth_credentials_js_1.OPENROUTER_DEFAULT_MODEL_REF] = __assign(__assign({}, models[onboard_auth_credentials_js_1.OPENROUTER_DEFAULT_MODEL_REF]), { alias: (_d = (_c = models[onboard_auth_credentials_js_1.OPENROUTER_DEFAULT_MODEL_REF]) === null || _c === void 0 ? void 0 : _c.alias) !== null && _d !== void 0 ? _d : "OpenRouter" });
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_e = cfg.agents) === null || _e === void 0 ? void 0 : _e.defaults), { models: models }) }) });
}
function applyVercelAiGatewayProviderConfig(cfg) {
    var _a, _b, _c, _d, _e;
    var models = __assign({}, (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models);
    models[onboard_auth_credentials_js_1.VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF] = __assign(__assign({}, models[onboard_auth_credentials_js_1.VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF]), { alias: (_d = (_c = models[onboard_auth_credentials_js_1.VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF]) === null || _c === void 0 ? void 0 : _c.alias) !== null && _d !== void 0 ? _d : "Vercel AI Gateway" });
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_e = cfg.agents) === null || _e === void 0 ? void 0 : _e.defaults), { models: models }) }) });
}
function applyVercelAiGatewayConfig(cfg) {
    var _a, _b, _c;
    var next = applyVercelAiGatewayProviderConfig(cfg);
    var existingModel = (_b = (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model;
    return __assign(__assign({}, next), { agents: __assign(__assign({}, next.agents), { defaults: __assign(__assign({}, (_c = next.agents) === null || _c === void 0 ? void 0 : _c.defaults), { model: __assign(__assign({}, (existingModel && "fallbacks" in existingModel
                    ? {
                        fallbacks: existingModel.fallbacks,
                    }
                    : undefined)), { primary: onboard_auth_credentials_js_1.VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF }) }) }) });
}
function applyOpenrouterConfig(cfg) {
    var _a, _b, _c;
    var next = applyOpenrouterProviderConfig(cfg);
    var existingModel = (_b = (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model;
    return __assign(__assign({}, next), { agents: __assign(__assign({}, next.agents), { defaults: __assign(__assign({}, (_c = next.agents) === null || _c === void 0 ? void 0 : _c.defaults), { model: __assign(__assign({}, (existingModel && "fallbacks" in existingModel
                    ? {
                        fallbacks: existingModel.fallbacks,
                    }
                    : undefined)), { primary: onboard_auth_credentials_js_1.OPENROUTER_DEFAULT_MODEL_REF }) }) }) });
}
function applyMoonshotProviderConfig(cfg) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var models = __assign({}, (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models);
    models[onboard_auth_models_js_1.MOONSHOT_DEFAULT_MODEL_REF] = __assign(__assign({}, models[onboard_auth_models_js_1.MOONSHOT_DEFAULT_MODEL_REF]), { alias: (_d = (_c = models[onboard_auth_models_js_1.MOONSHOT_DEFAULT_MODEL_REF]) === null || _c === void 0 ? void 0 : _c.alias) !== null && _d !== void 0 ? _d : "Kimi K2" });
    var providers = __assign({}, (_e = cfg.models) === null || _e === void 0 ? void 0 : _e.providers);
    var existingProvider = providers.moonshot;
    var existingModels = Array.isArray(existingProvider === null || existingProvider === void 0 ? void 0 : existingProvider.models) ? existingProvider.models : [];
    var defaultModel = (0, onboard_auth_models_js_1.buildMoonshotModelDefinition)();
    var hasDefaultModel = existingModels.some(function (model) { return model.id === onboard_auth_models_js_1.MOONSHOT_DEFAULT_MODEL_ID; });
    var mergedModels = hasDefaultModel ? existingModels : __spreadArray(__spreadArray([], existingModels, true), [defaultModel], false);
    var _j = (existingProvider !== null && existingProvider !== void 0 ? existingProvider : {}), existingApiKey = _j.apiKey, existingProviderRest = __rest(_j, ["apiKey"]);
    var resolvedApiKey = typeof existingApiKey === "string" ? existingApiKey : undefined;
    var normalizedApiKey = resolvedApiKey === null || resolvedApiKey === void 0 ? void 0 : resolvedApiKey.trim();
    providers.moonshot = __assign(__assign(__assign(__assign({}, existingProviderRest), { baseUrl: onboard_auth_models_js_1.MOONSHOT_BASE_URL, api: "openai-completions" }), (normalizedApiKey ? { apiKey: normalizedApiKey } : {})), { models: mergedModels.length > 0 ? mergedModels : [defaultModel] });
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_f = cfg.agents) === null || _f === void 0 ? void 0 : _f.defaults), { models: models }) }), models: {
            mode: (_h = (_g = cfg.models) === null || _g === void 0 ? void 0 : _g.mode) !== null && _h !== void 0 ? _h : "merge",
            providers: providers,
        } });
}
function applyMoonshotConfig(cfg) {
    var _a, _b, _c;
    var next = applyMoonshotProviderConfig(cfg);
    var existingModel = (_b = (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model;
    return __assign(__assign({}, next), { agents: __assign(__assign({}, next.agents), { defaults: __assign(__assign({}, (_c = next.agents) === null || _c === void 0 ? void 0 : _c.defaults), { model: __assign(__assign({}, (existingModel && "fallbacks" in existingModel
                    ? {
                        fallbacks: existingModel.fallbacks,
                    }
                    : undefined)), { primary: onboard_auth_models_js_1.MOONSHOT_DEFAULT_MODEL_REF }) }) }) });
}
function applyKimiCodeProviderConfig(cfg) {
    var _a, _b, _c, _d, _e;
    var models = __assign({}, (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models);
    models[onboard_auth_models_js_1.KIMI_CODING_MODEL_REF] = __assign(__assign({}, models[onboard_auth_models_js_1.KIMI_CODING_MODEL_REF]), { alias: (_d = (_c = models[onboard_auth_models_js_1.KIMI_CODING_MODEL_REF]) === null || _c === void 0 ? void 0 : _c.alias) !== null && _d !== void 0 ? _d : "Kimi K2.5" });
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_e = cfg.agents) === null || _e === void 0 ? void 0 : _e.defaults), { models: models }) }) });
}
function applyKimiCodeConfig(cfg) {
    var _a, _b, _c;
    var next = applyKimiCodeProviderConfig(cfg);
    var existingModel = (_b = (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model;
    return __assign(__assign({}, next), { agents: __assign(__assign({}, next.agents), { defaults: __assign(__assign({}, (_c = next.agents) === null || _c === void 0 ? void 0 : _c.defaults), { model: __assign(__assign({}, (existingModel && "fallbacks" in existingModel
                    ? {
                        fallbacks: existingModel.fallbacks,
                    }
                    : undefined)), { primary: onboard_auth_models_js_1.KIMI_CODING_MODEL_REF }) }) }) });
}
function applySyntheticProviderConfig(cfg) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var models = __assign({}, (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models);
    models[synthetic_models_js_1.SYNTHETIC_DEFAULT_MODEL_REF] = __assign(__assign({}, models[synthetic_models_js_1.SYNTHETIC_DEFAULT_MODEL_REF]), { alias: (_d = (_c = models[synthetic_models_js_1.SYNTHETIC_DEFAULT_MODEL_REF]) === null || _c === void 0 ? void 0 : _c.alias) !== null && _d !== void 0 ? _d : "MiniMax M2.1" });
    var providers = __assign({}, (_e = cfg.models) === null || _e === void 0 ? void 0 : _e.providers);
    var existingProvider = providers.synthetic;
    var existingModels = Array.isArray(existingProvider === null || existingProvider === void 0 ? void 0 : existingProvider.models) ? existingProvider.models : [];
    var syntheticModels = synthetic_models_js_1.SYNTHETIC_MODEL_CATALOG.map(synthetic_models_js_1.buildSyntheticModelDefinition);
    var mergedModels = __spreadArray(__spreadArray([], existingModels, true), syntheticModels.filter(function (model) { return !existingModels.some(function (existing) { return existing.id === model.id; }); }), true);
    var _j = (existingProvider !== null && existingProvider !== void 0 ? existingProvider : {}), existingApiKey = _j.apiKey, existingProviderRest = __rest(_j, ["apiKey"]);
    var resolvedApiKey = typeof existingApiKey === "string" ? existingApiKey : undefined;
    var normalizedApiKey = resolvedApiKey === null || resolvedApiKey === void 0 ? void 0 : resolvedApiKey.trim();
    providers.synthetic = __assign(__assign(__assign(__assign({}, existingProviderRest), { baseUrl: synthetic_models_js_1.SYNTHETIC_BASE_URL, api: "anthropic-messages" }), (normalizedApiKey ? { apiKey: normalizedApiKey } : {})), { models: mergedModels.length > 0 ? mergedModels : syntheticModels });
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_f = cfg.agents) === null || _f === void 0 ? void 0 : _f.defaults), { models: models }) }), models: {
            mode: (_h = (_g = cfg.models) === null || _g === void 0 ? void 0 : _g.mode) !== null && _h !== void 0 ? _h : "merge",
            providers: providers,
        } });
}
function applySyntheticConfig(cfg) {
    var _a, _b, _c;
    var next = applySyntheticProviderConfig(cfg);
    var existingModel = (_b = (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model;
    return __assign(__assign({}, next), { agents: __assign(__assign({}, next.agents), { defaults: __assign(__assign({}, (_c = next.agents) === null || _c === void 0 ? void 0 : _c.defaults), { model: __assign(__assign({}, (existingModel && "fallbacks" in existingModel
                    ? {
                        fallbacks: existingModel.fallbacks,
                    }
                    : undefined)), { primary: synthetic_models_js_1.SYNTHETIC_DEFAULT_MODEL_REF }) }) }) });
}
function applyXiaomiProviderConfig(cfg) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var models = __assign({}, (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models);
    models[onboard_auth_credentials_js_1.XIAOMI_DEFAULT_MODEL_REF] = __assign(__assign({}, models[onboard_auth_credentials_js_1.XIAOMI_DEFAULT_MODEL_REF]), { alias: (_d = (_c = models[onboard_auth_credentials_js_1.XIAOMI_DEFAULT_MODEL_REF]) === null || _c === void 0 ? void 0 : _c.alias) !== null && _d !== void 0 ? _d : "Xiaomi" });
    var providers = __assign({}, (_e = cfg.models) === null || _e === void 0 ? void 0 : _e.providers);
    var existingProvider = providers.xiaomi;
    var defaultProvider = (0, models_config_providers_js_1.buildXiaomiProvider)();
    var existingModels = Array.isArray(existingProvider === null || existingProvider === void 0 ? void 0 : existingProvider.models) ? existingProvider.models : [];
    var defaultModels = (_f = defaultProvider.models) !== null && _f !== void 0 ? _f : [];
    var hasDefaultModel = existingModels.some(function (model) { return model.id === models_config_providers_js_1.XIAOMI_DEFAULT_MODEL_ID; });
    var mergedModels = existingModels.length > 0
        ? hasDefaultModel
            ? existingModels
            : __spreadArray(__spreadArray([], existingModels, true), defaultModels, true)
        : defaultModels;
    var _k = (existingProvider !== null && existingProvider !== void 0 ? existingProvider : {}), existingApiKey = _k.apiKey, existingProviderRest = __rest(_k, ["apiKey"]);
    var resolvedApiKey = typeof existingApiKey === "string" ? existingApiKey : undefined;
    var normalizedApiKey = resolvedApiKey === null || resolvedApiKey === void 0 ? void 0 : resolvedApiKey.trim();
    providers.xiaomi = __assign(__assign(__assign(__assign({}, existingProviderRest), { baseUrl: defaultProvider.baseUrl, api: defaultProvider.api }), (normalizedApiKey ? { apiKey: normalizedApiKey } : {})), { models: mergedModels.length > 0 ? mergedModels : defaultProvider.models });
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_g = cfg.agents) === null || _g === void 0 ? void 0 : _g.defaults), { models: models }) }), models: {
            mode: (_j = (_h = cfg.models) === null || _h === void 0 ? void 0 : _h.mode) !== null && _j !== void 0 ? _j : "merge",
            providers: providers,
        } });
}
function applyXiaomiConfig(cfg) {
    var _a, _b, _c;
    var next = applyXiaomiProviderConfig(cfg);
    var existingModel = (_b = (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model;
    return __assign(__assign({}, next), { agents: __assign(__assign({}, next.agents), { defaults: __assign(__assign({}, (_c = next.agents) === null || _c === void 0 ? void 0 : _c.defaults), { model: __assign(__assign({}, (existingModel && "fallbacks" in existingModel
                    ? {
                        fallbacks: existingModel.fallbacks,
                    }
                    : undefined)), { primary: onboard_auth_credentials_js_1.XIAOMI_DEFAULT_MODEL_REF }) }) }) });
}
/**
 * Apply Venice provider configuration without changing the default model.
 * Registers Venice models and sets up the provider, but preserves existing model selection.
 */
function applyVeniceProviderConfig(cfg) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var models = __assign({}, (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models);
    models[venice_models_js_1.VENICE_DEFAULT_MODEL_REF] = __assign(__assign({}, models[venice_models_js_1.VENICE_DEFAULT_MODEL_REF]), { alias: (_d = (_c = models[venice_models_js_1.VENICE_DEFAULT_MODEL_REF]) === null || _c === void 0 ? void 0 : _c.alias) !== null && _d !== void 0 ? _d : "Llama 3.3 70B" });
    var providers = __assign({}, (_e = cfg.models) === null || _e === void 0 ? void 0 : _e.providers);
    var existingProvider = providers.venice;
    var existingModels = Array.isArray(existingProvider === null || existingProvider === void 0 ? void 0 : existingProvider.models) ? existingProvider.models : [];
    var veniceModels = venice_models_js_1.VENICE_MODEL_CATALOG.map(venice_models_js_1.buildVeniceModelDefinition);
    var mergedModels = __spreadArray(__spreadArray([], existingModels, true), veniceModels.filter(function (model) { return !existingModels.some(function (existing) { return existing.id === model.id; }); }), true);
    var _j = (existingProvider !== null && existingProvider !== void 0 ? existingProvider : {}), existingApiKey = _j.apiKey, existingProviderRest = __rest(_j, ["apiKey"]);
    var resolvedApiKey = typeof existingApiKey === "string" ? existingApiKey : undefined;
    var normalizedApiKey = resolvedApiKey === null || resolvedApiKey === void 0 ? void 0 : resolvedApiKey.trim();
    providers.venice = __assign(__assign(__assign(__assign({}, existingProviderRest), { baseUrl: venice_models_js_1.VENICE_BASE_URL, api: "openai-completions" }), (normalizedApiKey ? { apiKey: normalizedApiKey } : {})), { models: mergedModels.length > 0 ? mergedModels : veniceModels });
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_f = cfg.agents) === null || _f === void 0 ? void 0 : _f.defaults), { models: models }) }), models: {
            mode: (_h = (_g = cfg.models) === null || _g === void 0 ? void 0 : _g.mode) !== null && _h !== void 0 ? _h : "merge",
            providers: providers,
        } });
}
/**
 * Apply Venice provider configuration AND set Venice as the default model.
 * Use this when Venice is the primary provider choice during onboarding.
 */
function applyVeniceConfig(cfg) {
    var _a, _b, _c;
    var next = applyVeniceProviderConfig(cfg);
    var existingModel = (_b = (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model;
    return __assign(__assign({}, next), { agents: __assign(__assign({}, next.agents), { defaults: __assign(__assign({}, (_c = next.agents) === null || _c === void 0 ? void 0 : _c.defaults), { model: __assign(__assign({}, (existingModel && "fallbacks" in existingModel
                    ? {
                        fallbacks: existingModel.fallbacks,
                    }
                    : undefined)), { primary: venice_models_js_1.VENICE_DEFAULT_MODEL_REF }) }) }) });
}
function applyAuthProfileConfig(cfg, params) {
    var _a, _b;
    var _c, _d, _e, _f, _g, _h;
    var profiles = __assign(__assign({}, (_c = cfg.auth) === null || _c === void 0 ? void 0 : _c.profiles), (_a = {}, _a[params.profileId] = __assign({ provider: params.provider, mode: params.mode }, (params.email ? { email: params.email } : {})), _a));
    // Only maintain `auth.order` when the user explicitly configured it.
    // Default behavior: no explicit order -> resolveAuthProfileOrder can round-robin by lastUsed.
    var existingProviderOrder = (_e = (_d = cfg.auth) === null || _d === void 0 ? void 0 : _d.order) === null || _e === void 0 ? void 0 : _e[params.provider];
    var preferProfileFirst = (_f = params.preferProfileFirst) !== null && _f !== void 0 ? _f : true;
    var reorderedProviderOrder = existingProviderOrder && preferProfileFirst
        ? __spreadArray([
            params.profileId
        ], existingProviderOrder.filter(function (profileId) { return profileId !== params.profileId; }), true) : existingProviderOrder;
    var order = existingProviderOrder !== undefined
        ? __assign(__assign({}, (_g = cfg.auth) === null || _g === void 0 ? void 0 : _g.order), (_b = {}, _b[params.provider] = (reorderedProviderOrder === null || reorderedProviderOrder === void 0 ? void 0 : reorderedProviderOrder.includes(params.profileId))
            ? reorderedProviderOrder
            : __spreadArray(__spreadArray([], (reorderedProviderOrder !== null && reorderedProviderOrder !== void 0 ? reorderedProviderOrder : []), true), [params.profileId], false), _b)) : (_h = cfg.auth) === null || _h === void 0 ? void 0 : _h.order;
    return __assign(__assign({}, cfg), { auth: __assign(__assign(__assign({}, cfg.auth), { profiles: profiles }), (order ? { order: order } : {})) });
}
