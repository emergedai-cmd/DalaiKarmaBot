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
exports.addGatewayRunCommand = addGatewayRunCommand;
var node_fs_1 = require("node:fs");
var config_js_1 = require("../../config/config.js");
var auth_js_1 = require("../../gateway/auth.js");
var server_js_1 = require("../../gateway/server.js");
var ws_logging_js_1 = require("../../gateway/ws-logging.js");
var globals_js_1 = require("../../globals.js");
var gateway_lock_js_1 = require("../../infra/gateway-lock.js");
var ports_js_1 = require("../../infra/ports.js");
var console_js_1 = require("../../logging/console.js");
var subsystem_js_1 = require("../../logging/subsystem.js");
var runtime_js_1 = require("../../runtime.js");
var command_format_js_1 = require("../command-format.js");
var ports_js_2 = require("../ports.js");
var dev_js_1 = require("./dev.js");
var run_loop_js_1 = require("./run-loop.js");
var shared_js_1 = require("./shared.js");
var gatewayLog = (0, subsystem_js_1.createSubsystemLogger)("gateway");
function runGatewayCommand(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var isDevProfile, devMode, wsLogRaw, wsLogStyle, rawStreamPath, cfg, portOverride, port, _a, killed, waitedMs, escalatedToSigkill, _i, killed_1, proc, err_1, token, authModeRaw, authMode, tailscaleRaw, tailscaleMode, passwordRaw, tokenRaw, snapshot, configExists, mode, bindRaw, bind, miskeys, authConfig, resolvedAuth, resolvedAuthMode, tokenValue, passwordValue, hasToken, hasPassword, hasSharedSecret, authHints, err_2, errMessage, diagnostics, _b, _c, line, _d;
        var _this = this;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    isDevProfile = ((_e = process.env.OPENCLAW_PROFILE) === null || _e === void 0 ? void 0 : _e.trim().toLowerCase()) === "dev";
                    devMode = Boolean(opts.dev) || isDevProfile;
                    if (opts.reset && !devMode) {
                        runtime_js_1.defaultRuntime.error("Use --reset with --dev.");
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    (0, console_js_1.setConsoleTimestampPrefix)(true);
                    (0, globals_js_1.setVerbose)(Boolean(opts.verbose));
                    if (opts.claudeCliLogs) {
                        (0, console_js_1.setConsoleSubsystemFilter)(["agent/claude-cli"]);
                        process.env.OPENCLAW_CLAUDE_CLI_LOG_OUTPUT = "1";
                    }
                    wsLogRaw = (opts.compact ? "compact" : opts.wsLog);
                    wsLogStyle = wsLogRaw === "compact" ? "compact" : wsLogRaw === "full" ? "full" : "auto";
                    if (wsLogRaw !== undefined &&
                        wsLogRaw !== "auto" &&
                        wsLogRaw !== "compact" &&
                        wsLogRaw !== "full") {
                        runtime_js_1.defaultRuntime.error('Invalid --ws-log (use "auto", "full", "compact")');
                        runtime_js_1.defaultRuntime.exit(1);
                    }
                    (0, ws_logging_js_1.setGatewayWsLogStyle)(wsLogStyle);
                    if (opts.rawStream) {
                        process.env.OPENCLAW_RAW_STREAM = "1";
                    }
                    rawStreamPath = (0, shared_js_1.toOptionString)(opts.rawStreamPath);
                    if (rawStreamPath) {
                        process.env.OPENCLAW_RAW_STREAM_PATH = rawStreamPath;
                    }
                    if (!devMode) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, dev_js_1.ensureDevGatewayConfig)({ reset: Boolean(opts.reset) })];
                case 1:
                    _q.sent();
                    _q.label = 2;
                case 2:
                    cfg = (0, config_js_1.loadConfig)();
                    portOverride = (0, shared_js_1.parsePort)(opts.port);
                    if (opts.port !== undefined && portOverride === null) {
                        runtime_js_1.defaultRuntime.error("Invalid port");
                        runtime_js_1.defaultRuntime.exit(1);
                    }
                    port = portOverride !== null && portOverride !== void 0 ? portOverride : (0, config_js_1.resolveGatewayPort)(cfg);
                    if (!Number.isFinite(port) || port <= 0) {
                        runtime_js_1.defaultRuntime.error("Invalid port");
                        runtime_js_1.defaultRuntime.exit(1);
                    }
                    if (!opts.force) return [3 /*break*/, 6];
                    _q.label = 3;
                case 3:
                    _q.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, ports_js_2.forceFreePortAndWait)(port, {
                            timeoutMs: 2000,
                            intervalMs: 100,
                            sigtermTimeoutMs: 700,
                        })];
                case 4:
                    _a = _q.sent(), killed = _a.killed, waitedMs = _a.waitedMs, escalatedToSigkill = _a.escalatedToSigkill;
                    if (killed.length === 0) {
                        gatewayLog.info("force: no listeners on port ".concat(port));
                    }
                    else {
                        for (_i = 0, killed_1 = killed; _i < killed_1.length; _i++) {
                            proc = killed_1[_i];
                            gatewayLog.info("force: killed pid ".concat(proc.pid).concat(proc.command ? " (".concat(proc.command, ")") : "", " on port ").concat(port));
                        }
                        if (escalatedToSigkill) {
                            gatewayLog.info("force: escalated to SIGKILL while freeing port ".concat(port));
                        }
                        if (waitedMs > 0) {
                            gatewayLog.info("force: waited ".concat(waitedMs, "ms for port ").concat(port, " to free"));
                        }
                    }
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _q.sent();
                    runtime_js_1.defaultRuntime.error("Force: ".concat(String(err_1)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [2 /*return*/];
                case 6:
                    if (opts.token) {
                        token = (0, shared_js_1.toOptionString)(opts.token);
                        if (token) {
                            process.env.OPENCLAW_GATEWAY_TOKEN = token;
                        }
                    }
                    authModeRaw = (0, shared_js_1.toOptionString)(opts.auth);
                    authMode = authModeRaw === "token" || authModeRaw === "password" ? authModeRaw : null;
                    if (authModeRaw && !authMode) {
                        runtime_js_1.defaultRuntime.error('Invalid --auth (use "token" or "password")');
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    tailscaleRaw = (0, shared_js_1.toOptionString)(opts.tailscale);
                    tailscaleMode = tailscaleRaw === "off" || tailscaleRaw === "serve" || tailscaleRaw === "funnel"
                        ? tailscaleRaw
                        : null;
                    if (tailscaleRaw && !tailscaleMode) {
                        runtime_js_1.defaultRuntime.error('Invalid --tailscale (use "off", "serve", or "funnel")');
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    passwordRaw = (0, shared_js_1.toOptionString)(opts.password);
                    tokenRaw = (0, shared_js_1.toOptionString)(opts.token);
                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)().catch(function () { return null; })];
                case 7:
                    snapshot = _q.sent();
                    configExists = (_f = snapshot === null || snapshot === void 0 ? void 0 : snapshot.exists) !== null && _f !== void 0 ? _f : node_fs_1.default.existsSync(config_js_1.CONFIG_PATH);
                    mode = (_g = cfg.gateway) === null || _g === void 0 ? void 0 : _g.mode;
                    if (!opts.allowUnconfigured && mode !== "local") {
                        if (!configExists) {
                            runtime_js_1.defaultRuntime.error("Missing config. Run `".concat((0, command_format_js_1.formatCliCommand)("openclaw setup"), "` or set gateway.mode=local (or pass --allow-unconfigured)."));
                        }
                        else {
                            runtime_js_1.defaultRuntime.error("Gateway start blocked: set gateway.mode=local (current: ".concat(mode !== null && mode !== void 0 ? mode : "unset", ") or pass --allow-unconfigured."));
                        }
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    bindRaw = (_k = (_h = (0, shared_js_1.toOptionString)(opts.bind)) !== null && _h !== void 0 ? _h : (_j = cfg.gateway) === null || _j === void 0 ? void 0 : _j.bind) !== null && _k !== void 0 ? _k : "loopback";
                    bind = bindRaw === "loopback" ||
                        bindRaw === "lan" ||
                        bindRaw === "auto" ||
                        bindRaw === "custom" ||
                        bindRaw === "tailnet"
                        ? bindRaw
                        : null;
                    if (!bind) {
                        runtime_js_1.defaultRuntime.error('Invalid --bind (use "loopback", "lan", "tailnet", "auto", or "custom")');
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    miskeys = (0, shared_js_1.extractGatewayMiskeys)(snapshot === null || snapshot === void 0 ? void 0 : snapshot.parsed);
                    authConfig = __assign(__assign(__assign(__assign({}, (_l = cfg.gateway) === null || _l === void 0 ? void 0 : _l.auth), (authMode ? { mode: authMode } : {})), (passwordRaw ? { password: passwordRaw } : {})), (tokenRaw ? { token: tokenRaw } : {}));
                    resolvedAuth = (0, auth_js_1.resolveGatewayAuth)({
                        authConfig: authConfig,
                        env: process.env,
                        tailscaleMode: (_p = tailscaleMode !== null && tailscaleMode !== void 0 ? tailscaleMode : (_o = (_m = cfg.gateway) === null || _m === void 0 ? void 0 : _m.tailscale) === null || _o === void 0 ? void 0 : _o.mode) !== null && _p !== void 0 ? _p : "off",
                    });
                    resolvedAuthMode = resolvedAuth.mode;
                    tokenValue = resolvedAuth.token;
                    passwordValue = resolvedAuth.password;
                    hasToken = typeof tokenValue === "string" && tokenValue.trim().length > 0;
                    hasPassword = typeof passwordValue === "string" && passwordValue.trim().length > 0;
                    hasSharedSecret = (resolvedAuthMode === "token" && hasToken) || (resolvedAuthMode === "password" && hasPassword);
                    authHints = [];
                    if (miskeys.hasGatewayToken) {
                        authHints.push('Found "gateway.token" in config. Use "gateway.auth.token" instead.');
                    }
                    if (miskeys.hasRemoteToken) {
                        authHints.push('"gateway.remote.token" is for remote CLI calls; it does not enable local gateway auth.');
                    }
                    if (resolvedAuthMode === "token" && !hasToken && !resolvedAuth.allowTailscale) {
                        runtime_js_1.defaultRuntime.error(__spreadArray([
                            "Gateway auth is set to token, but no token is configured.",
                            "Set gateway.auth.token (or OPENCLAW_GATEWAY_TOKEN), or pass --token."
                        ], authHints, true).filter(Boolean)
                            .join("\n"));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    if (resolvedAuthMode === "password" && !hasPassword) {
                        runtime_js_1.defaultRuntime.error(__spreadArray([
                            "Gateway auth is set to password, but no password is configured.",
                            "Set gateway.auth.password (or OPENCLAW_GATEWAY_PASSWORD), or pass --password."
                        ], authHints, true).filter(Boolean)
                            .join("\n"));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    if (bind !== "loopback" && !hasSharedSecret) {
                        runtime_js_1.defaultRuntime.error(__spreadArray([
                            "Refusing to bind gateway to ".concat(bind, " without auth."),
                            "Set gateway.auth.token/password (or OPENCLAW_GATEWAY_TOKEN/OPENCLAW_GATEWAY_PASSWORD) or pass --token/--password."
                        ], authHints, true).filter(Boolean)
                            .join("\n"));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    _q.label = 8;
                case 8:
                    _q.trys.push([8, 10, , 17]);
                    return [4 /*yield*/, (0, run_loop_js_1.runGatewayLoop)({
                            runtime: runtime_js_1.defaultRuntime,
                            start: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, (0, server_js_1.startGatewayServer)(port, {
                                                bind: bind,
                                                auth: authMode || passwordRaw || tokenRaw || authModeRaw
                                                    ? {
                                                        mode: authMode !== null && authMode !== void 0 ? authMode : undefined,
                                                        token: tokenRaw,
                                                        password: passwordRaw,
                                                    }
                                                    : undefined,
                                                tailscale: tailscaleMode || opts.tailscaleResetOnExit
                                                    ? {
                                                        mode: tailscaleMode !== null && tailscaleMode !== void 0 ? tailscaleMode : undefined,
                                                        resetOnExit: Boolean(opts.tailscaleResetOnExit),
                                                    }
                                                    : undefined,
                                            })];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); },
                        })];
                case 9:
                    _q.sent();
                    return [3 /*break*/, 17];
                case 10:
                    err_2 = _q.sent();
                    if (!(err_2 instanceof gateway_lock_js_1.GatewayLockError ||
                        (err_2 && typeof err_2 === "object" && err_2.name === "GatewayLockError"))) return [3 /*break*/, 16];
                    errMessage = (0, shared_js_1.describeUnknownError)(err_2);
                    runtime_js_1.defaultRuntime.error("Gateway failed to start: ".concat(errMessage, "\nIf the gateway is supervised, stop it with: ").concat((0, command_format_js_1.formatCliCommand)("openclaw gateway stop")));
                    _q.label = 11;
                case 11:
                    _q.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, (0, ports_js_1.inspectPortUsage)(port)];
                case 12:
                    diagnostics = _q.sent();
                    if (diagnostics.status === "busy") {
                        for (_b = 0, _c = (0, ports_js_1.formatPortDiagnostics)(diagnostics); _b < _c.length; _b++) {
                            line = _c[_b];
                            runtime_js_1.defaultRuntime.error(line);
                        }
                    }
                    return [3 /*break*/, 14];
                case 13:
                    _d = _q.sent();
                    return [3 /*break*/, 14];
                case 14: return [4 /*yield*/, (0, shared_js_1.maybeExplainGatewayServiceStop)()];
                case 15:
                    _q.sent();
                    runtime_js_1.defaultRuntime.exit(1);
                    return [2 /*return*/];
                case 16:
                    runtime_js_1.defaultRuntime.error("Gateway failed to start: ".concat(String(err_2)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
function addGatewayRunCommand(cmd) {
    var _this = this;
    return cmd
        .option("--port <port>", "Port for the gateway WebSocket")
        .option("--bind <mode>", 'Bind mode ("loopback"|"lan"|"tailnet"|"auto"|"custom"). Defaults to config gateway.bind (or loopback).')
        .option("--token <token>", "Shared token required in connect.params.auth.token (default: OPENCLAW_GATEWAY_TOKEN env if set)")
        .option("--auth <mode>", 'Gateway auth mode ("token"|"password")')
        .option("--password <password>", "Password for auth mode=password")
        .option("--tailscale <mode>", 'Tailscale exposure mode ("off"|"serve"|"funnel")')
        .option("--tailscale-reset-on-exit", "Reset Tailscale serve/funnel configuration on shutdown", false)
        .option("--allow-unconfigured", "Allow gateway start without gateway.mode=local in config", false)
        .option("--dev", "Create a dev config + workspace if missing (no BOOTSTRAP.md)", false)
        .option("--reset", "Reset dev config + credentials + sessions + workspace (requires --dev)", false)
        .option("--force", "Kill any existing listener on the target port before starting", false)
        .option("--verbose", "Verbose logging to stdout/stderr", false)
        .option("--claude-cli-logs", "Only show claude-cli logs in the console (includes stdout/stderr)", false)
        .option("--ws-log <style>", 'WebSocket log style ("auto"|"full"|"compact")', "auto")
        .option("--compact", 'Alias for "--ws-log compact"', false)
        .option("--raw-stream", "Log raw model stream events to jsonl", false)
        .option("--raw-stream-path <path>", "Raw stream jsonl path")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runGatewayCommand(opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
