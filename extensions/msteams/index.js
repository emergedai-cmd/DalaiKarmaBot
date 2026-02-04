"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var channel_js_1 = require("./src/channel.js");
var runtime_js_1 = require("./src/runtime.js");
var plugin = {
    id: "msteams",
    name: "Microsoft Teams",
    description: "Microsoft Teams channel plugin (Bot Framework)",
    configSchema: (0, plugin_sdk_1.emptyPluginConfigSchema)(),
    register: function (api) {
        (0, runtime_js_1.setMSTeamsRuntime)(api.runtime);
        api.registerChannel({ plugin: channel_js_1.msteamsPlugin });
    },
};
exports.default = plugin;
