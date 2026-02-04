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
var promises_1 = require("node:fs/promises");
var node_net_1 = require("node:net");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var ws_1 = require("ws");
var index_js_1 = require("../channels/plugins/index.js");
var canvas_host_url_js_1 = require("../infra/canvas-host-url.js");
var gateway_lock_js_1 = require("../infra/gateway-lock.js");
var runtime_js_1 = require("../plugins/runtime.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
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
var whatsappOutbound = {
    deliveryMode: "direct",
    sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var _c;
        var deps = _b.deps, to = _b.to, text = _b.text;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(deps === null || deps === void 0 ? void 0 : deps.sendWhatsApp)) {
                        throw new Error("Missing sendWhatsApp dep");
                    }
                    _c = [{ channel: "whatsapp" }];
                    return [4 /*yield*/, deps.sendWhatsApp(to, text, {})];
                case 1: return [2 /*return*/, __assign.apply(void 0, _c.concat([(_d.sent())]))];
            }
        });
    }); },
    sendMedia: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var _c;
        var deps = _b.deps, to = _b.to, text = _b.text, mediaUrl = _b.mediaUrl;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(deps === null || deps === void 0 ? void 0 : deps.sendWhatsApp)) {
                        throw new Error("Missing sendWhatsApp dep");
                    }
                    _c = [{ channel: "whatsapp" }];
                    return [4 /*yield*/, deps.sendWhatsApp(to, text, { mediaUrl: mediaUrl })];
                case 1: return [2 /*return*/, __assign.apply(void 0, _c.concat([(_d.sent())]))];
            }
        });
    }); },
};
var whatsappPlugin = (0, channel_plugins_js_1.createOutboundTestPlugin)({
    id: "whatsapp",
    outbound: whatsappOutbound,
    label: "WhatsApp",
});
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
var whatsappRegistry = createRegistry([
    {
        pluginId: "whatsapp",
        source: "test",
        plugin: whatsappPlugin,
    },
]);
var emptyRegistry = createRegistry([]);
(0, vitest_1.describe)("gateway server models + voicewake", function () {
    var setTempHome = function (homeDir) {
        var prevHome = process.env.HOME;
        var prevStateDir = process.env.OPENCLAW_STATE_DIR;
        var prevUserProfile = process.env.USERPROFILE;
        var prevHomeDrive = process.env.HOMEDRIVE;
        var prevHomePath = process.env.HOMEPATH;
        process.env.HOME = homeDir;
        process.env.OPENCLAW_STATE_DIR = node_path_1.default.join(homeDir, ".openclaw");
        process.env.USERPROFILE = homeDir;
        if (process.platform === "win32") {
            var parsed = node_path_1.default.parse(homeDir);
            process.env.HOMEDRIVE = parsed.root.replace(/\\$/, "");
            process.env.HOMEPATH = homeDir.slice(Math.max(parsed.root.length - 1, 0));
        }
        return function () {
            if (prevHome === undefined) {
                delete process.env.HOME;
            }
            else {
                process.env.HOME = prevHome;
            }
            if (prevStateDir === undefined) {
                delete process.env.OPENCLAW_STATE_DIR;
            }
            else {
                process.env.OPENCLAW_STATE_DIR = prevStateDir;
            }
            if (prevUserProfile === undefined) {
                delete process.env.USERPROFILE;
            }
            else {
                process.env.USERPROFILE = prevUserProfile;
            }
            if (process.platform === "win32") {
                if (prevHomeDrive === undefined) {
                    delete process.env.HOMEDRIVE;
                }
                else {
                    process.env.HOMEDRIVE = prevHomeDrive;
                }
                if (prevHomePath === undefined) {
                    delete process.env.HOMEPATH;
                }
                else {
                    process.env.HOMEPATH = prevHomePath;
                }
            }
        };
    };
    (0, vitest_1.test)("voicewake.get returns defaults and voicewake.set broadcasts", { timeout: 60000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var homeDir, restoreHome, initial, changedP, setRes, changed, after, onDisk, _a, _b;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-home-"))];
                case 1:
                    homeDir = _g.sent();
                    restoreHome = setTempHome(homeDir);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "voicewake.get")];
                case 2:
                    initial = _g.sent();
                    (0, vitest_1.expect)(initial.ok).toBe(true);
                    (0, vitest_1.expect)((_c = initial.payload) === null || _c === void 0 ? void 0 : _c.triggers).toEqual(["openclaw", "claude", "computer"]);
                    changedP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "event" && o.event === "voicewake.changed"; });
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "voicewake.set", {
                            triggers: ["  hi  ", "", "there"],
                        })];
                case 3:
                    setRes = _g.sent();
                    (0, vitest_1.expect)(setRes.ok).toBe(true);
                    (0, vitest_1.expect)((_d = setRes.payload) === null || _d === void 0 ? void 0 : _d.triggers).toEqual(["hi", "there"]);
                    return [4 /*yield*/, changedP];
                case 4:
                    changed = _g.sent();
                    (0, vitest_1.expect)(changed.event).toBe("voicewake.changed");
                    (0, vitest_1.expect)((_e = changed.payload) === null || _e === void 0 ? void 0 : _e.triggers).toEqual([
                        "hi",
                        "there",
                    ]);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "voicewake.get")];
                case 5:
                    after = _g.sent();
                    (0, vitest_1.expect)(after.ok).toBe(true);
                    (0, vitest_1.expect)((_f = after.payload) === null || _f === void 0 ? void 0 : _f.triggers).toEqual(["hi", "there"]);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(homeDir, ".openclaw", "settings", "voicewake.json"), "utf8")];
                case 6:
                    onDisk = _b.apply(_a, [_g.sent()]);
                    (0, vitest_1.expect)(onDisk.triggers).toEqual(["hi", "there"]);
                    (0, vitest_1.expect)(typeof onDisk.updatedAtMs).toBe("number");
                    restoreHome();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("pushes voicewake.changed to nodes on connect and on updates", function () { return __awaiter(void 0, void 0, void 0, function () {
        var homeDir, restoreHome, nodeWs, firstEventP, first, broadcastP, setRes, broadcast;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-home-"))];
                case 1:
                    homeDir = _c.sent();
                    restoreHome = setTempHome(homeDir);
                    nodeWs = new ws_1.WebSocket("ws://127.0.0.1:".concat(port));
                    return [4 /*yield*/, new Promise(function (resolve) { return nodeWs.once("open", resolve); })];
                case 2:
                    _c.sent();
                    firstEventP = (0, test_helpers_js_1.onceMessage)(nodeWs, function (o) { return o.type === "event" && o.event === "voicewake.changed"; });
                    return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(nodeWs, {
                            role: "node",
                            client: {
                                id: message_channel_js_1.GATEWAY_CLIENT_NAMES.NODE_HOST,
                                version: "1.0.0",
                                platform: "ios",
                                mode: message_channel_js_1.GATEWAY_CLIENT_MODES.NODE,
                            },
                        })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, firstEventP];
                case 4:
                    first = _c.sent();
                    (0, vitest_1.expect)(first.event).toBe("voicewake.changed");
                    (0, vitest_1.expect)((_a = first.payload) === null || _a === void 0 ? void 0 : _a.triggers).toEqual([
                        "openclaw",
                        "claude",
                        "computer",
                    ]);
                    broadcastP = (0, test_helpers_js_1.onceMessage)(nodeWs, function (o) { return o.type === "event" && o.event === "voicewake.changed"; });
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "voicewake.set", {
                            triggers: ["openclaw", "computer"],
                        })];
                case 5:
                    setRes = _c.sent();
                    (0, vitest_1.expect)(setRes.ok).toBe(true);
                    return [4 /*yield*/, broadcastP];
                case 6:
                    broadcast = _c.sent();
                    (0, vitest_1.expect)(broadcast.event).toBe("voicewake.changed");
                    (0, vitest_1.expect)((_b = broadcast.payload) === null || _b === void 0 ? void 0 : _b.triggers).toEqual([
                        "openclaw",
                        "computer",
                    ]);
                    nodeWs.close();
                    restoreHome();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("models.list returns model catalog", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res1, res2, models;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    test_helpers_js_1.piSdkMock.enabled = true;
                    test_helpers_js_1.piSdkMock.models = [
                        { id: "gpt-test-z", provider: "openai", contextWindow: 0 },
                        {
                            id: "gpt-test-a",
                            name: "A-Model",
                            provider: "openai",
                            contextWindow: 8000,
                        },
                        {
                            id: "claude-test-b",
                            name: "B-Model",
                            provider: "anthropic",
                            contextWindow: 1000,
                        },
                        {
                            id: "claude-test-a",
                            name: "A-Model",
                            provider: "anthropic",
                            contextWindow: 200000,
                        },
                    ];
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "models.list")];
                case 1:
                    res1 = _c.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "models.list")];
                case 2:
                    res2 = _c.sent();
                    (0, vitest_1.expect)(res1.ok).toBe(true);
                    (0, vitest_1.expect)(res2.ok).toBe(true);
                    models = (_b = (_a = res1.payload) === null || _a === void 0 ? void 0 : _a.models) !== null && _b !== void 0 ? _b : [];
                    (0, vitest_1.expect)(models).toEqual([
                        {
                            id: "claude-test-a",
                            name: "A-Model",
                            provider: "anthropic",
                            contextWindow: 200000,
                        },
                        {
                            id: "claude-test-b",
                            name: "B-Model",
                            provider: "anthropic",
                            contextWindow: 1000,
                        },
                        {
                            id: "gpt-test-a",
                            name: "A-Model",
                            provider: "openai",
                            contextWindow: 8000,
                        },
                        {
                            id: "gpt-test-z",
                            name: "gpt-test-z",
                            provider: "openai",
                        },
                    ]);
                    (0, vitest_1.expect)(test_helpers_js_1.piSdkMock.discoverCalls).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("models.list rejects unknown params", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    test_helpers_js_1.piSdkMock.enabled = true;
                    test_helpers_js_1.piSdkMock.models = [{ id: "gpt-test-a", name: "A", provider: "openai" }];
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "models.list", { extra: true })];
                case 1:
                    res = _c.sent();
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    (0, vitest_1.expect)((_b = (_a = res.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "").toMatch(/invalid models\.list params/i);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("gateway server misc", function () {
    (0, vitest_1.test)("hello-ok advertises the gateway port for canvas host", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevToken, prevCanvasPort, canvasPort, testPort, canvasHostUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prevToken = process.env.OPENCLAW_GATEWAY_TOKEN;
                    prevCanvasPort = process.env.OPENCLAW_CANVAS_HOST_PORT;
                    process.env.OPENCLAW_GATEWAY_TOKEN = "secret";
                    test_helpers_js_1.testTailnetIPv4.value = "100.64.0.1";
                    test_helpers_js_1.testState.gatewayBind = "lan";
                    return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
                case 1:
                    canvasPort = _a.sent();
                    test_helpers_js_1.testState.canvasHostPort = canvasPort;
                    process.env.OPENCLAW_CANVAS_HOST_PORT = String(canvasPort);
                    return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
                case 2:
                    testPort = _a.sent();
                    canvasHostUrl = (0, canvas_host_url_js_1.resolveCanvasHostUrl)({
                        canvasPort: canvasPort,
                        requestHost: "100.64.0.1:".concat(testPort),
                        localAddress: "127.0.0.1",
                    });
                    (0, vitest_1.expect)(canvasHostUrl).toBe("http://100.64.0.1:".concat(canvasPort));
                    if (prevToken === undefined) {
                        delete process.env.OPENCLAW_GATEWAY_TOKEN;
                    }
                    else {
                        process.env.OPENCLAW_GATEWAY_TOKEN = prevToken;
                    }
                    if (prevCanvasPort === undefined) {
                        delete process.env.OPENCLAW_CANVAS_HOST_PORT;
                    }
                    else {
                        process.env.OPENCLAW_CANVAS_HOST_PORT = prevCanvasPort;
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("send dedupes by idempotencyKey", { timeout: 60000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevRegistry, idem_1, res1P, res2P, sendReq, res1, res2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prevRegistry = (_a = (0, runtime_js_1.getActivePluginRegistry)()) !== null && _a !== void 0 ? _a : emptyRegistry;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 4, 5]);
                    (0, runtime_js_1.setActivePluginRegistry)(whatsappRegistry);
                    (0, vitest_1.expect)((0, index_js_1.getChannelPlugin)("whatsapp")).toBeDefined();
                    idem_1 = "same-key";
                    res1P = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "a1"; });
                    res2P = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "a2"; });
                    sendReq = function (id) {
                        return ws.send(JSON.stringify({
                            type: "req",
                            id: id,
                            method: "send",
                            params: { to: "+15550000000", message: "hi", idempotencyKey: idem_1 },
                        }));
                    };
                    sendReq("a1");
                    sendReq("a2");
                    return [4 /*yield*/, res1P];
                case 2:
                    res1 = _b.sent();
                    return [4 /*yield*/, res2P];
                case 3:
                    res2 = _b.sent();
                    (0, vitest_1.expect)(res1.ok).toBe(true);
                    (0, vitest_1.expect)(res2.ok).toBe(true);
                    (0, vitest_1.expect)(res1.payload).toEqual(res2.payload);
                    return [3 /*break*/, 5];
                case 4:
                    (0, runtime_js_1.setActivePluginRegistry)(prevRegistry);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("auto-enables configured channel plugins on startup", function () { return __awaiter(void 0, void 0, void 0, function () {
        var configPath, autoPort, autoServer, updated, _a, _b, plugins, entries, discord;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    configPath = process.env.OPENCLAW_CONFIG_PATH;
                    if (!configPath) {
                        throw new Error("Missing OPENCLAW_CONFIG_PATH");
                    }
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(configPath), { recursive: true })];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(configPath, JSON.stringify({
                            channels: {
                                discord: {
                                    token: "token-123",
                                },
                            },
                        }, null, 2), "utf-8")];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
                case 3:
                    autoPort = _d.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.startGatewayServer)(autoPort)];
                case 4:
                    autoServer = _d.sent();
                    return [4 /*yield*/, autoServer.close()];
                case 5:
                    _d.sent();
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(configPath, "utf-8")];
                case 6:
                    updated = _b.apply(_a, [_d.sent()]);
                    plugins = updated.plugins;
                    entries = plugins === null || plugins === void 0 ? void 0 : plugins.entries;
                    discord = entries === null || entries === void 0 ? void 0 : entries.discord;
                    (0, vitest_1.expect)(discord === null || discord === void 0 ? void 0 : discord.enabled).toBe(true);
                    (0, vitest_1.expect)((_c = updated.channels) === null || _c === void 0 ? void 0 : _c.discord).toMatchObject({
                        token: "token-123",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("refuses to start when port already bound", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, blocker, blockedPort;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.occupyPort)()];
                case 1:
                    _a = _b.sent(), blocker = _a.server, blockedPort = _a.port;
                    return [4 /*yield*/, (0, vitest_1.expect)((0, test_helpers_js_1.startGatewayServer)(blockedPort)).rejects.toBeInstanceOf(gateway_lock_js_1.GatewayLockError)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, test_helpers_js_1.startGatewayServer)(blockedPort)).rejects.toThrow(/already listening/i)];
                case 3:
                    _b.sent();
                    blocker.close();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("releases port after close", function () { return __awaiter(void 0, void 0, void 0, function () {
        var releasePort, releaseServer, probe;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
                case 1:
                    releasePort = _a.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.startGatewayServer)(releasePort)];
                case 2:
                    releaseServer = _a.sent();
                    return [4 /*yield*/, releaseServer.close()];
                case 3:
                    _a.sent();
                    probe = (0, node_net_1.createServer)();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            probe.once("error", reject);
                            probe.listen(releasePort, "127.0.0.1", function () { return resolve(); });
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            return probe.close(function (err) { return (err ? reject(err) : resolve()); });
                        })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
