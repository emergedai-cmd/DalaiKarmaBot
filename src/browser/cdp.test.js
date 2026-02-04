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
var node_http_1 = require("node:http");
var vitest_1 = require("vitest");
var ws_1 = require("ws");
var ws_js_1 = require("../infra/ws.js");
var cdp_js_1 = require("./cdp.js");
(0, vitest_1.describe)("cdp", function () {
    var httpServer = null;
    var wsServer = null;
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                        if (!httpServer) {
                            return resolve();
                        }
                        httpServer.close(function () { return resolve(); });
                        httpServer = null;
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            if (!wsServer) {
                                return resolve();
                            }
                            wsServer.close(function () { return resolve(); });
                            wsServer = null;
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("creates a target via the browser websocket", function () { return __awaiter(void 0, void 0, void 0, function () {
        var wsPort, httpPort, created;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wsServer = new ws_1.WebSocketServer({ port: 0, host: "127.0.0.1" });
                    return [4 /*yield*/, new Promise(function (resolve) { return wsServer === null || wsServer === void 0 ? void 0 : wsServer.once("listening", resolve); })];
                case 1:
                    _a.sent();
                    wsPort = wsServer.address().port;
                    wsServer.on("connection", function (socket) {
                        socket.on("message", function (data) {
                            var msg = JSON.parse((0, ws_js_1.rawDataToString)(data));
                            if (msg.method !== "Target.createTarget") {
                                return;
                            }
                            socket.send(JSON.stringify({
                                id: msg.id,
                                result: { targetId: "TARGET_123" },
                            }));
                        });
                    });
                    httpServer = (0, node_http_1.createServer)(function (req, res) {
                        if (req.url === "/json/version") {
                            res.setHeader("content-type", "application/json");
                            res.end(JSON.stringify({
                                webSocketDebuggerUrl: "ws://127.0.0.1:".concat(wsPort, "/devtools/browser/TEST"),
                            }));
                            return;
                        }
                        res.statusCode = 404;
                        res.end("not found");
                    });
                    return [4 /*yield*/, new Promise(function (resolve) { return httpServer === null || httpServer === void 0 ? void 0 : httpServer.listen(0, "127.0.0.1", resolve); })];
                case 2:
                    _a.sent();
                    httpPort = httpServer.address().port;
                    return [4 /*yield*/, (0, cdp_js_1.createTargetViaCdp)({
                            cdpUrl: "http://127.0.0.1:".concat(httpPort),
                            url: "https://example.com",
                        })];
                case 3:
                    created = _a.sent();
                    (0, vitest_1.expect)(created.targetId).toBe("TARGET_123");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("evaluates javascript via CDP", function () { return __awaiter(void 0, void 0, void 0, function () {
        var wsPort, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wsServer = new ws_1.WebSocketServer({ port: 0, host: "127.0.0.1" });
                    return [4 /*yield*/, new Promise(function (resolve) { return wsServer === null || wsServer === void 0 ? void 0 : wsServer.once("listening", resolve); })];
                case 1:
                    _a.sent();
                    wsPort = wsServer.address().port;
                    wsServer.on("connection", function (socket) {
                        socket.on("message", function (data) {
                            var _a;
                            var msg = JSON.parse((0, ws_js_1.rawDataToString)(data));
                            if (msg.method === "Runtime.enable") {
                                socket.send(JSON.stringify({ id: msg.id, result: {} }));
                                return;
                            }
                            if (msg.method === "Runtime.evaluate") {
                                (0, vitest_1.expect)((_a = msg.params) === null || _a === void 0 ? void 0 : _a.expression).toBe("1+1");
                                socket.send(JSON.stringify({
                                    id: msg.id,
                                    result: { result: { type: "number", value: 2 } },
                                }));
                            }
                        });
                    });
                    return [4 /*yield*/, (0, cdp_js_1.evaluateJavaScript)({
                            wsUrl: "ws://127.0.0.1:".concat(wsPort),
                            expression: "1+1",
                        })];
                case 2:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.result.type).toBe("number");
                    (0, vitest_1.expect)(res.result.value).toBe(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("captures an aria snapshot via CDP", function () { return __awaiter(void 0, void 0, void 0, function () {
        var wsPort, snap;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    wsServer = new ws_1.WebSocketServer({ port: 0, host: "127.0.0.1" });
                    return [4 /*yield*/, new Promise(function (resolve) { return wsServer === null || wsServer === void 0 ? void 0 : wsServer.once("listening", resolve); })];
                case 1:
                    _f.sent();
                    wsPort = wsServer.address().port;
                    wsServer.on("connection", function (socket) {
                        socket.on("message", function (data) {
                            var msg = JSON.parse((0, ws_js_1.rawDataToString)(data));
                            if (msg.method === "Accessibility.enable") {
                                socket.send(JSON.stringify({ id: msg.id, result: {} }));
                                return;
                            }
                            if (msg.method === "Accessibility.getFullAXTree") {
                                socket.send(JSON.stringify({
                                    id: msg.id,
                                    result: {
                                        nodes: [
                                            {
                                                nodeId: "1",
                                                role: { value: "RootWebArea" },
                                                name: { value: "" },
                                                childIds: ["2"],
                                            },
                                            {
                                                nodeId: "2",
                                                role: { value: "button" },
                                                name: { value: "OK" },
                                                backendDOMNodeId: 42,
                                                childIds: [],
                                            },
                                        ],
                                    },
                                }));
                                return;
                            }
                        });
                    });
                    return [4 /*yield*/, (0, cdp_js_1.snapshotAria)({ wsUrl: "ws://127.0.0.1:".concat(wsPort) })];
                case 2:
                    snap = _f.sent();
                    (0, vitest_1.expect)(snap.nodes.length).toBe(2);
                    (0, vitest_1.expect)((_a = snap.nodes[0]) === null || _a === void 0 ? void 0 : _a.role).toBe("RootWebArea");
                    (0, vitest_1.expect)((_b = snap.nodes[1]) === null || _b === void 0 ? void 0 : _b.role).toBe("button");
                    (0, vitest_1.expect)((_c = snap.nodes[1]) === null || _c === void 0 ? void 0 : _c.name).toBe("OK");
                    (0, vitest_1.expect)((_d = snap.nodes[1]) === null || _d === void 0 ? void 0 : _d.backendDOMNodeId).toBe(42);
                    (0, vitest_1.expect)((_e = snap.nodes[1]) === null || _e === void 0 ? void 0 : _e.depth).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("normalizes loopback websocket URLs for remote CDP hosts", function () {
        var normalized = (0, cdp_js_1.normalizeCdpWsUrl)("ws://127.0.0.1:9222/devtools/browser/ABC", "http://example.com:9222");
        (0, vitest_1.expect)(normalized).toBe("ws://example.com:9222/devtools/browser/ABC");
    });
    (0, vitest_1.it)("propagates auth and query params onto normalized websocket URLs", function () {
        var normalized = (0, cdp_js_1.normalizeCdpWsUrl)("ws://127.0.0.1:9222/devtools/browser/ABC", "https://user:pass@example.com?token=abc");
        (0, vitest_1.expect)(normalized).toBe("wss://user:pass@example.com/devtools/browser/ABC?token=abc");
    });
    (0, vitest_1.it)("upgrades ws to wss when CDP uses https", function () {
        var normalized = (0, cdp_js_1.normalizeCdpWsUrl)("ws://production-sfo.browserless.io", "https://production-sfo.browserless.io?token=abc");
        (0, vitest_1.expect)(normalized).toBe("wss://production-sfo.browserless.io/?token=abc");
    });
});
