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
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var inbound_dedupe_js_1 = require("../auto-reply/reply/inbound-dedupe.js");
var bot_js_1 = require("./bot.js");
var sessionStorePath = vitest_1.vi.hoisted(function () { return ({
    sessionStorePath: "/tmp/openclaw-telegram-reply-threading-".concat(Math.random()
        .toString(16)
        .slice(2), ".json"),
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
var _sequentializeKey;
vitest_1.vi.mock("@grammyjs/runner", function () { return ({
    sequentialize: function (keyFn) {
        _sequentializeKey = keyFn;
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
        (0, inbound_dedupe_js_1.resetInboundDedupe)();
        loadConfig.mockReturnValue({
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
        _sequentializeKey = undefined;
    });
    // groupPolicy tests
    (0, vitest_1.it)("sends replies without native reply threading", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, _i, _a, call;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    replySpy.mockResolvedValue({ text: "a".repeat(4500) });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 5, type: "private" },
                                text: "hi",
                                date: 1736380800,
                                message_id: 101,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(sendMessageSpy.mock.calls.length).toBeGreaterThan(1);
                    for (_i = 0, _a = sendMessageSpy.mock.calls; _i < _a.length; _i++) {
                        call = _a[_i];
                        (0, vitest_1.expect)((_b = call[2]) === null || _b === void 0 ? void 0 : _b.reply_to_message_id).toBeUndefined();
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors replyToMode=first for threaded replies", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, _a, first, rest, _i, rest_1, call;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    replySpy.mockResolvedValue({
                        text: "a".repeat(4500),
                        replyToId: "101",
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok", replyToMode: "first" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 5, type: "private" },
                                text: "hi",
                                date: 1736380800,
                                message_id: 101,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _d.sent();
                    (0, vitest_1.expect)(sendMessageSpy.mock.calls.length).toBeGreaterThan(1);
                    _a = sendMessageSpy.mock.calls, first = _a[0], rest = _a.slice(1);
                    (0, vitest_1.expect)((_b = first === null || first === void 0 ? void 0 : first[2]) === null || _b === void 0 ? void 0 : _b.reply_to_message_id).toBe(101);
                    for (_i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
                        call = rest_1[_i];
                        (0, vitest_1.expect)((_c = call[2]) === null || _c === void 0 ? void 0 : _c.reply_to_message_id).toBeUndefined();
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefixes final replies with responsePrefix", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    replySpy.mockResolvedValue({ text: "final reply" });
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open", allowFrom: ["*"] },
                        },
                        messages: { responsePrefix: "PFX" },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 5, type: "private" },
                                text: "hi",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessageSpy).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendMessageSpy.mock.calls[0][1]).toBe("PFX final reply");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors replyToMode=all for threaded replies", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, _i, _a, call;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    replySpy.mockResolvedValue({
                        text: "a".repeat(4500),
                        replyToId: "101",
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok", replyToMode: "all" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 5, type: "private" },
                                text: "hi",
                                date: 1736380800,
                                message_id: 101,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(sendMessageSpy.mock.calls.length).toBeGreaterThan(1);
                    for (_i = 0, _a = sendMessageSpy.mock.calls; _i < _a.length; _i++) {
                        call = _a[_i];
                        (0, vitest_1.expect)((_b = call[2]) === null || _b === void 0 ? void 0 : _b.reply_to_message_id).toBe(101);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks group messages when telegram.groups is set without a wildcard", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groups: {
                                    "123": { requireMention: false },
                                },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 456, type: "group", title: "Ops" },
                                text: "@openclaw_bot hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips group messages without mention when requireMention is enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { groups: { "*": { requireMention: true } } },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 123, type: "group", title: "Dev Chat" },
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors routed group activation from session store", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, storeDir, storePath, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    storeDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-telegram-"));
                    storePath = node_path_1.default.join(storeDir, "sessions.json");
                    node_fs_1.default.writeFileSync(storePath, JSON.stringify({
                        "agent:ops:telegram:group:123": { groupActivation: "always" },
                    }), "utf-8");
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: { "*": { requireMention: true } },
                            },
                        },
                        bindings: [
                            {
                                agentId: "ops",
                                match: {
                                    channel: "telegram",
                                    peer: { kind: "group", id: "123" },
                                },
                            },
                        ],
                        session: { store: storePath },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 123, type: "group", title: "Routing" },
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
