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
require("./test-helpers/fast-coding-tools.js");
var models_config_js_1 = require("./models-config.js");
vitest_1.vi.mock("@mariozechner/pi-ai", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual, buildAssistantMessage, buildAssistantErrorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("@mariozechner/pi-ai")];
            case 1:
                actual = _a.sent();
                buildAssistantMessage = function (model) { return ({
                    role: "assistant",
                    content: [{ type: "text", text: "ok" }],
                    stopReason: "stop",
                    api: model.api,
                    provider: model.provider,
                    model: model.id,
                    usage: {
                        input: 1,
                        output: 1,
                        cacheRead: 0,
                        cacheWrite: 0,
                        totalTokens: 2,
                        cost: {
                            input: 0,
                            output: 0,
                            cacheRead: 0,
                            cacheWrite: 0,
                            total: 0,
                        },
                    },
                    timestamp: Date.now(),
                }); };
                buildAssistantErrorMessage = function (model) { return ({
                    role: "assistant",
                    content: [],
                    stopReason: "error",
                    errorMessage: "boom",
                    api: model.api,
                    provider: model.provider,
                    model: model.id,
                    usage: {
                        input: 0,
                        output: 0,
                        cacheRead: 0,
                        cacheWrite: 0,
                        totalTokens: 0,
                        cost: {
                            input: 0,
                            output: 0,
                            cacheRead: 0,
                            cacheWrite: 0,
                            total: 0,
                        },
                    },
                    timestamp: Date.now(),
                }); };
                return [2 /*return*/, __assign(__assign({}, actual), { complete: function (model) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (model.id === "mock-error") {
                                    return [2 /*return*/, buildAssistantErrorMessage(model)];
                                }
                                return [2 /*return*/, buildAssistantMessage(model)];
                            });
                        }); }, completeSimple: function (model) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (model.id === "mock-error") {
                                    return [2 /*return*/, buildAssistantErrorMessage(model)];
                                }
                                return [2 /*return*/, buildAssistantMessage(model)];
                            });
                        }); }, streamSimple: function (model) {
                            var stream = new actual.AssistantMessageEventStream();
                            queueMicrotask(function () {
                                stream.push({
                                    type: "done",
                                    reason: "stop",
                                    message: model.id === "mock-error"
                                        ? buildAssistantErrorMessage(model)
                                        : buildAssistantMessage(model),
                                });
                                stream.end();
                            });
                            return stream;
                        } })];
        }
    });
}); });
var runEmbeddedPiAgent;
var tempRoot;
var agentDir;
var workspaceDir;
var sessionCounter = 0;
(0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vitest_1.vi.useRealTimers();
                return [4 /*yield*/, Promise.resolve().then(function () { return require("./pi-embedded-runner.js"); })];
            case 1:
                (runEmbeddedPiAgent = (_a.sent()).runEmbeddedPiAgent);
                return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-embedded-agent-"))];
            case 2:
                tempRoot = _a.sent();
                agentDir = node_path_1.default.join(tempRoot, "agent");
                workspaceDir = node_path_1.default.join(tempRoot, "workspace");
                return [4 /*yield*/, promises_1.default.mkdir(agentDir, { recursive: true })];
            case 3:
                _a.sent();
                return [4 /*yield*/, promises_1.default.mkdir(workspaceDir, { recursive: true })];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, 20000);
