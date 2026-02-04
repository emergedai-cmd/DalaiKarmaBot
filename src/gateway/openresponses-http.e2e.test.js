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
var history_js_1 = require("../auto-reply/reply/history.js");
var mentions_js_1 = require("../auto-reply/reply/mentions.js");
var agent_events_js_1 = require("../infra/agent-events.js");
var test_helpers_js_1 = require("./test-helpers.js");
(0, test_helpers_js_1.installGatewayTestHooks)({ scope: "suite" });
var enabledServer;
var enabledPort;
(0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
            case 1:
                enabledPort = _a.sent();
                return [4 /*yield*/, startServer(enabledPort)];
            case 2:
                enabledServer = _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, enabledServer.close({ reason: "openresponses enabled suite done" })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function startServerWithDefaultConfig(port) {
    return __awaiter(this, void 0, void 0, function () {
        var startGatewayServer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./server.js"); })];
                case 1:
                    startGatewayServer = (_a.sent()).startGatewayServer;
                    return [4 /*yield*/, startGatewayServer(port, {
                            host: "127.0.0.1",
                            auth: { mode: "token", token: "secret" },
                            controlUiEnabled: false,
                        })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function startServer(port, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var startGatewayServer;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./server.js"); })];
                case 1:
                    startGatewayServer = (_b.sent()).startGatewayServer;
                    return [4 /*yield*/, startGatewayServer(port, {
                            host: "127.0.0.1",
                            auth: { mode: "token", token: "secret" },
                            controlUiEnabled: false,
                            openResponsesEnabled: (_a = opts === null || opts === void 0 ? void 0 : opts.openResponsesEnabled) !== null && _a !== void 0 ? _a : true,
                        })];
                case 2: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
function postResponses(port, body, headers) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/v1/responses"), {
                        method: "POST",
                        headers: __assign({ "content-type": "application/json", authorization: "Bearer secret" }, headers),
                        body: JSON.stringify(body),
                    })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
function parseSseEvents(text) {
    var events = [];
    var lines = text.split("\n");
    var currentEvent;
    var currentData = [];
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if (line.startsWith("event: ")) {
            currentEvent = line.slice("event: ".length);
        }
        else if (line.startsWith("data: ")) {
            currentData.push(line.slice("data: ".length));
        }
        else if (line.trim() === "" && currentData.length > 0) {
            events.push({ event: currentEvent, data: currentData.join("\n") });
            currentEvent = undefined;
            currentData = [];
        }
    }
    return events;
}
function ensureResponseConsumed(res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (res.bodyUsed) {
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, res.text()];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
(0, vitest_1.describe)("OpenResponses HTTP API (e2e)", function () {
    (0, vitest_1.it)("rejects when disabled (default + config)", { timeout: 120000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, _server, res, disabledPort, disabledServer, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
                case 1:
                    port = _a.sent();
                    return [4 /*yield*/, startServerWithDefaultConfig(port)];
                case 2:
                    _server = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 6, 7]);
                    return [4 /*yield*/, postResponses(port, {
                            model: "openclaw",
                            input: "hi",
                        })];
                case 4:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(404);
                    return [4 /*yield*/, ensureResponseConsumed(res)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6: return [7 /*endfinally*/];
                case 7: return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
                case 8:
                    disabledPort = _a.sent();
                    return [4 /*yield*/, startServer(disabledPort, {
                            openResponsesEnabled: false,
                        })];
                case 9:
                    disabledServer = _a.sent();
                    _a.label = 10;
                case 10:
                    _a.trys.push([10, , 13, 15]);
                    return [4 /*yield*/, postResponses(disabledPort, {
                            model: "openclaw",
                            input: "hi",
                        })];
                case 11:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(404);
                    return [4 /*yield*/, ensureResponseConsumed(res)];
                case 12:
                    _a.sent();
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, disabledServer.close({ reason: "test done" })];
                case 14:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles OpenResponses request parsing and validation", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, mockAgentOnce, resNonPost, resMissingAuth, resMissingModel, missingModelJson, resHeader, optsHeader, resModel, optsModel, resUser, optsUser, resString, optsString, resArray, optsArray, resSystemDeveloper, optsSystemDeveloper, extraSystemPrompt, resInstructions, optsInstructions, instructionPrompt, resHistory, optsHistory, historyMessage, resFunctionOutput, optsFunctionOutput, functionOutputMessage, resInputFile, optsInputFile, inputFileMessage, inputFilePrompt, resToolNone, optsToolNone, resToolChoice, optsToolChoice, clientTools, resUnknownTool, resMaxTokens, optsMaxTokens, resUsage, usageJson, resShape, shapeJson, output, item, content, resNoUser, noUserJson;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
        return __generator(this, function (_7) {
            switch (_7.label) {
                case 0:
                    port = enabledPort;
                    mockAgentOnce = function (payloads, meta) {
                        test_helpers_js_1.agentCommand.mockReset();
                        test_helpers_js_1.agentCommand.mockResolvedValueOnce({ payloads: payloads, meta: meta });
                    };
                    _7.label = 1;
                case 1:
                    _7.trys.push([1, , 46, 47]);
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/v1/responses"), {
                            method: "GET",
                            headers: { authorization: "Bearer secret" },
                        })];
                case 2:
                    resNonPost = _7.sent();
                    (0, vitest_1.expect)(resNonPost.status).toBe(405);
                    return [4 /*yield*/, ensureResponseConsumed(resNonPost)];
                case 3:
                    _7.sent();
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/v1/responses"), {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ model: "openclaw", input: "hi" }),
                        })];
                case 4:
                    resMissingAuth = _7.sent();
                    (0, vitest_1.expect)(resMissingAuth.status).toBe(401);
                    return [4 /*yield*/, ensureResponseConsumed(resMissingAuth)];
                case 5:
                    _7.sent();
                    return [4 /*yield*/, postResponses(port, { input: "hi" })];
                case 6:
                    resMissingModel = _7.sent();
                    (0, vitest_1.expect)(resMissingModel.status).toBe(400);
                    return [4 /*yield*/, resMissingModel.json()];
                case 7:
                    missingModelJson = (_7.sent());
                    (0, vitest_1.expect)((_a = missingModelJson.error) === null || _a === void 0 ? void 0 : _a.type).toBe("invalid_request_error");
                    return [4 /*yield*/, ensureResponseConsumed(resMissingModel)];
                case 8:
                    _7.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postResponses(port, { model: "openclaw", input: "hi" }, { "x-openclaw-agent-id": "beta" })];
                case 9:
                    resHeader = _7.sent();
                    (0, vitest_1.expect)(resHeader.status).toBe(200);
                    optsHeader = ((_b = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _b !== void 0 ? _b : [])[0];
                    (0, vitest_1.expect)((_c = optsHeader === null || optsHeader === void 0 ? void 0 : optsHeader.sessionKey) !== null && _c !== void 0 ? _c : "").toMatch(/^agent:beta:/);
                    return [4 /*yield*/, ensureResponseConsumed(resHeader)];
                case 10:
                    _7.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postResponses(port, { model: "openclaw:beta", input: "hi" })];
                case 11:
                    resModel = _7.sent();
                    (0, vitest_1.expect)(resModel.status).toBe(200);
                    optsModel = ((_d = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _d !== void 0 ? _d : [])[0];
                    (0, vitest_1.expect)((_e = optsModel === null || optsModel === void 0 ? void 0 : optsModel.sessionKey) !== null && _e !== void 0 ? _e : "").toMatch(/^agent:beta:/);
                    return [4 /*yield*/, ensureResponseConsumed(resModel)];
                case 12:
                    _7.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postResponses(port, {
                            user: "alice",
                            model: "openclaw",
                            input: "hi",
                        })];
                case 13:
                    resUser = _7.sent();
                    (0, vitest_1.expect)(resUser.status).toBe(200);
                    optsUser = ((_f = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _f !== void 0 ? _f : [])[0];
                    (0, vitest_1.expect)((_g = optsUser === null || optsUser === void 0 ? void 0 : optsUser.sessionKey) !== null && _g !== void 0 ? _g : "").toContain("openresponses-user:alice");
                    return [4 /*yield*/, ensureResponseConsumed(resUser)];
                case 14:
                    _7.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postResponses(port, {
                            model: "openclaw",
                            input: "hello world",
                        })];
                case 15:
                    resString = _7.sent();
                    (0, vitest_1.expect)(resString.status).toBe(200);
                    optsString = ((_h = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _h !== void 0 ? _h : [])[0];
                    (0, vitest_1.expect)(optsString === null || optsString === void 0 ? void 0 : optsString.message).toBe("hello world");
                    return [4 /*yield*/, ensureResponseConsumed(resString)];
                case 16:
                    _7.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postResponses(port, {
                            model: "openclaw",
                            input: [{ type: "message", role: "user", content: "hello there" }],
                        })];
                case 17:
                    resArray = _7.sent();
                    (0, vitest_1.expect)(resArray.status).toBe(200);
                    optsArray = ((_j = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _j !== void 0 ? _j : [])[0];
                    (0, vitest_1.expect)(optsArray === null || optsArray === void 0 ? void 0 : optsArray.message).toBe("hello there");
                    return [4 /*yield*/, ensureResponseConsumed(resArray)];
                case 18:
                    _7.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postResponses(port, {
                            model: "openclaw",
                            input: [
                                { type: "message", role: "system", content: "You are a helpful assistant." },
                                { type: "message", role: "developer", content: "Be concise." },
                                { type: "message", role: "user", content: "Hello" },
                            ],
                        })];
                case 19:
                    resSystemDeveloper = _7.sent();
                    (0, vitest_1.expect)(resSystemDeveloper.status).toBe(200);
                    optsSystemDeveloper = ((_k = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _k !== void 0 ? _k : [])[0];
                    extraSystemPrompt = (_l = optsSystemDeveloper === null || optsSystemDeveloper === void 0 ? void 0 : optsSystemDeveloper.extraSystemPrompt) !== null && _l !== void 0 ? _l : "";
                    (0, vitest_1.expect)(extraSystemPrompt).toContain("You are a helpful assistant.");
                    (0, vitest_1.expect)(extraSystemPrompt).toContain("Be concise.");
                    return [4 /*yield*/, ensureResponseConsumed(resSystemDeveloper)];
                case 20:
                    _7.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postResponses(port, {
                            model: "openclaw",
                            input: "hi",
                            instructions: "Always respond in French.",
                        })];
                case 21:
                    resInstructions = _7.sent();
                    (0, vitest_1.expect)(resInstructions.status).toBe(200);
                    optsInstructions = ((_m = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _m !== void 0 ? _m : [])[0];
                    instructionPrompt = (_o = optsInstructions === null || optsInstructions === void 0 ? void 0 : optsInstructions.extraSystemPrompt) !== null && _o !== void 0 ? _o : "";
                    (0, vitest_1.expect)(instructionPrompt).toContain("Always respond in French.");
                    return [4 /*yield*/, ensureResponseConsumed(resInstructions)];
                case 22:
                    _7.sent();
                    mockAgentOnce([{ text: "I am Claude" }]);
                    return [4 /*yield*/, postResponses(port, {
                            model: "openclaw",
                            input: [
                                { type: "message", role: "system", content: "You are a helpful assistant." },
                                { type: "message", role: "user", content: "Hello, who are you?" },
                                { type: "message", role: "assistant", content: "I am Claude." },
                                { type: "message", role: "user", content: "What did I just ask you?" },
                            ],
                        })];
                case 23:
                    resHistory = _7.sent();
                    (0, vitest_1.expect)(resHistory.status).toBe(200);
                    optsHistory = ((_p = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _p !== void 0 ? _p : [])[0];
                    historyMessage = (_q = optsHistory === null || optsHistory === void 0 ? void 0 : optsHistory.message) !== null && _q !== void 0 ? _q : "";
                    (0, vitest_1.expect)(historyMessage).toContain(history_js_1.HISTORY_CONTEXT_MARKER);
                    (0, vitest_1.expect)(historyMessage).toContain("User: Hello, who are you?");
                    (0, vitest_1.expect)(historyMessage).toContain("Assistant: I am Claude.");
                    (0, vitest_1.expect)(historyMessage).toContain(mentions_js_1.CURRENT_MESSAGE_MARKER);
                    (0, vitest_1.expect)(historyMessage).toContain("User: What did I just ask you?");
                    return [4 /*yield*/, ensureResponseConsumed(resHistory)];
                case 24:
                    _7.sent();
                    mockAgentOnce([{ text: "ok" }]);
                    return [4 /*yield*/, postResponses(port, {
                            model: "openclaw",
                            input: [
                                { type: "message", role: "user", content: "What's the weather?" },
                                { type: "function_call_output", call_id: "call_1", output: "Sunny, 70F." },
                            ],
                        })];
                case 25:
                    resFunctionOutput = _7.sent();
                    (0, vitest_1.expect)(resFunctionOutput.status).toBe(200);
                    optsFunctionOutput = ((_r = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _r !== void 0 ? _r : [])[0];
                    functionOutputMessage = (_s = optsFunctionOutput === null || optsFunctionOutput === void 0 ? void 0 : optsFunctionOutput.message) !== null && _s !== void 0 ? _s : "";
                    (0, vitest_1.expect)(functionOutputMessage).toContain("Sunny, 70F.");
                    return [4 /*yield*/, ensureResponseConsumed(resFunctionOutput)];
                case 26:
                    _7.sent();
                    mockAgentOnce([{ text: "ok" }]);
                    return [4 /*yield*/, postResponses(port, {
                            model: "openclaw",
                            input: [
                                {
                                    type: "message",
                                    role: "user",
                                    content: [
                                        { type: "input_text", text: "read this" },
                                        {
                                            type: "input_file",
                                            source: {
                                                type: "base64",
                                                media_type: "text/plain",
                                                data: Buffer.from("hello").toString("base64"),
                                                filename: "hello.txt",
                                            },
                                        },
                                    ],
                                },
                            ],
                        })];
                case 27:
                    resInputFile = _7.sent();
                    (0, vitest_1.expect)(resInputFile.status).toBe(200);
                    optsInputFile = ((_t = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _t !== void 0 ? _t : [])[0];
                    inputFileMessage = (_u = optsInputFile === null || optsInputFile === void 0 ? void 0 : optsInputFile.message) !== null && _u !== void 0 ? _u : "";
                    inputFilePrompt = (_v = optsInputFile === null || optsInputFile === void 0 ? void 0 : optsInputFile.extraSystemPrompt) !== null && _v !== void 0 ? _v : "";
                    (0, vitest_1.expect)(inputFileMessage).toBe("read this");
                    (0, vitest_1.expect)(inputFilePrompt).toContain('<file name="hello.txt">');
                    return [4 /*yield*/, ensureResponseConsumed(resInputFile)];
                case 28:
                    _7.sent();
                    mockAgentOnce([{ text: "ok" }]);
                    return [4 /*yield*/, postResponses(port, {
                            model: "openclaw",
                            input: "hi",
                            tools: [
                                {
                                    type: "function",
                                    function: { name: "get_weather", description: "Get weather" },
                                },
                            ],
                            tool_choice: "none",
                        })];
                case 29:
                    resToolNone = _7.sent();
                    (0, vitest_1.expect)(resToolNone.status).toBe(200);
                    optsToolNone = ((_w = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _w !== void 0 ? _w : [])[0];
                    (0, vitest_1.expect)(optsToolNone === null || optsToolNone === void 0 ? void 0 : optsToolNone.clientTools).toBeUndefined();
                    return [4 /*yield*/, ensureResponseConsumed(resToolNone)];
                case 30:
                    _7.sent();
                    mockAgentOnce([{ text: "ok" }]);
                    return [4 /*yield*/, postResponses(port, {
                            model: "openclaw",
                            input: "hi",
                            tools: [
                                {
                                    type: "function",
                                    function: { name: "get_weather", description: "Get weather" },
                                },
                                {
                                    type: "function",
                                    function: { name: "get_time", description: "Get time" },
                                },
                            ],
                            tool_choice: { type: "function", function: { name: "get_time" } },
                        })];
                case 31:
                    resToolChoice = _7.sent();
                    (0, vitest_1.expect)(resToolChoice.status).toBe(200);
                    optsToolChoice = ((_x = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _x !== void 0 ? _x : [])[0];
                    clientTools = (_y = optsToolChoice === null || optsToolChoice === void 0 ? void 0 : optsToolChoice.clientTools) !== null && _y !== void 0 ? _y : [];
                    (0, vitest_1.expect)(clientTools).toHaveLength(1);
                    (0, vitest_1.expect)((_0 = (_z = clientTools[0]) === null || _z === void 0 ? void 0 : _z.function) === null || _0 === void 0 ? void 0 : _0.name).toBe("get_time");
                    return [4 /*yield*/, ensureResponseConsumed(resToolChoice)];
                case 32:
                    _7.sent();
                    return [4 /*yield*/, postResponses(port, {
                            model: "openclaw",
                            input: "hi",
                            tools: [
                                {
                                    type: "function",
                                    function: { name: "get_weather", description: "Get weather" },
                                },
                            ],
                            tool_choice: { type: "function", function: { name: "unknown_tool" } },
                        })];
                case 33:
                    resUnknownTool = _7.sent();
                    (0, vitest_1.expect)(resUnknownTool.status).toBe(400);
                    return [4 /*yield*/, ensureResponseConsumed(resUnknownTool)];
                case 34:
                    _7.sent();
                    mockAgentOnce([{ text: "ok" }]);
                    return [4 /*yield*/, postResponses(port, {
                            model: "openclaw",
                            input: "hi",
                            max_output_tokens: 123,
                        })];
                case 35:
                    resMaxTokens = _7.sent();
                    (0, vitest_1.expect)(resMaxTokens.status).toBe(200);
                    optsMaxTokens = ((_1 = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _1 !== void 0 ? _1 : [])[0];
                    (0, vitest_1.expect)((_2 = optsMaxTokens === null || optsMaxTokens === void 0 ? void 0 : optsMaxTokens.streamParams) === null || _2 === void 0 ? void 0 : _2.maxTokens).toBe(123);
                    return [4 /*yield*/, ensureResponseConsumed(resMaxTokens)];
                case 36:
                    _7.sent();
                    mockAgentOnce([{ text: "ok" }], {
                        agentMeta: {
                            usage: { input: 3, output: 5, cacheRead: 1, cacheWrite: 1 },
                        },
                    });
                    return [4 /*yield*/, postResponses(port, {
                            stream: false,
                            model: "openclaw",
                            input: "hi",
                        })];
                case 37:
                    resUsage = _7.sent();
                    (0, vitest_1.expect)(resUsage.status).toBe(200);
                    return [4 /*yield*/, resUsage.json()];
                case 38:
                    usageJson = (_7.sent());
                    (0, vitest_1.expect)(usageJson.usage).toEqual({ input_tokens: 3, output_tokens: 5, total_tokens: 10 });
                    return [4 /*yield*/, ensureResponseConsumed(resUsage)];
                case 39:
                    _7.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postResponses(port, {
                            stream: false,
                            model: "openclaw",
                            input: "hi",
                        })];
                case 40:
                    resShape = _7.sent();
                    (0, vitest_1.expect)(resShape.status).toBe(200);
                    return [4 /*yield*/, resShape.json()];
                case 41:
                    shapeJson = (_7.sent());
                    (0, vitest_1.expect)(shapeJson.object).toBe("response");
                    (0, vitest_1.expect)(shapeJson.status).toBe("completed");
                    (0, vitest_1.expect)(Array.isArray(shapeJson.output)).toBe(true);
                    output = shapeJson.output;
                    (0, vitest_1.expect)(output.length).toBe(1);
                    item = (_3 = output[0]) !== null && _3 !== void 0 ? _3 : {};
                    (0, vitest_1.expect)(item.type).toBe("message");
                    (0, vitest_1.expect)(item.role).toBe("assistant");
                    content = item.content;
                    (0, vitest_1.expect)(content.length).toBe(1);
                    (0, vitest_1.expect)((_4 = content[0]) === null || _4 === void 0 ? void 0 : _4.type).toBe("output_text");
                    (0, vitest_1.expect)((_5 = content[0]) === null || _5 === void 0 ? void 0 : _5.text).toBe("hello");
                    return [4 /*yield*/, ensureResponseConsumed(resShape)];
                case 42:
                    _7.sent();
                    return [4 /*yield*/, postResponses(port, {
                            model: "openclaw",
                            input: [{ type: "message", role: "system", content: "yo" }],
                        })];
                case 43:
                    resNoUser = _7.sent();
                    (0, vitest_1.expect)(resNoUser.status).toBe(400);
                    return [4 /*yield*/, resNoUser.json()];
                case 44:
                    noUserJson = (_7.sent());
                    (0, vitest_1.expect)((_6 = noUserJson.error) === null || _6 === void 0 ? void 0 : _6.type).toBe("invalid_request_error");
                    return [4 /*yield*/, ensureResponseConsumed(resNoUser)];
                case 45:
                    _7.sent();
                    return [3 /*break*/, 47];
                case 46: return [7 /*endfinally*/];
                case 47: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("streams OpenResponses SSE events", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, resDelta, deltaText, deltaEvents, eventTypes, deltas, resFallback, fallbackText, resTypeMatch, typeText, typeEvents, _i, typeEvents_1, event_1, parsed;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    port = enabledPort;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 8, 9]);
                    test_helpers_js_1.agentCommand.mockReset();
                    test_helpers_js_1.agentCommand.mockImplementationOnce(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var runId;
                        var _a;
                        return __generator(this, function (_b) {
                            runId = (_a = opts === null || opts === void 0 ? void 0 : opts.runId) !== null && _a !== void 0 ? _a : "";
                            (0, agent_events_js_1.emitAgentEvent)({ runId: runId, stream: "assistant", data: { delta: "he" } });
                            (0, agent_events_js_1.emitAgentEvent)({ runId: runId, stream: "assistant", data: { delta: "llo" } });
                            return [2 /*return*/, { payloads: [{ text: "hello" }] }];
                        });
                    }); });
                    return [4 /*yield*/, postResponses(port, {
                            stream: true,
                            model: "openclaw",
                            input: "hi",
                        })];
                case 2:
                    resDelta = _b.sent();
                    (0, vitest_1.expect)(resDelta.status).toBe(200);
                    (0, vitest_1.expect)((_a = resDelta.headers.get("content-type")) !== null && _a !== void 0 ? _a : "").toContain("text/event-stream");
                    return [4 /*yield*/, resDelta.text()];
                case 3:
                    deltaText = _b.sent();
                    deltaEvents = parseSseEvents(deltaText);
                    eventTypes = deltaEvents.map(function (e) { return e.event; }).filter(Boolean);
                    (0, vitest_1.expect)(eventTypes).toContain("response.created");
                    (0, vitest_1.expect)(eventTypes).toContain("response.output_item.added");
                    (0, vitest_1.expect)(eventTypes).toContain("response.in_progress");
                    (0, vitest_1.expect)(eventTypes).toContain("response.content_part.added");
                    (0, vitest_1.expect)(eventTypes).toContain("response.output_text.delta");
                    (0, vitest_1.expect)(eventTypes).toContain("response.output_text.done");
                    (0, vitest_1.expect)(eventTypes).toContain("response.content_part.done");
                    (0, vitest_1.expect)(eventTypes).toContain("response.completed");
                    (0, vitest_1.expect)(deltaEvents.some(function (e) { return e.data === "[DONE]"; })).toBe(true);
                    deltas = deltaEvents
                        .filter(function (e) { return e.event === "response.output_text.delta"; })
                        .map(function (e) {
                        var _a;
                        var parsed = JSON.parse(e.data);
                        return (_a = parsed.delta) !== null && _a !== void 0 ? _a : "";
                    })
                        .join("");
                    (0, vitest_1.expect)(deltas).toBe("hello");
                    test_helpers_js_1.agentCommand.mockReset();
                    test_helpers_js_1.agentCommand.mockResolvedValueOnce({
                        payloads: [{ text: "hello" }],
                    });
                    return [4 /*yield*/, postResponses(port, {
                            stream: true,
                            model: "openclaw",
                            input: "hi",
                        })];
                case 4:
                    resFallback = _b.sent();
                    (0, vitest_1.expect)(resFallback.status).toBe(200);
                    return [4 /*yield*/, resFallback.text()];
                case 5:
                    fallbackText = _b.sent();
                    (0, vitest_1.expect)(fallbackText).toContain("[DONE]");
                    (0, vitest_1.expect)(fallbackText).toContain("hello");
                    test_helpers_js_1.agentCommand.mockReset();
                    test_helpers_js_1.agentCommand.mockResolvedValueOnce({
                        payloads: [{ text: "hello" }],
                    });
                    return [4 /*yield*/, postResponses(port, {
                            stream: true,
                            model: "openclaw",
                            input: "hi",
                        })];
                case 6:
                    resTypeMatch = _b.sent();
                    (0, vitest_1.expect)(resTypeMatch.status).toBe(200);
                    return [4 /*yield*/, resTypeMatch.text()];
                case 7:
                    typeText = _b.sent();
                    typeEvents = parseSseEvents(typeText);
                    for (_i = 0, typeEvents_1 = typeEvents; _i < typeEvents_1.length; _i++) {
                        event_1 = typeEvents_1[_i];
                        if (event_1.data === "[DONE]") {
                            continue;
                        }
                        parsed = JSON.parse(event_1.data);
                        (0, vitest_1.expect)(event_1.event).toBe(parsed.type);
                    }
                    return [3 /*break*/, 9];
                case 8: return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
});
