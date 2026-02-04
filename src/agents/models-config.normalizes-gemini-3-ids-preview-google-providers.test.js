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
var _MODELS_CONFIG = {
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
    (0, vitest_1.it)("normalizes gemini 3 ids to preview for google providers", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var ensureOpenClawModelsJson, resolveOpenClawAgentDir, cfg, modelPath, raw, parsed, ids;
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
                                    cfg = {
                                        models: {
                                            providers: {
                                                google: {
                                                    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
                                                    apiKey: "GEMINI_KEY",
                                                    api: "google-generative-ai",
                                                    models: [
                                                        {
                                                            id: "gemini-3-pro",
                                                            name: "Gemini 3 Pro",
                                                            api: "google-generative-ai",
                                                            reasoning: true,
                                                            input: ["text", "image"],
                                                            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                                                            contextWindow: 1048576,
                                                            maxTokens: 65536,
                                                        },
                                                        {
                                                            id: "gemini-3-flash",
                                                            name: "Gemini 3 Flash",
                                                            api: "google-generative-ai",
                                                            reasoning: false,
                                                            input: ["text", "image"],
                                                            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                                                            contextWindow: 1048576,
                                                            maxTokens: 65536,
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    };
                                    return [4 /*yield*/, ensureOpenClawModelsJson(cfg)];
                                case 3:
                                    _c.sent();
                                    modelPath = node_path_1.default.join(resolveOpenClawAgentDir(), "models.json");
                                    return [4 /*yield*/, promises_1.default.readFile(modelPath, "utf8")];
                                case 4:
                                    raw = _c.sent();
                                    parsed = JSON.parse(raw);
                                    ids = (_b = (_a = parsed.providers.google) === null || _a === void 0 ? void 0 : _a.models) === null || _b === void 0 ? void 0 : _b.map(function (model) { return model.id; });
                                    (0, vitest_1.expect)(ids).toEqual(["gemini-3-pro-preview", "gemini-3-flash-preview"]);
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
