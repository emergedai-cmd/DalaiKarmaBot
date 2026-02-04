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
var test_ctx_js_1 = require("./test-ctx.js");
var mocks = vitest_1.vi.hoisted(function () { return ({
    routeReply: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ ok: true, messageId: "mock" })];
    }); }); }),
    tryFastAbortFromMessage: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    handled: false,
                    aborted: false,
                })];
        });
    }); }),
}); });
var diagnosticMocks = vitest_1.vi.hoisted(function () { return ({
    logMessageQueued: vitest_1.vi.fn(),
    logMessageProcessed: vitest_1.vi.fn(),
    logSessionStateChange: vitest_1.vi.fn(),
}); });
var hookMocks = vitest_1.vi.hoisted(function () { return ({
    runner: {
        hasHooks: vitest_1.vi.fn(function () { return false; }),
        runMessageReceived: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); }),
    },
}); });
vitest_1.vi.mock("./route-reply.js", function () { return ({
    isRoutableChannel: function (channel) {
        return Boolean(channel &&
            ["telegram", "slack", "discord", "signal", "imessage", "whatsapp"].includes(channel));
    },
    routeReply: mocks.routeReply,
}); });
vitest_1.vi.mock("./abort.js", function () { return ({
    tryFastAbortFromMessage: mocks.tryFastAbortFromMessage,
    formatAbortReplyText: function (stoppedSubagents) {
        if (typeof stoppedSubagents !== "number" || stoppedSubagents <= 0) {
            return "⚙️ Agent was aborted.";
        }
        var label = stoppedSubagents === 1 ? "sub-agent" : "sub-agents";
        return "\u2699\uFE0F Agent was aborted. Stopped ".concat(stoppedSubagents, " ").concat(label, ".");
    },
}); });
vitest_1.vi.mock("../../logging/diagnostic.js", function () { return ({
    logMessageQueued: diagnosticMocks.logMessageQueued,
    logMessageProcessed: diagnosticMocks.logMessageProcessed,
    logSessionStateChange: diagnosticMocks.logSessionStateChange,
}); });
vitest_1.vi.mock("../../plugins/hook-runner-global.js", function () { return ({
    getGlobalHookRunner: function () { return hookMocks.runner; },
}); });
var dispatchReplyFromConfig = (await Promise.resolve().then(function () { return require("./dispatch-from-config.js"); })).dispatchReplyFromConfig;
var resetInboundDedupe = (await Promise.resolve().then(function () { return require("./inbound-dedupe.js"); })).resetInboundDedupe;
function createDispatcher() {
    var _this = this;
    return {
        sendToolResult: vitest_1.vi.fn(function () { return true; }),
        sendBlockReply: vitest_1.vi.fn(function () { return true; }),
        sendFinalReply: vitest_1.vi.fn(function () { return true; }),
        waitForIdle: vitest_1.vi.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); }),
        getQueuedCounts: vitest_1.vi.fn(function () { return ({ tool: 0, block: 0, final: 0 }); }),
    };
}
(0, vitest_1.describe)("dispatchReplyFromConfig", function () {
    (0, vitest_1.beforeEach)(function () {
        resetInboundDedupe();
        diagnosticMocks.logMessageQueued.mockReset();
        diagnosticMocks.logMessageProcessed.mockReset();
        diagnosticMocks.logSessionStateChange.mockReset();
        hookMocks.runner.hasHooks.mockReset();
        hookMocks.runner.hasHooks.mockReturnValue(false);
        hookMocks.runner.runMessageReceived.mockReset();
    });
    (0, vitest_1.it)("does not route when Provider matches OriginatingChannel (even if Surface is missing)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, dispatcher, ctx, replyResolver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.tryFastAbortFromMessage.mockResolvedValue({
                        handled: false,
                        aborted: false,
                    });
                    mocks.routeReply.mockClear();
                    cfg = {};
                    dispatcher = createDispatcher();
                    ctx = (0, test_ctx_js_1.buildTestCtx)({
                        Provider: "slack",
                        Surface: undefined,
                        OriginatingChannel: "slack",
                        OriginatingTo: "channel:C123",
                    });
                    replyResolver = function (_ctx, _opts, _cfg) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ text: "hi" })];
                    }); }); };
                    return [4 /*yield*/, dispatchReplyFromConfig({ ctx: ctx, cfg: cfg, dispatcher: dispatcher, replyResolver: replyResolver })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.routeReply).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(dispatcher.sendFinalReply).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("routes when OriginatingChannel differs from Provider", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, dispatcher, ctx, replyResolver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.tryFastAbortFromMessage.mockResolvedValue({
                        handled: false,
                        aborted: false,
                    });
                    mocks.routeReply.mockClear();
                    cfg = {};
                    dispatcher = createDispatcher();
                    ctx = (0, test_ctx_js_1.buildTestCtx)({
                        Provider: "slack",
                        AccountId: "acc-1",
                        MessageThreadId: 123,
                        OriginatingChannel: "telegram",
                        OriginatingTo: "telegram:999",
                    });
                    replyResolver = function (_ctx, _opts, _cfg) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ text: "hi" })];
                    }); }); };
                    return [4 /*yield*/, dispatchReplyFromConfig({ ctx: ctx, cfg: cfg, dispatcher: dispatcher, replyResolver: replyResolver })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(dispatcher.sendFinalReply).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(mocks.routeReply).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        channel: "telegram",
                        to: "telegram:999",
                        accountId: "acc-1",
                        threadId: 123,
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("provides onToolResult in DM sessions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, dispatcher, ctx, replyResolver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.tryFastAbortFromMessage.mockResolvedValue({
                        handled: false,
                        aborted: false,
                    });
                    mocks.routeReply.mockClear();
                    cfg = {};
                    dispatcher = createDispatcher();
                    ctx = (0, test_ctx_js_1.buildTestCtx)({
                        Provider: "telegram",
                        ChatType: "direct",
                    });
                    replyResolver = function (_ctx, opts, _cfg) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            (0, vitest_1.expect)(opts === null || opts === void 0 ? void 0 : opts.onToolResult).toBeDefined();
                            (0, vitest_1.expect)(typeof (opts === null || opts === void 0 ? void 0 : opts.onToolResult)).toBe("function");
                            return [2 /*return*/, { text: "hi" }];
                        });
                    }); };
                    return [4 /*yield*/, dispatchReplyFromConfig({ ctx: ctx, cfg: cfg, dispatcher: dispatcher, replyResolver: replyResolver })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(dispatcher.sendFinalReply).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not provide onToolResult in group sessions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, dispatcher, ctx, replyResolver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.tryFastAbortFromMessage.mockResolvedValue({
                        handled: false,
                        aborted: false,
                    });
                    cfg = {};
                    dispatcher = createDispatcher();
                    ctx = (0, test_ctx_js_1.buildTestCtx)({
                        Provider: "telegram",
                        ChatType: "group",
                    });
                    replyResolver = function (_ctx, opts, _cfg) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            (0, vitest_1.expect)(opts === null || opts === void 0 ? void 0 : opts.onToolResult).toBeUndefined();
                            return [2 /*return*/, { text: "hi" }];
                        });
                    }); };
                    return [4 /*yield*/, dispatchReplyFromConfig({ ctx: ctx, cfg: cfg, dispatcher: dispatcher, replyResolver: replyResolver })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(dispatcher.sendFinalReply).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends tool results via dispatcher in DM sessions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, dispatcher, ctx, replyResolver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.tryFastAbortFromMessage.mockResolvedValue({
                        handled: false,
                        aborted: false,
                    });
                    cfg = {};
                    dispatcher = createDispatcher();
                    ctx = (0, test_ctx_js_1.buildTestCtx)({
                        Provider: "telegram",
                        ChatType: "direct",
                    });
                    replyResolver = function (_ctx, opts, _cfg) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: 
                                // Simulate tool result emission
                                return [4 /*yield*/, ((_a = opts === null || opts === void 0 ? void 0 : opts.onToolResult) === null || _a === void 0 ? void 0 : _a.call(opts, { text: "🔧 exec: ls" }))];
                                case 1:
                                    // Simulate tool result emission
                                    _b.sent();
                                    return [2 /*return*/, { text: "done" }];
                            }
                        });
                    }); };
                    return [4 /*yield*/, dispatchReplyFromConfig({ ctx: ctx, cfg: cfg, dispatcher: dispatcher, replyResolver: replyResolver })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(dispatcher.sendToolResult).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ text: "🔧 exec: ls" }));
                    (0, vitest_1.expect)(dispatcher.sendFinalReply).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not provide onToolResult for native slash commands", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, dispatcher, ctx, replyResolver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.tryFastAbortFromMessage.mockResolvedValue({
                        handled: false,
                        aborted: false,
                    });
                    cfg = {};
                    dispatcher = createDispatcher();
                    ctx = (0, test_ctx_js_1.buildTestCtx)({
                        Provider: "telegram",
                        ChatType: "direct",
                        CommandSource: "native",
                    });
                    replyResolver = function (_ctx, opts, _cfg) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            (0, vitest_1.expect)(opts === null || opts === void 0 ? void 0 : opts.onToolResult).toBeUndefined();
                            return [2 /*return*/, { text: "hi" }];
                        });
                    }); };
                    return [4 /*yield*/, dispatchReplyFromConfig({ ctx: ctx, cfg: cfg, dispatcher: dispatcher, replyResolver: replyResolver })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(dispatcher.sendFinalReply).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("fast-aborts without calling the reply resolver", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, dispatcher, ctx, replyResolver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.tryFastAbortFromMessage.mockResolvedValue({
                        handled: true,
                        aborted: true,
                    });
                    cfg = {};
                    dispatcher = createDispatcher();
                    ctx = (0, test_ctx_js_1.buildTestCtx)({
                        Provider: "telegram",
                        Body: "/stop",
                    });
                    replyResolver = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ text: "hi" })];
                    }); }); });
                    return [4 /*yield*/, dispatchReplyFromConfig({ ctx: ctx, cfg: cfg, dispatcher: dispatcher, replyResolver: replyResolver })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replyResolver).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(dispatcher.sendFinalReply).toHaveBeenCalledWith({
                        text: "⚙️ Agent was aborted.",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("fast-abort reply includes stopped subagent count when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, dispatcher, ctx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.tryFastAbortFromMessage.mockResolvedValue({
                        handled: true,
                        aborted: true,
                        stoppedSubagents: 2,
                    });
                    cfg = {};
                    dispatcher = createDispatcher();
                    ctx = (0, test_ctx_js_1.buildTestCtx)({
                        Provider: "telegram",
                        Body: "/stop",
                    });
                    return [4 /*yield*/, dispatchReplyFromConfig({
                            ctx: ctx,
                            cfg: cfg,
                            dispatcher: dispatcher,
                            replyResolver: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ text: "hi" })];
                            }); }); }),
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(dispatcher.sendFinalReply).toHaveBeenCalledWith({
                        text: "⚙️ Agent was aborted. Stopped 2 sub-agents.",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("deduplicates inbound messages by MessageSid and origin", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, ctx, replyResolver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.tryFastAbortFromMessage.mockResolvedValue({
                        handled: false,
                        aborted: false,
                    });
                    cfg = {};
                    ctx = (0, test_ctx_js_1.buildTestCtx)({
                        Provider: "whatsapp",
                        OriginatingChannel: "whatsapp",
                        OriginatingTo: "whatsapp:+15555550123",
                        MessageSid: "msg-1",
                    });
                    replyResolver = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ text: "hi" })];
                    }); }); });
                    return [4 /*yield*/, dispatchReplyFromConfig({
                            ctx: ctx,
                            cfg: cfg,
                            dispatcher: createDispatcher(),
                            replyResolver: replyResolver,
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dispatchReplyFromConfig({
                            ctx: ctx,
                            cfg: cfg,
                            dispatcher: createDispatcher(),
                            replyResolver: replyResolver,
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(replyResolver).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("emits message_received hook with originating channel metadata", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, dispatcher, ctx, replyResolver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.tryFastAbortFromMessage.mockResolvedValue({
                        handled: false,
                        aborted: false,
                    });
                    hookMocks.runner.hasHooks.mockReturnValue(true);
                    cfg = {};
                    dispatcher = createDispatcher();
                    ctx = (0, test_ctx_js_1.buildTestCtx)({
                        Provider: "slack",
                        Surface: "slack",
                        OriginatingChannel: "Telegram",
                        OriginatingTo: "telegram:999",
                        CommandBody: "/search hello",
                        RawBody: "raw text",
                        Body: "body text",
                        Timestamp: 1710000000000,
                        MessageSidFull: "sid-full",
                        SenderId: "user-1",
                        SenderName: "Alice",
                        SenderUsername: "alice",
                        SenderE164: "+15555550123",
                        AccountId: "acc-1",
                    });
                    replyResolver = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ text: "hi" })];
                    }); }); };
                    return [4 /*yield*/, dispatchReplyFromConfig({ ctx: ctx, cfg: cfg, dispatcher: dispatcher, replyResolver: replyResolver })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(hookMocks.runner.runMessageReceived).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        from: ctx.From,
                        content: "/search hello",
                        timestamp: 1710000000000,
                        metadata: vitest_1.expect.objectContaining({
                            originatingChannel: "Telegram",
                            originatingTo: "telegram:999",
                            messageId: "sid-full",
                            senderId: "user-1",
                            senderName: "Alice",
                            senderUsername: "alice",
                            senderE164: "+15555550123",
                        }),
                    }), vitest_1.expect.objectContaining({
                        channelId: "telegram",
                        accountId: "acc-1",
                        conversationId: "telegram:999",
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("emits diagnostics when enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, dispatcher, ctx, replyResolver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.tryFastAbortFromMessage.mockResolvedValue({
                        handled: false,
                        aborted: false,
                    });
                    cfg = { diagnostics: { enabled: true } };
                    dispatcher = createDispatcher();
                    ctx = (0, test_ctx_js_1.buildTestCtx)({
                        Provider: "slack",
                        Surface: "slack",
                        SessionKey: "agent:main:main",
                        MessageSid: "msg-1",
                        To: "slack:C123",
                    });
                    replyResolver = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ text: "hi" })];
                    }); }); };
                    return [4 /*yield*/, dispatchReplyFromConfig({ ctx: ctx, cfg: cfg, dispatcher: dispatcher, replyResolver: replyResolver })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(diagnosticMocks.logMessageQueued).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(diagnosticMocks.logSessionStateChange).toHaveBeenCalledWith({
                        sessionKey: "agent:main:main",
                        state: "processing",
                        reason: "message_start",
                    });
                    (0, vitest_1.expect)(diagnosticMocks.logMessageProcessed).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        channel: "slack",
                        outcome: "completed",
                        sessionKey: "agent:main:main",
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("marks diagnostics skipped for duplicate inbound messages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, ctx, replyResolver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.tryFastAbortFromMessage.mockResolvedValue({
                        handled: false,
                        aborted: false,
                    });
                    cfg = { diagnostics: { enabled: true } };
                    ctx = (0, test_ctx_js_1.buildTestCtx)({
                        Provider: "whatsapp",
                        OriginatingChannel: "whatsapp",
                        OriginatingTo: "whatsapp:+15555550123",
                        MessageSid: "msg-dup",
                    });
                    replyResolver = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ text: "hi" })];
                    }); }); });
                    return [4 /*yield*/, dispatchReplyFromConfig({
                            ctx: ctx,
                            cfg: cfg,
                            dispatcher: createDispatcher(),
                            replyResolver: replyResolver,
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dispatchReplyFromConfig({
                            ctx: ctx,
                            cfg: cfg,
                            dispatcher: createDispatcher(),
                            replyResolver: replyResolver,
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(replyResolver).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(diagnosticMocks.logMessageProcessed).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        channel: "whatsapp",
                        outcome: "skipped",
                        reason: "duplicate",
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
