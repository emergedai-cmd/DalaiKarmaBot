"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var slots_js_1 = require("./slots.js");
(0, vitest_1.describe)("applyExclusiveSlotSelection", function () {
    (0, vitest_1.it)("selects the slot and disables other entries for the same kind", function () {
        var _a, _b, _c, _d, _e;
        var config = {
            plugins: {
                slots: { memory: "memory-core" },
                entries: {
                    "memory-core": { enabled: true },
                    memory: { enabled: true },
                },
            },
        };
        var result = (0, slots_js_1.applyExclusiveSlotSelection)({
            config: config,
            selectedId: "memory",
            selectedKind: "memory",
            registry: {
                plugins: [
                    { id: "memory-core", kind: "memory" },
                    { id: "memory", kind: "memory" },
                ],
            },
        });
        (0, vitest_1.expect)(result.changed).toBe(true);
        (0, vitest_1.expect)((_b = (_a = result.config.plugins) === null || _a === void 0 ? void 0 : _a.slots) === null || _b === void 0 ? void 0 : _b.memory).toBe("memory");
        (0, vitest_1.expect)((_e = (_d = (_c = result.config.plugins) === null || _c === void 0 ? void 0 : _c.entries) === null || _d === void 0 ? void 0 : _d["memory-core"]) === null || _e === void 0 ? void 0 : _e.enabled).toBe(false);
        (0, vitest_1.expect)(result.warnings).toContain('Exclusive slot "memory" switched from "memory-core" to "memory".');
        (0, vitest_1.expect)(result.warnings).toContain('Disabled other "memory" slot plugins: memory-core.');
    });
    (0, vitest_1.it)("does nothing when the slot already matches", function () {
        var config = {
            plugins: {
                slots: { memory: "memory" },
                entries: {
                    memory: { enabled: true },
                },
            },
        };
        var result = (0, slots_js_1.applyExclusiveSlotSelection)({
            config: config,
            selectedId: "memory",
            selectedKind: "memory",
            registry: { plugins: [{ id: "memory", kind: "memory" }] },
        });
        (0, vitest_1.expect)(result.changed).toBe(false);
        (0, vitest_1.expect)(result.warnings).toHaveLength(0);
        (0, vitest_1.expect)(result.config).toBe(config);
    });
    (0, vitest_1.it)("warns when the slot falls back to a default", function () {
        var config = {
            plugins: {
                entries: {
                    memory: { enabled: true },
                },
            },
        };
        var result = (0, slots_js_1.applyExclusiveSlotSelection)({
            config: config,
            selectedId: "memory",
            selectedKind: "memory",
            registry: { plugins: [{ id: "memory", kind: "memory" }] },
        });
        (0, vitest_1.expect)(result.changed).toBe(true);
        (0, vitest_1.expect)(result.warnings).toContain('Exclusive slot "memory" switched from "memory-core" to "memory".');
    });
    (0, vitest_1.it)("skips changes when no exclusive slot applies", function () {
        var config = {};
        var result = (0, slots_js_1.applyExclusiveSlotSelection)({
            config: config,
            selectedId: "custom",
        });
        (0, vitest_1.expect)(result.changed).toBe(false);
        (0, vitest_1.expect)(result.warnings).toHaveLength(0);
        (0, vitest_1.expect)(result.config).toBe(config);
    });
});
