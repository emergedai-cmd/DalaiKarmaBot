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
var reply_js_1 = require("./reply.js");
var MAIN_SESSION_KEY = "agent:main:main";
function writeSkill(params) {
    return __awaiter(this, void 0, void 0, function () {
        var workspaceDir, name, description, skillDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    workspaceDir = params.workspaceDir, name = params.name, description = params.description;
                    skillDir = node_path_1.default.join(workspaceDir, "skills", name);
                    return [4 /*yield*/, promises_1.default.mkdir(skillDir, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(skillDir, "SKILL.md"), "---\nname: ".concat(name, "\ndescription: ").concat(description, "\n---\n\n# ").concat(name, "\n"), "utf-8")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
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
function _assertModelSelection(storePath, selection) {
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
    (0, vitest_1.it)("accepts /thinking xhigh for codex models", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, res, texts;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    storePath = node_path_1.default.join(home, "sessions.json");
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/thinking xhigh",
                                            From: "+1004",
                                            To: "+2000",
                                            CommandAuthorized: true,
                                        }, {}, {
                                            agents: {
                                                defaults: {
                                                    model: "openai-codex/gpt-5.2-codex",
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                },
                                            },
                                            channels: { whatsapp: { allowFrom: ["*"] } },
                                            session: { store: storePath },
                                        })];
                                case 1:
                                    res = _a.sent();
                                    texts = (Array.isArray(res) ? res : [res]).map(function (entry) { return entry === null || entry === void 0 ? void 0 : entry.text; }).filter(Boolean);
                                    (0, vitest_1.expect)(texts).toContain("Thinking level set to xhigh.");
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
    (0, vitest_1.it)("accepts /thinking xhigh for openai gpt-5.2", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, res, texts;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    storePath = node_path_1.default.join(home, "sessions.json");
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/thinking xhigh",
                                            From: "+1004",
                                            To: "+2000",
                                            CommandAuthorized: true,
                                        }, {}, {
                                            agents: {
                                                defaults: {
                                                    model: "openai/gpt-5.2",
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                },
                                            },
                                            channels: { whatsapp: { allowFrom: ["*"] } },
                                            session: { store: storePath },
                                        })];
                                case 1:
                                    res = _a.sent();
                                    texts = (Array.isArray(res) ? res : [res]).map(function (entry) { return entry === null || entry === void 0 ? void 0 : entry.text; }).filter(Boolean);
                                    (0, vitest_1.expect)(texts).toContain("Thinking level set to xhigh.");
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
    (0, vitest_1.it)("rejects /thinking xhigh for non-codex models", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, res, texts;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    storePath = node_path_1.default.join(home, "sessions.json");
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/thinking xhigh",
                                            From: "+1004",
                                            To: "+2000",
                                            CommandAuthorized: true,
                                        }, {}, {
                                            agents: {
                                                defaults: {
                                                    model: "openai/gpt-4.1-mini",
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                },
                                            },
                                            channels: { whatsapp: { allowFrom: ["*"] } },
                                            session: { store: storePath },
                                        })];
                                case 1:
                                    res = _a.sent();
                                    texts = (Array.isArray(res) ? res : [res]).map(function (entry) { return entry === null || entry === void 0 ? void 0 : entry.text; }).filter(Boolean);
                                    (0, vitest_1.expect)(texts).toContain('Thinking level "xhigh" is only supported for openai/gpt-5.2, openai-codex/gpt-5.2-codex or openai-codex/gpt-5.1-codex.');
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
    (0, vitest_1.it)("keeps reserved command aliases from matching after trimming", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var res, text;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/help",
                                            From: "+1222",
                                            To: "+1222",
                                            CommandAuthorized: true,
                                        }, {}, {
                                            agents: {
                                                defaults: {
                                                    model: "anthropic/claude-opus-4-5",
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                    models: {
                                                        "anthropic/claude-opus-4-5": { alias: " help " },
                                                    },
                                                },
                                            },
                                            channels: { whatsapp: { allowFrom: ["*"] } },
                                            session: { store: node_path_1.default.join(home, "sessions.json") },
                                        })];
                                case 1:
                                    res = _b.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)(text).toContain("Help");
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
    (0, vitest_1.it)("treats skill commands as reserved for model aliases", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var workspace, prompt;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
                                    workspace = node_path_1.default.join(home, "openclaw");
                                    return [4 /*yield*/, writeSkill({
                                            workspaceDir: workspace,
                                            name: "demo-skill",
                                            description: "Demo skill",
                                        })];
                                case 1:
                                    _d.sent();
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/demo_skill",
                                            From: "+1222",
                                            To: "+1222",
                                            CommandAuthorized: true,
                                        }, {}, {
                                            agents: {
                                                defaults: {
                                                    model: "anthropic/claude-opus-4-5",
                                                    workspace: workspace,
                                                    models: {
                                                        "anthropic/claude-opus-4-5": { alias: "demo_skill" },
                                                    },
                                                },
                                            },
                                            channels: { whatsapp: { allowFrom: ["*"] } },
                                            session: { store: node_path_1.default.join(home, "sessions.json") },
                                        })];
                                case 2:
                                    _d.sent();
                                    (0, vitest_1.expect)(pi_embedded_js_1.runEmbeddedPiAgent).toHaveBeenCalled();
                                    prompt = (_c = (_b = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.prompt) !== null && _c !== void 0 ? _c : "";
                                    (0, vitest_1.expect)(prompt).toContain('Use the "demo-skill" skill');
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
    (0, vitest_1.it)("errors on invalid queue options", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var res, text;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/queue collect debounce:bogus cap:zero drop:maybe",
                                            From: "+1222",
                                            To: "+1222",
                                            CommandAuthorized: true,
                                        }, {}, {
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
                                    (0, vitest_1.expect)(text).toContain("Invalid debounce");
                                    (0, vitest_1.expect)(text).toContain("Invalid cap");
                                    (0, vitest_1.expect)(text).toContain("Invalid drop policy");
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
    (0, vitest_1.it)("shows current queue settings when /queue has no arguments", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var res, text;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "/queue",
                                            From: "+1222",
                                            To: "+1222",
                                            Provider: "whatsapp",
                                            CommandAuthorized: true,
                                        }, {}, {
                                            agents: {
                                                defaults: {
                                                    model: "anthropic/claude-opus-4-5",
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                },
                                            },
                                            messages: {
                                                queue: {
                                                    mode: "collect",
                                                    debounceMs: 1500,
                                                    cap: 9,
                                                    drop: "summarize",
                                                },
                                            },
                                            channels: { whatsapp: { allowFrom: ["*"] } },
                                            session: { store: node_path_1.default.join(home, "sessions.json") },
                                        })];
                                case 1:
                                    res = _b.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)(text).toContain("Current queue settings: mode=collect, debounce=1500ms, cap=9, drop=summarize.");
                                    (0, vitest_1.expect)(text).toContain("Options: modes steer, followup, collect, steer+backlog, interrupt; debounce:<ms|s|m>, cap:<n>, drop:old|new|summarize.");
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
    (0, vitest_1.it)("shows current think level when /think has no argument", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var res, text;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({ Body: "/think", From: "+1222", To: "+1222", CommandAuthorized: true }, {}, {
                                            agents: {
                                                defaults: {
                                                    model: "anthropic/claude-opus-4-5",
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                    thinkingDefault: "high",
                                                },
                                            },
                                            session: { store: node_path_1.default.join(home, "sessions.json") },
                                        })];
                                case 1:
                                    res = _b.sent();
                                    text = Array.isArray(res) ? (_a = res[0]) === null || _a === void 0 ? void 0 : _a.text : res === null || res === void 0 ? void 0 : res.text;
                                    (0, vitest_1.expect)(text).toContain("Current thinking level: high");
                                    (0, vitest_1.expect)(text).toContain("Options: off, minimal, low, medium, high.");
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
