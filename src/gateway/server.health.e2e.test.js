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
var node_crypto_1 = require("node:crypto");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var ws_1 = require("ws");
var agent_events_js_1 = require("../infra/agent-events.js");
var device_identity_js_1 = require("../infra/device-identity.js");
var heartbeat_events_js_1 = require("../infra/heartbeat-events.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var device_auth_js_1 = require("./device-auth.js");
var test_helpers_js_1 = require("./test-helpers.js");
(0, test_helpers_js_1.installGatewayTestHooks)({ scope: "suite" });
var server;
var port = 0;
var previousToken;
(0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                previousToken = process.env.OPENCLAW_GATEWAY_TOKEN;
                delete process.env.OPENCLAW_GATEWAY_TOKEN;
                return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
            case 1:
                port = _a.sent();
                return [4 /*yield*/, (0, test_helpers_js_1.startGatewayServer)(port)];
            case 2:
                server = _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.close()];
            case 1:
                _a.sent();
                if (previousToken === undefined) {
                    delete process.env.OPENCLAW_GATEWAY_TOKEN;
                }
                else {
                    process.env.OPENCLAW_GATEWAY_TOKEN = previousToken;
                }
                return [2 /*return*/];
        }
    });
}); });
var openClient = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var ws;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ws = new ws_1.WebSocket("ws://127.0.0.1:".concat(port));
                return [4 /*yield*/, new Promise(function (resolve) { return ws.once("open", resolve); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(ws, opts)];
            case 2:
                _a.sent();
                return [2 /*return*/, ws];
        }
    });
}); };
(0, vitest_1.describe)("gateway server health/presence", function () {
    (0, vitest_1.test)("connect + health + presence + status succeed", { timeout: 60000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var ws, healthP, statusP, presenceP, channelsP, sendReq, health, status, presence, channels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openClient()];
                case 1:
                    ws = _a.sent();
                    healthP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "health1"; });
                    statusP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "status1"; });
                    presenceP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "presence1"; });
                    channelsP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "channels1"; });
                    sendReq = function (id, method) {
                        return ws.send(JSON.stringify({ type: "req", id: id, method: method }));
                    };
                    sendReq("health1", "health");
                    sendReq("status1", "status");
                    sendReq("presence1", "system-presence");
                    sendReq("channels1", "channels.status");
                    return [4 /*yield*/, healthP];
                case 2:
                    health = _a.sent();
                    return [4 /*yield*/, statusP];
                case 3:
                    status = _a.sent();
                    return [4 /*yield*/, presenceP];
                case 4:
                    presence = _a.sent();
                    return [4 /*yield*/, channelsP];
                case 5:
                    channels = _a.sent();
                    (0, vitest_1.expect)(health.ok).toBe(true);
                    (0, vitest_1.expect)(status.ok).toBe(true);
                    (0, vitest_1.expect)(presence.ok).toBe(true);
                    (0, vitest_1.expect)(channels.ok).toBe(true);
                    (0, vitest_1.expect)(Array.isArray(presence.payload)).toBe(true);
                    ws.close();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("broadcasts heartbeat events and serves last-heartbeat", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ws, waitHeartbeat, evt, last, lastPayload, toggle;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    return [4 /*yield*/, openClient()];
                case 1:
                    ws = _e.sent();
                    waitHeartbeat = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "event" && o.event === "heartbeat"; });
                    (0, heartbeat_events_js_1.emitHeartbeatEvent)({ status: "sent", to: "+123", preview: "ping" });
                    return [4 /*yield*/, waitHeartbeat];
                case 2:
                    evt = _e.sent();
                    (0, vitest_1.expect)((_a = evt.payload) === null || _a === void 0 ? void 0 : _a.status).toBe("sent");
                    (0, vitest_1.expect)(typeof ((_b = evt.payload) === null || _b === void 0 ? void 0 : _b.ts)).toBe("number");
                    ws.send(JSON.stringify({
                        type: "req",
                        id: "hb-last",
                        method: "last-heartbeat",
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "hb-last"; })];
                case 3:
                    last = _e.sent();
                    (0, vitest_1.expect)(last.ok).toBe(true);
                    lastPayload = last.payload;
                    (0, vitest_1.expect)(lastPayload === null || lastPayload === void 0 ? void 0 : lastPayload.status).toBe("sent");
                    (0, vitest_1.expect)(lastPayload === null || lastPayload === void 0 ? void 0 : lastPayload.ts).toBe((_c = evt.payload) === null || _c === void 0 ? void 0 : _c.ts);
                    ws.send(JSON.stringify({
                        type: "req",
                        id: "hb-toggle-off",
                        method: "set-heartbeats",
                        params: { enabled: false },
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "hb-toggle-off"; })];
                case 4:
                    toggle = _e.sent();
                    (0, vitest_1.expect)(toggle.ok).toBe(true);
                    (0, vitest_1.expect)((_d = toggle.payload) === null || _d === void 0 ? void 0 : _d.enabled).toBe(false);
                    ws.close();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("presence events carry seq + stateVersion", { timeout: 8000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var ws, presenceEventP, evt;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, openClient()];
                case 1:
                    ws = _c.sent();
                    presenceEventP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "event" && o.event === "presence"; });
                    ws.send(JSON.stringify({
                        type: "req",
                        id: "evt-1",
                        method: "system-event",
                        params: { text: "note from test" },
                    }));
                    return [4 /*yield*/, presenceEventP];
                case 2:
                    evt = _c.sent();
                    (0, vitest_1.expect)(typeof evt.seq).toBe("number");
                    (0, vitest_1.expect)((_a = evt.stateVersion) === null || _a === void 0 ? void 0 : _a.presence).toBeGreaterThan(0);
                    (0, vitest_1.expect)(Array.isArray((_b = evt.payload) === null || _b === void 0 ? void 0 : _b.presence)).toBe(true);
                    ws.close();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("agent events stream with seq", { timeout: 8000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var ws, runId, evtPromise, evt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openClient()];
                case 1:
                    ws = _a.sent();
                    runId = (0, node_crypto_1.randomUUID)();
                    evtPromise = (0, test_helpers_js_1.onceMessage)(ws, function (o) {
                        var _a, _b;
                        return o.type === "event" &&
                            o.event === "agent" &&
                            ((_a = o.payload) === null || _a === void 0 ? void 0 : _a.runId) === runId &&
                            ((_b = o.payload) === null || _b === void 0 ? void 0 : _b.stream) === "lifecycle";
                    });
                    (0, agent_events_js_1.emitAgentEvent)({ runId: runId, stream: "lifecycle", data: { msg: "hi" } });
                    return [4 /*yield*/, evtPromise];
                case 2:
                    evt = _a.sent();
                    (0, vitest_1.expect)(evt.payload.runId).toBe(runId);
                    (0, vitest_1.expect)(typeof evt.seq).toBe("number");
                    (0, vitest_1.expect)(evt.payload.data.msg).toBe("hi");
                    ws.close();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("shutdown event is broadcast on close", { timeout: 8000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, server, ws, shutdownP, evt;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.startServerWithClient)()];
                case 1:
                    _a = _c.sent(), server = _a.server, ws = _a.ws;
                    return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(ws)];
                case 2:
                    _c.sent();
                    shutdownP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "event" && o.event === "shutdown"; }, 5000);
                    return [4 /*yield*/, server.close()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, shutdownP];
                case 4:
                    evt = _c.sent();
                    (0, vitest_1.expect)((_b = evt.payload) === null || _b === void 0 ? void 0 : _b.reason).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("presence broadcast reaches multiple clients", { timeout: 8000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var clients, waits, events, _i, events_1, evt, _a, clients_1, c;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.all([openClient(), openClient(), openClient()])];
                case 1:
                    clients = _d.sent();
                    waits = clients.map(function (c) {
                        return (0, test_helpers_js_1.onceMessage)(c, function (o) { return o.type === "event" && o.event === "presence"; });
                    });
                    clients[0].send(JSON.stringify({
                        type: "req",
                        id: "broadcast",
                        method: "system-event",
                        params: { text: "fanout" },
                    }));
                    return [4 /*yield*/, Promise.all(waits)];
                case 2:
                    events = _d.sent();
                    for (_i = 0, events_1 = events; _i < events_1.length; _i++) {
                        evt = events_1[_i];
                        (0, vitest_1.expect)((_c = (_b = evt.payload) === null || _b === void 0 ? void 0 : _b.presence) === null || _c === void 0 ? void 0 : _c.length).toBeGreaterThan(0);
                        (0, vitest_1.expect)(typeof evt.seq).toBe("number");
                    }
                    for (_a = 0, clients_1 = clients; _a < clients_1.length; _a++) {
                        c = clients_1[_a];
                        c.close();
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("presence includes client fingerprint", function () { return __awaiter(void 0, void 0, void 0, function () {
        var identityPath, identity, role, scopes, signedAtMs, payload, ws, presenceP, presenceRes, entries, clientEntry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    identityPath = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-device-".concat((0, node_crypto_1.randomUUID)(), ".json"));
                    identity = (0, device_identity_js_1.loadOrCreateDeviceIdentity)(identityPath);
                    role = "operator";
                    scopes = [];
                    signedAtMs = Date.now();
                    payload = (0, device_auth_js_1.buildDeviceAuthPayload)({
                        deviceId: identity.deviceId,
                        clientId: message_channel_js_1.GATEWAY_CLIENT_NAMES.FINGERPRINT,
                        clientMode: message_channel_js_1.GATEWAY_CLIENT_MODES.UI,
                        role: role,
                        scopes: scopes,
                        signedAtMs: signedAtMs,
                        token: null,
                    });
                    return [4 /*yield*/, openClient({
                            role: role,
                            scopes: scopes,
                            client: {
                                id: message_channel_js_1.GATEWAY_CLIENT_NAMES.FINGERPRINT,
                                version: "9.9.9",
                                platform: "test",
                                deviceFamily: "iPad",
                                modelIdentifier: "iPad16,6",
                                mode: message_channel_js_1.GATEWAY_CLIENT_MODES.UI,
                                instanceId: "abc",
                            },
                            device: {
                                id: identity.deviceId,
                                publicKey: (0, device_identity_js_1.publicKeyRawBase64UrlFromPem)(identity.publicKeyPem),
                                signature: (0, device_identity_js_1.signDevicePayload)(identity.privateKeyPem, payload),
                                signedAt: signedAtMs,
                            },
                        })];
                case 1:
                    ws = _a.sent();
                    presenceP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "fingerprint"; }, 4000);
                    ws.send(JSON.stringify({
                        type: "req",
                        id: "fingerprint",
                        method: "system-presence",
                    }));
                    return [4 /*yield*/, presenceP];
                case 2:
                    presenceRes = _a.sent();
                    entries = presenceRes.payload;
                    clientEntry = entries.find(function (e) { return e.host === message_channel_js_1.GATEWAY_CLIENT_NAMES.FINGERPRINT && e.version === "9.9.9"; });
                    (0, vitest_1.expect)(clientEntry === null || clientEntry === void 0 ? void 0 : clientEntry.host).toBe(message_channel_js_1.GATEWAY_CLIENT_NAMES.FINGERPRINT);
                    (0, vitest_1.expect)(clientEntry === null || clientEntry === void 0 ? void 0 : clientEntry.version).toBe("9.9.9");
                    (0, vitest_1.expect)(clientEntry === null || clientEntry === void 0 ? void 0 : clientEntry.mode).toBe("ui");
                    (0, vitest_1.expect)(clientEntry === null || clientEntry === void 0 ? void 0 : clientEntry.deviceFamily).toBe("iPad");
                    (0, vitest_1.expect)(clientEntry === null || clientEntry === void 0 ? void 0 : clientEntry.modelIdentifier).toBe("iPad16,6");
                    ws.close();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("cli connections are not tracked as instances", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cliId, ws, presenceP, presenceRes, entries;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cliId = "cli-".concat((0, node_crypto_1.randomUUID)());
                    return [4 /*yield*/, openClient({
                            client: {
                                id: message_channel_js_1.GATEWAY_CLIENT_NAMES.CLI,
                                version: "dev",
                                platform: "test",
                                mode: message_channel_js_1.GATEWAY_CLIENT_MODES.CLI,
                                instanceId: cliId,
                            },
                        })];
                case 1:
                    ws = _a.sent();
                    presenceP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "cli-presence"; }, 4000);
                    ws.send(JSON.stringify({
                        type: "req",
                        id: "cli-presence",
                        method: "system-presence",
                    }));
                    return [4 /*yield*/, presenceP];
                case 2:
                    presenceRes = _a.sent();
                    entries = presenceRes.payload;
                    (0, vitest_1.expect)(entries.some(function (e) { return e.instanceId === cliId; })).toBe(false);
                    ws.close();
                    return [2 /*return*/];
            }
        });
    }); });
});
