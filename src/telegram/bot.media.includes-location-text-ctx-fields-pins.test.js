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
var inbound_dedupe_js_1 = require("../auto-reply/reply/inbound-dedupe.js");
var useSpy = vitest_1.vi.fn();
var middlewareUseSpy = vitest_1.vi.fn();
var onSpy = vitest_1.vi.fn();
var stopSpy = vitest_1.vi.fn();
var sendChatActionSpy = vitest_1.vi.fn();
var apiStub = {
    config: { use: useSpy },
    sendChatAction: sendChatActionSpy,
    setMyCommands: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, undefined];
    }); }); }),
};
(0, vitest_1.beforeEach)(function () {
    (0, inbound_dedupe_js_1.resetInboundDedupe)();
});
vitest_1.vi.mock("grammy", function () { return ({
    Bot: /** @class */ (function () {
        function class_1(token) {
            this.token = token;
            this.api = apiStub;
            this.use = middlewareUseSpy;
            this.on = onSpy;
            this.command = vitest_1.vi.fn();
            this.stop = stopSpy;
            this.catch = vitest_1.vi.fn();
        }
        return class_1;
    }()),
    InputFile: /** @class */ (function () {
        function InputFile() {
        }
        return InputFile;
    }()),
    webhookCallback: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("@grammyjs/runner", function () { return ({
    sequentialize: function () { return vitest_1.vi.fn(); },
}); });
var throttlerSpy = vitest_1.vi.fn(function () { return "throttler"; });
vitest_1.vi.mock("@grammyjs/transformer-throttler", function () { return ({
    apiThrottler: function () { return throttlerSpy(); },
}); });
vitest_1.vi.mock("../media/store.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { saveMediaBuffer: vitest_1.vi.fn(function (buffer, contentType) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        id: "media",
                                        path: "/tmp/telegram-media",
                                        size: buffer.byteLength,
                                        contentType: contentType !== null && contentType !== void 0 ? contentType : "application/octet-stream",
                                    })];
                            });
                        }); }) })];
        }
    });
}); });
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: function () { return ({
                            channels: { telegram: { dmPolicy: "open", allowFrom: ["*"] } },
                        }); } })];
        }
    });
}); });
vitest_1.vi.mock("../config/sessions.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { updateLastRoute: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }) })];
        }
    });
}); });
vitest_1.vi.mock("../pairing/pairing-store.js", function () { return ({
    readChannelAllowFromStore: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, []];
    }); }); }),
    upsertChannelPairingRequest: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    code: "PAIRCODE",
                    created: true,
                })];
        });
    }); }),
}); });
vitest_1.vi.mock("../auto-reply/reply.js", function () {
    var replySpy = vitest_1.vi.fn(function (_ctx, opts) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ((_a = opts === null || opts === void 0 ? void 0 : opts.onReplyStart) === null || _a === void 0 ? void 0 : _a.call(opts))];
                case 1:
                    _b.sent();
                    return [2 /*return*/, undefined];
            }
        });
    }); });
    return { getReplyFromConfig: replySpy, __replySpy: replySpy };
});
(0, vitest_1.describe)("telegram inbound media", function () {
    var _INBOUND_MEDIA_TEST_TIMEOUT_MS = process.platform === "win32" ? 30000 : 20000;
    (0, vitest_1.it)("includes location text and ctx fields for pins", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createTelegramBot, replyModule, replySpy, handler, payload;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./bot.js"); })];
                case 1:
                    createTelegramBot = (_b.sent()).createTelegramBot;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../auto-reply/reply.js"); })];
                case 2:
                    replyModule = _b.sent();
                    replySpy = replyModule.__replySpy;
                    onSpy.mockReset();
                    replySpy.mockReset();
                    createTelegramBot({ token: "tok" });
                    handler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === "message"; })) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(handler).toBeDefined();
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 42, type: "private" },
                                message_id: 5,
                                caption: "Meet here",
                                date: 1736380800,
                                location: {
                                    latitude: 48.858844,
                                    longitude: 2.294351,
                                    horizontal_accuracy: 12,
                                },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ file_path: "unused" })];
                            }); }); },
                        })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.Body).toContain("Meet here");
                    (0, vitest_1.expect)(payload.Body).toContain("48.858844");
                    (0, vitest_1.expect)(payload.LocationLat).toBe(48.858844);
                    (0, vitest_1.expect)(payload.LocationLon).toBe(2.294351);
                    (0, vitest_1.expect)(payload.LocationSource).toBe("pin");
                    (0, vitest_1.expect)(payload.LocationIsLive).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); }, _INBOUND_MEDIA_TEST_TIMEOUT_MS);
    (0, vitest_1.it)("captures venue fields for named places", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createTelegramBot, replyModule, replySpy, handler, payload;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./bot.js"); })];
                case 1:
                    createTelegramBot = (_b.sent()).createTelegramBot;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../auto-reply/reply.js"); })];
                case 2:
                    replyModule = _b.sent();
                    replySpy = replyModule.__replySpy;
                    onSpy.mockReset();
                    replySpy.mockReset();
                    createTelegramBot({ token: "tok" });
                    handler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === "message"; })) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(handler).toBeDefined();
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 42, type: "private" },
                                message_id: 6,
                                date: 1736380800,
                                venue: {
                                    title: "Eiffel Tower",
                                    address: "Champ de Mars, Paris",
                                    location: { latitude: 48.858844, longitude: 2.294351 },
                                },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ file_path: "unused" })];
                            }); }); },
                        })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.Body).toContain("Eiffel Tower");
                    (0, vitest_1.expect)(payload.LocationName).toBe("Eiffel Tower");
                    (0, vitest_1.expect)(payload.LocationAddress).toBe("Champ de Mars, Paris");
                    (0, vitest_1.expect)(payload.LocationSource).toBe("place");
                    return [2 /*return*/];
            }
        });
    }); }, _INBOUND_MEDIA_TEST_TIMEOUT_MS);
});
