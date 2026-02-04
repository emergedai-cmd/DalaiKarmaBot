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
exports.runDaemonUninstall = runDaemonUninstall;
exports.runDaemonStart = runDaemonStart;
exports.runDaemonStop = runDaemonStop;
exports.runDaemonRestart = runDaemonRestart;
var paths_js_1 = require("../../config/paths.js");
var service_js_1 = require("../../daemon/service.js");
var systemd_hints_js_1 = require("../../daemon/systemd-hints.js");
var systemd_js_1 = require("../../daemon/systemd.js");
var wsl_js_1 = require("../../infra/wsl.js");
var runtime_js_1 = require("../../runtime.js");
var response_js_1 = require("./response.js");
var shared_js_1 = require("./shared.js");
function runDaemonUninstall() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var json, stdout, emit, fail, service, loaded, _a, _b, err_1, _c;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_d) {
            switch (_d.label) {
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
                    service = (0, service_js_1.resolveGatewayService)();
                    loaded = false;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 2:
                    loaded = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _d.sent();
                    loaded = false;
                    return [3 /*break*/, 4];
                case 4:
                    if (!loaded) return [3 /*break*/, 8];
                    _d.label = 5;
                case 5:
                    _d.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, service.stop({ env: process.env, stdout: stdout })];
                case 6:
                    _d.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _b = _d.sent();
                    return [3 /*break*/, 8];
                case 8:
                    _d.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, service.uninstall({ env: process.env, stdout: stdout })];
                case 9:
                    _d.sent();
                    return [3 /*break*/, 11];
                case 10:
                    err_1 = _d.sent();
                    fail("Gateway uninstall failed: ".concat(String(err_1)));
                    return [2 /*return*/];
                case 11:
                    loaded = false;
                    _d.label = 12;
                case 12:
                    _d.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 13:
                    loaded = _d.sent();
                    return [3 /*break*/, 15];
                case 14:
                    _c = _d.sent();
                    loaded = false;
                    return [3 /*break*/, 15];
                case 15:
                    if (loaded) {
                        fail("Gateway service still loaded after uninstall.");
                        return [2 /*return*/];
                    }
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
function runDaemonStart() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var json, stdout, emit, fail, service, loaded, err_2, hints, systemdAvailable, _a, _b, _i, hints_1, hint, err_3, hints, started, _c;
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
                    err_2 = _e.sent();
                    fail("Gateway service check failed: ".concat(String(err_2)));
                    return [2 /*return*/];
                case 4:
                    if (!!loaded) return [3 /*break*/, 8];
                    hints = (0, shared_js_1.renderGatewayServiceStartHints)();
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
                        message: "Gateway service ".concat(service.notLoadedText, "."),
                        hints: hints,
                        service: (0, response_js_1.buildDaemonServiceSnapshot)(service, loaded),
                    });
                    if (!json) {
                        runtime_js_1.defaultRuntime.log("Gateway service ".concat(service.notLoadedText, "."));
                        for (_i = 0, hints_1 = hints; _i < hints_1.length; _i++) {
                            hint = hints_1[_i];
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
                    err_3 = _e.sent();
                    hints = (0, shared_js_1.renderGatewayServiceStartHints)();
                    fail("Gateway start failed: ".concat(String(err_3)), hints);
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
function runDaemonStop() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var json, stdout, emit, fail, service, loaded, err_4, err_5, stopped, _a;
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
                    service = (0, service_js_1.resolveGatewayService)();
                    loaded = false;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 2:
                    loaded = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _b.sent();
                    fail("Gateway service check failed: ".concat(String(err_4)));
                    return [2 /*return*/];
                case 4:
                    if (!loaded) {
                        emit({
                            ok: true,
                            result: "not-loaded",
                            message: "Gateway service ".concat(service.notLoadedText, "."),
                            service: (0, response_js_1.buildDaemonServiceSnapshot)(service, loaded),
                        });
                        if (!json) {
                            runtime_js_1.defaultRuntime.log("Gateway service ".concat(service.notLoadedText, "."));
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
                    err_5 = _b.sent();
                    fail("Gateway stop failed: ".concat(String(err_5)));
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
/**
 * Restart the gateway service service.
 * @returns `true` if restart succeeded, `false` if the service was not loaded.
 * Throws/exits on check or restart failures.
 */
function runDaemonRestart() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var json, stdout, emit, fail, service, loaded, err_6, hints, systemdAvailable, _a, _b, _i, hints_2, hint, restarted, _c, err_7, hints;
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
                    err_6 = _e.sent();
                    fail("Gateway service check failed: ".concat(String(err_6)));
                    return [2 /*return*/, false];
                case 4:
                    if (!!loaded) return [3 /*break*/, 8];
                    hints = (0, shared_js_1.renderGatewayServiceStartHints)();
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
                        message: "Gateway service ".concat(service.notLoadedText, "."),
                        hints: hints,
                        service: (0, response_js_1.buildDaemonServiceSnapshot)(service, loaded),
                    });
                    if (!json) {
                        runtime_js_1.defaultRuntime.log("Gateway service ".concat(service.notLoadedText, "."));
                        for (_i = 0, hints_2 = hints; _i < hints_2.length; _i++) {
                            hint = hints_2[_i];
                            runtime_js_1.defaultRuntime.log("Start with: ".concat(hint));
                        }
                    }
                    return [2 /*return*/, false];
                case 8:
                    _e.trys.push([8, 14, , 15]);
                    return [4 /*yield*/, service.restart({ env: process.env, stdout: stdout })];
                case 9:
                    _e.sent();
                    restarted = true;
                    _e.label = 10;
                case 10:
                    _e.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 11:
                    restarted = _e.sent();
                    return [3 /*break*/, 13];
                case 12:
                    _c = _e.sent();
                    restarted = true;
                    return [3 /*break*/, 13];
                case 13:
                    emit({
                        ok: true,
                        result: "restarted",
                        service: (0, response_js_1.buildDaemonServiceSnapshot)(service, restarted),
                    });
                    return [2 /*return*/, true];
                case 14:
                    err_7 = _e.sent();
                    hints = (0, shared_js_1.renderGatewayServiceStartHints)();
                    fail("Gateway restart failed: ".concat(String(err_7)), hints);
                    return [2 /*return*/, false];
                case 15: return [2 /*return*/];
            }
        });
    });
}
