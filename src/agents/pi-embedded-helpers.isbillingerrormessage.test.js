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
(0, vitest_1.describe)("isBillingErrorMessage", function () {
    (0, vitest_1.it)("matches credit / payment failures", function () {
        var samples = [
            "Your credit balance is too low to access the Anthropic API.",
            "insufficient credits",
            "Payment Required",
            "HTTP 402 Payment Required",
            "plans & billing",
            "billing: please upgrade your plan",
        ];
        for (var _i = 0, samples_1 = samples; _i < samples_1.length; _i++) {
            var sample = samples_1[_i];
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isBillingErrorMessage)(sample)).toBe(true);
        }
    });
    (0, vitest_1.it)("ignores unrelated errors", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isBillingErrorMessage)("rate limit exceeded")).toBe(false);
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isBillingErrorMessage)("invalid api key")).toBe(false);
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isBillingErrorMessage)("context length exceeded")).toBe(false);
    });
});
