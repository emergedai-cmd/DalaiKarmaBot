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
var auth_choice_js_1 = require("./auth-choice.js");
vitest_1.vi.mock("../providers/github-copilot-auth.js", function () { return ({
    githubCopilotLoginCommand: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
}); });
var resolvePluginProviders = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(function () { return []; }); });
vitest_1.vi.mock("../plugins/providers.js", function () { return ({
    resolvePluginProviders: resolvePluginProviders,
}); });
var noopAsync = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); };
var noop = function () { };
var authProfilePathFor = function (agentDir) { return node_path_1.default.join(agentDir, "auth-profiles.json"); };
var requireAgentDir = function () {
    var agentDir = process.env.OPENCLAW_AGENT_DIR;
    if (!agentDir) {
        throw new Error("OPENCLAW_AGENT_DIR not set");
    }
    return agentDir;
};
(0, vitest_1.describe)("applyAuthChoice", function () {
    var previousStateDir = process.env.OPENCLAW_STATE_DIR;
    var previousAgentDir = process.env.OPENCLAW_AGENT_DIR;
    var previousPiAgentDir = process.env.PI_CODING_AGENT_DIR;
    var previousOpenrouterKey = process.env.OPENROUTER_API_KEY;
    var previousAiGatewayKey = process.env.AI_GATEWAY_API_KEY;
    var previousSshTty = process.env.SSH_TTY;
    var previousChutesClientId = process.env.CHUTES_CLIENT_ID;
    var tempStateDir = null;
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.unstubAllGlobals();
                    resolvePluginProviders.mockReset();
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
                    if (previousOpenrouterKey === undefined) {
                        delete process.env.OPENROUTER_API_KEY;
                    }
                    else {
                        process.env.OPENROUTER_API_KEY = previousOpenrouterKey;
                    }
                    if (previousAiGatewayKey === undefined) {
                        delete process.env.AI_GATEWAY_API_KEY;
                    }
                    else {
                        process.env.AI_GATEWAY_API_KEY = previousAiGatewayKey;
                    }
                    if (previousSshTty === undefined) {
                        delete process.env.SSH_TTY;
                    }
                    else {
                        process.env.SSH_TTY = previousSshTty;
                    }
                    if (previousChutesClientId === undefined) {
                        delete process.env.CHUTES_CLIENT_ID;
                    }
                    else {
                        process.env.CHUTES_CLIENT_ID = previousChutesClientId;
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prompts and writes MiniMax API key when selecting minimax-api", function () { return __awaiter(void 0, void 0, void 0, function () {
        var text, select, multiselect, prompter, runtime, result, authProfilePath, raw, parsed;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"))];
                case 1:
                    tempStateDir = _e.sent();
                    process.env.OPENCLAW_STATE_DIR = tempStateDir;
                    process.env.OPENCLAW_AGENT_DIR = node_path_1.default.join(tempStateDir, "agent");
                    process.env.PI_CODING_AGENT_DIR = process.env.OPENCLAW_AGENT_DIR;
                    text = vitest_1.vi.fn().mockResolvedValue("sk-minimax-test");
                    select = vitest_1.vi.fn(function (params) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (_a = params.options[0]) === null || _a === void 0 ? void 0 : _a.value];
                    }); }); });
                    multiselect = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, []];
                    }); }); });
                    prompter = {
                        intro: vitest_1.vi.fn(noopAsync),
                        outro: vitest_1.vi.fn(noopAsync),
                        note: vitest_1.vi.fn(noopAsync),
                        select: select,
                        multiselect: multiselect,
                        text: text,
                        confirm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); }),
                        progress: vitest_1.vi.fn(function () { return ({ update: noop, stop: noop }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(function (code) {
                            throw new Error("exit:".concat(code));
                        }),
                    };
                    return [4 /*yield*/, (0, auth_choice_js_1.applyAuthChoice)({
                            authChoice: "minimax-api",
                            config: {},
                            prompter: prompter,
                            runtime: runtime,
                            setDefaultModel: true,
                        })];
                case 2:
                    result = _e.sent();
                    (0, vitest_1.expect)(text).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: "Enter MiniMax API key" }));
                    (0, vitest_1.expect)((_b = (_a = result.config.auth) === null || _a === void 0 ? void 0 : _a.profiles) === null || _b === void 0 ? void 0 : _b["minimax:default"]).toMatchObject({
                        provider: "minimax",
                        mode: "api_key",
                    });
                    authProfilePath = authProfilePathFor(requireAgentDir());
                    return [4 /*yield*/, promises_1.default.readFile(authProfilePath, "utf8")];
                case 3:
                    raw = _e.sent();
                    parsed = JSON.parse(raw);
                    (0, vitest_1.expect)((_d = (_c = parsed.profiles) === null || _c === void 0 ? void 0 : _c["minimax:default"]) === null || _d === void 0 ? void 0 : _d.key).toBe("sk-minimax-test");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prompts and writes Synthetic API key when selecting synthetic-api-key", function () { return __awaiter(void 0, void 0, void 0, function () {
        var text, select, multiselect, prompter, runtime, result, authProfilePath, raw, parsed;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"))];
                case 1:
                    tempStateDir = _e.sent();
                    process.env.OPENCLAW_STATE_DIR = tempStateDir;
                    process.env.OPENCLAW_AGENT_DIR = node_path_1.default.join(tempStateDir, "agent");
                    process.env.PI_CODING_AGENT_DIR = process.env.OPENCLAW_AGENT_DIR;
                    text = vitest_1.vi.fn().mockResolvedValue("sk-synthetic-test");
                    select = vitest_1.vi.fn(function (params) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (_a = params.options[0]) === null || _a === void 0 ? void 0 : _a.value];
                    }); }); });
                    multiselect = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, []];
                    }); }); });
                    prompter = {
                        intro: vitest_1.vi.fn(noopAsync),
                        outro: vitest_1.vi.fn(noopAsync),
                        note: vitest_1.vi.fn(noopAsync),
                        select: select,
                        multiselect: multiselect,
                        text: text,
                        confirm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); }),
                        progress: vitest_1.vi.fn(function () { return ({ update: noop, stop: noop }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(function (code) {
                            throw new Error("exit:".concat(code));
                        }),
                    };
                    return [4 /*yield*/, (0, auth_choice_js_1.applyAuthChoice)({
                            authChoice: "synthetic-api-key",
                            config: {},
                            prompter: prompter,
                            runtime: runtime,
                            setDefaultModel: true,
                        })];
                case 2:
                    result = _e.sent();
                    (0, vitest_1.expect)(text).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: "Enter Synthetic API key" }));
                    (0, vitest_1.expect)((_b = (_a = result.config.auth) === null || _a === void 0 ? void 0 : _a.profiles) === null || _b === void 0 ? void 0 : _b["synthetic:default"]).toMatchObject({
                        provider: "synthetic",
                        mode: "api_key",
                    });
                    authProfilePath = authProfilePathFor(requireAgentDir());
                    return [4 /*yield*/, promises_1.default.readFile(authProfilePath, "utf8")];
                case 3:
                    raw = _e.sent();
                    parsed = JSON.parse(raw);
                    (0, vitest_1.expect)((_d = (_c = parsed.profiles) === null || _c === void 0 ? void 0 : _c["synthetic:default"]) === null || _d === void 0 ? void 0 : _d.key).toBe("sk-synthetic-test");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sets default model when selecting github-copilot", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prompter, runtime, previousTty, stdin, result;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"))];
                case 1:
                    tempStateDir = _d.sent();
                    process.env.OPENCLAW_STATE_DIR = tempStateDir;
                    process.env.OPENCLAW_AGENT_DIR = node_path_1.default.join(tempStateDir, "agent");
                    process.env.PI_CODING_AGENT_DIR = process.env.OPENCLAW_AGENT_DIR;
                    prompter = {
                        intro: vitest_1.vi.fn(noopAsync),
                        outro: vitest_1.vi.fn(noopAsync),
                        note: vitest_1.vi.fn(noopAsync),
                        select: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ""];
                        }); }); }),
                        multiselect: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, []];
                        }); }); }),
                        text: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ""];
                        }); }); }),
                        confirm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); }),
                        progress: vitest_1.vi.fn(function () { return ({ update: noop, stop: noop }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(function (code) {
                            throw new Error("exit:".concat(code));
                        }),
                    };
                    previousTty = process.stdin.isTTY;
                    stdin = process.stdin;
                    stdin.isTTY = true;
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, , 4, 5]);
                    return [4 /*yield*/, (0, auth_choice_js_1.applyAuthChoice)({
                            authChoice: "github-copilot",
                            config: {},
                            prompter: prompter,
                            runtime: runtime,
                            setDefaultModel: true,
                        })];
                case 3:
                    result = _d.sent();
                    (0, vitest_1.expect)((_c = (_b = (_a = result.config.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model) === null || _c === void 0 ? void 0 : _c.primary).toBe("github-copilot/gpt-4o");
                    return [3 /*break*/, 5];
                case 4:
                    stdin.isTTY = previousTty;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not override the default model when selecting opencode-zen without setDefaultModel", function () { return __awaiter(void 0, void 0, void 0, function () {
        var text, select, multiselect, prompter, runtime, result;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"))];
                case 1:
                    tempStateDir = _f.sent();
                    process.env.OPENCLAW_STATE_DIR = tempStateDir;
                    process.env.OPENCLAW_AGENT_DIR = node_path_1.default.join(tempStateDir, "agent");
                    process.env.PI_CODING_AGENT_DIR = process.env.OPENCLAW_AGENT_DIR;
                    text = vitest_1.vi.fn().mockResolvedValue("sk-opencode-zen-test");
                    select = vitest_1.vi.fn(function (params) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (_a = params.options[0]) === null || _a === void 0 ? void 0 : _a.value];
                    }); }); });
                    multiselect = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, []];
                    }); }); });
                    prompter = {
                        intro: vitest_1.vi.fn(noopAsync),
                        outro: vitest_1.vi.fn(noopAsync),
                        note: vitest_1.vi.fn(noopAsync),
                        select: select,
                        multiselect: multiselect,
                        text: text,
                        confirm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); }),
                        progress: vitest_1.vi.fn(function () { return ({ update: noop, stop: noop }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(function (code) {
                            throw new Error("exit:".concat(code));
                        }),
                    };
                    return [4 /*yield*/, (0, auth_choice_js_1.applyAuthChoice)({
                            authChoice: "opencode-zen",
                            config: {
                                agents: {
                                    defaults: {
                                        model: { primary: "anthropic/claude-opus-4-5" },
                                    },
                                },
                            },
                            prompter: prompter,
                            runtime: runtime,
                            setDefaultModel: false,
                        })];
                case 2:
                    result = _f.sent();
                    (0, vitest_1.expect)(text).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: "Enter OpenCode Zen API key" }));
                    (0, vitest_1.expect)((_c = (_b = (_a = result.config.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model) === null || _c === void 0 ? void 0 : _c.primary).toBe("anthropic/claude-opus-4-5");
                    (0, vitest_1.expect)((_e = (_d = result.config.models) === null || _d === void 0 ? void 0 : _d.providers) === null || _e === void 0 ? void 0 : _e["opencode-zen"]).toBeUndefined();
                    (0, vitest_1.expect)(result.agentModelOverride).toBe("opencode/claude-opus-4-5");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses existing OPENROUTER_API_KEY when selecting openrouter-api-key", function () { return __awaiter(void 0, void 0, void 0, function () {
        var text, select, multiselect, confirm, prompter, runtime, result, authProfilePath, raw, parsed;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"))];
                case 1:
                    tempStateDir = _h.sent();
                    process.env.OPENCLAW_STATE_DIR = tempStateDir;
                    process.env.OPENCLAW_AGENT_DIR = node_path_1.default.join(tempStateDir, "agent");
                    process.env.PI_CODING_AGENT_DIR = process.env.OPENCLAW_AGENT_DIR;
                    process.env.OPENROUTER_API_KEY = "sk-openrouter-test";
                    text = vitest_1.vi.fn();
                    select = vitest_1.vi.fn(function (params) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (_a = params.options[0]) === null || _a === void 0 ? void 0 : _a.value];
                    }); }); });
                    multiselect = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, []];
                    }); }); });
                    confirm = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, true];
                    }); }); });
                    prompter = {
                        intro: vitest_1.vi.fn(noopAsync),
                        outro: vitest_1.vi.fn(noopAsync),
                        note: vitest_1.vi.fn(noopAsync),
                        select: select,
                        multiselect: multiselect,
                        text: text,
                        confirm: confirm,
                        progress: vitest_1.vi.fn(function () { return ({ update: noop, stop: noop }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(function (code) {
                            throw new Error("exit:".concat(code));
                        }),
                    };
                    return [4 /*yield*/, (0, auth_choice_js_1.applyAuthChoice)({
                            authChoice: "openrouter-api-key",
                            config: {},
                            prompter: prompter,
                            runtime: runtime,
                            setDefaultModel: true,
                        })];
                case 2:
                    result = _h.sent();
                    (0, vitest_1.expect)(confirm).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        message: vitest_1.expect.stringContaining("OPENROUTER_API_KEY"),
                    }));
                    (0, vitest_1.expect)(text).not.toHaveBeenCalled();
                    (0, vitest_1.expect)((_b = (_a = result.config.auth) === null || _a === void 0 ? void 0 : _a.profiles) === null || _b === void 0 ? void 0 : _b["openrouter:default"]).toMatchObject({
                        provider: "openrouter",
                        mode: "api_key",
                    });
                    (0, vitest_1.expect)((_e = (_d = (_c = result.config.agents) === null || _c === void 0 ? void 0 : _c.defaults) === null || _d === void 0 ? void 0 : _d.model) === null || _e === void 0 ? void 0 : _e.primary).toBe("openrouter/auto");
                    authProfilePath = authProfilePathFor(requireAgentDir());
                    return [4 /*yield*/, promises_1.default.readFile(authProfilePath, "utf8")];
                case 3:
                    raw = _h.sent();
                    parsed = JSON.parse(raw);
                    (0, vitest_1.expect)((_g = (_f = parsed.profiles) === null || _f === void 0 ? void 0 : _f["openrouter:default"]) === null || _g === void 0 ? void 0 : _g.key).toBe("sk-openrouter-test");
                    delete process.env.OPENROUTER_API_KEY;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses existing AI_GATEWAY_API_KEY when selecting ai-gateway-api-key", function () { return __awaiter(void 0, void 0, void 0, function () {
        var text, select, multiselect, confirm, prompter, runtime, result, authProfilePath, raw, parsed;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"))];
                case 1:
                    tempStateDir = _h.sent();
                    process.env.OPENCLAW_STATE_DIR = tempStateDir;
                    process.env.OPENCLAW_AGENT_DIR = node_path_1.default.join(tempStateDir, "agent");
                    process.env.PI_CODING_AGENT_DIR = process.env.OPENCLAW_AGENT_DIR;
                    process.env.AI_GATEWAY_API_KEY = "gateway-test-key";
                    text = vitest_1.vi.fn();
                    select = vitest_1.vi.fn(function (params) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (_a = params.options[0]) === null || _a === void 0 ? void 0 : _a.value];
                    }); }); });
                    multiselect = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, []];
                    }); }); });
                    confirm = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, true];
                    }); }); });
                    prompter = {
                        intro: vitest_1.vi.fn(noopAsync),
                        outro: vitest_1.vi.fn(noopAsync),
                        note: vitest_1.vi.fn(noopAsync),
                        select: select,
                        multiselect: multiselect,
                        text: text,
                        confirm: confirm,
                        progress: vitest_1.vi.fn(function () { return ({ update: noop, stop: noop }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(function (code) {
                            throw new Error("exit:".concat(code));
                        }),
                    };
                    return [4 /*yield*/, (0, auth_choice_js_1.applyAuthChoice)({
                            authChoice: "ai-gateway-api-key",
                            config: {},
                            prompter: prompter,
                            runtime: runtime,
                            setDefaultModel: true,
                        })];
                case 2:
                    result = _h.sent();
                    (0, vitest_1.expect)(confirm).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        message: vitest_1.expect.stringContaining("AI_GATEWAY_API_KEY"),
                    }));
                    (0, vitest_1.expect)(text).not.toHaveBeenCalled();
                    (0, vitest_1.expect)((_b = (_a = result.config.auth) === null || _a === void 0 ? void 0 : _a.profiles) === null || _b === void 0 ? void 0 : _b["vercel-ai-gateway:default"]).toMatchObject({
                        provider: "vercel-ai-gateway",
                        mode: "api_key",
                    });
                    (0, vitest_1.expect)((_e = (_d = (_c = result.config.agents) === null || _c === void 0 ? void 0 : _c.defaults) === null || _d === void 0 ? void 0 : _d.model) === null || _e === void 0 ? void 0 : _e.primary).toBe("vercel-ai-gateway/anthropic/claude-opus-4.5");
                    authProfilePath = authProfilePathFor(requireAgentDir());
                    return [4 /*yield*/, promises_1.default.readFile(authProfilePath, "utf8")];
                case 3:
                    raw = _h.sent();
                    parsed = JSON.parse(raw);
                    (0, vitest_1.expect)((_g = (_f = parsed.profiles) === null || _f === void 0 ? void 0 : _f["vercel-ai-gateway:default"]) === null || _g === void 0 ? void 0 : _g.key).toBe("gateway-test-key");
                    delete process.env.AI_GATEWAY_API_KEY;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("writes Chutes OAuth credentials when selecting chutes (remote/manual)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchSpy, text, select, multiselect, prompter, runtime, result, authProfilePath, raw, parsed;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"))];
                case 1:
                    tempStateDir = _d.sent();
                    process.env.OPENCLAW_STATE_DIR = tempStateDir;
                    process.env.OPENCLAW_AGENT_DIR = node_path_1.default.join(tempStateDir, "agent");
                    process.env.PI_CODING_AGENT_DIR = process.env.OPENCLAW_AGENT_DIR;
                    process.env.SSH_TTY = "1";
                    process.env.CHUTES_CLIENT_ID = "cid_test";
                    fetchSpy = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input.toString();
                            if (url === "https://api.chutes.ai/idp/token") {
                                return [2 /*return*/, new Response(JSON.stringify({
                                        access_token: "at_test",
                                        refresh_token: "rt_test",
                                        expires_in: 3600,
                                    }), { status: 200, headers: { "Content-Type": "application/json" } })];
                            }
                            if (url === "https://api.chutes.ai/idp/userinfo") {
                                return [2 /*return*/, new Response(JSON.stringify({ username: "remote-user" }), {
                                        status: 200,
                                        headers: { "Content-Type": "application/json" },
                                    })];
                            }
                            return [2 /*return*/, new Response("not found", { status: 404 })];
                        });
                    }); });
                    vitest_1.vi.stubGlobal("fetch", fetchSpy);
                    text = vitest_1.vi.fn().mockResolvedValue("code_manual");
                    select = vitest_1.vi.fn(function (params) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (_a = params.options[0]) === null || _a === void 0 ? void 0 : _a.value];
                    }); }); });
                    multiselect = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, []];
                    }); }); });
                    prompter = {
                        intro: vitest_1.vi.fn(noopAsync),
                        outro: vitest_1.vi.fn(noopAsync),
                        note: vitest_1.vi.fn(noopAsync),
                        select: select,
                        multiselect: multiselect,
                        text: text,
                        confirm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); }),
                        progress: vitest_1.vi.fn(function () { return ({ update: noop, stop: noop }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(function (code) {
                            throw new Error("exit:".concat(code));
                        }),
                    };
                    return [4 /*yield*/, (0, auth_choice_js_1.applyAuthChoice)({
                            authChoice: "chutes",
                            config: {},
                            prompter: prompter,
                            runtime: runtime,
                            setDefaultModel: false,
                        })];
                case 2:
                    result = _d.sent();
                    (0, vitest_1.expect)(text).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        message: "Paste the redirect URL (or authorization code)",
                    }));
                    (0, vitest_1.expect)((_b = (_a = result.config.auth) === null || _a === void 0 ? void 0 : _a.profiles) === null || _b === void 0 ? void 0 : _b["chutes:remote-user"]).toMatchObject({
                        provider: "chutes",
                        mode: "oauth",
                    });
                    authProfilePath = authProfilePathFor(requireAgentDir());
                    return [4 /*yield*/, promises_1.default.readFile(authProfilePath, "utf8")];
                case 3:
                    raw = _d.sent();
                    parsed = JSON.parse(raw);
                    (0, vitest_1.expect)((_c = parsed.profiles) === null || _c === void 0 ? void 0 : _c["chutes:remote-user"]).toMatchObject({
                        provider: "chutes",
                        access: "at_test",
                        refresh: "rt_test",
                        email: "remote-user",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("writes Qwen credentials when selecting qwen-portal", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prompter, runtime, result, authProfilePath, raw, parsed;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"))];
                case 1:
                    tempStateDir = _j.sent();
                    process.env.OPENCLAW_STATE_DIR = tempStateDir;
                    process.env.OPENCLAW_AGENT_DIR = node_path_1.default.join(tempStateDir, "agent");
                    process.env.PI_CODING_AGENT_DIR = process.env.OPENCLAW_AGENT_DIR;
                    resolvePluginProviders.mockReturnValue([
                        {
                            id: "qwen-portal",
                            label: "Qwen",
                            auth: [
                                {
                                    id: "device",
                                    label: "Qwen OAuth",
                                    kind: "device_code",
                                    run: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, ({
                                                    profiles: [
                                                        {
                                                            profileId: "qwen-portal:default",
                                                            credential: {
                                                                type: "oauth",
                                                                provider: "qwen-portal",
                                                                access: "access",
                                                                refresh: "refresh",
                                                                expires: Date.now() + 60 * 60 * 1000,
                                                            },
                                                        },
                                                    ],
                                                    configPatch: {
                                                        models: {
                                                            providers: {
                                                                "qwen-portal": {
                                                                    baseUrl: "https://portal.qwen.ai/v1",
                                                                    apiKey: "qwen-oauth",
                                                                    api: "openai-completions",
                                                                    models: [],
                                                                },
                                                            },
                                                        },
                                                    },
                                                    defaultModel: "qwen-portal/coder-model",
                                                })];
                                        });
                                    }); }),
                                },
                            ],
                        },
                    ]);
                    prompter = {
                        intro: vitest_1.vi.fn(noopAsync),
                        outro: vitest_1.vi.fn(noopAsync),
                        note: vitest_1.vi.fn(noopAsync),
                        select: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ""];
                        }); }); }),
                        multiselect: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, []];
                        }); }); }),
                        text: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ""];
                        }); }); }),
                        confirm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); }),
                        progress: vitest_1.vi.fn(function () { return ({ update: noop, stop: noop }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(function (code) {
                            throw new Error("exit:".concat(code));
                        }),
                    };
                    return [4 /*yield*/, (0, auth_choice_js_1.applyAuthChoice)({
                            authChoice: "qwen-portal",
                            config: {},
                            prompter: prompter,
                            runtime: runtime,
                            setDefaultModel: true,
                        })];
                case 2:
                    result = _j.sent();
                    (0, vitest_1.expect)((_b = (_a = result.config.auth) === null || _a === void 0 ? void 0 : _a.profiles) === null || _b === void 0 ? void 0 : _b["qwen-portal:default"]).toMatchObject({
                        provider: "qwen-portal",
                        mode: "oauth",
                    });
                    (0, vitest_1.expect)((_e = (_d = (_c = result.config.agents) === null || _c === void 0 ? void 0 : _c.defaults) === null || _d === void 0 ? void 0 : _d.model) === null || _e === void 0 ? void 0 : _e.primary).toBe("qwen-portal/coder-model");
                    (0, vitest_1.expect)((_g = (_f = result.config.models) === null || _f === void 0 ? void 0 : _f.providers) === null || _g === void 0 ? void 0 : _g["qwen-portal"]).toMatchObject({
                        baseUrl: "https://portal.qwen.ai/v1",
                        apiKey: "qwen-oauth",
                    });
                    authProfilePath = authProfilePathFor(requireAgentDir());
                    return [4 /*yield*/, promises_1.default.readFile(authProfilePath, "utf8")];
                case 3:
                    raw = _j.sent();
                    parsed = JSON.parse(raw);
                    (0, vitest_1.expect)((_h = parsed.profiles) === null || _h === void 0 ? void 0 : _h["qwen-portal:default"]).toMatchObject({
                        provider: "qwen-portal",
                        access: "access",
                        refresh: "refresh",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("writes MiniMax credentials when selecting minimax-portal", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prompter, runtime, result, authProfilePath, raw, parsed;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"))];
                case 1:
                    tempStateDir = _j.sent();
                    process.env.OPENCLAW_STATE_DIR = tempStateDir;
                    process.env.OPENCLAW_AGENT_DIR = node_path_1.default.join(tempStateDir, "agent");
                    process.env.PI_CODING_AGENT_DIR = process.env.OPENCLAW_AGENT_DIR;
                    resolvePluginProviders.mockReturnValue([
                        {
                            id: "minimax-portal",
                            label: "MiniMax",
                            auth: [
                                {
                                    id: "oauth",
                                    label: "MiniMax OAuth (Global)",
                                    kind: "device_code",
                                    run: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, ({
                                                    profiles: [
                                                        {
                                                            profileId: "minimax-portal:default",
                                                            credential: {
                                                                type: "oauth",
                                                                provider: "minimax-portal",
                                                                access: "access",
                                                                refresh: "refresh",
                                                                expires: Date.now() + 60 * 60 * 1000,
                                                            },
                                                        },
                                                    ],
                                                    configPatch: {
                                                        models: {
                                                            providers: {
                                                                "minimax-portal": {
                                                                    baseUrl: "https://api.minimax.io/anthropic",
                                                                    apiKey: "minimax-oauth",
                                                                    api: "anthropic-messages",
                                                                    models: [],
                                                                },
                                                            },
                                                        },
                                                    },
                                                    defaultModel: "minimax-portal/MiniMax-M2.1",
                                                })];
                                        });
                                    }); }),
                                },
                            ],
                        },
                    ]);
                    prompter = {
                        intro: vitest_1.vi.fn(noopAsync),
                        outro: vitest_1.vi.fn(noopAsync),
                        note: vitest_1.vi.fn(noopAsync),
                        select: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, "oauth"];
                        }); }); }),
                        multiselect: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, []];
                        }); }); }),
                        text: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ""];
                        }); }); }),
                        confirm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); }),
                        progress: vitest_1.vi.fn(function () { return ({ update: noop, stop: noop }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(function (code) {
                            throw new Error("exit:".concat(code));
                        }),
                    };
                    return [4 /*yield*/, (0, auth_choice_js_1.applyAuthChoice)({
                            authChoice: "minimax-portal",
                            config: {},
                            prompter: prompter,
                            runtime: runtime,
                            setDefaultModel: true,
                        })];
                case 2:
                    result = _j.sent();
                    (0, vitest_1.expect)((_b = (_a = result.config.auth) === null || _a === void 0 ? void 0 : _a.profiles) === null || _b === void 0 ? void 0 : _b["minimax-portal:default"]).toMatchObject({
                        provider: "minimax-portal",
                        mode: "oauth",
                    });
                    (0, vitest_1.expect)((_e = (_d = (_c = result.config.agents) === null || _c === void 0 ? void 0 : _c.defaults) === null || _d === void 0 ? void 0 : _d.model) === null || _e === void 0 ? void 0 : _e.primary).toBe("minimax-portal/MiniMax-M2.1");
                    (0, vitest_1.expect)((_g = (_f = result.config.models) === null || _f === void 0 ? void 0 : _f.providers) === null || _g === void 0 ? void 0 : _g["minimax-portal"]).toMatchObject({
                        baseUrl: "https://api.minimax.io/anthropic",
                        apiKey: "minimax-oauth",
                    });
                    authProfilePath = authProfilePathFor(requireAgentDir());
                    return [4 /*yield*/, promises_1.default.readFile(authProfilePath, "utf8")];
                case 3:
                    raw = _j.sent();
                    parsed = JSON.parse(raw);
                    (0, vitest_1.expect)((_h = parsed.profiles) === null || _h === void 0 ? void 0 : _h["minimax-portal:default"]).toMatchObject({
                        provider: "minimax-portal",
                        access: "access",
                        refresh: "refresh",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("resolvePreferredProviderForAuthChoice", function () {
    (0, vitest_1.it)("maps github-copilot to the provider", function () {
        (0, vitest_1.expect)((0, auth_choice_js_1.resolvePreferredProviderForAuthChoice)("github-copilot")).toBe("github-copilot");
    });
    (0, vitest_1.it)("maps qwen-portal to the provider", function () {
        (0, vitest_1.expect)((0, auth_choice_js_1.resolvePreferredProviderForAuthChoice)("qwen-portal")).toBe("qwen-portal");
    });
    (0, vitest_1.it)("returns undefined for unknown choices", function () {
        (0, vitest_1.expect)((0, auth_choice_js_1.resolvePreferredProviderForAuthChoice)("unknown")).toBeUndefined();
    });
});
