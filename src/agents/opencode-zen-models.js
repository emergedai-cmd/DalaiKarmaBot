"use strict";
/**
 * OpenCode Zen model catalog with dynamic fetching, caching, and static fallback.
 *
 * OpenCode Zen is a $200/month subscription that provides proxy access to multiple
 * AI models (Claude, GPT, Gemini, etc.) through a single API endpoint.
 *
 * API endpoint: https://opencode.ai/zen/v1
 * Auth URL: https://opencode.ai/auth
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPENCODE_ZEN_MODEL_ALIASES = exports.OPENCODE_ZEN_DEFAULT_MODEL_REF = exports.OPENCODE_ZEN_DEFAULT_MODEL = exports.OPENCODE_ZEN_API_BASE_URL = void 0;
exports.resolveOpencodeZenAlias = resolveOpencodeZenAlias;
exports.resolveOpencodeZenModelApi = resolveOpencodeZenModelApi;
exports.getOpencodeZenStaticFallbackModels = getOpencodeZenStaticFallbackModels;
exports.fetchOpencodeZenModels = fetchOpencodeZenModels;
exports.clearOpencodeZenModelCache = clearOpencodeZenModelCache;
exports.OPENCODE_ZEN_API_BASE_URL = "https://opencode.ai/zen/v1";
exports.OPENCODE_ZEN_DEFAULT_MODEL = "claude-opus-4-5";
exports.OPENCODE_ZEN_DEFAULT_MODEL_REF = "opencode/".concat(exports.OPENCODE_ZEN_DEFAULT_MODEL);
// Cache for fetched models (1 hour TTL)
var cachedModels = null;
var cacheTimestamp = 0;
var CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
/**
 * Model aliases for convenient shortcuts.
 * Users can use "opus" instead of "claude-opus-4-5", etc.
 */
exports.OPENCODE_ZEN_MODEL_ALIASES = {
    // Claude
    opus: "claude-opus-4-5",
    "opus-4.5": "claude-opus-4-5",
    "opus-4": "claude-opus-4-5",
    // Legacy Claude aliases (OpenCode Zen rotates model catalogs; keep old keys working).
    sonnet: "claude-opus-4-5",
    "sonnet-4": "claude-opus-4-5",
    haiku: "claude-opus-4-5",
    "haiku-3.5": "claude-opus-4-5",
    // GPT-5.x family
    gpt5: "gpt-5.2",
    "gpt-5": "gpt-5.2",
    "gpt-5.1": "gpt-5.1",
    // Legacy GPT aliases (keep old config/docs stable; map to closest current equivalents).
    gpt4: "gpt-5.1",
    "gpt-4": "gpt-5.1",
    "gpt-mini": "gpt-5.1-codex-mini",
    // Legacy O-series aliases (no longer in the Zen catalog; map to a strong default).
    o1: "gpt-5.2",
    o3: "gpt-5.2",
    "o3-mini": "gpt-5.1-codex-mini",
    // Codex family
    codex: "gpt-5.1-codex",
    "codex-mini": "gpt-5.1-codex-mini",
    "codex-max": "gpt-5.1-codex-max",
    // Gemini
    gemini: "gemini-3-pro",
    "gemini-pro": "gemini-3-pro",
    "gemini-3": "gemini-3-pro",
    flash: "gemini-3-flash",
    "gemini-flash": "gemini-3-flash",
    // Legacy Gemini 2.5 aliases (map to the nearest current Gemini tier).
    "gemini-2.5": "gemini-3-pro",
    "gemini-2.5-pro": "gemini-3-pro",
    "gemini-2.5-flash": "gemini-3-flash",
    // GLM (free)
    glm: "glm-4.7",
    "glm-free": "glm-4.7",
};
/**
 * Resolve a model alias to its full model ID.
 * Returns the input if no alias exists.
 */
function resolveOpencodeZenAlias(modelIdOrAlias) {
    var _a;
    var normalized = modelIdOrAlias.toLowerCase().trim();
    return (_a = exports.OPENCODE_ZEN_MODEL_ALIASES[normalized]) !== null && _a !== void 0 ? _a : modelIdOrAlias;
}
/**
 * OpenCode Zen routes models to specific API shapes by family.
 */
function resolveOpencodeZenModelApi(modelId) {
    var lower = modelId.toLowerCase();
    if (lower.startsWith("gpt-")) {
        return "openai-responses";
    }
    if (lower.startsWith("claude-") || lower.startsWith("minimax-")) {
        return "anthropic-messages";
    }
    if (lower.startsWith("gemini-")) {
        return "google-generative-ai";
    }
    return "openai-completions";
}
/**
 * Check if a model supports image input.
 */
