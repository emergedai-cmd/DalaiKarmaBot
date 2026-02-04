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
var _a = vitest_1.vi.hoisted(function () { return ({
    buildLineMessageContextMock: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    ctxPayload: { From: "line:group:group-1" },
                    replyToken: "reply-token",
                    route: { agentId: "default" },
                    isGroup: true,
                    accountId: "default",
                })];
        });
    }); }),
    buildLinePostbackContextMock: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, null];
    }); }); }),
}); }), buildLineMessageContextMock = _a.buildLineMessageContextMock, buildLinePostbackContextMock = _a.buildLinePostbackContextMock;
vitest_1.vi.mock("./bot-message-context.js", function () { return ({
    buildLineMessageContext: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return buildLineMessageContextMock.apply(void 0, args);
    },
    buildLinePostbackContext: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return buildLinePostbackContextMock.apply(void 0, args);
    },
}); });
var _b = vitest_1.vi.hoisted(function () { return ({
    readAllowFromStoreMock: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, []];
    }); }); }),
    upsertPairingRequestMock: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ code: "CODE", created: true })];
    }); }); }),
}); }), readAllowFromStoreMock = _b.readAllowFromStoreMock, upsertPairingRequestMock = _b.upsertPairingRequestMock;
var handleLineWebhookEvents;
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
(0, vitest_1.describe)("handleLineWebhookEvents", function () {
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./bot-handlers.js"); })];
                case 1:
                    (handleLineWebhookEvents = (_a.sent()).handleLineWebhookEvents);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.beforeEach)(function () {
        buildLineMessageContextMock.mockClear();
        buildLinePostbackContextMock.mockClear();
        readAllowFromStoreMock.mockClear();
        upsertPairingRequestMock.mockClear();
    });
    (0, vitest_1.it)("blocks group messages when groupPolicy is disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var processMessage, event;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    processMessage = vitest_1.vi.fn();
                    event = {
                        type: "message",
                        message: { id: "m1", type: "text", text: "hi" },
                        replyToken: "reply-token",
                        timestamp: Date.now(),
                        source: { type: "group", groupId: "group-1", userId: "user-1" },
                        mode: "active",
                        webhookEventId: "evt-1",
                        deliveryContext: { isRedelivery: false },
                    };
                    return [4 /*yield*/, handleLineWebhookEvents([event], {
                            cfg: { channels: { line: { groupPolicy: "disabled" } } },
                            account: {
                                accountId: "default",
                                enabled: true,
                                channelAccessToken: "token",
                                channelSecret: "secret",
                                tokenSource: "config",
                                config: { groupPolicy: "disabled" },
                            },
                            runtime: { error: vitest_1.vi.fn() },
                            mediaMaxBytes: 1,
                            processMessage: processMessage,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(processMessage).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(buildLineMessageContextMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks group messages when allowlist is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
        var processMessage, event;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    processMessage = vitest_1.vi.fn();
                    event = {
                        type: "message",
                        message: { id: "m2", type: "text", text: "hi" },
                        replyToken: "reply-token",
                        timestamp: Date.now(),
                        source: { type: "group", groupId: "group-1", userId: "user-2" },
                        mode: "active",
                        webhookEventId: "evt-2",
                        deliveryContext: { isRedelivery: false },
                    };
                    return [4 /*yield*/, handleLineWebhookEvents([event], {
                            cfg: { channels: { line: { groupPolicy: "allowlist" } } },
                            account: {
                                accountId: "default",
                                enabled: true,
                                channelAccessToken: "token",
                                channelSecret: "secret",
                                tokenSource: "config",
                                config: { groupPolicy: "allowlist" },
                            },
                            runtime: { error: vitest_1.vi.fn() },
                            mediaMaxBytes: 1,
                            processMessage: processMessage,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(processMessage).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(buildLineMessageContextMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows group messages when sender is in groupAllowFrom", function () { return __awaiter(void 0, void 0, void 0, function () {
        var processMessage, event;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    processMessage = vitest_1.vi.fn();
                    event = {
                        type: "message",
                        message: { id: "m3", type: "text", text: "hi" },
                        replyToken: "reply-token",
                        timestamp: Date.now(),
                        source: { type: "group", groupId: "group-1", userId: "user-3" },
                        mode: "active",
                        webhookEventId: "evt-3",
                        deliveryContext: { isRedelivery: false },
                    };
                    return [4 /*yield*/, handleLineWebhookEvents([event], {
                            cfg: {
                                channels: { line: { groupPolicy: "allowlist", groupAllowFrom: ["user-3"] } },
                            },
                            account: {
                                accountId: "default",
                                enabled: true,
                                channelAccessToken: "token",
                                channelSecret: "secret",
                                tokenSource: "config",
                                config: { groupPolicy: "allowlist", groupAllowFrom: ["user-3"] },
                            },
                            runtime: { error: vitest_1.vi.fn() },
                            mediaMaxBytes: 1,
                            processMessage: processMessage,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(buildLineMessageContextMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(processMessage).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks group messages when wildcard group config disables groups", function () { return __awaiter(void 0, void 0, void 0, function () {
        var processMessage, event;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    processMessage = vitest_1.vi.fn();
                    event = {
                        type: "message",
                        message: { id: "m4", type: "text", text: "hi" },
                        replyToken: "reply-token",
                        timestamp: Date.now(),
                        source: { type: "group", groupId: "group-2", userId: "user-4" },
                        mode: "active",
                        webhookEventId: "evt-4",
                        deliveryContext: { isRedelivery: false },
                    };
                    return [4 /*yield*/, handleLineWebhookEvents([event], {
                            cfg: { channels: { line: { groupPolicy: "open" } } },
                            account: {
                                accountId: "default",
                                enabled: true,
                                channelAccessToken: "token",
                                channelSecret: "secret",
                                tokenSource: "config",
                                config: { groupPolicy: "open", groups: { "*": { enabled: false } } },
                            },
                            runtime: { error: vitest_1.vi.fn() },
                            mediaMaxBytes: 1,
                            processMessage: processMessage,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(processMessage).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(buildLineMessageContextMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
