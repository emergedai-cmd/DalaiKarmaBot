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
exports.getFreeGatewayPort = getFreeGatewayPort;
exports.connectGatewayClient = connectGatewayClient;
exports.connectDeviceAuthReq = connectDeviceAuthReq;
var ws_1 = require("ws");
var device_identity_js_1 = require("../infra/device-identity.js");
var ws_js_1 = require("../infra/ws.js");
var ports_js_1 = require("../test-utils/ports.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var client_js_1 = require("./client.js");
var device_auth_js_1 = require("./device-auth.js");
var index_js_1 = require("./protocol/index.js");
function getFreeGatewayPort() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, ports_js_1.getDeterministicFreePortBlock)({ offsets: [0, 1, 2, 3, 4] })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function connectGatewayClient(params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var _a, _b, _c, _d;
                        var settled = false;
                        var stop = function (err, client) {
                            if (settled) {
                                return;
                            }
                            settled = true;
                            clearTimeout(timer);
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(client);
                            }
                        };
                        var client = new client_js_1.GatewayClient({
                            url: params.url,
                            token: params.token,
                            clientName: (_a = params.clientName) !== null && _a !== void 0 ? _a : message_channel_js_1.GATEWAY_CLIENT_NAMES.TEST,
                            clientDisplayName: (_b = params.clientDisplayName) !== null && _b !== void 0 ? _b : "vitest",
                            clientVersion: (_c = params.clientVersion) !== null && _c !== void 0 ? _c : "dev",
                            mode: (_d = params.mode) !== null && _d !== void 0 ? _d : message_channel_js_1.GATEWAY_CLIENT_MODES.TEST,
                            onHelloOk: function () { return stop(undefined, client); },
                            onConnectError: function (err) { return stop(err); },
                            onClose: function (code, reason) {
                                return stop(new Error("gateway closed during connect (".concat(code, "): ").concat(reason)));
                            },
                        });
                        var timer = setTimeout(function () { return stop(new Error("gateway connect timeout")); }, 10000);
                        timer.unref();
                        client.start();
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function connectDeviceAuthReq(params) {
    return __awaiter(this, void 0, void 0, function () {
        var ws, identity, signedAtMs, payload, device, res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ws = new ws_1.WebSocket(params.url);
                    return [4 /*yield*/, new Promise(function (resolve) { return ws.once("open", resolve); })];
                case 1:
                    _b.sent();
                    identity = (0, device_identity_js_1.loadOrCreateDeviceIdentity)();
                    signedAtMs = Date.now();
                    payload = (0, device_auth_js_1.buildDeviceAuthPayload)({
                        deviceId: identity.deviceId,
                        clientId: message_channel_js_1.GATEWAY_CLIENT_NAMES.TEST,
                        clientMode: message_channel_js_1.GATEWAY_CLIENT_MODES.TEST,
                        role: "operator",
                        scopes: [],
                        signedAtMs: signedAtMs,
                        token: (_a = params.token) !== null && _a !== void 0 ? _a : null,
                    });
                    device = {
                        id: identity.deviceId,
                        publicKey: (0, device_identity_js_1.publicKeyRawBase64UrlFromPem)(identity.publicKeyPem),
                        signature: (0, device_identity_js_1.signDevicePayload)(identity.privateKeyPem, payload),
                        signedAt: signedAtMs,
                    };
                    ws.send(JSON.stringify({
                        type: "req",
                        id: "c1",
                        method: "connect",
                        params: {
                            minProtocol: index_js_1.PROTOCOL_VERSION,
                            maxProtocol: index_js_1.PROTOCOL_VERSION,
                            client: {
                                id: message_channel_js_1.GATEWAY_CLIENT_NAMES.TEST,
                                displayName: "vitest",
                                version: "dev",
                                platform: process.platform,
                                mode: message_channel_js_1.GATEWAY_CLIENT_MODES.TEST,
                            },
                            caps: [],
                            auth: params.token ? { token: params.token } : undefined,
                            device: device,
                        },
                    }));
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var timer = setTimeout(function () { return reject(new Error("timeout")); }, 5000);
                            var closeHandler = function (code, reason) {
                                clearTimeout(timer);
                                ws.off("message", handler);
                                reject(new Error("closed ".concat(code, ": ").concat((0, ws_js_1.rawDataToString)(reason))));
                            };
                            var handler = function (data) {
                                var obj = JSON.parse((0, ws_js_1.rawDataToString)(data));
                                if ((obj === null || obj === void 0 ? void 0 : obj.type) !== "res" || (obj === null || obj === void 0 ? void 0 : obj.id) !== "c1") {
                                    return;
                                }
                                clearTimeout(timer);
                                ws.off("message", handler);
                                ws.off("close", closeHandler);
                                resolve(obj);
                            };
                            ws.on("message", handler);
                            ws.once("close", closeHandler);
                        })];
                case 2:
                    res = _b.sent();
                    ws.close();
                    return [2 /*return*/, res];
            }
        });
    });
}
