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
function withTempHome(fn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, temp_home_js_1.withTempHome)(fn, { prefix: "openclaw-models-" })];
        });
    });
}
var MODELS_CONFIG = {
    models: {
        providers: {
            "custom-proxy": {
                baseUrl: "http://localhost:4000/v1",
                apiKey: "TEST_KEY",
                api: "openai-completions",
                models: [
                    {
                        id: "llama-3.1-8b",
                        name: "Llama 3.1 8B (Proxy)",
                        api: "openai-completions",
                        reasoning: false,
                        input: ["text"],
                        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                        contextWindow: 128000,
                        maxTokens: 32000,
                    },
                ],
            },
        },
    },
};
(0, vitest_1.describe)("models-config", function () {
    var previousHome;
    (0, vitest_1.beforeEach)(function () {
        previousHome = process.env.HOME;
    });
    (0, vitest_1.afterEach)(function () {
        process.env.HOME = previousHome;
    });
    (0, vitest_1.it)("fills missing provider.apiKey from env var name when models exist", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var prevKey, ensureOpenClawModelsJson, resolveOpenClawAgentDir, cfg, modelPath, raw, parsed, ids;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    vitest_1.vi.resetModules();
                                    prevKey = process.env.MINIMAX_API_KEY;
                                    process.env.MINIMAX_API_KEY = "sk-minimax-test";
                                    _d.label = 1;
                                case 1:
                                    _d.trys.push([1, , 6, 7]);
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./models-config.js"); })];
                                case 2:
                                    ensureOpenClawModelsJson = (_d.sent()).ensureOpenClawModelsJson;
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./agent-paths.js"); })];
                                case 3:
                                    resolveOpenClawAgentDir = (_d.sent()).resolveOpenClawAgentDir;
                                    cfg = {
                                        models: {
                                            providers: {
                                                minimax: {
                                                    baseUrl: "https://api.minimax.io/anthropic",
                                                    api: "anthropic-messages",
                                                    models: [
                                                        {
                                                            id: "MiniMax-M2.1",
                                                            name: "MiniMax M2.1",
                                                            reasoning: false,
                                                            input: ["text"],
                                                            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                                                            contextWindow: 200000,
                                                            maxTokens: 8192,
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    };
                                    return [4 /*yield*/, ensureOpenClawModelsJson(cfg)];
                                case 4:
                                    _d.sent();
                                    modelPath = node_path_1.default.join(resolveOpenClawAgentDir(), "models.json");
                                    return [4 /*yield*/, promises_1.default.readFile(modelPath, "utf8")];
                                case 5:
                                    raw = _d.sent();
                                    parsed = JSON.parse(raw);
                                    (0, vitest_1.expect)((_a = parsed.providers.minimax) === null || _a === void 0 ? void 0 : _a.apiKey).toBe("MINIMAX_API_KEY");
                                    ids = (_c = (_b = parsed.providers.minimax) === null || _b === void 0 ? void 0 : _b.models) === null || _c === void 0 ? void 0 : _c.map(function (model) { return model.id; });
                                    (0, vitest_1.expect)(ids).toContain("MiniMax-VL-01");
                                    return [3 /*break*/, 7];
                                case 6:
                                    if (prevKey === undefined) {
                                        delete process.env.MINIMAX_API_KEY;
                                    }
                                    else {
                                        process.env.MINIMAX_API_KEY = prevKey;
                                    }
                                    return [7 /*endfinally*/];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("merges providers by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var ensureOpenClawModelsJson, resolveOpenClawAgentDir, agentDir, raw, parsed;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./models-config.js"); })];
                                case 1:
                                    ensureOpenClawModelsJson = (_c.sent()).ensureOpenClawModelsJson;
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./agent-paths.js"); })];
                                case 2:
                                    resolveOpenClawAgentDir = (_c.sent()).resolveOpenClawAgentDir;
                                    agentDir = resolveOpenClawAgentDir();
                                    return [4 /*yield*/, promises_1.default.mkdir(agentDir, { recursive: true })];
                                case 3:
                                    _c.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(agentDir, "models.json"), JSON.stringify({
                                            providers: {
                                                existing: {
                                                    baseUrl: "http://localhost:1234/v1",
                                                    apiKey: "EXISTING_KEY",
                                                    api: "openai-completions",
                                                    models: [
                                                        {
                                                            id: "existing-model",
                                                            name: "Existing",
                                                            api: "openai-completions",
                                                            reasoning: false,
                                                            input: ["text"],
                                                            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                                                            contextWindow: 8192,
                                                            maxTokens: 2048,
                                                        },
                                                    ],
                                                },
                                            },
                                        }, null, 2), "utf8")];
                                case 4:
                                    _c.sent();
                                    return [4 /*yield*/, ensureOpenClawModelsJson(MODELS_CONFIG)];
                                case 5:
                                    _c.sent();
                                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(agentDir, "models.json"), "utf8")];
                                case 6:
                                    raw = _c.sent();
                                    parsed = JSON.parse(raw);
                                    (0, vitest_1.expect)((_a = parsed.providers.existing) === null || _a === void 0 ? void 0 : _a.baseUrl).toBe("http://localhost:1234/v1");
                                    (0, vitest_1.expect)((_b = parsed.providers["custom-proxy"]) === null || _b === void 0 ? void 0 : _b.baseUrl).toBe("http://localhost:4000/v1");
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
