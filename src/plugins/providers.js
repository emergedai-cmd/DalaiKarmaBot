"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePluginProviders = resolvePluginProviders;
var subsystem_js_1 = require("../logging/subsystem.js");
var loader_js_1 = require("./loader.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("plugins");
function resolvePluginProviders(params) {
    var registry = (0, loader_js_1.loadOpenClawPlugins)({
        config: params.config,
        workspaceDir: params.workspaceDir,
        logger: {
            info: function (msg) { return log.info(msg); },
            warn: function (msg) { return log.warn(msg); },
            error: function (msg) { return log.error(msg); },
            debug: function (msg) { return log.debug(msg); },
        },
    });
    return registry.providers.map(function (entry) { return entry.provider; });
}
