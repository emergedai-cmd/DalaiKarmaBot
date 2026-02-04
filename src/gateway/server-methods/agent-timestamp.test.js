"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var envelope_js_1 = require("../../auto-reply/envelope.js");
var agent_timestamp_js_1 = require("./agent-timestamp.js");
(0, vitest_1.describe)("injectTimestamp", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.useFakeTimers();
        // Wednesday, January 28, 2026 at 8:30 PM EST (01:30 UTC Jan 29)
        vitest_1.vi.setSystemTime(new Date("2026-01-29T01:30:00.000Z"));
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)("prepends a compact timestamp matching formatZonedTimestamp", function () {
        var result = (0, agent_timestamp_js_1.injectTimestamp)("Is it the weekend?", {
            timezone: "America/New_York",
        });
        (0, vitest_1.expect)(result).toMatch(/^\[Wed 2026-01-28 20:30 EST\] Is it the weekend\?$/);
    });
    (0, vitest_1.it)("uses channel envelope format with DOW prefix", function () {
        var now = new Date();
        var expected = (0, envelope_js_1.formatZonedTimestamp)(now, "America/New_York");
        var result = (0, agent_timestamp_js_1.injectTimestamp)("hello", { timezone: "America/New_York" });
        // DOW prefix + formatZonedTimestamp format
        (0, vitest_1.expect)(result).toBe("[Wed ".concat(expected, "] hello"));
    });
    (0, vitest_1.it)("always uses 24-hour format", function () {
        var result = (0, agent_timestamp_js_1.injectTimestamp)("hello", { timezone: "America/New_York" });
        (0, vitest_1.expect)(result).toContain("20:30");
        (0, vitest_1.expect)(result).not.toContain("PM");
        (0, vitest_1.expect)(result).not.toContain("AM");
    });
    (0, vitest_1.it)("uses the configured timezone", function () {
        var result = (0, agent_timestamp_js_1.injectTimestamp)("hello", { timezone: "America/Chicago" });
        // 8:30 PM EST = 7:30 PM CST = 19:30
        (0, vitest_1.expect)(result).toMatch(/^\[Wed 2026-01-28 19:30 CST\]/);
    });
    (0, vitest_1.it)("defaults to UTC when no timezone specified", function () {
        var result = (0, agent_timestamp_js_1.injectTimestamp)("hello", {});
        // 2026-01-29T01:30:00Z
        (0, vitest_1.expect)(result).toMatch(/^\[Thu 2026-01-29 01:30/);
    });
    (0, vitest_1.it)("returns empty/whitespace messages unchanged", function () {
        (0, vitest_1.expect)((0, agent_timestamp_js_1.injectTimestamp)("", { timezone: "UTC" })).toBe("");
        (0, vitest_1.expect)((0, agent_timestamp_js_1.injectTimestamp)("   ", { timezone: "UTC" })).toBe("   ");
    });
    (0, vitest_1.it)("does NOT double-stamp messages with channel envelope timestamps", function () {
        var enveloped = "[Discord user1 2026-01-28 20:30 EST] hello there";
        var result = (0, agent_timestamp_js_1.injectTimestamp)(enveloped, { timezone: "America/New_York" });
        (0, vitest_1.expect)(result).toBe(enveloped);
    });
    (0, vitest_1.it)("does NOT double-stamp messages already injected by us", function () {
        var alreadyStamped = "[Wed 2026-01-28 20:30 EST] hello there";
        var result = (0, agent_timestamp_js_1.injectTimestamp)(alreadyStamped, { timezone: "America/New_York" });
        (0, vitest_1.expect)(result).toBe(alreadyStamped);
    });
    (0, vitest_1.it)("does NOT double-stamp messages with cron-injected timestamps", function () {
        var cronMessage = "[cron:abc123 my-job] do the thing\nCurrent time: Wednesday, January 28th, 2026 — 8:30 PM (America/New_York)";
        var result = (0, agent_timestamp_js_1.injectTimestamp)(cronMessage, { timezone: "America/New_York" });
        (0, vitest_1.expect)(result).toBe(cronMessage);
    });
    (0, vitest_1.it)("handles midnight correctly", function () {
        vitest_1.vi.setSystemTime(new Date("2026-02-01T05:00:00.000Z")); // midnight EST
        var result = (0, agent_timestamp_js_1.injectTimestamp)("hello", { timezone: "America/New_York" });
        (0, vitest_1.expect)(result).toMatch(/^\[Sun 2026-02-01 00:00 EST\]/);
    });
    (0, vitest_1.it)("handles date boundaries (just before midnight)", function () {
        vitest_1.vi.setSystemTime(new Date("2026-02-01T04:59:00.000Z")); // 23:59 Jan 31 EST
        var result = (0, agent_timestamp_js_1.injectTimestamp)("hello", { timezone: "America/New_York" });
        (0, vitest_1.expect)(result).toMatch(/^\[Sat 2026-01-31 23:59 EST\]/);
    });
    (0, vitest_1.it)("handles DST correctly (same UTC hour, different local time)", function () {
        // EST (winter): UTC-5 → 2026-01-15T05:00Z = midnight Jan 15
        vitest_1.vi.setSystemTime(new Date("2026-01-15T05:00:00.000Z"));
        var winter = (0, agent_timestamp_js_1.injectTimestamp)("winter", { timezone: "America/New_York" });
        (0, vitest_1.expect)(winter).toMatch(/^\[Thu 2026-01-15 00:00 EST\]/);
        // EDT (summer): UTC-4 → 2026-07-15T04:00Z = midnight Jul 15
        vitest_1.vi.setSystemTime(new Date("2026-07-15T04:00:00.000Z"));
        var summer = (0, agent_timestamp_js_1.injectTimestamp)("summer", { timezone: "America/New_York" });
        (0, vitest_1.expect)(summer).toMatch(/^\[Wed 2026-07-15 00:00 EDT\]/);
    });
    (0, vitest_1.it)("accepts a custom now date", function () {
        var customDate = new Date("2025-07-04T16:00:00.000Z"); // July 4, noon ET
        var result = (0, agent_timestamp_js_1.injectTimestamp)("fireworks?", {
            timezone: "America/New_York",
            now: customDate,
        });
        (0, vitest_1.expect)(result).toMatch(/^\[Fri 2025-07-04 12:00 EDT\]/);
    });
});
(0, vitest_1.describe)("timestampOptsFromConfig", function () {
    (0, vitest_1.it)("extracts timezone from config", function () {
        var opts = (0, agent_timestamp_js_1.timestampOptsFromConfig)({
            agents: {
                defaults: {
                    userTimezone: "America/Chicago",
                },
            },
            // oxlint-disable-next-line typescript/no-explicit-any
        });
        (0, vitest_1.expect)(opts.timezone).toBe("America/Chicago");
    });
    (0, vitest_1.it)("falls back gracefully with empty config", function () {
        // oxlint-disable-next-line typescript/no-explicit-any
        var opts = (0, agent_timestamp_js_1.timestampOptsFromConfig)({});
        (0, vitest_1.expect)(opts.timezone).toBeDefined(); // resolveUserTimezone provides a default
    });
});
