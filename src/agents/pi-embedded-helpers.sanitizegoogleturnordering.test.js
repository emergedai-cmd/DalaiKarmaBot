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
(0, vitest_1.describe)("sanitizeGoogleTurnOrdering", function () {
    (0, vitest_1.it)("prepends a synthetic user turn when history starts with assistant", function () {
        var _a, _b;
        var input = [
            {
                role: "assistant",
                content: [{ type: "toolCall", id: "call_1", name: "exec", arguments: {} }],
            },
        ];
        var out = (0, pi_embedded_helpers_js_1.sanitizeGoogleTurnOrdering)(input);
        (0, vitest_1.expect)((_a = out[0]) === null || _a === void 0 ? void 0 : _a.role).toBe("user");
        (0, vitest_1.expect)((_b = out[1]) === null || _b === void 0 ? void 0 : _b.role).toBe("assistant");
    });
    (0, vitest_1.it)("is a no-op when history starts with user", function () {
        var input = [{ role: "user", content: "hi" }];
        var out = (0, pi_embedded_helpers_js_1.sanitizeGoogleTurnOrdering)(input);
        (0, vitest_1.expect)(out).toBe(input);
    });
});
