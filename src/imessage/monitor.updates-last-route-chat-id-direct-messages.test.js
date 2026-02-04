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
var monitor_js_1 = require("./monitor.js");
var requestMock = vitest_1.vi.fn();
var stopMock = vitest_1.vi.fn();
var sendMock = vitest_1.vi.fn();
var replyMock = vitest_1.vi.fn();
var updateLastRouteMock = vitest_1.vi.fn();
var readAllowFromStoreMock = vitest_1.vi.fn();
var upsertPairingRequestMock = vitest_1.vi.fn();
var config = {};
var notificationHandler;
var closeResolve;
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
    sendMessageIMessage: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return sendMock.apply(void 0, args);
    },
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
vitest_1.vi.mock("./client.js", function () { return ({
    createIMessageRpcClient: vitest_1.vi.fn(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            notificationHandler = opts.onNotification;
            return [2 /*return*/, {
                    request: function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return requestMock.apply(void 0, args);
                    },
                    waitForClose: function () {
                        return new Promise(function (resolve) {
                            closeResolve = resolve;
                        });
                    },
                    stop: function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return stopMock.apply(void 0, args);
                    },
                }];
        });
    }); }),
}); });
vitest_1.vi.mock("./probe.js", function () { return ({
    probeIMessage: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ ok: true })];
    }); }); }),
}); });
var flush = function () { return new Promise(function (resolve) { return setTimeout(resolve, 0); }); };
function waitForSubscribe() {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 5)) return [3 /*break*/, 4];
                    if (requestMock.mock.calls.some(function (call) { return call[0] === "watch.subscribe"; })) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, flush()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i += 1;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
(0, vitest_1.beforeEach)(function () {
    config = {
        channels: {
            imessage: {
                dmPolicy: "open",
                allowFrom: ["*"],
                groups: { "*": { requireMention: true } },
            },
        },
        session: { mainKey: "main" },
        messages: {
            groupChat: { mentionPatterns: ["@openclaw"] },
        },
    };
    requestMock.mockReset().mockImplementation(function (method) {
        if (method === "watch.subscribe") {
            return Promise.resolve({ subscription: 1 });
        }
        return Promise.resolve({});
    });
    stopMock.mockReset().mockResolvedValue(undefined);
    sendMock.mockReset().mockResolvedValue({ messageId: "ok" });
    replyMock.mockReset().mockResolvedValue({ text: "ok" });
    updateLastRouteMock.mockReset();
    readAllowFromStoreMock.mockReset().mockResolvedValue([]);
    upsertPairingRequestMock.mockReset().mockResolvedValue({ code: "PAIRCODE", created: true });
    notificationHandler = undefined;
    closeResolve = undefined;
});
(0, vitest_1.describe)("monitorIMessageProvider", function () {
    (0, vitest_1.it)("updates last route with sender handle for direct messages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var run;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    replyMock.mockResolvedValueOnce({ text: "ok" });
                    run = (0, monitor_js_1.monitorIMessageProvider)();
                    return [4 /*yield*/, waitForSubscribe()];
                case 1:
                    _a.sent();
                    notificationHandler === null || notificationHandler === void 0 ? void 0 : notificationHandler({
                        method: "message",
                        params: {
                            message: {
                                id: 4,
                                chat_id: 7,
                                sender: "+15550004444",
                                is_from_me: false,
                                text: "hey",
                                is_group: false,
                            },
                        },
                    });
                    return [4 /*yield*/, flush()];
                case 2:
                    _a.sent();
                    closeResolve === null || closeResolve === void 0 ? void 0 : closeResolve();
                    return [4 /*yield*/, run];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(updateLastRouteMock).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        deliveryContext: vitest_1.expect.objectContaining({
                            channel: "imessage",
                            to: "+15550004444",
                        }),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not trigger unhandledRejection when aborting during shutdown", function () { return __awaiter(void 0, void 0, void 0, function () {
        var abortController, unhandled, onUnhandled, run;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestMock.mockImplementation(function (method) {
                        if (method === "watch.subscribe") {
                            return Promise.resolve({ subscription: 1 });
                        }
                        if (method === "watch.unsubscribe") {
                            return Promise.reject(new Error("imsg rpc closed"));
                        }
                        return Promise.resolve({});
                    });
                    abortController = new AbortController();
                    unhandled = [];
                    onUnhandled = function (reason) {
                        unhandled.push(reason);
                    };
                    process.on("unhandledRejection", onUnhandled);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 6, 7]);
                    run = (0, monitor_js_1.monitorIMessageProvider)({
                        abortSignal: abortController.signal,
                    });
                    return [4 /*yield*/, waitForSubscribe()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, flush()];
                case 3:
                    _a.sent();
                    abortController.abort();
                    return [4 /*yield*/, flush()];
                case 4:
                    _a.sent();
                    closeResolve === null || closeResolve === void 0 ? void 0 : closeResolve();
                    return [4 /*yield*/, run];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    process.off("unhandledRejection", onUnhandled);
                    return [7 /*endfinally*/];
                case 7:
                    (0, vitest_1.expect)(unhandled).toHaveLength(0);
                    (0, vitest_1.expect)(stopMock).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
