"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var signal_js_1 = require("./signal.js");
(0, vitest_1.describe)("signal target normalization", function () {
    (0, vitest_1.it)("normalizes uuid targets by stripping uuid:", function () {
        (0, vitest_1.expect)((0, signal_js_1.normalizeSignalMessagingTarget)("uuid:123E4567-E89B-12D3-A456-426614174000")).toBe("123e4567-e89b-12d3-a456-426614174000");
    });
    (0, vitest_1.it)("normalizes signal:uuid targets", function () {
        (0, vitest_1.expect)((0, signal_js_1.normalizeSignalMessagingTarget)("signal:uuid:123E4567-E89B-12D3-A456-426614174000")).toBe("123e4567-e89b-12d3-a456-426614174000");
    });
    (0, vitest_1.it)("accepts uuid prefixes for target detection", function () {
        (0, vitest_1.expect)((0, signal_js_1.looksLikeSignalTargetId)("uuid:123e4567-e89b-12d3-a456-426614174000")).toBe(true);
        (0, vitest_1.expect)((0, signal_js_1.looksLikeSignalTargetId)("signal:uuid:123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    });
    (0, vitest_1.it)("accepts compact UUIDs for target detection", function () {
        (0, vitest_1.expect)((0, signal_js_1.looksLikeSignalTargetId)("123e4567e89b12d3a456426614174000")).toBe(true);
        (0, vitest_1.expect)((0, signal_js_1.looksLikeSignalTargetId)("uuid:123e4567e89b12d3a456426614174000")).toBe(true);
    });
    (0, vitest_1.it)("rejects invalid uuid prefixes", function () {
        (0, vitest_1.expect)((0, signal_js_1.looksLikeSignalTargetId)("uuid:")).toBe(false);
        (0, vitest_1.expect)((0, signal_js_1.looksLikeSignalTargetId)("uuid:not-a-uuid")).toBe(false);
    });
});
