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
var history_js_1 = require("../auto-reply/reply/history.js");
var inbound_dedupe_js_1 = require("../auto-reply/reply/inbound-dedupe.js");
var mentions_js_1 = require("../auto-reply/reply/mentions.js");
var monitor_test_helpers_js_1 = require("./monitor.test-helpers.js");
var monitorSlackProvider = (await Promise.resolve().then(function () { return require("./monitor.js"); })).monitorSlackProvider;
var slackTestState = (0, monitor_test_helpers_js_1.getSlackTestState)();
var sendMock = slackTestState.sendMock, replyMock = slackTestState.replyMock;
(0, vitest_1.beforeEach)(function () {
    (0, inbound_dedupe_js_1.resetInboundDedupe)();
    (0, monitor_test_helpers_js_1.resetSlackTestState)((0, monitor_test_helpers_js_1.defaultSlackTestConfig)());
});
(0, vitest_1.describe)("monitorSlackProvider tool results", function () {
    (0, vitest_1.it)("skips tool summaries with responsePrefix", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, run, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    replyMock.mockResolvedValue({ text: "final reply" });
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
                    (0, vitest_1.expect)(sendMock.mock.calls[0][1]).toBe("PFX final reply");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("drops events with mismatched api_app_id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var client, controller, run, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    client = (0, monitor_test_helpers_js_1.getSlackClient)();
                    if (!client) {
                        throw new Error("Slack client not registered");
                    }
                    client.auth.test.mockResolvedValue({
                        user_id: "bot-user",
                        team_id: "T1",
                        api_app_id: "A1",
                    });
                    controller = new AbortController();
                    run = monitorSlackProvider({
                        botToken: "bot-token",
                        appToken: "xapp-1-A1-abc",
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
                            body: { api_app_id: "A2", team_id: "T1" },
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
                    (0, vitest_1.expect)(sendMock).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(replyMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not derive responsePrefix from routed agent identity when unset", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, run, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    slackTestState.config = {
                        agents: {
                            list: [
                                {
                                    id: "main",
                                    default: true,
                                    identity: { name: "Mainbot", theme: "space lobster", emoji: "🦞" },
                                },
                                {
                                    id: "rich",
                                    identity: { name: "Richbot", theme: "lion bot", emoji: "🦁" },
                                },
                            ],
                        },
                        bindings: [
                            {
                                agentId: "rich",
                                match: { channel: "slack", peer: { kind: "dm", id: "U1" } },
                            },
                        ],
                        messages: {
                            ackReaction: "👀",
                            ackReactionScope: "group-mentions",
                        },
                        channels: {
                            slack: { dm: { enabled: true, policy: "open", allowFrom: ["*"] } },
                        },
                    };
                    replyMock.mockResolvedValue({ text: "final reply" });
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
                    (0, vitest_1.expect)(sendMock.mock.calls[0][1]).toBe("final reply");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("preserves RawBody without injecting processed room history", function () { return __awaiter(void 0, void 0, void 0, function () {
        var capturedCtx, controller, run, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    slackTestState.config = {
                        messages: { ackReactionScope: "group-mentions" },
                        channels: {
                            slack: {
                                historyLimit: 5,
                                dm: { enabled: true, policy: "open", allowFrom: ["*"] },
                                channels: { "*": { requireMention: false } },
                            },
                        },
                    };
                    capturedCtx = {};
                    replyMock.mockImplementation(function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedCtx = ctx !== null && ctx !== void 0 ? ctx : {};
                            return [2 /*return*/, undefined];
                        });
                    }); });
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
                                text: "first",
                                ts: "123",
                                channel: "C1",
                                channel_type: "channel",
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, handler({
                            event: {
                                type: "message",
                                user: "U2",
                                text: "second",
                                ts: "124",
                                channel: "C1",
                                channel_type: "channel",
                            },
                        })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.flush)()];
                case 4:
                    _b.sent();
                    controller.abort();
                    return [4 /*yield*/, run];
                case 5:
                    _b.sent();
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(capturedCtx.Body).not.toContain(history_js_1.HISTORY_CONTEXT_MARKER);
                    (0, vitest_1.expect)(capturedCtx.Body).not.toContain(mentions_js_1.CURRENT_MESSAGE_MARKER);
                    (0, vitest_1.expect)(capturedCtx.Body).not.toContain("first");
                    (0, vitest_1.expect)(capturedCtx.RawBody).toBe("second");
                    (0, vitest_1.expect)(capturedCtx.CommandBody).toBe("second");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("scopes thread history to the thread by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var capturedCtx, controller, run, handler;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    slackTestState.config = {
                        messages: { ackReactionScope: "group-mentions" },
                        channels: {
                            slack: {
                                historyLimit: 5,
                                dm: { enabled: true, policy: "open", allowFrom: ["*"] },
                                channels: { C1: { allow: true, requireMention: true } },
                            },
                        },
                    };
                    capturedCtx = [];
                    replyMock.mockImplementation(function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedCtx.push(ctx !== null && ctx !== void 0 ? ctx : {});
                            return [2 /*return*/, undefined];
                        });
                    }); });
                    controller = new AbortController();
                    run = monitorSlackProvider({
                        botToken: "bot-token",
                        appToken: "app-token",
                        abortSignal: controller.signal,
                    });
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.waitForSlackEvent)("message")];
                case 1:
                    _e.sent();
                    handler = (_a = (0, monitor_test_helpers_js_1.getSlackHandlers)()) === null || _a === void 0 ? void 0 : _a.get("message");
                    if (!handler) {
                        throw new Error("Slack message handler not registered");
                    }
                    return [4 /*yield*/, handler({
                            event: {
                                type: "message",
                                user: "U1",
                                text: "thread-a-one",
                                ts: "200",
                                thread_ts: "100",
                                channel: "C1",
                                channel_type: "channel",
                            },
                        })];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, handler({
                            event: {
                                type: "message",
                                user: "U1",
                                text: "<@bot-user> thread-a-two",
                                ts: "201",
                                thread_ts: "100",
                                channel: "C1",
                                channel_type: "channel",
                            },
                        })];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, handler({
                            event: {
                                type: "message",
                                user: "U2",
                                text: "<@bot-user> thread-b-one",
                                ts: "301",
                                thread_ts: "300",
                                channel: "C1",
                                channel_type: "channel",
                            },
                        })];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.flush)()];
                case 5:
                    _e.sent();
                    controller.abort();
                    return [4 /*yield*/, run];
                case 6:
                    _e.sent();
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)((_b = capturedCtx[0]) === null || _b === void 0 ? void 0 : _b.Body).toContain("thread-a-one");
                    (0, vitest_1.expect)((_c = capturedCtx[1]) === null || _c === void 0 ? void 0 : _c.Body).not.toContain("thread-a-one");
                    (0, vitest_1.expect)((_d = capturedCtx[1]) === null || _d === void 0 ? void 0 : _d.Body).not.toContain("thread-a-two");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updates assistant thread status when replies start", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, run, handler, client, setStatus;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    replyMock.mockImplementation(function (_ctx, opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, ((_a = opts === null || opts === void 0 ? void 0 : opts.onReplyStart) === null || _a === void 0 ? void 0 : _a.call(opts))];
                                case 1:
                                    _b.sent();
                                    return [2 /*return*/, { text: "final reply" }];
                            }
                        });
                    }); });
                    controller = new AbortController();
                    run = monitorSlackProvider({
                        botToken: "bot-token",
                        appToken: "app-token",
                        abortSignal: controller.signal,
                    });
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.waitForSlackEvent)("message")];
                case 1:
                    _d.sent();
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
                    _d.sent();
                    return [4 /*yield*/, (0, monitor_test_helpers_js_1.flush)()];
                case 3:
                    _d.sent();
                    controller.abort();
                    return [4 /*yield*/, run];
                case 4:
                    _d.sent();
                    client = (0, monitor_test_helpers_js_1.getSlackClient)();
                    setStatus = (_c = (_b = client.assistant) === null || _b === void 0 ? void 0 : _b.threads) === null || _c === void 0 ? void 0 : _c.setStatus;
                    (0, vitest_1.expect)(setStatus).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(setStatus).toHaveBeenNthCalledWith(1, {
                        token: "bot-token",
                        channel_id: "C1",
                        thread_ts: "123",
                        status: "is typing...",
                    });
                    (0, vitest_1.expect)(setStatus).toHaveBeenNthCalledWith(2, {
                        token: "bot-token",
                        channel_id: "C1",
                        thread_ts: "123",
                        status: "",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts channel messages when mentionPatterns match", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, run, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    slackTestState.config = {
                        messages: {
                            responsePrefix: "PFX",
                            groupChat: { mentionPatterns: ["\\bopenclaw\\b"] },
                        },
                        channels: {
                            slack: {
                                dm: { enabled: true, policy: "open", allowFrom: ["*"] },
                                channels: { C1: { allow: true, requireMention: true } },
                            },
                        },
                    };
                    replyMock.mockResolvedValue({ text: "hi" });
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
                                text: "openclaw: hello",
                                ts: "123",
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
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(replyMock.mock.calls[0][0].WasMentioned).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts channel messages when mentionPatterns match even if another user is mentioned", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, run, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    slackTestState.config = {
                        messages: {
                            responsePrefix: "PFX",
                            groupChat: { mentionPatterns: ["\\bopenclaw\\b"] },
                        },
                        channels: {
                            slack: {
                                dm: { enabled: true, policy: "open", allowFrom: ["*"] },
                                channels: { C1: { allow: true, requireMention: true } },
                            },
                        },
                    };
                    replyMock.mockResolvedValue({ text: "hi" });
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
                                text: "openclaw: hello <@U2>",
                                ts: "123",
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
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(replyMock.mock.calls[0][0].WasMentioned).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats replies to bot threads as implicit mentions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, run, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    slackTestState.config = {
                        channels: {
                            slack: {
                                dm: { enabled: true, policy: "open", allowFrom: ["*"] },
                                channels: { C1: { allow: true, requireMention: true } },
                            },
                        },
                    };
                    replyMock.mockResolvedValue({ text: "hi" });
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
                                text: "following up",
                                ts: "124",
                                thread_ts: "123",
                                parent_user_id: "bot-user",
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
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(replyMock.mock.calls[0][0].WasMentioned).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts channel messages without mention when channels.slack.requireMention is false", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, run, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    slackTestState.config = {
                        channels: {
                            slack: {
                                dm: { enabled: true, policy: "open", allowFrom: ["*"] },
                                groupPolicy: "open",
                                requireMention: false,
                            },
                        },
                    };
                    replyMock.mockResolvedValue({ text: "hi" });
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
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(replyMock.mock.calls[0][0].WasMentioned).toBe(false);
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats control commands as mentions for group bypass", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, run, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    replyMock.mockResolvedValue({ text: "ok" });
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
                                text: "/elevated off",
                                ts: "123",
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
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(replyMock.mock.calls[0][0].WasMentioned).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("threads replies when incoming message is in a thread", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                                ts: "123",
                                thread_ts: "456",
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
                    (0, vitest_1.expect)(sendMock.mock.calls[0][2]).toMatchObject({ threadTs: "456" });
                    return [2 /*return*/];
            }
        });
    }); });
});
