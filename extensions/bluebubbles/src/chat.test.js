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
var chat_js_1 = require("./chat.js");
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
(0, vitest_1.describe)("chat", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.stubGlobal("fetch", mockFetch);
        mockFetch.mockReset();
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.unstubAllGlobals();
    });
    (0, vitest_1.describe)("markBlueBubblesChatRead", function () {
        (0, vitest_1.it)("does nothing when chatGuid is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chat_js_1.markBlueBubblesChatRead)("", {
                            serverUrl: "http://localhost:1234",
                            password: "test",
                        })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockFetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("does nothing when chatGuid is whitespace", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chat_js_1.markBlueBubblesChatRead)("   ", {
                            serverUrl: "http://localhost:1234",
                            password: "test",
                        })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockFetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when serverUrl is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, chat_js_1.markBlueBubblesChatRead)("chat-guid", {})).rejects.toThrow("serverUrl is required")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when password is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, chat_js_1.markBlueBubblesChatRead)("chat-guid", {
                            serverUrl: "http://localhost:1234",
                        })).rejects.toThrow("password is required")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("marks chat as read successfully", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, chat_js_1.markBlueBubblesChatRead)("iMessage;-;+15551234567", {
                                serverUrl: "http://localhost:1234",
                                password: "test-password",
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockFetch).toHaveBeenCalledWith(vitest_1.expect.stringContaining("/api/v1/chat/iMessage%3B-%3B%2B15551234567/read"), vitest_1.expect.objectContaining({ method: "POST" }));
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
                        return [4 /*yield*/, (0, chat_js_1.markBlueBubblesChatRead)("chat-123", {
                                serverUrl: "http://localhost:1234",
                                password: "my-secret",
                            })];
                    case 1:
                        _a.sent();
                        calledUrl = mockFetch.mock.calls[0][0];
                        (0, vitest_1.expect)(calledUrl).toContain("password=my-secret");
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
                            status: 404,
                            text: function () { return Promise.resolve("Chat not found"); },
                        });
                        return [4 /*yield*/, (0, vitest_1.expect)((0, chat_js_1.markBlueBubblesChatRead)("missing-chat", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })).rejects.toThrow("read failed (404): Chat not found")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("trims chatGuid before using", function () { return __awaiter(void 0, void 0, void 0, function () {
            var calledUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, chat_js_1.markBlueBubblesChatRead)("  chat-with-spaces  ", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })];
                    case 1:
                        _a.sent();
                        calledUrl = mockFetch.mock.calls[0][0];
                        (0, vitest_1.expect)(calledUrl).toContain("/api/v1/chat/chat-with-spaces/read");
                        (0, vitest_1.expect)(calledUrl).not.toContain("%20chat");
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
                        return [4 /*yield*/, (0, chat_js_1.markBlueBubblesChatRead)("chat-123", {
                                cfg: {
                                    channels: {
                                        bluebubbles: {
                                            serverUrl: "http://config-server:9999",
                                            password: "config-pass",
                                        },
                                    },
                                },
                            })];
                    case 1:
                        _a.sent();
                        calledUrl = mockFetch.mock.calls[0][0];
                        (0, vitest_1.expect)(calledUrl).toContain("config-server:9999");
                        (0, vitest_1.expect)(calledUrl).toContain("password=config-pass");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("sendBlueBubblesTyping", function () {
        (0, vitest_1.it)("does nothing when chatGuid is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chat_js_1.sendBlueBubblesTyping)("", true, {
                            serverUrl: "http://localhost:1234",
                            password: "test",
                        })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockFetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("does nothing when chatGuid is whitespace", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chat_js_1.sendBlueBubblesTyping)("   ", false, {
                            serverUrl: "http://localhost:1234",
                            password: "test",
                        })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockFetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when serverUrl is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, chat_js_1.sendBlueBubblesTyping)("chat-guid", true, {})).rejects.toThrow("serverUrl is required")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when password is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, chat_js_1.sendBlueBubblesTyping)("chat-guid", true, {
                            serverUrl: "http://localhost:1234",
                        })).rejects.toThrow("password is required")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("sends typing start with POST method", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, chat_js_1.sendBlueBubblesTyping)("iMessage;-;+15551234567", true, {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockFetch).toHaveBeenCalledWith(vitest_1.expect.stringContaining("/api/v1/chat/iMessage%3B-%3B%2B15551234567/typing"), vitest_1.expect.objectContaining({ method: "POST" }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("sends typing stop with DELETE method", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, chat_js_1.sendBlueBubblesTyping)("iMessage;-;+15551234567", false, {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockFetch).toHaveBeenCalledWith(vitest_1.expect.stringContaining("/api/v1/chat/iMessage%3B-%3B%2B15551234567/typing"), vitest_1.expect.objectContaining({ method: "DELETE" }));
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
                        return [4 /*yield*/, (0, chat_js_1.sendBlueBubblesTyping)("chat-123", true, {
                                serverUrl: "http://localhost:1234",
                                password: "typing-secret",
                            })];
                    case 1:
                        _a.sent();
                        calledUrl = mockFetch.mock.calls[0][0];
                        (0, vitest_1.expect)(calledUrl).toContain("password=typing-secret");
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
                            status: 500,
                            text: function () { return Promise.resolve("Internal error"); },
                        });
                        return [4 /*yield*/, (0, vitest_1.expect)((0, chat_js_1.sendBlueBubblesTyping)("chat-123", true, {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })).rejects.toThrow("typing failed (500): Internal error")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("trims chatGuid before using", function () { return __awaiter(void 0, void 0, void 0, function () {
            var calledUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, chat_js_1.sendBlueBubblesTyping)("  trimmed-chat  ", true, {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })];
                    case 1:
                        _a.sent();
                        calledUrl = mockFetch.mock.calls[0][0];
                        (0, vitest_1.expect)(calledUrl).toContain("/api/v1/chat/trimmed-chat/typing");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("encodes special characters in chatGuid", function () { return __awaiter(void 0, void 0, void 0, function () {
            var calledUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, chat_js_1.sendBlueBubblesTyping)("iMessage;+;group@chat.com", true, {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })];
                    case 1:
                        _a.sent();
                        calledUrl = mockFetch.mock.calls[0][0];
                        (0, vitest_1.expect)(calledUrl).toContain("iMessage%3B%2B%3Bgroup%40chat.com");
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
                        return [4 /*yield*/, (0, chat_js_1.sendBlueBubblesTyping)("chat-123", true, {
                                cfg: {
                                    channels: {
                                        bluebubbles: {
                                            serverUrl: "http://typing-server:8888",
                                            password: "typing-pass",
                                        },
                                    },
                                },
                            })];
                    case 1:
                        _a.sent();
                        calledUrl = mockFetch.mock.calls[0][0];
                        (0, vitest_1.expect)(calledUrl).toContain("typing-server:8888");
                        (0, vitest_1.expect)(calledUrl).toContain("password=typing-pass");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("can start and stop typing in sequence", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch
                            .mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        })
                            .mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, chat_js_1.sendBlueBubblesTyping)("chat-123", true, {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, chat_js_1.sendBlueBubblesTyping)("chat-123", false, {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(2);
                        (0, vitest_1.expect)(mockFetch.mock.calls[0][1].method).toBe("POST");
                        (0, vitest_1.expect)(mockFetch.mock.calls[1][1].method).toBe("DELETE");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("setGroupIconBlueBubbles", function () {
        (0, vitest_1.it)("throws when chatGuid is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, chat_js_1.setGroupIconBlueBubbles)("", new Uint8Array([1, 2, 3]), "icon.png", {
                            serverUrl: "http://localhost:1234",
                            password: "test",
                        })).rejects.toThrow("chatGuid")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when buffer is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, chat_js_1.setGroupIconBlueBubbles)("chat-guid", new Uint8Array(0), "icon.png", {
                            serverUrl: "http://localhost:1234",
                            password: "test",
                        })).rejects.toThrow("image buffer")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when serverUrl is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, chat_js_1.setGroupIconBlueBubbles)("chat-guid", new Uint8Array([1, 2, 3]), "icon.png", {})).rejects.toThrow("serverUrl is required")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when password is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, chat_js_1.setGroupIconBlueBubbles)("chat-guid", new Uint8Array([1, 2, 3]), "icon.png", {
                            serverUrl: "http://localhost:1234",
                        })).rejects.toThrow("password is required")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("sets group icon successfully", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        buffer = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
                        return [4 /*yield*/, (0, chat_js_1.setGroupIconBlueBubbles)("iMessage;-;chat-guid", buffer, "icon.png", {
                                serverUrl: "http://localhost:1234",
                                password: "test-password",
                                contentType: "image/png",
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockFetch).toHaveBeenCalledWith(vitest_1.expect.stringContaining("/api/v1/chat/iMessage%3B-%3Bchat-guid/icon"), vitest_1.expect.objectContaining({
                            method: "POST",
                            headers: vitest_1.expect.objectContaining({
                                "Content-Type": vitest_1.expect.stringContaining("multipart/form-data"),
                            }),
                        }));
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
                        return [4 /*yield*/, (0, chat_js_1.setGroupIconBlueBubbles)("chat-123", new Uint8Array([1, 2, 3]), "icon.png", {
                                serverUrl: "http://localhost:1234",
                                password: "my-secret",
                            })];
                    case 1:
                        _a.sent();
                        calledUrl = mockFetch.mock.calls[0][0];
                        (0, vitest_1.expect)(calledUrl).toContain("password=my-secret");
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
                            status: 500,
                            text: function () { return Promise.resolve("Internal error"); },
                        });
                        return [4 /*yield*/, (0, vitest_1.expect)((0, chat_js_1.setGroupIconBlueBubbles)("chat-123", new Uint8Array([1, 2, 3]), "icon.png", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })).rejects.toThrow("setGroupIcon failed (500): Internal error")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("trims chatGuid before using", function () { return __awaiter(void 0, void 0, void 0, function () {
            var calledUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, chat_js_1.setGroupIconBlueBubbles)("  chat-with-spaces  ", new Uint8Array([1]), "icon.png", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })];
                    case 1:
                        _a.sent();
                        calledUrl = mockFetch.mock.calls[0][0];
                        (0, vitest_1.expect)(calledUrl).toContain("/api/v1/chat/chat-with-spaces/icon");
                        (0, vitest_1.expect)(calledUrl).not.toContain("%20chat");
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
                        return [4 /*yield*/, (0, chat_js_1.setGroupIconBlueBubbles)("chat-123", new Uint8Array([1]), "icon.png", {
                                cfg: {
                                    channels: {
                                        bluebubbles: {
                                            serverUrl: "http://config-server:9999",
                                            password: "config-pass",
                                        },
                                    },
                                },
                            })];
                    case 1:
                        _a.sent();
                        calledUrl = mockFetch.mock.calls[0][0];
                        (0, vitest_1.expect)(calledUrl).toContain("config-server:9999");
                        (0, vitest_1.expect)(calledUrl).toContain("password=config-pass");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("includes filename in multipart body", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body, bodyString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, chat_js_1.setGroupIconBlueBubbles)("chat-123", new Uint8Array([1, 2, 3]), "custom-icon.jpg", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                                contentType: "image/jpeg",
                            })];
                    case 1:
                        _a.sent();
                        body = mockFetch.mock.calls[0][1].body;
                        bodyString = new TextDecoder().decode(body);
                        (0, vitest_1.expect)(bodyString).toContain('filename="custom-icon.jpg"');
                        (0, vitest_1.expect)(bodyString).toContain("image/jpeg");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
