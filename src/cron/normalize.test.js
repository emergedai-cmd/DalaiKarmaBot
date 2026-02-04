"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var normalize_js_1 = require("./normalize.js");
(0, vitest_1.describe)("normalizeCronJobCreate", function () {
    (0, vitest_1.it)("maps legacy payload.provider to payload.channel and strips provider", function () {
        var normalized = (0, normalize_js_1.normalizeCronJobCreate)({
            name: "legacy",
            enabled: true,
            schedule: { kind: "cron", expr: "* * * * *" },
            sessionTarget: "isolated",
            wakeMode: "now",
            payload: {
                kind: "agentTurn",
                message: "hi",
                deliver: true,
                provider: " TeLeGrAm ",
                to: "7200373102",
            },
        });
        var payload = normalized.payload;
        (0, vitest_1.expect)(payload.channel).toBe("telegram");
        (0, vitest_1.expect)("provider" in payload).toBe(false);
    });
    (0, vitest_1.it)("trims agentId and drops null", function () {
        var normalized = (0, normalize_js_1.normalizeCronJobCreate)({
            name: "agent-set",
            enabled: true,
            schedule: { kind: "cron", expr: "* * * * *" },
            sessionTarget: "isolated",
            wakeMode: "now",
            agentId: " Ops ",
            payload: {
                kind: "agentTurn",
                message: "hi",
            },
        });
        (0, vitest_1.expect)(normalized.agentId).toBe("ops");
        var cleared = (0, normalize_js_1.normalizeCronJobCreate)({
            name: "agent-clear",
            enabled: true,
            schedule: { kind: "cron", expr: "* * * * *" },
            sessionTarget: "isolated",
            wakeMode: "now",
            agentId: null,
            payload: {
                kind: "agentTurn",
                message: "hi",
            },
        });
        (0, vitest_1.expect)(cleared.agentId).toBeNull();
    });
    (0, vitest_1.it)("canonicalizes payload.channel casing", function () {
        var normalized = (0, normalize_js_1.normalizeCronJobCreate)({
            name: "legacy provider",
            enabled: true,
            schedule: { kind: "cron", expr: "* * * * *" },
            sessionTarget: "isolated",
            wakeMode: "now",
            payload: {
                kind: "agentTurn",
                message: "hi",
                deliver: true,
                channel: "Telegram",
                to: "7200373102",
            },
        });
        var payload = normalized.payload;
        (0, vitest_1.expect)(payload.channel).toBe("telegram");
    });
    (0, vitest_1.it)("coerces ISO schedule.at to atMs (UTC)", function () {
        var normalized = (0, normalize_js_1.normalizeCronJobCreate)({
            name: "iso at",
            enabled: true,
            schedule: { at: "2026-01-12T18:00:00" },
            sessionTarget: "main",
            wakeMode: "next-heartbeat",
            payload: {
                kind: "systemEvent",
                text: "hi",
            },
        });
        var schedule = normalized.schedule;
        (0, vitest_1.expect)(schedule.kind).toBe("at");
        (0, vitest_1.expect)(schedule.atMs).toBe(Date.parse("2026-01-12T18:00:00Z"));
    });
    (0, vitest_1.it)("coerces ISO schedule.atMs string to atMs (UTC)", function () {
        var normalized = (0, normalize_js_1.normalizeCronJobCreate)({
            name: "iso atMs",
            enabled: true,
            schedule: { kind: "at", atMs: "2026-01-12T18:00:00" },
            sessionTarget: "main",
            wakeMode: "next-heartbeat",
            payload: {
                kind: "systemEvent",
                text: "hi",
            },
        });
        var schedule = normalized.schedule;
        (0, vitest_1.expect)(schedule.kind).toBe("at");
        (0, vitest_1.expect)(schedule.atMs).toBe(Date.parse("2026-01-12T18:00:00Z"));
    });
});
