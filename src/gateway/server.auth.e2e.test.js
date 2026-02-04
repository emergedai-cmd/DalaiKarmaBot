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
var vitest_1 = require("vitest");
var ws_1 = require("ws");
var message_channel_js_1 = require("../utils/message-channel.js");
var device_auth_js_1 = require("./device-auth.js");
var index_js_1 = require("./protocol/index.js");
var server_constants_js_1 = require("./server-constants.js");
var test_helpers_js_1 = require("./test-helpers.js");
(0, test_helpers_js_1.installGatewayTestHooks)({ scope: "suite" });
function waitForWsClose(ws, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (ws.readyState === ws_1.WebSocket.CLOSED) {
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var timer = setTimeout(function () { return resolve(ws.readyState === ws_1.WebSocket.CLOSED); }, timeoutMs);
                            ws.once("close", function () {
                                clearTimeout(timer);
                                resolve(true);
                            });
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
var openWs = function (port) { return __awaiter(void 0, void 0, void 0, function () {
    var ws;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ws = new ws_1.WebSocket("ws://127.0.0.1:".concat(port));
                return [4 /*yield*/, new Promise(function (resolve) { return ws.once("open", resolve); })];
            case 1:
                _a.sent();
                return [2 /*return*/, ws];
        }
    });
}); };
(0, vitest_1.describe)("gateway server auth/connect", function () {
    (0, vitest_1.describe)("default auth (token)", function () {
        var server;
        var port;
        (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
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
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)("closes silent handshakes after timeout", { timeout: 60000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
            var prevHandshakeTimeout, ws, handshakeTimeoutMs, closed_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.useRealTimers();
                        prevHandshakeTimeout = process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS;
                        process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS = "50";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 4, 5]);
                        return [4 /*yield*/, openWs(port)];
                    case 2:
                        ws = _a.sent();
                        handshakeTimeoutMs = (0, server_constants_js_1.getHandshakeTimeoutMs)();
                        return [4 /*yield*/, waitForWsClose(ws, handshakeTimeoutMs + 250)];
                    case 3:
                        closed_1 = _a.sent();
                        (0, vitest_1.expect)(closed_1).toBe(true);
                        return [3 /*break*/, 5];
                    case 4:
                        if (prevHandshakeTimeout === undefined) {
                            delete process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS;
                        }
                        else {
                            process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS = prevHandshakeTimeout;
                        }
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)("connect (req) handshake returns hello-ok payload", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, CONFIG_PATH, STATE_DIR, ws, res, payload;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/config.js"); })];
                    case 1:
                        _a = _d.sent(), CONFIG_PATH = _a.CONFIG_PATH, STATE_DIR = _a.STATE_DIR;
                        return [4 /*yield*/, openWs(port)];
                    case 2:
                        ws = _d.sent();
                        return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws)];
                    case 3:
                        res = _d.sent();
                        (0, vitest_1.expect)(res.ok).toBe(true);
                        payload = res.payload;
                        (0, vitest_1.expect)(payload === null || payload === void 0 ? void 0 : payload.type).toBe("hello-ok");
                        (0, vitest_1.expect)((_b = payload === null || payload === void 0 ? void 0 : payload.snapshot) === null || _b === void 0 ? void 0 : _b.configPath).toBe(CONFIG_PATH);
                        (0, vitest_1.expect)((_c = payload === null || payload === void 0 ? void 0 : payload.snapshot) === null || _c === void 0 ? void 0 : _c.stateDir).toBe(STATE_DIR);
                        ws.close();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)("sends connect challenge on open", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ws, evtPromise, evt, nonce;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ws = new ws_1.WebSocket("ws://127.0.0.1:".concat(port));
                        evtPromise = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "event" && o.event === "connect.challenge"; });
                        return [4 /*yield*/, new Promise(function (resolve) { return ws.once("open", resolve); })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, evtPromise];
                    case 2:
                        evt = _b.sent();
                        nonce = (_a = evt.payload) === null || _a === void 0 ? void 0 : _a.nonce;
                        (0, vitest_1.expect)(typeof nonce).toBe("string");
                        ws.close();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)("rejects protocol mismatch", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ws, res, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, openWs(port)];
                    case 1:
                        ws = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws, {
                                minProtocol: index_js_1.PROTOCOL_VERSION + 1,
                                maxProtocol: index_js_1.PROTOCOL_VERSION + 2,
                            })];
                    case 3:
                        res = _b.sent();
                        (0, vitest_1.expect)(res.ok).toBe(false);
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        ws.close();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)("rejects non-connect first request", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ws, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, openWs(port)];
                    case 1:
                        ws = _a.sent();
                        ws.send(JSON.stringify({ type: "req", id: "h1", method: "health" }));
                        return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "h1"; })];
                    case 2:
                        res = _a.sent();
                        (0, vitest_1.expect)(res.ok).toBe(false);
                        return [4 /*yield*/, new Promise(function (resolve) { return ws.once("close", function () { return resolve(); }); })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)("requires nonce when host is non-local", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ws, res;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ws = new ws_1.WebSocket("ws://127.0.0.1:".concat(port), {
                            headers: { host: "example.com" },
                        });
                        return [4 /*yield*/, new Promise(function (resolve) { return ws.once("open", resolve); })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws)];
                    case 2:
                        res = _b.sent();
                        (0, vitest_1.expect)(res.ok).toBe(false);
                        (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.message).toBe("device nonce required");
                        return [4 /*yield*/, new Promise(function (resolve) { return ws.once("close", function () { return resolve(); }); })];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)("invalid connect params surface in response and close reason", { timeout: 60000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
            var ws, closeInfoPromise, res, closeInfo;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, openWs(port)];
                    case 1:
                        ws = _c.sent();
                        closeInfoPromise = new Promise(function (resolve) {
                            ws.once("close", function (code, reason) { return resolve({ code: code, reason: reason.toString() }); });
                        });
                        ws.send(JSON.stringify({
                            type: "req",
                            id: "h-bad",
                            method: "connect",
                            params: {
                                minProtocol: index_js_1.PROTOCOL_VERSION,
                                maxProtocol: index_js_1.PROTOCOL_VERSION,
                                client: {
                                    id: "bad-client",
                                    version: "dev",
                                    platform: "web",
                                    mode: "webchat",
                                },
                                device: {
                                    id: 123,
                                    publicKey: "bad",
                                    signature: "bad",
                                    signedAt: "bad",
                                },
                            },
                        }));
                        return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "h-bad"; })];
                    case 2:
                        res = _c.sent();
                        (0, vitest_1.expect)(res.ok).toBe(false);
                        (0, vitest_1.expect)(String((_b = (_a = res.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "")).toContain("invalid connect params");
                        return [4 /*yield*/, closeInfoPromise];
                    case 3:
                        closeInfo = _c.sent();
                        (0, vitest_1.expect)(closeInfo.code).toBe(1008);
                        (0, vitest_1.expect)(closeInfo.reason).toContain("invalid connect params");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("password auth", function () {
        var server;
        var port;
        (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        test_helpers_js_1.testState.gatewayAuth = { mode: "password", password: "secret" };
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
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)("accepts password auth when configured", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ws, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, openWs(port)];
                    case 1:
                        ws = _a.sent();
                        return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws, { password: "secret" })];
                    case 2:
                        res = _a.sent();
                        (0, vitest_1.expect)(res.ok).toBe(true);
                        ws.close();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)("rejects invalid password", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ws, res;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, openWs(port)];
                    case 1:
                        ws = _c.sent();
                        return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws, { password: "wrong" })];
                    case 2:
                        res = _c.sent();
                        (0, vitest_1.expect)(res.ok).toBe(false);
                        (0, vitest_1.expect)((_b = (_a = res.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "").toContain("unauthorized");
                        ws.close();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("token auth", function () {
        var server;
        var port;
        var prevToken;
        (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prevToken = process.env.OPENCLAW_GATEWAY_TOKEN;
                        process.env.OPENCLAW_GATEWAY_TOKEN = "secret";
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
                        if (prevToken === undefined) {
                            delete process.env.OPENCLAW_GATEWAY_TOKEN;
                        }
                        else {
                            process.env.OPENCLAW_GATEWAY_TOKEN = prevToken;
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)("rejects invalid token", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ws, res;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, openWs(port)];
                    case 1:
                        ws = _c.sent();
                        return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws, { token: "wrong" })];
                    case 2:
                        res = _c.sent();
                        (0, vitest_1.expect)(res.ok).toBe(false);
                        (0, vitest_1.expect)((_b = (_a = res.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "").toContain("unauthorized");
                        ws.close();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)("returns control ui hint when token is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ws, res;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, openWs(port)];
                    case 1:
                        ws = _c.sent();
                        return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws, {
                                skipDefaultAuth: true,
                                client: {
                                    id: message_channel_js_1.GATEWAY_CLIENT_NAMES.CONTROL_UI,
                                    version: "1.0.0",
                                    platform: "web",
                                    mode: message_channel_js_1.GATEWAY_CLIENT_MODES.WEBCHAT,
                                },
                            })];
                    case 2:
                        res = _c.sent();
                        (0, vitest_1.expect)(res.ok).toBe(false);
                        (0, vitest_1.expect)((_b = (_a = res.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "").toContain("Control UI settings");
                        ws.close();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.test)("rejects control ui without device identity by default", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ws, res;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, openWs(port)];
                    case 1:
                        ws = _c.sent();
                        return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws, {
                                token: "secret",
                                device: null,
                                client: {
                                    id: message_channel_js_1.GATEWAY_CLIENT_NAMES.CONTROL_UI,
                                    version: "1.0.0",
                                    platform: "web",
                                    mode: message_channel_js_1.GATEWAY_CLIENT_MODES.WEBCHAT,
                                },
                            })];
                    case 2:
                        res = _c.sent();
                        (0, vitest_1.expect)(res.ok).toBe(false);
                        (0, vitest_1.expect)((_b = (_a = res.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "").toContain("secure context");
                        ws.close();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.test)("allows control ui without device identity when insecure auth is enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, server, ws, prevToken, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    test_helpers_js_1.testState.gatewayControlUi = { allowInsecureAuth: true };
                    return [4 /*yield*/, (0, test_helpers_js_1.startServerWithClient)("secret")];
                case 1:
                    _a = _b.sent(), server = _a.server, ws = _a.ws, prevToken = _a.prevToken;
                    return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws, {
                            token: "secret",
                            device: null,
                            client: {
                                id: message_channel_js_1.GATEWAY_CLIENT_NAMES.CONTROL_UI,
                                version: "1.0.0",
                                platform: "web",
                                mode: message_channel_js_1.GATEWAY_CLIENT_MODES.WEBCHAT,
                            },
                        })];
                case 2:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    ws.close();
                    return [4 /*yield*/, server.close()];
                case 3:
                    _b.sent();
                    if (prevToken === undefined) {
                        delete process.env.OPENCLAW_GATEWAY_TOKEN;
                    }
                    else {
                        process.env.OPENCLAW_GATEWAY_TOKEN = prevToken;
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("allows control ui with device identity when insecure auth is enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var writeConfigFile, prevToken, port, server, ws, challengePromise, challenge, nonce, _a, loadOrCreateDeviceIdentity, publicKeyRawBase64UrlFromPem, signDevicePayload, identity, signedAtMs, payload, device, res;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    test_helpers_js_1.testState.gatewayControlUi = { allowInsecureAuth: true };
                    test_helpers_js_1.testState.gatewayAuth = { mode: "token", token: "secret" };
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/config.js"); })];
                case 1:
                    writeConfigFile = (_c.sent()).writeConfigFile;
                    return [4 /*yield*/, writeConfigFile({
                            gateway: {
                                trustedProxies: ["127.0.0.1"],
                            },
                            // oxlint-disable-next-line typescript/no-explicit-any
                        })];
                case 2:
                    _c.sent();
                    prevToken = process.env.OPENCLAW_GATEWAY_TOKEN;
                    process.env.OPENCLAW_GATEWAY_TOKEN = "secret";
                    return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
                case 3:
                    port = _c.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.startGatewayServer)(port)];
                case 4:
                    server = _c.sent();
                    ws = new ws_1.WebSocket("ws://127.0.0.1:".concat(port), {
                        headers: { "x-forwarded-for": "203.0.113.10" },
                    });
                    challengePromise = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "event" && o.event === "connect.challenge"; });
                    return [4 /*yield*/, new Promise(function (resolve) { return ws.once("open", resolve); })];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, challengePromise];
                case 6:
                    challenge = _c.sent();
                    nonce = (_b = challenge.payload) === null || _b === void 0 ? void 0 : _b.nonce;
                    (0, vitest_1.expect)(typeof nonce).toBe("string");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/device-identity.js"); })];
                case 7:
                    _a = _c.sent(), loadOrCreateDeviceIdentity = _a.loadOrCreateDeviceIdentity, publicKeyRawBase64UrlFromPem = _a.publicKeyRawBase64UrlFromPem, signDevicePayload = _a.signDevicePayload;
                    identity = loadOrCreateDeviceIdentity();
                    signedAtMs = Date.now();
                    payload = (0, device_auth_js_1.buildDeviceAuthPayload)({
                        deviceId: identity.deviceId,
                        clientId: message_channel_js_1.GATEWAY_CLIENT_NAMES.CONTROL_UI,
                        clientMode: message_channel_js_1.GATEWAY_CLIENT_MODES.WEBCHAT,
                        role: "operator",
                        scopes: [],
                        signedAtMs: signedAtMs,
                        token: "secret",
                        nonce: String(nonce),
                    });
                    device = {
                        id: identity.deviceId,
                        publicKey: publicKeyRawBase64UrlFromPem(identity.publicKeyPem),
                        signature: signDevicePayload(identity.privateKeyPem, payload),
                        signedAt: signedAtMs,
                        nonce: String(nonce),
                    };
                    return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws, {
                            token: "secret",
                            device: device,
                            client: {
                                id: message_channel_js_1.GATEWAY_CLIENT_NAMES.CONTROL_UI,
                                version: "1.0.0",
                                platform: "web",
                                mode: message_channel_js_1.GATEWAY_CLIENT_MODES.WEBCHAT,
                            },
                        })];
                case 8:
                    res = _c.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    ws.close();
                    return [4 /*yield*/, server.close()];
                case 9:
                    _c.sent();
                    if (prevToken === undefined) {
                        delete process.env.OPENCLAW_GATEWAY_TOKEN;
                    }
                    else {
                        process.env.OPENCLAW_GATEWAY_TOKEN = prevToken;
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("allows control ui with stale device identity when device auth is disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevToken, port, server, ws, _a, loadOrCreateDeviceIdentity, publicKeyRawBase64UrlFromPem, signDevicePayload, identity, signedAtMs, payload, device, res;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    test_helpers_js_1.testState.gatewayControlUi = { dangerouslyDisableDeviceAuth: true };
                    test_helpers_js_1.testState.gatewayAuth = { mode: "token", token: "secret" };
                    prevToken = process.env.OPENCLAW_GATEWAY_TOKEN;
                    process.env.OPENCLAW_GATEWAY_TOKEN = "secret";
                    return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
                case 1:
                    port = _c.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.startGatewayServer)(port)];
                case 2:
                    server = _c.sent();
                    return [4 /*yield*/, openWs(port)];
                case 3:
                    ws = _c.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/device-identity.js"); })];
                case 4:
                    _a = _c.sent(), loadOrCreateDeviceIdentity = _a.loadOrCreateDeviceIdentity, publicKeyRawBase64UrlFromPem = _a.publicKeyRawBase64UrlFromPem, signDevicePayload = _a.signDevicePayload;
                    identity = loadOrCreateDeviceIdentity();
                    signedAtMs = Date.now() - 60 * 60 * 1000;
                    payload = (0, device_auth_js_1.buildDeviceAuthPayload)({
                        deviceId: identity.deviceId,
                        clientId: message_channel_js_1.GATEWAY_CLIENT_NAMES.CONTROL_UI,
                        clientMode: message_channel_js_1.GATEWAY_CLIENT_MODES.WEBCHAT,
                        role: "operator",
                        scopes: [],
                        signedAtMs: signedAtMs,
                        token: "secret",
                    });
                    device = {
                        id: identity.deviceId,
                        publicKey: publicKeyRawBase64UrlFromPem(identity.publicKeyPem),
                        signature: signDevicePayload(identity.privateKeyPem, payload),
                        signedAt: signedAtMs,
                    };
                    return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws, {
                            token: "secret",
                            device: device,
                            client: {
                                id: message_channel_js_1.GATEWAY_CLIENT_NAMES.CONTROL_UI,
                                version: "1.0.0",
                                platform: "web",
                                mode: message_channel_js_1.GATEWAY_CLIENT_MODES.WEBCHAT,
                            },
                        })];
                case 5:
                    res = _c.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)((_b = res.payload) === null || _b === void 0 ? void 0 : _b.auth).toBeUndefined();
                    ws.close();
                    return [4 /*yield*/, server.close()];
                case 6:
                    _c.sent();
                    if (prevToken === undefined) {
                        delete process.env.OPENCLAW_GATEWAY_TOKEN;
                    }
                    else {
                        process.env.OPENCLAW_GATEWAY_TOKEN = prevToken;
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("accepts device token auth for paired device", function () { return __awaiter(void 0, void 0, void 0, function () {
        var loadOrCreateDeviceIdentity, _a, approveDevicePairing, getPairedDevice, listDevicePairing, _b, server, ws, port, prevToken, res, list, pending, identity, paired, deviceToken, ws2, res2;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/device-identity.js"); })];
                case 1:
                    loadOrCreateDeviceIdentity = (_e.sent()).loadOrCreateDeviceIdentity;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/device-pairing.js"); })];
                case 2:
                    _a = _e.sent(), approveDevicePairing = _a.approveDevicePairing, getPairedDevice = _a.getPairedDevice, listDevicePairing = _a.listDevicePairing;
                    return [4 /*yield*/, (0, test_helpers_js_1.startServerWithClient)("secret")];
                case 3:
                    _b = _e.sent(), server = _b.server, ws = _b.ws, port = _b.port, prevToken = _b.prevToken;
                    return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws, { token: "secret" })];
                case 4:
                    res = _e.sent();
                    if (!!res.ok) return [3 /*break*/, 7];
                    return [4 /*yield*/, listDevicePairing()];
                case 5:
                    list = _e.sent();
                    pending = list.pending.at(0);
                    (0, vitest_1.expect)(pending === null || pending === void 0 ? void 0 : pending.requestId).toBeDefined();
                    if (!(pending === null || pending === void 0 ? void 0 : pending.requestId)) return [3 /*break*/, 7];
                    return [4 /*yield*/, approveDevicePairing(pending.requestId)];
                case 6:
                    _e.sent();
                    _e.label = 7;
                case 7:
                    identity = loadOrCreateDeviceIdentity();
                    return [4 /*yield*/, getPairedDevice(identity.deviceId)];
                case 8:
                    paired = _e.sent();
                    deviceToken = (_d = (_c = paired === null || paired === void 0 ? void 0 : paired.tokens) === null || _c === void 0 ? void 0 : _c.operator) === null || _d === void 0 ? void 0 : _d.token;
                    (0, vitest_1.expect)(deviceToken).toBeDefined();
                    ws.close();
                    ws2 = new ws_1.WebSocket("ws://127.0.0.1:".concat(port));
                    return [4 /*yield*/, new Promise(function (resolve) { return ws2.once("open", resolve); })];
                case 9:
                    _e.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws2, { token: deviceToken })];
                case 10:
                    res2 = _e.sent();
                    (0, vitest_1.expect)(res2.ok).toBe(true);
                    ws2.close();
                    return [4 /*yield*/, server.close()];
                case 11:
                    _e.sent();
                    if (prevToken === undefined) {
                        delete process.env.OPENCLAW_GATEWAY_TOKEN;
                    }
                    else {
                        process.env.OPENCLAW_GATEWAY_TOKEN = prevToken;
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("requires pairing for scope upgrades", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mkdtemp, tmpdir, join, buildDeviceAuthPayload, _a, loadOrCreateDeviceIdentity, publicKeyRawBase64UrlFromPem, signDevicePayload, _b, approveDevicePairing, getPairedDevice, listDevicePairing, _c, GATEWAY_CLIENT_MODES, GATEWAY_CLIENT_NAMES, _d, server, ws, port, prevToken, identityDir, identity, client, buildDevice, initial, list, pending, paired, ws2, res;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("node:fs/promises"); })];
                case 1:
                    mkdtemp = (_e.sent()).mkdtemp;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("node:os"); })];
                case 2:
                    tmpdir = (_e.sent()).tmpdir;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("node:path"); })];
                case 3:
                    join = (_e.sent()).join;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./device-auth.js"); })];
                case 4:
                    buildDeviceAuthPayload = (_e.sent()).buildDeviceAuthPayload;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/device-identity.js"); })];
                case 5:
                    _a = _e.sent(), loadOrCreateDeviceIdentity = _a.loadOrCreateDeviceIdentity, publicKeyRawBase64UrlFromPem = _a.publicKeyRawBase64UrlFromPem, signDevicePayload = _a.signDevicePayload;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/device-pairing.js"); })];
                case 6:
                    _b = _e.sent(), approveDevicePairing = _b.approveDevicePairing, getPairedDevice = _b.getPairedDevice, listDevicePairing = _b.listDevicePairing;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../utils/message-channel.js"); })];
                case 7:
                    _c = _e.sent(), GATEWAY_CLIENT_MODES = _c.GATEWAY_CLIENT_MODES, GATEWAY_CLIENT_NAMES = _c.GATEWAY_CLIENT_NAMES;
                    return [4 /*yield*/, (0, test_helpers_js_1.startServerWithClient)("secret")];
                case 8:
                    _d = _e.sent(), server = _d.server, ws = _d.ws, port = _d.port, prevToken = _d.prevToken;
                    return [4 /*yield*/, mkdtemp(join(tmpdir(), "openclaw-device-scope-"))];
                case 9:
                    identityDir = _e.sent();
                    identity = loadOrCreateDeviceIdentity(join(identityDir, "device.json"));
                    client = {
                        id: GATEWAY_CLIENT_NAMES.TEST,
                        version: "1.0.0",
                        platform: "test",
                        mode: GATEWAY_CLIENT_MODES.TEST,
                    };
                    buildDevice = function (scopes) {
                        var signedAtMs = Date.now();
                        var payload = buildDeviceAuthPayload({
                            deviceId: identity.deviceId,
                            clientId: client.id,
                            clientMode: client.mode,
                            role: "operator",
                            scopes: scopes,
                            signedAtMs: signedAtMs,
                            token: "secret",
                        });
                        return {
                            id: identity.deviceId,
                            publicKey: publicKeyRawBase64UrlFromPem(identity.publicKeyPem),
                            signature: signDevicePayload(identity.privateKeyPem, payload),
                            signedAt: signedAtMs,
                        };
                    };
                    return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws, {
                            token: "secret",
                            scopes: ["operator.read"],
                            client: client,
                            device: buildDevice(["operator.read"]),
                        })];
                case 10:
                    initial = _e.sent();
                    if (!!initial.ok) return [3 /*break*/, 13];
                    return [4 /*yield*/, listDevicePairing()];
                case 11:
                    list = _e.sent();
                    pending = list.pending.at(0);
                    (0, vitest_1.expect)(pending === null || pending === void 0 ? void 0 : pending.requestId).toBeDefined();
                    if (!(pending === null || pending === void 0 ? void 0 : pending.requestId)) return [3 /*break*/, 13];
                    return [4 /*yield*/, approveDevicePairing(pending.requestId)];
                case 12:
                    _e.sent();
                    _e.label = 13;
                case 13: return [4 /*yield*/, getPairedDevice(identity.deviceId)];
                case 14:
                    paired = _e.sent();
                    (0, vitest_1.expect)(paired === null || paired === void 0 ? void 0 : paired.scopes).toContain("operator.read");
                    ws.close();
                    ws2 = new ws_1.WebSocket("ws://127.0.0.1:".concat(port));
                    return [4 /*yield*/, new Promise(function (resolve) { return ws2.once("open", resolve); })];
                case 15:
                    _e.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws2, {
                            token: "secret",
                            scopes: ["operator.admin"],
                            client: client,
                            device: buildDevice(["operator.admin"]),
                        })];
                case 16:
                    res = _e.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    return [4 /*yield*/, getPairedDevice(identity.deviceId)];
                case 17:
                    paired = _e.sent();
                    (0, vitest_1.expect)(paired === null || paired === void 0 ? void 0 : paired.scopes).toContain("operator.admin");
                    ws2.close();
                    return [4 /*yield*/, server.close()];
                case 18:
                    _e.sent();
                    if (prevToken === undefined) {
                        delete process.env.OPENCLAW_GATEWAY_TOKEN;
                    }
                    else {
                        process.env.OPENCLAW_GATEWAY_TOKEN = prevToken;
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("rejects revoked device token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var loadOrCreateDeviceIdentity, _a, approveDevicePairing, getPairedDevice, listDevicePairing, revokeDeviceToken, _b, server, ws, port, prevToken, res, list, pending, identity, paired, deviceToken, ws2, res2;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/device-identity.js"); })];
                case 1:
                    loadOrCreateDeviceIdentity = (_e.sent()).loadOrCreateDeviceIdentity;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/device-pairing.js"); })];
                case 2:
                    _a = _e.sent(), approveDevicePairing = _a.approveDevicePairing, getPairedDevice = _a.getPairedDevice, listDevicePairing = _a.listDevicePairing, revokeDeviceToken = _a.revokeDeviceToken;
                    return [4 /*yield*/, (0, test_helpers_js_1.startServerWithClient)("secret")];
                case 3:
                    _b = _e.sent(), server = _b.server, ws = _b.ws, port = _b.port, prevToken = _b.prevToken;
                    return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws, { token: "secret" })];
                case 4:
                    res = _e.sent();
                    if (!!res.ok) return [3 /*break*/, 7];
                    return [4 /*yield*/, listDevicePairing()];
                case 5:
                    list = _e.sent();
                    pending = list.pending.at(0);
                    (0, vitest_1.expect)(pending === null || pending === void 0 ? void 0 : pending.requestId).toBeDefined();
                    if (!(pending === null || pending === void 0 ? void 0 : pending.requestId)) return [3 /*break*/, 7];
                    return [4 /*yield*/, approveDevicePairing(pending.requestId)];
                case 6:
                    _e.sent();
                    _e.label = 7;
                case 7:
                    identity = loadOrCreateDeviceIdentity();
                    return [4 /*yield*/, getPairedDevice(identity.deviceId)];
                case 8:
                    paired = _e.sent();
                    deviceToken = (_d = (_c = paired === null || paired === void 0 ? void 0 : paired.tokens) === null || _c === void 0 ? void 0 : _c.operator) === null || _d === void 0 ? void 0 : _d.token;
                    (0, vitest_1.expect)(deviceToken).toBeDefined();
                    return [4 /*yield*/, revokeDeviceToken({ deviceId: identity.deviceId, role: "operator" })];
                case 9:
                    _e.sent();
                    ws.close();
                    ws2 = new ws_1.WebSocket("ws://127.0.0.1:".concat(port));
                    return [4 /*yield*/, new Promise(function (resolve) { return ws2.once("open", resolve); })];
                case 10:
                    _e.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.connectReq)(ws2, { token: deviceToken })];
                case 11:
                    res2 = _e.sent();
                    (0, vitest_1.expect)(res2.ok).toBe(false);
                    ws2.close();
                    return [4 /*yield*/, server.close()];
                case 12:
                    _e.sent();
                    if (prevToken === undefined) {
                        delete process.env.OPENCLAW_GATEWAY_TOKEN;
                    }
                    else {
                        process.env.OPENCLAW_GATEWAY_TOKEN = prevToken;
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    // Remaining tests require isolated gateway state.
});
