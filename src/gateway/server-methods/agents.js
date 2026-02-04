"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentsHandlers = void 0;
var config_js_1 = require("../../config/config.js");
var index_js_1 = require("../protocol/index.js");
var session_utils_js_1 = require("../session-utils.js");
exports.agentsHandlers = {
    "agents.list": function (_a) {
        var params = _a.params, respond = _a.respond;
        if (!(0, index_js_1.validateAgentsListParams)(params)) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid agents.list params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateAgentsListParams.errors))));
            return;
        }
        var cfg = (0, config_js_1.loadConfig)();
        var result = (0, session_utils_js_1.listAgentsForGateway)(cfg);
        respond(true, result, undefined);
    },
};
