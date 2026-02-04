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
exports.runDaemonInstall = runDaemonInstall;
var daemon_install_helpers_js_1 = require("../../commands/daemon-install-helpers.js");
var daemon_runtime_js_1 = require("../../commands/daemon-runtime.js");
var config_js_1 = require("../../config/config.js");
var paths_js_1 = require("../../config/paths.js");
var service_js_1 = require("../../daemon/service.js");
var runtime_js_1 = require("../../runtime.js");
var command_format_js_1 = require("../command-format.js");
var response_js_1 = require("./response.js");
var shared_js_1 = require("./shared.js");
function runDaemonInstall(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var json, warnings, stdout, emit, fail, cfg, portOverride, port, runtimeRaw, service, loaded, err_1, _a, programArguments, workingDirectory, environment, err_2, installed, _b;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
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
                    fail = function (message) {
                        if (json) {
                            emit({ ok: false, error: message, warnings: warnings.length ? warnings : undefined });
                        }
                        else {
                            runtime_js_1.defaultRuntime.error(message);
                        }
                        runtime_js_1.defaultRuntime.exit(1);
                    };
                    if ((0, paths_js_1.resolveIsNixMode)(process.env)) {
                        fail("Nix mode detected; service install is disabled.");
                        return [2 /*return*/];
                    }
                    cfg = (0, config_js_1.loadConfig)();
                    portOverride = (0, shared_js_1.parsePort)(opts.port);
                    if (opts.port !== undefined && portOverride === null) {
                        fail("Invalid port");
                        return [2 /*return*/];
                    }
                    port = portOverride !== null && portOverride !== void 0 ? portOverride : (0, config_js_1.resolveGatewayPort)(cfg);
                    if (!Number.isFinite(port) || port <= 0) {
                        fail("Invalid port");
                        return [2 /*return*/];
                    }
                    runtimeRaw = opts.runtime ? String(opts.runtime) : daemon_runtime_js_1.DEFAULT_GATEWAY_DAEMON_RUNTIME;
                    if (!(0, daemon_runtime_js_1.isGatewayDaemonRuntime)(runtimeRaw)) {
                        fail('Invalid --runtime (use "node" or "bun")');
                        return [2 /*return*/];
                    }
                    service = (0, service_js_1.resolveGatewayService)();
                    loaded = false;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 2:
                    loaded = _e.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _e.sent();
                    fail("Gateway service check failed: ".concat(String(err_1)));
                    return [2 /*return*/];
                case 4:
                    if (loaded) {
                        if (!opts.force) {
                            emit({
                                ok: true,
                                result: "already-installed",
                                message: "Gateway service already ".concat(service.loadedText, "."),
                                service: (0, response_js_1.buildDaemonServiceSnapshot)(service, loaded),
                                warnings: warnings.length ? warnings : undefined,
                            });
                            if (!json) {
                                runtime_js_1.defaultRuntime.log("Gateway service already ".concat(service.loadedText, "."));
                                runtime_js_1.defaultRuntime.log("Reinstall with: ".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway install --force")));
                            }
                            return [2 /*return*/];
                        }
                    }
                    return [4 /*yield*/, (0, daemon_install_helpers_js_1.buildGatewayInstallPlan)({
                            env: process.env,
                            port: port,
                            token: opts.token || ((_d = (_c = cfg.gateway) === null || _c === void 0 ? void 0 : _c.auth) === null || _d === void 0 ? void 0 : _d.token) || process.env.OPENCLAW_GATEWAY_TOKEN,
                            runtime: runtimeRaw,
                            warn: function (message) {
                                if (json) {
                                    warnings.push(message);
                                }
                                else {
                                    runtime_js_1.defaultRuntime.log(message);
                                }
                            },
                            config: cfg,
                        })];
                case 5:
                    _a = _e.sent(), programArguments = _a.programArguments, workingDirectory = _a.workingDirectory, environment = _a.environment;
                    _e.label = 6;
                case 6:
                    _e.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, service.install({
                            env: process.env,
                            stdout: stdout,
                            programArguments: programArguments,
                            workingDirectory: workingDirectory,
                            environment: environment,
                        })];
                case 7:
                    _e.sent();
                    return [3 /*break*/, 9];
                case 8:
                    err_2 = _e.sent();
                    fail("Gateway install failed: ".concat(String(err_2)));
                    return [2 /*return*/];
                case 9:
                    installed = true;
                    _e.label = 10;
                case 10:
                    _e.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 11:
                    installed = _e.sent();
                    return [3 /*break*/, 13];
                case 12:
                    _b = _e.sent();
                    installed = true;
                    return [3 /*break*/, 13];
                case 13:
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
