"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOONSHOT_DEFAULT_COST = exports.MINIMAX_LM_STUDIO_COST = exports.MINIMAX_HOSTED_COST = exports.MINIMAX_API_COST = exports.KIMI_CODING_MODEL_REF = exports.KIMI_CODING_MODEL_ID = exports.MOONSHOT_DEFAULT_MAX_TOKENS = exports.MOONSHOT_DEFAULT_CONTEXT_WINDOW = exports.MOONSHOT_DEFAULT_MODEL_REF = exports.MOONSHOT_DEFAULT_MODEL_ID = exports.MOONSHOT_BASE_URL = exports.DEFAULT_MINIMAX_MAX_TOKENS = exports.DEFAULT_MINIMAX_CONTEXT_WINDOW = exports.MINIMAX_HOSTED_MODEL_REF = exports.MINIMAX_HOSTED_MODEL_ID = exports.MINIMAX_API_BASE_URL = exports.DEFAULT_MINIMAX_BASE_URL = void 0;
exports.buildMinimaxModelDefinition = buildMinimaxModelDefinition;
exports.buildMinimaxApiModelDefinition = buildMinimaxApiModelDefinition;
exports.buildMoonshotModelDefinition = buildMoonshotModelDefinition;
exports.DEFAULT_MINIMAX_BASE_URL = "https://api.minimax.io/v1";
exports.MINIMAX_API_BASE_URL = "https://api.minimax.io/anthropic";
exports.MINIMAX_HOSTED_MODEL_ID = "MiniMax-M2.1";
exports.MINIMAX_HOSTED_MODEL_REF = "minimax/".concat(exports.MINIMAX_HOSTED_MODEL_ID);
exports.DEFAULT_MINIMAX_CONTEXT_WINDOW = 200000;
exports.DEFAULT_MINIMAX_MAX_TOKENS = 8192;
exports.MOONSHOT_BASE_URL = "https://api.moonshot.ai/v1";
exports.MOONSHOT_DEFAULT_MODEL_ID = "kimi-k2-0905-preview";
exports.MOONSHOT_DEFAULT_MODEL_REF = "moonshot/".concat(exports.MOONSHOT_DEFAULT_MODEL_ID);
exports.MOONSHOT_DEFAULT_CONTEXT_WINDOW = 256000;
exports.MOONSHOT_DEFAULT_MAX_TOKENS = 8192;
exports.KIMI_CODING_MODEL_ID = "k2p5";
exports.KIMI_CODING_MODEL_REF = "kimi-coding/".concat(exports.KIMI_CODING_MODEL_ID);
// Pricing: MiniMax doesn't publish public rates. Override in models.json for accurate costs.
exports.MINIMAX_API_COST = {
    input: 15,
    output: 60,
    cacheRead: 2,
    cacheWrite: 10,
};
exports.MINIMAX_HOSTED_COST = {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
};
exports.MINIMAX_LM_STUDIO_COST = {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
};
exports.MOONSHOT_DEFAULT_COST = {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
};
var MINIMAX_MODEL_CATALOG = {
    "MiniMax-M2.1": { name: "MiniMax M2.1", reasoning: false },
    "MiniMax-M2.1-lightning": {
        name: "MiniMax M2.1 Lightning",
        reasoning: false,
    },
};
function buildMinimaxModelDefinition(params) {
    var _a, _b, _c, _d;
    var catalog = MINIMAX_MODEL_CATALOG[params.id];
    return {
        id: params.id,
        name: (_b = (_a = params.name) !== null && _a !== void 0 ? _a : catalog === null || catalog === void 0 ? void 0 : catalog.name) !== null && _b !== void 0 ? _b : "MiniMax ".concat(params.id),
        reasoning: (_d = (_c = params.reasoning) !== null && _c !== void 0 ? _c : catalog === null || catalog === void 0 ? void 0 : catalog.reasoning) !== null && _d !== void 0 ? _d : false,
        input: ["text"],
        cost: params.cost,
        contextWindow: params.contextWindow,
        maxTokens: params.maxTokens,
    };
}
function buildMinimaxApiModelDefinition(modelId) {
    return buildMinimaxModelDefinition({
        id: modelId,
        cost: exports.MINIMAX_API_COST,
        contextWindow: exports.DEFAULT_MINIMAX_CONTEXT_WINDOW,
        maxTokens: exports.DEFAULT_MINIMAX_MAX_TOKENS,
    });
}
function buildMoonshotModelDefinition() {
    return {
        id: exports.MOONSHOT_DEFAULT_MODEL_ID,
        name: "Kimi K2 0905 Preview",
        reasoning: false,
        input: ["text"],
        cost: exports.MOONSHOT_DEFAULT_COST,
        contextWindow: exports.MOONSHOT_DEFAULT_CONTEXT_WINDOW,
        maxTokens: exports.MOONSHOT_DEFAULT_MAX_TOKENS,
    };
}
