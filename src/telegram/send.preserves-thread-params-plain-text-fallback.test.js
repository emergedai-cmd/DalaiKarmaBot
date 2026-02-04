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
    botApi: {
        sendMessage: vitest_1.vi.fn(),
        setMessageReaction: vitest_1.vi.fn(),
    },
    botCtorSpy: vitest_1.vi.fn(),
}); }), botApi = _a.botApi, botCtorSpy = _a.botCtorSpy;
var loadWebMedia = vitest_1.vi.hoisted(function () { return ({
    loadWebMedia: vitest_1.vi.fn(),
}); }).loadWebMedia;
vitest_1.vi.mock("../web/media.js", function () { return ({
    loadWebMedia: loadWebMedia,
}); });
vitest_1.vi.mock("grammy", function () { return ({
    Bot: /** @class */ (function () {
        function class_1(token, options) {
            this.token = token;
            this.options = options;
            this.api = botApi;
            this.catch = vitest_1.vi.fn();
            botCtorSpy(token, options);
        }
        return class_1;
    }()),
    InputFile: /** @class */ (function () {
        function InputFile() {
        }
        return InputFile;
    }()),
}); });
var send_js_1 = require("./send.js");
(0, vitest_1.describe)("buildInlineKeyboard", function () {
    (0, vitest_1.it)("preserves thread params in plain text fallback", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, parseErr, sendMessage, api, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "-1001234567890";
                    parseErr = new Error("400: Bad Request: can't parse entities: Can't find end of the entity");
                    sendMessage = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(parseErr)
                        .mockResolvedValueOnce({
                        message_id: 60,
                        chat: { id: chatId },
                    });
                    api = { sendMessage: sendMessage };
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, "_bad markdown_", {
                            token: "tok",
                            api: api,
                            messageThreadId: 271,
                            replyToMessageId: 100,
                        })];
                case 1:
                    res = _a.sent();
                    // First call: with HTML + thread params
                    (0, vitest_1.expect)(sendMessage).toHaveBeenNthCalledWith(1, chatId, "<i>bad markdown</i>", {
                        parse_mode: "HTML",
                        message_thread_id: 271,
                        reply_to_message_id: 100,
                    });
                    // Second call: plain text BUT still with thread params (critical!)
                    (0, vitest_1.expect)(sendMessage).toHaveBeenNthCalledWith(2, chatId, "_bad markdown_", {
                        message_thread_id: 271,
                        reply_to_message_id: 100,
                    });
                    (0, vitest_1.expect)(res.messageId).toBe("60");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes thread params in media messages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, sendPhoto, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "-1001234567890";
                    sendPhoto = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 58,
                        chat: { id: chatId },
                    });
                    api = { sendPhoto: sendPhoto };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("fake-image"),
                        contentType: "image/jpeg",
                        fileName: "photo.jpg",
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, "photo in topic", {
                            token: "tok",
                            api: api,
                            mediaUrl: "https://example.com/photo.jpg",
                            messageThreadId: 99,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendPhoto).toHaveBeenCalledWith(chatId, vitest_1.expect.anything(), {
                        caption: "photo in topic",
                        parse_mode: "HTML",
                        message_thread_id: 99,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("reactMessageTelegram", function () {
    (0, vitest_1.it)("sends emoji reactions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var setMessageReaction, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setMessageReaction = vitest_1.vi.fn().mockResolvedValue(undefined);
                    api = { setMessageReaction: setMessageReaction };
                    return [4 /*yield*/, (0, send_js_1.reactMessageTelegram)("telegram:123", "456", "✅", {
                            token: "tok",
                            api: api,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(setMessageReaction).toHaveBeenCalledWith("123", 456, [{ type: "emoji", emoji: "✅" }]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("removes reactions when emoji is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
        var setMessageReaction, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setMessageReaction = vitest_1.vi.fn().mockResolvedValue(undefined);
                    api = { setMessageReaction: setMessageReaction };
                    return [4 /*yield*/, (0, send_js_1.reactMessageTelegram)("123", 456, "", {
                            token: "tok",
                            api: api,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(setMessageReaction).toHaveBeenCalledWith("123", 456, []);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("removes reactions when remove flag is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var setMessageReaction, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setMessageReaction = vitest_1.vi.fn().mockResolvedValue(undefined);
                    api = { setMessageReaction: setMessageReaction };
                    return [4 /*yield*/, (0, send_js_1.reactMessageTelegram)("123", 456, "✅", {
                            token: "tok",
                            api: api,
                            remove: true,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(setMessageReaction).toHaveBeenCalledWith("123", 456, []);
                    return [2 /*return*/];
            }
        });
    }); });
});
