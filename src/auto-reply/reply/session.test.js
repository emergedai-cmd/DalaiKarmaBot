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
var session_js_1 = require("./session.js");
(0, vitest_1.describe)("initSessionState thread forking", function () {
    (0, vitest_1.it)("forks a new session from the parent session file", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, sessionsDir, parentSessionId, parentSessionFile, header, message, storePath, parentSessionKey, cfg, threadSessionKey, threadLabel, result, newSessionFile, headerLine, parsedHeader;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-thread-session-"))];
                case 1:
                    root = _b.sent();
                    sessionsDir = node_path_1.default.join(root, "sessions");
                    return [4 /*yield*/, promises_1.default.mkdir(sessionsDir, { recursive: true })];
                case 2:
                    _b.sent();
                    parentSessionId = "parent-session";
                    parentSessionFile = node_path_1.default.join(sessionsDir, "parent.jsonl");
                    header = {
                        type: "session",
                        version: 3,
                        id: parentSessionId,
                        timestamp: new Date().toISOString(),
                        cwd: process.cwd(),
                    };
                    message = {
                        type: "message",
                        id: "m1",
                        parentId: null,
                        timestamp: new Date().toISOString(),
                        message: { role: "user", content: "Parent prompt" },
                    };
                    return [4 /*yield*/, promises_1.default.writeFile(parentSessionFile, "".concat(JSON.stringify(header), "\n").concat(JSON.stringify(message), "\n"), "utf-8")];
                case 3:
                    _b.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    parentSessionKey = "agent:main:slack:channel:c1";
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, (_a = {},
                            _a[parentSessionKey] = {
                                sessionId: parentSessionId,
                                sessionFile: parentSessionFile,
                                updatedAt: Date.now(),
                            },
                            _a))];
                case 4:
                    _b.sent();
                    cfg = {
                        session: { store: storePath },
                    };
                    threadSessionKey = "agent:main:slack:channel:c1:thread:123";
                    threadLabel = "Slack thread #general: starter";
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: {
                                Body: "Thread reply",
                                SessionKey: threadSessionKey,
                                ParentSessionKey: parentSessionKey,
                                ThreadLabel: threadLabel,
                            },
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 5:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.sessionKey).toBe(threadSessionKey);
                    (0, vitest_1.expect)(result.sessionEntry.sessionId).not.toBe(parentSessionId);
                    (0, vitest_1.expect)(result.sessionEntry.sessionFile).toBeTruthy();
                    (0, vitest_1.expect)(result.sessionEntry.displayName).toBe(threadLabel);
                    newSessionFile = result.sessionEntry.sessionFile;
                    if (!newSessionFile) {
                        throw new Error("Missing session file for forked thread");
                    }
                    return [4 /*yield*/, promises_1.default.readFile(newSessionFile, "utf-8")];
                case 6:
                    headerLine = (_b.sent())
                        .split(/\r?\n/)
                        .filter(function (line) { return line.trim().length > 0; })[0];
                    parsedHeader = JSON.parse(headerLine);
                    (0, vitest_1.expect)(parsedHeader.parentSession).toBe(parentSessionFile);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("records topic-specific session files when MessageThreadId is present", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, cfg, result, sessionFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-topic-session-"))];
                case 1:
                    root = _a.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    cfg = {
                        session: { store: storePath },
                    };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: {
                                Body: "Hello topic",
                                SessionKey: "agent:main:telegram:group:123:topic:456",
                                MessageThreadId: 456,
                            },
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 2:
                    result = _a.sent();
                    sessionFile = result.sessionEntry.sessionFile;
                    (0, vitest_1.expect)(sessionFile).toBeTruthy();
                    (0, vitest_1.expect)(node_path_1.default.basename(sessionFile !== null && sessionFile !== void 0 ? sessionFile : "")).toBe("".concat(result.sessionEntry.sessionId, "-topic-456.jsonl"));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("initSessionState RawBody", function () {
    (0, vitest_1.it)("triggerBodyNormalized correctly extracts commands when Body contains context but RawBody is clean", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, cfg, groupMessageCtx, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-rawbody-"))];
                case 1:
                    root = _a.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    cfg = { session: { store: storePath } };
                    groupMessageCtx = {
                        Body: "[Chat messages since your last reply - for context]\n[WhatsApp ...] Someone: hello\n\n[Current message - respond to this]\n[WhatsApp ...] Jake: /status\n[from: Jake McInteer (+6421807830)]",
                        RawBody: "/status",
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
                    (0, vitest_1.expect)(result.triggerBodyNormalized).toBe("/status");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("Reset triggers (/new, /reset) work with RawBody", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, cfg, groupMessageCtx, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-rawbody-reset-"))];
                case 1:
                    root = _a.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    cfg = { session: { store: storePath } };
                    groupMessageCtx = {
                        Body: "[Context]\nJake: /new\n[from: Jake]",
                        RawBody: "/new",
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
                    (0, vitest_1.expect)(result.isNewSession).toBe(true);
                    (0, vitest_1.expect)(result.bodyStripped).toBe("");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("preserves argument casing while still matching reset triggers case-insensitively", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, cfg, ctx, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-rawbody-reset-case-"))];
                case 1:
                    root = _a.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    cfg = {
                        session: {
                            store: storePath,
                            resetTriggers: ["/new"],
                        },
                    };
                    ctx = {
                        RawBody: "/NEW KeepThisCase",
                        ChatType: "direct",
                        SessionKey: "agent:main:whatsapp:dm:s1",
                    };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: ctx,
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.isNewSession).toBe(true);
                    (0, vitest_1.expect)(result.bodyStripped).toBe("KeepThisCase");
                    (0, vitest_1.expect)(result.triggerBodyNormalized).toBe("/NEW KeepThisCase");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to Body when RawBody is undefined", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, cfg, ctx, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-rawbody-fallback-"))];
                case 1:
                    root = _a.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    cfg = { session: { store: storePath } };
                    ctx = {
                        Body: "/status",
                        SessionKey: "agent:main:whatsapp:dm:s1",
                    };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: ctx,
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.triggerBodyNormalized).toBe("/status");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("initSessionState reset policy", function () {
    (0, vitest_1.it)("defaults to daily reset at 4am local time", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, sessionKey, existingSessionId, cfg, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    vitest_1.vi.setSystemTime(new Date(2026, 0, 18, 5, 0, 0));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 5, 6]);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-reset-daily-"))];
                case 2:
                    root = _b.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    sessionKey = "agent:main:whatsapp:dm:s1";
                    existingSessionId = "daily-session-id";
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, (_a = {},
                            _a[sessionKey] = {
                                sessionId: existingSessionId,
                                updatedAt: new Date(2026, 0, 18, 3, 0, 0).getTime(),
                            },
                            _a))];
                case 3:
                    _b.sent();
                    cfg = { session: { store: storePath } };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: { Body: "hello", SessionKey: sessionKey },
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 4:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.isNewSession).toBe(true);
                    (0, vitest_1.expect)(result.sessionId).not.toBe(existingSessionId);
                    return [3 /*break*/, 6];
                case 5:
                    vitest_1.vi.useRealTimers();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats sessions as stale before the daily reset when updated before yesterday's boundary", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, sessionKey, existingSessionId, cfg, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    vitest_1.vi.setSystemTime(new Date(2026, 0, 18, 3, 0, 0));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 5, 6]);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-reset-daily-edge-"))];
                case 2:
                    root = _b.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    sessionKey = "agent:main:whatsapp:dm:s-edge";
                    existingSessionId = "daily-edge-session";
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, (_a = {},
                            _a[sessionKey] = {
                                sessionId: existingSessionId,
                                updatedAt: new Date(2026, 0, 17, 3, 30, 0).getTime(),
                            },
                            _a))];
                case 3:
                    _b.sent();
                    cfg = { session: { store: storePath } };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: { Body: "hello", SessionKey: sessionKey },
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 4:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.isNewSession).toBe(true);
                    (0, vitest_1.expect)(result.sessionId).not.toBe(existingSessionId);
                    return [3 /*break*/, 6];
                case 5:
                    vitest_1.vi.useRealTimers();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("expires sessions when idle timeout wins over daily reset", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, sessionKey, existingSessionId, cfg, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    vitest_1.vi.setSystemTime(new Date(2026, 0, 18, 5, 30, 0));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 5, 6]);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-reset-idle-"))];
                case 2:
                    root = _b.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    sessionKey = "agent:main:whatsapp:dm:s2";
                    existingSessionId = "idle-session-id";
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, (_a = {},
                            _a[sessionKey] = {
                                sessionId: existingSessionId,
                                updatedAt: new Date(2026, 0, 18, 4, 45, 0).getTime(),
                            },
                            _a))];
                case 3:
                    _b.sent();
                    cfg = {
                        session: {
                            store: storePath,
                            reset: { mode: "daily", atHour: 4, idleMinutes: 30 },
                        },
                    };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: { Body: "hello", SessionKey: sessionKey },
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 4:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.isNewSession).toBe(true);
                    (0, vitest_1.expect)(result.sessionId).not.toBe(existingSessionId);
                    return [3 /*break*/, 6];
                case 5:
                    vitest_1.vi.useRealTimers();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses per-type overrides for thread sessions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, sessionKey, existingSessionId, cfg, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    vitest_1.vi.setSystemTime(new Date(2026, 0, 18, 5, 0, 0));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 5, 6]);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-reset-thread-"))];
                case 2:
                    root = _b.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    sessionKey = "agent:main:slack:channel:c1:thread:123";
                    existingSessionId = "thread-session-id";
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, (_a = {},
                            _a[sessionKey] = {
                                sessionId: existingSessionId,
                                updatedAt: new Date(2026, 0, 18, 3, 0, 0).getTime(),
                            },
                            _a))];
                case 3:
                    _b.sent();
                    cfg = {
                        session: {
                            store: storePath,
                            reset: { mode: "daily", atHour: 4 },
                            resetByType: { thread: { mode: "idle", idleMinutes: 180 } },
                        },
                    };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: { Body: "reply", SessionKey: sessionKey, ThreadLabel: "Slack thread" },
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 4:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.isNewSession).toBe(false);
                    (0, vitest_1.expect)(result.sessionId).toBe(existingSessionId);
                    return [3 /*break*/, 6];
                case 5:
                    vitest_1.vi.useRealTimers();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("detects thread sessions without thread key suffix", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, sessionKey, existingSessionId, cfg, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    vitest_1.vi.setSystemTime(new Date(2026, 0, 18, 5, 0, 0));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 5, 6]);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-reset-thread-nosuffix-"))];
                case 2:
                    root = _b.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    sessionKey = "agent:main:discord:channel:c1";
                    existingSessionId = "thread-nosuffix";
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, (_a = {},
                            _a[sessionKey] = {
                                sessionId: existingSessionId,
                                updatedAt: new Date(2026, 0, 18, 3, 0, 0).getTime(),
                            },
                            _a))];
                case 3:
                    _b.sent();
                    cfg = {
                        session: {
                            store: storePath,
                            resetByType: { thread: { mode: "idle", idleMinutes: 180 } },
                        },
                    };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: { Body: "reply", SessionKey: sessionKey, ThreadLabel: "Discord thread" },
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 4:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.isNewSession).toBe(false);
                    (0, vitest_1.expect)(result.sessionId).toBe(existingSessionId);
                    return [3 /*break*/, 6];
                case 5:
                    vitest_1.vi.useRealTimers();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults to daily resets when only resetByType is configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, sessionKey, existingSessionId, cfg, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    vitest_1.vi.setSystemTime(new Date(2026, 0, 18, 5, 0, 0));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 5, 6]);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-reset-type-default-"))];
                case 2:
                    root = _b.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    sessionKey = "agent:main:whatsapp:dm:s4";
                    existingSessionId = "type-default-session";
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, (_a = {},
                            _a[sessionKey] = {
                                sessionId: existingSessionId,
                                updatedAt: new Date(2026, 0, 18, 3, 0, 0).getTime(),
                            },
                            _a))];
                case 3:
                    _b.sent();
                    cfg = {
                        session: {
                            store: storePath,
                            resetByType: { thread: { mode: "idle", idleMinutes: 60 } },
                        },
                    };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: { Body: "hello", SessionKey: sessionKey },
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 4:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.isNewSession).toBe(true);
                    (0, vitest_1.expect)(result.sessionId).not.toBe(existingSessionId);
                    return [3 /*break*/, 6];
                case 5:
                    vitest_1.vi.useRealTimers();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps legacy idleMinutes behavior without reset config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, sessionKey, existingSessionId, cfg, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    vitest_1.vi.setSystemTime(new Date(2026, 0, 18, 5, 0, 0));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 5, 6]);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-reset-legacy-"))];
                case 2:
                    root = _b.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    sessionKey = "agent:main:whatsapp:dm:s3";
                    existingSessionId = "legacy-session-id";
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, (_a = {},
                            _a[sessionKey] = {
                                sessionId: existingSessionId,
                                updatedAt: new Date(2026, 0, 18, 3, 30, 0).getTime(),
                            },
                            _a))];
                case 3:
                    _b.sent();
                    cfg = {
                        session: {
                            store: storePath,
                            idleMinutes: 240,
                        },
                    };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: { Body: "hello", SessionKey: sessionKey },
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 4:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.isNewSession).toBe(false);
                    (0, vitest_1.expect)(result.sessionId).toBe(existingSessionId);
                    return [3 /*break*/, 6];
                case 5:
                    vitest_1.vi.useRealTimers();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("initSessionState channel reset overrides", function () {
    (0, vitest_1.it)("uses channel-specific reset policy when configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, sessionKey, sessionId, updatedAt, cfg, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-channel-idle-"))];
                case 1:
                    root = _b.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    sessionKey = "agent:main:discord:dm:123";
                    sessionId = "session-override";
                    updatedAt = Date.now() - (10080 - 1) * 60000;
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, (_a = {},
                            _a[sessionKey] = {
                                sessionId: sessionId,
                                updatedAt: updatedAt,
                            },
                            _a))];
                case 2:
                    _b.sent();
                    cfg = {
                        session: {
                            store: storePath,
                            idleMinutes: 60,
                            resetByType: { dm: { mode: "idle", idleMinutes: 10 } },
                            resetByChannel: { discord: { mode: "idle", idleMinutes: 10080 } },
                        },
                    };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: {
                                Body: "Hello",
                                SessionKey: sessionKey,
                                Provider: "discord",
                            },
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 3:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.isNewSession).toBe(false);
                    (0, vitest_1.expect)(result.sessionEntry.sessionId).toBe(sessionId);
                    return [2 /*return*/];
            }
        });
    }); });
});
