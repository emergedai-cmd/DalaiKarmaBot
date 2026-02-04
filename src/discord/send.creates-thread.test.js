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
var carbon_1 = require("@buape/carbon");
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
    (0, vitest_1.it)("creates a thread", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, postMock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, postMock = _a.postMock;
                    postMock.mockResolvedValue({ id: "t1" });
                    return [4 /*yield*/, (0, send_js_1.createThreadDiscord)("chan1", { name: "thread", messageId: "m1" }, { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(postMock).toHaveBeenCalledWith(v10_1.Routes.threads("chan1", "m1"), vitest_1.expect.objectContaining({ body: { name: "thread" } }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("lists active threads by guild", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, getMock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, getMock = _a.getMock;
                    getMock.mockResolvedValue({ threads: [] });
                    return [4 /*yield*/, (0, send_js_1.listThreadsDiscord)({ guildId: "g1" }, { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(getMock).toHaveBeenCalledWith(v10_1.Routes.guildActiveThreads("g1"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("times out a member", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, patchMock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, patchMock = _a.patchMock;
                    patchMock.mockResolvedValue({ id: "m1" });
                    return [4 /*yield*/, (0, send_js_1.timeoutMemberDiscord)({ guildId: "g1", userId: "u1", durationMinutes: 10 }, { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(patchMock).toHaveBeenCalledWith(v10_1.Routes.guildMember("g1", "u1"), vitest_1.expect.objectContaining({
                        body: vitest_1.expect.objectContaining({
                            communication_disabled_until: vitest_1.expect.any(String),
                        }),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds and removes roles", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, putMock, deleteMock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, putMock = _a.putMock, deleteMock = _a.deleteMock;
                    putMock.mockResolvedValue({});
                    deleteMock.mockResolvedValue({});
                    return [4 /*yield*/, (0, send_js_1.addRoleDiscord)({ guildId: "g1", userId: "u1", roleId: "r1" }, { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, send_js_1.removeRoleDiscord)({ guildId: "g1", userId: "u1", roleId: "r1" }, { rest: rest, token: "t" })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(putMock).toHaveBeenCalledWith(v10_1.Routes.guildMemberRole("g1", "u1", "r1"));
                    (0, vitest_1.expect)(deleteMock).toHaveBeenCalledWith(v10_1.Routes.guildMemberRole("g1", "u1", "r1"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("bans a member", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, putMock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, putMock = _a.putMock;
                    putMock.mockResolvedValue({});
                    return [4 /*yield*/, (0, send_js_1.banMemberDiscord)({ guildId: "g1", userId: "u1", deleteMessageDays: 2 }, { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(putMock).toHaveBeenCalledWith(v10_1.Routes.guildBan("g1", "u1"), vitest_1.expect.objectContaining({ body: { delete_message_days: 2 } }));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("listGuildEmojisDiscord", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("lists emojis for a guild", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, getMock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, getMock = _a.getMock;
                    getMock.mockResolvedValue([{ id: "e1", name: "party" }]);
                    return [4 /*yield*/, (0, send_js_1.listGuildEmojisDiscord)("g1", { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(getMock).toHaveBeenCalledWith(v10_1.Routes.guildEmojis("g1"));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("uploadEmojiDiscord", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("uploads emoji assets", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, postMock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, postMock = _a.postMock;
                    postMock.mockResolvedValue({ id: "e1" });
                    return [4 /*yield*/, (0, send_js_1.uploadEmojiDiscord)({
                            guildId: "g1",
                            name: "party_blob",
                            mediaUrl: "file:///tmp/party.png",
                            roleIds: ["r1"],
                        }, { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(postMock).toHaveBeenCalledWith(v10_1.Routes.guildEmojis("g1"), vitest_1.expect.objectContaining({
                        body: {
                            name: "party_blob",
                            image: "data:image/png;base64,aW1n",
                            roles: ["r1"],
                        },
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("uploadStickerDiscord", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("uploads sticker assets", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, postMock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, postMock = _a.postMock;
                    postMock.mockResolvedValue({ id: "s1" });
                    return [4 /*yield*/, (0, send_js_1.uploadStickerDiscord)({
                            guildId: "g1",
                            name: "openclaw_wave",
                            description: "OpenClaw waving",
                            tags: "👋",
                            mediaUrl: "file:///tmp/wave.png",
                        }, { rest: rest, token: "t" })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(postMock).toHaveBeenCalledWith(v10_1.Routes.guildStickers("g1"), vitest_1.expect.objectContaining({
                        body: {
                            name: "openclaw_wave",
                            description: "OpenClaw waving",
                            tags: "👋",
                            files: [
                                vitest_1.expect.objectContaining({
                                    name: "asset.png",
                                    contentType: "image/png",
                                }),
                            ],
                        },
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("sendStickerDiscord", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("sends sticker payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, postMock, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, postMock = _a.postMock;
                    postMock.mockResolvedValue({ id: "msg1", channel_id: "789" });
                    return [4 /*yield*/, (0, send_js_1.sendStickerDiscord)("channel:789", ["123"], {
                            rest: rest,
                            token: "t",
                            content: "hiya",
                        })];
                case 1:
                    res = _b.sent();
                    (0, vitest_1.expect)(res).toEqual({ messageId: "msg1", channelId: "789" });
                    (0, vitest_1.expect)(postMock).toHaveBeenCalledWith(v10_1.Routes.channelMessages("789"), vitest_1.expect.objectContaining({
                        body: {
                            content: "hiya",
                            sticker_ids: ["123"],
                        },
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("sendPollDiscord", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("sends polls with answers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, postMock, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, postMock = _a.postMock;
                    postMock.mockResolvedValue({ id: "msg1", channel_id: "789" });
                    return [4 /*yield*/, (0, send_js_1.sendPollDiscord)("channel:789", {
                            question: "Lunch?",
                            options: ["Pizza", "Sushi"],
                        }, {
                            rest: rest,
                            token: "t",
                        })];
                case 1:
                    res = _b.sent();
                    (0, vitest_1.expect)(res).toEqual({ messageId: "msg1", channelId: "789" });
                    (0, vitest_1.expect)(postMock).toHaveBeenCalledWith(v10_1.Routes.channelMessages("789"), vitest_1.expect.objectContaining({
                        body: vitest_1.expect.objectContaining({
                            poll: {
                                question: { text: "Lunch?" },
                                answers: [{ poll_media: { text: "Pizza" } }, { poll_media: { text: "Sushi" } }],
                                duration: 24,
                                allow_multiselect: false,
                                layout_type: 1,
                            },
                        }),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
function createMockRateLimitError(retryAfter) {
    if (retryAfter === void 0) { retryAfter = 0.001; }
    var response = new Response(null, {
        status: 429,
        headers: {
            "X-RateLimit-Scope": "user",
            "X-RateLimit-Bucket": "test-bucket",
        },
    });
    return new carbon_1.RateLimitError(response, {
        message: "You are being rate limited.",
        retry_after: retryAfter,
        global: false,
    });
}
(0, vitest_1.describe)("retry rate limits", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("retries on Discord rate limits", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, postMock, rateLimitError, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, postMock = _a.postMock;
                    rateLimitError = createMockRateLimitError(0);
                    postMock
                        .mockRejectedValueOnce(rateLimitError)
                        .mockResolvedValueOnce({ id: "msg1", channel_id: "789" });
                    return [4 /*yield*/, (0, send_js_1.sendMessageDiscord)("channel:789", "hello", {
                            rest: rest,
                            token: "t",
                            retry: { attempts: 2, minDelayMs: 0, maxDelayMs: 0, jitter: 0 },
                        })];
                case 1:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.messageId).toBe("msg1");
                    (0, vitest_1.expect)(postMock).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses retry_after delays when rate limited", function () { return __awaiter(void 0, void 0, void 0, function () {
        var setTimeoutSpy, _a, rest, postMock, rateLimitError, promise;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    setTimeoutSpy = vitest_1.vi.spyOn(global, "setTimeout");
                    _a = makeRest(), rest = _a.rest, postMock = _a.postMock;
                    rateLimitError = createMockRateLimitError(0.5);
                    postMock
                        .mockRejectedValueOnce(rateLimitError)
                        .mockResolvedValueOnce({ id: "msg1", channel_id: "789" });
                    promise = (0, send_js_1.sendMessageDiscord)("channel:789", "hello", {
                        rest: rest,
                        token: "t",
                        retry: { attempts: 2, minDelayMs: 0, maxDelayMs: 1000, jitter: 0 },
                    });
                    return [4 /*yield*/, vitest_1.vi.runAllTimersAsync()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(promise).resolves.toEqual({
                            messageId: "msg1",
                            channelId: "789",
                        })];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)((_b = setTimeoutSpy.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[1]).toBe(500);
                    setTimeoutSpy.mockRestore();
                    vitest_1.vi.useRealTimers();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("stops after max retry attempts", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, postMock, rateLimitError;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, postMock = _a.postMock;
                    rateLimitError = createMockRateLimitError(0);
                    postMock.mockRejectedValue(rateLimitError);
                    return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendMessageDiscord)("channel:789", "hello", {
                            rest: rest,
                            token: "t",
                            retry: { attempts: 2, minDelayMs: 0, maxDelayMs: 0, jitter: 0 },
                        })).rejects.toBeInstanceOf(carbon_1.RateLimitError)];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(postMock).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not retry non-rate-limit errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, postMock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, postMock = _a.postMock;
                    postMock.mockRejectedValueOnce(new Error("network error"));
                    return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendMessageDiscord)("channel:789", "hello", { rest: rest, token: "t" })).rejects.toThrow("network error")];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(postMock).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("retries reactions on rate limits", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, putMock, rateLimitError, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, putMock = _a.putMock;
                    rateLimitError = createMockRateLimitError(0);
                    putMock.mockRejectedValueOnce(rateLimitError).mockResolvedValueOnce(undefined);
                    return [4 /*yield*/, (0, send_js_1.reactMessageDiscord)("chan1", "msg1", "ok", {
                            rest: rest,
                            token: "t",
                            retry: { attempts: 2, minDelayMs: 0, maxDelayMs: 0, jitter: 0 },
                        })];
                case 1:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)(putMock).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("retries media upload without duplicating overflow text", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rest, postMock, rateLimitError, text, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = makeRest(), rest = _a.rest, postMock = _a.postMock;
                    rateLimitError = createMockRateLimitError(0);
                    text = "a".repeat(2005);
                    postMock
                        .mockRejectedValueOnce(rateLimitError)
                        .mockResolvedValueOnce({ id: "msg1", channel_id: "789" })
                        .mockResolvedValueOnce({ id: "msg2", channel_id: "789" });
                    return [4 /*yield*/, (0, send_js_1.sendMessageDiscord)("channel:789", text, {
                            rest: rest,
                            token: "t",
                            mediaUrl: "https://example.com/photo.jpg",
                            retry: { attempts: 2, minDelayMs: 0, maxDelayMs: 0, jitter: 0 },
                        })];
                case 1:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.messageId).toBe("msg1");
                    (0, vitest_1.expect)(postMock).toHaveBeenCalledTimes(3);
                    return [2 /*return*/];
            }
        });
    }); });
});
