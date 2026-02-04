"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var channel_js_1 = require("./src/channel.js");
var runtime_js_1 = require("./src/runtime.js");
var plugin = {
    id: "nextcloud-talk",
    name: "Nextcloud Talk",
    description: "Nextcloud Talk channel plugin",
    configSchema: (0, plugin_sdk_1.emptyPluginConfigSchema)(),
    register: function (api) {
        (0, runtime_js_1.setNextcloudTalkRuntime)(api.runtime);
        api.registerChannel({ plugin: channel_js_1.nextcloudTalkPlugin });
    },
};
exports.default = plugin;
