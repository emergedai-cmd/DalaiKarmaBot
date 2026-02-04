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
var telegram_actions_js_1 = require("./telegram-actions.js");
var reactMessageTelegram = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ ok: true })];
}); }); });
var sendMessageTelegram = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ({
                messageId: "789",
                chatId: "123",
            })];
    });
}); });
var sendStickerTelegram = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ({
                messageId: "456",
                chatId: "123",
            })];
    });
}); });
var deleteMessageTelegram = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ ok: true })];
}); }); });
var originalToken = process.env.TELEGRAM_BOT_TOKEN;
vitest_1.vi.mock("../../telegram/send.js", function () { return ({
    reactMessageTelegram: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return reactMessageTelegram.apply(void 0, args);
    },
    sendMessageTelegram: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return sendMessageTelegram.apply(void 0, args);
    },
    sendStickerTelegram: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return sendStickerTelegram.apply(void 0, args);
    },
    deleteMessageTelegram: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return deleteMessageTelegram.apply(void 0, args);
    },
}); });
(0, vitest_1.describe)("handleTelegramAction", function () {
    (0, vitest_1.beforeEach)(function () {
        reactMessageTelegram.mockClear();
        sendMessageTelegram.mockClear();
        sendStickerTelegram.mockClear();
        deleteMessageTelegram.mockClear();
        process.env.TELEGRAM_BOT_TOKEN = "tok";
    });
    (0, vitest_1.afterEach)(function () {
        if (originalToken === undefined) {
            delete process.env.TELEGRAM_BOT_TOKEN;
        }
        else {
            process.env.TELEGRAM_BOT_TOKEN = originalToken;
        }
    });
    (0, vitest_1.it)("adds reactions when reactionLevel is minimal", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: { telegram: { botToken: "tok", reactionLevel: "minimal" } },
                    };
                    return [4 /*yield*/, (0, telegram_actions_js_1.handleTelegramAction)({
                            action: "react",
                            chatId: "123",
                            messageId: "456",
                            emoji: "✅",
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(reactMessageTelegram).toHaveBeenCalledWith("123", 456, "✅", vitest_1.expect.objectContaining({ token: "tok", remove: false }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds reactions when reactionLevel is extensive", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: { telegram: { botToken: "tok", reactionLevel: "extensive" } },
                    };
                    return [4 /*yield*/, (0, telegram_actions_js_1.handleTelegramAction)({
                            action: "react",
                            chatId: "123",
                            messageId: "456",
                            emoji: "✅",
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(reactMessageTelegram).toHaveBeenCalledWith("123", 456, "✅", vitest_1.expect.objectContaining({ token: "tok", remove: false }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("removes reactions on empty emoji", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: { telegram: { botToken: "tok", reactionLevel: "minimal" } },
                    };
                    return [4 /*yield*/, (0, telegram_actions_js_1.handleTelegramAction)({
                            action: "react",
                            chatId: "123",
                            messageId: "456",
                            emoji: "",
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(reactMessageTelegram).toHaveBeenCalledWith("123", 456, "", vitest_1.expect.objectContaining({ token: "tok", remove: false }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects sticker actions when disabled by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { channels: { telegram: { botToken: "tok" } } };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, telegram_actions_js_1.handleTelegramAction)({
                            action: "sendSticker",
                            to: "123",
                            fileId: "sticker",
                        }, cfg)).rejects.toThrow(/sticker actions are disabled/i)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendStickerTelegram).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends stickers when enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: { telegram: { botToken: "tok", actions: { sticker: true } } },
                    };
                    return [4 /*yield*/, (0, telegram_actions_js_1.handleTelegramAction)({
                            action: "sendSticker",
                            to: "123",
                            fileId: "sticker",
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendStickerTelegram).toHaveBeenCalledWith("123", "sticker", vitest_1.expect.objectContaining({ token: "tok" }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("removes reactions when remove flag set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: { telegram: { botToken: "tok", reactionLevel: "extensive" } },
                    };
                    return [4 /*yield*/, (0, telegram_actions_js_1.handleTelegramAction)({
                            action: "react",
                            chatId: "123",
                            messageId: "456",
                            emoji: "✅",
                            remove: true,
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(reactMessageTelegram).toHaveBeenCalledWith("123", 456, "✅", vitest_1.expect.objectContaining({ token: "tok", remove: true }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks reactions when reactionLevel is off", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: { telegram: { botToken: "tok", reactionLevel: "off" } },
                    };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, telegram_actions_js_1.handleTelegramAction)({
                            action: "react",
                            chatId: "123",
                            messageId: "456",
                            emoji: "✅",
                        }, cfg)).rejects.toThrow(/Telegram agent reactions disabled.*reactionLevel="off"/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks reactions when reactionLevel is ack", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: { telegram: { botToken: "tok", reactionLevel: "ack" } },
                    };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, telegram_actions_js_1.handleTelegramAction)({
                            action: "react",
                            chatId: "123",
                            messageId: "456",
                            emoji: "✅",
                        }, cfg)).rejects.toThrow(/Telegram agent reactions disabled.*reactionLevel="ack"/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("also respects legacy actions.reactions gating", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: {
                            telegram: {
                                botToken: "tok",
                                reactionLevel: "minimal",
                                actions: { reactions: false },
                            },
                        },
                    };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, telegram_actions_js_1.handleTelegramAction)({
                            action: "react",
                            chatId: "123",
                            messageId: "456",
                            emoji: "✅",
                        }, cfg)).rejects.toThrow(/Telegram reactions are disabled via actions.reactions/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends a text message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: { telegram: { botToken: "tok" } },
                    };
                    return [4 /*yield*/, (0, telegram_actions_js_1.handleTelegramAction)({
                            action: "sendMessage",
                            to: "@testchannel",
                            content: "Hello, Telegram!",
                        }, cfg)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(sendMessageTelegram).toHaveBeenCalledWith("@testchannel", "Hello, Telegram!", vitest_1.expect.objectContaining({ token: "tok", mediaUrl: undefined }));
                    (0, vitest_1.expect)(result.content).toContainEqual({
                        type: "text",
                        text: vitest_1.expect.stringContaining('"ok": true'),
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends a message with media", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: { telegram: { botToken: "tok" } },
                    };
                    return [4 /*yield*/, (0, telegram_actions_js_1.handleTelegramAction)({
                            action: "sendMessage",
                            to: "123456",
                            content: "Check this image!",
                            mediaUrl: "https://example.com/image.jpg",
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessageTelegram).toHaveBeenCalledWith("123456", "Check this image!", vitest_1.expect.objectContaining({
                        token: "tok",
                        mediaUrl: "https://example.com/image.jpg",
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes quoteText when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: { telegram: { botToken: "tok" } },
                    };
                    return [4 /*yield*/, (0, telegram_actions_js_1.handleTelegramAction)({
                            action: "sendMessage",
                            to: "123456",
                            content: "Replying now",
                            replyToMessageId: 144,
                            quoteText: "The text you want to quote",
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessageTelegram).toHaveBeenCalledWith("123456", "Replying now", vitest_1.expect.objectContaining({
                        token: "tok",
                        replyToMessageId: 144,
                        quoteText: "The text you want to quote",
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows media-only messages without content", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: { telegram: { botToken: "tok" } },
                    };
                    return [4 /*yield*/, (0, telegram_actions_js_1.handleTelegramAction)({
                            action: "sendMessage",
                            to: "123456",
                            mediaUrl: "https://example.com/note.ogg",
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessageTelegram).toHaveBeenCalledWith("123456", "", vitest_1.expect.objectContaining({
                        token: "tok",
                        mediaUrl: "https://example.com/note.ogg",
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("requires content when no mediaUrl is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: { telegram: { botToken: "tok" } },
                    };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, telegram_actions_js_1.handleTelegramAction)({
                            action: "sendMessage",
                            to: "123456",
                        }, cfg)).rejects.toThrow(/content required/i)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("respects sendMessage gating", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: {
                            telegram: { botToken: "tok", actions: { sendMessage: false } },
                        },
                    };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, telegram_actions_js_1.handleTelegramAction)({
                            action: "sendMessage",
                            to: "@testchannel",
                            content: "Hello!",
                        }, cfg)).rejects.toThrow(/Telegram sendMessage is disabled/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("deletes a message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: { telegram: { botToken: "tok" } },
                    };
                    return [4 /*yield*/, (0, telegram_actions_js_1.handleTelegramAction)({
                            action: "deleteMessage",
                            chatId: "123",
                            messageId: 456,
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(deleteMessageTelegram).toHaveBeenCalledWith("123", 456, vitest_1.expect.objectContaining({ token: "tok" }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("respects deleteMessage gating", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: {
                            telegram: { botToken: "tok", actions: { deleteMessage: false } },
                        },
                    };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, telegram_actions_js_1.handleTelegramAction)({
                            action: "deleteMessage",
                            chatId: "123",
                            messageId: 456,
                        }, cfg)).rejects.toThrow(/Telegram deleteMessage is disabled/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws on missing bot token for sendMessage", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    delete process.env.TELEGRAM_BOT_TOKEN;
                    cfg = {};
                    return [4 /*yield*/, (0, vitest_1.expect)((0, telegram_actions_js_1.handleTelegramAction)({
                            action: "sendMessage",
                            to: "@testchannel",
                            content: "Hello!",
                        }, cfg)).rejects.toThrow(/Telegram bot token missing/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows inline buttons by default (allowlist)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: { telegram: { botToken: "tok" } },
                    };
                    return [4 /*yield*/, (0, telegram_actions_js_1.handleTelegramAction)({
                            action: "sendMessage",
                            to: "@testchannel",
                            content: "Choose",
                            buttons: [[{ text: "Ok", callback_data: "cmd:ok" }]],
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessageTelegram).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks inline buttons when scope is off", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: {
                            telegram: { botToken: "tok", capabilities: { inlineButtons: "off" } },
                        },
                    };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, telegram_actions_js_1.handleTelegramAction)({
                            action: "sendMessage",
                            to: "@testchannel",
                            content: "Choose",
                            buttons: [[{ text: "Ok", callback_data: "cmd:ok" }]],
                        }, cfg)).rejects.toThrow(/inline buttons are disabled/i)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks inline buttons in groups when scope is dm", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: {
                            telegram: { botToken: "tok", capabilities: { inlineButtons: "dm" } },
                        },
                    };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, telegram_actions_js_1.handleTelegramAction)({
                            action: "sendMessage",
                            to: "-100123456",
                            content: "Choose",
                            buttons: [[{ text: "Ok", callback_data: "cmd:ok" }]],
                        }, cfg)).rejects.toThrow(/inline buttons are limited to DMs/i)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows inline buttons in DMs with tg: prefixed targets", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: {
                            telegram: { botToken: "tok", capabilities: { inlineButtons: "dm" } },
                        },
                    };
                    return [4 /*yield*/, (0, telegram_actions_js_1.handleTelegramAction)({
                            action: "sendMessage",
                            to: "tg:5232990709",
                            content: "Choose",
                            buttons: [[{ text: "Ok", callback_data: "cmd:ok" }]],
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessageTelegram).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows inline buttons in groups with topic targets", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: {
                            telegram: { botToken: "tok", capabilities: { inlineButtons: "group" } },
                        },
                    };
                    return [4 /*yield*/, (0, telegram_actions_js_1.handleTelegramAction)({
                            action: "sendMessage",
                            to: "telegram:group:-1001234567890:topic:456",
                            content: "Choose",
                            buttons: [[{ text: "Ok", callback_data: "cmd:ok" }]],
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessageTelegram).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends messages with inline keyboard buttons when enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: {
                            telegram: { botToken: "tok", capabilities: { inlineButtons: "all" } },
                        },
                    };
                    return [4 /*yield*/, (0, telegram_actions_js_1.handleTelegramAction)({
                            action: "sendMessage",
                            to: "@testchannel",
                            content: "Choose",
                            buttons: [[{ text: "  Option A ", callback_data: " cmd:a " }]],
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessageTelegram).toHaveBeenCalledWith("@testchannel", "Choose", vitest_1.expect.objectContaining({
                        buttons: [[{ text: "Option A", callback_data: "cmd:a" }]],
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("readTelegramButtons", function () {
    (0, vitest_1.it)("returns trimmed button rows for valid input", function () {
        var result = (0, telegram_actions_js_1.readTelegramButtons)({
            buttons: [[{ text: "  Option A ", callback_data: " cmd:a " }]],
        });
        (0, vitest_1.expect)(result).toEqual([[{ text: "Option A", callback_data: "cmd:a" }]]);
    });
});
