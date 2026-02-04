"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var context_window_guard_js_1 = require("./context-window-guard.js");
(0, vitest_1.describe)("context-window-guard", function () {
    (0, vitest_1.it)("blocks below 16k (model metadata)", function () {
        var info = (0, context_window_guard_js_1.resolveContextWindowInfo)({
            cfg: undefined,
            provider: "openrouter",
            modelId: "tiny",
            modelContextWindow: 8000,
            defaultTokens: 200000,
        });
        var guard = (0, context_window_guard_js_1.evaluateContextWindowGuard)({ info: info });
        (0, vitest_1.expect)(guard.source).toBe("model");
        (0, vitest_1.expect)(guard.tokens).toBe(8000);
        (0, vitest_1.expect)(guard.shouldWarn).toBe(true);
        (0, vitest_1.expect)(guard.shouldBlock).toBe(true);
    });
    (0, vitest_1.it)("warns below 32k but does not block at 16k+", function () {
        var info = (0, context_window_guard_js_1.resolveContextWindowInfo)({
            cfg: undefined,
            provider: "openai",
            modelId: "small",
            modelContextWindow: 24000,
            defaultTokens: 200000,
        });
        var guard = (0, context_window_guard_js_1.evaluateContextWindowGuard)({ info: info });
        (0, vitest_1.expect)(guard.tokens).toBe(24000);
        (0, vitest_1.expect)(guard.shouldWarn).toBe(true);
        (0, vitest_1.expect)(guard.shouldBlock).toBe(false);
    });
    (0, vitest_1.it)("does not warn at 32k+ (model metadata)", function () {
        var info = (0, context_window_guard_js_1.resolveContextWindowInfo)({
            cfg: undefined,
            provider: "openai",
            modelId: "ok",
            modelContextWindow: 64000,
            defaultTokens: 200000,
        });
        var guard = (0, context_window_guard_js_1.evaluateContextWindowGuard)({ info: info });
        (0, vitest_1.expect)(guard.shouldWarn).toBe(false);
        (0, vitest_1.expect)(guard.shouldBlock).toBe(false);
    });
    (0, vitest_1.it)("uses models.providers.*.models[].contextWindow when present", function () {
        var cfg = {
            models: {
                providers: {
                    openrouter: {
                        baseUrl: "http://localhost",
                        apiKey: "x",
                        models: [
                            {
                                id: "tiny",
                                name: "tiny",
                                reasoning: false,
                                input: ["text"],
                                cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                                contextWindow: 12000,
                                maxTokens: 256,
                            },
                        ],
                    },
                },
            },
        };
        var info = (0, context_window_guard_js_1.resolveContextWindowInfo)({
            cfg: cfg,
            provider: "openrouter",
            modelId: "tiny",
            modelContextWindow: 64000,
            defaultTokens: 200000,
        });
        var guard = (0, context_window_guard_js_1.evaluateContextWindowGuard)({ info: info });
        (0, vitest_1.expect)(info.source).toBe("modelsConfig");
        (0, vitest_1.expect)(guard.shouldBlock).toBe(true);
    });
    (0, vitest_1.it)("caps with agents.defaults.contextTokens", function () {
        var cfg = {
            agents: { defaults: { contextTokens: 20000 } },
        };
        var info = (0, context_window_guard_js_1.resolveContextWindowInfo)({
            cfg: cfg,
            provider: "anthropic",
            modelId: "whatever",
            modelContextWindow: 200000,
            defaultTokens: 200000,
        });
        var guard = (0, context_window_guard_js_1.evaluateContextWindowGuard)({ info: info });
        (0, vitest_1.expect)(info.source).toBe("agentContextTokens");
        (0, vitest_1.expect)(guard.shouldWarn).toBe(true);
        (0, vitest_1.expect)(guard.shouldBlock).toBe(false);
    });
    (0, vitest_1.it)("does not override when cap exceeds base window", function () {
        var cfg = {
            agents: { defaults: { contextTokens: 128000 } },
        };
        var info = (0, context_window_guard_js_1.resolveContextWindowInfo)({
            cfg: cfg,
            provider: "anthropic",
            modelId: "whatever",
            modelContextWindow: 64000,
            defaultTokens: 200000,
        });
        (0, vitest_1.expect)(info.source).toBe("model");
        (0, vitest_1.expect)(info.tokens).toBe(64000);
    });
    (0, vitest_1.it)("uses default when nothing else is available", function () {
        var info = (0, context_window_guard_js_1.resolveContextWindowInfo)({
            cfg: undefined,
            provider: "anthropic",
            modelId: "unknown",
            modelContextWindow: undefined,
            defaultTokens: 200000,
        });
        var guard = (0, context_window_guard_js_1.evaluateContextWindowGuard)({ info: info });
        (0, vitest_1.expect)(info.source).toBe("default");
        (0, vitest_1.expect)(guard.shouldWarn).toBe(false);
        (0, vitest_1.expect)(guard.shouldBlock).toBe(false);
    });
    (0, vitest_1.it)("allows overriding thresholds", function () {
        var info = { tokens: 10000, source: "model" };
        var guard = (0, context_window_guard_js_1.evaluateContextWindowGuard)({
            info: info,
            warnBelowTokens: 12000,
            hardMinTokens: 9000,
        });
        (0, vitest_1.expect)(guard.shouldWarn).toBe(true);
        (0, vitest_1.expect)(guard.shouldBlock).toBe(false);
    });
    (0, vitest_1.it)("exports thresholds as expected", function () {
        (0, vitest_1.expect)(context_window_guard_js_1.CONTEXT_WINDOW_HARD_MIN_TOKENS).toBe(16000);
        (0, vitest_1.expect)(context_window_guard_js_1.CONTEXT_WINDOW_WARN_BELOW_TOKENS).toBe(32000);
    });
});
