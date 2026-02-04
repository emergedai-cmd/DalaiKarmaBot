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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildGatewayCronService = buildGatewayCronService;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var config_js_1 = require("../config/config.js");
var sessions_js_1 = require("../config/sessions.js");
var isolated_agent_js_1 = require("../cron/isolated-agent.js");
var run_log_js_1 = require("../cron/run-log.js");
var service_js_1 = require("../cron/service.js");
var store_js_1 = require("../cron/store.js");
var heartbeat_runner_js_1 = require("../infra/heartbeat-runner.js");
var heartbeat_wake_js_1 = require("../infra/heartbeat-wake.js");
var system_events_js_1 = require("../infra/system-events.js");
var logging_js_1 = require("../logging.js");
var session_key_js_1 = require("../routing/session-key.js");
var runtime_js_1 = require("../runtime.js");
function buildGatewayCronService(params) {
    var _this = this;
    var _a, _b;
    var cronLogger = (0, logging_js_1.getChildLogger)({ module: "cron" });
    var storePath = (0, store_js_1.resolveCronStorePath)((_a = params.cfg.cron) === null || _a === void 0 ? void 0 : _a.store);
    var cronEnabled = process.env.OPENCLAW_SKIP_CRON !== "1" && ((_b = params.cfg.cron) === null || _b === void 0 ? void 0 : _b.enabled) !== false;
    var resolveCronAgent = function (requested) {
        var _a;
        var runtimeConfig = (0, config_js_1.loadConfig)();
        var normalized = typeof requested === "string" && requested.trim() ? (0, session_key_js_1.normalizeAgentId)(requested) : undefined;
        var hasAgent = normalized !== undefined &&
            Array.isArray((_a = runtimeConfig.agents) === null || _a === void 0 ? void 0 : _a.list) &&
            runtimeConfig.agents.list.some(function (entry) {
                return entry && typeof entry.id === "string" && (0, session_key_js_1.normalizeAgentId)(entry.id) === normalized;
            });
        var agentId = hasAgent ? normalized : (0, agent_scope_js_1.resolveDefaultAgentId)(runtimeConfig);
        return { agentId: agentId, cfg: runtimeConfig };
    };
    var cron = new service_js_1.CronService({
        storePath: storePath,
        cronEnabled: cronEnabled,
        enqueueSystemEvent: function (text, opts) {
            var _a = resolveCronAgent(opts === null || opts === void 0 ? void 0 : opts.agentId), agentId = _a.agentId, runtimeConfig = _a.cfg;
            var sessionKey = (0, sessions_js_1.resolveAgentMainSessionKey)({
                cfg: runtimeConfig,
                agentId: agentId,
            });
            (0, system_events_js_1.enqueueSystemEvent)(text, { sessionKey: sessionKey });
        },
        requestHeartbeatNow: heartbeat_wake_js_1.requestHeartbeatNow,
        runHeartbeatOnce: function (opts) { return __awaiter(_this, void 0, void 0, function () {
            var runtimeConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        runtimeConfig = (0, config_js_1.loadConfig)();
                        return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({
                                cfg: runtimeConfig,
                                reason: opts === null || opts === void 0 ? void 0 : opts.reason,
                                deps: __assign(__assign({}, params.deps), { runtime: runtime_js_1.defaultRuntime }),
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        runIsolatedAgentJob: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var _c, agentId, runtimeConfig;
            var job = _b.job, message = _b.message;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _c = resolveCronAgent(job.agentId), agentId = _c.agentId, runtimeConfig = _c.cfg;
                        return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                cfg: runtimeConfig,
                                deps: params.deps,
                                job: job,
                                message: message,
                                agentId: agentId,
                                sessionKey: "cron:".concat(job.id),
                                lane: "cron",
                            })];
                    case 1: return [2 /*return*/, _d.sent()];
                }
            });
        }); },
        log: (0, logging_js_1.getChildLogger)({ module: "cron", storePath: storePath }),
        onEvent: function (evt) {
            params.broadcast("cron", evt, { dropIfSlow: true });
            if (evt.action === "finished") {
                var logPath_1 = (0, run_log_js_1.resolveCronRunLogPath)({
                    storePath: storePath,
                    jobId: evt.jobId,
                });
                void (0, run_log_js_1.appendCronRunLog)(logPath_1, {
                    ts: Date.now(),
                    jobId: evt.jobId,
                    action: "finished",
                    status: evt.status,
                    error: evt.error,
                    summary: evt.summary,
                    runAtMs: evt.runAtMs,
                    durationMs: evt.durationMs,
                    nextRunAtMs: evt.nextRunAtMs,
                }).catch(function (err) {
                    cronLogger.warn({ err: String(err), logPath: logPath_1 }, "cron: run log append failed");
                });
            }
        },
    });
    return { cron: cron, storePath: storePath, cronEnabled: cronEnabled };
}
