"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var boolean_js_1 = require("./boolean.js");
(0, vitest_1.describe)("parseBooleanValue", function () {
    (0, vitest_1.it)("handles boolean inputs", function () {
        (0, vitest_1.expect)((0, boolean_js_1.parseBooleanValue)(true)).toBe(true);
        (0, vitest_1.expect)((0, boolean_js_1.parseBooleanValue)(false)).toBe(false);
    });
    (0, vitest_1.it)("parses default truthy/falsy strings", function () {
        (0, vitest_1.expect)((0, boolean_js_1.parseBooleanValue)("true")).toBe(true);
        (0, vitest_1.expect)((0, boolean_js_1.parseBooleanValue)("1")).toBe(true);
        (0, vitest_1.expect)((0, boolean_js_1.parseBooleanValue)("yes")).toBe(true);
        (0, vitest_1.expect)((0, boolean_js_1.parseBooleanValue)("on")).toBe(true);
        (0, vitest_1.expect)((0, boolean_js_1.parseBooleanValue)("false")).toBe(false);
        (0, vitest_1.expect)((0, boolean_js_1.parseBooleanValue)("0")).toBe(false);
        (0, vitest_1.expect)((0, boolean_js_1.parseBooleanValue)("no")).toBe(false);
        (0, vitest_1.expect)((0, boolean_js_1.parseBooleanValue)("off")).toBe(false);
    });
    (0, vitest_1.it)("respects custom truthy/falsy lists", function () {
        (0, vitest_1.expect)((0, boolean_js_1.parseBooleanValue)("on", {
            truthy: ["true"],
            falsy: ["false"],
        })).toBeUndefined();
        (0, vitest_1.expect)((0, boolean_js_1.parseBooleanValue)("yes", {
            truthy: ["yes"],
            falsy: ["no"],
        })).toBe(true);
    });
    (0, vitest_1.it)("returns undefined for unsupported values", function () {
        (0, vitest_1.expect)((0, boolean_js_1.parseBooleanValue)("")).toBeUndefined();
        (0, vitest_1.expect)((0, boolean_js_1.parseBooleanValue)("maybe")).toBeUndefined();
        (0, vitest_1.expect)((0, boolean_js_1.parseBooleanValue)(1)).toBeUndefined();
    });
});
