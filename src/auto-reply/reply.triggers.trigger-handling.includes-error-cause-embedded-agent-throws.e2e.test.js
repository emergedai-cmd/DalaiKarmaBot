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
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
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
var reply_js_1 = require("./reply.js");
var tokens_js_1 = require("./tokens.js");
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
    (0, vitest_1.it)("includes the error cause when the embedded agent throws", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var res, text;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockRejectedValue(new Error("sandbox is not defined."));
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "hello",
                                            From: "+1002",
                                            To: "+2000",
                                        }, {}, makeCfg(home))];
                                case 1:
                                    res = _b.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)(text).toBe("⚠️ Agent failed before reply: sandbox is not defined.\nLogs: openclaw logs --follow");
                                    (0, vitest_1.expect)(pi_embedded_js_1.runEmbeddedPiAgent).toHaveBeenCalledOnce();
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
    (0, vitest_1.it)("uses heartbeat model override for heartbeat runs", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var cfg, call;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "ok" }],
                                        meta: {
                                            durationMs: 1,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    cfg = makeCfg(home);
                                    cfg.agents = __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults), { heartbeat: { model: "anthropic/claude-haiku-4-5-20251001" } }) });
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "hello",
                                            From: "+1002",
                                            To: "+2000",
                                        }, { isHeartbeat: true }, cfg)];
                                case 1:
                                    _c.sent();
                                    call = (_b = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls[0]) === null || _b === void 0 ? void 0 : _b[0];
                                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.provider).toBe("anthropic");
                                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.model).toBe("claude-haiku-4-5-20251001");
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
    (0, vitest_1.it)("suppresses HEARTBEAT_OK replies outside heartbeat runs", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: tokens_js_1.HEARTBEAT_TOKEN }],
                                        meta: {
                                            durationMs: 1,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "hello",
                                            From: "+1002",
                                            To: "+2000",
                                        }, {}, makeCfg(home))];
                                case 1:
                                    res = _a.sent();
                                    (0, vitest_1.expect)(res).toBeUndefined();
                                    (0, vitest_1.expect)(pi_embedded_js_1.runEmbeddedPiAgent).toHaveBeenCalledOnce();
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
    (0, vitest_1.it)("strips HEARTBEAT_OK at edges outside heartbeat runs", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var res, text;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "".concat(tokens_js_1.HEARTBEAT_TOKEN, " hello") }],
                                        meta: {
                                            durationMs: 1,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "hello",
                                            From: "+1002",
                                            To: "+2000",
                                        }, {}, makeCfg(home))];
                                case 1:
                                    res = _b.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)(text).toBe("hello");
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
    (0, vitest_1.it)("updates group activation when the owner sends /activation", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var cfg, res, text, store, _a, _b;
                        var _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    cfg = makeCfg(home);
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/activation always",
                                            From: "123@g.us",
                                            To: "+2000",
                                            ChatType: "group",
                                            Provider: "whatsapp",
                                            SenderE164: "+2000",
                                            CommandAuthorized: true,
                                        }, {}, cfg)];
                                case 1:
                                    res = _e.sent();
                                    text = Array.isArray(res) ? (_c = res[0]) === null || _c === void 0 ? void 0 : _c.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)(text).toContain("Group activation set to always");
                                    _b = (_a = JSON).parse;
                                    return [4 /*yield*/, promises_1.default.readFile(cfg.session.store, "utf-8")];
                                case 2:
                                    store = _b.apply(_a, [_e.sent()]);
                                    (0, vitest_1.expect)((_d = store["agent:main:whatsapp:group:123@g.us"]) === null || _d === void 0 ? void 0 : _d.groupActivation).toBe("always");
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
});
