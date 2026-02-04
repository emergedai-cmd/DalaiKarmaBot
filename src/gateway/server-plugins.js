"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadGatewayPlugins = loadGatewayPlugins;
var loader_js_1 = require("../plugins/loader.js");
function loadGatewayPlugins(params) {
    var pluginRegistry = (0, loader_js_1.loadOpenClawPlugins)({
        config: params.cfg,
        workspaceDir: params.workspaceDir,
        logger: {
            info: function (msg) { return params.log.info(msg); },
            warn: function (msg) { return params.log.warn(msg); },
            error: function (msg) { return params.log.error(msg); },
            debug: function (msg) { return params.log.debug(msg); },
        },
        coreGatewayHandlers: params.coreGatewayHandlers,
    });
    var pluginMethods = Object.keys(pluginRegistry.gatewayHandlers);
    var gatewayMethods = Array.from(new Set(__spreadArray(__spreadArray([], params.baseMethods, true), pluginMethods, true)));
    if (pluginRegistry.diagnostics.length > 0) {
        for (var _i = 0, _a = pluginRegistry.diagnostics; _i < _a.length; _i++) {
            var diag = _a[_i];
            var details = [
                diag.pluginId ? "plugin=".concat(diag.pluginId) : null,
                diag.source ? "source=".concat(diag.source) : null,
            ]
                .filter(function (entry) { return Boolean(entry); })
                .join(", ");
            var message = details
                ? "[plugins] ".concat(diag.message, " (").concat(details, ")")
                : "[plugins] ".concat(diag.message);
            if (diag.level === "error") {
                params.log.error(message);
            }
            else {
                params.log.info(message);
            }
        }
    }
    return { pluginRegistry: pluginRegistry, gatewayMethods: gatewayMethods };
}
