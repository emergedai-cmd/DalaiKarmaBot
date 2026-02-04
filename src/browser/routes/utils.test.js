"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var utils_js_1 = require("./utils.js");
(0, vitest_1.describe)("toBoolean", function () {
    (0, vitest_1.it)("parses yes/no and 1/0", function () {
        (0, vitest_1.expect)((0, utils_js_1.toBoolean)("yes")).toBe(true);
        (0, vitest_1.expect)((0, utils_js_1.toBoolean)("1")).toBe(true);
        (0, vitest_1.expect)((0, utils_js_1.toBoolean)("no")).toBe(false);
        (0, vitest_1.expect)((0, utils_js_1.toBoolean)("0")).toBe(false);
    });
    (0, vitest_1.it)("returns undefined for on/off strings", function () {
        (0, vitest_1.expect)((0, utils_js_1.toBoolean)("on")).toBeUndefined();
        (0, vitest_1.expect)((0, utils_js_1.toBoolean)("off")).toBeUndefined();
    });
    (0, vitest_1.it)("passes through boolean values", function () {
        (0, vitest_1.expect)((0, utils_js_1.toBoolean)(true)).toBe(true);
        (0, vitest_1.expect)((0, utils_js_1.toBoolean)(false)).toBe(false);
    });
});
