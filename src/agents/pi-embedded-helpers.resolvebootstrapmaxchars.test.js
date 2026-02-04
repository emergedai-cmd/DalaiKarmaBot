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
(0, vitest_1.describe)("resolveBootstrapMaxChars", function () {
    (0, vitest_1.it)("returns default when unset", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.resolveBootstrapMaxChars)()).toBe(pi_embedded_helpers_js_1.DEFAULT_BOOTSTRAP_MAX_CHARS);
    });
    (0, vitest_1.it)("uses configured value when valid", function () {
        var cfg = {
            agents: { defaults: { bootstrapMaxChars: 12345 } },
        };
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.resolveBootstrapMaxChars)(cfg)).toBe(12345);
    });
    (0, vitest_1.it)("falls back when invalid", function () {
        var cfg = {
            agents: { defaults: { bootstrapMaxChars: -1 } },
        };
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.resolveBootstrapMaxChars)(cfg)).toBe(pi_embedded_helpers_js_1.DEFAULT_BOOTSTRAP_MAX_CHARS);
    });
});
