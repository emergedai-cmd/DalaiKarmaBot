"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var config_state_js_1 = require("./config-state.js");
(0, vitest_1.describe)("normalizePluginsConfig", function () {
    (0, vitest_1.it)("uses default memory slot when not specified", function () {
        var result = (0, config_state_js_1.normalizePluginsConfig)({});
        (0, vitest_1.expect)(result.slots.memory).toBe("memory-core");
    });
    (0, vitest_1.it)("respects explicit memory slot value", function () {
        var result = (0, config_state_js_1.normalizePluginsConfig)({
            slots: { memory: "custom-memory" },
        });
        (0, vitest_1.expect)(result.slots.memory).toBe("custom-memory");
    });
    (0, vitest_1.it)("disables memory slot when set to 'none'", function () {
        var result = (0, config_state_js_1.normalizePluginsConfig)({
            slots: { memory: "none" },
        });
        (0, vitest_1.expect)(result.slots.memory).toBeNull();
    });
    (0, vitest_1.it)("disables memory slot when set to 'None' (case insensitive)", function () {
        var result = (0, config_state_js_1.normalizePluginsConfig)({
            slots: { memory: "None" },
        });
        (0, vitest_1.expect)(result.slots.memory).toBeNull();
    });
    (0, vitest_1.it)("trims whitespace from memory slot value", function () {
        var result = (0, config_state_js_1.normalizePluginsConfig)({
            slots: { memory: "  custom-memory  " },
        });
        (0, vitest_1.expect)(result.slots.memory).toBe("custom-memory");
    });
    (0, vitest_1.it)("uses default when memory slot is empty string", function () {
        var result = (0, config_state_js_1.normalizePluginsConfig)({
            slots: { memory: "" },
        });
        (0, vitest_1.expect)(result.slots.memory).toBe("memory-core");
    });
    (0, vitest_1.it)("uses default when memory slot is whitespace only", function () {
        var result = (0, config_state_js_1.normalizePluginsConfig)({
            slots: { memory: "   " },
        });
        (0, vitest_1.expect)(result.slots.memory).toBe("memory-core");
    });
});
