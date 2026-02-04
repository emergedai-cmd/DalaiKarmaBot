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
var ssrf = require("../infra/net/ssrf.js");
var bot_updates_js_1 = require("./bot-updates.js");
var useSpy = vitest_1.vi.fn();
var middlewareUseSpy = vitest_1.vi.fn();
var onSpy = vitest_1.vi.fn();
var stopSpy = vitest_1.vi.fn();
var sendChatActionSpy = vitest_1.vi.fn();
var cacheStickerSpy = vitest_1.vi.fn();
var getCachedStickerSpy = vitest_1.vi.fn();
var describeStickerImageSpy = vitest_1.vi.fn();
var resolvePinnedHostname = ssrf.resolvePinnedHostname;
var lookupMock = vitest_1.vi.fn();
var resolvePinnedHostnameSpy = null;
var apiStub = {
    config: { use: useSpy },
    sendChatAction: sendChatActionSpy,
    setMyCommands: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, undefined];
    }); }); }),
};
(0, vitest_1.beforeEach)(function () {
    vitest_1.vi.useRealTimers();
    (0, inbound_dedupe_js_1.resetInboundDedupe)();
    lookupMock.mockResolvedValue([{ address: "93.184.216.34", family: 4 }]);
    resolvePinnedHostnameSpy = vitest_1.vi
        .spyOn(ssrf, "resolvePinnedHostname")
        .mockImplementation(function (hostname) { return resolvePinnedHostname(hostname, lookupMock); });
});
(0, vitest_1.afterEach)(function () {
    lookupMock.mockReset();
    resolvePinnedHostnameSpy === null || resolvePinnedHostnameSpy === void 0 ? void 0 : resolvePinnedHostnameSpy.mockRestore();
    resolvePinnedHostnameSpy = null;
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
vitest_1.vi.mock("./sticker-cache.js", function () { return ({
    cacheSticker: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return cacheStickerSpy.apply(void 0, args);
    },
    getCachedSticker: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return getCachedStickerSpy.apply(void 0, args);
    },
    describeStickerImage: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return describeStickerImageSpy.apply(void 0, args);
    },
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
    // Parallel vitest shards can make this suite slower than the standalone run.
    var INBOUND_MEDIA_TEST_TIMEOUT_MS = process.platform === "win32" ? 60000 : 45000;
    (0, vitest_1.it)("downloads media via file_path (no file.download)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createTelegramBot, replyModule, replySpy, runtimeLog, runtimeError, handler, fetchSpy, payload;
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
                    sendChatActionSpy.mockReset();
                    runtimeLog = vitest_1.vi.fn();
                    runtimeError = vitest_1.vi.fn();
                    createTelegramBot({
                        token: "tok",
                        runtime: {
                            log: runtimeLog,
                            error: runtimeError,
                            exit: function () {
                                throw new Error("exit");
                            },
                        },
                    });
                    handler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === "message"; })) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(handler).toBeDefined();
                    fetchSpy = vitest_1.vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
                        ok: true,
                        status: 200,
                        statusText: "OK",
                        headers: { get: function () { return "image/jpeg"; } },
                        arrayBuffer: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, new Uint8Array([0xff, 0xd8, 0xff, 0x00]).buffer];
                        }); }); },
                    });
                    return [4 /*yield*/, handler({
                            message: {
                                message_id: 1,
                                chat: { id: 1234, type: "private" },
                                photo: [{ file_id: "fid" }],
                                date: 1736380800, // 2025-01-09T00:00:00Z
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ file_path: "photos/1.jpg" })];
                            }); }); },
                        })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(runtimeError).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(fetchSpy).toHaveBeenCalledWith("https://api.telegram.org/file/bottok/photos/1.jpg", vitest_1.expect.objectContaining({ redirect: "manual" }));
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.Body).toContain("<media:image>");
                    fetchSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); }, INBOUND_MEDIA_TEST_TIMEOUT_MS);
    (0, vitest_1.it)("prefers proxyFetch over global fetch", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createTelegramBot, runtimeLog, runtimeError, globalFetchSpy, proxyFetch, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./bot.js"); })];
                case 1:
                    createTelegramBot = (_b.sent()).createTelegramBot;
                    onSpy.mockReset();
                    runtimeLog = vitest_1.vi.fn();
                    runtimeError = vitest_1.vi.fn();
                    globalFetchSpy = vitest_1.vi.spyOn(globalThis, "fetch").mockImplementation(function () {
                        throw new Error("global fetch should not be called");
                    });
                    proxyFetch = vitest_1.vi.fn().mockResolvedValueOnce({
                        ok: true,
                        status: 200,
                        statusText: "OK",
                        headers: { get: function () { return "image/jpeg"; } },
                        arrayBuffer: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, new Uint8Array([0xff, 0xd8, 0xff]).buffer];
                        }); }); },
                    });
                    createTelegramBot({
                        token: "tok",
                        proxyFetch: proxyFetch,
                        runtime: {
                            log: runtimeLog,
                            error: runtimeError,
                            exit: function () {
                                throw new Error("exit");
                            },
                        },
                    });
                    handler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === "message"; })) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(handler).toBeDefined();
                    return [4 /*yield*/, handler({
                            message: {
                                message_id: 2,
                                chat: { id: 1234, type: "private" },
                                photo: [{ file_id: "fid" }],
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ file_path: "photos/2.jpg" })];
                            }); }); },
                        })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(runtimeError).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(proxyFetch).toHaveBeenCalledWith("https://api.telegram.org/file/bottok/photos/2.jpg", vitest_1.expect.objectContaining({ redirect: "manual" }));
                    globalFetchSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("logs a handler error when getFile returns no file_path", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createTelegramBot, replyModule, replySpy, runtimeLog, runtimeError, fetchSpy, handler, msg;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./bot.js"); })];
                case 1:
                    createTelegramBot = (_d.sent()).createTelegramBot;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../auto-reply/reply.js"); })];
                case 2:
                    replyModule = _d.sent();
                    replySpy = replyModule.__replySpy;
                    onSpy.mockReset();
                    replySpy.mockReset();
                    runtimeLog = vitest_1.vi.fn();
                    runtimeError = vitest_1.vi.fn();
                    fetchSpy = vitest_1.vi.spyOn(globalThis, "fetch");
                    createTelegramBot({
                        token: "tok",
                        runtime: {
                            log: runtimeLog,
                            error: runtimeError,
                            exit: function () {
                                throw new Error("exit");
                            },
                        },
                    });
                    handler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === "message"; })) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(handler).toBeDefined();
                    return [4 /*yield*/, handler({
                            message: {
                                message_id: 3,
                                chat: { id: 1234, type: "private" },
                                photo: [{ file_id: "fid" }],
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({})];
                            }); }); },
                        })];
                case 3:
                    _d.sent();
                    (0, vitest_1.expect)(fetchSpy).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(runtimeError).toHaveBeenCalledTimes(1);
                    msg = String((_c = (_b = runtimeError.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : "");
                    (0, vitest_1.expect)(msg).toContain("handler failed:");
                    (0, vitest_1.expect)(msg).toContain("file_path");
                    fetchSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("telegram media groups", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.useFakeTimers();
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
    });
    var MEDIA_GROUP_TEST_TIMEOUT_MS = process.platform === "win32" ? 45000 : 20000;
    var MEDIA_GROUP_FLUSH_MS = bot_updates_js_1.MEDIA_GROUP_TIMEOUT_MS + 25;
    (0, vitest_1.it)("buffers messages with same media_group_id and processes them together", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createTelegramBot, replyModule, replySpy, runtimeError, fetchSpy, handler, first, second, payload;
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
                    runtimeError = vitest_1.vi.fn();
                    fetchSpy = vitest_1.vi.spyOn(globalThis, "fetch").mockResolvedValue({
                        ok: true,
                        status: 200,
                        statusText: "OK",
                        headers: { get: function () { return "image/png"; } },
                        arrayBuffer: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer];
                        }); }); },
                    });
                    createTelegramBot({
                        token: "tok",
                        runtime: {
                            log: vitest_1.vi.fn(),
                            error: runtimeError,
                            exit: function () {
                                throw new Error("exit");
                            },
                        },
                    });
                    handler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === "message"; })) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(handler).toBeDefined();
                    first = handler({
                        message: {
                            chat: { id: 42, type: "private" },
                            message_id: 1,
                            caption: "Here are my photos",
                            date: 1736380800,
                            media_group_id: "album123",
                            photo: [{ file_id: "photo1" }],
                        },
                        me: { username: "openclaw_bot" },
                        getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ file_path: "photos/photo1.jpg" })];
                        }); }); },
                    });
                    second = handler({
                        message: {
                            chat: { id: 42, type: "private" },
                            message_id: 2,
                            date: 1736380801,
                            media_group_id: "album123",
                            photo: [{ file_id: "photo2" }],
                        },
                        me: { username: "openclaw_bot" },
                        getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ file_path: "photos/photo2.jpg" })];
                        }); }); },
                    });
                    return [4 /*yield*/, first];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, second];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(MEDIA_GROUP_FLUSH_MS)];
                case 5:
                    _b.sent();
                    (0, vitest_1.expect)(runtimeError).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.Body).toContain("Here are my photos");
                    (0, vitest_1.expect)(payload.MediaPaths).toHaveLength(2);
                    fetchSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); }, MEDIA_GROUP_TEST_TIMEOUT_MS);
    (0, vitest_1.it)("processes separate media groups independently", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createTelegramBot, replyModule, replySpy, fetchSpy, handler, first, second;
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
                    fetchSpy = vitest_1.vi.spyOn(globalThis, "fetch").mockResolvedValue({
                        ok: true,
                        status: 200,
                        statusText: "OK",
                        headers: { get: function () { return "image/png"; } },
                        arrayBuffer: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer];
                        }); }); },
                    });
                    createTelegramBot({ token: "tok" });
                    handler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === "message"; })) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(handler).toBeDefined();
                    first = handler({
                        message: {
                            chat: { id: 42, type: "private" },
                            message_id: 1,
                            caption: "Album A",
                            date: 1736380800,
                            media_group_id: "albumA",
                            photo: [{ file_id: "photoA1" }],
                        },
                        me: { username: "openclaw_bot" },
                        getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ file_path: "photos/photoA1.jpg" })];
                        }); }); },
                    });
                    second = handler({
                        message: {
                            chat: { id: 42, type: "private" },
                            message_id: 2,
                            caption: "Album B",
                            date: 1736380801,
                            media_group_id: "albumB",
                            photo: [{ file_id: "photoB1" }],
                        },
                        me: { username: "openclaw_bot" },
                        getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ file_path: "photos/photoB1.jpg" })];
                        }); }); },
                    });
                    return [4 /*yield*/, Promise.all([first, second])];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(MEDIA_GROUP_FLUSH_MS)];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(2);
                    fetchSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); }, MEDIA_GROUP_TEST_TIMEOUT_MS);
});
(0, vitest_1.describe)("telegram stickers", function () {
    var STICKER_TEST_TIMEOUT_MS = process.platform === "win32" ? 30000 : 20000;
    (0, vitest_1.beforeEach)(function () {
        cacheStickerSpy.mockReset();
        getCachedStickerSpy.mockReset();
        describeStickerImageSpy.mockReset();
    });
    (0, vitest_1.it)("downloads static sticker (WEBP) and includes sticker metadata", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createTelegramBot, replyModule, replySpy, runtimeLog, runtimeError, handler, fetchSpy, payload;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./bot.js"); })];
                case 1:
                    createTelegramBot = (_e.sent()).createTelegramBot;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../auto-reply/reply.js"); })];
                case 2:
                    replyModule = _e.sent();
                    replySpy = replyModule.__replySpy;
                    onSpy.mockReset();
                    replySpy.mockReset();
                    sendChatActionSpy.mockReset();
                    runtimeLog = vitest_1.vi.fn();
                    runtimeError = vitest_1.vi.fn();
                    createTelegramBot({
                        token: "tok",
                        runtime: {
                            log: runtimeLog,
                            error: runtimeError,
                            exit: function () {
                                throw new Error("exit");
                            },
                        },
                    });
                    handler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === "message"; })) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(handler).toBeDefined();
                    fetchSpy = vitest_1.vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
                        ok: true,
                        status: 200,
                        statusText: "OK",
                        headers: { get: function () { return "image/webp"; } },
                        arrayBuffer: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, new Uint8Array([0x52, 0x49, 0x46, 0x46]).buffer];
                        }); }); }, // RIFF header
                    });
                    return [4 /*yield*/, handler({
                            message: {
                                message_id: 100,
                                chat: { id: 1234, type: "private" },
                                sticker: {
                                    file_id: "sticker_file_id_123",
                                    file_unique_id: "sticker_unique_123",
                                    type: "regular",
                                    width: 512,
                                    height: 512,
                                    is_animated: false,
                                    is_video: false,
                                    emoji: "🎉",
                                    set_name: "TestStickerPack",
                                },
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ file_path: "stickers/sticker.webp" })];
                            }); }); },
                        })];
                case 3:
                    _e.sent();
                    (0, vitest_1.expect)(runtimeError).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(fetchSpy).toHaveBeenCalledWith("https://api.telegram.org/file/bottok/stickers/sticker.webp", vitest_1.expect.objectContaining({ redirect: "manual" }));
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.Body).toContain("<media:sticker>");
                    (0, vitest_1.expect)((_b = payload.Sticker) === null || _b === void 0 ? void 0 : _b.emoji).toBe("🎉");
                    (0, vitest_1.expect)((_c = payload.Sticker) === null || _c === void 0 ? void 0 : _c.setName).toBe("TestStickerPack");
                    (0, vitest_1.expect)((_d = payload.Sticker) === null || _d === void 0 ? void 0 : _d.fileId).toBe("sticker_file_id_123");
                    fetchSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); }, STICKER_TEST_TIMEOUT_MS);
    (0, vitest_1.it)("refreshes cached sticker metadata on cache hit", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createTelegramBot, replyModule, replySpy, runtimeError, handler, fetchSpy, payload;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./bot.js"); })];
                case 1:
                    createTelegramBot = (_d.sent()).createTelegramBot;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../auto-reply/reply.js"); })];
                case 2:
                    replyModule = _d.sent();
                    replySpy = replyModule.__replySpy;
                    onSpy.mockReset();
                    replySpy.mockReset();
                    sendChatActionSpy.mockReset();
                    getCachedStickerSpy.mockReturnValue({
                        fileId: "old_file_id",
                        fileUniqueId: "sticker_unique_456",
                        emoji: "😴",
                        setName: "OldSet",
                        description: "Cached description",
                        cachedAt: "2026-01-20T10:00:00.000Z",
                    });
                    runtimeError = vitest_1.vi.fn();
                    createTelegramBot({
                        token: "tok",
                        runtime: {
                            log: vitest_1.vi.fn(),
                            error: runtimeError,
                            exit: function () {
                                throw new Error("exit");
                            },
                        },
                    });
                    handler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === "message"; })) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(handler).toBeDefined();
                    fetchSpy = vitest_1.vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
                        ok: true,
                        status: 200,
                        statusText: "OK",
                        headers: { get: function () { return "image/webp"; } },
                        arrayBuffer: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, new Uint8Array([0x52, 0x49, 0x46, 0x46]).buffer];
                        }); }); },
                    });
                    return [4 /*yield*/, handler({
                            message: {
                                message_id: 103,
                                chat: { id: 1234, type: "private" },
                                sticker: {
                                    file_id: "new_file_id",
                                    file_unique_id: "sticker_unique_456",
                                    type: "regular",
                                    width: 512,
                                    height: 512,
                                    is_animated: false,
                                    is_video: false,
                                    emoji: "🔥",
                                    set_name: "NewSet",
                                },
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ file_path: "stickers/sticker.webp" })];
                            }); }); },
                        })];
                case 3:
                    _d.sent();
                    (0, vitest_1.expect)(runtimeError).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(cacheStickerSpy).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        fileId: "new_file_id",
                        emoji: "🔥",
                        setName: "NewSet",
                    }));
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)((_b = payload.Sticker) === null || _b === void 0 ? void 0 : _b.fileId).toBe("new_file_id");
                    (0, vitest_1.expect)((_c = payload.Sticker) === null || _c === void 0 ? void 0 : _c.cachedDescription).toBe("Cached description");
                    fetchSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); }, STICKER_TEST_TIMEOUT_MS);
    (0, vitest_1.it)("skips animated stickers (TGS format)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createTelegramBot, replyModule, replySpy, runtimeError, fetchSpy, handler;
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
                    runtimeError = vitest_1.vi.fn();
                    fetchSpy = vitest_1.vi.spyOn(globalThis, "fetch");
                    createTelegramBot({
                        token: "tok",
                        runtime: {
                            log: vitest_1.vi.fn(),
                            error: runtimeError,
                            exit: function () {
                                throw new Error("exit");
                            },
                        },
                    });
                    handler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === "message"; })) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(handler).toBeDefined();
                    return [4 /*yield*/, handler({
                            message: {
                                message_id: 101,
                                chat: { id: 1234, type: "private" },
                                sticker: {
                                    file_id: "animated_sticker_id",
                                    file_unique_id: "animated_unique",
                                    type: "regular",
                                    width: 512,
                                    height: 512,
                                    is_animated: true, // TGS format
                                    is_video: false,
                                    emoji: "😎",
                                    set_name: "AnimatedPack",
                                },
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ file_path: "stickers/animated.tgs" })];
                            }); }); },
                        })];
                case 3:
                    _b.sent();
                    // Should not attempt to download animated stickers
                    (0, vitest_1.expect)(fetchSpy).not.toHaveBeenCalled();
                    // Should still process the message (as text-only, no media)
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled(); // No text content, so no reply generated
                    (0, vitest_1.expect)(runtimeError).not.toHaveBeenCalled();
                    fetchSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); }, STICKER_TEST_TIMEOUT_MS);
    (0, vitest_1.it)("skips video stickers (WEBM format)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createTelegramBot, replyModule, replySpy, runtimeError, fetchSpy, handler;
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
                    runtimeError = vitest_1.vi.fn();
                    fetchSpy = vitest_1.vi.spyOn(globalThis, "fetch");
                    createTelegramBot({
                        token: "tok",
                        runtime: {
                            log: vitest_1.vi.fn(),
                            error: runtimeError,
                            exit: function () {
                                throw new Error("exit");
                            },
                        },
                    });
                    handler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === "message"; })) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(handler).toBeDefined();
                    return [4 /*yield*/, handler({
                            message: {
                                message_id: 102,
                                chat: { id: 1234, type: "private" },
                                sticker: {
                                    file_id: "video_sticker_id",
                                    file_unique_id: "video_unique",
                                    type: "regular",
                                    width: 512,
                                    height: 512,
                                    is_animated: false,
                                    is_video: true, // WEBM format
                                    emoji: "🎬",
                                    set_name: "VideoPack",
                                },
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ file_path: "stickers/video.webm" })];
                            }); }); },
                        })];
                case 3:
                    _b.sent();
                    // Should not attempt to download video stickers
                    (0, vitest_1.expect)(fetchSpy).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(runtimeError).not.toHaveBeenCalled();
                    fetchSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); }, STICKER_TEST_TIMEOUT_MS);
});
(0, vitest_1.describe)("telegram text fragments", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.useFakeTimers();
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
    });
    var TEXT_FRAGMENT_TEST_TIMEOUT_MS = process.platform === "win32" ? 45000 : 20000;
    var TEXT_FRAGMENT_FLUSH_MS = 1600;
    (0, vitest_1.it)("buffers near-limit text and processes sequential parts as one message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createTelegramBot, replyModule, replySpy, handler, part1, part2, payload;
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
                    part1 = "A".repeat(4050);
                    part2 = "B".repeat(50);
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 42, type: "private" },
                                message_id: 10,
                                date: 1736380800,
                                text: part1,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({})];
                            }); }); },
                        })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 42, type: "private" },
                                message_id: 11,
                                date: 1736380801,
                                text: part2,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({})];
                            }); }); },
                        })];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(TEXT_FRAGMENT_FLUSH_MS)];
                case 5:
                    _b.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.RawBody).toContain(part1.slice(0, 32));
                    (0, vitest_1.expect)(payload.RawBody).toContain(part2.slice(0, 32));
                    return [2 /*return*/];
            }
        });
    }); }, TEXT_FRAGMENT_TEST_TIMEOUT_MS);
});
