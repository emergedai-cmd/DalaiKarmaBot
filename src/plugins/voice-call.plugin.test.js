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
var runtimeStub;
vitest_1.vi.mock("../../extensions/voice-call/src/runtime.js", function () { return ({
    createVoiceCallRuntime: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, runtimeStub];
    }); }); }),
}); });
var index_js_1 = require("../../extensions/voice-call/index.js");
var noopLogger = {
    info: vitest_1.vi.fn(),
    warn: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
    debug: vitest_1.vi.fn(),
};
function setup(config) {
    var methods = new Map();
    var tools = [];
    index_js_1.default.register({
        id: "voice-call",
        name: "Voice Call",
        description: "test",
        version: "0",
        source: "test",
        config: {},
        pluginConfig: config,
        runtime: { tts: { textToSpeechTelephony: vitest_1.vi.fn() } },
        logger: noopLogger,
        registerGatewayMethod: function (method, handler) { return methods.set(method, handler); },
        registerTool: function (tool) { return tools.push(tool); },
        registerCli: function () { },
        registerService: function () { },
        resolvePath: function (p) { return p; },
    });
    return { methods: methods, tools: tools };
}
(0, vitest_1.describe)("voice-call plugin", function () {
    (0, vitest_1.beforeEach)(function () {
        runtimeStub = {
            config: { toNumber: "+15550001234" },
            manager: {
                initiateCall: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ callId: "call-1", success: true })];
                }); }); }),
                continueCall: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, ({
                                success: true,
                                transcript: "hello",
                            })];
                    });
                }); }),
                speak: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ success: true })];
                }); }); }),
                endCall: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ success: true })];
                }); }); }),
                getCall: vitest_1.vi.fn(function (id) { return (id === "call-1" ? { callId: "call-1" } : undefined); }),
                getCallByProviderCallId: vitest_1.vi.fn(function () { return undefined; }),
            },
            stop: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); }); }),
        };
    });
    (0, vitest_1.afterEach)(function () { return vitest_1.vi.restoreAllMocks(); });
    (0, vitest_1.it)("registers gateway methods", function () {
        var methods = setup({ provider: "mock" }).methods;
        (0, vitest_1.expect)(methods.has("voicecall.initiate")).toBe(true);
        (0, vitest_1.expect)(methods.has("voicecall.continue")).toBe(true);
        (0, vitest_1.expect)(methods.has("voicecall.speak")).toBe(true);
        (0, vitest_1.expect)(methods.has("voicecall.end")).toBe(true);
        (0, vitest_1.expect)(methods.has("voicecall.status")).toBe(true);
        (0, vitest_1.expect)(methods.has("voicecall.start")).toBe(true);
    });
    (0, vitest_1.it)("initiates a call via voicecall.initiate", function () { return __awaiter(void 0, void 0, void 0, function () {
        var methods, handler, respond, _a, ok, payload;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    methods = setup({ provider: "mock" }).methods;
                    handler = methods.get("voicecall.initiate");
                    respond = vitest_1.vi.fn();
                    return [4 /*yield*/, (handler === null || handler === void 0 ? void 0 : handler({ params: { message: "Hi" }, respond: respond }))];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(runtimeStub.manager.initiateCall).toHaveBeenCalled();
                    _a = respond.mock.calls[0], ok = _a[0], payload = _a[1];
                    (0, vitest_1.expect)(ok).toBe(true);
                    (0, vitest_1.expect)(payload.callId).toBe("call-1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns call status", function () { return __awaiter(void 0, void 0, void 0, function () {
        var methods, handler, respond, _a, ok, payload;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    methods = setup({ provider: "mock" }).methods;
                    handler = methods.get("voicecall.status");
                    respond = vitest_1.vi.fn();
                    return [4 /*yield*/, (handler === null || handler === void 0 ? void 0 : handler({ params: { callId: "call-1" }, respond: respond }))];
                case 1:
                    _b.sent();
                    _a = respond.mock.calls[0], ok = _a[0], payload = _a[1];
                    (0, vitest_1.expect)(ok).toBe(true);
                    (0, vitest_1.expect)(payload.found).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("tool get_status returns json payload", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tools, tool, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tools = setup({ provider: "mock" }).tools;
                    tool = tools[0];
                    return [4 /*yield*/, tool.execute("id", {
                            action: "get_status",
                            callId: "call-1",
                        })];
                case 1:
                    result = (_a.sent());
                    (0, vitest_1.expect)(result.details.found).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("legacy tool status without sid returns error payload", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tools, tool, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tools = setup({ provider: "mock" }).tools;
                    tool = tools[0];
                    return [4 /*yield*/, tool.execute("id", { mode: "status" })];
                case 1:
                    result = (_a.sent());
                    (0, vitest_1.expect)(String(result.details.error)).toContain("sid required");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("CLI start prints JSON", function () { return __awaiter(void 0, void 0, void 0, function () {
        var register, program, logSpy;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    register = index_js_1.default.register;
                    program = new commander_1.Command();
                    logSpy = vitest_1.vi.spyOn(console, "log").mockImplementation(function () { });
                    return [4 /*yield*/, register({
                            id: "voice-call",
                            name: "Voice Call",
                            description: "test",
                            version: "0",
                            source: "test",
                            config: {},
                            pluginConfig: { provider: "mock" },
                            runtime: { tts: { textToSpeechTelephony: vitest_1.vi.fn() } },
                            logger: noopLogger,
                            registerGatewayMethod: function () { },
                            registerTool: function () { },
                            registerCli: function (fn) {
                                return fn({
                                    program: program,
                                    config: {},
                                    workspaceDir: undefined,
                                    logger: noopLogger,
                                });
                            },
                            registerService: function () { },
                            resolvePath: function (p) { return p; },
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, program.parseAsync(["voicecall", "start", "--to", "+1", "--message", "Hello"], {
                            from: "user",
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(logSpy).toHaveBeenCalled();
                    logSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
});
