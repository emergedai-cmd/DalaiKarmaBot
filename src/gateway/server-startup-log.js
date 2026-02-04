"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logGatewayStartup = logGatewayStartup;
var chalk_1 = require("chalk");
var defaults_js_1 = require("../agents/defaults.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var logging_js_1 = require("../logging.js");
function logGatewayStartup(params) {
    var _a;
    var _b = (0, model_selection_js_1.resolveConfiguredModelRef)({
        cfg: params.cfg,
        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
        defaultModel: defaults_js_1.DEFAULT_MODEL,
    }), agentProvider = _b.provider, agentModel = _b.model;
    var modelRef = "".concat(agentProvider, "/").concat(agentModel);
    params.log.info("agent model: ".concat(modelRef), {
        consoleMessage: "agent model: ".concat(chalk_1.default.whiteBright(modelRef)),
    });
    var scheme = params.tlsEnabled ? "wss" : "ws";
    var formatHost = function (host) { return (host.includes(":") ? "[".concat(host, "]") : host); };
    var hosts = params.bindHosts && params.bindHosts.length > 0 ? params.bindHosts : [params.bindHost];
    var primaryHost = (_a = hosts[0]) !== null && _a !== void 0 ? _a : params.bindHost;
    params.log.info("listening on ".concat(scheme, "://").concat(formatHost(primaryHost), ":").concat(params.port, " (PID ").concat(process.pid, ")"));
    for (var _i = 0, _c = hosts.slice(1); _i < _c.length; _i++) {
        var host = _c[_i];
        params.log.info("listening on ".concat(scheme, "://").concat(formatHost(host), ":").concat(params.port));
    }
    params.log.info("log file: ".concat((0, logging_js_1.getResolvedLoggerSettings)().file));
    if (params.isNixMode) {
        params.log.info("gateway: running in Nix mode (config managed externally)");
    }
}
