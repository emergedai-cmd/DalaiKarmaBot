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
var v10_1 = require("discord-api-types/v10");
var vitest_1 = require("vitest");
var message_utils_js_1 = require("./monitor/message-utils.js");
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
    vitest_1.vi.useRealTimers();
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
});
(0, vitest_1.describe)("discord tool result dispatch", function () {
    (0, vitest_1.it)("accepts guild messages when mentionPatterns match", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createDiscordMessageHandler, cfg, handler, client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./monitor.js"); })];
                case 1:
                    createDiscordMessageHandler = (_a.sent()).createDiscordMessageHandler;
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
                                groupPolicy: "open",
                                guilds: { "*": { requireMention: true } },
                            },
                        },
                        messages: {
                            responsePrefix: "PFX",
                            groupChat: { mentionPatterns: ["\\bopenclaw\\b"] },
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
                        guildEntries: { "*": { requireMention: true } },
                    });
                    client = {
                        fetchChannel: vitest_1.vi.fn().mockResolvedValue({
                            type: carbon_1.ChannelType.GuildText,
                            name: "general",
                        }),
                    };
                    return [4 /*yield*/, handler({
                            message: {
                                id: "m2",
                                content: "openclaw: hello",
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
                            member: { nickname: "Ada" },
                            guild: { id: "g1", name: "Guild" },
                            guild_id: "g1",
                        }, client)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(dispatchMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); }, 20000);
    (0, vitest_1.it)("accepts guild messages when mentionPatterns match even if another user is mentioned", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createDiscordMessageHandler, cfg, handler, client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./monitor.js"); })];
                case 1:
                    createDiscordMessageHandler = (_a.sent()).createDiscordMessageHandler;
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
                                groupPolicy: "open",
                                guilds: { "*": { requireMention: true } },
                            },
                        },
                        messages: {
                            responsePrefix: "PFX",
                            groupChat: { mentionPatterns: ["\\bopenclaw\\b"] },
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
                        guildEntries: { "*": { requireMention: true } },
                    });
                    client = {
                        fetchChannel: vitest_1.vi.fn().mockResolvedValue({
                            type: carbon_1.ChannelType.GuildText,
                            name: "general",
                        }),
                    };
                    return [4 /*yield*/, handler({
                            message: {
                                id: "m2",
                                content: "openclaw: hello",
                                channelId: "c1",
                                timestamp: new Date().toISOString(),
                                type: carbon_1.MessageType.Default,
                                attachments: [],
                                embeds: [],
                                mentionedEveryone: false,
                                mentionedUsers: [{ id: "u2", bot: false, username: "Bea" }],
                                mentionedRoles: [],
                                author: { id: "u1", bot: false, username: "Ada" },
                            },
                            author: { id: "u1", bot: false, username: "Ada" },
                            member: { nickname: "Ada" },
                            guild: { id: "g1", name: "Guild" },
                            guild_id: "g1",
                        }, client)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(dispatchMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); }, 20000);
    (0, vitest_1.it)("accepts guild reply-to-bot messages as implicit mentions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createDiscordMessageHandler, cfg, handler, client, payload;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./monitor.js"); })];
                case 1:
                    createDiscordMessageHandler = (_c.sent()).createDiscordMessageHandler;
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
                                groupPolicy: "open",
                                guilds: { "*": { requireMention: true } },
                            },
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
                        guildEntries: { "*": { requireMention: true } },
                    });
                    client = {
                        fetchChannel: vitest_1.vi.fn().mockResolvedValue({
                            type: carbon_1.ChannelType.GuildText,
                            name: "general",
                        }),
                    };
                    return [4 /*yield*/, handler({
                            message: {
                                id: "m3",
                                content: "following up",
                                channelId: "c1",
                                timestamp: new Date().toISOString(),
                                type: carbon_1.MessageType.Default,
                                attachments: [],
                                embeds: [],
                                mentionedEveryone: false,
                                mentionedUsers: [],
                                mentionedRoles: [],
                                author: { id: "u1", bot: false, username: "Ada" },
                                referencedMessage: {
                                    id: "m2",
                                    channelId: "c1",
                                    content: "bot reply",
                                    timestamp: new Date().toISOString(),
                                    type: carbon_1.MessageType.Default,
                                    attachments: [],
                                    embeds: [],
                                    mentionedEveryone: false,
                                    mentionedUsers: [],
                                    mentionedRoles: [],
                                    author: { id: "bot-id", bot: true, username: "OpenClaw" },
                                },
                            },
                            author: { id: "u1", bot: false, username: "Ada" },
                            member: { nickname: "Ada" },
                            guild: { id: "g1", name: "Guild" },
                            guild_id: "g1",
                            channel: { id: "c1", type: carbon_1.ChannelType.GuildText },
                            client: client,
                            data: {
                                id: "m3",
                                content: "following up",
                                channel_id: "c1",
                                guild_id: "g1",
                                type: carbon_1.MessageType.Default,
                                mentions: [],
                            },
                        }, client)];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(dispatchMock).toHaveBeenCalledTimes(1);
                    payload = (_b = (_a = dispatchMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.ctx;
                    (0, vitest_1.expect)(payload.WasMentioned).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("forks thread sessions and injects starter context", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createDiscordMessageHandler, capturedCtx, cfg, handler, threadChannel, client;
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
                        messages: { responsePrefix: "PFX" },
                        channels: {
                            discord: {
                                dm: { enabled: true, policy: "open" },
                                groupPolicy: "open",
                                guilds: { "*": { requireMention: false } },
                            },
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
                        guildEntries: { "*": { requireMention: false } },
                    });
                    threadChannel = {
                        type: carbon_1.ChannelType.GuildText,
                        name: "thread-name",
                        parentId: "p1",
                        parent: { id: "p1", name: "general" },
                        isThread: function () { return true; },
                        fetchStarterMessage: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        content: "starter message",
                                        author: { tag: "Alice#1", username: "Alice" },
                                        createdTimestamp: Date.now(),
                                    })];
                            });
                        }); },
                    };
                    client = {
                        fetchChannel: vitest_1.vi.fn().mockResolvedValue({
                            type: carbon_1.ChannelType.GuildText,
                            name: "thread-name",
                        }),
                        rest: {
                            get: vitest_1.vi.fn().mockResolvedValue({
                                content: "starter message",
                                author: { id: "u1", username: "Alice", discriminator: "0001" },
                                timestamp: new Date().toISOString(),
                            }),
                        },
                    };
                    return [4 /*yield*/, handler({
                            message: {
                                id: "m4",
                                content: "thread reply",
                                channelId: "t1",
                                channel: threadChannel,
                                timestamp: new Date().toISOString(),
                                type: carbon_1.MessageType.Default,
                                attachments: [],
                                embeds: [],
                                mentionedEveryone: false,
                                mentionedUsers: [],
                                mentionedRoles: [],
                                author: { id: "u2", bot: false, username: "Bob", tag: "Bob#2" },
                            },
                            author: { id: "u2", bot: false, username: "Bob", tag: "Bob#2" },
                            member: { displayName: "Bob" },
                            guild: { id: "g1", name: "Guild" },
                            guild_id: "g1",
                        }, client)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(capturedCtx === null || capturedCtx === void 0 ? void 0 : capturedCtx.SessionKey).toBe("agent:main:discord:channel:t1");
                    (0, vitest_1.expect)(capturedCtx === null || capturedCtx === void 0 ? void 0 : capturedCtx.ParentSessionKey).toBe("agent:main:discord:channel:p1");
                    (0, vitest_1.expect)(capturedCtx === null || capturedCtx === void 0 ? void 0 : capturedCtx.ThreadStarterBody).toContain("starter message");
                    (0, vitest_1.expect)(capturedCtx === null || capturedCtx === void 0 ? void 0 : capturedCtx.ThreadLabel).toContain("Discord thread #general");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats forum threads as distinct sessions without channel payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createDiscordMessageHandler, capturedCtx, cfg, handler, fetchChannel, restGet, client;
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
                        agent: { model: "anthropic/claude-opus-4-5", workspace: "/tmp/openclaw" },
                        session: { store: "/tmp/openclaw-sessions.json" },
                        channels: {
                            discord: {
                                dm: { enabled: true, policy: "open" },
                                groupPolicy: "open",
                                guilds: { "*": { requireMention: false } },
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
                        guildEntries: { "*": { requireMention: false } },
                    });
                    fetchChannel = vitest_1.vi
                        .fn()
                        .mockResolvedValueOnce({
                        type: carbon_1.ChannelType.PublicThread,
                        name: "topic-1",
                        parentId: "forum-1",
                    })
                        .mockResolvedValueOnce({
                        type: carbon_1.ChannelType.GuildForum,
                        name: "support",
                    });
                    restGet = vitest_1.vi.fn().mockResolvedValue({
                        content: "starter message",
                        author: { id: "u1", username: "Alice", discriminator: "0001" },
                        timestamp: new Date().toISOString(),
                    });
                    client = {
                        fetchChannel: fetchChannel,
                        rest: {
                            get: restGet,
                        },
                    };
                    return [4 /*yield*/, handler({
                            message: {
                                id: "m6",
                                content: "thread reply",
                                channelId: "t1",
                                timestamp: new Date().toISOString(),
                                type: carbon_1.MessageType.Default,
                                attachments: [],
                                embeds: [],
                                mentionedEveryone: false,
                                mentionedUsers: [],
                                mentionedRoles: [],
                                author: { id: "u2", bot: false, username: "Bob", tag: "Bob#2" },
                            },
                            author: { id: "u2", bot: false, username: "Bob", tag: "Bob#2" },
                            member: { displayName: "Bob" },
                            guild: { id: "g1", name: "Guild" },
                            guild_id: "g1",
                        }, client)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(capturedCtx === null || capturedCtx === void 0 ? void 0 : capturedCtx.SessionKey).toBe("agent:main:discord:channel:t1");
                    (0, vitest_1.expect)(capturedCtx === null || capturedCtx === void 0 ? void 0 : capturedCtx.ParentSessionKey).toBe("agent:main:discord:channel:forum-1");
                    (0, vitest_1.expect)(capturedCtx === null || capturedCtx === void 0 ? void 0 : capturedCtx.ThreadStarterBody).toContain("starter message");
                    (0, vitest_1.expect)(capturedCtx === null || capturedCtx === void 0 ? void 0 : capturedCtx.ThreadLabel).toContain("Discord thread #support");
                    (0, vitest_1.expect)(restGet).toHaveBeenCalledWith(v10_1.Routes.channelMessage("t1", "t1"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("scopes thread sessions to the routed agent", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createDiscordMessageHandler, capturedCtx, cfg, handler, threadChannel, client;
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
                        messages: { responsePrefix: "PFX" },
                        channels: {
                            discord: {
                                dm: { enabled: true, policy: "open" },
                                groupPolicy: "open",
                                guilds: { "*": { requireMention: false } },
                            },
                        },
                        bindings: [{ agentId: "support", match: { channel: "discord", guildId: "g1" } }],
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
                        guildEntries: { "*": { requireMention: false } },
                    });
                    threadChannel = {
                        type: carbon_1.ChannelType.GuildText,
                        name: "thread-name",
                        parentId: "p1",
                        parent: { id: "p1", name: "general" },
                        isThread: function () { return true; },
                    };
                    client = {
                        fetchChannel: vitest_1.vi.fn().mockResolvedValue({
                            type: carbon_1.ChannelType.GuildText,
                            name: "thread-name",
                        }),
                        rest: {
                            get: vitest_1.vi.fn().mockResolvedValue({
                                content: "starter message",
                                author: { id: "u1", username: "Alice", discriminator: "0001" },
                                timestamp: new Date().toISOString(),
                            }),
                        },
                    };
                    return [4 /*yield*/, handler({
                            message: {
                                id: "m5",
                                content: "thread reply",
                                channelId: "t1",
                                channel: threadChannel,
                                timestamp: new Date().toISOString(),
                                type: carbon_1.MessageType.Default,
                                attachments: [],
                                embeds: [],
                                mentionedEveryone: false,
                                mentionedUsers: [],
                                mentionedRoles: [],
                                author: { id: "u2", bot: false, username: "Bob", tag: "Bob#2" },
                            },
                            author: { id: "u2", bot: false, username: "Bob", tag: "Bob#2" },
                            member: { displayName: "Bob" },
                            guild: { id: "g1", name: "Guild" },
                            guild_id: "g1",
                        }, client)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(capturedCtx === null || capturedCtx === void 0 ? void 0 : capturedCtx.SessionKey).toBe("agent:support:discord:channel:t1");
                    (0, vitest_1.expect)(capturedCtx === null || capturedCtx === void 0 ? void 0 : capturedCtx.ParentSessionKey).toBe("agent:support:discord:channel:p1");
                    return [2 /*return*/];
            }
        });
    }); });
});
