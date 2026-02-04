"use strict";
/**
 * Tests for onboarding.ts helpers
 *
 * Tests cover:
 * - promptToken helper
 * - promptUsername helper
 * - promptClientId helper
 * - promptChannelName helper
 * - promptRefreshTokenSetup helper
 * - configureWithEnvToken helper
 * - setTwitchAccount config updates
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
// Mock the helpers we're testing
var mockPromptText = vitest_1.vi.fn();
var mockPromptConfirm = vitest_1.vi.fn();
var mockPrompter = {
    text: mockPromptText,
    confirm: mockPromptConfirm,
};
var mockAccount = {
    username: "testbot",
    accessToken: "oauth:test123",
    clientId: "test-client-id",
    channel: "#testchannel",
};
(0, vitest_1.describe)("onboarding helpers", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.afterEach)(function () {
        // Don't restoreAllMocks as it breaks module-level mocks
    });
    (0, vitest_1.describe)("promptToken", function () {
        (0, vitest_1.it)("should return existing token when user confirms to keep it", function () { return __awaiter(void 0, void 0, void 0, function () {
            var promptToken, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboarding.js"); })];
                    case 1:
                        promptToken = (_a.sent()).promptToken;
                        mockPromptConfirm.mockResolvedValue(true);
                        return [4 /*yield*/, promptToken(mockPrompter, mockAccount, undefined)];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe("oauth:test123");
                        (0, vitest_1.expect)(mockPromptConfirm).toHaveBeenCalledWith({
                            message: "Access token already configured. Keep it?",
                            initialValue: true,
                        });
                        (0, vitest_1.expect)(mockPromptText).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should prompt for new token when user doesn't keep existing", function () { return __awaiter(void 0, void 0, void 0, function () {
            var promptToken, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboarding.js"); })];
                    case 1:
                        promptToken = (_a.sent()).promptToken;
                        mockPromptConfirm.mockResolvedValue(false);
                        mockPromptText.mockResolvedValue("oauth:newtoken123");
                        return [4 /*yield*/, promptToken(mockPrompter, mockAccount, undefined)];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe("oauth:newtoken123");
                        (0, vitest_1.expect)(mockPromptText).toHaveBeenCalledWith({
                            message: "Twitch OAuth token (oauth:...)",
                            initialValue: "",
                            validate: vitest_1.expect.any(Function),
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should use env token as initial value when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            var promptToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboarding.js"); })];
                    case 1:
                        promptToken = (_a.sent()).promptToken;
                        mockPromptConfirm.mockResolvedValue(false);
                        mockPromptText.mockResolvedValue("oauth:fromenv");
                        return [4 /*yield*/, promptToken(mockPrompter, null, "oauth:fromenv")];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockPromptText).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            initialValue: "oauth:fromenv",
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should validate token format", function () { return __awaiter(void 0, void 0, void 0, function () {
            var promptToken, promptTextCallCount, capturedValidate, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboarding.js"); })];
                    case 1:
                        promptToken = (_a.sent()).promptToken;
                        // Set up mocks - user doesn't want to keep existing token
                        mockPromptConfirm.mockResolvedValueOnce(false);
                        promptTextCallCount = 0;
                        mockPromptText.mockImplementationOnce(function (_args) {
                            promptTextCallCount++;
                            // Capture the validate function from the first argument
                            if (_args === null || _args === void 0 ? void 0 : _args.validate) {
                                capturedValidate = _args.validate;
                            }
                            return Promise.resolve("oauth:test123");
                        });
                        return [4 /*yield*/, promptToken(mockPrompter, mockAccount, undefined)];
                    case 2:
                        result = _a.sent();
                        // Verify promptText was called
                        (0, vitest_1.expect)(promptTextCallCount).toBe(1);
                        (0, vitest_1.expect)(result).toBe("oauth:test123");
                        // Test the validate function
                        (0, vitest_1.expect)(capturedValidate).toBeDefined();
                        (0, vitest_1.expect)(capturedValidate("")).toBe("Required");
                        (0, vitest_1.expect)(capturedValidate("notoauth")).toBe("Token should start with 'oauth:'");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should return early when no existing token and no env token", function () { return __awaiter(void 0, void 0, void 0, function () {
            var promptToken, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboarding.js"); })];
                    case 1:
                        promptToken = (_a.sent()).promptToken;
                        mockPromptText.mockResolvedValue("oauth:newtoken");
                        return [4 /*yield*/, promptToken(mockPrompter, null, undefined)];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe("oauth:newtoken");
                        (0, vitest_1.expect)(mockPromptConfirm).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("promptUsername", function () {
        (0, vitest_1.it)("should prompt for username with validation", function () { return __awaiter(void 0, void 0, void 0, function () {
            var promptUsername, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboarding.js"); })];
                    case 1:
                        promptUsername = (_a.sent()).promptUsername;
                        mockPromptText.mockResolvedValue("mybot");
                        return [4 /*yield*/, promptUsername(mockPrompter, null)];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe("mybot");
                        (0, vitest_1.expect)(mockPromptText).toHaveBeenCalledWith({
                            message: "Twitch bot username",
                            initialValue: "",
                            validate: vitest_1.expect.any(Function),
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should use existing username as initial value", function () { return __awaiter(void 0, void 0, void 0, function () {
            var promptUsername;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboarding.js"); })];
                    case 1:
                        promptUsername = (_a.sent()).promptUsername;
                        mockPromptText.mockResolvedValue("testbot");
                        return [4 /*yield*/, promptUsername(mockPrompter, mockAccount)];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockPromptText).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            initialValue: "testbot",
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("promptClientId", function () {
        (0, vitest_1.it)("should prompt for client ID with validation", function () { return __awaiter(void 0, void 0, void 0, function () {
            var promptClientId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboarding.js"); })];
                    case 1:
                        promptClientId = (_a.sent()).promptClientId;
                        mockPromptText.mockResolvedValue("abc123xyz");
                        return [4 /*yield*/, promptClientId(mockPrompter, null)];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe("abc123xyz");
                        (0, vitest_1.expect)(mockPromptText).toHaveBeenCalledWith({
                            message: "Twitch Client ID",
                            initialValue: "",
                            validate: vitest_1.expect.any(Function),
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("promptChannelName", function () {
        (0, vitest_1.it)("should return channel name when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            var promptChannelName, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboarding.js"); })];
                    case 1:
                        promptChannelName = (_a.sent()).promptChannelName;
                        mockPromptText.mockResolvedValue("#mychannel");
                        return [4 /*yield*/, promptChannelName(mockPrompter, null)];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe("#mychannel");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should require a non-empty channel name", function () { return __awaiter(void 0, void 0, void 0, function () {
            var promptChannelName, validate;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboarding.js"); })];
                    case 1:
                        promptChannelName = (_c.sent()).promptChannelName;
                        mockPromptText.mockResolvedValue("");
                        return [4 /*yield*/, promptChannelName(mockPrompter, null)];
                    case 2:
                        _c.sent();
                        validate = ((_b = (_a = mockPromptText.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : {}).validate;
                        (0, vitest_1.expect)(validate === null || validate === void 0 ? void 0 : validate("")).toBe("Required");
                        (0, vitest_1.expect)(validate === null || validate === void 0 ? void 0 : validate("   ")).toBe("Required");
                        (0, vitest_1.expect)(validate === null || validate === void 0 ? void 0 : validate("#chan")).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("promptRefreshTokenSetup", function () {
        (0, vitest_1.it)("should return empty object when user declines", function () { return __awaiter(void 0, void 0, void 0, function () {
            var promptRefreshTokenSetup, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboarding.js"); })];
                    case 1:
                        promptRefreshTokenSetup = (_a.sent()).promptRefreshTokenSetup;
                        mockPromptConfirm.mockResolvedValue(false);
                        return [4 /*yield*/, promptRefreshTokenSetup(mockPrompter, mockAccount)];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual({});
                        (0, vitest_1.expect)(mockPromptConfirm).toHaveBeenCalledWith({
                            message: "Enable automatic token refresh (requires client secret and refresh token)?",
                            initialValue: false,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should prompt for credentials when user accepts", function () { return __awaiter(void 0, void 0, void 0, function () {
            var promptRefreshTokenSetup, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboarding.js"); })];
                    case 1:
                        promptRefreshTokenSetup = (_a.sent()).promptRefreshTokenSetup;
                        mockPromptConfirm
                            .mockResolvedValueOnce(true) // First call: useRefresh
                            .mockResolvedValueOnce("secret123") // clientSecret
                            .mockResolvedValueOnce("refresh123"); // refreshToken
                        mockPromptText.mockResolvedValueOnce("secret123").mockResolvedValueOnce("refresh123");
                        return [4 /*yield*/, promptRefreshTokenSetup(mockPrompter, null)];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual({
                            clientSecret: "secret123",
                            refreshToken: "refresh123",
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should use existing values as initial prompts", function () { return __awaiter(void 0, void 0, void 0, function () {
            var promptRefreshTokenSetup, accountWithRefresh;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboarding.js"); })];
                    case 1:
                        promptRefreshTokenSetup = (_a.sent()).promptRefreshTokenSetup;
                        accountWithRefresh = __assign(__assign({}, mockAccount), { clientSecret: "existing-secret", refreshToken: "existing-refresh" });
                        mockPromptConfirm.mockResolvedValue(true);
                        mockPromptText
                            .mockResolvedValueOnce("existing-secret")
                            .mockResolvedValueOnce("existing-refresh");
                        return [4 /*yield*/, promptRefreshTokenSetup(mockPrompter, accountWithRefresh)];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockPromptConfirm).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            initialValue: true, // Both clientSecret and refreshToken exist
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("configureWithEnvToken", function () {
        (0, vitest_1.it)("should return null when user declines env token", function () { return __awaiter(void 0, void 0, void 0, function () {
            var configureWithEnvToken, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboarding.js"); })];
                    case 1:
                        configureWithEnvToken = (_a.sent()).configureWithEnvToken;
                        // Reset and set up mock - user declines env token
                        mockPromptConfirm.mockReset().mockResolvedValue(false);
                        return [4 /*yield*/, configureWithEnvToken({}, mockPrompter, null, "oauth:fromenv", false, {})];
                    case 2:
                        result = _a.sent();
                        // Since user declined, should return null without prompting for username/clientId
                        (0, vitest_1.expect)(result).toBeNull();
                        (0, vitest_1.expect)(mockPromptText).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should prompt for username and clientId when using env token", function () { return __awaiter(void 0, void 0, void 0, function () {
            var configureWithEnvToken, result;
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboarding.js"); })];
                    case 1:
                        configureWithEnvToken = (_j.sent()).configureWithEnvToken;
                        // Reset and set up mocks - user accepts env token
                        mockPromptConfirm.mockReset().mockResolvedValue(true);
                        // Set up mocks for username and clientId prompts
                        mockPromptText
                            .mockReset()
                            .mockResolvedValueOnce("testbot")
                            .mockResolvedValueOnce("test-client-id");
                        return [4 /*yield*/, configureWithEnvToken({}, mockPrompter, null, "oauth:fromenv", false, {})];
                    case 2:
                        result = _j.sent();
                        // Should return config with username and clientId
                        (0, vitest_1.expect)(result).not.toBeNull();
                        (0, vitest_1.expect)((_d = (_c = (_b = (_a = result === null || result === void 0 ? void 0 : result.cfg.channels) === null || _a === void 0 ? void 0 : _a.twitch) === null || _b === void 0 ? void 0 : _b.accounts) === null || _c === void 0 ? void 0 : _c.default) === null || _d === void 0 ? void 0 : _d.username).toBe("testbot");
                        (0, vitest_1.expect)((_h = (_g = (_f = (_e = result === null || result === void 0 ? void 0 : result.cfg.channels) === null || _e === void 0 ? void 0 : _e.twitch) === null || _f === void 0 ? void 0 : _f.accounts) === null || _g === void 0 ? void 0 : _g.default) === null || _h === void 0 ? void 0 : _h.clientId).toBe("test-client-id");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
