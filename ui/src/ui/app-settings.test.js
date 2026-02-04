"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var app_settings_1 = require("./app-settings");
var createHost = function (tab) { return ({
    settings: {
        gatewayUrl: "",
        token: "",
        sessionKey: "main",
        lastActiveSessionKey: "main",
        theme: "system",
        chatFocusMode: false,
        chatShowThinking: true,
        splitRatio: 0.6,
        navCollapsed: false,
        navGroupsCollapsed: {},
    },
    theme: "system",
    themeResolved: "dark",
    applySessionKey: "main",
    sessionKey: "main",
    tab: tab,
    connected: false,
    chatHasAutoScrolled: false,
    logsAtBottom: false,
    eventLog: [],
    eventLogBuffer: [],
    basePath: "",
    themeMedia: null,
    themeMediaHandler: null,
    logsPollInterval: null,
    debugPollInterval: null,
}); };
(0, vitest_1.describe)("setTabFromRoute", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.useFakeTimers();
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)("starts and stops log polling based on the tab", function () {
        var host = createHost("chat");
        (0, app_settings_1.setTabFromRoute)(host, "logs");
        (0, vitest_1.expect)(host.logsPollInterval).not.toBeNull();
        (0, vitest_1.expect)(host.debugPollInterval).toBeNull();
        (0, app_settings_1.setTabFromRoute)(host, "chat");
        (0, vitest_1.expect)(host.logsPollInterval).toBeNull();
    });
    (0, vitest_1.it)("starts and stops debug polling based on the tab", function () {
        var host = createHost("chat");
        (0, app_settings_1.setTabFromRoute)(host, "debug");
        (0, vitest_1.expect)(host.debugPollInterval).not.toBeNull();
        (0, vitest_1.expect)(host.logsPollInterval).toBeNull();
        (0, app_settings_1.setTabFromRoute)(host, "chat");
        (0, vitest_1.expect)(host.debugPollInterval).toBeNull();
    });
});
