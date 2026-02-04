"use strict";
/**
 * Tests for outbound.ts module
 *
 * Tests cover:
 * - resolveTarget with various modes (explicit, implicit, heartbeat)
 * - sendText with markdown stripping
 * - sendMedia delegation to sendText
 * - Error handling for missing accounts/channels
 * - Abort signal handling
 */
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
var outbound_js_1 = require("./outbound.js");
// Mock dependencies
vitest_1.vi.mock("./config.js", function () { return ({
    DEFAULT_ACCOUNT_ID: "default",
    getAccountConfig: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./send.js", function () { return ({
    sendMessageTwitchInternal: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./utils/markdown.js", function () { return ({
    chunkTextForTwitch: vitest_1.vi.fn(function (text) { return text.split(/(.{500})/).filter(Boolean); }),
}); });
vitest_1.vi.mock("./utils/twitch.js", function () { return ({
    normalizeTwitchChannel: function (channel) { return channel.toLowerCase().replace(/^#/, ""); },
    missingTargetError: function (channel, hint) {
        return "Missing target for ".concat(channel, ". Provide ").concat(hint);
    },
}); });
(0, vitest_1.describe)("outbound", function () {
    var mockAccount = {
        username: "testbot",
        token: "oauth:test123",
        clientId: "test-client-id",
        channel: "#testchannel",
    };
    var mockConfig = {
        channels: {
            twitch: {
                accounts: {
                    default: mockAccount,
                },
            },
        },
    };
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)("metadata", function () {
        (0, vitest_1.it)("should have direct delivery mode", function () {
            (0, vitest_1.expect)(outbound_js_1.twitchOutbound.deliveryMode).toBe("direct");
        });
        (0, vitest_1.it)("should have 500 character text chunk limit", function () {
            (0, vitest_1.expect)(outbound_js_1.twitchOutbound.textChunkLimit).toBe(500);
        });
        (0, vitest_1.it)("should have chunker function", function () {
            (0, vitest_1.expect)(outbound_js_1.twitchOutbound.chunker).toBeDefined();
            (0, vitest_1.expect)(typeof outbound_js_1.twitchOutbound.chunker).toBe("function");
        });
    });
    (0, vitest_1.describe)("resolveTarget", function () {
        (0, vitest_1.it)("should normalize and return target in explicit mode", function () {
            var result = outbound_js_1.twitchOutbound.resolveTarget({
                to: "#MyChannel",
                mode: "explicit",
                allowFrom: [],
            });
            (0, vitest_1.expect)(result.ok).toBe(true);
            (0, vitest_1.expect)(result.to).toBe("mychannel");
        });
        (0, vitest_1.it)("should return target in implicit mode with wildcard allowlist", function () {
            var result = outbound_js_1.twitchOutbound.resolveTarget({
                to: "#AnyChannel",
                mode: "implicit",
                allowFrom: ["*"],
            });
            (0, vitest_1.expect)(result.ok).toBe(true);
            (0, vitest_1.expect)(result.to).toBe("anychannel");
        });
        (0, vitest_1.it)("should return target in implicit mode when in allowlist", function () {
            var result = outbound_js_1.twitchOutbound.resolveTarget({
                to: "#allowed",
                mode: "implicit",
                allowFrom: ["#allowed", "#other"],
            });
            (0, vitest_1.expect)(result.ok).toBe(true);
            (0, vitest_1.expect)(result.to).toBe("allowed");
        });
        (0, vitest_1.it)("should fallback to first allowlist entry when target not in list", function () {
            var result = outbound_js_1.twitchOutbound.resolveTarget({
                to: "#notallowed",
                mode: "implicit",
                allowFrom: ["#primary", "#secondary"],
            });
            (0, vitest_1.expect)(result.ok).toBe(true);
            (0, vitest_1.expect)(result.to).toBe("primary");
        });
        (0, vitest_1.it)("should accept any target when allowlist is empty", function () {
            var result = outbound_js_1.twitchOutbound.resolveTarget({
                to: "#anychannel",
                mode: "heartbeat",
                allowFrom: [],
            });
            (0, vitest_1.expect)(result.ok).toBe(true);
            (0, vitest_1.expect)(result.to).toBe("anychannel");
        });
        (0, vitest_1.it)("should use first allowlist entry when no target provided", function () {
            var result = outbound_js_1.twitchOutbound.resolveTarget({
                to: undefined,
                mode: "implicit",
                allowFrom: ["#fallback", "#other"],
            });
            (0, vitest_1.expect)(result.ok).toBe(true);
            (0, vitest_1.expect)(result.to).toBe("fallback");
        });
        (0, vitest_1.it)("should return error when no target and no allowlist", function () {
            var result = outbound_js_1.twitchOutbound.resolveTarget({
                to: undefined,
                mode: "explicit",
                allowFrom: [],
            });
            (0, vitest_1.expect)(result.ok).toBe(false);
            (0, vitest_1.expect)(result.error).toContain("Missing target");
        });
        (0, vitest_1.it)("should handle whitespace-only target", function () {
            var result = outbound_js_1.twitchOutbound.resolveTarget({
                to: "   ",
                mode: "explicit",
                allowFrom: [],
            });
            (0, vitest_1.expect)(result.ok).toBe(false);
            (0, vitest_1.expect)(result.error).toContain("Missing target");
        });
        (0, vitest_1.it)("should filter wildcard from allowlist when checking membership", function () {
            var result = outbound_js_1.twitchOutbound.resolveTarget({
                to: "#mychannel",
                mode: "implicit",
                allowFrom: ["*", "#specific"],
            });
            // With wildcard, any target is accepted
            (0, vitest_1.expect)(result.ok).toBe(true);
            (0, vitest_1.expect)(result.to).toBe("mychannel");
        });
    });
    (0, vitest_1.describe)("sendText", function () {
        (0, vitest_1.it)("should send message successfully", function () { return __awaiter(void 0, void 0, void 0, function () {
            var getAccountConfig, sendMessageTwitchInternal, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                    case 1:
                        getAccountConfig = (_a.sent()).getAccountConfig;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./send.js"); })];
                    case 2:
                        sendMessageTwitchInternal = (_a.sent()).sendMessageTwitchInternal;
                        vitest_1.vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
                        vitest_1.vi.mocked(sendMessageTwitchInternal).mockResolvedValue({
                            ok: true,
                            messageId: "twitch-msg-123",
                        });
                        return [4 /*yield*/, outbound_js_1.twitchOutbound.sendText({
                                cfg: mockConfig,
                                to: "#testchannel",
                                text: "Hello Twitch!",
                                accountId: "default",
                            })];
                    case 3:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.channel).toBe("twitch");
                        (0, vitest_1.expect)(result.messageId).toBe("twitch-msg-123");
                        (0, vitest_1.expect)(result.to).toBe("testchannel");
                        (0, vitest_1.expect)(result.timestamp).toBeGreaterThan(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should throw when account not found", function () { return __awaiter(void 0, void 0, void 0, function () {
            var getAccountConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                    case 1:
                        getAccountConfig = (_a.sent()).getAccountConfig;
                        vitest_1.vi.mocked(getAccountConfig).mockReturnValue(null);
                        return [4 /*yield*/, (0, vitest_1.expect)(outbound_js_1.twitchOutbound.sendText({
                                cfg: mockConfig,
                                to: "#testchannel",
                                text: "Hello!",
                                accountId: "nonexistent",
                            })).rejects.toThrow("Twitch account not found: nonexistent")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should throw when no channel specified", function () { return __awaiter(void 0, void 0, void 0, function () {
            var getAccountConfig, accountWithoutChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                    case 1:
                        getAccountConfig = (_a.sent()).getAccountConfig;
                        accountWithoutChannel = __assign(__assign({}, mockAccount), { channel: undefined });
                        vitest_1.vi.mocked(getAccountConfig).mockReturnValue(accountWithoutChannel);
                        return [4 /*yield*/, (0, vitest_1.expect)(outbound_js_1.twitchOutbound.sendText({
                                cfg: mockConfig,
                                to: undefined,
                                text: "Hello!",
                                accountId: "default",
                            })).rejects.toThrow("No channel specified")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should use account channel when target not provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            var getAccountConfig, sendMessageTwitchInternal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                    case 1:
                        getAccountConfig = (_a.sent()).getAccountConfig;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./send.js"); })];
                    case 2:
                        sendMessageTwitchInternal = (_a.sent()).sendMessageTwitchInternal;
                        vitest_1.vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
                        vitest_1.vi.mocked(sendMessageTwitchInternal).mockResolvedValue({
                            ok: true,
                            messageId: "msg-456",
                        });
                        return [4 /*yield*/, outbound_js_1.twitchOutbound.sendText({
                                cfg: mockConfig,
                                to: undefined,
                                text: "Hello!",
                                accountId: "default",
                            })];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(sendMessageTwitchInternal).toHaveBeenCalledWith("testchannel", "Hello!", mockConfig, "default", true, console);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle abort signal", function () { return __awaiter(void 0, void 0, void 0, function () {
            var abortController;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        abortController = new AbortController();
                        abortController.abort();
                        return [4 /*yield*/, (0, vitest_1.expect)(outbound_js_1.twitchOutbound.sendText({
                                cfg: mockConfig,
                                to: "#testchannel",
                                text: "Hello!",
                                accountId: "default",
                                signal: abortController.signal,
                            })).rejects.toThrow("Outbound delivery aborted")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should throw on send failure", function () { return __awaiter(void 0, void 0, void 0, function () {
            var getAccountConfig, sendMessageTwitchInternal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                    case 1:
                        getAccountConfig = (_a.sent()).getAccountConfig;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./send.js"); })];
                    case 2:
                        sendMessageTwitchInternal = (_a.sent()).sendMessageTwitchInternal;
                        vitest_1.vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
                        vitest_1.vi.mocked(sendMessageTwitchInternal).mockResolvedValue({
                            ok: false,
                            messageId: "failed-msg",
                            error: "Connection lost",
                        });
                        return [4 /*yield*/, (0, vitest_1.expect)(outbound_js_1.twitchOutbound.sendText({
                                cfg: mockConfig,
                                to: "#testchannel",
                                text: "Hello!",
                                accountId: "default",
                            })).rejects.toThrow("Connection lost")];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("sendMedia", function () {
        (0, vitest_1.it)("should combine text and media URL", function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendMessageTwitchInternal, getAccountConfig, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./send.js"); })];
                    case 1:
                        sendMessageTwitchInternal = (_a.sent()).sendMessageTwitchInternal;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                    case 2:
                        getAccountConfig = (_a.sent()).getAccountConfig;
                        vitest_1.vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
                        vitest_1.vi.mocked(sendMessageTwitchInternal).mockResolvedValue({
                            ok: true,
                            messageId: "media-msg-123",
                        });
                        return [4 /*yield*/, outbound_js_1.twitchOutbound.sendMedia({
                                cfg: mockConfig,
                                to: "#testchannel",
                                text: "Check this:",
                                mediaUrl: "https://example.com/image.png",
                                accountId: "default",
                            })];
                    case 3:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.channel).toBe("twitch");
                        (0, vitest_1.expect)(result.messageId).toBe("media-msg-123");
                        (0, vitest_1.expect)(sendMessageTwitchInternal).toHaveBeenCalledWith(vitest_1.expect.anything(), "Check this: https://example.com/image.png", vitest_1.expect.anything(), vitest_1.expect.anything(), vitest_1.expect.anything(), vitest_1.expect.anything());
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should send media URL only when no text", function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendMessageTwitchInternal, getAccountConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./send.js"); })];
                    case 1:
                        sendMessageTwitchInternal = (_a.sent()).sendMessageTwitchInternal;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                    case 2:
                        getAccountConfig = (_a.sent()).getAccountConfig;
                        vitest_1.vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
                        vitest_1.vi.mocked(sendMessageTwitchInternal).mockResolvedValue({
                            ok: true,
                            messageId: "media-only-msg",
                        });
                        return [4 /*yield*/, outbound_js_1.twitchOutbound.sendMedia({
                                cfg: mockConfig,
                                to: "#testchannel",
                                text: undefined,
                                mediaUrl: "https://example.com/image.png",
                                accountId: "default",
                            })];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(sendMessageTwitchInternal).toHaveBeenCalledWith(vitest_1.expect.anything(), "https://example.com/image.png", vitest_1.expect.anything(), vitest_1.expect.anything(), vitest_1.expect.anything(), vitest_1.expect.anything());
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle abort signal", function () { return __awaiter(void 0, void 0, void 0, function () {
            var abortController;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        abortController = new AbortController();
                        abortController.abort();
                        return [4 /*yield*/, (0, vitest_1.expect)(outbound_js_1.twitchOutbound.sendMedia({
                                cfg: mockConfig,
                                to: "#testchannel",
                                text: "Check this:",
                                mediaUrl: "https://example.com/image.png",
                                accountId: "default",
                                signal: abortController.signal,
                            })).rejects.toThrow("Outbound delivery aborted")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
