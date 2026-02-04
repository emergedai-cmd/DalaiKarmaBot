"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensurePluginRegistryLoaded = ensurePluginRegistryLoaded;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var config_js_1 = require("../config/config.js");
var logging_js_1 = require("../logging.js");
var loader_js_1 = require("../plugins/loader.js");
var log = (0, logging_js_1.createSubsystemLogger)("plugins");
var pluginRegistryLoaded = false;
function ensurePluginRegistryLoaded() {
    if (pluginRegistryLoaded) {
        return;
    }
    var config = (0, config_js_1.loadConfig)();
    var workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(config, (0, agent_scope_js_1.resolveDefaultAgentId)(config));
    var logger = {
        info: function (msg) { return log.info(msg); },
        warn: function (msg) { return log.warn(msg); },
        error: function (msg) { return log.error(msg); },
        debug: function (msg) { return log.debug(msg); },
    };
    (0, loader_js_1.loadOpenClawPlugins)({
        config: config,
        workspaceDir: workspaceDir,
        logger: logger,
    });
    pluginRegistryLoaded = true;
}