function supportsImageInput(modelId) {
    var lower = modelId.toLowerCase();
    if (lower.includes("glm") || lower.includes("minimax")) {
        return false;
    }
    return true;
}
var MODEL_COSTS = {
    "gpt-5.1-codex": {
        input: 1.07,
        output: 8.5,
        cacheRead: 0.107,
        cacheWrite: 0,
    },
    "claude-opus-4-5": { input: 5, output: 25, cacheRead: 0.5, cacheWrite: 6.25 },
    "gemini-3-pro": { input: 2, output: 12, cacheRead: 0.2, cacheWrite: 0 },
    "gpt-5.1-codex-mini": {
        input: 0.25,
        output: 2,
        cacheRead: 0.025,
        cacheWrite: 0,
    },
    "gpt-5.1": { input: 1.07, output: 8.5, cacheRead: 0.107, cacheWrite: 0 },
    "glm-4.7": { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    "gemini-3-flash": { input: 0.5, output: 3, cacheRead: 0.05, cacheWrite: 0 },
    "gpt-5.1-codex-max": {
        input: 1.25,
        output: 10,
        cacheRead: 0.125,
        cacheWrite: 0,
    },
    "gpt-5.2": { input: 1.75, output: 14, cacheRead: 0.175, cacheWrite: 0 },
};
var DEFAULT_COST = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
var MODEL_CONTEXT_WINDOWS = {
    "gpt-5.1-codex": 400000,
    "claude-opus-4-5": 200000,
    "gemini-3-pro": 1048576,
    "gpt-5.1-codex-mini": 400000,
    "gpt-5.1": 400000,
    "glm-4.7": 204800,
    "gemini-3-flash": 1048576,
    "gpt-5.1-codex-max": 400000,
    "gpt-5.2": 400000,
};
function getDefaultContextWindow(modelId) {
    var _a;
    return (_a = MODEL_CONTEXT_WINDOWS[modelId]) !== null && _a !== void 0 ? _a : 128000;
}
var MODEL_MAX_TOKENS = {
    "gpt-5.1-codex": 128000,
    "claude-opus-4-5": 64000,
    "gemini-3-pro": 65536,
    "gpt-5.1-codex-mini": 128000,
    "gpt-5.1": 128000,
    "glm-4.7": 131072,
    "gemini-3-flash": 65536,
    "gpt-5.1-codex-max": 128000,
    "gpt-5.2": 128000,
};
function getDefaultMaxTokens(modelId) {
    var _a;
    return (_a = MODEL_MAX_TOKENS[modelId]) !== null && _a !== void 0 ? _a : 8192;
}
/**
 * Build a ModelDefinitionConfig from a model ID.
 */
function buildModelDefinition(modelId) {
    var _a;
    return {
        id: modelId,
        name: formatModelName(modelId),
        api: resolveOpencodeZenModelApi(modelId),
        // Treat Zen models as reasoning-capable so defaults pick thinkLevel="low" unless users opt out.
        reasoning: true,
        input: supportsImageInput(modelId) ? ["text", "image"] : ["text"],
        cost: (_a = MODEL_COSTS[modelId]) !== null && _a !== void 0 ? _a : DEFAULT_COST,
        contextWindow: getDefaultContextWindow(modelId),
        maxTokens: getDefaultMaxTokens(modelId),
    };
}
/**
 * Format a model ID into a human-readable name.
 */
var MODEL_NAMES = {
    "gpt-5.1-codex": "GPT-5.1 Codex",
    "claude-opus-4-5": "Claude Opus 4.5",
    "gemini-3-pro": "Gemini 3 Pro",
    "gpt-5.1-codex-mini": "GPT-5.1 Codex Mini",
    "gpt-5.1": "GPT-5.1",
    "glm-4.7": "GLM-4.7",
    "gemini-3-flash": "Gemini 3 Flash",
    "gpt-5.1-codex-max": "GPT-5.1 Codex Max",
    "gpt-5.2": "GPT-5.2",
};
function formatModelName(modelId) {
    if (MODEL_NAMES[modelId]) {
        return MODEL_NAMES[modelId];
    }
    return modelId
        .split("-")
        .map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1); })
        .join(" ");
}
/**
 * Static fallback models when API is unreachable.
 */
function getOpencodeZenStaticFallbackModels() {
    var modelIds = [
        "gpt-5.1-codex",
        "claude-opus-4-5",
        "gemini-3-pro",
        "gpt-5.1-codex-mini",
        "gpt-5.1",
        "glm-4.7",
        "gemini-3-flash",
        "gpt-5.1-codex-max",
        "gpt-5.2",
    ];
    return modelIds.map(buildModelDefinition);
}
/**
 * Fetch models from the OpenCode Zen API.
 * Uses caching with 1-hour TTL.
 *
 * @param apiKey - OpenCode Zen API key for authentication
 * @returns Array of model definitions, or static fallback on failure
 */
function fetchOpencodeZenModels(apiKey) {
    return __awaiter(this, void 0, void 0, function () {
        var now, headers, response, data, models, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = Date.now();
                    if (cachedModels && now - cacheTimestamp < CACHE_TTL_MS) {
                        return [2 /*return*/, cachedModels];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    headers = {
                        Accept: "application/json",
                    };
                    if (apiKey) {
                        headers.Authorization = "Bearer ".concat(apiKey);
                    }
                    return [4 /*yield*/, fetch("".concat(exports.OPENCODE_ZEN_API_BASE_URL, "/models"), {
                            method: "GET",
                            headers: headers,
                            signal: AbortSignal.timeout(10000), // 10 second timeout
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("API returned ".concat(response.status, ": ").concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = (_a.sent());
                    if (!data.data || !Array.isArray(data.data)) {
                        throw new Error("Invalid response format from /models endpoint");
                    }
                    models = data.data.map(function (model) { return buildModelDefinition(model.id); });
                    cachedModels = models;
                    cacheTimestamp = now;
                    return [2 /*return*/, models];
                case 4:
                    error_1 = _a.sent();
                    console.warn("[opencode-zen] Failed to fetch models, using static fallback: ".concat(String(error_1)));
                    return [2 /*return*/, getOpencodeZenStaticFallbackModels()];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Clear the model cache (useful for testing or forcing refresh).
 */
function clearOpencodeZenModelCache() {
    cachedModels = null;
    cacheTimestamp = 0;
}
