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
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var temp_home_js_1 = require("../../test/helpers/temp-home.js");
var model_catalog_js_1 = require("../agents/model-catalog.js");
var pi_embedded_js_1 = require("../agents/pi-embedded.js");
var sessions_js_1 = require("../config/sessions.js");
var system_events_js_1 = require("../infra/system-events.js");
var reply_js_1 = require("./reply.js");
var MAIN_SESSION_KEY = "agent:main:main";
vitest_1.vi.mock("../agents/pi-embedded.js", function () { return ({
    abortEmbeddedPiRun: vitest_1.vi.fn().mockReturnValue(false),
    runEmbeddedPiAgent: vitest_1.vi.fn(),
    queueEmbeddedPiMessage: vitest_1.vi.fn().mockReturnValue(false),
    resolveEmbeddedSessionLane: function (key) { return "session:".concat(key.trim() || "main"); },
    isEmbeddedPiRunActive: vitest_1.vi.fn().mockReturnValue(false),
    isEmbeddedPiRunStreaming: vitest_1.vi.fn().mockReturnValue(false),
}); });
vitest_1.vi.mock("../agents/model-catalog.js", function () { return ({
    loadModelCatalog: vitest_1.vi.fn(),
}); });
function withTempHome(fn) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, temp_home_js_1.withTempHome)(function (home) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fn(home)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); }, {
                    env: {
                        OPENCLAW_AGENT_DIR: function (home) { return node_path_1.default.join(home, ".openclaw", "agent"); },
                        PI_CODING_AGENT_DIR: function (home) { return node_path_1.default.join(home, ".openclaw", "agent"); },
                    },
                    prefix: "openclaw-reply-",
                })];
        });
    });
}
function assertModelSelection(storePath, selection) {
    if (selection === void 0) { selection = {}; }
    var store = (0, sessions_js_1.loadSessionStore)(storePath);
    var entry = store[MAIN_SESSION_KEY];
    (0, vitest_1.expect)(entry).toBeDefined();
    (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.modelOverride).toBe(selection.model);
    (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.providerOverride).toBe(selection.provider);
}
(0, vitest_1.describe)("directive behavior", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
        vitest_1.vi.mocked(model_catalog_js_1.loadModelCatalog).mockResolvedValue([
            { id: "claude-opus-4-5", name: "Opus 4.5", provider: "anthropic" },
            { id: "claude-sonnet-4-1", name: "Sonnet 4.1", provider: "anthropic" },
            { id: "gpt-4.1-mini", name: "GPT-4.1 Mini", provider: "openai" },
        ]);
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)("prefers alias matches when fuzzy selection is ambiguous", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, res, text;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
                                    storePath = node_path_1.default.join(home, "sessions.json");
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({ Body: "/model ki", From: "+1222", To: "+1222", CommandAuthorized: true }, {}, {
                                            agents: {
                                                defaults: {
                                                    model: { primary: "anthropic/claude-opus-4-5" },
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                    models: {
                                                        "anthropic/claude-opus-4-5": {},
                                                        "moonshot/kimi-k2-0905-preview": { alias: "Kimi" },
                                                        "lmstudio/kimi-k2-0905-preview": {},
                                                    },
                                                },
                                            },
                                            models: {
                                                mode: "merge",
                                                providers: {
                                                    moonshot: {
                                                        baseUrl: "https://api.moonshot.ai/v1",
                                                        apiKey: "sk-test",
                                                        api: "openai-completions",
                                                        models: [{ id: "kimi-k2-0905-preview", name: "Kimi K2" }],
                                                    },
                                                    lmstudio: {
                                                        baseUrl: "http://127.0.0.1:1234/v1",
                                                        apiKey: "lmstudio",
                                                        api: "openai-responses",
                                                        models: [{ id: "kimi-k2-0905-preview", name: "Kimi K2 (Local)" }],
                                                    },
                                                },
                                            },
                                            session: { store: storePath },
                                        })];
                                case 1:
                                    res = _b.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)(text).toContain("Model set to Kimi (moonshot/kimi-k2-0905-preview).");
                                    assertModelSelection(storePath, {
                                        provider: "moonshot",
                                        model: "kimi-k2-0905-preview",
                                    });
                                    (0, vitest_1.expect)(pi_embedded_js_1.runEmbeddedPiAgent).not.toHaveBeenCalled();
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
    (0, vitest_1.it)("stores auth profile overrides on /model directive", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, authDir, res, text, store, entry;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
                                    storePath = node_path_1.default.join(home, "sessions.json");
                                    authDir = node_path_1.default.join(home, ".openclaw", "agents", "main", "agent");
                                    return [4 /*yield*/, promises_1.default.mkdir(authDir, { recursive: true, mode: 448 })];
                                case 1:
                                    _b.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(authDir, "auth-profiles.json"), JSON.stringify({
                                            version: 1,
                                            profiles: {
                                                "anthropic:work": {
                                                    type: "api_key",
                                                    provider: "anthropic",
                                                    key: "sk-test-1234567890",
                                                },
                                            },
                                        }, null, 2))];
                                case 2:
                                    _b.sent();
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({ Body: "/model Opus@anthropic:work", From: "+1222", To: "+1222", CommandAuthorized: true }, {}, {
                                            agents: {
                                                defaults: {
                                                    model: { primary: "openai/gpt-4.1-mini" },
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                    models: {
                                                        "openai/gpt-4.1-mini": {},
                                                        "anthropic/claude-opus-4-5": { alias: "Opus" },
                                                    },
                                                },
                                            },
                                            session: { store: storePath },
                                        })];
                                case 3:
                                    res = _b.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)(text).toContain("Auth profile set to anthropic:work");
                                    store = (0, sessions_js_1.loadSessionStore)(storePath);
                                    entry = store["agent:main:main"];
                                    (0, vitest_1.expect)(entry.authProfileOverride).toBe("anthropic:work");
                                    (0, vitest_1.expect)(pi_embedded_js_1.runEmbeddedPiAgent).not.toHaveBeenCalled();
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
    (0, vitest_1.it)("queues a system event when switching models", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, events;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    (0, system_events_js_1.drainSystemEvents)(MAIN_SESSION_KEY);
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
                                    storePath = node_path_1.default.join(home, "sessions.json");
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({ Body: "/model Opus", From: "+1222", To: "+1222", CommandAuthorized: true }, {}, {
                                            agents: {
                                                defaults: {
                                                    model: { primary: "openai/gpt-4.1-mini" },
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                    models: {
                                                        "openai/gpt-4.1-mini": {},
                                                        "anthropic/claude-opus-4-5": { alias: "Opus" },
                                                    },
                                                },
                                            },
                                            session: { store: storePath },
                                        })];
                                case 1:
                                    _a.sent();
                                    events = (0, system_events_js_1.drainSystemEvents)(MAIN_SESSION_KEY);
                                    (0, vitest_1.expect)(events).toContain("Model switched to Opus (anthropic/claude-opus-4-5).");
                                    (0, vitest_1.expect)(pi_embedded_js_1.runEmbeddedPiAgent).not.toHaveBeenCalled();
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
    (0, vitest_1.it)("queues a system event when toggling elevated", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, events;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    (0, system_events_js_1.drainSystemEvents)(MAIN_SESSION_KEY);
                                    storePath = node_path_1.default.join(home, "sessions.json");
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/elevated on",
                                            From: "+1222",
                                            To: "+1222",
                                            Provider: "whatsapp",
                                            CommandAuthorized: true,
                                        }, {}, {
                                            agents: {
                                                defaults: {
                                                    model: { primary: "openai/gpt-4.1-mini" },
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                },
                                            },
                                            tools: { elevated: { allowFrom: { whatsapp: ["*"] } } },
                                            channels: { whatsapp: { allowFrom: ["*"] } },
                                            session: { store: storePath },
                                        })];
                                case 1:
                                    _a.sent();
                                    events = (0, system_events_js_1.drainSystemEvents)(MAIN_SESSION_KEY);
                                    (0, vitest_1.expect)(events.some(function (e) { return e.includes("Elevated ASK"); })).toBe(true);
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
    (0, vitest_1.it)("queues a system event when toggling reasoning", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, events;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    (0, system_events_js_1.drainSystemEvents)(MAIN_SESSION_KEY);
                                    storePath = node_path_1.default.join(home, "sessions.json");
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/reasoning stream",
                                            From: "+1222",
                                            To: "+1222",
                                            Provider: "whatsapp",
                                            CommandAuthorized: true,
                                        }, {}, {
                                            agents: {
                                                defaults: {
                                                    model: { primary: "openai/gpt-4.1-mini" },
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                },
                                            },
                                            channels: { whatsapp: { allowFrom: ["*"] } },
                                            session: { store: storePath },
                                        })];
                                case 1:
                                    _a.sent();
                                    events = (0, system_events_js_1.drainSystemEvents)(MAIN_SESSION_KEY);
                                    (0, vitest_1.expect)(events.some(function (e) { return e.includes("Reasoning STREAM"); })).toBe(true);
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
