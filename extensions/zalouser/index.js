"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var channel_js_1 = require("./src/channel.js");
var runtime_js_1 = require("./src/runtime.js");
var tool_js_1 = require("./src/tool.js");
var plugin = {
    id: "zalouser",
    name: "Zalo Personal",
    description: "Zalo personal account messaging via zca-cli",
    configSchema: (0, plugin_sdk_1.emptyPluginConfigSchema)(),
    register: function (api) {
        (0, runtime_js_1.setZalouserRuntime)(api.runtime);
        // Register channel plugin (for onboarding & gateway)
        api.registerChannel({ plugin: channel_js_1.zalouserPlugin, dock: channel_js_1.zalouserDock });
        // Register agent tool
        api.registerTool({
            name: "zalouser",
            label: "Zalo Personal",
            description: "Send messages and access data via Zalo personal account. " +
                "Actions: send (text message), image (send image URL), link (send link), " +
                "friends (list/search friends), groups (list groups), me (profile info), status (auth check).",
            parameters: tool_js_1.ZalouserToolSchema,
            execute: tool_js_1.executeZalouserTool,
        });
    },
};
exports.default = plugin;
