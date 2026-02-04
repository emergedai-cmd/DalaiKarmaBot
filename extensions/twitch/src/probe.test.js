"use strict";
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
var probe_js_1 = require("./probe.js");
// Mock Twurple modules - Vitest v4 compatible mocking
var mockUnbind = vitest_1.vi.fn();
// Event handler storage
var connectHandler = null;
var disconnectHandler = null;
// Event listener mocks that store handlers and return unbind function
var mockOnConnect = vitest_1.vi.fn(function (handler) {
    connectHandler = handler;
    return { unbind: mockUnbind };
});
var mockOnDisconnect = vitest_1.vi.fn(function (handler) {
    disconnectHandler = handler;
    return { unbind: mockUnbind };
});
var mockOnAuthenticationFailure = vitest_1.vi.fn(function (_handler) {
    return { unbind: mockUnbind };
});
// Connect mock that triggers the registered handler
var defaultConnectImpl = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!connectHandler) return [3 /*break*/, 2];
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1); })];
            case 1:
                _a.sent();
                connectHandler();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
var mockConnect = vitest_1.vi.fn().mockImplementation(defaultConnectImpl);
var mockQuit = vitest_1.vi.fn().mockResolvedValue(undefined);
vitest_1.vi.mock("@twurple/chat", function () { return ({
    ChatClient: /** @class */ (function () {
        function class_1() {
            this.connect = mockConnect;
            this.quit = mockQuit;
            this.onConnect = mockOnConnect;
            this.onDisconnect = mockOnDisconnect;
            this.onAuthenticationFailure = mockOnAuthenticationFailure;
        }
        return class_1;
    }()),
}); });
vitest_1.vi.mock("@twurple/auth", function () { return ({
    StaticAuthProvider: /** @class */ (function () {
        function StaticAuthProvider() {
        }
        return StaticAuthProvider;
    }()),
}); });
(0, vitest_1.describe)("probeTwitch", function () {
    var mockAccount = {
        username: "testbot",
        token: "oauth:test123456789",
        channel: "testchannel",
    };
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        // Reset handlers
        connectHandler = null;
        disconnectHandler = null;
    });
    (0, vitest_1.it)("returns error when username is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var account, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = __assign(__assign({}, mockAccount), { username: "" });
                    return [4 /*yield*/, (0, probe_js_1.probeTwitch)(account, 5000)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(false);
                    (0, vitest_1.expect)(result.error).toContain("missing credentials");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns error when token is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var account, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = __assign(__assign({}, mockAccount), { token: "" });
                    return [4 /*yield*/, (0, probe_js_1.probeTwitch)(account, 5000)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(false);
                    (0, vitest_1.expect)(result.error).toContain("missing credentials");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("attempts connection regardless of token prefix", function () { return __awaiter(void 0, void 0, void 0, function () {
        var account, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = __assign(__assign({}, mockAccount), { token: "raw_token_no_prefix" });
                    return [4 /*yield*/, (0, probe_js_1.probeTwitch)(account, 5000)];
                case 1:
                    result = _a.sent();
                    // With mock, connection succeeds even without oauth: prefix
                    (0, vitest_1.expect)(result.ok).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("successfully connects with valid credentials", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, probe_js_1.probeTwitch)(mockAccount, 5000)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(true);
                    (0, vitest_1.expect)(result.connected).toBe(true);
                    (0, vitest_1.expect)(result.username).toBe("testbot");
                    (0, vitest_1.expect)(result.channel).toBe("testchannel"); // uses account's configured channel
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses custom channel when specified", function () { return __awaiter(void 0, void 0, void 0, function () {
        var account, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = __assign(__assign({}, mockAccount), { channel: "customchannel" });
                    return [4 /*yield*/, (0, probe_js_1.probeTwitch)(account, 5000)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(true);
                    (0, vitest_1.expect)(result.channel).toBe("customchannel");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("times out when connection takes too long", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnect.mockImplementationOnce(function () { return new Promise(function () { }); }); // Never resolves
                    return [4 /*yield*/, (0, probe_js_1.probeTwitch)(mockAccount, 100)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(false);
                    (0, vitest_1.expect)(result.error).toContain("timeout");
                    // Reset mock
                    mockConnect.mockImplementation(defaultConnectImpl);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("cleans up client even on failure", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnect.mockImplementationOnce(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!disconnectHandler) return [3 /*break*/, 2];
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1); })];
                                case 1:
                                    _a.sent();
                                    disconnectHandler(false, new Error("Connection failed"));
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, probe_js_1.probeTwitch)(mockAccount, 5000)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(false);
                    (0, vitest_1.expect)(result.error).toContain("Connection failed");
                    (0, vitest_1.expect)(mockQuit).toHaveBeenCalled();
                    // Reset mocks
                    mockConnect.mockImplementation(defaultConnectImpl);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles connection errors gracefully", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnect.mockImplementationOnce(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!disconnectHandler) return [3 /*break*/, 2];
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1); })];
                                case 1:
                                    _a.sent();
                                    disconnectHandler(false, new Error("Network error"));
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, probe_js_1.probeTwitch)(mockAccount, 5000)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(false);
                    (0, vitest_1.expect)(result.error).toContain("Network error");
                    // Reset mock
                    mockConnect.mockImplementation(defaultConnectImpl);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("trims token before validation", function () { return __awaiter(void 0, void 0, void 0, function () {
        var account, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = __assign(__assign({}, mockAccount), { token: "  oauth:test123456789  " });
                    return [4 /*yield*/, (0, probe_js_1.probeTwitch)(account, 5000)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles non-Error objects in catch block", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnect.mockImplementationOnce(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!disconnectHandler) return [3 /*break*/, 2];
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1); })];
                                case 1:
                                    _a.sent();
                                    disconnectHandler(false, "String error");
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, probe_js_1.probeTwitch)(mockAccount, 5000)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(false);
                    (0, vitest_1.expect)(result.error).toBe("String error");
                    // Reset mock
                    mockConnect.mockImplementation(defaultConnectImpl);
                    return [2 /*return*/];
            }
        });
    }); });
});
