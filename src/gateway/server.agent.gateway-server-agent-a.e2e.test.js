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
var runtime_js_1 = require("../plugins/runtime.js");
var test_helpers_js_1 = require("./test-helpers.js");
(0, test_helpers_js_1.installGatewayTestHooks)({ scope: "suite" });
var server;
var ws;
(0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var started;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, test_helpers_js_1.startServerWithClient)()];
            case 1:
                started = _a.sent();
                server = started.server;
                ws = started.ws;
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
var setRegistry = function (registry) {
    registryState.registry = registry;
    (0, runtime_js_1.setActivePluginRegistry)(registry);
};
var BASE_IMAGE_PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X3mIAAAAASUVORK5CYII=";
function expectChannels(call, channel) {
    (0, vitest_1.expect)(call.channel).toBe(channel);
    (0, vitest_1.expect)(call.messageChannel).toBe(channel);
    var runContext = call.runContext;
    (0, vitest_1.expect)(runContext === null || runContext === void 0 ? void 0 : runContext.messageChannel).toBe(channel);
}
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
var createStubChannelPlugin = function (params) { return ({
    id: params.id,
    meta: {
        id: params.id,
        label: params.label,
        selectionLabel: params.label,
        docsPath: "/channels/".concat(params.id),
        blurb: "test stub.",
    },
    capabilities: { chatTypes: ["direct"] },
    config: {
        listAccountIds: function () { return ["default"]; },
        resolveAccount: function () { return ({}); },
        resolveAllowFrom: params.resolveAllowFrom
            ? function (_a) {
                var _b, _c;
                var cfg = _a.cfg;
                return (_c = (_b = params.resolveAllowFrom) === null || _b === void 0 ? void 0 : _b.call(params, cfg)) !== null && _c !== void 0 ? _c : [];
            }
            : undefined,
    },
    outbound: {
        deliveryMode: "direct",
        resolveTarget: function (_a) {
            var _b;
            var to = _a.to, allowFrom = _a.allowFrom;
            var trimmed = (_b = to === null || to === void 0 ? void 0 : to.trim()) !== null && _b !== void 0 ? _b : "";
            if (trimmed) {
                return { ok: true, to: trimmed };
            }
            var first = allowFrom === null || allowFrom === void 0 ? void 0 : allowFrom[0];
            if (first) {
                return { ok: true, to: String(first) };
            }
            return {
                ok: false,
                error: new Error("missing target for ".concat(params.id)),
            };
        },
        sendText: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ channel: params.id, messageId: "msg-test" })];
        }); }); },
        sendMedia: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ channel: params.id, messageId: "msg-test" })];
        }); }); },
    },
}); };
var defaultRegistry = createRegistry([
    {
        pluginId: "whatsapp",
        source: "test",
        plugin: createStubChannelPlugin({
            id: "whatsapp",
            label: "WhatsApp",
            resolveAllowFrom: function (cfg) {
                var channels = cfg.channels;
                var entry = channels === null || channels === void 0 ? void 0 : channels.whatsapp;
                var allow = entry === null || entry === void 0 ? void 0 : entry.allowFrom;
                return Array.isArray(allow) ? allow.map(function (value) { return String(value); }) : [];
            },
        }),
    },
    {
        pluginId: "telegram",
        source: "test",
        plugin: createStubChannelPlugin({ id: "telegram", label: "Telegram" }),
    },
    {
        pluginId: "discord",
        source: "test",
        plugin: createStubChannelPlugin({ id: "discord", label: "Discord" }),
    },
    {
        pluginId: "slack",
        source: "test",
        plugin: createStubChannelPlugin({ id: "slack", label: "Slack" }),
    },
    {
        pluginId: "signal",
        source: "test",
        plugin: createStubChannelPlugin({ id: "signal", label: "Signal" }),
    },
]);
(0, vitest_1.describe)("gateway server agent", function () {
    (0, vitest_1.test)("agent marks implicit delivery when lastTo is stale", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, res, spy, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    test_helpers_js_1.testState.allowFrom = ["+436769770569"];
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _b.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-main-stale",
                                    updatedAt: Date.now(),
                                    lastChannel: "whatsapp",
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
                            idempotencyKey: "idem-agent-last-stale",
                        })];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    expectChannels(call, "whatsapp");
                    (0, vitest_1.expect)(call.to).toBe("+1555");
                    (0, vitest_1.expect)(call.deliveryTargetMode).toBe("implicit");
                    (0, vitest_1.expect)(call.sessionId).toBe("sess-main-stale");
                    test_helpers_js_1.testState.allowFrom = undefined;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent forwards sessionKey to agentCommand", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, res, spy, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _b.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                "agent:main:subagent:abc": {
                                    sessionId: "sess-sub",
                                    updatedAt: Date.now(),
                                },
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                            message: "hi",
                            sessionKey: "agent:main:subagent:abc",
                            idempotencyKey: "idem-agent-subkey",
                        })];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call.sessionKey).toBe("agent:main:subagent:abc");
                    (0, vitest_1.expect)(call.sessionId).toBe("sess-sub");
                    expectChannels(call, "webchat");
                    (0, vitest_1.expect)(call.deliver).toBe(false);
                    (0, vitest_1.expect)(call.to).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent derives sessionKey from agentId", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, res, spy, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _b.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    test_helpers_js_1.testState.agentsConfig = { list: [{ id: "ops" }] };
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            agentId: "ops",
                            entries: {
                                main: {
                                    sessionId: "sess-ops",
                                    updatedAt: Date.now(),
                                },
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                            message: "hi",
                            agentId: "ops",
                            idempotencyKey: "idem-agent-id",
                        })];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call.sessionKey).toBe("agent:ops:main");
                    (0, vitest_1.expect)(call.sessionId).toBe("sess-ops");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent rejects unknown reply channel", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, spy;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                            message: "hi",
                            replyChannel: "unknown-channel",
                            idempotencyKey: "idem-agent-reply-unknown",
                        })];
                case 1:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.message).toContain("unknown channel");
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    (0, vitest_1.expect)(spy).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent rejects mismatched agentId and sessionKey", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, spy;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    test_helpers_js_1.testState.agentsConfig = { list: [{ id: "ops" }] };
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                            message: "hi",
                            agentId: "ops",
                            sessionKey: "agent:main:main",
                            idempotencyKey: "idem-agent-mismatch",
                        })];
                case 1:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.message).toContain("does not match session key agent");
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    (0, vitest_1.expect)(spy).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent forwards accountId to agentCommand", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, res, spy, call, runContext;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    test_helpers_js_1.testState.allowFrom = ["+1555"];
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _b.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-main-account",
                                    updatedAt: Date.now(),
                                    lastChannel: "whatsapp",
                                    lastTo: "+1555",
                                    lastAccountId: "default",
                                },
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                            message: "hi",
                            sessionKey: "main",
                            deliver: true,
                            accountId: "kev",
                            idempotencyKey: "idem-agent-account",
                        })];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    expectChannels(call, "whatsapp");
                    (0, vitest_1.expect)(call.to).toBe("+1555");
                    (0, vitest_1.expect)(call.accountId).toBe("kev");
                    runContext = call.runContext;
                    (0, vitest_1.expect)(runContext === null || runContext === void 0 ? void 0 : runContext.accountId).toBe("kev");
                    test_helpers_js_1.testState.allowFrom = undefined;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent avoids lastAccountId when explicit to is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, res, spy, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    test_helpers_js_1.testState.allowFrom = ["+1555"];
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _b.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-main-explicit",
                                    updatedAt: Date.now(),
                                    lastChannel: "whatsapp",
                                    lastTo: "+1555",
                                    lastAccountId: "legacy",
                                },
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                            message: "hi",
                            sessionKey: "main",
                            deliver: true,
                            to: "+1666",
                            idempotencyKey: "idem-agent-explicit",
                        })];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    expectChannels(call, "whatsapp");
                    (0, vitest_1.expect)(call.to).toBe("+1666");
                    (0, vitest_1.expect)(call.accountId).toBeUndefined();
                    test_helpers_js_1.testState.allowFrom = undefined;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent keeps explicit accountId when explicit to is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, res, spy, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    test_helpers_js_1.testState.allowFrom = ["+1555"];
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _b.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-main-explicit-account",
                                    updatedAt: Date.now(),
                                    lastChannel: "whatsapp",
                                    lastTo: "+1555",
                                    lastAccountId: "legacy",
                                },
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                            message: "hi",
                            sessionKey: "main",
                            deliver: true,
                            to: "+1666",
                            accountId: "primary",
                            idempotencyKey: "idem-agent-explicit-account",
                        })];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    expectChannels(call, "whatsapp");
                    (0, vitest_1.expect)(call.to).toBe("+1666");
                    (0, vitest_1.expect)(call.accountId).toBe("primary");
                    test_helpers_js_1.testState.allowFrom = undefined;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent falls back to lastAccountId for implicit delivery", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, res, spy, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    test_helpers_js_1.testState.allowFrom = ["+1555"];
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _b.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-main-implicit",
                                    updatedAt: Date.now(),
                                    lastChannel: "whatsapp",
                                    lastTo: "+1555",
                                    lastAccountId: "kev",
                                },
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                            message: "hi",
                            sessionKey: "main",
                            deliver: true,
                            idempotencyKey: "idem-agent-implicit-account",
                        })];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    expectChannels(call, "whatsapp");
                    (0, vitest_1.expect)(call.to).toBe("+1555");
                    (0, vitest_1.expect)(call.accountId).toBe("kev");
                    test_helpers_js_1.testState.allowFrom = undefined;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent forwards image attachments as images[]", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, res, spy, call, images;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _e.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-main-images",
                                    updatedAt: Date.now(),
                                },
                            },
                        })];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                            message: "what is in the image?",
                            sessionKey: "main",
                            attachments: [
                                {
                                    mimeType: "image/png",
                                    fileName: "tiny.png",
                                    content: BASE_IMAGE_PNG,
                                },
                            ],
                            idempotencyKey: "idem-agent-attachments",
                        })];
                case 3:
                    res = _e.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call.sessionKey).toBe("main");
                    expectChannels(call, "webchat");
                    (0, vitest_1.expect)(call.message).toBe("what is in the image?");
                    images = call.images;
                    (0, vitest_1.expect)(Array.isArray(images)).toBe(true);
                    (0, vitest_1.expect)(images.length).toBe(1);
                    (0, vitest_1.expect)((_b = images[0]) === null || _b === void 0 ? void 0 : _b.type).toBe("image");
                    (0, vitest_1.expect)((_c = images[0]) === null || _c === void 0 ? void 0 : _c.mimeType).toBe("image/png");
                    (0, vitest_1.expect)((_d = images[0]) === null || _d === void 0 ? void 0 : _d.data).toBe(BASE_IMAGE_PNG);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent falls back to whatsapp when delivery requested and no last channel exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, res, spy, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    test_helpers_js_1.testState.allowFrom = ["+1555"];
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _b.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-main-missing-provider",
                                    updatedAt: Date.now(),
                                },
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agent", {
                            message: "hi",
                            sessionKey: "main",
                            deliver: true,
                            idempotencyKey: "idem-agent-missing-provider",
                        })];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    expectChannels(call, "whatsapp");
                    (0, vitest_1.expect)(call.to).toBe("+1555");
                    (0, vitest_1.expect)(call.deliver).toBe(true);
                    (0, vitest_1.expect)(call.sessionId).toBe("sess-main-missing-provider");
                    test_helpers_js_1.testState.allowFrom = undefined;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent routes main last-channel whatsapp", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, res, spy, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _b.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-main-whatsapp",
                                    updatedAt: Date.now(),
                                    lastChannel: "whatsapp",
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
                            idempotencyKey: "idem-agent-last-whatsapp",
                        })];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    expectChannels(call, "whatsapp");
                    (0, vitest_1.expect)(call.messageChannel).toBe("whatsapp");
                    (0, vitest_1.expect)(call.to).toBe("+1555");
                    (0, vitest_1.expect)(call.deliver).toBe(true);
                    (0, vitest_1.expect)(call.bestEffortDeliver).toBe(true);
                    (0, vitest_1.expect)(call.sessionId).toBe("sess-main-whatsapp");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent routes main last-channel telegram", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, res, spy, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _b.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-main",
                                    updatedAt: Date.now(),
                                    lastChannel: "telegram",
                                    lastTo: "123",
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
                            idempotencyKey: "idem-agent-last",
                        })];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    expectChannels(call, "telegram");
                    (0, vitest_1.expect)(call.to).toBe("123");
                    (0, vitest_1.expect)(call.deliver).toBe(true);
                    (0, vitest_1.expect)(call.bestEffortDeliver).toBe(true);
                    (0, vitest_1.expect)(call.sessionId).toBe("sess-main");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent routes main last-channel discord", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, res, spy, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _b.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-discord",
                                    updatedAt: Date.now(),
                                    lastChannel: "discord",
                                    lastTo: "channel:discord-123",
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
                            idempotencyKey: "idem-agent-last-discord",
                        })];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    expectChannels(call, "discord");
                    (0, vitest_1.expect)(call.to).toBe("channel:discord-123");
                    (0, vitest_1.expect)(call.deliver).toBe(true);
                    (0, vitest_1.expect)(call.bestEffortDeliver).toBe(true);
                    (0, vitest_1.expect)(call.sessionId).toBe("sess-discord");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent routes main last-channel slack", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, res, spy, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _b.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-slack",
                                    updatedAt: Date.now(),
                                    lastChannel: "slack",
                                    lastTo: "channel:slack-123",
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
                            idempotencyKey: "idem-agent-last-slack",
                        })];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    expectChannels(call, "slack");
                    (0, vitest_1.expect)(call.to).toBe("channel:slack-123");
                    (0, vitest_1.expect)(call.deliver).toBe(true);
                    (0, vitest_1.expect)(call.bestEffortDeliver).toBe(true);
                    (0, vitest_1.expect)(call.sessionId).toBe("sess-slack");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent routes main last-channel signal", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, res, spy, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 1:
                    dir = _b.sent();
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-signal",
                                    updatedAt: Date.now(),
                                    lastChannel: "signal",
                                    lastTo: "+15551234567",
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
                            idempotencyKey: "idem-agent-last-signal",
                        })];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    call = (_a = spy.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    expectChannels(call, "signal");
                    (0, vitest_1.expect)(call.to).toBe("+15551234567");
                    (0, vitest_1.expect)(call.deliver).toBe(true);
                    (0, vitest_1.expect)(call.bestEffortDeliver).toBe(true);
                    (0, vitest_1.expect)(call.sessionId).toBe("sess-signal");
                    return [2 /*return*/];
            }
        });
    }); });
});