(0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!tempRoot) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, promises_1.default.rm(tempRoot, { recursive: true, force: true })];
            case 1:
                _a.sent();
                tempRoot = undefined;
                return [2 /*return*/];
        }
    });
}); });
var makeOpenAiConfig = function (modelIds) {
    return ({
        models: {
            providers: {
                openai: {
                    api: "openai-responses",
                    apiKey: "sk-test",
                    baseUrl: "https://example.com",
                    models: modelIds.map(function (id) { return ({
                        id: id,
                        name: "Mock ".concat(id),
                        reasoning: false,
                        input: ["text"],
                        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                        contextWindow: 16000,
                        maxTokens: 2048,
                    }); }),
                },
            },
        },
    });
};
var ensureModels = function (cfg) { return (0, models_config_js_1.ensureOpenClawModelsJson)(cfg, agentDir); };
var nextSessionFile = function () {
    sessionCounter += 1;
    return node_path_1.default.join(workspaceDir, "session-".concat(sessionCounter, ".jsonl"));
};
var testSessionKey = "agent:test:embedded";
var immediateEnqueue = function (task) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, task()];
}); }); };
var textFromContent = function (content) {
    var _a;
    if (typeof content === "string") {
        return content;
    }
    if (Array.isArray(content) && ((_a = content[0]) === null || _a === void 0 ? void 0 : _a.type) === "text") {
        return content[0].text;
    }
    return undefined;
};
var readSessionMessages = function (sessionFile) { return __awaiter(void 0, void 0, void 0, function () {
    var raw;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, promises_1.default.readFile(sessionFile, "utf-8")];
            case 1:
                raw = _a.sent();
                return [2 /*return*/, raw
                        .split(/\r?\n/)
                        .filter(Boolean)
                        .map(function (line) {
                        return JSON.parse(line);
                    })
                        .filter(function (entry) { return entry.type === "message"; })
                        .map(function (entry) { return entry.message; })];
        }
    });
}); };
(0, vitest_1.describe)("runEmbeddedPiAgent", function () {
    var itIfNotWin32 = process.platform === "win32" ? vitest_1.it.skip : vitest_1.it;
    (0, vitest_1.it)("writes models.json into the provided agentDir", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionFile, cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionFile = nextSessionFile();
                    cfg = {
                        models: {
                            providers: {
                                minimax: {
                                    baseUrl: "https://api.minimax.io/anthropic",
                                    api: "anthropic-messages",
                                    apiKey: "sk-minimax-test",
                                    models: [
                                        {
                                            id: "MiniMax-M2.1",
                                            name: "MiniMax M2.1",
                                            reasoning: false,
                                            input: ["text"],
                                            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                                            contextWindow: 200000,
                                            maxTokens: 8192,
                                        },
                                    ],
                                },
                            },
                        },
                    };
                    return [4 /*yield*/, (0, vitest_1.expect)(runEmbeddedPiAgent({
                            sessionId: "session:test",
                            sessionKey: testSessionKey,
                            sessionFile: sessionFile,
                            workspaceDir: workspaceDir,
                            config: cfg,
                            prompt: "hi",
                            provider: "definitely-not-a-provider",
                            model: "definitely-not-a-model",
                            timeoutMs: 1,
                            agentDir: agentDir,
                            enqueue: immediateEnqueue,
                        })).rejects.toThrow(/Unknown model:/)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.stat(node_path_1.default.join(agentDir, "models.json"))).resolves.toBeTruthy()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    itIfNotWin32("persists the first user message before assistant output", { timeout: 120000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionFile, cfg, messages, firstUserIndex, firstAssistantIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionFile = nextSessionFile();
                    cfg = makeOpenAiConfig(["mock-1"]);
                    return [4 /*yield*/, ensureModels(cfg)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, runEmbeddedPiAgent({
                            sessionId: "session:test",
                            sessionKey: testSessionKey,
                            sessionFile: sessionFile,
                            workspaceDir: workspaceDir,
                            config: cfg,
                            prompt: "hello",
                            provider: "openai",
                            model: "mock-1",
                            timeoutMs: 5000,
                            agentDir: agentDir,
                            enqueue: immediateEnqueue,
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, readSessionMessages(sessionFile)];
                case 3:
                    messages = _a.sent();
                    firstUserIndex = messages.findIndex(function (message) { return (message === null || message === void 0 ? void 0 : message.role) === "user" && textFromContent(message.content) === "hello"; });
                    firstAssistantIndex = messages.findIndex(function (message) { return (message === null || message === void 0 ? void 0 : message.role) === "assistant"; });
                    (0, vitest_1.expect)(firstUserIndex).toBeGreaterThanOrEqual(0);
                    if (firstAssistantIndex !== -1) {
                        (0, vitest_1.expect)(firstUserIndex).toBeLessThan(firstAssistantIndex);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("persists the user message when prompt fails before assistant output", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionFile, cfg, result, messages, userIndex;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sessionFile = nextSessionFile();
                    cfg = makeOpenAiConfig(["mock-error"]);
                    return [4 /*yield*/, ensureModels(cfg)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, runEmbeddedPiAgent({
                            sessionId: "session:test",
                            sessionKey: testSessionKey,
                            sessionFile: sessionFile,
                            workspaceDir: workspaceDir,
                            config: cfg,
                            prompt: "boom",
                            provider: "openai",
                            model: "mock-error",
                            timeoutMs: 5000,
                            agentDir: agentDir,
                            enqueue: immediateEnqueue,
                        })];
                case 2:
                    result = _b.sent();
                    (0, vitest_1.expect)((_a = result.payloads[0]) === null || _a === void 0 ? void 0 : _a.isError).toBe(true);
                    return [4 /*yield*/, readSessionMessages(sessionFile)];
                case 3:
                    messages = _b.sent();
                    userIndex = messages.findIndex(function (message) { return (message === null || message === void 0 ? void 0 : message.role) === "user" && textFromContent(message.content) === "boom"; });
                    (0, vitest_1.expect)(userIndex).toBeGreaterThanOrEqual(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("appends new user + assistant after existing transcript entries", { timeout: 90000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var SessionManager, sessionFile, sessionManager, cfg, messages, seedUserIndex, seedAssistantIndex, newUserIndex, newAssistantIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("@mariozechner/pi-coding-agent"); })];
                case 1:
                    SessionManager = (_a.sent()).SessionManager;
                    sessionFile = nextSessionFile();
                    sessionManager = SessionManager.open(sessionFile);
                    sessionManager.appendMessage({
                        role: "user",
                        content: [{ type: "text", text: "seed user" }],
                    });
                    sessionManager.appendMessage({
                        role: "assistant",
                        content: [{ type: "text", text: "seed assistant" }],
                        stopReason: "stop",
                        api: "openai-responses",
                        provider: "openai",
                        model: "mock-1",
                        usage: {
                            input: 1,
                            output: 1,
                            cacheRead: 0,
                            cacheWrite: 0,
                            totalTokens: 2,
                            cost: {
                                input: 0,
                                output: 0,
                                cacheRead: 0,
                                cacheWrite: 0,
                                total: 0,
                            },
                        },
                        timestamp: Date.now(),
                    });
                    cfg = makeOpenAiConfig(["mock-1"]);
                    return [4 /*yield*/, ensureModels(cfg)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, runEmbeddedPiAgent({
                            sessionId: "session:test",
                            sessionKey: testSessionKey,
                            sessionFile: sessionFile,
                            workspaceDir: workspaceDir,
                            config: cfg,
                            prompt: "hello",
                            provider: "openai",
                            model: "mock-1",
                            timeoutMs: 5000,
                            agentDir: agentDir,
                            enqueue: immediateEnqueue,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, readSessionMessages(sessionFile)];
                case 4:
                    messages = _a.sent();
                    seedUserIndex = messages.findIndex(function (message) { return (message === null || message === void 0 ? void 0 : message.role) === "user" && textFromContent(message.content) === "seed user"; });
                    seedAssistantIndex = messages.findIndex(function (message) {
                        return (message === null || message === void 0 ? void 0 : message.role) === "assistant" && textFromContent(message.content) === "seed assistant";
                    });
                    newUserIndex = messages.findIndex(function (message) { return (message === null || message === void 0 ? void 0 : message.role) === "user" && textFromContent(message.content) === "hello"; });
                    newAssistantIndex = messages.findIndex(function (message, index) { return index > newUserIndex && (message === null || message === void 0 ? void 0 : message.role) === "assistant"; });
                    (0, vitest_1.expect)(seedUserIndex).toBeGreaterThanOrEqual(0);
                    (0, vitest_1.expect)(seedAssistantIndex).toBeGreaterThan(seedUserIndex);
                    (0, vitest_1.expect)(newUserIndex).toBeGreaterThan(seedAssistantIndex);
                    (0, vitest_1.expect)(newAssistantIndex).toBeGreaterThan(newUserIndex);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("persists multi-turn user/assistant ordering across runs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionFile, cfg, messages, firstUserIndex, firstAssistantIndex, secondUserIndex, secondAssistantIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionFile = nextSessionFile();
                    cfg = makeOpenAiConfig(["mock-1"]);
                    return [4 /*yield*/, ensureModels(cfg)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, runEmbeddedPiAgent({
                            sessionId: "session:test",
                            sessionKey: testSessionKey,
                            sessionFile: sessionFile,
                            workspaceDir: workspaceDir,
                            config: cfg,
                            prompt: "first",
                            provider: "openai",
                            model: "mock-1",
                            timeoutMs: 5000,
                            agentDir: agentDir,
                            enqueue: immediateEnqueue,
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, runEmbeddedPiAgent({
                            sessionId: "session:test",
                            sessionKey: testSessionKey,
                            sessionFile: sessionFile,
                            workspaceDir: workspaceDir,
                            config: cfg,
                            prompt: "second",
                            provider: "openai",
                            model: "mock-1",
                            timeoutMs: 5000,
                            agentDir: agentDir,
                            enqueue: immediateEnqueue,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, readSessionMessages(sessionFile)];
                case 4:
                    messages = _a.sent();
                    firstUserIndex = messages.findIndex(function (message) { return (message === null || message === void 0 ? void 0 : message.role) === "user" && textFromContent(message.content) === "first"; });
                    firstAssistantIndex = messages.findIndex(function (message, index) { return index > firstUserIndex && (message === null || message === void 0 ? void 0 : message.role) === "assistant"; });
                    secondUserIndex = messages.findIndex(function (message, index) {
                        return index > firstAssistantIndex &&
                            (message === null || message === void 0 ? void 0 : message.role) === "user" &&
                            textFromContent(message.content) === "second";
                    });
                    secondAssistantIndex = messages.findIndex(function (message, index) { return index > secondUserIndex && (message === null || message === void 0 ? void 0 : message.role) === "assistant"; });
                    (0, vitest_1.expect)(firstUserIndex).toBeGreaterThanOrEqual(0);
                    (0, vitest_1.expect)(firstAssistantIndex).toBeGreaterThan(firstUserIndex);
                    (0, vitest_1.expect)(secondUserIndex).toBeGreaterThan(firstAssistantIndex);
                    (0, vitest_1.expect)(secondAssistantIndex).toBeGreaterThan(secondUserIndex);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("repairs orphaned user messages and continues", function () { return __awaiter(void 0, void 0, void 0, function () {
        var SessionManager, sessionFile, sessionManager, cfg, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("@mariozechner/pi-coding-agent"); })];
                case 1:
                    SessionManager = (_c.sent()).SessionManager;
                    sessionFile = nextSessionFile();
                    sessionManager = SessionManager.open(sessionFile);
                    sessionManager.appendMessage({
                        role: "user",
                        content: [{ type: "text", text: "orphaned user" }],
                    });
                    cfg = makeOpenAiConfig(["mock-1"]);
                    return [4 /*yield*/, ensureModels(cfg)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, runEmbeddedPiAgent({
                            sessionId: "session:test",
                            sessionKey: testSessionKey,
                            sessionFile: sessionFile,
                            workspaceDir: workspaceDir,
                            config: cfg,
                            prompt: "hello",
                            provider: "openai",
                            model: "mock-1",
                            timeoutMs: 5000,
                            agentDir: agentDir,
                            enqueue: immediateEnqueue,
                        })];
                case 3:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.meta.error).toBeUndefined();
                    (0, vitest_1.expect)((_b = (_a = result.payloads) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("repairs orphaned single-user sessions and continues", function () { return __awaiter(void 0, void 0, void 0, function () {
        var SessionManager, sessionFile, sessionManager, cfg, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("@mariozechner/pi-coding-agent"); })];
                case 1:
                    SessionManager = (_c.sent()).SessionManager;
                    sessionFile = nextSessionFile();
                    sessionManager = SessionManager.open(sessionFile);
                    sessionManager.appendMessage({
                        role: "user",
                        content: [{ type: "text", text: "solo user" }],
                    });
                    cfg = makeOpenAiConfig(["mock-1"]);
                    return [4 /*yield*/, ensureModels(cfg)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, runEmbeddedPiAgent({
                            sessionId: "session:test",
                            sessionKey: testSessionKey,
                            sessionFile: sessionFile,
                            workspaceDir: workspaceDir,
                            config: cfg,
                            prompt: "hello",
                            provider: "openai",
                            model: "mock-1",
                            timeoutMs: 5000,
                            agentDir: agentDir,
                            enqueue: immediateEnqueue,
                        })];
                case 3:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.meta.error).toBeUndefined();
                    (0, vitest_1.expect)((_b = (_a = result.payloads) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
