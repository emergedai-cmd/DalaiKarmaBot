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
var helpers = require("./pi-embedded-helpers.js");
var sanitizeSessionHistory;
// Mock dependencies
vitest_1.vi.mock("./pi-embedded-helpers.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("./pi-embedded-helpers.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { isGoogleModelApi: vitest_1.vi.fn(), sanitizeSessionMessagesImages: vitest_1.vi.fn().mockImplementation(function (msgs) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, msgs];
                        }); }); }) })];
        }
    });
}); });
// We don't mock session-transcript-repair.js as it is a pure function and complicates mocking.
// We rely on the real implementation which should pass through our simple messages.
(0, vitest_1.describe)("sanitizeSessionHistory", function () {
    var mockSessionManager = {
        getEntries: vitest_1.vi.fn().mockReturnValue([]),
        appendCustomEntry: vitest_1.vi.fn(),
    };
    var mockMessages = [{ role: "user", content: "hello" }];
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.resetAllMocks();
                    vitest_1.vi.mocked(helpers.sanitizeSessionMessagesImages).mockImplementation(function (msgs) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, msgs];
                    }); }); });
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./pi-embedded-runner/google.js"); })];
                case 1:
                    (sanitizeSessionHistory = (_a.sent()).sanitizeSessionHistory);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sanitizes tool call ids for Google model APIs", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.mocked(helpers.isGoogleModelApi).mockReturnValue(true);
                    return [4 /*yield*/, sanitizeSessionHistory({
                            messages: mockMessages,
                            modelApi: "google-generative-ai",
                            provider: "google-vertex",
                            sessionManager: mockSessionManager,
                            sessionId: "test-session",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(helpers.sanitizeSessionMessagesImages).toHaveBeenCalledWith(mockMessages, "session:history", vitest_1.expect.objectContaining({ sanitizeMode: "full", sanitizeToolCallIds: true }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sanitizes tool call ids with strict9 for Mistral models", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.mocked(helpers.isGoogleModelApi).mockReturnValue(false);
                    return [4 /*yield*/, sanitizeSessionHistory({
                            messages: mockMessages,
                            modelApi: "openai-responses",
                            provider: "openrouter",
                            modelId: "mistralai/devstral-2512:free",
                            sessionManager: mockSessionManager,
                            sessionId: "test-session",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(helpers.sanitizeSessionMessagesImages).toHaveBeenCalledWith(mockMessages, "session:history", vitest_1.expect.objectContaining({
                        sanitizeMode: "full",
                        sanitizeToolCallIds: true,
                        toolCallIdMode: "strict9",
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not sanitize tool call ids for non-Google APIs", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.mocked(helpers.isGoogleModelApi).mockReturnValue(false);
                    return [4 /*yield*/, sanitizeSessionHistory({
                            messages: mockMessages,
                            modelApi: "anthropic-messages",
                            provider: "anthropic",
                            sessionManager: mockSessionManager,
                            sessionId: "test-session",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(helpers.sanitizeSessionMessagesImages).toHaveBeenCalledWith(mockMessages, "session:history", vitest_1.expect.objectContaining({ sanitizeMode: "full", sanitizeToolCallIds: false }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not sanitize tool call ids for openai-responses", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.mocked(helpers.isGoogleModelApi).mockReturnValue(false);
                    return [4 /*yield*/, sanitizeSessionHistory({
                            messages: mockMessages,
                            modelApi: "openai-responses",
                            provider: "openai",
                            sessionManager: mockSessionManager,
                            sessionId: "test-session",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(helpers.sanitizeSessionMessagesImages).toHaveBeenCalledWith(mockMessages, "session:history", vitest_1.expect.objectContaining({ sanitizeMode: "images-only", sanitizeToolCallIds: false }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps reasoning-only assistant messages for openai-responses", function () { return __awaiter(void 0, void 0, void 0, function () {
        var messages, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.mocked(helpers.isGoogleModelApi).mockReturnValue(false);
                    messages = [
                        { role: "user", content: "hello" },
                        {
                            role: "assistant",
                            stopReason: "aborted",
                            content: [
                                {
                                    type: "thinking",
                                    thinking: "reasoning",
                                    thinkingSignature: "sig",
                                },
                            ],
                        },
                    ];
                    return [4 /*yield*/, sanitizeSessionHistory({
                            messages: messages,
                            modelApi: "openai-responses",
                            provider: "openai",
                            sessionManager: mockSessionManager,
                            sessionId: "test-session",
                        })];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result).toHaveLength(2);
                    (0, vitest_1.expect)((_a = result[1]) === null || _a === void 0 ? void 0 : _a.role).toBe("assistant");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not synthesize tool results for openai-responses", function () { return __awaiter(void 0, void 0, void 0, function () {
        var messages, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    messages = [
                        {
                            role: "assistant",
                            content: [{ type: "toolCall", id: "call_1", name: "read", arguments: {} }],
                        },
                    ];
                    return [4 /*yield*/, sanitizeSessionHistory({
                            messages: messages,
                            modelApi: "openai-responses",
                            provider: "openai",
                            sessionManager: mockSessionManager,
                            sessionId: "test-session",
                        })];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result).toHaveLength(1);
                    (0, vitest_1.expect)((_a = result[0]) === null || _a === void 0 ? void 0 : _a.role).toBe("assistant");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not downgrade openai reasoning when the model has not changed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionEntries, sessionManager, messages, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionEntries = [
                        {
                            type: "custom",
                            customType: "model-snapshot",
                            data: {
                                timestamp: Date.now(),
                                provider: "openai",
                                modelApi: "openai-responses",
                                modelId: "gpt-5.2-codex",
                            },
                        },
                    ];
                    sessionManager = {
                        getEntries: vitest_1.vi.fn(function () { return sessionEntries; }),
                        appendCustomEntry: vitest_1.vi.fn(function (customType, data) {
                            sessionEntries.push({ type: "custom", customType: customType, data: data });
                        }),
                    };
                    messages = [
                        {
                            role: "assistant",
                            content: [
                                {
                                    type: "thinking",
                                    thinking: "reasoning",
                                    thinkingSignature: JSON.stringify({ id: "rs_test", type: "reasoning" }),
                                },
                            ],
                        },
                    ];
                    return [4 /*yield*/, sanitizeSessionHistory({
                            messages: messages,
                            modelApi: "openai-responses",
                            provider: "openai",
                            modelId: "gpt-5.2-codex",
                            sessionManager: sessionManager,
                            sessionId: "test-session",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toEqual(messages);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("downgrades openai reasoning only when the model changes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionEntries, sessionManager, messages, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionEntries = [
                        {
                            type: "custom",
                            customType: "model-snapshot",
                            data: {
                                timestamp: Date.now(),
                                provider: "anthropic",
                                modelApi: "anthropic-messages",
                                modelId: "claude-3-7",
                            },
                        },
                    ];
                    sessionManager = {
                        getEntries: vitest_1.vi.fn(function () { return sessionEntries; }),
                        appendCustomEntry: vitest_1.vi.fn(function (customType, data) {
                            sessionEntries.push({ type: "custom", customType: customType, data: data });
                        }),
                    };
                    messages = [
                        {
                            role: "assistant",
                            content: [
                                {
                                    type: "thinking",
                                    thinking: "reasoning",
                                    thinkingSignature: { id: "rs_test", type: "reasoning" },
                                },
                            ],
                        },
                    ];
                    return [4 /*yield*/, sanitizeSessionHistory({
                            messages: messages,
                            modelApi: "openai-responses",
                            provider: "openai",
                            modelId: "gpt-5.2-codex",
                            sessionManager: sessionManager,
                            sessionId: "test-session",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
