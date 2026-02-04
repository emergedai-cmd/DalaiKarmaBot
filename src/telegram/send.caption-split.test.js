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
var _a = vitest_1.vi.hoisted(function () { return ({
    botApi: {
        sendMessage: vitest_1.vi.fn(),
        sendPhoto: vitest_1.vi.fn(),
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
var loadConfig = vitest_1.vi.hoisted(function () { return ({
    loadConfig: vitest_1.vi.fn(function () { return ({}); }),
}); }).loadConfig;
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: loadConfig })];
        }
    });
}); });
var send_js_1 = require("./send.js");
(0, vitest_1.describe)("sendMessageTelegram caption splitting", function () {
    (0, vitest_1.beforeEach)(function () {
        loadConfig.mockReturnValue({});
        loadWebMedia.mockReset();
        botApi.sendMessage.mockReset();
        botApi.sendPhoto.mockReset();
        botCtorSpy.mockReset();
    });
    (0, vitest_1.it)("splits long captions into media + text messages when text exceeds 1024 chars", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, longText, sendPhoto, sendMessage, api, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    longText = "A".repeat(1100);
                    sendPhoto = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 70,
                        chat: { id: chatId },
                    });
                    sendMessage = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 71,
                        chat: { id: chatId },
                    });
                    api = { sendPhoto: sendPhoto, sendMessage: sendMessage };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("fake-image"),
                        contentType: "image/jpeg",
                        fileName: "photo.jpg",
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, longText, {
                            token: "tok",
                            api: api,
                            mediaUrl: "https://example.com/photo.jpg",
                        })];
                case 1:
                    res = _a.sent();
                    // Media should be sent first without caption
                    (0, vitest_1.expect)(sendPhoto).toHaveBeenCalledWith(chatId, vitest_1.expect.anything(), {
                        caption: undefined,
                    });
                    // Then text sent as separate message (HTML formatting)
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith(chatId, longText, {
                        parse_mode: "HTML",
                    });
                    // Returns the text message ID (the "main" content)
                    (0, vitest_1.expect)(res.messageId).toBe("71");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses caption when text is within 1024 char limit", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, shortText, sendPhoto, sendMessage, api, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    shortText = "B".repeat(1024);
                    sendPhoto = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 72,
                        chat: { id: chatId },
                    });
                    sendMessage = vitest_1.vi.fn();
                    api = { sendPhoto: sendPhoto, sendMessage: sendMessage };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("fake-image"),
                        contentType: "image/jpeg",
                        fileName: "photo.jpg",
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, shortText, {
                            token: "tok",
                            api: api,
                            mediaUrl: "https://example.com/photo.jpg",
                        })];
                case 1:
                    res = _a.sent();
                    // Caption should be included with media
                    (0, vitest_1.expect)(sendPhoto).toHaveBeenCalledWith(chatId, vitest_1.expect.anything(), {
                        caption: shortText,
                        parse_mode: "HTML",
                    });
                    // No separate text message needed
                    (0, vitest_1.expect)(sendMessage).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(res.messageId).toBe("72");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("renders markdown in media captions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, caption, sendPhoto, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    caption = "hi **boss**";
                    sendPhoto = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 90,
                        chat: { id: chatId },
                    });
                    api = { sendPhoto: sendPhoto };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("fake-image"),
                        contentType: "image/jpeg",
                        fileName: "photo.jpg",
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, caption, {
                            token: "tok",
                            api: api,
                            mediaUrl: "https://example.com/photo.jpg",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendPhoto).toHaveBeenCalledWith(chatId, vitest_1.expect.anything(), {
                        caption: "hi <b>boss</b>",
                        parse_mode: "HTML",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("preserves thread params when splitting long captions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, longText, sendPhoto, sendMessage, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "-1001234567890";
                    longText = "C".repeat(1100);
                    sendPhoto = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 73,
                        chat: { id: chatId },
                    });
                    sendMessage = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 74,
                        chat: { id: chatId },
                    });
                    api = { sendPhoto: sendPhoto, sendMessage: sendMessage };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("fake-image"),
                        contentType: "image/jpeg",
                        fileName: "photo.jpg",
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, longText, {
                            token: "tok",
                            api: api,
                            mediaUrl: "https://example.com/photo.jpg",
                            messageThreadId: 271,
                            replyToMessageId: 500,
                        })];
                case 1:
                    _a.sent();
                    // Media sent with thread params but no caption
                    (0, vitest_1.expect)(sendPhoto).toHaveBeenCalledWith(chatId, vitest_1.expect.anything(), {
                        caption: undefined,
                        message_thread_id: 271,
                        reply_to_message_id: 500,
                    });
                    // Text message also includes thread params (HTML formatting)
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith(chatId, longText, {
                        parse_mode: "HTML",
                        message_thread_id: 271,
                        reply_to_message_id: 500,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("puts reply_markup only on follow-up text when splitting", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, longText, sendPhoto, sendMessage, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    longText = "D".repeat(1100);
                    sendPhoto = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 75,
                        chat: { id: chatId },
                    });
                    sendMessage = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 76,
                        chat: { id: chatId },
                    });
                    api = { sendPhoto: sendPhoto, sendMessage: sendMessage };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("fake-image"),
                        contentType: "image/jpeg",
                        fileName: "photo.jpg",
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, longText, {
                            token: "tok",
                            api: api,
                            mediaUrl: "https://example.com/photo.jpg",
                            buttons: [[{ text: "Click me", callback_data: "action:click" }]],
                        })];
                case 1:
                    _a.sent();
                    // Media sent WITHOUT reply_markup
                    (0, vitest_1.expect)(sendPhoto).toHaveBeenCalledWith(chatId, vitest_1.expect.anything(), {
                        caption: undefined,
                    });
                    // Follow-up text has the reply_markup
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith(chatId, longText, {
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [[{ text: "Click me", callback_data: "action:click" }]],
                        },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes thread params and reply_markup on follow-up text when splitting", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, longText, sendPhoto, sendMessage, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "-1001234567890";
                    longText = "F".repeat(1100);
                    sendPhoto = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 78,
                        chat: { id: chatId },
                    });
                    sendMessage = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 79,
                        chat: { id: chatId },
                    });
                    api = { sendPhoto: sendPhoto, sendMessage: sendMessage };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("fake-image"),
                        contentType: "image/jpeg",
                        fileName: "photo.jpg",
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, longText, {
                            token: "tok",
                            api: api,
                            mediaUrl: "https://example.com/photo.jpg",
                            messageThreadId: 271,
                            replyToMessageId: 500,
                            buttons: [[{ text: "Click me", callback_data: "action:click" }]],
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendPhoto).toHaveBeenCalledWith(chatId, vitest_1.expect.anything(), {
                        caption: undefined,
                        message_thread_id: 271,
                        reply_to_message_id: 500,
                    });
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith(chatId, longText, {
                        parse_mode: "HTML",
                        message_thread_id: 271,
                        reply_to_message_id: 500,
                        reply_markup: {
                            inline_keyboard: [[{ text: "Click me", callback_data: "action:click" }]],
                        },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("wraps chat-not-found errors from follow-up message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, longText, sendPhoto, sendMessage, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    longText = "G".repeat(1100);
                    sendPhoto = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 80,
                        chat: { id: chatId },
                    });
                    sendMessage = vitest_1.vi.fn().mockRejectedValue(new Error("400: Bad Request: chat not found"));
                    api = { sendPhoto: sendPhoto, sendMessage: sendMessage };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("fake-image"),
                        contentType: "image/jpeg",
                        fileName: "photo.jpg",
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendMessageTelegram)(chatId, longText, {
                            token: "tok",
                            api: api,
                            mediaUrl: "https://example.com/photo.jpg",
                        })).rejects.toThrow(/Telegram send failed: chat not found \(chat_id=123\)\./)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not send follow-up text when caption is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, emptyText, sendPhoto, sendMessage, api, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    emptyText = "   ";
                    sendPhoto = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 81,
                        chat: { id: chatId },
                    });
                    sendMessage = vitest_1.vi.fn();
                    api = { sendPhoto: sendPhoto, sendMessage: sendMessage };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("fake-image"),
                        contentType: "image/jpeg",
                        fileName: "photo.jpg",
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, emptyText, {
                            token: "tok",
                            api: api,
                            mediaUrl: "https://example.com/photo.jpg",
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(sendPhoto).toHaveBeenCalledWith(chatId, vitest_1.expect.anything(), {
                        caption: undefined,
                    });
                    (0, vitest_1.expect)(sendMessage).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(res.messageId).toBe("81");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps reply_markup on media when not splitting", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, shortText, sendPhoto, sendMessage, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    shortText = "E".repeat(100);
                    sendPhoto = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 77,
                        chat: { id: chatId },
                    });
                    sendMessage = vitest_1.vi.fn();
                    api = { sendPhoto: sendPhoto, sendMessage: sendMessage };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("fake-image"),
                        contentType: "image/jpeg",
                        fileName: "photo.jpg",
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, shortText, {
                            token: "tok",
                            api: api,
                            mediaUrl: "https://example.com/photo.jpg",
                            buttons: [[{ text: "Click me", callback_data: "action:click" }]],
                        })];
                case 1:
                    _a.sent();
                    // Media sent WITH reply_markup when not splitting
                    (0, vitest_1.expect)(sendPhoto).toHaveBeenCalledWith(chatId, vitest_1.expect.anything(), {
                        caption: shortText,
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [[{ text: "Click me", callback_data: "action:click" }]],
                        },
                    });
                    (0, vitest_1.expect)(sendMessage).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
