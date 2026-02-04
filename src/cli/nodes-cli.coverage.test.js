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
var callGateway = vitest_1.vi.fn(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (opts.method === "node.list") {
            return [2 /*return*/, {
                    nodes: [
                        {
                            nodeId: "mac-1",
                            displayName: "Mac",
                            platform: "macos",
                            caps: ["canvas"],
                            connected: true,
                            permissions: { screenRecording: true },
                        },
                    ],
                }];
        }
        if (opts.method === "node.invoke") {
            return [2 /*return*/, {
                    payload: {
                        stdout: "",
                        stderr: "",
                        exitCode: 0,
                        success: true,
                        timedOut: false,
                    },
                }];
        }
        if (opts.method === "exec.approvals.node.get") {
            return [2 /*return*/, {
                    path: "/tmp/exec-approvals.json",
                    exists: true,
                    hash: "hash",
                    file: {
                        version: 1,
                        defaults: {
                            security: "allowlist",
                            ask: "on-miss",
                            askFallback: "deny",
                        },
                        agents: {},
                    },
                }];
        }
        if (opts.method === "exec.approval.request") {
            return [2 /*return*/, { decision: "allow-once" }];
        }
        return [2 /*return*/, { ok: true }];
    });
}); });
var randomIdempotencyKey = vitest_1.vi.fn(function () { return "rk_test"; });
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
    randomIdempotencyKey: function () { return randomIdempotencyKey(); },
}); });
vitest_1.vi.mock("../runtime.js", function () { return ({
    defaultRuntime: defaultRuntime,
}); });
vitest_1.vi.mock("../config/config.js", function () { return ({
    loadConfig: function () { return ({}); },
}); });
(0, vitest_1.describe)("nodes-cli coverage", function () {
    (0, vitest_1.it)("lists nodes via node.list", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerNodesCli, program;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    callGateway.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./nodes-cli.js"); })];
                case 1:
                    registerNodesCli = (_c.sent()).registerNodesCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerNodesCli(program);
                    return [4 /*yield*/, program.parseAsync(["nodes", "status"], { from: "user" })];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalled();
                    (0, vitest_1.expect)((_b = (_a = callGateway.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.method).toBe("node.list");
                    (0, vitest_1.expect)(runtimeErrors).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("invokes system.run with parsed params", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerNodesCli, program, invoke;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    callGateway.mockClear();
                    randomIdempotencyKey.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./nodes-cli.js"); })];
                case 1:
                    registerNodesCli = (_f.sent()).registerNodesCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerNodesCli(program);
                    return [4 /*yield*/, program.parseAsync([
                            "nodes",
                            "run",
                            "--node",
                            "mac-1",
                            "--cwd",
                            "/tmp",
                            "--env",
                            "FOO=bar",
                            "--command-timeout",
                            "1200",
                            "--needs-screen-recording",
                            "--invoke-timeout",
                            "5000",
                            "echo",
                            "hi",
                        ], { from: "user" })];
                case 2:
                    _f.sent();
                    invoke = (_a = callGateway.mock.calls.find(function (call) { var _a; return ((_a = call[0]) === null || _a === void 0 ? void 0 : _a.method) === "node.invoke"; })) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(invoke).toBeTruthy();
                    (0, vitest_1.expect)((_b = invoke === null || invoke === void 0 ? void 0 : invoke.params) === null || _b === void 0 ? void 0 : _b.idempotencyKey).toBe("rk_test");
                    (0, vitest_1.expect)((_c = invoke === null || invoke === void 0 ? void 0 : invoke.params) === null || _c === void 0 ? void 0 : _c.command).toBe("system.run");
                    (0, vitest_1.expect)((_d = invoke === null || invoke === void 0 ? void 0 : invoke.params) === null || _d === void 0 ? void 0 : _d.params).toEqual({
                        command: ["echo", "hi"],
                        cwd: "/tmp",
                        env: { FOO: "bar" },
                        timeoutMs: 1200,
                        needsScreenRecording: true,
                        agentId: "main",
                        approved: true,
                        approvalDecision: "allow-once",
                    });
                    (0, vitest_1.expect)((_e = invoke === null || invoke === void 0 ? void 0 : invoke.params) === null || _e === void 0 ? void 0 : _e.timeoutMs).toBe(5000);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("invokes system.run with raw command", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerNodesCli, program, invoke;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    callGateway.mockClear();
                    randomIdempotencyKey.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./nodes-cli.js"); })];
                case 1:
                    registerNodesCli = (_e.sent()).registerNodesCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerNodesCli(program);
                    return [4 /*yield*/, program.parseAsync(["nodes", "run", "--agent", "main", "--node", "mac-1", "--raw", "echo hi"], { from: "user" })];
                case 2:
                    _e.sent();
                    invoke = (_a = callGateway.mock.calls.find(function (call) { var _a; return ((_a = call[0]) === null || _a === void 0 ? void 0 : _a.method) === "node.invoke"; })) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(invoke).toBeTruthy();
                    (0, vitest_1.expect)((_b = invoke === null || invoke === void 0 ? void 0 : invoke.params) === null || _b === void 0 ? void 0 : _b.idempotencyKey).toBe("rk_test");
                    (0, vitest_1.expect)((_c = invoke === null || invoke === void 0 ? void 0 : invoke.params) === null || _c === void 0 ? void 0 : _c.command).toBe("system.run");
                    (0, vitest_1.expect)((_d = invoke === null || invoke === void 0 ? void 0 : invoke.params) === null || _d === void 0 ? void 0 : _d.params).toMatchObject({
                        command: ["/bin/sh", "-lc", "echo hi"],
                        rawCommand: "echo hi",
                        agentId: "main",
                        approved: true,
                        approvalDecision: "allow-once",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("invokes system.notify with provided fields", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerNodesCli, program, invoke;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    callGateway.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./nodes-cli.js"); })];
                case 1:
                    registerNodesCli = (_d.sent()).registerNodesCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerNodesCli(program);
                    return [4 /*yield*/, program.parseAsync([
                            "nodes",
                            "notify",
                            "--node",
                            "mac-1",
                            "--title",
                            "Ping",
                            "--body",
                            "Gateway ready",
                            "--delivery",
                            "overlay",
                        ], { from: "user" })];
                case 2:
                    _d.sent();
                    invoke = (_a = callGateway.mock.calls.find(function (call) { var _a; return ((_a = call[0]) === null || _a === void 0 ? void 0 : _a.method) === "node.invoke"; })) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(invoke).toBeTruthy();
                    (0, vitest_1.expect)((_b = invoke === null || invoke === void 0 ? void 0 : invoke.params) === null || _b === void 0 ? void 0 : _b.command).toBe("system.notify");
                    (0, vitest_1.expect)((_c = invoke === null || invoke === void 0 ? void 0 : invoke.params) === null || _c === void 0 ? void 0 : _c.params).toEqual({
                        title: "Ping",
                        body: "Gateway ready",
                        sound: undefined,
                        priority: undefined,
                        delivery: "overlay",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("invokes location.get with params", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerNodesCli, program, invoke;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    callGateway.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./nodes-cli.js"); })];
                case 1:
                    registerNodesCli = (_e.sent()).registerNodesCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerNodesCli(program);
                    return [4 /*yield*/, program.parseAsync([
                            "nodes",
                            "location",
                            "get",
                            "--node",
                            "mac-1",
                            "--accuracy",
                            "precise",
                            "--max-age",
                            "1000",
                            "--location-timeout",
                            "5000",
                            "--invoke-timeout",
                            "6000",
                        ], { from: "user" })];
                case 2:
                    _e.sent();
                    invoke = (_a = callGateway.mock.calls.find(function (call) { var _a; return ((_a = call[0]) === null || _a === void 0 ? void 0 : _a.method) === "node.invoke"; })) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(invoke).toBeTruthy();
                    (0, vitest_1.expect)((_b = invoke === null || invoke === void 0 ? void 0 : invoke.params) === null || _b === void 0 ? void 0 : _b.command).toBe("location.get");
                    (0, vitest_1.expect)((_c = invoke === null || invoke === void 0 ? void 0 : invoke.params) === null || _c === void 0 ? void 0 : _c.params).toEqual({
                        maxAgeMs: 1000,
                        desiredAccuracy: "precise",
                        timeoutMs: 5000,
                    });
                    (0, vitest_1.expect)((_d = invoke === null || invoke === void 0 ? void 0 : invoke.params) === null || _d === void 0 ? void 0 : _d.timeoutMs).toBe(6000);
                    return [2 /*return*/];
            }
        });
    }); });
});
