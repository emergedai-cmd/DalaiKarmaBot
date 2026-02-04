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
var message_channel_js_1 = require("../utils/message-channel.js");
var client_js_1 = require("./client.js");
vitest_1.vi.mock("../infra/update-runner.js", function () { return ({
    runGatewayUpdate: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    status: "ok",
                    mode: "git",
                    root: "/repo",
                    steps: [],
                    durationMs: 12,
                })];
        });
    }); }),
}); });
var utils_js_1 = require("../utils.js");
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
var connectNodeClient = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var settled, resolveReady, rejectReady, ready, client;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                settled = false;
                resolveReady = null;
                rejectReady = null;
                ready = new Promise(function (resolve, reject) {
                    resolveReady = resolve;
                    rejectReady = reject;
                });
                client = new client_js_1.GatewayClient({
                    url: "ws://127.0.0.1:".concat(params.port),
                    role: "node",
                    clientName: message_channel_js_1.GATEWAY_CLIENT_NAMES.NODE_HOST,
                    clientVersion: "1.0.0",
                    clientDisplayName: params.displayName,
                    platform: "ios",
                    mode: message_channel_js_1.GATEWAY_CLIENT_MODES.NODE,
                    instanceId: params.instanceId,
                    scopes: [],
                    commands: params.commands,
                    onEvent: params.onEvent,
                    onHelloOk: function () {
                        if (settled) {
                            return;
                        }
                        settled = true;
                        resolveReady === null || resolveReady === void 0 ? void 0 : resolveReady();
                    },
                    onConnectError: function (err) {
                        if (settled) {
                            return;
                        }
                        settled = true;
                        rejectReady === null || rejectReady === void 0 ? void 0 : rejectReady(err);
                    },
                    onClose: function (code, reason) {
                        if (settled) {
                            return;
                        }
                        settled = true;
                        rejectReady === null || rejectReady === void 0 ? void 0 : rejectReady(new Error("gateway closed (".concat(code, "): ").concat(reason)));
                    },
                });
                client.start();
                return [4 /*yield*/, Promise.race([
                        ready,
                        (0, utils_js_1.sleep)(10000).then(function () {
                            throw new Error("timeout waiting for node to connect");
                        }),
                    ])];
            case 1:
                _a.sent();
                return [2 /*return*/, client];
        }
    });
}); };
function waitForSignal(check_1) {
    return __awaiter(this, arguments, void 0, function (check, timeoutMs) {
        var start;
        if (timeoutMs === void 0) { timeoutMs = 2000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    start = Date.now();
                    _a.label = 1;
                case 1:
                    if (!(Date.now() - start < timeoutMs)) return [3 /*break*/, 3];
                    if (check()) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: throw new Error("timeout");
            }
        });
    });
}
(0, vitest_1.describe)("gateway role enforcement", function () {
    (0, vitest_1.test)("enforces operator and node permissions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var nodeWs, eventRes, invokeRes, binsRes, statusRes;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    nodeWs = new ws_1.WebSocket("ws://127.0.0.1:".concat(port));
                    return [4 /*yield*/, new Promise(function (resolve) { return nodeWs.once("open", resolve); })];
                case 1:
                    _h.sent();
                    _h.label = 2;
                case 2:
                    _h.trys.push([2, , 8, 9]);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "node.event", { event: "test", payload: { ok: true } })];
                case 3:
                    eventRes = _h.sent();
                    (0, vitest_1.expect)(eventRes.ok).toBe(false);
                    (0, vitest_1.expect)((_b = (_a = eventRes.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "").toContain("unauthorized role");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "node.invoke.result", {
                            id: "invoke-1",
                            nodeId: "node-1",
                            ok: true,
                        })];
                case 4:
                    invokeRes = _h.sent();
                    (0, vitest_1.expect)(invokeRes.ok).toBe(false);
                    (0, vitest_1.expect)((_d = (_c = invokeRes.error) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : "").toContain("unauthorized role");
                    return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(nodeWs, {
                            role: "node",
                            client: {
                                id: message_channel_js_1.GATEWAY_CLIENT_NAMES.NODE_HOST,
                                version: "1.0.0",
                                platform: "ios",
                                mode: message_channel_js_1.GATEWAY_CLIENT_MODES.NODE,
                            },
                            commands: [],
                        })];
                case 5:
                    _h.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(nodeWs, "skills.bins", {})];
                case 6:
                    binsRes = _h.sent();
                    (0, vitest_1.expect)(binsRes.ok).toBe(true);
                    (0, vitest_1.expect)(Array.isArray((_e = binsRes.payload) === null || _e === void 0 ? void 0 : _e.bins)).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(nodeWs, "status", {})];
                case 7:
                    statusRes = _h.sent();
                    (0, vitest_1.expect)(statusRes.ok).toBe(false);
                    (0, vitest_1.expect)((_g = (_f = statusRes.error) === null || _f === void 0 ? void 0 : _f.message) !== null && _g !== void 0 ? _g : "").toContain("unauthorized role");
                    return [3 /*break*/, 9];
                case 8:
                    nodeWs.close();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("gateway update.run", function () {
    (0, vitest_1.test)("writes sentinel and schedules restart", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sigusr1, id_1, res, sentinelPath, raw, parsed;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sigusr1 = vitest_1.vi.fn();
                    process.on("SIGUSR1", sigusr1);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, , 5, 6]);
                    id_1 = "req-update";
                    ws.send(JSON.stringify({
                        type: "req",
                        id: id_1,
                        method: "update.run",
                        params: {
                            sessionKey: "agent:main:whatsapp:dm:+15555550123",
                            restartDelayMs: 0,
                        },
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === id_1; })];
                case 2:
                    res = _d.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    return [4 /*yield*/, waitForSignal(function () { return sigusr1.mock.calls.length > 0; })];
                case 3:
                    _d.sent();
                    (0, vitest_1.expect)(sigusr1).toHaveBeenCalled();
                    sentinelPath = node_path_1.default.join(node_os_1.default.homedir(), ".openclaw", "restart-sentinel.json");
                    return [4 /*yield*/, promises_1.default.readFile(sentinelPath, "utf-8")];
                case 4:
                    raw = _d.sent();
                    parsed = JSON.parse(raw);
                    (0, vitest_1.expect)((_a = parsed.payload) === null || _a === void 0 ? void 0 : _a.kind).toBe("update");
                    (0, vitest_1.expect)((_c = (_b = parsed.payload) === null || _b === void 0 ? void 0 : _b.stats) === null || _c === void 0 ? void 0 : _c.mode).toBe("git");
                    return [3 /*break*/, 6];
                case 5:
                    process.off("SIGUSR1", sigusr1);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("gateway node command allowlist", function () {
    (0, vitest_1.test)("enforces command allowlists across node clients", function () { return __awaiter(void 0, void 0, void 0, function () {
        var waitForConnectedCount, getConnectedNodeId, systemClient, emptyClient, allowedClient, systemNodeId, disallowedRes, emptyNodeId, missingRes, resolveInvoke_1, waitForInvoke, allowedNodeId, invokeResP, payload, requestId, nodeIdFromReq, invokeRes, invokeNullResP, payloadNull, requestIdNull, nodeIdNull, invokeNullRes;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    waitForConnectedCount = function (count) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, vitest_1.expect
                                        .poll(function () { return __awaiter(void 0, void 0, void 0, function () {
                                        var listRes, nodes;
                                        var _a, _b;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0: return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "node.list", {})];
                                                case 1:
                                                    listRes = _c.sent();
                                                    nodes = (_b = (_a = listRes.payload) === null || _a === void 0 ? void 0 : _a.nodes) !== null && _b !== void 0 ? _b : [];
                                                    return [2 /*return*/, nodes.filter(function (node) { return node.connected; }).length];
                                            }
                                        });
                                    }); }, { timeout: 2000 })
                                        .toBe(count)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    getConnectedNodeId = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var listRes, nodeId;
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0: return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "node.list", {})];
                                case 1:
                                    listRes = _e.sent();
                                    nodeId = (_d = (_c = (_b = (_a = listRes.payload) === null || _a === void 0 ? void 0 : _a.nodes) === null || _b === void 0 ? void 0 : _b.find(function (node) { return node.connected; })) === null || _c === void 0 ? void 0 : _c.nodeId) !== null && _d !== void 0 ? _d : "";
                                    (0, vitest_1.expect)(nodeId).toBeTruthy();
                                    return [2 /*return*/, nodeId];
                            }
                        });
                    }); };
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, , 18, 19]);
                    return [4 /*yield*/, connectNodeClient({
                            port: port,
                            commands: ["system.run"],
                            instanceId: "node-system-run",
                            displayName: "node-system-run",
                        })];
                case 2:
                    systemClient = _g.sent();
                    return [4 /*yield*/, getConnectedNodeId()];
                case 3:
                    systemNodeId = _g.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "node.invoke", {
                            nodeId: systemNodeId,
                            command: "system.run",
                            params: { command: "echo hi" },
                            idempotencyKey: "allowlist-1",
                        })];
                case 4:
                    disallowedRes = _g.sent();
                    (0, vitest_1.expect)(disallowedRes.ok).toBe(false);
                    (0, vitest_1.expect)((_a = disallowedRes.error) === null || _a === void 0 ? void 0 : _a.message).toContain("node command not allowed");
                    systemClient.stop();
                    return [4 /*yield*/, waitForConnectedCount(0)];
                case 5:
                    _g.sent();
                    return [4 /*yield*/, connectNodeClient({
                            port: port,
                            commands: [],
                            instanceId: "node-empty",
                            displayName: "node-empty",
                        })];
                case 6:
                    emptyClient = _g.sent();
                    return [4 /*yield*/, getConnectedNodeId()];
                case 7:
                    emptyNodeId = _g.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "node.invoke", {
                            nodeId: emptyNodeId,
                            command: "canvas.snapshot",
                            params: {},
                            idempotencyKey: "allowlist-2",
                        })];
                case 8:
                    missingRes = _g.sent();
                    (0, vitest_1.expect)(missingRes.ok).toBe(false);
                    (0, vitest_1.expect)((_b = missingRes.error) === null || _b === void 0 ? void 0 : _b.message).toContain("node command not allowed");
                    emptyClient.stop();
                    return [4 /*yield*/, waitForConnectedCount(0)];
                case 9:
                    _g.sent();
                    resolveInvoke_1 = null;
                    waitForInvoke = function () {
                        return new Promise(function (resolve) {
                            resolveInvoke_1 = resolve;
                        });
                    };
                    return [4 /*yield*/, connectNodeClient({
                            port: port,
                            commands: ["canvas.snapshot"],
                            instanceId: "node-allowed",
                            displayName: "node-allowed",
                            onEvent: function (evt) {
                                if (evt.event === "node.invoke.request") {
                                    var payload_1 = evt.payload;
                                    resolveInvoke_1 === null || resolveInvoke_1 === void 0 ? void 0 : resolveInvoke_1(payload_1);
                                }
                            },
                        })];
                case 10:
                    allowedClient = _g.sent();
                    return [4 /*yield*/, getConnectedNodeId()];
                case 11:
                    allowedNodeId = _g.sent();
                    invokeResP = (0, test_helpers_js_1.rpcReq)(ws, "node.invoke", {
                        nodeId: allowedNodeId,
                        command: "canvas.snapshot",
                        params: { format: "png" },
                        idempotencyKey: "allowlist-3",
                    });
                    return [4 /*yield*/, waitForInvoke()];
                case 12:
                    payload = _g.sent();
                    requestId = (_c = payload === null || payload === void 0 ? void 0 : payload.id) !== null && _c !== void 0 ? _c : "";
                    nodeIdFromReq = (_d = payload === null || payload === void 0 ? void 0 : payload.nodeId) !== null && _d !== void 0 ? _d : "node-allowed";
                    return [4 /*yield*/, allowedClient.request("node.invoke.result", {
                            id: requestId,
                            nodeId: nodeIdFromReq,
                            ok: true,
                            payloadJSON: JSON.stringify({ ok: true }),
                        })];
                case 13:
                    _g.sent();
                    return [4 /*yield*/, invokeResP];
                case 14:
                    invokeRes = _g.sent();
                    (0, vitest_1.expect)(invokeRes.ok).toBe(true);
                    invokeNullResP = (0, test_helpers_js_1.rpcReq)(ws, "node.invoke", {
                        nodeId: allowedNodeId,
                        command: "canvas.snapshot",
                        params: { format: "png" },
                        idempotencyKey: "allowlist-null-payloadjson",
                    });
                    return [4 /*yield*/, waitForInvoke()];
                case 15:
                    payloadNull = _g.sent();
                    requestIdNull = (_e = payloadNull === null || payloadNull === void 0 ? void 0 : payloadNull.id) !== null && _e !== void 0 ? _e : "";
                    nodeIdNull = (_f = payloadNull === null || payloadNull === void 0 ? void 0 : payloadNull.nodeId) !== null && _f !== void 0 ? _f : "node-allowed";
                    return [4 /*yield*/, allowedClient.request("node.invoke.result", {
                            id: requestIdNull,
                            nodeId: nodeIdNull,
                            ok: true,
                            payloadJSON: null,
                        })];
                case 16:
                    _g.sent();
                    return [4 /*yield*/, invokeNullResP];
                case 17:
                    invokeNullRes = _g.sent();
                    (0, vitest_1.expect)(invokeNullRes.ok).toBe(true);
                    return [3 /*break*/, 19];
                case 18:
                    systemClient === null || systemClient === void 0 ? void 0 : systemClient.stop();
                    emptyClient === null || emptyClient === void 0 ? void 0 : emptyClient.stop();
                    allowedClient === null || allowedClient === void 0 ? void 0 : allowedClient.stop();
                    return [7 /*endfinally*/];
                case 19: return [2 /*return*/];
            }
        });
    }); });
});
