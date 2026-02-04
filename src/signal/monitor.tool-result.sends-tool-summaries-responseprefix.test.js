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
var vitest_1 = require("vitest");
var inbound_dedupe_js_1 = require("../auto-reply/reply/inbound-dedupe.js");
var system_events_js_1 = require("../infra/system-events.js");
var resolve_route_js_1 = require("../routing/resolve-route.js");
var utils_js_1 = require("../utils.js");
var monitor_js_1 = require("./monitor.js");
var waitForTransportReadyMock = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
var sendMock = vitest_1.vi.fn();
var replyMock = vitest_1.vi.fn();
var updateLastRouteMock = vitest_1.vi.fn();
var config = {};
var readAllowFromStoreMock = vitest_1.vi.fn();
var upsertPairingRequestMock = vitest_1.vi.fn();
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: function () { return config; } })];
        }
    });
}); });
vitest_1.vi.mock("../auto-reply/reply.js", function () { return ({
    getReplyFromConfig: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return replyMock.apply(void 0, args);
    },
}); });
vitest_1.vi.mock("./send.js", function () { return ({
    sendMessageSignal: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return sendMock.apply(void 0, args);
    },
    sendTypingSignal: vitest_1.vi.fn().mockResolvedValue(true),
    sendReadReceiptSignal: vitest_1.vi.fn().mockResolvedValue(true),
}); });
vitest_1.vi.mock("../pairing/pairing-store.js", function () { return ({
    readChannelAllowFromStore: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return readAllowFromStoreMock.apply(void 0, args);
    },
    upsertChannelPairingRequest: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return upsertPairingRequestMock.apply(void 0, args);
    },
}); });
vitest_1.vi.mock("../config/sessions.js", function () { return ({
    resolveStorePath: vitest_1.vi.fn(function () { return "/tmp/openclaw-sessions.json"; }),
    updateLastRoute: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return updateLastRouteMock.apply(void 0, args);
    },
    readSessionUpdatedAt: vitest_1.vi.fn(function () { return undefined; }),
    recordSessionMetaFromInbound: vitest_1.vi.fn().mockResolvedValue(undefined),
}); });
var streamMock = vitest_1.vi.fn();
var signalCheckMock = vitest_1.vi.fn();
var signalRpcRequestMock = vitest_1.vi.fn();
vitest_1.vi.mock("./client.js", function () { return ({
    streamSignalEvents: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return streamMock.apply(void 0, args);
    },
    signalCheck: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return signalCheckMock.apply(void 0, args);
    },
    signalRpcRequest: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return signalRpcRequestMock.apply(void 0, args);
    },
}); });
vitest_1.vi.mock("./daemon.js", function () { return ({
    spawnSignalDaemon: vitest_1.vi.fn(function () { return ({ stop: vitest_1.vi.fn() }); }),
}); });
vitest_1.vi.mock("../infra/transport-ready.js", function () { return ({
    waitForTransportReady: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return waitForTransportReadyMock.apply(void 0, args);
    },
}); });
var flush = function () { return new Promise(function (resolve) { return setTimeout(resolve, 0); }); };
(0, vitest_1.beforeEach)(function () {
    (0, inbound_dedupe_js_1.resetInboundDedupe)();
    config = {
        messages: { responsePrefix: "PFX" },
        channels: {
            signal: { autoStart: false, dmPolicy: "open", allowFrom: ["*"] },
        },
    };
    sendMock.mockReset().mockResolvedValue(undefined);
    replyMock.mockReset();
    updateLastRouteMock.mockReset();
    streamMock.mockReset();
    signalCheckMock.mockReset().mockResolvedValue({});
    signalRpcRequestMock.mockReset().mockResolvedValue({});
    readAllowFromStoreMock.mockReset().mockResolvedValue([]);
    upsertPairingRequestMock.mockReset().mockResolvedValue({ code: "PAIRCODE", created: true });
    waitForTransportReadyMock.mockReset().mockResolvedValue(undefined);
    (0, system_events_js_1.resetSystemEventsForTest)();
});
(0, vitest_1.describe)("monitorSignalProvider tool results", function () {
    (0, vitest_1.it)("uses bounded readiness checks when auto-starting the daemon", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, abortController;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: (function (code) {
                            throw new Error("exit ".concat(code));
                        }),
                    };
                    config = __assign(__assign({}, config), { channels: __assign(__assign({}, config.channels), { signal: { autoStart: true, dmPolicy: "open", allowFrom: ["*"] } }) });
                    abortController = new AbortController();
                    streamMock.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            abortController.abort();
                            return [2 /*return*/];
                        });
                    }); });
                    return [4 /*yield*/, (0, monitor_js_1.monitorSignalProvider)({
                            autoStart: true,
                            baseUrl: "http://127.0.0.1:8080",
                            abortSignal: abortController.signal,
                            runtime: runtime,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(waitForTransportReadyMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(waitForTransportReadyMock).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        label: "signal daemon",
                        timeoutMs: 30000,
                        logAfterMs: 10000,
                        logIntervalMs: 10000,
                        pollIntervalMs: 150,
                        runtime: runtime,
                        abortSignal: abortController.signal,
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses startupTimeoutMs override when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, abortController;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: (function (code) {
                            throw new Error("exit ".concat(code));
                        }),
                    };
                    config = __assign(__assign({}, config), { channels: __assign(__assign({}, config.channels), { signal: {
                                autoStart: true,
                                dmPolicy: "open",
                                allowFrom: ["*"],
                                startupTimeoutMs: 60000,
                            } }) });
                    abortController = new AbortController();
                    streamMock.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            abortController.abort();
                            return [2 /*return*/];
                        });
                    }); });
                    return [4 /*yield*/, (0, monitor_js_1.monitorSignalProvider)({
                            autoStart: true,
                            baseUrl: "http://127.0.0.1:8080",
                            abortSignal: abortController.signal,
                            runtime: runtime,
                            startupTimeoutMs: 90000,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(waitForTransportReadyMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(waitForTransportReadyMock).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        timeoutMs: 90000,
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("caps startupTimeoutMs at 2 minutes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, abortController;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: (function (code) {
                            throw new Error("exit ".concat(code));
                        }),
                    };
                    config = __assign(__assign({}, config), { channels: __assign(__assign({}, config.channels), { signal: {
                                autoStart: true,
                                dmPolicy: "open",
                                allowFrom: ["*"],
                                startupTimeoutMs: 180000,
                            } }) });
                    abortController = new AbortController();
                    streamMock.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            abortController.abort();
                            return [2 /*return*/];
                        });
                    }); });
                    return [4 /*yield*/, (0, monitor_js_1.monitorSignalProvider)({
                            autoStart: true,
                            baseUrl: "http://127.0.0.1:8080",
                            abortSignal: abortController.signal,
                            runtime: runtime,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(waitForTransportReadyMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(waitForTransportReadyMock).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        timeoutMs: 120000,
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips tool summaries with responsePrefix", function () { return __awaiter(void 0, void 0, void 0, function () {
        var abortController;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    abortController = new AbortController();
                    replyMock.mockResolvedValue({ text: "final reply" });
                    streamMock.mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var payload;
                        var onEvent = _b.onEvent;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    payload = {
                                        envelope: {
                                            sourceNumber: "+15550001111",
                                            sourceName: "Ada",
                                            timestamp: 1,
                                            dataMessage: {
                                                message: "hello",
                                            },
                                        },
                                    };
                                    return [4 /*yield*/, onEvent({
                                            event: "receive",
                                            data: JSON.stringify(payload),
                                        })];
                                case 1:
                                    _c.sent();
                                    abortController.abort();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, monitor_js_1.monitorSignalProvider)({
                            autoStart: false,
                            baseUrl: "http://127.0.0.1:8080",
                            abortSignal: abortController.signal,
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, flush()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendMock.mock.calls[0][1]).toBe("PFX final reply");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("replies with pairing code when dmPolicy is pairing and no allowFrom is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var abortController;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    config = __assign(__assign({}, config), { channels: __assign(__assign({}, config.channels), { signal: __assign(__assign({}, (_a = config.channels) === null || _a === void 0 ? void 0 : _a.signal), { autoStart: false, dmPolicy: "pairing", allowFrom: [] }) }) });
                    abortController = new AbortController();
                    streamMock.mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var payload;
                        var onEvent = _b.onEvent;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    payload = {
                                        envelope: {
                                            sourceNumber: "+15550001111",
                                            sourceName: "Ada",
                                            timestamp: 1,
                                            dataMessage: {
                                                message: "hello",
                                            },
                                        },
                                    };
                                    return [4 /*yield*/, onEvent({
                                            event: "receive",
                                            data: JSON.stringify(payload),
                                        })];
                                case 1:
                                    _c.sent();
                                    abortController.abort();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, monitor_js_1.monitorSignalProvider)({
                            autoStart: false,
                            baseUrl: "http://127.0.0.1:8080",
                            abortSignal: abortController.signal,
                        })];
                case 1:
                    _f.sent();
                    return [4 /*yield*/, flush()];
                case 2:
                    _f.sent();
                    (0, vitest_1.expect)(replyMock).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(upsertPairingRequestMock).toHaveBeenCalled();
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(String((_c = (_b = sendMock.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : "")).toContain("Your Signal number: +15550001111");
                    (0, vitest_1.expect)(String((_e = (_d = sendMock.mock.calls[0]) === null || _d === void 0 ? void 0 : _d[1]) !== null && _e !== void 0 ? _e : "")).toContain("Pairing code: PAIRCODE");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("ignores reaction-only messages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var abortController;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    abortController = new AbortController();
                    streamMock.mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var payload;
                        var onEvent = _b.onEvent;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    payload = {
                                        envelope: {
                                            sourceNumber: "+15550001111",
                                            sourceName: "Ada",
                                            timestamp: 1,
                                            reactionMessage: {
                                                emoji: "👍",
                                                targetAuthor: "+15550002222",
                                                targetSentTimestamp: 2,
                                            },
                                        },
                                    };
                                    return [4 /*yield*/, onEvent({
                                            event: "receive",
                                            data: JSON.stringify(payload),
                                        })];
                                case 1:
                                    _c.sent();
                                    abortController.abort();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, monitor_js_1.monitorSignalProvider)({
                            autoStart: false,
                            baseUrl: "http://127.0.0.1:8080",
                            abortSignal: abortController.signal,
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, flush()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(replyMock).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(sendMock).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(updateLastRouteMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("ignores reaction-only dataMessage.reaction events (don’t treat as broken attachments)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var abortController;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    abortController = new AbortController();
                    streamMock.mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var payload;
                        var onEvent = _b.onEvent;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    payload = {
                                        envelope: {
                                            sourceNumber: "+15550001111",
                                            sourceName: "Ada",
                                            timestamp: 1,
                                            dataMessage: {
                                                reaction: {
                                                    emoji: "👍",
                                                    targetAuthor: "+15550002222",
                                                    targetSentTimestamp: 2,
                                                },
                                                attachments: [{}],
                                            },
                                        },
                                    };
                                    return [4 /*yield*/, onEvent({
                                            event: "receive",
                                            data: JSON.stringify(payload),
                                        })];
                                case 1:
                                    _c.sent();
                                    abortController.abort();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, monitor_js_1.monitorSignalProvider)({
                            autoStart: false,
                            baseUrl: "http://127.0.0.1:8080",
                            abortSignal: abortController.signal,
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, flush()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(replyMock).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(sendMock).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(updateLastRouteMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("enqueues system events for reaction notifications", function () { return __awaiter(void 0, void 0, void 0, function () {
        var abortController, route, events;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    config = __assign(__assign({}, config), { channels: __assign(__assign({}, config.channels), { signal: __assign(__assign({}, (_a = config.channels) === null || _a === void 0 ? void 0 : _a.signal), { autoStart: false, dmPolicy: "open", allowFrom: ["*"], reactionNotifications: "all" }) }) });
                    abortController = new AbortController();
                    streamMock.mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var payload;
                        var onEvent = _b.onEvent;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    payload = {
                                        envelope: {
                                            sourceNumber: "+15550001111",
                                            sourceName: "Ada",
                                            timestamp: 1,
                                            reactionMessage: {
                                                emoji: "✅",
                                                targetAuthor: "+15550002222",
                                                targetSentTimestamp: 2,
                                            },
                                        },
                                    };
                                    return [4 /*yield*/, onEvent({
                                            event: "receive",
                                            data: JSON.stringify(payload),
                                        })];
                                case 1:
                                    _c.sent();
                                    abortController.abort();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, monitor_js_1.monitorSignalProvider)({
                            autoStart: false,
                            baseUrl: "http://127.0.0.1:8080",
                            abortSignal: abortController.signal,
                        })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, flush()];
                case 2:
                    _b.sent();
                    route = (0, resolve_route_js_1.resolveAgentRoute)({
                        cfg: config,
                        channel: "signal",
                        accountId: "default",
                        peer: { kind: "dm", id: (0, utils_js_1.normalizeE164)("+15550001111") },
                    });
                    events = (0, system_events_js_1.peekSystemEvents)(route.sessionKey);
                    (0, vitest_1.expect)(events.some(function (text) { return text.includes("Signal reaction added"); })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("notifies on own reactions when target includes uuid + phone", function () { return __awaiter(void 0, void 0, void 0, function () {
        var abortController, route, events;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    config = __assign(__assign({}, config), { channels: __assign(__assign({}, config.channels), { signal: __assign(__assign({}, (_a = config.channels) === null || _a === void 0 ? void 0 : _a.signal), { autoStart: false, dmPolicy: "open", allowFrom: ["*"], account: "+15550002222", reactionNotifications: "own" }) }) });
                    abortController = new AbortController();
                    streamMock.mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var payload;
                        var onEvent = _b.onEvent;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    payload = {
                                        envelope: {
                                            sourceNumber: "+15550001111",
                                            sourceName: "Ada",
                                            timestamp: 1,
                                            reactionMessage: {
                                                emoji: "✅",
                                                targetAuthor: "+15550002222",
                                                targetAuthorUuid: "123e4567-e89b-12d3-a456-426614174000",
                                                targetSentTimestamp: 2,
                                            },
                                        },
                                    };
                                    return [4 /*yield*/, onEvent({
                                            event: "receive",
                                            data: JSON.stringify(payload),
                                        })];
                                case 1:
                                    _c.sent();
                                    abortController.abort();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, monitor_js_1.monitorSignalProvider)({
                            autoStart: false,
                            baseUrl: "http://127.0.0.1:8080",
                            abortSignal: abortController.signal,
                        })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, flush()];
                case 2:
                    _b.sent();
                    route = (0, resolve_route_js_1.resolveAgentRoute)({
                        cfg: config,
                        channel: "signal",
                        accountId: "default",
                        peer: { kind: "dm", id: (0, utils_js_1.normalizeE164)("+15550001111") },
                    });
                    events = (0, system_events_js_1.peekSystemEvents)(route.sessionKey);
                    (0, vitest_1.expect)(events.some(function (text) { return text.includes("Signal reaction added"); })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("processes messages when reaction metadata is present", function () { return __awaiter(void 0, void 0, void 0, function () {
        var abortController;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    abortController = new AbortController();
                    replyMock.mockResolvedValue({ text: "pong" });
                    streamMock.mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var payload;
                        var onEvent = _b.onEvent;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    payload = {
                                        envelope: {
                                            sourceNumber: "+15550001111",
                                            sourceName: "Ada",
                                            timestamp: 1,
                                            reactionMessage: {
                                                emoji: "👍",
                                                targetAuthor: "+15550002222",
                                                targetSentTimestamp: 2,
                                            },
                                            dataMessage: {
                                                message: "ping",
                                            },
                                        },
                                    };
                                    return [4 /*yield*/, onEvent({
                                            event: "receive",
                                            data: JSON.stringify(payload),
                                        })];
                                case 1:
                                    _c.sent();
                                    abortController.abort();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, monitor_js_1.monitorSignalProvider)({
                            autoStart: false,
                            baseUrl: "http://127.0.0.1:8080",
                            abortSignal: abortController.signal,
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, flush()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(updateLastRouteMock).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not resend pairing code when a request is already pending", function () { return __awaiter(void 0, void 0, void 0, function () {
        var abortController;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    config = __assign(__assign({}, config), { channels: __assign(__assign({}, config.channels), { signal: __assign(__assign({}, (_a = config.channels) === null || _a === void 0 ? void 0 : _a.signal), { autoStart: false, dmPolicy: "pairing", allowFrom: [] }) }) });
                    abortController = new AbortController();
                    upsertPairingRequestMock
                        .mockResolvedValueOnce({ code: "PAIRCODE", created: true })
                        .mockResolvedValueOnce({ code: "PAIRCODE", created: false });
                    streamMock.mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var payload;
                        var onEvent = _b.onEvent;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    payload = {
                                        envelope: {
                                            sourceNumber: "+15550001111",
                                            sourceName: "Ada",
                                            timestamp: 1,
                                            dataMessage: {
                                                message: "hello",
                                            },
                                        },
                                    };
                                    return [4 /*yield*/, onEvent({
                                            event: "receive",
                                            data: JSON.stringify(payload),
                                        })];
                                case 1:
                                    _c.sent();
                                    return [4 /*yield*/, onEvent({
                                            event: "receive",
                                            data: JSON.stringify(__assign(__assign({}, payload), { envelope: __assign(__assign({}, payload.envelope), { timestamp: 2 }) })),
                                        })];
                                case 2:
                                    _c.sent();
                                    abortController.abort();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, monitor_js_1.monitorSignalProvider)({
                            autoStart: false,
                            baseUrl: "http://127.0.0.1:8080",
                            abortSignal: abortController.signal,
                        })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, flush()];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
