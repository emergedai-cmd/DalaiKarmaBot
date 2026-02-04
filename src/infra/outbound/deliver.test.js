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
var signal_js_1 = require("../../channels/plugins/outbound/signal.js");
var telegram_js_1 = require("../../channels/plugins/outbound/telegram.js");
var whatsapp_js_1 = require("../../channels/plugins/outbound/whatsapp.js");
var runtime_js_1 = require("../../plugins/runtime.js");
var format_js_1 = require("../../signal/format.js");
var channel_plugins_js_1 = require("../../test-utils/channel-plugins.js");
var mocks = vitest_1.vi.hoisted(function () { return ({
    appendAssistantMessageToSessionTranscript: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ ok: true, sessionFile: "x" })];
    }); }); }),
}); });
vitest_1.vi.mock("../../config/sessions.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../../config/sessions.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { appendAssistantMessageToSessionTranscript: mocks.appendAssistantMessageToSessionTranscript })];
        }
    });
}); });
var _a = await Promise.resolve().then(function () { return require("./deliver.js"); }), deliverOutboundPayloads = _a.deliverOutboundPayloads, normalizeOutboundPayloads = _a.normalizeOutboundPayloads;
(0, vitest_1.describe)("deliverOutboundPayloads", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)(defaultRegistry);
    });
    (0, vitest_1.afterEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)(emptyRegistry);
    });
    (0, vitest_1.it)("chunks telegram markdown and passes through accountId", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendTelegram, cfg, prevTelegramToken, results, _i, _a, call;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sendTelegram = vitest_1.vi.fn().mockResolvedValue({ messageId: "m1", chatId: "c1" });
                    cfg = {
                        channels: { telegram: { botToken: "tok-1", textChunkLimit: 2 } },
                    };
                    prevTelegramToken = process.env.TELEGRAM_BOT_TOKEN;
                    process.env.TELEGRAM_BOT_TOKEN = "";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, deliverOutboundPayloads({
                            cfg: cfg,
                            channel: "telegram",
                            to: "123",
                            payloads: [{ text: "abcd" }],
                            deps: { sendTelegram: sendTelegram },
                        })];
                case 2:
                    results = _b.sent();
                    (0, vitest_1.expect)(sendTelegram).toHaveBeenCalledTimes(2);
                    for (_i = 0, _a = sendTelegram.mock.calls; _i < _a.length; _i++) {
                        call = _a[_i];
                        (0, vitest_1.expect)(call[2]).toEqual(vitest_1.expect.objectContaining({ accountId: undefined, verbose: false, textMode: "html" }));
                    }
                    (0, vitest_1.expect)(results).toHaveLength(2);
                    (0, vitest_1.expect)(results[0]).toMatchObject({ channel: "telegram", chatId: "c1" });
                    return [3 /*break*/, 4];
                case 3:
                    if (prevTelegramToken === undefined) {
                        delete process.env.TELEGRAM_BOT_TOKEN;
                    }
                    else {
                        process.env.TELEGRAM_BOT_TOKEN = prevTelegramToken;
                    }
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes explicit accountId to sendTelegram", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendTelegram, cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendTelegram = vitest_1.vi.fn().mockResolvedValue({ messageId: "m1", chatId: "c1" });
                    cfg = {
                        channels: { telegram: { botToken: "tok-1", textChunkLimit: 2 } },
                    };
                    return [4 /*yield*/, deliverOutboundPayloads({
                            cfg: cfg,
                            channel: "telegram",
                            to: "123",
                            accountId: "default",
                            payloads: [{ text: "hi" }],
                            deps: { sendTelegram: sendTelegram },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendTelegram).toHaveBeenCalledWith("123", "hi", vitest_1.expect.objectContaining({ accountId: "default", verbose: false, textMode: "html" }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses signal media maxBytes from config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendSignal, cfg, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendSignal = vitest_1.vi.fn().mockResolvedValue({ messageId: "s1", timestamp: 123 });
                    cfg = { channels: { signal: { mediaMaxMb: 2 } } };
                    return [4 /*yield*/, deliverOutboundPayloads({
                            cfg: cfg,
                            channel: "signal",
                            to: "+1555",
                            payloads: [{ text: "hi", mediaUrl: "https://x.test/a.jpg" }],
                            deps: { sendSignal: sendSignal },
                        })];
                case 1:
                    results = _a.sent();
                    (0, vitest_1.expect)(sendSignal).toHaveBeenCalledWith("+1555", "hi", vitest_1.expect.objectContaining({
                        mediaUrl: "https://x.test/a.jpg",
                        maxBytes: 2 * 1024 * 1024,
                        textMode: "plain",
                        textStyles: [],
                    }));
                    (0, vitest_1.expect)(results[0]).toMatchObject({ channel: "signal", messageId: "s1" });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("chunks Signal markdown using the format-first chunker", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendSignal, cfg, text, expectedChunks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendSignal = vitest_1.vi.fn().mockResolvedValue({ messageId: "s1", timestamp: 123 });
                    cfg = {
                        channels: { signal: { textChunkLimit: 20 } },
                    };
                    text = "Intro\\n\\n````md\\n".concat("y".repeat(60), "\\n```\\n\\nOutro");
                    expectedChunks = (0, format_js_1.markdownToSignalTextChunks)(text, 20);
                    return [4 /*yield*/, deliverOutboundPayloads({
                            cfg: cfg,
                            channel: "signal",
                            to: "+1555",
                            payloads: [{ text: text }],
                            deps: { sendSignal: sendSignal },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendSignal).toHaveBeenCalledTimes(expectedChunks.length);
                    expectedChunks.forEach(function (chunk, index) {
                        (0, vitest_1.expect)(sendSignal).toHaveBeenNthCalledWith(index + 1, "+1555", chunk.text, vitest_1.expect.objectContaining({
                            accountId: undefined,
                            textMode: "plain",
                            textStyles: chunk.styles,
                        }));
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("chunks WhatsApp text and returns all results", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendWhatsApp, cfg, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendWhatsApp = vitest_1.vi
                        .fn()
                        .mockResolvedValueOnce({ messageId: "w1", toJid: "jid" })
                        .mockResolvedValueOnce({ messageId: "w2", toJid: "jid" });
                    cfg = {
                        channels: { whatsapp: { textChunkLimit: 2 } },
                    };
                    return [4 /*yield*/, deliverOutboundPayloads({
                            cfg: cfg,
                            channel: "whatsapp",
                            to: "+1555",
                            payloads: [{ text: "abcd" }],
                            deps: { sendWhatsApp: sendWhatsApp },
                        })];
                case 1:
                    results = _a.sent();
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(results.map(function (r) { return r.messageId; })).toEqual(["w1", "w2"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("respects newline chunk mode for WhatsApp", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendWhatsApp, cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendWhatsApp = vitest_1.vi.fn().mockResolvedValue({ messageId: "w1", toJid: "jid" });
                    cfg = {
                        channels: { whatsapp: { textChunkLimit: 4000, chunkMode: "newline" } },
                    };
                    return [4 /*yield*/, deliverOutboundPayloads({
                            cfg: cfg,
                            channel: "whatsapp",
                            to: "+1555",
                            payloads: [{ text: "Line one\n\nLine two" }],
                            deps: { sendWhatsApp: sendWhatsApp },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenNthCalledWith(1, "+1555", "Line one", vitest_1.expect.objectContaining({ verbose: false }));
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenNthCalledWith(2, "+1555", "Line two", vitest_1.expect.objectContaining({ verbose: false }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("preserves fenced blocks for markdown chunkers in newline mode", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chunker, sendText, sendMedia, cfg, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chunker = vitest_1.vi.fn(function (text) { return (text ? [text] : []); });
                    sendText = vitest_1.vi.fn().mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var text = _b.text;
                        return __generator(this, function (_c) {
                            return [2 /*return*/, ({
                                    channel: "matrix",
                                    messageId: text,
                                    roomId: "r1",
                                })];
                        });
                    }); });
                    sendMedia = vitest_1.vi.fn().mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var text = _b.text;
                        return __generator(this, function (_c) {
                            return [2 /*return*/, ({
                                    channel: "matrix",
                                    messageId: text,
                                    roomId: "r1",
                                })];
                        });
                    }); });
                    (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([
                        {
                            pluginId: "matrix",
                            source: "test",
                            plugin: (0, channel_plugins_js_1.createOutboundTestPlugin)({
                                id: "matrix",
                                outbound: {
                                    deliveryMode: "direct",
                                    chunker: chunker,
                                    chunkerMode: "markdown",
                                    textChunkLimit: 4000,
                                    sendText: sendText,
                                    sendMedia: sendMedia,
                                },
                            }),
                        },
                    ]));
                    cfg = {
                        channels: { matrix: { textChunkLimit: 4000, chunkMode: "newline" } },
                    };
                    text = "```js\nconst a = 1;\nconst b = 2;\n```\nAfter";
                    return [4 /*yield*/, deliverOutboundPayloads({
                            cfg: cfg,
                            channel: "matrix",
                            to: "!room",
                            payloads: [{ text: text }],
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(chunker).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(chunker).toHaveBeenNthCalledWith(1, text, 4000);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses iMessage media maxBytes from agent fallback", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendIMessage, cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendIMessage = vitest_1.vi.fn().mockResolvedValue({ messageId: "i1" });
                    (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([
                        {
                            pluginId: "imessage",
                            source: "test",
                            plugin: (0, channel_plugins_js_1.createIMessageTestPlugin)(),
                        },
                    ]));
                    cfg = {
                        agents: { defaults: { mediaMaxMb: 3 } },
                    };
                    return [4 /*yield*/, deliverOutboundPayloads({
                            cfg: cfg,
                            channel: "imessage",
                            to: "chat_id:42",
                            payloads: [{ text: "hello" }],
                            deps: { sendIMessage: sendIMessage },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendIMessage).toHaveBeenCalledWith("chat_id:42", "hello", vitest_1.expect.objectContaining({ maxBytes: 3 * 1024 * 1024 }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("normalizes payloads and drops empty entries", function () {
        var normalized = normalizeOutboundPayloads([
            { text: "hi" },
            { text: "MEDIA:https://x.test/a.jpg" },
            { text: " ", mediaUrls: [] },
        ]);
        (0, vitest_1.expect)(normalized).toEqual([
            { text: "hi", mediaUrls: [] },
            { text: "", mediaUrls: ["https://x.test/a.jpg"] },
        ]);
    });
    (0, vitest_1.it)("continues on errors when bestEffort is enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendWhatsApp, onError, cfg, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendWhatsApp = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(new Error("fail"))
                        .mockResolvedValueOnce({ messageId: "w2", toJid: "jid" });
                    onError = vitest_1.vi.fn();
                    cfg = {};
                    return [4 /*yield*/, deliverOutboundPayloads({
                            cfg: cfg,
                            channel: "whatsapp",
                            to: "+1555",
                            payloads: [{ text: "a" }, { text: "b" }],
                            deps: { sendWhatsApp: sendWhatsApp },
                            bestEffort: true,
                            onError: onError,
                        })];
                case 1:
                    results = _a.sent();
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(onError).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(results).toEqual([{ channel: "whatsapp", messageId: "w2", toJid: "jid" }]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes normalized payload to onError", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendWhatsApp, onError, cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendWhatsApp = vitest_1.vi.fn().mockRejectedValue(new Error("boom"));
                    onError = vitest_1.vi.fn();
                    cfg = {};
                    return [4 /*yield*/, deliverOutboundPayloads({
                            cfg: cfg,
                            channel: "whatsapp",
                            to: "+1555",
                            payloads: [{ text: "hi", mediaUrl: "https://x.test/a.jpg" }],
                            deps: { sendWhatsApp: sendWhatsApp },
                            bestEffort: true,
                            onError: onError,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(onError).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(onError).toHaveBeenCalledWith(vitest_1.expect.any(Error), vitest_1.expect.objectContaining({ text: "hi", mediaUrls: ["https://x.test/a.jpg"] }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("mirrors delivered output when mirror options are provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendTelegram, cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendTelegram = vitest_1.vi.fn().mockResolvedValue({ messageId: "m1", chatId: "c1" });
                    cfg = {
                        channels: { telegram: { botToken: "tok-1", textChunkLimit: 2 } },
                    };
                    mocks.appendAssistantMessageToSessionTranscript.mockClear();
                    return [4 /*yield*/, deliverOutboundPayloads({
                            cfg: cfg,
                            channel: "telegram",
                            to: "123",
                            payloads: [{ text: "caption", mediaUrl: "https://example.com/files/report.pdf?sig=1" }],
                            deps: { sendTelegram: sendTelegram },
                            mirror: {
                                sessionKey: "agent:main:main",
                                text: "caption",
                                mediaUrls: ["https://example.com/files/report.pdf?sig=1"],
                            },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.appendAssistantMessageToSessionTranscript).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ text: "report.pdf" }));
                    return [2 /*return*/];
            }
        });
    }); });
});
var emptyRegistry = (0, channel_plugins_js_1.createTestRegistry)([]);
var defaultRegistry = (0, channel_plugins_js_1.createTestRegistry)([
    {
        pluginId: "telegram",
        plugin: (0, channel_plugins_js_1.createOutboundTestPlugin)({ id: "telegram", outbound: telegram_js_1.telegramOutbound }),
        source: "test",
    },
    {
        pluginId: "signal",
        plugin: (0, channel_plugins_js_1.createOutboundTestPlugin)({ id: "signal", outbound: signal_js_1.signalOutbound }),
        source: "test",
    },
    {
        pluginId: "whatsapp",
        plugin: (0, channel_plugins_js_1.createOutboundTestPlugin)({ id: "whatsapp", outbound: whatsapp_js_1.whatsappOutbound }),
        source: "test",
    },
    {
        pluginId: "imessage",
        plugin: (0, channel_plugins_js_1.createIMessageTestPlugin)(),
        source: "test",
    },
]);
