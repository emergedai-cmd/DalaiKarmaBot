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
exports.applyNonInteractiveAuthChoice = applyNonInteractiveAuthChoice;
var auth_profiles_js_1 = require("../../../agents/auth-profiles.js");
var model_selection_js_1 = require("../../../agents/model-selection.js");
var parse_duration_js_1 = require("../../../cli/parse-duration.js");
var env_file_js_1 = require("../../../infra/env-file.js");
var utils_js_1 = require("../../../utils.js");
var auth_token_js_1 = require("../../auth-token.js");
var google_gemini_model_default_js_1 = require("../../google-gemini-model-default.js");
var onboard_auth_js_1 = require("../../onboard-auth.js");
var api_keys_js_1 = require("../api-keys.js");
function applyNonInteractiveAuthChoice(params) {
    return __awaiter(this, void 0, void 0, function () {
        var authChoice, opts, runtime, baseConfig, nextConfig, resolved, providerRaw, provider, tokenRaw, tokenError, expires, expiresInRaw, profileId, resolved, resolved, resolved, resolved, key, result, resolved, resolved, resolved, resolved, resolved, resolved, resolved, modelId, resolved;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    authChoice = params.authChoice, opts = params.opts, runtime = params.runtime, baseConfig = params.baseConfig;
                    nextConfig = params.nextConfig;
                    if (authChoice === "claude-cli" || authChoice === "codex-cli") {
                        runtime.error([
                            "Auth choice \"".concat(authChoice, "\" is deprecated."),
                            'Use "--auth-choice token" (Anthropic setup-token) or "--auth-choice openai-codex".',
                        ].join("\n"));
                        runtime.exit(1);
                        return [2 /*return*/, null];
                    }
                    if (authChoice === "setup-token") {
                        runtime.error([
                            'Auth choice "setup-token" requires interactive mode.',
                            'Use "--auth-choice token" with --token and --token-provider anthropic.',
                        ].join("\n"));
                        runtime.exit(1);
                        return [2 /*return*/, null];
                    }
                    if (!(authChoice === "apiKey")) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, api_keys_js_1.resolveNonInteractiveApiKey)({
                            provider: "anthropic",
                            cfg: baseConfig,
                            flagValue: opts.anthropicApiKey,
                            flagName: "--anthropic-api-key",
                            envVar: "ANTHROPIC_API_KEY",
                            runtime: runtime,
                        })];
                case 1:
                    resolved = _e.sent();
                    if (!resolved) {
                        return [2 /*return*/, null];
                    }
                    if (!(resolved.source !== "profile")) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setAnthropicApiKey)(resolved.key)];
                case 2:
                    _e.sent();
                    _e.label = 3;
                case 3: return [2 /*return*/, (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "anthropic:default",
                        provider: "anthropic",
                        mode: "api_key",
                    })];
                case 4:
                    if (authChoice === "token") {
                        providerRaw = (_a = opts.tokenProvider) === null || _a === void 0 ? void 0 : _a.trim();
                        if (!providerRaw) {
                            runtime.error("Missing --token-provider for --auth-choice token.");
                            runtime.exit(1);
                            return [2 /*return*/, null];
                        }
                        provider = (0, model_selection_js_1.normalizeProviderId)(providerRaw);
                        if (provider !== "anthropic") {
                            runtime.error("Only --token-provider anthropic is supported for --auth-choice token.");
                            runtime.exit(1);
                            return [2 /*return*/, null];
                        }
                        tokenRaw = (_b = opts.token) === null || _b === void 0 ? void 0 : _b.trim();
                        if (!tokenRaw) {
                            runtime.error("Missing --token for --auth-choice token.");
                            runtime.exit(1);
                            return [2 /*return*/, null];
                        }
                        tokenError = (0, auth_token_js_1.validateAnthropicSetupToken)(tokenRaw);
                        if (tokenError) {
                            runtime.error(tokenError);
                            runtime.exit(1);
                            return [2 /*return*/, null];
                        }
                        expires = void 0;
                        expiresInRaw = (_c = opts.tokenExpiresIn) === null || _c === void 0 ? void 0 : _c.trim();
                        if (expiresInRaw) {
                            try {
                                expires = Date.now() + (0, parse_duration_js_1.parseDurationMs)(expiresInRaw, { defaultUnit: "d" });
                            }
                            catch (err) {
                                runtime.error("Invalid --token-expires-in: ".concat(String(err)));
                                runtime.exit(1);
                                return [2 /*return*/, null];
                            }
                        }
                        profileId = ((_d = opts.tokenProfileId) === null || _d === void 0 ? void 0 : _d.trim()) || (0, auth_token_js_1.buildTokenProfileId)({ provider: provider, name: "" });
                        (0, auth_profiles_js_1.upsertAuthProfile)({
                            profileId: profileId,
                            credential: __assign({ type: "token", provider: provider, token: tokenRaw.trim() }, (expires ? { expires: expires } : {})),
                        });
                        return [2 /*return*/, (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                                profileId: profileId,
                                provider: provider,
                                mode: "token",
                            })];
                    }
                    if (!(authChoice === "gemini-api-key")) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, api_keys_js_1.resolveNonInteractiveApiKey)({
                            provider: "google",
                            cfg: baseConfig,
                            flagValue: opts.geminiApiKey,
                            flagName: "--gemini-api-key",
                            envVar: "GEMINI_API_KEY",
                            runtime: runtime,
                        })];
                case 5:
                    resolved = _e.sent();
                    if (!resolved) {
                        return [2 /*return*/, null];
                    }
                    if (!(resolved.source !== "profile")) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setGeminiApiKey)(resolved.key)];
                case 6:
                    _e.sent();
                    _e.label = 7;
                case 7:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "google:default",
                        provider: "google",
                        mode: "api_key",
                    });
                    return [2 /*return*/, (0, google_gemini_model_default_js_1.applyGoogleGeminiModelDefault)(nextConfig).next];
                case 8:
                    if (!(authChoice === "zai-api-key")) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, api_keys_js_1.resolveNonInteractiveApiKey)({
                            provider: "zai",
                            cfg: baseConfig,
                            flagValue: opts.zaiApiKey,
                            flagName: "--zai-api-key",
                            envVar: "ZAI_API_KEY",
                            runtime: runtime,
                        })];
                case 9:
                    resolved = _e.sent();
                    if (!resolved) {
                        return [2 /*return*/, null];
                    }
                    if (!(resolved.source !== "profile")) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setZaiApiKey)(resolved.key)];
                case 10:
                    _e.sent();
                    _e.label = 11;
                case 11:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "zai:default",
                        provider: "zai",
                        mode: "api_key",
                    });
                    return [2 /*return*/, (0, onboard_auth_js_1.applyZaiConfig)(nextConfig)];
                case 12:
                    if (!(authChoice === "xiaomi-api-key")) return [3 /*break*/, 16];
                    return [4 /*yield*/, (0, api_keys_js_1.resolveNonInteractiveApiKey)({
                            provider: "xiaomi",
                            cfg: baseConfig,
                            flagValue: opts.xiaomiApiKey,
                            flagName: "--xiaomi-api-key",
                            envVar: "XIAOMI_API_KEY",
                            runtime: runtime,
                        })];
                case 13:
                    resolved = _e.sent();
                    if (!resolved) {
                        return [2 /*return*/, null];
                    }
                    if (!(resolved.source !== "profile")) return [3 /*break*/, 15];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setXiaomiApiKey)(resolved.key)];
                case 14:
                    _e.sent();
                    _e.label = 15;
                case 15:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "xiaomi:default",
                        provider: "xiaomi",
                        mode: "api_key",
                    });
                    return [2 /*return*/, (0, onboard_auth_js_1.applyXiaomiConfig)(nextConfig)];
                case 16:
                    if (!(authChoice === "openai-api-key")) return [3 /*break*/, 18];
                    return [4 /*yield*/, (0, api_keys_js_1.resolveNonInteractiveApiKey)({
                            provider: "openai",
                            cfg: baseConfig,
                            flagValue: opts.openaiApiKey,
                            flagName: "--openai-api-key",
                            envVar: "OPENAI_API_KEY",
                            runtime: runtime,
                            allowProfile: false,
                        })];
                case 17:
                    resolved = _e.sent();
                    if (!resolved) {
                        return [2 /*return*/, null];
                    }
                    key = resolved.key;
                    result = (0, env_file_js_1.upsertSharedEnvVar)({ key: "OPENAI_API_KEY", value: key });
                    process.env.OPENAI_API_KEY = key;
                    runtime.log("Saved OPENAI_API_KEY to ".concat((0, utils_js_1.shortenHomePath)(result.path)));
                    return [2 /*return*/, nextConfig];
                case 18:
                    if (!(authChoice === "openrouter-api-key")) return [3 /*break*/, 22];
                    return [4 /*yield*/, (0, api_keys_js_1.resolveNonInteractiveApiKey)({
                            provider: "openrouter",
                            cfg: baseConfig,
                            flagValue: opts.openrouterApiKey,
                            flagName: "--openrouter-api-key",
                            envVar: "OPENROUTER_API_KEY",
                            runtime: runtime,
                        })];
                case 19:
                    resolved = _e.sent();
                    if (!resolved) {
                        return [2 /*return*/, null];
                    }
                    if (!(resolved.source !== "profile")) return [3 /*break*/, 21];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setOpenrouterApiKey)(resolved.key)];
                case 20:
                    _e.sent();
                    _e.label = 21;
                case 21:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "openrouter:default",
                        provider: "openrouter",
                        mode: "api_key",
                    });
                    return [2 /*return*/, (0, onboard_auth_js_1.applyOpenrouterConfig)(nextConfig)];
                case 22:
                    if (!(authChoice === "ai-gateway-api-key")) return [3 /*break*/, 26];
                    return [4 /*yield*/, (0, api_keys_js_1.resolveNonInteractiveApiKey)({
                            provider: "vercel-ai-gateway",
                            cfg: baseConfig,
                            flagValue: opts.aiGatewayApiKey,
                            flagName: "--ai-gateway-api-key",
                            envVar: "AI_GATEWAY_API_KEY",
                            runtime: runtime,
                        })];
                case 23:
                    resolved = _e.sent();
                    if (!resolved) {
                        return [2 /*return*/, null];
                    }
                    if (!(resolved.source !== "profile")) return [3 /*break*/, 25];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setVercelAiGatewayApiKey)(resolved.key)];
                case 24:
                    _e.sent();
                    _e.label = 25;
                case 25:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "vercel-ai-gateway:default",
                        provider: "vercel-ai-gateway",
                        mode: "api_key",
                    });
                    return [2 /*return*/, (0, onboard_auth_js_1.applyVercelAiGatewayConfig)(nextConfig)];
                case 26:
                    if (!(authChoice === "moonshot-api-key")) return [3 /*break*/, 30];
                    return [4 /*yield*/, (0, api_keys_js_1.resolveNonInteractiveApiKey)({
                            provider: "moonshot",
                            cfg: baseConfig,
                            flagValue: opts.moonshotApiKey,
                            flagName: "--moonshot-api-key",
                            envVar: "MOONSHOT_API_KEY",
                            runtime: runtime,
                        })];
                case 27:
                    resolved = _e.sent();
                    if (!resolved) {
                        return [2 /*return*/, null];
                    }
                    if (!(resolved.source !== "profile")) return [3 /*break*/, 29];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setMoonshotApiKey)(resolved.key)];
                case 28:
                    _e.sent();
                    _e.label = 29;
                case 29:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "moonshot:default",
                        provider: "moonshot",
                        mode: "api_key",
                    });
                    return [2 /*return*/, (0, onboard_auth_js_1.applyMoonshotConfig)(nextConfig)];
                case 30:
                    if (!(authChoice === "kimi-code-api-key")) return [3 /*break*/, 34];
                    return [4 /*yield*/, (0, api_keys_js_1.resolveNonInteractiveApiKey)({
                            provider: "kimi-coding",
                            cfg: baseConfig,
                            flagValue: opts.kimiCodeApiKey,
                            flagName: "--kimi-code-api-key",
                            envVar: "KIMI_API_KEY",
                            runtime: runtime,
                        })];
                case 31:
                    resolved = _e.sent();
                    if (!resolved) {
                        return [2 /*return*/, null];
                    }
                    if (!(resolved.source !== "profile")) return [3 /*break*/, 33];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setKimiCodingApiKey)(resolved.key)];
                case 32:
                    _e.sent();
                    _e.label = 33;
                case 33:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "kimi-coding:default",
                        provider: "kimi-coding",
                        mode: "api_key",
                    });
                    return [2 /*return*/, (0, onboard_auth_js_1.applyKimiCodeConfig)(nextConfig)];
                case 34:
                    if (!(authChoice === "synthetic-api-key")) return [3 /*break*/, 38];
                    return [4 /*yield*/, (0, api_keys_js_1.resolveNonInteractiveApiKey)({
                            provider: "synthetic",
                            cfg: baseConfig,
                            flagValue: opts.syntheticApiKey,
                            flagName: "--synthetic-api-key",
                            envVar: "SYNTHETIC_API_KEY",
                            runtime: runtime,
                        })];
                case 35:
                    resolved = _e.sent();
                    if (!resolved) {
                        return [2 /*return*/, null];
                    }
                    if (!(resolved.source !== "profile")) return [3 /*break*/, 37];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setSyntheticApiKey)(resolved.key)];
                case 36:
                    _e.sent();
                    _e.label = 37;
                case 37:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "synthetic:default",
                        provider: "synthetic",
                        mode: "api_key",
                    });
                    return [2 /*return*/, (0, onboard_auth_js_1.applySyntheticConfig)(nextConfig)];
                case 38:
                    if (!(authChoice === "venice-api-key")) return [3 /*break*/, 42];
                    return [4 /*yield*/, (0, api_keys_js_1.resolveNonInteractiveApiKey)({
                            provider: "venice",
                            cfg: baseConfig,
                            flagValue: opts.veniceApiKey,
                            flagName: "--venice-api-key",
                            envVar: "VENICE_API_KEY",
                            runtime: runtime,
                        })];
                case 39:
                    resolved = _e.sent();
                    if (!resolved) {
                        return [2 /*return*/, null];
                    }
                    if (!(resolved.source !== "profile")) return [3 /*break*/, 41];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setVeniceApiKey)(resolved.key)];
                case 40:
                    _e.sent();
                    _e.label = 41;
                case 41:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "venice:default",
                        provider: "venice",
                        mode: "api_key",
                    });
                    return [2 /*return*/, (0, onboard_auth_js_1.applyVeniceConfig)(nextConfig)];
                case 42:
                    if (!(authChoice === "minimax-cloud" ||
                        authChoice === "minimax-api" ||
                        authChoice === "minimax-api-lightning")) return [3 /*break*/, 46];
                    return [4 /*yield*/, (0, api_keys_js_1.resolveNonInteractiveApiKey)({
                            provider: "minimax",
                            cfg: baseConfig,
                            flagValue: opts.minimaxApiKey,
                            flagName: "--minimax-api-key",
                            envVar: "MINIMAX_API_KEY",
                            runtime: runtime,
                        })];
                case 43:
                    resolved = _e.sent();
                    if (!resolved) {
                        return [2 /*return*/, null];
                    }
                    if (!(resolved.source !== "profile")) return [3 /*break*/, 45];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setMinimaxApiKey)(resolved.key)];
                case 44:
                    _e.sent();
                    _e.label = 45;
                case 45:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "minimax:default",
                        provider: "minimax",
                        mode: "api_key",
                    });
                    modelId = authChoice === "minimax-api-lightning" ? "MiniMax-M2.1-lightning" : "MiniMax-M2.1";
                    return [2 /*return*/, (0, onboard_auth_js_1.applyMinimaxApiConfig)(nextConfig, modelId)];
                case 46:
                    if (authChoice === "minimax") {
                        return [2 /*return*/, (0, onboard_auth_js_1.applyMinimaxConfig)(nextConfig)];
                    }
                    if (!(authChoice === "opencode-zen")) return [3 /*break*/, 50];
                    return [4 /*yield*/, (0, api_keys_js_1.resolveNonInteractiveApiKey)({
                            provider: "opencode",
                            cfg: baseConfig,
                            flagValue: opts.opencodeZenApiKey,
                            flagName: "--opencode-zen-api-key",
                            envVar: "OPENCODE_API_KEY (or OPENCODE_ZEN_API_KEY)",
                            runtime: runtime,
                        })];
                case 47:
                    resolved = _e.sent();
                    if (!resolved) {
                        return [2 /*return*/, null];
                    }
                    if (!(resolved.source !== "profile")) return [3 /*break*/, 49];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setOpencodeZenApiKey)(resolved.key)];
                case 48:
                    _e.sent();
                    _e.label = 49;
                case 49:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "opencode:default",
                        provider: "opencode",
                        mode: "api_key",
                    });
                    return [2 /*return*/, (0, onboard_auth_js_1.applyOpencodeZenConfig)(nextConfig)];
                case 50:
                    if (authChoice === "oauth" ||
                        authChoice === "chutes" ||
                        authChoice === "openai-codex" ||
                        authChoice === "qwen-portal" ||
                        authChoice === "minimax-portal") {
                        runtime.error("OAuth requires interactive mode.");
                        runtime.exit(1);
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, nextConfig];
            }
        });
    });
}
