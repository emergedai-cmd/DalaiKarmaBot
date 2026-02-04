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
var vitest_1 = require("vitest");
var messageCommand = vitest_1.vi.fn();
var statusCommand = vitest_1.vi.fn();
var configureCommand = vitest_1.vi.fn();
var configureCommandWithSections = vitest_1.vi.fn();
var setupCommand = vitest_1.vi.fn();
var onboardCommand = vitest_1.vi.fn();
var callGateway = vitest_1.vi.fn();
var runChannelLogin = vitest_1.vi.fn();
var runChannelLogout = vitest_1.vi.fn();
var runTui = vitest_1.vi.fn();
var runtime = {
    log: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
    exit: vitest_1.vi.fn(function () {
        throw new Error("exit");
    }),
};
vitest_1.vi.mock("../commands/message.js", function () { return ({ messageCommand: messageCommand }); });
vitest_1.vi.mock("../commands/status.js", function () { return ({ statusCommand: statusCommand }); });
vitest_1.vi.mock("../commands/configure.js", function () { return ({
    CONFIGURE_WIZARD_SECTIONS: [
        "workspace",
        "model",
        "web",
        "gateway",
        "daemon",
        "channels",
        "skills",
        "health",
    ],
    configureCommand: configureCommand,
    configureCommandWithSections: configureCommandWithSections,
}); });
vitest_1.vi.mock("../commands/setup.js", function () { return ({ setupCommand: setupCommand }); });
vitest_1.vi.mock("../commands/onboard.js", function () { return ({ onboardCommand: onboardCommand }); });
vitest_1.vi.mock("../runtime.js", function () { return ({ defaultRuntime: runtime }); });
vitest_1.vi.mock("./channel-auth.js", function () { return ({ runChannelLogin: runChannelLogin, runChannelLogout: runChannelLogout }); });
vitest_1.vi.mock("../tui/tui.js", function () { return ({ runTui: runTui }); });
vitest_1.vi.mock("../gateway/call.js", function () { return ({
    callGateway: callGateway,
    randomIdempotencyKey: function () { return "idem-test"; },
    buildGatewayConnectionDetails: function () { return ({
        url: "ws://127.0.0.1:1234",
        urlSource: "test",
        message: "Gateway target: ws://127.0.0.1:1234",
    }); },
}); });
vitest_1.vi.mock("./deps.js", function () { return ({ createDefaultDeps: function () { return ({}); } }); });
var buildProgram = (await Promise.resolve().then(function () { return require("./program.js"); })).buildProgram;
(0, vitest_1.describe)("cli program (nodes basics)", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        runTui.mockResolvedValue(undefined);
    });
    (0, vitest_1.it)("runs nodes list and calls node.pair.list", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGateway.mockResolvedValue({ pending: [], paired: [] });
                    program = buildProgram();
                    runtime.log.mockClear();
                    return [4 /*yield*/, program.parseAsync(["nodes", "list"], { from: "user" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ method: "node.pair.list" }));
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledWith("Pending: 0 · Paired: 0");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs nodes list --connected and filters to connected nodes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var now, program, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = Date.now();
                    callGateway.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (opts.method === "node.pair.list") {
                                return [2 /*return*/, {
                                        pending: [],
                                        paired: [
                                            {
                                                nodeId: "n1",
                                                displayName: "One",
                                                remoteIp: "10.0.0.1",
                                                lastConnectedAtMs: now - 1000,
                                            },
                                            {
                                                nodeId: "n2",
                                                displayName: "Two",
                                                remoteIp: "10.0.0.2",
                                                lastConnectedAtMs: now - 1000,
                                            },
                                        ],
                                    }];
                            }
                            if (opts.method === "node.list") {
                                return [2 /*return*/, {
                                        nodes: [
                                            { nodeId: "n1", connected: true },
                                            { nodeId: "n2", connected: false },
                                        ],
                                    }];
                            }
                            return [2 /*return*/, { ok: true }];
                        });
                    }); });
                    program = buildProgram();
                    runtime.log.mockClear();
                    return [4 /*yield*/, program.parseAsync(["nodes", "list", "--connected"], { from: "user" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ method: "node.list" }));
                    output = runtime.log.mock.calls.map(function (c) { var _a; return String((_a = c[0]) !== null && _a !== void 0 ? _a : ""); }).join("\n");
                    (0, vitest_1.expect)(output).toContain("One");
                    (0, vitest_1.expect)(output).not.toContain("Two");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs nodes status --last-connected and filters by age", function () { return __awaiter(void 0, void 0, void 0, function () {
        var now, program, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = Date.now();
                    callGateway.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (opts.method === "node.list") {
                                return [2 /*return*/, {
                                        ts: now,
                                        nodes: [
                                            { nodeId: "n1", displayName: "One", connected: false },
                                            { nodeId: "n2", displayName: "Two", connected: false },
                                        ],
                                    }];
                            }
                            if (opts.method === "node.pair.list") {
                                return [2 /*return*/, {
                                        pending: [],
                                        paired: [
                                            { nodeId: "n1", lastConnectedAtMs: now - 1000 },
                                            { nodeId: "n2", lastConnectedAtMs: now - 2 * 24 * 60 * 60 * 1000 },
                                        ],
                                    }];
                            }
                            return [2 /*return*/, { ok: true }];
                        });
                    }); });
                    program = buildProgram();
                    runtime.log.mockClear();
                    return [4 /*yield*/, program.parseAsync(["nodes", "status", "--last-connected", "24h"], {
                            from: "user",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ method: "node.pair.list" }));
                    output = runtime.log.mock.calls.map(function (c) { var _a; return String((_a = c[0]) !== null && _a !== void 0 ? _a : ""); }).join("\n");
                    (0, vitest_1.expect)(output).toContain("One");
                    (0, vitest_1.expect)(output).not.toContain("Two");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs nodes status and calls node.list", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGateway.mockResolvedValue({
                        ts: Date.now(),
                        nodes: [
                            {
                                nodeId: "ios-node",
                                displayName: "iOS Node",
                                remoteIp: "192.168.0.88",
                                deviceFamily: "iPad",
                                modelIdentifier: "iPad16,6",
                                caps: ["canvas", "camera"],
                                paired: true,
                                connected: true,
                            },
                        ],
                    });
                    program = buildProgram();
                    runtime.log.mockClear();
                    return [4 /*yield*/, program.parseAsync(["nodes", "status"], { from: "user" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ method: "node.list", params: {} }));
                    output = runtime.log.mock.calls.map(function (c) { var _a; return String((_a = c[0]) !== null && _a !== void 0 ? _a : ""); }).join("\n");
                    (0, vitest_1.expect)(output).toContain("Known: 1 · Paired: 1 · Connected: 1");
                    (0, vitest_1.expect)(output).toContain("iOS Node");
                    (0, vitest_1.expect)(output).toContain("Detail");
                    (0, vitest_1.expect)(output).toContain("device: iPad");
                    (0, vitest_1.expect)(output).toContain("hw: iPad16,6");
                    (0, vitest_1.expect)(output).toContain("Status");
                    (0, vitest_1.expect)(output).toContain("paired");
                    (0, vitest_1.expect)(output).toContain("Caps");
                    (0, vitest_1.expect)(output).toContain("camera");
                    (0, vitest_1.expect)(output).toContain("canvas");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs nodes status and shows unpaired nodes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGateway.mockResolvedValue({
                        ts: Date.now(),
                        nodes: [
                            {
                                nodeId: "android-node",
                                displayName: "Peter's Tab S10 Ultra",
                                remoteIp: "192.168.0.99",
                                deviceFamily: "Android",
                                modelIdentifier: "samsung SM-X926B",
                                caps: ["canvas", "camera"],
                                paired: false,
                                connected: true,
                            },
                        ],
                    });
                    program = buildProgram();
                    runtime.log.mockClear();
                    return [4 /*yield*/, program.parseAsync(["nodes", "status"], { from: "user" })];
                case 1:
                    _a.sent();
                    output = runtime.log.mock.calls.map(function (c) { var _a; return String((_a = c[0]) !== null && _a !== void 0 ? _a : ""); }).join("\n");
                    (0, vitest_1.expect)(output).toContain("Known: 1 · Paired: 0 · Connected: 1");
                    (0, vitest_1.expect)(output).toContain("Peter's Tab");
                    (0, vitest_1.expect)(output).toContain("S10 Ultra");
                    (0, vitest_1.expect)(output).toContain("Detail");
                    (0, vitest_1.expect)(output).toContain("device: Android");
                    (0, vitest_1.expect)(output).toContain("hw: samsung");
                    (0, vitest_1.expect)(output).toContain("SM-X926B");
                    (0, vitest_1.expect)(output).toContain("Status");
                    (0, vitest_1.expect)(output).toContain("unpaired");
                    (0, vitest_1.expect)(output).toContain("connected");
                    (0, vitest_1.expect)(output).toContain("Caps");
                    (0, vitest_1.expect)(output).toContain("camera");
                    (0, vitest_1.expect)(output).toContain("canvas");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs nodes describe and calls node.describe", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program, out;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGateway.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (opts.method === "node.list") {
                                return [2 /*return*/, {
                                        ts: Date.now(),
                                        nodes: [
                                            {
                                                nodeId: "ios-node",
                                                displayName: "iOS Node",
                                                remoteIp: "192.168.0.88",
                                                connected: true,
                                            },
                                        ],
                                    }];
                            }
                            if (opts.method === "node.describe") {
                                return [2 /*return*/, {
                                        ts: Date.now(),
                                        nodeId: "ios-node",
                                        displayName: "iOS Node",
                                        caps: ["canvas", "camera"],
                                        commands: ["canvas.eval", "canvas.snapshot", "camera.snap"],
                                        connected: true,
                                    }];
                            }
                            return [2 /*return*/, { ok: true }];
                        });
                    }); });
                    program = buildProgram();
                    runtime.log.mockClear();
                    return [4 /*yield*/, program.parseAsync(["nodes", "describe", "--node", "ios-node"], {
                            from: "user",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ method: "node.list", params: {} }));
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        method: "node.describe",
                        params: { nodeId: "ios-node" },
                    }));
                    out = runtime.log.mock.calls.map(function (c) { var _a; return String((_a = c[0]) !== null && _a !== void 0 ? _a : ""); }).join("\n");
                    (0, vitest_1.expect)(out).toContain("Commands");
                    (0, vitest_1.expect)(out).toContain("canvas.eval");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs nodes approve and calls node.pair.approve", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGateway.mockResolvedValue({
                        requestId: "r1",
                        node: { nodeId: "n1", token: "t1" },
                    });
                    program = buildProgram();
                    runtime.log.mockClear();
                    return [4 /*yield*/, program.parseAsync(["nodes", "approve", "r1"], { from: "user" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        method: "node.pair.approve",
                        params: { requestId: "r1" },
                    }));
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs nodes invoke and calls node.invoke", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGateway.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (opts.method === "node.list") {
                                return [2 /*return*/, {
                                        ts: Date.now(),
                                        nodes: [
                                            {
                                                nodeId: "ios-node",
                                                displayName: "iOS Node",
                                                remoteIp: "192.168.0.88",
                                                connected: true,
                                            },
                                        ],
                                    }];
                            }
                            if (opts.method === "node.invoke") {
                                return [2 /*return*/, {
                                        ok: true,
                                        nodeId: "ios-node",
                                        command: "canvas.eval",
                                        payload: { result: "ok" },
                                    }];
                            }
                            return [2 /*return*/, { ok: true }];
                        });
                    }); });
                    program = buildProgram();
                    runtime.log.mockClear();
                    return [4 /*yield*/, program.parseAsync([
                            "nodes",
                            "invoke",
                            "--node",
                            "ios-node",
                            "--command",
                            "canvas.eval",
                            "--params",
                            '{"javaScript":"1+1"}',
                        ], { from: "user" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ method: "node.list", params: {} }));
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        method: "node.invoke",
                        params: {
                            nodeId: "ios-node",
                            command: "canvas.eval",
                            params: { javaScript: "1+1" },
                            timeoutMs: 15000,
                            idempotencyKey: "idem-test",
                        },
                    }));
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
