"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var runtime_js_1 = require("../plugins/runtime.js");
var message_channel_js_1 = require("./message-channel.js");
var createRegistry = function (channels) { return ({
    plugins: [],
    tools: [],
    channels: channels,
    providers: [],
    gatewayHandlers: {},
    httpHandlers: [],
    httpRoutes: [],
    cliRegistrars: [],
    services: [],
    diagnostics: [],
}); };
var emptyRegistry = createRegistry([]);
var msteamsPlugin = {
    id: "msteams",
    meta: {
        id: "msteams",
        label: "Microsoft Teams",
        selectionLabel: "Microsoft Teams (Bot Framework)",
        docsPath: "/channels/msteams",
        blurb: "Bot Framework; enterprise support.",
        aliases: ["teams"],
    },
    capabilities: { chatTypes: ["direct"] },
    config: {
        listAccountIds: function () { return []; },
        resolveAccount: function () { return ({}); },
    },
};
(0, vitest_1.describe)("message-channel", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)(emptyRegistry);
    });
    (0, vitest_1.afterEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)(emptyRegistry);
    });
    (0, vitest_1.it)("normalizes gateway message channels and rejects unknown values", function () {
        (0, vitest_1.expect)((0, message_channel_js_1.resolveGatewayMessageChannel)("discord")).toBe("discord");
        (0, vitest_1.expect)((0, message_channel_js_1.resolveGatewayMessageChannel)(" imsg ")).toBe("imessage");
        (0, vitest_1.expect)((0, message_channel_js_1.resolveGatewayMessageChannel)("web")).toBeUndefined();
        (0, vitest_1.expect)((0, message_channel_js_1.resolveGatewayMessageChannel)("nope")).toBeUndefined();
    });
    (0, vitest_1.it)("normalizes plugin aliases when registered", function () {
        (0, runtime_js_1.setActivePluginRegistry)(createRegistry([{ pluginId: "msteams", plugin: msteamsPlugin, source: "test" }]));
        (0, vitest_1.expect)((0, message_channel_js_1.resolveGatewayMessageChannel)("teams")).toBe("msteams");
    });
});
