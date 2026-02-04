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
var createTelegramDraftStream = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
var dispatchReplyWithBufferedBlockDispatcher = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
var deliverReplies = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
vitest_1.vi.mock("./draft-stream.js", function () { return ({
    createTelegramDraftStream: createTelegramDraftStream,
}); });
vitest_1.vi.mock("../auto-reply/reply/provider-dispatcher.js", function () { return ({
    dispatchReplyWithBufferedBlockDispatcher: dispatchReplyWithBufferedBlockDispatcher,
}); });
vitest_1.vi.mock("./bot/delivery.js", function () { return ({
    deliverReplies: deliverReplies,
}); });
vitest_1.vi.mock("./sticker-cache.js", function () { return ({
    cacheSticker: vitest_1.vi.fn(),
    describeStickerImage: vitest_1.vi.fn(),
}); });
var bot_message_dispatch_js_1 = require("./bot-message-dispatch.js");
(0, vitest_1.describe)("dispatchTelegramMessage draft streaming", function () {
    (0, vitest_1.beforeEach)(function () {
        createTelegramDraftStream.mockReset();
        dispatchReplyWithBufferedBlockDispatcher.mockReset();
        deliverReplies.mockReset();
    });
    (0, vitest_1.it)("streams drafts in private threads and forwards thread id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var draftStream, resolveBotTopicsEnabled, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    draftStream = {
                        update: vitest_1.vi.fn(),
                        flush: vitest_1.vi.fn().mockResolvedValue(undefined),
                        stop: vitest_1.vi.fn(),
                    };
                    createTelegramDraftStream.mockReturnValue(draftStream);
                    dispatchReplyWithBufferedBlockDispatcher.mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var _c;
                        var dispatcherOptions = _b.dispatcherOptions, replyOptions = _b.replyOptions;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, ((_c = replyOptions === null || replyOptions === void 0 ? void 0 : replyOptions.onPartialReply) === null || _c === void 0 ? void 0 : _c.call(replyOptions, { text: "Hello" }))];
                                case 1:
                                    _d.sent();
                                    return [4 /*yield*/, dispatcherOptions.deliver({ text: "Hello" }, { kind: "final" })];
                                case 2:
                                    _d.sent();
                                    return [2 /*return*/, { queuedFinal: true }];
                            }
                        });
                    }); });
                    deliverReplies.mockResolvedValue({ delivered: true });
                    resolveBotTopicsEnabled = vitest_1.vi.fn().mockResolvedValue(true);
                    context = {
                        ctxPayload: {},
                        primaryCtx: { message: { chat: { id: 123, type: "private" } } },
                        msg: {
                            chat: { id: 123, type: "private" },
                            message_id: 456,
                            message_thread_id: 777,
                        },
                        chatId: 123,
                        isGroup: false,
                        resolvedThreadId: undefined,
                        replyThreadId: 777,
                        threadSpec: { id: 777, scope: "dm" },
                        historyKey: undefined,
                        historyLimit: 0,
                        groupHistories: new Map(),
                        route: { agentId: "default", accountId: "default" },
                        skillFilter: undefined,
                        sendTyping: vitest_1.vi.fn(),
                        sendRecordVoice: vitest_1.vi.fn(),
                        ackReactionPromise: null,
                        reactionApi: null,
                        removeAckAfterReply: false,
                    };
                    return [4 /*yield*/, (0, bot_message_dispatch_js_1.dispatchTelegramMessage)({
                            context: context,
                            bot: { api: {} },
                            cfg: {},
                            runtime: {},
                            replyToMode: "first",
                            streamMode: "partial",
                            textLimit: 4096,
                            telegramCfg: {},
                            opts: {},
                            resolveBotTopicsEnabled: resolveBotTopicsEnabled,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(resolveBotTopicsEnabled).toHaveBeenCalledWith(context.primaryCtx);
                    (0, vitest_1.expect)(createTelegramDraftStream).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        chatId: 123,
                        thread: { id: 777, scope: "dm" },
                    }));
                    (0, vitest_1.expect)(draftStream.update).toHaveBeenCalledWith("Hello");
                    (0, vitest_1.expect)(deliverReplies).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        thread: { id: 777, scope: "dm" },
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
