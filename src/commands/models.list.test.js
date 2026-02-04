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
var vitest_1 = require("vitest");
var loadConfig = vitest_1.vi.fn();
var ensureOpenClawModelsJson = vitest_1.vi.fn().mockResolvedValue(undefined);
var resolveOpenClawAgentDir = vitest_1.vi.fn().mockReturnValue("/tmp/openclaw-agent");
var ensureAuthProfileStore = vitest_1.vi.fn().mockReturnValue({ version: 1, profiles: {} });
var listProfilesForProvider = vitest_1.vi.fn().mockReturnValue([]);
var resolveAuthProfileDisplayLabel = vitest_1.vi.fn(function (_a) {
    var profileId = _a.profileId;
    return profileId;
});
var resolveAuthStorePathForDisplay = vitest_1.vi
    .fn()
    .mockReturnValue("/tmp/openclaw-agent/auth-profiles.json");
var resolveProfileUnusableUntilForDisplay = vitest_1.vi.fn().mockReturnValue(null);
var resolveEnvApiKey = vitest_1.vi.fn().mockReturnValue(undefined);
var resolveAwsSdkEnvVarName = vitest_1.vi.fn().mockReturnValue(undefined);
var getCustomProviderApiKey = vitest_1.vi.fn().mockReturnValue(undefined);
var modelRegistryState = {
    models: [],
    available: [],
};
vitest_1.vi.mock("../config/config.js", function () { return ({
    CONFIG_PATH: "/tmp/openclaw.json",
    STATE_DIR: "/tmp/openclaw-state",
    loadConfig: loadConfig,
}); });
vitest_1.vi.mock("../agents/models-config.js", function () { return ({
    ensureOpenClawModelsJson: ensureOpenClawModelsJson,
}); });
vitest_1.vi.mock("../agents/agent-paths.js", function () { return ({
    resolveOpenClawAgentDir: resolveOpenClawAgentDir,
}); });
vitest_1.vi.mock("../agents/auth-profiles.js", function () { return ({
    ensureAuthProfileStore: ensureAuthProfileStore,
    listProfilesForProvider: listProfilesForProvider,
    resolveAuthProfileDisplayLabel: resolveAuthProfileDisplayLabel,
    resolveAuthStorePathForDisplay: resolveAuthStorePathForDisplay,
    resolveProfileUnusableUntilForDisplay: resolveProfileUnusableUntilForDisplay,
}); });
vitest_1.vi.mock("../agents/model-auth.js", function () { return ({
    resolveEnvApiKey: resolveEnvApiKey,
    resolveAwsSdkEnvVarName: resolveAwsSdkEnvVarName,
    getCustomProviderApiKey: getCustomProviderApiKey,
}); });
vitest_1.vi.mock("@mariozechner/pi-coding-agent", function () { return ({
    AuthStorage: /** @class */ (function () {
        function AuthStorage() {
        }
        return AuthStorage;
    }()),
    ModelRegistry: /** @class */ (function () {
        function ModelRegistry() {
        }
        ModelRegistry.prototype.getAll = function () {
            return modelRegistryState.models;
        };
        ModelRegistry.prototype.getAvailable = function () {
            return modelRegistryState.available;
        };
        return ModelRegistry;
    }()),
}); });
function makeRuntime() {
    return {
        log: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
    };
}
(0, vitest_1.describe)("models list/status", function () {
    (0, vitest_1.it)("models status resolves z.ai alias to canonical zai", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, modelsStatusCommand, payload;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    loadConfig.mockReturnValue({
                        agents: { defaults: { model: "z.ai/glm-4.7" } },
                    });
                    runtime = makeRuntime();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./models/list.js"); })];
                case 1:
                    modelsStatusCommand = (_b.sent()).modelsStatusCommand;
                    return [4 /*yield*/, modelsStatusCommand({ json: true }, runtime)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledTimes(1);
                    payload = JSON.parse(String((_a = runtime.log.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]));
                    (0, vitest_1.expect)(payload.resolvedDefault).toBe("zai/glm-4.7");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("models status plain outputs canonical zai model", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, modelsStatusCommand;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    loadConfig.mockReturnValue({
                        agents: { defaults: { model: "z.ai/glm-4.7" } },
                    });
                    runtime = makeRuntime();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./models/list.js"); })];
                case 1:
                    modelsStatusCommand = (_b.sent()).modelsStatusCommand;
                    return [4 /*yield*/, modelsStatusCommand({ plain: true }, runtime)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)((_a = runtime.log.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]).toBe("zai/glm-4.7");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("models list outputs canonical zai key for configured z.ai model", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, model, modelsListCommand, payload;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    loadConfig.mockReturnValue({
                        agents: { defaults: { model: "z.ai/glm-4.7" } },
                    });
                    runtime = makeRuntime();
                    model = {
                        provider: "zai",
                        id: "glm-4.7",
                        name: "GLM-4.7",
                        input: ["text"],
                        baseUrl: "https://api.z.ai/v1",
                        contextWindow: 128000,
                    };
                    modelRegistryState.models = [model];
                    modelRegistryState.available = [model];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./models/list.js"); })];
                case 1:
                    modelsListCommand = (_c.sent()).modelsListCommand;
                    return [4 /*yield*/, modelsListCommand({ json: true }, runtime)];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledTimes(1);
                    payload = JSON.parse(String((_a = runtime.log.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]));
                    (0, vitest_1.expect)((_b = payload.models[0]) === null || _b === void 0 ? void 0 : _b.key).toBe("zai/glm-4.7");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("models list plain outputs canonical zai key", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, model, modelsListCommand;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    loadConfig.mockReturnValue({
                        agents: { defaults: { model: "z.ai/glm-4.7" } },
                    });
                    runtime = makeRuntime();
                    model = {
                        provider: "zai",
                        id: "glm-4.7",
                        name: "GLM-4.7",
                        input: ["text"],
                        baseUrl: "https://api.z.ai/v1",
                        contextWindow: 128000,
                    };
                    modelRegistryState.models = [model];
                    modelRegistryState.available = [model];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./models/list.js"); })];
                case 1:
                    modelsListCommand = (_b.sent()).modelsListCommand;
                    return [4 /*yield*/, modelsListCommand({ plain: true }, runtime)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)((_a = runtime.log.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]).toBe("zai/glm-4.7");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("models list provider filter normalizes z.ai alias", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, models, modelsListCommand, payload;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    loadConfig.mockReturnValue({
                        agents: { defaults: { model: "z.ai/glm-4.7" } },
                    });
                    runtime = makeRuntime();
                    models = [
                        {
                            provider: "zai",
                            id: "glm-4.7",
                            name: "GLM-4.7",
                            input: ["text"],
                            baseUrl: "https://api.z.ai/v1",
                            contextWindow: 128000,
                        },
                        {
                            provider: "openai",
                            id: "gpt-4.1-mini",
                            name: "GPT-4.1 mini",
                            input: ["text"],
                            baseUrl: "https://api.openai.com/v1",
                            contextWindow: 128000,
                        },
                    ];
                    modelRegistryState.models = models;
                    modelRegistryState.available = models;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./models/list.js"); })];
                case 1:
                    modelsListCommand = (_c.sent()).modelsListCommand;
                    return [4 /*yield*/, modelsListCommand({ all: true, provider: "z.ai", json: true }, runtime)];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledTimes(1);
                    payload = JSON.parse(String((_a = runtime.log.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]));
                    (0, vitest_1.expect)(payload.count).toBe(1);
                    (0, vitest_1.expect)((_b = payload.models[0]) === null || _b === void 0 ? void 0 : _b.key).toBe("zai/glm-4.7");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("models list provider filter normalizes Z.AI alias casing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, models, modelsListCommand, payload;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    loadConfig.mockReturnValue({
                        agents: { defaults: { model: "z.ai/glm-4.7" } },
                    });
                    runtime = makeRuntime();
                    models = [
                        {
                            provider: "zai",
                            id: "glm-4.7",
                            name: "GLM-4.7",
                            input: ["text"],
                            baseUrl: "https://api.z.ai/v1",
                            contextWindow: 128000,
                        },
                        {
                            provider: "openai",
                            id: "gpt-4.1-mini",
                            name: "GPT-4.1 mini",
                            input: ["text"],
                            baseUrl: "https://api.openai.com/v1",
                            contextWindow: 128000,
                        },
                    ];
                    modelRegistryState.models = models;
                    modelRegistryState.available = models;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./models/list.js"); })];
                case 1:
                    modelsListCommand = (_c.sent()).modelsListCommand;
                    return [4 /*yield*/, modelsListCommand({ all: true, provider: "Z.AI", json: true }, runtime)];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledTimes(1);
                    payload = JSON.parse(String((_a = runtime.log.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]));
                    (0, vitest_1.expect)(payload.count).toBe(1);
                    (0, vitest_1.expect)((_b = payload.models[0]) === null || _b === void 0 ? void 0 : _b.key).toBe("zai/glm-4.7");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("models list provider filter normalizes z-ai alias", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, models, modelsListCommand, payload;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    loadConfig.mockReturnValue({
                        agents: { defaults: { model: "z.ai/glm-4.7" } },
                    });
                    runtime = makeRuntime();
                    models = [
                        {
                            provider: "zai",
                            id: "glm-4.7",
                            name: "GLM-4.7",
                            input: ["text"],
                            baseUrl: "https://api.z.ai/v1",
                            contextWindow: 128000,
                        },
                        {
                            provider: "openai",
                            id: "gpt-4.1-mini",
                            name: "GPT-4.1 mini",
                            input: ["text"],
                            baseUrl: "https://api.openai.com/v1",
                            contextWindow: 128000,
                        },
                    ];
                    modelRegistryState.models = models;
                    modelRegistryState.available = models;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./models/list.js"); })];
                case 1:
                    modelsListCommand = (_c.sent()).modelsListCommand;
                    return [4 /*yield*/, modelsListCommand({ all: true, provider: "z-ai", json: true }, runtime)];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledTimes(1);
                    payload = JSON.parse(String((_a = runtime.log.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]));
                    (0, vitest_1.expect)(payload.count).toBe(1);
                    (0, vitest_1.expect)((_b = payload.models[0]) === null || _b === void 0 ? void 0 : _b.key).toBe("zai/glm-4.7");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("models list marks auth as unavailable when ZAI key is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, model, modelsListCommand, payload;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    loadConfig.mockReturnValue({
                        agents: { defaults: { model: "z.ai/glm-4.7" } },
                    });
                    runtime = makeRuntime();
                    model = {
                        provider: "zai",
                        id: "glm-4.7",
                        name: "GLM-4.7",
                        input: ["text"],
                        baseUrl: "https://api.z.ai/v1",
                        contextWindow: 128000,
                    };
                    modelRegistryState.models = [model];
                    modelRegistryState.available = [];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./models/list.js"); })];
                case 1:
                    modelsListCommand = (_c.sent()).modelsListCommand;
                    return [4 /*yield*/, modelsListCommand({ all: true, json: true }, runtime)];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledTimes(1);
                    payload = JSON.parse(String((_a = runtime.log.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]));
                    (0, vitest_1.expect)((_b = payload.models[0]) === null || _b === void 0 ? void 0 : _b.available).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
