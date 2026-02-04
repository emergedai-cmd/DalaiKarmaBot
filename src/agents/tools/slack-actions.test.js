"use strict";
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
var slack_actions_js_1 = require("./slack-actions.js");
var deleteSlackMessage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var editSlackMessage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var getSlackMemberInfo = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var listSlackEmojis = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var listSlackPins = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var listSlackReactions = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var pinSlackMessage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var reactSlackMessage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var readSlackMessages = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var removeOwnSlackReactions = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ["thumbsup"]];
}); }); });
var removeSlackReaction = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var sendSlackMessage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var unpinSlackMessage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
vitest_1.vi.mock("../../slack/actions.js", function () { return ({
    deleteSlackMessage: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return deleteSlackMessage.apply(void 0, args);
    },
    editSlackMessage: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return editSlackMessage.apply(void 0, args);
    },
    getSlackMemberInfo: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return getSlackMemberInfo.apply(void 0, args);
    },
    listSlackEmojis: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return listSlackEmojis.apply(void 0, args);
    },
    listSlackPins: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return listSlackPins.apply(void 0, args);
    },
    listSlackReactions: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return listSlackReactions.apply(void 0, args);
    },
    pinSlackMessage: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return pinSlackMessage.apply(void 0, args);
    },
    reactSlackMessage: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return reactSlackMessage.apply(void 0, args);
    },
    readSlackMessages: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return readSlackMessages.apply(void 0, args);
    },
    removeOwnSlackReactions: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return removeOwnSlackReactions.apply(void 0, args);
    },
    removeSlackReaction: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return removeSlackReaction.apply(void 0, args);
    },
    sendSlackMessage: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return sendSlackMessage.apply(void 0, args);
    },
    unpinSlackMessage: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return unpinSlackMessage.apply(void 0, args);
    },
}); });
(0, vitest_1.describe)("handleSlackAction", function () {
    (0, vitest_1.it)("adds reactions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                            action: "react",
                            channelId: "C1",
                            messageId: "123.456",
                            emoji: "✅",
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(reactSlackMessage).toHaveBeenCalledWith("C1", "123.456", "✅");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("strips channel: prefix for channelId params", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                            action: "react",
                            channelId: "channel:C1",
                            messageId: "123.456",
                            emoji: "✅",
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(reactSlackMessage).toHaveBeenCalledWith("C1", "123.456", "✅");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("removes reactions on empty emoji", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                            action: "react",
                            channelId: "C1",
                            messageId: "123.456",
                            emoji: "",
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(removeOwnSlackReactions).toHaveBeenCalledWith("C1", "123.456");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("removes reactions when remove flag set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                            action: "react",
                            channelId: "C1",
                            messageId: "123.456",
                            emoji: "✅",
                            remove: true,
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(removeSlackReaction).toHaveBeenCalledWith("C1", "123.456", "✅");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects removes without emoji", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, slack_actions_js_1.handleSlackAction)({
                            action: "react",
                            channelId: "C1",
                            messageId: "123.456",
                            emoji: "",
                            remove: true,
                        }, cfg)).rejects.toThrow(/Emoji is required/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("respects reaction gating", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: { slack: { botToken: "tok", actions: { reactions: false } } },
                    };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, slack_actions_js_1.handleSlackAction)({
                            action: "react",
                            channelId: "C1",
                            messageId: "123.456",
                            emoji: "✅",
                        }, cfg)).rejects.toThrow(/Slack reactions are disabled/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes threadTs to sendSlackMessage for thread replies", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                            action: "sendMessage",
                            to: "channel:C123",
                            content: "Hello thread",
                            threadTs: "1234567890.123456",
                        }, cfg)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendSlackMessage).toHaveBeenCalledWith("channel:C123", "Hello thread", {
                        mediaUrl: undefined,
                        threadTs: "1234567890.123456",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("auto-injects threadTs from context when replyToMode=all", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    sendSlackMessage.mockClear();
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                            action: "sendMessage",
                            to: "channel:C123",
                            content: "Auto-threaded",
                        }, cfg, {
                            currentChannelId: "C123",
                            currentThreadTs: "1111111111.111111",
                            replyToMode: "all",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendSlackMessage).toHaveBeenCalledWith("channel:C123", "Auto-threaded", {
                        mediaUrl: undefined,
                        threadTs: "1111111111.111111",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("replyToMode=first threads first message then stops", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, hasRepliedRef, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    sendSlackMessage.mockClear();
                    hasRepliedRef = { value: false };
                    context = {
                        currentChannelId: "C123",
                        currentThreadTs: "1111111111.111111",
                        replyToMode: "first",
                        hasRepliedRef: hasRepliedRef,
                    };
                    // First message should be threaded
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({ action: "sendMessage", to: "channel:C123", content: "First" }, cfg, context)];
                case 1:
                    // First message should be threaded
                    _a.sent();
                    (0, vitest_1.expect)(sendSlackMessage).toHaveBeenLastCalledWith("channel:C123", "First", {
                        mediaUrl: undefined,
                        threadTs: "1111111111.111111",
                    });
                    (0, vitest_1.expect)(hasRepliedRef.value).toBe(true);
                    // Second message should NOT be threaded
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({ action: "sendMessage", to: "channel:C123", content: "Second" }, cfg, context)];
                case 2:
                    // Second message should NOT be threaded
                    _a.sent();
                    (0, vitest_1.expect)(sendSlackMessage).toHaveBeenLastCalledWith("channel:C123", "Second", {
                        mediaUrl: undefined,
                        threadTs: undefined,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("replyToMode=first marks hasRepliedRef even when threadTs is explicit", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, hasRepliedRef, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    sendSlackMessage.mockClear();
                    hasRepliedRef = { value: false };
                    context = {
                        currentChannelId: "C123",
                        currentThreadTs: "1111111111.111111",
                        replyToMode: "first",
                        hasRepliedRef: hasRepliedRef,
                    };
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                            action: "sendMessage",
                            to: "channel:C123",
                            content: "Explicit",
                            threadTs: "2222222222.222222",
                        }, cfg, context)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendSlackMessage).toHaveBeenLastCalledWith("channel:C123", "Explicit", {
                        mediaUrl: undefined,
                        threadTs: "2222222222.222222",
                    });
                    (0, vitest_1.expect)(hasRepliedRef.value).toBe(true);
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({ action: "sendMessage", to: "channel:C123", content: "Second" }, cfg, context)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(sendSlackMessage).toHaveBeenLastCalledWith("channel:C123", "Second", {
                        mediaUrl: undefined,
                        threadTs: undefined,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("replyToMode=first without hasRepliedRef does not thread", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    sendSlackMessage.mockClear();
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({ action: "sendMessage", to: "channel:C123", content: "No ref" }, cfg, {
                            currentChannelId: "C123",
                            currentThreadTs: "1111111111.111111",
                            replyToMode: "first",
                            // no hasRepliedRef
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendSlackMessage).toHaveBeenCalledWith("channel:C123", "No ref", {
                        mediaUrl: undefined,
                        threadTs: undefined,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not auto-inject threadTs when replyToMode=off", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    sendSlackMessage.mockClear();
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                            action: "sendMessage",
                            to: "channel:C123",
                            content: "Off mode",
                        }, cfg, {
                            currentChannelId: "C123",
                            currentThreadTs: "1111111111.111111",
                            replyToMode: "off",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendSlackMessage).toHaveBeenCalledWith("channel:C123", "Off mode", {
                        mediaUrl: undefined,
                        threadTs: undefined,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not auto-inject threadTs when sending to different channel", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    sendSlackMessage.mockClear();
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                            action: "sendMessage",
                            to: "channel:C999",
                            content: "Different channel",
                        }, cfg, {
                            currentChannelId: "C123",
                            currentThreadTs: "1111111111.111111",
                            replyToMode: "all",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendSlackMessage).toHaveBeenCalledWith("channel:C999", "Different channel", {
                        mediaUrl: undefined,
                        threadTs: undefined,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("explicit threadTs overrides context threadTs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    sendSlackMessage.mockClear();
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                            action: "sendMessage",
                            to: "channel:C123",
                            content: "Explicit thread",
                            threadTs: "2222222222.222222",
                        }, cfg, {
                            currentChannelId: "C123",
                            currentThreadTs: "1111111111.111111",
                            replyToMode: "all",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendSlackMessage).toHaveBeenCalledWith("channel:C123", "Explicit thread", {
                        mediaUrl: undefined,
                        threadTs: "2222222222.222222",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles channel target without prefix when replyToMode=all", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    sendSlackMessage.mockClear();
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                            action: "sendMessage",
                            to: "C123",
                            content: "No prefix",
                        }, cfg, {
                            currentChannelId: "C123",
                            currentThreadTs: "1111111111.111111",
                            replyToMode: "all",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendSlackMessage).toHaveBeenCalledWith("C123", "No prefix", {
                        mediaUrl: undefined,
                        threadTs: "1111111111.111111",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds normalized timestamps to readMessages payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, result, payload, expectedMs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    readSlackMessages.mockResolvedValueOnce({
                        messages: [{ ts: "1735689600.456", text: "hi" }],
                        hasMore: false,
                    });
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({ action: "readMessages", channelId: "C1" }, cfg)];
                case 1:
                    result = _a.sent();
                    payload = result.details;
                    expectedMs = Math.round(1735689600.456 * 1000);
                    (0, vitest_1.expect)(payload.messages[0].timestampMs).toBe(expectedMs);
                    (0, vitest_1.expect)(payload.messages[0].timestampUtc).toBe(new Date(expectedMs).toISOString());
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes threadId through to readSlackMessages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, _a, opts;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    readSlackMessages.mockClear();
                    readSlackMessages.mockResolvedValueOnce({ messages: [], hasMore: false });
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({ action: "readMessages", channelId: "C1", threadId: "12345.6789" }, cfg)];
                case 1:
                    _c.sent();
                    _a = (_b = readSlackMessages.mock.calls[0]) !== null && _b !== void 0 ? _b : [], opts = _a[1];
                    (0, vitest_1.expect)(opts === null || opts === void 0 ? void 0 : opts.threadId).toBe("12345.6789");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds normalized timestamps to pin payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, result, payload, expectedMs;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = { channels: { slack: { botToken: "tok" } } };
                    listSlackPins.mockResolvedValueOnce([
                        {
                            type: "message",
                            message: { ts: "1735689600.789", text: "pinned" },
                        },
                    ]);
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({ action: "listPins", channelId: "C1" }, cfg)];
                case 1:
                    result = _c.sent();
                    payload = result.details;
                    expectedMs = Math.round(1735689600.789 * 1000);
                    (0, vitest_1.expect)((_a = payload.pins[0].message) === null || _a === void 0 ? void 0 : _a.timestampMs).toBe(expectedMs);
                    (0, vitest_1.expect)((_b = payload.pins[0].message) === null || _b === void 0 ? void 0 : _b.timestampUtc).toBe(new Date(expectedMs).toISOString());
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses user token for reads when available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, _a, opts;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = {
                        channels: { slack: { botToken: "xoxb-1", userToken: "xoxp-1" } },
                    };
                    readSlackMessages.mockClear();
                    readSlackMessages.mockResolvedValueOnce({ messages: [], hasMore: false });
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({ action: "readMessages", channelId: "C1" }, cfg)];
                case 1:
                    _c.sent();
                    _a = (_b = readSlackMessages.mock.calls[0]) !== null && _b !== void 0 ? _b : [], opts = _a[1];
                    (0, vitest_1.expect)(opts === null || opts === void 0 ? void 0 : opts.token).toBe("xoxp-1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to bot token for reads when user token missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, _a, opts;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = {
                        channels: { slack: { botToken: "xoxb-1" } },
                    };
                    readSlackMessages.mockClear();
                    readSlackMessages.mockResolvedValueOnce({ messages: [], hasMore: false });
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({ action: "readMessages", channelId: "C1" }, cfg)];
                case 1:
                    _c.sent();
                    _a = (_b = readSlackMessages.mock.calls[0]) !== null && _b !== void 0 ? _b : [], opts = _a[1];
                    (0, vitest_1.expect)(opts === null || opts === void 0 ? void 0 : opts.token).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses bot token for writes when userTokenReadOnly is true", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, _a, opts;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = {
                        channels: { slack: { botToken: "xoxb-1", userToken: "xoxp-1" } },
                    };
                    sendSlackMessage.mockClear();
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({ action: "sendMessage", to: "channel:C1", content: "Hello" }, cfg)];
                case 1:
                    _c.sent();
                    _a = (_b = sendSlackMessage.mock.calls[0]) !== null && _b !== void 0 ? _b : [], opts = _a[2];
                    (0, vitest_1.expect)(opts === null || opts === void 0 ? void 0 : opts.token).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows user token writes when bot token is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, _a, opts;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = {
                        channels: {
                            slack: { userToken: "xoxp-1", userTokenReadOnly: false },
                        },
                    };
                    sendSlackMessage.mockClear();
                    return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({ action: "sendMessage", to: "channel:C1", content: "Hello" }, cfg)];
                case 1:
                    _c.sent();
                    _a = (_b = sendSlackMessage.mock.calls[0]) !== null && _b !== void 0 ? _b : [], opts = _a[2];
                    (0, vitest_1.expect)(opts === null || opts === void 0 ? void 0 : opts.token).toBe("xoxp-1");
                    return [2 /*return*/];
            }
        });
    }); });
});
