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
            case 0: return [4 /*yield*/, enabledServer.close({ reason: "openai http enabled suite done" })];
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
                            openAiChatCompletionsEnabled: false,
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
                            openAiChatCompletionsEnabled: (_a = opts === null || opts === void 0 ? void 0 : opts.openAiChatCompletionsEnabled) !== null && _a !== void 0 ? _a : true,
                        })];
                case 2: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
function postChatCompletions(port, body, headers) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/v1/chat/completions"), {
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
function parseSseDataLines(text) {
    return text
        .split("\n")
        .map(function (line) { return line.trim(); })
        .filter(function (line) { return line.startsWith("data: "); })
        .map(function (line) { return line.slice("data: ".length); });
}
(0, vitest_1.describe)("OpenAI-compatible HTTP API (e2e)", function () {
    (0, vitest_1.it)("rejects when disabled (default + config)", { timeout: 120000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, server, res, port, server, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
                case 1:
                    port = _a.sent();
                    return [4 /*yield*/, startServerWithDefaultConfig(port)];
                case 2:
                    server = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 5, 7]);
                    return [4 /*yield*/, postChatCompletions(port, {
                            model: "openclaw",
                            messages: [{ role: "user", content: "hi" }],
                        })];
                case 4:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(404);
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, server.close({ reason: "test done" })];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
                case 8:
                    port = _a.sent();
                    return [4 /*yield*/, startServer(port, {
                            openAiChatCompletionsEnabled: false,
                        })];
                case 9:
                    server = _a.sent();
                    _a.label = 10;
                case 10:
                    _a.trys.push([10, , 12, 14]);
                    return [4 /*yield*/, postChatCompletions(port, {
                            model: "openclaw",
                            messages: [{ role: "user", content: "hi" }],
                        })];
                case 11:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(404);
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, server.close({ reason: "test done" })];
                case 13:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles request validation and routing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, mockAgentOnce, res, res, res, opts, res, opts, res, opts, res, opts, res, opts, res, opts, res, opts, message, res, opts, message, res, opts, extraSystemPrompt, res, opts, message, res, json, choice0, msg, res, missingUserJson;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0:
                    port = enabledPort;
                    mockAgentOnce = function (payloads) {
                        test_helpers_js_1.agentCommand.mockReset();
                        test_helpers_js_1.agentCommand.mockResolvedValueOnce({ payloads: payloads });
                    };
                    _x.label = 1;
                case 1:
                    _x.trys.push([1, , 30, 31]);
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/v1/chat/completions"), {
                            method: "GET",
                            headers: { authorization: "Bearer secret" },
                        })];
                case 2:
                    res = _x.sent();
                    (0, vitest_1.expect)(res.status).toBe(405);
                    return [4 /*yield*/, res.text()];
                case 3:
                    _x.sent();
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/v1/chat/completions"), {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] }),
                        })];
                case 4:
                    res = _x.sent();
                    (0, vitest_1.expect)(res.status).toBe(401);
                    return [4 /*yield*/, res.text()];
                case 5:
                    _x.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postChatCompletions(port, { model: "openclaw", messages: [{ role: "user", content: "hi" }] }, { "x-openclaw-agent-id": "beta" })];
                case 6:
                    res = _x.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    (0, vitest_1.expect)(test_helpers_js_1.agentCommand).toHaveBeenCalledTimes(1);
                    opts = ((_a = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _a !== void 0 ? _a : [])[0];
                    (0, vitest_1.expect)((_b = opts === null || opts === void 0 ? void 0 : opts.sessionKey) !== null && _b !== void 0 ? _b : "").toMatch(/^agent:beta:/);
                    return [4 /*yield*/, res.text()];
                case 7:
                    _x.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postChatCompletions(port, {
                            model: "openclaw:beta",
                            messages: [{ role: "user", content: "hi" }],
                        })];
                case 8:
                    res = _x.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    (0, vitest_1.expect)(test_helpers_js_1.agentCommand).toHaveBeenCalledTimes(1);
                    opts = ((_c = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _c !== void 0 ? _c : [])[0];
                    (0, vitest_1.expect)((_d = opts === null || opts === void 0 ? void 0 : opts.sessionKey) !== null && _d !== void 0 ? _d : "").toMatch(/^agent:beta:/);
                    return [4 /*yield*/, res.text()];
                case 9:
                    _x.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postChatCompletions(port, {
                            model: "openclaw:beta",
                            messages: [{ role: "user", content: "hi" }],
                        }, { "x-openclaw-agent-id": "alpha" })];
                case 10:
                    res = _x.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    (0, vitest_1.expect)(test_helpers_js_1.agentCommand).toHaveBeenCalledTimes(1);
                    opts = ((_e = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _e !== void 0 ? _e : [])[0];
                    (0, vitest_1.expect)((_f = opts === null || opts === void 0 ? void 0 : opts.sessionKey) !== null && _f !== void 0 ? _f : "").toMatch(/^agent:alpha:/);
                    return [4 /*yield*/, res.text()];
                case 11:
                    _x.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postChatCompletions(port, { model: "openclaw", messages: [{ role: "user", content: "hi" }] }, {
                            "x-openclaw-agent-id": "beta",
                            "x-openclaw-session-key": "agent:beta:openai:custom",
                        })];
                case 12:
                    res = _x.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    opts = ((_g = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _g !== void 0 ? _g : [])[0];
                    (0, vitest_1.expect)(opts === null || opts === void 0 ? void 0 : opts.sessionKey).toBe("agent:beta:openai:custom");
                    return [4 /*yield*/, res.text()];
                case 13:
                    _x.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postChatCompletions(port, {
                            user: "alice",
                            model: "openclaw",
                            messages: [{ role: "user", content: "hi" }],
                        })];
                case 14:
                    res = _x.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    opts = ((_h = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _h !== void 0 ? _h : [])[0];
                    (0, vitest_1.expect)((_j = opts === null || opts === void 0 ? void 0 : opts.sessionKey) !== null && _j !== void 0 ? _j : "").toContain("openai-user:alice");
                    return [4 /*yield*/, res.text()];
                case 15:
                    _x.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postChatCompletions(port, {
                            model: "openclaw",
                            messages: [
                                {
                                    role: "user",
                                    content: [
                                        { type: "text", text: "hello" },
                                        { type: "input_text", text: "world" },
                                    ],
                                },
                            ],
                        })];
                case 16:
                    res = _x.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    opts = ((_k = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _k !== void 0 ? _k : [])[0];
                    (0, vitest_1.expect)(opts === null || opts === void 0 ? void 0 : opts.message).toBe("hello\nworld");
                    return [4 /*yield*/, res.text()];
                case 17:
                    _x.sent();
                    mockAgentOnce([{ text: "I am Claude" }]);
                    return [4 /*yield*/, postChatCompletions(port, {
                            model: "openclaw",
                            messages: [
                                { role: "system", content: "You are a helpful assistant." },
                                { role: "user", content: "Hello, who are you?" },
                                { role: "assistant", content: "I am Claude." },
                                { role: "user", content: "What did I just ask you?" },
                            ],
                        })];
                case 18:
                    res = _x.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    opts = ((_l = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _l !== void 0 ? _l : [])[0];
                    message = (_m = opts === null || opts === void 0 ? void 0 : opts.message) !== null && _m !== void 0 ? _m : "";
                    (0, vitest_1.expect)(message).toContain(history_js_1.HISTORY_CONTEXT_MARKER);
                    (0, vitest_1.expect)(message).toContain("User: Hello, who are you?");
                    (0, vitest_1.expect)(message).toContain("Assistant: I am Claude.");
                    (0, vitest_1.expect)(message).toContain(mentions_js_1.CURRENT_MESSAGE_MARKER);
                    (0, vitest_1.expect)(message).toContain("User: What did I just ask you?");
                    return [4 /*yield*/, res.text()];
                case 19:
                    _x.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postChatCompletions(port, {
                            model: "openclaw",
                            messages: [
                                { role: "system", content: "You are a helpful assistant." },
                                { role: "user", content: "Hello" },
                            ],
                        })];
                case 20:
                    res = _x.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    opts = ((_o = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _o !== void 0 ? _o : [])[0];
                    message = (_p = opts === null || opts === void 0 ? void 0 : opts.message) !== null && _p !== void 0 ? _p : "";
                    (0, vitest_1.expect)(message).not.toContain(history_js_1.HISTORY_CONTEXT_MARKER);
                    (0, vitest_1.expect)(message).not.toContain(mentions_js_1.CURRENT_MESSAGE_MARKER);
                    (0, vitest_1.expect)(message).toBe("Hello");
                    return [4 /*yield*/, res.text()];
                case 21:
                    _x.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postChatCompletions(port, {
                            model: "openclaw",
                            messages: [
                                { role: "developer", content: "You are a helpful assistant." },
                                { role: "user", content: "Hello" },
                            ],
                        })];
                case 22:
                    res = _x.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    opts = ((_q = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _q !== void 0 ? _q : [])[0];
                    extraSystemPrompt = (_r = opts === null || opts === void 0 ? void 0 : opts.extraSystemPrompt) !== null && _r !== void 0 ? _r : "";
                    (0, vitest_1.expect)(extraSystemPrompt).toBe("You are a helpful assistant.");
                    return [4 /*yield*/, res.text()];
                case 23:
                    _x.sent();
                    mockAgentOnce([{ text: "ok" }]);
                    return [4 /*yield*/, postChatCompletions(port, {
                            model: "openclaw",
                            messages: [
                                { role: "system", content: "You are a helpful assistant." },
                                { role: "user", content: "What's the weather?" },
                                { role: "assistant", content: "Checking the weather." },
                                { role: "tool", content: "Sunny, 70F." },
                            ],
                        })];
                case 24:
                    res = _x.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    opts = ((_s = test_helpers_js_1.agentCommand.mock.calls[0]) !== null && _s !== void 0 ? _s : [])[0];
                    message = (_t = opts === null || opts === void 0 ? void 0 : opts.message) !== null && _t !== void 0 ? _t : "";
                    (0, vitest_1.expect)(message).toContain(history_js_1.HISTORY_CONTEXT_MARKER);
                    (0, vitest_1.expect)(message).toContain("User: What's the weather?");
                    (0, vitest_1.expect)(message).toContain("Assistant: Checking the weather.");
                    (0, vitest_1.expect)(message).toContain(mentions_js_1.CURRENT_MESSAGE_MARKER);
                    (0, vitest_1.expect)(message).toContain("Tool: Sunny, 70F.");
                    return [4 /*yield*/, res.text()];
                case 25:
                    _x.sent();
                    mockAgentOnce([{ text: "hello" }]);
                    return [4 /*yield*/, postChatCompletions(port, {
                            stream: false,
                            model: "openclaw",
                            messages: [{ role: "user", content: "hi" }],
                        })];
                case 26:
                    res = _x.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    return [4 /*yield*/, res.json()];
                case 27:
                    json = (_x.sent());
                    (0, vitest_1.expect)(json.object).toBe("chat.completion");
                    (0, vitest_1.expect)(Array.isArray(json.choices)).toBe(true);
                    choice0 = (_u = json.choices[0]) !== null && _u !== void 0 ? _u : {};
                    msg = (_v = choice0.message) !== null && _v !== void 0 ? _v : {};
                    (0, vitest_1.expect)(msg.role).toBe("assistant");
                    (0, vitest_1.expect)(msg.content).toBe("hello");
                    return [4 /*yield*/, postChatCompletions(port, {
                            model: "openclaw",
                            messages: [{ role: "system", content: "yo" }],
                        })];
                case 28:
                    res = _x.sent();
                    (0, vitest_1.expect)(res.status).toBe(400);
                    return [4 /*yield*/, res.json()];
                case 29:
                    missingUserJson = (_x.sent());
                    (0, vitest_1.expect)((_w = missingUserJson.error) === null || _w === void 0 ? void 0 : _w.type).toBe("invalid_request_error");
                    return [3 /*break*/, 31];
                case 30: return [7 /*endfinally*/];
                case 31: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("streams SSE chunks when stream=true", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, res, text, data, jsonChunks, allContent, repeatedRes, repeatedText, repeatedData, repeatedChunks, repeatedContent, fallbackRes, fallbackText;
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
                    return [4 /*yield*/, postChatCompletions(port, {
                            stream: true,
                            model: "openclaw",
                            messages: [{ role: "user", content: "hi" }],
                        })];
                case 2:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    (0, vitest_1.expect)((_a = res.headers.get("content-type")) !== null && _a !== void 0 ? _a : "").toContain("text/event-stream");
                    return [4 /*yield*/, res.text()];
                case 3:
                    text = _b.sent();
                    data = parseSseDataLines(text);
                    (0, vitest_1.expect)(data[data.length - 1]).toBe("[DONE]");
                    jsonChunks = data
                        .filter(function (d) { return d !== "[DONE]"; })
                        .map(function (d) { return JSON.parse(d); });
                    (0, vitest_1.expect)(jsonChunks.some(function (c) { return c.object === "chat.completion.chunk"; })).toBe(true);
                    allContent = jsonChunks
                        .flatMap(function (c) { var _a; return (_a = c.choices) !== null && _a !== void 0 ? _a : []; })
                        .map(function (choice) { var _a; return (_a = choice.delta) === null || _a === void 0 ? void 0 : _a.content; })
                        .filter(function (v) { return typeof v === "string"; })
                        .join("");
                    (0, vitest_1.expect)(allContent).toBe("hello");
                    test_helpers_js_1.agentCommand.mockReset();
                    test_helpers_js_1.agentCommand.mockImplementationOnce(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var runId;
                        var _a;
                        return __generator(this, function (_b) {
                            runId = (_a = opts === null || opts === void 0 ? void 0 : opts.runId) !== null && _a !== void 0 ? _a : "";
                            (0, agent_events_js_1.emitAgentEvent)({ runId: runId, stream: "assistant", data: { delta: "hi" } });
                            (0, agent_events_js_1.emitAgentEvent)({ runId: runId, stream: "assistant", data: { delta: "hi" } });
                            return [2 /*return*/, { payloads: [{ text: "hihi" }] }];
                        });
                    }); });
                    return [4 /*yield*/, postChatCompletions(port, {
                            stream: true,
                            model: "openclaw",
                            messages: [{ role: "user", content: "hi" }],
                        })];
                case 4:
                    repeatedRes = _b.sent();
                    (0, vitest_1.expect)(repeatedRes.status).toBe(200);
                    return [4 /*yield*/, repeatedRes.text()];
                case 5:
                    repeatedText = _b.sent();
                    repeatedData = parseSseDataLines(repeatedText);
                    repeatedChunks = repeatedData
                        .filter(function (d) { return d !== "[DONE]"; })
                        .map(function (d) { return JSON.parse(d); });
                    repeatedContent = repeatedChunks
                        .flatMap(function (c) { var _a; return (_a = c.choices) !== null && _a !== void 0 ? _a : []; })
                        .map(function (choice) { var _a; return (_a = choice.delta) === null || _a === void 0 ? void 0 : _a.content; })
                        .filter(function (v) { return typeof v === "string"; })
                        .join("");
                    (0, vitest_1.expect)(repeatedContent).toBe("hihi");
                    test_helpers_js_1.agentCommand.mockReset();
                    test_helpers_js_1.agentCommand.mockResolvedValueOnce({
                        payloads: [{ text: "hello" }],
                    });
                    return [4 /*yield*/, postChatCompletions(port, {
                            stream: true,
                            model: "openclaw",
                            messages: [{ role: "user", content: "hi" }],
                        })];
                case 6:
                    fallbackRes = _b.sent();
                    (0, vitest_1.expect)(fallbackRes.status).toBe(200);
                    return [4 /*yield*/, fallbackRes.text()];
                case 7:
                    fallbackText = _b.sent();
                    (0, vitest_1.expect)(fallbackText).toContain("[DONE]");
                    (0, vitest_1.expect)(fallbackText).toContain("hello");
                    return [3 /*break*/, 9];
                case 8: return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
});
