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
var discord_js_1 = require("../../channels/plugins/outbound/discord.js");
var imessage_js_1 = require("../../channels/plugins/outbound/imessage.js");
var signal_js_1 = require("../../channels/plugins/outbound/signal.js");
var slack_js_1 = require("../../channels/plugins/outbound/slack.js");
var telegram_js_1 = require("../../channels/plugins/outbound/telegram.js");
var whatsapp_js_1 = require("../../channels/plugins/outbound/whatsapp.js");
var runtime_js_1 = require("../../plugins/runtime.js");
var channel_plugins_js_1 = require("../../test-utils/channel-plugins.js");
var tokens_js_1 = require("../tokens.js");
var mocks = vitest_1.vi.hoisted(function () { return ({
    sendMessageDiscord: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ messageId: "m1", channelId: "c1" })];
    }); }); }),
    sendMessageIMessage: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ messageId: "ok" })];
    }); }); }),
    sendMessageMSTeams: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    messageId: "m1",
                    conversationId: "c1",
                })];
        });
    }); }),
    sendMessageSignal: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ messageId: "t1" })];
    }); }); }),
    sendMessageSlack: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ messageId: "m1", channelId: "c1" })];
    }); }); }),
    sendMessageTelegram: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ messageId: "m1", chatId: "c1" })];
    }); }); }),
    sendMessageWhatsApp: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ messageId: "m1", toJid: "jid" })];
    }); }); }),
    deliverOutboundPayloads: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../../discord/send.js", function () { return ({
    sendMessageDiscord: mocks.sendMessageDiscord,
}); });
vitest_1.vi.mock("../../imessage/send.js", function () { return ({
    sendMessageIMessage: mocks.sendMessageIMessage,
}); });
vitest_1.vi.mock("../../signal/send.js", function () { return ({
    sendMessageSignal: mocks.sendMessageSignal,
}); });
vitest_1.vi.mock("../../slack/send.js", function () { return ({
    sendMessageSlack: mocks.sendMessageSlack,
}); });
vitest_1.vi.mock("../../telegram/send.js", function () { return ({
    sendMessageTelegram: mocks.sendMessageTelegram,
}); });
vitest_1.vi.mock("../../web/outbound.js", function () { return ({
    sendMessageWhatsApp: mocks.sendMessageWhatsApp,
    sendPollWhatsApp: mocks.sendMessageWhatsApp,
}); });
vitest_1.vi.mock("../../infra/outbound/deliver.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../../infra/outbound/deliver.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { deliverOutboundPayloads: mocks.deliverOutboundPayloads })];
        }
    });
}); });
var actualDeliver = await vitest_1.vi.importActual("../../infra/outbound/deliver.js");
var routeReply = (await Promise.resolve().then(function () { return require("./route-reply.js"); })).routeReply;
var createRegistry = function (channels) { return ({
    plugins: [],
    tools: [],
    channels: channels,
    providers: [],
    gatewayHandlers: {},
    httpHandlers: [],
    httpRoutes: [],
    cliRegistrars: [],
    services: [],
    diagnostics: [],
}); };
var createMSTeamsOutbound = function () { return ({
    deliveryMode: "direct",
    sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var result;
        var cfg = _b.cfg, to = _b.to, text = _b.text;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, mocks.sendMessageMSTeams({ cfg: cfg, to: to, text: text })];
                case 1:
                    result = _c.sent();
                    return [2 /*return*/, __assign({ channel: "msteams" }, result)];
            }
        });
    }); },
    sendMedia: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var result;
        var cfg = _b.cfg, to = _b.to, text = _b.text, mediaUrl = _b.mediaUrl;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, mocks.sendMessageMSTeams({ cfg: cfg, to: to, text: text, mediaUrl: mediaUrl })];
                case 1:
                    result = _c.sent();
                    return [2 /*return*/, __assign({ channel: "msteams" }, result)];
            }
        });
    }); },
}); };
var createMSTeamsPlugin = function (params) { return ({
    id: "msteams",
    meta: {
        id: "msteams",
        label: "Microsoft Teams",
        selectionLabel: "Microsoft Teams (Bot Framework)",
        docsPath: "/channels/msteams",
        blurb: "Bot Framework; enterprise support.",
    },
    capabilities: { chatTypes: ["direct"] },
    config: {
        listAccountIds: function () { return []; },
        resolveAccount: function () { return ({}); },
    },
    outbound: params.outbound,
}); };
(0, vitest_1.describe)("routeReply", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)(defaultRegistry);
        mocks.deliverOutboundPayloads.mockImplementation(actualDeliver.deliverOutboundPayloads);
    });
    (0, vitest_1.afterEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)(emptyRegistry);
    });
    (0, vitest_1.it)("skips sends when abort signal is already aborted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.sendMessageSlack.mockClear();
                    controller = new AbortController();
                    controller.abort();
                    return [4 /*yield*/, routeReply({
                            payload: { text: "hi" },
                            channel: "slack",
                            to: "channel:C123",
                            cfg: {},
                            abortSignal: controller.signal,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    (0, vitest_1.expect)(res.error).toContain("aborted");
                    (0, vitest_1.expect)(mocks.sendMessageSlack).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("no-ops on empty payload", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.sendMessageSlack.mockClear();
                    return [4 /*yield*/, routeReply({
                            payload: {},
                            channel: "slack",
                            to: "channel:C123",
                            cfg: {},
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)(mocks.sendMessageSlack).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("drops silent token payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.sendMessageSlack.mockClear();
                    return [4 /*yield*/, routeReply({
                            payload: { text: tokens_js_1.SILENT_REPLY_TOKEN },
                            channel: "slack",
                            to: "channel:C123",
                            cfg: {},
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)(mocks.sendMessageSlack).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("drops payloads that start with the silent token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.sendMessageSlack.mockClear();
                    return [4 /*yield*/, routeReply({
                            payload: { text: "".concat(tokens_js_1.SILENT_REPLY_TOKEN, " -- (why am I here?)") },
                            channel: "slack",
                            to: "channel:C123",
                            cfg: {},
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)(mocks.sendMessageSlack).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("applies responsePrefix when routing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.sendMessageSlack.mockClear();
                    cfg = {
                        messages: { responsePrefix: "[openclaw]" },
                    };
                    return [4 /*yield*/, routeReply({
                            payload: { text: "hi" },
                            channel: "slack",
                            to: "channel:C123",
                            cfg: cfg,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.sendMessageSlack).toHaveBeenCalledWith("channel:C123", "[openclaw] hi", vitest_1.expect.any(Object));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not derive responsePrefix from agent identity when routing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.sendMessageSlack.mockClear();
                    cfg = {
                        agents: {
                            list: [
                                {
                                    id: "rich",
                                    identity: { name: "Richbot", theme: "lion bot", emoji: "🦁" },
                                },
                            ],
                        },
                        messages: {},
                    };
                    return [4 /*yield*/, routeReply({
                            payload: { text: "hi" },
                            channel: "slack",
                            to: "channel:C123",
                            sessionKey: "agent:rich:main",
                            cfg: cfg,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.sendMessageSlack).toHaveBeenCalledWith("channel:C123", "hi", vitest_1.expect.any(Object));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses threadId for Slack when replyToId is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.sendMessageSlack.mockClear();
                    return [4 /*yield*/, routeReply({
                            payload: { text: "hi" },
                            channel: "slack",
                            to: "channel:C123",
                            threadId: "456.789",
                            cfg: {},
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.sendMessageSlack).toHaveBeenCalledWith("channel:C123", "hi", vitest_1.expect.objectContaining({ threadTs: "456.789" }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes thread id to Telegram sends", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.sendMessageTelegram.mockClear();
                    return [4 /*yield*/, routeReply({
                            payload: { text: "hi" },
                            channel: "telegram",
                            to: "telegram:123",
                            threadId: 42,
                            cfg: {},
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.sendMessageTelegram).toHaveBeenCalledWith("telegram:123", "hi", vitest_1.expect.objectContaining({ messageThreadId: 42 }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes replyToId to Telegram sends", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.sendMessageTelegram.mockClear();
                    return [4 /*yield*/, routeReply({
                            payload: { text: "hi", replyToId: "123" },
                            channel: "telegram",
                            to: "telegram:123",
                            cfg: {},
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.sendMessageTelegram).toHaveBeenCalledWith("telegram:123", "hi", vitest_1.expect.objectContaining({ replyToMessageId: 123 }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses replyToId as threadTs for Slack", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.sendMessageSlack.mockClear();
                    return [4 /*yield*/, routeReply({
                            payload: { text: "hi", replyToId: "1710000000.0001" },
                            channel: "slack",
                            to: "channel:C123",
                            cfg: {},
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.sendMessageSlack).toHaveBeenCalledWith("channel:C123", "hi", vitest_1.expect.objectContaining({ threadTs: "1710000000.0001" }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses threadId as threadTs for Slack when replyToId is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.sendMessageSlack.mockClear();
                    return [4 /*yield*/, routeReply({
                            payload: { text: "hi" },
                            channel: "slack",
                            to: "channel:C123",
                            threadId: "1710000000.9999",
                            cfg: {},
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.sendMessageSlack).toHaveBeenCalledWith("channel:C123", "hi", vitest_1.expect.objectContaining({ threadTs: "1710000000.9999" }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends multiple mediaUrls (caption only on first)", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.sendMessageSlack.mockClear();
                    return [4 /*yield*/, routeReply({
                            payload: { text: "caption", mediaUrls: ["a", "b"] },
                            channel: "slack",
                            to: "channel:C123",
                            cfg: {},
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.sendMessageSlack).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(mocks.sendMessageSlack).toHaveBeenNthCalledWith(1, "channel:C123", "caption", vitest_1.expect.objectContaining({ mediaUrl: "a" }));
                    (0, vitest_1.expect)(mocks.sendMessageSlack).toHaveBeenNthCalledWith(2, "channel:C123", "", vitest_1.expect.objectContaining({ mediaUrl: "b" }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("routes WhatsApp via outbound sender (accountId honored)", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.sendMessageWhatsApp.mockClear();
                    return [4 /*yield*/, routeReply({
                            payload: { text: "hi" },
                            channel: "whatsapp",
                            to: "+15551234567",
                            accountId: "acc-1",
                            cfg: {},
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.sendMessageWhatsApp).toHaveBeenCalledWith("+15551234567", "hi", vitest_1.expect.objectContaining({ accountId: "acc-1", verbose: false }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("routes MS Teams via proactive sender", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.sendMessageMSTeams.mockClear();
                    (0, runtime_js_1.setActivePluginRegistry)(createRegistry([
                        {
                            pluginId: "msteams",
                            source: "test",
                            plugin: createMSTeamsPlugin({
                                outbound: createMSTeamsOutbound(),
                            }),
                        },
                    ]));
                    cfg = {
                        channels: {
                            msteams: {
                                enabled: true,
                            },
                        },
                    };
                    return [4 /*yield*/, routeReply({
                            payload: { text: "hi" },
                            channel: "msteams",
                            to: "conversation:19:abc@thread.tacv2",
                            cfg: cfg,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.sendMessageMSTeams).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        cfg: cfg,
                        to: "conversation:19:abc@thread.tacv2",
                        text: "hi",
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes mirror data when sessionKey is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.deliverOutboundPayloads.mockResolvedValue([]);
                    return [4 /*yield*/, routeReply({
                            payload: { text: "hi" },
                            channel: "slack",
                            to: "channel:C123",
                            sessionKey: "agent:main:main",
                            cfg: {},
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.deliverOutboundPayloads).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        mirror: vitest_1.expect.objectContaining({
                            sessionKey: "agent:main:main",
                            text: "hi",
                        }),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips mirror data when mirror is false", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.deliverOutboundPayloads.mockResolvedValue([]);
                    return [4 /*yield*/, routeReply({
                            payload: { text: "hi" },
                            channel: "slack",
                            to: "channel:C123",
                            sessionKey: "agent:main:main",
                            mirror: false,
                            cfg: {},
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.deliverOutboundPayloads).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        mirror: undefined,
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
var emptyRegistry = createRegistry([]);
var defaultRegistry = (0, channel_plugins_js_1.createTestRegistry)([
    {
        pluginId: "discord",
        plugin: (0, channel_plugins_js_1.createOutboundTestPlugin)({
            id: "discord",
            outbound: discord_js_1.discordOutbound,
            label: "Discord",
        }),
        source: "test",
    },
    {
        pluginId: "slack",
        plugin: (0, channel_plugins_js_1.createOutboundTestPlugin)({ id: "slack", outbound: slack_js_1.slackOutbound, label: "Slack" }),
        source: "test",
    },
    {
        pluginId: "telegram",
        plugin: (0, channel_plugins_js_1.createOutboundTestPlugin)({
            id: "telegram",
            outbound: telegram_js_1.telegramOutbound,
            label: "Telegram",
        }),
        source: "test",
    },
    {
        pluginId: "whatsapp",
        plugin: (0, channel_plugins_js_1.createOutboundTestPlugin)({
            id: "whatsapp",
            outbound: whatsapp_js_1.whatsappOutbound,
            label: "WhatsApp",
        }),
        source: "test",
    },
    {
        pluginId: "signal",
        plugin: (0, channel_plugins_js_1.createOutboundTestPlugin)({ id: "signal", outbound: signal_js_1.signalOutbound, label: "Signal" }),
        source: "test",
    },
    {
        pluginId: "imessage",
        plugin: (0, channel_plugins_js_1.createIMessageTestPlugin)({ outbound: imessage_js_1.imessageOutbound }),
        source: "test",
    },
    {
        pluginId: "msteams",
        plugin: createMSTeamsPlugin({
            outbound: createMSTeamsOutbound(),
        }),
        source: "test",
    },
]);
