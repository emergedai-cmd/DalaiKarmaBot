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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var sessions_js_1 = require("../../config/sessions.js");
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
    runEmbeddedPiAgent: function (params) { return runEmbeddedPiAgentMock(params); },
}); });
var followup_runner_js_1 = require("./followup-runner.js");
var baseQueuedRun = function (messageProvider) {
    if (messageProvider === void 0) { messageProvider = "whatsapp"; }
    return ({
        prompt: "hello",
        summaryLine: "hello",
        enqueuedAt: Date.now(),
        originatingTo: "channel:C1",
        run: {
            sessionId: "session",
            sessionKey: "main",
            messageProvider: messageProvider,
            agentAccountId: "primary",
            sessionFile: "/tmp/session.jsonl",
            workspaceDir: "/tmp",
            config: {},
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
    });
};
(0, vitest_1.describe)("createFollowupRunner compaction", function () {
    (0, vitest_1.it)("adds verbose auto-compaction notice and tracks count", function () { return __awaiter(void 0, void 0, void 0, function () {
        var storePath, _a, _b, sessionEntry, sessionStore, onBlockReply, runner, queued;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = node_path_1.default).join;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join((0, node_os_1.tmpdir)(), "openclaw-compaction-"))];
                case 1:
                    storePath = _b.apply(_a, [_c.sent(), "sessions.json"]);
                    sessionEntry = {
                        sessionId: "session",
                        updatedAt: Date.now(),
                    };
                    sessionStore = {
                        main: sessionEntry,
                    };
                    onBlockReply = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    runEmbeddedPiAgentMock.mockImplementationOnce(function (params) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            (_a = params.onAgentEvent) === null || _a === void 0 ? void 0 : _a.call(params, {
                                stream: "compaction",
                                data: { phase: "end", willRetry: false },
                            });
                            return [2 /*return*/, { payloads: [{ text: "final" }], meta: {} }];
                        });
                    }); });
                    runner = (0, followup_runner_js_1.createFollowupRunner)({
                        opts: { onBlockReply: onBlockReply },
                        typing: (0, test_helpers_js_1.createMockTypingController)(),
                        typingMode: "instant",
                        sessionEntry: sessionEntry,
                        sessionStore: sessionStore,
                        sessionKey: "main",
                        storePath: storePath,
                        defaultModel: "anthropic/claude-opus-4-5",
                    });
                    queued = {
                        prompt: "hello",
                        summaryLine: "hello",
                        enqueuedAt: Date.now(),
                        run: {
                            sessionId: "session",
                            sessionKey: "main",
                            messageProvider: "whatsapp",
                            sessionFile: "/tmp/session.jsonl",
                            workspaceDir: "/tmp",
                            config: {},
                            skillsSnapshot: {},
                            provider: "anthropic",
                            model: "claude",
                            thinkLevel: "low",
                            verboseLevel: "on",
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
                    return [4 /*yield*/, runner(queued)];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(onBlockReply).toHaveBeenCalled();
                    (0, vitest_1.expect)(onBlockReply.mock.calls[0][0].text).toContain("Auto-compaction complete");
                    (0, vitest_1.expect)(sessionStore.main.compactionCount).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("createFollowupRunner messaging tool dedupe", function () {
    (0, vitest_1.it)("drops payloads already sent via messaging tool", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onBlockReply, runner;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onBlockReply = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    runEmbeddedPiAgentMock.mockResolvedValueOnce({
                        payloads: [{ text: "hello world!" }],
                        messagingToolSentTexts: ["hello world!"],
                        meta: {},
                    });
                    runner = (0, followup_runner_js_1.createFollowupRunner)({
                        opts: { onBlockReply: onBlockReply },
                        typing: (0, test_helpers_js_1.createMockTypingController)(),
                        typingMode: "instant",
                        defaultModel: "anthropic/claude-opus-4-5",
                    });
                    return [4 /*yield*/, runner(baseQueuedRun())];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(onBlockReply).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("delivers payloads when not duplicates", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onBlockReply, runner;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onBlockReply = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    runEmbeddedPiAgentMock.mockResolvedValueOnce({
                        payloads: [{ text: "hello world!" }],
                        messagingToolSentTexts: ["different message"],
                        meta: {},
                    });
                    runner = (0, followup_runner_js_1.createFollowupRunner)({
                        opts: { onBlockReply: onBlockReply },
                        typing: (0, test_helpers_js_1.createMockTypingController)(),
                        typingMode: "instant",
                        defaultModel: "anthropic/claude-opus-4-5",
                    });
                    return [4 /*yield*/, runner(baseQueuedRun())];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("suppresses replies when a messaging tool sent via the same provider + target", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onBlockReply, runner;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onBlockReply = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    runEmbeddedPiAgentMock.mockResolvedValueOnce({
                        payloads: [{ text: "hello world!" }],
                        messagingToolSentTexts: ["different message"],
                        messagingToolSentTargets: [{ tool: "slack", provider: "slack", to: "channel:C1" }],
                        meta: {},
                    });
                    runner = (0, followup_runner_js_1.createFollowupRunner)({
                        opts: { onBlockReply: onBlockReply },
                        typing: (0, test_helpers_js_1.createMockTypingController)(),
                        typingMode: "instant",
                        defaultModel: "anthropic/claude-opus-4-5",
                    });
                    return [4 /*yield*/, runner(baseQueuedRun("slack"))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(onBlockReply).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("persists usage even when replies are suppressed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var storePath, _a, _b, sessionKey, sessionEntry, sessionStore, onBlockReply, runner, store;
        var _c;
        var _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _b = (_a = node_path_1.default).join;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join((0, node_os_1.tmpdir)(), "openclaw-followup-usage-"))];
                case 1:
                    storePath = _b.apply(_a, [_g.sent(), "sessions.json"]);
                    sessionKey = "main";
                    sessionEntry = { sessionId: "session", updatedAt: Date.now() };
                    sessionStore = (_c = {}, _c[sessionKey] = sessionEntry, _c);
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, sessionStore)];
                case 2:
                    _g.sent();
                    onBlockReply = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    runEmbeddedPiAgentMock.mockResolvedValueOnce({
                        payloads: [{ text: "hello world!" }],
                        messagingToolSentTexts: ["different message"],
                        messagingToolSentTargets: [{ tool: "slack", provider: "slack", to: "channel:C1" }],
                        meta: {
                            agentMeta: {
                                usage: { input: 10, output: 5 },
                                model: "claude-opus-4-5",
                                provider: "anthropic",
                            },
                        },
                    });
                    runner = (0, followup_runner_js_1.createFollowupRunner)({
                        opts: { onBlockReply: onBlockReply },
                        typing: (0, test_helpers_js_1.createMockTypingController)(),
                        typingMode: "instant",
                        sessionEntry: sessionEntry,
                        sessionStore: sessionStore,
                        sessionKey: sessionKey,
                        storePath: storePath,
                        defaultModel: "anthropic/claude-opus-4-5",
                    });
                    return [4 /*yield*/, runner(baseQueuedRun("slack"))];
                case 3:
                    _g.sent();
                    (0, vitest_1.expect)(onBlockReply).not.toHaveBeenCalled();
                    store = (0, sessions_js_1.loadSessionStore)(storePath, { skipCache: true });
                    (0, vitest_1.expect)((_e = (_d = store[sessionKey]) === null || _d === void 0 ? void 0 : _d.totalTokens) !== null && _e !== void 0 ? _e : 0).toBeGreaterThan(0);
                    (0, vitest_1.expect)((_f = store[sessionKey]) === null || _f === void 0 ? void 0 : _f.model).toBe("claude-opus-4-5");
                    return [2 /*return*/];
            }
        });
    }); });
});
