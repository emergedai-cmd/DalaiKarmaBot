"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var delivery_js_1 = require("./delivery.js");
var loadWebMedia = vitest_1.vi.fn();
vitest_1.vi.mock("../../web/media.js", function () { return ({
    loadWebMedia: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return loadWebMedia.apply(void 0, args);
    },
}); });
vitest_1.vi.mock("grammy", function () { return ({
    InputFile: /** @class */ (function () {
        function class_1(buffer, fileName) {
            this.buffer = buffer;
            this.fileName = fileName;
        }
        return class_1;
    }()),
    GrammyError: /** @class */ (function (_super) {
        __extends(GrammyError, _super);
        function GrammyError() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.description = "";
            return _this;
        }
        return GrammyError;
    }(Error)),
}); });
(0, vitest_1.describe)("deliverReplies", function () {
    (0, vitest_1.beforeEach)(function () {
        loadWebMedia.mockReset();
    });
    (0, vitest_1.it)("skips audioAsVoice-only payloads without logging an error", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, bot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtime = { error: vitest_1.vi.fn() };
                    bot = { api: {} };
                    return [4 /*yield*/, (0, delivery_js_1.deliverReplies)({
                            replies: [{ audioAsVoice: true }],
                            chatId: "123",
                            token: "tok",
                            runtime: runtime,
                            bot: bot,
                            replyToMode: "off",
                            textLimit: 4000,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(runtime.error).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("invokes onVoiceRecording before sending a voice note", function () { return __awaiter(void 0, void 0, void 0, function () {
        var events, runtime, sendVoice, bot, onVoiceRecording;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    events = [];
                    runtime = { error: vitest_1.vi.fn() };
                    sendVoice = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            events.push("sendVoice");
                            return [2 /*return*/, { message_id: 1, chat: { id: "123" } }];
                        });
                    }); });
                    bot = { api: { sendVoice: sendVoice } };
                    onVoiceRecording = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            events.push("recordVoice");
                            return [2 /*return*/];
                        });
                    }); });
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("voice"),
                        contentType: "audio/ogg",
                        fileName: "note.ogg",
                    });
                    return [4 /*yield*/, (0, delivery_js_1.deliverReplies)({
                            replies: [{ mediaUrl: "https://example.com/note.ogg", audioAsVoice: true }],
                            chatId: "123",
                            token: "tok",
                            runtime: runtime,
                            bot: bot,
                            replyToMode: "off",
                            textLimit: 4000,
                            onVoiceRecording: onVoiceRecording,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(onVoiceRecording).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendVoice).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(events).toEqual(["recordVoice", "sendVoice"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("renders markdown in media captions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, sendPhoto, bot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtime = { error: vitest_1.vi.fn(), log: vitest_1.vi.fn() };
                    sendPhoto = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 2,
                        chat: { id: "123" },
                    });
                    bot = { api: { sendPhoto: sendPhoto } };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("image"),
                        contentType: "image/jpeg",
                        fileName: "photo.jpg",
                    });
                    return [4 /*yield*/, (0, delivery_js_1.deliverReplies)({
                            replies: [{ mediaUrl: "https://example.com/photo.jpg", text: "hi **boss**" }],
                            chatId: "123",
                            token: "tok",
                            runtime: runtime,
                            bot: bot,
                            replyToMode: "off",
                            textLimit: 4000,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendPhoto).toHaveBeenCalledWith("123", vitest_1.expect.anything(), vitest_1.expect.objectContaining({
                        caption: "hi <b>boss</b>",
                        parse_mode: "HTML",
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes link_preview_options when linkPreview is false", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, sendMessage, bot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtime = { error: vitest_1.vi.fn(), log: vitest_1.vi.fn() };
                    sendMessage = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 3,
                        chat: { id: "123" },
                    });
                    bot = { api: { sendMessage: sendMessage } };
                    return [4 /*yield*/, (0, delivery_js_1.deliverReplies)({
                            replies: [{ text: "Check https://example.com" }],
                            chatId: "123",
                            token: "tok",
                            runtime: runtime,
                            bot: bot,
                            replyToMode: "off",
                            textLimit: 4000,
                            linkPreview: false,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith("123", vitest_1.expect.any(String), vitest_1.expect.objectContaining({
                        link_preview_options: { is_disabled: true },
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps message_thread_id=1 when allowed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, sendMessage, bot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtime = { error: vitest_1.vi.fn(), log: vitest_1.vi.fn() };
                    sendMessage = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 4,
                        chat: { id: "123" },
                    });
                    bot = { api: { sendMessage: sendMessage } };
                    return [4 /*yield*/, (0, delivery_js_1.deliverReplies)({
                            replies: [{ text: "Hello" }],
                            chatId: "123",
                            token: "tok",
                            runtime: runtime,
                            bot: bot,
                            replyToMode: "off",
                            textLimit: 4000,
                            thread: { id: 1, scope: "dm" },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith("123", vitest_1.expect.any(String), vitest_1.expect.objectContaining({
                        message_thread_id: 1,
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not include link_preview_options when linkPreview is true", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, sendMessage, bot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtime = { error: vitest_1.vi.fn(), log: vitest_1.vi.fn() };
                    sendMessage = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 4,
                        chat: { id: "123" },
                    });
                    bot = { api: { sendMessage: sendMessage } };
                    return [4 /*yield*/, (0, delivery_js_1.deliverReplies)({
                            replies: [{ text: "Check https://example.com" }],
                            chatId: "123",
                            token: "tok",
                            runtime: runtime,
                            bot: bot,
                            replyToMode: "off",
                            textLimit: 4000,
                            linkPreview: true,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith("123", vitest_1.expect.any(String), vitest_1.expect.not.objectContaining({
                        link_preview_options: vitest_1.expect.anything(),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses reply_parameters when quote text is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, sendMessage, bot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtime = { error: vitest_1.vi.fn(), log: vitest_1.vi.fn() };
                    sendMessage = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 10,
                        chat: { id: "123" },
                    });
                    bot = { api: { sendMessage: sendMessage } };
                    return [4 /*yield*/, (0, delivery_js_1.deliverReplies)({
                            replies: [{ text: "Hello there", replyToId: "500" }],
                            chatId: "123",
                            token: "tok",
                            runtime: runtime,
                            bot: bot,
                            replyToMode: "all",
                            textLimit: 4000,
                            replyQuoteText: "quoted text",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith("123", vitest_1.expect.any(String), vitest_1.expect.objectContaining({
                        reply_parameters: {
                            message_id: 500,
                            quote: "quoted text",
                        },
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to text when sendVoice fails with VOICE_MESSAGES_FORBIDDEN", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, sendVoice, sendMessage, bot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtime = { error: vitest_1.vi.fn(), log: vitest_1.vi.fn() };
                    sendVoice = vitest_1.vi
                        .fn()
                        .mockRejectedValue(new Error("GrammyError: Call to 'sendVoice' failed! (400: Bad Request: VOICE_MESSAGES_FORBIDDEN)"));
                    sendMessage = vitest_1.vi.fn().mockResolvedValue({
                        message_id: 5,
                        chat: { id: "123" },
                    });
                    bot = { api: { sendVoice: sendVoice, sendMessage: sendMessage } };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("voice"),
                        contentType: "audio/ogg",
                        fileName: "note.ogg",
                    });
                    return [4 /*yield*/, (0, delivery_js_1.deliverReplies)({
                            replies: [
                                { mediaUrl: "https://example.com/note.ogg", text: "Hello there", audioAsVoice: true },
                            ],
                            chatId: "123",
                            token: "tok",
                            runtime: runtime,
                            bot: bot,
                            replyToMode: "off",
                            textLimit: 4000,
                        })];
                case 1:
                    _a.sent();
                    // Voice was attempted but failed
                    (0, vitest_1.expect)(sendVoice).toHaveBeenCalledTimes(1);
                    // Fallback to text succeeded
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith("123", vitest_1.expect.stringContaining("Hello there"), vitest_1.expect.any(Object));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rethrows non-VOICE_MESSAGES_FORBIDDEN errors from sendVoice", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, sendVoice, sendMessage, bot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtime = { error: vitest_1.vi.fn(), log: vitest_1.vi.fn() };
                    sendVoice = vitest_1.vi.fn().mockRejectedValue(new Error("Network error"));
                    sendMessage = vitest_1.vi.fn();
                    bot = { api: { sendVoice: sendVoice, sendMessage: sendMessage } };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("voice"),
                        contentType: "audio/ogg",
                        fileName: "note.ogg",
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, delivery_js_1.deliverReplies)({
                            replies: [{ mediaUrl: "https://example.com/note.ogg", text: "Hello", audioAsVoice: true }],
                            chatId: "123",
                            token: "tok",
                            runtime: runtime,
                            bot: bot,
                            replyToMode: "off",
                            textLimit: 4000,
                        })).rejects.toThrow("Network error")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendVoice).toHaveBeenCalledTimes(1);
                    // Text fallback should NOT be attempted for other errors
                    (0, vitest_1.expect)(sendMessage).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rethrows VOICE_MESSAGES_FORBIDDEN when no text fallback is available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, sendVoice, sendMessage, bot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtime = { error: vitest_1.vi.fn(), log: vitest_1.vi.fn() };
                    sendVoice = vitest_1.vi
                        .fn()
                        .mockRejectedValue(new Error("GrammyError: Call to 'sendVoice' failed! (400: Bad Request: VOICE_MESSAGES_FORBIDDEN)"));
                    sendMessage = vitest_1.vi.fn();
                    bot = { api: { sendVoice: sendVoice, sendMessage: sendMessage } };
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("voice"),
                        contentType: "audio/ogg",
                        fileName: "note.ogg",
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, delivery_js_1.deliverReplies)({
                            replies: [{ mediaUrl: "https://example.com/note.ogg", audioAsVoice: true }],
                            chatId: "123",
                            token: "tok",
                            runtime: runtime,
                            bot: bot,
                            replyToMode: "off",
                            textLimit: 4000,
                        })).rejects.toThrow("VOICE_MESSAGES_FORBIDDEN")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendVoice).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendMessage).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
