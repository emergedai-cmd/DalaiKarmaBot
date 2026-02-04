"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitorTwitchProvider = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var plugin_js_1 = require("./src/plugin.js");
var runtime_js_1 = require("./src/runtime.js");
var monitor_js_1 = require("./src/monitor.js");
Object.defineProperty(exports, "monitorTwitchProvider", { enumerable: true, get: function () { return monitor_js_1.monitorTwitchProvider; } });
var plugin = {
    id: "twitch",
    name: "Twitch",
    description: "Twitch channel plugin",
    configSchema: (0, plugin_sdk_1.emptyPluginConfigSchema)(),
    register: function (api) {
        (0, runtime_js_1.setTwitchRuntime)(api.runtime);
        // oxlint-disable-next-line typescript/no-explicit-any
        api.registerChannel({ plugin: plugin_js_1.twitchPlugin });
    },
};
exports.default = plugin;
