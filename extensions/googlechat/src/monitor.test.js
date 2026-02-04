"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var monitor_js_1 = require("./monitor.js");
(0, vitest_1.describe)("isSenderAllowed", function () {
    (0, vitest_1.it)("matches allowlist entries with users/<email>", function () {
        (0, vitest_1.expect)((0, monitor_js_1.isSenderAllowed)("users/123", "Jane@Example.com", ["users/jane@example.com"])).toBe(true);
    });
    (0, vitest_1.it)("matches allowlist entries with raw email", function () {
        (0, vitest_1.expect)((0, monitor_js_1.isSenderAllowed)("users/123", "Jane@Example.com", ["jane@example.com"])).toBe(true);
    });
    (0, vitest_1.it)("still matches user id entries", function () {
        (0, vitest_1.expect)((0, monitor_js_1.isSenderAllowed)("users/abc", "jane@example.com", ["users/abc"])).toBe(true);
    });
    (0, vitest_1.it)("rejects non-matching emails", function () {
        (0, vitest_1.expect)((0, monitor_js_1.isSenderAllowed)("users/123", "jane@example.com", ["users/other@example.com"])).toBe(false);
    });
});
