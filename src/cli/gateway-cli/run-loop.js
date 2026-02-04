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
exports.runGatewayLoop = runGatewayLoop;
var gateway_lock_js_1 = require("../../infra/gateway-lock.js");
var restart_js_1 = require("../../infra/restart.js");
var subsystem_js_1 = require("../../logging/subsystem.js");
var gatewayLog = (0, subsystem_js_1.createSubsystemLogger)("gateway");
function runGatewayLoop(params) {
    return __awaiter(this, void 0, void 0, function () {
        var lock, server, shuttingDown, restartResolver, cleanupSignals, request, onSigterm, onSigint, onSigusr1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, gateway_lock_js_1.acquireGatewayLock)()];
                case 1:
                    lock = _a.sent();
                    server = null;
                    shuttingDown = false;
                    restartResolver = null;
                    cleanupSignals = function () {
                        process.removeListener("SIGTERM", onSigterm);
                        process.removeListener("SIGINT", onSigint);
                        process.removeListener("SIGUSR1", onSigusr1);
                    };
                    request = function (action, signal) {
                        if (shuttingDown) {
                            gatewayLog.info("received ".concat(signal, " during shutdown; ignoring"));
                            return;
                        }
                        shuttingDown = true;
                        var isRestart = action === "restart";
                        gatewayLog.info("received ".concat(signal, "; ").concat(isRestart ? "restarting" : "shutting down"));
                        var forceExitTimer = setTimeout(function () {
                            gatewayLog.error("shutdown timed out; exiting without full cleanup");
                            cleanupSignals();
                            params.runtime.exit(0);
                        }, 5000);
                        void (function () { return __awaiter(_this, void 0, void 0, function () {
                            var err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, 3, 4]);
                                        return [4 /*yield*/, (server === null || server === void 0 ? void 0 : server.close({
                                                reason: isRestart ? "gateway restarting" : "gateway stopping",
                                                restartExpectedMs: isRestart ? 1500 : null,
                                            }))];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 4];
                                    case 2:
                                        err_1 = _a.sent();
                                        gatewayLog.error("shutdown error: ".concat(String(err_1)));
                                        return [3 /*break*/, 4];
                                    case 3:
                                        clearTimeout(forceExitTimer);
                                        server = null;
                                        if (isRestart) {
                                            shuttingDown = false;
                                            restartResolver === null || restartResolver === void 0 ? void 0 : restartResolver();
                                        }
                                        else {
                                            cleanupSignals();
                                            params.runtime.exit(0);
                                        }
                                        return [7 /*endfinally*/];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); })();
                    };
                    onSigterm = function () {
                        gatewayLog.info("signal SIGTERM received");
                        request("stop", "SIGTERM");
                    };
                    onSigint = function () {
                        gatewayLog.info("signal SIGINT received");
                        request("stop", "SIGINT");
                    };
                    onSigusr1 = function () {
                        gatewayLog.info("signal SIGUSR1 received");
                        var authorized = (0, restart_js_1.consumeGatewaySigusr1RestartAuthorization)();
                        if (!authorized && !(0, restart_js_1.isGatewaySigusr1RestartExternallyAllowed)()) {
                            gatewayLog.warn("SIGUSR1 restart ignored (not authorized; enable commands.restart or use gateway tool).");
                            return;
                        }
                        request("restart", "SIGUSR1");
                    };
                    process.on("SIGTERM", onSigterm);
                    process.on("SIGINT", onSigint);
                    process.on("SIGUSR1", onSigusr1);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 7, 9]);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 6];
                    return [4 /*yield*/, params.start()];
                case 4:
                    server = _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            restartResolver = resolve;
                        })];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, (lock === null || lock === void 0 ? void 0 : lock.release())];
                case 8:
                    _a.sent();
                    cleanupSignals();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
