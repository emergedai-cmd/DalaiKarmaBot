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
var vitest_1 = require("vitest");
var loadConfig = vitest_1.vi.fn(function () { return ({
    gateway: {
        mode: "remote",
        remote: { url: "ws://remote.example:18789", token: "rtok" },
        auth: { token: "ltok" },
    },
}); });
var resolveGatewayPort = vitest_1.vi.fn(function () { return 18789; });
var discoverGatewayBeacons = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, []];
}); }); });
var pickPrimaryTailnetIPv4 = vitest_1.vi.fn(function () { return "100.64.0.10"; });
var sshStop = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); });
var resolveSshConfig = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, null];
}); }); });
var startSshPortForward = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ({
                parsedTarget: { user: "me", host: "studio", port: 22 },
                localPort: 18789,
                remotePort: 18789,
                pid: 123,
                stderr: [],
                stop: sshStop,
            })];
    });
}); });
var probeGateway = vitest_1.vi.fn(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var url = _b.url;
    return __generator(this, function (_c) {
        if (url.includes("127.0.0.1")) {
            return [2 /*return*/, {
                    ok: true,
                    url: url,
                    connectLatencyMs: 12,
                    error: null,
                    close: null,
                    health: { ok: true },
                    status: {
                        linkChannel: {
                            id: "whatsapp",
                            label: "WhatsApp",
                            linked: false,
                            authAgeMs: null,
                        },
                        sessions: { count: 0 },
                    },
                    presence: [{ mode: "gateway", reason: "self", host: "local", ip: "127.0.0.1" }],
                    configSnapshot: {
                        path: "/tmp/cfg.json",
                        exists: true,
                        valid: true,
                        config: {
                            gateway: { mode: "local" },
                        },
                        issues: [],
                        legacyIssues: [],
                    },
                }];
        }
        return [2 /*return*/, {
                ok: true,
                url: url,
                connectLatencyMs: 34,
                error: null,
                close: null,
                health: { ok: true },
                status: {
                    linkChannel: {
                        id: "whatsapp",
                        label: "WhatsApp",
                        linked: true,
                        authAgeMs: 5000,
                    },
                    sessions: { count: 2 },
                },
                presence: [{ mode: "gateway", reason: "self", host: "remote", ip: "100.64.0.2" }],
                configSnapshot: {
                    path: "/tmp/remote.json",
                    exists: true,
                    valid: true,
                    config: { gateway: { mode: "remote" } },
                    issues: [],
                    legacyIssues: [],
                },
            }];
    });
}); });
vitest_1.vi.mock("../config/config.js", function () { return ({
    loadConfig: function () { return loadConfig(); },
    resolveGatewayPort: function (cfg) { return resolveGatewayPort(cfg); },
}); });
vitest_1.vi.mock("../infra/bonjour-discovery.js", function () { return ({
    discoverGatewayBeacons: function (opts) { return discoverGatewayBeacons(opts); },
}); });
vitest_1.vi.mock("../infra/tailnet.js", function () { return ({
    pickPrimaryTailnetIPv4: function () { return pickPrimaryTailnetIPv4(); },
}); });
vitest_1.vi.mock("../infra/ssh-tunnel.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { startSshPortForward: function (opts) { return startSshPortForward(opts); } })];
        }
    });
}); });
vitest_1.vi.mock("../infra/ssh-config.js", function () { return ({
    resolveSshConfig: function (opts) { return resolveSshConfig(opts); },
}); });
vitest_1.vi.mock("../gateway/probe.js", function () { return ({
    probeGateway: function (opts) { return probeGateway(opts); },
}); });
(0, vitest_1.describe)("gateway-status command", function () {
    (0, vitest_1.it)("prints human output by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtimeLogs, runtimeErrors, runtime, gatewayStatusCommand;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtimeLogs = [];
                    runtimeErrors = [];
                    runtime = {
                        log: function (msg) { return runtimeLogs.push(msg); },
                        error: function (msg) { return runtimeErrors.push(msg); },
                        exit: function (code) {
                            throw new Error("__exit__:".concat(code));
                        },
                    };
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gateway-status.js"); })];
                case 1:
                    gatewayStatusCommand = (_a.sent()).gatewayStatusCommand;
                    return [4 /*yield*/, gatewayStatusCommand({ timeout: "1000" }, runtime)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(runtimeErrors).toHaveLength(0);
                    (0, vitest_1.expect)(runtimeLogs.join("\n")).toContain("Gateway Status");
                    (0, vitest_1.expect)(runtimeLogs.join("\n")).toContain("Discovery (this machine)");
                    (0, vitest_1.expect)(runtimeLogs.join("\n")).toContain("Targets");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prints a structured JSON envelope when --json is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtimeLogs, runtimeErrors, runtime, gatewayStatusCommand, parsed, targets;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    runtimeLogs = [];
                    runtimeErrors = [];
                    runtime = {
                        log: function (msg) { return runtimeLogs.push(msg); },
                        error: function (msg) { return runtimeErrors.push(msg); },
                        exit: function (code) {
                            throw new Error("__exit__:".concat(code));
                        },
                    };
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gateway-status.js"); })];
                case 1:
                    gatewayStatusCommand = (_c.sent()).gatewayStatusCommand;
                    return [4 /*yield*/, gatewayStatusCommand({ timeout: "1000", json: true }, runtime)];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(runtimeErrors).toHaveLength(0);
                    parsed = JSON.parse(runtimeLogs.join("\n"));
                    (0, vitest_1.expect)(parsed.ok).toBe(true);
                    (0, vitest_1.expect)(parsed.targets).toBeTruthy();
                    targets = parsed.targets;
                    (0, vitest_1.expect)(targets.length).toBeGreaterThanOrEqual(2);
                    (0, vitest_1.expect)((_a = targets[0]) === null || _a === void 0 ? void 0 : _a.health).toBeTruthy();
                    (0, vitest_1.expect)((_b = targets[0]) === null || _b === void 0 ? void 0 : _b.summary).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("supports SSH tunnel targets", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtimeLogs, runtime, gatewayStatusCommand, tunnelCall, parsed, targets;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    runtimeLogs = [];
                    runtime = {
                        log: function (msg) { return runtimeLogs.push(msg); },
                        error: function (_msg) { },
                        exit: function (code) {
                            throw new Error("__exit__:".concat(code));
                        },
                    };
                    startSshPortForward.mockClear();
                    sshStop.mockClear();
                    probeGateway.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gateway-status.js"); })];
                case 1:
                    gatewayStatusCommand = (_c.sent()).gatewayStatusCommand;
                    return [4 /*yield*/, gatewayStatusCommand({ timeout: "1000", json: true, ssh: "me@studio" }, runtime)];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(startSshPortForward).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(probeGateway).toHaveBeenCalled();
                    tunnelCall = (_a = probeGateway.mock.calls.find(function (call) { var _a; return typeof ((_a = call === null || call === void 0 ? void 0 : call[0]) === null || _a === void 0 ? void 0 : _a.url) === "string" && call[0].url.startsWith("ws://127.0.0.1:"); })) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_b = tunnelCall === null || tunnelCall === void 0 ? void 0 : tunnelCall.auth) === null || _b === void 0 ? void 0 : _b.token).toBe("rtok");
                    (0, vitest_1.expect)(sshStop).toHaveBeenCalledTimes(1);
                    parsed = JSON.parse(runtimeLogs.join("\n"));
                    targets = parsed.targets;
                    (0, vitest_1.expect)(targets.some(function (t) { return t.kind === "sshTunnel"; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips invalid ssh-auto discovery targets", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtimeLogs, runtime, originalUser, gatewayStatusCommand, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runtimeLogs = [];
                    runtime = {
                        log: function (msg) { return runtimeLogs.push(msg); },
                        error: function (_msg) { },
                        exit: function (code) {
                            throw new Error("__exit__:".concat(code));
                        },
                    };
                    originalUser = process.env.USER;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 4, 5]);
                    process.env.USER = "steipete";
                    loadConfig.mockReturnValueOnce({
                        gateway: {
                            mode: "remote",
                            remote: {},
                        },
                    });
                    discoverGatewayBeacons.mockResolvedValueOnce([
                        { tailnetDns: "-V" },
                        { tailnetDns: "goodhost" },
                    ]);
                    startSshPortForward.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gateway-status.js"); })];
                case 2:
                    gatewayStatusCommand = (_b.sent()).gatewayStatusCommand;
                    return [4 /*yield*/, gatewayStatusCommand({ timeout: "1000", json: true, sshAuto: true }, runtime)];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(startSshPortForward).toHaveBeenCalledTimes(1);
                    call = (_a = startSshPortForward.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call.target).toBe("steipete@goodhost");
                    return [3 /*break*/, 5];
                case 4:
                    process.env.USER = originalUser;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("infers SSH target from gateway.remote.url and ssh config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtimeLogs, runtime, originalUser, gatewayStatusCommand, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runtimeLogs = [];
                    runtime = {
                        log: function (msg) { return runtimeLogs.push(msg); },
                        error: function (_msg) { },
                        exit: function (code) {
                            throw new Error("__exit__:".concat(code));
                        },
                    };
                    originalUser = process.env.USER;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 4, 5]);
                    process.env.USER = "steipete";
                    loadConfig.mockReturnValueOnce({
                        gateway: {
                            mode: "remote",
                            remote: { url: "ws://peters-mac-studio-1.sheep-coho.ts.net:18789", token: "rtok" },
                        },
                    });
                    resolveSshConfig.mockResolvedValueOnce({
                        user: "steipete",
                        host: "peters-mac-studio-1.sheep-coho.ts.net",
                        port: 2222,
                        identityFiles: ["/tmp/id_ed25519"],
                    });
                    startSshPortForward.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gateway-status.js"); })];
                case 2:
                    gatewayStatusCommand = (_b.sent()).gatewayStatusCommand;
                    return [4 /*yield*/, gatewayStatusCommand({ timeout: "1000", json: true }, runtime)];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(startSshPortForward).toHaveBeenCalledTimes(1);
                    call = (_a = startSshPortForward.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call.target).toBe("steipete@peters-mac-studio-1.sheep-coho.ts.net:2222");
                    (0, vitest_1.expect)(call.identity).toBe("/tmp/id_ed25519");
                    return [3 /*break*/, 5];
                case 4:
                    process.env.USER = originalUser;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to host-only when USER is missing and ssh config is unavailable", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtimeLogs, runtime, originalUser, gatewayStatusCommand, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runtimeLogs = [];
                    runtime = {
                        log: function (msg) { return runtimeLogs.push(msg); },
                        error: function (_msg) { },
                        exit: function (code) {
                            throw new Error("__exit__:".concat(code));
                        },
                    };
                    originalUser = process.env.USER;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 4, 5]);
                    process.env.USER = "";
                    loadConfig.mockReturnValueOnce({
                        gateway: {
                            mode: "remote",
                            remote: { url: "ws://studio.example:18789", token: "rtok" },
                        },
                    });
                    resolveSshConfig.mockResolvedValueOnce(null);
                    startSshPortForward.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gateway-status.js"); })];
                case 2:
                    gatewayStatusCommand = (_b.sent()).gatewayStatusCommand;
                    return [4 /*yield*/, gatewayStatusCommand({ timeout: "1000", json: true }, runtime)];
                case 3:
                    _b.sent();
                    call = (_a = startSshPortForward.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call.target).toBe("studio.example");
                    return [3 /*break*/, 5];
                case 4:
                    process.env.USER = originalUser;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps explicit SSH identity even when ssh config provides one", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtimeLogs, runtime, gatewayStatusCommand, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runtimeLogs = [];
                    runtime = {
                        log: function (msg) { return runtimeLogs.push(msg); },
                        error: function (_msg) { },
                        exit: function (code) {
                            throw new Error("__exit__:".concat(code));
                        },
                    };
                    loadConfig.mockReturnValueOnce({
                        gateway: {
                            mode: "remote",
                            remote: { url: "ws://studio.example:18789", token: "rtok" },
                        },
                    });
                    resolveSshConfig.mockResolvedValueOnce({
                        user: "me",
                        host: "studio.example",
                        port: 22,
                        identityFiles: ["/tmp/id_from_config"],
                    });
                    startSshPortForward.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gateway-status.js"); })];
                case 1:
                    gatewayStatusCommand = (_b.sent()).gatewayStatusCommand;
                    return [4 /*yield*/, gatewayStatusCommand({ timeout: "1000", json: true, sshIdentity: "/tmp/explicit_id" }, runtime)];
                case 2:
                    _b.sent();
                    call = (_a = startSshPortForward.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call.identity).toBe("/tmp/explicit_id");
                    return [2 /*return*/];
            }
        });
    }); });
});
