"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var opencode_zen_models_js_1 = require("./opencode-zen-models.js");
(0, vitest_1.describe)("resolveOpencodeZenAlias", function () {
    (0, vitest_1.it)("resolves opus alias", function () {
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenAlias)("opus")).toBe("claude-opus-4-5");
    });
    (0, vitest_1.it)("keeps legacy aliases working", function () {
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenAlias)("sonnet")).toBe("claude-opus-4-5");
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenAlias)("haiku")).toBe("claude-opus-4-5");
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenAlias)("gpt4")).toBe("gpt-5.1");
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenAlias)("o1")).toBe("gpt-5.2");
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenAlias)("gemini-2.5")).toBe("gemini-3-pro");
    });
    (0, vitest_1.it)("resolves gpt5 alias", function () {
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenAlias)("gpt5")).toBe("gpt-5.2");
    });
    (0, vitest_1.it)("resolves gemini alias", function () {
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenAlias)("gemini")).toBe("gemini-3-pro");
    });
    (0, vitest_1.it)("returns input if no alias exists", function () {
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenAlias)("some-unknown-model")).toBe("some-unknown-model");
    });
    (0, vitest_1.it)("is case-insensitive", function () {
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenAlias)("OPUS")).toBe("claude-opus-4-5");
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenAlias)("Gpt5")).toBe("gpt-5.2");
    });
});
(0, vitest_1.describe)("resolveOpencodeZenModelApi", function () {
    (0, vitest_1.it)("maps APIs by model family", function () {
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenModelApi)("claude-opus-4-5")).toBe("anthropic-messages");
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenModelApi)("gemini-3-pro")).toBe("google-generative-ai");
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenModelApi)("gpt-5.2")).toBe("openai-responses");
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenModelApi)("alpha-gd4")).toBe("openai-completions");
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenModelApi)("big-pickle")).toBe("openai-completions");
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenModelApi)("glm-4.7")).toBe("openai-completions");
        (0, vitest_1.expect)((0, opencode_zen_models_js_1.resolveOpencodeZenModelApi)("some-unknown-model")).toBe("openai-completions");
    });
});
(0, vitest_1.describe)("getOpencodeZenStaticFallbackModels", function () {
    (0, vitest_1.it)("returns an array of models", function () {
        var models = (0, opencode_zen_models_js_1.getOpencodeZenStaticFallbackModels)();
        (0, vitest_1.expect)(Array.isArray(models)).toBe(true);
        (0, vitest_1.expect)(models.length).toBe(9);
    });
    (0, vitest_1.it)("includes Claude, GPT, Gemini, and GLM models", function () {
        var models = (0, opencode_zen_models_js_1.getOpencodeZenStaticFallbackModels)();
        var ids = models.map(function (m) { return m.id; });
        (0, vitest_1.expect)(ids).toContain("claude-opus-4-5");
        (0, vitest_1.expect)(ids).toContain("gpt-5.2");
        (0, vitest_1.expect)(ids).toContain("gpt-5.1-codex");
        (0, vitest_1.expect)(ids).toContain("gemini-3-pro");
        (0, vitest_1.expect)(ids).toContain("glm-4.7");
    });
    (0, vitest_1.it)("returns valid ModelDefinitionConfig objects", function () {
        var models = (0, opencode_zen_models_js_1.getOpencodeZenStaticFallbackModels)();
        for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
            var model = models_1[_i];
            (0, vitest_1.expect)(model.id).toBeDefined();
            (0, vitest_1.expect)(model.name).toBeDefined();
            (0, vitest_1.expect)(typeof model.reasoning).toBe("boolean");
            (0, vitest_1.expect)(Array.isArray(model.input)).toBe(true);
            (0, vitest_1.expect)(model.cost).toBeDefined();
            (0, vitest_1.expect)(typeof model.contextWindow).toBe("number");
            (0, vitest_1.expect)(typeof model.maxTokens).toBe("number");
        }
    });
});
(0, vitest_1.describe)("OPENCODE_ZEN_MODEL_ALIASES", function () {
    (0, vitest_1.it)("has expected aliases", function () {
        (0, vitest_1.expect)(opencode_zen_models_js_1.OPENCODE_ZEN_MODEL_ALIASES.opus).toBe("claude-opus-4-5");
        (0, vitest_1.expect)(opencode_zen_models_js_1.OPENCODE_ZEN_MODEL_ALIASES.codex).toBe("gpt-5.1-codex");
        (0, vitest_1.expect)(opencode_zen_models_js_1.OPENCODE_ZEN_MODEL_ALIASES.gpt5).toBe("gpt-5.2");
        (0, vitest_1.expect)(opencode_zen_models_js_1.OPENCODE_ZEN_MODEL_ALIASES.gemini).toBe("gemini-3-pro");
        (0, vitest_1.expect)(opencode_zen_models_js_1.OPENCODE_ZEN_MODEL_ALIASES.glm).toBe("glm-4.7");
        // Legacy aliases (kept for backward compatibility).
        (0, vitest_1.expect)(opencode_zen_models_js_1.OPENCODE_ZEN_MODEL_ALIASES.sonnet).toBe("claude-opus-4-5");
        (0, vitest_1.expect)(opencode_zen_models_js_1.OPENCODE_ZEN_MODEL_ALIASES.haiku).toBe("claude-opus-4-5");
        (0, vitest_1.expect)(opencode_zen_models_js_1.OPENCODE_ZEN_MODEL_ALIASES.gpt4).toBe("gpt-5.1");
        (0, vitest_1.expect)(opencode_zen_models_js_1.OPENCODE_ZEN_MODEL_ALIASES.o1).toBe("gpt-5.2");
        (0, vitest_1.expect)(opencode_zen_models_js_1.OPENCODE_ZEN_MODEL_ALIASES["gemini-2.5"]).toBe("gemini-3-pro");
    });
});
