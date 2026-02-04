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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var callGatewayMock = vitest_1.vi.fn();
vitest_1.vi.mock("../gateway/call.js", function () { return ({
    callGateway: function (opts) { return callGatewayMock(opts); },
}); });
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: function () { return ({
                            session: {
                                mainKey: "main",
                                scope: "per-sender",
                                agentToAgent: { maxPingPongTurns: 2 },
                            },
                        }); }, resolveGatewayPort: function () { return 18789; } })];
        }
    });
}); });
require("./test-helpers/fast-core-tools.js");
var utils_js_1 = require("../utils.js");
var openclaw_tools_js_1 = require("./openclaw-tools.js");
var waitForCalls = function (getCount_1, count_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([getCount_1, count_1], args_1, true), void 0, function (getCount, count, timeoutMs) {
        var start;
        if (timeoutMs === void 0) { timeoutMs = 2000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    start = Date.now();
                    _a.label = 1;
                case 1:
                    if (!(getCount() < count)) return [3 /*break*/, 3];
                    if (Date.now() - start > timeoutMs) {
                        throw new Error("timed out waiting for ".concat(count, " calls"));
                    }
                    return [4 /*yield*/, (0, utils_js_1.sleep)(0)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
};
(0, vitest_1.describe)("sessions tools", function () {
    (0, vitest_1.it)("uses number (not integer) in tool schemas for Gemini compatibility", function () {
        var tools = (0, openclaw_tools_js_1.createOpenClawTools)();
        var byName = function (name) {
            var tool = tools.find(function (candidate) { return candidate.name === name; });
            (0, vitest_1.expect)(tool).toBeDefined();
            if (!tool) {
                throw new Error("missing ".concat(name, " tool"));
            }
            return tool;
        };
        var schemaProp = function (toolName, prop) {
            var _a;
            var tool = byName(toolName);
            var schema = tool.parameters;
            (0, vitest_1.expect)(schema.anyOf).toBeUndefined();
            (0, vitest_1.expect)(schema.oneOf).toBeUndefined();
            var properties = (_a = schema.properties) !== null && _a !== void 0 ? _a : {};
            var value = properties[prop];
            (0, vitest_1.expect)(value).toBeDefined();
            if (!value) {
                throw new Error("missing ".concat(toolName, " schema prop: ").concat(prop));
            }
            return value;
        };
        (0, vitest_1.expect)(schemaProp("sessions_history", "limit").type).toBe("number");
        (0, vitest_1.expect)(schemaProp("sessions_list", "limit").type).toBe("number");
        (0, vitest_1.expect)(schemaProp("sessions_list", "activeMinutes").type).toBe("number");
        (0, vitest_1.expect)(schemaProp("sessions_list", "messageLimit").type).toBe("number");
        (0, vitest_1.expect)(schemaProp("sessions_send", "timeoutSeconds").type).toBe("number");
        (0, vitest_1.expect)(schemaProp("sessions_spawn", "thinking").type).toBe("string");
        (0, vitest_1.expect)(schemaProp("sessions_spawn", "runTimeoutSeconds").type).toBe("number");
        (0, vitest_1.expect)(schemaProp("sessions_spawn", "timeoutSeconds").type).toBe("number");
    });
    (0, vitest_1.it)("sessions_list filters kinds and includes messages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, result, details, main, cronOnly, cronDetails;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    callGatewayMock.mockReset();
                    callGatewayMock.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var request;
                        return __generator(this, function (_a) {
                            request = opts;
                            if (request.method === "sessions.list") {
                                return [2 /*return*/, {
                                        path: "/tmp/sessions.json",
                                        sessions: [
                                            {
                                                key: "main",
                                                kind: "direct",
                                                sessionId: "s-main",
                                                updatedAt: 10,
                                                lastChannel: "whatsapp",
                                            },
                                            {
                                                key: "discord:group:dev",
                                                kind: "group",
                                                sessionId: "s-group",
                                                updatedAt: 11,
                                                channel: "discord",
                                                displayName: "discord:g-dev",
                                            },
                                            {
                                                key: "cron:job-1",
                                                kind: "direct",
                                                sessionId: "s-cron",
                                                updatedAt: 9,
                                            },
                                            { key: "global", kind: "global" },
                                            { key: "unknown", kind: "unknown" },
                                        ],
                                    }];
                            }
                            if (request.method === "chat.history") {
                                return [2 /*return*/, {
                                        messages: [
                                            { role: "toolResult", content: [] },
                                            {
                                                role: "assistant",
                                                content: [{ type: "text", text: "hi" }],
                                            },
                                        ],
                                    }];
                            }
                            return [2 /*return*/, {}];
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)().find(function (candidate) { return candidate.name === "sessions_list"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing sessions_list tool");
                    }
                    return [4 /*yield*/, tool.execute("call1", { messageLimit: 1 })];
                case 1:
                    result = _g.sent();
                    details = result.details;
                    (0, vitest_1.expect)(details.sessions).toHaveLength(3);
                    main = (_a = details.sessions) === null || _a === void 0 ? void 0 : _a.find(function (s) { return s.key === "main"; });
                    (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.channel).toBe("whatsapp");
                    (0, vitest_1.expect)((_b = main === null || main === void 0 ? void 0 : main.messages) === null || _b === void 0 ? void 0 : _b.length).toBe(1);
                    (0, vitest_1.expect)((_d = (_c = main === null || main === void 0 ? void 0 : main.messages) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.role).toBe("assistant");
                    return [4 /*yield*/, tool.execute("call2", { kinds: ["cron"] })];
                case 2:
                    cronOnly = _g.sent();
                    cronDetails = cronOnly.details;
                    (0, vitest_1.expect)(cronDetails.sessions).toHaveLength(1);
                    (0, vitest_1.expect)((_f = (_e = cronDetails.sessions) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.kind).toBe("cron");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sessions_history filters tool messages by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, result, details, withTools, withToolsDetails;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    callGatewayMock.mockReset();
                    callGatewayMock.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var request;
                        return __generator(this, function (_a) {
                            request = opts;
                            if (request.method === "chat.history") {
                                return [2 /*return*/, {
                                        messages: [
                                            { role: "toolResult", content: [] },
                                            { role: "assistant", content: [{ type: "text", text: "ok" }] },
                                        ],
                                    }];
                            }
                            return [2 /*return*/, {}];
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)().find(function (candidate) { return candidate.name === "sessions_history"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing sessions_history tool");
                    }
                    return [4 /*yield*/, tool.execute("call3", { sessionKey: "main" })];
                case 1:
                    result = _c.sent();
                    details = result.details;
                    (0, vitest_1.expect)(details.messages).toHaveLength(1);
                    (0, vitest_1.expect)((_b = (_a = details.messages) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.role).toBe("assistant");
                    return [4 /*yield*/, tool.execute("call4", {
                            sessionKey: "main",
                            includeTools: true,
                        })];
                case 2:
                    withTools = _c.sent();
                    withToolsDetails = withTools.details;
                    (0, vitest_1.expect)(withToolsDetails.messages).toHaveLength(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sessions_history resolves sessionId inputs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionId, targetKey, tool, result, details, historyCall;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGatewayMock.mockReset();
                    sessionId = "sess-group";
                    targetKey = "agent:main:discord:channel:1457165743010611293";
                    callGatewayMock.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var request;
                        return __generator(this, function (_a) {
                            request = opts;
                            if (request.method === "sessions.resolve") {
                                return [2 /*return*/, {
                                        key: targetKey,
                                    }];
                            }
                            if (request.method === "chat.history") {
                                return [2 /*return*/, {
                                        messages: [{ role: "assistant", content: [{ type: "text", text: "ok" }] }],
                                    }];
                            }
                            return [2 /*return*/, {}];
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)().find(function (candidate) { return candidate.name === "sessions_history"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing sessions_history tool");
                    }
                    return [4 /*yield*/, tool.execute("call5", { sessionKey: sessionId })];
                case 1:
                    result = _a.sent();
                    details = result.details;
                    (0, vitest_1.expect)(details.messages).toHaveLength(1);
                    historyCall = callGatewayMock.mock.calls.find(function (call) { return call[0].method === "chat.history"; });
                    (0, vitest_1.expect)(historyCall === null || historyCall === void 0 ? void 0 : historyCall[0]).toMatchObject({
                        method: "chat.history",
                        params: { sessionKey: targetKey },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sessions_history errors on missing sessionId", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionId, tool, result, details;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGatewayMock.mockReset();
                    sessionId = "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa";
                    callGatewayMock.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var request;
                        return __generator(this, function (_a) {
                            request = opts;
                            if (request.method === "sessions.resolve") {
                                throw new Error("No session found");
                            }
                            return [2 /*return*/, {}];
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)().find(function (candidate) { return candidate.name === "sessions_history"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing sessions_history tool");
                    }
                    return [4 /*yield*/, tool.execute("call6", { sessionKey: sessionId })];
                case 1:
                    result = _a.sent();
                    details = result.details;
                    (0, vitest_1.expect)(details.status).toBe("error");
                    (0, vitest_1.expect)(details.error).toMatch(/Session not found|No session found/);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sessions_send supports fire-and-forget and wait", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, agentCallCount, _historyCallCount, sendCallCount, lastWaitedRunId, replyByRunId, requesterKey, tool, fire, waitPromise, waited, agentCalls, waitCalls, historyOnlyCalls, _i, agentCalls_1, call;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGatewayMock.mockReset();
                    calls = [];
                    agentCallCount = 0;
                    _historyCallCount = 0;
                    sendCallCount = 0;
                    replyByRunId = new Map();
                    requesterKey = "discord:group:req";
                    callGatewayMock.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var request, runId, params, message, reply, params, text;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            request = opts;
                            calls.push(request);
                            if (request.method === "agent") {
                                agentCallCount += 1;
                                runId = "run-".concat(agentCallCount);
                                params = request.params;
                                message = (_a = params === null || params === void 0 ? void 0 : params.message) !== null && _a !== void 0 ? _a : "";
                                reply = "REPLY_SKIP";
                                if (message === "ping" || message === "wait") {
                                    reply = "done";
                                }
                                else if (message === "Agent-to-agent announce step.") {
                                    reply = "ANNOUNCE_SKIP";
                                }
                                else if ((params === null || params === void 0 ? void 0 : params.sessionKey) === requesterKey) {
                                    reply = "pong";
                                }
                                replyByRunId.set(runId, reply);
                                return [2 /*return*/, {
                                        runId: runId,
                                        status: "accepted",
                                        acceptedAt: 1234 + agentCallCount,
                                    }];
                            }
                            if (request.method === "agent.wait") {
                                params = request.params;
                                lastWaitedRunId = params === null || params === void 0 ? void 0 : params.runId;
                                return [2 /*return*/, { runId: (_b = params === null || params === void 0 ? void 0 : params.runId) !== null && _b !== void 0 ? _b : "run-1", status: "ok" }];
                            }
                            if (request.method === "chat.history") {
                                _historyCallCount += 1;
                                text = (_c = (lastWaitedRunId && replyByRunId.get(lastWaitedRunId))) !== null && _c !== void 0 ? _c : "";
                                return [2 /*return*/, {
                                        messages: [
                                            {
                                                role: "assistant",
                                                content: [
                                                    {
                                                        type: "text",
                                                        text: text,
                                                    },
                                                ],
                                                timestamp: 20,
                                            },
                                        ],
                                    }];
                            }
                            if (request.method === "send") {
                                sendCallCount += 1;
                                return [2 /*return*/, { messageId: "m1" }];
                            }
                            return [2 /*return*/, {}];
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({
                        agentSessionKey: requesterKey,
                        agentChannel: "discord",
                    }).find(function (candidate) { return candidate.name === "sessions_send"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing sessions_send tool");
                    }
                    return [4 /*yield*/, tool.execute("call5", {
                            sessionKey: "main",
                            message: "ping",
                            timeoutSeconds: 0,
                        })];
                case 1:
                    fire = _a.sent();
                    (0, vitest_1.expect)(fire.details).toMatchObject({
                        status: "accepted",
                        runId: "run-1",
                        delivery: { status: "pending", mode: "announce" },
                    });
                    return [4 /*yield*/, waitForCalls(function () { return calls.filter(function (call) { return call.method === "agent"; }).length; }, 4)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, waitForCalls(function () { return calls.filter(function (call) { return call.method === "agent.wait"; }).length; }, 4)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, waitForCalls(function () { return calls.filter(function (call) { return call.method === "chat.history"; }).length; }, 4)];
                case 4:
                    _a.sent();
                    waitPromise = tool.execute("call6", {
                        sessionKey: "main",
                        message: "wait",
                        timeoutSeconds: 1,
                    });
                    return [4 /*yield*/, waitPromise];
                case 5:
                    waited = _a.sent();
                    (0, vitest_1.expect)(waited.details).toMatchObject({
                        status: "ok",
                        reply: "done",
                        delivery: { status: "pending", mode: "announce" },
                    });
                    (0, vitest_1.expect)(typeof waited.details.runId).toBe("string");
                    return [4 /*yield*/, waitForCalls(function () { return calls.filter(function (call) { return call.method === "agent"; }).length; }, 8)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, waitForCalls(function () { return calls.filter(function (call) { return call.method === "agent.wait"; }).length; }, 8)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, waitForCalls(function () { return calls.filter(function (call) { return call.method === "chat.history"; }).length; }, 8)];
                case 8:
                    _a.sent();
                    agentCalls = calls.filter(function (call) { return call.method === "agent"; });
                    waitCalls = calls.filter(function (call) { return call.method === "agent.wait"; });
                    historyOnlyCalls = calls.filter(function (call) { return call.method === "chat.history"; });
                    (0, vitest_1.expect)(agentCalls).toHaveLength(8);
                    for (_i = 0, agentCalls_1 = agentCalls; _i < agentCalls_1.length; _i++) {
                        call = agentCalls_1[_i];
                        (0, vitest_1.expect)(call.params).toMatchObject({
                            lane: "nested",
                            channel: "webchat",
                        });
                    }
                    (0, vitest_1.expect)(agentCalls.some(function (call) {
                        var _a, _b, _c;
                        return typeof ((_a = call.params) === null || _a === void 0 ? void 0 : _a.extraSystemPrompt) === "string" &&
                            ((_c = (_b = call.params) === null || _b === void 0 ? void 0 : _b.extraSystemPrompt) === null || _c === void 0 ? void 0 : _c.includes("Agent-to-agent message context"));
                    })).toBe(true);
                    (0, vitest_1.expect)(agentCalls.some(function (call) {
                        var _a, _b, _c;
                        return typeof ((_a = call.params) === null || _a === void 0 ? void 0 : _a.extraSystemPrompt) === "string" &&
                            ((_c = (_b = call.params) === null || _b === void 0 ? void 0 : _b.extraSystemPrompt) === null || _c === void 0 ? void 0 : _c.includes("Agent-to-agent reply step"));
                    })).toBe(true);
                    (0, vitest_1.expect)(agentCalls.some(function (call) {
                        var _a, _b, _c;
                        return typeof ((_a = call.params) === null || _a === void 0 ? void 0 : _a.extraSystemPrompt) === "string" &&
                            ((_c = (_b = call.params) === null || _b === void 0 ? void 0 : _b.extraSystemPrompt) === null || _c === void 0 ? void 0 : _c.includes("Agent-to-agent announce step"));
                    })).toBe(true);
                    (0, vitest_1.expect)(waitCalls).toHaveLength(8);
                    (0, vitest_1.expect)(historyOnlyCalls).toHaveLength(8);
                    (0, vitest_1.expect)(sendCallCount).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sessions_send resolves sessionId inputs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionId, targetKey, tool, result, details, agentCall;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGatewayMock.mockReset();
                    sessionId = "sess-send";
                    targetKey = "agent:main:discord:channel:123";
                    callGatewayMock.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var request;
                        return __generator(this, function (_a) {
                            request = opts;
                            if (request.method === "sessions.resolve") {
                                return [2 /*return*/, { key: targetKey }];
                            }
                            if (request.method === "agent") {
                                return [2 /*return*/, { runId: "run-1", acceptedAt: 123 }];
                            }
                            if (request.method === "agent.wait") {
                                return [2 /*return*/, { status: "ok" }];
                            }
                            if (request.method === "chat.history") {
                                return [2 /*return*/, { messages: [] }];
                            }
                            return [2 /*return*/, {}];
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({
                        agentSessionKey: "main",
                        agentChannel: "discord",
                    }).find(function (candidate) { return candidate.name === "sessions_send"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing sessions_send tool");
                    }
                    return [4 /*yield*/, tool.execute("call7", {
                            sessionKey: sessionId,
                            message: "ping",
                            timeoutSeconds: 0,
                        })];
                case 1:
                    result = _a.sent();
                    details = result.details;
                    (0, vitest_1.expect)(details.status).toBe("accepted");
                    agentCall = callGatewayMock.mock.calls.find(function (call) { return call[0].method === "agent"; });
                    (0, vitest_1.expect)(agentCall === null || agentCall === void 0 ? void 0 : agentCall[0]).toMatchObject({
                        method: "agent",
                        params: { sessionKey: targetKey },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sessions_send runs ping-pong then announces", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, agentCallCount, lastWaitedRunId, replyByRunId, requesterKey, targetKey, sendParams, tool, waited, agentCalls, _i, agentCalls_2, call, replySteps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGatewayMock.mockReset();
                    calls = [];
                    agentCallCount = 0;
                    replyByRunId = new Map();
                    requesterKey = "discord:group:req";
                    targetKey = "discord:group:target";
                    sendParams = {};
                    callGatewayMock.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var request, runId, params, reply, params, text, params;
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            request = opts;
                            calls.push(request);
                            if (request.method === "agent") {
                                agentCallCount += 1;
                                runId = "run-".concat(agentCallCount);
                                params = request.params;
                                reply = "initial";
                                if ((_a = params === null || params === void 0 ? void 0 : params.extraSystemPrompt) === null || _a === void 0 ? void 0 : _a.includes("Agent-to-agent reply step")) {
                                    reply = params.sessionKey === requesterKey ? "pong-1" : "pong-2";
                                }
                                if ((_b = params === null || params === void 0 ? void 0 : params.extraSystemPrompt) === null || _b === void 0 ? void 0 : _b.includes("Agent-to-agent announce step")) {
                                    reply = "announce now";
                                }
                                replyByRunId.set(runId, reply);
                                return [2 /*return*/, {
                                        runId: runId,
                                        status: "accepted",
                                        acceptedAt: 2000 + agentCallCount,
                                    }];
                            }
                            if (request.method === "agent.wait") {
                                params = request.params;
                                lastWaitedRunId = params === null || params === void 0 ? void 0 : params.runId;
                                return [2 /*return*/, { runId: (_c = params === null || params === void 0 ? void 0 : params.runId) !== null && _c !== void 0 ? _c : "run-1", status: "ok" }];
                            }
                            if (request.method === "chat.history") {
                                text = (_d = (lastWaitedRunId && replyByRunId.get(lastWaitedRunId))) !== null && _d !== void 0 ? _d : "";
                                return [2 /*return*/, {
                                        messages: [
                                            {
                                                role: "assistant",
                                                content: [{ type: "text", text: text }],
                                                timestamp: 20,
                                            },
                                        ],
                                    }];
                            }
                            if (request.method === "send") {
                                params = request.params;
                                sendParams = {
                                    to: params === null || params === void 0 ? void 0 : params.to,
                                    channel: params === null || params === void 0 ? void 0 : params.channel,
                                    message: params === null || params === void 0 ? void 0 : params.message,
                                };
                                return [2 /*return*/, { messageId: "m-announce" }];
                            }
                            return [2 /*return*/, {}];
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({
                        agentSessionKey: requesterKey,
                        agentChannel: "discord",
                    }).find(function (candidate) { return candidate.name === "sessions_send"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing sessions_send tool");
                    }
                    return [4 /*yield*/, tool.execute("call7", {
                            sessionKey: targetKey,
                            message: "ping",
                            timeoutSeconds: 1,
                        })];
                case 1:
                    waited = _a.sent();
                    (0, vitest_1.expect)(waited.details).toMatchObject({
                        status: "ok",
                        reply: "initial",
                    });
                    return [4 /*yield*/, (0, utils_js_1.sleep)(0)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, utils_js_1.sleep)(0)];
                case 3:
                    _a.sent();
                    agentCalls = calls.filter(function (call) { return call.method === "agent"; });
                    (0, vitest_1.expect)(agentCalls).toHaveLength(4);
                    for (_i = 0, agentCalls_2 = agentCalls; _i < agentCalls_2.length; _i++) {
                        call = agentCalls_2[_i];
                        (0, vitest_1.expect)(call.params).toMatchObject({
                            lane: "nested",
                            channel: "webchat",
                        });
                    }
                    replySteps = calls.filter(function (call) {
                        var _a, _b, _c;
                        return call.method === "agent" &&
                            typeof ((_a = call.params) === null || _a === void 0 ? void 0 : _a.extraSystemPrompt) === "string" &&
                            ((_c = (_b = call.params) === null || _b === void 0 ? void 0 : _b.extraSystemPrompt) === null || _c === void 0 ? void 0 : _c.includes("Agent-to-agent reply step"));
                    });
                    (0, vitest_1.expect)(replySteps).toHaveLength(2);
                    (0, vitest_1.expect)(sendParams).toMatchObject({
                        to: "channel:target",
                        channel: "discord",
                        message: "announce now",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
