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
    runEmbeddedPiAgent: vitest_1.vi.fn(),
    resolveEmbeddedSessionLane: function (key) { return "session:".concat(key.trim() || "main"); },
}); });
vitest_1.vi.mock("../agents/model-catalog.js", function () { return ({
    loadModelCatalog: vitest_1.vi.fn(),
}); });
var model_catalog_js_1 = require("../agents/model-catalog.js");
var pi_embedded_js_1 = require("../agents/pi-embedded.js");
var isolated_agent_js_1 = require("./isolated-agent.js");
function withTempHome(fn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, temp_home_js_1.withTempHome)(fn, { prefix: "openclaw-cron-" })];
        });
    });
}
function writeSessionStore(home) {
    return __awaiter(this, void 0, void 0, function () {
        var dir, storePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = node_path_1.default.join(home, ".openclaw", "sessions");
                    return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true })];
                case 1:
                    _a.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify({
                            "agent:main:main": {
                                sessionId: "main-session",
                                updatedAt: Date.now(),
                                lastProvider: "webchat",
                                lastTo: "",
                            },
                        }, null, 2), "utf-8")];
                case 2:
                    _a.sent();
                    return [2 /*return*/, storePath];
            }
        });
    });
}
function readSessionEntry(storePath, key) {
    return __awaiter(this, void 0, void 0, function () {
        var raw, store;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.readFile(storePath, "utf-8")];
                case 1:
                    raw = _a.sent();
                    store = JSON.parse(raw);
                    return [2 /*return*/, store[key]];
            }
        });
    });
}
function makeCfg(home, storePath, overrides) {
    if (overrides === void 0) { overrides = {}; }
    var base = {
        agents: {
            defaults: {
                model: "anthropic/claude-opus-4-5",
                workspace: node_path_1.default.join(home, "openclaw"),
            },
        },
        session: { store: storePath, mainKey: "main" },
    };
    return __assign(__assign({}, base), overrides);
}
function makeJob(payload) {
    var now = Date.now();
    return {
        id: "job-1",
        enabled: true,
        createdAtMs: now,
        updatedAtMs: now,
        schedule: { kind: "every", everyMs: 60000 },
        sessionTarget: "isolated",
        wakeMode: "now",
        payload: payload,
        state: {},
        isolation: { postToMainPrefix: "Cron" },
    };
}
(0, vitest_1.describe)("runCronIsolatedAgentTurn", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
        vitest_1.vi.mocked(model_catalog_js_1.loadModelCatalog).mockResolvedValue([]);
    });
    (0, vitest_1.it)("uses last non-empty agent text as summary", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _a.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn(),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "first" }, { text: " " }, { text: " last " }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath),
                                            deps: deps,
                                            job: makeJob({ kind: "agentTurn", message: "do it", deliver: false }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 2:
                                    res = _a.sent();
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    (0, vitest_1.expect)(res.summary).toBe("last");
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
    (0, vitest_1.it)("appends current time after the cron header line", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, call, lines;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _d.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn(),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "ok" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath),
                                            deps: deps,
                                            job: makeJob({ kind: "agentTurn", message: "do it", deliver: false }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 2:
                                    _d.sent();
                                    call = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                                    lines = (_c = (_b = call === null || call === void 0 ? void 0 : call.prompt) === null || _b === void 0 ? void 0 : _b.split("\n")) !== null && _c !== void 0 ? _c : [];
                                    (0, vitest_1.expect)(lines[0]).toContain("[cron:job-1");
                                    (0, vitest_1.expect)(lines[0]).toContain("do it");
                                    (0, vitest_1.expect)(lines[1]).toMatch(/^Current time: .+ \(.+\)$/);
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
    (0, vitest_1.it)("uses agentId for workspace, session key, and store paths", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var deps, opsWorkspace, cfg, res, call;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn(),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    opsWorkspace = node_path_1.default.join(home, "ops-workspace");
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "ok" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    cfg = makeCfg(home, node_path_1.default.join(home, ".openclaw", "agents", "{agentId}", "sessions", "sessions.json"), {
                                        agents: {
                                            defaults: { workspace: node_path_1.default.join(home, "default-workspace") },
                                            list: [
                                                { id: "main", default: true },
                                                { id: "ops", workspace: opsWorkspace },
                                            ],
                                        },
                                    });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: cfg,
                                            deps: deps,
                                            job: __assign(__assign({}, makeJob({
                                                kind: "agentTurn",
                                                message: "do it",
                                                deliver: false,
                                                channel: "last",
                                            })), { agentId: "ops" }),
                                            message: "do it",
                                            sessionKey: "cron:job-ops",
                                            agentId: "ops",
                                            lane: "cron",
                                        })];
                                case 1:
                                    res = _b.sent();
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    call = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.sessionKey).toBe("agent:ops:cron:job-ops");
                                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.workspaceDir).toBe(opsWorkspace);
                                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.sessionFile).toContain(node_path_1.default.join("agents", "ops"));
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
    (0, vitest_1.it)("uses model override when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, res, call;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _b.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn(),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "ok" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath),
                                            deps: deps,
                                            job: makeJob({
                                                kind: "agentTurn",
                                                message: "do it",
                                                model: "openai/gpt-4.1-mini",
                                            }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 2:
                                    res = _b.sent();
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    call = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.provider).toBe("openai");
                                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.model).toBe("gpt-4.1-mini");
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
    (0, vitest_1.it)("uses hooks.gmail.model for Gmail hook sessions", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, res, call;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _b.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn(),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "ok" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath, {
                                                hooks: {
                                                    gmail: {
                                                        model: "openrouter/meta-llama/llama-3.3-70b:free",
                                                    },
                                                },
                                            }),
                                            deps: deps,
                                            job: makeJob({ kind: "agentTurn", message: "do it", deliver: false }),
                                            message: "do it",
                                            sessionKey: "hook:gmail:msg-1",
                                            lane: "cron",
                                        })];
                                case 2:
                                    res = _b.sent();
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    call = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.provider).toBe("openrouter");
                                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.model).toBe("meta-llama/llama-3.3-70b:free");
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
    (0, vitest_1.it)("wraps external hook content by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, res, call;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _b.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn(),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "ok" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath),
                                            deps: deps,
                                            job: makeJob({ kind: "agentTurn", message: "Hello" }),
                                            message: "Hello",
                                            sessionKey: "hook:gmail:msg-1",
                                            lane: "cron",
                                        })];
                                case 2:
                                    res = _b.sent();
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    call = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.prompt).toContain("EXTERNAL, UNTRUSTED");
                                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.prompt).toContain("Hello");
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
    (0, vitest_1.it)("skips external content wrapping when hooks.gmail opts out", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, res, call;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _b.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn(),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "ok" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath, {
                                                hooks: {
                                                    gmail: {
                                                        allowUnsafeExternalContent: true,
                                                    },
                                                },
                                            }),
                                            deps: deps,
                                            job: makeJob({ kind: "agentTurn", message: "Hello" }),
                                            message: "Hello",
                                            sessionKey: "hook:gmail:msg-2",
                                            lane: "cron",
                                        })];
                                case 2:
                                    res = _b.sent();
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    call = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.prompt).not.toContain("EXTERNAL, UNTRUSTED");
                                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.prompt).toContain("Hello");
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
    (0, vitest_1.it)("ignores hooks.gmail.model when not in the allowlist", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, res, call;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _b.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn(),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "ok" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    vitest_1.vi.mocked(model_catalog_js_1.loadModelCatalog).mockResolvedValueOnce([
                                        {
                                            id: "claude-opus-4-5",
                                            name: "Opus 4.5",
                                            provider: "anthropic",
                                        },
                                    ]);
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath, {
                                                agents: {
                                                    defaults: {
                                                        model: "anthropic/claude-opus-4-5",
                                                        models: {
                                                            "anthropic/claude-opus-4-5": { alias: "Opus" },
                                                        },
                                                    },
                                                },
                                                hooks: {
                                                    gmail: {
                                                        model: "openrouter/meta-llama/llama-3.3-70b:free",
                                                    },
                                                },
                                            }),
                                            deps: deps,
                                            job: makeJob({ kind: "agentTurn", message: "do it", deliver: false }),
                                            message: "do it",
                                            sessionKey: "hook:gmail:msg-2",
                                            lane: "cron",
                                        })];
                                case 2:
                                    res = _b.sent();
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    call = (_a = vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.provider).toBe("anthropic");
                                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.model).toBe("claude-opus-4-5");
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
    (0, vitest_1.it)("rejects invalid model override", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _a.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn(),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath),
                                            deps: deps,
                                            job: makeJob({
                                                kind: "agentTurn",
                                                message: "do it",
                                                model: "openai/",
                                            }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 2:
                                    res = _a.sent();
                                    (0, vitest_1.expect)(res.status).toBe("error");
                                    (0, vitest_1.expect)(res.error).toMatch("invalid model");
                                    (0, vitest_1.expect)(vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent)).not.toHaveBeenCalled();
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
                        var storePath, deps, callArgs;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _b.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn(),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "done" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    vitest_1.vi.mocked(model_catalog_js_1.loadModelCatalog).mockResolvedValueOnce([
                                        {
                                            id: "claude-opus-4-5",
                                            name: "Opus 4.5",
                                            provider: "anthropic",
                                            reasoning: true,
                                        },
                                    ]);
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath),
                                            deps: deps,
                                            job: makeJob({ kind: "agentTurn", message: "do it", deliver: false }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 2:
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
    (0, vitest_1.it)("truncates long summaries", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, long, res;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _b.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn(),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    long = "a".repeat(2001);
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: long }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath),
                                            deps: deps,
                                            job: makeJob({ kind: "agentTurn", message: "do it", deliver: false }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 2:
                                    res = _b.sent();
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    (0, vitest_1.expect)(String((_a = res.summary) !== null && _a !== void 0 ? _a : "")).toMatch(/…$/);
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
    (0, vitest_1.it)("fails delivery without a WhatsApp recipient when bestEffortDeliver=false", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, res;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _b.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn(),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "hello" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath),
                                            deps: deps,
                                            job: makeJob({
                                                kind: "agentTurn",
                                                message: "do it",
                                                deliver: true,
                                                channel: "whatsapp",
                                                bestEffortDeliver: false,
                                            }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 2:
                                    res = _b.sent();
                                    (0, vitest_1.expect)(res.status).toBe("error");
                                    (0, vitest_1.expect)(res.summary).toBe("hello");
                                    (0, vitest_1.expect)(String((_a = res.error) !== null && _a !== void 0 ? _a : "")).toMatch(/requires a recipient/i);
                                    (0, vitest_1.expect)(deps.sendMessageWhatsApp).not.toHaveBeenCalled();
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
    (0, vitest_1.it)("starts a fresh session id for each cron run", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, cfg, job, first, second;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _a.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn(),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "ok" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    cfg = makeCfg(home, storePath);
                                    job = makeJob({ kind: "agentTurn", message: "ping", deliver: false });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: cfg,
                                            deps: deps,
                                            job: job,
                                            message: "ping",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, readSessionEntry(storePath, "agent:main:cron:job-1")];
                                case 3:
                                    first = _a.sent();
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: cfg,
                                            deps: deps,
                                            job: job,
                                            message: "ping",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 4:
                                    _a.sent();
                                    return [4 /*yield*/, readSessionEntry(storePath, "agent:main:cron:job-1")];
                                case 5:
                                    second = _a.sent();
                                    (0, vitest_1.expect)(first === null || first === void 0 ? void 0 : first.sessionId).toBeDefined();
                                    (0, vitest_1.expect)(second === null || second === void 0 ? void 0 : second.sessionId).toBeDefined();
                                    (0, vitest_1.expect)(second === null || second === void 0 ? void 0 : second.sessionId).not.toBe(first === null || first === void 0 ? void 0 : first.sessionId);
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
