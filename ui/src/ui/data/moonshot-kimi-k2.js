"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOONSHOT_KIMI_K2_MODELS = exports.MOONSHOT_KIMI_K2_COST = exports.MOONSHOT_KIMI_K2_INPUT = exports.MOONSHOT_KIMI_K2_MAX_TOKENS = exports.MOONSHOT_KIMI_K2_CONTEXT_WINDOW = exports.MOONSHOT_KIMI_K2_DEFAULT_ID = void 0;
exports.MOONSHOT_KIMI_K2_DEFAULT_ID = "kimi-k2-0905-preview";
exports.MOONSHOT_KIMI_K2_CONTEXT_WINDOW = 256000;
exports.MOONSHOT_KIMI_K2_MAX_TOKENS = 8192;
exports.MOONSHOT_KIMI_K2_INPUT = ["text"];
exports.MOONSHOT_KIMI_K2_COST = {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
};
exports.MOONSHOT_KIMI_K2_MODELS = [
    {
        id: "kimi-k2-0905-preview",
        name: "Kimi K2 0905 Preview",
        alias: "Kimi K2",
        reasoning: false,
    },
    {
        id: "kimi-k2-turbo-preview",
        name: "Kimi K2 Turbo",
        alias: "Kimi K2 Turbo",
        reasoning: false,
    },
    {
        id: "kimi-k2-thinking",
        name: "Kimi K2 Thinking",
        alias: "Kimi K2 Thinking",
        reasoning: true,
    },
    {
        id: "kimi-k2-thinking-turbo",
        name: "Kimi K2 Thinking Turbo",
        alias: "Kimi K2 Thinking Turbo",
        reasoning: true,
    },
];
