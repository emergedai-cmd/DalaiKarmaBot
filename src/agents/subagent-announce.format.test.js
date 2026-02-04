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
var agentSpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ runId: "run-main", status: "ok" })];
}); }); });
var embeddedRunMock = {
    isEmbeddedPiRunActive: vitest_1.vi.fn(function () { return false; }),
    isEmbeddedPiRunStreaming: vitest_1.vi.fn(function () { return false; }),
    queueEmbeddedPiMessage: vitest_1.vi.fn(function () { return false; }),
    waitForEmbeddedPiRunEnd: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, true];
    }); }); }),
};
var sessionStore = {};
var configOverride = {
    session: {
        mainKey: "main",
        scope: "per-sender",
    },
};
vitest_1.vi.mock("../gateway/call.js", function () { return ({
    callGateway: vitest_1.vi.fn(function (req) { return __awaiter(void 0, void 0, void 0, function () {
        var typed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    typed = req;
                    if (!(typed.method === "agent")) return [3 /*break*/, 2];
                    return [4 /*yield*/, agentSpy(typed)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (typed.method === "agent.wait") {
                        return [2 /*return*/, { status: "error", startedAt: 10, endedAt: 20, error: "boom" }];
                    }
                    if (typed.method === "sessions.patch") {
                        return [2 /*return*/, {}];
                    }
                    if (typed.method === "sessions.delete") {
                        return [2 /*return*/, {}];
                    }
                    return [2 /*return*/, {}];
            }
        });
    }); }),
}); });
vitest_1.vi.mock("./tools/agent-step.js", function () { return ({
    readLatestAssistantReply: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, "raw subagent reply"];
    }); }); }),
}); });
vitest_1.vi.mock("../config/sessions.js", function () { return ({
    loadSessionStore: vitest_1.vi.fn(function () { return sessionStore; }),
    resolveAgentIdFromSessionKey: function () { return "main"; },
    resolveStorePath: function () { return "/tmp/sessions.json"; },
    resolveMainSessionKey: function () { return "agent:main:main"; },
    readSessionUpdatedAt: vitest_1.vi.fn(function () { return undefined; }),
    recordSessionMetaFromInbound: vitest_1.vi.fn().mockResolvedValue(undefined),
}); });
vitest_1.vi.mock("./pi-embedded.js", function () { return embeddedRunMock; });
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: function () { return configOverride; } })];
        }
    });
}); });
(0, vitest_1.describe)("subagent announce formatting", function () {
    (0, vitest_1.beforeEach)(function () {
        agentSpy.mockClear();
        embeddedRunMock.isEmbeddedPiRunActive.mockReset().mockReturnValue(false);
        embeddedRunMock.isEmbeddedPiRunStreaming.mockReset().mockReturnValue(false);
        embeddedRunMock.queueEmbeddedPiMessage.mockReset().mockReturnValue(false);
        embeddedRunMock.waitForEmbeddedPiRunEnd.mockReset().mockResolvedValue(true);
        sessionStore = {};
        configOverride = {
            session: {
                mainKey: "main",
                scope: "per-sender",
            },
        };
    });
    (0, vitest_1.it)("sends instructional message to main agent with status and findings", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runSubagentAnnounceFlow, call, msg;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./subagent-announce.js"); })];
                case 1:
                    runSubagentAnnounceFlow = (_d.sent()).runSubagentAnnounceFlow;
                    return [4 /*yield*/, runSubagentAnnounceFlow({
                            childSessionKey: "agent:main:subagent:test",
                            childRunId: "run-123",
                            requesterSessionKey: "agent:main:main",
                            requesterDisplayKey: "main",
                            task: "do thing",
                            timeoutMs: 1000,
                            cleanup: "keep",
                            waitForCompletion: true,
                            startedAt: 10,
                            endedAt: 20,
                        })];
                case 2:
                    _d.sent();
                    (0, vitest_1.expect)(agentSpy).toHaveBeenCalled();
                    call = (_a = agentSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    msg = (_b = call === null || call === void 0 ? void 0 : call.params) === null || _b === void 0 ? void 0 : _b.message;
                    (0, vitest_1.expect)((_c = call === null || call === void 0 ? void 0 : call.params) === null || _c === void 0 ? void 0 : _c.sessionKey).toBe("agent:main:main");
                    (0, vitest_1.expect)(msg).toContain("background task");
                    (0, vitest_1.expect)(msg).toContain("failed");
                    (0, vitest_1.expect)(msg).toContain("boom");
                    (0, vitest_1.expect)(msg).toContain("Findings:");
                    (0, vitest_1.expect)(msg).toContain("raw subagent reply");
                    (0, vitest_1.expect)(msg).toContain("Stats:");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes success status when outcome is ok", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runSubagentAnnounceFlow, call, msg;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./subagent-announce.js"); })];
                case 1:
                    runSubagentAnnounceFlow = (_c.sent()).runSubagentAnnounceFlow;
                    // Use waitForCompletion: false so it uses the provided outcome instead of calling agent.wait
                    return [4 /*yield*/, runSubagentAnnounceFlow({
                            childSessionKey: "agent:main:subagent:test",
                            childRunId: "run-456",
                            requesterSessionKey: "agent:main:main",
                            requesterDisplayKey: "main",
                            task: "do thing",
                            timeoutMs: 1000,
                            cleanup: "keep",
                            waitForCompletion: false,
                            startedAt: 10,
                            endedAt: 20,
                            outcome: { status: "ok" },
                        })];
                case 2:
                    // Use waitForCompletion: false so it uses the provided outcome instead of calling agent.wait
                    _c.sent();
                    call = (_a = agentSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    msg = (_b = call === null || call === void 0 ? void 0 : call.params) === null || _b === void 0 ? void 0 : _b.message;
                    (0, vitest_1.expect)(msg).toContain("completed successfully");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("steers announcements into an active run when queue mode is steer", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runSubagentAnnounceFlow, didAnnounce;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./subagent-announce.js"); })];
                case 1:
                    runSubagentAnnounceFlow = (_a.sent()).runSubagentAnnounceFlow;
                    embeddedRunMock.isEmbeddedPiRunActive.mockReturnValue(true);
                    embeddedRunMock.isEmbeddedPiRunStreaming.mockReturnValue(true);
                    embeddedRunMock.queueEmbeddedPiMessage.mockReturnValue(true);
                    sessionStore = {
                        "agent:main:main": {
                            sessionId: "session-123",
                            lastChannel: "whatsapp",
                            lastTo: "+1555",
                            queueMode: "steer",
                        },
                    };
                    return [4 /*yield*/, runSubagentAnnounceFlow({
                            childSessionKey: "agent:main:subagent:test",
                            childRunId: "run-789",
                            requesterSessionKey: "main",
                            requesterDisplayKey: "main",
                            task: "do thing",
                            timeoutMs: 1000,
                            cleanup: "keep",
                            waitForCompletion: false,
                            startedAt: 10,
                            endedAt: 20,
                            outcome: { status: "ok" },
                        })];
                case 2:
                    didAnnounce = _a.sent();
                    (0, vitest_1.expect)(didAnnounce).toBe(true);
                    (0, vitest_1.expect)(embeddedRunMock.queueEmbeddedPiMessage).toHaveBeenCalledWith("session-123", vitest_1.expect.stringContaining("background task"));
                    (0, vitest_1.expect)(agentSpy).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("queues announce delivery with origin account routing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runSubagentAnnounceFlow, didAnnounce, call;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./subagent-announce.js"); })];
                case 1:
                    runSubagentAnnounceFlow = (_e.sent()).runSubagentAnnounceFlow;
                    embeddedRunMock.isEmbeddedPiRunActive.mockReturnValue(true);
                    embeddedRunMock.isEmbeddedPiRunStreaming.mockReturnValue(false);
                    sessionStore = {
                        "agent:main:main": {
                            sessionId: "session-456",
                            lastChannel: "whatsapp",
                            lastTo: "+1555",
                            lastAccountId: "kev",
                            queueMode: "collect",
                            queueDebounceMs: 0,
                        },
                    };
                    return [4 /*yield*/, runSubagentAnnounceFlow({
                            childSessionKey: "agent:main:subagent:test",
                            childRunId: "run-999",
                            requesterSessionKey: "main",
                            requesterDisplayKey: "main",
                            task: "do thing",
                            timeoutMs: 1000,
                            cleanup: "keep",
                            waitForCompletion: false,
                            startedAt: 10,
                            endedAt: 20,
                            outcome: { status: "ok" },
                        })];
                case 2:
                    didAnnounce = _e.sent();
                    (0, vitest_1.expect)(didAnnounce).toBe(true);
                    return [4 /*yield*/, vitest_1.expect.poll(function () { return agentSpy.mock.calls.length; }).toBe(1)];
                case 3:
                    _e.sent();
                    call = (_a = agentSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_b = call === null || call === void 0 ? void 0 : call.params) === null || _b === void 0 ? void 0 : _b.channel).toBe("whatsapp");
                    (0, vitest_1.expect)((_c = call === null || call === void 0 ? void 0 : call.params) === null || _c === void 0 ? void 0 : _c.to).toBe("+1555");
                    (0, vitest_1.expect)((_d = call === null || call === void 0 ? void 0 : call.params) === null || _d === void 0 ? void 0 : _d.accountId).toBe("kev");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("splits collect-mode queues when accountId differs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runSubagentAnnounceFlow, accountIds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./subagent-announce.js"); })];
                case 1:
                    runSubagentAnnounceFlow = (_a.sent()).runSubagentAnnounceFlow;
                    embeddedRunMock.isEmbeddedPiRunActive.mockReturnValue(true);
                    embeddedRunMock.isEmbeddedPiRunStreaming.mockReturnValue(false);
                    sessionStore = {
                        "agent:main:main": {
                            sessionId: "session-acc-split",
                            lastChannel: "whatsapp",
                            lastTo: "+1555",
                            queueMode: "collect",
                            queueDebounceMs: 80,
                        },
                    };
                    return [4 /*yield*/, Promise.all([
                            runSubagentAnnounceFlow({
                                childSessionKey: "agent:main:subagent:test-a",
                                childRunId: "run-a",
                                requesterSessionKey: "main",
                                requesterDisplayKey: "main",
                                requesterOrigin: { accountId: "acct-a" },
                                task: "do thing",
                                timeoutMs: 1000,
                                cleanup: "keep",
                                waitForCompletion: false,
                                startedAt: 10,
                                endedAt: 20,
                                outcome: { status: "ok" },
                            }),
                            runSubagentAnnounceFlow({
                                childSessionKey: "agent:main:subagent:test-b",
                                childRunId: "run-b",
                                requesterSessionKey: "main",
                                requesterDisplayKey: "main",
                                requesterOrigin: { accountId: "acct-b" },
                                task: "do thing",
                                timeoutMs: 1000,
                                cleanup: "keep",
                                waitForCompletion: false,
                                startedAt: 10,
                                endedAt: 20,
                                outcome: { status: "ok" },
                            }),
                        ])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 120); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(agentSpy).toHaveBeenCalledTimes(2);
                    accountIds = agentSpy.mock.calls.map(function (call) { var _a, _b; return (_b = (_a = call === null || call === void 0 ? void 0 : call[0]) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.accountId; });
                    (0, vitest_1.expect)(accountIds).toEqual(vitest_1.expect.arrayContaining(["acct-a", "acct-b"]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses requester origin for direct announce when not queued", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runSubagentAnnounceFlow, didAnnounce, call;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./subagent-announce.js"); })];
                case 1:
                    runSubagentAnnounceFlow = (_d.sent()).runSubagentAnnounceFlow;
                    embeddedRunMock.isEmbeddedPiRunActive.mockReturnValue(false);
                    embeddedRunMock.isEmbeddedPiRunStreaming.mockReturnValue(false);
                    return [4 /*yield*/, runSubagentAnnounceFlow({
                            childSessionKey: "agent:main:subagent:test",
                            childRunId: "run-direct",
                            requesterSessionKey: "agent:main:main",
                            requesterOrigin: { channel: "whatsapp", accountId: "acct-123" },
                            requesterDisplayKey: "main",
                            task: "do thing",
                            timeoutMs: 1000,
                            cleanup: "keep",
                            waitForCompletion: false,
                            startedAt: 10,
                            endedAt: 20,
                            outcome: { status: "ok" },
                        })];
                case 2:
                    didAnnounce = _d.sent();
                    (0, vitest_1.expect)(didAnnounce).toBe(true);
                    call = (_a = agentSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_b = call === null || call === void 0 ? void 0 : call.params) === null || _b === void 0 ? void 0 : _b.channel).toBe("whatsapp");
                    (0, vitest_1.expect)((_c = call === null || call === void 0 ? void 0 : call.params) === null || _c === void 0 ? void 0 : _c.accountId).toBe("acct-123");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("normalizes requesterOrigin for direct announce delivery", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runSubagentAnnounceFlow, didAnnounce, call;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./subagent-announce.js"); })];
                case 1:
                    runSubagentAnnounceFlow = (_d.sent()).runSubagentAnnounceFlow;
                    embeddedRunMock.isEmbeddedPiRunActive.mockReturnValue(false);
                    embeddedRunMock.isEmbeddedPiRunStreaming.mockReturnValue(false);
                    return [4 /*yield*/, runSubagentAnnounceFlow({
                            childSessionKey: "agent:main:subagent:test",
                            childRunId: "run-direct-origin",
                            requesterSessionKey: "agent:main:main",
                            requesterOrigin: { channel: " whatsapp ", accountId: " acct-987 " },
                            requesterDisplayKey: "main",
                            task: "do thing",
                            timeoutMs: 1000,
                            cleanup: "keep",
                            waitForCompletion: false,
                            startedAt: 10,
                            endedAt: 20,
                            outcome: { status: "ok" },
                        })];
                case 2:
                    didAnnounce = _d.sent();
                    (0, vitest_1.expect)(didAnnounce).toBe(true);
                    call = (_a = agentSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_b = call === null || call === void 0 ? void 0 : call.params) === null || _b === void 0 ? void 0 : _b.channel).toBe("whatsapp");
                    (0, vitest_1.expect)((_c = call === null || call === void 0 ? void 0 : call.params) === null || _c === void 0 ? void 0 : _c.accountId).toBe("acct-987");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers requesterOrigin channel over stale session lastChannel in queued announce", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runSubagentAnnounceFlow, didAnnounce, call;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./subagent-announce.js"); })];
                case 1:
                    runSubagentAnnounceFlow = (_d.sent()).runSubagentAnnounceFlow;
                    embeddedRunMock.isEmbeddedPiRunActive.mockReturnValue(true);
                    embeddedRunMock.isEmbeddedPiRunStreaming.mockReturnValue(false);
                    // Session store has stale whatsapp channel, but the requesterOrigin says bluebubbles.
                    sessionStore = {
                        "agent:main:main": {
                            sessionId: "session-stale",
                            lastChannel: "whatsapp",
                            queueMode: "collect",
                            queueDebounceMs: 0,
                        },
                    };
                    return [4 /*yield*/, runSubagentAnnounceFlow({
                            childSessionKey: "agent:main:subagent:test",
                            childRunId: "run-stale-channel",
                            requesterSessionKey: "main",
                            requesterOrigin: { channel: "bluebubbles", to: "bluebubbles:chat_guid:123" },
                            requesterDisplayKey: "main",
                            task: "do thing",
                            timeoutMs: 1000,
                            cleanup: "keep",
                            waitForCompletion: false,
                            startedAt: 10,
                            endedAt: 20,
                            outcome: { status: "ok" },
                        })];
                case 2:
                    didAnnounce = _d.sent();
                    (0, vitest_1.expect)(didAnnounce).toBe(true);
                    return [4 /*yield*/, vitest_1.expect.poll(function () { return agentSpy.mock.calls.length; }).toBe(1)];
                case 3:
                    _d.sent();
                    call = (_a = agentSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    // The channel should match requesterOrigin, NOT the stale session entry.
                    (0, vitest_1.expect)((_b = call === null || call === void 0 ? void 0 : call.params) === null || _b === void 0 ? void 0 : _b.channel).toBe("bluebubbles");
                    (0, vitest_1.expect)((_c = call === null || call === void 0 ? void 0 : call.params) === null || _c === void 0 ? void 0 : _c.to).toBe("bluebubbles:chat_guid:123");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("splits collect-mode announces when accountId differs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runSubagentAnnounceFlow, accountIds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./subagent-announce.js"); })];
                case 1:
                    runSubagentAnnounceFlow = (_a.sent()).runSubagentAnnounceFlow;
                    embeddedRunMock.isEmbeddedPiRunActive.mockReturnValue(true);
                    embeddedRunMock.isEmbeddedPiRunStreaming.mockReturnValue(false);
                    sessionStore = {
                        "agent:main:main": {
                            sessionId: "session-789",
                            lastChannel: "whatsapp",
                            lastTo: "+1555",
                            queueMode: "collect",
                            queueDebounceMs: 0,
                        },
                    };
                    return [4 /*yield*/, runSubagentAnnounceFlow({
                            childSessionKey: "agent:main:subagent:test",
                            childRunId: "run-a",
                            requesterSessionKey: "main",
                            requesterOrigin: { accountId: "acct-a" },
                            requesterDisplayKey: "main",
                            task: "do thing",
                            timeoutMs: 1000,
                            cleanup: "keep",
                            waitForCompletion: false,
                            startedAt: 10,
                            endedAt: 20,
                            outcome: { status: "ok" },
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, runSubagentAnnounceFlow({
                            childSessionKey: "agent:main:subagent:test",
                            childRunId: "run-b",
                            requesterSessionKey: "main",
                            requesterOrigin: { accountId: "acct-b" },
                            requesterDisplayKey: "main",
                            task: "do thing",
                            timeoutMs: 1000,
                            cleanup: "keep",
                            waitForCompletion: false,
                            startedAt: 10,
                            endedAt: 20,
                            outcome: { status: "ok" },
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, vitest_1.expect.poll(function () { return agentSpy.mock.calls.length; }).toBe(2)];
                case 4:
                    _a.sent();
                    accountIds = agentSpy.mock.calls.map(function (call) { var _a; return (_a = call[0].params) === null || _a === void 0 ? void 0 : _a.accountId; });
                    (0, vitest_1.expect)(accountIds).toContain("acct-a");
                    (0, vitest_1.expect)(accountIds).toContain("acct-b");
                    (0, vitest_1.expect)(agentSpy).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
});
