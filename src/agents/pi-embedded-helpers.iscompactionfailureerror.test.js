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
(0, vitest_1.describe)("isCompactionFailureError", function () {
    (0, vitest_1.it)("matches compaction overflow failures", function () {
        var samples = [
            'Context overflow: Summarization failed: 400 {"message":"prompt is too long"}',
            "auto-compaction failed due to context overflow",
            "Compaction failed: prompt is too long",
        ];
        for (var _i = 0, samples_1 = samples; _i < samples_1.length; _i++) {
            var sample = samples_1[_i];
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isCompactionFailureError)(sample)).toBe(true);
        }
    });
    (0, vitest_1.it)("ignores non-compaction overflow errors", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isCompactionFailureError)("Context overflow: prompt too large")).toBe(false);
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isCompactionFailureError)("rate limit exceeded")).toBe(false);
    });
});
