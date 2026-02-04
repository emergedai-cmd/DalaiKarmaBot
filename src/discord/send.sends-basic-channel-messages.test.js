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
var v10_1 = require("discord-api-types/v10");
var vitest_1 = require("vitest");
var send_js_1 = require("./send.js");
vitest_1.vi.mock("../web/media.js", function () { return ({
    loadWebMedia: vitest_1.vi.fn().mockResolvedValue({
        buffer: Buffer.from("img"),
        fileName: "photo.jpg",
        contentType: "image/jpeg",
        kind: "image",
    }),
    loadWebMediaRaw: vitest_1.vi.fn().mockResolvedValue({
        buffer: Buffer.from("img"),
        fileName: "asset.png",
        contentType: "image/png",
        kind: "image",
    }),
}); });
var makeRest = function () {
    var postMock = vitest_1.vi.fn();
    var putMock = vitest_1.vi.fn();
    var getMock = vitest_1.vi.fn();
    var patchMock = vitest_1.vi.fn();
    var deleteMock = vitest_1.vi.fn();
    return {
        rest: {
            post: postMock,
            put: putMock,
            get: getMock,
            patch: patchMock,
            delete: deleteMock,
        },
        postMock: postMock,
        putMock: putMock,
        getMock: getMock,
        patchMock: patchMock,
        deleteMock: deleteMock,
    };
};
(0, vitest_1.describe)("sendMessageDiscord", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("sends basic channel messages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, postMock, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, postMock = _a.postMock;
                    postMock.mockResolvedValue({
                        id: "msg1",
                        channel_id: "789",
                    });
                    return [4 /*yield*/, (0, send_js_1.sendMessageDiscord)("channel:789", "hello world", {
                            rest: rest,
                            token: "t",
                        })];
                case 1:
                    res = _b.sent();
                    (0, vitest_1.expect)(res).toEqual({ messageId: "msg1", channelId: "789" });
                    (0, vitest_1.expect)(postMock).toHaveBeenCalledWith(v10_1.Routes.channelMessages("789"), vitest_1.expect.objectContaining({ body: { content: "hello world" } }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("starts DM when recipient is a user", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, postMock, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, postMock = _a.postMock;
                    postMock
                        .mockResolvedValueOnce({ id: "chan1" })
                        .mockResolvedValueOnce({ id: "msg1", channel_id: "chan1" });
                    return [4 /*yield*/, (0, send_js_1.sendMessageDiscord)("user:123", "hiya", {
                            rest: rest,
                            token: "t",
                        })];
                case 1:
                    res = _b.sent();
                    (0, vitest_1.expect)(postMock).toHaveBeenNthCalledWith(1, v10_1.Routes.userChannels(), vitest_1.expect.objectContaining({ body: { recipient_id: "123" } }));
                    (0, vitest_1.expect)(postMock).toHaveBeenNthCalledWith(2, v10_1.Routes.channelMessages("chan1"), vitest_1.expect.objectContaining({ body: { content: "hiya" } }));
                    (0, vitest_1.expect)(res.channelId).toBe("chan1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects bare numeric IDs as ambiguous", function () { return __awaiter(void 0, void 0, void 0, function () {
        var rest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rest = makeRest().rest;
                    return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendMessageDiscord)("273512430271856640", "hello", { rest: rest, token: "t" })).rejects.toThrow(/Ambiguous Discord recipient/)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendMessageDiscord)("273512430271856640", "hello", { rest: rest, token: "t" })).rejects.toThrow(/user:273512430271856640/)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendMessageDiscord)("273512430271856640", "hello", { rest: rest, token: "t" })).rejects.toThrow(/channel:273512430271856640/)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds missing permission hints on 50013", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, postMock, getMock, perms, apiError, error, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, postMock = _a.postMock, getMock = _a.getMock;
                    perms = v10_1.PermissionFlagsBits.ViewChannel;
                    apiError = Object.assign(new Error("Missing Permissions"), {
                        code: 50013,
                        status: 403,
                    });
                    postMock.mockRejectedValueOnce(apiError);
                    getMock
                        .mockResolvedValueOnce({
                        id: "789",
                        guild_id: "guild1",
                        type: 0,
                        permission_overwrites: [],
                    })
                        .mockResolvedValueOnce({ id: "bot1" })
                        .mockResolvedValueOnce({
                        id: "guild1",
                        roles: [{ id: "guild1", permissions: perms.toString() }],
                    })
                        .mockResolvedValueOnce({ roles: [] });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, send_js_1.sendMessageDiscord)("channel:789", "hello", { rest: rest, token: "t" })];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _b.sent();
                    error = err_1;
                    return [3 /*break*/, 4];
                case 4:
                    (0, vitest_1.expect)(String(error)).toMatch(/missing permissions/i);
                    (0, vitest_1.expect)(String(error)).toMatch(/SendMessages/);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uploads media attachments", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, postMock, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, postMock = _a.postMock;
                    postMock.mockResolvedValue({ id: "msg", channel_id: "789" });
                    return [4 /*yield*/, (0, send_js_1.sendMessageDiscord)("channel:789", "photo", {
                            rest: rest,
                            token: "t",
                            mediaUrl: "file:///tmp/photo.jpg",
                        })];
                case 1:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.messageId).toBe("msg");
                    (0, vitest_1.expect)(postMock).toHaveBeenCalledWith(v10_1.Routes.channelMessages("789"), vitest_1.expect.objectContaining({
                        body: vitest_1.expect.objectContaining({
                            files: [vitest_1.expect.objectContaining({ name: "photo.jpg" })],
                        }),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes message_reference when replying", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, postMock, body;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, postMock = _a.postMock;
                    postMock.mockResolvedValue({ id: "msg1", channel_id: "789" });
                    return [4 /*yield*/, (0, send_js_1.sendMessageDiscord)("channel:789", "hello", {
                            rest: rest,
                            token: "t",
                            replyTo: "orig-123",
                        })];
                case 1:
                    _d.sent();
                    body = (_c = (_b = postMock.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.body;
                    (0, vitest_1.expect)(body === null || body === void 0 ? void 0 : body.message_reference).toEqual({
                        message_id: "orig-123",
                        fail_if_not_exists: false,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("replies only on the first chunk", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, postMock, firstBody, secondBody;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, postMock = _a.postMock;
                    postMock.mockResolvedValue({ id: "msg1", channel_id: "789" });
                    return [4 /*yield*/, (0, send_js_1.sendMessageDiscord)("channel:789", "a".repeat(2001), {
                            rest: rest,
                            token: "t",
                            replyTo: "orig-123",
                        })];
                case 1:
                    _f.sent();
                    (0, vitest_1.expect)(postMock).toHaveBeenCalledTimes(2);
                    firstBody = (_c = (_b = postMock.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.body;
                    secondBody = (_e = (_d = postMock.mock.calls[1]) === null || _d === void 0 ? void 0 : _d[1]) === null || _e === void 0 ? void 0 : _e.body;
                    (0, vitest_1.expect)(firstBody === null || firstBody === void 0 ? void 0 : firstBody.message_reference).toEqual({
                        message_id: "orig-123",
                        fail_if_not_exists: false,
                    });
                    (0, vitest_1.expect)(secondBody === null || secondBody === void 0 ? void 0 : secondBody.message_reference).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("reactMessageDiscord", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("reacts with unicode emoji", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, putMock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, putMock = _a.putMock;
                    return [4 /*yield*/, (0, send_js_1.reactMessageDiscord)("chan1", "msg1", "✅", { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(putMock).toHaveBeenCalledWith(v10_1.Routes.channelMessageOwnReaction("chan1", "msg1", "%E2%9C%85"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("normalizes variation selectors in unicode emoji", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, putMock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, putMock = _a.putMock;
                    return [4 /*yield*/, (0, send_js_1.reactMessageDiscord)("chan1", "msg1", "⭐️", { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(putMock).toHaveBeenCalledWith(v10_1.Routes.channelMessageOwnReaction("chan1", "msg1", "%E2%AD%90"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reacts with custom emoji syntax", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, putMock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, putMock = _a.putMock;
                    return [4 /*yield*/, (0, send_js_1.reactMessageDiscord)("chan1", "msg1", "<:party_blob:123>", {
                            rest: rest,
                            token: "t",
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(putMock).toHaveBeenCalledWith(v10_1.Routes.channelMessageOwnReaction("chan1", "msg1", "party_blob%3A123"));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("removeReactionDiscord", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("removes a unicode emoji reaction", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, deleteMock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, deleteMock = _a.deleteMock;
                    return [4 /*yield*/, (0, send_js_1.removeReactionDiscord)("chan1", "msg1", "✅", { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(deleteMock).toHaveBeenCalledWith(v10_1.Routes.channelMessageOwnReaction("chan1", "msg1", "%E2%9C%85"));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("removeOwnReactionsDiscord", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("removes all own reactions on a message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, getMock, deleteMock, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, getMock = _a.getMock, deleteMock = _a.deleteMock;
                    getMock.mockResolvedValue({
                        reactions: [
                            { emoji: { name: "✅", id: null } },
                            { emoji: { name: "party_blob", id: "123" } },
                        ],
                    });
                    return [4 /*yield*/, (0, send_js_1.removeOwnReactionsDiscord)("chan1", "msg1", {
                            rest: rest,
                            token: "t",
                        })];
                case 1:
                    res = _b.sent();
                    (0, vitest_1.expect)(res).toEqual({ ok: true, removed: ["✅", "party_blob:123"] });
                    (0, vitest_1.expect)(deleteMock).toHaveBeenCalledWith(v10_1.Routes.channelMessageOwnReaction("chan1", "msg1", "%E2%9C%85"));
                    (0, vitest_1.expect)(deleteMock).toHaveBeenCalledWith(v10_1.Routes.channelMessageOwnReaction("chan1", "msg1", "party_blob%3A123"));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("fetchReactionsDiscord", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("returns reactions with users", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, getMock, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, getMock = _a.getMock;
                    getMock
                        .mockResolvedValueOnce({
                        reactions: [
                            { count: 2, emoji: { name: "✅", id: null } },
                            { count: 1, emoji: { name: "party_blob", id: "123" } },
                        ],
                    })
                        .mockResolvedValueOnce([{ id: "u1", username: "alpha", discriminator: "0001" }])
                        .mockResolvedValueOnce([{ id: "u2", username: "beta" }]);
                    return [4 /*yield*/, (0, send_js_1.fetchReactionsDiscord)("chan1", "msg1", {
                            rest: rest,
                            token: "t",
                        })];
                case 1:
                    res = _b.sent();
                    (0, vitest_1.expect)(res).toEqual([
                        {
                            emoji: { id: null, name: "✅", raw: "✅" },
                            count: 2,
                            users: [{ id: "u1", username: "alpha", tag: "alpha#0001" }],
                        },
                        {
                            emoji: { id: "123", name: "party_blob", raw: "party_blob:123" },
                            count: 1,
                            users: [{ id: "u2", username: "beta", tag: "beta" }],
                        },
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("fetchChannelPermissionsDiscord", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("calculates permissions from guild roles", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, getMock, perms, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, getMock = _a.getMock;
                    perms = v10_1.PermissionFlagsBits.ViewChannel | v10_1.PermissionFlagsBits.SendMessages;
                    getMock
                        .mockResolvedValueOnce({
                        id: "chan1",
                        guild_id: "guild1",
                        permission_overwrites: [],
                    })
                        .mockResolvedValueOnce({ id: "bot1" })
                        .mockResolvedValueOnce({
                        id: "guild1",
                        roles: [
                            { id: "guild1", permissions: perms.toString() },
                            { id: "role2", permissions: "0" },
                        ],
                    })
                        .mockResolvedValueOnce({ roles: ["role2"] });
                    return [4 /*yield*/, (0, send_js_1.fetchChannelPermissionsDiscord)("chan1", {
                            rest: rest,
                            token: "t",
                        })];
                case 1:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.guildId).toBe("guild1");
                    (0, vitest_1.expect)(res.permissions).toContain("ViewChannel");
                    (0, vitest_1.expect)(res.permissions).toContain("SendMessages");
                    (0, vitest_1.expect)(res.isDm).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("readMessagesDiscord", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("passes query params as an object", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, getMock, call, options;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, getMock = _a.getMock;
                    getMock.mockResolvedValue([]);
                    return [4 /*yield*/, (0, send_js_1.readMessagesDiscord)("chan1", { limit: 5, before: "10" }, { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    call = getMock.mock.calls[0];
                    options = call === null || call === void 0 ? void 0 : call[1];
                    (0, vitest_1.expect)(options).toEqual({ limit: 5, before: "10" });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("edit/delete message helpers", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("edits message content", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, patchMock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, patchMock = _a.patchMock;
                    patchMock.mockResolvedValue({ id: "m1" });
                    return [4 /*yield*/, (0, send_js_1.editMessageDiscord)("chan1", "m1", { content: "hello" }, { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(patchMock).toHaveBeenCalledWith(v10_1.Routes.channelMessage("chan1", "m1"), vitest_1.expect.objectContaining({ body: { content: "hello" } }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("deletes message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, deleteMock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, deleteMock = _a.deleteMock;
                    deleteMock.mockResolvedValue({});
                    return [4 /*yield*/, (0, send_js_1.deleteMessageDiscord)("chan1", "m1", { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(deleteMock).toHaveBeenCalledWith(v10_1.Routes.channelMessage("chan1", "m1"));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("pin helpers", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("pins and unpins messages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, putMock, deleteMock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, putMock = _a.putMock, deleteMock = _a.deleteMock;
                    putMock.mockResolvedValue({});
                    deleteMock.mockResolvedValue({});
                    return [4 /*yield*/, (0, send_js_1.pinMessageDiscord)("chan1", "m1", { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, send_js_1.unpinMessageDiscord)("chan1", "m1", { rest: rest, token: "t" })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(putMock).toHaveBeenCalledWith(v10_1.Routes.channelPin("chan1", "m1"));
                    (0, vitest_1.expect)(deleteMock).toHaveBeenCalledWith(v10_1.Routes.channelPin("chan1", "m1"));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("searchMessagesDiscord", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("uses URLSearchParams for search", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, getMock, call;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, getMock = _a.getMock;
                    getMock.mockResolvedValue({ total_results: 0, messages: [] });
                    return [4 /*yield*/, (0, send_js_1.searchMessagesDiscord)({ guildId: "g1", content: "hello", limit: 5 }, { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    call = getMock.mock.calls[0];
                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call[0]).toBe("/guilds/g1/messages/search?content=hello&limit=5");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("supports channel/author arrays and clamps limit", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, getMock, call;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, getMock = _a.getMock;
                    getMock.mockResolvedValue({ total_results: 0, messages: [] });
                    return [4 /*yield*/, (0, send_js_1.searchMessagesDiscord)({
                            guildId: "g1",
                            content: "hello",
                            channelIds: ["c1", "c2"],
                            authorIds: ["u1"],
                            limit: 99,
                        }, { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    call = getMock.mock.calls[0];
                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call[0]).toBe("/guilds/g1/messages/search?content=hello&channel_id=c1&channel_id=c2&author_id=u1&limit=25");
                    return [2 /*return*/];
            }
        });
    }); });
});
