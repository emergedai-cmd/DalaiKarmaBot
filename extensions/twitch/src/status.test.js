"use strict";
/**
 * Tests for status.ts module
 *
 * Tests cover:
 * - Detection of unconfigured accounts
 * - Detection of disabled accounts
 * - Detection of missing clientId
 * - Token format warnings
 * - Access control warnings
 * - Runtime error detection
 */
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var status_js_1 = require("./status.js");
(0, vitest_1.describe)("status", function () {
    (0, vitest_1.describe)("collectTwitchStatusIssues", function () {
        (0, vitest_1.it)("should detect unconfigured accounts", function () {
            var _a, _b;
            var snapshots = [
                {
                    accountId: "default",
                    configured: false,
                    enabled: true,
                    running: false,
                },
            ];
            var issues = (0, status_js_1.collectTwitchStatusIssues)(snapshots);
            (0, vitest_1.expect)(issues.length).toBeGreaterThan(0);
            (0, vitest_1.expect)((_a = issues[0]) === null || _a === void 0 ? void 0 : _a.kind).toBe("config");
            (0, vitest_1.expect)((_b = issues[0]) === null || _b === void 0 ? void 0 : _b.message).toContain("not properly configured");
        });
        (0, vitest_1.it)("should detect disabled accounts", function () {
            var snapshots = [
                {
                    accountId: "default",
                    configured: true,
                    enabled: false,
                    running: false,
                },
            ];
            var issues = (0, status_js_1.collectTwitchStatusIssues)(snapshots);
            (0, vitest_1.expect)(issues.length).toBeGreaterThan(0);
            var disabledIssue = issues.find(function (i) { return i.message.includes("disabled"); });
            (0, vitest_1.expect)(disabledIssue).toBeDefined();
        });
        (0, vitest_1.it)("should detect missing clientId when account configured (simplified config)", function () {
            var snapshots = [
                {
                    accountId: "default",
                    configured: true,
                    enabled: true,
                    running: false,
                },
            ];
            var mockCfg = {
                channels: {
                    twitch: {
                        username: "testbot",
                        accessToken: "oauth:test123",
                        // clientId missing
                    },
                },
            };
            var issues = (0, status_js_1.collectTwitchStatusIssues)(snapshots, function () { return mockCfg; });
            var clientIdIssue = issues.find(function (i) { return i.message.includes("client ID"); });
            (0, vitest_1.expect)(clientIdIssue).toBeDefined();
        });
        (0, vitest_1.it)("should warn about oauth: prefix in token (simplified config)", function () {
            var snapshots = [
                {
                    accountId: "default",
                    configured: true,
                    enabled: true,
                    running: false,
                },
            ];
            var mockCfg = {
                channels: {
                    twitch: {
                        username: "testbot",
                        accessToken: "oauth:test123", // has prefix
                        clientId: "test-id",
                    },
                },
            };
            var issues = (0, status_js_1.collectTwitchStatusIssues)(snapshots, function () { return mockCfg; });
            var prefixIssue = issues.find(function (i) { return i.message.includes("oauth:"); });
            (0, vitest_1.expect)(prefixIssue).toBeDefined();
            (0, vitest_1.expect)(prefixIssue === null || prefixIssue === void 0 ? void 0 : prefixIssue.kind).toBe("config");
        });
        (0, vitest_1.it)("should detect clientSecret without refreshToken (simplified config)", function () {
            var snapshots = [
                {
                    accountId: "default",
                    configured: true,
                    enabled: true,
                    running: false,
                },
            ];
            var mockCfg = {
                channels: {
                    twitch: {
                        username: "testbot",
                        accessToken: "oauth:test123",
                        clientId: "test-id",
                        clientSecret: "secret123",
                        // refreshToken missing
                    },
                },
            };
            var issues = (0, status_js_1.collectTwitchStatusIssues)(snapshots, function () { return mockCfg; });
            var secretIssue = issues.find(function (i) { return i.message.includes("clientSecret"); });
            (0, vitest_1.expect)(secretIssue).toBeDefined();
        });
        (0, vitest_1.it)("should detect empty allowFrom array (simplified config)", function () {
            var snapshots = [
                {
                    accountId: "default",
                    configured: true,
                    enabled: true,
                    running: false,
                },
            ];
            var mockCfg = {
                channels: {
                    twitch: {
                        username: "testbot",
                        accessToken: "test123",
                        clientId: "test-id",
                        allowFrom: [], // empty array
                    },
                },
            };
            var issues = (0, status_js_1.collectTwitchStatusIssues)(snapshots, function () { return mockCfg; });
            var allowFromIssue = issues.find(function (i) { return i.message.includes("allowFrom"); });
            (0, vitest_1.expect)(allowFromIssue).toBeDefined();
        });
        (0, vitest_1.it)("should detect allowedRoles 'all' with allowFrom conflict (simplified config)", function () {
            var snapshots = [
                {
                    accountId: "default",
                    configured: true,
                    enabled: true,
                    running: false,
                },
            ];
            var mockCfg = {
                channels: {
                    twitch: {
                        username: "testbot",
                        accessToken: "test123",
                        clientId: "test-id",
                        allowedRoles: ["all"],
                        allowFrom: ["123456"], // conflict!
                    },
                },
            };
            var issues = (0, status_js_1.collectTwitchStatusIssues)(snapshots, function () { return mockCfg; });
            var conflictIssue = issues.find(function (i) { return i.kind === "intent"; });
            (0, vitest_1.expect)(conflictIssue).toBeDefined();
            (0, vitest_1.expect)(conflictIssue === null || conflictIssue === void 0 ? void 0 : conflictIssue.message).toContain("allowedRoles is set to 'all'");
        });
        (0, vitest_1.it)("should detect runtime errors", function () {
            var snapshots = [
                {
                    accountId: "default",
                    configured: true,
                    enabled: true,
                    running: false,
                    lastError: "Connection timeout",
                },
            ];
            var issues = (0, status_js_1.collectTwitchStatusIssues)(snapshots);
            var runtimeIssue = issues.find(function (i) { return i.kind === "runtime"; });
            (0, vitest_1.expect)(runtimeIssue).toBeDefined();
            (0, vitest_1.expect)(runtimeIssue === null || runtimeIssue === void 0 ? void 0 : runtimeIssue.message).toContain("Connection timeout");
        });
        (0, vitest_1.it)("should detect accounts that never connected", function () {
            var snapshots = [
                {
                    accountId: "default",
                    configured: true,
                    enabled: true,
                    running: false,
                    lastStartAt: undefined,
                    lastInboundAt: undefined,
                    lastOutboundAt: undefined,
                },
            ];
            var issues = (0, status_js_1.collectTwitchStatusIssues)(snapshots);
            var neverConnectedIssue = issues.find(function (i) {
                return i.message.includes("never connected successfully");
            });
            (0, vitest_1.expect)(neverConnectedIssue).toBeDefined();
        });
        (0, vitest_1.it)("should detect long-running connections", function () {
            var oldDate = Date.now() - 8 * 24 * 60 * 60 * 1000; // 8 days ago
            var snapshots = [
                {
                    accountId: "default",
                    configured: true,
                    enabled: true,
                    running: true,
                    lastStartAt: oldDate,
                },
            ];
            var issues = (0, status_js_1.collectTwitchStatusIssues)(snapshots);
            var uptimeIssue = issues.find(function (i) { return i.message.includes("running for"); });
            (0, vitest_1.expect)(uptimeIssue).toBeDefined();
        });
        (0, vitest_1.it)("should handle empty snapshots array", function () {
            var issues = (0, status_js_1.collectTwitchStatusIssues)([]);
            (0, vitest_1.expect)(issues).toEqual([]);
        });
        (0, vitest_1.it)("should skip non-Twitch accounts gracefully", function () {
            var snapshots = [
                {
                    accountId: undefined,
                    configured: false,
                    enabled: true,
                    running: false,
                },
            ];
            var issues = (0, status_js_1.collectTwitchStatusIssues)(snapshots);
            // Should not crash, may return empty or minimal issues
            (0, vitest_1.expect)(Array.isArray(issues)).toBe(true);
        });
    });
});
