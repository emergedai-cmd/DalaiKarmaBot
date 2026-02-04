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
var abort_js_1 = require("./abort.js");
var queue_js_1 = require("./queue.js");
var session_js_1 = require("./session.js");
var test_ctx_js_1 = require("./test-ctx.js");
vitest_1.vi.mock("../../agents/pi-embedded.js", function () { return ({
    abortEmbeddedPiRun: vitest_1.vi.fn().mockReturnValue(true),
    resolveEmbeddedSessionLane: function (key) { return "session:".concat(key.trim() || "main"); },
}); });
var commandQueueMocks = vitest_1.vi.hoisted(function () { return ({
    clearCommandLane: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../../process/command-queue.js", function () { return commandQueueMocks; });
var subagentRegistryMocks = vitest_1.vi.hoisted(function () { return ({
    listSubagentRunsForRequester: vitest_1.vi.fn(function () { return []; }),
}); });
vitest_1.vi.mock("../../agents/subagent-registry.js", function () { return ({
    listSubagentRunsForRequester: subagentRegistryMocks.listSubagentRunsForRequester,
}); });
(0, vitest_1.describe)("abort detection", function () {
    (0, vitest_1.it)("triggerBodyNormalized extracts /stop from RawBody for abort detection", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, cfg, groupMessageCtx, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-abort-"))];
                case 1:
                    root = _a.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    cfg = { session: { store: storePath } };
                    groupMessageCtx = {
                        Body: "[Context]\nJake: /stop\n[from: Jake]",
                        RawBody: "/stop",
                        ChatType: "group",
                        SessionKey: "agent:main:whatsapp:group:g1",
                    };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: groupMessageCtx,
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 2:
                    result = _a.sent();
                    // /stop is detected via exact match in handleAbort, not isAbortTrigger
                    (0, vitest_1.expect)(result.triggerBodyNormalized).toBe("/stop");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("isAbortTrigger matches bare word triggers (without slash)", function () {
        (0, vitest_1.expect)((0, abort_js_1.isAbortTrigger)("stop")).toBe(true);
        (0, vitest_1.expect)((0, abort_js_1.isAbortTrigger)("esc")).toBe(true);
        (0, vitest_1.expect)((0, abort_js_1.isAbortTrigger)("abort")).toBe(true);
        (0, vitest_1.expect)((0, abort_js_1.isAbortTrigger)("wait")).toBe(true);
        (0, vitest_1.expect)((0, abort_js_1.isAbortTrigger)("exit")).toBe(true);
        (0, vitest_1.expect)((0, abort_js_1.isAbortTrigger)("interrupt")).toBe(true);
        (0, vitest_1.expect)((0, abort_js_1.isAbortTrigger)("hello")).toBe(false);
        // /stop is NOT matched by isAbortTrigger - it's handled separately
        (0, vitest_1.expect)((0, abort_js_1.isAbortTrigger)("/stop")).toBe(false);
    });
    (0, vitest_1.it)("fast-aborts even when text commands are disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, cfg, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-abort-"))];
                case 1:
                    root = _a.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    cfg = { session: { store: storePath }, commands: { text: false } };
                    return [4 /*yield*/, (0, abort_js_1.tryFastAbortFromMessage)({
                            ctx: (0, test_ctx_js_1.buildTestCtx)({
                                CommandBody: "/stop",
                                RawBody: "/stop",
                                CommandAuthorized: true,
                                SessionKey: "telegram:123",
                                Provider: "telegram",
                                Surface: "telegram",
                                From: "telegram:123",
                                To: "telegram:123",
                            }),
                            cfg: cfg,
                        })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.handled).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("fast-abort clears queued followups and session lane", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, cfg, sessionKey, sessionId, followupRun, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-abort-"))];
                case 1:
                    root = _b.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    cfg = { session: { store: storePath } };
                    sessionKey = "telegram:123";
                    sessionId = "session-123";
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[sessionKey] = {
                                sessionId: sessionId,
                                updatedAt: Date.now(),
                            },
                            _a), null, 2))];
                case 2:
                    _b.sent();
                    followupRun = {
                        prompt: "queued",
                        enqueuedAt: Date.now(),
                        run: {
                            agentId: "main",
                            agentDir: node_path_1.default.join(root, "agent"),
                            sessionId: sessionId,
                            sessionKey: sessionKey,
                            messageProvider: "telegram",
                            agentAccountId: "acct",
                            sessionFile: node_path_1.default.join(root, "session.jsonl"),
                            workspaceDir: node_path_1.default.join(root, "workspace"),
                            config: cfg,
                            provider: "anthropic",
                            model: "claude-opus-4-5",
                            timeoutMs: 1000,
                            blockReplyBreak: "text_end",
                        },
                    };
                    (0, queue_js_1.enqueueFollowupRun)(sessionKey, followupRun, { mode: "collect", debounceMs: 0, cap: 20, dropPolicy: "summarize" }, "none");
                    (0, vitest_1.expect)((0, queue_js_1.getFollowupQueueDepth)(sessionKey)).toBe(1);
                    return [4 /*yield*/, (0, abort_js_1.tryFastAbortFromMessage)({
                            ctx: (0, test_ctx_js_1.buildTestCtx)({
                                CommandBody: "/stop",
                                RawBody: "/stop",
                                CommandAuthorized: true,
                                SessionKey: sessionKey,
                                Provider: "telegram",
                                Surface: "telegram",
                                From: "telegram:123",
                                To: "telegram:123",
                            }),
                            cfg: cfg,
                        })];
                case 3:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.handled).toBe(true);
                    (0, vitest_1.expect)((0, queue_js_1.getFollowupQueueDepth)(sessionKey)).toBe(0);
                    (0, vitest_1.expect)(commandQueueMocks.clearCommandLane).toHaveBeenCalledWith("session:".concat(sessionKey));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("fast-abort stops active subagent runs for requester session", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, cfg, sessionKey, childKey, sessionId, childSessionId, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-abort-"))];
                case 1:
                    root = _b.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    cfg = { session: { store: storePath } };
                    sessionKey = "telegram:parent";
                    childKey = "agent:main:subagent:child-1";
                    sessionId = "session-parent";
                    childSessionId = "session-child";
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[sessionKey] = {
                                sessionId: sessionId,
                                updatedAt: Date.now(),
                            },
                            _a[childKey] = {
                                sessionId: childSessionId,
                                updatedAt: Date.now(),
                            },
                            _a), null, 2))];
                case 2:
                    _b.sent();
                    subagentRegistryMocks.listSubagentRunsForRequester.mockReturnValueOnce([
                        {
                            runId: "run-1",
                            childSessionKey: childKey,
                            requesterSessionKey: sessionKey,
                            requesterDisplayKey: "telegram:parent",
                            task: "do work",
                            cleanup: "keep",
                            createdAt: Date.now(),
                        },
                    ]);
                    return [4 /*yield*/, (0, abort_js_1.tryFastAbortFromMessage)({
                            ctx: (0, test_ctx_js_1.buildTestCtx)({
                                CommandBody: "/stop",
                                RawBody: "/stop",
                                CommandAuthorized: true,
                                SessionKey: sessionKey,
                                Provider: "telegram",
                                Surface: "telegram",
                                From: "telegram:parent",
                                To: "telegram:parent",
                            }),
                            cfg: cfg,
                        })];
                case 3:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.stoppedSubagents).toBe(1);
                    (0, vitest_1.expect)(commandQueueMocks.clearCommandLane).toHaveBeenCalledWith("session:".concat(childKey));
                    return [2 /*return*/];
            }
        });
    }); });
});
