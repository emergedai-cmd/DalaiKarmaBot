"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var parse_duration_js_1 = require("./parse-duration.js");
(0, vitest_1.describe)("parseDurationMs", function () {
    (0, vitest_1.it)("parses bare ms", function () {
        (0, vitest_1.expect)((0, parse_duration_js_1.parseDurationMs)("10000")).toBe(10000);
    });
    (0, vitest_1.it)("parses seconds suffix", function () {
        (0, vitest_1.expect)((0, parse_duration_js_1.parseDurationMs)("10s")).toBe(10000);
    });
    (0, vitest_1.it)("parses minutes suffix", function () {
        (0, vitest_1.expect)((0, parse_duration_js_1.parseDurationMs)("1m")).toBe(60000);
    });
    (0, vitest_1.it)("parses hours suffix", function () {
        (0, vitest_1.expect)((0, parse_duration_js_1.parseDurationMs)("2h")).toBe(7200000);
    });
    (0, vitest_1.it)("parses days suffix", function () {
        (0, vitest_1.expect)((0, parse_duration_js_1.parseDurationMs)("2d")).toBe(172800000);
    });
    (0, vitest_1.it)("supports decimals", function () {
        (0, vitest_1.expect)((0, parse_duration_js_1.parseDurationMs)("0.5s")).toBe(500);
    });
});
