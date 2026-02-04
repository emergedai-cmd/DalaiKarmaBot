"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var channel_js_1 = require("./src/channel.js");
var monitor_js_1 = require("./src/monitor.js");
var runtime_js_1 = require("./src/runtime.js");
var plugin = {
    id: "zalo",
    name: "Zalo",
    description: "Zalo channel plugin (Bot API)",
    configSchema: (0, plugin_sdk_1.emptyPluginConfigSchema)(),
    register: function (api) {
        (0, runtime_js_1.setZaloRuntime)(api.runtime);
        api.registerChannel({ plugin: channel_js_1.zaloPlugin, dock: channel_js_1.zaloDock });
        api.registerHttpHandler(monitor_js_1.handleZaloWebhookRequest);
    },
};
exports.default = plugin;
