"use strict";
/**
 * Tests for send.ts module
 *
 * Tests cover:
 * - Message sending with valid configuration
 * - Account resolution and validation
 * - Channel normalization
 * - Markdown stripping
 * - Error handling for missing/invalid accounts
 * - Registry integration
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
var send_js_1 = require("./send.js");
// Mock dependencies
vitest_1.vi.mock("./config.js", function () { return ({
    DEFAULT_ACCOUNT_ID: "default",
    getAccountConfig: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./utils/twitch.js", function () { return ({
    generateMessageId: vitest_1.vi.fn(function () { return "test-msg-id"; }),
    isAccountConfigured: vitest_1.vi.fn(function () { return true; }),
    normalizeTwitchChannel: function (channel) { return channel.toLowerCase().replace(/^#/, ""); },
}); });
vitest_1.vi.mock("./utils/markdown.js", function () { return ({
    stripMarkdownForTwitch: vitest_1.vi.fn(function (text) { return text.replace(/\*\*/g, ""); }),
}); });
vitest_1.vi.mock("./client-manager-registry.js", function () { return ({
    getClientManager: vitest_1.vi.fn(),
}); });
(0, vitest_1.describe)("send", function () {
    var mockLogger = {
        info: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
        debug: vitest_1.vi.fn(),
    };
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
    (0, vitest_1.describe)("sendMessageTwitchInternal", function () {
        (0, vitest_1.it)("should send a message successfully", function () { return __awaiter(void 0, void 0, void 0, function () {
            var getAccountConfig, getClientManager, stripMarkdownForTwitch, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                    case 1:
                        getAccountConfig = (_a.sent()).getAccountConfig;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./client-manager-registry.js"); })];
                    case 2:
                        getClientManager = (_a.sent()).getClientManager;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./utils/markdown.js"); })];
                    case 3:
                        stripMarkdownForTwitch = (_a.sent()).stripMarkdownForTwitch;
                        vitest_1.vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
                        vitest_1.vi.mocked(getClientManager).mockReturnValue({
                            sendMessage: vitest_1.vi.fn().mockResolvedValue({
                                ok: true,
                                messageId: "twitch-msg-123",
                            }),
                        });
                        vitest_1.vi.mocked(stripMarkdownForTwitch).mockImplementation(function (text) { return text; });
                        return [4 /*yield*/, (0, send_js_1.sendMessageTwitchInternal)("#testchannel", "Hello Twitch!", mockConfig, "default", false, mockLogger)];
                    case 4:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.ok).toBe(true);
                        (0, vitest_1.expect)(result.messageId).toBe("twitch-msg-123");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should strip markdown when enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
            var getAccountConfig, getClientManager, stripMarkdownForTwitch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                    case 1:
                        getAccountConfig = (_a.sent()).getAccountConfig;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./client-manager-registry.js"); })];
                    case 2:
                        getClientManager = (_a.sent()).getClientManager;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./utils/markdown.js"); })];
                    case 3:
                        stripMarkdownForTwitch = (_a.sent()).stripMarkdownForTwitch;
                        vitest_1.vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
                        vitest_1.vi.mocked(getClientManager).mockReturnValue({
                            sendMessage: vitest_1.vi.fn().mockResolvedValue({
                                ok: true,
                                messageId: "twitch-msg-456",
                            }),
                        });
                        vitest_1.vi.mocked(stripMarkdownForTwitch).mockImplementation(function (text) { return text.replace(/\*\*/g, ""); });
                        return [4 /*yield*/, (0, send_js_1.sendMessageTwitchInternal)("#testchannel", "**Bold** text", mockConfig, "default", true, mockLogger)];
                    case 4:
                        _a.sent();
                        (0, vitest_1.expect)(stripMarkdownForTwitch).toHaveBeenCalledWith("**Bold** text");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should return error when account not found", function () { return __awaiter(void 0, void 0, void 0, function () {
            var getAccountConfig, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                    case 1:
                        getAccountConfig = (_a.sent()).getAccountConfig;
                        vitest_1.vi.mocked(getAccountConfig).mockReturnValue(null);
                        return [4 /*yield*/, (0, send_js_1.sendMessageTwitchInternal)("#testchannel", "Hello!", mockConfig, "nonexistent", false, mockLogger)];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.ok).toBe(false);
                        (0, vitest_1.expect)(result.error).toContain("Account not found: nonexistent");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should return error when account not configured", function () { return __awaiter(void 0, void 0, void 0, function () {
            var getAccountConfig, isAccountConfigured, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                    case 1:
                        getAccountConfig = (_a.sent()).getAccountConfig;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./utils/twitch.js"); })];
                    case 2:
                        isAccountConfigured = (_a.sent()).isAccountConfigured;
                        vitest_1.vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
                        vitest_1.vi.mocked(isAccountConfigured).mockReturnValue(false);
                        return [4 /*yield*/, (0, send_js_1.sendMessageTwitchInternal)("#testchannel", "Hello!", mockConfig, "default", false, mockLogger)];
                    case 3:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.ok).toBe(false);
                        (0, vitest_1.expect)(result.error).toContain("not properly configured");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should return error when no channel specified", function () { return __awaiter(void 0, void 0, void 0, function () {
            var getAccountConfig, isAccountConfigured, accountWithoutChannel, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                    case 1:
                        getAccountConfig = (_a.sent()).getAccountConfig;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./utils/twitch.js"); })];
                    case 2:
                        isAccountConfigured = (_a.sent()).isAccountConfigured;
                        accountWithoutChannel = __assign(__assign({}, mockAccount), { channel: undefined });
                        vitest_1.vi.mocked(getAccountConfig).mockReturnValue(accountWithoutChannel);
                        vitest_1.vi.mocked(isAccountConfigured).mockReturnValue(true);
                        return [4 /*yield*/, (0, send_js_1.sendMessageTwitchInternal)("", "Hello!", mockConfig, "default", false, mockLogger)];
                    case 3:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.ok).toBe(false);
                        (0, vitest_1.expect)(result.error).toContain("No channel specified");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should skip sending empty message after markdown stripping", function () { return __awaiter(void 0, void 0, void 0, function () {
            var getAccountConfig, isAccountConfigured, stripMarkdownForTwitch, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                    case 1:
                        getAccountConfig = (_a.sent()).getAccountConfig;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./utils/twitch.js"); })];
                    case 2:
                        isAccountConfigured = (_a.sent()).isAccountConfigured;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./utils/markdown.js"); })];
                    case 3:
                        stripMarkdownForTwitch = (_a.sent()).stripMarkdownForTwitch;
                        vitest_1.vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
                        vitest_1.vi.mocked(isAccountConfigured).mockReturnValue(true);
                        vitest_1.vi.mocked(stripMarkdownForTwitch).mockReturnValue("");
                        return [4 /*yield*/, (0, send_js_1.sendMessageTwitchInternal)("#testchannel", "**Only markdown**", mockConfig, "default", true, mockLogger)];
                    case 4:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.ok).toBe(true);
                        (0, vitest_1.expect)(result.messageId).toBe("skipped");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should return error when client manager not found", function () { return __awaiter(void 0, void 0, void 0, function () {
            var getAccountConfig, isAccountConfigured, getClientManager, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                    case 1:
                        getAccountConfig = (_a.sent()).getAccountConfig;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./utils/twitch.js"); })];
                    case 2:
                        isAccountConfigured = (_a.sent()).isAccountConfigured;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./client-manager-registry.js"); })];
                    case 3:
                        getClientManager = (_a.sent()).getClientManager;
                        vitest_1.vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
                        vitest_1.vi.mocked(isAccountConfigured).mockReturnValue(true);
                        vitest_1.vi.mocked(getClientManager).mockReturnValue(undefined);
                        return [4 /*yield*/, (0, send_js_1.sendMessageTwitchInternal)("#testchannel", "Hello!", mockConfig, "default", false, mockLogger)];
                    case 4:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.ok).toBe(false);
                        (0, vitest_1.expect)(result.error).toContain("Client manager not found");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle send errors gracefully", function () { return __awaiter(void 0, void 0, void 0, function () {
            var getAccountConfig, isAccountConfigured, getClientManager, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                    case 1:
                        getAccountConfig = (_a.sent()).getAccountConfig;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./utils/twitch.js"); })];
                    case 2:
                        isAccountConfigured = (_a.sent()).isAccountConfigured;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./client-manager-registry.js"); })];
                    case 3:
                        getClientManager = (_a.sent()).getClientManager;
                        vitest_1.vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
                        vitest_1.vi.mocked(isAccountConfigured).mockReturnValue(true);
                        vitest_1.vi.mocked(getClientManager).mockReturnValue({
                            sendMessage: vitest_1.vi.fn().mockRejectedValue(new Error("Connection lost")),
                        });
                        return [4 /*yield*/, (0, send_js_1.sendMessageTwitchInternal)("#testchannel", "Hello!", mockConfig, "default", false, mockLogger)];
                    case 4:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.ok).toBe(false);
                        (0, vitest_1.expect)(result.error).toBe("Connection lost");
                        (0, vitest_1.expect)(mockLogger.error).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should use account channel when channel parameter is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
            var getAccountConfig, isAccountConfigured, getClientManager, mockSend;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                    case 1:
                        getAccountConfig = (_a.sent()).getAccountConfig;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./utils/twitch.js"); })];
                    case 2:
                        isAccountConfigured = (_a.sent()).isAccountConfigured;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./client-manager-registry.js"); })];
                    case 3:
                        getClientManager = (_a.sent()).getClientManager;
                        vitest_1.vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
                        vitest_1.vi.mocked(isAccountConfigured).mockReturnValue(true);
                        mockSend = vitest_1.vi.fn().mockResolvedValue({
                            ok: true,
                            messageId: "twitch-msg-789",
                        });
                        vitest_1.vi.mocked(getClientManager).mockReturnValue({
                            sendMessage: mockSend,
                        });
                        return [4 /*yield*/, (0, send_js_1.sendMessageTwitchInternal)("", "Hello!", mockConfig, "default", false, mockLogger)];
                    case 4:
                        _a.sent();
                        (0, vitest_1.expect)(mockSend).toHaveBeenCalledWith(mockAccount, "testchannel", // normalized account channel
                        "Hello!", mockConfig, "default");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
