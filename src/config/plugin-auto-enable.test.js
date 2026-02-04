"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var plugin_auto_enable_js_1 = require("./plugin-auto-enable.js");
(0, vitest_1.describe)("applyPluginAutoEnable", function () {
    (0, vitest_1.it)("enables configured channel plugins and updates allowlist", function () {
        var _a, _b, _c, _d;
        var result = (0, plugin_auto_enable_js_1.applyPluginAutoEnable)({
            config: {
                channels: { slack: { botToken: "x" } },
                plugins: { allow: ["telegram"] },
            },
            env: {},
        });
        (0, vitest_1.expect)((_c = (_b = (_a = result.config.plugins) === null || _a === void 0 ? void 0 : _a.entries) === null || _b === void 0 ? void 0 : _b.slack) === null || _c === void 0 ? void 0 : _c.enabled).toBe(true);
        (0, vitest_1.expect)((_d = result.config.plugins) === null || _d === void 0 ? void 0 : _d.allow).toEqual(["telegram", "slack"]);
        (0, vitest_1.expect)(result.changes.join("\n")).toContain("Slack configured, not enabled yet.");
    });
    (0, vitest_1.it)("respects explicit disable", function () {
        var _a, _b, _c;
        var result = (0, plugin_auto_enable_js_1.applyPluginAutoEnable)({
            config: {
                channels: { slack: { botToken: "x" } },
                plugins: { entries: { slack: { enabled: false } } },
            },
            env: {},
        });
        (0, vitest_1.expect)((_c = (_b = (_a = result.config.plugins) === null || _a === void 0 ? void 0 : _a.entries) === null || _b === void 0 ? void 0 : _b.slack) === null || _c === void 0 ? void 0 : _c.enabled).toBe(false);
        (0, vitest_1.expect)(result.changes).toEqual([]);
    });
    (0, vitest_1.it)("enables provider auth plugins when profiles exist", function () {
        var _a, _b, _c;
        var result = (0, plugin_auto_enable_js_1.applyPluginAutoEnable)({
            config: {
                auth: {
                    profiles: {
                        "google-antigravity:default": {
                            provider: "google-antigravity",
                            mode: "oauth",
                        },
                    },
                },
            },
            env: {},
        });
        (0, vitest_1.expect)((_c = (_b = (_a = result.config.plugins) === null || _a === void 0 ? void 0 : _a.entries) === null || _b === void 0 ? void 0 : _b["google-antigravity-auth"]) === null || _c === void 0 ? void 0 : _c.enabled).toBe(true);
    });
    (0, vitest_1.it)("skips when plugins are globally disabled", function () {
        var _a, _b, _c;
        var result = (0, plugin_auto_enable_js_1.applyPluginAutoEnable)({
            config: {
                channels: { slack: { botToken: "x" } },
                plugins: { enabled: false },
            },
            env: {},
        });
        (0, vitest_1.expect)((_c = (_b = (_a = result.config.plugins) === null || _a === void 0 ? void 0 : _a.entries) === null || _b === void 0 ? void 0 : _b.slack) === null || _c === void 0 ? void 0 : _c.enabled).toBeUndefined();
        (0, vitest_1.expect)(result.changes).toEqual([]);
    });
    (0, vitest_1.describe)("preferOver channel prioritization", function () {
        (0, vitest_1.it)("prefers bluebubbles: skips imessage auto-enable when both are configured", function () {
            var _a, _b, _c, _d, _e, _f;
            var result = (0, plugin_auto_enable_js_1.applyPluginAutoEnable)({
                config: {
                    channels: {
                        bluebubbles: { serverUrl: "http://localhost:1234", password: "x" },
                        imessage: { cliPath: "/usr/local/bin/imsg" },
                    },
                },
                env: {},
            });
            (0, vitest_1.expect)((_c = (_b = (_a = result.config.plugins) === null || _a === void 0 ? void 0 : _a.entries) === null || _b === void 0 ? void 0 : _b.bluebubbles) === null || _c === void 0 ? void 0 : _c.enabled).toBe(true);
            (0, vitest_1.expect)((_f = (_e = (_d = result.config.plugins) === null || _d === void 0 ? void 0 : _d.entries) === null || _e === void 0 ? void 0 : _e.imessage) === null || _f === void 0 ? void 0 : _f.enabled).toBeUndefined();
            (0, vitest_1.expect)(result.changes.join("\n")).toContain("bluebubbles configured, not enabled yet.");
            (0, vitest_1.expect)(result.changes.join("\n")).not.toContain("iMessage configured, not enabled yet.");
        });
        (0, vitest_1.it)("keeps imessage enabled if already explicitly enabled (non-destructive)", function () {
            var _a, _b, _c, _d, _e, _f;
            var result = (0, plugin_auto_enable_js_1.applyPluginAutoEnable)({
                config: {
                    channels: {
                        bluebubbles: { serverUrl: "http://localhost:1234", password: "x" },
                        imessage: { cliPath: "/usr/local/bin/imsg" },
                    },
                    plugins: { entries: { imessage: { enabled: true } } },
                },
                env: {},
            });
            (0, vitest_1.expect)((_c = (_b = (_a = result.config.plugins) === null || _a === void 0 ? void 0 : _a.entries) === null || _b === void 0 ? void 0 : _b.bluebubbles) === null || _c === void 0 ? void 0 : _c.enabled).toBe(true);
            (0, vitest_1.expect)((_f = (_e = (_d = result.config.plugins) === null || _d === void 0 ? void 0 : _d.entries) === null || _e === void 0 ? void 0 : _e.imessage) === null || _f === void 0 ? void 0 : _f.enabled).toBe(true);
        });
        (0, vitest_1.it)("allows imessage auto-enable when bluebubbles is explicitly disabled", function () {
            var _a, _b, _c, _d, _e, _f;
            var result = (0, plugin_auto_enable_js_1.applyPluginAutoEnable)({
                config: {
                    channels: {
                        bluebubbles: { serverUrl: "http://localhost:1234", password: "x" },
                        imessage: { cliPath: "/usr/local/bin/imsg" },
                    },
                    plugins: { entries: { bluebubbles: { enabled: false } } },
                },
                env: {},
            });
            (0, vitest_1.expect)((_c = (_b = (_a = result.config.plugins) === null || _a === void 0 ? void 0 : _a.entries) === null || _b === void 0 ? void 0 : _b.bluebubbles) === null || _c === void 0 ? void 0 : _c.enabled).toBe(false);
            (0, vitest_1.expect)((_f = (_e = (_d = result.config.plugins) === null || _d === void 0 ? void 0 : _d.entries) === null || _e === void 0 ? void 0 : _e.imessage) === null || _f === void 0 ? void 0 : _f.enabled).toBe(true);
            (0, vitest_1.expect)(result.changes.join("\n")).toContain("iMessage configured, not enabled yet.");
        });
        (0, vitest_1.it)("allows imessage auto-enable when bluebubbles is in deny list", function () {
            var _a, _b, _c, _d, _e, _f;
            var result = (0, plugin_auto_enable_js_1.applyPluginAutoEnable)({
                config: {
                    channels: {
                        bluebubbles: { serverUrl: "http://localhost:1234", password: "x" },
                        imessage: { cliPath: "/usr/local/bin/imsg" },
                    },
                    plugins: { deny: ["bluebubbles"] },
                },
                env: {},
            });
            (0, vitest_1.expect)((_c = (_b = (_a = result.config.plugins) === null || _a === void 0 ? void 0 : _a.entries) === null || _b === void 0 ? void 0 : _b.bluebubbles) === null || _c === void 0 ? void 0 : _c.enabled).toBeUndefined();
            (0, vitest_1.expect)((_f = (_e = (_d = result.config.plugins) === null || _d === void 0 ? void 0 : _d.entries) === null || _e === void 0 ? void 0 : _e.imessage) === null || _f === void 0 ? void 0 : _f.enabled).toBe(true);
        });
        (0, vitest_1.it)("enables imessage normally when only imessage is configured", function () {
            var _a, _b, _c;
            var result = (0, plugin_auto_enable_js_1.applyPluginAutoEnable)({
                config: {
                    channels: { imessage: { cliPath: "/usr/local/bin/imsg" } },
                },
                env: {},
            });
            (0, vitest_1.expect)((_c = (_b = (_a = result.config.plugins) === null || _a === void 0 ? void 0 : _a.entries) === null || _b === void 0 ? void 0 : _b.imessage) === null || _c === void 0 ? void 0 : _c.enabled).toBe(true);
            (0, vitest_1.expect)(result.changes.join("\n")).toContain("iMessage configured, not enabled yet.");
        });
    });
});
