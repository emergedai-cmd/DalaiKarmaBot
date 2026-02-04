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
var channel_js_1 = require("../../extensions/whatsapp/src/channel.js");
var agent_events_js_1 = require("../infra/agent-events.js");
var runtime_js_1 = require("../plugins/runtime.js");
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
var registryState = vitest_1.vi.hoisted(function () { return ({
    registry: {
        plugins: [],
        tools: [],
        channels: [],
        providers: [],
        gatewayHandlers: {},
        httpHandlers: [],
        httpRoutes: [],
        cliRegistrars: [],
        services: [],
        diagnostics: [],
    },
}); });
vitest_1.vi.mock("./server-plugins.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var setActivePluginRegistry;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../plugins/runtime.js"); })];
            case 1:
                setActivePluginRegistry = (_a.sent()).setActivePluginRegistry;
                return [2 /*return*/, {
                        loadGatewayPlugins: function (params) {
                            var _a;
                            setActivePluginRegistry(registryState.registry);
                            return {
                                pluginRegistry: registryState.registry,
                                gatewayMethods: (_a = params.baseMethods) !== null && _a !== void 0 ? _a : [],
                            };
                        },
                    }];
        }
    });
}); });
var _BASE_IMAGE_PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X3mIAAAAASUVORK5CYII=";
var createRegistry = function (channels) { return ({
    plugins: [],
    tools: [],
    channels: channels,
    providers: [],
    gatewayHandlers: {},
    httpHandlers: [],
    httpRoutes: [],
    cliRegistrars: [],
    services: [],
    diagnostics: [],
}); };
var createMSTeamsPlugin = function (params) { return ({
    id: "msteams",
    meta: {
        id: "msteams",
        label: "Microsoft Teams",
        selectionLabel: "Microsoft Teams (Bot Framework)",
        docsPath: "/channels/msteams",
        blurb: "Bot Framework; enterprise support.",
        aliases: params === null || params === void 0 ? void 0 : params.aliases,
    },
    capabilities: { chatTypes: ["direct"] },
    config: {
        listAccountIds: function () { return []; },
        resolveAccount: function () { return ({}); },
    },
}); };
var emptyRegistry = createRegistry([]);
var defaultRegistry = createRegistry([
    {
        pluginId: "whatsapp",
        source: "test",
        plugin: channel_js_1.whatsappPlugin,
    },
]);
function expectChannels(call, channel) {
    (0, vitest_1.expect)(call.channel).toBe(channel);
    (0, vitest_1.expect)(call.messageChannel).toBe(channel);
}
(0, vitest_1.describe)("gateway server agent", function () {
    (0, vitest_1.beforeEach)(function () {
        registryState.registry = defaultRegistry;
        (0, runtime_js_1.setActivePluginRegistry)(defaultRegistry);
    });
    (0, vitest_1.afterEach)(function () {
        registryState.registry = emptyRegistry;
        (0, runtime_js_1.setActivePluginRegistry)(emptyRegistry);
    });
    (0, vitest_1.test)("agent routes main last-channel msteams", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registry, dir, res, spy, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    registry = createRegistry([
                        {
                            pluginId: "msteams",
                            source: "test",
                            plugin: createMSTeamsPlugin(),
                        },
                    ]);
                    registryState.registry = registry;
                    (0, runtime_js_1.setActivePluginRegistry)(registry);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _b.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-teams",
                                    updatedAt: Date.now(),
                                    lastChannel: "msteams",
                                    lastTo: "conversation:teams-123",
                                },
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                            message: "hi",
                            sessionKey: "main",
                            channel: "last",
                            deliver: true,
                            idempotencyKey: "idem-agent-last-msteams",
                        })];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    expectChannels(call, "msteams");
                    (0, vitest_1.expect)(call.to).toBe("conversation:teams-123");
                    (0, vitest_1.expect)(call.deliver).toBe(true);
                    (0, vitest_1.expect)(call.bestEffortDeliver).toBe(true);
                    (0, vitest_1.expect)(call.sessionId).toBe("sess-teams");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent accepts channel aliases (imsg/teams)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registry, dir, resIMessage, resTeams, spy, lastIMessageCall, lastTeamsCall;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    registry = createRegistry([
                        {
                            pluginId: "msteams",
                            source: "test",
                            plugin: createMSTeamsPlugin({ aliases: ["teams"] }),
                        },
                    ]);
                    registryState.registry = registry;
                    (0, runtime_js_1.setActivePluginRegistry)(registry);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _c.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-alias",
                                    updatedAt: Date.now(),
                                    lastChannel: "imessage",
                                    lastTo: "chat_id:123",
                                },
                            },
                        })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                            message: "hi",
                            sessionKey: "main",
                            channel: "imsg",
                            deliver: true,
                            idempotencyKey: "idem-agent-imsg",
                        })];
                case 3:
                    resIMessage = _c.sent();
                    (0, vitest_1.expect)(resIMessage.ok).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                            message: "hi",
                            sessionKey: "main",
                            channel: "teams",
                            to: "conversation:teams-abc",
                            deliver: false,
                            idempotencyKey: "idem-agent-teams",
                        })];
                case 4:
                    resTeams = _c.sent();
                    (0, vitest_1.expect)(resTeams.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    lastIMessageCall = (_a = spy.mock.calls.at(-2)) === null || _a === void 0 ? void 0 : _a[0];
                    expectChannels(lastIMessageCall, "imessage");
                    (0, vitest_1.expect)(lastIMessageCall.to).toBe("chat_id:123");
                    lastTeamsCall = (_b = spy.mock.calls.at(-1)) === null || _b === void 0 ? void 0 : _b[0];
                    expectChannels(lastTeamsCall, "msteams");
                    (0, vitest_1.expect)(lastTeamsCall.to).toBe("conversation:teams-abc");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent rejects unknown channel", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                        message: "hi",
                        sessionKey: "main",
                        channel: "sms",
                        idempotencyKey: "idem-agent-bad-channel",
                    })];
                case 1:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.code).toBe("INVALID_REQUEST");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent ignores webchat last-channel for routing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, res, spy, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    test_helpers_js_1.testState.allowFrom = ["+1555"];
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _b.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-main-webchat",
                                    updatedAt: Date.now(),
                                    lastChannel: "webchat",
                                    lastTo: "+1555",
                                },
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                            message: "hi",
                            sessionKey: "main",
                            channel: "last",
                            deliver: true,
                            idempotencyKey: "idem-agent-webchat",
                        })];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    expectChannels(call, "whatsapp");
                    (0, vitest_1.expect)(call.to).toBe("+1555");
                    (0, vitest_1.expect)(call.deliver).toBe(true);
                    (0, vitest_1.expect)(call.bestEffortDeliver).toBe(true);
                    (0, vitest_1.expect)(call.sessionId).toBe("sess-main-webchat");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent uses webchat for internal runs when last provider is webchat", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, res, spy, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _b.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-main-webchat-internal",
                                    updatedAt: Date.now(),
                                    lastChannel: "webchat",
                                    lastTo: "+1555",
                                },
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                            message: "hi",
                            sessionKey: "main",
                            channel: "last",
                            deliver: false,
                            idempotencyKey: "idem-agent-webchat-internal",
                        })];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    expectChannels(call, "webchat");
                    (0, vitest_1.expect)(call.to).toBeUndefined();
                    (0, vitest_1.expect)(call.deliver).toBe(false);
                    (0, vitest_1.expect)(call.bestEffortDeliver).toBe(true);
                    (0, vitest_1.expect)(call.sessionId).toBe("sess-main-webchat-internal");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent ack response then final response", { timeout: 8000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var ackP, finalP, ack, final;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ackP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { var _a; return o.type === "res" && o.id === "ag1" && ((_a = o.payload) === null || _a === void 0 ? void 0 : _a.status) === "accepted"; });
                    finalP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { var _a; return o.type === "res" && o.id === "ag1" && ((_a = o.payload) === null || _a === void 0 ? void 0 : _a.status) !== "accepted"; });
                    ws.send(JSON.stringify({
                        type: "req",
                        id: "ag1",
                        method: "agent",
                        params: { message: "hi", idempotencyKey: "idem-ag" },
                    }));
                    return [4 /*yield*/, ackP];
                case 1:
                    ack = _a.sent();
                    return [4 /*yield*/, finalP];
                case 2:
                    final = _a.sent();
                    (0, vitest_1.expect)(ack.payload.runId).toBeDefined();
                    (0, vitest_1.expect)(final.payload.runId).toBe(ack.payload.runId);
                    (0, vitest_1.expect)(final.payload.status).toBe("ok");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent dedupes by idempotencyKey after completion", function () { return __awaiter(void 0, void 0, void 0, function () {
        var firstFinalP, firstFinal, secondP, second;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    firstFinalP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { var _a; return o.type === "res" && o.id === "ag1" && ((_a = o.payload) === null || _a === void 0 ? void 0 : _a.status) !== "accepted"; });
                    ws.send(JSON.stringify({
                        type: "req",
                        id: "ag1",
                        method: "agent",
                        params: { message: "hi", idempotencyKey: "same-agent" },
                    }));
                    return [4 /*yield*/, firstFinalP];
                case 1:
                    firstFinal = _a.sent();
                    secondP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "ag2"; });
                    ws.send(JSON.stringify({
                        type: "req",
                        id: "ag2",
                        method: "agent",
                        params: { message: "hi again", idempotencyKey: "same-agent" },
                    }));
                    return [4 /*yield*/, secondP];
                case 2:
                    second = _a.sent();
                    (0, vitest_1.expect)(second.payload).toEqual(firstFinal.payload);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent dedupe survives reconnect", { timeout: 60000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, server, dial, idem, ws1, final1P, final1, ws2, final2P, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
                case 1:
                    port = _a.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.startGatewayServer)(port)];
                case 2:
                    server = _a.sent();
                    dial = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var ws;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    ws = new ws_1.WebSocket("ws://127.0.0.1:".concat(port));
                                    return [4 /*yield*/, new Promise(function (resolve) { return ws.once("open", resolve); })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(ws)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/, ws];
                            }
                        });
                    }); };
                    idem = "reconnect-agent";
                    return [4 /*yield*/, dial()];
                case 3:
                    ws1 = _a.sent();
                    final1P = (0, test_helpers_js_1.onceMessage)(ws1, function (o) { var _a; return o.type === "res" && o.id === "ag1" && ((_a = o.payload) === null || _a === void 0 ? void 0 : _a.status) !== "accepted"; }, 6000);
                    ws1.send(JSON.stringify({
                        type: "req",
                        id: "ag1",
                        method: "agent",
                        params: { message: "hi", idempotencyKey: idem },
                    }));
                    return [4 /*yield*/, final1P];
                case 4:
                    final1 = _a.sent();
                    ws1.close();
                    return [4 /*yield*/, dial()];
                case 5:
                    ws2 = _a.sent();
                    final2P = (0, test_helpers_js_1.onceMessage)(ws2, function (o) { var _a; return o.type === "res" && o.id === "ag2" && ((_a = o.payload) === null || _a === void 0 ? void 0 : _a.status) !== "accepted"; }, 6000);
                    ws2.send(JSON.stringify({
                        type: "req",
                        id: "ag2",
                        method: "agent",
                        params: { message: "hi again", idempotencyKey: idem },
                    }));
                    return [4 /*yield*/, final2P];
                case 6:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.payload).toEqual(final1.payload);
                    ws2.close();
                    return [4 /*yield*/, server.close()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent events stream to webchat clients when run context is registered", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, webchatWs, finalChatP, evt, payload;
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
                    (0, agent_events_js_1.registerAgentRunContext)("run-auto-1", { sessionKey: "main" });
                    finalChatP = (0, test_helpers_js_1.onceMessage)(webchatWs, function (o) {
                        if (o.type !== "event" || o.event !== "chat") {
                            return false;
                        }
                        var payload = o.payload;
                        return (payload === null || payload === void 0 ? void 0 : payload.state) === "final" && payload.runId === "run-auto-1";
                    }, 8000);
                    (0, agent_events_js_1.emitAgentEvent)({
                        runId: "run-auto-1",
                        stream: "assistant",
                        data: { text: "hi from agent" },
                    });
                    (0, agent_events_js_1.emitAgentEvent)({
                        runId: "run-auto-1",
                        stream: "lifecycle",
                        data: { phase: "end" },
                    });
                    return [4 /*yield*/, finalChatP];
                case 5:
                    evt = _a.sent();
                    payload = evt.payload && typeof evt.payload === "object"
                        ? evt.payload
                        : {};
                    (0, vitest_1.expect)(payload.sessionKey).toBe("main");
                    (0, vitest_1.expect)(payload.runId).toBe("run-auto-1");
                    webchatWs.close();
                    return [2 /*return*/];
            }
        });
    }); });
});
