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
var carbon_1 = require("@buape/carbon");
var vitest_1 = require("vitest");
var monitor_js_1 = require("./monitor.js");
var message_utils_js_1 = require("./monitor/message-utils.js");
var threading_js_1 = require("./monitor/threading.js");
var sendMock = vitest_1.vi.fn();
var reactMock = vitest_1.vi.fn();
var updateLastRouteMock = vitest_1.vi.fn();
var dispatchMock = vitest_1.vi.fn();
var readAllowFromStoreMock = vitest_1.vi.fn();
var upsertPairingRequestMock = vitest_1.vi.fn();
vitest_1.vi.mock("./send.js", function () { return ({
    sendMessageDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return sendMock.apply(void 0, args);
    },
    reactMessageDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                reactMock.apply(void 0, args);
                return [2 /*return*/];
            });
        });
    },
}); });
vitest_1.vi.mock("../auto-reply/dispatch.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { dispatchInboundMessage: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return dispatchMock.apply(void 0, args);
                        }, dispatchInboundMessageWithDispatcher: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return dispatchMock.apply(void 0, args);
                        }, dispatchInboundMessageWithBufferedDispatcher: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return dispatchMock.apply(void 0, args);
                        } })];
        }
    });
}); });
vitest_1.vi.mock("../pairing/pairing-store.js", function () { return ({
    readChannelAllowFromStore: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return readAllowFromStoreMock.apply(void 0, args);
    },
    upsertChannelPairingRequest: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return upsertPairingRequestMock.apply(void 0, args);
    },
}); });
vitest_1.vi.mock("../config/sessions.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { resolveStorePath: vitest_1.vi.fn(function () { return "/tmp/openclaw-sessions.json"; }), updateLastRoute: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return updateLastRouteMock.apply(void 0, args);
                        }, resolveSessionKey: vitest_1.vi.fn() })];
        }
    });
}); });
(0, vitest_1.beforeEach)(function () {
    sendMock.mockReset().mockResolvedValue(undefined);
    updateLastRouteMock.mockReset();
    dispatchMock.mockReset().mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var dispatcher = _b.dispatcher;
        return __generator(this, function (_c) {
            dispatcher.sendFinalReply({ text: "hi" });
            return [2 /*return*/, { queuedFinal: true, counts: { tool: 0, block: 0, final: 1 } }];
        });
    }); });
    readAllowFromStoreMock.mockReset().mockResolvedValue([]);
    upsertPairingRequestMock.mockReset().mockResolvedValue({ code: "PAIRCODE", created: true });
    (0, message_utils_js_1.__resetDiscordChannelInfoCacheForTest)();
    (0, threading_js_1.__resetDiscordThreadStarterCacheForTest)();
});
(0, vitest_1.describe)("discord tool result dispatch", function () {
    (0, vitest_1.it)("sends status replies with responsePrefix", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, runtimeError, handler, client;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = {
                        agents: {
                            defaults: {
                                model: "anthropic/claude-opus-4-5",
                                workspace: "/tmp/openclaw",
                            },
                        },
                        session: { store: "/tmp/openclaw-sessions.json" },
                        messages: { responsePrefix: "PFX" },
                        channels: { discord: { dm: { enabled: true, policy: "open" } } },
                    };
                    runtimeError = vitest_1.vi.fn();
                    handler = (0, monitor_js_1.createDiscordMessageHandler)({
                        cfg: cfg,
                        discordConfig: cfg.channels.discord,
                        accountId: "default",
                        token: "token",
                        runtime: {
                            log: vitest_1.vi.fn(),
                            error: runtimeError,
                            exit: function (code) {
                                throw new Error("exit ".concat(code));
                            },
                        },
                        botUserId: "bot-id",
                        guildHistories: new Map(),
                        historyLimit: 0,
                        mediaMaxBytes: 10000,
                        textLimit: 2000,
                        replyToMode: "off",
                        dmEnabled: true,
                        groupDmEnabled: false,
                    });
                    client = {
                        fetchChannel: vitest_1.vi.fn().mockResolvedValue({
                            type: carbon_1.ChannelType.DM,
                            name: "dm",
                        }),
                    };
                    return [4 /*yield*/, handler({
                            message: {
                                id: "m1",
                                content: "/status",
                                channelId: "c1",
                                timestamp: new Date().toISOString(),
                                type: carbon_1.MessageType.Default,
                                attachments: [],
                                embeds: [],
                                mentionedEveryone: false,
                                mentionedUsers: [],
                                mentionedRoles: [],
                                author: { id: "u1", bot: false, username: "Ada" },
                            },
                            author: { id: "u1", bot: false, username: "Ada" },
                            guild_id: null,
                        }, client)];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(runtimeError).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)((_a = sendMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[1]).toMatch(/^PFX /);
                    return [2 /*return*/];
            }
        });
    }); }, 30000);
    (0, vitest_1.it)("caches channel info lookups between messages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, handler, fetchChannel, client, baseMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        agents: {
                            defaults: {
                                model: "anthropic/claude-opus-4-5",
                                workspace: "/tmp/openclaw",
                            },
                        },
                        session: { store: "/tmp/openclaw-sessions.json" },
                        channels: { discord: { dm: { enabled: true, policy: "open" } } },
                    };
                    handler = (0, monitor_js_1.createDiscordMessageHandler)({
                        cfg: cfg,
                        discordConfig: cfg.channels.discord,
                        accountId: "default",
                        token: "token",
                        runtime: {
                            log: vitest_1.vi.fn(),
                            error: vitest_1.vi.fn(),
                            exit: function (code) {
                                throw new Error("exit ".concat(code));
                            },
                        },
                        botUserId: "bot-id",
                        guildHistories: new Map(),
                        historyLimit: 0,
                        mediaMaxBytes: 10000,
                        textLimit: 2000,
                        replyToMode: "off",
                        dmEnabled: true,
                        groupDmEnabled: false,
                    });
                    fetchChannel = vitest_1.vi.fn().mockResolvedValue({
                        type: carbon_1.ChannelType.DM,
                        name: "dm",
                    });
                    client = { fetchChannel: fetchChannel };
                    baseMessage = {
                        content: "hello",
                        channelId: "cache-channel-1",
                        timestamp: new Date().toISOString(),
                        type: carbon_1.MessageType.Default,
                        attachments: [],
                        embeds: [],
                        mentionedEveryone: false,
                        mentionedUsers: [],
                        mentionedRoles: [],
                        author: { id: "u-cache", bot: false, username: "Ada" },
                    };
                    return [4 /*yield*/, handler({
                            message: __assign(__assign({}, baseMessage), { id: "m-cache-1" }),
                            author: baseMessage.author,
                            guild_id: null,
                        }, client)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, handler({
                            message: __assign(__assign({}, baseMessage), { id: "m-cache-2" }),
                            author: baseMessage.author,
                            guild_id: null,
                        }, client)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(fetchChannel).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes forwarded message snapshots in body", function () { return __awaiter(void 0, void 0, void 0, function () {
        var capturedBody, cfg, handler, client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    capturedBody = "";
                    dispatchMock.mockImplementationOnce(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var _c;
                        var ctx = _b.ctx, dispatcher = _b.dispatcher;
                        return __generator(this, function (_d) {
                            capturedBody = (_c = ctx.Body) !== null && _c !== void 0 ? _c : "";
                            dispatcher.sendFinalReply({ text: "ok" });
                            return [2 /*return*/, { queuedFinal: true, counts: { final: 1 } }];
                        });
                    }); });
                    cfg = {
                        agents: {
                            defaults: {
                                model: "anthropic/claude-opus-4-5",
                                workspace: "/tmp/openclaw",
                            },
                        },
                        session: { store: "/tmp/openclaw-sessions.json" },
                        channels: { discord: { dm: { enabled: true, policy: "open" } } },
                    };
                    handler = (0, monitor_js_1.createDiscordMessageHandler)({
                        cfg: cfg,
                        discordConfig: cfg.channels.discord,
                        accountId: "default",
                        token: "token",
                        runtime: {
                            log: vitest_1.vi.fn(),
                            error: vitest_1.vi.fn(),
                            exit: function (code) {
                                throw new Error("exit ".concat(code));
                            },
                        },
                        botUserId: "bot-id",
                        guildHistories: new Map(),
                        historyLimit: 0,
                        mediaMaxBytes: 10000,
                        textLimit: 2000,
                        replyToMode: "off",
                        dmEnabled: true,
                        groupDmEnabled: false,
                    });
                    client = {
                        fetchChannel: vitest_1.vi.fn().mockResolvedValue({
                            type: carbon_1.ChannelType.DM,
                            name: "dm",
                        }),
                    };
                    return [4 /*yield*/, handler({
                            message: {
                                id: "m-forward-1",
                                content: "",
                                channelId: "c-forward-1",
                                timestamp: new Date().toISOString(),
                                type: carbon_1.MessageType.Default,
                                attachments: [],
                                embeds: [],
                                mentionedEveryone: false,
                                mentionedUsers: [],
                                mentionedRoles: [],
                                author: { id: "u1", bot: false, username: "Ada" },
                                rawData: {
                                    message_snapshots: [
                                        {
                                            message: {
                                                content: "forwarded hello",
                                                embeds: [],
                                                attachments: [],
                                                author: {
                                                    id: "u2",
                                                    username: "Bob",
                                                    discriminator: "0",
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                            author: { id: "u1", bot: false, username: "Ada" },
                            guild_id: null,
                        }, client)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(capturedBody).toContain("[Forwarded message from @Bob]");
                    (0, vitest_1.expect)(capturedBody).toContain("forwarded hello");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses channel id allowlists for non-thread channels with categories", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createDiscordMessageHandler, capturedCtx, cfg, handler, client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./monitor.js"); })];
                case 1:
                    createDiscordMessageHandler = (_a.sent()).createDiscordMessageHandler;
                    dispatchMock.mockImplementationOnce(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var ctx = _b.ctx, dispatcher = _b.dispatcher;
                        return __generator(this, function (_c) {
                            capturedCtx = ctx;
                            dispatcher.sendFinalReply({ text: "hi" });
                            return [2 /*return*/, { queuedFinal: true, counts: { final: 1 } }];
                        });
                    }); });
                    cfg = {
                        agents: {
                            defaults: {
                                model: "anthropic/claude-opus-4-5",
                                workspace: "/tmp/openclaw",
                            },
                        },
                        session: { store: "/tmp/openclaw-sessions.json" },
                        channels: {
                            discord: {
                                dm: { enabled: true, policy: "open" },
                                guilds: {
                                    "*": {
                                        requireMention: false,
                                        channels: { c1: { allow: true } },
                                    },
                                },
                            },
                        },
                        routing: { allowFrom: [] },
                    };
                    handler = createDiscordMessageHandler({
                        cfg: cfg,
                        discordConfig: cfg.channels.discord,
                        accountId: "default",
                        token: "token",
                        runtime: {
                            log: vitest_1.vi.fn(),
                            error: vitest_1.vi.fn(),
                            exit: function (code) {
                                throw new Error("exit ".concat(code));
                            },
                        },
                        botUserId: "bot-id",
                        guildHistories: new Map(),
                        historyLimit: 0,
                        mediaMaxBytes: 10000,
                        textLimit: 2000,
                        replyToMode: "off",
                        dmEnabled: true,
                        groupDmEnabled: false,
                        guildEntries: {
                            "*": { requireMention: false, channels: { c1: { allow: true } } },
                        },
                    });
                    client = {
                        fetchChannel: vitest_1.vi.fn().mockResolvedValue({
                            type: carbon_1.ChannelType.GuildText,
                            name: "general",
                            parentId: "category-1",
                        }),
                        rest: { get: vitest_1.vi.fn() },
                    };
                    return [4 /*yield*/, handler({
                            message: {
                                id: "m-category",
                                content: "hello",
                                channelId: "c1",
                                timestamp: new Date().toISOString(),
                                type: carbon_1.MessageType.Default,
                                attachments: [],
                                embeds: [],
                                mentionedEveryone: false,
                                mentionedUsers: [],
                                mentionedRoles: [],
                                author: { id: "u1", bot: false, username: "Ada", tag: "Ada#1" },
                            },
                            author: { id: "u1", bot: false, username: "Ada", tag: "Ada#1" },
                            member: { displayName: "Ada" },
                            guild: { id: "g1", name: "Guild" },
                            guild_id: "g1",
                        }, client)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(capturedCtx === null || capturedCtx === void 0 ? void 0 : capturedCtx.SessionKey).toBe("agent:main:discord:channel:c1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefixes group bodies with sender label", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createDiscordMessageHandler, capturedBody, cfg, handler, client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./monitor.js"); })];
                case 1:
                    createDiscordMessageHandler = (_a.sent()).createDiscordMessageHandler;
                    capturedBody = "";
                    dispatchMock.mockImplementationOnce(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var _c;
                        var ctx = _b.ctx, dispatcher = _b.dispatcher;
                        return __generator(this, function (_d) {
                            capturedBody = (_c = ctx.Body) !== null && _c !== void 0 ? _c : "";
                            dispatcher.sendFinalReply({ text: "ok" });
                            return [2 /*return*/, { queuedFinal: true, counts: { final: 1 } }];
                        });
                    }); });
                    cfg = {
                        agents: {
                            defaults: {
                                model: "anthropic/claude-opus-4-5",
                                workspace: "/tmp/openclaw",
                            },
                        },
                        session: { store: "/tmp/openclaw-sessions.json" },
                        channels: {
                            discord: {
                                dm: { enabled: true, policy: "open" },
                                guilds: {
                                    "*": {
                                        requireMention: false,
                                        channels: { c1: { allow: true } },
                                    },
                                },
                            },
                        },
                        routing: { allowFrom: [] },
                    };
                    handler = createDiscordMessageHandler({
                        cfg: cfg,
                        discordConfig: cfg.channels.discord,
                        accountId: "default",
                        token: "token",
                        runtime: {
                            log: vitest_1.vi.fn(),
                            error: vitest_1.vi.fn(),
                            exit: function (code) {
                                throw new Error("exit ".concat(code));
                            },
                        },
                        botUserId: "bot-id",
                        guildHistories: new Map(),
                        historyLimit: 0,
                        mediaMaxBytes: 10000,
                        textLimit: 2000,
                        replyToMode: "off",
                        dmEnabled: true,
                        groupDmEnabled: false,
                        guildEntries: {
                            "*": { requireMention: false, channels: { c1: { allow: true } } },
                        },
                    });
                    client = {
                        fetchChannel: vitest_1.vi.fn().mockResolvedValue({
                            type: carbon_1.ChannelType.GuildText,
                            name: "general",
                            parentId: "category-1",
                        }),
                        rest: { get: vitest_1.vi.fn() },
                    };
                    return [4 /*yield*/, handler({
                            message: {
                                id: "m-prefix",
                                content: "hello",
                                channelId: "c1",
                                timestamp: new Date("2026-01-17T00:00:00Z").toISOString(),
                                type: carbon_1.MessageType.Default,
                                attachments: [],
                                embeds: [],
                                mentionedEveryone: false,
                                mentionedUsers: [],
                                mentionedRoles: [],
                                author: { id: "u1", bot: false, username: "Ada", discriminator: "1234" },
                            },
                            author: { id: "u1", bot: false, username: "Ada", discriminator: "1234" },
                            member: { displayName: "Ada" },
                            guild: { id: "g1", name: "Guild" },
                            guild_id: "g1",
                        }, client)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(capturedBody).toContain("Ada (Ada#1234): hello");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("replies with pairing code and sender id when dmPolicy is pairing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createDiscordMessageHandler, cfg, handler, client;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./monitor.js"); })];
                case 1:
                    createDiscordMessageHandler = (_e.sent()).createDiscordMessageHandler;
                    cfg = {
                        agents: {
                            defaults: {
                                model: "anthropic/claude-opus-4-5",
                                workspace: "/tmp/openclaw",
                            },
                        },
                        session: { store: "/tmp/openclaw-sessions.json" },
                        channels: {
                            discord: { dm: { enabled: true, policy: "pairing", allowFrom: [] } },
                        },
                    };
                    handler = createDiscordMessageHandler({
                        cfg: cfg,
                        discordConfig: cfg.channels.discord,
                        accountId: "default",
                        token: "token",
                        runtime: {
                            log: vitest_1.vi.fn(),
                            error: vitest_1.vi.fn(),
                            exit: function (code) {
                                throw new Error("exit ".concat(code));
                            },
                        },
                        botUserId: "bot-id",
                        guildHistories: new Map(),
                        historyLimit: 0,
                        mediaMaxBytes: 10000,
                        textLimit: 2000,
                        replyToMode: "off",
                        dmEnabled: true,
                        groupDmEnabled: false,
                    });
                    client = {
                        fetchChannel: vitest_1.vi.fn().mockResolvedValue({
                            type: carbon_1.ChannelType.DM,
                            name: "dm",
                        }),
                    };
                    return [4 /*yield*/, handler({
                            message: {
                                id: "m1",
                                content: "hello",
                                channelId: "c1",
                                timestamp: new Date().toISOString(),
                                type: carbon_1.MessageType.Default,
                                attachments: [],
                                embeds: [],
                                mentionedEveryone: false,
                                mentionedUsers: [],
                                mentionedRoles: [],
                                author: { id: "u2", bot: false, username: "Ada" },
                            },
                            author: { id: "u2", bot: false, username: "Ada" },
                            guild_id: null,
                        }, client)];
                case 2:
                    _e.sent();
                    (0, vitest_1.expect)(dispatchMock).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(upsertPairingRequestMock).toHaveBeenCalled();
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(String((_b = (_a = sendMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : "")).toContain("Your Discord user id: u2");
                    (0, vitest_1.expect)(String((_d = (_c = sendMock.mock.calls[0]) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : "")).toContain("Pairing code: PAIRCODE");
                    return [2 /*return*/];
            }
        });
    }); }, 10000);
});
