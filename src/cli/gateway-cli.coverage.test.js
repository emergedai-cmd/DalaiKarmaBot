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
var commander_1 = require("commander");
var vitest_1 = require("vitest");
var callGateway = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ ok: true })];
}); }); });
var startGatewayServer = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ({
                close: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/];
                }); }); }),
            })];
    });
}); });
var setVerbose = vitest_1.vi.fn();
var forceFreePortAndWait = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ({
                killed: [],
                waitedMs: 0,
                escalatedToSigkill: false,
            })];
    });
}); });
var serviceIsLoaded = vitest_1.vi.fn().mockResolvedValue(true);
var discoverGatewayBeacons = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, []];
}); }); });
var gatewayStatusCommand = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); });
var runtimeLogs = [];
var runtimeErrors = [];
var defaultRuntime = {
    log: function (msg) { return runtimeLogs.push(msg); },
    error: function (msg) { return runtimeErrors.push(msg); },
    exit: function (code) {
        throw new Error("__exit__:".concat(code));
    },
};
function withEnvOverride(overrides, fn) {
    return __awaiter(this, void 0, void 0, function () {
        var saved, _i, _a, key, _b, _c, key;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    saved = {};
                    for (_i = 0, _a = Object.keys(overrides); _i < _a.length; _i++) {
                        key = _a[_i];
                        saved[key] = process.env[key];
                        if (overrides[key] === undefined) {
                            delete process.env[key];
                        }
                        else {
                            process.env[key] = overrides[key];
                        }
                    }
                    vitest_1.vi.resetModules();
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, fn()];
                case 2: return [2 /*return*/, _d.sent()];
                case 3:
                    for (_b = 0, _c = Object.keys(saved); _b < _c.length; _b++) {
                        key = _c[_b];
                        if (saved[key] === undefined) {
                            delete process.env[key];
                        }
                        else {
                            process.env[key] = saved[key];
                        }
                    }
                    vitest_1.vi.resetModules();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
vitest_1.vi.mock("../gateway/call.js", function () { return ({
    callGateway: function (opts) { return callGateway(opts); },
    randomIdempotencyKey: function () { return "rk_test"; },
}); });
vitest_1.vi.mock("../gateway/server.js", function () { return ({
    startGatewayServer: function (port, opts) { return startGatewayServer(port, opts); },
}); });
vitest_1.vi.mock("../globals.js", function () { return ({
    info: function (msg) { return msg; },
    isVerbose: function () { return false; },
    setVerbose: function (enabled) { return setVerbose(enabled); },
}); });
vitest_1.vi.mock("../runtime.js", function () { return ({
    defaultRuntime: defaultRuntime,
}); });
vitest_1.vi.mock("./ports.js", function () { return ({
    forceFreePortAndWait: function (port) { return forceFreePortAndWait(port); },
}); });
vitest_1.vi.mock("../daemon/service.js", function () { return ({
    resolveGatewayService: function () { return ({
        label: "LaunchAgent",
        loadedText: "loaded",
        notLoadedText: "not loaded",
        install: vitest_1.vi.fn(),
        uninstall: vitest_1.vi.fn(),
        stop: vitest_1.vi.fn(),
        restart: vitest_1.vi.fn(),
        isLoaded: serviceIsLoaded,
        readCommand: vitest_1.vi.fn(),
        readRuntime: vitest_1.vi.fn().mockResolvedValue({ status: "running" }),
    }); },
}); });
vitest_1.vi.mock("../daemon/program-args.js", function () { return ({
    resolveGatewayProgramArguments: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    programArguments: ["/bin/node", "cli", "gateway", "--port", "18789"],
                })];
        });
    }); },
}); });
vitest_1.vi.mock("../infra/bonjour-discovery.js", function () { return ({
    discoverGatewayBeacons: function (opts) { return discoverGatewayBeacons(opts); },
}); });
vitest_1.vi.mock("../commands/gateway-status.js", function () { return ({
    gatewayStatusCommand: function (opts) { return gatewayStatusCommand(opts); },
}); });
(0, vitest_1.describe)("gateway-cli coverage", function () {
    (0, vitest_1.it)("registers call/health commands and routes to callGateway", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerGatewayCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    callGateway.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gateway-cli.js"); })];
                case 1:
                    registerGatewayCli = (_a.sent()).registerGatewayCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerGatewayCli(program);
                    return [4 /*yield*/, program.parseAsync(["gateway", "call", "health", "--params", '{"x":1}', "--json"], {
                            from: "user",
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(runtimeLogs.join("\n")).toContain('"ok": true');
                    return [2 /*return*/];
            }
        });
    }); }, 30000);
    (0, vitest_1.it)("registers gateway probe and routes to gatewayStatusCommand", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerGatewayCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    gatewayStatusCommand.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gateway-cli.js"); })];
                case 1:
                    registerGatewayCli = (_a.sent()).registerGatewayCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerGatewayCli(program);
                    return [4 /*yield*/, program.parseAsync(["gateway", "probe", "--json"], { from: "user" })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(gatewayStatusCommand).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); }, 30000);
    (0, vitest_1.it)("registers gateway discover and prints JSON", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerGatewayCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    discoverGatewayBeacons.mockReset();
                    discoverGatewayBeacons.mockResolvedValueOnce([
                        {
                            instanceName: "Studio (OpenClaw)",
                            displayName: "Studio",
                            domain: "local.",
                            host: "studio.local",
                            lanHost: "studio.local",
                            tailnetDns: "studio.tailnet.ts.net",
                            gatewayPort: 18789,
                            sshPort: 22,
                        },
                    ]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gateway-cli.js"); })];
                case 1:
                    registerGatewayCli = (_a.sent()).registerGatewayCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerGatewayCli(program);
                    return [4 /*yield*/, program.parseAsync(["gateway", "discover", "--json"], {
                            from: "user",
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(discoverGatewayBeacons).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(runtimeLogs.join("\n")).toContain('"beacons"');
                    (0, vitest_1.expect)(runtimeLogs.join("\n")).toContain('"wsUrl"');
                    (0, vitest_1.expect)(runtimeLogs.join("\n")).toContain("ws://");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("registers gateway discover and prints human output with details on new lines", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerGatewayCli, program, out;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    discoverGatewayBeacons.mockReset();
                    discoverGatewayBeacons.mockResolvedValueOnce([
                        {
                            instanceName: "Studio (OpenClaw)",
                            displayName: "Studio",
                            domain: "openclaw.internal.",
                            host: "studio.openclaw.internal",
                            lanHost: "studio.local",
                            tailnetDns: "studio.tailnet.ts.net",
                            gatewayPort: 18789,
                            sshPort: 22,
                        },
                    ]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gateway-cli.js"); })];
                case 1:
                    registerGatewayCli = (_a.sent()).registerGatewayCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerGatewayCli(program);
                    return [4 /*yield*/, program.parseAsync(["gateway", "discover", "--timeout", "1"], {
                            from: "user",
                        })];
                case 2:
                    _a.sent();
                    out = runtimeLogs.join("\n");
                    (0, vitest_1.expect)(out).toContain("Gateway Discovery");
                    (0, vitest_1.expect)(out).toContain("Found 1 gateway(s)");
                    (0, vitest_1.expect)(out).toContain("- Studio openclaw.internal.");
                    (0, vitest_1.expect)(out).toContain("  tailnet: studio.tailnet.ts.net");
                    (0, vitest_1.expect)(out).toContain("  host: studio.openclaw.internal");
                    (0, vitest_1.expect)(out).toContain("  ws: ws://studio.tailnet.ts.net:18789");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("validates gateway discover timeout", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerGatewayCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    discoverGatewayBeacons.mockReset();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gateway-cli.js"); })];
                case 1:
                    registerGatewayCli = (_a.sent()).registerGatewayCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerGatewayCli(program);
                    return [4 /*yield*/, (0, vitest_1.expect)(program.parseAsync(["gateway", "discover", "--timeout", "0"], {
                            from: "user",
                        })).rejects.toThrow("__exit__:1")];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(runtimeErrors.join("\n")).toContain("gateway discover failed:");
                    (0, vitest_1.expect)(discoverGatewayBeacons).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("fails gateway call on invalid params JSON", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerGatewayCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    callGateway.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gateway-cli.js"); })];
                case 1:
                    registerGatewayCli = (_a.sent()).registerGatewayCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerGatewayCli(program);
                    return [4 /*yield*/, (0, vitest_1.expect)(program.parseAsync(["gateway", "call", "status", "--params", "not-json"], { from: "user" })).rejects.toThrow("__exit__:1")];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(callGateway).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(runtimeErrors.join("\n")).toContain("Gateway call failed:");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("validates gateway ports and handles force/start errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerGatewayCli, programInvalidPort, programForceFail, programStartFail, beforeSigterm, beforeSigint, _i, _a, listener, _b, _c, listener;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gateway-cli.js"); })];
                case 1:
                    registerGatewayCli = (_d.sent()).registerGatewayCli;
                    programInvalidPort = new commander_1.Command();
                    programInvalidPort.exitOverride();
                    registerGatewayCli(programInvalidPort);
                    return [4 /*yield*/, (0, vitest_1.expect)(programInvalidPort.parseAsync(["gateway", "--port", "0", "--token", "test-token"], {
                            from: "user",
                        })).rejects.toThrow("__exit__:1")];
                case 2:
                    _d.sent();
                    // Force free failure
                    forceFreePortAndWait.mockImplementationOnce(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error("boom");
                        });
                    }); });
                    programForceFail = new commander_1.Command();
                    programForceFail.exitOverride();
                    registerGatewayCli(programForceFail);
                    return [4 /*yield*/, (0, vitest_1.expect)(programForceFail.parseAsync(["gateway", "--port", "18789", "--token", "test-token", "--force", "--allow-unconfigured"], { from: "user" })).rejects.toThrow("__exit__:1")];
                case 3:
                    _d.sent();
                    // Start failure (generic)
                    startGatewayServer.mockRejectedValueOnce(new Error("nope"));
                    programStartFail = new commander_1.Command();
                    programStartFail.exitOverride();
                    registerGatewayCli(programStartFail);
                    beforeSigterm = new Set(process.listeners("SIGTERM"));
                    beforeSigint = new Set(process.listeners("SIGINT"));
                    return [4 /*yield*/, (0, vitest_1.expect)(programStartFail.parseAsync(["gateway", "--port", "18789", "--token", "test-token", "--allow-unconfigured"], {
                            from: "user",
                        })).rejects.toThrow("__exit__:1")];
                case 4:
                    _d.sent();
                    for (_i = 0, _a = process.listeners("SIGTERM"); _i < _a.length; _i++) {
                        listener = _a[_i];
                        if (!beforeSigterm.has(listener)) {
                            process.removeListener("SIGTERM", listener);
                        }
                    }
                    for (_b = 0, _c = process.listeners("SIGINT"); _b < _c.length; _b++) {
                        listener = _c[_b];
                        if (!beforeSigint.has(listener)) {
                            process.removeListener("SIGINT", listener);
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prints stop hints on GatewayLockError when service is loaded", function () { return __awaiter(void 0, void 0, void 0, function () {
        var GatewayLockError, registerGatewayCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    serviceIsLoaded.mockResolvedValue(true);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/gateway-lock.js"); })];
                case 1:
                    GatewayLockError = (_a.sent()).GatewayLockError;
                    startGatewayServer.mockRejectedValueOnce(new GatewayLockError("another gateway instance is already listening"));
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gateway-cli.js"); })];
                case 2:
                    registerGatewayCli = (_a.sent()).registerGatewayCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerGatewayCli(program);
                    return [4 /*yield*/, (0, vitest_1.expect)(program.parseAsync(["gateway", "--token", "test-token", "--allow-unconfigured"], {
                            from: "user",
                        })).rejects.toThrow("__exit__:1")];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(startGatewayServer).toHaveBeenCalled();
                    (0, vitest_1.expect)(runtimeErrors.join("\n")).toContain("Gateway failed to start:");
                    (0, vitest_1.expect)(runtimeErrors.join("\n")).toContain("gateway stop");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses env/config port when --port is omitted", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withEnvOverride({ OPENCLAW_GATEWAY_PORT: "19001" }, function () { return __awaiter(void 0, void 0, void 0, function () {
                        var registerGatewayCli, program;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    runtimeLogs.length = 0;
                                    runtimeErrors.length = 0;
                                    startGatewayServer.mockClear();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gateway-cli.js"); })];
                                case 1:
                                    registerGatewayCli = (_a.sent()).registerGatewayCli;
                                    program = new commander_1.Command();
                                    program.exitOverride();
                                    registerGatewayCli(program);
                                    startGatewayServer.mockRejectedValueOnce(new Error("nope"));
                                    return [4 /*yield*/, (0, vitest_1.expect)(program.parseAsync(["gateway", "--token", "test-token", "--allow-unconfigured"], {
                                            from: "user",
                                        })).rejects.toThrow("__exit__:1")];
                                case 2:
                                    _a.sent();
                                    (0, vitest_1.expect)(startGatewayServer).toHaveBeenCalledWith(19001, vitest_1.expect.anything());
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
