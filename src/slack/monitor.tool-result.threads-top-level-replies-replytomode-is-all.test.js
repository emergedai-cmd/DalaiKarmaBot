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
var inbound_dedupe_js_1 = require("../auto-reply/reply/inbound-dedupe.js");
var monitor_test_helpers_js_1 = require("./monitor.test-helpers.js");
var monitorSlackProvider = (await Promise.resolve().then(function () { return require("./monitor.js"); })).monitorSlackProvider;
var slackTestState = (0, monitor_test_helpers_js_1.getSlackTestState)();
var sendMock = slackTestState.sendMock, replyMock = slackTestState.replyMock;
(0, vitest_1.beforeEach)(function () {
    (0, inbound_dedupe_js_1.resetInboundDedupe)();
    (0, monitor_test_helpers_js_1.resetSlackTestState)((0, monitor_test_helpers_js_1.defaultSlackTestConfig)());
});
(0, vitest_1.describe)("monitorSlackProvider tool results", function () {
    (0, vitest_1.it)("threads top-level replies when replyToMode is all", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, run, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    replyMock.mockResolvedValue({ text: "thread reply" });
                    slackTestState.config = {
                        messages: {
                            responsePrefix: "PFX",
                            ackReaction: "👀",
                            ackReactionScope: "group-mentions",
                        },
                        channels: {
                            slack: {
                                dm: { enabled: true, policy: "open", allowFrom: ["*"] },
                                replyToMode: "all",
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
                                ts: "123",
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
                    (0, vitest_1.expect)(sendMock.mock.calls[0][2]).toMatchObject({ threadTs: "123" });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats parent_user_id as a thread reply even when thread_ts matches ts", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, run, handler, ctx;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    replyMock.mockResolvedValue({ text: "thread reply" });
                    controller = new AbortController();
                    run = monitorSlackProvider({
                        botToken: "bot-token",
                        appToken: "app-token",
                        abortSignal: controller.signal,
                    });
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.waitForSlackEvent)("message")];
                case 1:
                    _c.sent();
                    handler = (_a = (0, monitor_test_helpers_js_1.getSlackHandlers)()) === null || _a === void 0 ? void 0 : _a.get("message");
                    if (!handler) {
                        throw new Error("Slack message handler not registered");
                    }
                    return [4 /*yield*/, handler({
                            event: {
                                type: "message",
                                user: "U1",
                                text: "hello",
                                ts: "123",
                                thread_ts: "123",
                                parent_user_id: "U2",
                                channel: "C1",
                                channel_type: "im",
                            },
                        })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.flush)()];
                case 3:
                    _c.sent();
                    controller.abort();
                    return [4 /*yield*/, run];
                case 4:
                    _c.sent();
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalledTimes(1);
                    ctx = (_b = replyMock.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[0];
                    (0, vitest_1.expect)(ctx.SessionKey).toBe("agent:main:main:thread:123");
                    (0, vitest_1.expect)(ctx.ParentSessionKey).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps thread parent inheritance opt-in", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, run, handler, ctx;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    replyMock.mockResolvedValue({ text: "thread reply" });
                    slackTestState.config = {
                        messages: { responsePrefix: "PFX" },
                        channels: {
                            slack: {
                                dm: { enabled: true, policy: "open", allowFrom: ["*"] },
                                channels: { C1: { allow: true, requireMention: false } },
                                thread: { inheritParent: true },
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
                    _c.sent();
                    handler = (_a = (0, monitor_test_helpers_js_1.getSlackHandlers)()) === null || _a === void 0 ? void 0 : _a.get("message");
                    if (!handler) {
                        throw new Error("Slack message handler not registered");
                    }
                    return [4 /*yield*/, handler({
                            event: {
                                type: "message",
                                user: "U1",
                                text: "hello",
                                ts: "123",
                                thread_ts: "111.222",
                                channel: "C1",
                                channel_type: "channel",
                            },
                        })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.flush)()];
                case 3:
                    _c.sent();
                    controller.abort();
                    return [4 /*yield*/, run];
                case 4:
                    _c.sent();
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalledTimes(1);
                    ctx = (_b = replyMock.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[0];
                    (0, vitest_1.expect)(ctx.SessionKey).toBe("agent:main:slack:channel:c1:thread:111.222");
                    (0, vitest_1.expect)(ctx.ParentSessionKey).toBe("agent:main:slack:channel:c1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("injects starter context for thread replies", function () { return __awaiter(void 0, void 0, void 0, function () {
        var client, controller, run, handler, ctx;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    replyMock.mockResolvedValue({ text: "ok" });
                    client = (0, monitor_test_helpers_js_1.getSlackClient)();
                    if ((_a = client === null || client === void 0 ? void 0 : client.conversations) === null || _a === void 0 ? void 0 : _a.info) {
                        client.conversations.info.mockResolvedValue({
                            channel: { name: "general", is_channel: true },
                        });
                    }
                    if ((_b = client === null || client === void 0 ? void 0 : client.conversations) === null || _b === void 0 ? void 0 : _b.replies) {
                        client.conversations.replies.mockResolvedValue({
                            messages: [{ text: "starter message", user: "U2", ts: "111.222" }],
                        });
                    }
                    slackTestState.config = {
                        messages: { responsePrefix: "PFX" },
                        channels: {
                            slack: {
                                dm: { enabled: true, policy: "open", allowFrom: ["*"] },
                                channels: { C1: { allow: true, requireMention: false } },
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
                    _e.sent();
                    handler = (_c = (0, monitor_test_helpers_js_1.getSlackHandlers)()) === null || _c === void 0 ? void 0 : _c.get("message");
                    if (!handler) {
                        throw new Error("Slack message handler not registered");
                    }
                    return [4 /*yield*/, handler({
                            event: {
                                type: "message",
                                user: "U1",
                                text: "thread reply",
                                ts: "123.456",
                                thread_ts: "111.222",
                                channel: "C1",
                                channel_type: "channel",
                            },
                        })];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.flush)()];
                case 3:
                    _e.sent();
                    controller.abort();
                    return [4 /*yield*/, run];
                case 4:
                    _e.sent();
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalledTimes(1);
                    ctx = (_d = replyMock.mock.calls[0]) === null || _d === void 0 ? void 0 : _d[0];
                    (0, vitest_1.expect)(ctx.SessionKey).toBe("agent:main:slack:channel:c1:thread:111.222");
                    (0, vitest_1.expect)(ctx.ParentSessionKey).toBeUndefined();
                    (0, vitest_1.expect)(ctx.ThreadStarterBody).toContain("starter message");
                    (0, vitest_1.expect)(ctx.ThreadLabel).toContain("Slack thread #general");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("scopes thread session keys to the routed agent", function () { return __awaiter(void 0, void 0, void 0, function () {
        var client, controller, run, handler, ctx;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    replyMock.mockResolvedValue({ text: "ok" });
                    slackTestState.config = {
                        messages: { responsePrefix: "PFX" },
                        channels: {
                            slack: {
                                dm: { enabled: true, policy: "open", allowFrom: ["*"] },
                                channels: { C1: { allow: true, requireMention: false } },
                            },
                        },
                        bindings: [{ agentId: "support", match: { channel: "slack", teamId: "T1" } }],
                    };
                    client = (0, monitor_test_helpers_js_1.getSlackClient)();
                    if ((_a = client === null || client === void 0 ? void 0 : client.auth) === null || _a === void 0 ? void 0 : _a.test) {
                        client.auth.test.mockResolvedValue({
                            user_id: "bot-user",
                            team_id: "T1",
                        });
                    }
                    if ((_b = client === null || client === void 0 ? void 0 : client.conversations) === null || _b === void 0 ? void 0 : _b.info) {
                        client.conversations.info.mockResolvedValue({
                            channel: { name: "general", is_channel: true },
                        });
                    }
                    controller = new AbortController();
                    run = monitorSlackProvider({
                        botToken: "bot-token",
                        appToken: "app-token",
                        abortSignal: controller.signal,
                    });
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.waitForSlackEvent)("message")];
                case 1:
                    _e.sent();
                    handler = (_c = (0, monitor_test_helpers_js_1.getSlackHandlers)()) === null || _c === void 0 ? void 0 : _c.get("message");
                    if (!handler) {
                        throw new Error("Slack message handler not registered");
                    }
                    return [4 /*yield*/, handler({
                            event: {
                                type: "message",
                                user: "U1",
                                text: "thread reply",
                                ts: "123.456",
                                thread_ts: "111.222",
                                channel: "C1",
                                channel_type: "channel",
                            },
                        })];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.flush)()];
                case 3:
                    _e.sent();
                    controller.abort();
                    return [4 /*yield*/, run];
                case 4:
                    _e.sent();
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalledTimes(1);
                    ctx = (_d = replyMock.mock.calls[0]) === null || _d === void 0 ? void 0 : _d[0];
                    (0, vitest_1.expect)(ctx.SessionKey).toBe("agent:support:slack:channel:c1:thread:111.222");
                    (0, vitest_1.expect)(ctx.ParentSessionKey).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps replies in channel root when message is not threaded (replyToMode off)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, run, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    replyMock.mockResolvedValue({ text: "root reply" });
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
                    (0, vitest_1.expect)(sendMock.mock.calls[0][2]).toMatchObject({ threadTs: undefined });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("threads first reply when replyToMode is first and message is not threaded", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, run, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    replyMock.mockResolvedValue({ text: "first reply" });
                    slackTestState.config = {
                        messages: {
                            responsePrefix: "PFX",
                            ackReaction: "👀",
                            ackReactionScope: "group-mentions",
                        },
                        channels: {
                            slack: {
                                dm: { enabled: true, policy: "open", allowFrom: ["*"] },
                                replyToMode: "first",
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
                    // First reply starts a thread under the incoming message
                    (0, vitest_1.expect)(sendMock.mock.calls[0][2]).toMatchObject({ threadTs: "789" });
                    return [2 /*return*/];
            }
        });
    }); });
});
