"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var status_issues_js_1 = require("./status-issues.js");
(0, vitest_1.describe)("collectZalouserStatusIssues", function () {
    (0, vitest_1.it)("flags missing zca when configured is false", function () {
        var _a, _b;
        var issues = (0, status_issues_js_1.collectZalouserStatusIssues)([
            {
                accountId: "default",
                enabled: true,
                configured: false,
                lastError: "zca CLI not found in PATH",
            },
        ]);
        (0, vitest_1.expect)(issues).toHaveLength(1);
        (0, vitest_1.expect)((_a = issues[0]) === null || _a === void 0 ? void 0 : _a.kind).toBe("runtime");
        (0, vitest_1.expect)((_b = issues[0]) === null || _b === void 0 ? void 0 : _b.message).toMatch(/zca CLI not found/i);
    });
    (0, vitest_1.it)("flags missing auth when configured is false", function () {
        var _a, _b;
        var issues = (0, status_issues_js_1.collectZalouserStatusIssues)([
            {
                accountId: "default",
                enabled: true,
                configured: false,
                lastError: "not authenticated",
            },
        ]);
        (0, vitest_1.expect)(issues).toHaveLength(1);
        (0, vitest_1.expect)((_a = issues[0]) === null || _a === void 0 ? void 0 : _a.kind).toBe("auth");
        (0, vitest_1.expect)((_b = issues[0]) === null || _b === void 0 ? void 0 : _b.message).toMatch(/Not authenticated/i);
    });
    (0, vitest_1.it)("warns when dmPolicy is open", function () {
        var _a;
        var issues = (0, status_issues_js_1.collectZalouserStatusIssues)([
            {
                accountId: "default",
                enabled: true,
                configured: true,
                dmPolicy: "open",
            },
        ]);
        (0, vitest_1.expect)(issues).toHaveLength(1);
        (0, vitest_1.expect)((_a = issues[0]) === null || _a === void 0 ? void 0 : _a.kind).toBe("config");
    });
    (0, vitest_1.it)("skips disabled accounts", function () {
        var issues = (0, status_issues_js_1.collectZalouserStatusIssues)([
            {
                accountId: "default",
                enabled: false,
                configured: false,
                lastError: "zca CLI not found in PATH",
            },
        ]);
        (0, vitest_1.expect)(issues).toHaveLength(0);
    });
});
