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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var reactMessageDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); });
var removeReactionDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); });
vitest_1.vi.mock("../send.js", function () { return ({
    reactMessageDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return reactMessageDiscord.apply(void 0, args);
    },
    removeReactionDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return removeReactionDiscord.apply(void 0, args);
    },
}); });
vitest_1.vi.mock("../../auto-reply/reply/dispatch-from-config.js", function () { return ({
    dispatchReplyFromConfig: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    queuedFinal: false,
                    counts: { final: 0, tool: 0, block: 0 },
                })];
        });
    }); }),
}); });
vitest_1.vi.mock("../../auto-reply/reply/reply-dispatcher.js", function () { return ({
    createReplyDispatcherWithTyping: vitest_1.vi.fn(function () { return ({
        dispatcher: {},
        replyOptions: {},
        markDispatchIdle: vitest_1.vi.fn(),
    }); }),
}); });
var processDiscordMessage = (await Promise.resolve().then(function () { return require("./message-handler.process.js"); })).processDiscordMessage;
function createBaseContext() {
    return __awaiter(this, arguments, void 0, function (overrides) {
        var dir, storePath;
        if (overrides === void 0) { overrides = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-discord-"))];
                case 1:
                    dir = _a.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    return [2 /*return*/, __assign({ cfg: { messages: { ackReaction: "👀" }, session: { store: storePath } }, discordConfig: {}, accountId: "default", token: "token", runtime: { log: function () { }, error: function () { } }, guildHistories: new Map(), historyLimit: 0, mediaMaxBytes: 1024, textLimit: 4000, replyToMode: "off", ackReactionScope: "group-mentions", groupPolicy: "open", data: { guild: { id: "g1", name: "Guild" } }, client: { rest: {} }, message: {
                                id: "m1",
                                channelId: "c1",
                                timestamp: new Date().toISOString(),
                                attachments: [],
                            }, author: {
                                id: "U1",
                                username: "alice",
                                discriminator: "0",
                                globalName: "Alice",
                            }, channelInfo: { name: "general" }, channelName: "general", isGuildMessage: true, isDirectMessage: false, isGroupDm: false, commandAuthorized: true, baseText: "hi", messageText: "hi", wasMentioned: false, shouldRequireMention: true, canDetectMention: true, effectiveWasMentioned: true, shouldBypassMention: false, threadChannel: null, threadParentId: undefined, threadParentName: undefined, threadParentType: undefined, threadName: undefined, displayChannelSlug: "general", guildInfo: null, guildSlug: "guild", channelConfig: null, baseSessionKey: "agent:main:discord:guild:g1", route: {
                                agentId: "main",
                                channel: "discord",
                                accountId: "default",
                                sessionKey: "agent:main:discord:guild:g1",
                                mainSessionKey: "agent:main:main",
                            } }, overrides)];
            }
        });
    });
}
(0, vitest_1.beforeEach)(function () {
    reactMessageDiscord.mockClear();
    removeReactionDiscord.mockClear();
});
(0, vitest_1.describe)("processDiscordMessage ack reactions", function () {
    (0, vitest_1.it)("skips ack reactions for group-mentions when mentions are not required", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ctx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createBaseContext({
                        shouldRequireMention: false,
                        effectiveWasMentioned: false,
                        sender: { label: "user" },
                    })];
                case 1:
                    ctx = _a.sent();
                    // oxlint-disable-next-line typescript/no-explicit-any
                    return [4 /*yield*/, processDiscordMessage(ctx)];
                case 2:
                    // oxlint-disable-next-line typescript/no-explicit-any
                    _a.sent();
                    (0, vitest_1.expect)(reactMessageDiscord).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends ack reactions for mention-gated guild messages when mentioned", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ctx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createBaseContext({
                        shouldRequireMention: true,
                        effectiveWasMentioned: true,
                        sender: { label: "user" },
                    })];
                case 1:
                    ctx = _a.sent();
                    // oxlint-disable-next-line typescript/no-explicit-any
                    return [4 /*yield*/, processDiscordMessage(ctx)];
                case 2:
                    // oxlint-disable-next-line typescript/no-explicit-any
                    _a.sent();
                    (0, vitest_1.expect)(reactMessageDiscord).toHaveBeenCalledWith("c1", "m1", "👀", { rest: {} });
                    return [2 /*return*/];
            }
        });
    }); });
});
