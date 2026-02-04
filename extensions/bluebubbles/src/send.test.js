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
var send_js_1 = require("./send.js");
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
(0, vitest_1.describe)("send", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.stubGlobal("fetch", mockFetch);
        mockFetch.mockReset();
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.unstubAllGlobals();
    });
    (0, vitest_1.describe)("resolveChatGuidForTarget", function () {
        (0, vitest_1.it)("returns chatGuid directly for chat_guid target", function () { return __awaiter(void 0, void 0, void 0, function () {
            var target, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        target = {
                            kind: "chat_guid",
                            chatGuid: "iMessage;-;+15551234567",
                        };
                        return [4 /*yield*/, (0, send_js_1.resolveChatGuidForTarget)({
                                baseUrl: "http://localhost:1234",
                                password: "test",
                                target: target,
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe("iMessage;-;+15551234567");
                        (0, vitest_1.expect)(mockFetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("queries chats to resolve chat_id target", function () { return __awaiter(void 0, void 0, void 0, function () {
            var target, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        { id: 123, guid: "iMessage;-;chat123", participants: [] },
                                        { id: 456, guid: "iMessage;-;chat456", participants: [] },
                                    ],
                                });
                            },
                        });
                        target = { kind: "chat_id", chatId: 456 };
                        return [4 /*yield*/, (0, send_js_1.resolveChatGuidForTarget)({
                                baseUrl: "http://localhost:1234",
                                password: "test",
                                target: target,
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe("iMessage;-;chat456");
                        (0, vitest_1.expect)(mockFetch).toHaveBeenCalledWith(vitest_1.expect.stringContaining("/api/v1/chat/query"), vitest_1.expect.objectContaining({ method: "POST" }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("queries chats to resolve chat_identifier target", function () { return __awaiter(void 0, void 0, void 0, function () {
            var target, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            identifier: "chat123@group.imessage",
                                            guid: "iMessage;-;chat123",
                                            participants: [],
                                        },
                                    ],
                                });
                            },
                        });
                        target = {
                            kind: "chat_identifier",
                            chatIdentifier: "chat123@group.imessage",
                        };
                        return [4 /*yield*/, (0, send_js_1.resolveChatGuidForTarget)({
                                baseUrl: "http://localhost:1234",
                                password: "test",
                                target: target,
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe("iMessage;-;chat123");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("matches chat_identifier against the 3rd component of chat GUID", function () { return __awaiter(void 0, void 0, void 0, function () {
            var target, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            guid: "iMessage;+;chat660250192681427962",
                                            participants: [],
                                        },
                                    ],
                                });
                            },
                        });
                        target = {
                            kind: "chat_identifier",
                            chatIdentifier: "chat660250192681427962",
                        };
                        return [4 /*yield*/, (0, send_js_1.resolveChatGuidForTarget)({
                                baseUrl: "http://localhost:1234",
                                password: "test",
                                target: target,
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe("iMessage;+;chat660250192681427962");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("resolves handle target by matching participant", function () { return __awaiter(void 0, void 0, void 0, function () {
            var target, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            guid: "iMessage;-;+15559999999",
                                            participants: [{ address: "+15559999999" }],
                                        },
                                        {
                                            guid: "iMessage;-;+15551234567",
                                            participants: [{ address: "+15551234567" }],
                                        },
                                    ],
                                });
                            },
                        });
                        target = {
                            kind: "handle",
                            address: "+15551234567",
                            service: "imessage",
                        };
                        return [4 /*yield*/, (0, send_js_1.resolveChatGuidForTarget)({
                                baseUrl: "http://localhost:1234",
                                password: "test",
                                target: target,
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe("iMessage;-;+15551234567");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("prefers direct chat guid when handle also appears in a group chat", function () { return __awaiter(void 0, void 0, void 0, function () {
            var target, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            guid: "iMessage;+;group-123",
                                            participants: [{ address: "+15551234567" }, { address: "+15550001111" }],
                                        },
                                        {
                                            guid: "iMessage;-;+15551234567",
                                            participants: [{ address: "+15551234567" }],
                                        },
                                    ],
                                });
                            },
                        });
                        target = {
                            kind: "handle",
                            address: "+15551234567",
                            service: "imessage",
                        };
                        return [4 /*yield*/, (0, send_js_1.resolveChatGuidForTarget)({
                                baseUrl: "http://localhost:1234",
                                password: "test",
                                target: target,
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe("iMessage;-;+15551234567");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("returns null when handle only exists in group chat (not DM)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var target, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // This is the critical fix: if a phone number only exists as a participant in a group chat
                        // (no direct DM chat), we should NOT send to that group. Return null instead.
                        mockFetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            guid: "iMessage;+;group-the-council",
                                            participants: [
                                                { address: "+12622102921" },
                                                { address: "+15550001111" },
                                                { address: "+15550002222" },
                                            ],
                                        },
                                    ],
                                });
                            },
                        })
                            // Empty second page to stop pagination
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () { return Promise.resolve({ data: [] }); },
                        });
                        target = {
                            kind: "handle",
                            address: "+12622102921",
                            service: "imessage",
                        };
                        return [4 /*yield*/, (0, send_js_1.resolveChatGuidForTarget)({
                                baseUrl: "http://localhost:1234",
                                password: "test",
                                target: target,
                            })];
                    case 1:
                        result = _a.sent();
                        // Should return null, NOT the group chat GUID
                        (0, vitest_1.expect)(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("returns null when chat not found", function () { return __awaiter(void 0, void 0, void 0, function () {
            var target, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            json: function () { return Promise.resolve({ data: [] }); },
                        });
                        target = { kind: "chat_id", chatId: 999 };
                        return [4 /*yield*/, (0, send_js_1.resolveChatGuidForTarget)({
                                baseUrl: "http://localhost:1234",
                                password: "test",
                                target: target,
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles API error gracefully", function () { return __awaiter(void 0, void 0, void 0, function () {
            var target, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: false,
                            status: 500,
                        });
                        target = { kind: "chat_id", chatId: 123 };
                        return [4 /*yield*/, (0, send_js_1.resolveChatGuidForTarget)({
                                baseUrl: "http://localhost:1234",
                                password: "test",
                                target: target,
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("paginates through chats to find match", function () { return __awaiter(void 0, void 0, void 0, function () {
            var target, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: Array(500)
                                        .fill(null)
                                        .map(function (_, i) { return ({
                                        id: i,
                                        guid: "chat-".concat(i),
                                        participants: [],
                                    }); }),
                                });
                            },
                        })
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [{ id: 555, guid: "found-chat", participants: [] }],
                                });
                            },
                        });
                        target = { kind: "chat_id", chatId: 555 };
                        return [4 /*yield*/, (0, send_js_1.resolveChatGuidForTarget)({
                                baseUrl: "http://localhost:1234",
                                password: "test",
                                target: target,
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe("found-chat");
                        (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(2);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("normalizes handle addresses for matching", function () { return __awaiter(void 0, void 0, void 0, function () {
            var target, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            guid: "iMessage;-;test@example.com",
                                            participants: [{ address: "Test@Example.COM" }],
                                        },
                                    ],
                                });
                            },
                        });
                        target = {
                            kind: "handle",
                            address: "test@example.com",
                            service: "auto",
                        };
                        return [4 /*yield*/, (0, send_js_1.resolveChatGuidForTarget)({
                                baseUrl: "http://localhost:1234",
                                password: "test",
                                target: target,
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe("iMessage;-;test@example.com");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("extracts guid from various response formats", function () { return __awaiter(void 0, void 0, void 0, function () {
            var target, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            chatGuid: "format1-guid",
                                            id: 100,
                                            participants: [],
                                        },
                                    ],
                                });
                            },
                        });
                        target = { kind: "chat_id", chatId: 100 };
                        return [4 /*yield*/, (0, send_js_1.resolveChatGuidForTarget)({
                                baseUrl: "http://localhost:1234",
                                password: "test",
                                target: target,
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe("format1-guid");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("sendMessageBlueBubbles", function () {
        (0, vitest_1.beforeEach)(function () {
            mockFetch.mockReset();
        });
        (0, vitest_1.it)("throws when text is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendMessageBlueBubbles)("+15551234567", "", {
                            serverUrl: "http://localhost:1234",
                            password: "test",
                        })).rejects.toThrow("requires text")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when text is whitespace only", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendMessageBlueBubbles)("+15551234567", "   ", {
                            serverUrl: "http://localhost:1234",
                            password: "test",
                        })).rejects.toThrow("requires text")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when serverUrl is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendMessageBlueBubbles)("+15551234567", "Hello", {})).rejects.toThrow("serverUrl is required")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when password is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendMessageBlueBubbles)("+15551234567", "Hello", {
                            serverUrl: "http://localhost:1234",
                        })).rejects.toThrow("password is required")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when chatGuid cannot be resolved for non-handle targets", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValue({
                            ok: true,
                            json: function () { return Promise.resolve({ data: [] }); },
                        });
                        return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendMessageBlueBubbles)("chat_id:999", "Hello", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })).rejects.toThrow("chatGuid not found")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("sends message successfully", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, sendCall, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            guid: "iMessage;-;+15551234567",
                                            participants: [{ address: "+15551234567" }],
                                        },
                                    ],
                                });
                            },
                        })
                            .mockResolvedValueOnce({
                            ok: true,
                            text: function () {
                                return Promise.resolve(JSON.stringify({
                                    data: { guid: "msg-uuid-123" },
                                }));
                            },
                        });
                        return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)("+15551234567", "Hello world!", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.messageId).toBe("msg-uuid-123");
                        (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(2);
                        sendCall = mockFetch.mock.calls[1];
                        (0, vitest_1.expect)(sendCall[0]).toContain("/api/v1/message/text");
                        body = JSON.parse(sendCall[1].body);
                        (0, vitest_1.expect)(body.chatGuid).toBe("iMessage;-;+15551234567");
                        (0, vitest_1.expect)(body.message).toBe("Hello world!");
                        (0, vitest_1.expect)(body.method).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("creates a new chat when handle target is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, createCall, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () { return Promise.resolve({ data: [] }); },
                        })
                            .mockResolvedValueOnce({
                            ok: true,
                            text: function () {
                                return Promise.resolve(JSON.stringify({
                                    data: { guid: "new-msg-guid" },
                                }));
                            },
                        });
                        return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)("+15550009999", "Hello new chat", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.messageId).toBe("new-msg-guid");
                        (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(2);
                        createCall = mockFetch.mock.calls[1];
                        (0, vitest_1.expect)(createCall[0]).toContain("/api/v1/chat/new");
                        body = JSON.parse(createCall[1].body);
                        (0, vitest_1.expect)(body.addresses).toEqual(["+15550009999"]);
                        (0, vitest_1.expect)(body.message).toBe("Hello new chat");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when creating a new chat requires Private API", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () { return Promise.resolve({ data: [] }); },
                        })
                            .mockResolvedValueOnce({
                            ok: false,
                            status: 403,
                            text: function () { return Promise.resolve("Private API not enabled"); },
                        });
                        return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendMessageBlueBubbles)("+15550008888", "Hello", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })).rejects.toThrow("Private API must be enabled")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("uses private-api when reply metadata is present", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, sendCall, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            guid: "iMessage;-;+15551234567",
                                            participants: [{ address: "+15551234567" }],
                                        },
                                    ],
                                });
                            },
                        })
                            .mockResolvedValueOnce({
                            ok: true,
                            text: function () {
                                return Promise.resolve(JSON.stringify({
                                    data: { guid: "msg-uuid-124" },
                                }));
                            },
                        });
                        return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)("+15551234567", "Replying", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                                replyToMessageGuid: "reply-guid-123",
                                replyToPartIndex: 1,
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.messageId).toBe("msg-uuid-124");
                        (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(2);
                        sendCall = mockFetch.mock.calls[1];
                        body = JSON.parse(sendCall[1].body);
                        (0, vitest_1.expect)(body.method).toBe("private-api");
                        (0, vitest_1.expect)(body.selectedMessageGuid).toBe("reply-guid-123");
                        (0, vitest_1.expect)(body.partIndex).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("normalizes effect names and uses private-api for effects", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, sendCall, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            guid: "iMessage;-;+15551234567",
                                            participants: [{ address: "+15551234567" }],
                                        },
                                    ],
                                });
                            },
                        })
                            .mockResolvedValueOnce({
                            ok: true,
                            text: function () {
                                return Promise.resolve(JSON.stringify({
                                    data: { guid: "msg-uuid-125" },
                                }));
                            },
                        });
                        return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)("+15551234567", "Hello", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                                effectId: "invisible ink",
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.messageId).toBe("msg-uuid-125");
                        (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(2);
                        sendCall = mockFetch.mock.calls[1];
                        body = JSON.parse(sendCall[1].body);
                        (0, vitest_1.expect)(body.method).toBe("private-api");
                        (0, vitest_1.expect)(body.effectId).toBe("com.apple.MobileSMS.expressivesend.invisibleink");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("sends message with chat_guid target directly", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockResolvedValueOnce({
                            ok: true,
                            text: function () {
                                return Promise.resolve(JSON.stringify({
                                    data: { messageId: "direct-msg-123" },
                                }));
                            },
                        });
                        return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)("chat_guid:iMessage;-;direct-chat", "Direct message", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.messageId).toBe("direct-msg-123");
                        (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles send failure", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            guid: "iMessage;-;+15551234567",
                                            participants: [{ address: "+15551234567" }],
                                        },
                                    ],
                                });
                            },
                        })
                            .mockResolvedValueOnce({
                            ok: false,
                            status: 500,
                            text: function () { return Promise.resolve("Internal server error"); },
                        });
                        return [4 /*yield*/, (0, vitest_1.expect)((0, send_js_1.sendMessageBlueBubbles)("+15551234567", "Hello", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })).rejects.toThrow("send failed (500)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles empty response body", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            guid: "iMessage;-;+15551234567",
                                            participants: [{ address: "+15551234567" }],
                                        },
                                    ],
                                });
                            },
                        })
                            .mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(""); },
                        });
                        return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)("+15551234567", "Hello", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.messageId).toBe("ok");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles invalid JSON response body", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            guid: "iMessage;-;+15551234567",
                                            participants: [{ address: "+15551234567" }],
                                        },
                                    ],
                                });
                            },
                        })
                            .mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve("not valid json"); },
                        });
                        return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)("+15551234567", "Hello", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.messageId).toBe("ok");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("extracts messageId from various response formats", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            guid: "iMessage;-;+15551234567",
                                            participants: [{ address: "+15551234567" }],
                                        },
                                    ],
                                });
                            },
                        })
                            .mockResolvedValueOnce({
                            ok: true,
                            text: function () {
                                return Promise.resolve(JSON.stringify({
                                    id: "numeric-id-456",
                                }));
                            },
                        });
                        return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)("+15551234567", "Hello", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.messageId).toBe("numeric-id-456");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("extracts messageGuid from response payload", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            guid: "iMessage;-;+15551234567",
                                            participants: [{ address: "+15551234567" }],
                                        },
                                    ],
                                });
                            },
                        })
                            .mockResolvedValueOnce({
                            ok: true,
                            text: function () {
                                return Promise.resolve(JSON.stringify({
                                    data: { messageGuid: "msg-guid-789" },
                                }));
                            },
                        });
                        return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)("+15551234567", "Hello", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.messageId).toBe("msg-guid-789");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("resolves credentials from config", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, calledUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            guid: "iMessage;-;+15551234567",
                                            participants: [{ address: "+15551234567" }],
                                        },
                                    ],
                                });
                            },
                        })
                            .mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(JSON.stringify({ data: { guid: "msg-123" } })); },
                        });
                        return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)("+15551234567", "Hello", {
                                cfg: {
                                    channels: {
                                        bluebubbles: {
                                            serverUrl: "http://config-server:5678",
                                            password: "config-pass",
                                        },
                                    },
                                },
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.messageId).toBe("msg-123");
                        calledUrl = mockFetch.mock.calls[0][0];
                        (0, vitest_1.expect)(calledUrl).toContain("config-server:5678");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("includes tempGuid in request payload", function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendCall, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch
                            .mockResolvedValueOnce({
                            ok: true,
                            json: function () {
                                return Promise.resolve({
                                    data: [
                                        {
                                            guid: "iMessage;-;+15551234567",
                                            participants: [{ address: "+15551234567" }],
                                        },
                                    ],
                                });
                            },
                        })
                            .mockResolvedValueOnce({
                            ok: true,
                            text: function () { return Promise.resolve(JSON.stringify({ data: { guid: "msg" } })); },
                        });
                        return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)("+15551234567", "Hello", {
                                serverUrl: "http://localhost:1234",
                                password: "test",
                            })];
                    case 1:
                        _a.sent();
                        sendCall = mockFetch.mock.calls[1];
                        body = JSON.parse(sendCall[1].body);
                        (0, vitest_1.expect)(body.tempGuid).toBeDefined();
                        (0, vitest_1.expect)(typeof body.tempGuid).toBe("string");
                        (0, vitest_1.expect)(body.tempGuid.length).toBeGreaterThan(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
