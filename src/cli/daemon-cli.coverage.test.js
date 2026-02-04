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
var resolveGatewayProgramArguments = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ({
                programArguments: ["/bin/node", "cli", "gateway", "--port", "18789"],
            })];
    });
}); });
var serviceInstall = vitest_1.vi.fn().mockResolvedValue(undefined);
var serviceUninstall = vitest_1.vi.fn().mockResolvedValue(undefined);
var serviceStop = vitest_1.vi.fn().mockResolvedValue(undefined);
var serviceRestart = vitest_1.vi.fn().mockResolvedValue(undefined);
var serviceIsLoaded = vitest_1.vi.fn().mockResolvedValue(false);
var serviceReadCommand = vitest_1.vi.fn().mockResolvedValue(null);
var serviceReadRuntime = vitest_1.vi.fn().mockResolvedValue({ status: "running" });
var findExtraGatewayServices = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, []];
}); }); });
var inspectPortUsage = vitest_1.vi.fn(function (port) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ({
                port: port,
                status: "free",
                listeners: [],
                hints: [],
            })];
    });
}); });
var runtimeLogs = [];
var runtimeErrors = [];
var defaultRuntime = {
    log: function (msg) { return runtimeLogs.push(msg); },
    error: function (msg) { return runtimeErrors.push(msg); },
    exit: function (code) {
        throw new Error("__exit__:".concat(code));
    },
};
vitest_1.vi.mock("../gateway/call.js", function () { return ({
    callGateway: function (opts) { return callGateway(opts); },
}); });
vitest_1.vi.mock("../daemon/program-args.js", function () { return ({
    resolveGatewayProgramArguments: function (opts) { return resolveGatewayProgramArguments(opts); },
}); });
vitest_1.vi.mock("../daemon/service.js", function () { return ({
    resolveGatewayService: function () { return ({
        label: "LaunchAgent",
        loadedText: "loaded",
        notLoadedText: "not loaded",
        install: serviceInstall,
        uninstall: serviceUninstall,
        stop: serviceStop,
        restart: serviceRestart,
        isLoaded: serviceIsLoaded,
        readCommand: serviceReadCommand,
        readRuntime: serviceReadRuntime,
    }); },
}); });
vitest_1.vi.mock("../daemon/legacy.js", function () { return ({
    findLegacyGatewayServices: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, []];
    }); }); },
}); });
vitest_1.vi.mock("../daemon/inspect.js", function () { return ({
    findExtraGatewayServices: function (env, opts) { return findExtraGatewayServices(env, opts); },
    renderGatewayServiceCleanupHints: function () { return []; },
}); });
vitest_1.vi.mock("../infra/ports.js", function () { return ({
    inspectPortUsage: function (port) { return inspectPortUsage(port); },
    formatPortDiagnostics: function () { return ["Port 18789 is already in use."]; },
}); });
vitest_1.vi.mock("../runtime.js", function () { return ({
    defaultRuntime: defaultRuntime,
}); });
vitest_1.vi.mock("./deps.js", function () { return ({
    createDefaultDeps: function () { },
}); });
vitest_1.vi.mock("./progress.js", function () { return ({
    withProgress: function (_opts, fn) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fn()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    }); }); },
}); });
(0, vitest_1.describe)("daemon-cli coverage", function () {
    var originalEnv = {
        OPENCLAW_STATE_DIR: process.env.OPENCLAW_STATE_DIR,
        OPENCLAW_CONFIG_PATH: process.env.OPENCLAW_CONFIG_PATH,
        OPENCLAW_GATEWAY_PORT: process.env.OPENCLAW_GATEWAY_PORT,
        OPENCLAW_PROFILE: process.env.OPENCLAW_PROFILE,
    };
    (0, vitest_1.beforeEach)(function () {
        process.env.OPENCLAW_STATE_DIR = "/tmp/openclaw-cli-state";
        process.env.OPENCLAW_CONFIG_PATH = "/tmp/openclaw-cli-state/openclaw.json";
        delete process.env.OPENCLAW_GATEWAY_PORT;
        delete process.env.OPENCLAW_PROFILE;
        serviceReadCommand.mockResolvedValue(null);
    });
    (0, vitest_1.afterEach)(function () {
        if (originalEnv.OPENCLAW_STATE_DIR !== undefined) {
            process.env.OPENCLAW_STATE_DIR = originalEnv.OPENCLAW_STATE_DIR;
        }
        else {
            delete process.env.OPENCLAW_STATE_DIR;
        }
        if (originalEnv.OPENCLAW_CONFIG_PATH !== undefined) {
            process.env.OPENCLAW_CONFIG_PATH = originalEnv.OPENCLAW_CONFIG_PATH;
        }
        else {
            delete process.env.OPENCLAW_CONFIG_PATH;
        }
        if (originalEnv.OPENCLAW_GATEWAY_PORT !== undefined) {
            process.env.OPENCLAW_GATEWAY_PORT = originalEnv.OPENCLAW_GATEWAY_PORT;
        }
        else {
            delete process.env.OPENCLAW_GATEWAY_PORT;
        }
        if (originalEnv.OPENCLAW_PROFILE !== undefined) {
            process.env.OPENCLAW_PROFILE = originalEnv.OPENCLAW_PROFILE;
        }
        else {
            delete process.env.OPENCLAW_PROFILE;
        }
    });
    (0, vitest_1.it)("probes gateway status by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerDaemonCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    callGateway.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./daemon-cli.js"); })];
                case 1:
                    registerDaemonCli = (_a.sent()).registerDaemonCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerDaemonCli(program);
                    return [4 /*yield*/, program.parseAsync(["daemon", "status"], { from: "user" })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ method: "status" }));
                    (0, vitest_1.expect)(findExtraGatewayServices).toHaveBeenCalled();
                    (0, vitest_1.expect)(inspectPortUsage).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); }, 20000);
    (0, vitest_1.it)("derives probe URL from service args + env (json)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerDaemonCli, program, jsonLine, parsed;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    callGateway.mockClear();
                    inspectPortUsage.mockClear();
                    serviceReadCommand.mockResolvedValueOnce({
                        programArguments: ["/bin/node", "cli", "gateway", "--port", "19001"],
                        environment: {
                            OPENCLAW_PROFILE: "dev",
                            OPENCLAW_STATE_DIR: "/tmp/openclaw-daemon-state",
                            OPENCLAW_CONFIG_PATH: "/tmp/openclaw-daemon-state/openclaw.json",
                            OPENCLAW_GATEWAY_PORT: "19001",
                        },
                        sourcePath: "/tmp/bot.molt.gateway.plist",
                    });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./daemon-cli.js"); })];
                case 1:
                    registerDaemonCli = (_g.sent()).registerDaemonCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerDaemonCli(program);
                    return [4 /*yield*/, program.parseAsync(["daemon", "status", "--json"], { from: "user" })];
                case 2:
                    _g.sent();
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        url: "ws://127.0.0.1:19001",
                        method: "status",
                    }));
                    (0, vitest_1.expect)(inspectPortUsage).toHaveBeenCalledWith(19001);
                    jsonLine = runtimeLogs.find(function (line) { return line.trim().startsWith("{"); });
                    parsed = JSON.parse(jsonLine !== null && jsonLine !== void 0 ? jsonLine : "{}");
                    (0, vitest_1.expect)((_a = parsed.gateway) === null || _a === void 0 ? void 0 : _a.port).toBe(19001);
                    (0, vitest_1.expect)((_b = parsed.gateway) === null || _b === void 0 ? void 0 : _b.portSource).toBe("service args");
                    (0, vitest_1.expect)((_c = parsed.gateway) === null || _c === void 0 ? void 0 : _c.probeUrl).toBe("ws://127.0.0.1:19001");
                    (0, vitest_1.expect)((_d = parsed.config) === null || _d === void 0 ? void 0 : _d.mismatch).toBe(true);
                    (0, vitest_1.expect)((_e = parsed.rpc) === null || _e === void 0 ? void 0 : _e.url).toBe("ws://127.0.0.1:19001");
                    (0, vitest_1.expect)((_f = parsed.rpc) === null || _f === void 0 ? void 0 : _f.ok).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); }, 20000);
    (0, vitest_1.it)("passes deep scan flag for daemon status", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerDaemonCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    findExtraGatewayServices.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./daemon-cli.js"); })];
                case 1:
                    registerDaemonCli = (_a.sent()).registerDaemonCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerDaemonCli(program);
                    return [4 /*yield*/, program.parseAsync(["daemon", "status", "--deep"], { from: "user" })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(findExtraGatewayServices).toHaveBeenCalledWith(vitest_1.expect.anything(), vitest_1.expect.objectContaining({ deep: true }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("installs the daemon when requested", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerDaemonCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serviceIsLoaded.mockResolvedValueOnce(false);
                    serviceInstall.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./daemon-cli.js"); })];
                case 1:
                    registerDaemonCli = (_a.sent()).registerDaemonCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerDaemonCli(program);
                    return [4 /*yield*/, program.parseAsync(["daemon", "install", "--port", "18789"], {
                            from: "user",
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(serviceInstall).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("installs the daemon with json output", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerDaemonCli, program, jsonLine, parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    serviceIsLoaded.mockResolvedValueOnce(false);
                    serviceInstall.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./daemon-cli.js"); })];
                case 1:
                    registerDaemonCli = (_a.sent()).registerDaemonCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerDaemonCli(program);
                    return [4 /*yield*/, program.parseAsync(["daemon", "install", "--port", "18789", "--json"], {
                            from: "user",
                        })];
                case 2:
                    _a.sent();
                    jsonLine = runtimeLogs.find(function (line) { return line.trim().startsWith("{"); });
                    parsed = JSON.parse(jsonLine !== null && jsonLine !== void 0 ? jsonLine : "{}");
                    (0, vitest_1.expect)(parsed.ok).toBe(true);
                    (0, vitest_1.expect)(parsed.action).toBe("install");
                    (0, vitest_1.expect)(parsed.result).toBe("installed");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("starts and stops the daemon via service helpers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerDaemonCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serviceRestart.mockClear();
                    serviceStop.mockClear();
                    serviceIsLoaded.mockResolvedValue(true);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./daemon-cli.js"); })];
                case 1:
                    registerDaemonCli = (_a.sent()).registerDaemonCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerDaemonCli(program);
                    return [4 /*yield*/, program.parseAsync(["daemon", "start"], { from: "user" })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, program.parseAsync(["daemon", "stop"], { from: "user" })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(serviceRestart).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(serviceStop).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("emits json for daemon start/stop", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerDaemonCli, program, jsonLines, parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    serviceRestart.mockClear();
                    serviceStop.mockClear();
                    serviceIsLoaded.mockResolvedValue(true);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./daemon-cli.js"); })];
                case 1:
                    registerDaemonCli = (_a.sent()).registerDaemonCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerDaemonCli(program);
                    return [4 /*yield*/, program.parseAsync(["daemon", "start", "--json"], { from: "user" })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, program.parseAsync(["daemon", "stop", "--json"], { from: "user" })];
                case 3:
                    _a.sent();
                    jsonLines = runtimeLogs.filter(function (line) { return line.trim().startsWith("{"); });
                    parsed = jsonLines.map(function (line) { return JSON.parse(line); });
                    (0, vitest_1.expect)(parsed.some(function (entry) { return entry.action === "start" && entry.ok === true; })).toBe(true);
                    (0, vitest_1.expect)(parsed.some(function (entry) { return entry.action === "stop" && entry.ok === true; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
