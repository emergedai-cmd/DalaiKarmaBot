"use strict";
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
exports.maybeInstallDaemon = maybeInstallDaemon;
var progress_js_1 = require("../cli/progress.js");
var config_js_1 = require("../config/config.js");
var service_js_1 = require("../daemon/service.js");
var note_js_1 = require("../terminal/note.js");
var configure_shared_js_1 = require("./configure.shared.js");
var daemon_install_helpers_js_1 = require("./daemon-install-helpers.js");
var daemon_runtime_js_1 = require("./daemon-runtime.js");
var onboard_helpers_js_1 = require("./onboard-helpers.js");
var systemd_linger_js_1 = require("./systemd-linger.js");
function maybeInstallDaemon(params) {
    return __awaiter(this, void 0, void 0, function () {
        var service, loaded, shouldCheckLinger, shouldInstall, daemonRuntime, action, _a, installError_1, _b;
        var _this = this;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    service = (0, service_js_1.resolveGatewayService)();
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 1:
                    loaded = _f.sent();
                    shouldCheckLinger = false;
                    shouldInstall = true;
                    daemonRuntime = (_c = params.daemonRuntime) !== null && _c !== void 0 ? _c : daemon_runtime_js_1.DEFAULT_GATEWAY_DAEMON_RUNTIME;
                    if (!loaded) return [3 /*break*/, 6];
                    _a = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.select)({
                            message: "Gateway service already installed",
                            options: [
                                { value: "restart", label: "Restart" },
                                { value: "reinstall", label: "Reinstall" },
                                { value: "skip", label: "Skip" },
                            ],
                        })];
                case 2:
                    action = _a.apply(void 0, [_f.sent(), params.runtime]);
                    if (!(action === "restart")) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, progress_js_1.withProgress)({ label: "Gateway service", indeterminate: true, delayMs: 0 }, function (progress) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        progress.setLabel("Restarting Gateway service…");
                                        return [4 /*yield*/, service.restart({
                                                env: process.env,
                                                stdout: process.stdout,
                                            })];
                                    case 1:
                                        _a.sent();
                                        progress.setLabel("Gateway service restarted.");
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 3:
                    _f.sent();
                    shouldCheckLinger = true;
                    shouldInstall = false;
                    _f.label = 4;
                case 4:
                    if (action === "skip") {
                        return [2 /*return*/];
                    }
                    if (!(action === "reinstall")) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, progress_js_1.withProgress)({ label: "Gateway service", indeterminate: true, delayMs: 0 }, function (progress) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        progress.setLabel("Uninstalling Gateway service…");
                                        return [4 /*yield*/, service.uninstall({ env: process.env, stdout: process.stdout })];
                                    case 1:
                                        _a.sent();
                                        progress.setLabel("Gateway service uninstalled.");
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 5:
                    _f.sent();
                    _f.label = 6;
                case 6:
                    if (!shouldInstall) return [3 /*break*/, 11];
                    installError_1 = null;
                    if (!!params.daemonRuntime) return [3 /*break*/, 9];
                    if (!(daemon_runtime_js_1.GATEWAY_DAEMON_RUNTIME_OPTIONS.length === 1)) return [3 /*break*/, 7];
                    daemonRuntime = (_e = (_d = daemon_runtime_js_1.GATEWAY_DAEMON_RUNTIME_OPTIONS[0]) === null || _d === void 0 ? void 0 : _d.value) !== null && _e !== void 0 ? _e : daemon_runtime_js_1.DEFAULT_GATEWAY_DAEMON_RUNTIME;
                    return [3 /*break*/, 9];
                case 7:
                    _b = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.select)({
                            message: "Gateway service runtime",
                            options: daemon_runtime_js_1.GATEWAY_DAEMON_RUNTIME_OPTIONS,
                            initialValue: daemon_runtime_js_1.DEFAULT_GATEWAY_DAEMON_RUNTIME,
                        })];
                case 8:
                    daemonRuntime = _b.apply(void 0, [_f.sent(), params.runtime]);
                    _f.label = 9;
                case 9: return [4 /*yield*/, (0, progress_js_1.withProgress)({ label: "Gateway service", indeterminate: true, delayMs: 0 }, function (progress) { return __awaiter(_this, void 0, void 0, function () {
                        var cfg, _a, programArguments, workingDirectory, environment, err_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    progress.setLabel("Preparing Gateway service…");
                                    cfg = (0, config_js_1.loadConfig)();
                                    return [4 /*yield*/, (0, daemon_install_helpers_js_1.buildGatewayInstallPlan)({
                                            env: process.env,
                                            port: params.port,
                                            token: params.gatewayToken,
                                            runtime: daemonRuntime,
                                            warn: function (message, title) { return (0, note_js_1.note)(message, title); },
                                            config: cfg,
                                        })];
                                case 1:
                                    _a = _b.sent(), programArguments = _a.programArguments, workingDirectory = _a.workingDirectory, environment = _a.environment;
                                    progress.setLabel("Installing Gateway service…");
                                    _b.label = 2;
                                case 2:
                                    _b.trys.push([2, 4, , 5]);
                                    return [4 /*yield*/, service.install({
                                            env: process.env,
                                            stdout: process.stdout,
                                            programArguments: programArguments,
                                            workingDirectory: workingDirectory,
                                            environment: environment,
                                        })];
                                case 3:
                                    _b.sent();
                                    progress.setLabel("Gateway service installed.");
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_1 = _b.sent();
                                    installError_1 = err_1 instanceof Error ? err_1.message : String(err_1);
                                    progress.setLabel("Gateway service install failed.");
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 10:
                    _f.sent();
                    if (installError_1) {
                        (0, note_js_1.note)("Gateway service install failed: " + installError_1, "Gateway");
                        (0, note_js_1.note)((0, daemon_install_helpers_js_1.gatewayInstallErrorHint)(), "Gateway");
                        return [2 /*return*/];
                    }
                    shouldCheckLinger = true;
                    _f.label = 11;
                case 11:
                    if (!shouldCheckLinger) return [3 /*break*/, 13];
                    return [4 /*yield*/, (0, systemd_linger_js_1.ensureSystemdUserLingerInteractive)({
                            runtime: params.runtime,
                            prompter: {
                                confirm: function (p) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = onboard_helpers_js_1.guardCancel;
                                            return [4 /*yield*/, (0, configure_shared_js_1.confirm)(p)];
                                        case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), params.runtime])];
                                    }
                                }); }); },
                                note: note_js_1.note,
                            },
                            reason: "Linux installs use a systemd user service. Without lingering, systemd stops the user session on logout/idle and kills the Gateway.",
                            requireConfirm: true,
                        })];
                case 12:
                    _f.sent();
                    _f.label = 13;
                case 13: return [2 /*return*/];
            }
        });
    });
}
