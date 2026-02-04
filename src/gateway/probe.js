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
exports.probeGateway = probeGateway;
var node_crypto_1 = require("node:crypto");
var message_channel_js_1 = require("../utils/message-channel.js");
var client_js_1 = require("./client.js");
function formatError(err) {
    if (err instanceof Error) {
        return err.message;
    }
    return String(err);
}
function probeGateway(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var startedAt, instanceId, connectLatencyMs, connectError, close;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startedAt = Date.now();
                    instanceId = (0, node_crypto_1.randomUUID)();
                    connectLatencyMs = null;
                    connectError = null;
                    close = null;
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var _a, _b;
                            var settled = false;
                            var settle = function (result) {
                                if (settled) {
                                    return;
                                }
                                settled = true;
                                clearTimeout(timer);
                                client.stop();
                                resolve(__assign({ url: opts.url }, result));
                            };
                            var client = new client_js_1.GatewayClient({
                                url: opts.url,
                                token: (_a = opts.auth) === null || _a === void 0 ? void 0 : _a.token,
                                password: (_b = opts.auth) === null || _b === void 0 ? void 0 : _b.password,
                                clientName: message_channel_js_1.GATEWAY_CLIENT_NAMES.CLI,
                                clientVersion: "dev",
                                mode: message_channel_js_1.GATEWAY_CLIENT_MODES.PROBE,
                                instanceId: instanceId,
                                onConnectError: function (err) {
                                    connectError = formatError(err);
                                },
                                onClose: function (code, reason) {
                                    close = { code: code, reason: reason };
                                },
                                onHelloOk: function () { return __awaiter(_this, void 0, void 0, function () {
                                    var _a, health, status_1, presence, configSnapshot, err_1;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                connectLatencyMs = Date.now() - startedAt;
                                                _b.label = 1;
                                            case 1:
                                                _b.trys.push([1, 3, , 4]);
                                                return [4 /*yield*/, Promise.all([
                                                        client.request("health"),
                                                        client.request("status"),
                                                        client.request("system-presence"),
                                                        client.request("config.get", {}),
                                                    ])];
                                            case 2:
                                                _a = _b.sent(), health = _a[0], status_1 = _a[1], presence = _a[2], configSnapshot = _a[3];
                                                settle({
                                                    ok: true,
                                                    connectLatencyMs: connectLatencyMs,
                                                    error: null,
                                                    close: close,
                                                    health: health,
                                                    status: status_1,
                                                    presence: Array.isArray(presence) ? presence : null,
                                                    configSnapshot: configSnapshot,
                                                });
                                                return [3 /*break*/, 4];
                                            case 3:
                                                err_1 = _b.sent();
                                                settle({
                                                    ok: false,
                                                    connectLatencyMs: connectLatencyMs,
                                                    error: formatError(err_1),
                                                    close: close,
                                                    health: null,
                                                    status: null,
                                                    presence: null,
                                                    configSnapshot: null,
                                                });
                                                return [3 /*break*/, 4];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                }); },
                            });
                            var timer = setTimeout(function () {
                                settle({
                                    ok: false,
                                    connectLatencyMs: connectLatencyMs,
                                    error: connectError ? "connect failed: ".concat(connectError) : "timeout",
                                    close: close,
                                    health: null,
                                    status: null,
                                    presence: null,
                                    configSnapshot: null,
                                });
                            }, Math.max(250, opts.timeoutMs));
                            client.start();
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
