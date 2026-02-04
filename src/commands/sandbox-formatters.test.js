"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var sandbox_formatters_js_1 = require("./sandbox-formatters.js");
(0, vitest_1.describe)("sandbox-formatters", function () {
    (0, vitest_1.describe)("formatStatus", function () {
        (0, vitest_1.it)("should format running status", function () {
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatStatus)(true)).toBe("🟢 running");
        });
        (0, vitest_1.it)("should format stopped status", function () {
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatStatus)(false)).toBe("⚫ stopped");
        });
    });
    (0, vitest_1.describe)("formatSimpleStatus", function () {
        (0, vitest_1.it)("should format running status without emoji", function () {
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatSimpleStatus)(true)).toBe("running");
        });
        (0, vitest_1.it)("should format stopped status without emoji", function () {
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatSimpleStatus)(false)).toBe("stopped");
        });
    });
    (0, vitest_1.describe)("formatImageMatch", function () {
        (0, vitest_1.it)("should format matching image", function () {
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatImageMatch)(true)).toBe("✓");
        });
        (0, vitest_1.it)("should format mismatched image", function () {
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatImageMatch)(false)).toBe("⚠️  mismatch");
        });
    });
    (0, vitest_1.describe)("formatAge", function () {
        (0, vitest_1.it)("should format seconds", function () {
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(5000)).toBe("5s");
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(45000)).toBe("45s");
        });
        (0, vitest_1.it)("should format minutes", function () {
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(60000)).toBe("1m");
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(90000)).toBe("1m");
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(300000)).toBe("5m");
        });
        (0, vitest_1.it)("should format hours and minutes", function () {
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(3600000)).toBe("1h 0m");
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(3660000)).toBe("1h 1m");
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(7200000)).toBe("2h 0m");
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(5400000)).toBe("1h 30m");
        });
        (0, vitest_1.it)("should format days and hours", function () {
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(86400000)).toBe("1d 0h");
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(90000000)).toBe("1d 1h");
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(172800000)).toBe("2d 0h");
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(183600000)).toBe("2d 3h");
        });
        (0, vitest_1.it)("should handle zero", function () {
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(0)).toBe("0s");
        });
        (0, vitest_1.it)("should handle edge cases", function () {
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(59999)).toBe("59s"); // Just under 1 minute
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(3599999)).toBe("59m"); // Just under 1 hour
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.formatAge)(86399999)).toBe("23h 59m"); // Just under 1 day
        });
    });
    (0, vitest_1.describe)("countRunning", function () {
        (0, vitest_1.it)("should count running items", function () {
            var items = [
                { running: true, name: "a" },
                { running: false, name: "b" },
                { running: true, name: "c" },
                { running: false, name: "d" },
            ];
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.countRunning)(items)).toBe(2);
        });
        (0, vitest_1.it)("should return 0 for empty array", function () {
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.countRunning)([])).toBe(0);
        });
        (0, vitest_1.it)("should return 0 when no items running", function () {
            var items = [
                { running: false, name: "a" },
                { running: false, name: "b" },
            ];
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.countRunning)(items)).toBe(0);
        });
        (0, vitest_1.it)("should count all when all running", function () {
            var items = [
                { running: true, name: "a" },
                { running: true, name: "b" },
                { running: true, name: "c" },
            ];
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.countRunning)(items)).toBe(3);
        });
    });
    (0, vitest_1.describe)("countMismatches", function () {
        (0, vitest_1.it)("should count image mismatches", function () {
            var items = [
                { imageMatch: true, name: "a" },
                { imageMatch: false, name: "b" },
                { imageMatch: true, name: "c" },
                { imageMatch: false, name: "d" },
                { imageMatch: false, name: "e" },
            ];
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.countMismatches)(items)).toBe(3);
        });
        (0, vitest_1.it)("should return 0 for empty array", function () {
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.countMismatches)([])).toBe(0);
        });
        (0, vitest_1.it)("should return 0 when all match", function () {
            var items = [
                { imageMatch: true, name: "a" },
                { imageMatch: true, name: "b" },
            ];
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.countMismatches)(items)).toBe(0);
        });
        (0, vitest_1.it)("should count all when none match", function () {
            var items = [
                { imageMatch: false, name: "a" },
                { imageMatch: false, name: "b" },
                { imageMatch: false, name: "c" },
            ];
            (0, vitest_1.expect)((0, sandbox_formatters_js_1.countMismatches)(items)).toBe(3);
        });
    });
});
