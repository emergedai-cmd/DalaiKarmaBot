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
exports.runNodeDaemonInstall = runNodeDaemonInstall;
exports.runNodeDaemonUninstall = runNodeDaemonUninstall;
exports.runNodeDaemonStart = runNodeDaemonStart;
exports.runNodeDaemonRestart = runNodeDaemonRestart;
exports.runNodeDaemonStop = runNodeDaemonStop;
exports.runNodeDaemonStatus = runNodeDaemonStatus;
var node_daemon_install_helpers_js_1 = require("../../commands/node-daemon-install-helpers.js");
var node_daemon_runtime_js_1 = require("../../commands/node-daemon-runtime.js");
var paths_js_1 = require("../../config/paths.js");
var constants_js_1 = require("../../daemon/constants.js");
var launchd_js_1 = require("../../daemon/launchd.js");
var node_service_js_1 = require("../../daemon/node-service.js");
var systemd_hints_js_1 = require("../../daemon/systemd-hints.js");
var systemd_js_1 = require("../../daemon/systemd.js");
var wsl_js_1 = require("../../infra/wsl.js");
var config_js_1 = require("../../node-host/config.js");
var runtime_js_1 = require("../../runtime.js");
var theme_js_1 = require("../../terminal/theme.js");
var command_format_js_1 = require("../command-format.js");
var response_js_1 = require("../daemon-cli/response.js");
var shared_js_1 = require("../daemon-cli/shared.js");
function renderNodeServiceStartHints() {
    var base = [(0, command_format_js_1.formatCliCommand)("openclaw node install"), (0, command_format_js_1.formatCliCommand)("openclaw node start")];
    switch (process.platform) {
        case "darwin":
            return __spreadArray(__spreadArray([], base, true), [
                "launchctl bootstrap gui/$UID ~/Library/LaunchAgents/".concat((0, constants_js_1.resolveNodeLaunchAgentLabel)(), ".plist"),
            ], false);
        case "linux":
            return __spreadArray(__spreadArray([], base, true), ["systemctl --user start ".concat((0, constants_js_1.resolveNodeSystemdServiceName)(), ".service")], false);
        case "win32":
            return __spreadArray(__spreadArray([], base, true), ["schtasks /Run /TN \"".concat((0, constants_js_1.resolveNodeWindowsTaskName)(), "\"")], false);
        default:
            return base;
    }
}
function buildNodeRuntimeHints(env) {
    if (env === void 0) { env = process.env; }
    if (process.platform === "darwin") {
        var logs = (0, launchd_js_1.resolveGatewayLogPaths)(env);
        return [
            "Launchd stdout (if installed): ".concat(logs.stdoutPath),
            "Launchd stderr (if installed): ".concat(logs.stderrPath),
        ];
    }
    if (process.platform === "linux") {
        var unit = (0, constants_js_1.resolveNodeSystemdServiceName)();
        return ["Logs: journalctl --user -u ".concat(unit, ".service -n 200 --no-pager")];
    }
    if (process.platform === "win32") {
        var task = (0, constants_js_1.resolveNodeWindowsTaskName)();
        return ["Logs: schtasks /Query /TN \"".concat(task, "\" /V /FO LIST")];
    }
    return [];
}
function resolveNodeDefaults(opts, config) {
    var _a, _b, _c, _d;
    var host = ((_a = opts.host) === null || _a === void 0 ? void 0 : _a.trim()) || ((_b = config === null || config === void 0 ? void 0 : config.gateway) === null || _b === void 0 ? void 0 : _b.host) || "127.0.0.1";
    var portOverride = (0, shared_js_1.parsePort)(opts.port);
    if (opts.port !== undefined && portOverride === null) {
        return { host: host, port: null };
    }
    var port = (_d = portOverride !== null && portOverride !== void 0 ? portOverride : (_c = config === null || config === void 0 ? void 0 : config.gateway) === null || _c === void 0 ? void 0 : _c.port) !== null && _d !== void 0 ? _d : 18789;
    return { host: host, port: port };
}
function runNodeDaemonInstall(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var json, warnings, stdout, emit, fail, config, _a, host, port, runtimeRaw, service, loaded, err_1, tlsFingerprint, tls, _b, programArguments, workingDirectory, environment, description, err_2, installed, _c;
        var _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    json = Boolean(opts.json);
                    warnings = [];
                    stdout = json ? (0, response_js_1.createNullWriter)() : process.stdout;
                    emit = function (payload) {
                        if (!json) {
                            return;
                        }
                        (0, response_js_1.emitDaemonActionJson)(__assign({ action: "install" }, payload));
                    };
                    fail = function (message, hints) {
                        if (json) {
                            emit({
                                ok: false,
                                error: message,
                                hints: hints,
                                warnings: warnings.length ? warnings : undefined,
                            });
                        }
                        else {
                            runtime_js_1.defaultRuntime.error(message);
                            if (hints === null || hints === void 0 ? void 0 : hints.length) {
                                for (var _i = 0, hints_1 = hints; _i < hints_1.length; _i++) {
                                    var hint = hints_1[_i];
                                    runtime_js_1.defaultRuntime.log("Tip: ".concat(hint));
                                }
                            }
                        }
                        runtime_js_1.defaultRuntime.exit(1);
                    };
                    if ((0, paths_js_1.resolveIsNixMode)(process.env)) {
                        fail("Nix mode detected; service install is disabled.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, config_js_1.loadNodeHostConfig)()];
                case 1:
                    config = _g.sent();
                    _a = resolveNodeDefaults(opts, config), host = _a.host, port = _a.port;
                    if (!Number.isFinite(port !== null && port !== void 0 ? port : NaN) || (port !== null && port !== void 0 ? port : 0) <= 0) {
                        fail("Invalid port");
                        return [2 /*return*/];
                    }
                    runtimeRaw = opts.runtime ? String(opts.runtime) : node_daemon_runtime_js_1.DEFAULT_NODE_DAEMON_RUNTIME;
                    if (!(0, node_daemon_runtime_js_1.isNodeDaemonRuntime)(runtimeRaw)) {
                        fail('Invalid --runtime (use "node" or "bun")');
                        return [2 /*return*/];
                    }
                    service = (0, node_service_js_1.resolveNodeService)();
                    loaded = false;
                    _g.label = 2;
                case 2:
                    _g.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 3:
                    loaded = _g.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _g.sent();
                    fail("Node service check failed: ".concat(String(err_1)));
                    return [2 /*return*/];
                case 5:
                    if (loaded && !opts.force) {
                        emit({
                            ok: true,
                            result: "already-installed",
                            message: "Node service already ".concat(service.loadedText, "."),
                            service: (0, response_js_1.buildDaemonServiceSnapshot)(service, loaded),
                            warnings: warnings.length ? warnings : undefined,
                        });
                        if (!json) {
                            runtime_js_1.defaultRuntime.log("Node service already ".concat(service.loadedText, "."));
                            runtime_js_1.defaultRuntime.log("Reinstall with: ".concat((0, command_format_js_1.formatCliCommand)("openclaw node install --force")));
                        }
                        return [2 /*return*/];
                    }
                    tlsFingerprint = ((_d = opts.tlsFingerprint) === null || _d === void 0 ? void 0 : _d.trim()) || ((_e = config === null || config === void 0 ? void 0 : config.gateway) === null || _e === void 0 ? void 0 : _e.tlsFingerprint);
                    tls = Boolean(opts.tls) || Boolean(tlsFingerprint) || Boolean((_f = config === null || config === void 0 ? void 0 : config.gateway) === null || _f === void 0 ? void 0 : _f.tls);
                    return [4 /*yield*/, (0, node_daemon_install_helpers_js_1.buildNodeInstallPlan)({
                            env: process.env,
                            host: host,
                            port: port !== null && port !== void 0 ? port : 18789,
                            tls: tls,
                            tlsFingerprint: tlsFingerprint || undefined,
                            nodeId: opts.nodeId,
                            displayName: opts.displayName,
                            runtime: runtimeRaw,
                            warn: function (message) {
                                if (json) {
                                    warnings.push(message);
                                }
                                else {
                                    runtime_js_1.defaultRuntime.log(message);
                                }
                            },
                        })];
                case 6:
                    _b = _g.sent(), programArguments = _b.programArguments, workingDirectory = _b.workingDirectory, environment = _b.environment, description = _b.description;
                    _g.label = 7;
                case 7:
                    _g.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, service.install({
                            env: process.env,
                            stdout: stdout,
                            programArguments: programArguments,
                            workingDirectory: workingDirectory,
                            environment: environment,
                            description: description,
                        })];
                case 8:
                    _g.sent();
                    return [3 /*break*/, 10];
                case 9:
                    err_2 = _g.sent();
                    fail("Node install failed: ".concat(String(err_2)));
                    return [2 /*return*/];
                case 10:
                    installed = true;
                    _g.label = 11;
                case 11:
                    _g.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 12:
                    installed = _g.sent();
                    return [3 /*break*/, 14];
                case 13:
                    _c = _g.sent();
                    installed = true;
                    return [3 /*break*/, 14];
                case 14:
                    emit({
                        ok: true,
                        result: "installed",
                        service: (0, response_js_1.buildDaemonServiceSnapshot)(service, installed),
                        warnings: warnings.length ? warnings : undefined,
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function runNodeDaemonUninstall() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var json, stdout, emit, fail, service, err_3, loaded, _a;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    json = Boolean(opts.json);
                    stdout = json ? (0, response_js_1.createNullWriter)() : process.stdout;
                    emit = function (payload) {
                        if (!json) {
                            return;
                        }
                        (0, response_js_1.emitDaemonActionJson)(__assign({ action: "uninstall" }, payload));
                    };
                    fail = function (message) {
                        if (json) {
                            emit({ ok: false, error: message });
                        }
                        else {
                            runtime_js_1.defaultRuntime.error(message);
                        }
                        runtime_js_1.defaultRuntime.exit(1);
                    };
                    if ((0, paths_js_1.resolveIsNixMode)(process.env)) {
                        fail("Nix mode detected; service uninstall is disabled.");
                        return [2 /*return*/];
                    }
                    service = (0, node_service_js_1.resolveNodeService)();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, service.uninstall({ env: process.env, stdout: stdout })];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _b.sent();
                    fail("Node uninstall failed: ".concat(String(err_3)));
                    return [2 /*return*/];
                case 4:
                    loaded = false;
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 6:
                    loaded = _b.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _a = _b.sent();
                    loaded = false;
                    return [3 /*break*/, 8];
                case 8:
                    emit({
                        ok: true,
                        result: "uninstalled",
                        service: (0, response_js_1.buildDaemonServiceSnapshot)(service, loaded),
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function runNodeDaemonStart() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var json, stdout, emit, fail, service, loaded, err_4, hints, systemdAvailable, _a, _b, _i, hints_2, hint, err_5, hints, started, _c;
        var _d;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    json = Boolean(opts.json);
                    stdout = json ? (0, response_js_1.createNullWriter)() : process.stdout;
                    emit = function (payload) {
                        if (!json) {
                            return;
                        }
                        (0, response_js_1.emitDaemonActionJson)(__assign({ action: "start" }, payload));
                    };
                    fail = function (message, hints) {
                        if (json) {
                            emit({ ok: false, error: message, hints: hints });
                        }
                        else {
                            runtime_js_1.defaultRuntime.error(message);
                        }
                        runtime_js_1.defaultRuntime.exit(1);
                    };
                    service = (0, node_service_js_1.resolveNodeService)();
                    loaded = false;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 2:
                    loaded = _e.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _e.sent();
                    fail("Node service check failed: ".concat(String(err_4)));
                    return [2 /*return*/];
                case 4:
                    if (!!loaded) return [3 /*break*/, 8];
                    hints = renderNodeServiceStartHints();
                    if (!(process.platform === "linux")) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, systemd_js_1.isSystemdUserServiceAvailable)().catch(function () { return false; })];
                case 5:
                    systemdAvailable = _e.sent();
                    if (!!systemdAvailable) return [3 /*break*/, 7];
                    _a = [__spreadArray([], hints, true)];
                    _b = systemd_hints_js_1.renderSystemdUnavailableHints;
                    _d = {};
                    return [4 /*yield*/, (0, wsl_js_1.isWSL)()];
                case 6:
                    hints = __spreadArray.apply(void 0, _a.concat([_b.apply(void 0, [(_d.wsl = _e.sent(), _d)]), true]));
                    _e.label = 7;
                case 7:
                    emit({
                        ok: true,
                        result: "not-loaded",
                        message: "Node service ".concat(service.notLoadedText, "."),
                        hints: hints,
                        service: (0, response_js_1.buildDaemonServiceSnapshot)(service, loaded),
                    });
                    if (!json) {
                        runtime_js_1.defaultRuntime.log("Node service ".concat(service.notLoadedText, "."));
                        for (_i = 0, hints_2 = hints; _i < hints_2.length; _i++) {
                            hint = hints_2[_i];
                            runtime_js_1.defaultRuntime.log("Start with: ".concat(hint));
                        }
                    }
                    return [2 /*return*/];
                case 8:
                    _e.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, service.restart({ env: process.env, stdout: stdout })];
                case 9:
                    _e.sent();
                    return [3 /*break*/, 11];
                case 10:
                    err_5 = _e.sent();
                    hints = renderNodeServiceStartHints();
                    fail("Node start failed: ".concat(String(err_5)), hints);
                    return [2 /*return*/];
                case 11:
                    started = true;
                    _e.label = 12;
                case 12:
                    _e.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 13:
                    started = _e.sent();
                    return [3 /*break*/, 15];
                case 14:
                    _c = _e.sent();
                    started = true;
                    return [3 /*break*/, 15];
                case 15:
                    emit({
                        ok: true,
                        result: "started",
                        service: (0, response_js_1.buildDaemonServiceSnapshot)(service, started),
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function runNodeDaemonRestart() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var json, stdout, emit, fail, service, loaded, err_6, hints, systemdAvailable, _a, _b, _i, hints_3, hint, err_7, hints, restarted, _c;
        var _d;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    json = Boolean(opts.json);
                    stdout = json ? (0, response_js_1.createNullWriter)() : process.stdout;
                    emit = function (payload) {
                        if (!json) {
                            return;
                        }
                        (0, response_js_1.emitDaemonActionJson)(__assign({ action: "restart" }, payload));
                    };
                    fail = function (message, hints) {
                        if (json) {
                            emit({ ok: false, error: message, hints: hints });
                        }
                        else {
                            runtime_js_1.defaultRuntime.error(message);
                        }
                        runtime_js_1.defaultRuntime.exit(1);
                    };
                    service = (0, node_service_js_1.resolveNodeService)();
                    loaded = false;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 2:
                    loaded = _e.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_6 = _e.sent();
                    fail("Node service check failed: ".concat(String(err_6)));
                    return [2 /*return*/];
                case 4:
                    if (!!loaded) return [3 /*break*/, 8];
                    hints = renderNodeServiceStartHints();
                    if (!(process.platform === "linux")) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, systemd_js_1.isSystemdUserServiceAvailable)().catch(function () { return false; })];
                case 5:
                    systemdAvailable = _e.sent();
                    if (!!systemdAvailable) return [3 /*break*/, 7];
                    _a = [__spreadArray([], hints, true)];
                    _b = systemd_hints_js_1.renderSystemdUnavailableHints;
                    _d = {};
                    return [4 /*yield*/, (0, wsl_js_1.isWSL)()];
                case 6:
                    hints = __spreadArray.apply(void 0, _a.concat([_b.apply(void 0, [(_d.wsl = _e.sent(), _d)]), true]));
                    _e.label = 7;
                case 7:
                    emit({
                        ok: true,
                        result: "not-loaded",
                        message: "Node service ".concat(service.notLoadedText, "."),
                        hints: hints,
                        service: (0, response_js_1.buildDaemonServiceSnapshot)(service, loaded),
                    });
                    if (!json) {
                        runtime_js_1.defaultRuntime.log("Node service ".concat(service.notLoadedText, "."));
                        for (_i = 0, hints_3 = hints; _i < hints_3.length; _i++) {
                            hint = hints_3[_i];
                            runtime_js_1.defaultRuntime.log("Start with: ".concat(hint));
                        }
                    }
                    return [2 /*return*/];
                case 8:
                    _e.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, service.restart({ env: process.env, stdout: stdout })];
                case 9:
                    _e.sent();
                    return [3 /*break*/, 11];
                case 10:
                    err_7 = _e.sent();
                    hints = renderNodeServiceStartHints();
                    fail("Node restart failed: ".concat(String(err_7)), hints);
                    return [2 /*return*/];
                case 11:
                    restarted = true;
                    _e.label = 12;
                case 12:
                    _e.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 13:
                    restarted = _e.sent();
                    return [3 /*break*/, 15];
                case 14:
                    _c = _e.sent();
                    restarted = true;
                    return [3 /*break*/, 15];
                case 15:
                    emit({
                        ok: true,
                        result: "restarted",
                        service: (0, response_js_1.buildDaemonServiceSnapshot)(service, restarted),
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function runNodeDaemonStop() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var json, stdout, emit, fail, service, loaded, err_8, err_9, stopped, _a;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    json = Boolean(opts.json);
                    stdout = json ? (0, response_js_1.createNullWriter)() : process.stdout;
                    emit = function (payload) {
                        if (!json) {
                            return;
                        }
                        (0, response_js_1.emitDaemonActionJson)(__assign({ action: "stop" }, payload));
                    };
                    fail = function (message) {
                        if (json) {
                            emit({ ok: false, error: message });
                        }
                        else {
                            runtime_js_1.defaultRuntime.error(message);
                        }
                        runtime_js_1.defaultRuntime.exit(1);
                    };
                    service = (0, node_service_js_1.resolveNodeService)();
                    loaded = false;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 2:
                    loaded = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_8 = _b.sent();
                    fail("Node service check failed: ".concat(String(err_8)));
                    return [2 /*return*/];
                case 4:
                    if (!loaded) {
                        emit({
                            ok: true,
                            result: "not-loaded",
                            message: "Node service ".concat(service.notLoadedText, "."),
                            service: (0, response_js_1.buildDaemonServiceSnapshot)(service, loaded),
                        });
                        if (!json) {
                            runtime_js_1.defaultRuntime.log("Node service ".concat(service.notLoadedText, "."));
                        }
                        return [2 /*return*/];
                    }
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, service.stop({ env: process.env, stdout: stdout })];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_9 = _b.sent();
                    fail("Node stop failed: ".concat(String(err_9)));
                    return [2 /*return*/];
                case 8:
                    stopped = false;
                    _b.label = 9;
                case 9:
                    _b.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 10:
                    stopped = _b.sent();
                    return [3 /*break*/, 12];
                case 11:
                    _a = _b.sent();
                    stopped = false;
                    return [3 /*break*/, 12];
                case 12:
                    emit({
                        ok: true,
                        result: "stopped",
                        service: (0, response_js_1.buildDaemonServiceSnapshot)(service, stopped),
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function runNodeDaemonStatus() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var json, service, _a, loaded, command, runtime, payload, rich, label, accent, infoText, okText, warnText, errorText, serviceStatus, runtimeLine, runtimeStatus, runtimeColor, _i, _b, hint, baseEnv, hintEnv, _c, _d, hint, _e, _f, hint;
        var _g, _h, _j, _k;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    json = Boolean(opts.json);
                    service = (0, node_service_js_1.resolveNodeService)();
                    return [4 /*yield*/, Promise.all([
                            service.isLoaded({ env: process.env }).catch(function () { return false; }),
                            service.readCommand(process.env).catch(function () { return null; }),
                            service
                                .readRuntime(process.env)
                                .catch(function (err) { return ({ status: "unknown", detail: String(err) }); }),
                        ])];
                case 1:
                    _a = _l.sent(), loaded = _a[0], command = _a[1], runtime = _a[2];
                    payload = {
                        service: __assign(__assign({}, (0, response_js_1.buildDaemonServiceSnapshot)(service, loaded)), { command: command, runtime: runtime }),
                    };
                    if (json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(payload, null, 2));
                        return [2 /*return*/];
                    }
                    rich = (0, theme_js_1.isRich)();
                    label = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, value); };
                    accent = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.accent, value); };
                    infoText = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.info, value); };
                    okText = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.success, value); };
                    warnText = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.warn, value); };
                    errorText = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.error, value); };
                    serviceStatus = loaded ? okText(service.loadedText) : warnText(service.notLoadedText);
                    runtime_js_1.defaultRuntime.log("".concat(label("Service:"), " ").concat(accent(service.label), " (").concat(serviceStatus, ")"));
                    if ((_g = command === null || command === void 0 ? void 0 : command.programArguments) === null || _g === void 0 ? void 0 : _g.length) {
                        runtime_js_1.defaultRuntime.log("".concat(label("Command:"), " ").concat(infoText(command.programArguments.join(" "))));
                    }
                    if (command === null || command === void 0 ? void 0 : command.sourcePath) {
                        runtime_js_1.defaultRuntime.log("".concat(label("Service file:"), " ").concat(infoText(command.sourcePath)));
                    }
                    if (command === null || command === void 0 ? void 0 : command.workingDirectory) {
                        runtime_js_1.defaultRuntime.log("".concat(label("Working dir:"), " ").concat(infoText(command.workingDirectory)));
                    }
                    runtimeLine = (0, shared_js_1.formatRuntimeStatus)(runtime);
                    if (runtimeLine) {
                        runtimeStatus = (_h = runtime === null || runtime === void 0 ? void 0 : runtime.status) !== null && _h !== void 0 ? _h : "unknown";
                        runtimeColor = runtimeStatus === "running"
                            ? theme_js_1.theme.success
                            : runtimeStatus === "stopped"
                                ? theme_js_1.theme.error
                                : runtimeStatus === "unknown"
                                    ? theme_js_1.theme.muted
                                    : theme_js_1.theme.warn;
                        runtime_js_1.defaultRuntime.log("".concat(label("Runtime:"), " ").concat((0, theme_js_1.colorize)(rich, runtimeColor, runtimeLine)));
                    }
                    if (!loaded) {
                        runtime_js_1.defaultRuntime.log("");
                        for (_i = 0, _b = renderNodeServiceStartHints(); _i < _b.length; _i++) {
                            hint = _b[_i];
                            runtime_js_1.defaultRuntime.log("".concat(warnText("Start with:"), " ").concat(infoText(hint)));
                        }
                        return [2 /*return*/];
                    }
                    baseEnv = __assign(__assign({}, process.env), ((_j = command === null || command === void 0 ? void 0 : command.environment) !== null && _j !== void 0 ? _j : undefined));
                    hintEnv = __assign(__assign({}, baseEnv), { OPENCLAW_LOG_PREFIX: (_k = baseEnv.OPENCLAW_LOG_PREFIX) !== null && _k !== void 0 ? _k : "node" });
                    if (runtime === null || runtime === void 0 ? void 0 : runtime.missingUnit) {
                        runtime_js_1.defaultRuntime.error(errorText("Service unit not found."));
                        for (_c = 0, _d = buildNodeRuntimeHints(hintEnv); _c < _d.length; _c++) {
                            hint = _d[_c];
                            runtime_js_1.defaultRuntime.error(errorText(hint));
                        }
                        return [2 /*return*/];
                    }
                    if ((runtime === null || runtime === void 0 ? void 0 : runtime.status) === "stopped") {
                        runtime_js_1.defaultRuntime.error(errorText("Service is loaded but not running."));
                        for (_e = 0, _f = buildNodeRuntimeHints(hintEnv); _e < _f.length; _e++) {
                            hint = _f[_e];
                            runtime_js_1.defaultRuntime.error(errorText(hint));
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
