"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var memory_flush_js_1 = require("./memory-flush.js");
(0, vitest_1.describe)("memory flush settings", function () {
    (0, vitest_1.it)("defaults to enabled with fallback prompt and system prompt", function () {
        var settings = (0, memory_flush_js_1.resolveMemoryFlushSettings)();
        (0, vitest_1.expect)(settings).not.toBeNull();
        (0, vitest_1.expect)(settings === null || settings === void 0 ? void 0 : settings.enabled).toBe(true);
        (0, vitest_1.expect)(settings === null || settings === void 0 ? void 0 : settings.prompt.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(settings === null || settings === void 0 ? void 0 : settings.systemPrompt.length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)("respects disable flag", function () {
        (0, vitest_1.expect)((0, memory_flush_js_1.resolveMemoryFlushSettings)({
            agents: {
                defaults: { compaction: { memoryFlush: { enabled: false } } },
            },
        })).toBeNull();
    });
    (0, vitest_1.it)("appends NO_REPLY hint when missing", function () {
        var settings = (0, memory_flush_js_1.resolveMemoryFlushSettings)({
            agents: {
                defaults: {
                    compaction: {
                        memoryFlush: {
                            prompt: "Write memories now.",
                            systemPrompt: "Flush memory.",
                        },
                    },
                },
            },
        });
        (0, vitest_1.expect)(settings === null || settings === void 0 ? void 0 : settings.prompt).toContain("NO_REPLY");
        (0, vitest_1.expect)(settings === null || settings === void 0 ? void 0 : settings.systemPrompt).toContain("NO_REPLY");
    });
});
(0, vitest_1.describe)("shouldRunMemoryFlush", function () {
    (0, vitest_1.it)("requires totalTokens and threshold", function () {
        (0, vitest_1.expect)((0, memory_flush_js_1.shouldRunMemoryFlush)({
            entry: { totalTokens: 0 },
            contextWindowTokens: 16000,
            reserveTokensFloor: 20000,
            softThresholdTokens: memory_flush_js_1.DEFAULT_MEMORY_FLUSH_SOFT_TOKENS,
        })).toBe(false);
    });
    (0, vitest_1.it)("skips when entry is missing", function () {
        (0, vitest_1.expect)((0, memory_flush_js_1.shouldRunMemoryFlush)({
            entry: undefined,
            contextWindowTokens: 16000,
            reserveTokensFloor: 1000,
            softThresholdTokens: memory_flush_js_1.DEFAULT_MEMORY_FLUSH_SOFT_TOKENS,
        })).toBe(false);
    });
    (0, vitest_1.it)("skips when under threshold", function () {
        (0, vitest_1.expect)((0, memory_flush_js_1.shouldRunMemoryFlush)({
            entry: { totalTokens: 10000 },
            contextWindowTokens: 100000,
            reserveTokensFloor: 20000,
            softThresholdTokens: 10000,
        })).toBe(false);
    });
    (0, vitest_1.it)("triggers at the threshold boundary", function () {
        (0, vitest_1.expect)((0, memory_flush_js_1.shouldRunMemoryFlush)({
            entry: { totalTokens: 85 },
            contextWindowTokens: 100,
            reserveTokensFloor: 10,
            softThresholdTokens: 5,
        })).toBe(true);
    });
    (0, vitest_1.it)("skips when already flushed for current compaction count", function () {
        (0, vitest_1.expect)((0, memory_flush_js_1.shouldRunMemoryFlush)({
            entry: {
                totalTokens: 90000,
                compactionCount: 2,
                memoryFlushCompactionCount: 2,
            },
            contextWindowTokens: 100000,
            reserveTokensFloor: 5000,
            softThresholdTokens: 2000,
        })).toBe(false);
    });
    (0, vitest_1.it)("runs when above threshold and not flushed", function () {
        (0, vitest_1.expect)((0, memory_flush_js_1.shouldRunMemoryFlush)({
            entry: { totalTokens: 96000, compactionCount: 1 },
            contextWindowTokens: 100000,
            reserveTokensFloor: 5000,
            softThresholdTokens: 2000,
        })).toBe(true);
    });
});
(0, vitest_1.describe)("resolveMemoryFlushContextWindowTokens", function () {
    (0, vitest_1.it)("falls back to agent config or default tokens", function () {
        (0, vitest_1.expect)((0, memory_flush_js_1.resolveMemoryFlushContextWindowTokens)({ agentCfgContextTokens: 42000 })).toBe(42000);
    });
});
