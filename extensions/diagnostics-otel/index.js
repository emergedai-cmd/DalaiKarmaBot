"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var service_js_1 = require("./src/service.js");
var plugin = {
    id: "diagnostics-otel",
    name: "Diagnostics OpenTelemetry",
    description: "Export diagnostics events to OpenTelemetry",
    configSchema: (0, plugin_sdk_1.emptyPluginConfigSchema)(),
    register: function (api) {
        api.registerService((0, service_js_1.createDiagnosticsOtelService)());
    },
};
exports.default = plugin;
