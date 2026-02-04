"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var usage_format_js_1 = require("./usage-format.js");
(0, vitest_1.describe)("usage-format", function () {
    (0, vitest_1.it)("formats token counts", function () {
        (0, vitest_1.expect)((0, usage_format_js_1.formatTokenCount)(999)).toBe("999");
        (0, vitest_1.expect)((0, usage_format_js_1.formatTokenCount)(1234)).toBe("1.2k");
        (0, vitest_1.expect)((0, usage_format_js_1.formatTokenCount)(12000)).toBe("12k");
        (0, vitest_1.expect)((0, usage_format_js_1.formatTokenCount)(2500000)).toBe("2.5m");
    });
    (0, vitest_1.it)("formats USD values", function () {
        (0, vitest_1.expect)((0, usage_format_js_1.formatUsd)(1.234)).toBe("$1.23");
        (0, vitest_1.expect)((0, usage_format_js_1.formatUsd)(0.5)).toBe("$0.50");
        (0, vitest_1.expect)((0, usage_format_js_1.formatUsd)(0.0042)).toBe("$0.0042");
    });
    (0, vitest_1.it)("resolves model cost config and estimates usage cost", function () {
        var config = {
            models: {
                providers: {
                    test: {
                        models: [
                            {
                                id: "m1",
                                cost: { input: 1, output: 2, cacheRead: 0.5, cacheWrite: 0 },
                            },
                        ],
                    },
                },
            },
        };
        var cost = (0, usage_format_js_1.resolveModelCostConfig)({
            provider: "test",
            model: "m1",
            config: config,
        });
        (0, vitest_1.expect)(cost).toEqual({
            input: 1,
            output: 2,
            cacheRead: 0.5,
            cacheWrite: 0,
        });
        var total = (0, usage_format_js_1.estimateUsageCost)({
            usage: { input: 1000, output: 500, cacheRead: 2000 },
            cost: cost,
        });
        (0, vitest_1.expect)(total).toBeCloseTo(0.003);
    });
});
