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
var vitest_1 = require("vitest");
var mocks = vitest_1.vi.hoisted(function () {
    var store = {
        version: 1,
        profiles: {
            "anthropic:default": {
                type: "oauth",
                provider: "anthropic",
                access: "sk-ant-oat01-ACCESS-TOKEN-1234567890",
                refresh: "sk-ant-ort01-REFRESH-TOKEN-1234567890",
                expires: Date.now() + 60000,
                email: "peter@example.com",
            },
            "anthropic:work": {
                type: "api_key",
                provider: "anthropic",
                key: "sk-ant-api-0123456789abcdefghijklmnopqrstuvwxyz",
            },
            "openai-codex:default": {
                type: "oauth",
                provider: "openai-codex",
                access: "eyJhbGciOi-ACCESS",
                refresh: "oai-refresh-1234567890",
                expires: Date.now() + 60000,
            },
        },
    };
    return {
        store: store,
        resolveOpenClawAgentDir: vitest_1.vi.fn().mockReturnValue("/tmp/openclaw-agent"),
        resolveAgentDir: vitest_1.vi.fn().mockReturnValue("/tmp/openclaw-agent"),
        resolveAgentModelPrimary: vitest_1.vi.fn().mockReturnValue(undefined),
        resolveAgentModelFallbacksOverride: vitest_1.vi.fn().mockReturnValue(undefined),
        listAgentIds: vitest_1.vi.fn().mockReturnValue(["main", "jeremiah"]),
        ensureAuthProfileStore: vitest_1.vi.fn().mockReturnValue(store),
        listProfilesForProvider: vitest_1.vi.fn(function (s, provider) {
            return Object.entries(s.profiles)
                .filter(function (_a) {
                var cred = _a[1];
                return cred.provider === provider;
            })
                .map(function (_a) {
                var id = _a[0];
                return id;
            });
        }),
        resolveAuthProfileDisplayLabel: vitest_1.vi.fn(function (_a) {
            var profileId = _a.profileId;
            return profileId;
        }),
        resolveAuthStorePathForDisplay: vitest_1.vi
            .fn()
            .mockReturnValue("/tmp/openclaw-agent/auth-profiles.json"),
        resolveEnvApiKey: vitest_1.vi.fn(function (provider) {
            if (provider === "openai") {
                return {
                    apiKey: "sk-openai-0123456789abcdefghijklmnopqrstuvwxyz",
                    source: "shell env: OPENAI_API_KEY",
                };
            }
            if (provider === "anthropic") {
                return {
                    apiKey: "sk-ant-oat01-ACCESS-TOKEN-1234567890",
                    source: "env: ANTHROPIC_OAUTH_TOKEN",
                };
            }
            return null;
        }),
        getCustomProviderApiKey: vitest_1.vi.fn().mockReturnValue(undefined),
        getShellEnvAppliedKeys: vitest_1.vi.fn().mockReturnValue(["OPENAI_API_KEY", "ANTHROPIC_OAUTH_TOKEN"]),
        shouldEnableShellEnvFallback: vitest_1.vi.fn().mockReturnValue(true),
        loadConfig: vitest_1.vi.fn().mockReturnValue({
            agents: {
                defaults: {
                    model: { primary: "anthropic/claude-opus-4-5", fallbacks: [] },
                    models: { "anthropic/claude-opus-4-5": { alias: "Opus" } },
                },
            },
            models: { providers: {} },
            env: { shellEnv: { enabled: true } },
        }),
    };
});
vitest_1.vi.mock("../../agents/agent-paths.js", function () { return ({
    resolveOpenClawAgentDir: mocks.resolveOpenClawAgentDir,
}); });
vitest_1.vi.mock("../../agents/agent-scope.js", function () { return ({
    resolveAgentDir: mocks.resolveAgentDir,
    resolveAgentModelPrimary: mocks.resolveAgentModelPrimary,
    resolveAgentModelFallbacksOverride: mocks.resolveAgentModelFallbacksOverride,
    listAgentIds: mocks.listAgentIds,
}); });
vitest_1.vi.mock("../../agents/auth-profiles.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { ensureAuthProfileStore: mocks.ensureAuthProfileStore, listProfilesForProvider: mocks.listProfilesForProvider, resolveAuthProfileDisplayLabel: mocks.resolveAuthProfileDisplayLabel, resolveAuthStorePathForDisplay: mocks.resolveAuthStorePathForDisplay })];
        }
    });
}); });
vitest_1.vi.mock("../../agents/model-auth.js", function () { return ({
    resolveEnvApiKey: mocks.resolveEnvApiKey,
    getCustomProviderApiKey: mocks.getCustomProviderApiKey,
}); });
vitest_1.vi.mock("../../infra/shell-env.js", function () { return ({
    getShellEnvAppliedKeys: mocks.getShellEnvAppliedKeys,
    shouldEnableShellEnvFallback: mocks.shouldEnableShellEnvFallback,
}); });
vitest_1.vi.mock("../../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: mocks.loadConfig })];
        }
    });
}); });
var list_js_1 = require("./list.js");
var runtime = {
    log: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
    exit: vitest_1.vi.fn(),
};
(0, vitest_1.describe)("modelsStatusCommand auth overview", function () {
    (0, vitest_1.it)("includes masked auth sources in JSON output", function () { return __awaiter(void 0, void 0, void 0, function () {
        var payload, providers, anthropic, openai;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, list_js_1.modelsStatusCommand)({ json: true }, runtime)];
                case 1:
                    _c.sent();
                    payload = JSON.parse(String(runtime.log.mock.calls[0][0]));
                    (0, vitest_1.expect)(mocks.resolveOpenClawAgentDir).toHaveBeenCalled();
                    (0, vitest_1.expect)(payload.defaultModel).toBe("anthropic/claude-opus-4-5");
                    (0, vitest_1.expect)(payload.auth.storePath).toBe("/tmp/openclaw-agent/auth-profiles.json");
                    (0, vitest_1.expect)(payload.auth.shellEnvFallback.enabled).toBe(true);
                    (0, vitest_1.expect)(payload.auth.shellEnvFallback.appliedKeys).toContain("OPENAI_API_KEY");
                    (0, vitest_1.expect)(payload.auth.missingProvidersInUse).toEqual([]);
                    (0, vitest_1.expect)(payload.auth.oauth.warnAfterMs).toBeGreaterThan(0);
                    (0, vitest_1.expect)(payload.auth.oauth.profiles.length).toBeGreaterThan(0);
                    providers = payload.auth.providers;
                    anthropic = providers.find(function (p) { return p.provider === "anthropic"; });
                    (0, vitest_1.expect)(anthropic).toBeTruthy();
                    (0, vitest_1.expect)(anthropic === null || anthropic === void 0 ? void 0 : anthropic.profiles.labels.join(" ")).toContain("OAuth");
                    (0, vitest_1.expect)(anthropic === null || anthropic === void 0 ? void 0 : anthropic.profiles.labels.join(" ")).toContain("...");
                    openai = providers.find(function (p) { return p.provider === "openai"; });
                    (0, vitest_1.expect)((_a = openai === null || openai === void 0 ? void 0 : openai.env) === null || _a === void 0 ? void 0 : _a.source).toContain("OPENAI_API_KEY");
                    (0, vitest_1.expect)((_b = openai === null || openai === void 0 ? void 0 : openai.env) === null || _b === void 0 ? void 0 : _b.value).toContain("...");
                    (0, vitest_1.expect)(payload.auth.providersWithOAuth.some(function (e) { return e.startsWith("anthropic"); })).toBe(true);
                    (0, vitest_1.expect)(payload.auth.providersWithOAuth.some(function (e) { return e.startsWith("openai-codex"); })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses agent overrides and reports sources", function () { return __awaiter(void 0, void 0, void 0, function () {
        var localRuntime, originalPrimary, originalFallbacks, originalAgentDir, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localRuntime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(),
                    };
                    originalPrimary = mocks.resolveAgentModelPrimary.getMockImplementation();
                    originalFallbacks = mocks.resolveAgentModelFallbacksOverride.getMockImplementation();
                    originalAgentDir = mocks.resolveAgentDir.getMockImplementation();
                    mocks.resolveAgentModelPrimary.mockReturnValue("openai/gpt-4");
                    mocks.resolveAgentModelFallbacksOverride.mockReturnValue(["openai/gpt-3.5"]);
                    mocks.resolveAgentDir.mockReturnValue("/tmp/openclaw-agent-custom");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, (0, list_js_1.modelsStatusCommand)({ json: true, agent: "Jeremiah" }, localRuntime)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.resolveAgentDir).toHaveBeenCalledWith(vitest_1.expect.anything(), "jeremiah");
                    payload = JSON.parse(String(localRuntime.log.mock.calls[0][0]));
                    (0, vitest_1.expect)(payload.agentId).toBe("jeremiah");
                    (0, vitest_1.expect)(payload.agentDir).toBe("/tmp/openclaw-agent-custom");
                    (0, vitest_1.expect)(payload.defaultModel).toBe("openai/gpt-4");
                    (0, vitest_1.expect)(payload.fallbacks).toEqual(["openai/gpt-3.5"]);
                    (0, vitest_1.expect)(payload.modelConfig).toEqual({
                        defaultSource: "agent",
                        fallbacksSource: "agent",
                    });
                    return [3 /*break*/, 4];
                case 3:
                    mocks.resolveAgentModelPrimary.mockImplementation(originalPrimary);
                    mocks.resolveAgentModelFallbacksOverride.mockImplementation(originalFallbacks);
                    mocks.resolveAgentDir.mockImplementation(originalAgentDir);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("labels defaults when --agent has no overrides", function () { return __awaiter(void 0, void 0, void 0, function () {
        var localRuntime, originalPrimary, originalFallbacks, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localRuntime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(),
                    };
                    originalPrimary = mocks.resolveAgentModelPrimary.getMockImplementation();
                    originalFallbacks = mocks.resolveAgentModelFallbacksOverride.getMockImplementation();
                    mocks.resolveAgentModelPrimary.mockReturnValue(undefined);
                    mocks.resolveAgentModelFallbacksOverride.mockReturnValue(undefined);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, (0, list_js_1.modelsStatusCommand)({ agent: "main" }, localRuntime)];
                case 2:
                    _a.sent();
                    output = localRuntime.log.mock.calls
                        .map(function (call) { return String(call[0]); })
                        .join("\n");
                    (0, vitest_1.expect)(output).toContain("Default (defaults)");
                    (0, vitest_1.expect)(output).toContain("Fallbacks (0) (defaults)");
                    return [3 /*break*/, 4];
                case 3:
                    mocks.resolveAgentModelPrimary.mockImplementation(originalPrimary);
                    mocks.resolveAgentModelFallbacksOverride.mockImplementation(originalFallbacks);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws when agent id is unknown", function () { return __awaiter(void 0, void 0, void 0, function () {
        var localRuntime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localRuntime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(),
                    };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, list_js_1.modelsStatusCommand)({ agent: "unknown" }, localRuntime)).rejects.toThrow('Unknown agent id "unknown".')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("exits non-zero when auth is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var originalProfiles, localRuntime, originalEnvImpl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    originalProfiles = __assign({}, mocks.store.profiles);
                    mocks.store.profiles = {};
                    localRuntime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(),
                    };
                    originalEnvImpl = mocks.resolveEnvApiKey.getMockImplementation();
                    mocks.resolveEnvApiKey.mockImplementation(function () { return null; });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, (0, list_js_1.modelsStatusCommand)({ check: true, plain: true }, localRuntime)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(localRuntime.exit).toHaveBeenCalledWith(1);
                    return [3 /*break*/, 4];
                case 3:
                    mocks.store.profiles = originalProfiles;
                    mocks.resolveEnvApiKey.mockImplementation(originalEnvImpl);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
