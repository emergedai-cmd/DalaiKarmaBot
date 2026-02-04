"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var channel_js_1 = require("./src/channel.js");
var monitor_js_1 = require("./src/monitor.js");
var runtime_js_1 = require("./src/runtime.js");
var plugin = {
    id: "bluebubbles",
    name: "BlueBubbles",
    description: "BlueBubbles channel plugin (macOS app)",
    configSchema: (0, plugin_sdk_1.emptyPluginConfigSchema)(),
    register: function (api) {
        (0, runtime_js_1.setBlueBubblesRuntime)(api.runtime);
        api.registerChannel({ plugin: channel_js_1.bluebubblesPlugin });
        api.registerHttpHandler(monitor_js_1.handleBlueBubblesWebhookRequest);
    },
};
exports.default = plugin;
