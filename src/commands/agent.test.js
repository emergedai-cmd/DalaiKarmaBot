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
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var temp_home_js_1 = require("../../test/helpers/temp-home.js");
vitest_1.vi.mock("../agents/pi-embedded.js", function () { return ({
    abortEmbeddedPiRun: vitest_1.vi.fn().mockReturnValue(false),
    runEmbeddedPiAgent: vitest_1.vi.fn(),
    resolveEmbeddedSessionLane: function (key) { return "session:".concat(key.trim() || "main"); },
}); });
vitest_1.vi.mock("../agents/model-catalog.js", function () { return ({
    loadModelCatalog: vitest_1.vi.fn(),
}); });
var channel_js_1 = require("../../extensions/telegram/src/channel.js");
var runtime_js_1 = require("../../extensions/telegram/src/runtime.js");
var model_catalog_js_1 = require("../agents/model-catalog.js");
var pi_embedded_js_1 = require("../agents/pi-embedded.js");
var configModule = require("../config/config.js");
var agent_events_js_1 = require("../infra/agent-events.js");
var runtime_js_2 = require("../plugins/runtime.js");
var index_js_1 = require("../plugins/runtime/index.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var agent_js_1 = require("./agent.js");
var runtime = {
    log: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
    exit: vitest_1.vi.fn(function () {
        throw new Error("exit");
    }),
};
var configSpy = vitest_1.vi.spyOn(configModule, "loadConfig");
function withTempHome(fn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, temp_home_js_1.withTempHome)(fn, { prefix: "openclaw-agent-" })];
        });
    });
}
function mockConfig(home, storePath, agentOverrides, telegramOverrides, agentsList) {
    configSpy.mockReturnValue({
        agents: {
            defaults: __assign({ model: { primary: "anthropic/claude-opus-4-5" }, models: { "anthropic/claude-opus-4-5": {} }, workspace: node_path_1.default.join(home, "openclaw") }, agentOverrides),
            list: agentsList,
        },
        session: { store: storePath, mainKey: "main" },
        telegram: telegramOverrides ? __assign({}, telegramOverrides) : undefined,
    });
}
(0, vitest_1.beforeEach)(function () {
    vitest_1.vi.clearAllMocks();
    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
        payloads: [{ text: "ok" }],
        meta: {
            durationMs: 5,
            agentMeta: { sessionId: "s", provider: "p", model: "m" },
        },
    });
    vitest_1.vi.mocked(model_catalog_js_1.loadModelCatalog).mockResolvedValue([]);
});
(0, vitest_1.describe)("agentCommand", function () {
    (0, vitest_1.it)("creates a session entry when deriving from --to", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var store, saved, entry;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    store = node_path_1.default.join(home, "sessions.json");
                                    mockConfig(home, store);
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({ message: "hello", to: "+1555" }, runtime)];
                                case 1:
                                    _a.sent();
                                    saved = JSON.parse(node_fs_1.default.readFileSync(store, "utf-8"));
                                    entry = Object.values(saved)[0];
                                    (0, vitest_1.expect)(entry.sessionId).toBeTruthy();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("persists thinking and verbose overrides", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var store, saved, entry, callArgs;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    store = node_path_1.default.join(home, "sessions.json");
                                    mockConfig(home, store);
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({ message: "hi", to: "+1222", thinking: "high", verbose: "on" }, runtime)];
                                case 1:
                                    _b.sent();
                                    saved = JSON.parse(node_fs_1.default.readFileSync(store, "utf-8"));
                                    entry = Object.values(saved)[0];
                                    (0, vitest_1.expect)(entry.thinkingLevel).toBe("high");
                                    (0, vitest_1.expect)(entry.verboseLevel).toBe("on");
                                    callArgs = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                                    (0, vitest_1.expect)(callArgs === null || callArgs === void 0 ? void 0 : callArgs.thinkLevel).toBe("high");
                                    (0, vitest_1.expect)(callArgs === null || callArgs === void 0 ? void 0 : callArgs.verboseLevel).toBe("on");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("resumes when session-id is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var store, callArgs;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    store = node_path_1.default.join(home, "sessions.json");
                                    node_fs_1.default.mkdirSync(node_path_1.default.dirname(store), { recursive: true });
                                    node_fs_1.default.writeFileSync(store, JSON.stringify({
                                        foo: {
                                            sessionId: "session-123",
                                            updatedAt: Date.now(),
                                            systemSent: true,
                                        },
                                    }, null, 2));
                                    mockConfig(home, store);
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({ message: "resume me", sessionId: "session-123" }, runtime)];
                                case 1:
                                    _b.sent();
                                    callArgs = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                                    (0, vitest_1.expect)(callArgs === null || callArgs === void 0 ? void 0 : callArgs.sessionId).toBe("session-123");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not duplicate agent events from embedded runs", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var store, assistantEvents, stop, matching;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    store = node_path_1.default.join(home, "sessions.json");
                                    mockConfig(home, store);
                                    assistantEvents = [];
                                    stop = (0, agent_events_js_1.onAgentEvent)(function (evt) {
                                        var _a;
                                        if (evt.stream !== "assistant") {
                                            return;
                                        }
                                        assistantEvents.push({
                                            runId: evt.runId,
                                            text: typeof ((_a = evt.data) === null || _a === void 0 ? void 0 : _a.text) === "string" ? evt.data.text : undefined,
                                        });
                                    });
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockImplementationOnce(function (params) { return __awaiter(void 0, void 0, void 0, function () {
                                        var runId, data;
                                        var _a, _b, _c;
                                        return __generator(this, function (_d) {
                                            runId = (_a = params === null || params === void 0 ? void 0 : params.runId) !== null && _a !== void 0 ? _a : "run";
                                            data = { text: "hello", delta: "hello" };
                                            (_c = (_b = params).onAgentEvent) === null || _c === void 0 ? void 0 : _c.call(_b, { stream: "assistant", data: data });
                                            (0, agent_events_js_1.emitAgentEvent)({ runId: runId, stream: "assistant", data: data });
                                            return [2 /*return*/, {
                                                    payloads: [{ text: "hello" }],
                                                    meta: { agentMeta: { provider: "p", model: "m" } },
                                                }];
                                        });
                                    }); });
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({ message: "hi", to: "+1555" }, runtime)];
                                case 1:
                                    _a.sent();
                                    stop();
                                    matching = assistantEvents.filter(function (evt) { return evt.text === "hello"; });
                                    (0, vitest_1.expect)(matching).toHaveLength(1);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses provider/model from agents.defaults.model.primary", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var store, callArgs;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    store = node_path_1.default.join(home, "sessions.json");
                                    mockConfig(home, store, {
                                        model: { primary: "openai/gpt-4.1-mini" },
                                        models: {
                                            "anthropic/claude-opus-4-5": {},
                                            "openai/gpt-4.1-mini": {},
                                        },
                                    });
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({ message: "hi", to: "+1555" }, runtime)];
                                case 1:
                                    _b.sent();
                                    callArgs = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                                    (0, vitest_1.expect)(callArgs === null || callArgs === void 0 ? void 0 : callArgs.provider).toBe("openai");
                                    (0, vitest_1.expect)(callArgs === null || callArgs === void 0 ? void 0 : callArgs.model).toBe("gpt-4.1-mini");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps explicit sessionKey even when sessionId exists elsewhere", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var store, callArgs, saved;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    store = node_path_1.default.join(home, "sessions.json");
                                    node_fs_1.default.mkdirSync(node_path_1.default.dirname(store), { recursive: true });
                                    node_fs_1.default.writeFileSync(store, JSON.stringify({
                                        "agent:main:main": {
                                            sessionId: "sess-main",
                                            updatedAt: Date.now(),
                                        },
                                    }, null, 2));
                                    mockConfig(home, store);
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({
                                            message: "hi",
                                            sessionId: "sess-main",
                                            sessionKey: "agent:main:subagent:abc",
                                        }, runtime)];
                                case 1:
                                    _c.sent();
                                    callArgs = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                                    (0, vitest_1.expect)(callArgs === null || callArgs === void 0 ? void 0 : callArgs.sessionKey).toBe("agent:main:subagent:abc");
                                    saved = JSON.parse(node_fs_1.default.readFileSync(store, "utf-8"));
                                    (0, vitest_1.expect)((_b = saved["agent:main:subagent:abc"]) === null || _b === void 0 ? void 0 : _b.sessionId).toBe("sess-main");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("derives session key from --agent when no routing target is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var store, callArgs;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    store = node_path_1.default.join(home, "sessions.json");
                                    mockConfig(home, store, undefined, undefined, [{ id: "ops" }]);
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({ message: "hi", agentId: "ops" }, runtime)];
                                case 1:
                                    _b.sent();
                                    callArgs = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                                    (0, vitest_1.expect)(callArgs === null || callArgs === void 0 ? void 0 : callArgs.sessionKey).toBe("agent:ops:main");
                                    (0, vitest_1.expect)(callArgs === null || callArgs === void 0 ? void 0 : callArgs.sessionFile).toContain("".concat(node_path_1.default.sep, "agents").concat(node_path_1.default.sep, "ops").concat(node_path_1.default.sep, "sessions"));
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects unknown agent overrides", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var store;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    store = node_path_1.default.join(home, "sessions.json");
                                    mockConfig(home, store);
                                    return [4 /*yield*/, (0, vitest_1.expect)((0, agent_js_1.agentCommand)({ message: "hi", agentId: "ghost" }, runtime)).rejects.toThrow('Unknown agent id "ghost"')];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults thinking to low for reasoning-capable models", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var store, callArgs;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    store = node_path_1.default.join(home, "sessions.json");
                                    mockConfig(home, store);
                                    vitest_1.vi.mocked(model_catalog_js_1.loadModelCatalog).mockResolvedValueOnce([
                                        {
                                            id: "claude-opus-4-5",
                                            name: "Opus 4.5",
                                            provider: "anthropic",
                                            reasoning: true,
                                        },
                                    ]);
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({ message: "hi", to: "+1555" }, runtime)];
                                case 1:
                                    _b.sent();
                                    callArgs = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                                    (0, vitest_1.expect)(callArgs === null || callArgs === void 0 ? void 0 : callArgs.thinkLevel).toBe("low");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prints JSON payload when requested", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var store, logged, parsed;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "json-reply", mediaUrl: "http://x.test/a.jpg" }],
                                        meta: {
                                            durationMs: 42,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    store = node_path_1.default.join(home, "sessions.json");
                                    mockConfig(home, store);
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({ message: "hi", to: "+1999", json: true }, runtime)];
                                case 1:
                                    _b.sent();
                                    logged = (_a = runtime.log.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                                    parsed = JSON.parse(logged);
                                    (0, vitest_1.expect)(parsed.payloads[0].text).toBe("json-reply");
                                    (0, vitest_1.expect)(parsed.payloads[0].mediaUrl).toBe("http://x.test/a.jpg");
                                    (0, vitest_1.expect)(parsed.meta.durationMs).toBe(42);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes the message through as the agent prompt", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var store, callArgs;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    store = node_path_1.default.join(home, "sessions.json");
                                    mockConfig(home, store);
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({ message: "ping", to: "+1333" }, runtime)];
                                case 1:
                                    _b.sent();
                                    callArgs = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                                    (0, vitest_1.expect)(callArgs === null || callArgs === void 0 ? void 0 : callArgs.prompt).toBe("ping");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes through telegram accountId when delivering", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var store, deps, prevTelegramToken;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    store = node_path_1.default.join(home, "sessions.json");
                                    mockConfig(home, store, undefined, { botToken: "t-1" });
                                    (0, runtime_js_1.setTelegramRuntime)((0, index_js_1.createPluginRuntime)());
                                    (0, runtime_js_2.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([{ pluginId: "telegram", plugin: channel_js_1.telegramPlugin, source: "test" }]));
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn().mockResolvedValue({ messageId: "t1", chatId: "123" }),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    prevTelegramToken = process.env.TELEGRAM_BOT_TOKEN;
                                    process.env.TELEGRAM_BOT_TOKEN = "";
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, , 3, 4]);
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({
                                            message: "hi",
                                            to: "123",
                                            deliver: true,
                                            channel: "telegram",
                                        }, runtime, deps)];
                                case 2:
                                    _a.sent();
                                    (0, vitest_1.expect)(deps.sendMessageTelegram).toHaveBeenCalledWith("123", "ok", vitest_1.expect.objectContaining({ accountId: undefined, verbose: false }));
                                    return [3 /*break*/, 4];
                                case 3:
                                    if (prevTelegramToken === undefined) {
                                        delete process.env.TELEGRAM_BOT_TOKEN;
                                    }
                                    else {
                                        process.env.TELEGRAM_BOT_TOKEN = prevTelegramToken;
                                    }
                                    return [7 /*endfinally*/];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses reply channel as the message channel context", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var store, callArgs;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    store = node_path_1.default.join(home, "sessions.json");
                                    mockConfig(home, store, undefined, undefined, [{ id: "ops" }]);
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({ message: "hi", agentId: "ops", replyChannel: "slack" }, runtime)];
                                case 1:
                                    _b.sent();
                                    callArgs = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                                    (0, vitest_1.expect)(callArgs === null || callArgs === void 0 ? void 0 : callArgs.messageChannel).toBe("slack");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers runContext for embedded routing", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var store, callArgs;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    store = node_path_1.default.join(home, "sessions.json");
                                    mockConfig(home, store);
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({
                                            message: "hi",
                                            to: "+1555",
                                            channel: "whatsapp",
                                            runContext: { messageChannel: "slack", accountId: "acct-2" },
                                        }, runtime)];
                                case 1:
                                    _b.sent();
                                    callArgs = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                                    (0, vitest_1.expect)(callArgs === null || callArgs === void 0 ? void 0 : callArgs.messageChannel).toBe("slack");
                                    (0, vitest_1.expect)(callArgs === null || callArgs === void 0 ? void 0 : callArgs.agentAccountId).toBe("acct-2");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("forwards accountId to embedded runs", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var store, callArgs;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    store = node_path_1.default.join(home, "sessions.json");
                                    mockConfig(home, store);
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({ message: "hi", to: "+1555", accountId: "kev" }, runtime)];
                                case 1:
                                    _b.sent();
                                    callArgs = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                                    (0, vitest_1.expect)(callArgs === null || callArgs === void 0 ? void 0 : callArgs.agentAccountId).toBe("kev");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("logs output when delivery is disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var store;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    store = node_path_1.default.join(home, "sessions.json");
                                    mockConfig(home, store, undefined, undefined, [{ id: "ops" }]);
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({ message: "hi", agentId: "ops" }, runtime)];
                                case 1:
                                    _a.sent();
                                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledWith("ok");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
