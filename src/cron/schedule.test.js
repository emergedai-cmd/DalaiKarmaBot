"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var schedule_js_1 = require("./schedule.js");
(0, vitest_1.describe)("cron schedule", function () {
    (0, vitest_1.it)("computes next run for cron expression with timezone", function () {
        // Saturday, Dec 13 2025 00:00:00Z
        var nowMs = Date.parse("2025-12-13T00:00:00.000Z");
        var next = (0, schedule_js_1.computeNextRunAtMs)({ kind: "cron", expr: "0 9 * * 3", tz: "America/Los_Angeles" }, nowMs);
        // Next Wednesday at 09:00 PST -> 17:00Z
        (0, vitest_1.expect)(next).toBe(Date.parse("2025-12-17T17:00:00.000Z"));
    });
    (0, vitest_1.it)("computes next run for every schedule", function () {
        var anchor = Date.parse("2025-12-13T00:00:00.000Z");
        var now = anchor + 10000;
        var next = (0, schedule_js_1.computeNextRunAtMs)({ kind: "every", everyMs: 30000, anchorMs: anchor }, now);
        (0, vitest_1.expect)(next).toBe(anchor + 30000);
    });
    (0, vitest_1.it)("computes next run for every schedule when anchorMs is not provided", function () {
        var now = Date.parse("2025-12-13T00:00:00.000Z");
        var next = (0, schedule_js_1.computeNextRunAtMs)({ kind: "every", everyMs: 30000 }, now);
        // Should return nowMs + everyMs, not nowMs (which would cause infinite loop)
        (0, vitest_1.expect)(next).toBe(now + 30000);
    });
    (0, vitest_1.it)("advances when now matches anchor for every schedule", function () {
        var anchor = Date.parse("2025-12-13T00:00:00.000Z");
        var next = (0, schedule_js_1.computeNextRunAtMs)({ kind: "every", everyMs: 30000, anchorMs: anchor }, anchor);
        (0, vitest_1.expect)(next).toBe(anchor + 30000);
    });
});
