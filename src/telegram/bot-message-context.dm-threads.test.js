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
var bot_message_context_js_1 = require("./bot-message-context.js");
(0, vitest_1.describe)("buildTelegramMessageContext dm thread sessions", function () {
    var baseConfig = {
        agents: { defaults: { model: "anthropic/claude-opus-4-5", workspace: "/tmp/openclaw" } },
        channels: { telegram: {} },
        messages: { groupChat: { mentionPatterns: [] } },
    };
    var buildContext = function (message) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, bot_message_context_js_1.buildTelegramMessageContext)({
                        primaryCtx: {
                            message: message,
                            me: { id: 7, username: "bot" },
                        },
                        allMedia: [],
                        storeAllowFrom: [],
                        options: {},
                        bot: {
                            api: {
                                sendChatAction: vitest_1.vi.fn(),
                                setMessageReaction: vitest_1.vi.fn(),
                            },
                        },
                        cfg: baseConfig,
                        account: { accountId: "default" },
                        historyLimit: 0,
                        groupHistories: new Map(),
                        dmPolicy: "open",
                        allowFrom: [],
                        groupAllowFrom: [],
                        ackReactionScope: "off",
                        logger: { info: vitest_1.vi.fn() },
                        resolveGroupActivation: function () { return undefined; },
                        resolveGroupRequireMention: function () { return false; },
                        resolveTelegramGroupConfig: function () { return ({
                            groupConfig: { requireMention: false },
                            topicConfig: undefined,
                        }); },
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    (0, vitest_1.it)("uses thread session key for dm topics", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ctx;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, buildContext({
                        message_id: 1,
                        chat: { id: 1234, type: "private" },
                        date: 1700000000,
                        text: "hello",
                        message_thread_id: 42,
                        from: { id: 42, first_name: "Alice" },
                    })];
                case 1:
                    ctx = _c.sent();
                    (0, vitest_1.expect)(ctx).not.toBeNull();
                    (0, vitest_1.expect)((_a = ctx === null || ctx === void 0 ? void 0 : ctx.ctxPayload) === null || _a === void 0 ? void 0 : _a.MessageThreadId).toBe(42);
                    (0, vitest_1.expect)((_b = ctx === null || ctx === void 0 ? void 0 : ctx.ctxPayload) === null || _b === void 0 ? void 0 : _b.SessionKey).toBe("agent:main:main:thread:42");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps legacy dm session key when no thread id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ctx;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, buildContext({
                        message_id: 2,
                        chat: { id: 1234, type: "private" },
                        date: 1700000001,
                        text: "hello",
                        from: { id: 42, first_name: "Alice" },
                    })];
                case 1:
                    ctx = _c.sent();
                    (0, vitest_1.expect)(ctx).not.toBeNull();
                    (0, vitest_1.expect)((_a = ctx === null || ctx === void 0 ? void 0 : ctx.ctxPayload) === null || _a === void 0 ? void 0 : _a.MessageThreadId).toBeUndefined();
                    (0, vitest_1.expect)((_b = ctx === null || ctx === void 0 ? void 0 : ctx.ctxPayload) === null || _b === void 0 ? void 0 : _b.SessionKey).toBe("agent:main:main");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("buildTelegramMessageContext group sessions without forum", function () {
    var baseConfig = {
        agents: { defaults: { model: "anthropic/claude-opus-4-5", workspace: "/tmp/openclaw" } },
        channels: { telegram: {} },
        messages: { groupChat: { mentionPatterns: [] } },
    };
    var buildContext = function (message) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, bot_message_context_js_1.buildTelegramMessageContext)({
                        primaryCtx: {
                            message: message,
                            me: { id: 7, username: "bot" },
                        },
                        allMedia: [],
                        storeAllowFrom: [],
                        options: { forceWasMentioned: true },
                        bot: {
                            api: {
                                sendChatAction: vitest_1.vi.fn(),
                                setMessageReaction: vitest_1.vi.fn(),
                            },
                        },
                        cfg: baseConfig,
                        account: { accountId: "default" },
                        historyLimit: 0,
                        groupHistories: new Map(),
                        dmPolicy: "open",
                        allowFrom: [],
                        groupAllowFrom: [],
                        ackReactionScope: "off",
                        logger: { info: vitest_1.vi.fn() },
                        resolveGroupActivation: function () { return true; },
                        resolveGroupRequireMention: function () { return false; },
                        resolveTelegramGroupConfig: function () { return ({
                            groupConfig: { requireMention: false },
                            topicConfig: undefined,
                        }); },
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    (0, vitest_1.it)("ignores message_thread_id for regular groups (not forums)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ctx;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, buildContext({
                        message_id: 1,
                        chat: { id: -1001234567890, type: "supergroup", title: "Test Group" },
                        date: 1700000000,
                        text: "@bot hello",
                        message_thread_id: 42, // This is a reply thread, NOT a forum topic
                        from: { id: 42, first_name: "Alice" },
                    })];
                case 1:
                    ctx = _c.sent();
                    (0, vitest_1.expect)(ctx).not.toBeNull();
                    // Session key should NOT include :topic:42
                    (0, vitest_1.expect)((_a = ctx === null || ctx === void 0 ? void 0 : ctx.ctxPayload) === null || _a === void 0 ? void 0 : _a.SessionKey).toBe("agent:main:telegram:group:-1001234567890");
                    // MessageThreadId should be undefined (not a forum)
                    (0, vitest_1.expect)((_b = ctx === null || ctx === void 0 ? void 0 : ctx.ctxPayload) === null || _b === void 0 ? void 0 : _b.MessageThreadId).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps same session for regular group with and without message_thread_id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ctxWithThread, ctxWithoutThread;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, buildContext({
                        message_id: 1,
                        chat: { id: -1001234567890, type: "supergroup", title: "Test Group" },
                        date: 1700000000,
                        text: "@bot hello",
                        message_thread_id: 42,
                        from: { id: 42, first_name: "Alice" },
                    })];
                case 1:
                    ctxWithThread = _c.sent();
                    return [4 /*yield*/, buildContext({
                            message_id: 2,
                            chat: { id: -1001234567890, type: "supergroup", title: "Test Group" },
                            date: 1700000001,
                            text: "@bot world",
                            from: { id: 42, first_name: "Alice" },
                        })];
                case 2:
                    ctxWithoutThread = _c.sent();
                    (0, vitest_1.expect)(ctxWithThread).not.toBeNull();
                    (0, vitest_1.expect)(ctxWithoutThread).not.toBeNull();
                    // Both messages should use the same session key
                    (0, vitest_1.expect)((_a = ctxWithThread === null || ctxWithThread === void 0 ? void 0 : ctxWithThread.ctxPayload) === null || _a === void 0 ? void 0 : _a.SessionKey).toBe((_b = ctxWithoutThread === null || ctxWithoutThread === void 0 ? void 0 : ctxWithoutThread.ctxPayload) === null || _b === void 0 ? void 0 : _b.SessionKey);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses topic session for forum groups with message_thread_id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ctx;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, buildContext({
                        message_id: 1,
                        chat: { id: -1001234567890, type: "supergroup", title: "Test Forum", is_forum: true },
                        date: 1700000000,
                        text: "@bot hello",
                        message_thread_id: 99,
                        from: { id: 42, first_name: "Alice" },
                    })];
                case 1:
                    ctx = _c.sent();
                    (0, vitest_1.expect)(ctx).not.toBeNull();
                    // Session key SHOULD include :topic:99 for forums
                    (0, vitest_1.expect)((_a = ctx === null || ctx === void 0 ? void 0 : ctx.ctxPayload) === null || _a === void 0 ? void 0 : _a.SessionKey).toBe("agent:main:telegram:group:-1001234567890:topic:99");
                    (0, vitest_1.expect)((_b = ctx === null || ctx === void 0 ? void 0 : ctx.ctxPayload) === null || _b === void 0 ? void 0 : _b.MessageThreadId).toBe(99);
                    return [2 /*return*/];
            }
        });
    }); });
});
