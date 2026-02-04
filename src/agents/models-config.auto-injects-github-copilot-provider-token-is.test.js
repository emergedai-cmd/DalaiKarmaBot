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
    (0, vitest_1.it)("auto-injects github-copilot provider when token is present", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var previous, ensureOpenClawModelsJson, agentDir, raw, parsed;
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    previous = process.env.COPILOT_GITHUB_TOKEN;
                                    process.env.COPILOT_GITHUB_TOKEN = "gh-token";
                                    _e.label = 1;
                                case 1:
                                    _e.trys.push([1, , 5, 6]);
                                    vitest_1.vi.resetModules();
                                    vitest_1.vi.doMock("../providers/github-copilot-token.js", function () { return ({
                                        DEFAULT_COPILOT_API_BASE_URL: "https://api.individual.githubcopilot.com",
                                        resolveCopilotApiToken: vitest_1.vi.fn().mockResolvedValue({
                                            token: "copilot",
                                            expiresAt: Date.now() + 60 * 60 * 1000,
                                            source: "mock",
                                            baseUrl: "https://api.copilot.example",
                                        }),
                                    }); });
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./models-config.js"); })];
                                case 2:
                                    ensureOpenClawModelsJson = (_e.sent()).ensureOpenClawModelsJson;
                                    agentDir = node_path_1.default.join(home, "agent-default-base-url");
                                    return [4 /*yield*/, ensureOpenClawModelsJson({ models: { providers: {} } }, agentDir)];
                                case 3:
                                    _e.sent();
                                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(agentDir, "models.json"), "utf8")];
                                case 4:
                                    raw = _e.sent();
                                    parsed = JSON.parse(raw);
                                    (0, vitest_1.expect)((_a = parsed.providers["github-copilot"]) === null || _a === void 0 ? void 0 : _a.baseUrl).toBe("https://api.copilot.example");
                                    (0, vitest_1.expect)((_d = (_c = (_b = parsed.providers["github-copilot"]) === null || _b === void 0 ? void 0 : _b.models) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0).toBe(0);
                                    return [3 /*break*/, 6];
                                case 5:
                                    process.env.COPILOT_GITHUB_TOKEN = previous;
                                    return [7 /*endfinally*/];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers COPILOT_GITHUB_TOKEN over GH_TOKEN and GITHUB_TOKEN", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var previous, previousGh, previousGithub, resolveCopilotApiToken_1, ensureOpenClawModelsJson;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    previous = process.env.COPILOT_GITHUB_TOKEN;
                                    previousGh = process.env.GH_TOKEN;
                                    previousGithub = process.env.GITHUB_TOKEN;
                                    process.env.COPILOT_GITHUB_TOKEN = "copilot-token";
                                    process.env.GH_TOKEN = "gh-token";
                                    process.env.GITHUB_TOKEN = "github-token";
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, , 4, 5]);
                                    vitest_1.vi.resetModules();
                                    resolveCopilotApiToken_1 = vitest_1.vi.fn().mockResolvedValue({
                                        token: "copilot",
                                        expiresAt: Date.now() + 60 * 60 * 1000,
                                        source: "mock",
                                        baseUrl: "https://api.copilot.example",
                                    });
                                    vitest_1.vi.doMock("../providers/github-copilot-token.js", function () { return ({
                                        DEFAULT_COPILOT_API_BASE_URL: "https://api.individual.githubcopilot.com",
                                        resolveCopilotApiToken: resolveCopilotApiToken_1,
                                    }); });
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./models-config.js"); })];
                                case 2:
                                    ensureOpenClawModelsJson = (_a.sent()).ensureOpenClawModelsJson;
                                    return [4 /*yield*/, ensureOpenClawModelsJson({ models: { providers: {} } })];
                                case 3:
                                    _a.sent();
                                    (0, vitest_1.expect)(resolveCopilotApiToken_1).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ githubToken: "copilot-token" }));
                                    return [3 /*break*/, 5];
                                case 4:
                                    process.env.COPILOT_GITHUB_TOKEN = previous;
                                    process.env.GH_TOKEN = previousGh;
                                    process.env.GITHUB_TOKEN = previousGithub;
                                    return [7 /*endfinally*/];
                                case 5: return [2 /*return*/];
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
