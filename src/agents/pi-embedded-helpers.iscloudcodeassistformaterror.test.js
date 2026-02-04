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
(0, vitest_1.describe)("isCloudCodeAssistFormatError", function () {
    (0, vitest_1.it)("matches format errors", function () {
        var samples = [
            "INVALID_REQUEST_ERROR: string should match pattern",
            "messages.1.content.1.tool_use.id",
            "tool_use.id should match pattern",
            "invalid request format",
        ];
        for (var _i = 0, samples_1 = samples; _i < samples_1.length; _i++) {
            var sample = samples_1[_i];
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isCloudCodeAssistFormatError)(sample)).toBe(true);
        }
    });
    (0, vitest_1.it)("ignores unrelated errors", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isCloudCodeAssistFormatError)("rate limit exceeded")).toBe(false);
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isCloudCodeAssistFormatError)('400 {"type":"error","error":{"type":"invalid_request_error","message":"messages.84.content.1.image.source.base64.data: At least one of the image dimensions exceed max allowed size for many-image requests: 2000 pixels"}}')).toBe(false);
    });
});
