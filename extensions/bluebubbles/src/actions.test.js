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
var actions_js_1 = require("./actions.js");
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
vitest_1.vi.mock("./reactions.js", function () { return ({
    sendBlueBubblesReaction: vitest_1.vi.fn().mockResolvedValue(undefined),
}); });
vitest_1.vi.mock("./send.js", function () { return ({
    resolveChatGuidForTarget: vitest_1.vi.fn().mockResolvedValue("iMessage;-;+15551234567"),
    sendMessageBlueBubbles: vitest_1.vi.fn().mockResolvedValue({ messageId: "msg-123" }),
}); });
vitest_1.vi.mock("./chat.js", function () { return ({
    editBlueBubblesMessage: vitest_1.vi.fn().mockResolvedValue(undefined),
    unsendBlueBubblesMessage: vitest_1.vi.fn().mockResolvedValue(undefined),
    renameBlueBubblesChat: vitest_1.vi.fn().mockResolvedValue(undefined),
    setGroupIconBlueBubbles: vitest_1.vi.fn().mockResolvedValue(undefined),
    addBlueBubblesParticipant: vitest_1.vi.fn().mockResolvedValue(undefined),
    removeBlueBubblesParticipant: vitest_1.vi.fn().mockResolvedValue(undefined),
    leaveBlueBubblesChat: vitest_1.vi.fn().mockResolvedValue(undefined),
}); });
vitest_1.vi.mock("./attachments.js", function () { return ({
    sendBlueBubblesAttachment: vitest_1.vi.fn().mockResolvedValue({ messageId: "att-msg-123" }),
}); });
vitest_1.vi.mock("./monitor.js", function () { return ({
    resolveBlueBubblesMessageId: vitest_1.vi.fn(function (id) { return id; }),
}); });
(0, vitest_1.describe)("bluebubblesMessageActions", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)("listActions", function () {
        (0, vitest_1.it)("returns empty array when account is not enabled", function () {
            var cfg = {
                channels: { bluebubbles: { enabled: false } },
            };
            var actions = actions_js_1.bluebubblesMessageActions.listActions({ cfg: cfg });
            (0, vitest_1.expect)(actions).toEqual([]);
        });
        (0, vitest_1.it)("returns empty array when account is not configured", function () {
            var cfg = {
                channels: { bluebubbles: { enabled: true } },
            };
            var actions = actions_js_1.bluebubblesMessageActions.listActions({ cfg: cfg });
            (0, vitest_1.expect)(actions).toEqual([]);
        });
        (0, vitest_1.it)("returns react action when enabled and configured", function () {
            var cfg = {
                channels: {
                    bluebubbles: {
                        enabled: true,
                        serverUrl: "http://localhost:1234",
                        password: "test-password",
                    },
                },
            };
            var actions = actions_js_1.bluebubblesMessageActions.listActions({ cfg: cfg });
            (0, vitest_1.expect)(actions).toContain("react");
        });
        (0, vitest_1.it)("excludes react action when reactions are gated off", function () {
            var cfg = {
                channels: {
                    bluebubbles: {
                        enabled: true,
                        serverUrl: "http://localhost:1234",
                        password: "test-password",
                        actions: { reactions: false },
                    },
                },
            };
            var actions = actions_js_1.bluebubblesMessageActions.listActions({ cfg: cfg });
            (0, vitest_1.expect)(actions).not.toContain("react");
            // Other actions should still be present
            (0, vitest_1.expect)(actions).toContain("edit");
            (0, vitest_1.expect)(actions).toContain("unsend");
        });
    });
    (0, vitest_1.describe)("supportsAction", function () {
        (0, vitest_1.it)("returns true for react action", function () {
            (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.supportsAction({ action: "react" })).toBe(true);
        });
        (0, vitest_1.it)("returns true for all supported actions", function () {
            (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.supportsAction({ action: "edit" })).toBe(true);
            (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.supportsAction({ action: "unsend" })).toBe(true);
            (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.supportsAction({ action: "reply" })).toBe(true);
            (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.supportsAction({ action: "sendWithEffect" })).toBe(true);
            (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.supportsAction({ action: "renameGroup" })).toBe(true);
            (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.supportsAction({ action: "setGroupIcon" })).toBe(true);
            (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.supportsAction({ action: "addParticipant" })).toBe(true);
            (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.supportsAction({ action: "removeParticipant" })).toBe(true);
            (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.supportsAction({ action: "leaveGroup" })).toBe(true);
            (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.supportsAction({ action: "sendAttachment" })).toBe(true);
        });
        (0, vitest_1.it)("returns false for unsupported actions", function () {
            (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.supportsAction({ action: "delete" })).toBe(false);
            (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.supportsAction({ action: "unknown" })).toBe(false);
        });
    });
    (0, vitest_1.describe)("extractToolSend", function () {
        (0, vitest_1.it)("extracts send params from sendMessage action", function () {
            var result = actions_js_1.bluebubblesMessageActions.extractToolSend({
                args: {
                    action: "sendMessage",
                    to: "+15551234567",
                    accountId: "test-account",
                },
            });
            (0, vitest_1.expect)(result).toEqual({
                to: "+15551234567",
                accountId: "test-account",
            });
        });
        (0, vitest_1.it)("returns null for non-sendMessage action", function () {
            var result = actions_js_1.bluebubblesMessageActions.extractToolSend({
                args: { action: "react", to: "+15551234567" },
            });
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)("returns null when to is missing", function () {
            var result = actions_js_1.bluebubblesMessageActions.extractToolSend({
                args: { action: "sendMessage" },
            });
            (0, vitest_1.expect)(result).toBeNull();
        });
    });
    (0, vitest_1.describe)("handleAction", function () {
        (0, vitest_1.it)("throws for unsupported actions", function () { return __awaiter(void 0, void 0, void 0, function () {
            var cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        return [4 /*yield*/, (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "unknownAction",
                                params: {},
                                cfg: cfg,
                                accountId: null,
                            })).rejects.toThrow("is not supported")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when emoji is missing for react action", function () { return __awaiter(void 0, void 0, void 0, function () {
            var cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        return [4 /*yield*/, (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "react",
                                params: { messageId: "msg-123" },
                                cfg: cfg,
                                accountId: null,
                            })).rejects.toThrow(/emoji/i)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when messageId is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            var cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        return [4 /*yield*/, (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "react",
                                params: { emoji: "❤️" },
                                cfg: cfg,
                                accountId: null,
                            })).rejects.toThrow("messageId")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when chatGuid cannot be resolved", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resolveChatGuidForTarget, cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./send.js"); })];
                    case 1:
                        resolveChatGuidForTarget = (_a.sent()).resolveChatGuidForTarget;
                        vitest_1.vi.mocked(resolveChatGuidForTarget).mockResolvedValueOnce(null);
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        return [4 /*yield*/, (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "react",
                                params: { emoji: "❤️", messageId: "msg-123", to: "+15551234567" },
                                cfg: cfg,
                                accountId: null,
                            })).rejects.toThrow("chatGuid not found")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("sends reaction successfully with chatGuid", function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendBlueBubblesReaction, cfg, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./reactions.js"); })];
                    case 1:
                        sendBlueBubblesReaction = (_a.sent()).sendBlueBubblesReaction;
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        return [4 /*yield*/, actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "react",
                                params: {
                                    emoji: "❤️",
                                    messageId: "msg-123",
                                    chatGuid: "iMessage;-;+15551234567",
                                },
                                cfg: cfg,
                                accountId: null,
                            })];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(sendBlueBubblesReaction).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            chatGuid: "iMessage;-;+15551234567",
                            messageGuid: "msg-123",
                            emoji: "❤️",
                        }));
                        // jsonResult returns { content: [...], details: payload }
                        (0, vitest_1.expect)(result).toMatchObject({
                            details: { ok: true, added: "❤️" },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("sends reaction removal successfully", function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendBlueBubblesReaction, cfg, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./reactions.js"); })];
                    case 1:
                        sendBlueBubblesReaction = (_a.sent()).sendBlueBubblesReaction;
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        return [4 /*yield*/, actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "react",
                                params: {
                                    emoji: "❤️",
                                    messageId: "msg-123",
                                    chatGuid: "iMessage;-;+15551234567",
                                    remove: true,
                                },
                                cfg: cfg,
                                accountId: null,
                            })];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(sendBlueBubblesReaction).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            remove: true,
                        }));
                        // jsonResult returns { content: [...], details: payload }
                        (0, vitest_1.expect)(result).toMatchObject({
                            details: { ok: true, removed: true },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("resolves chatGuid from to parameter", function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendBlueBubblesReaction, resolveChatGuidForTarget, cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./reactions.js"); })];
                    case 1:
                        sendBlueBubblesReaction = (_a.sent()).sendBlueBubblesReaction;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./send.js"); })];
                    case 2:
                        resolveChatGuidForTarget = (_a.sent()).resolveChatGuidForTarget;
                        vitest_1.vi.mocked(resolveChatGuidForTarget).mockResolvedValueOnce("iMessage;-;+15559876543");
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        return [4 /*yield*/, actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "react",
                                params: {
                                    emoji: "👍",
                                    messageId: "msg-456",
                                    to: "+15559876543",
                                },
                                cfg: cfg,
                                accountId: null,
                            })];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(resolveChatGuidForTarget).toHaveBeenCalled();
                        (0, vitest_1.expect)(sendBlueBubblesReaction).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            chatGuid: "iMessage;-;+15559876543",
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("passes partIndex when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendBlueBubblesReaction, cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./reactions.js"); })];
                    case 1:
                        sendBlueBubblesReaction = (_a.sent()).sendBlueBubblesReaction;
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        return [4 /*yield*/, actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "react",
                                params: {
                                    emoji: "😂",
                                    messageId: "msg-789",
                                    chatGuid: "iMessage;-;chat-guid",
                                    partIndex: 2,
                                },
                                cfg: cfg,
                                accountId: null,
                            })];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(sendBlueBubblesReaction).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            partIndex: 2,
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("uses toolContext currentChannelId when no explicit target is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendBlueBubblesReaction, resolveChatGuidForTarget, cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./reactions.js"); })];
                    case 1:
                        sendBlueBubblesReaction = (_a.sent()).sendBlueBubblesReaction;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./send.js"); })];
                    case 2:
                        resolveChatGuidForTarget = (_a.sent()).resolveChatGuidForTarget;
                        vitest_1.vi.mocked(resolveChatGuidForTarget).mockResolvedValueOnce("iMessage;-;+15550001111");
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        return [4 /*yield*/, actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "react",
                                params: {
                                    emoji: "👍",
                                    messageId: "msg-456",
                                },
                                cfg: cfg,
                                accountId: null,
                                toolContext: {
                                    currentChannelId: "bluebubbles:chat_guid:iMessage;-;+15550001111",
                                },
                            })];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(resolveChatGuidForTarget).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            target: { kind: "chat_guid", chatGuid: "iMessage;-;+15550001111" },
                        }));
                        (0, vitest_1.expect)(sendBlueBubblesReaction).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            chatGuid: "iMessage;-;+15550001111",
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("resolves short messageId before reacting", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resolveBlueBubblesMessageId, sendBlueBubblesReaction, cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./monitor.js"); })];
                    case 1:
                        resolveBlueBubblesMessageId = (_a.sent()).resolveBlueBubblesMessageId;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./reactions.js"); })];
                    case 2:
                        sendBlueBubblesReaction = (_a.sent()).sendBlueBubblesReaction;
                        vitest_1.vi.mocked(resolveBlueBubblesMessageId).mockReturnValueOnce("resolved-uuid");
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        return [4 /*yield*/, actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "react",
                                params: {
                                    emoji: "❤️",
                                    messageId: "1",
                                    chatGuid: "iMessage;-;+15551234567",
                                },
                                cfg: cfg,
                                accountId: null,
                            })];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(resolveBlueBubblesMessageId).toHaveBeenCalledWith("1", { requireKnownShortId: true });
                        (0, vitest_1.expect)(sendBlueBubblesReaction).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            messageGuid: "resolved-uuid",
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("propagates short-id errors from the resolver", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resolveBlueBubblesMessageId, cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./monitor.js"); })];
                    case 1:
                        resolveBlueBubblesMessageId = (_a.sent()).resolveBlueBubblesMessageId;
                        vitest_1.vi.mocked(resolveBlueBubblesMessageId).mockImplementationOnce(function () {
                            throw new Error("short id expired");
                        });
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        return [4 /*yield*/, (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "react",
                                params: {
                                    emoji: "❤️",
                                    messageId: "999",
                                    chatGuid: "iMessage;-;+15551234567",
                                },
                                cfg: cfg,
                                accountId: null,
                            })).rejects.toThrow("short id expired")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("accepts message param for edit action", function () { return __awaiter(void 0, void 0, void 0, function () {
            var editBlueBubblesMessage, cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./chat.js"); })];
                    case 1:
                        editBlueBubblesMessage = (_a.sent()).editBlueBubblesMessage;
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        return [4 /*yield*/, actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "edit",
                                params: { messageId: "msg-123", message: "updated" },
                                cfg: cfg,
                                accountId: null,
                            })];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(editBlueBubblesMessage).toHaveBeenCalledWith("msg-123", "updated", vitest_1.expect.objectContaining({ cfg: cfg, accountId: undefined }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("accepts message/target aliases for sendWithEffect", function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendMessageBlueBubbles, cfg, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./send.js"); })];
                    case 1:
                        sendMessageBlueBubbles = (_a.sent()).sendMessageBlueBubbles;
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        return [4 /*yield*/, actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "sendWithEffect",
                                params: {
                                    message: "peekaboo",
                                    target: "+15551234567",
                                    effect: "invisible ink",
                                },
                                cfg: cfg,
                                accountId: null,
                            })];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(sendMessageBlueBubbles).toHaveBeenCalledWith("+15551234567", "peekaboo", vitest_1.expect.objectContaining({ effectId: "invisible ink" }));
                        (0, vitest_1.expect)(result).toMatchObject({
                            details: { ok: true, messageId: "msg-123", effect: "invisible ink" },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("passes asVoice through sendAttachment", function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendBlueBubblesAttachment, cfg, base64Buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./attachments.js"); })];
                    case 1:
                        sendBlueBubblesAttachment = (_a.sent()).sendBlueBubblesAttachment;
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        base64Buffer = Buffer.from("voice").toString("base64");
                        return [4 /*yield*/, actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "sendAttachment",
                                params: {
                                    to: "+15551234567",
                                    filename: "voice.mp3",
                                    buffer: base64Buffer,
                                    contentType: "audio/mpeg",
                                    asVoice: true,
                                },
                                cfg: cfg,
                                accountId: null,
                            })];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(sendBlueBubblesAttachment).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            filename: "voice.mp3",
                            contentType: "audio/mpeg",
                            asVoice: true,
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws when buffer is missing for setGroupIcon", function () { return __awaiter(void 0, void 0, void 0, function () {
            var cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        return [4 /*yield*/, (0, vitest_1.expect)(actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "setGroupIcon",
                                params: { chatGuid: "iMessage;-;chat-guid" },
                                cfg: cfg,
                                accountId: null,
                            })).rejects.toThrow(/requires an image/i)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("sets group icon successfully with chatGuid and buffer", function () { return __awaiter(void 0, void 0, void 0, function () {
            var setGroupIconBlueBubbles, cfg, testBuffer, base64Buffer, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./chat.js"); })];
                    case 1:
                        setGroupIconBlueBubbles = (_a.sent()).setGroupIconBlueBubbles;
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        testBuffer = Buffer.from("fake-image-data");
                        base64Buffer = testBuffer.toString("base64");
                        return [4 /*yield*/, actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "setGroupIcon",
                                params: {
                                    chatGuid: "iMessage;-;chat-guid",
                                    buffer: base64Buffer,
                                    filename: "group-icon.png",
                                    contentType: "image/png",
                                },
                                cfg: cfg,
                                accountId: null,
                            })];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(setGroupIconBlueBubbles).toHaveBeenCalledWith("iMessage;-;chat-guid", vitest_1.expect.any(Uint8Array), "group-icon.png", vitest_1.expect.objectContaining({ contentType: "image/png" }));
                        (0, vitest_1.expect)(result).toMatchObject({
                            details: { ok: true, chatGuid: "iMessage;-;chat-guid", iconSet: true },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("uses default filename when not provided for setGroupIcon", function () { return __awaiter(void 0, void 0, void 0, function () {
            var setGroupIconBlueBubbles, cfg, base64Buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./chat.js"); })];
                    case 1:
                        setGroupIconBlueBubbles = (_a.sent()).setGroupIconBlueBubbles;
                        cfg = {
                            channels: {
                                bluebubbles: {
                                    serverUrl: "http://localhost:1234",
                                    password: "test-password",
                                },
                            },
                        };
                        base64Buffer = Buffer.from("test").toString("base64");
                        return [4 /*yield*/, actions_js_1.bluebubblesMessageActions.handleAction({
                                action: "setGroupIcon",
                                params: {
                                    chatGuid: "iMessage;-;chat-guid",
                                    buffer: base64Buffer,
                                },
                                cfg: cfg,
                                accountId: null,
                            })];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(setGroupIconBlueBubbles).toHaveBeenCalledWith("iMessage;-;chat-guid", vitest_1.expect.any(Uint8Array), "icon.png", vitest_1.expect.anything());
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
