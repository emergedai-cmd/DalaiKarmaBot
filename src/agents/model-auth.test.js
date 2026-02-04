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
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var oauthFixture = {
    access: "access-token",
    refresh: "refresh-token",
    expires: Date.now() + 60000,
    accountId: "acct_123",
};
(0, vitest_1.describe)("getApiKeyForModel", function () {
    (0, vitest_1.it)("migrates legacy oauth.json into auth-profiles.json", function () { return __awaiter(void 0, void 0, void 0, function () {
        var previousStateDir, previousAgentDir, previousPiAgentDir, tempDir, oauthDir, ensureAuthProfileStore, getApiKeyForModel, model, store, apiKey, authProfiles, authData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    previousStateDir = process.env.OPENCLAW_STATE_DIR;
                    previousAgentDir = process.env.OPENCLAW_AGENT_DIR;
                    previousPiAgentDir = process.env.PI_CODING_AGENT_DIR;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-oauth-"))];
                case 1:
                    tempDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 9, 11]);
                    process.env.OPENCLAW_STATE_DIR = tempDir;
                    process.env.OPENCLAW_AGENT_DIR = node_path_1.default.join(tempDir, "agent");
                    process.env.PI_CODING_AGENT_DIR = process.env.OPENCLAW_AGENT_DIR;
                    oauthDir = node_path_1.default.join(tempDir, "credentials");
                    return [4 /*yield*/, promises_1.default.mkdir(oauthDir, { recursive: true, mode: 448 })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(oauthDir, "oauth.json"), "".concat(JSON.stringify({ "openai-codex": oauthFixture }, null, 2), "\n"), "utf8")];
                case 4:
                    _a.sent();
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./auth-profiles.js"); })];
                case 5:
                    ensureAuthProfileStore = (_a.sent()).ensureAuthProfileStore;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./model-auth.js"); })];
                case 6:
                    getApiKeyForModel = (_a.sent()).getApiKeyForModel;
                    model = {
                        id: "codex-mini-latest",
                        provider: "openai-codex",
                        api: "openai-codex-responses",
                    };
                    store = ensureAuthProfileStore(process.env.OPENCLAW_AGENT_DIR, {
                        allowKeychainPrompt: false,
                    });
                    return [4 /*yield*/, getApiKeyForModel({
                            model: model,
                            cfg: {
                                auth: {
                                    profiles: {
                                        "openai-codex:default": {
                                            provider: "openai-codex",
                                            mode: "oauth",
                                        },
                                    },
                                },
                            },
                            store: store,
                            agentDir: process.env.OPENCLAW_AGENT_DIR,
                        })];
                case 7:
                    apiKey = _a.sent();
                    (0, vitest_1.expect)(apiKey.apiKey).toBe(oauthFixture.access);
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(tempDir, "agent", "auth-profiles.json"), "utf8")];
                case 8:
                    authProfiles = _a.sent();
                    authData = JSON.parse(authProfiles);
                    (0, vitest_1.expect)(authData.profiles).toMatchObject({
                        "openai-codex:default": {
                            type: "oauth",
                            provider: "openai-codex",
                            access: oauthFixture.access,
                            refresh: oauthFixture.refresh,
                        },
                    });
                    return [3 /*break*/, 11];
                case 9:
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
                    return [4 /*yield*/, promises_1.default.rm(tempDir, { recursive: true, force: true })];
                case 10:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("suggests openai-codex when only Codex OAuth is configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var previousStateDir, previousAgentDir, previousPiAgentDir, previousOpenAiKey, tempDir, authProfilesPath, resolveApiKeyForProvider, error, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    previousStateDir = process.env.OPENCLAW_STATE_DIR;
                    previousAgentDir = process.env.OPENCLAW_AGENT_DIR;
                    previousPiAgentDir = process.env.PI_CODING_AGENT_DIR;
                    previousOpenAiKey = process.env.OPENAI_API_KEY;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"))];
                case 1:
                    tempDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 10, 12]);
                    delete process.env.OPENAI_API_KEY;
                    process.env.OPENCLAW_STATE_DIR = tempDir;
                    process.env.OPENCLAW_AGENT_DIR = node_path_1.default.join(tempDir, "agent");
                    process.env.PI_CODING_AGENT_DIR = process.env.OPENCLAW_AGENT_DIR;
                    authProfilesPath = node_path_1.default.join(tempDir, "agent", "auth-profiles.json");
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(authProfilesPath), {
                            recursive: true,
                            mode: 448,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(authProfilesPath, "".concat(JSON.stringify({
                            version: 1,
                            profiles: {
                                "openai-codex:default": __assign({ type: "oauth", provider: "openai-codex" }, oauthFixture),
                            },
                        }, null, 2), "\n"), "utf8")];
                case 4:
                    _a.sent();
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./model-auth.js"); })];
                case 5:
                    resolveApiKeyForProvider = (_a.sent()).resolveApiKeyForProvider;
                    error = null;
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, resolveApiKeyForProvider({ provider: "openai" })];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _a.sent();
                    error = err_1;
                    return [3 /*break*/, 9];
                case 9:
                    (0, vitest_1.expect)(String(error)).toContain("openai-codex/gpt-5.2");
                    return [3 /*break*/, 12];
                case 10:
                    if (previousOpenAiKey === undefined) {
                        delete process.env.OPENAI_API_KEY;
                    }
                    else {
                        process.env.OPENAI_API_KEY = previousOpenAiKey;
                    }
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
                    return [4 /*yield*/, promises_1.default.rm(tempDir, { recursive: true, force: true })];
                case 11:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws when ZAI API key is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var previousZai, previousLegacy, resolveApiKeyForProvider, error, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    previousZai = process.env.ZAI_API_KEY;
                    previousLegacy = process.env.Z_AI_API_KEY;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 7, 8]);
                    delete process.env.ZAI_API_KEY;
                    delete process.env.Z_AI_API_KEY;
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./model-auth.js"); })];
                case 2:
                    resolveApiKeyForProvider = (_a.sent()).resolveApiKeyForProvider;
                    error = null;
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, resolveApiKeyForProvider({
                            provider: "zai",
                            store: { version: 1, profiles: {} },
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    error = err_2;
                    return [3 /*break*/, 6];
                case 6:
                    (0, vitest_1.expect)(String(error)).toContain('No API key found for provider "zai".');
                    return [3 /*break*/, 8];
                case 7:
                    if (previousZai === undefined) {
                        delete process.env.ZAI_API_KEY;
                    }
                    else {
                        process.env.ZAI_API_KEY = previousZai;
                    }
                    if (previousLegacy === undefined) {
                        delete process.env.Z_AI_API_KEY;
                    }
                    else {
                        process.env.Z_AI_API_KEY = previousLegacy;
                    }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts legacy Z_AI_API_KEY for zai", function () { return __awaiter(void 0, void 0, void 0, function () {
        var previousZai, previousLegacy, resolveApiKeyForProvider, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    previousZai = process.env.ZAI_API_KEY;
                    previousLegacy = process.env.Z_AI_API_KEY;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 4, 5]);
                    delete process.env.ZAI_API_KEY;
                    process.env.Z_AI_API_KEY = "zai-test-key";
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./model-auth.js"); })];
                case 2:
                    resolveApiKeyForProvider = (_a.sent()).resolveApiKeyForProvider;
                    return [4 /*yield*/, resolveApiKeyForProvider({
                            provider: "zai",
                            store: { version: 1, profiles: {} },
                        })];
                case 3:
                    resolved = _a.sent();
                    (0, vitest_1.expect)(resolved.apiKey).toBe("zai-test-key");
                    (0, vitest_1.expect)(resolved.source).toContain("Z_AI_API_KEY");
                    return [3 /*break*/, 5];
                case 4:
                    if (previousZai === undefined) {
                        delete process.env.ZAI_API_KEY;
                    }
                    else {
                        process.env.ZAI_API_KEY = previousZai;
                    }
                    if (previousLegacy === undefined) {
                        delete process.env.Z_AI_API_KEY;
                    }
                    else {
                        process.env.Z_AI_API_KEY = previousLegacy;
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("resolves Synthetic API key from env", function () { return __awaiter(void 0, void 0, void 0, function () {
        var previousSynthetic, resolveApiKeyForProvider, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    previousSynthetic = process.env.SYNTHETIC_API_KEY;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 4, 5]);
                    process.env.SYNTHETIC_API_KEY = "synthetic-test-key";
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./model-auth.js"); })];
                case 2:
                    resolveApiKeyForProvider = (_a.sent()).resolveApiKeyForProvider;
                    return [4 /*yield*/, resolveApiKeyForProvider({
                            provider: "synthetic",
                            store: { version: 1, profiles: {} },
                        })];
                case 3:
                    resolved = _a.sent();
                    (0, vitest_1.expect)(resolved.apiKey).toBe("synthetic-test-key");
                    (0, vitest_1.expect)(resolved.source).toContain("SYNTHETIC_API_KEY");
                    return [3 /*break*/, 5];
                case 4:
                    if (previousSynthetic === undefined) {
                        delete process.env.SYNTHETIC_API_KEY;
                    }
                    else {
                        process.env.SYNTHETIC_API_KEY = previousSynthetic;
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("resolves Vercel AI Gateway API key from env", function () { return __awaiter(void 0, void 0, void 0, function () {
        var previousGatewayKey, resolveApiKeyForProvider, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    previousGatewayKey = process.env.AI_GATEWAY_API_KEY;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 4, 5]);
                    process.env.AI_GATEWAY_API_KEY = "gateway-test-key";
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./model-auth.js"); })];
                case 2:
                    resolveApiKeyForProvider = (_a.sent()).resolveApiKeyForProvider;
                    return [4 /*yield*/, resolveApiKeyForProvider({
                            provider: "vercel-ai-gateway",
                            store: { version: 1, profiles: {} },
                        })];
                case 3:
                    resolved = _a.sent();
                    (0, vitest_1.expect)(resolved.apiKey).toBe("gateway-test-key");
                    (0, vitest_1.expect)(resolved.source).toContain("AI_GATEWAY_API_KEY");
                    return [3 /*break*/, 5];
                case 4:
                    if (previousGatewayKey === undefined) {
                        delete process.env.AI_GATEWAY_API_KEY;
                    }
                    else {
                        process.env.AI_GATEWAY_API_KEY = previousGatewayKey;
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers Bedrock bearer token over access keys and profile", function () { return __awaiter(void 0, void 0, void 0, function () {
        var previous, resolveApiKeyForProvider, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    previous = {
                        bearer: process.env.AWS_BEARER_TOKEN_BEDROCK,
                        access: process.env.AWS_ACCESS_KEY_ID,
                        secret: process.env.AWS_SECRET_ACCESS_KEY,
                        profile: process.env.AWS_PROFILE,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 4, 5]);
                    process.env.AWS_BEARER_TOKEN_BEDROCK = "bedrock-token";
                    process.env.AWS_ACCESS_KEY_ID = "access-key";
                    process.env.AWS_SECRET_ACCESS_KEY = "secret-key";
                    process.env.AWS_PROFILE = "profile";
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./model-auth.js"); })];
                case 2:
                    resolveApiKeyForProvider = (_a.sent()).resolveApiKeyForProvider;
                    return [4 /*yield*/, resolveApiKeyForProvider({
                            provider: "amazon-bedrock",
                            store: { version: 1, profiles: {} },
                            cfg: {
                                models: {
                                    providers: {
                                        "amazon-bedrock": {
                                            baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
                                            api: "bedrock-converse-stream",
                                            auth: "aws-sdk",
                                            models: [],
                                        },
                                    },
                                },
                            },
                        })];
                case 3:
                    resolved = _a.sent();
                    (0, vitest_1.expect)(resolved.mode).toBe("aws-sdk");
                    (0, vitest_1.expect)(resolved.apiKey).toBeUndefined();
                    (0, vitest_1.expect)(resolved.source).toContain("AWS_BEARER_TOKEN_BEDROCK");
                    return [3 /*break*/, 5];
                case 4:
                    if (previous.bearer === undefined) {
                        delete process.env.AWS_BEARER_TOKEN_BEDROCK;
                    }
                    else {
                        process.env.AWS_BEARER_TOKEN_BEDROCK = previous.bearer;
                    }
                    if (previous.access === undefined) {
                        delete process.env.AWS_ACCESS_KEY_ID;
                    }
                    else {
                        process.env.AWS_ACCESS_KEY_ID = previous.access;
                    }
                    if (previous.secret === undefined) {
                        delete process.env.AWS_SECRET_ACCESS_KEY;
                    }
                    else {
                        process.env.AWS_SECRET_ACCESS_KEY = previous.secret;
                    }
                    if (previous.profile === undefined) {
                        delete process.env.AWS_PROFILE;
                    }
                    else {
                        process.env.AWS_PROFILE = previous.profile;
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers Bedrock access keys over profile", function () { return __awaiter(void 0, void 0, void 0, function () {
        var previous, resolveApiKeyForProvider, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    previous = {
                        bearer: process.env.AWS_BEARER_TOKEN_BEDROCK,
                        access: process.env.AWS_ACCESS_KEY_ID,
                        secret: process.env.AWS_SECRET_ACCESS_KEY,
                        profile: process.env.AWS_PROFILE,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 4, 5]);
                    delete process.env.AWS_BEARER_TOKEN_BEDROCK;
                    process.env.AWS_ACCESS_KEY_ID = "access-key";
                    process.env.AWS_SECRET_ACCESS_KEY = "secret-key";
                    process.env.AWS_PROFILE = "profile";
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./model-auth.js"); })];
                case 2:
                    resolveApiKeyForProvider = (_a.sent()).resolveApiKeyForProvider;
                    return [4 /*yield*/, resolveApiKeyForProvider({
                            provider: "amazon-bedrock",
                            store: { version: 1, profiles: {} },
                            cfg: {
                                models: {
                                    providers: {
                                        "amazon-bedrock": {
                                            baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
                                            api: "bedrock-converse-stream",
                                            auth: "aws-sdk",
                                            models: [],
                                        },
                                    },
                                },
                            },
                        })];
                case 3:
                    resolved = _a.sent();
                    (0, vitest_1.expect)(resolved.mode).toBe("aws-sdk");
                    (0, vitest_1.expect)(resolved.apiKey).toBeUndefined();
                    (0, vitest_1.expect)(resolved.source).toContain("AWS_ACCESS_KEY_ID");
                    return [3 /*break*/, 5];
                case 4:
                    if (previous.bearer === undefined) {
                        delete process.env.AWS_BEARER_TOKEN_BEDROCK;
                    }
                    else {
                        process.env.AWS_BEARER_TOKEN_BEDROCK = previous.bearer;
                    }
                    if (previous.access === undefined) {
                        delete process.env.AWS_ACCESS_KEY_ID;
                    }
                    else {
                        process.env.AWS_ACCESS_KEY_ID = previous.access;
                    }
                    if (previous.secret === undefined) {
                        delete process.env.AWS_SECRET_ACCESS_KEY;
                    }
                    else {
                        process.env.AWS_SECRET_ACCESS_KEY = previous.secret;
                    }
                    if (previous.profile === undefined) {
                        delete process.env.AWS_PROFILE;
                    }
                    else {
                        process.env.AWS_PROFILE = previous.profile;
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses Bedrock profile when access keys are missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var previous, resolveApiKeyForProvider, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    previous = {
                        bearer: process.env.AWS_BEARER_TOKEN_BEDROCK,
                        access: process.env.AWS_ACCESS_KEY_ID,
                        secret: process.env.AWS_SECRET_ACCESS_KEY,
                        profile: process.env.AWS_PROFILE,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 4, 5]);
                    delete process.env.AWS_BEARER_TOKEN_BEDROCK;
                    delete process.env.AWS_ACCESS_KEY_ID;
                    delete process.env.AWS_SECRET_ACCESS_KEY;
                    process.env.AWS_PROFILE = "profile";
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./model-auth.js"); })];
                case 2:
                    resolveApiKeyForProvider = (_a.sent()).resolveApiKeyForProvider;
                    return [4 /*yield*/, resolveApiKeyForProvider({
                            provider: "amazon-bedrock",
                            store: { version: 1, profiles: {} },
                            cfg: {
                                models: {
                                    providers: {
                                        "amazon-bedrock": {
                                            baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
                                            api: "bedrock-converse-stream",
                                            auth: "aws-sdk",
                                            models: [],
                                        },
                                    },
                                },
                            },
                        })];
                case 3:
                    resolved = _a.sent();
                    (0, vitest_1.expect)(resolved.mode).toBe("aws-sdk");
                    (0, vitest_1.expect)(resolved.apiKey).toBeUndefined();
                    (0, vitest_1.expect)(resolved.source).toContain("AWS_PROFILE");
                    return [3 /*break*/, 5];
                case 4:
                    if (previous.bearer === undefined) {
                        delete process.env.AWS_BEARER_TOKEN_BEDROCK;
                    }
                    else {
                        process.env.AWS_BEARER_TOKEN_BEDROCK = previous.bearer;
                    }
                    if (previous.access === undefined) {
                        delete process.env.AWS_ACCESS_KEY_ID;
                    }
                    else {
                        process.env.AWS_ACCESS_KEY_ID = previous.access;
                    }
                    if (previous.secret === undefined) {
                        delete process.env.AWS_SECRET_ACCESS_KEY;
                    }
                    else {
                        process.env.AWS_SECRET_ACCESS_KEY = previous.secret;
                    }
                    if (previous.profile === undefined) {
                        delete process.env.AWS_PROFILE;
                    }
                    else {
                        process.env.AWS_PROFILE = previous.profile;
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
});
