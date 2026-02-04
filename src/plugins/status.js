"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPluginStatusReport = buildPluginStatusReport;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var workspace_js_1 = require("../agents/workspace.js");
var config_js_1 = require("../config/config.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var loader_js_1 = require("./loader.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("plugins");
function buildPluginStatusReport(params) {
    var _a, _b;
    var config = (_a = params === null || params === void 0 ? void 0 : params.config) !== null && _a !== void 0 ? _a : (0, config_js_1.loadConfig)();
    var workspaceDir = (params === null || params === void 0 ? void 0 : params.workspaceDir)
        ? params.workspaceDir
        : ((_b = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(config, (0, agent_scope_js_1.resolveDefaultAgentId)(config))) !== null && _b !== void 0 ? _b : (0, workspace_js_1.resolveDefaultAgentWorkspaceDir)());
    var registry = (0, loader_js_1.loadOpenClawPlugins)({
        config: config,
        workspaceDir: workspaceDir,
        logger: {
            info: function (msg) { return log.info(msg); },
            warn: function (msg) { return log.warn(msg); },
            error: function (msg) { return log.error(msg); },
            debug: function (msg) { return log.debug(msg); },
        },
    });
    return __assign({ workspaceDir: workspaceDir }, registry);
}
