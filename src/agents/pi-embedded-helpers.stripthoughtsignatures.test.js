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
(0, vitest_1.describe)("stripThoughtSignatures", function () {
    (0, vitest_1.it)("returns non-array content unchanged", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.stripThoughtSignatures)("hello")).toBe("hello");
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.stripThoughtSignatures)(null)).toBe(null);
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.stripThoughtSignatures)(undefined)).toBe(undefined);
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.stripThoughtSignatures)(123)).toBe(123);
    });
    (0, vitest_1.it)("removes msg_-prefixed thought_signature from content blocks", function () {
        var input = [
            { type: "text", text: "hello", thought_signature: "msg_abc123" },
            { type: "thinking", thinking: "test", thought_signature: "AQID" },
        ];
        var result = (0, pi_embedded_helpers_js_1.stripThoughtSignatures)(input);
        (0, vitest_1.expect)(result).toHaveLength(2);
        (0, vitest_1.expect)(result[0]).toEqual({ type: "text", text: "hello" });
        (0, vitest_1.expect)(result[1]).toEqual({
            type: "thinking",
            thinking: "test",
            thought_signature: "AQID",
        });
        (0, vitest_1.expect)("thought_signature" in result[0]).toBe(false);
        (0, vitest_1.expect)("thought_signature" in result[1]).toBe(true);
    });
    (0, vitest_1.it)("preserves blocks without thought_signature", function () {
        var input = [
            { type: "text", text: "hello" },
            { type: "toolCall", id: "call_1", name: "read", arguments: {} },
        ];
        var result = (0, pi_embedded_helpers_js_1.stripThoughtSignatures)(input);
        (0, vitest_1.expect)(result).toEqual(input);
    });
    (0, vitest_1.it)("handles mixed blocks with and without thought_signature", function () {
        var input = [
            { type: "text", text: "hello", thought_signature: "msg_abc" },
            { type: "toolCall", id: "call_1", name: "read", arguments: {} },
            { type: "thinking", thinking: "hmm", thought_signature: "msg_xyz" },
        ];
        var result = (0, pi_embedded_helpers_js_1.stripThoughtSignatures)(input);
        (0, vitest_1.expect)(result).toEqual([
            { type: "text", text: "hello" },
            { type: "toolCall", id: "call_1", name: "read", arguments: {} },
            { type: "thinking", thinking: "hmm" },
        ]);
    });
    (0, vitest_1.it)("handles empty array", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.stripThoughtSignatures)([])).toEqual([]);
    });
    (0, vitest_1.it)("handles null/undefined blocks in array", function () {
        var input = [null, undefined, { type: "text", text: "hello" }];
        var result = (0, pi_embedded_helpers_js_1.stripThoughtSignatures)(input);
        (0, vitest_1.expect)(result).toEqual([null, undefined, { type: "text", text: "hello" }]);
    });
});
