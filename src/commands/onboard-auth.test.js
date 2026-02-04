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
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var onboard_auth_js_1 = require("./onboard-auth.js");
var authProfilePathFor = function (agentDir) { return node_path_1.default.join(agentDir, "auth-profiles.json"); };
var requireAgentDir = function () {
    var agentDir = process.env.OPENCLAW_AGENT_DIR;
    if (!agentDir) {
        throw new Error("OPENCLAW_AGENT_DIR not set");
    }
    return agentDir;
};
(0, vitest_1.describe)("writeOAuthCredentials", function () {
    var previousStateDir = process.env.OPENCLAW_STATE_DIR;
    var previousAgentDir = process.env.OPENCLAW_AGENT_DIR;
    var previousPiAgentDir = process.env.PI_CODING_AGENT_DIR;
    var tempStateDir = null;
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!tempStateDir) return [3 /*break*/, 2];
                    return [4 /*yield*/, promises_1.default.rm(tempStateDir, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    tempStateDir = null;
                    _a.label = 2;
                case 2:
                    if (previousStateDir === undefined) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = previousStateDir;
                    }
                    if (previousAgentDir === undefined) {
                        delete process.env.OPENCLAW_AGENT_DIR;
                    }
                    else {
                        process.env.OPENCLAW_AGENT_DIR = previousAgentDir;
                    }
                    if (previousPiAgentDir === undefined) {
                        delete process.env.PI_CODING_AGENT_DIR;
                    }
                    else {
                        process.env.PI_CODING_AGENT_DIR = previousPiAgentDir;
                    }
                    delete process.env.OPENCLAW_OAUTH_DIR;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("writes auth-profiles.json under OPENCLAW_AGENT_DIR when set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var creds, authProfilePath, raw, parsed;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-oauth-"))];
                case 1:
                    tempStateDir = _b.sent();
                    process.env.OPENCLAW_STATE_DIR = tempStateDir;
                    process.env.OPENCLAW_AGENT_DIR = node_path_1.default.join(tempStateDir, "agent");
                    process.env.PI_CODING_AGENT_DIR = process.env.OPENCLAW_AGENT_DIR;
                    creds = {
                        refresh: "refresh-token",
                        access: "access-token",
                        expires: Date.now() + 60000,
                    };
                    return [4 /*yield*/, (0, onboard_auth_js_1.writeOAuthCredentials)("openai-codex", creds)];
                case 2:
                    _b.sent();
                    authProfilePath = authProfilePathFor(requireAgentDir());
                    return [4 /*yield*/, promises_1.default.readFile(authProfilePath, "utf8")];
                case 3:
                    raw = _b.sent();
                    parsed = JSON.parse(raw);
                    (0, vitest_1.expect)((_a = parsed.profiles) === null || _a === void 0 ? void 0 : _a["openai-codex:default"]).toMatchObject({
                        refresh: "refresh-token",
                        access: "access-token",
                        type: "oauth",
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.readFile(node_path_1.default.join(tempStateDir, "agents", "main", "agent", "auth-profiles.json"), "utf8")).rejects.toThrow()];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("setMinimaxApiKey", function () {
    var previousStateDir = process.env.OPENCLAW_STATE_DIR;
    var previousAgentDir = process.env.OPENCLAW_AGENT_DIR;
    var previousPiAgentDir = process.env.PI_CODING_AGENT_DIR;
    var tempStateDir = null;
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!tempStateDir) return [3 /*break*/, 2];
                    return [4 /*yield*/, promises_1.default.rm(tempStateDir, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    tempStateDir = null;
                    _a.label = 2;
                case 2:
                    if (previousStateDir === undefined) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = previousStateDir;
                    }
                    if (previousAgentDir === undefined) {
                        delete process.env.OPENCLAW_AGENT_DIR;
                    }
                    else {
                        process.env.OPENCLAW_AGENT_DIR = previousAgentDir;
                    }
                    if (previousPiAgentDir === undefined) {
                        delete process.env.PI_CODING_AGENT_DIR;
                    }
                    else {
                        process.env.PI_CODING_AGENT_DIR = previousPiAgentDir;
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("writes to OPENCLAW_AGENT_DIR when set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var customAuthPath, raw, parsed;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-minimax-"))];
                case 1:
                    tempStateDir = _b.sent();
                    process.env.OPENCLAW_STATE_DIR = tempStateDir;
                    process.env.OPENCLAW_AGENT_DIR = node_path_1.default.join(tempStateDir, "custom-agent");
                    process.env.PI_CODING_AGENT_DIR = process.env.OPENCLAW_AGENT_DIR;
                    return [4 /*yield*/, (0, onboard_auth_js_1.setMinimaxApiKey)("sk-minimax-test")];
                case 2:
                    _b.sent();
                    customAuthPath = authProfilePathFor(requireAgentDir());
                    return [4 /*yield*/, promises_1.default.readFile(customAuthPath, "utf8")];
                case 3:
                    raw = _b.sent();
                    parsed = JSON.parse(raw);
                    (0, vitest_1.expect)((_a = parsed.profiles) === null || _a === void 0 ? void 0 : _a["minimax:default"]).toMatchObject({
                        type: "api_key",
                        provider: "minimax",
                        key: "sk-minimax-test",
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.readFile(node_path_1.default.join(tempStateDir, "agents", "main", "agent", "auth-profiles.json"), "utf8")).rejects.toThrow()];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("applyAuthProfileConfig", function () {
    (0, vitest_1.it)("promotes the newly selected profile to the front of auth.order", function () {
        var _a, _b;
        var next = (0, onboard_auth_js_1.applyAuthProfileConfig)({
            auth: {
                profiles: {
                    "anthropic:default": { provider: "anthropic", mode: "api_key" },
                },
                order: { anthropic: ["anthropic:default"] },
            },
        }, {
            profileId: "anthropic:work",
            provider: "anthropic",
            mode: "oauth",
        });
        (0, vitest_1.expect)((_b = (_a = next.auth) === null || _a === void 0 ? void 0 : _a.order) === null || _b === void 0 ? void 0 : _b.anthropic).toEqual(["anthropic:work", "anthropic:default"]);
    });
});
(0, vitest_1.describe)("applyMinimaxApiConfig", function () {
    (0, vitest_1.it)("adds minimax provider with correct settings", function () {
        var _a, _b;
        var cfg = (0, onboard_auth_js_1.applyMinimaxApiConfig)({});
        (0, vitest_1.expect)((_b = (_a = cfg.models) === null || _a === void 0 ? void 0 : _a.providers) === null || _b === void 0 ? void 0 : _b.minimax).toMatchObject({
            baseUrl: "https://api.minimax.io/anthropic",
            api: "anthropic-messages",
        });
    });
    (0, vitest_1.it)("sets correct primary model", function () {
        var _a, _b, _c;
        var cfg = (0, onboard_auth_js_1.applyMinimaxApiConfig)({}, "MiniMax-M2.1-lightning");
        (0, vitest_1.expect)((_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model) === null || _c === void 0 ? void 0 : _c.primary).toBe("minimax/MiniMax-M2.1-lightning");
    });
    (0, vitest_1.it)("does not set reasoning for non-reasoning models", function () {
        var _a, _b, _c, _d;
        var cfg = (0, onboard_auth_js_1.applyMinimaxApiConfig)({}, "MiniMax-M2.1");
        (0, vitest_1.expect)((_d = (_c = (_b = (_a = cfg.models) === null || _a === void 0 ? void 0 : _a.providers) === null || _b === void 0 ? void 0 : _b.minimax) === null || _c === void 0 ? void 0 : _c.models[0]) === null || _d === void 0 ? void 0 : _d.reasoning).toBe(false);
    });
    (0, vitest_1.it)("preserves existing model fallbacks", function () {
        var _a, _b, _c;
        var cfg = (0, onboard_auth_js_1.applyMinimaxApiConfig)({
            agents: {
                defaults: {
                    model: { fallbacks: ["anthropic/claude-opus-4-5"] },
                },
            },
        });
        (0, vitest_1.expect)((_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model) === null || _c === void 0 ? void 0 : _c.fallbacks).toEqual(["anthropic/claude-opus-4-5"]);
    });
    (0, vitest_1.it)("adds model alias", function () {
        var _a, _b, _c, _d;
        var cfg = (0, onboard_auth_js_1.applyMinimaxApiConfig)({}, "MiniMax-M2.1");
        (0, vitest_1.expect)((_d = (_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models) === null || _c === void 0 ? void 0 : _c["minimax/MiniMax-M2.1"]) === null || _d === void 0 ? void 0 : _d.alias).toBe("Minimax");
    });
    (0, vitest_1.it)("preserves existing model params when adding alias", function () {
        var _a, _b, _c;
        var cfg = (0, onboard_auth_js_1.applyMinimaxApiConfig)({
            agents: {
                defaults: {
                    models: {
                        "minimax/MiniMax-M2.1": {
                            alias: "MiniMax",
                            params: { custom: "value" },
                        },
                    },
                },
            },
        }, "MiniMax-M2.1");
        (0, vitest_1.expect)((_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models) === null || _c === void 0 ? void 0 : _c["minimax/MiniMax-M2.1"]).toMatchObject({
            alias: "Minimax",
            params: { custom: "value" },
        });
    });
    (0, vitest_1.it)("merges existing minimax provider models", function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var cfg = (0, onboard_auth_js_1.applyMinimaxApiConfig)({
            models: {
                providers: {
                    minimax: {
                        baseUrl: "https://old.example.com",
                        apiKey: "old-key",
                        api: "openai-completions",
                        models: [
                            {
                                id: "old-model",
                                name: "Old",
                                reasoning: false,
                                input: ["text"],
                                cost: { input: 1, output: 2, cacheRead: 0, cacheWrite: 0 },
                                contextWindow: 1000,
                                maxTokens: 100,
                            },
                        ],
                    },
                },
            },
        });
        (0, vitest_1.expect)((_c = (_b = (_a = cfg.models) === null || _a === void 0 ? void 0 : _a.providers) === null || _b === void 0 ? void 0 : _b.minimax) === null || _c === void 0 ? void 0 : _c.baseUrl).toBe("https://api.minimax.io/anthropic");
        (0, vitest_1.expect)((_f = (_e = (_d = cfg.models) === null || _d === void 0 ? void 0 : _d.providers) === null || _e === void 0 ? void 0 : _e.minimax) === null || _f === void 0 ? void 0 : _f.api).toBe("anthropic-messages");
        (0, vitest_1.expect)((_j = (_h = (_g = cfg.models) === null || _g === void 0 ? void 0 : _g.providers) === null || _h === void 0 ? void 0 : _h.minimax) === null || _j === void 0 ? void 0 : _j.apiKey).toBe("old-key");
        (0, vitest_1.expect)((_m = (_l = (_k = cfg.models) === null || _k === void 0 ? void 0 : _k.providers) === null || _l === void 0 ? void 0 : _l.minimax) === null || _m === void 0 ? void 0 : _m.models.map(function (m) { return m.id; })).toEqual([
            "old-model",
            "MiniMax-M2.1",
        ]);
    });
    (0, vitest_1.it)("preserves other providers when adding minimax", function () {
        var _a, _b, _c, _d;
        var cfg = (0, onboard_auth_js_1.applyMinimaxApiConfig)({
            models: {
                providers: {
                    anthropic: {
                        baseUrl: "https://api.anthropic.com",
                        apiKey: "anthropic-key",
                        api: "anthropic-messages",
                        models: [
                            {
                                id: "claude-opus-4-5",
                                name: "Claude Opus 4.5",
                                reasoning: false,
                                input: ["text"],
                                cost: { input: 15, output: 75, cacheRead: 0, cacheWrite: 0 },
                                contextWindow: 200000,
                                maxTokens: 8192,
                            },
                        ],
                    },
                },
            },
        });
        (0, vitest_1.expect)((_b = (_a = cfg.models) === null || _a === void 0 ? void 0 : _a.providers) === null || _b === void 0 ? void 0 : _b.anthropic).toBeDefined();
        (0, vitest_1.expect)((_d = (_c = cfg.models) === null || _c === void 0 ? void 0 : _c.providers) === null || _d === void 0 ? void 0 : _d.minimax).toBeDefined();
    });
    (0, vitest_1.it)("preserves existing models mode", function () {
        var _a;
        var cfg = (0, onboard_auth_js_1.applyMinimaxApiConfig)({
            models: { mode: "replace", providers: {} },
        });
        (0, vitest_1.expect)((_a = cfg.models) === null || _a === void 0 ? void 0 : _a.mode).toBe("replace");
    });
});
(0, vitest_1.describe)("applyMinimaxApiProviderConfig", function () {
    (0, vitest_1.it)("does not overwrite existing primary model", function () {
        var _a, _b, _c;
        var cfg = (0, onboard_auth_js_1.applyMinimaxApiProviderConfig)({
            agents: { defaults: { model: { primary: "anthropic/claude-opus-4-5" } } },
        });
        (0, vitest_1.expect)((_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model) === null || _c === void 0 ? void 0 : _c.primary).toBe("anthropic/claude-opus-4-5");
    });
});
(0, vitest_1.describe)("applySyntheticConfig", function () {
    (0, vitest_1.it)("adds synthetic provider with correct settings", function () {
        var _a, _b;
        var cfg = (0, onboard_auth_js_1.applySyntheticConfig)({});
        (0, vitest_1.expect)((_b = (_a = cfg.models) === null || _a === void 0 ? void 0 : _a.providers) === null || _b === void 0 ? void 0 : _b.synthetic).toMatchObject({
            baseUrl: "https://api.synthetic.new/anthropic",
            api: "anthropic-messages",
        });
    });
    (0, vitest_1.it)("sets correct primary model", function () {
        var _a, _b, _c;
        var cfg = (0, onboard_auth_js_1.applySyntheticConfig)({});
        (0, vitest_1.expect)((_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model) === null || _c === void 0 ? void 0 : _c.primary).toBe(onboard_auth_js_1.SYNTHETIC_DEFAULT_MODEL_REF);
    });
    (0, vitest_1.it)("merges existing synthetic provider models", function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var cfg = (0, onboard_auth_js_1.applySyntheticProviderConfig)({
            models: {
                providers: {
                    synthetic: {
                        baseUrl: "https://old.example.com",
                        apiKey: "old-key",
                        api: "openai-completions",
                        models: [
                            {
                                id: "old-model",
                                name: "Old",
                                reasoning: false,
                                input: ["text"],
                                cost: { input: 1, output: 2, cacheRead: 0, cacheWrite: 0 },
                                contextWindow: 1000,
                                maxTokens: 100,
                            },
                        ],
                    },
                },
            },
        });
        (0, vitest_1.expect)((_c = (_b = (_a = cfg.models) === null || _a === void 0 ? void 0 : _a.providers) === null || _b === void 0 ? void 0 : _b.synthetic) === null || _c === void 0 ? void 0 : _c.baseUrl).toBe("https://api.synthetic.new/anthropic");
        (0, vitest_1.expect)((_f = (_e = (_d = cfg.models) === null || _d === void 0 ? void 0 : _d.providers) === null || _e === void 0 ? void 0 : _e.synthetic) === null || _f === void 0 ? void 0 : _f.api).toBe("anthropic-messages");
        (0, vitest_1.expect)((_j = (_h = (_g = cfg.models) === null || _g === void 0 ? void 0 : _g.providers) === null || _h === void 0 ? void 0 : _h.synthetic) === null || _j === void 0 ? void 0 : _j.apiKey).toBe("old-key");
        var ids = (_m = (_l = (_k = cfg.models) === null || _k === void 0 ? void 0 : _k.providers) === null || _l === void 0 ? void 0 : _l.synthetic) === null || _m === void 0 ? void 0 : _m.models.map(function (m) { return m.id; });
        (0, vitest_1.expect)(ids).toContain("old-model");
        (0, vitest_1.expect)(ids).toContain(onboard_auth_js_1.SYNTHETIC_DEFAULT_MODEL_ID);
    });
});
(0, vitest_1.describe)("applyXiaomiConfig", function () {
    (0, vitest_1.it)("adds Xiaomi provider with correct settings", function () {
        var _a, _b, _c, _d, _e;
        var cfg = (0, onboard_auth_js_1.applyXiaomiConfig)({});
        (0, vitest_1.expect)((_b = (_a = cfg.models) === null || _a === void 0 ? void 0 : _a.providers) === null || _b === void 0 ? void 0 : _b.xiaomi).toMatchObject({
            baseUrl: "https://api.xiaomimimo.com/anthropic",
            api: "anthropic-messages",
        });
        (0, vitest_1.expect)((_e = (_d = (_c = cfg.agents) === null || _c === void 0 ? void 0 : _c.defaults) === null || _d === void 0 ? void 0 : _d.model) === null || _e === void 0 ? void 0 : _e.primary).toBe("xiaomi/mimo-v2-flash");
    });
    (0, vitest_1.it)("merges Xiaomi models and keeps existing provider overrides", function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var cfg = (0, onboard_auth_js_1.applyXiaomiProviderConfig)({
            models: {
                providers: {
                    xiaomi: {
                        baseUrl: "https://old.example.com",
                        apiKey: "old-key",
                        api: "openai-completions",
                        models: [
                            {
                                id: "custom-model",
                                name: "Custom",
                                reasoning: false,
                                input: ["text"],
                                cost: { input: 1, output: 2, cacheRead: 0, cacheWrite: 0 },
                                contextWindow: 1000,
                                maxTokens: 100,
                            },
                        ],
                    },
                },
            },
        });
        (0, vitest_1.expect)((_c = (_b = (_a = cfg.models) === null || _a === void 0 ? void 0 : _a.providers) === null || _b === void 0 ? void 0 : _b.xiaomi) === null || _c === void 0 ? void 0 : _c.baseUrl).toBe("https://api.xiaomimimo.com/anthropic");
        (0, vitest_1.expect)((_f = (_e = (_d = cfg.models) === null || _d === void 0 ? void 0 : _d.providers) === null || _e === void 0 ? void 0 : _e.xiaomi) === null || _f === void 0 ? void 0 : _f.api).toBe("anthropic-messages");
        (0, vitest_1.expect)((_j = (_h = (_g = cfg.models) === null || _g === void 0 ? void 0 : _g.providers) === null || _h === void 0 ? void 0 : _h.xiaomi) === null || _j === void 0 ? void 0 : _j.apiKey).toBe("old-key");
        (0, vitest_1.expect)((_m = (_l = (_k = cfg.models) === null || _k === void 0 ? void 0 : _k.providers) === null || _l === void 0 ? void 0 : _l.xiaomi) === null || _m === void 0 ? void 0 : _m.models.map(function (m) { return m.id; })).toEqual([
            "custom-model",
            "mimo-v2-flash",
        ]);
    });
});
(0, vitest_1.describe)("applyOpencodeZenProviderConfig", function () {
    (0, vitest_1.it)("adds allowlist entry for the default model", function () {
        var _a, _b, _c;
        var cfg = (0, onboard_auth_js_1.applyOpencodeZenProviderConfig)({});
        var models = (_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models) !== null && _c !== void 0 ? _c : {};
        (0, vitest_1.expect)(Object.keys(models)).toContain("opencode/claude-opus-4-5");
    });
    (0, vitest_1.it)("preserves existing alias for the default model", function () {
        var _a, _b, _c, _d;
        var cfg = (0, onboard_auth_js_1.applyOpencodeZenProviderConfig)({
            agents: {
                defaults: {
                    models: {
                        "opencode/claude-opus-4-5": { alias: "My Opus" },
                    },
                },
            },
        });
        (0, vitest_1.expect)((_d = (_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models) === null || _c === void 0 ? void 0 : _c["opencode/claude-opus-4-5"]) === null || _d === void 0 ? void 0 : _d.alias).toBe("My Opus");
    });
});
(0, vitest_1.describe)("applyOpencodeZenConfig", function () {
    (0, vitest_1.it)("sets correct primary model", function () {
        var _a, _b, _c;
        var cfg = (0, onboard_auth_js_1.applyOpencodeZenConfig)({});
        (0, vitest_1.expect)((_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model) === null || _c === void 0 ? void 0 : _c.primary).toBe("opencode/claude-opus-4-5");
    });
    (0, vitest_1.it)("preserves existing model fallbacks", function () {
        var _a, _b, _c;
        var cfg = (0, onboard_auth_js_1.applyOpencodeZenConfig)({
            agents: {
                defaults: {
                    model: { fallbacks: ["anthropic/claude-opus-4-5"] },
                },
            },
        });
        (0, vitest_1.expect)((_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model) === null || _c === void 0 ? void 0 : _c.fallbacks).toEqual(["anthropic/claude-opus-4-5"]);
    });
});
(0, vitest_1.describe)("applyOpenrouterProviderConfig", function () {
    (0, vitest_1.it)("adds allowlist entry for the default model", function () {
        var _a, _b, _c;
        var cfg = (0, onboard_auth_js_1.applyOpenrouterProviderConfig)({});
        var models = (_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models) !== null && _c !== void 0 ? _c : {};
        (0, vitest_1.expect)(Object.keys(models)).toContain(onboard_auth_js_1.OPENROUTER_DEFAULT_MODEL_REF);
    });
    (0, vitest_1.it)("preserves existing alias for the default model", function () {
        var _a;
        var _b, _c, _d, _e;
        var cfg = (0, onboard_auth_js_1.applyOpenrouterProviderConfig)({
            agents: {
                defaults: {
                    models: (_a = {},
                        _a[onboard_auth_js_1.OPENROUTER_DEFAULT_MODEL_REF] = { alias: "Router" },
                        _a),
                },
            },
        });
        (0, vitest_1.expect)((_e = (_d = (_c = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.models) === null || _d === void 0 ? void 0 : _d[onboard_auth_js_1.OPENROUTER_DEFAULT_MODEL_REF]) === null || _e === void 0 ? void 0 : _e.alias).toBe("Router");
    });
});
(0, vitest_1.describe)("applyOpenrouterConfig", function () {
    (0, vitest_1.it)("sets correct primary model", function () {
        var _a, _b, _c;
        var cfg = (0, onboard_auth_js_1.applyOpenrouterConfig)({});
        (0, vitest_1.expect)((_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model) === null || _c === void 0 ? void 0 : _c.primary).toBe(onboard_auth_js_1.OPENROUTER_DEFAULT_MODEL_REF);
    });
    (0, vitest_1.it)("preserves existing model fallbacks", function () {
        var _a, _b, _c;
        var cfg = (0, onboard_auth_js_1.applyOpenrouterConfig)({
            agents: {
                defaults: {
                    model: { fallbacks: ["anthropic/claude-opus-4-5"] },
                },
            },
        });
        (0, vitest_1.expect)((_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model) === null || _c === void 0 ? void 0 : _c.fallbacks).toEqual(["anthropic/claude-opus-4-5"]);
    });
});
