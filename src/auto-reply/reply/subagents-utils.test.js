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
var subagents_utils_js_1 = require("./subagents-utils.js");
var baseRun = {
    runId: "run-1",
    childSessionKey: "agent:main:subagent:abc",
    requesterSessionKey: "agent:main:main",
    requesterDisplayKey: "main",
    task: "do thing",
    cleanup: "keep",
    createdAt: 1000,
    startedAt: 1000,
};
(0, vitest_1.describe)("subagents utils", function () {
    (0, vitest_1.it)("resolves labels from label, task, or fallback", function () {
        (0, vitest_1.expect)((0, subagents_utils_js_1.resolveSubagentLabel)(__assign(__assign({}, baseRun), { label: "Label" }))).toBe("Label");
        (0, vitest_1.expect)((0, subagents_utils_js_1.resolveSubagentLabel)(__assign(__assign({}, baseRun), { label: " ", task: "Task" }))).toBe("Task");
        (0, vitest_1.expect)((0, subagents_utils_js_1.resolveSubagentLabel)(__assign(__assign({}, baseRun), { label: " ", task: " " }), "fallback")).toBe("fallback");
    });
    (0, vitest_1.it)("formats run labels with truncation", function () {
        var long = "x".repeat(100);
        var run = __assign(__assign({}, baseRun), { label: long });
        var formatted = (0, subagents_utils_js_1.formatRunLabel)(run, { maxLength: 10 });
        (0, vitest_1.expect)(formatted.startsWith("x".repeat(10))).toBe(true);
        (0, vitest_1.expect)(formatted.endsWith("…")).toBe(true);
    });
    (0, vitest_1.it)("sorts subagent runs by newest start/created time", function () {
        var runs = [
            __assign(__assign({}, baseRun), { runId: "run-1", createdAt: 1000, startedAt: 1000 }),
            __assign(__assign({}, baseRun), { runId: "run-2", createdAt: 1200, startedAt: 1200 }),
            __assign(__assign({}, baseRun), { runId: "run-3", createdAt: 900 }),
        ];
        var sorted = (0, subagents_utils_js_1.sortSubagentRuns)(runs);
        (0, vitest_1.expect)(sorted.map(function (run) { return run.runId; })).toEqual(["run-2", "run-1", "run-3"]);
    });
    (0, vitest_1.it)("formats run status from outcome and timestamps", function () {
        (0, vitest_1.expect)((0, subagents_utils_js_1.formatRunStatus)(__assign({}, baseRun))).toBe("running");
        (0, vitest_1.expect)((0, subagents_utils_js_1.formatRunStatus)(__assign(__assign({}, baseRun), { endedAt: 2000, outcome: { status: "ok" } }))).toBe("done");
        (0, vitest_1.expect)((0, subagents_utils_js_1.formatRunStatus)(__assign(__assign({}, baseRun), { endedAt: 2000, outcome: { status: "timeout" } }))).toBe("timeout");
    });
    (0, vitest_1.it)("formats duration short for seconds and minutes", function () {
        (0, vitest_1.expect)((0, subagents_utils_js_1.formatDurationShort)(45000)).toBe("45s");
        (0, vitest_1.expect)((0, subagents_utils_js_1.formatDurationShort)(65000)).toBe("1m5s");
    });
});
