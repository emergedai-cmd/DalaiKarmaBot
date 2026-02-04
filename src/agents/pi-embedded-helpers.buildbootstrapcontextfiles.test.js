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
var makeFile = function (overrides) { return (__assign({ name: workspace_js_1.DEFAULT_AGENTS_FILENAME, path: "/tmp/AGENTS.md", content: "", missing: false }, overrides)); };
(0, vitest_1.describe)("buildBootstrapContextFiles", function () {
    (0, vitest_1.it)("keeps missing markers", function () {
        var files = [makeFile({ missing: true, content: undefined })];
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.buildBootstrapContextFiles)(files)).toEqual([
            {
                path: workspace_js_1.DEFAULT_AGENTS_FILENAME,
                content: "[MISSING] Expected at: /tmp/AGENTS.md",
            },
        ]);
    });
    (0, vitest_1.it)("skips empty or whitespace-only content", function () {
        var files = [makeFile({ content: "   \n  " })];
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.buildBootstrapContextFiles)(files)).toEqual([]);
    });
    (0, vitest_1.it)("truncates large bootstrap content", function () {
        var head = "HEAD-".concat("a".repeat(600));
        var tail = "".concat("b".repeat(300), "-TAIL");
        var long = "".concat(head).concat(tail);
        var files = [makeFile({ name: "TOOLS.md", content: long })];
        var warnings = [];
        var maxChars = 200;
        var expectedTailChars = Math.floor(maxChars * 0.2);
        var result = (0, pi_embedded_helpers_js_1.buildBootstrapContextFiles)(files, {
            maxChars: maxChars,
            warn: function (message) { return warnings.push(message); },
        })[0];
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.content).toContain("[...truncated, read TOOLS.md for full content...]");
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.content.length).toBeLessThan(long.length);
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.content.startsWith(long.slice(0, 120))).toBe(true);
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.content.endsWith(long.slice(-expectedTailChars))).toBe(true);
        (0, vitest_1.expect)(warnings).toHaveLength(1);
        (0, vitest_1.expect)(warnings[0]).toContain("TOOLS.md");
        (0, vitest_1.expect)(warnings[0]).toContain("limit 200");
    });
    (0, vitest_1.it)("keeps content under the default limit", function () {
        var long = "a".repeat(pi_embedded_helpers_js_1.DEFAULT_BOOTSTRAP_MAX_CHARS - 10);
        var files = [makeFile({ content: long })];
        var result = (0, pi_embedded_helpers_js_1.buildBootstrapContextFiles)(files)[0];
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.content).toBe(long);
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.content).not.toContain("[...truncated, read AGENTS.md for full content...]");
    });
});
