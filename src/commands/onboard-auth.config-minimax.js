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
exports.applyMinimaxProviderConfig = applyMinimaxProviderConfig;
exports.applyMinimaxHostedProviderConfig = applyMinimaxHostedProviderConfig;
exports.applyMinimaxConfig = applyMinimaxConfig;
exports.applyMinimaxHostedConfig = applyMinimaxHostedConfig;
exports.applyMinimaxApiProviderConfig = applyMinimaxApiProviderConfig;
exports.applyMinimaxApiConfig = applyMinimaxApiConfig;
var onboard_auth_models_js_1 = require("./onboard-auth.models.js");
function applyMinimaxProviderConfig(cfg) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var models = __assign({}, (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models);
    models["anthropic/claude-opus-4-5"] = __assign(__assign({}, models["anthropic/claude-opus-4-5"]), { alias: (_d = (_c = models["anthropic/claude-opus-4-5"]) === null || _c === void 0 ? void 0 : _c.alias) !== null && _d !== void 0 ? _d : "Opus" });
    models["lmstudio/minimax-m2.1-gs32"] = __assign(__assign({}, models["lmstudio/minimax-m2.1-gs32"]), { alias: (_f = (_e = models["lmstudio/minimax-m2.1-gs32"]) === null || _e === void 0 ? void 0 : _e.alias) !== null && _f !== void 0 ? _f : "Minimax" });
    var providers = __assign({}, (_g = cfg.models) === null || _g === void 0 ? void 0 : _g.providers);
    if (!providers.lmstudio) {
        providers.lmstudio = {
            baseUrl: "http://127.0.0.1:1234/v1",
            apiKey: "lmstudio",
            api: "openai-responses",
            models: [
                (0, onboard_auth_models_js_1.buildMinimaxModelDefinition)({
                    id: "minimax-m2.1-gs32",
                    name: "MiniMax M2.1 GS32",
                    reasoning: false,
                    cost: onboard_auth_models_js_1.MINIMAX_LM_STUDIO_COST,
                    contextWindow: 196608,
                    maxTokens: 8192,
                }),
            ],
        };
    }
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_h = cfg.agents) === null || _h === void 0 ? void 0 : _h.defaults), { models: models }) }), models: {
            mode: (_k = (_j = cfg.models) === null || _j === void 0 ? void 0 : _j.mode) !== null && _k !== void 0 ? _k : "merge",
            providers: providers,
        } });
}
function applyMinimaxHostedProviderConfig(cfg, params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var models = __assign({}, (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models);
    models[onboard_auth_models_js_1.MINIMAX_HOSTED_MODEL_REF] = __assign(__assign({}, models[onboard_auth_models_js_1.MINIMAX_HOSTED_MODEL_REF]), { alias: (_d = (_c = models[onboard_auth_models_js_1.MINIMAX_HOSTED_MODEL_REF]) === null || _c === void 0 ? void 0 : _c.alias) !== null && _d !== void 0 ? _d : "Minimax" });
    var providers = __assign({}, (_e = cfg.models) === null || _e === void 0 ? void 0 : _e.providers);
    var hostedModel = (0, onboard_auth_models_js_1.buildMinimaxModelDefinition)({
        id: onboard_auth_models_js_1.MINIMAX_HOSTED_MODEL_ID,
        cost: onboard_auth_models_js_1.MINIMAX_HOSTED_COST,
        contextWindow: onboard_auth_models_js_1.DEFAULT_MINIMAX_CONTEXT_WINDOW,
        maxTokens: onboard_auth_models_js_1.DEFAULT_MINIMAX_MAX_TOKENS,
    });
    var existingProvider = providers.minimax;
    var existingModels = Array.isArray(existingProvider === null || existingProvider === void 0 ? void 0 : existingProvider.models) ? existingProvider.models : [];
    var hasHostedModel = existingModels.some(function (model) { return model.id === onboard_auth_models_js_1.MINIMAX_HOSTED_MODEL_ID; });
    var mergedModels = hasHostedModel ? existingModels : __spreadArray(__spreadArray([], existingModels, true), [hostedModel], false);
    providers.minimax = __assign(__assign({}, existingProvider), { baseUrl: ((_f = params === null || params === void 0 ? void 0 : params.baseUrl) === null || _f === void 0 ? void 0 : _f.trim()) || onboard_auth_models_js_1.DEFAULT_MINIMAX_BASE_URL, apiKey: "minimax", api: "openai-completions", models: mergedModels.length > 0 ? mergedModels : [hostedModel] });
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_g = cfg.agents) === null || _g === void 0 ? void 0 : _g.defaults), { models: models }) }), models: {
            mode: (_j = (_h = cfg.models) === null || _h === void 0 ? void 0 : _h.mode) !== null && _j !== void 0 ? _j : "merge",
            providers: providers,
        } });
}
function applyMinimaxConfig(cfg) {
    var _a, _b, _c;
    var next = applyMinimaxProviderConfig(cfg);
    return __assign(__assign({}, next), { agents: __assign(__assign({}, next.agents), { defaults: __assign(__assign({}, (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults), { model: __assign(__assign({}, (((_c = (_b = next.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.model) &&
                    "fallbacks" in next.agents.defaults.model
                    ? {
                        fallbacks: next.agents.defaults.model.fallbacks,
                    }
                    : undefined)), { primary: "lmstudio/minimax-m2.1-gs32" }) }) }) });
}
function applyMinimaxHostedConfig(cfg, params) {
    var _a, _b, _c;
    var next = applyMinimaxHostedProviderConfig(cfg, params);
    return __assign(__assign({}, next), { agents: __assign(__assign({}, next.agents), { defaults: __assign(__assign({}, (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults), { model: __assign(__assign({}, (_c = (_b = next.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.model), { primary: onboard_auth_models_js_1.MINIMAX_HOSTED_MODEL_REF }) }) }) });
}
// MiniMax Anthropic-compatible API (platform.minimax.io/anthropic)
function applyMinimaxApiProviderConfig(cfg, modelId) {
    var _a, _b, _c, _d, _e, _f;
    if (modelId === void 0) { modelId = "MiniMax-M2.1"; }
    var providers = __assign({}, (_a = cfg.models) === null || _a === void 0 ? void 0 : _a.providers);
    var existingProvider = providers.minimax;
    var existingModels = Array.isArray(existingProvider === null || existingProvider === void 0 ? void 0 : existingProvider.models) ? existingProvider.models : [];
    var apiModel = (0, onboard_auth_models_js_1.buildMinimaxApiModelDefinition)(modelId);
    var hasApiModel = existingModels.some(function (model) { return model.id === modelId; });
    var mergedModels = hasApiModel ? existingModels : __spreadArray(__spreadArray([], existingModels, true), [apiModel], false);
    var _g = (existingProvider !== null && existingProvider !== void 0 ? existingProvider : {}), existingApiKey = _g.apiKey, existingProviderRest = __rest(_g, ["apiKey"]);
    var resolvedApiKey = typeof existingApiKey === "string" ? existingApiKey : undefined;
    var normalizedApiKey = (resolvedApiKey === null || resolvedApiKey === void 0 ? void 0 : resolvedApiKey.trim()) === "minimax" ? "" : resolvedApiKey;
    providers.minimax = __assign(__assign(__assign(__assign({}, existingProviderRest), { baseUrl: onboard_auth_models_js_1.MINIMAX_API_BASE_URL, api: "anthropic-messages" }), ((normalizedApiKey === null || normalizedApiKey === void 0 ? void 0 : normalizedApiKey.trim()) ? { apiKey: normalizedApiKey } : {})), { models: mergedModels.length > 0 ? mergedModels : [apiModel] });
    var models = __assign({}, (_c = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.models);
    models["minimax/".concat(modelId)] = __assign(__assign({}, models["minimax/".concat(modelId)]), { alias: "Minimax" });
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_d = cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults), { models: models }) }), models: { mode: (_f = (_e = cfg.models) === null || _e === void 0 ? void 0 : _e.mode) !== null && _f !== void 0 ? _f : "merge", providers: providers } });
}
function applyMinimaxApiConfig(cfg, modelId) {
    var _a, _b, _c;
    if (modelId === void 0) { modelId = "MiniMax-M2.1"; }
    var next = applyMinimaxApiProviderConfig(cfg, modelId);
    return __assign(__assign({}, next), { agents: __assign(__assign({}, next.agents), { defaults: __assign(__assign({}, (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults), { model: __assign(__assign({}, (((_c = (_b = next.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.model) &&
                    "fallbacks" in next.agents.defaults.model
                    ? {
                        fallbacks: next.agents.defaults.model.fallbacks,
                    }
                    : undefined)), { primary: "minimax/".concat(modelId) }) }) }) });
}
