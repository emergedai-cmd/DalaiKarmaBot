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
exports.maybeRepairGatewayDaemon = maybeRepairGatewayDaemon;
var command_format_js_1 = require("../cli/command-format.js");
var config_js_1 = require("../config/config.js");
var constants_js_1 = require("../daemon/constants.js");
var diagnostics_js_1 = require("../daemon/diagnostics.js");
var launchd_js_1 = require("../daemon/launchd.js");
var service_js_1 = require("../daemon/service.js");
var systemd_hints_js_1 = require("../daemon/systemd-hints.js");
var systemd_js_1 = require("../daemon/systemd.js");
var ports_js_1 = require("../infra/ports.js");
var wsl_js_1 = require("../infra/wsl.js");
var note_js_1 = require("../terminal/note.js");
var utils_js_1 = require("../utils.js");
var daemon_install_helpers_js_1 = require("./daemon-install-helpers.js");
var daemon_runtime_js_1 = require("./daemon-runtime.js");
var doctor_format_js_1 = require("./doctor-format.js");
var health_format_js_1 = require("./health-format.js");
var health_js_1 = require("./health.js");
function maybeRepairLaunchAgentBootstrap(params) {
    return __awaiter(this, void 0, void 0, function () {
        var listed, loaded, plistExists, shouldFix, repair, verified;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (process.platform !== "darwin") {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, (0, launchd_js_1.isLaunchAgentListed)({ env: params.env })];
                case 1:
                    listed = _b.sent();
                    if (!listed) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, (0, launchd_js_1.isLaunchAgentLoaded)({ env: params.env })];
                case 2:
                    loaded = _b.sent();
                    if (loaded) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, (0, launchd_js_1.launchAgentPlistExists)(params.env)];
                case 3:
                    plistExists = _b.sent();
                    if (!plistExists) {
                        return [2 /*return*/, false];
                    }
                    (0, note_js_1.note)("LaunchAgent is listed but not loaded in launchd.", "".concat(params.title, " LaunchAgent"));
                    return [4 /*yield*/, params.prompter.confirmSkipInNonInteractive({
                            message: "Repair ".concat(params.title, " LaunchAgent bootstrap now?"),
                            initialValue: true,
                        })];
                case 4:
                    shouldFix = _b.sent();
                    if (!shouldFix) {
                        return [2 /*return*/, false];
                    }
                    params.runtime.log("Bootstrapping ".concat(params.title, " LaunchAgent..."));
                    return [4 /*yield*/, (0, launchd_js_1.repairLaunchAgentBootstrap)({ env: params.env })];
                case 5:
                    repair = _b.sent();
                    if (!repair.ok) {
                        params.runtime.error("".concat(params.title, " LaunchAgent bootstrap failed: ").concat((_a = repair.detail) !== null && _a !== void 0 ? _a : "unknown error"));
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, (0, launchd_js_1.isLaunchAgentLoaded)({ env: params.env })];
                case 6:
                    verified = _b.sent();
                    if (!verified) {
                        params.runtime.error("".concat(params.title, " LaunchAgent still not loaded after repair."));
                        return [2 /*return*/, false];
                    }
                    (0, note_js_1.note)("".concat(params.title, " LaunchAgent repaired."), "".concat(params.title, " LaunchAgent"));
                    return [2 /*return*/, true];
            }
        });
    });
}
function maybeRepairGatewayDaemon(params) {
    return __awaiter(this, void 0, void 0, function () {
        var service, loaded, _a, serviceRuntime, gatewayRepaired, port, diagnostics, lastError, systemdAvailable, wsl, install, daemonRuntime, port, _b, programArguments, workingDirectory, environment, err_1, summary, hints, lines, start, label, restart, err_2, message;
        var _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    if (params.healthOk) {
                        return [2 /*return*/];
                    }
                    service = (0, service_js_1.resolveGatewayService)();
                    loaded = false;
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 2:
                    loaded = _j.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _j.sent();
                    loaded = false;
                    return [3 /*break*/, 4];
                case 4:
                    if (!loaded) return [3 /*break*/, 6];
                    return [4 /*yield*/, service.readRuntime(process.env).catch(function () { return undefined; })];
                case 5:
                    serviceRuntime = _j.sent();
                    _j.label = 6;
                case 6:
                    if (!(process.platform === "darwin" && ((_c = params.cfg.gateway) === null || _c === void 0 ? void 0 : _c.mode) !== "remote")) return [3 /*break*/, 11];
                    return [4 /*yield*/, maybeRepairLaunchAgentBootstrap({
                            env: process.env,
                            title: "Gateway",
                            runtime: params.runtime,
                            prompter: params.prompter,
                        })];
                case 7:
                    gatewayRepaired = _j.sent();
                    return [4 /*yield*/, maybeRepairLaunchAgentBootstrap({
                            env: __assign(__assign({}, process.env), { OPENCLAW_LAUNCHD_LABEL: (0, constants_js_1.resolveNodeLaunchAgentLabel)() }),
                            title: "Node",
                            runtime: params.runtime,
                            prompter: params.prompter,
                        })];
                case 8:
                    _j.sent();
                    if (!gatewayRepaired) return [3 /*break*/, 11];
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 9:
                    loaded = _j.sent();
                    if (!loaded) return [3 /*break*/, 11];
                    return [4 /*yield*/, service.readRuntime(process.env).catch(function () { return undefined; })];
                case 10:
                    serviceRuntime = _j.sent();
                    _j.label = 11;
                case 11:
                    if (!(((_d = params.cfg.gateway) === null || _d === void 0 ? void 0 : _d.mode) !== "remote")) return [3 /*break*/, 15];
                    port = (0, config_js_1.resolveGatewayPort)(params.cfg, process.env);
                    return [4 /*yield*/, (0, ports_js_1.inspectPortUsage)(port)];
                case 12:
                    diagnostics = _j.sent();
                    if (!(diagnostics.status === "busy")) return [3 /*break*/, 13];
                    (0, note_js_1.note)((0, ports_js_1.formatPortDiagnostics)(diagnostics).join("\n"), "Gateway port");
                    return [3 /*break*/, 15];
                case 13:
                    if (!(loaded && (serviceRuntime === null || serviceRuntime === void 0 ? void 0 : serviceRuntime.status) === "running")) return [3 /*break*/, 15];
                    return [4 /*yield*/, (0, diagnostics_js_1.readLastGatewayErrorLine)(process.env)];
                case 14:
                    lastError = _j.sent();
                    if (lastError) {
                        (0, note_js_1.note)("Last gateway error: ".concat(lastError), "Gateway");
                    }
                    _j.label = 15;
                case 15:
                    if (!!loaded) return [3 /*break*/, 26];
                    if (!(process.platform === "linux")) return [3 /*break*/, 18];
                    return [4 /*yield*/, (0, systemd_js_1.isSystemdUserServiceAvailable)().catch(function () { return false; })];
                case 16:
                    systemdAvailable = _j.sent();
                    if (!!systemdAvailable) return [3 /*break*/, 18];
                    return [4 /*yield*/, (0, wsl_js_1.isWSL)()];
                case 17:
                    wsl = _j.sent();
                    (0, note_js_1.note)((0, systemd_hints_js_1.renderSystemdUnavailableHints)({ wsl: wsl }).join("\n"), "Gateway");
                    return [2 /*return*/];
                case 18:
                    (0, note_js_1.note)("Gateway service not installed.", "Gateway");
                    if (!(((_e = params.cfg.gateway) === null || _e === void 0 ? void 0 : _e.mode) !== "remote")) return [3 /*break*/, 25];
                    return [4 /*yield*/, params.prompter.confirmSkipInNonInteractive({
                            message: "Install gateway service now?",
                            initialValue: true,
                        })];
                case 19:
                    install = _j.sent();
                    if (!install) return [3 /*break*/, 25];
                    return [4 /*yield*/, params.prompter.select({
                            message: "Gateway service runtime",
                            options: daemon_runtime_js_1.GATEWAY_DAEMON_RUNTIME_OPTIONS,
                            initialValue: daemon_runtime_js_1.DEFAULT_GATEWAY_DAEMON_RUNTIME,
                        }, daemon_runtime_js_1.DEFAULT_GATEWAY_DAEMON_RUNTIME)];
                case 20:
                    daemonRuntime = _j.sent();
                    port = (0, config_js_1.resolveGatewayPort)(params.cfg, process.env);
                    return [4 /*yield*/, (0, daemon_install_helpers_js_1.buildGatewayInstallPlan)({
                            env: process.env,
                            port: port,
                            token: (_h = (_g = (_f = params.cfg.gateway) === null || _f === void 0 ? void 0 : _f.auth) === null || _g === void 0 ? void 0 : _g.token) !== null && _h !== void 0 ? _h : process.env.OPENCLAW_GATEWAY_TOKEN,
                            runtime: daemonRuntime,
                            warn: function (message, title) { return (0, note_js_1.note)(message, title); },
                            config: params.cfg,
                        })];
                case 21:
                    _b = _j.sent(), programArguments = _b.programArguments, workingDirectory = _b.workingDirectory, environment = _b.environment;
                    _j.label = 22;
                case 22:
                    _j.trys.push([22, 24, , 25]);
                    return [4 /*yield*/, service.install({
                            env: process.env,
                            stdout: process.stdout,
                            programArguments: programArguments,
                            workingDirectory: workingDirectory,
                            environment: environment,
                        })];
                case 23:
                    _j.sent();
                    return [3 /*break*/, 25];
                case 24:
                    err_1 = _j.sent();
                    (0, note_js_1.note)("Gateway service install failed: ".concat(String(err_1)), "Gateway");
                    (0, note_js_1.note)((0, daemon_install_helpers_js_1.gatewayInstallErrorHint)(), "Gateway");
                    return [3 /*break*/, 25];
                case 25: return [2 /*return*/];
                case 26:
                    summary = (0, doctor_format_js_1.formatGatewayRuntimeSummary)(serviceRuntime);
                    hints = (0, doctor_format_js_1.buildGatewayRuntimeHints)(serviceRuntime, {
                        platform: process.platform,
                        env: process.env,
                    });
                    if (summary || hints.length > 0) {
                        lines = [];
                        if (summary) {
                            lines.push("Runtime: ".concat(summary));
                        }
                        lines.push.apply(lines, hints);
                        (0, note_js_1.note)(lines.join("\n"), "Gateway");
                    }
                    if (!((serviceRuntime === null || serviceRuntime === void 0 ? void 0 : serviceRuntime.status) !== "running")) return [3 /*break*/, 30];
                    return [4 /*yield*/, params.prompter.confirmSkipInNonInteractive({
                            message: "Start gateway service now?",
                            initialValue: true,
                        })];
                case 27:
                    start = _j.sent();
                    if (!start) return [3 /*break*/, 30];
                    return [4 /*yield*/, service.restart({
                            env: process.env,
                            stdout: process.stdout,
                        })];
                case 28:
                    _j.sent();
                    return [4 /*yield*/, (0, utils_js_1.sleep)(1500)];
                case 29:
                    _j.sent();
                    _j.label = 30;
                case 30:
                    if (process.platform === "darwin") {
                        label = (0, constants_js_1.resolveGatewayLaunchAgentLabel)(process.env.OPENCLAW_PROFILE);
                        (0, note_js_1.note)("LaunchAgent loaded; stopping requires \"".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway stop"), "\" or launchctl bootout gui/$UID/").concat(label, "."), "Gateway");
                    }
                    if (!((serviceRuntime === null || serviceRuntime === void 0 ? void 0 : serviceRuntime.status) === "running")) return [3 /*break*/, 37];
                    return [4 /*yield*/, params.prompter.confirmSkipInNonInteractive({
                            message: "Restart gateway service now?",
                            initialValue: true,
                        })];
                case 31:
                    restart = _j.sent();
                    if (!restart) return [3 /*break*/, 37];
                    return [4 /*yield*/, service.restart({
                            env: process.env,
                            stdout: process.stdout,
                        })];
                case 32:
                    _j.sent();
                    return [4 /*yield*/, (0, utils_js_1.sleep)(1500)];
                case 33:
                    _j.sent();
                    _j.label = 34;
                case 34:
                    _j.trys.push([34, 36, , 37]);
                    return [4 /*yield*/, (0, health_js_1.healthCommand)({ json: false, timeoutMs: 10000 }, params.runtime)];
                case 35:
                    _j.sent();
                    return [3 /*break*/, 37];
                case 36:
                    err_2 = _j.sent();
                    message = String(err_2);
                    if (message.includes("gateway closed")) {
                        (0, note_js_1.note)("Gateway not running.", "Gateway");
                        (0, note_js_1.note)(params.gatewayDetailsMessage, "Gateway connection");
                    }
                    else {
                        params.runtime.error((0, health_format_js_1.formatHealthCheckFailure)(err_2));
                    }
                    return [3 /*break*/, 37];
                case 37: return [2 /*return*/];
            }
        });
    });
}
