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
var node_os_1 = require("node:os");
var vitest_1 = require("vitest");
var logging = require("../logging.js");
var mocks = vitest_1.vi.hoisted(function () { return ({
    createService: vitest_1.vi.fn(),
    shutdown: vitest_1.vi.fn(),
    registerUnhandledRejectionHandler: vitest_1.vi.fn(),
    logWarn: vitest_1.vi.fn(),
    logDebug: vitest_1.vi.fn(),
}); });
var createService = mocks.createService, shutdown = mocks.shutdown, registerUnhandledRejectionHandler = mocks.registerUnhandledRejectionHandler, logWarn = mocks.logWarn, logDebug = mocks.logDebug;
var asString = function (value, fallback) {
    return typeof value === "string" && value.trim() ? value : fallback;
};
vitest_1.vi.mock("../logger.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../logger.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { logWarn: function (message) { return logWarn(message); }, logDebug: function (message) { return logDebug(message); }, logInfo: vitest_1.vi.fn(), logError: vitest_1.vi.fn(), logSuccess: vitest_1.vi.fn() })];
        }
    });
}); });
vitest_1.vi.mock("@homebridge/ciao", function () {
    return {
        Protocol: { TCP: "tcp" },
        getResponder: function () { return ({
            createService: createService,
            shutdown: shutdown,
        }); },
    };
});
vitest_1.vi.mock("./unhandled-rejections.js", function () {
    return {
        registerUnhandledRejectionHandler: function (handler) {
            return registerUnhandledRejectionHandler(handler);
        },
    };
});
var startGatewayBonjourAdvertiser = (await Promise.resolve().then(function () { return require("./bonjour.js"); })).startGatewayBonjourAdvertiser;
(0, vitest_1.describe)("gateway bonjour advertiser", function () {
    var prevEnv = __assign({}, process.env);
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.spyOn(logging, "getLogger").mockReturnValue({
            info: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return getLoggerInfo.apply(void 0, args);
            },
        });
    });
    (0, vitest_1.afterEach)(function () {
        for (var _i = 0, _a = Object.keys(process.env); _i < _a.length; _i++) {
            var key = _a[_i];
            if (!(key in prevEnv)) {
                delete process.env[key];
            }
        }
        for (var _b = 0, _c = Object.entries(prevEnv); _b < _c.length; _b++) {
            var _d = _c[_b], key = _d[0], value = _d[1];
            process.env[key] = value;
        }
        createService.mockReset();
        shutdown.mockReset();
        registerUnhandledRejectionHandler.mockReset();
        logWarn.mockReset();
        logDebug.mockReset();
        vitest_1.vi.useRealTimers();
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)("does not block on advertise and publishes expected txt keys", function () { return __awaiter(void 0, void 0, void 0, function () {
        var destroy, advertise, started, gatewayCall, gatewayType;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    // Allow advertiser to run in unit tests.
                    delete process.env.VITEST;
                    process.env.NODE_ENV = "development";
                    vitest_1.vi.spyOn(node_os_1.default, "hostname").mockReturnValue("test-host");
                    process.env.OPENCLAW_MDNS_HOSTNAME = "test-host";
                    process.env.OPENCLAW_MDNS_HOSTNAME = "test-host";
                    destroy = vitest_1.vi.fn().mockResolvedValue(undefined);
                    advertise = vitest_1.vi.fn().mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                        setTimeout(resolve, 250);
                                    })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); });
                    createService.mockImplementation(function (options) {
                        return {
                            advertise: advertise,
                            destroy: destroy,
                            serviceState: "announced",
                            on: vitest_1.vi.fn(),
                            getFQDN: function () { return "".concat(asString(options.type, "service"), ".").concat(asString(options.domain, "local"), "."); },
                            getHostname: function () { return asString(options.hostname, "unknown"); },
                            getPort: function () { var _a; return Number((_a = options.port) !== null && _a !== void 0 ? _a : -1); },
                        };
                    });
                    return [4 /*yield*/, startGatewayBonjourAdvertiser({
                            gatewayPort: 18789,
                            sshPort: 2222,
                            tailnetDns: "host.tailnet.ts.net",
                            cliPath: "/opt/homebrew/bin/openclaw",
                        })];
                case 1:
                    started = _r.sent();
                    (0, vitest_1.expect)(createService).toHaveBeenCalledTimes(1);
                    gatewayCall = createService.mock.calls[0];
                    (0, vitest_1.expect)((_a = gatewayCall === null || gatewayCall === void 0 ? void 0 : gatewayCall[0]) === null || _a === void 0 ? void 0 : _a.type).toBe("openclaw-gw");
                    gatewayType = asString((_b = gatewayCall === null || gatewayCall === void 0 ? void 0 : gatewayCall[0]) === null || _b === void 0 ? void 0 : _b.type, "");
                    (0, vitest_1.expect)(gatewayType.length).toBeLessThanOrEqual(15);
                    (0, vitest_1.expect)((_c = gatewayCall === null || gatewayCall === void 0 ? void 0 : gatewayCall[0]) === null || _c === void 0 ? void 0 : _c.port).toBe(18789);
                    (0, vitest_1.expect)((_d = gatewayCall === null || gatewayCall === void 0 ? void 0 : gatewayCall[0]) === null || _d === void 0 ? void 0 : _d.domain).toBe("local");
                    (0, vitest_1.expect)((_e = gatewayCall === null || gatewayCall === void 0 ? void 0 : gatewayCall[0]) === null || _e === void 0 ? void 0 : _e.hostname).toBe("test-host");
                    (0, vitest_1.expect)((_g = (_f = gatewayCall === null || gatewayCall === void 0 ? void 0 : gatewayCall[0]) === null || _f === void 0 ? void 0 : _f.txt) === null || _g === void 0 ? void 0 : _g.lanHost).toBe("test-host.local");
                    (0, vitest_1.expect)((_j = (_h = gatewayCall === null || gatewayCall === void 0 ? void 0 : gatewayCall[0]) === null || _h === void 0 ? void 0 : _h.txt) === null || _j === void 0 ? void 0 : _j.gatewayPort).toBe("18789");
                    (0, vitest_1.expect)((_l = (_k = gatewayCall === null || gatewayCall === void 0 ? void 0 : gatewayCall[0]) === null || _k === void 0 ? void 0 : _k.txt) === null || _l === void 0 ? void 0 : _l.sshPort).toBe("2222");
                    (0, vitest_1.expect)((_o = (_m = gatewayCall === null || gatewayCall === void 0 ? void 0 : gatewayCall[0]) === null || _m === void 0 ? void 0 : _m.txt) === null || _o === void 0 ? void 0 : _o.cliPath).toBe("/opt/homebrew/bin/openclaw");
                    (0, vitest_1.expect)((_q = (_p = gatewayCall === null || gatewayCall === void 0 ? void 0 : gatewayCall[0]) === null || _p === void 0 ? void 0 : _p.txt) === null || _q === void 0 ? void 0 : _q.transport).toBe("gateway");
                    // We don't await `advertise()`, but it should still be called for each service.
                    (0, vitest_1.expect)(advertise).toHaveBeenCalledTimes(1);
                    return [4 /*yield*/, started.stop()];
                case 2:
                    _r.sent();
                    (0, vitest_1.expect)(destroy).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(shutdown).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("omits cliPath and sshPort in minimal mode", function () { return __awaiter(void 0, void 0, void 0, function () {
        var destroy, advertise, started, gatewayCall;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    // Allow advertiser to run in unit tests.
                    delete process.env.VITEST;
                    process.env.NODE_ENV = "development";
                    vitest_1.vi.spyOn(node_os_1.default, "hostname").mockReturnValue("test-host");
                    destroy = vitest_1.vi.fn().mockResolvedValue(undefined);
                    advertise = vitest_1.vi.fn().mockResolvedValue(undefined);
                    createService.mockImplementation(function (options) {
                        return {
                            advertise: advertise,
                            destroy: destroy,
                            serviceState: "announced",
                            on: vitest_1.vi.fn(),
                            getFQDN: function () { return "".concat(asString(options.type, "service"), ".").concat(asString(options.domain, "local"), "."); },
                            getHostname: function () { return asString(options.hostname, "unknown"); },
                            getPort: function () { var _a; return Number((_a = options.port) !== null && _a !== void 0 ? _a : -1); },
                        };
                    });
                    return [4 /*yield*/, startGatewayBonjourAdvertiser({
                            gatewayPort: 18789,
                            sshPort: 2222,
                            cliPath: "/opt/homebrew/bin/openclaw",
                            minimal: true,
                        })];
                case 1:
                    started = _e.sent();
                    gatewayCall = createService.mock.calls[0];
                    (0, vitest_1.expect)((_b = (_a = gatewayCall === null || gatewayCall === void 0 ? void 0 : gatewayCall[0]) === null || _a === void 0 ? void 0 : _a.txt) === null || _b === void 0 ? void 0 : _b.sshPort).toBeUndefined();
                    (0, vitest_1.expect)((_d = (_c = gatewayCall === null || gatewayCall === void 0 ? void 0 : gatewayCall[0]) === null || _c === void 0 ? void 0 : _c.txt) === null || _d === void 0 ? void 0 : _d.cliPath).toBeUndefined();
                    return [4 /*yield*/, started.stop()];
                case 2:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("attaches conflict listeners for services", function () { return __awaiter(void 0, void 0, void 0, function () {
        var destroy, advertise, onCalls, started;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Allow advertiser to run in unit tests.
                    delete process.env.VITEST;
                    process.env.NODE_ENV = "development";
                    vitest_1.vi.spyOn(node_os_1.default, "hostname").mockReturnValue("test-host");
                    process.env.OPENCLAW_MDNS_HOSTNAME = "test-host";
                    destroy = vitest_1.vi.fn().mockResolvedValue(undefined);
                    advertise = vitest_1.vi.fn().mockResolvedValue(undefined);
                    onCalls = [];
                    createService.mockImplementation(function (options) {
                        var on = vitest_1.vi.fn(function (event) {
                            onCalls.push({ event: event });
                        });
                        return {
                            advertise: advertise,
                            destroy: destroy,
                            serviceState: "announced",
                            on: on,
                            getFQDN: function () { return "".concat(asString(options.type, "service"), ".").concat(asString(options.domain, "local"), "."); },
                            getHostname: function () { return asString(options.hostname, "unknown"); },
                            getPort: function () { var _a; return Number((_a = options.port) !== null && _a !== void 0 ? _a : -1); },
                        };
                    });
                    return [4 /*yield*/, startGatewayBonjourAdvertiser({
                            gatewayPort: 18789,
                            sshPort: 2222,
                        })];
                case 1:
                    started = _a.sent();
                    // 1 service × 2 listeners
                    (0, vitest_1.expect)(onCalls.map(function (c) { return c.event; })).toEqual(["name-change", "hostname-change"]);
                    return [4 /*yield*/, started.stop()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("cleans up unhandled rejection handler after shutdown", function () { return __awaiter(void 0, void 0, void 0, function () {
        var destroy, advertise, order, cleanup, started;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Allow advertiser to run in unit tests.
                    delete process.env.VITEST;
                    process.env.NODE_ENV = "development";
                    vitest_1.vi.spyOn(node_os_1.default, "hostname").mockReturnValue("test-host");
                    process.env.OPENCLAW_MDNS_HOSTNAME = "test-host";
                    destroy = vitest_1.vi.fn().mockResolvedValue(undefined);
                    advertise = vitest_1.vi.fn().mockResolvedValue(undefined);
                    order = [];
                    shutdown.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            order.push("shutdown");
                            return [2 /*return*/];
                        });
                    }); });
                    createService.mockImplementation(function (options) {
                        return {
                            advertise: advertise,
                            destroy: destroy,
                            serviceState: "announced",
                            on: vitest_1.vi.fn(),
                            getFQDN: function () { return "".concat(asString(options.type, "service"), ".").concat(asString(options.domain, "local"), "."); },
                            getHostname: function () { return asString(options.hostname, "unknown"); },
                            getPort: function () { var _a; return Number((_a = options.port) !== null && _a !== void 0 ? _a : -1); },
                        };
                    });
                    cleanup = vitest_1.vi.fn(function () {
                        order.push("cleanup");
                    });
                    registerUnhandledRejectionHandler.mockImplementation(function () { return cleanup; });
                    return [4 /*yield*/, startGatewayBonjourAdvertiser({
                            gatewayPort: 18789,
                            sshPort: 2222,
                        })];
                case 1:
                    started = _a.sent();
                    return [4 /*yield*/, started.stop()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(registerUnhandledRejectionHandler).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(cleanup).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(order).toEqual(["shutdown", "cleanup"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("logs advertise failures and retries via watchdog", function () { return __awaiter(void 0, void 0, void 0, function () {
        var destroy, advertise, started;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Allow advertiser to run in unit tests.
                    delete process.env.VITEST;
                    process.env.NODE_ENV = "development";
                    vitest_1.vi.useFakeTimers();
                    vitest_1.vi.spyOn(node_os_1.default, "hostname").mockReturnValue("test-host");
                    process.env.OPENCLAW_MDNS_HOSTNAME = "test-host";
                    destroy = vitest_1.vi.fn().mockResolvedValue(undefined);
                    advertise = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(new Error("boom")) // initial advertise fails
                        .mockResolvedValue(undefined);
                    createService.mockImplementation(function (options) {
                        return {
                            advertise: advertise,
                            destroy: destroy,
                            serviceState: "unannounced",
                            on: vitest_1.vi.fn(),
                            getFQDN: function () { return "".concat(asString(options.type, "service"), ".").concat(asString(options.domain, "local"), "."); },
                            getHostname: function () { return asString(options.hostname, "unknown"); },
                            getPort: function () { var _a; return Number((_a = options.port) !== null && _a !== void 0 ? _a : -1); },
                        };
                    });
                    return [4 /*yield*/, startGatewayBonjourAdvertiser({
                            gatewayPort: 18789,
                            sshPort: 2222,
                        })];
                case 1:
                    started = _a.sent();
                    // initial advertise attempt happens immediately
                    (0, vitest_1.expect)(advertise).toHaveBeenCalledTimes(1);
                    // allow promise rejection handler to run
                    return [4 /*yield*/, Promise.resolve()];
                case 2:
                    // allow promise rejection handler to run
                    _a.sent();
                    (0, vitest_1.expect)(logWarn).toHaveBeenCalledWith(vitest_1.expect.stringContaining("advertise failed"));
                    // watchdog should attempt re-advertise at the 60s interval tick
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(60000)];
                case 3:
                    // watchdog should attempt re-advertise at the 60s interval tick
                    _a.sent();
                    (0, vitest_1.expect)(advertise).toHaveBeenCalledTimes(2);
                    return [4 /*yield*/, started.stop()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(120000)];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(advertise).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles advertise throwing synchronously", function () { return __awaiter(void 0, void 0, void 0, function () {
        var destroy, advertise, started;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Allow advertiser to run in unit tests.
                    delete process.env.VITEST;
                    process.env.NODE_ENV = "development";
                    vitest_1.vi.spyOn(node_os_1.default, "hostname").mockReturnValue("test-host");
                    process.env.OPENCLAW_MDNS_HOSTNAME = "test-host";
                    destroy = vitest_1.vi.fn().mockResolvedValue(undefined);
                    advertise = vitest_1.vi.fn(function () {
                        throw new Error("sync-fail");
                    });
                    createService.mockImplementation(function (options) {
                        return {
                            advertise: advertise,
                            destroy: destroy,
                            serviceState: "unannounced",
                            on: vitest_1.vi.fn(),
                            getFQDN: function () { return "".concat(asString(options.type, "service"), ".").concat(asString(options.domain, "local"), "."); },
                            getHostname: function () { return asString(options.hostname, "unknown"); },
                            getPort: function () { var _a; return Number((_a = options.port) !== null && _a !== void 0 ? _a : -1); },
                        };
                    });
                    return [4 /*yield*/, startGatewayBonjourAdvertiser({
                            gatewayPort: 18789,
                            sshPort: 2222,
                        })];
                case 1:
                    started = _a.sent();
                    (0, vitest_1.expect)(advertise).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(logWarn).toHaveBeenCalledWith(vitest_1.expect.stringContaining("advertise threw"));
                    return [4 /*yield*/, started.stop()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("normalizes hostnames with domains for service names", function () { return __awaiter(void 0, void 0, void 0, function () {
        var destroy, advertise, started, gatewayCall;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    // Allow advertiser to run in unit tests.
                    delete process.env.VITEST;
                    process.env.NODE_ENV = "development";
                    vitest_1.vi.spyOn(node_os_1.default, "hostname").mockReturnValue("Mac.localdomain");
                    destroy = vitest_1.vi.fn().mockResolvedValue(undefined);
                    advertise = vitest_1.vi.fn().mockResolvedValue(undefined);
                    createService.mockImplementation(function (options) {
                        return {
                            advertise: advertise,
                            destroy: destroy,
                            serviceState: "announced",
                            on: vitest_1.vi.fn(),
                            getFQDN: function () { return "".concat(asString(options.type, "service"), ".").concat(asString(options.domain, "local"), "."); },
                            getHostname: function () { return asString(options.hostname, "unknown"); },
                            getPort: function () { var _a; return Number((_a = options.port) !== null && _a !== void 0 ? _a : -1); },
                        };
                    });
                    return [4 /*yield*/, startGatewayBonjourAdvertiser({
                            gatewayPort: 18789,
                            sshPort: 2222,
                        })];
                case 1:
                    started = _f.sent();
                    gatewayCall = createService.mock.calls[0];
                    (0, vitest_1.expect)((_a = gatewayCall === null || gatewayCall === void 0 ? void 0 : gatewayCall[0]) === null || _a === void 0 ? void 0 : _a.name).toBe("openclaw (OpenClaw)");
                    (0, vitest_1.expect)((_b = gatewayCall === null || gatewayCall === void 0 ? void 0 : gatewayCall[0]) === null || _b === void 0 ? void 0 : _b.domain).toBe("local");
                    (0, vitest_1.expect)((_c = gatewayCall === null || gatewayCall === void 0 ? void 0 : gatewayCall[0]) === null || _c === void 0 ? void 0 : _c.hostname).toBe("openclaw");
                    (0, vitest_1.expect)((_e = (_d = gatewayCall === null || gatewayCall === void 0 ? void 0 : gatewayCall[0]) === null || _d === void 0 ? void 0 : _d.txt) === null || _e === void 0 ? void 0 : _e.lanHost).toBe("openclaw.local");
                    return [4 /*yield*/, started.stop()];
                case 2:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
