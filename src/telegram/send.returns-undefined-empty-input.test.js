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
        setMessageReaction: vitest_1.vi.fn(),
        sendSticker: vitest_1.vi.fn(),
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
(0, vitest_1.describe)("buildInlineKeyboard", function () {
    (0, vitest_1.it)("returns undefined for empty input", function () {
        (0, vitest_1.expect)((0, send_js_1.buildInlineKeyboard)()).toBeUndefined();
        (0, vitest_1.expect)((0, send_js_1.buildInlineKeyboard)([])).toBeUndefined();
    });
    (0, vitest_1.it)("builds inline keyboards for valid input", function () {
        var result = (0, send_js_1.buildInlineKeyboard)([
            [{ text: "Option A", callback_data: "cmd:a" }],
            [
                { text: "Option B", callback_data: "cmd:b" },
                { text: "Option C", callback_data: "cmd:c" },
            ],
        ]);
        (0, vitest_1.expect)(result).toEqual({
            inline_keyboard: [
                [{ text: "Option A", callback_data: "cmd:a" }],
                [
                    { text: "Option B", callback_data: "cmd:b" },
                    { text: "Option C", callback_data: "cmd:c" },
                ],
            ],
        });
    });
    (0, vitest_1.it)("filters invalid buttons and empty rows", function () {
        var result = (0, send_js_1.buildInlineKeyboard)([
            [
                { text: "", callback_data: "cmd:skip" },
                { text: "Ok", callback_data: "cmd:ok" },
            ],
            [{ text: "Missing data", callback_data: "" }],
            [],
        ]);
        (0, vitest_1.expect)(result).toEqual({
            inline_keyboard: [[{ text: "Ok", callback_data: "cmd:ok" }]],
        });
    });
});
(0, vitest_1.describe)("sendMessageTelegram", function () {
    (0, vitest_1.beforeEach)(function () {
        loadConfig.mockReturnValue({});
        loadWebMedia.mockReset();
        botApi.sendMessage.mockReset();
        botCtorSpy.mockReset();
    });
    (0, vitest_1.it)("passes timeoutSeconds to grammY client when configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadConfig.mockReturnValue({
                        channels: { telegram: { timeoutSeconds: 60 } },
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)("123", "hi", { token: "tok" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(botCtorSpy).toHaveBeenCalledWith("tok", vitest_1.expect.objectContaining({
                        client: vitest_1.expect.objectContaining({ timeoutSeconds: 60 }),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers per-account timeoutSeconds overrides", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                timeoutSeconds: 60,
                                accounts: { foo: { timeoutSeconds: 61 } },
                            },
                        },
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)("123", "hi", { token: "tok", accountId: "foo" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(botCtorSpy).toHaveBeenCalledWith("tok", vitest_1.expect.objectContaining({
                        client: vitest_1.expect.objectContaining({ timeoutSeconds: 61 }),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to plain text when Telegram rejects HTML", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, parseErr, sendMessage, api, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    parseErr = new Error("400: Bad Request: can't parse entities: Can't find end of the entity starting at byte offset 9");
                    sendMessage = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(parseErr)
                        .mockResolvedValueOnce({
                        message_id: 42,
                        chat: { id: chatId },
                    });
                    api = { sendMessage: sendMessage };
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, "_oops_", {
                            token: "tok",
                            api: api,
                            verbose: true,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenNthCalledWith(1, chatId, "<i>oops</i>", {
                        parse_mode: "HTML",
                    });
                    (0, vitest_1.expect)(sendMessage).toHaveBeenNthCalledWith(2, chatId, "_oops_");
                    (0, vitest_1.expect)(res.chatId).toBe(chatId);
                    (0, vitest_1.expect)(res.messageId).toBe("42");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds link_preview_options when previews are disabled in config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, sendMessage, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    sendMessage = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 7,
                        chat: { id: chatId },
                    });
                    api = { sendMessage: sendMessage };
                    loadConfig.mockReturnValue({
                        channels: { telegram: { linkPreview: false } },
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, "hi", { token: "tok", api: api })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith(chatId, "hi", {
                        parse_mode: "HTML",
                        link_preview_options: { is_disabled: true },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps link_preview_options on plain-text fallback when disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, parseErr, sendMessage, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    parseErr = new Error("400: Bad Request: can't parse entities: Can't find end of the entity starting at byte offset 9");
                    sendMessage = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(parseErr)
                        .mockResolvedValueOnce({
                        message_id: 42,
                        chat: { id: chatId },
                    });
                    api = { sendMessage: sendMessage };
                    loadConfig.mockReturnValue({
                        channels: { telegram: { linkPreview: false } },
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, "_oops_", {
                            token: "tok",
                            api: api,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenNthCalledWith(1, chatId, "<i>oops</i>", {
                        parse_mode: "HTML",
                        link_preview_options: { is_disabled: true },
                    });
                    (0, vitest_1.expect)(sendMessage).toHaveBeenNthCalledWith(2, chatId, "_oops_", {
                        link_preview_options: { is_disabled: true },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses native fetch for BAN compatibility when api is omitted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var originalFetch, originalBun, fetchSpy, clientFetch;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    originalFetch = globalThis.fetch;
                    originalBun = globalThis.Bun;
                    fetchSpy = vitest_1.vi.fn();
                    globalThis.fetch = fetchSpy;
                    globalThis.Bun = {};
                    botApi.sendMessage.mockResolvedValue({
                        message_id: 1,
                        chat: { id: "123" },
                    });
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)("123", "hi", { token: "tok" })];
                case 2:
                    _d.sent();
                    clientFetch = (_c = (_b = (_a = botCtorSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.client) === null || _c === void 0 ? void 0 : _c.fetch;
                    (0, vitest_1.expect)(clientFetch).toBeTypeOf("function");
                    (0, vitest_1.expect)(clientFetch).not.toBe(fetchSpy);
                    return [3 /*break*/, 4];
                case 3:
                    globalThis.fetch = originalFetch;
                    if (originalBun === undefined) {
                        delete globalThis.Bun;
                    }
                    else {
                        globalThis.Bun = originalBun;
                    }
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("normalizes chat ids with internal prefixes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendMessage, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendMessage = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 1,
                        chat: { id: "123" },
                    });
                    api = { sendMessage: sendMessage };
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)("telegram:123", "hi", {
                            token: "tok",
                            api: api,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith("123", "hi", {
                        parse_mode: "HTML",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("wraps chat-not-found with actionable context", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, err, sendMessage, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    err = new Error("400: Bad Request: chat not found");
                    sendMessage = vitest_1.vi.fn().mockRejectedValue(err);
                    api = { sendMessage: sendMessage };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendMessageTelegram)(chatId, "hi", { token: "tok", api: api })).rejects.toThrow(/chat not found/i)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendMessageTelegram)(chatId, "hi", { token: "tok", api: api })).rejects.toThrow(/chat_id=123/)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("retries on transient errors with retry_after", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, err, sendMessage, api, setTimeoutSpy, promise;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    chatId = "123";
                    err = Object.assign(new Error("429"), {
                        parameters: { retry_after: 0.5 },
                    });
                    sendMessage = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(err)
                        .mockResolvedValueOnce({
                        message_id: 1,
                        chat: { id: chatId },
                    });
                    api = { sendMessage: sendMessage };
                    setTimeoutSpy = vitest_1.vi.spyOn(global, "setTimeout");
                    promise = (0, send_js_1.sendMessageTelegram)(chatId, "hi", {
                        token: "tok",
                        api: api,
                        retry: { attempts: 2, minDelayMs: 0, maxDelayMs: 1000, jitter: 0 },
                    });
                    return [4 /*yield*/, vitest_1.vi.runAllTimersAsync()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(promise).resolves.toEqual({ messageId: "1", chatId: chatId })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)((_a = setTimeoutSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[1]).toBe(500);
                    setTimeoutSpy.mockRestore();
                    vitest_1.vi.useRealTimers();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not retry on non-transient errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, sendMessage, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    sendMessage = vitest_1.vi.fn().mockRejectedValue(new Error("400: Bad Request"));
                    api = { sendMessage: sendMessage };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendMessageTelegram)(chatId, "hi", {
                            token: "tok",
                            api: api,
                            retry: { attempts: 3, minDelayMs: 0, maxDelayMs: 0, jitter: 0 },
                        })).rejects.toThrow(/Bad Request/)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends GIF media as animation", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, sendAnimation, api, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    sendAnimation = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 9,
                        chat: { id: chatId },
                    });
                    api = { sendAnimation: sendAnimation };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("GIF89a"),
                        fileName: "fun.gif",
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, "caption", {
                            token: "tok",
                            api: api,
                            mediaUrl: "https://example.com/fun",
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(sendAnimation).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendAnimation).toHaveBeenCalledWith(chatId, vitest_1.expect.anything(), {
                        caption: "caption",
                        parse_mode: "HTML",
                    });
                    (0, vitest_1.expect)(res.messageId).toBe("9");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends audio media as files by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, sendAudio, sendVoice, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    sendAudio = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 10,
                        chat: { id: chatId },
                    });
                    sendVoice = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 11,
                        chat: { id: chatId },
                    });
                    api = { sendAudio: sendAudio, sendVoice: sendVoice };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("audio"),
                        contentType: "audio/mpeg",
                        fileName: "clip.mp3",
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, "caption", {
                            token: "tok",
                            api: api,
                            mediaUrl: "https://example.com/clip.mp3",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendAudio).toHaveBeenCalledWith(chatId, vitest_1.expect.anything(), {
                        caption: "caption",
                        parse_mode: "HTML",
                    });
                    (0, vitest_1.expect)(sendVoice).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends voice messages when asVoice is true and preserves thread params", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, sendAudio, sendVoice, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "-1001234567890";
                    sendAudio = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 12,
                        chat: { id: chatId },
                    });
                    sendVoice = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 13,
                        chat: { id: chatId },
                    });
                    api = { sendAudio: sendAudio, sendVoice: sendVoice };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("voice"),
                        contentType: "audio/ogg",
                        fileName: "note.ogg",
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, "voice note", {
                            token: "tok",
                            api: api,
                            mediaUrl: "https://example.com/note.ogg",
                            asVoice: true,
                            messageThreadId: 271,
                            replyToMessageId: 500,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendVoice).toHaveBeenCalledWith(chatId, vitest_1.expect.anything(), {
                        caption: "voice note",
                        parse_mode: "HTML",
                        message_thread_id: 271,
                        reply_to_message_id: 500,
                    });
                    (0, vitest_1.expect)(sendAudio).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to audio when asVoice is true but media is not voice compatible", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, sendAudio, sendVoice, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    sendAudio = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 14,
                        chat: { id: chatId },
                    });
                    sendVoice = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 15,
                        chat: { id: chatId },
                    });
                    api = { sendAudio: sendAudio, sendVoice: sendVoice };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("audio"),
                        contentType: "audio/mpeg",
                        fileName: "clip.mp3",
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, "caption", {
                            token: "tok",
                            api: api,
                            mediaUrl: "https://example.com/clip.mp3",
                            asVoice: true,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendAudio).toHaveBeenCalledWith(chatId, vitest_1.expect.anything(), {
                        caption: "caption",
                        parse_mode: "HTML",
                    });
                    (0, vitest_1.expect)(sendVoice).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes message_thread_id for forum topic messages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, sendMessage, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "-1001234567890";
                    sendMessage = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 55,
                        chat: { id: chatId },
                    });
                    api = { sendMessage: sendMessage };
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, "hello forum", {
                            token: "tok",
                            api: api,
                            messageThreadId: 271,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith(chatId, "hello forum", {
                        parse_mode: "HTML",
                        message_thread_id: 271,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sets disable_notification when silent is true", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, sendMessage, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    sendMessage = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 1,
                        chat: { id: chatId },
                    });
                    api = { sendMessage: sendMessage };
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, "hi", {
                            token: "tok",
                            api: api,
                            silent: true,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith(chatId, "hi", {
                        parse_mode: "HTML",
                        disable_notification: true,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("parses message_thread_id from recipient string (telegram:group:...:topic:...)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, sendMessage, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "-1001234567890";
                    sendMessage = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 55,
                        chat: { id: chatId },
                    });
                    api = { sendMessage: sendMessage };
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)("telegram:group:".concat(chatId, ":topic:271"), "hello forum", {
                            token: "tok",
                            api: api,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith(chatId, "hello forum", {
                        parse_mode: "HTML",
                        message_thread_id: 271,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes reply_to_message_id for threaded replies", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, sendMessage, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    sendMessage = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 56,
                        chat: { id: chatId },
                    });
                    api = { sendMessage: sendMessage };
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, "reply text", {
                            token: "tok",
                            api: api,
                            replyToMessageId: 100,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith(chatId, "reply text", {
                        parse_mode: "HTML",
                        reply_to_message_id: 100,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes both thread and reply params for forum topic replies", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, sendMessage, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "-1001234567890";
                    sendMessage = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 57,
                        chat: { id: chatId },
                    });
                    api = { sendMessage: sendMessage };
                    return [4 /*yield*/, (0, send_js_1.sendMessageTelegram)(chatId, "forum reply", {
                            token: "tok",
                            api: api,
                            messageThreadId: 271,
                            replyToMessageId: 500,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith(chatId, "forum reply", {
                        parse_mode: "HTML",
                        message_thread_id: 271,
                        reply_to_message_id: 500,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("sendStickerTelegram", function () {
    (0, vitest_1.beforeEach)(function () {
        loadConfig.mockReturnValue({});
        botApi.sendSticker.mockReset();
        botCtorSpy.mockReset();
    });
    (0, vitest_1.it)("sends a sticker by file_id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, fileId, sendSticker, api, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    fileId = "CAACAgIAAxkBAAI...sticker_file_id";
                    sendSticker = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 100,
                        chat: { id: chatId },
                    });
                    api = { sendSticker: sendSticker };
                    return [4 /*yield*/, (0, send_js_1.sendStickerTelegram)(chatId, fileId, {
                            token: "tok",
                            api: api,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(sendSticker).toHaveBeenCalledWith(chatId, fileId, undefined);
                    (0, vitest_1.expect)(res.messageId).toBe("100");
                    (0, vitest_1.expect)(res.chatId).toBe(chatId);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws error when fileId is blank", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, fileId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = ["", "   "];
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    fileId = _a[_i];
                    return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendStickerTelegram)("123", fileId, { token: "tok" })).rejects.toThrow(/file_id is required/i)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes message_thread_id for forum topic messages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, fileId, sendSticker, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "-1001234567890";
                    fileId = "CAACAgIAAxkBAAI...sticker_file_id";
                    sendSticker = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 101,
                        chat: { id: chatId },
                    });
                    api = { sendSticker: sendSticker };
                    return [4 /*yield*/, (0, send_js_1.sendStickerTelegram)(chatId, fileId, {
                            token: "tok",
                            api: api,
                            messageThreadId: 271,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendSticker).toHaveBeenCalledWith(chatId, fileId, {
                        message_thread_id: 271,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes reply_to_message_id for threaded replies", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, fileId, sendSticker, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    fileId = "CAACAgIAAxkBAAI...sticker_file_id";
                    sendSticker = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 102,
                        chat: { id: chatId },
                    });
                    api = { sendSticker: sendSticker };
                    return [4 /*yield*/, (0, send_js_1.sendStickerTelegram)(chatId, fileId, {
                            token: "tok",
                            api: api,
                            replyToMessageId: 500,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendSticker).toHaveBeenCalledWith(chatId, fileId, {
                        reply_to_message_id: 500,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes both thread and reply params for forum topic replies", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, fileId, sendSticker, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "-1001234567890";
                    fileId = "CAACAgIAAxkBAAI...sticker_file_id";
                    sendSticker = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 103,
                        chat: { id: chatId },
                    });
                    api = { sendSticker: sendSticker };
                    return [4 /*yield*/, (0, send_js_1.sendStickerTelegram)(chatId, fileId, {
                            token: "tok",
                            api: api,
                            messageThreadId: 271,
                            replyToMessageId: 500,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendSticker).toHaveBeenCalledWith(chatId, fileId, {
                        message_thread_id: 271,
                        reply_to_message_id: 500,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("normalizes chat ids with internal prefixes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendSticker, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendSticker = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 104,
                        chat: { id: "123" },
                    });
                    api = { sendSticker: sendSticker };
                    return [4 /*yield*/, (0, send_js_1.sendStickerTelegram)("telegram:123", "fileId123", {
                            token: "tok",
                            api: api,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendSticker).toHaveBeenCalledWith("123", "fileId123", undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("parses message_thread_id from recipient string (telegram:group:...:topic:...)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, sendSticker, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "-1001234567890";
                    sendSticker = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 105,
                        chat: { id: chatId },
                    });
                    api = { sendSticker: sendSticker };
                    return [4 /*yield*/, (0, send_js_1.sendStickerTelegram)("telegram:group:".concat(chatId, ":topic:271"), "fileId123", {
                            token: "tok",
                            api: api,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendSticker).toHaveBeenCalledWith(chatId, "fileId123", {
                        message_thread_id: 271,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("wraps chat-not-found with actionable context", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, err, sendSticker, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    err = new Error("400: Bad Request: chat not found");
                    sendSticker = vitest_1.vi.fn().mockRejectedValue(err);
                    api = { sendSticker: sendSticker };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendStickerTelegram)(chatId, "fileId123", { token: "tok", api: api })).rejects.toThrow(/chat not found/i)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendStickerTelegram)(chatId, "fileId123", { token: "tok", api: api })).rejects.toThrow(/chat_id=123/)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("trims whitespace from fileId", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, sendSticker, api;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = "123";
                    sendSticker = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 106,
                        chat: { id: chatId },
                    });
                    api = { sendSticker: sendSticker };
                    return [4 /*yield*/, (0, send_js_1.sendStickerTelegram)(chatId, "  fileId123  ", {
                            token: "tok",
                            api: api,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendSticker).toHaveBeenCalledWith(chatId, "fileId123", undefined);
                    return [2 /*return*/];
            }
        });
    }); });
});
