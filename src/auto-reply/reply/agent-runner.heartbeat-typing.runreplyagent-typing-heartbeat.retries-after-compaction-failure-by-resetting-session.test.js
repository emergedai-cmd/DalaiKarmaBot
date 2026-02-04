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
var sessions = require("../../config/sessions.js");
var test_helpers_js_1 = require("./test-helpers.js");
var runEmbeddedPiAgentMock = vitest_1.vi.fn();
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
function createMinimalRun(params) {
    var _a, _b;
    var typing = (0, test_helpers_js_1.createMockTypingController)();
    var opts = params === null || params === void 0 ? void 0 : params.opts;
    var sessionCtx = {
        Provider: "whatsapp",
        MessageSid: "msg",
    };
    var resolvedQueue = { mode: "interrupt" };
    var sessionKey = (_a = params === null || params === void 0 ? void 0 : params.sessionKey) !== null && _a !== void 0 ? _a : "main";
    var followupRun = {
        prompt: "hello",
        summaryLine: "hello",
        enqueuedAt: Date.now(),
        run: {
            sessionId: "session",
            sessionKey: sessionKey,
            messageProvider: "whatsapp",
            sessionFile: "/tmp/session.jsonl",
            workspaceDir: "/tmp",
            config: {},
            skillsSnapshot: {},
            provider: "anthropic",
            model: "claude",
            thinkLevel: "low",
            verboseLevel: (_b = params === null || params === void 0 ? void 0 : params.resolvedVerboseLevel) !== null && _b !== void 0 ? _b : "off",
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
    return {
        typing: typing,
        opts: opts,
        run: function () {
            var _a, _b, _c;
            return (0, agent_runner_js_1.runReplyAgent)({
                commandBody: "hello",
                followupRun: followupRun,
                queueKey: "main",
                resolvedQueue: resolvedQueue,
                shouldSteer: false,
                shouldFollowup: false,
                isActive: false,
                isStreaming: false,
                opts: opts,
                typing: typing,
                sessionEntry: params === null || params === void 0 ? void 0 : params.sessionEntry,
                sessionStore: params === null || params === void 0 ? void 0 : params.sessionStore,
                sessionKey: sessionKey,
                storePath: params === null || params === void 0 ? void 0 : params.storePath,
                sessionCtx: sessionCtx,
                defaultModel: "anthropic/claude-opus-4-5",
                resolvedVerboseLevel: (_a = params === null || params === void 0 ? void 0 : params.resolvedVerboseLevel) !== null && _a !== void 0 ? _a : "off",
                isNewSession: false,
                blockStreamingEnabled: (_b = params === null || params === void 0 ? void 0 : params.blockStreamingEnabled) !== null && _b !== void 0 ? _b : false,
                resolvedBlockStreamingBreak: "message_end",
                shouldInjectGroupIntro: false,
                typingMode: (_c = params === null || params === void 0 ? void 0 : params.typingMode) !== null && _c !== void 0 ? _c : "instant",
            });
        },
    };
}
(0, vitest_1.describe)("runReplyAgent typing (heartbeat)", function () {
    (0, vitest_1.beforeEach)(function () {
        runEmbeddedPiAgentMock.mockReset();
    });
    (0, vitest_1.it)("retries after compaction failure by resetting the session", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevStateDir, stateDir, sessionId, storePath, transcriptPath, sessionEntry, sessionStore, run, res, payload, persisted, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    prevStateDir = process.env.OPENCLAW_STATE_DIR;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join((0, node_os_1.tmpdir)(), "openclaw-session-compaction-reset-"))];
                case 1:
                    stateDir = _d.sent();
                    process.env.OPENCLAW_STATE_DIR = stateDir;
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, , 9, 10]);
                    sessionId = "session";
                    storePath = node_path_1.default.join(stateDir, "sessions", "sessions.json");
                    transcriptPath = sessions.resolveSessionTranscriptPath(sessionId);
                    sessionEntry = { sessionId: sessionId, updatedAt: Date.now(), sessionFile: transcriptPath };
                    sessionStore = { main: sessionEntry };
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(storePath), { recursive: true })];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify(sessionStore), "utf-8")];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(transcriptPath), { recursive: true })];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(transcriptPath, "ok", "utf-8")];
                case 6:
                    _d.sent();
                    runEmbeddedPiAgentMock.mockImplementationOnce(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error('Context overflow: Summarization failed: 400 {"message":"prompt is too long"}');
                        });
                    }); });
                    run = createMinimalRun({
                        sessionEntry: sessionEntry,
                        sessionStore: sessionStore,
                        sessionKey: "main",
                        storePath: storePath,
                    }).run;
                    return [4 /*yield*/, run()];
                case 7:
                    res = _d.sent();
                    (0, vitest_1.expect)(runEmbeddedPiAgentMock).toHaveBeenCalledTimes(1);
                    payload = Array.isArray(res) ? res[0] : res;
                    (0, vitest_1.expect)(payload).toMatchObject({
                        text: vitest_1.expect.stringContaining("Context limit exceeded during compaction"),
                    });
                    (0, vitest_1.expect)((_c = payload.text) === null || _c === void 0 ? void 0 : _c.toLowerCase()).toContain("reset");
                    (0, vitest_1.expect)(sessionStore.main.sessionId).not.toBe(sessionId);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(storePath, "utf-8")];
                case 8:
                    persisted = _b.apply(_a, [_d.sent()]);
                    (0, vitest_1.expect)(persisted.main.sessionId).toBe(sessionStore.main.sessionId);
                    return [3 /*break*/, 10];
                case 9:
                    if (prevStateDir) {
                        process.env.OPENCLAW_STATE_DIR = prevStateDir;
                    }
                    else {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("retries after context overflow payload by resetting the session", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevStateDir, stateDir, sessionId, storePath, transcriptPath, sessionEntry, sessionStore, run, res, payload, persisted, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    prevStateDir = process.env.OPENCLAW_STATE_DIR;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join((0, node_os_1.tmpdir)(), "openclaw-session-overflow-reset-"))];
                case 1:
                    stateDir = _d.sent();
                    process.env.OPENCLAW_STATE_DIR = stateDir;
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, , 9, 10]);
                    sessionId = "session";
                    storePath = node_path_1.default.join(stateDir, "sessions", "sessions.json");
                    transcriptPath = sessions.resolveSessionTranscriptPath(sessionId);
                    sessionEntry = { sessionId: sessionId, updatedAt: Date.now(), sessionFile: transcriptPath };
                    sessionStore = { main: sessionEntry };
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(storePath), { recursive: true })];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify(sessionStore), "utf-8")];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(transcriptPath), { recursive: true })];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(transcriptPath, "ok", "utf-8")];
                case 6:
                    _d.sent();
                    runEmbeddedPiAgentMock.mockImplementationOnce(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, ({
                                    payloads: [{ text: "Context overflow: prompt too large", isError: true }],
                                    meta: {
                                        durationMs: 1,
                                        error: {
                                            kind: "context_overflow",
                                            message: 'Context overflow: Summarization failed: 400 {"message":"prompt is too long"}',
                                        },
                                    },
                                })];
                        });
                    }); });
                    run = createMinimalRun({
                        sessionEntry: sessionEntry,
                        sessionStore: sessionStore,
                        sessionKey: "main",
                        storePath: storePath,
                    }).run;
                    return [4 /*yield*/, run()];
                case 7:
                    res = _d.sent();
                    (0, vitest_1.expect)(runEmbeddedPiAgentMock).toHaveBeenCalledTimes(1);
                    payload = Array.isArray(res) ? res[0] : res;
                    (0, vitest_1.expect)(payload).toMatchObject({
                        text: vitest_1.expect.stringContaining("Context limit exceeded"),
                    });
                    (0, vitest_1.expect)((_c = payload.text) === null || _c === void 0 ? void 0 : _c.toLowerCase()).toContain("reset");
                    (0, vitest_1.expect)(sessionStore.main.sessionId).not.toBe(sessionId);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(storePath, "utf-8")];
                case 8:
                    persisted = _b.apply(_a, [_d.sent()]);
                    (0, vitest_1.expect)(persisted.main.sessionId).toBe(sessionStore.main.sessionId);
                    return [3 /*break*/, 10];
                case 9:
                    if (prevStateDir) {
                        process.env.OPENCLAW_STATE_DIR = prevStateDir;
                    }
                    else {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("resets the session after role ordering payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevStateDir, stateDir, sessionId, storePath, transcriptPath, sessionEntry, sessionStore, run, res, payload, persisted, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    prevStateDir = process.env.OPENCLAW_STATE_DIR;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join((0, node_os_1.tmpdir)(), "openclaw-session-role-ordering-"))];
                case 1:
                    stateDir = _d.sent();
                    process.env.OPENCLAW_STATE_DIR = stateDir;
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, , 10, 11]);
                    sessionId = "session";
                    storePath = node_path_1.default.join(stateDir, "sessions", "sessions.json");
                    transcriptPath = sessions.resolveSessionTranscriptPath(sessionId);
                    sessionEntry = { sessionId: sessionId, updatedAt: Date.now(), sessionFile: transcriptPath };
                    sessionStore = { main: sessionEntry };
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(storePath), { recursive: true })];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify(sessionStore), "utf-8")];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(transcriptPath), { recursive: true })];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(transcriptPath, "ok", "utf-8")];
                case 6:
                    _d.sent();
                    runEmbeddedPiAgentMock.mockImplementationOnce(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, ({
                                    payloads: [{ text: "Message ordering conflict - please try again.", isError: true }],
                                    meta: {
                                        durationMs: 1,
                                        error: {
                                            kind: "role_ordering",
                                            message: 'messages: roles must alternate between "user" and "assistant"',
                                        },
                                    },
                                })];
                        });
                    }); });
                    run = createMinimalRun({
                        sessionEntry: sessionEntry,
                        sessionStore: sessionStore,
                        sessionKey: "main",
                        storePath: storePath,
                    }).run;
                    return [4 /*yield*/, run()];
                case 7:
                    res = _d.sent();
                    payload = Array.isArray(res) ? res[0] : res;
                    (0, vitest_1.expect)(payload).toMatchObject({
                        text: vitest_1.expect.stringContaining("Message ordering conflict"),
                    });
                    (0, vitest_1.expect)((_c = payload.text) === null || _c === void 0 ? void 0 : _c.toLowerCase()).toContain("reset");
                    (0, vitest_1.expect)(sessionStore.main.sessionId).not.toBe(sessionId);
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.access(transcriptPath)).rejects.toBeDefined()];
                case 8:
                    _d.sent();
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(storePath, "utf-8")];
                case 9:
                    persisted = _b.apply(_a, [_d.sent()]);
                    (0, vitest_1.expect)(persisted.main.sessionId).toBe(sessionStore.main.sessionId);
                    return [3 /*break*/, 11];
                case 10:
                    if (prevStateDir) {
                        process.env.OPENCLAW_STATE_DIR = prevStateDir;
                    }
                    else {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); });
});
