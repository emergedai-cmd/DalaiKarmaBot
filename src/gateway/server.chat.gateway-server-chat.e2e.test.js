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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var ws_1 = require("ws");
var agent_events_js_1 = require("../infra/agent-events.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var test_helpers_js_1 = require("./test-helpers.js");
(0, test_helpers_js_1.installGatewayTestHooks)({ scope: "suite" });
var server;
var ws;
var port;
(0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var started;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, test_helpers_js_1.startServerWithClient)()];
            case 1:
                started = _a.sent();
                server = started.server;
                ws = started.ws;
                port = started.port;
                return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(ws)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ws.close();
                return [4 /*yield*/, server.close()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function waitFor(condition_1) {
    return __awaiter(this, arguments, void 0, function (condition, timeoutMs) {
        var deadline;
        if (timeoutMs === void 0) { timeoutMs = 1500; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deadline = Date.now() + timeoutMs;
                    _a.label = 1;
                case 1:
                    if (!(Date.now() < deadline)) return [3 /*break*/, 3];
                    if (condition()) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 5); })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: throw new Error("timeout waiting for condition");
            }
        });
    });
}
(0, vitest_1.describe)("gateway server chat", function () {
    (0, vitest_1.test)("handles chat send and history flows", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDirs, webchatWs, webchatRes, spy_1, callsBeforeTimeout_1, timeoutRes, timeoutCall, callsBeforeSession_1, sessionRes, sessionCall, sendPolicyDir, blockedRes, agentBlockedDir, agentBlockedRes, callsBeforeImage_1, pngB64, reqId_1, imgRes, imgOpts, callsBeforeImageOnly_1, reqIdOnly_1, imgOnlyRes, imgOnlyOpts, historyDir, lines, i, defaultRes, defaultMsgs, firstContentText;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    tempDirs = [];
                    _o.label = 1;
                case 1:
                    _o.trys.push([1, , 23, 25]);
                    webchatWs = new ws_1.WebSocket("ws://127.0.0.1:".concat(port));
                    return [4 /*yield*/, new Promise(function (resolve) { return webchatWs === null || webchatWs === void 0 ? void 0 : webchatWs.once("open", resolve); })];
                case 2:
                    _o.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(webchatWs, {
                            client: {
                                id: message_channel_js_1.GATEWAY_CLIENT_NAMES.CONTROL_UI,
                                version: "dev",
                                platform: "web",
                                mode: message_channel_js_1.GATEWAY_CLIENT_MODES.WEBCHAT,
                            },
                        })];
                case 3:
                    _o.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(webchatWs, "chat.send", {
                            sessionKey: "main",
                            message: "hello",
                            idempotencyKey: "idem-webchat-1",
                        })];
                case 4:
                    webchatRes = _o.sent();
                    (0, vitest_1.expect)(webchatRes.ok).toBe(true);
                    webchatWs.close();
                    webchatWs = undefined;
                    spy_1 = vitest_1.vi.mocked(test_helpers_js_1.getReplyFromConfig);
                    spy_1.mockClear();
                    test_helpers_js_1.testState.agentConfig = { timeoutSeconds: 123 };
                    callsBeforeTimeout_1 = spy_1.mock.calls.length;
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.send", {
                            sessionKey: "main",
                            message: "hello",
                            idempotencyKey: "idem-timeout-1",
                        })];
                case 5:
                    timeoutRes = _o.sent();
                    (0, vitest_1.expect)(timeoutRes.ok).toBe(true);
                    return [4 /*yield*/, waitFor(function () { return spy_1.mock.calls.length > callsBeforeTimeout_1; })];
                case 6:
                    _o.sent();
                    timeoutCall = (_a = spy_1.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(timeoutCall === null || timeoutCall === void 0 ? void 0 : timeoutCall.runId).toBe("idem-timeout-1");
                    test_helpers_js_1.testState.agentConfig = undefined;
                    spy_1.mockClear();
                    callsBeforeSession_1 = spy_1.mock.calls.length;
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.send", {
                            sessionKey: "agent:main:subagent:abc",
                            message: "hello",
                            idempotencyKey: "idem-session-key-1",
                        })];
                case 7:
                    sessionRes = _o.sent();
                    (0, vitest_1.expect)(sessionRes.ok).toBe(true);
                    return [4 /*yield*/, waitFor(function () { return spy_1.mock.calls.length > callsBeforeSession_1; })];
                case 8:
                    _o.sent();
                    sessionCall = (_b = spy_1.mock.calls.at(-1)) === null || _b === void 0 ? void 0 : _b[0];
                    (0, vitest_1.expect)(sessionCall === null || sessionCall === void 0 ? void 0 : sessionCall.SessionKey).toBe("agent:main:subagent:abc");
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 9:
                    sendPolicyDir = _o.sent();
                    tempDirs.push(sendPolicyDir);
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(sendPolicyDir, "sessions.json");
                    test_helpers_js_1.testState.sessionConfig = {
                        sendPolicy: {
                            default: "allow",
                            rules: [
                                {
                                    action: "deny",
                                    match: { channel: "discord", chatType: "group" },
                                },
                            ],
                        },
                    };
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                "discord:group:dev": {
                                    sessionId: "sess-discord",
                                    updatedAt: Date.now(),
                                    chatType: "group",
                                    channel: "discord",
                                },
                            },
                        })];
                case 10:
                    _o.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.send", {
                            sessionKey: "discord:group:dev",
                            message: "hello",
                            idempotencyKey: "idem-1",
                        })];
                case 11:
                    blockedRes = _o.sent();
                    (0, vitest_1.expect)(blockedRes.ok).toBe(false);
                    (0, vitest_1.expect)((_d = (_c = blockedRes.error) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : "").toMatch(/send blocked/i);
                    test_helpers_js_1.testState.sessionStorePath = undefined;
                    test_helpers_js_1.testState.sessionConfig = undefined;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 12:
                    agentBlockedDir = _o.sent();
                    tempDirs.push(agentBlockedDir);
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(agentBlockedDir, "sessions.json");
                    test_helpers_js_1.testState.sessionConfig = {
                        sendPolicy: {
                            default: "allow",
                            rules: [{ action: "deny", match: { keyPrefix: "cron:" } }],
                        },
                    };
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                "cron:job-1": {
                                    sessionId: "sess-cron",
                                    updatedAt: Date.now(),
                                },
                            },
                        })];
                case 13:
                    _o.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                            sessionKey: "cron:job-1",
                            message: "hi",
                            idempotencyKey: "idem-2",
                        })];
                case 14:
                    agentBlockedRes = _o.sent();
                    (0, vitest_1.expect)(agentBlockedRes.ok).toBe(false);
                    (0, vitest_1.expect)((_f = (_e = agentBlockedRes.error) === null || _e === void 0 ? void 0 : _e.message) !== null && _f !== void 0 ? _f : "").toMatch(/send blocked/i);
                    test_helpers_js_1.testState.sessionStorePath = undefined;
                    test_helpers_js_1.testState.sessionConfig = undefined;
                    spy_1.mockClear();
                    callsBeforeImage_1 = spy_1.mock.calls.length;
                    pngB64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/woAAn8B9FD5fHAAAAAASUVORK5CYII=";
                    reqId_1 = "chat-img";
                    ws.send(JSON.stringify({
                        type: "req",
                        id: reqId_1,
                        method: "chat.send",
                        params: {
                            sessionKey: "main",
                            message: "see image",
                            idempotencyKey: "idem-img",
                            attachments: [
                                {
                                    type: "image",
                                    mimeType: "image/png",
                                    fileName: "dot.png",
                                    content: "data:image/png;base64,".concat(pngB64),
                                },
                            ],
                        },
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === reqId_1; }, 8000)];
                case 15:
                    imgRes = _o.sent();
                    (0, vitest_1.expect)(imgRes.ok).toBe(true);
                    (0, vitest_1.expect)((_g = imgRes.payload) === null || _g === void 0 ? void 0 : _g.runId).toBeDefined();
                    return [4 /*yield*/, waitFor(function () { return spy_1.mock.calls.length > callsBeforeImage_1; }, 8000)];
                case 16:
                    _o.sent();
                    imgOpts = (_h = spy_1.mock.calls.at(-1)) === null || _h === void 0 ? void 0 : _h[1];
                    (0, vitest_1.expect)(imgOpts === null || imgOpts === void 0 ? void 0 : imgOpts.images).toEqual([{ type: "image", data: pngB64, mimeType: "image/png" }]);
                    callsBeforeImageOnly_1 = spy_1.mock.calls.length;
                    reqIdOnly_1 = "chat-img-only";
                    ws.send(JSON.stringify({
                        type: "req",
                        id: reqIdOnly_1,
                        method: "chat.send",
                        params: {
                            sessionKey: "main",
                            message: "",
                            idempotencyKey: "idem-img-only",
                            attachments: [
                                {
                                    type: "image",
                                    mimeType: "image/png",
                                    fileName: "dot.png",
                                    content: "data:image/png;base64,".concat(pngB64),
                                },
                            ],
                        },
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === reqIdOnly_1; }, 8000)];
                case 17:
                    imgOnlyRes = _o.sent();
                    (0, vitest_1.expect)(imgOnlyRes.ok).toBe(true);
                    (0, vitest_1.expect)((_j = imgOnlyRes.payload) === null || _j === void 0 ? void 0 : _j.runId).toBeDefined();
                    return [4 /*yield*/, waitFor(function () { return spy_1.mock.calls.length > callsBeforeImageOnly_1; }, 8000)];
                case 18:
                    _o.sent();
                    imgOnlyOpts = (_k = spy_1.mock.calls.at(-1)) === null || _k === void 0 ? void 0 : _k[1];
                    (0, vitest_1.expect)(imgOnlyOpts === null || imgOnlyOpts === void 0 ? void 0 : imgOnlyOpts.images).toEqual([{ type: "image", data: pngB64, mimeType: "image/png" }]);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 19:
                    historyDir = _o.sent();
                    tempDirs.push(historyDir);
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(historyDir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-main",
                                    updatedAt: Date.now(),
                                },
                            },
                        })];
                case 20:
                    _o.sent();
                    lines = [];
                    for (i = 0; i < 300; i += 1) {
                        lines.push(JSON.stringify({
                            message: {
                                role: "user",
                                content: [{ type: "text", text: "m".concat(i) }],
                                timestamp: Date.now() + i,
                            },
                        }));
                    }
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(historyDir, "sess-main.jsonl"), lines.join("\n"), "utf-8")];
                case 21:
                    _o.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.history", {
                            sessionKey: "main",
                        })];
                case 22:
                    defaultRes = _o.sent();
                    (0, vitest_1.expect)(defaultRes.ok).toBe(true);
                    defaultMsgs = (_m = (_l = defaultRes.payload) === null || _l === void 0 ? void 0 : _l.messages) !== null && _m !== void 0 ? _m : [];
                    firstContentText = function (msg) {
                        if (!msg || typeof msg !== "object") {
                            return undefined;
                        }
                        var content = msg.content;
                        if (!Array.isArray(content) || content.length === 0) {
                            return undefined;
                        }
                        var first = content[0];
                        if (!first || typeof first !== "object") {
                            return undefined;
                        }
                        var text = first.text;
                        return typeof text === "string" ? text : undefined;
                    };
                    (0, vitest_1.expect)(defaultMsgs.length).toBe(200);
                    (0, vitest_1.expect)(firstContentText(defaultMsgs[0])).toBe("m100");
                    return [3 /*break*/, 25];
                case 23:
                    test_helpers_js_1.testState.agentConfig = undefined;
                    test_helpers_js_1.testState.sessionStorePath = undefined;
                    test_helpers_js_1.testState.sessionConfig = undefined;
                    if (webchatWs) {
                        webchatWs.close();
                    }
                    return [4 /*yield*/, Promise.all(tempDirs.map(function (dir) { return promises_1.default.rm(dir, { recursive: true, force: true }); }))];
                case 24:
                    _o.sent();
                    return [7 /*endfinally*/];
                case 25: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("routes chat.send slash commands without agent runs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, spy, callsBefore, eventPromise, res, evt;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 6, 8]);
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-main",
                                    updatedAt: Date.now(),
                                },
                            },
                        })];
                case 3:
                    _c.sent();
                    spy = vitest_1.vi.mocked(agentCommand);
                    callsBefore = spy.mock.calls.length;
                    eventPromise = (0, test_helpers_js_1.onceMessage)(ws, function (o) {
                        var _a, _b;
                        return o.type === "event" &&
                            o.event === "chat" &&
                            ((_a = o.payload) === null || _a === void 0 ? void 0 : _a.state) === "final" &&
                            ((_b = o.payload) === null || _b === void 0 ? void 0 : _b.runId) === "idem-command-1";
                    }, 8000);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.send", {
                            sessionKey: "main",
                            message: "/context list",
                            idempotencyKey: "idem-command-1",
                        })];
                case 4:
                    res = _c.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    return [4 /*yield*/, eventPromise];
                case 5:
                    evt = _c.sent();
                    (0, vitest_1.expect)((_b = (_a = evt.payload) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.command).toBe(true);
                    (0, vitest_1.expect)(spy.mock.calls.length).toBe(callsBefore);
                    return [3 /*break*/, 8];
                case 6:
                    test_helpers_js_1.testState.sessionStorePath = undefined;
                    return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                case 7:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent events include sessionKey and agent.wait covers lifecycle flows", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, webchatWs, agentEvtP, evt, payload, evt, payload, waitP, res, res, res, waitP, res, waitP, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _a.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-main",
                                    updatedAt: Date.now(),
                                    verboseLevel: "off",
                                },
                            },
                        })];
                case 2:
                    _a.sent();
                    webchatWs = new ws_1.WebSocket("ws://127.0.0.1:".concat(port));
                    return [4 /*yield*/, new Promise(function (resolve) { return webchatWs.once("open", resolve); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(webchatWs, {
                            client: {
                                id: message_channel_js_1.GATEWAY_CLIENT_NAMES.WEBCHAT,
                                version: "1.0.0",
                                platform: "test",
                                mode: message_channel_js_1.GATEWAY_CLIENT_MODES.WEBCHAT,
                            },
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, , 13, 15]);
                    (0, agent_events_js_1.registerAgentRunContext)("run-tool-1", {
                        sessionKey: "main",
                        verboseLevel: "on",
                    });
                    agentEvtP = (0, test_helpers_js_1.onceMessage)(webchatWs, function (o) { var _a; return o.type === "event" && o.event === "agent" && ((_a = o.payload) === null || _a === void 0 ? void 0 : _a.runId) === "run-tool-1"; }, 8000);
                    (0, agent_events_js_1.emitAgentEvent)({
                        runId: "run-tool-1",
                        stream: "tool",
                        data: { phase: "start", name: "read", toolCallId: "tool-1" },
                    });
                    return [4 /*yield*/, agentEvtP];
                case 6:
                    evt = _a.sent();
                    payload = evt.payload && typeof evt.payload === "object"
                        ? evt.payload
                        : {};
                    (0, vitest_1.expect)(payload.sessionKey).toBe("main");
                    (0, agent_events_js_1.registerAgentRunContext)("run-tool-off", { sessionKey: "agent:main:main" });
                    (0, agent_events_js_1.emitAgentEvent)({
                        runId: "run-tool-off",
                        stream: "tool",
                        data: { phase: "start", name: "read", toolCallId: "tool-1" },
                    });
                    (0, agent_events_js_1.emitAgentEvent)({
                        runId: "run-tool-off",
                        stream: "assistant",
                        data: { text: "hello" },
                    });
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(webchatWs, function (o) { var _a; return o.type === "event" && o.event === "agent" && ((_a = o.payload) === null || _a === void 0 ? void 0 : _a.runId) === "run-tool-off"; }, 8000)];
                case 7:
                    evt = _a.sent();
                    payload = evt.payload && typeof evt.payload === "object"
                        ? evt.payload
                        : {};
                    (0, vitest_1.expect)(payload.stream).toBe("assistant");
                    waitP = (0, test_helpers_js_1.rpcReq)(webchatWs, "agent.wait", {
                        runId: "run-wait-1",
                        timeoutMs: 1000,
                    });
                    setTimeout(function () {
                        (0, agent_events_js_1.emitAgentEvent)({
                            runId: "run-wait-1",
                            stream: "lifecycle",
                            data: { phase: "end", startedAt: 200, endedAt: 210 },
                        });
                    }, 5);
                    return [4 /*yield*/, waitP];
                case 8:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)(res.payload.status).toBe("ok");
                    (0, vitest_1.expect)(res.payload.startedAt).toBe(200);
                    (0, agent_events_js_1.emitAgentEvent)({
                        runId: "run-wait-early",
                        stream: "lifecycle",
                        data: { phase: "end", startedAt: 50, endedAt: 55 },
                    });
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(webchatWs, "agent.wait", {
                            runId: "run-wait-early",
                            timeoutMs: 1000,
                        })];
                case 9:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)(res.payload.status).toBe("ok");
                    (0, vitest_1.expect)(res.payload.startedAt).toBe(50);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(webchatWs, "agent.wait", {
                            runId: "run-wait-3",
                            timeoutMs: 30,
                        })];
                case 10:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)(res.payload.status).toBe("timeout");
                    waitP = (0, test_helpers_js_1.rpcReq)(webchatWs, "agent.wait", {
                        runId: "run-wait-err",
                        timeoutMs: 1000,
                    });
                    setTimeout(function () {
                        (0, agent_events_js_1.emitAgentEvent)({
                            runId: "run-wait-err",
                            stream: "lifecycle",
                            data: { phase: "error", error: "boom" },
                        });
                    }, 5);
                    return [4 /*yield*/, waitP];
                case 11:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)(res.payload.status).toBe("error");
                    (0, vitest_1.expect)(res.payload.error).toBe("boom");
                    waitP = (0, test_helpers_js_1.rpcReq)(webchatWs, "agent.wait", {
                        runId: "run-wait-start",
                        timeoutMs: 1000,
                    });
                    (0, agent_events_js_1.emitAgentEvent)({
                        runId: "run-wait-start",
                        stream: "lifecycle",
                        data: { phase: "start", startedAt: 123 },
                    });
                    setTimeout(function () {
                        (0, agent_events_js_1.emitAgentEvent)({
                            runId: "run-wait-start",
                            stream: "lifecycle",
                            data: { phase: "end", endedAt: 456 },
                        });
                    }, 5);
                    return [4 /*yield*/, waitP];
                case 12:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)(res.payload.status).toBe("ok");
                    (0, vitest_1.expect)(res.payload.startedAt).toBe(123);
                    (0, vitest_1.expect)(res.payload.endedAt).toBe(456);
                    return [3 /*break*/, 15];
                case 13:
                    webchatWs.close();
                    return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                case 14:
                    _a.sent();
                    test_helpers_js_1.testState.sessionStorePath = undefined;
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    }); });
});
