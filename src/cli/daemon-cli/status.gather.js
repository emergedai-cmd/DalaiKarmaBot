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
exports.gatherDaemonStatus = gatherDaemonStatus;
exports.renderPortDiagnosticsForCli = renderPortDiagnosticsForCli;
exports.resolvePortListeningAddresses = resolvePortListeningAddresses;
var config_js_1 = require("../../config/config.js");
var diagnostics_js_1 = require("../../daemon/diagnostics.js");
var inspect_js_1 = require("../../daemon/inspect.js");
var service_audit_js_1 = require("../../daemon/service-audit.js");
var service_js_1 = require("../../daemon/service.js");
var net_js_1 = require("../../gateway/net.js");
var ports_js_1 = require("../../infra/ports.js");
var tailnet_js_1 = require("../../infra/tailnet.js");
var probe_js_1 = require("./probe.js");
var shared_js_1 = require("./shared.js");
function shouldReportPortUsage(status, rpcOk) {
    if (status !== "busy") {
        return false;
    }
    if (rpcOk === true) {
        return false;
    }
    return true;
}
function gatherDaemonStatus(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var service, _a, loaded, command, runtime, configAudit, serviceEnv, mergedDaemonEnv, cliConfigPath, daemonConfigPath, cliIO, daemonIO, _b, cliSnapshot, daemonSnapshot, cliCfg, daemonCfg, cliConfigSummary, daemonConfigSummary, configMismatch, portFromArgs, daemonPort, portSource, bindMode, customBindHost, bindHost, tailnetIPv4, probeHost, probeUrlOverride, probeUrl, probeNote, cliPort, _c, portDiagnostics, portCliDiagnostics, portStatus, portCliStatus, extraServices, timeoutMsRaw, timeoutMs, rpc, _d, lastError;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        return __generator(this, function (_0) {
            switch (_0.label) {
                case 0:
                    service = (0, service_js_1.resolveGatewayService)();
                    return [4 /*yield*/, Promise.all([
                            service.isLoaded({ env: process.env }).catch(function () { return false; }),
                            service.readCommand(process.env).catch(function () { return null; }),
                            service.readRuntime(process.env).catch(function (err) { return ({ status: "unknown", detail: String(err) }); }),
                        ])];
                case 1:
                    _a = _0.sent(), loaded = _a[0], command = _a[1], runtime = _a[2];
                    return [4 /*yield*/, (0, service_audit_js_1.auditGatewayServiceConfig)({
                            env: process.env,
                            command: command,
                        })];
                case 2:
                    configAudit = _0.sent();
                    serviceEnv = (_e = command === null || command === void 0 ? void 0 : command.environment) !== null && _e !== void 0 ? _e : undefined;
                    mergedDaemonEnv = __assign(__assign({}, process.env), (serviceEnv !== null && serviceEnv !== void 0 ? serviceEnv : undefined));
                    cliConfigPath = (0, config_js_1.resolveConfigPath)(process.env, (0, config_js_1.resolveStateDir)(process.env));
                    daemonConfigPath = (0, config_js_1.resolveConfigPath)(mergedDaemonEnv, (0, config_js_1.resolveStateDir)(mergedDaemonEnv));
                    cliIO = (0, config_js_1.createConfigIO)({ env: process.env, configPath: cliConfigPath });
                    daemonIO = (0, config_js_1.createConfigIO)({
                        env: mergedDaemonEnv,
                        configPath: daemonConfigPath,
                    });
                    return [4 /*yield*/, Promise.all([
                            cliIO.readConfigFileSnapshot().catch(function () { return null; }),
                            daemonIO.readConfigFileSnapshot().catch(function () { return null; }),
                        ])];
                case 3:
                    _b = _0.sent(), cliSnapshot = _b[0], daemonSnapshot = _b[1];
                    cliCfg = cliIO.loadConfig();
                    daemonCfg = daemonIO.loadConfig();
                    cliConfigSummary = __assign(__assign({ path: (_f = cliSnapshot === null || cliSnapshot === void 0 ? void 0 : cliSnapshot.path) !== null && _f !== void 0 ? _f : cliConfigPath, exists: (_g = cliSnapshot === null || cliSnapshot === void 0 ? void 0 : cliSnapshot.exists) !== null && _g !== void 0 ? _g : false, valid: (_h = cliSnapshot === null || cliSnapshot === void 0 ? void 0 : cliSnapshot.valid) !== null && _h !== void 0 ? _h : true }, (((_j = cliSnapshot === null || cliSnapshot === void 0 ? void 0 : cliSnapshot.issues) === null || _j === void 0 ? void 0 : _j.length) ? { issues: cliSnapshot.issues } : {})), { controlUi: (_k = cliCfg.gateway) === null || _k === void 0 ? void 0 : _k.controlUi });
                    daemonConfigSummary = __assign(__assign({ path: (_l = daemonSnapshot === null || daemonSnapshot === void 0 ? void 0 : daemonSnapshot.path) !== null && _l !== void 0 ? _l : daemonConfigPath, exists: (_m = daemonSnapshot === null || daemonSnapshot === void 0 ? void 0 : daemonSnapshot.exists) !== null && _m !== void 0 ? _m : false, valid: (_o = daemonSnapshot === null || daemonSnapshot === void 0 ? void 0 : daemonSnapshot.valid) !== null && _o !== void 0 ? _o : true }, (((_p = daemonSnapshot === null || daemonSnapshot === void 0 ? void 0 : daemonSnapshot.issues) === null || _p === void 0 ? void 0 : _p.length) ? { issues: daemonSnapshot.issues } : {})), { controlUi: (_q = daemonCfg.gateway) === null || _q === void 0 ? void 0 : _q.controlUi });
                    configMismatch = cliConfigSummary.path !== daemonConfigSummary.path;
                    portFromArgs = (0, shared_js_1.parsePortFromArgs)(command === null || command === void 0 ? void 0 : command.programArguments);
                    daemonPort = portFromArgs !== null && portFromArgs !== void 0 ? portFromArgs : (0, config_js_1.resolveGatewayPort)(daemonCfg, mergedDaemonEnv);
                    portSource = portFromArgs
                        ? "service args"
                        : "env/config";
                    bindMode = ((_s = (_r = daemonCfg.gateway) === null || _r === void 0 ? void 0 : _r.bind) !== null && _s !== void 0 ? _s : "loopback");
                    customBindHost = (_t = daemonCfg.gateway) === null || _t === void 0 ? void 0 : _t.customBindHost;
                    return [4 /*yield*/, (0, net_js_1.resolveGatewayBindHost)(bindMode, customBindHost)];
                case 4:
                    bindHost = _0.sent();
                    tailnetIPv4 = (0, tailnet_js_1.pickPrimaryTailnetIPv4)();
                    probeHost = (0, shared_js_1.pickProbeHostForBind)(bindMode, tailnetIPv4, customBindHost);
                    probeUrlOverride = typeof opts.rpc.url === "string" && opts.rpc.url.trim().length > 0 ? opts.rpc.url.trim() : null;
                    probeUrl = probeUrlOverride !== null && probeUrlOverride !== void 0 ? probeUrlOverride : "ws://".concat(probeHost, ":").concat(daemonPort);
                    probeNote = !probeUrlOverride && bindMode === "lan"
                        ? "Local probe uses loopback (127.0.0.1). bind=lan listens on 0.0.0.0 (all interfaces); use a LAN IP for remote clients."
                        : !probeUrlOverride && bindMode === "loopback"
                            ? "Loopback-only gateway; only local clients can connect."
                            : undefined;
                    cliPort = (0, config_js_1.resolveGatewayPort)(cliCfg, process.env);
                    return [4 /*yield*/, Promise.all([
                            (0, ports_js_1.inspectPortUsage)(daemonPort).catch(function () { return null; }),
                            cliPort !== daemonPort ? (0, ports_js_1.inspectPortUsage)(cliPort).catch(function () { return null; }) : null,
                        ])];
                case 5:
                    _c = _0.sent(), portDiagnostics = _c[0], portCliDiagnostics = _c[1];
                    portStatus = portDiagnostics
                        ? {
                            port: portDiagnostics.port,
                            status: portDiagnostics.status,
                            listeners: portDiagnostics.listeners,
                            hints: portDiagnostics.hints,
                        }
                        : undefined;
                    portCliStatus = portCliDiagnostics
                        ? {
                            port: portCliDiagnostics.port,
                            status: portCliDiagnostics.status,
                            listeners: portCliDiagnostics.listeners,
                            hints: portCliDiagnostics.hints,
                        }
                        : undefined;
                    return [4 /*yield*/, (0, inspect_js_1.findExtraGatewayServices)(process.env, { deep: Boolean(opts.deep) }).catch(function () { return []; })];
                case 6:
                    extraServices = _0.sent();
                    timeoutMsRaw = Number.parseInt(String((_u = opts.rpc.timeout) !== null && _u !== void 0 ? _u : "10000"), 10);
                    timeoutMs = Number.isFinite(timeoutMsRaw) && timeoutMsRaw > 0 ? timeoutMsRaw : 10000;
                    if (!opts.probe) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, probe_js_1.probeGatewayStatus)({
                            url: probeUrl,
                            token: opts.rpc.token ||
                                mergedDaemonEnv.OPENCLAW_GATEWAY_TOKEN ||
                                ((_w = (_v = daemonCfg.gateway) === null || _v === void 0 ? void 0 : _v.auth) === null || _w === void 0 ? void 0 : _w.token),
                            password: opts.rpc.password ||
                                mergedDaemonEnv.OPENCLAW_GATEWAY_PASSWORD ||
                                ((_y = (_x = daemonCfg.gateway) === null || _x === void 0 ? void 0 : _x.auth) === null || _y === void 0 ? void 0 : _y.password),
                            timeoutMs: timeoutMs,
                            json: opts.rpc.json,
                            configPath: daemonConfigSummary.path,
                        })];
                case 7:
                    _d = _0.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _d = undefined;
                    _0.label = 9;
                case 9:
                    rpc = _d;
                    if (!(loaded && (runtime === null || runtime === void 0 ? void 0 : runtime.status) === "running" && portStatus && portStatus.status !== "busy")) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, diagnostics_js_1.readLastGatewayErrorLine)(mergedDaemonEnv)];
                case 10:
                    lastError = (_z = (_0.sent())) !== null && _z !== void 0 ? _z : undefined;
                    _0.label = 11;
                case 11: return [2 /*return*/, __assign(__assign(__assign(__assign({ service: {
                            label: service.label,
                            loaded: loaded,
                            loadedText: service.loadedText,
                            notLoadedText: service.notLoadedText,
                            command: command,
                            runtime: runtime,
                            configAudit: configAudit,
                        }, config: __assign({ cli: cliConfigSummary, daemon: daemonConfigSummary }, (configMismatch ? { mismatch: true } : {})), gateway: __assign({ bindMode: bindMode, bindHost: bindHost, customBindHost: customBindHost, port: daemonPort, portSource: portSource, probeUrl: probeUrl }, (probeNote ? { probeNote: probeNote } : {})), port: portStatus }, (portCliStatus ? { portCli: portCliStatus } : {})), { lastError: lastError }), (rpc ? { rpc: __assign(__assign({}, rpc), { url: probeUrl }) } : {})), { extraServices: extraServices })];
            }
        });
    });
}
function renderPortDiagnosticsForCli(status, rpcOk) {
    if (!status.port || !shouldReportPortUsage(status.port.status, rpcOk)) {
        return [];
    }
    return (0, ports_js_1.formatPortDiagnostics)({
        port: status.port.port,
        status: status.port.status,
        listeners: status.port.listeners,
        hints: status.port.hints,
    });
}
function resolvePortListeningAddresses(status) {
    var _a, _b, _c;
    var addrs = Array.from(new Set((_c = (_b = (_a = status.port) === null || _a === void 0 ? void 0 : _a.listeners) === null || _b === void 0 ? void 0 : _b.map(function (l) { return (l.address ? (0, shared_js_1.normalizeListenerAddress)(l.address) : ""); }).filter(function (v) { return Boolean(v); })) !== null && _c !== void 0 ? _c : []));
    return addrs;
}
