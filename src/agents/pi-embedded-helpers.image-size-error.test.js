"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
(0, vitest_1.describe)("parseImageSizeError", function () {
    (0, vitest_1.it)("parses max MB values from error text", function () {
        var _a, _b;
        (0, vitest_1.expect)((_a = (0, pi_embedded_helpers_js_1.parseImageSizeError)("image exceeds 5 MB maximum")) === null || _a === void 0 ? void 0 : _a.maxMb).toBe(5);
        (0, vitest_1.expect)((_b = (0, pi_embedded_helpers_js_1.parseImageSizeError)("Image exceeds 5.5 MB limit")) === null || _b === void 0 ? void 0 : _b.maxMb).toBe(5.5);
    });
    (0, vitest_1.it)("returns null for unrelated errors", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.parseImageSizeError)("context overflow")).toBeNull();
    });
});
