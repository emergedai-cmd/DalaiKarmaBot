"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_settings_js_1 = require("./pi-settings.js");
(0, vitest_1.describe)("ensurePiCompactionReserveTokens", function () {
    (0, vitest_1.it)("bumps reserveTokens when below floor", function () {
        var settingsManager = {
            getCompactionReserveTokens: function () { return 16384; },
            applyOverrides: vitest_1.vi.fn(),
        };
        var result = (0, pi_settings_js_1.ensurePiCompactionReserveTokens)({ settingsManager: settingsManager });
        (0, vitest_1.expect)(result).toEqual({
            didOverride: true,
            reserveTokens: pi_settings_js_1.DEFAULT_PI_COMPACTION_RESERVE_TOKENS_FLOOR,
        });
        (0, vitest_1.expect)(settingsManager.applyOverrides).toHaveBeenCalledWith({
            compaction: { reserveTokens: pi_settings_js_1.DEFAULT_PI_COMPACTION_RESERVE_TOKENS_FLOOR },
        });
    });
    (0, vitest_1.it)("does not override when already above floor", function () {
        var settingsManager = {
            getCompactionReserveTokens: function () { return 32000; },
            applyOverrides: vitest_1.vi.fn(),
        };
        var result = (0, pi_settings_js_1.ensurePiCompactionReserveTokens)({ settingsManager: settingsManager });
        (0, vitest_1.expect)(result).toEqual({ didOverride: false, reserveTokens: 32000 });
        (0, vitest_1.expect)(settingsManager.applyOverrides).not.toHaveBeenCalled();
    });
});
(0, vitest_1.describe)("resolveCompactionReserveTokensFloor", function () {
    (0, vitest_1.it)("returns the default when config is missing", function () {
        (0, vitest_1.expect)((0, pi_settings_js_1.resolveCompactionReserveTokensFloor)()).toBe(pi_settings_js_1.DEFAULT_PI_COMPACTION_RESERVE_TOKENS_FLOOR);
    });
    (0, vitest_1.it)("accepts configured floors, including zero", function () {
        (0, vitest_1.expect)((0, pi_settings_js_1.resolveCompactionReserveTokensFloor)({
            agents: { defaults: { compaction: { reserveTokensFloor: 24000 } } },
        })).toBe(24000);
        (0, vitest_1.expect)((0, pi_settings_js_1.resolveCompactionReserveTokensFloor)({
            agents: { defaults: { compaction: { reserveTokensFloor: 0 } } },
        })).toBe(0);
    });
});
