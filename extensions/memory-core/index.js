"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var memoryCorePlugin = {
    id: "memory-core",
    name: "Memory (Core)",
    description: "File-backed memory search tools and CLI",
    kind: "memory",
    configSchema: (0, plugin_sdk_1.emptyPluginConfigSchema)(),
    register: function (api) {
        api.registerTool(function (ctx) {
            var memorySearchTool = api.runtime.tools.createMemorySearchTool({
                config: ctx.config,
                agentSessionKey: ctx.sessionKey,
            });
            var memoryGetTool = api.runtime.tools.createMemoryGetTool({
                config: ctx.config,
                agentSessionKey: ctx.sessionKey,
            });
            if (!memorySearchTool || !memoryGetTool) {
                return null;
            }
            return [memorySearchTool, memoryGetTool];
        }, { names: ["memory_search", "memory_get"] });
        api.registerCli(function (_a) {
            var program = _a.program;
            api.runtime.tools.registerMemoryCli(program);
        }, { commands: ["memory"] });
    },
};
exports.default = memoryCorePlugin;
