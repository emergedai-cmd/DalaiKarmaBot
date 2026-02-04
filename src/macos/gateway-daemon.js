#!/usr/bin/env node
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
var node_process_1 = require("node:process");
var BUNDLED_VERSION = (typeof __OPENCLAW_VERSION__ === "string" && __OPENCLAW_VERSION__) ||
    node_process_1.default.env.OPENCLAW_BUNDLED_VERSION ||
    "0.0.0";
function argValue(args, flag) {
    var idx = args.indexOf(flag);
    if (idx < 0) {
        return undefined;
    }
    var value = args[idx + 1];
    return value && !value.startsWith("-") ? value : undefined;
}
function hasFlag(args, flag) {
    return args.includes(flag);
}
var args = node_process_1.default.argv.slice(2);
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var mod, Long_1, _a, loadConfig, startGatewayServer, setGatewayWsLogStyle, setVerbose, _b, acquireGatewayLock, GatewayLockError, _c, consumeGatewaySigusr1RestartAuthorization, isGatewaySigusr1RestartExternallyAllowed, defaultRuntime, _d, enableConsoleCapture, setConsoleTimestampPrefix, wsLogRaw, wsLogStyle, cfg, portRaw, port, bindRaw, bind, token, server, lock, shuttingDown, forceExitTimer, restartResolver, cleanupSignals, request, onSigterm, onSigint, onSigusr1, err_1, err_2;
        var _this = this;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    if (hasFlag(args, "--version") || hasFlag(args, "-v")) {
                        // Match `openclaw --version` behavior for Swift env/version checks.
                        // Keep output a single line.
                        console.log(BUNDLED_VERSION);
                        node_process_1.default.exit(0);
                    }
                    if (!(typeof node_process_1.default.versions.bun === "string")) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("long"); })];
                case 1:
                    mod = _r.sent();
                    Long_1 = (_e = mod.default) !== null && _e !== void 0 ? _e : mod;
                    globalThis.Long = Long_1;
                    _r.label = 2;
                case 2: return [4 /*yield*/, Promise.all([
                        Promise.resolve().then(function () { return require("../config/config.js"); }),
                        Promise.resolve().then(function () { return require("../gateway/server.js"); }),
                        Promise.resolve().then(function () { return require("../gateway/ws-logging.js"); }),
                        Promise.resolve().then(function () { return require("../globals.js"); }),
                        Promise.resolve().then(function () { return require("../infra/gateway-lock.js"); }),
                        Promise.resolve().then(function () { return require("../infra/restart.js"); }),
                        Promise.resolve().then(function () { return require("../runtime.js"); }),
                        Promise.resolve().then(function () { return require("../logging.js"); }),
                    ])];
                case 3:
                    _a = _r.sent(), loadConfig = _a[0].loadConfig, startGatewayServer = _a[1].startGatewayServer, setGatewayWsLogStyle = _a[2].setGatewayWsLogStyle, setVerbose = _a[3].setVerbose, _b = _a[4], acquireGatewayLock = _b.acquireGatewayLock, GatewayLockError = _b.GatewayLockError, _c = _a[5], consumeGatewaySigusr1RestartAuthorization = _c.consumeGatewaySigusr1RestartAuthorization, isGatewaySigusr1RestartExternallyAllowed = _c.isGatewaySigusr1RestartExternallyAllowed, defaultRuntime = _a[6].defaultRuntime, _d = _a[7], enableConsoleCapture = _d.enableConsoleCapture, setConsoleTimestampPrefix = _d.setConsoleTimestampPrefix;
                    enableConsoleCapture();
                    setConsoleTimestampPrefix(true);
                    setVerbose(hasFlag(args, "--verbose"));
                    wsLogRaw = hasFlag(args, "--compact") ? "compact" : argValue(args, "--ws-log");
                    wsLogStyle = wsLogRaw === "compact" ? "compact" : wsLogRaw === "full" ? "full" : "auto";
                    setGatewayWsLogStyle(wsLogStyle);
                    cfg = loadConfig();
                    portRaw = (_k = (_h = (_g = (_f = argValue(args, "--port")) !== null && _f !== void 0 ? _f : node_process_1.default.env.OPENCLAW_GATEWAY_PORT) !== null && _g !== void 0 ? _g : node_process_1.default.env.CLAWDBOT_GATEWAY_PORT) !== null && _h !== void 0 ? _h : (typeof ((_j = cfg.gateway) === null || _j === void 0 ? void 0 : _j.port) === "number" ? String(cfg.gateway.port) : "")) !== null && _k !== void 0 ? _k : "18789";
                    port = Number.parseInt(portRaw, 10);
                    if (Number.isNaN(port) || port <= 0) {
                        defaultRuntime.error("Invalid --port (".concat(portRaw, ")"));
                        node_process_1.default.exit(1);
                    }
                    bindRaw = (_q = (_o = (_m = (_l = argValue(args, "--bind")) !== null && _l !== void 0 ? _l : node_process_1.default.env.OPENCLAW_GATEWAY_BIND) !== null && _m !== void 0 ? _m : node_process_1.default.env.CLAWDBOT_GATEWAY_BIND) !== null && _o !== void 0 ? _o : (_p = cfg.gateway) === null || _p === void 0 ? void 0 : _p.bind) !== null && _q !== void 0 ? _q : "loopback";
                    bind = bindRaw === "loopback" ||
                        bindRaw === "lan" ||
                        bindRaw === "auto" ||
                        bindRaw === "custom" ||
                        bindRaw === "tailnet"
                        ? bindRaw
                        : null;
                    if (!bind) {
                        defaultRuntime.error('Invalid --bind (use "loopback", "lan", "tailnet", "auto", or "custom")');
                        node_process_1.default.exit(1);
                    }
                    token = argValue(args, "--token");
                    if (token) {
                        node_process_1.default.env.OPENCLAW_GATEWAY_TOKEN = token;
                    }
                    server = null;
                    lock = null;
                    shuttingDown = false;
                    forceExitTimer = null;
                    restartResolver = null;
                    cleanupSignals = function () {
                        node_process_1.default.removeListener("SIGTERM", onSigterm);
                        node_process_1.default.removeListener("SIGINT", onSigint);
                        node_process_1.default.removeListener("SIGUSR1", onSigusr1);
                    };
                    request = function (action, signal) {
                        if (shuttingDown) {
                            defaultRuntime.log("gateway: received ".concat(signal, " during shutdown; ignoring"));
                            return;
                        }
                        shuttingDown = true;
                        var isRestart = action === "restart";
                        defaultRuntime.log("gateway: received ".concat(signal, "; ").concat(isRestart ? "restarting" : "shutting down"));
                        forceExitTimer = setTimeout(function () {
                            defaultRuntime.error("gateway: shutdown timed out; exiting without full cleanup");
                            cleanupSignals();
                            node_process_1.default.exit(0);
                        }, 5000);
                        void (function () { return __awaiter(_this, void 0, void 0, function () {
                            var err_3;
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
                                        err_3 = _a.sent();
                                        defaultRuntime.error("gateway: shutdown error: ".concat(String(err_3)));
                                        return [3 /*break*/, 4];
                                    case 3:
                                        if (forceExitTimer) {
                                            clearTimeout(forceExitTimer);
                                        }
                                        server = null;
                                        if (isRestart) {
                                            shuttingDown = false;
                                            restartResolver === null || restartResolver === void 0 ? void 0 : restartResolver();
                                        }
                                        else {
                                            cleanupSignals();
                                            node_process_1.default.exit(0);
                                        }
                                        return [7 /*endfinally*/];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); })();
                    };
                    onSigterm = function () {
                        defaultRuntime.log("gateway: signal SIGTERM received");
                        request("stop", "SIGTERM");
                    };
                    onSigint = function () {
                        defaultRuntime.log("gateway: signal SIGINT received");
                        request("stop", "SIGINT");
                    };
                    onSigusr1 = function () {
                        defaultRuntime.log("gateway: signal SIGUSR1 received");
                        var authorized = consumeGatewaySigusr1RestartAuthorization();
                        if (!authorized && !isGatewaySigusr1RestartExternallyAllowed()) {
                            defaultRuntime.log("gateway: SIGUSR1 restart ignored (not authorized; enable commands.restart or use gateway tool).");
                            return;
                        }
                        request("restart", "SIGUSR1");
                    };
                    node_process_1.default.on("SIGTERM", onSigterm);
                    node_process_1.default.on("SIGINT", onSigint);
                    node_process_1.default.on("SIGUSR1", onSigusr1);
                    _r.label = 4;
                case 4:
                    _r.trys.push([4, , 15, 17]);
                    _r.label = 5;
                case 5:
                    _r.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, acquireGatewayLock()];
                case 6:
                    lock = _r.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _r.sent();
                    if (err_1 instanceof GatewayLockError) {
                        defaultRuntime.error("Gateway start blocked: ".concat(err_1.message));
                        node_process_1.default.exit(1);
                    }
                    throw err_1;
                case 8:
                    if (!true) return [3 /*break*/, 14];
                    _r.label = 9;
                case 9:
                    _r.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, startGatewayServer(port, { bind: bind })];
                case 10:
                    server = _r.sent();
                    return [3 /*break*/, 12];
                case 11:
                    err_2 = _r.sent();
                    cleanupSignals();
                    defaultRuntime.error("Gateway failed to start: ".concat(String(err_2)));
                    node_process_1.default.exit(1);
                    return [3 /*break*/, 12];
                case 12: return [4 /*yield*/, new Promise(function (resolve) {
                        restartResolver = resolve;
                    })];
                case 13:
                    _r.sent();
                    return [3 /*break*/, 8];
                case 14: return [3 /*break*/, 17];
                case 15: return [4 /*yield*/, (lock === null || lock === void 0 ? void 0 : lock.release())];
                case 16:
                    _r.sent();
                    cleanupSignals();
                    return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    });
}
void main().catch(function (err) {
    var _a;
    console.error("[openclaw] Gateway daemon failed:", err instanceof Error ? ((_a = err.stack) !== null && _a !== void 0 ? _a : err.message) : err);
    node_process_1.default.exit(1);
});
