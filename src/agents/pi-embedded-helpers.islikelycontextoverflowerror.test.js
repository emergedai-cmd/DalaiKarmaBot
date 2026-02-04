"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
var workspace_js_1 = require("./workspace.js");
var _makeFile = function (overrides) { return (__assign({ name: workspace_js_1.DEFAULT_AGENTS_FILENAME, path: "/tmp/AGENTS.md", content: "", missing: false }, overrides)); };
(0, vitest_1.describe)("isLikelyContextOverflowError", function () {
    (0, vitest_1.it)("matches context overflow hints", function () {
        var samples = [
            "Model context window is 128k tokens, you requested 256k tokens",
            "Context window exceeded: requested 12000 tokens",
            "Prompt too large for this model",
        ];
        for (var _i = 0, samples_1 = samples; _i < samples_1.length; _i++) {
            var sample = samples_1[_i];
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isLikelyContextOverflowError)(sample)).toBe(true);
        }
    });
    (0, vitest_1.it)("excludes context window too small errors", function () {
        var samples = [
            "Model context window too small (minimum is 128k tokens)",
            "Context window too small: minimum is 1000 tokens",
        ];
        for (var _i = 0, samples_2 = samples; _i < samples_2.length; _i++) {
            var sample = samples_2[_i];
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isLikelyContextOverflowError)(sample)).toBe(false);
        }
    });
});
