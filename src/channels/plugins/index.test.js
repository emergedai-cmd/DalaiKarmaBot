"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var runtime_js_1 = require("../../plugins/runtime.js");
var channel_plugins_js_1 = require("../../test-utils/channel-plugins.js");
var index_js_1 = require("./index.js");
(0, vitest_1.describe)("channel plugin registry", function () {
    var emptyRegistry = (0, channel_plugins_js_1.createTestRegistry)([]);
    var createPlugin = function (id) { return ({
        id: id,
        meta: {
            id: id,
            label: id,
            selectionLabel: id,
            docsPath: "/channels/".concat(id),
            blurb: "test",
        },
        capabilities: { chatTypes: ["direct"] },
        config: {
            listAccountIds: function () { return []; },
            resolveAccount: function () { return ({}); },
        },
    }); };
    (0, vitest_1.beforeEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)(emptyRegistry);
    });
    (0, vitest_1.afterEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)(emptyRegistry);
    });
    (0, vitest_1.it)("sorts channel plugins by configured order", function () {
        var registry = (0, channel_plugins_js_1.createTestRegistry)(["slack", "telegram", "signal"].map(function (id) { return ({
            pluginId: id,
            plugin: createPlugin(id),
            source: "test",
        }); }));
        (0, runtime_js_1.setActivePluginRegistry)(registry);
        var pluginIds = (0, index_js_1.listChannelPlugins)().map(function (plugin) { return plugin.id; });
        (0, vitest_1.expect)(pluginIds).toEqual(["telegram", "slack", "signal"]);
    });
});
