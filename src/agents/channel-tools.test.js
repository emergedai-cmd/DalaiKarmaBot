"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var runtime_js_1 = require("../plugins/runtime.js");
var runtime_js_2 = require("../runtime.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var channel_tools_js_1 = require("./channel-tools.js");
(0, vitest_1.describe)("channel tools", function () {
    var errorSpy = vitest_1.vi.spyOn(runtime_js_2.defaultRuntime, "error").mockImplementation(function () { return undefined; });
    (0, vitest_1.beforeEach)(function () {
        var plugin = {
            id: "test",
            meta: {
                id: "test",
                label: "Test",
                selectionLabel: "Test",
                docsPath: "/channels/test",
                blurb: "test plugin",
            },
            capabilities: { chatTypes: ["direct"] },
            config: {
                listAccountIds: function () { return []; },
                resolveAccount: function () { return ({}); },
            },
            actions: {
                listActions: function () {
                    throw new Error("boom");
                },
            },
        };
        channel_tools_js_1.__testing.resetLoggedListActionErrors();
        errorSpy.mockClear();
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([{ pluginId: "test", source: "test", plugin: plugin }]));
    });
    (0, vitest_1.afterEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([]));
        errorSpy.mockClear();
    });
    (0, vitest_1.it)("skips crashing plugins and logs once", function () {
        var cfg = {};
        (0, vitest_1.expect)((0, channel_tools_js_1.listAllChannelSupportedActions)({ cfg: cfg })).toEqual([]);
        (0, vitest_1.expect)(errorSpy).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)((0, channel_tools_js_1.listAllChannelSupportedActions)({ cfg: cfg })).toEqual([]);
        (0, vitest_1.expect)(errorSpy).toHaveBeenCalledTimes(1);
    });
});
