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
var telegram_js_1 = require("./telegram.js");
var handleTelegramAction = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ ok: true })];
}); }); });
vitest_1.vi.mock("../../../agents/tools/telegram-actions.js", function () { return ({
    handleTelegramAction: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return handleTelegramAction.apply(void 0, args);
    },
}); });
(0, vitest_1.describe)("telegramMessageActions", function () {
    (0, vitest_1.it)("excludes sticker actions when not enabled", function () {
        var cfg = { channels: { telegram: { botToken: "tok" } } };
        var actions = telegram_js_1.telegramMessageActions.listActions({ cfg: cfg });
        (0, vitest_1.expect)(actions).not.toContain("sticker");
        (0, vitest_1.expect)(actions).not.toContain("sticker-search");
    });
    (0, vitest_1.it)("allows media-only sends and passes asVoice", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handleTelegramAction.mockClear();
                    cfg = { channels: { telegram: { botToken: "tok" } } };
                    return [4 /*yield*/, telegram_js_1.telegramMessageActions.handleAction({
                            action: "send",
                            params: {
                                to: "123",
                                media: "https://example.com/voice.ogg",
                                asVoice: true,
                            },
                            cfg: cfg,
                            accountId: undefined,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(handleTelegramAction).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        action: "sendMessage",
                        to: "123",
                        content: "",
                        mediaUrl: "https://example.com/voice.ogg",
                        asVoice: true,
                    }), cfg);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes silent flag for silent sends", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handleTelegramAction.mockClear();
                    cfg = { channels: { telegram: { botToken: "tok" } } };
                    return [4 /*yield*/, telegram_js_1.telegramMessageActions.handleAction({
                            action: "send",
                            params: {
                                to: "456",
                                message: "Silent notification test",
                                silent: true,
                            },
                            cfg: cfg,
                            accountId: undefined,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(handleTelegramAction).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        action: "sendMessage",
                        to: "456",
                        content: "Silent notification test",
                        silent: true,
                    }), cfg);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("maps edit action params into editMessage", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handleTelegramAction.mockClear();
                    cfg = { channels: { telegram: { botToken: "tok" } } };
                    return [4 /*yield*/, telegram_js_1.telegramMessageActions.handleAction({
                            action: "edit",
                            params: {
                                chatId: "123",
                                messageId: 42,
                                message: "Updated",
                                buttons: [],
                            },
                            cfg: cfg,
                            accountId: undefined,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(handleTelegramAction).toHaveBeenCalledWith({
                        action: "editMessage",
                        chatId: "123",
                        messageId: 42,
                        content: "Updated",
                        buttons: [],
                        accountId: undefined,
                    }, cfg);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects non-integer messageId for edit before reaching telegram-actions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handleTelegramAction.mockClear();
                    cfg = { channels: { telegram: { botToken: "tok" } } };
                    return [4 /*yield*/, (0, vitest_1.expect)(telegram_js_1.telegramMessageActions.handleAction({
                            action: "edit",
                            params: {
                                chatId: "123",
                                messageId: "nope",
                                message: "Updated",
                            },
                            cfg: cfg,
                            accountId: undefined,
                        })).rejects.toThrow()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(handleTelegramAction).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts numeric messageId and channelId for reactions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    handleTelegramAction.mockClear();
                    cfg = { channels: { telegram: { botToken: "tok" } } };
                    return [4 /*yield*/, telegram_js_1.telegramMessageActions.handleAction({
                            action: "react",
                            params: {
                                channelId: 123,
                                messageId: 456,
                                emoji: "ok",
                            },
                            cfg: cfg,
                            accountId: undefined,
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(handleTelegramAction).toHaveBeenCalledTimes(1);
                    call = (_a = handleTelegramAction.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call.action).toBe("react");
                    (0, vitest_1.expect)(String(call.chatId)).toBe("123");
                    (0, vitest_1.expect)(String(call.messageId)).toBe("456");
                    (0, vitest_1.expect)(call.emoji).toBe("ok");
                    return [2 /*return*/];
            }
        });
    }); });
});
