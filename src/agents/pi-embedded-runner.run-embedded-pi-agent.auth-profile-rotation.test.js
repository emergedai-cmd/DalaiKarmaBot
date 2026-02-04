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
var runEmbeddedAttemptMock = vitest_1.vi.fn();
vitest_1.vi.mock("./pi-embedded-runner/run/attempt.js", function () { return ({
    runEmbeddedAttempt: function (params) { return runEmbeddedAttemptMock(params); },
}); });
var runEmbeddedPiAgent;
(0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./pi-embedded-runner.js"); })];
            case 1:
                (runEmbeddedPiAgent = (_a.sent()).runEmbeddedPiAgent);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.beforeEach)(function () {
    vitest_1.vi.useRealTimers();
    runEmbeddedAttemptMock.mockReset();
});
var baseUsage = {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: 0,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
};
var buildAssistant = function (overrides) { return (__assign({ role: "assistant", content: [], api: "openai-responses", provider: "openai", model: "mock-1", usage: baseUsage, stopReason: "stop", timestamp: Date.now() }, overrides)); };
var makeAttempt = function (overrides) { return (__assign({ aborted: false, timedOut: false, promptError: null, sessionIdUsed: "session:test", systemPromptReport: undefined, messagesSnapshot: [], assistantTexts: [], toolMetas: [], lastAssistant: undefined, didSendViaMessagingTool: false, messagingToolSentTexts: [], messagingToolSentTargets: [], cloudCodeAssistFormatError: false }, overrides)); };
var makeConfig = function (opts) {
    var _a, _b;
    return ({
        agents: {
            defaults: {
                model: {
                    fallbacks: (_a = opts === null || opts === void 0 ? void 0 : opts.fallbacks) !== null && _a !== void 0 ? _a : [],
                },
            },
        },
        models: {
            providers: {
                openai: {
                    api: "openai-responses",
                    apiKey: (_b = opts === null || opts === void 0 ? void 0 : opts.apiKey) !== null && _b !== void 0 ? _b : "sk-test",
                    baseUrl: "https://example.com",
                    models: [
                        {
                            id: "mock-1",
                            name: "Mock 1",
                            reasoning: false,
                            input: ["text"],
                            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                            contextWindow: 16000,
                            maxTokens: 2048,
                        },
                    ],
                },
            },
        },
    });
};
var writeAuthStore = function (agentDir, opts) { return __awaiter(void 0, void 0, void 0, function () {
    var authPath, payload;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authPath = node_path_1.default.join(agentDir, "auth-profiles.json");
                payload = {
                    version: 1,
                    profiles: __assign({ "openai:p1": { type: "api_key", provider: "openai", key: "sk-one" }, "openai:p2": { type: "api_key", provider: "openai", key: "sk-two" } }, ((opts === null || opts === void 0 ? void 0 : opts.includeAnthropic)
                        ? { "anthropic:default": { type: "api_key", provider: "anthropic", key: "sk-anth" } }
                        : {})),
                    usageStats: (_a = opts === null || opts === void 0 ? void 0 : opts.usageStats) !== null && _a !== void 0 ? _a : {
                        "openai:p1": { lastUsed: 1 },
                        "openai:p2": { lastUsed: 2 },
                    },
                };
                return [4 /*yield*/, promises_1.default.writeFile(authPath, JSON.stringify(payload))];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
(0, vitest_1.describe)("runEmbeddedPiAgent auth profile rotation", function () {
    (0, vitest_1.it)("rotates for auto-pinned profiles", function () { return __awaiter(void 0, void 0, void 0, function () {
        var agentDir, workspaceDir, stored, _a, _b;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-agent-"))];
                case 1:
                    agentDir = _e.sent();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-workspace-"))];
                case 2:
                    workspaceDir = _e.sent();
                    _e.label = 3;
                case 3:
                    _e.trys.push([3, , 7, 10]);
                    return [4 /*yield*/, writeAuthStore(agentDir)];
                case 4:
                    _e.sent();
                    runEmbeddedAttemptMock
                        .mockResolvedValueOnce(makeAttempt({
                        assistantTexts: [],
                        lastAssistant: buildAssistant({
                            stopReason: "error",
                            errorMessage: "rate limit",
                        }),
                    }))
                        .mockResolvedValueOnce(makeAttempt({
                        assistantTexts: ["ok"],
                        lastAssistant: buildAssistant({
                            stopReason: "stop",
                            content: [{ type: "text", text: "ok" }],
                        }),
                    }));
                    return [4 /*yield*/, runEmbeddedPiAgent({
                            sessionId: "session:test",
                            sessionKey: "agent:test:auto",
                            sessionFile: node_path_1.default.join(workspaceDir, "session.jsonl"),
                            workspaceDir: workspaceDir,
                            agentDir: agentDir,
                            config: makeConfig(),
                            prompt: "hello",
                            provider: "openai",
                            model: "mock-1",
                            authProfileId: "openai:p1",
                            authProfileIdSource: "auto",
                            timeoutMs: 5000,
                            runId: "run:auto",
                        })];
                case 5:
                    _e.sent();
                    (0, vitest_1.expect)(runEmbeddedAttemptMock).toHaveBeenCalledTimes(2);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(agentDir, "auth-profiles.json"), "utf-8")];
                case 6:
                    stored = _b.apply(_a, [_e.sent()]);
                    (0, vitest_1.expect)(typeof ((_d = (_c = stored.usageStats) === null || _c === void 0 ? void 0 : _c["openai:p2"]) === null || _d === void 0 ? void 0 : _d.lastUsed)).toBe("number");
                    return [3 /*break*/, 10];
                case 7: return [4 /*yield*/, promises_1.default.rm(agentDir, { recursive: true, force: true })];
                case 8:
                    _e.sent();
                    return [4 /*yield*/, promises_1.default.rm(workspaceDir, { recursive: true, force: true })];
                case 9:
                    _e.sent();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not rotate for user-pinned profiles", function () { return __awaiter(void 0, void 0, void 0, function () {
        var agentDir, workspaceDir, stored, _a, _b;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-agent-"))];
                case 1:
                    agentDir = _e.sent();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-workspace-"))];
                case 2:
                    workspaceDir = _e.sent();
                    _e.label = 3;
                case 3:
                    _e.trys.push([3, , 7, 10]);
                    return [4 /*yield*/, writeAuthStore(agentDir)];
                case 4:
                    _e.sent();
                    runEmbeddedAttemptMock.mockResolvedValueOnce(makeAttempt({
                        assistantTexts: [],
                        lastAssistant: buildAssistant({
                            stopReason: "error",
                            errorMessage: "rate limit",
                        }),
                    }));
                    return [4 /*yield*/, runEmbeddedPiAgent({
                            sessionId: "session:test",
                            sessionKey: "agent:test:user",
                            sessionFile: node_path_1.default.join(workspaceDir, "session.jsonl"),
                            workspaceDir: workspaceDir,
                            agentDir: agentDir,
                            config: makeConfig(),
                            prompt: "hello",
                            provider: "openai",
                            model: "mock-1",
                            authProfileId: "openai:p1",
                            authProfileIdSource: "user",
                            timeoutMs: 5000,
                            runId: "run:user",
                        })];
                case 5:
                    _e.sent();
                    (0, vitest_1.expect)(runEmbeddedAttemptMock).toHaveBeenCalledTimes(1);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(agentDir, "auth-profiles.json"), "utf-8")];
                case 6:
                    stored = _b.apply(_a, [_e.sent()]);
                    (0, vitest_1.expect)((_d = (_c = stored.usageStats) === null || _c === void 0 ? void 0 : _c["openai:p2"]) === null || _d === void 0 ? void 0 : _d.lastUsed).toBe(2);
                    return [3 /*break*/, 10];
                case 7: return [4 /*yield*/, promises_1.default.rm(agentDir, { recursive: true, force: true })];
                case 8:
                    _e.sent();
                    return [4 /*yield*/, promises_1.default.rm(workspaceDir, { recursive: true, force: true })];
                case 9:
                    _e.sent();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors user-pinned profiles even when in cooldown", function () { return __awaiter(void 0, void 0, void 0, function () {
        var agentDir, workspaceDir, now, authPath, payload, stored, _a, _b;
        var _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, , 12, 13]);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-agent-"))];
                case 2:
                    agentDir = _j.sent();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-workspace-"))];
                case 3:
                    workspaceDir = _j.sent();
                    now = Date.now();
                    vitest_1.vi.setSystemTime(now);
                    _j.label = 4;
                case 4:
                    _j.trys.push([4, , 8, 11]);
                    authPath = node_path_1.default.join(agentDir, "auth-profiles.json");
                    payload = {
                        version: 1,
                        profiles: {
                            "openai:p1": { type: "api_key", provider: "openai", key: "sk-one" },
                            "openai:p2": { type: "api_key", provider: "openai", key: "sk-two" },
                        },
                        usageStats: {
                            "openai:p1": { lastUsed: 1, cooldownUntil: now + 60 * 60 * 1000 },
                            "openai:p2": { lastUsed: 2 },
                        },
                    };
                    return [4 /*yield*/, promises_1.default.writeFile(authPath, JSON.stringify(payload))];
                case 5:
                    _j.sent();
                    runEmbeddedAttemptMock.mockResolvedValueOnce(makeAttempt({
                        assistantTexts: ["ok"],
                        lastAssistant: buildAssistant({
                            stopReason: "stop",
                            content: [{ type: "text", text: "ok" }],
                        }),
                    }));
                    return [4 /*yield*/, runEmbeddedPiAgent({
                            sessionId: "session:test",
                            sessionKey: "agent:test:user-cooldown",
                            sessionFile: node_path_1.default.join(workspaceDir, "session.jsonl"),
                            workspaceDir: workspaceDir,
                            agentDir: agentDir,
                            config: makeConfig(),
                            prompt: "hello",
                            provider: "openai",
                            model: "mock-1",
                            authProfileId: "openai:p1",
                            authProfileIdSource: "user",
                            timeoutMs: 5000,
                            runId: "run:user-cooldown",
                        })];
                case 6:
                    _j.sent();
                    (0, vitest_1.expect)(runEmbeddedAttemptMock).toHaveBeenCalledTimes(1);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(agentDir, "auth-profiles.json"), "utf-8")];
                case 7:
                    stored = _b.apply(_a, [_j.sent()]);
                    (0, vitest_1.expect)((_d = (_c = stored.usageStats) === null || _c === void 0 ? void 0 : _c["openai:p1"]) === null || _d === void 0 ? void 0 : _d.cooldownUntil).toBeUndefined();
                    (0, vitest_1.expect)((_f = (_e = stored.usageStats) === null || _e === void 0 ? void 0 : _e["openai:p1"]) === null || _f === void 0 ? void 0 : _f.lastUsed).not.toBe(1);
                    (0, vitest_1.expect)((_h = (_g = stored.usageStats) === null || _g === void 0 ? void 0 : _g["openai:p2"]) === null || _h === void 0 ? void 0 : _h.lastUsed).toBe(2);
                    return [3 /*break*/, 11];
                case 8: return [4 /*yield*/, promises_1.default.rm(agentDir, { recursive: true, force: true })];
                case 9:
                    _j.sent();
                    return [4 /*yield*/, promises_1.default.rm(workspaceDir, { recursive: true, force: true })];
                case 10:
                    _j.sent();
                    return [7 /*endfinally*/];
                case 11: return [3 /*break*/, 13];
                case 12:
                    vitest_1.vi.useRealTimers();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("ignores user-locked profile when provider mismatches", function () { return __awaiter(void 0, void 0, void 0, function () {
        var agentDir, workspaceDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-agent-"))];
                case 1:
                    agentDir = _a.sent();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-workspace-"))];
                case 2:
                    workspaceDir = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 6, 9]);
                    return [4 /*yield*/, writeAuthStore(agentDir, { includeAnthropic: true })];
                case 4:
                    _a.sent();
                    runEmbeddedAttemptMock.mockResolvedValueOnce(makeAttempt({
                        assistantTexts: ["ok"],
                        lastAssistant: buildAssistant({
                            stopReason: "stop",
                            content: [{ type: "text", text: "ok" }],
                        }),
                    }));
                    return [4 /*yield*/, runEmbeddedPiAgent({
                            sessionId: "session:test",
                            sessionKey: "agent:test:mismatch",
                            sessionFile: node_path_1.default.join(workspaceDir, "session.jsonl"),
                            workspaceDir: workspaceDir,
                            agentDir: agentDir,
                            config: makeConfig(),
                            prompt: "hello",
                            provider: "openai",
                            model: "mock-1",
                            authProfileId: "anthropic:default",
                            authProfileIdSource: "user",
                            timeoutMs: 5000,
                            runId: "run:mismatch",
                        })];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(runEmbeddedAttemptMock).toHaveBeenCalledTimes(1);
                    return [3 /*break*/, 9];
                case 6: return [4 /*yield*/, promises_1.default.rm(agentDir, { recursive: true, force: true })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.rm(workspaceDir, { recursive: true, force: true })];
                case 8:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips profiles in cooldown during initial selection", function () { return __awaiter(void 0, void 0, void 0, function () {
        var agentDir, workspaceDir, now, authPath, payload, stored, _a, _b;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, , 12, 13]);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-agent-"))];
                case 2:
                    agentDir = _g.sent();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-workspace-"))];
                case 3:
                    workspaceDir = _g.sent();
                    now = Date.now();
                    vitest_1.vi.setSystemTime(now);
                    _g.label = 4;
                case 4:
                    _g.trys.push([4, , 8, 11]);
                    authPath = node_path_1.default.join(agentDir, "auth-profiles.json");
                    payload = {
                        version: 1,
                        profiles: {
                            "openai:p1": { type: "api_key", provider: "openai", key: "sk-one" },
                            "openai:p2": { type: "api_key", provider: "openai", key: "sk-two" },
                        },
                        usageStats: {
                            "openai:p1": { lastUsed: 1, cooldownUntil: now + 60 * 60 * 1000 }, // p1 in cooldown for 1 hour
                            "openai:p2": { lastUsed: 2 },
                        },
                    };
                    return [4 /*yield*/, promises_1.default.writeFile(authPath, JSON.stringify(payload))];
                case 5:
                    _g.sent();
                    runEmbeddedAttemptMock.mockResolvedValueOnce(makeAttempt({
                        assistantTexts: ["ok"],
                        lastAssistant: buildAssistant({
                            stopReason: "stop",
                            content: [{ type: "text", text: "ok" }],
                        }),
                    }));
                    return [4 /*yield*/, runEmbeddedPiAgent({
                            sessionId: "session:test",
                            sessionKey: "agent:test:skip-cooldown",
                            sessionFile: node_path_1.default.join(workspaceDir, "session.jsonl"),
                            workspaceDir: workspaceDir,
                            agentDir: agentDir,
                            config: makeConfig(),
                            prompt: "hello",
                            provider: "openai",
                            model: "mock-1",
                            authProfileId: undefined,
                            authProfileIdSource: "auto",
                            timeoutMs: 5000,
                            runId: "run:skip-cooldown",
                        })];
                case 6:
                    _g.sent();
                    (0, vitest_1.expect)(runEmbeddedAttemptMock).toHaveBeenCalledTimes(1);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(agentDir, "auth-profiles.json"), "utf-8")];
                case 7:
                    stored = _b.apply(_a, [_g.sent()]);
                    (0, vitest_1.expect)((_d = (_c = stored.usageStats) === null || _c === void 0 ? void 0 : _c["openai:p1"]) === null || _d === void 0 ? void 0 : _d.cooldownUntil).toBe(now + 60 * 60 * 1000);
                    (0, vitest_1.expect)(typeof ((_f = (_e = stored.usageStats) === null || _e === void 0 ? void 0 : _e["openai:p2"]) === null || _f === void 0 ? void 0 : _f.lastUsed)).toBe("number");
                    return [3 /*break*/, 11];
                case 8: return [4 /*yield*/, promises_1.default.rm(agentDir, { recursive: true, force: true })];
                case 9:
                    _g.sent();
                    return [4 /*yield*/, promises_1.default.rm(workspaceDir, { recursive: true, force: true })];
                case 10:
                    _g.sent();
                    return [7 /*endfinally*/];
                case 11: return [3 /*break*/, 13];
                case 12:
                    vitest_1.vi.useRealTimers();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("fails over when all profiles are in cooldown and fallbacks are configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var agentDir, workspaceDir, now;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 11, 12]);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-agent-"))];
                case 2:
                    agentDir = _a.sent();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-workspace-"))];
                case 3:
                    workspaceDir = _a.sent();
                    now = Date.now();
                    vitest_1.vi.setSystemTime(now);
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, , 7, 10]);
                    return [4 /*yield*/, writeAuthStore(agentDir, {
                            usageStats: {
                                "openai:p1": { lastUsed: 1, cooldownUntil: now + 60 * 60 * 1000 },
                                "openai:p2": { lastUsed: 2, cooldownUntil: now + 60 * 60 * 1000 },
                            },
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(runEmbeddedPiAgent({
                            sessionId: "session:test",
                            sessionKey: "agent:test:cooldown-failover",
                            sessionFile: node_path_1.default.join(workspaceDir, "session.jsonl"),
                            workspaceDir: workspaceDir,
                            agentDir: agentDir,
                            config: makeConfig({ fallbacks: ["openai/mock-2"] }),
                            prompt: "hello",
                            provider: "openai",
                            model: "mock-1",
                            authProfileIdSource: "auto",
                            timeoutMs: 5000,
                            runId: "run:cooldown-failover",
                        })).rejects.toMatchObject({
                            name: "FailoverError",
                            reason: "rate_limit",
                            provider: "openai",
                            model: "mock-1",
                        })];
                case 6:
                    _a.sent();
                    (0, vitest_1.expect)(runEmbeddedAttemptMock).not.toHaveBeenCalled();
                    return [3 /*break*/, 10];
                case 7: return [4 /*yield*/, promises_1.default.rm(agentDir, { recursive: true, force: true })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.rm(workspaceDir, { recursive: true, force: true })];
                case 9:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 10: return [3 /*break*/, 12];
                case 11:
                    vitest_1.vi.useRealTimers();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("fails over when auth is unavailable and fallbacks are configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var agentDir, workspaceDir, previousOpenAiKey, authPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-agent-"))];
                case 1:
                    agentDir = _a.sent();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-workspace-"))];
                case 2:
                    workspaceDir = _a.sent();
                    previousOpenAiKey = process.env.OPENAI_API_KEY;
                    delete process.env.OPENAI_API_KEY;
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 6, 9]);
                    authPath = node_path_1.default.join(agentDir, "auth-profiles.json");
                    return [4 /*yield*/, promises_1.default.writeFile(authPath, JSON.stringify({ version: 1, profiles: {}, usageStats: {} }))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(runEmbeddedPiAgent({
                            sessionId: "session:test",
                            sessionKey: "agent:test:auth-unavailable",
                            sessionFile: node_path_1.default.join(workspaceDir, "session.jsonl"),
                            workspaceDir: workspaceDir,
                            agentDir: agentDir,
                            config: makeConfig({ fallbacks: ["openai/mock-2"], apiKey: "" }),
                            prompt: "hello",
                            provider: "openai",
                            model: "mock-1",
                            authProfileIdSource: "auto",
                            timeoutMs: 5000,
                            runId: "run:auth-unavailable",
                        })).rejects.toMatchObject({ name: "FailoverError", reason: "auth" })];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(runEmbeddedAttemptMock).not.toHaveBeenCalled();
                    return [3 /*break*/, 9];
                case 6:
                    if (previousOpenAiKey === undefined) {
                        delete process.env.OPENAI_API_KEY;
                    }
                    else {
                        process.env.OPENAI_API_KEY = previousOpenAiKey;
                    }
                    return [4 /*yield*/, promises_1.default.rm(agentDir, { recursive: true, force: true })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.rm(workspaceDir, { recursive: true, force: true })];
                case 8:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips profiles in cooldown when rotating after failure", function () { return __awaiter(void 0, void 0, void 0, function () {
        var agentDir, workspaceDir, now, authPath, payload, stored, _a, _b;
        var _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, , 12, 13]);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-agent-"))];
                case 2:
                    agentDir = _j.sent();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-workspace-"))];
                case 3:
                    workspaceDir = _j.sent();
                    now = Date.now();
                    vitest_1.vi.setSystemTime(now);
                    _j.label = 4;
                case 4:
                    _j.trys.push([4, , 8, 11]);
                    authPath = node_path_1.default.join(agentDir, "auth-profiles.json");
                    payload = {
                        version: 1,
                        profiles: {
                            "openai:p1": { type: "api_key", provider: "openai", key: "sk-one" },
                            "openai:p2": { type: "api_key", provider: "openai", key: "sk-two" },
                            "openai:p3": { type: "api_key", provider: "openai", key: "sk-three" },
                        },
                        usageStats: {
                            "openai:p1": { lastUsed: 1 },
                            "openai:p2": { cooldownUntil: now + 60 * 60 * 1000 }, // p2 in cooldown
                            "openai:p3": { lastUsed: 3 },
                        },
                    };
                    return [4 /*yield*/, promises_1.default.writeFile(authPath, JSON.stringify(payload))];
                case 5:
                    _j.sent();
                    runEmbeddedAttemptMock
                        .mockResolvedValueOnce(makeAttempt({
                        assistantTexts: [],
                        lastAssistant: buildAssistant({
                            stopReason: "error",
                            errorMessage: "rate limit",
                        }),
                    }))
                        .mockResolvedValueOnce(makeAttempt({
                        assistantTexts: ["ok"],
                        lastAssistant: buildAssistant({
                            stopReason: "stop",
                            content: [{ type: "text", text: "ok" }],
                        }),
                    }));
                    return [4 /*yield*/, runEmbeddedPiAgent({
                            sessionId: "session:test",
                            sessionKey: "agent:test:rotate-skip-cooldown",
                            sessionFile: node_path_1.default.join(workspaceDir, "session.jsonl"),
                            workspaceDir: workspaceDir,
                            agentDir: agentDir,
                            config: makeConfig(),
                            prompt: "hello",
                            provider: "openai",
                            model: "mock-1",
                            authProfileId: "openai:p1",
                            authProfileIdSource: "auto",
                            timeoutMs: 5000,
                            runId: "run:rotate-skip-cooldown",
                        })];
                case 6:
                    _j.sent();
                    (0, vitest_1.expect)(runEmbeddedAttemptMock).toHaveBeenCalledTimes(2);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(agentDir, "auth-profiles.json"), "utf-8")];
                case 7:
                    stored = _b.apply(_a, [_j.sent()]);
                    (0, vitest_1.expect)(typeof ((_d = (_c = stored.usageStats) === null || _c === void 0 ? void 0 : _c["openai:p1"]) === null || _d === void 0 ? void 0 : _d.lastUsed)).toBe("number");
                    (0, vitest_1.expect)(typeof ((_f = (_e = stored.usageStats) === null || _e === void 0 ? void 0 : _e["openai:p3"]) === null || _f === void 0 ? void 0 : _f.lastUsed)).toBe("number");
                    (0, vitest_1.expect)((_h = (_g = stored.usageStats) === null || _g === void 0 ? void 0 : _g["openai:p2"]) === null || _h === void 0 ? void 0 : _h.cooldownUntil).toBe(now + 60 * 60 * 1000);
                    return [3 /*break*/, 11];
                case 8: return [4 /*yield*/, promises_1.default.rm(agentDir, { recursive: true, force: true })];
                case 9:
                    _j.sent();
                    return [4 /*yield*/, promises_1.default.rm(workspaceDir, { recursive: true, force: true })];
                case 10:
                    _j.sent();
                    return [7 /*endfinally*/];
                case 11: return [3 /*break*/, 13];
                case 12:
                    vitest_1.vi.useRealTimers();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); });
});
