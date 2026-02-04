"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPluginCliCommands = registerPluginCliCommands;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var config_js_1 = require("../config/config.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var loader_js_1 = require("./loader.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("plugins");
function registerPluginCliCommands(program, cfg) {
    var config = cfg !== null && cfg !== void 0 ? cfg : (0, config_js_1.loadConfig)();
    var workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(config, (0, agent_scope_js_1.resolveDefaultAgentId)(config));
    var logger = {
        info: function (msg) { return log.info(msg); },
        warn: function (msg) { return log.warn(msg); },
        error: function (msg) { return log.error(msg); },
        debug: function (msg) { return log.debug(msg); },
    };
    var registry = (0, loader_js_1.loadOpenClawPlugins)({
        config: config,
        workspaceDir: workspaceDir,
        logger: logger,
    });
    var existingCommands = new Set(program.commands.map(function (cmd) { return cmd.name(); }));
    var _loop_1 = function (entry) {
        if (entry.commands.length > 0) {
            var overlaps = entry.commands.filter(function (command) { return existingCommands.has(command); });
            if (overlaps.length > 0) {
                log.debug("plugin CLI register skipped (".concat(entry.pluginId, "): command already registered (").concat(overlaps.join(", "), ")"));
                return "continue";
            }
        }
        try {
            var result = entry.register({
                program: program,
                config: config,
                workspaceDir: workspaceDir,
                logger: logger,
            });
            if (result && typeof result.then === "function") {
                void result.catch(function (err) {
                    log.warn("plugin CLI register failed (".concat(entry.pluginId, "): ").concat(String(err)));
                });
            }
            for (var _b = 0, _c = entry.commands; _b < _c.length; _b++) {
                var command = _c[_b];
                existingCommands.add(command);
            }
        }
        catch (err) {
            log.warn("plugin CLI register failed (".concat(entry.pluginId, "): ").concat(String(err)));
        }
    };
    for (var _i = 0, _a = registry.cliRegistrars; _i < _a.length; _i++) {
        var entry = _a[_i];
        _loop_1(entry);
    }
}
