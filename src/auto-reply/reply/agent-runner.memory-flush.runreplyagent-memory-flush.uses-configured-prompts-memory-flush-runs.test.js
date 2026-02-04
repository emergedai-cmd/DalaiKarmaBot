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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var memory_flush_js_1 = require("./memory-flush.js");
var test_helpers_js_1 = require("./test-helpers.js");
var runEmbeddedPiAgentMock = vitest_1.vi.fn();
var runCliAgentMock = vitest_1.vi.fn();
vitest_1.vi.mock("../../agents/model-fallback.js", function () { return ({
    runWithModelFallback: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var _c;
        var provider = _b.provider, model = _b.model, run = _b.run;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _c = {};
                    return [4 /*yield*/, run(provider, model)];
                case 1: return [2 /*return*/, (_c.result = _d.sent(),
                        _c.provider = provider,
                        _c.model = model,
                        _c)];
            }
        });
    }); },
}); });
vitest_1.vi.mock("../../agents/cli-runner.js", function () { return ({
    runCliAgent: function (params) { return runCliAgentMock(params); },
}); });
vitest_1.vi.mock("../../agents/pi-embedded.js", function () { return ({
    queueEmbeddedPiMessage: vitest_1.vi.fn().mockReturnValue(false),
    runEmbeddedPiAgent: function (params) { return runEmbeddedPiAgentMock(params); },
}); });
vitest_1.vi.mock("./queue.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("./queue.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { enqueueFollowupRun: vitest_1.vi.fn(), scheduleFollowupDrain: vitest_1.vi.fn() })];
        }
    });
}); });
var agent_runner_js_1 = require("./agent-runner.js");
function seedSessionStore(params) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(params.storePath), { recursive: true })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(params.storePath, JSON.stringify((_a = {}, _a[params.sessionKey] = params.entry, _a), null, 2), "utf-8")];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createBaseRun(params) {
    var _a, _b;
    var typing = (0, test_helpers_js_1.createMockTypingController)();
    var sessionCtx = {
        Provider: "whatsapp",
        OriginatingTo: "+15550001111",
        AccountId: "primary",
        MessageSid: "msg",
    };
    var resolvedQueue = { mode: "interrupt" };
    var followupRun = {
        prompt: "hello",
        summaryLine: "hello",
        enqueuedAt: Date.now(),
        run: {
            agentId: "main",
            agentDir: "/tmp/agent",
            sessionId: "session",
            sessionKey: "main",
            messageProvider: "whatsapp",
            sessionFile: "/tmp/session.jsonl",
            workspaceDir: "/tmp",
            config: (_a = params.config) !== null && _a !== void 0 ? _a : {},
            skillsSnapshot: {},
            provider: "anthropic",
            model: "claude",
            thinkLevel: "low",
            verboseLevel: "off",
            elevatedLevel: "off",
            bashElevated: {
                enabled: false,
                allowed: false,
                defaultLevel: "off",
            },
            timeoutMs: 1000,
            blockReplyBreak: "message_end",
        },
    };
    var run = __assign(__assign(__assign({}, followupRun.run), params.runOverrides), { config: (_b = params.config) !== null && _b !== void 0 ? _b : followupRun.run.config });
    return {
        typing: typing,
        sessionCtx: sessionCtx,
        resolvedQueue: resolvedQueue,
        followupRun: __assign(__assign({}, followupRun), { run: run }),
    };
}
(0, vitest_1.describe)("runReplyAgent memory flush", function () {
    (0, vitest_1.it)("uses configured prompts for memory flush runs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmp, storePath, sessionKey, sessionEntry, calls, _a, typing, sessionCtx, resolvedQueue, followupRun, flushCall;
        var _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    runEmbeddedPiAgentMock.mockReset();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-flush-"))];
                case 1:
                    tmp = _d.sent();
                    storePath = node_path_1.default.join(tmp, "sessions.json");
                    sessionKey = "main";
                    sessionEntry = {
                        sessionId: "session",
                        updatedAt: Date.now(),
                        totalTokens: 80000,
                        compactionCount: 1,
                    };
                    return [4 /*yield*/, seedSessionStore({ storePath: storePath, sessionKey: sessionKey, entry: sessionEntry })];
                case 2:
                    _d.sent();
                    calls = [];
                    runEmbeddedPiAgentMock.mockImplementation(function (params) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            calls.push(params);
                            if (params.prompt === memory_flush_js_1.DEFAULT_MEMORY_FLUSH_PROMPT) {
                                return [2 /*return*/, { payloads: [], meta: {} }];
                            }
                            return [2 /*return*/, {
                                    payloads: [{ text: "ok" }],
                                    meta: { agentMeta: { usage: { input: 1, output: 1 } } },
                                }];
                        });
                    }); });
                    _a = createBaseRun({
                        storePath: storePath,
                        sessionEntry: sessionEntry,
                        config: {
                            agents: {
                                defaults: {
                                    compaction: {
                                        memoryFlush: {
                                            prompt: "Write notes.",
                                            systemPrompt: "Flush memory now.",
                                        },
                                    },
                                },
                            },
                        },
                        runOverrides: { extraSystemPrompt: "extra system" },
                    }), typing = _a.typing, sessionCtx = _a.sessionCtx, resolvedQueue = _a.resolvedQueue, followupRun = _a.followupRun;
                    return [4 /*yield*/, (0, agent_runner_js_1.runReplyAgent)({
                            commandBody: "hello",
                            followupRun: followupRun,
                            queueKey: "main",
                            resolvedQueue: resolvedQueue,
                            shouldSteer: false,
                            shouldFollowup: false,
                            isActive: false,
                            isStreaming: false,
                            typing: typing,
                            sessionCtx: sessionCtx,
                            sessionEntry: sessionEntry,
                            sessionStore: (_b = {}, _b[sessionKey] = sessionEntry, _b),
                            sessionKey: sessionKey,
                            storePath: storePath,
                            defaultModel: "anthropic/claude-opus-4-5",
                            agentCfgContextTokens: 100000,
                            resolvedVerboseLevel: "off",
                            isNewSession: false,
                            blockStreamingEnabled: false,
                            resolvedBlockStreamingBreak: "message_end",
                            shouldInjectGroupIntro: false,
                            typingMode: "instant",
                        })];
                case 3:
                    _d.sent();
                    flushCall = calls[0];
                    (0, vitest_1.expect)(flushCall === null || flushCall === void 0 ? void 0 : flushCall.prompt).toContain("Write notes.");
                    (0, vitest_1.expect)(flushCall === null || flushCall === void 0 ? void 0 : flushCall.prompt).toContain("NO_REPLY");
                    (0, vitest_1.expect)(flushCall === null || flushCall === void 0 ? void 0 : flushCall.extraSystemPrompt).toContain("extra system");
                    (0, vitest_1.expect)(flushCall === null || flushCall === void 0 ? void 0 : flushCall.extraSystemPrompt).toContain("Flush memory now.");
                    (0, vitest_1.expect)(flushCall === null || flushCall === void 0 ? void 0 : flushCall.extraSystemPrompt).toContain("NO_REPLY");
                    (0, vitest_1.expect)((_c = calls[1]) === null || _c === void 0 ? void 0 : _c.prompt).toBe("hello");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips memory flush after a prior flush in the same compaction cycle", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmp, storePath, sessionKey, sessionEntry, calls, _a, typing, sessionCtx, resolvedQueue, followupRun;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    runEmbeddedPiAgentMock.mockReset();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-flush-"))];
                case 1:
                    tmp = _c.sent();
                    storePath = node_path_1.default.join(tmp, "sessions.json");
                    sessionKey = "main";
                    sessionEntry = {
                        sessionId: "session",
                        updatedAt: Date.now(),
                        totalTokens: 80000,
                        compactionCount: 2,
                        memoryFlushCompactionCount: 2,
                    };
                    return [4 /*yield*/, seedSessionStore({ storePath: storePath, sessionKey: sessionKey, entry: sessionEntry })];
                case 2:
                    _c.sent();
                    calls = [];
                    runEmbeddedPiAgentMock.mockImplementation(function (params) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            calls.push({ prompt: params.prompt });
                            return [2 /*return*/, {
                                    payloads: [{ text: "ok" }],
                                    meta: { agentMeta: { usage: { input: 1, output: 1 } } },
                                }];
                        });
                    }); });
                    _a = createBaseRun({
                        storePath: storePath,
                        sessionEntry: sessionEntry,
                    }), typing = _a.typing, sessionCtx = _a.sessionCtx, resolvedQueue = _a.resolvedQueue, followupRun = _a.followupRun;
                    return [4 /*yield*/, (0, agent_runner_js_1.runReplyAgent)({
                            commandBody: "hello",
                            followupRun: followupRun,
                            queueKey: "main",
                            resolvedQueue: resolvedQueue,
                            shouldSteer: false,
                            shouldFollowup: false,
                            isActive: false,
                            isStreaming: false,
                            typing: typing,
                            sessionCtx: sessionCtx,
                            sessionEntry: sessionEntry,
                            sessionStore: (_b = {}, _b[sessionKey] = sessionEntry, _b),
                            sessionKey: sessionKey,
                            storePath: storePath,
                            defaultModel: "anthropic/claude-opus-4-5",
                            agentCfgContextTokens: 100000,
                            resolvedVerboseLevel: "off",
                            isNewSession: false,
                            blockStreamingEnabled: false,
                            resolvedBlockStreamingBreak: "message_end",
                            shouldInjectGroupIntro: false,
                            typingMode: "instant",
                        })];
                case 3:
                    _c.sent();
                    (0, vitest_1.expect)(calls.map(function (call) { return call.prompt; })).toEqual(["hello"]);
                    return [2 /*return*/];
            }
        });
    }); });
});
