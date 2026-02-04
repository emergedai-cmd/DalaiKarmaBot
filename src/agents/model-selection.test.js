"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var model_selection_js_1 = require("./model-selection.js");
(0, vitest_1.describe)("model-selection", function () {
    (0, vitest_1.describe)("normalizeProviderId", function () {
        (0, vitest_1.it)("should normalize provider names", function () {
            (0, vitest_1.expect)((0, model_selection_js_1.normalizeProviderId)("Anthropic")).toBe("anthropic");
            (0, vitest_1.expect)((0, model_selection_js_1.normalizeProviderId)("Z.ai")).toBe("zai");
            (0, vitest_1.expect)((0, model_selection_js_1.normalizeProviderId)("z-ai")).toBe("zai");
            (0, vitest_1.expect)((0, model_selection_js_1.normalizeProviderId)("OpenCode-Zen")).toBe("opencode");
            (0, vitest_1.expect)((0, model_selection_js_1.normalizeProviderId)("qwen")).toBe("qwen-portal");
            (0, vitest_1.expect)((0, model_selection_js_1.normalizeProviderId)("kimi-code")).toBe("kimi-coding");
        });
    });
    (0, vitest_1.describe)("parseModelRef", function () {
        (0, vitest_1.it)("should parse full model refs", function () {
            (0, vitest_1.expect)((0, model_selection_js_1.parseModelRef)("anthropic/claude-3-5-sonnet", "openai")).toEqual({
                provider: "anthropic",
                model: "claude-3-5-sonnet",
            });
        });
        (0, vitest_1.it)("should use default provider if none specified", function () {
            (0, vitest_1.expect)((0, model_selection_js_1.parseModelRef)("claude-3-5-sonnet", "anthropic")).toEqual({
                provider: "anthropic",
                model: "claude-3-5-sonnet",
            });
        });
        (0, vitest_1.it)("should return null for empty strings", function () {
            (0, vitest_1.expect)((0, model_selection_js_1.parseModelRef)("", "anthropic")).toBeNull();
            (0, vitest_1.expect)((0, model_selection_js_1.parseModelRef)("  ", "anthropic")).toBeNull();
        });
        (0, vitest_1.it)("should handle invalid slash usage", function () {
            (0, vitest_1.expect)((0, model_selection_js_1.parseModelRef)("/", "anthropic")).toBeNull();
            (0, vitest_1.expect)((0, model_selection_js_1.parseModelRef)("anthropic/", "anthropic")).toBeNull();
            (0, vitest_1.expect)((0, model_selection_js_1.parseModelRef)("/model", "anthropic")).toBeNull();
        });
    });
    (0, vitest_1.describe)("buildModelAliasIndex", function () {
        (0, vitest_1.it)("should build alias index from config", function () {
            var _a, _b;
            var cfg = {
                agents: {
                    defaults: {
                        models: {
                            "anthropic/claude-3-5-sonnet": { alias: "fast" },
                            "openai/gpt-4o": { alias: "smart" },
                        },
                    },
                },
            };
            var index = (0, model_selection_js_1.buildModelAliasIndex)({
                cfg: cfg,
                defaultProvider: "anthropic",
            });
            (0, vitest_1.expect)((_a = index.byAlias.get("fast")) === null || _a === void 0 ? void 0 : _a.ref).toEqual({
                provider: "anthropic",
                model: "claude-3-5-sonnet",
            });
            (0, vitest_1.expect)((_b = index.byAlias.get("smart")) === null || _b === void 0 ? void 0 : _b.ref).toEqual({ provider: "openai", model: "gpt-4o" });
            (0, vitest_1.expect)(index.byKey.get((0, model_selection_js_1.modelKey)("anthropic", "claude-3-5-sonnet"))).toEqual(["fast"]);
        });
    });
    (0, vitest_1.describe)("resolveModelRefFromString", function () {
        (0, vitest_1.it)("should resolve from string with alias", function () {
            var index = {
                byAlias: new Map([
                    ["fast", { alias: "fast", ref: { provider: "anthropic", model: "sonnet" } }],
                ]),
                byKey: new Map(),
            };
            var resolved = (0, model_selection_js_1.resolveModelRefFromString)({
                raw: "fast",
                defaultProvider: "openai",
                aliasIndex: index,
            });
            (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.ref).toEqual({ provider: "anthropic", model: "sonnet" });
            (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.alias).toBe("fast");
        });
        (0, vitest_1.it)("should resolve direct ref if no alias match", function () {
            var resolved = (0, model_selection_js_1.resolveModelRefFromString)({
                raw: "openai/gpt-4",
                defaultProvider: "anthropic",
            });
            (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.ref).toEqual({ provider: "openai", model: "gpt-4" });
        });
    });
    (0, vitest_1.describe)("resolveConfiguredModelRef", function () {
        (0, vitest_1.it)("should fall back to anthropic and warn if provider is missing for non-alias", function () {
            var warnSpy = vitest_1.vi.spyOn(console, "warn").mockImplementation(function () { });
            var cfg = {
                agents: {
                    defaults: {
                        model: "claude-3-5-sonnet",
                    },
                },
            };
            var result = (0, model_selection_js_1.resolveConfiguredModelRef)({
                cfg: cfg,
                defaultProvider: "google",
                defaultModel: "gemini-pro",
            });
            (0, vitest_1.expect)(result).toEqual({ provider: "anthropic", model: "claude-3-5-sonnet" });
            (0, vitest_1.expect)(warnSpy).toHaveBeenCalledWith(vitest_1.expect.stringContaining('Falling back to "anthropic/claude-3-5-sonnet"'));
            warnSpy.mockRestore();
        });
        (0, vitest_1.it)("should use default provider/model if config is empty", function () {
            var cfg = {};
            var result = (0, model_selection_js_1.resolveConfiguredModelRef)({
                cfg: cfg,
                defaultProvider: "openai",
                defaultModel: "gpt-4",
            });
            (0, vitest_1.expect)(result).toEqual({ provider: "openai", model: "gpt-4" });
        });
    });
});
