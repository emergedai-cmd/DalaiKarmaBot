"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var usage_js_1 = require("./usage.js");
(0, vitest_1.describe)("normalizeUsage", function () {
    (0, vitest_1.it)("normalizes Anthropic-style snake_case usage", function () {
        var usage = (0, usage_js_1.normalizeUsage)({
            input_tokens: 1200,
            output_tokens: 340,
            cache_creation_input_tokens: 200,
            cache_read_input_tokens: 50,
            total_tokens: 1790,
        });
        (0, vitest_1.expect)(usage).toEqual({
            input: 1200,
            output: 340,
            cacheRead: 50,
            cacheWrite: 200,
            total: 1790,
        });
    });
    (0, vitest_1.it)("normalizes OpenAI-style prompt/completion usage", function () {
        var usage = (0, usage_js_1.normalizeUsage)({
            prompt_tokens: 987,
            completion_tokens: 123,
            total_tokens: 1110,
        });
        (0, vitest_1.expect)(usage).toEqual({
            input: 987,
            output: 123,
            cacheRead: undefined,
            cacheWrite: undefined,
            total: 1110,
        });
    });
    (0, vitest_1.it)("returns undefined for empty usage objects", function () {
        (0, vitest_1.expect)((0, usage_js_1.normalizeUsage)({})).toBeUndefined();
    });
    (0, vitest_1.it)("guards against empty/zero usage overwrites", function () {
        (0, vitest_1.expect)((0, usage_js_1.hasNonzeroUsage)(undefined)).toBe(false);
        (0, vitest_1.expect)((0, usage_js_1.hasNonzeroUsage)(null)).toBe(false);
        (0, vitest_1.expect)((0, usage_js_1.hasNonzeroUsage)({})).toBe(false);
        (0, vitest_1.expect)((0, usage_js_1.hasNonzeroUsage)({ input: 0, output: 0 })).toBe(false);
        (0, vitest_1.expect)((0, usage_js_1.hasNonzeroUsage)({ input: 1 })).toBe(true);
        (0, vitest_1.expect)((0, usage_js_1.hasNonzeroUsage)({ total: 1 })).toBe(true);
    });
});
