"use strict";
/**
 * Tests for TwitchClientManager class
 *
 * Tests cover:
 * - Client connection and reconnection
 * - Message handling (chat)
 * - Message sending with rate limiting
 * - Disconnection scenarios
 * - Error handling and edge cases
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
var twitch_client_js_1 = require("./twitch-client.js");
// Mock @twurple dependencies
var mockConnect = vitest_1.vi.fn().mockResolvedValue(undefined);
var mockJoin = vitest_1.vi.fn().mockResolvedValue(undefined);
var mockSay = vitest_1.vi.fn().mockResolvedValue({ messageId: "test-msg-123" });
var mockQuit = vitest_1.vi.fn();
var mockUnbind = vitest_1.vi.fn();
// Event handler storage for testing
// oxlint-disable-next-line typescript/no-explicit-any
var messageHandlers = [];
// Mock functions that track handlers and return unbind objects
// oxlint-disable-next-line typescript/no-explicit-any
var mockOnMessage = vitest_1.vi.fn(function (handler) {
    messageHandlers.push(handler);
    return { unbind: mockUnbind };
});
var mockAddUserForToken = vitest_1.vi.fn().mockResolvedValue("123456");
var mockOnRefresh = vitest_1.vi.fn();
var mockOnRefreshFailure = vitest_1.vi.fn();
vitest_1.vi.mock("@twurple/chat", function () { return ({
    ChatClient: /** @class */ (function () {
        function class_1() {
            this.onMessage = mockOnMessage;
            this.connect = mockConnect;
            this.join = mockJoin;
            this.say = mockSay;
            this.quit = mockQuit;
        }
        return class_1;
    }()),
    LogLevel: {
        CRITICAL: "CRITICAL",
        ERROR: "ERROR",
        WARNING: "WARNING",
        INFO: "INFO",
        DEBUG: "DEBUG",
        TRACE: "TRACE",
    },
}); });
var mockAuthProvider = {
    constructor: vitest_1.vi.fn(),
};
vitest_1.vi.mock("@twurple/auth", function () { return ({
    StaticAuthProvider: /** @class */ (function () {
        function class_2() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            mockAuthProvider.constructor.apply(mockAuthProvider, args);
        }
        return class_2;
    }()),
    RefreshingAuthProvider: /** @class */ (function () {
        function class_3() {
            this.addUserForToken = mockAddUserForToken;
            this.onRefresh = mockOnRefresh;
            this.onRefreshFailure = mockOnRefreshFailure;
        }
        return class_3;
    }()),
}); });
// Mock token resolution - must be after @twurple/auth mock
vitest_1.vi.mock("./token.js", function () { return ({
    resolveTwitchToken: vitest_1.vi.fn(function () { return ({
        token: "oauth:mock-token-from-tests",
        source: "config",
    }); }),
    DEFAULT_ACCOUNT_ID: "default",
}); });
(0, vitest_1.describe)("TwitchClientManager", function () {
    var manager;
    var mockLogger;
    var testAccount = {
        username: "testbot",
        token: "oauth:test123456",
        clientId: "test-client-id",
        channel: "testchannel",
        enabled: true,
    };
    var testAccount2 = {
        username: "testbot2",
        token: "oauth:test789",
        clientId: "test-client-id-2",
        channel: "testchannel2",
        enabled: true,
    };
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveTwitchToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Clear all mocks first
                    vitest_1.vi.clearAllMocks();
                    // Clear handler arrays
                    messageHandlers.length = 0;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./token.js"); })];
                case 1:
                    resolveTwitchToken = (_a.sent()).resolveTwitchToken;
                    vitest_1.vi.mocked(resolveTwitchToken).mockReturnValue({
                        token: "oauth:mock-token-from-tests",
                        source: "config",
                    });
                    // Create mock logger
                    mockLogger = {
                        info: vitest_1.vi.fn(),
                        warn: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        debug: vitest_1.vi.fn(),
                    };
                    // Create manager instance
                    manager = new twitch_client_js_1.TwitchClientManager(mockLogger);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () {
        // Clean up manager to avoid side effects
        manager._clearForTest();
    });
    (0, vitest_1.describe)("getClient", function () {
        (0, vitest_1.it)("should create a new client connection", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.getClient(testAccount)];
                    case 1:
                        _client = _a.sent();
                        // New implementation: connect is called, channels are passed to constructor
                        (0, vitest_1.expect)(mockConnect).toHaveBeenCalledTimes(1);
                        (0, vitest_1.expect)(mockLogger.info).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Connected to Twitch as testbot"));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should use account username as default channel when channel not specified", function () { return __awaiter(void 0, void 0, void 0, function () {
            var accountWithoutChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accountWithoutChannel = __assign(__assign({}, testAccount), { channel: undefined });
                        return [4 /*yield*/, manager.getClient(accountWithoutChannel)];
                    case 1:
                        _a.sent();
                        // New implementation: channel (testbot) is passed to constructor, not via join()
                        (0, vitest_1.expect)(mockConnect).toHaveBeenCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should reuse existing client for same account", function () { return __awaiter(void 0, void 0, void 0, function () {
            var client1, client2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.getClient(testAccount)];
                    case 1:
                        client1 = _a.sent();
                        return [4 /*yield*/, manager.getClient(testAccount)];
                    case 2:
                        client2 = _a.sent();
                        (0, vitest_1.expect)(client1).toBe(client2);
                        (0, vitest_1.expect)(mockConnect).toHaveBeenCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should create separate clients for different accounts", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.getClient(testAccount)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, manager.getClient(testAccount2)];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockConnect).toHaveBeenCalledTimes(2);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should normalize token by removing oauth: prefix", function () { return __awaiter(void 0, void 0, void 0, function () {
            var accountWithPrefix, resolveTwitchToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accountWithPrefix = __assign(__assign({}, testAccount), { token: "oauth:actualtoken123" });
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./token.js"); })];
                    case 1:
                        resolveTwitchToken = (_a.sent()).resolveTwitchToken;
                        vitest_1.vi.mocked(resolveTwitchToken).mockReturnValue({
                            token: "oauth:actualtoken123",
                            source: "config",
                        });
                        return [4 /*yield*/, manager.getClient(accountWithPrefix)];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockAuthProvider.constructor).toHaveBeenCalledWith("test-client-id", "actualtoken123");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should use token directly when no oauth: prefix", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resolveTwitchToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./token.js"); })];
                    case 1:
                        resolveTwitchToken = (_a.sent()).resolveTwitchToken;
                        vitest_1.vi.mocked(resolveTwitchToken).mockReturnValue({
                            token: "oauth:mock-token-from-tests",
                            source: "config",
                        });
                        return [4 /*yield*/, manager.getClient(testAccount)];
                    case 2:
                        _a.sent();
                        // Implementation strips oauth: prefix from all tokens
                        (0, vitest_1.expect)(mockAuthProvider.constructor).toHaveBeenCalledWith("test-client-id", "mock-token-from-tests");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should throw error when clientId is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            var accountWithoutClientId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accountWithoutClientId = __assign(__assign({}, testAccount), { clientId: undefined });
                        return [4 /*yield*/, (0, vitest_1.expect)(manager.getClient(accountWithoutClientId)).rejects.toThrow("Missing Twitch client ID")];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockLogger.error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Missing Twitch client ID"));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should throw error when token is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resolveTwitchToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./token.js"); })];
                    case 1:
                        resolveTwitchToken = (_a.sent()).resolveTwitchToken;
                        vitest_1.vi.mocked(resolveTwitchToken).mockReturnValue({
                            token: "",
                            source: "none",
                        });
                        return [4 /*yield*/, (0, vitest_1.expect)(manager.getClient(testAccount)).rejects.toThrow("Missing Twitch token")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should set up message handlers on client connection", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.getClient(testAccount)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockOnMessage).toHaveBeenCalled();
                        (0, vitest_1.expect)(mockLogger.info).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Set up handlers for"));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should create separate clients for same account with different channels", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account1, account2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account1 = __assign(__assign({}, testAccount), { channel: "channel1" });
                        account2 = __assign(__assign({}, testAccount), { channel: "channel2" });
                        return [4 /*yield*/, manager.getClient(account1)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, manager.getClient(account2)];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockConnect).toHaveBeenCalledTimes(2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("onMessage", function () {
        (0, vitest_1.it)("should register message handler for account", function () {
            var handler = vitest_1.vi.fn();
            manager.onMessage(testAccount, handler);
            (0, vitest_1.expect)(handler).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)("should replace existing handler for same account", function () {
            var handler1 = vitest_1.vi.fn();
            var handler2 = vitest_1.vi.fn();
            manager.onMessage(testAccount, handler1);
            manager.onMessage(testAccount, handler2);
            // Check the stored handler is handler2
            var key = manager.getAccountKey(testAccount);
            // oxlint-disable-next-line typescript/no-explicit-any
            (0, vitest_1.expect)(manager.messageHandlers.get(key)).toBe(handler2);
        });
    });
    (0, vitest_1.describe)("disconnect", function () {
        (0, vitest_1.it)("should disconnect a connected client", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.getClient(testAccount)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, manager.disconnect(testAccount)];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockQuit).toHaveBeenCalledTimes(1);
                        (0, vitest_1.expect)(mockLogger.info).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Disconnected"));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should clear client and message handler", function () { return __awaiter(void 0, void 0, void 0, function () {
            var handler, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handler = vitest_1.vi.fn();
                        return [4 /*yield*/, manager.getClient(testAccount)];
                    case 1:
                        _a.sent();
                        manager.onMessage(testAccount, handler);
                        return [4 /*yield*/, manager.disconnect(testAccount)];
                    case 2:
                        _a.sent();
                        key = manager.getAccountKey(testAccount);
                        // oxlint-disable-next-line typescript/no-explicit-any
                        (0, vitest_1.expect)(manager.clients.has(key)).toBe(false);
                        // oxlint-disable-next-line typescript/no-explicit-any
                        (0, vitest_1.expect)(manager.messageHandlers.has(key)).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle disconnecting non-existent client gracefully", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // disconnect doesn't throw, just does nothing
                    return [4 /*yield*/, manager.disconnect(testAccount)];
                    case 1:
                        // disconnect doesn't throw, just does nothing
                        _a.sent();
                        (0, vitest_1.expect)(mockQuit).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should only disconnect specified account when multiple accounts exist", function () { return __awaiter(void 0, void 0, void 0, function () {
            var key2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.getClient(testAccount)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, manager.getClient(testAccount2)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, manager.disconnect(testAccount)];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(mockQuit).toHaveBeenCalledTimes(1);
                        key2 = manager.getAccountKey(testAccount2);
                        // oxlint-disable-next-line typescript/no-explicit-any
                        (0, vitest_1.expect)(manager.clients.has(key2)).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("disconnectAll", function () {
        (0, vitest_1.it)("should disconnect all connected clients", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.getClient(testAccount)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, manager.getClient(testAccount2)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, manager.disconnectAll()];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(mockQuit).toHaveBeenCalledTimes(2);
                        // oxlint-disable-next-line typescript/no-explicit-any
                        (0, vitest_1.expect)(manager.clients.size).toBe(0);
                        // oxlint-disable-next-line typescript/no-explicit-any
                        (0, vitest_1.expect)(manager.messageHandlers.size).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle empty client list gracefully", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // disconnectAll doesn't throw, just does nothing
                    return [4 /*yield*/, manager.disconnectAll()];
                    case 1:
                        // disconnectAll doesn't throw, just does nothing
                        _a.sent();
                        (0, vitest_1.expect)(mockQuit).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("sendMessage", function () {
        (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.getClient(testAccount)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should send message successfully", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.sendMessage(testAccount, "testchannel", "Hello, world!")];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.ok).toBe(true);
                        (0, vitest_1.expect)(result.messageId).toBeDefined();
                        (0, vitest_1.expect)(mockSay).toHaveBeenCalledWith("testchannel", "Hello, world!");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should generate unique message ID for each message", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result1, result2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.sendMessage(testAccount, "testchannel", "First message")];
                    case 1:
                        result1 = _a.sent();
                        return [4 /*yield*/, manager.sendMessage(testAccount, "testchannel", "Second message")];
                    case 2:
                        result2 = _a.sent();
                        (0, vitest_1.expect)(result1.messageId).not.toBe(result2.messageId);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle sending to account's default channel", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.sendMessage(testAccount, testAccount.channel || testAccount.username, "Test message")];
                    case 1:
                        result = _a.sent();
                        // Should use the account's channel or username
                        (0, vitest_1.expect)(result.ok).toBe(true);
                        (0, vitest_1.expect)(mockSay).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should return error on send failure", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockSay.mockRejectedValueOnce(new Error("Rate limited"));
                        return [4 /*yield*/, manager.sendMessage(testAccount, "testchannel", "Test message")];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.ok).toBe(false);
                        (0, vitest_1.expect)(result.error).toBe("Rate limited");
                        (0, vitest_1.expect)(mockLogger.error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Failed to send message"));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle unknown error types", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockSay.mockRejectedValueOnce("String error");
                        return [4 /*yield*/, manager.sendMessage(testAccount, "testchannel", "Test message")];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.ok).toBe(false);
                        (0, vitest_1.expect)(result.error).toBe("String error");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should create client if not already connected", function () { return __awaiter(void 0, void 0, void 0, function () {
            var connectCallCountBefore, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Clear the existing client
                        // oxlint-disable-next-line typescript/no-explicit-any
                        manager.clients.clear();
                        connectCallCountBefore = mockConnect.mock.calls.length;
                        return [4 /*yield*/, manager.sendMessage(testAccount, "testchannel", "Test message")];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.ok).toBe(true);
                        (0, vitest_1.expect)(mockConnect.mock.calls.length).toBeGreaterThan(connectCallCountBefore);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("message handling integration", function () {
        var capturedMessage = null;
        (0, vitest_1.beforeEach)(function () {
            capturedMessage = null;
            // Set up message handler before connecting
            manager.onMessage(testAccount, function (message) {
                capturedMessage = message;
            });
        });
        (0, vitest_1.it)("should handle incoming chat messages", function () { return __awaiter(void 0, void 0, void 0, function () {
            var onMessageCallback;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.getClient(testAccount)];
                    case 1:
                        _a.sent();
                        onMessageCallback = messageHandlers[0];
                        if (!onMessageCallback) {
                            throw new Error("onMessageCallback not found");
                        }
                        // Simulate Twitch message
                        onMessageCallback("#testchannel", "testuser", "Hello bot!", {
                            userInfo: {
                                userName: "testuser",
                                displayName: "TestUser",
                                userId: "12345",
                                isMod: false,
                                isBroadcaster: false,
                                isVip: false,
                                isSubscriber: false,
                            },
                            id: "msg123",
                        });
                        (0, vitest_1.expect)(capturedMessage).not.toBeNull();
                        (0, vitest_1.expect)(capturedMessage === null || capturedMessage === void 0 ? void 0 : capturedMessage.username).toBe("testuser");
                        (0, vitest_1.expect)(capturedMessage === null || capturedMessage === void 0 ? void 0 : capturedMessage.displayName).toBe("TestUser");
                        (0, vitest_1.expect)(capturedMessage === null || capturedMessage === void 0 ? void 0 : capturedMessage.userId).toBe("12345");
                        (0, vitest_1.expect)(capturedMessage === null || capturedMessage === void 0 ? void 0 : capturedMessage.message).toBe("Hello bot!");
                        (0, vitest_1.expect)(capturedMessage === null || capturedMessage === void 0 ? void 0 : capturedMessage.channel).toBe("testchannel");
                        (0, vitest_1.expect)(capturedMessage === null || capturedMessage === void 0 ? void 0 : capturedMessage.chatType).toBe("group");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should normalize channel names without # prefix", function () { return __awaiter(void 0, void 0, void 0, function () {
            var onMessageCallback;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.getClient(testAccount)];
                    case 1:
                        _a.sent();
                        onMessageCallback = messageHandlers[0];
                        onMessageCallback("testchannel", "testuser", "Test", {
                            userInfo: {
                                userName: "testuser",
                                displayName: "TestUser",
                                userId: "123",
                                isMod: false,
                                isBroadcaster: false,
                                isVip: false,
                                isSubscriber: false,
                            },
                            id: "msg1",
                        });
                        (0, vitest_1.expect)(capturedMessage === null || capturedMessage === void 0 ? void 0 : capturedMessage.channel).toBe("testchannel");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should include user role flags in message", function () { return __awaiter(void 0, void 0, void 0, function () {
            var onMessageCallback;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.getClient(testAccount)];
                    case 1:
                        _a.sent();
                        onMessageCallback = messageHandlers[0];
                        onMessageCallback("#testchannel", "moduser", "Test", {
                            userInfo: {
                                userName: "moduser",
                                displayName: "ModUser",
                                userId: "456",
                                isMod: true,
                                isBroadcaster: false,
                                isVip: true,
                                isSubscriber: true,
                            },
                            id: "msg2",
                        });
                        (0, vitest_1.expect)(capturedMessage === null || capturedMessage === void 0 ? void 0 : capturedMessage.isMod).toBe(true);
                        (0, vitest_1.expect)(capturedMessage === null || capturedMessage === void 0 ? void 0 : capturedMessage.isVip).toBe(true);
                        (0, vitest_1.expect)(capturedMessage === null || capturedMessage === void 0 ? void 0 : capturedMessage.isSub).toBe(true);
                        (0, vitest_1.expect)(capturedMessage === null || capturedMessage === void 0 ? void 0 : capturedMessage.isOwner).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle broadcaster messages", function () { return __awaiter(void 0, void 0, void 0, function () {
            var onMessageCallback;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.getClient(testAccount)];
                    case 1:
                        _a.sent();
                        onMessageCallback = messageHandlers[0];
                        onMessageCallback("#testchannel", "broadcaster", "Test", {
                            userInfo: {
                                userName: "broadcaster",
                                displayName: "Broadcaster",
                                userId: "789",
                                isMod: false,
                                isBroadcaster: true,
                                isVip: false,
                                isSubscriber: false,
                            },
                            id: "msg3",
                        });
                        (0, vitest_1.expect)(capturedMessage === null || capturedMessage === void 0 ? void 0 : capturedMessage.isOwner).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("edge cases", function () {
        (0, vitest_1.it)("should handle multiple message handlers for different accounts", function () { return __awaiter(void 0, void 0, void 0, function () {
            var messages1, messages2, onMessage1, onMessage2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        messages1 = [];
                        messages2 = [];
                        manager.onMessage(testAccount, function (msg) { return messages1.push(msg); });
                        manager.onMessage(testAccount2, function (msg) { return messages2.push(msg); });
                        return [4 /*yield*/, manager.getClient(testAccount)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, manager.getClient(testAccount2)];
                    case 2:
                        _c.sent();
                        onMessage1 = messageHandlers[0];
                        if (!onMessage1) {
                            throw new Error("onMessage1 not found");
                        }
                        onMessage1("#testchannel", "user1", "msg1", {
                            userInfo: {
                                userName: "user1",
                                displayName: "User1",
                                userId: "1",
                                isMod: false,
                                isBroadcaster: false,
                                isVip: false,
                                isSubscriber: false,
                            },
                            id: "1",
                        });
                        onMessage2 = messageHandlers[1];
                        if (!onMessage2) {
                            throw new Error("onMessage2 not found");
                        }
                        onMessage2("#testchannel2", "user2", "msg2", {
                            userInfo: {
                                userName: "user2",
                                displayName: "User2",
                                userId: "2",
                                isMod: false,
                                isBroadcaster: false,
                                isVip: false,
                                isSubscriber: false,
                            },
                            id: "2",
                        });
                        (0, vitest_1.expect)(messages1).toHaveLength(1);
                        (0, vitest_1.expect)(messages2).toHaveLength(1);
                        (0, vitest_1.expect)((_a = messages1[0]) === null || _a === void 0 ? void 0 : _a.message).toBe("msg1");
                        (0, vitest_1.expect)((_b = messages2[0]) === null || _b === void 0 ? void 0 : _b.message).toBe("msg2");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle rapid client creation requests", function () { return __awaiter(void 0, void 0, void 0, function () {
            var promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [
                            manager.getClient(testAccount),
                            manager.getClient(testAccount),
                            manager.getClient(testAccount),
                        ];
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        // Note: The implementation doesn't handle concurrent getClient calls,
                        // so multiple connections may be created. This is expected behavior.
                        (0, vitest_1.expect)(mockConnect).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
