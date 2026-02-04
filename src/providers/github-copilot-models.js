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
exports.getDefaultCopilotModelIds = getDefaultCopilotModelIds;
exports.buildCopilotModelDefinition = buildCopilotModelDefinition;
var DEFAULT_CONTEXT_WINDOW = 128000;
var DEFAULT_MAX_TOKENS = 8192;
// Copilot model ids vary by plan/org and can change.
// We keep this list intentionally broad; if a model isn't available Copilot will
// return an error and users can remove it from their config.
var DEFAULT_MODEL_IDS = [
    "gpt-4o",
    "gpt-4.1",
    "gpt-4.1-mini",
    "gpt-4.1-nano",
    "o1",
    "o1-mini",
    "o3-mini",
];
function getDefaultCopilotModelIds() {
    return __spreadArray([], DEFAULT_MODEL_IDS, true);
}
function buildCopilotModelDefinition(modelId) {
    var id = modelId.trim();
    if (!id) {
        throw new Error("Model id required");
    }
    return {
        id: id,
        name: id,
        // pi-coding-agent's registry schema doesn't know about a "github-copilot" API.
        // We use OpenAI-compatible responses API, while keeping the provider id as
        // "github-copilot" (pi-ai uses that to attach Copilot-specific headers).
        api: "openai-responses",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: DEFAULT_CONTEXT_WINDOW,
        maxTokens: DEFAULT_MAX_TOKENS,
    };
}
