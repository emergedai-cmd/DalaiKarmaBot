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
exports.resolveExtraParams = resolveExtraParams;
exports.applyExtraParamsToAgent = applyExtraParamsToAgent;
var pi_ai_1 = require("@mariozechner/pi-ai");
var logger_js_1 = require("./logger.js");
var OPENROUTER_APP_HEADERS = {
    "HTTP-Referer": "https://openclaw.ai",
    "X-Title": "OpenClaw",
};
/**
 * Resolve provider-specific extra params from model config.
 * Used to pass through stream params like temperature/maxTokens.
 *
 * @internal Exported for testing only
 */
function resolveExtraParams(params) {
    var _a, _b, _c, _d;
    var modelKey = "".concat(params.provider, "/").concat(params.modelId);
    var modelConfig = (_d = (_c = (_b = (_a = params.cfg) === null || _a === void 0 ? void 0 : _a.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.models) === null || _d === void 0 ? void 0 : _d[modelKey];
    return (modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.params) ? __assign({}, modelConfig.params) : undefined;
}
/**
 * Resolve cacheRetention from extraParams, supporting both new `cacheRetention`
 * and legacy `cacheControlTtl` values for backwards compatibility.
 *
 * Mapping: "5m" → "short", "1h" → "long"
 *
 * Only applies to Anthropic provider (OpenRouter uses openai-completions API
 * with hardcoded cache_control, not the cacheRetention stream option).
 */
function resolveCacheRetention(extraParams, provider) {
    if (provider !== "anthropic") {
        return undefined;
    }
    // Prefer new cacheRetention if present
    var newVal = extraParams === null || extraParams === void 0 ? void 0 : extraParams.cacheRetention;
    if (newVal === "none" || newVal === "short" || newVal === "long") {
        return newVal;
    }
    // Fall back to legacy cacheControlTtl with mapping
    var legacy = extraParams === null || extraParams === void 0 ? void 0 : extraParams.cacheControlTtl;
    if (legacy === "5m") {
        return "short";
    }
    if (legacy === "1h") {
        return "long";
    }
    return undefined;
}
function createStreamFnWithExtraParams(baseStreamFn, extraParams, provider) {
    if (!extraParams || Object.keys(extraParams).length === 0) {
        return undefined;
    }
    var streamParams = {};
    if (typeof extraParams.temperature === "number") {
        streamParams.temperature = extraParams.temperature;
    }
    if (typeof extraParams.maxTokens === "number") {
        streamParams.maxTokens = extraParams.maxTokens;
    }
    var cacheRetention = resolveCacheRetention(extraParams, provider);
    if (cacheRetention) {
        streamParams.cacheRetention = cacheRetention;
    }
    if (Object.keys(streamParams).length === 0) {
        return undefined;
    }
    logger_js_1.log.debug("creating streamFn wrapper with params: ".concat(JSON.stringify(streamParams)));
    var underlying = baseStreamFn !== null && baseStreamFn !== void 0 ? baseStreamFn : pi_ai_1.streamSimple;
    var wrappedStreamFn = function (model, context, options) {
        return underlying(model, context, __assign(__assign({}, streamParams), options));
    };
    return wrappedStreamFn;
}
/**
 * Create a streamFn wrapper that adds OpenRouter app attribution headers.
 * These headers allow OpenClaw to appear on OpenRouter's leaderboard.
 */
function createOpenRouterHeadersWrapper(baseStreamFn) {
    var underlying = baseStreamFn !== null && baseStreamFn !== void 0 ? baseStreamFn : pi_ai_1.streamSimple;
    return function (model, context, options) {
        return underlying(model, context, __assign(__assign({}, options), { headers: __assign(__assign({}, OPENROUTER_APP_HEADERS), options === null || options === void 0 ? void 0 : options.headers) }));
    };
}
/**
 * Apply extra params (like temperature) to an agent's streamFn.
 * Also adds OpenRouter app attribution headers when using the OpenRouter provider.
 *
 * @internal Exported for testing
 */
function applyExtraParamsToAgent(agent, cfg, provider, modelId, extraParamsOverride) {
    var extraParams = resolveExtraParams({
        cfg: cfg,
        provider: provider,
        modelId: modelId,
    });
    var override = extraParamsOverride && Object.keys(extraParamsOverride).length > 0
        ? Object.fromEntries(Object.entries(extraParamsOverride).filter(function (_a) {
            var value = _a[1];
            return value !== undefined;
        }))
        : undefined;
    var merged = Object.assign({}, extraParams, override);
    var wrappedStreamFn = createStreamFnWithExtraParams(agent.streamFn, merged, provider);
    if (wrappedStreamFn) {
        logger_js_1.log.debug("applying extraParams to agent streamFn for ".concat(provider, "/").concat(modelId));
        agent.streamFn = wrappedStreamFn;
    }
    if (provider === "openrouter") {
        logger_js_1.log.debug("applying OpenRouter app attribution headers for ".concat(provider, "/").concat(modelId));
        agent.streamFn = createOpenRouterHeadersWrapper(agent.streamFn);
    }
}
