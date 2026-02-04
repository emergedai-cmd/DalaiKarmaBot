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
var lit_1 = require("lit");
var vitest_1 = require("vitest");
var app_defaults_1 = require("../app-defaults");
var cron_1 = require("./cron");
function createJob(id) {
    return {
        id: id,
        name: "Daily ping",
        enabled: true,
        createdAtMs: 0,
        updatedAtMs: 0,
        schedule: { kind: "cron", expr: "0 9 * * *" },
        sessionTarget: "main",
        wakeMode: "next-heartbeat",
        payload: { kind: "systemEvent", text: "ping" },
    };
}
function createProps(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ loading: false, status: null, jobs: [], error: null, busy: false, form: __assign({}, app_defaults_1.DEFAULT_CRON_FORM), channels: [], channelLabels: {}, runsJobId: null, runs: [], onFormChange: function () { return undefined; }, onRefresh: function () { return undefined; }, onAdd: function () { return undefined; }, onToggle: function () { return undefined; }, onRun: function () { return undefined; }, onRemove: function () { return undefined; }, onLoadRuns: function () { return undefined; } }, overrides);
}
(0, vitest_1.describe)("cron view", function () {
    (0, vitest_1.it)("prompts to select a job before showing run history", function () {
        var container = document.createElement("div");
        (0, lit_1.render)((0, cron_1.renderCron)(createProps()), container);
        (0, vitest_1.expect)(container.textContent).toContain("Select a job to inspect run history.");
    });
    (0, vitest_1.it)("loads run history when clicking a job row", function () {
        var container = document.createElement("div");
        var onLoadRuns = vitest_1.vi.fn();
        var job = createJob("job-1");
        (0, lit_1.render)((0, cron_1.renderCron)(createProps({
            jobs: [job],
            onLoadRuns: onLoadRuns,
        })), container);
        var row = container.querySelector(".list-item-clickable");
        (0, vitest_1.expect)(row).not.toBeNull();
        row === null || row === void 0 ? void 0 : row.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        (0, vitest_1.expect)(onLoadRuns).toHaveBeenCalledWith("job-1");
    });
    (0, vitest_1.it)("marks the selected job and keeps Runs button to a single call", function () {
        var container = document.createElement("div");
        var onLoadRuns = vitest_1.vi.fn();
        var job = createJob("job-1");
        (0, lit_1.render)((0, cron_1.renderCron)(createProps({
            jobs: [job],
            runsJobId: "job-1",
            onLoadRuns: onLoadRuns,
        })), container);
        var selected = container.querySelector(".list-item-selected");
        (0, vitest_1.expect)(selected).not.toBeNull();
        var runsButton = Array.from(container.querySelectorAll("button")).find(function (btn) { var _a; return ((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "Runs"; });
        (0, vitest_1.expect)(runsButton).not.toBeUndefined();
        runsButton === null || runsButton === void 0 ? void 0 : runsButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        (0, vitest_1.expect)(onLoadRuns).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(onLoadRuns).toHaveBeenCalledWith("job-1");
    });
});
