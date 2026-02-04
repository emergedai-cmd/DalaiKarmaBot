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
var temp_home_js_1 = require("../../test/helpers/temp-home.js");
var model_catalog_js_1 = require("../agents/model-catalog.js");
var pi_embedded_js_1 = require("../agents/pi-embedded.js");
var reply_js_1 = require("./reply.js");
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
                    prefix: "openclaw-rawbody-",
                })];
        });
    });
}
(0, vitest_1.describe)("RawBody directive parsing", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
        vitest_1.vi.mocked(model_catalog_js_1.loadModelCatalog).mockResolvedValue([
            { id: "claude-opus-4-5", name: "Opus 4.5", provider: "anthropic" },
        ]);
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)("/model, /think, /verbose directives detected from RawBody even when Body has structural wrapper", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var groupMessageCtx, res, text;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
                                    groupMessageCtx = {
                                        Body: "[Chat messages since your last reply - for context]\\n[WhatsApp ...] Someone: hello\\n\\n[Current message - respond to this]\\n[WhatsApp ...] Jake: /think:high\\n[from: Jake McInteer (+6421807830)]",
                                        RawBody: "/think:high",
                                        From: "+1222",
                                        To: "+1222",
                                        ChatType: "group",
                                        CommandAuthorized: true,
                                    };
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)(groupMessageCtx, {}, {
                                            agents: {
                                                defaults: {
                                                    model: "anthropic/claude-opus-4-5",
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                },
                                            },
                                            channels: { whatsapp: { allowFrom: ["*"] } },
                                            session: { store: node_path_1.default.join(home, "sessions.json") },
                                        })];
                                case 1:
                                    res = _b.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)(text).toContain("Thinking level set to high.");
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
    (0, vitest_1.it)("/model status detected from RawBody", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var groupMessageCtx, res, text;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
                                    groupMessageCtx = {
                                        Body: "[Context]\nJake: /model status\n[from: Jake]",
                                        RawBody: "/model status",
                                        From: "+1222",
                                        To: "+1222",
                                        ChatType: "group",
                                        CommandAuthorized: true,
                                    };
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)(groupMessageCtx, {}, {
                                            agents: {
                                                defaults: {
                                                    model: "anthropic/claude-opus-4-5",
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                    models: {
                                                        "anthropic/claude-opus-4-5": {},
                                                    },
                                                },
                                            },
                                            channels: { whatsapp: { allowFrom: ["*"] } },
                                            session: { store: node_path_1.default.join(home, "sessions.json") },
                                        })];
                                case 1:
                                    res = _b.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)(text).toContain("anthropic/claude-opus-4-5");
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
    (0, vitest_1.it)("CommandBody is honored when RawBody is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var groupMessageCtx, res, text;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
                                    groupMessageCtx = {
                                        Body: "[Context]\nJake: /verbose on\n[from: Jake]",
                                        CommandBody: "/verbose on",
                                        From: "+1222",
                                        To: "+1222",
                                        ChatType: "group",
                                        CommandAuthorized: true,
                                    };
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)(groupMessageCtx, {}, {
                                            agents: {
                                                defaults: {
                                                    model: "anthropic/claude-opus-4-5",
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                },
                                            },
                                            channels: { whatsapp: { allowFrom: ["*"] } },
                                            session: { store: node_path_1.default.join(home, "sessions.json") },
                                        })];
                                case 1:
                                    res = _b.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)(text).toContain("Verbose logging enabled.");
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
    (0, vitest_1.it)("Integration: WhatsApp group message with structural wrapper and RawBody command", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var groupMessageCtx, res, text;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
                                    groupMessageCtx = {
                                        Body: "[Chat messages since your last reply - for context]\\n[WhatsApp ...] Someone: hello\\n\\n[Current message - respond to this]\\n[WhatsApp ...] Jake: /status\\n[from: Jake McInteer (+6421807830)]",
                                        RawBody: "/status",
                                        ChatType: "group",
                                        From: "+1222",
                                        To: "+1222",
                                        SessionKey: "agent:main:whatsapp:group:g1",
                                        Provider: "whatsapp",
                                        Surface: "whatsapp",
                                        SenderE164: "+1222",
                                        CommandAuthorized: true,
                                    };
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)(groupMessageCtx, {}, {
                                            agents: {
                                                defaults: {
                                                    model: "anthropic/claude-opus-4-5",
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                },
                                            },
                                            channels: { whatsapp: { allowFrom: ["+1222"] } },
                                            session: { store: node_path_1.default.join(home, "sessions.json") },
                                        })];
                                case 1:
                                    res = _b.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)(text).toContain("Session: agent:main:whatsapp:group:g1");
                                    (0, vitest_1.expect)(text).toContain("anthropic/claude-opus-4-5");
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
    (0, vitest_1.it)("preserves history when RawBody is provided for command parsing", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var groupMessageCtx, res, text, prompt;
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "ok" }],
                                        meta: {
                                            durationMs: 1,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    groupMessageCtx = {
                                        Body: [
                                            "[Chat messages since your last reply - for context]",
                                            "[WhatsApp ...] Peter: hello",
                                            "",
                                            "[Current message - respond to this]",
                                            "[WhatsApp ...] Jake: /think:high status please",
                                            "[from: Jake McInteer (+6421807830)]",
                                        ].join("\n"),
                                        RawBody: "/think:high status please",
                                        From: "+1222",
                                        To: "+1222",
                                        ChatType: "group",
                                        CommandAuthorized: true,
                                    };
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)(groupMessageCtx, {}, {
                                            agents: {
                                                defaults: {
                                                    model: "anthropic/claude-opus-4-5",
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                },
                                            },
                                            channels: { whatsapp: { allowFrom: ["*"] } },
                                            session: { store: node_path_1.default.join(home, "sessions.json") },
                                        })];
                                case 1:
                                    res = _e.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)(text).toBe("ok");
                                    (0, vitest_1.expect)(pi_embedded_js_1.runEmbeddedPiAgent).toHaveBeenCalledOnce();
                                    prompt = (_d = (_c = (_b = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls[0]) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.prompt) !== null && _d !== void 0 ? _d : "";
                                    (0, vitest_1.expect)(prompt).toContain("[Chat messages since your last reply - for context]");
                                    (0, vitest_1.expect)(prompt).toContain("Peter: hello");
                                    (0, vitest_1.expect)(prompt).toContain("status please");
                                    (0, vitest_1.expect)(prompt).not.toContain("/think:high");
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
