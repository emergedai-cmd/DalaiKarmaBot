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
var agent_limits_js_1 = require("./agent-limits.js");
var test_helpers_js_1 = require("./test-helpers.js");
(0, vitest_1.describe)("config identity defaults", function () {
    var previousHome;
    (0, vitest_1.beforeEach)(function () {
        previousHome = process.env.HOME;
    });
    (0, vitest_1.afterEach)(function () {
        process.env.HOME = previousHome;
    });
    (0, vitest_1.it)("does not derive mentionPatterns when identity is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configDir, loadConfig, cfg;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    configDir = node_path_1.default.join(home, ".openclaw");
                                    return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                case 1:
                                    _d.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                            agents: {
                                                list: [
                                                    {
                                                        id: "main",
                                                        identity: {
                                                            name: "Samantha",
                                                            theme: "helpful sloth",
                                                            emoji: "🦥",
                                                        },
                                                    },
                                                ],
                                            },
                                            messages: {},
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _d.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    loadConfig = (_d.sent()).loadConfig;
                                    cfg = loadConfig();
                                    (0, vitest_1.expect)((_a = cfg.messages) === null || _a === void 0 ? void 0 : _a.responsePrefix).toBeUndefined();
                                    (0, vitest_1.expect)((_c = (_b = cfg.messages) === null || _b === void 0 ? void 0 : _b.groupChat) === null || _c === void 0 ? void 0 : _c.mentionPatterns).toBeUndefined();
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
    (0, vitest_1.it)("defaults ackReactionScope without setting ackReaction", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configDir, loadConfig, cfg;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    configDir = node_path_1.default.join(home, ".openclaw");
                                    return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                case 1:
                                    _c.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                            agents: {
                                                list: [
                                                    {
                                                        id: "main",
                                                        identity: {
                                                            name: "Samantha",
                                                            theme: "helpful sloth",
                                                            emoji: "🦥",
                                                        },
                                                    },
                                                ],
                                            },
                                            messages: {},
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _c.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    loadConfig = (_c.sent()).loadConfig;
                                    cfg = loadConfig();
                                    (0, vitest_1.expect)((_a = cfg.messages) === null || _a === void 0 ? void 0 : _a.ackReaction).toBeUndefined();
                                    (0, vitest_1.expect)((_b = cfg.messages) === null || _b === void 0 ? void 0 : _b.ackReactionScope).toBe("group-mentions");
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
    (0, vitest_1.it)("keeps ackReaction unset when identity is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configDir, loadConfig, cfg;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    configDir = node_path_1.default.join(home, ".openclaw");
                                    return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                case 1:
                                    _c.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                            messages: {},
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _c.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    loadConfig = (_c.sent()).loadConfig;
                                    cfg = loadConfig();
                                    (0, vitest_1.expect)((_a = cfg.messages) === null || _a === void 0 ? void 0 : _a.ackReaction).toBeUndefined();
                                    (0, vitest_1.expect)((_b = cfg.messages) === null || _b === void 0 ? void 0 : _b.ackReactionScope).toBe("group-mentions");
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
    (0, vitest_1.it)("does not override explicit values", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configDir, loadConfig, cfg;
                        var _a, _b, _c, _d, _e;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    configDir = node_path_1.default.join(home, ".openclaw");
                                    return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                case 1:
                                    _f.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                            agents: {
                                                list: [
                                                    {
                                                        id: "main",
                                                        identity: {
                                                            name: "Samantha Sloth",
                                                            theme: "space lobster",
                                                            emoji: "🦞",
                                                        },
                                                        groupChat: { mentionPatterns: ["@openclaw"] },
                                                    },
                                                ],
                                            },
                                            messages: {
                                                responsePrefix: "✅",
                                            },
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _f.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    loadConfig = (_f.sent()).loadConfig;
                                    cfg = loadConfig();
                                    (0, vitest_1.expect)((_a = cfg.messages) === null || _a === void 0 ? void 0 : _a.responsePrefix).toBe("✅");
                                    (0, vitest_1.expect)((_e = (_d = (_c = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.groupChat) === null || _e === void 0 ? void 0 : _e.mentionPatterns).toEqual(["@openclaw"]);
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
    (0, vitest_1.it)("supports provider textChunkLimit config", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configDir, loadConfig, cfg, legacy;
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                        return __generator(this, function (_o) {
                            switch (_o.label) {
                                case 0:
                                    configDir = node_path_1.default.join(home, ".openclaw");
                                    return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                case 1:
                                    _o.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                            messages: {
                                                messagePrefix: "[openclaw]",
                                                responsePrefix: "🦞",
                                            },
                                            channels: {
                                                whatsapp: { allowFrom: ["+15555550123"], textChunkLimit: 4444 },
                                                telegram: { enabled: true, textChunkLimit: 3333 },
                                                discord: {
                                                    enabled: true,
                                                    textChunkLimit: 1999,
                                                    maxLinesPerMessage: 17,
                                                },
                                                signal: { enabled: true, textChunkLimit: 2222 },
                                                imessage: { enabled: true, textChunkLimit: 1111 },
                                            },
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _o.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    loadConfig = (_o.sent()).loadConfig;
                                    cfg = loadConfig();
                                    (0, vitest_1.expect)((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.whatsapp) === null || _b === void 0 ? void 0 : _b.textChunkLimit).toBe(4444);
                                    (0, vitest_1.expect)((_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.telegram) === null || _d === void 0 ? void 0 : _d.textChunkLimit).toBe(3333);
                                    (0, vitest_1.expect)((_f = (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e.discord) === null || _f === void 0 ? void 0 : _f.textChunkLimit).toBe(1999);
                                    (0, vitest_1.expect)((_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.discord) === null || _h === void 0 ? void 0 : _h.maxLinesPerMessage).toBe(17);
                                    (0, vitest_1.expect)((_k = (_j = cfg.channels) === null || _j === void 0 ? void 0 : _j.signal) === null || _k === void 0 ? void 0 : _k.textChunkLimit).toBe(2222);
                                    (0, vitest_1.expect)((_m = (_l = cfg.channels) === null || _l === void 0 ? void 0 : _l.imessage) === null || _m === void 0 ? void 0 : _m.textChunkLimit).toBe(1111);
                                    legacy = cfg.messages.textChunkLimit;
                                    (0, vitest_1.expect)(legacy).toBeUndefined();
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
    (0, vitest_1.it)("accepts blank model provider apiKey values", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configDir, loadConfig, cfg;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    configDir = node_path_1.default.join(home, ".openclaw");
                                    return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                case 1:
                                    _d.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                            models: {
                                                mode: "merge",
                                                providers: {
                                                    minimax: {
                                                        baseUrl: "https://api.minimax.io/anthropic",
                                                        apiKey: "",
                                                        api: "anthropic-messages",
                                                        models: [
                                                            {
                                                                id: "MiniMax-M2.1",
                                                                name: "MiniMax M2.1",
                                                                reasoning: false,
                                                                input: ["text"],
                                                                cost: {
                                                                    input: 0,
                                                                    output: 0,
                                                                    cacheRead: 0,
                                                                    cacheWrite: 0,
                                                                },
                                                                contextWindow: 200000,
                                                                maxTokens: 8192,
                                                            },
                                                        ],
                                                    },
                                                },
                                            },
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _d.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    loadConfig = (_d.sent()).loadConfig;
                                    cfg = loadConfig();
                                    (0, vitest_1.expect)((_c = (_b = (_a = cfg.models) === null || _a === void 0 ? void 0 : _a.providers) === null || _b === void 0 ? void 0 : _b.minimax) === null || _c === void 0 ? void 0 : _c.baseUrl).toBe("https://api.minimax.io/anthropic");
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
    (0, vitest_1.it)("respects empty responsePrefix to disable identity defaults", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configDir, loadConfig, cfg;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    configDir = node_path_1.default.join(home, ".openclaw");
                                    return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                case 1:
                                    _b.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                            agents: {
                                                list: [
                                                    {
                                                        id: "main",
                                                        identity: {
                                                            name: "Samantha",
                                                            theme: "helpful sloth",
                                                            emoji: "🦥",
                                                        },
                                                    },
                                                ],
                                            },
                                            messages: { responsePrefix: "" },
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _b.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    loadConfig = (_b.sent()).loadConfig;
                                    cfg = loadConfig();
                                    (0, vitest_1.expect)((_a = cfg.messages) === null || _a === void 0 ? void 0 : _a.responsePrefix).toBe("");
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
    (0, vitest_1.it)("does not synthesize agent list/session when absent", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configDir, loadConfig, cfg;
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                        return __generator(this, function (_k) {
                            switch (_k.label) {
                                case 0:
                                    configDir = node_path_1.default.join(home, ".openclaw");
                                    return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                case 1:
                                    _k.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                            messages: {},
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _k.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    loadConfig = (_k.sent()).loadConfig;
                                    cfg = loadConfig();
                                    (0, vitest_1.expect)((_a = cfg.messages) === null || _a === void 0 ? void 0 : _a.responsePrefix).toBeUndefined();
                                    (0, vitest_1.expect)((_c = (_b = cfg.messages) === null || _b === void 0 ? void 0 : _b.groupChat) === null || _c === void 0 ? void 0 : _c.mentionPatterns).toBeUndefined();
                                    (0, vitest_1.expect)((_d = cfg.agents) === null || _d === void 0 ? void 0 : _d.list).toBeUndefined();
                                    (0, vitest_1.expect)((_f = (_e = cfg.agents) === null || _e === void 0 ? void 0 : _e.defaults) === null || _f === void 0 ? void 0 : _f.maxConcurrent).toBe(agent_limits_js_1.DEFAULT_AGENT_MAX_CONCURRENT);
                                    (0, vitest_1.expect)((_j = (_h = (_g = cfg.agents) === null || _g === void 0 ? void 0 : _g.defaults) === null || _h === void 0 ? void 0 : _h.subagents) === null || _j === void 0 ? void 0 : _j.maxConcurrent).toBe(agent_limits_js_1.DEFAULT_SUBAGENT_MAX_CONCURRENT);
                                    (0, vitest_1.expect)(cfg.session).toBeUndefined();
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
    (0, vitest_1.it)("does not derive responsePrefix from identity emoji", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configDir, loadConfig, cfg;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    configDir = node_path_1.default.join(home, ".openclaw");
                                    return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                case 1:
                                    _b.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                            agents: {
                                                list: [
                                                    {
                                                        id: "main",
                                                        identity: {
                                                            name: "OpenClaw",
                                                            theme: "space lobster",
                                                            emoji: "🦞",
                                                        },
                                                    },
                                                ],
                                            },
                                            messages: {},
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _b.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    loadConfig = (_b.sent()).loadConfig;
                                    cfg = loadConfig();
                                    (0, vitest_1.expect)((_a = cfg.messages) === null || _a === void 0 ? void 0 : _a.responsePrefix).toBeUndefined();
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
