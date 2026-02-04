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
var reply_dispatcher_js_1 = require("../auto-reply/reply/reply-dispatcher.js");
var dispatchMock = vitest_1.vi.fn();
vitest_1.vi.mock("@buape/carbon", function () { return ({
    ChannelType: { DM: "dm", GroupDM: "group" },
    MessageType: {
        ChatInputCommand: 1,
        ContextMenuCommand: 2,
        Default: 0,
    },
    Button: /** @class */ (function () {
        function Button() {
        }
        return Button;
    }()),
    Command: /** @class */ (function () {
        function Command() {
        }
        return Command;
    }()),
    Client: /** @class */ (function () {
        function Client() {
        }
        return Client;
    }()),
    MessageCreateListener: /** @class */ (function () {
        function MessageCreateListener() {
        }
        return MessageCreateListener;
    }()),
    MessageReactionAddListener: /** @class */ (function () {
        function MessageReactionAddListener() {
        }
        return MessageReactionAddListener;
    }()),
    MessageReactionRemoveListener: /** @class */ (function () {
        function MessageReactionRemoveListener() {
        }
        return MessageReactionRemoveListener;
    }()),
    PresenceUpdateListener: /** @class */ (function () {
        function PresenceUpdateListener() {
        }
        return PresenceUpdateListener;
    }()),
    Row: /** @class */ (function () {
        function Row() {
        }
        return Row;
    }()),
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
(0, vitest_1.beforeEach)(function () {
    dispatchMock.mockReset().mockImplementation(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, dispatcher, markDispatchIdle;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if ("dispatcher" in params && params.dispatcher) {
                        params.dispatcher.sendFinalReply({ text: "final reply" });
                        return [2 /*return*/, { queuedFinal: true, counts: { tool: 0, block: 0, final: 1 } }];
                    }
                    if (!("dispatcherOptions" in params && params.dispatcherOptions)) return [3 /*break*/, 2];
                    _a = (0, reply_dispatcher_js_1.createReplyDispatcherWithTyping)(params.dispatcherOptions), dispatcher = _a.dispatcher, markDispatchIdle = _a.markDispatchIdle;
                    dispatcher.sendFinalReply({ text: "final reply" });
                    return [4 /*yield*/, dispatcher.waitForIdle()];
                case 1:
                    _b.sent();
                    markDispatchIdle();
                    return [2 /*return*/, { queuedFinal: true, counts: dispatcher.getQueuedCounts() }];
                case 2: return [2 /*return*/, { queuedFinal: false, counts: { tool: 0, block: 0, final: 0 } }];
            }
        });
    }); });
});
(0, vitest_1.describe)("discord native commands", function () {
    (0, vitest_1.it)("skips tool results for native slash commands", { timeout: 60000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var ChannelType, createDiscordNativeCommand, cfg, command, reply, followUp;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("@buape/carbon"); })];
                case 1:
                    ChannelType = (_c.sent()).ChannelType;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./monitor.js"); })];
                case 2:
                    createDiscordNativeCommand = (_c.sent()).createDiscordNativeCommand;
                    cfg = {
                        agents: {
                            defaults: {
                                model: "anthropic/claude-opus-4-5",
                                humanDelay: { mode: "off" },
                                workspace: "/tmp/openclaw",
                            },
                        },
                        session: { store: "/tmp/openclaw-sessions.json" },
                        discord: { dm: { enabled: true, policy: "open" } },
                    };
                    command = createDiscordNativeCommand({
                        command: {
                            name: "verbose",
                            description: "Toggle verbose mode.",
                            acceptsArgs: true,
                        },
                        cfg: cfg,
                        discordConfig: cfg.discord,
                        accountId: "default",
                        sessionPrefix: "discord:slash",
                        ephemeralDefault: true,
                    });
                    reply = vitest_1.vi.fn().mockResolvedValue(undefined);
                    followUp = vitest_1.vi.fn().mockResolvedValue(undefined);
                    return [4 /*yield*/, command.run({
                            user: { id: "u1", username: "Ada", globalName: "Ada" },
                            channel: { type: ChannelType.DM },
                            guild: null,
                            rawData: { id: "i1" },
                            options: { getString: vitest_1.vi.fn().mockReturnValue("on") },
                            reply: reply,
                            followUp: followUp,
                        })];
                case 3:
                    _c.sent();
                    (0, vitest_1.expect)(dispatchMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(reply).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(followUp).toHaveBeenCalledTimes(0);
                    (0, vitest_1.expect)((_b = (_a = reply.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content).toContain("final");
                    return [2 /*return*/];
            }
        });
    }); });
});
