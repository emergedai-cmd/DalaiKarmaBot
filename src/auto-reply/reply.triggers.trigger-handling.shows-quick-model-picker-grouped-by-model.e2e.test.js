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
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var normalize_text_js_1 = require("../../test/helpers/normalize-text.js");
var temp_home_js_1 = require("../../test/helpers/temp-home.js");
vitest_1.vi.mock("../agents/pi-embedded.js", function () { return ({
    abortEmbeddedPiRun: vitest_1.vi.fn().mockReturnValue(false),
    compactEmbeddedPiSession: vitest_1.vi.fn(),
    runEmbeddedPiAgent: vitest_1.vi.fn(),
    queueEmbeddedPiMessage: vitest_1.vi.fn().mockReturnValue(false),
    resolveEmbeddedSessionLane: function (key) { return "session:".concat(key.trim() || "main"); },
    isEmbeddedPiRunActive: vitest_1.vi.fn().mockReturnValue(false),
    isEmbeddedPiRunStreaming: vitest_1.vi.fn().mockReturnValue(false),
}); });
var usageMocks = vitest_1.vi.hoisted(function () { return ({
    loadProviderUsageSummary: vitest_1.vi.fn().mockResolvedValue({
        updatedAt: 0,
        providers: [],
    }),
    formatUsageSummaryLine: vitest_1.vi.fn().mockReturnValue("📊 Usage: Claude 80% left"),
    resolveUsageProviderId: vitest_1.vi.fn(function (provider) { return provider.split("/")[0]; }),
}); });
vitest_1.vi.mock("../infra/provider-usage.js", function () { return usageMocks; });
var modelCatalogMocks = vitest_1.vi.hoisted(function () { return ({
    loadModelCatalog: vitest_1.vi.fn().mockResolvedValue([
        {
            provider: "anthropic",
            id: "claude-opus-4-5",
            name: "Claude Opus 4.5",
            contextWindow: 200000,
        },
        {
            provider: "openrouter",
            id: "anthropic/claude-opus-4-5",
            name: "Claude Opus 4.5 (OpenRouter)",
            contextWindow: 200000,
        },
        { provider: "openai", id: "gpt-4.1-mini", name: "GPT-4.1 mini" },
        { provider: "openai", id: "gpt-5.2", name: "GPT-5.2" },
        { provider: "openai-codex", id: "gpt-5.2", name: "GPT-5.2 (Codex)" },
        { provider: "minimax", id: "MiniMax-M2.1", name: "MiniMax M2.1" },
    ]),
    resetModelCatalogCacheForTest: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../agents/model-catalog.js", function () { return modelCatalogMocks; });
var pi_embedded_js_1 = require("../agents/pi-embedded.js");
var sessions_js_1 = require("../config/sessions.js");
var reply_js_1 = require("./reply.js");
var _MAIN_SESSION_KEY = "agent:main:main";
var webMocks = vitest_1.vi.hoisted(function () { return ({
    webAuthExists: vitest_1.vi.fn().mockResolvedValue(true),
    getWebAuthAgeMs: vitest_1.vi.fn().mockReturnValue(120000),
    readWebSelfId: vitest_1.vi.fn().mockReturnValue({ e164: "+1999" }),
}); });
vitest_1.vi.mock("../web/session.js", function () { return webMocks; });
function withTempHome(fn) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, temp_home_js_1.withTempHome)(function (home) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockClear();
                                vitest_1.vi.mocked(pi_embedded_js_1.abortEmbeddedPiRun).mockClear();
                                return [4 /*yield*/, fn(home)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); }, { prefix: "openclaw-triggers-" })];
        });
    });
}
function makeCfg(home) {
    return {
        agents: {
            defaults: {
                model: "anthropic/claude-opus-4-5",
                workspace: (0, node_path_1.join)(home, "openclaw"),
            },
        },
        channels: {
            whatsapp: {
                allowFrom: ["*"],
            },
        },
        session: { store: (0, node_path_1.join)(home, "sessions.json") },
    };
}
(0, vitest_1.afterEach)(function () {
    vitest_1.vi.restoreAllMocks();
});
(0, vitest_1.describe)("trigger handling", function () {
    (0, vitest_1.it)("shows a /model summary and points to /models", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var cfg, res, text, normalized;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    cfg = makeCfg(home);
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/model",
                                            From: "telegram:111",
                                            To: "telegram:111",
                                            ChatType: "direct",
                                            Provider: "telegram",
                                            Surface: "telegram",
                                            SessionKey: "telegram:slash:111",
                                            CommandAuthorized: true,
                                        }, {}, cfg)];
                                case 1:
                                    res = _b.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    normalized = (0, normalize_text_js_1.normalizeTestText)(text !== null && text !== void 0 ? text : "");
                                    (0, vitest_1.expect)(normalized).toContain("Current: anthropic/claude-opus-4-5");
                                    (0, vitest_1.expect)(normalized).toContain("Switch: /model <provider/model>");
                                    (0, vitest_1.expect)(normalized).toContain("Browse: /models (providers) or /models <provider> (models)");
                                    (0, vitest_1.expect)(normalized).toContain("More: /model status");
                                    (0, vitest_1.expect)(normalized).not.toContain("reasoning");
                                    (0, vitest_1.expect)(normalized).not.toContain("image");
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
    (0, vitest_1.it)("aliases /model list to /models", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var cfg, res, text, normalized;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    cfg = makeCfg(home);
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/model list",
                                            From: "telegram:111",
                                            To: "telegram:111",
                                            ChatType: "direct",
                                            Provider: "telegram",
                                            Surface: "telegram",
                                            SessionKey: "telegram:slash:111",
                                            CommandAuthorized: true,
                                        }, {}, cfg)];
                                case 1:
                                    res = _b.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    normalized = (0, normalize_text_js_1.normalizeTestText)(text !== null && text !== void 0 ? text : "");
                                    (0, vitest_1.expect)(normalized).toContain("Providers:");
                                    (0, vitest_1.expect)(normalized).toContain("Use: /models <provider>");
                                    (0, vitest_1.expect)(normalized).toContain("Switch: /model <provider/model>");
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
    (0, vitest_1.it)("selects the exact provider/model pair for openrouter", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var cfg, sessionKey, res, text, store;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    cfg = makeCfg(home);
                                    sessionKey = "telegram:slash:111";
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/model openrouter/anthropic/claude-opus-4-5",
                                            From: "telegram:111",
                                            To: "telegram:111",
                                            ChatType: "direct",
                                            Provider: "telegram",
                                            Surface: "telegram",
                                            SessionKey: sessionKey,
                                            CommandAuthorized: true,
                                        }, {}, cfg)];
                                case 1:
                                    res = _d.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)((0, normalize_text_js_1.normalizeTestText)(text !== null && text !== void 0 ? text : "")).toContain("Model set to openrouter/anthropic/claude-opus-4-5");
                                    store = (0, sessions_js_1.loadSessionStore)(cfg.session.store);
                                    (0, vitest_1.expect)((_b = store[sessionKey]) === null || _b === void 0 ? void 0 : _b.providerOverride).toBe("openrouter");
                                    (0, vitest_1.expect)((_c = store[sessionKey]) === null || _c === void 0 ? void 0 : _c.modelOverride).toBe("anthropic/claude-opus-4-5");
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
    (0, vitest_1.it)("rejects invalid /model <#> selections", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var cfg, sessionKey, res, text, normalized, store;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    cfg = makeCfg(home);
                                    sessionKey = "telegram:slash:111";
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/model 99",
                                            From: "telegram:111",
                                            To: "telegram:111",
                                            ChatType: "direct",
                                            Provider: "telegram",
                                            Surface: "telegram",
                                            SessionKey: sessionKey,
                                            CommandAuthorized: true,
                                        }, {}, cfg)];
                                case 1:
                                    res = _d.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    normalized = (0, normalize_text_js_1.normalizeTestText)(text !== null && text !== void 0 ? text : "");
                                    (0, vitest_1.expect)(normalized).toContain("Numeric model selection is not supported in chat.");
                                    (0, vitest_1.expect)(normalized).toContain("Browse: /models or /models <provider>");
                                    (0, vitest_1.expect)(normalized).toContain("Switch: /model <provider/model>");
                                    store = (0, sessions_js_1.loadSessionStore)(cfg.session.store);
                                    (0, vitest_1.expect)((_b = store[sessionKey]) === null || _b === void 0 ? void 0 : _b.providerOverride).toBeUndefined();
                                    (0, vitest_1.expect)((_c = store[sessionKey]) === null || _c === void 0 ? void 0 : _c.modelOverride).toBeUndefined();
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
    (0, vitest_1.it)("resets to the default model via /model <provider/model>", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var cfg, sessionKey, res, text, store;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    cfg = makeCfg(home);
                                    sessionKey = "telegram:slash:111";
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/model anthropic/claude-opus-4-5",
                                            From: "telegram:111",
                                            To: "telegram:111",
                                            ChatType: "direct",
                                            Provider: "telegram",
                                            Surface: "telegram",
                                            SessionKey: sessionKey,
                                            CommandAuthorized: true,
                                        }, {}, cfg)];
                                case 1:
                                    res = _d.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)((0, normalize_text_js_1.normalizeTestText)(text !== null && text !== void 0 ? text : "")).toContain("Model reset to default (anthropic/claude-opus-4-5)");
                                    store = (0, sessions_js_1.loadSessionStore)(cfg.session.store);
                                    // When selecting the default, overrides are cleared
                                    (0, vitest_1.expect)((_b = store[sessionKey]) === null || _b === void 0 ? void 0 : _b.providerOverride).toBeUndefined();
                                    (0, vitest_1.expect)((_c = store[sessionKey]) === null || _c === void 0 ? void 0 : _c.modelOverride).toBeUndefined();
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
    (0, vitest_1.it)("selects a model via /model <provider/model>", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var cfg, sessionKey, res, text, store;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    cfg = makeCfg(home);
                                    sessionKey = "telegram:slash:111";
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/model openai/gpt-5.2",
                                            From: "telegram:111",
                                            To: "telegram:111",
                                            ChatType: "direct",
                                            Provider: "telegram",
                                            Surface: "telegram",
                                            SessionKey: sessionKey,
                                            CommandAuthorized: true,
                                        }, {}, cfg)];
                                case 1:
                                    res = _d.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)((0, normalize_text_js_1.normalizeTestText)(text !== null && text !== void 0 ? text : "")).toContain("Model set to openai/gpt-5.2");
                                    store = (0, sessions_js_1.loadSessionStore)(cfg.session.store);
                                    (0, vitest_1.expect)((_b = store[sessionKey]) === null || _b === void 0 ? void 0 : _b.providerOverride).toBe("openai");
                                    (0, vitest_1.expect)((_c = store[sessionKey]) === null || _c === void 0 ? void 0 : _c.modelOverride).toBe("gpt-5.2");
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
