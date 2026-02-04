"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var channel_js_1 = require("./src/channel.js");
var runtime_js_1 = require("./src/runtime.js");
var plugin = {
    id: "matrix",
    name: "Matrix",
    description: "Matrix channel plugin (matrix-js-sdk)",
    configSchema: (0, plugin_sdk_1.emptyPluginConfigSchema)(),
    register: function (api) {
        (0, runtime_js_1.setMatrixRuntime)(api.runtime);
        api.registerChannel({ plugin: channel_js_1.matrixPlugin });
    },
};
exports.default = plugin;
