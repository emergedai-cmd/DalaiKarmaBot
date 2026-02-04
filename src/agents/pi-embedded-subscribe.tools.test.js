"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var channel_js_1 = require("../../extensions/telegram/src/channel.js");
var runtime_js_1 = require("../plugins/runtime.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var pi_embedded_subscribe_tools_js_1 = require("./pi-embedded-subscribe.tools.js");
(0, vitest_1.describe)("extractMessagingToolSend", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([{ pluginId: "telegram", plugin: channel_js_1.telegramPlugin, source: "test" }]));
    });
    (0, vitest_1.it)("uses channel as provider for message tool", function () {
        var result = (0, pi_embedded_subscribe_tools_js_1.extractMessagingToolSend)("message", {
            action: "send",
            channel: "telegram",
            to: "123",
        });
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.tool).toBe("message");
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.provider).toBe("telegram");
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.to).toBe("telegram:123");
    });
    (0, vitest_1.it)("prefers provider when both provider and channel are set", function () {
        var result = (0, pi_embedded_subscribe_tools_js_1.extractMessagingToolSend)("message", {
            action: "send",
            provider: "slack",
            channel: "telegram",
            to: "channel:C1",
        });
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.tool).toBe("message");
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.provider).toBe("slack");
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.to).toBe("channel:c1");
    });
});
