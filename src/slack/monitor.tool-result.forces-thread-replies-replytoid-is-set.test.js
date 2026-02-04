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
var monitor_test_helpers_js_1 = require("./monitor.test-helpers.js");
var monitorSlackProvider = (await Promise.resolve().then(function () { return require("./monitor.js"); })).monitorSlackProvider;
var slackTestState = (0, monitor_test_helpers_js_1.getSlackTestState)();
var sendMock = slackTestState.sendMock, replyMock = slackTestState.replyMock, reactMock = slackTestState.reactMock, upsertPairingRequestMock = slackTestState.upsertPairingRequestMock;
(0, vitest_1.beforeEach)(function () {
    (0, inbound_dedupe_js_1.resetInboundDedupe)();
    (0, monitor_test_helpers_js_1.resetSlackTestState)((0, monitor_test_helpers_js_1.defaultSlackTestConfig)());
});
(0, vitest_1.describe)("monitorSlackProvider tool results", function () {
    (0, vitest_1.it)("forces thread replies when replyToId is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, run, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    replyMock.mockResolvedValue({ text: "forced reply", replyToId: "555" });
                    slackTestState.config = {
                        messages: {
                            responsePrefix: "PFX",
                            ackReaction: "👀",
                            ackReactionScope: "group-mentions",
                        },
                        channels: {
                            slack: {
                                dm: { enabled: true, policy: "open", allowFrom: ["*"] },
                                replyToMode: "off",
                            },
                        },
                    };
                    controller = new AbortController();
                    run = monitorSlackProvider({
                        botToken: "bot-token",
                        appToken: "app-token",
                        abortSignal: controller.signal,
                    });
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.waitForSlackEvent)("message")];
                case 1:
                    _b.sent();
                    handler = (_a = (0, monitor_test_helpers_js_1.getSlackHandlers)()) === null || _a === void 0 ? void 0 : _a.get("message");
                    if (!handler) {
                        throw new Error("Slack message handler not registered");
                    }
                    return [4 /*yield*/, handler({
                            event: {
                                type: "message",
                                user: "U1",
                                text: "hello",
                                ts: "789",
                                channel: "C1",
                                channel_type: "im",
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.flush)()];
                case 3:
                    _b.sent();
                    controller.abort();
                    return [4 /*yield*/, run];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendMock.mock.calls[0][2]).toMatchObject({ threadTs: "555" });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reacts to mention-gated room messages when ackReaction is enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var client, conversations, controller, run, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    replyMock.mockResolvedValue(undefined);
                    client = (0, monitor_test_helpers_js_1.getSlackClient)();
                    if (!client) {
                        throw new Error("Slack client not registered");
                    }
                    conversations = client.conversations;
                    conversations.info.mockResolvedValueOnce({
                        channel: { name: "general", is_channel: true },
                    });
                    controller = new AbortController();
                    run = monitorSlackProvider({
                        botToken: "bot-token",
                        appToken: "app-token",
                        abortSignal: controller.signal,
                    });
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.waitForSlackEvent)("message")];
                case 1:
                    _b.sent();
                    handler = (_a = (0, monitor_test_helpers_js_1.getSlackHandlers)()) === null || _a === void 0 ? void 0 : _a.get("message");
                    if (!handler) {
                        throw new Error("Slack message handler not registered");
                    }
                    return [4 /*yield*/, handler({
                            event: {
                                type: "message",
                                user: "U1",
                                text: "<@bot-user> hello",
                                ts: "456",
                                channel: "C1",
                                channel_type: "channel",
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.flush)()];
                case 3:
                    _b.sent();
                    controller.abort();
                    return [4 /*yield*/, run];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(reactMock).toHaveBeenCalledWith({
                        channel: "C1",
                        timestamp: "456",
                        name: "👀",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("replies with pairing code when dmPolicy is pairing and no allowFrom is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, run, handler;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    slackTestState.config = __assign(__assign({}, slackTestState.config), { channels: __assign(__assign({}, slackTestState.config.channels), { slack: __assign(__assign({}, (_a = slackTestState.config.channels) === null || _a === void 0 ? void 0 : _a.slack), { dm: { enabled: true, policy: "pairing", allowFrom: [] } }) }) });
                    controller = new AbortController();
                    run = monitorSlackProvider({
                        botToken: "bot-token",
                        appToken: "app-token",
                        abortSignal: controller.signal,
                    });
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.waitForSlackEvent)("message")];
                case 1:
                    _g.sent();
                    handler = (_b = (0, monitor_test_helpers_js_1.getSlackHandlers)()) === null || _b === void 0 ? void 0 : _b.get("message");
                    if (!handler) {
                        throw new Error("Slack message handler not registered");
                    }
                    return [4 /*yield*/, handler({
                            event: {
                                type: "message",
                                user: "U1",
                                text: "hello",
                                ts: "123",
                                channel: "C1",
                                channel_type: "im",
                            },
                        })];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.flush)()];
                case 3:
                    _g.sent();
                    controller.abort();
                    return [4 /*yield*/, run];
                case 4:
                    _g.sent();
                    (0, vitest_1.expect)(replyMock).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(upsertPairingRequestMock).toHaveBeenCalled();
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(String((_d = (_c = sendMock.mock.calls[0]) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : "")).toContain("Your Slack user id: U1");
                    (0, vitest_1.expect)(String((_f = (_e = sendMock.mock.calls[0]) === null || _e === void 0 ? void 0 : _e[1]) !== null && _f !== void 0 ? _f : "")).toContain("Pairing code: PAIRCODE");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not resend pairing code when a request is already pending", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, run, handler, baseEvent;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    slackTestState.config = __assign(__assign({}, slackTestState.config), { channels: __assign(__assign({}, slackTestState.config.channels), { slack: __assign(__assign({}, (_a = slackTestState.config.channels) === null || _a === void 0 ? void 0 : _a.slack), { dm: { enabled: true, policy: "pairing", allowFrom: [] } }) }) });
                    upsertPairingRequestMock
                        .mockResolvedValueOnce({ code: "PAIRCODE", created: true })
                        .mockResolvedValueOnce({ code: "PAIRCODE", created: false });
                    controller = new AbortController();
                    run = monitorSlackProvider({
                        botToken: "bot-token",
                        appToken: "app-token",
                        abortSignal: controller.signal,
                    });
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.waitForSlackEvent)("message")];
                case 1:
                    _c.sent();
                    handler = (_b = (0, monitor_test_helpers_js_1.getSlackHandlers)()) === null || _b === void 0 ? void 0 : _b.get("message");
                    if (!handler) {
                        throw new Error("Slack message handler not registered");
                    }
                    baseEvent = {
                        type: "message",
                        user: "U1",
                        text: "hello",
                        ts: "123",
                        channel: "C1",
                        channel_type: "im",
                    };
                    return [4 /*yield*/, handler({ event: baseEvent })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, handler({ event: __assign(__assign({}, baseEvent), { ts: "124", text: "hello again" }) })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.flush)()];
                case 4:
                    _c.sent();
                    controller.abort();
                    return [4 /*yield*/, run];
                case 5:
                    _c.sent();
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
