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
var reactions_js_1 = require("./reactions.js");
vitest_1.vi.mock("./accounts.js", function () { return ({
    resolveBlueBubblesAccount: vitest_1.vi.fn(function (_a) {
        var _b, _c;
        var cfg = _a.cfg, accountId = _a.accountId;
        var config = (_c = (_b = cfg === null || cfg === void 0 ? void 0 : cfg.channels) === null || _b === void 0 ? void 0 : _b.bluebubbles) !== null && _c !== void 0 ? _c : {};
        return {
            accountId: accountId !== null && accountId !== void 0 ? accountId : "default",
            enabled: config.enabled !== false,
            configured: Boolean(config.serverUrl && config.password),
            config: config,
        };
    }),
}); });
var mockFetch = vitest_1.vi.fn();
(0, vitest_1.describe)("reactions", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.stubGlobal("fetch", mockFetch);
        mockFetch.mockReset();
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.unstubAllGlobals();
    });
    (0, vitest_1.describe)("sendBlueBubblesReaction", function () {
        (0, vitest_1.it)("throws when chatGuid is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, reactions_js_1.sendBlueBubblesReaction)({
                            chatGuid: "",
                            messageGuid: "msg-123",
                            emoji: "love",
                            opts: {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            },
                        })).rejects.toThrow("chatGuid")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when messageGuid is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, reactions_js_1.sendBlueBubblesReaction)({
                            chatGuid: "chat-123",
                            messageGuid: "",
                            emoji: "love",
                            opts: {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            },
                        })).rejects.toThrow("messageGuid")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when emoji is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, reactions_js_1.sendBlueBubblesReaction)({
                            chatGuid: "chat-123",
                            messageGuid: "msg-123",
                            emoji: "",
                            opts: {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            },
                        })).rejects.toThrow("emoji or name")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when serverUrl is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, reactions_js_1.sendBlueBubblesReaction)({
                            chatGuid: "chat-123",
                            messageGuid: "msg-123",
                            emoji: "love",
                            opts: {},
                        })).rejects.toThrow("serverUrl is required")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when password is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, reactions_js_1.sendBlueBubblesReaction)({
                            chatGuid: "chat-123",
                            messageGuid: "msg-123",
                            emoji: "love",
                            opts: {
                                serverUrl: "http://localhost:1234",
                            },
                        })).rejects.toThrow("password is required")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws for unsupported reaction type", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, reactions_js_1.sendBlueBubblesReaction)({
                            chatGuid: "chat-123",
                            messageGuid: "msg-123",
                            emoji: "unsupported",
                            opts: {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            },
                        })).rejects.toThrow("Unsupported BlueBubbles reaction")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.describe)("reaction type normalization", function () {
            var testCases = [
                { input: "love", expected: "love" },
                { input: "like", expected: "like" },
                { input: "dislike", expected: "dislike" },
                { input: "laugh", expected: "laugh" },
                { input: "emphasize", expected: "emphasize" },
                { input: "question", expected: "question" },
                { input: "heart", expected: "love" },
                { input: "thumbs_up", expected: "like" },
                { input: "thumbs-down", expected: "dislike" },
                { input: "thumbs_down", expected: "dislike" },
                { input: "haha", expected: "laugh" },
                { input: "lol", expected: "laugh" },
                { input: "emphasis", expected: "emphasize" },
                { input: "exclaim", expected: "emphasize" },
                { input: "❤️", expected: "love" },
                { input: "❤", expected: "love" },
                { input: "♥️", expected: "love" },
                { input: "😍", expected: "love" },
                { input: "👍", expected: "like" },
                { input: "👎", expected: "dislike" },
                { input: "😂", expected: "laugh" },
                { input: "🤣", expected: "laugh" },
                { input: "😆", expected: "laugh" },
                { input: "‼️", expected: "emphasize" },
                { input: "‼", expected: "emphasize" },
                { input: "❗", expected: "emphasize" },
                { input: "❓", expected: "question" },
                { input: "❔", expected: "question" },
                { input: "LOVE", expected: "love" },
                { input: "Like", expected: "like" },
            ];
            var _loop_1 = function (input, expected) {
                (0, vitest_1.it)("normalizes \"".concat(input, "\" to \"").concat(expected, "\""), function () { return __awaiter(void 0, void 0, void 0, function () {
                    var body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                mockFetch.mockResolvedValueOnce({
                                    ok: true,
                                    text: function () { return Promise.resolve(""); },
                                });
                                return [4 /*yield*/, (0, reactions_js_1.sendBlueBubblesReaction)({
                                        chatGuid: "chat-123",
                                        messageGuid: "msg-123",
                                        emoji: input,
                                        opts: {
                                            serverUrl: "http://localhost:1234",
                                            password: "test",
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                body = JSON.parse(mockFetch.mock.calls[0][1].body);
                                (0, vitest_1.expect)(body.reaction).toBe(expected);
                                return [2 /*return*/];
                        }
                    });
                }); });
            };
            for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
                var _a = testCases_1[_i], input = _a.input, expected = _a.expected;
                _loop_1(input, expected);
            }
        });
        (0, vitest_1.it)("sends reaction successfully", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, reactions_js_1.sendBlueBubblesReaction)({
                                chatGuid: "iMessage;-;+15551234567",
                                messageGuid: "msg-uuid-123",
                                emoji: "love",
                                opts: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockFetch).toHaveBeenCalledWith(vitest_1.expect.stringContaining("/api/v1/message/react"), vitest_1.expect.objectContaining({
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                        }));
                        body = JSON.parse(mockFetch.mock.calls[0][1].body);
                        (0, vitest_1.expect)(body.chatGuid).toBe("iMessage;-;+15551234567");
                        (0, vitest_1.expect)(body.selectedMessageGuid).toBe("msg-uuid-123");
                        (0, vitest_1.expect)(body.reaction).toBe("love");
                        (0, vitest_1.expect)(body.partIndex).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("includes password in URL query", function () { return __awaiter(void 0, void 0, void 0, function () {
            var calledUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, reactions_js_1.sendBlueBubblesReaction)({
                                chatGuid: "chat-123",
                                messageGuid: "msg-123",
                                emoji: "like",
                                opts: {
                                    serverUrl: "http://localhost:1234",
                                    password: "my-react-password",
                                },
                            })];
                    case 1:
                        _a.sent();
                        calledUrl = mockFetch.mock.calls[0][0];
                        (0, vitest_1.expect)(calledUrl).toContain("password=my-react-password");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("sends reaction removal with dash prefix", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, reactions_js_1.sendBlueBubblesReaction)({
                                chatGuid: "chat-123",
                                messageGuid: "msg-123",
                                emoji: "love",
                                remove: true,
                                opts: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test",
                                },
                            })];
                    case 1:
                        _a.sent();
                        body = JSON.parse(mockFetch.mock.calls[0][1].body);
                        (0, vitest_1.expect)(body.reaction).toBe("-love");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("strips leading dash from emoji when remove flag is set", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, reactions_js_1.sendBlueBubblesReaction)({
                                chatGuid: "chat-123",
                                messageGuid: "msg-123",
                                emoji: "-love",
                                remove: true,
                                opts: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test",
                                },
                            })];
                    case 1:
                        _a.sent();
                        body = JSON.parse(mockFetch.mock.calls[0][1].body);
                        (0, vitest_1.expect)(body.reaction).toBe("-love");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("uses custom partIndex when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, reactions_js_1.sendBlueBubblesReaction)({
                                chatGuid: "chat-123",
                                messageGuid: "msg-123",
                                emoji: "laugh",
                                partIndex: 3,
                                opts: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test",
                                },
                            })];
                    case 1:
                        _a.sent();
                        body = JSON.parse(mockFetch.mock.calls[0][1].body);
                        (0, vitest_1.expect)(body.partIndex).toBe(3);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws on non-ok response", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: false,
                            status: 400,
                            text: function () { return Promise.resolve("Invalid reaction type"); },
                        });
                        return [4 /*yield*/, (0, vitest_1.expect)((0, reactions_js_1.sendBlueBubblesReaction)({
                                chatGuid: "chat-123",
                                messageGuid: "msg-123",
                                emoji: "like",
                                opts: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test",
                                },
                            })).rejects.toThrow("reaction failed (400): Invalid reaction type")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("resolves credentials from config", function () { return __awaiter(void 0, void 0, void 0, function () {
            var calledUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, reactions_js_1.sendBlueBubblesReaction)({
                                chatGuid: "chat-123",
                                messageGuid: "msg-123",
                                emoji: "emphasize",
                                opts: {
                                    cfg: {
                                        channels: {
                                            bluebubbles: {
                                                serverUrl: "http://react-server:7777",
                                                password: "react-pass",
                                            },
                                        },
                                    },
                                },
                            })];
                    case 1:
                        _a.sent();
                        calledUrl = mockFetch.mock.calls[0][0];
                        (0, vitest_1.expect)(calledUrl).toContain("react-server:7777");
                        (0, vitest_1.expect)(calledUrl).toContain("password=react-pass");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("trims chatGuid and messageGuid", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, reactions_js_1.sendBlueBubblesReaction)({
                                chatGuid: "  chat-with-spaces  ",
                                messageGuid: "  msg-with-spaces  ",
                                emoji: "question",
                                opts: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test",
                                },
                            })];
                    case 1:
                        _a.sent();
                        body = JSON.parse(mockFetch.mock.calls[0][1].body);
                        (0, vitest_1.expect)(body.chatGuid).toBe("chat-with-spaces");
                        (0, vitest_1.expect)(body.selectedMessageGuid).toBe("msg-with-spaces");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.describe)("reaction removal aliases", function () {
            (0, vitest_1.it)("handles emoji-based removal", function () { return __awaiter(void 0, void 0, void 0, function () {
                var body;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                text: function () { return Promise.resolve(""); },
                            });
                            return [4 /*yield*/, (0, reactions_js_1.sendBlueBubblesReaction)({
                                    chatGuid: "chat-123",
                                    messageGuid: "msg-123",
                                    emoji: "👍",
                                    remove: true,
                                    opts: {
                                        serverUrl: "http://localhost:1234",
                                        password: "test",
                                    },
                                })];
                        case 1:
                            _a.sent();
                            body = JSON.parse(mockFetch.mock.calls[0][1].body);
                            (0, vitest_1.expect)(body.reaction).toBe("-like");
                            return [2 /*return*/];
                    }
                });
            }); });
            (0, vitest_1.it)("handles text alias removal", function () { return __awaiter(void 0, void 0, void 0, function () {
                var body;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                text: function () { return Promise.resolve(""); },
                            });
                            return [4 /*yield*/, (0, reactions_js_1.sendBlueBubblesReaction)({
                                    chatGuid: "chat-123",
                                    messageGuid: "msg-123",
                                    emoji: "haha",
                                    remove: true,
                                    opts: {
                                        serverUrl: "http://localhost:1234",
                                        password: "test",
                                    },
                                })];
                        case 1:
                            _a.sent();
                            body = JSON.parse(mockFetch.mock.calls[0][1].body);
                            (0, vitest_1.expect)(body.reaction).toBe("-laugh");
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
