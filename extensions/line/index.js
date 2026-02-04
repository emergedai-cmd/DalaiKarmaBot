"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var card_command_js_1 = require("./src/card-command.js");
var channel_js_1 = require("./src/channel.js");
var runtime_js_1 = require("./src/runtime.js");
var plugin = {
    id: "line",
    name: "LINE",
    description: "LINE Messaging API channel plugin",
    configSchema: (0, plugin_sdk_1.emptyPluginConfigSchema)(),
    register: function (api) {
        (0, runtime_js_1.setLineRuntime)(api.runtime);
        api.registerChannel({ plugin: channel_js_1.linePlugin });
        (0, card_command_js_1.registerLineCardCommand)(api);
    },
};
exports.default = plugin;
