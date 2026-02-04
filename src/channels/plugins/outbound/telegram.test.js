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
(0, vitest_1.describe)("telegramOutbound.sendPayload", function () {
    (0, vitest_1.it)("sends text payload with buttons", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendTelegram, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sendTelegram = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ messageId: "m1", chatId: "c1" })];
                    }); }); });
                    return [4 /*yield*/, ((_a = telegram_js_1.telegramOutbound.sendPayload) === null || _a === void 0 ? void 0 : _a.call(telegram_js_1.telegramOutbound, {
                            cfg: {},
                            to: "telegram:123",
                            text: "ignored",
                            payload: {
                                text: "Hello",
                                channelData: {
                                    telegram: {
                                        buttons: [[{ text: "Option", callback_data: "/option" }]],
                                    },
                                },
                            },
                            deps: { sendTelegram: sendTelegram },
                        }))];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(sendTelegram).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendTelegram).toHaveBeenCalledWith("telegram:123", "Hello", vitest_1.expect.objectContaining({
                        buttons: [[{ text: "Option", callback_data: "/option" }]],
                        textMode: "html",
                    }));
                    (0, vitest_1.expect)(result).toEqual({ channel: "telegram", messageId: "m1", chatId: "c1" });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends media payloads and attaches buttons only to first", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendTelegram, result, secondOpts;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    sendTelegram = vitest_1.vi
                        .fn()
                        .mockResolvedValueOnce({ messageId: "m1", chatId: "c1" })
                        .mockResolvedValueOnce({ messageId: "m2", chatId: "c1" });
                    return [4 /*yield*/, ((_a = telegram_js_1.telegramOutbound.sendPayload) === null || _a === void 0 ? void 0 : _a.call(telegram_js_1.telegramOutbound, {
                            cfg: {},
                            to: "telegram:123",
                            text: "ignored",
                            payload: {
                                text: "Caption",
                                mediaUrls: ["https://example.com/a.png", "https://example.com/b.png"],
                                channelData: {
                                    telegram: {
                                        buttons: [[{ text: "Go", callback_data: "/go" }]],
                                    },
                                },
                            },
                            deps: { sendTelegram: sendTelegram },
                        }))];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(sendTelegram).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(sendTelegram).toHaveBeenNthCalledWith(1, "telegram:123", "Caption", vitest_1.expect.objectContaining({
                        mediaUrl: "https://example.com/a.png",
                        buttons: [[{ text: "Go", callback_data: "/go" }]],
                    }));
                    secondOpts = (_b = sendTelegram.mock.calls[1]) === null || _b === void 0 ? void 0 : _b[2];
                    (0, vitest_1.expect)(sendTelegram).toHaveBeenNthCalledWith(2, "telegram:123", "", vitest_1.expect.objectContaining({
                        mediaUrl: "https://example.com/b.png",
                    }));
                    (0, vitest_1.expect)(secondOpts === null || secondOpts === void 0 ? void 0 : secondOpts.buttons).toBeUndefined();
                    (0, vitest_1.expect)(result).toEqual({ channel: "telegram", messageId: "m2", chatId: "c1" });
                    return [2 /*return*/];
            }
        });
    }); });
});
