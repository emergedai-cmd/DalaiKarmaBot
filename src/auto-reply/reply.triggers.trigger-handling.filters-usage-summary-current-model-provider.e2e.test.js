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
    formatUsageWindowSummary: vitest_1.vi.fn().mockReturnValue("Claude 80% left"),
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
function readSessionStore(home) {
    return __awaiter(this, void 0, void 0, function () {
        var raw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(home, "sessions.json"), "utf-8")];
                case 1:
                    raw = _a.sent();
                    return [2 /*return*/, JSON.parse(raw)];
            }
        });
    });
}
function pickFirstStoreEntry(store) {
    var entries = Object.values(store);
    return entries[0];
}
(0, vitest_1.afterEach)(function () {
    vitest_1.vi.restoreAllMocks();
});
(0, vitest_1.describe)("trigger handling", function () {
    (0, vitest_1.it)("filters usage summary to the current model provider", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var res, text;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    usageMocks.loadProviderUsageSummary.mockClear();
                                    usageMocks.loadProviderUsageSummary.mockResolvedValue({
                                        updatedAt: 0,
                                        providers: [
                                            {
                                                provider: "anthropic",
                                                displayName: "Anthropic",
                                                windows: [
                                                    {
                                                        label: "5h",
                                                        usedPercent: 20,
                                                    },
                                                ],
                                            },
                                        ],
                                    });
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/status",
                                            From: "+1000",
                                            To: "+2000",
                                            Provider: "whatsapp",
                                            SenderE164: "+1000",
                                            CommandAuthorized: true,
                                        }, {}, makeCfg(home))];
                                case 1:
                                    res = _b.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)((0, normalize_text_js_1.normalizeTestText)(text !== null && text !== void 0 ? text : "")).toContain("Usage: Claude 80% left");
                                    (0, vitest_1.expect)(usageMocks.loadProviderUsageSummary).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ providers: ["anthropic"] }));
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
    (0, vitest_1.it)("emits /status once (no duplicate inline + final)", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var blockReplies, res, replies;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    blockReplies = [];
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/status",
                                            From: "+1000",
                                            To: "+2000",
                                            Provider: "whatsapp",
                                            SenderE164: "+1000",
                                            CommandAuthorized: true,
                                        }, {
                                            onBlockReply: function (payload) { return __awaiter(void 0, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    blockReplies.push(payload);
                                                    return [2 /*return*/];
                                                });
                                            }); },
                                        }, makeCfg(home))];
                                case 1:
                                    res = _c.sent();
                                    replies = res ? (Array.isArray(res) ? res : [res]) : [];
                                    (0, vitest_1.expect)(blockReplies.length).toBe(0);
                                    (0, vitest_1.expect)(replies.length).toBe(1);
                                    (0, vitest_1.expect)(String((_b = (_a = replies[0]) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "")).toContain("Model:");
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
    (0, vitest_1.it)("sets per-response usage footer via /usage", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var blockReplies, res, replies;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    blockReplies = [];
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/usage tokens",
                                            From: "+1000",
                                            To: "+2000",
                                            Provider: "whatsapp",
                                            SenderE164: "+1000",
                                            CommandAuthorized: true,
                                        }, {
                                            onBlockReply: function (payload) { return __awaiter(void 0, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    blockReplies.push(payload);
                                                    return [2 /*return*/];
                                                });
                                            }); },
                                        }, makeCfg(home))];
                                case 1:
                                    res = _c.sent();
                                    replies = res ? (Array.isArray(res) ? res : [res]) : [];
                                    (0, vitest_1.expect)(blockReplies.length).toBe(0);
                                    (0, vitest_1.expect)(replies.length).toBe(1);
                                    (0, vitest_1.expect)(String((_b = (_a = replies[0]) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "")).toContain("Usage footer: tokens");
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
    (0, vitest_1.it)("cycles /usage modes and persists to the session store", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var cfg, r1, s1, r2, s2, r3, s3;
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                        return __generator(this, function (_k) {
                            switch (_k.label) {
                                case 0:
                                    cfg = makeCfg(home);
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/usage",
                                            From: "+1000",
                                            To: "+2000",
                                            Provider: "whatsapp",
                                            SenderE164: "+1000",
                                            CommandAuthorized: true,
                                        }, undefined, cfg)];
                                case 1:
                                    r1 = _k.sent();
                                    (0, vitest_1.expect)(String((_b = (Array.isArray(r1) ? (_a = r1[0]) === null || _a === void 0 ? void 0 : _a.text : r1 === null || r1 === void 0 ? void 0 : r1.text)) !== null && _b !== void 0 ? _b : "")).toContain("Usage footer: tokens");
                                    return [4 /*yield*/, readSessionStore(home)];
                                case 2:
                                    s1 = _k.sent();
                                    (0, vitest_1.expect)((_c = pickFirstStoreEntry(s1)) === null || _c === void 0 ? void 0 : _c.responseUsage).toBe("tokens");
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/usage",
                                            From: "+1000",
                                            To: "+2000",
                                            Provider: "whatsapp",
                                            SenderE164: "+1000",
                                            CommandAuthorized: true,
                                        }, undefined, cfg)];
                                case 3:
                                    r2 = _k.sent();
                                    (0, vitest_1.expect)(String((_e = (Array.isArray(r2) ? (_d = r2[0]) === null || _d === void 0 ? void 0 : _d.text : r2 === null || r2 === void 0 ? void 0 : r2.text)) !== null && _e !== void 0 ? _e : "")).toContain("Usage footer: full");
                                    return [4 /*yield*/, readSessionStore(home)];
                                case 4:
                                    s2 = _k.sent();
                                    (0, vitest_1.expect)((_f = pickFirstStoreEntry(s2)) === null || _f === void 0 ? void 0 : _f.responseUsage).toBe("full");
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/usage",
                                            From: "+1000",
                                            To: "+2000",
                                            Provider: "whatsapp",
                                            SenderE164: "+1000",
                                            CommandAuthorized: true,
                                        }, undefined, cfg)];
                                case 5:
                                    r3 = _k.sent();
                                    (0, vitest_1.expect)(String((_h = (Array.isArray(r3) ? (_g = r3[0]) === null || _g === void 0 ? void 0 : _g.text : r3 === null || r3 === void 0 ? void 0 : r3.text)) !== null && _h !== void 0 ? _h : "")).toContain("Usage footer: off");
                                    return [4 /*yield*/, readSessionStore(home)];
                                case 6:
                                    s3 = _k.sent();
                                    (0, vitest_1.expect)((_j = pickFirstStoreEntry(s3)) === null || _j === void 0 ? void 0 : _j.responseUsage).toBeUndefined();
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
    (0, vitest_1.it)("treats /usage on as tokens (back-compat)", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var cfg, res, replies, store;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    cfg = makeCfg(home);
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/usage on",
                                            From: "+1000",
                                            To: "+2000",
                                            Provider: "whatsapp",
                                            SenderE164: "+1000",
                                            CommandAuthorized: true,
                                        }, undefined, cfg)];
                                case 1:
                                    res = _d.sent();
                                    replies = res ? (Array.isArray(res) ? res : [res]) : [];
                                    (0, vitest_1.expect)(replies.length).toBe(1);
                                    (0, vitest_1.expect)(String((_b = (_a = replies[0]) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "")).toContain("Usage footer: tokens");
                                    return [4 /*yield*/, readSessionStore(home)];
                                case 2:
                                    store = _d.sent();
                                    (0, vitest_1.expect)((_c = pickFirstStoreEntry(store)) === null || _c === void 0 ? void 0 : _c.responseUsage).toBe("tokens");
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
    (0, vitest_1.it)("sends one inline status and still returns agent reply for mixed text", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var blockReplies, res, replies, prompt;
                        var _a, _b, _c, _d, _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "agent says hi" }],
                                        meta: {
                                            durationMs: 1,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    blockReplies = [];
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "here we go /status now",
                                            From: "+1002",
                                            To: "+2000",
                                            Provider: "whatsapp",
                                            SenderE164: "+1002",
                                            CommandAuthorized: true,
                                        }, {
                                            onBlockReply: function (payload) { return __awaiter(void 0, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    blockReplies.push(payload);
                                                    return [2 /*return*/];
                                                });
                                            }); },
                                        }, makeCfg(home))];
                                case 1:
                                    res = _g.sent();
                                    replies = res ? (Array.isArray(res) ? res : [res]) : [];
                                    (0, vitest_1.expect)(blockReplies.length).toBe(1);
                                    (0, vitest_1.expect)(String((_b = (_a = blockReplies[0]) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "")).toContain("Model:");
                                    (0, vitest_1.expect)(replies.length).toBe(1);
                                    (0, vitest_1.expect)((_c = replies[0]) === null || _c === void 0 ? void 0 : _c.text).toBe("agent says hi");
                                    prompt = (_f = (_e = (_d = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls[0]) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.prompt) !== null && _f !== void 0 ? _f : "";
                                    (0, vitest_1.expect)(prompt).not.toContain("/status");
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
    (0, vitest_1.it)("aborts even with timestamp prefix", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var res, text;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                        Body: "[Dec 5 10:00] stop",
                                        From: "+1000",
                                        To: "+2000",
                                        CommandAuthorized: true,
                                    }, {}, makeCfg(home))];
                                case 1:
                                    res = _b.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)(text).toBe("⚙️ Agent was aborted.");
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
    (0, vitest_1.it)("handles /stop without invoking the agent", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var res, text;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                        Body: "/stop",
                                        From: "+1003",
                                        To: "+2000",
                                        CommandAuthorized: true,
                                    }, {}, makeCfg(home))];
                                case 1:
                                    res = _b.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)(text).toBe("⚙️ Agent was aborted.");
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
