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
exports.startGatewayBonjourAdvertiser = startGatewayBonjourAdvertiser;
var logger_js_1 = require("../logger.js");
var logging_js_1 = require("../logging.js");
var bonjour_ciao_js_1 = require("./bonjour-ciao.js");
var bonjour_errors_js_1 = require("./bonjour-errors.js");
var env_js_1 = require("./env.js");
var unhandled_rejections_js_1 = require("./unhandled-rejections.js");
function isDisabledByEnv() {
    if ((0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_DISABLE_BONJOUR)) {
        return true;
    }
    if (process.env.NODE_ENV === "test") {
        return true;
    }
    if (process.env.VITEST) {
        return true;
    }
    return false;
}
function safeServiceName(name) {
    var trimmed = name.trim();
    return trimmed.length > 0 ? trimmed : "OpenClaw";
}
function prettifyInstanceName(name) {
    var normalized = name.trim().replace(/\s+/g, " ");
    return normalized.replace(/\s+\(OpenClaw\)\s*$/i, "").trim() || normalized;
}
function serviceSummary(label, svc) {
    var fqdn = "unknown";
    var hostname = "unknown";
    var port = -1;
    try {
        fqdn = svc.getFQDN();
    }
    catch (_a) {
        // ignore
    }
    try {
        hostname = svc.getHostname();
    }
    catch (_b) {
        // ignore
    }
    try {
        port = svc.getPort();
    }
    catch (_c) {
        // ignore
    }
    var state = typeof svc.serviceState === "string" ? svc.serviceState : "unknown";
    return "".concat(label, " fqdn=").concat(fqdn, " host=").concat(hostname, " port=").concat(port, " state=").concat(state);
}
function startGatewayBonjourAdvertiser(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, getResponder, Protocol, responder, hostnameRaw, hostname, instanceName, displayName, txtBase, services, gatewayTxt, gateway, ciaoCancellationRejectionHandler, _loop_1, _i, services_1, _b, label, svc, _loop_2, _c, services_2, _d, label, svc, lastRepairAttempt, watchdog;
        var _this = this;
        var _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    if (isDisabledByEnv()) {
                        return [2 /*return*/, { stop: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/];
                                }); }); } }];
                    }
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("@homebridge/ciao"); })];
                case 1:
                    _a = _k.sent(), getResponder = _a.getResponder, Protocol = _a.Protocol;
                    responder = getResponder();
                    hostnameRaw = ((_e = process.env.OPENCLAW_MDNS_HOSTNAME) === null || _e === void 0 ? void 0 : _e.trim()) ||
                        ((_f = process.env.CLAWDBOT_MDNS_HOSTNAME) === null || _f === void 0 ? void 0 : _f.trim()) ||
                        "openclaw";
                    hostname = hostnameRaw
                        .replace(/\.local$/i, "")
                        .split(".")[0]
                        .trim() || "openclaw";
                    instanceName = typeof opts.instanceName === "string" && opts.instanceName.trim()
                        ? opts.instanceName.trim()
                        : "".concat(hostname, " (OpenClaw)");
                    displayName = prettifyInstanceName(instanceName);
                    txtBase = {
                        role: "gateway",
                        gatewayPort: String(opts.gatewayPort),
                        lanHost: "".concat(hostname, ".local"),
                        displayName: displayName,
                    };
                    if (opts.gatewayTlsEnabled) {
                        txtBase.gatewayTls = "1";
                        if (opts.gatewayTlsFingerprintSha256) {
                            txtBase.gatewayTlsSha256 = opts.gatewayTlsFingerprintSha256;
                        }
                    }
                    if (typeof opts.canvasPort === "number" && opts.canvasPort > 0) {
                        txtBase.canvasPort = String(opts.canvasPort);
                    }
                    if (typeof opts.tailnetDns === "string" && opts.tailnetDns.trim()) {
                        txtBase.tailnetDns = opts.tailnetDns.trim();
                    }
                    // In minimal mode, omit cliPath to avoid exposing filesystem structure.
                    // This info can be obtained via the authenticated WebSocket if needed.
                    if (!opts.minimal && typeof opts.cliPath === "string" && opts.cliPath.trim()) {
                        txtBase.cliPath = opts.cliPath.trim();
                    }
                    services = [];
                    gatewayTxt = __assign(__assign({}, txtBase), { transport: "gateway" });
                    if (!opts.minimal) {
                        gatewayTxt.sshPort = String((_g = opts.sshPort) !== null && _g !== void 0 ? _g : 22);
                    }
                    gateway = responder.createService({
                        name: safeServiceName(instanceName),
                        type: "openclaw-gw",
                        protocol: "tcp" /* Protocol.TCP */,
                        port: opts.gatewayPort,
                        domain: "local",
                        hostname: hostname,
                        txt: gatewayTxt,
                    });
                    services.push({
                        label: "gateway",
                        svc: gateway,
                    });
                    if (services.length > 0) {
                        ciaoCancellationRejectionHandler = (0, unhandled_rejections_js_1.registerUnhandledRejectionHandler)(bonjour_ciao_js_1.ignoreCiaoCancellationRejection);
                    }
                    (0, logger_js_1.logDebug)("bonjour: starting (hostname=".concat(hostname, ", instance=").concat(JSON.stringify(safeServiceName(instanceName)), ", gatewayPort=").concat(opts.gatewayPort).concat(opts.minimal ? ", minimal=true" : ", sshPort=".concat((_h = opts.sshPort) !== null && _h !== void 0 ? _h : 22), ")"));
                    _loop_1 = function (label, svc) {
                        try {
                            svc.on("name-change", function (name) {
                                var next = typeof name === "string" ? name : String(name);
                                (0, logger_js_1.logWarn)("bonjour: ".concat(label, " name conflict resolved; newName=").concat(JSON.stringify(next)));
                            });
                            svc.on("hostname-change", function (nextHostname) {
                                var next = typeof nextHostname === "string" ? nextHostname : String(nextHostname);
                                (0, logger_js_1.logWarn)("bonjour: ".concat(label, " hostname conflict resolved; newHostname=").concat(JSON.stringify(next)));
                            });
                        }
                        catch (err) {
                            (0, logger_js_1.logDebug)("bonjour: failed to attach listeners for ".concat(label, ": ").concat(String(err)));
                        }
                    };
                    for (_i = 0, services_1 = services; _i < services_1.length; _i++) {
                        _b = services_1[_i], label = _b.label, svc = _b.svc;
                        _loop_1(label, svc);
                    }
                    _loop_2 = function (label, svc) {
                        try {
                            void svc
                                .advertise()
                                .then(function () {
                                // Keep this out of stdout/stderr (menubar + tests) but capture in the rolling log.
                                (0, logging_js_1.getLogger)().info("bonjour: advertised ".concat(serviceSummary(label, svc)));
                            })
                                .catch(function (err) {
                                (0, logger_js_1.logWarn)("bonjour: advertise failed (".concat(serviceSummary(label, svc), "): ").concat((0, bonjour_errors_js_1.formatBonjourError)(err)));
                            });
                        }
                        catch (err) {
                            (0, logger_js_1.logWarn)("bonjour: advertise threw (".concat(serviceSummary(label, svc), "): ").concat((0, bonjour_errors_js_1.formatBonjourError)(err)));
                        }
                    };
                    // Do not block gateway startup on mDNS probing/announce. Advertising can take
                    // multiple seconds depending on network state; the gateway should come up even
                    // if Bonjour is slow or fails.
                    for (_c = 0, services_2 = services; _c < services_2.length; _c++) {
                        _d = services_2[_c], label = _d.label, svc = _d.svc;
                        _loop_2(label, svc);
                    }
                    lastRepairAttempt = new Map();
                    watchdog = setInterval(function () {
                        var _a;
                        var _loop_3 = function (label, svc) {
                            var stateUnknown = svc.serviceState;
                            if (typeof stateUnknown !== "string") {
                                return "continue";
                            }
                            if (stateUnknown === "announced" || stateUnknown === "announcing") {
                                return "continue";
                            }
                            var key = label;
                            try {
                                key = "".concat(label, ":").concat(svc.getFQDN());
                            }
                            catch (_c) {
                                // ignore
                            }
                            var now = Date.now();
                            var last = (_a = lastRepairAttempt.get(key)) !== null && _a !== void 0 ? _a : 0;
                            if (now - last < 30000) {
                                return "continue";
                            }
                            lastRepairAttempt.set(key, now);
                            (0, logger_js_1.logWarn)("bonjour: watchdog detected non-announced service; attempting re-advertise (".concat(serviceSummary(label, svc), ")"));
                            try {
                                void svc.advertise().catch(function (err) {
                                    (0, logger_js_1.logWarn)("bonjour: watchdog advertise failed (".concat(serviceSummary(label, svc), "): ").concat((0, bonjour_errors_js_1.formatBonjourError)(err)));
                                });
                            }
                            catch (err) {
                                (0, logger_js_1.logWarn)("bonjour: watchdog advertise threw (".concat(serviceSummary(label, svc), "): ").concat((0, bonjour_errors_js_1.formatBonjourError)(err)));
                            }
                        };
                        for (var _i = 0, services_3 = services; _i < services_3.length; _i++) {
                            var _b = services_3[_i], label = _b.label, svc = _b.svc;
                            _loop_3(label, svc);
                        }
                    }, 60000);
                    (_j = watchdog.unref) === null || _j === void 0 ? void 0 : _j.call(watchdog);
                    return [2 /*return*/, {
                            stop: function () { return __awaiter(_this, void 0, void 0, function () {
                                var _i, services_4, svc, _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            clearInterval(watchdog);
                                            _i = 0, services_4 = services;
                                            _c.label = 1;
                                        case 1:
                                            if (!(_i < services_4.length)) return [3 /*break*/, 6];
                                            svc = services_4[_i].svc;
                                            _c.label = 2;
                                        case 2:
                                            _c.trys.push([2, 4, , 5]);
                                            return [4 /*yield*/, svc.destroy()];
                                        case 3:
                                            _c.sent();
                                            return [3 /*break*/, 5];
                                        case 4:
                                            _a = _c.sent();
                                            return [3 /*break*/, 5];
                                        case 5:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 6:
                                            _c.trys.push([6, 8, 9, 10]);
                                            return [4 /*yield*/, responder.shutdown()];
                                        case 7:
                                            _c.sent();
                                            return [3 /*break*/, 10];
                                        case 8:
                                            _b = _c.sent();
                                            return [3 /*break*/, 10];
                                        case 9:
                                            ciaoCancellationRejectionHandler === null || ciaoCancellationRejectionHandler === void 0 ? void 0 : ciaoCancellationRejectionHandler();
                                            return [7 /*endfinally*/];
                                        case 10: return [2 /*return*/];
                                    }
                                });
                            }); },
                        }];
            }
        });
    });
}
