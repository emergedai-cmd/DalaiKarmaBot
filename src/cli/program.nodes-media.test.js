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
var fs = require("node:fs/promises");
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
(0, vitest_1.describe)("cli program (nodes media)", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        runTui.mockResolvedValue(undefined);
    });
    (0, vitest_1.it)("runs nodes camera snap and prints two MEDIA paths", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program, invokeCalls, facings, out, mediaPaths, _i, mediaPaths_1, p;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
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
                                        command: "camera.snap",
                                        payload: { format: "jpg", base64: "aGk=", width: 1, height: 1 },
                                    }];
                            }
                            return [2 /*return*/, { ok: true }];
                        });
                    }); });
                    program = buildProgram();
                    runtime.log.mockClear();
                    return [4 /*yield*/, program.parseAsync(["nodes", "camera", "snap", "--node", "ios-node"], { from: "user" })];
                case 1:
                    _c.sent();
                    invokeCalls = callGateway.mock.calls
                        .map(function (call) { return call[0]; })
                        .filter(function (call) { return call.method === "node.invoke"; });
                    facings = invokeCalls
                        .map(function (call) { var _a, _b; return (_b = (_a = call.params) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.facing; })
                        .filter(Boolean)
                        .toSorted(function (a, b) { return a.localeCompare(b); });
                    (0, vitest_1.expect)(facings).toEqual(["back", "front"]);
                    out = String((_b = (_a = runtime.log.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : "");
                    mediaPaths = out
                        .split("\n")
                        .filter(function (l) { return l.startsWith("MEDIA:"); })
                        .map(function (l) { return l.replace(/^MEDIA:/, ""); })
                        .filter(Boolean);
                    (0, vitest_1.expect)(mediaPaths).toHaveLength(2);
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 7, 9]);
                    _i = 0, mediaPaths_1 = mediaPaths;
                    _c.label = 3;
                case 3:
                    if (!(_i < mediaPaths_1.length)) return [3 /*break*/, 6];
                    p = mediaPaths_1[_i];
                    return [4 /*yield*/, (0, vitest_1.expect)(fs.readFile(p, "utf8")).resolves.toBe("hi")];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, Promise.all(mediaPaths.map(function (p) { return fs.unlink(p).catch(function () { }); }))];
                case 8:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs nodes camera clip and prints one MEDIA path", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program, out, mediaPath;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
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
                                        command: "camera.clip",
                                        payload: {
                                            format: "mp4",
                                            base64: "aGk=",
                                            durationMs: 3000,
                                            hasAudio: true,
                                        },
                                    }];
                            }
                            return [2 /*return*/, { ok: true }];
                        });
                    }); });
                    program = buildProgram();
                    runtime.log.mockClear();
                    return [4 /*yield*/, program.parseAsync(["nodes", "camera", "clip", "--node", "ios-node", "--duration", "3000"], { from: "user" })];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        method: "node.invoke",
                        params: vitest_1.expect.objectContaining({
                            nodeId: "ios-node",
                            command: "camera.clip",
                            timeoutMs: 90000,
                            idempotencyKey: "idem-test",
                            params: vitest_1.expect.objectContaining({
                                facing: "front",
                                durationMs: 3000,
                                includeAudio: true,
                                format: "mp4",
                            }),
                        }),
                    }));
                    out = String((_b = (_a = runtime.log.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : "");
                    mediaPath = out.replace(/^MEDIA:/, "").trim();
                    (0, vitest_1.expect)(mediaPath).toMatch(/openclaw-camera-clip-front-.*\.mp4$/);
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 4, 6]);
                    return [4 /*yield*/, (0, vitest_1.expect)(fs.readFile(mediaPath, "utf8")).resolves.toBe("hi")];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, fs.unlink(mediaPath).catch(function () { })];
                case 5:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs nodes camera snap with facing front and passes params", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program, out, mediaPath;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
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
                                        command: "camera.snap",
                                        payload: { format: "jpg", base64: "aGk=", width: 1, height: 1 },
                                    }];
                            }
                            return [2 /*return*/, { ok: true }];
                        });
                    }); });
                    program = buildProgram();
                    runtime.log.mockClear();
                    return [4 /*yield*/, program.parseAsync([
                            "nodes",
                            "camera",
                            "snap",
                            "--node",
                            "ios-node",
                            "--facing",
                            "front",
                            "--max-width",
                            "640",
                            "--quality",
                            "0.8",
                            "--delay-ms",
                            "2000",
                            "--device-id",
                            "cam-123",
                        ], { from: "user" })];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        method: "node.invoke",
                        params: vitest_1.expect.objectContaining({
                            nodeId: "ios-node",
                            command: "camera.snap",
                            timeoutMs: 20000,
                            idempotencyKey: "idem-test",
                            params: vitest_1.expect.objectContaining({
                                facing: "front",
                                maxWidth: 640,
                                quality: 0.8,
                                delayMs: 2000,
                                deviceId: "cam-123",
                            }),
                        }),
                    }));
                    out = String((_b = (_a = runtime.log.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : "");
                    mediaPath = out.replace(/^MEDIA:/, "").trim();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 4, 6]);
                    return [4 /*yield*/, (0, vitest_1.expect)(fs.readFile(mediaPath, "utf8")).resolves.toBe("hi")];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, fs.unlink(mediaPath).catch(function () { })];
                case 5:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs nodes camera clip with --no-audio", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program, out, mediaPath;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
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
                                        command: "camera.clip",
                                        payload: {
                                            format: "mp4",
                                            base64: "aGk=",
                                            durationMs: 3000,
                                            hasAudio: false,
                                        },
                                    }];
                            }
                            return [2 /*return*/, { ok: true }];
                        });
                    }); });
                    program = buildProgram();
                    runtime.log.mockClear();
                    return [4 /*yield*/, program.parseAsync([
                            "nodes",
                            "camera",
                            "clip",
                            "--node",
                            "ios-node",
                            "--duration",
                            "3000",
                            "--no-audio",
                            "--device-id",
                            "cam-123",
                        ], { from: "user" })];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        method: "node.invoke",
                        params: vitest_1.expect.objectContaining({
                            nodeId: "ios-node",
                            command: "camera.clip",
                            timeoutMs: 90000,
                            idempotencyKey: "idem-test",
                            params: vitest_1.expect.objectContaining({
                                includeAudio: false,
                                deviceId: "cam-123",
                            }),
                        }),
                    }));
                    out = String((_b = (_a = runtime.log.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : "");
                    mediaPath = out.replace(/^MEDIA:/, "").trim();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 4, 6]);
                    return [4 /*yield*/, (0, vitest_1.expect)(fs.readFile(mediaPath, "utf8")).resolves.toBe("hi")];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, fs.unlink(mediaPath).catch(function () { })];
                case 5:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs nodes camera clip with human duration (10s)", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                                        command: "camera.clip",
                                        payload: {
                                            format: "mp4",
                                            base64: "aGk=",
                                            durationMs: 10000,
                                            hasAudio: true,
                                        },
                                    }];
                            }
                            return [2 /*return*/, { ok: true }];
                        });
                    }); });
                    program = buildProgram();
                    runtime.log.mockClear();
                    return [4 /*yield*/, program.parseAsync(["nodes", "camera", "clip", "--node", "ios-node", "--duration", "10s"], { from: "user" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(callGateway).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        method: "node.invoke",
                        params: vitest_1.expect.objectContaining({
                            nodeId: "ios-node",
                            command: "camera.clip",
                            params: vitest_1.expect.objectContaining({ durationMs: 10000 }),
                        }),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs nodes canvas snapshot and prints MEDIA path", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program, out, mediaPath;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
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
                                        command: "canvas.snapshot",
                                        payload: { format: "png", base64: "aGk=" },
                                    }];
                            }
                            return [2 /*return*/, { ok: true }];
                        });
                    }); });
                    program = buildProgram();
                    runtime.log.mockClear();
                    return [4 /*yield*/, program.parseAsync(["nodes", "canvas", "snapshot", "--node", "ios-node", "--format", "png"], { from: "user" })];
                case 1:
                    _c.sent();
                    out = String((_b = (_a = runtime.log.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : "");
                    mediaPath = out.replace(/^MEDIA:/, "").trim();
                    (0, vitest_1.expect)(mediaPath).toMatch(/openclaw-canvas-snapshot-.*\.png$/);
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 4, 6]);
                    return [4 /*yield*/, (0, vitest_1.expect)(fs.readFile(mediaPath, "utf8")).resolves.toBe("hi")];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, fs.unlink(mediaPath).catch(function () { })];
                case 5:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("fails nodes camera snap on invalid facing", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                            return [2 /*return*/, { ok: true }];
                        });
                    }); });
                    program = buildProgram();
                    runtime.error.mockClear();
                    return [4 /*yield*/, (0, vitest_1.expect)(program.parseAsync(["nodes", "camera", "snap", "--node", "ios-node", "--facing", "nope"], {
                            from: "user",
                        })).rejects.toThrow(/exit/i)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(runtime.error.mock.calls.some(function (_a) {
                        var msg = _a[0];
                        return /invalid facing/i.test(String(msg));
                    })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
