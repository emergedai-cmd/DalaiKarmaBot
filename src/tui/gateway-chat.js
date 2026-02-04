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
exports.GatewayChatClient = void 0;
exports.resolveGatewayConnection = resolveGatewayConnection;
var node_crypto_1 = require("node:crypto");
var config_js_1 = require("../config/config.js");
var client_js_1 = require("../gateway/client.js");
var index_js_1 = require("../gateway/protocol/index.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var version_js_1 = require("../version.js");
var GatewayChatClient = /** @class */ (function () {
    function GatewayChatClient(opts) {
        var _this = this;
        var resolved = resolveGatewayConnection(opts);
        this.connection = resolved;
        this.readyPromise = new Promise(function (resolve) {
            _this.resolveReady = resolve;
        });
        this.client = new client_js_1.GatewayClient({
            url: resolved.url,
            token: resolved.token,
            password: resolved.password,
            clientName: message_channel_js_1.GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
            clientDisplayName: "openclaw-tui",
            clientVersion: version_js_1.VERSION,
            platform: process.platform,
            mode: message_channel_js_1.GATEWAY_CLIENT_MODES.UI,
            instanceId: (0, node_crypto_1.randomUUID)(),
            minProtocol: index_js_1.PROTOCOL_VERSION,
            maxProtocol: index_js_1.PROTOCOL_VERSION,
            onHelloOk: function (hello) {
                var _a, _b;
                _this.hello = hello;
                (_a = _this.resolveReady) === null || _a === void 0 ? void 0 : _a.call(_this);
                (_b = _this.onConnected) === null || _b === void 0 ? void 0 : _b.call(_this);
            },
            onEvent: function (evt) {
                var _a;
                (_a = _this.onEvent) === null || _a === void 0 ? void 0 : _a.call(_this, {
                    event: evt.event,
                    payload: evt.payload,
                    seq: evt.seq,
                });
            },
            onClose: function (_code, reason) {
                var _a;
                (_a = _this.onDisconnected) === null || _a === void 0 ? void 0 : _a.call(_this, reason);
            },
            onGap: function (info) {
                var _a;
                (_a = _this.onGap) === null || _a === void 0 ? void 0 : _a.call(_this, info);
            },
        });
    }
    GatewayChatClient.prototype.start = function () {
        this.client.start();
    };
    GatewayChatClient.prototype.stop = function () {
        this.client.stop();
    };
    GatewayChatClient.prototype.waitForReady = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readyPromise];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GatewayChatClient.prototype.sendChat = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var runId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        runId = (0, node_crypto_1.randomUUID)();
                        return [4 /*yield*/, this.client.request("chat.send", {
                                sessionKey: opts.sessionKey,
                                message: opts.message,
                                thinking: opts.thinking,
                                deliver: opts.deliver,
                                timeoutMs: opts.timeoutMs,
                                idempotencyKey: runId,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { runId: runId }];
                }
            });
        });
    };
    GatewayChatClient.prototype.abortChat = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.request("chat.abort", {
                            sessionKey: opts.sessionKey,
                            runId: opts.runId,
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GatewayChatClient.prototype.loadHistory = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.request("chat.history", {
                            sessionKey: opts.sessionKey,
                            limit: opts.limit,
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GatewayChatClient.prototype.listSessions = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.request("sessions.list", {
                            limit: opts === null || opts === void 0 ? void 0 : opts.limit,
                            activeMinutes: opts === null || opts === void 0 ? void 0 : opts.activeMinutes,
                            includeGlobal: opts === null || opts === void 0 ? void 0 : opts.includeGlobal,
                            includeUnknown: opts === null || opts === void 0 ? void 0 : opts.includeUnknown,
                            includeDerivedTitles: opts === null || opts === void 0 ? void 0 : opts.includeDerivedTitles,
                            includeLastMessage: opts === null || opts === void 0 ? void 0 : opts.includeLastMessage,
                            agentId: opts === null || opts === void 0 ? void 0 : opts.agentId,
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GatewayChatClient.prototype.listAgents = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.request("agents.list", {})];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GatewayChatClient.prototype.patchSession = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.request("sessions.patch", opts)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GatewayChatClient.prototype.resetSession = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.request("sessions.reset", { key: key })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GatewayChatClient.prototype.getStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.request("status")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GatewayChatClient.prototype.listModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.request("models.list")];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, Array.isArray(res === null || res === void 0 ? void 0 : res.models) ? res.models : []];
                }
            });
        });
    };
    return GatewayChatClient;
}());
exports.GatewayChatClient = GatewayChatClient;
function resolveGatewayConnection(opts) {
    var _a, _b, _c, _d, _e, _f;
    var config = (0, config_js_1.loadConfig)();
    var isRemoteMode = ((_a = config.gateway) === null || _a === void 0 ? void 0 : _a.mode) === "remote";
    var remote = isRemoteMode ? (_b = config.gateway) === null || _b === void 0 ? void 0 : _b.remote : undefined;
    var authToken = (_d = (_c = config.gateway) === null || _c === void 0 ? void 0 : _c.auth) === null || _d === void 0 ? void 0 : _d.token;
    var localPort = (0, config_js_1.resolveGatewayPort)(config);
    var url = (typeof opts.url === "string" && opts.url.trim().length > 0 ? opts.url.trim() : undefined) ||
        (typeof (remote === null || remote === void 0 ? void 0 : remote.url) === "string" && remote.url.trim().length > 0
            ? remote.url.trim()
            : undefined) ||
        "ws://127.0.0.1:".concat(localPort);
    var token = (typeof opts.token === "string" && opts.token.trim().length > 0
        ? opts.token.trim()
        : undefined) ||
        (isRemoteMode
            ? typeof (remote === null || remote === void 0 ? void 0 : remote.token) === "string" && remote.token.trim().length > 0
                ? remote.token.trim()
                : undefined
            : ((_e = process.env.OPENCLAW_GATEWAY_TOKEN) === null || _e === void 0 ? void 0 : _e.trim()) ||
                (typeof authToken === "string" && authToken.trim().length > 0
                    ? authToken.trim()
                    : undefined));
    var password = (typeof opts.password === "string" && opts.password.trim().length > 0
        ? opts.password.trim()
        : undefined) ||
        ((_f = process.env.OPENCLAW_GATEWAY_PASSWORD) === null || _f === void 0 ? void 0 : _f.trim()) ||
        (typeof (remote === null || remote === void 0 ? void 0 : remote.password) === "string" && remote.password.trim().length > 0
            ? remote.password.trim()
            : undefined);
    return { url: url, token: token, password: password };
}
