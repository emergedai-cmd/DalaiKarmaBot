"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
vitest_1.vi.mock("./run/attempt.js", function () { return ({
    runEmbeddedAttempt: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./compact.js", function () { return ({
    compactEmbeddedPiSessionDirect: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./model.js", function () { return ({
    resolveModel: vitest_1.vi.fn(function () { return ({
        model: {
            id: "test-model",
            provider: "anthropic",
            contextWindow: 200000,
            api: "messages",
        },
        error: null,
        authStorage: {
            setRuntimeApiKey: vitest_1.vi.fn(),
        },
        modelRegistry: {},
    }); }),
}); });
vitest_1.vi.mock("../model-auth.js", function () { return ({
    ensureAuthProfileStore: vitest_1.vi.fn(function () { return ({}); }),
    getApiKeyForModel: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    apiKey: "test-key",
                    profileId: "test-profile",
                    source: "test",
                })];
        });
    }); }),
    resolveAuthProfileOrder: vitest_1.vi.fn(function () { return []; }),
}); });
vitest_1.vi.mock("../models-config.js", function () { return ({
    ensureOpenClawModelsJson: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
}); });
vitest_1.vi.mock("../context-window-guard.js", function () { return ({
    CONTEXT_WINDOW_HARD_MIN_TOKENS: 1000,
    CONTEXT_WINDOW_WARN_BELOW_TOKENS: 5000,
    evaluateContextWindowGuard: vitest_1.vi.fn(function () { return ({
        shouldWarn: false,
        shouldBlock: false,
        tokens: 200000,
        source: "model",
    }); }),
    resolveContextWindowInfo: vitest_1.vi.fn(function () { return ({
        tokens: 200000,
        source: "model",
    }); }),
}); });
vitest_1.vi.mock("../../process/command-queue.js", function () { return ({
    enqueueCommandInLane: vitest_1.vi.fn(function (_lane, task) { return task(); }),
}); });
vitest_1.vi.mock("../../utils.js", function () { return ({
    resolveUserPath: vitest_1.vi.fn(function (p) { return p; }),
}); });
vitest_1.vi.mock("../../utils/message-channel.js", function () { return ({
    isMarkdownCapableMessageChannel: vitest_1.vi.fn(function () { return true; }),
}); });
vitest_1.vi.mock("../agent-paths.js", function () { return ({
    resolveOpenClawAgentDir: vitest_1.vi.fn(function () { return "/tmp/agent-dir"; }),
}); });
vitest_1.vi.mock("../auth-profiles.js", function () { return ({
    markAuthProfileFailure: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    markAuthProfileGood: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    markAuthProfileUsed: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
}); });
vitest_1.vi.mock("../defaults.js", function () { return ({
    DEFAULT_CONTEXT_TOKENS: 200000,
    DEFAULT_MODEL: "test-model",
    DEFAULT_PROVIDER: "anthropic",
}); });
vitest_1.vi.mock("../failover-error.js", function () { return ({
    FailoverError: /** @class */ (function (_super) {
        __extends(FailoverError, _super);
        function FailoverError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return FailoverError;
    }(Error)),
    resolveFailoverStatus: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../usage.js", function () { return ({
    normalizeUsage: vitest_1.vi.fn(function () { return undefined; }),
}); });
vitest_1.vi.mock("./lanes.js", function () { return ({
    resolveSessionLane: vitest_1.vi.fn(function () { return "session-lane"; }),
    resolveGlobalLane: vitest_1.vi.fn(function () { return "global-lane"; }),
}); });
vitest_1.vi.mock("./logger.js", function () { return ({
    log: {
        debug: vitest_1.vi.fn(),
        info: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
    },
}); });
vitest_1.vi.mock("./run/payloads.js", function () { return ({
    buildEmbeddedRunPayloads: vitest_1.vi.fn(function () { return []; }),
}); });
vitest_1.vi.mock("./utils.js", function () { return ({
    describeUnknownError: vitest_1.vi.fn(function (err) {
        if (err instanceof Error) {
            return err.message;
        }
        return String(err);
    }),
}); });
vitest_1.vi.mock("../pi-embedded-helpers.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                isCompactionFailureError: function (msg) {
                    if (!msg) {
                        return false;
                    }
                    var lower = msg.toLowerCase();
                    return lower.includes("request_too_large") && lower.includes("summarization failed");
                },
                isContextOverflowError: function (msg) {
                    if (!msg) {
                        return false;
                    }
                    var lower = msg.toLowerCase();
                    return lower.includes("request_too_large") || lower.includes("request size exceeds");
                },
                isFailoverAssistantError: vitest_1.vi.fn(function () { return false; }),
                isFailoverErrorMessage: vitest_1.vi.fn(function () { return false; }),
                isAuthAssistantError: vitest_1.vi.fn(function () { return false; }),
                isRateLimitAssistantError: vitest_1.vi.fn(function () { return false; }),
                classifyFailoverReason: vitest_1.vi.fn(function () { return null; }),
                formatAssistantErrorText: vitest_1.vi.fn(function () { return ""; }),
                pickFallbackThinkingLevel: vitest_1.vi.fn(function () { return null; }),
                isTimeoutErrorMessage: vitest_1.vi.fn(function () { return false; }),
                parseImageDimensionError: vitest_1.vi.fn(function () { return null; }),
            }];
    });
}); });
var compact_js_1 = require("./compact.js");
var logger_js_1 = require("./logger.js");
var run_js_1 = require("./run.js");
var attempt_js_1 = require("./run/attempt.js");
var mockedRunEmbeddedAttempt = vitest_1.vi.mocked(attempt_js_1.runEmbeddedAttempt);
var mockedCompactDirect = vitest_1.vi.mocked(compact_js_1.compactEmbeddedPiSessionDirect);
function makeAttemptResult(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ aborted: false, timedOut: false, promptError: null, sessionIdUsed: "test-session", assistantTexts: ["Hello!"], toolMetas: [], lastAssistant: undefined, messagesSnapshot: [], didSendViaMessagingTool: false, messagingToolSentTexts: [], messagingToolSentTargets: [], cloudCodeAssistFormatError: false }, overrides);
}
var baseParams = {
    sessionId: "test-session",
    sessionKey: "test-key",
    sessionFile: "/tmp/session.json",
    workspaceDir: "/tmp/workspace",
    prompt: "hello",
    timeoutMs: 30000,
    runId: "run-1",
};
(0, vitest_1.describe)("overflow compaction in run loop", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("retries after successful compaction on context overflow promptError", function () { return __awaiter(void 0, void 0, void 0, function () {
        var overflowError, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    overflowError = new Error("request_too_large: Request size exceeds model context window");
                    mockedRunEmbeddedAttempt
                        .mockResolvedValueOnce(makeAttemptResult({ promptError: overflowError }))
                        .mockResolvedValueOnce(makeAttemptResult({ promptError: null }));
                    mockedCompactDirect.mockResolvedValueOnce({
                        ok: true,
                        compacted: true,
                        result: {
                            summary: "Compacted session",
                            firstKeptEntryId: "entry-5",
                            tokensBefore: 150000,
                        },
                    });
                    return [4 /*yield*/, (0, run_js_1.runEmbeddedPiAgent)(baseParams)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(mockedCompactDirect).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(mockedCompactDirect).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ authProfileId: "test-profile" }));
                    (0, vitest_1.expect)(mockedRunEmbeddedAttempt).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(logger_js_1.log.warn).toHaveBeenCalledWith(vitest_1.expect.stringContaining("context overflow detected; attempting auto-compaction"));
                    (0, vitest_1.expect)(logger_js_1.log.info).toHaveBeenCalledWith(vitest_1.expect.stringContaining("auto-compaction succeeded"));
                    // Should not be an error result
                    (0, vitest_1.expect)(result.meta.error).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns error if compaction fails", function () { return __awaiter(void 0, void 0, void 0, function () {
        var overflowError, result;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    overflowError = new Error("request_too_large: Request size exceeds model context window");
                    mockedRunEmbeddedAttempt.mockResolvedValue(makeAttemptResult({ promptError: overflowError }));
                    mockedCompactDirect.mockResolvedValueOnce({
                        ok: false,
                        compacted: false,
                        reason: "nothing to compact",
                    });
                    return [4 /*yield*/, (0, run_js_1.runEmbeddedPiAgent)(baseParams)];
                case 1:
                    result = _d.sent();
                    (0, vitest_1.expect)(mockedCompactDirect).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(mockedRunEmbeddedAttempt).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)((_a = result.meta.error) === null || _a === void 0 ? void 0 : _a.kind).toBe("context_overflow");
                    (0, vitest_1.expect)((_c = (_b = result.payloads) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.isError).toBe(true);
                    (0, vitest_1.expect)(logger_js_1.log.warn).toHaveBeenCalledWith(vitest_1.expect.stringContaining("auto-compaction failed"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns error if overflow happens again after compaction", function () { return __awaiter(void 0, void 0, void 0, function () {
        var overflowError, result;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    overflowError = new Error("request_too_large: Request size exceeds model context window");
                    mockedRunEmbeddedAttempt
                        .mockResolvedValueOnce(makeAttemptResult({ promptError: overflowError }))
                        .mockResolvedValueOnce(makeAttemptResult({ promptError: overflowError }));
                    mockedCompactDirect.mockResolvedValueOnce({
                        ok: true,
                        compacted: true,
                        result: {
                            summary: "Compacted",
                            firstKeptEntryId: "entry-3",
                            tokensBefore: 180000,
                        },
                    });
                    return [4 /*yield*/, (0, run_js_1.runEmbeddedPiAgent)(baseParams)];
                case 1:
                    result = _d.sent();
                    // Compaction attempted only once
                    (0, vitest_1.expect)(mockedCompactDirect).toHaveBeenCalledTimes(1);
                    // Two attempts: first overflow -> compact -> retry -> second overflow -> return error
                    (0, vitest_1.expect)(mockedRunEmbeddedAttempt).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)((_a = result.meta.error) === null || _a === void 0 ? void 0 : _a.kind).toBe("context_overflow");
                    (0, vitest_1.expect)((_c = (_b = result.payloads) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.isError).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not attempt compaction for compaction_failure errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var compactionFailureError, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    compactionFailureError = new Error("request_too_large: summarization failed - Request size exceeds model context window");
                    mockedRunEmbeddedAttempt.mockResolvedValue(makeAttemptResult({ promptError: compactionFailureError }));
                    return [4 /*yield*/, (0, run_js_1.runEmbeddedPiAgent)(baseParams)];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(mockedCompactDirect).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(mockedRunEmbeddedAttempt).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)((_a = result.meta.error) === null || _a === void 0 ? void 0 : _a.kind).toBe("compaction_failure");
                    return [2 /*return*/];
            }
        });
    }); });
});
