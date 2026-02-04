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
var discord_actions_guild_js_1 = require("./discord-actions-guild.js");
var discord_actions_messaging_js_1 = require("./discord-actions-messaging.js");
var discord_actions_moderation_js_1 = require("./discord-actions-moderation.js");
var createChannelDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ({
                id: "new-channel",
                name: "test",
                type: 0,
            })];
    });
}); });
var createThreadDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var deleteChannelDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ ok: true, channelId: "C1" })];
}); }); });
var deleteMessageDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var editChannelDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ({
                id: "C1",
                name: "edited",
            })];
    });
}); });
var editMessageDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var fetchMessageDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var fetchChannelPermissionsDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var fetchReactionsDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var listGuildChannelsDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, []];
}); }); });
var listPinsDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var listThreadsDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var moveChannelDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ ok: true })];
}); }); });
var pinMessageDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var reactMessageDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var readMessagesDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, []];
}); }); });
var removeChannelPermissionDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ ok: true })];
}); }); });
var removeOwnReactionsDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ removed: ["👍"] })];
}); }); });
var removeReactionDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var searchMessagesDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var sendMessageDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var sendPollDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var sendStickerDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var setChannelPermissionDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ ok: true })];
}); }); });
var unpinMessageDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var timeoutMemberDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var kickMemberDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
var banMemberDiscord = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({})];
}); }); });
vitest_1.vi.mock("../../discord/send.js", function () { return ({
    banMemberDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return banMemberDiscord.apply(void 0, args);
    },
    createChannelDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return createChannelDiscord.apply(void 0, args);
    },
    createThreadDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return createThreadDiscord.apply(void 0, args);
    },
    deleteChannelDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return deleteChannelDiscord.apply(void 0, args);
    },
    deleteMessageDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return deleteMessageDiscord.apply(void 0, args);
    },
    editChannelDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return editChannelDiscord.apply(void 0, args);
    },
    editMessageDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return editMessageDiscord.apply(void 0, args);
    },
    fetchMessageDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return fetchMessageDiscord.apply(void 0, args);
    },
    fetchChannelPermissionsDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return fetchChannelPermissionsDiscord.apply(void 0, args);
    },
    fetchReactionsDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return fetchReactionsDiscord.apply(void 0, args);
    },
    kickMemberDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return kickMemberDiscord.apply(void 0, args);
    },
    listGuildChannelsDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return listGuildChannelsDiscord.apply(void 0, args);
    },
    listPinsDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return listPinsDiscord.apply(void 0, args);
    },
    listThreadsDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return listThreadsDiscord.apply(void 0, args);
    },
    moveChannelDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return moveChannelDiscord.apply(void 0, args);
    },
    pinMessageDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return pinMessageDiscord.apply(void 0, args);
    },
    reactMessageDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return reactMessageDiscord.apply(void 0, args);
    },
    readMessagesDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return readMessagesDiscord.apply(void 0, args);
    },
    removeChannelPermissionDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return removeChannelPermissionDiscord.apply(void 0, args);
    },
    removeOwnReactionsDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return removeOwnReactionsDiscord.apply(void 0, args);
    },
    removeReactionDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return removeReactionDiscord.apply(void 0, args);
    },
    searchMessagesDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return searchMessagesDiscord.apply(void 0, args);
    },
    sendMessageDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return sendMessageDiscord.apply(void 0, args);
    },
    sendPollDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return sendPollDiscord.apply(void 0, args);
    },
    sendStickerDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return sendStickerDiscord.apply(void 0, args);
    },
    setChannelPermissionDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return setChannelPermissionDiscord.apply(void 0, args);
    },
    timeoutMemberDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return timeoutMemberDiscord.apply(void 0, args);
    },
    unpinMessageDiscord: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return unpinMessageDiscord.apply(void 0, args);
    },
}); });
var enableAllActions = function () { return true; };
var disabledActions = function (key) { return key !== "reactions"; };
var channelInfoEnabled = function (key) { return key === "channelInfo"; };
var moderationEnabled = function (key) { return key === "moderation"; };
(0, vitest_1.describe)("handleDiscordMessagingAction", function () {
    (0, vitest_1.it)("adds reactions", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_messaging_js_1.handleDiscordMessagingAction)("react", {
                        channelId: "C1",
                        messageId: "M1",
                        emoji: "✅",
                    }, enableAllActions)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(reactMessageDiscord).toHaveBeenCalledWith("C1", "M1", "✅");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("forwards accountId for reactions", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_messaging_js_1.handleDiscordMessagingAction)("react", {
                        channelId: "C1",
                        messageId: "M1",
                        emoji: "✅",
                        accountId: "ops",
                    }, enableAllActions)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(reactMessageDiscord).toHaveBeenCalledWith("C1", "M1", "✅", { accountId: "ops" });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("removes reactions on empty emoji", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_messaging_js_1.handleDiscordMessagingAction)("react", {
                        channelId: "C1",
                        messageId: "M1",
                        emoji: "",
                    }, enableAllActions)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(removeOwnReactionsDiscord).toHaveBeenCalledWith("C1", "M1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("removes reactions when remove flag set", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_messaging_js_1.handleDiscordMessagingAction)("react", {
                        channelId: "C1",
                        messageId: "M1",
                        emoji: "✅",
                        remove: true,
                    }, enableAllActions)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(removeReactionDiscord).toHaveBeenCalledWith("C1", "M1", "✅");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects removes without emoji", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, discord_actions_messaging_js_1.handleDiscordMessagingAction)("react", {
                        channelId: "C1",
                        messageId: "M1",
                        emoji: "",
                        remove: true,
                    }, enableAllActions)).rejects.toThrow(/Emoji is required/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("respects reaction gating", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, discord_actions_messaging_js_1.handleDiscordMessagingAction)("react", {
                        channelId: "C1",
                        messageId: "M1",
                        emoji: "✅",
                    }, disabledActions)).rejects.toThrow(/Discord reactions are disabled/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds normalized timestamps to readMessages payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, payload, expectedMs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readMessagesDiscord.mockResolvedValueOnce([{ id: "1", timestamp: "2026-01-15T10:00:00.000Z" }]);
                    return [4 /*yield*/, (0, discord_actions_messaging_js_1.handleDiscordMessagingAction)("readMessages", { channelId: "C1" }, enableAllActions)];
                case 1:
                    result = _a.sent();
                    payload = result.details;
                    expectedMs = Date.parse("2026-01-15T10:00:00.000Z");
                    (0, vitest_1.expect)(payload.messages[0].timestampMs).toBe(expectedMs);
                    (0, vitest_1.expect)(payload.messages[0].timestampUtc).toBe(new Date(expectedMs).toISOString());
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds normalized timestamps to fetchMessage payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, payload, expectedMs;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fetchMessageDiscord.mockResolvedValueOnce({
                        id: "1",
                        timestamp: "2026-01-15T11:00:00.000Z",
                    });
                    return [4 /*yield*/, (0, discord_actions_messaging_js_1.handleDiscordMessagingAction)("fetchMessage", { guildId: "G1", channelId: "C1", messageId: "M1" }, enableAllActions)];
                case 1:
                    result = _c.sent();
                    payload = result.details;
                    expectedMs = Date.parse("2026-01-15T11:00:00.000Z");
                    (0, vitest_1.expect)((_a = payload.message) === null || _a === void 0 ? void 0 : _a.timestampMs).toBe(expectedMs);
                    (0, vitest_1.expect)((_b = payload.message) === null || _b === void 0 ? void 0 : _b.timestampUtc).toBe(new Date(expectedMs).toISOString());
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds normalized timestamps to listPins payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, payload, expectedMs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    listPinsDiscord.mockResolvedValueOnce([{ id: "1", timestamp: "2026-01-15T12:00:00.000Z" }]);
                    return [4 /*yield*/, (0, discord_actions_messaging_js_1.handleDiscordMessagingAction)("listPins", { channelId: "C1" }, enableAllActions)];
                case 1:
                    result = _a.sent();
                    payload = result.details;
                    expectedMs = Date.parse("2026-01-15T12:00:00.000Z");
                    (0, vitest_1.expect)(payload.pins[0].timestampMs).toBe(expectedMs);
                    (0, vitest_1.expect)(payload.pins[0].timestampUtc).toBe(new Date(expectedMs).toISOString());
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds normalized timestamps to searchMessages payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, payload, expectedMs;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    searchMessagesDiscord.mockResolvedValueOnce({
                        total_results: 1,
                        messages: [[{ id: "1", timestamp: "2026-01-15T13:00:00.000Z" }]],
                    });
                    return [4 /*yield*/, (0, discord_actions_messaging_js_1.handleDiscordMessagingAction)("searchMessages", { guildId: "G1", content: "hi" }, enableAllActions)];
                case 1:
                    result = _j.sent();
                    payload = result.details;
                    expectedMs = Date.parse("2026-01-15T13:00:00.000Z");
                    (0, vitest_1.expect)((_d = (_c = (_b = (_a = payload.results) === null || _a === void 0 ? void 0 : _a.messages) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.timestampMs).toBe(expectedMs);
                    (0, vitest_1.expect)((_h = (_g = (_f = (_e = payload.results) === null || _e === void 0 ? void 0 : _e.messages) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.timestampUtc).toBe(new Date(expectedMs).toISOString());
                    return [2 /*return*/];
            }
        });
    }); });
});
var channelsEnabled = function (key) { return key === "channels"; };
var channelsDisabled = function () { return false; };
(0, vitest_1.describe)("handleDiscordGuildAction - channel management", function () {
    (0, vitest_1.it)("creates a channel", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_guild_js_1.handleDiscordGuildAction)("channelCreate", {
                        guildId: "G1",
                        name: "test-channel",
                        type: 0,
                        topic: "Test topic",
                    }, channelsEnabled)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(createChannelDiscord).toHaveBeenCalledWith({
                        guildId: "G1",
                        name: "test-channel",
                        type: 0,
                        parentId: undefined,
                        topic: "Test topic",
                        position: undefined,
                        nsfw: undefined,
                    });
                    (0, vitest_1.expect)(result.details).toMatchObject({ ok: true });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("respects channel gating for channelCreate", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, discord_actions_guild_js_1.handleDiscordGuildAction)("channelCreate", { guildId: "G1", name: "test" }, channelsDisabled)).rejects.toThrow(/Discord channel management is disabled/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("forwards accountId for channelList", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_guild_js_1.handleDiscordGuildAction)("channelList", { guildId: "G1", accountId: "ops" }, channelInfoEnabled)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(listGuildChannelsDiscord).toHaveBeenCalledWith("G1", { accountId: "ops" });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("edits a channel", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_guild_js_1.handleDiscordGuildAction)("channelEdit", {
                        channelId: "C1",
                        name: "new-name",
                        topic: "new topic",
                    }, channelsEnabled)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(editChannelDiscord).toHaveBeenCalledWith({
                        channelId: "C1",
                        name: "new-name",
                        topic: "new topic",
                        position: undefined,
                        parentId: undefined,
                        nsfw: undefined,
                        rateLimitPerUser: undefined,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("clears the channel parent when parentId is null", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_guild_js_1.handleDiscordGuildAction)("channelEdit", {
                        channelId: "C1",
                        parentId: null,
                    }, channelsEnabled)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(editChannelDiscord).toHaveBeenCalledWith({
                        channelId: "C1",
                        name: undefined,
                        topic: undefined,
                        position: undefined,
                        parentId: null,
                        nsfw: undefined,
                        rateLimitPerUser: undefined,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("clears the channel parent when clearParent is true", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_guild_js_1.handleDiscordGuildAction)("channelEdit", {
                        channelId: "C1",
                        clearParent: true,
                    }, channelsEnabled)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(editChannelDiscord).toHaveBeenCalledWith({
                        channelId: "C1",
                        name: undefined,
                        topic: undefined,
                        position: undefined,
                        parentId: null,
                        nsfw: undefined,
                        rateLimitPerUser: undefined,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("deletes a channel", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_guild_js_1.handleDiscordGuildAction)("channelDelete", { channelId: "C1" }, channelsEnabled)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(deleteChannelDiscord).toHaveBeenCalledWith("C1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("moves a channel", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_guild_js_1.handleDiscordGuildAction)("channelMove", {
                        guildId: "G1",
                        channelId: "C1",
                        parentId: "P1",
                        position: 5,
                    }, channelsEnabled)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(moveChannelDiscord).toHaveBeenCalledWith({
                        guildId: "G1",
                        channelId: "C1",
                        parentId: "P1",
                        position: 5,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("clears the channel parent on move when parentId is null", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_guild_js_1.handleDiscordGuildAction)("channelMove", {
                        guildId: "G1",
                        channelId: "C1",
                        parentId: null,
                    }, channelsEnabled)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(moveChannelDiscord).toHaveBeenCalledWith({
                        guildId: "G1",
                        channelId: "C1",
                        parentId: null,
                        position: undefined,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("clears the channel parent on move when clearParent is true", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_guild_js_1.handleDiscordGuildAction)("channelMove", {
                        guildId: "G1",
                        channelId: "C1",
                        clearParent: true,
                    }, channelsEnabled)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(moveChannelDiscord).toHaveBeenCalledWith({
                        guildId: "G1",
                        channelId: "C1",
                        parentId: null,
                        position: undefined,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("creates a category with type=4", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_guild_js_1.handleDiscordGuildAction)("categoryCreate", { guildId: "G1", name: "My Category" }, channelsEnabled)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(createChannelDiscord).toHaveBeenCalledWith({
                        guildId: "G1",
                        name: "My Category",
                        type: 4,
                        position: undefined,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("edits a category", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_guild_js_1.handleDiscordGuildAction)("categoryEdit", { categoryId: "CAT1", name: "Renamed Category" }, channelsEnabled)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(editChannelDiscord).toHaveBeenCalledWith({
                        channelId: "CAT1",
                        name: "Renamed Category",
                        position: undefined,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("deletes a category", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_guild_js_1.handleDiscordGuildAction)("categoryDelete", { categoryId: "CAT1" }, channelsEnabled)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(deleteChannelDiscord).toHaveBeenCalledWith("CAT1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sets channel permissions for role", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_guild_js_1.handleDiscordGuildAction)("channelPermissionSet", {
                        channelId: "C1",
                        targetId: "R1",
                        targetType: "role",
                        allow: "1024",
                        deny: "2048",
                    }, channelsEnabled)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(setChannelPermissionDiscord).toHaveBeenCalledWith({
                        channelId: "C1",
                        targetId: "R1",
                        targetType: 0,
                        allow: "1024",
                        deny: "2048",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sets channel permissions for member", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_guild_js_1.handleDiscordGuildAction)("channelPermissionSet", {
                        channelId: "C1",
                        targetId: "U1",
                        targetType: "member",
                        allow: "1024",
                    }, channelsEnabled)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(setChannelPermissionDiscord).toHaveBeenCalledWith({
                        channelId: "C1",
                        targetId: "U1",
                        targetType: 1,
                        allow: "1024",
                        deny: undefined,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("removes channel permissions", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_guild_js_1.handleDiscordGuildAction)("channelPermissionRemove", { channelId: "C1", targetId: "R1" }, channelsEnabled)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(removeChannelPermissionDiscord).toHaveBeenCalledWith("C1", "R1");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("handleDiscordModerationAction", function () {
    (0, vitest_1.it)("forwards accountId for timeout", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discord_actions_moderation_js_1.handleDiscordModerationAction)("timeout", {
                        guildId: "G1",
                        userId: "U1",
                        durationMinutes: 5,
                        accountId: "ops",
                    }, moderationEnabled)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(timeoutMemberDiscord).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        guildId: "G1",
                        userId: "U1",
                        durationMinutes: 5,
                    }), { accountId: "ops" });
                    return [2 /*return*/];
            }
        });
    }); });
});
