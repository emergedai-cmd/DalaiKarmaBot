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
var envelope_timestamp_js_1 = require("../../test/helpers/envelope-timestamp.js");
var inbound_dedupe_js_1 = require("../auto-reply/reply/inbound-dedupe.js");
var bot_js_1 = require("./bot.js");
var fetch_js_1 = require("./fetch.js");
var sessionStorePath = vitest_1.vi.hoisted(function () { return ({
    sessionStorePath: "/tmp/openclaw-telegram-throttler-".concat(Math.random().toString(16).slice(2), ".json"),
}); }).sessionStorePath;
var loadWebMedia = vitest_1.vi.hoisted(function () { return ({
    loadWebMedia: vitest_1.vi.fn(),
}); }).loadWebMedia;
vitest_1.vi.mock("../web/media.js", function () { return ({
    loadWebMedia: loadWebMedia,
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
vitest_1.vi.mock("../config/sessions.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { resolveStorePath: vitest_1.vi.fn(function (storePath) { return storePath !== null && storePath !== void 0 ? storePath : sessionStorePath; }) })];
        }
    });
}); });
var _a = vitest_1.vi.hoisted(function () { return ({
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
}); }), readChannelAllowFromStore = _a.readChannelAllowFromStore, upsertChannelPairingRequest = _a.upsertChannelPairingRequest;
vitest_1.vi.mock("../pairing/pairing-store.js", function () { return ({
    readChannelAllowFromStore: readChannelAllowFromStore,
    upsertChannelPairingRequest: upsertChannelPairingRequest,
}); });
var useSpy = vitest_1.vi.fn();
var middlewareUseSpy = vitest_1.vi.fn();
var onSpy = vitest_1.vi.fn();
var stopSpy = vitest_1.vi.fn();
var commandSpy = vitest_1.vi.fn();
var botCtorSpy = vitest_1.vi.fn();
var answerCallbackQuerySpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, undefined];
}); }); });
var sendChatActionSpy = vitest_1.vi.fn();
var setMessageReactionSpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, undefined];
}); }); });
var setMyCommandsSpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, undefined];
}); }); });
var sendMessageSpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ message_id: 77 })];
}); }); });
var sendAnimationSpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ message_id: 78 })];
}); }); });
var sendPhotoSpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ message_id: 79 })];
}); }); });
var apiStub = {
    config: { use: useSpy },
    answerCallbackQuery: answerCallbackQuerySpy,
    sendChatAction: sendChatActionSpy,
    setMessageReaction: setMessageReactionSpy,
    setMyCommands: setMyCommandsSpy,
    sendMessage: sendMessageSpy,
    sendAnimation: sendAnimationSpy,
    sendPhoto: sendPhotoSpy,
};
vitest_1.vi.mock("grammy", function () { return ({
    Bot: /** @class */ (function () {
        function class_1(token, options) {
            this.token = token;
            this.options = options;
            this.api = apiStub;
            this.use = middlewareUseSpy;
            this.on = onSpy;
            this.stop = stopSpy;
            this.command = commandSpy;
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
    webhookCallback: vitest_1.vi.fn(),
}); });
var sequentializeMiddleware = vitest_1.vi.fn();
var sequentializeSpy = vitest_1.vi.fn(function () { return sequentializeMiddleware; });
var sequentializeKey;
vitest_1.vi.mock("@grammyjs/runner", function () { return ({
    sequentialize: function (keyFn) {
        sequentializeKey = keyFn;
        return sequentializeSpy();
    },
}); });
var throttlerSpy = vitest_1.vi.fn(function () { return "throttler"; });
vitest_1.vi.mock("@grammyjs/transformer-throttler", function () { return ({
    apiThrottler: function () { return throttlerSpy(); },
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
var replyModule;
var getOnHandler = function (event) {
    var _a;
    var handler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === event; })) === null || _a === void 0 ? void 0 : _a[1];
    if (!handler) {
        throw new Error("Missing handler for event: ".concat(event));
    }
    return handler;
};
var ORIGINAL_TZ = process.env.TZ;
(0, vitest_1.describe)("createTelegramBot", function () {
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../auto-reply/reply.js"); })];
                case 1:
                    replyModule = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.beforeEach)(function () {
        process.env.TZ = "UTC";
        (0, inbound_dedupe_js_1.resetInboundDedupe)();
        loadConfig.mockReturnValue({
            agents: {
                defaults: {
                    envelopeTimezone: "utc",
                },
            },
            channels: {
                telegram: { dmPolicy: "open", allowFrom: ["*"] },
            },
        });
        loadWebMedia.mockReset();
        sendAnimationSpy.mockReset();
        sendPhotoSpy.mockReset();
        setMessageReactionSpy.mockReset();
        answerCallbackQuerySpy.mockReset();
        setMyCommandsSpy.mockReset();
        middlewareUseSpy.mockReset();
        sequentializeSpy.mockReset();
        botCtorSpy.mockReset();
        sequentializeKey = undefined;
    });
    (0, vitest_1.afterEach)(function () {
        process.env.TZ = ORIGINAL_TZ;
    });
    // groupPolicy tests
    (0, vitest_1.it)("installs grammY throttler", function () {
        (0, bot_js_1.createTelegramBot)({ token: "tok" });
        (0, vitest_1.expect)(throttlerSpy).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(useSpy).toHaveBeenCalledWith("throttler");
    });
    (0, vitest_1.it)("uses wrapped fetch when global fetch is available", function () {
        var _a, _b, _c;
        var originalFetch = globalThis.fetch;
        var fetchSpy = vitest_1.vi.fn();
        globalThis.fetch = fetchSpy;
        try {
            (0, bot_js_1.createTelegramBot)({ token: "tok" });
            var fetchImpl = (0, fetch_js_1.resolveTelegramFetch)();
            (0, vitest_1.expect)(fetchImpl).toBeTypeOf("function");
            (0, vitest_1.expect)(fetchImpl).not.toBe(fetchSpy);
            var clientFetch = (_c = (_b = (_a = botCtorSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.client) === null || _c === void 0 ? void 0 : _c.fetch;
            (0, vitest_1.expect)(clientFetch).toBeTypeOf("function");
            (0, vitest_1.expect)(clientFetch).not.toBe(fetchSpy);
        }
        finally {
            globalThis.fetch = originalFetch;
        }
    });
    (0, vitest_1.it)("passes timeoutSeconds even without a custom fetch", function () {
        loadConfig.mockReturnValue({
            channels: {
                telegram: { dmPolicy: "open", allowFrom: ["*"], timeoutSeconds: 60 },
            },
        });
        (0, bot_js_1.createTelegramBot)({ token: "tok" });
        (0, vitest_1.expect)(botCtorSpy).toHaveBeenCalledWith("tok", vitest_1.expect.objectContaining({
            client: vitest_1.expect.objectContaining({ timeoutSeconds: 60 }),
        }));
    });
    (0, vitest_1.it)("prefers per-account timeoutSeconds overrides", function () {
        loadConfig.mockReturnValue({
            channels: {
                telegram: {
                    dmPolicy: "open",
                    allowFrom: ["*"],
                    timeoutSeconds: 60,
                    accounts: {
                        foo: { timeoutSeconds: 61 },
                    },
                },
            },
        });
        (0, bot_js_1.createTelegramBot)({ token: "tok", accountId: "foo" });
        (0, vitest_1.expect)(botCtorSpy).toHaveBeenCalledWith("tok", vitest_1.expect.objectContaining({
            client: vitest_1.expect.objectContaining({ timeoutSeconds: 61 }),
        }));
    });
    (0, vitest_1.it)("sequentializes updates by chat and thread", function () {
        var _a;
        (0, bot_js_1.createTelegramBot)({ token: "tok" });
        (0, vitest_1.expect)(sequentializeSpy).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(middlewareUseSpy).toHaveBeenCalledWith((_a = sequentializeSpy.mock.results[0]) === null || _a === void 0 ? void 0 : _a.value);
        (0, vitest_1.expect)(sequentializeKey).toBe(bot_js_1.getTelegramSequentialKey);
        (0, vitest_1.expect)((0, bot_js_1.getTelegramSequentialKey)({ message: { chat: { id: 123 } } })).toBe("telegram:123");
        (0, vitest_1.expect)((0, bot_js_1.getTelegramSequentialKey)({
            message: { chat: { id: 123, type: "private" }, message_thread_id: 9 },
        })).toBe("telegram:123:topic:9");
        (0, vitest_1.expect)((0, bot_js_1.getTelegramSequentialKey)({
            message: { chat: { id: 123, type: "supergroup" }, message_thread_id: 9 },
        })).toBe("telegram:123");
        (0, vitest_1.expect)((0, bot_js_1.getTelegramSequentialKey)({
            message: { chat: { id: 123, type: "supergroup", is_forum: true } },
        })).toBe("telegram:123:topic:1");
        (0, vitest_1.expect)((0, bot_js_1.getTelegramSequentialKey)({
            update: { message: { chat: { id: 555 } } },
        })).toBe("telegram:555");
        (0, vitest_1.expect)((0, bot_js_1.getTelegramSequentialKey)({
            message: { chat: { id: 123 }, text: "/stop" },
        })).toBe("telegram:123:control");
        (0, vitest_1.expect)((0, bot_js_1.getTelegramSequentialKey)({
            message: { chat: { id: 123 }, text: "/status" },
        })).toBe("telegram:123:control");
        (0, vitest_1.expect)((0, bot_js_1.getTelegramSequentialKey)({
            message: { chat: { id: 123 }, text: "stop" },
        })).toBe("telegram:123:control");
    });
    (0, vitest_1.it)("routes callback_query payloads as messages and answers callbacks", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, callbackHandler, payload;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    callbackHandler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === "callback_query"; })) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(callbackHandler).toBeDefined();
                    return [4 /*yield*/, callbackHandler({
                            callbackQuery: {
                                id: "cbq-1",
                                data: "cmd:option_a",
                                from: { id: 9, first_name: "Ada", username: "ada_bot" },
                                message: {
                                    chat: { id: 1234, type: "private" },
                                    date: 1736380800,
                                    message_id: 10,
                                },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.Body).toContain("cmd:option_a");
                    (0, vitest_1.expect)(answerCallbackQuerySpy).toHaveBeenCalledWith("cbq-1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("wraps inbound message with Telegram envelope", function () { return __awaiter(void 0, void 0, void 0, function () {
        var originalTz, replySpy, handler, message, payload, expectedTimestamp, timestampPattern;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    originalTz = process.env.TZ;
                    process.env.TZ = "Europe/Vienna";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    (0, vitest_1.expect)(onSpy).toHaveBeenCalledWith("message", vitest_1.expect.any(Function));
                    handler = getOnHandler("message");
                    message = {
                        chat: { id: 1234, type: "private" },
                        text: "hello world",
                        date: 1736380800, // 2025-01-09T00:00:00Z
                        from: {
                            first_name: "Ada",
                            last_name: "Lovelace",
                            username: "ada_bot",
                        },
                    };
                    return [4 /*yield*/, handler({
                            message: message,
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    expectedTimestamp = (0, envelope_timestamp_js_1.formatEnvelopeTimestamp)(new Date("2025-01-09T00:00:00Z"));
                    timestampPattern = (0, envelope_timestamp_js_1.escapeRegExp)(expectedTimestamp);
                    (0, vitest_1.expect)(payload.Body).toMatch(new RegExp("^\\[Telegram Ada Lovelace \\(@ada_bot\\) id:1234 (\\+\\d+[smhd] )?".concat(timestampPattern, "\\]")));
                    (0, vitest_1.expect)(payload.Body).toContain("hello world");
                    return [3 /*break*/, 4];
                case 3:
                    process.env.TZ = originalTz;
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("requests pairing by default for unknown DM senders", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: { telegram: { dmPolicy: "pairing" } },
                    });
                    readChannelAllowFromStore.mockResolvedValue([]);
                    upsertChannelPairingRequest.mockResolvedValue({
                        code: "PAIRME12",
                        created: true,
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 1234, type: "private" },
                                text: "hello",
                                date: 1736380800,
                                from: { id: 999, username: "random" },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _e.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(sendMessageSpy).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)((_a = sendMessageSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]).toBe(1234);
                    (0, vitest_1.expect)(String((_b = sendMessageSpy.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[1])).toContain("Your Telegram user id: 999");
                    (0, vitest_1.expect)(String((_c = sendMessageSpy.mock.calls[0]) === null || _c === void 0 ? void 0 : _c[1])).toContain("Pairing code:");
                    (0, vitest_1.expect)(String((_d = sendMessageSpy.mock.calls[0]) === null || _d === void 0 ? void 0 : _d[1])).toContain("PAIRME12");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not resend pairing code when a request is already pending", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: { telegram: { dmPolicy: "pairing" } },
                    });
                    readChannelAllowFromStore.mockResolvedValue([]);
                    upsertChannelPairingRequest
                        .mockResolvedValueOnce({ code: "PAIRME12", created: true })
                        .mockResolvedValueOnce({ code: "PAIRME12", created: false });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    message = {
                        chat: { id: 1234, type: "private" },
                        text: "hello",
                        date: 1736380800,
                        from: { id: 999, username: "random" },
                    };
                    return [4 /*yield*/, handler({
                            message: message,
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, handler({
                            message: __assign(__assign({}, message), { text: "hello again" }),
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(sendMessageSpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("triggers typing cue via onReplyStart", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    sendChatActionSpy.mockReset();
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: { chat: { id: 42, type: "private" }, text: "hi" },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendChatActionSpy).toHaveBeenCalledWith(42, "typing", undefined);
                    return [2 /*return*/];
            }
        });
    }); });
});
