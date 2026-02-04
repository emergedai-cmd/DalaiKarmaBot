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
exports.createGatewayReloadHandlers = createGatewayReloadHandlers;
var agent_limits_js_1 = require("../config/agent-limits.js");
var gmail_watcher_js_1 = require("../hooks/gmail-watcher.js");
var env_js_1 = require("../infra/env.js");
var target_resolver_js_1 = require("../infra/outbound/target-resolver.js");
var restart_js_1 = require("../infra/restart.js");
var command_queue_js_1 = require("../process/command-queue.js");
var hooks_js_1 = require("./hooks.js");
var server_browser_js_1 = require("./server-browser.js");
var server_cron_js_1 = require("./server-cron.js");
function createGatewayReloadHandlers(params) {
    var _this = this;
    var applyHotReload = function (plan, nextConfig) { return __awaiter(_this, void 0, void 0, function () {
        var state, nextState, _a, err_1, gmailResult, err_2, restartChannel, _i, _b, channel;
        var _this = this;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    (0, restart_js_1.setGatewaySigusr1RestartPolicy)({ allowExternal: ((_c = nextConfig.commands) === null || _c === void 0 ? void 0 : _c.restart) === true });
                    state = params.getState();
                    nextState = __assign({}, state);
                    if (plan.reloadHooks) {
                        try {
                            nextState.hooksConfig = (0, hooks_js_1.resolveHooksConfig)(nextConfig);
                        }
                        catch (err) {
                            params.logHooks.warn("hooks config reload failed: ".concat(String(err)));
                        }
                    }
                    if (plan.restartHeartbeat) {
                        nextState.heartbeatRunner.updateConfig(nextConfig);
                    }
                    (0, target_resolver_js_1.resetDirectoryCache)();
                    if (plan.restartCron) {
                        state.cronState.cron.stop();
                        nextState.cronState = (0, server_cron_js_1.buildGatewayCronService)({
                            cfg: nextConfig,
                            deps: params.deps,
                            broadcast: params.broadcast,
                        });
                        void nextState.cronState.cron
                            .start()
                            .catch(function (err) { return params.logCron.error("failed to start: ".concat(String(err))); });
                    }
                    if (!plan.restartBrowserControl) return [3 /*break*/, 5];
                    if (!state.browserControl) return [3 /*break*/, 2];
                    return [4 /*yield*/, state.browserControl.stop().catch(function () { })];
                case 1:
                    _f.sent();
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 4, , 5]);
                    _a = nextState;
                    return [4 /*yield*/, (0, server_browser_js_1.startBrowserControlServerIfEnabled)()];
                case 3:
                    _a.browserControl = _f.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _f.sent();
                    params.logBrowser.error("server failed to start: ".concat(String(err_1)));
                    return [3 /*break*/, 5];
                case 5:
                    if (!plan.restartGmailWatcher) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, gmail_watcher_js_1.stopGmailWatcher)().catch(function () { })];
                case 6:
                    _f.sent();
                    if (!!(0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_SKIP_GMAIL_WATCHER)) return [3 /*break*/, 11];
                    _f.label = 7;
                case 7:
                    _f.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, (0, gmail_watcher_js_1.startGmailWatcher)(nextConfig)];
                case 8:
                    gmailResult = _f.sent();
                    if (gmailResult.started) {
                        params.logHooks.info("gmail watcher started");
                    }
                    else if (gmailResult.reason &&
                        gmailResult.reason !== "hooks not enabled" &&
                        gmailResult.reason !== "no gmail account configured") {
                        params.logHooks.warn("gmail watcher not started: ".concat(gmailResult.reason));
                    }
                    return [3 /*break*/, 10];
                case 9:
                    err_2 = _f.sent();
                    params.logHooks.error("gmail watcher failed to start: ".concat(String(err_2)));
                    return [3 /*break*/, 10];
                case 10: return [3 /*break*/, 12];
                case 11:
                    params.logHooks.info("skipping gmail watcher restart (OPENCLAW_SKIP_GMAIL_WATCHER=1)");
                    _f.label = 12;
                case 12:
                    if (!(plan.restartChannels.size > 0)) return [3 /*break*/, 17];
                    if (!((0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_SKIP_CHANNELS) ||
                        (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_SKIP_PROVIDERS))) return [3 /*break*/, 13];
                    params.logChannels.info("skipping channel reload (OPENCLAW_SKIP_CHANNELS=1 or OPENCLAW_SKIP_PROVIDERS=1)");
                    return [3 /*break*/, 17];
                case 13:
                    restartChannel = function (name) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    params.logChannels.info("restarting ".concat(name, " channel"));
                                    return [4 /*yield*/, params.stopChannel(name)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, params.startChannel(name)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    _i = 0, _b = plan.restartChannels;
                    _f.label = 14;
                case 14:
                    if (!(_i < _b.length)) return [3 /*break*/, 17];
                    channel = _b[_i];
                    return [4 /*yield*/, restartChannel(channel)];
                case 15:
                    _f.sent();
                    _f.label = 16;
                case 16:
                    _i++;
                    return [3 /*break*/, 14];
                case 17:
                    (0, command_queue_js_1.setCommandLaneConcurrency)("cron" /* CommandLane.Cron */, (_e = (_d = nextConfig.cron) === null || _d === void 0 ? void 0 : _d.maxConcurrentRuns) !== null && _e !== void 0 ? _e : 1);
                    (0, command_queue_js_1.setCommandLaneConcurrency)("main" /* CommandLane.Main */, (0, agent_limits_js_1.resolveAgentMaxConcurrent)(nextConfig));
                    (0, command_queue_js_1.setCommandLaneConcurrency)("subagent" /* CommandLane.Subagent */, (0, agent_limits_js_1.resolveSubagentMaxConcurrent)(nextConfig));
                    if (plan.hotReasons.length > 0) {
                        params.logReload.info("config hot reload applied (".concat(plan.hotReasons.join(", "), ")"));
                    }
                    else if (plan.noopPaths.length > 0) {
                        params.logReload.info("config change applied (dynamic reads: ".concat(plan.noopPaths.join(", "), ")"));
                    }
                    params.setState(nextState);
                    return [2 /*return*/];
            }
        });
    }); };
    var requestGatewayRestart = function (plan, nextConfig) {
        var _a;
        (0, restart_js_1.setGatewaySigusr1RestartPolicy)({ allowExternal: ((_a = nextConfig.commands) === null || _a === void 0 ? void 0 : _a.restart) === true });
        var reasons = plan.restartReasons.length
            ? plan.restartReasons.join(", ")
            : plan.changedPaths.join(", ");
        params.logReload.warn("config change requires gateway restart (".concat(reasons, ")"));
        if (process.listenerCount("SIGUSR1") === 0) {
            params.logReload.warn("no SIGUSR1 listener found; restart skipped");
            return;
        }
        (0, restart_js_1.authorizeGatewaySigusr1Restart)();
        process.emit("SIGUSR1");
    };
    return { applyHotReload: applyHotReload, requestGatewayRestart: requestGatewayRestart };
}
