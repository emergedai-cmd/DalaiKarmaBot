"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyGatewayLaneConcurrency = applyGatewayLaneConcurrency;
var agent_limits_js_1 = require("../config/agent-limits.js");
var command_queue_js_1 = require("../process/command-queue.js");
function applyGatewayLaneConcurrency(cfg) {
    var _a, _b;
    (0, command_queue_js_1.setCommandLaneConcurrency)("cron" /* CommandLane.Cron */, (_b = (_a = cfg.cron) === null || _a === void 0 ? void 0 : _a.maxConcurrentRuns) !== null && _b !== void 0 ? _b : 1);
    (0, command_queue_js_1.setCommandLaneConcurrency)("main" /* CommandLane.Main */, (0, agent_limits_js_1.resolveAgentMaxConcurrent)(cfg));
    (0, command_queue_js_1.setCommandLaneConcurrency)("subagent" /* CommandLane.Subagent */, (0, agent_limits_js_1.resolveSubagentMaxConcurrent)(cfg));
}
