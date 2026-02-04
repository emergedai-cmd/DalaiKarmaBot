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
exports.applyAuthChoiceApiProviders = applyAuthChoiceApiProviders;
var auth_profiles_js_1 = require("../agents/auth-profiles.js");
var model_auth_js_1 = require("../agents/model-auth.js");
var auth_choice_api_key_js_1 = require("./auth-choice.api-key.js");
var auth_choice_default_model_js_1 = require("./auth-choice.default-model.js");
var google_gemini_model_default_js_1 = require("./google-gemini-model-default.js");
var onboard_auth_js_1 = require("./onboard-auth.js");
var opencode_zen_model_default_js_1 = require("./opencode-zen-model-default.js");
function applyAuthChoiceApiProviders(params) {
    return __awaiter(this, void 0, void 0, function () {
        var nextConfig, agentModelOverride, noteAgentModel, authChoice, store_1, profileOrder, existingProfileId, existingCred, profileId, mode, hasCredential, envKey, useExisting, key, applied, hasCredential, envKey, useExisting, key, applied, hasCredential, envKey, useExisting, key, applied, hasCredential, tokenProvider, envKey, useExisting, key, applied, hasCredential, envKey, useExisting, key, applied, hasCredential, envKey, useExisting, key, applied, hasCredential, envKey, useExisting, key, applied, key, applied, hasCredential, envKey, useExisting, key, applied, hasCredential, envKey, useExisting, key, applied;
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
        return __generator(this, function (_7) {
            switch (_7.label) {
                case 0:
                    nextConfig = params.config;
                    noteAgentModel = function (model) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!params.agentId) {
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, params.prompter.note("Default model set to ".concat(model, " for agent \"").concat(params.agentId, "\"."), "Model configured")];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    authChoice = params.authChoice;
                    if (authChoice === "apiKey" &&
                        ((_a = params.opts) === null || _a === void 0 ? void 0 : _a.tokenProvider) &&
                        params.opts.tokenProvider !== "anthropic" &&
                        params.opts.tokenProvider !== "openai") {
                        if (params.opts.tokenProvider === "openrouter") {
                            authChoice = "openrouter-api-key";
                        }
                        else if (params.opts.tokenProvider === "vercel-ai-gateway") {
                            authChoice = "ai-gateway-api-key";
                        }
                        else if (params.opts.tokenProvider === "moonshot") {
                            authChoice = "moonshot-api-key";
                        }
                        else if (params.opts.tokenProvider === "kimi-code" ||
                            params.opts.tokenProvider === "kimi-coding") {
                            authChoice = "kimi-code-api-key";
                        }
                        else if (params.opts.tokenProvider === "google") {
                            authChoice = "gemini-api-key";
                        }
                        else if (params.opts.tokenProvider === "zai") {
                            authChoice = "zai-api-key";
                        }
                        else if (params.opts.tokenProvider === "xiaomi") {
                            authChoice = "xiaomi-api-key";
                        }
                        else if (params.opts.tokenProvider === "synthetic") {
                            authChoice = "synthetic-api-key";
                        }
                        else if (params.opts.tokenProvider === "venice") {
                            authChoice = "venice-api-key";
                        }
                        else if (params.opts.tokenProvider === "opencode") {
                            authChoice = "opencode-zen";
                        }
                    }
                    if (!(authChoice === "openrouter-api-key")) return [3 /*break*/, 10];
                    store_1 = (0, auth_profiles_js_1.ensureAuthProfileStore)(params.agentDir, {
                        allowKeychainPrompt: false,
                    });
                    profileOrder = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
                        cfg: nextConfig,
                        store: store_1,
                        provider: "openrouter",
                    });
                    existingProfileId = profileOrder.find(function (profileId) { return Boolean(store_1.profiles[profileId]); });
                    existingCred = existingProfileId ? store_1.profiles[existingProfileId] : undefined;
                    profileId = "openrouter:default";
                    mode = "api_key";
                    hasCredential = false;
                    if (existingProfileId && (existingCred === null || existingCred === void 0 ? void 0 : existingCred.type)) {
                        profileId = existingProfileId;
                        mode =
                            existingCred.type === "oauth"
                                ? "oauth"
                                : existingCred.type === "token"
                                    ? "token"
                                    : "api_key";
                        hasCredential = true;
                    }
                    if (!(!hasCredential && ((_b = params.opts) === null || _b === void 0 ? void 0 : _b.token) && ((_c = params.opts) === null || _c === void 0 ? void 0 : _c.tokenProvider) === "openrouter")) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setOpenrouterApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(params.opts.token), params.agentDir)];
                case 1:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 2;
                case 2:
                    if (!!hasCredential) return [3 /*break*/, 5];
                    envKey = (0, model_auth_js_1.resolveEnvApiKey)("openrouter");
                    if (!envKey) return [3 /*break*/, 5];
                    return [4 /*yield*/, params.prompter.confirm({
                            message: "Use existing OPENROUTER_API_KEY (".concat(envKey.source, ", ").concat((0, auth_choice_api_key_js_1.formatApiKeyPreview)(envKey.apiKey), ")?"),
                            initialValue: true,
                        })];
                case 3:
                    useExisting = _7.sent();
                    if (!useExisting) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setOpenrouterApiKey)(envKey.apiKey, params.agentDir)];
                case 4:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 5;
                case 5:
                    if (!!hasCredential) return [3 /*break*/, 8];
                    return [4 /*yield*/, params.prompter.text({
                            message: "Enter OpenRouter API key",
                            validate: auth_choice_api_key_js_1.validateApiKeyInput,
                        })];
                case 6:
                    key = _7.sent();
                    return [4 /*yield*/, (0, onboard_auth_js_1.setOpenrouterApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(String(key)), params.agentDir)];
                case 7:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 8;
                case 8:
                    if (hasCredential) {
                        nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                            profileId: profileId,
                            provider: "openrouter",
                            mode: mode,
                        });
                    }
                    return [4 /*yield*/, (0, auth_choice_default_model_js_1.applyDefaultModelChoice)({
                            config: nextConfig,
                            setDefaultModel: params.setDefaultModel,
                            defaultModel: onboard_auth_js_1.OPENROUTER_DEFAULT_MODEL_REF,
                            applyDefaultConfig: onboard_auth_js_1.applyOpenrouterConfig,
                            applyProviderConfig: onboard_auth_js_1.applyOpenrouterProviderConfig,
                            noteDefault: onboard_auth_js_1.OPENROUTER_DEFAULT_MODEL_REF,
                            noteAgentModel: noteAgentModel,
                            prompter: params.prompter,
                        })];
                case 9:
                    applied = _7.sent();
                    nextConfig = applied.config;
                    agentModelOverride = (_d = applied.agentModelOverride) !== null && _d !== void 0 ? _d : agentModelOverride;
                    return [2 /*return*/, { config: nextConfig, agentModelOverride: agentModelOverride }];
                case 10:
                    if (!(authChoice === "ai-gateway-api-key")) return [3 /*break*/, 20];
                    hasCredential = false;
                    if (!(!hasCredential &&
                        ((_e = params.opts) === null || _e === void 0 ? void 0 : _e.token) &&
                        ((_f = params.opts) === null || _f === void 0 ? void 0 : _f.tokenProvider) === "vercel-ai-gateway")) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setVercelAiGatewayApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(params.opts.token), params.agentDir)];
                case 11:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 12;
                case 12:
                    envKey = (0, model_auth_js_1.resolveEnvApiKey)("vercel-ai-gateway");
                    if (!envKey) return [3 /*break*/, 15];
                    return [4 /*yield*/, params.prompter.confirm({
                            message: "Use existing AI_GATEWAY_API_KEY (".concat(envKey.source, ", ").concat((0, auth_choice_api_key_js_1.formatApiKeyPreview)(envKey.apiKey), ")?"),
                            initialValue: true,
                        })];
                case 13:
                    useExisting = _7.sent();
                    if (!useExisting) return [3 /*break*/, 15];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setVercelAiGatewayApiKey)(envKey.apiKey, params.agentDir)];
                case 14:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 15;
                case 15:
                    if (!!hasCredential) return [3 /*break*/, 18];
                    return [4 /*yield*/, params.prompter.text({
                            message: "Enter Vercel AI Gateway API key",
                            validate: auth_choice_api_key_js_1.validateApiKeyInput,
                        })];
                case 16:
                    key = _7.sent();
                    return [4 /*yield*/, (0, onboard_auth_js_1.setVercelAiGatewayApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(String(key)), params.agentDir)];
                case 17:
                    _7.sent();
                    _7.label = 18;
                case 18:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "vercel-ai-gateway:default",
                        provider: "vercel-ai-gateway",
                        mode: "api_key",
                    });
                    return [4 /*yield*/, (0, auth_choice_default_model_js_1.applyDefaultModelChoice)({
                            config: nextConfig,
                            setDefaultModel: params.setDefaultModel,
                            defaultModel: onboard_auth_js_1.VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF,
                            applyDefaultConfig: onboard_auth_js_1.applyVercelAiGatewayConfig,
                            applyProviderConfig: onboard_auth_js_1.applyVercelAiGatewayProviderConfig,
                            noteDefault: onboard_auth_js_1.VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF,
                            noteAgentModel: noteAgentModel,
                            prompter: params.prompter,
                        })];
                case 19:
                    applied = _7.sent();
                    nextConfig = applied.config;
                    agentModelOverride = (_g = applied.agentModelOverride) !== null && _g !== void 0 ? _g : agentModelOverride;
                    return [2 /*return*/, { config: nextConfig, agentModelOverride: agentModelOverride }];
                case 20:
                    if (!(authChoice === "moonshot-api-key")) return [3 /*break*/, 30];
                    hasCredential = false;
                    if (!(!hasCredential && ((_h = params.opts) === null || _h === void 0 ? void 0 : _h.token) && ((_j = params.opts) === null || _j === void 0 ? void 0 : _j.tokenProvider) === "moonshot")) return [3 /*break*/, 22];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setMoonshotApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(params.opts.token), params.agentDir)];
                case 21:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 22;
                case 22:
                    envKey = (0, model_auth_js_1.resolveEnvApiKey)("moonshot");
                    if (!envKey) return [3 /*break*/, 25];
                    return [4 /*yield*/, params.prompter.confirm({
                            message: "Use existing MOONSHOT_API_KEY (".concat(envKey.source, ", ").concat((0, auth_choice_api_key_js_1.formatApiKeyPreview)(envKey.apiKey), ")?"),
                            initialValue: true,
                        })];
                case 23:
                    useExisting = _7.sent();
                    if (!useExisting) return [3 /*break*/, 25];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setMoonshotApiKey)(envKey.apiKey, params.agentDir)];
                case 24:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 25;
                case 25:
                    if (!!hasCredential) return [3 /*break*/, 28];
                    return [4 /*yield*/, params.prompter.text({
                            message: "Enter Moonshot API key",
                            validate: auth_choice_api_key_js_1.validateApiKeyInput,
                        })];
                case 26:
                    key = _7.sent();
                    return [4 /*yield*/, (0, onboard_auth_js_1.setMoonshotApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(String(key)), params.agentDir)];
                case 27:
                    _7.sent();
                    _7.label = 28;
                case 28:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "moonshot:default",
                        provider: "moonshot",
                        mode: "api_key",
                    });
                    return [4 /*yield*/, (0, auth_choice_default_model_js_1.applyDefaultModelChoice)({
                            config: nextConfig,
                            setDefaultModel: params.setDefaultModel,
                            defaultModel: onboard_auth_js_1.MOONSHOT_DEFAULT_MODEL_REF,
                            applyDefaultConfig: onboard_auth_js_1.applyMoonshotConfig,
                            applyProviderConfig: onboard_auth_js_1.applyMoonshotProviderConfig,
                            noteAgentModel: noteAgentModel,
                            prompter: params.prompter,
                        })];
                case 29:
                    applied = _7.sent();
                    nextConfig = applied.config;
                    agentModelOverride = (_k = applied.agentModelOverride) !== null && _k !== void 0 ? _k : agentModelOverride;
                    return [2 /*return*/, { config: nextConfig, agentModelOverride: agentModelOverride }];
                case 30:
                    if (!(authChoice === "kimi-code-api-key")) return [3 /*break*/, 42];
                    hasCredential = false;
                    tokenProvider = (_m = (_l = params.opts) === null || _l === void 0 ? void 0 : _l.tokenProvider) === null || _m === void 0 ? void 0 : _m.trim().toLowerCase();
                    if (!(!hasCredential &&
                        ((_o = params.opts) === null || _o === void 0 ? void 0 : _o.token) &&
                        (tokenProvider === "kimi-code" || tokenProvider === "kimi-coding"))) return [3 /*break*/, 32];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setKimiCodingApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(params.opts.token), params.agentDir)];
                case 31:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 32;
                case 32:
                    if (!!hasCredential) return [3 /*break*/, 34];
                    return [4 /*yield*/, params.prompter.note([
                            "Kimi Coding uses a dedicated endpoint and API key.",
                            "Get your API key at: https://www.kimi.com/code/en",
                        ].join("\n"), "Kimi Coding")];
                case 33:
                    _7.sent();
                    _7.label = 34;
                case 34:
                    envKey = (0, model_auth_js_1.resolveEnvApiKey)("kimi-coding");
                    if (!envKey) return [3 /*break*/, 37];
                    return [4 /*yield*/, params.prompter.confirm({
                            message: "Use existing KIMI_API_KEY (".concat(envKey.source, ", ").concat((0, auth_choice_api_key_js_1.formatApiKeyPreview)(envKey.apiKey), ")?"),
                            initialValue: true,
                        })];
                case 35:
                    useExisting = _7.sent();
                    if (!useExisting) return [3 /*break*/, 37];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setKimiCodingApiKey)(envKey.apiKey, params.agentDir)];
                case 36:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 37;
                case 37:
                    if (!!hasCredential) return [3 /*break*/, 40];
                    return [4 /*yield*/, params.prompter.text({
                            message: "Enter Kimi Coding API key",
                            validate: auth_choice_api_key_js_1.validateApiKeyInput,
                        })];
                case 38:
                    key = _7.sent();
                    return [4 /*yield*/, (0, onboard_auth_js_1.setKimiCodingApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(String(key)), params.agentDir)];
                case 39:
                    _7.sent();
                    _7.label = 40;
                case 40:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "kimi-coding:default",
                        provider: "kimi-coding",
                        mode: "api_key",
                    });
                    return [4 /*yield*/, (0, auth_choice_default_model_js_1.applyDefaultModelChoice)({
                            config: nextConfig,
                            setDefaultModel: params.setDefaultModel,
                            defaultModel: onboard_auth_js_1.KIMI_CODING_MODEL_REF,
                            applyDefaultConfig: onboard_auth_js_1.applyKimiCodeConfig,
                            applyProviderConfig: onboard_auth_js_1.applyKimiCodeProviderConfig,
                            noteDefault: onboard_auth_js_1.KIMI_CODING_MODEL_REF,
                            noteAgentModel: noteAgentModel,
                            prompter: params.prompter,
                        })];
                case 41:
                    applied = _7.sent();
                    nextConfig = applied.config;
                    agentModelOverride = (_p = applied.agentModelOverride) !== null && _p !== void 0 ? _p : agentModelOverride;
                    return [2 /*return*/, { config: nextConfig, agentModelOverride: agentModelOverride }];
                case 42:
                    if (!(authChoice === "gemini-api-key")) return [3 /*break*/, 56];
                    hasCredential = false;
                    if (!(!hasCredential && ((_q = params.opts) === null || _q === void 0 ? void 0 : _q.token) && ((_r = params.opts) === null || _r === void 0 ? void 0 : _r.tokenProvider) === "google")) return [3 /*break*/, 44];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setGeminiApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(params.opts.token), params.agentDir)];
                case 43:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 44;
                case 44:
                    envKey = (0, model_auth_js_1.resolveEnvApiKey)("google");
                    if (!envKey) return [3 /*break*/, 47];
                    return [4 /*yield*/, params.prompter.confirm({
                            message: "Use existing GEMINI_API_KEY (".concat(envKey.source, ", ").concat((0, auth_choice_api_key_js_1.formatApiKeyPreview)(envKey.apiKey), ")?"),
                            initialValue: true,
                        })];
                case 45:
                    useExisting = _7.sent();
                    if (!useExisting) return [3 /*break*/, 47];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setGeminiApiKey)(envKey.apiKey, params.agentDir)];
                case 46:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 47;
                case 47:
                    if (!!hasCredential) return [3 /*break*/, 50];
                    return [4 /*yield*/, params.prompter.text({
                            message: "Enter Gemini API key",
                            validate: auth_choice_api_key_js_1.validateApiKeyInput,
                        })];
                case 48:
                    key = _7.sent();
                    return [4 /*yield*/, (0, onboard_auth_js_1.setGeminiApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(String(key)), params.agentDir)];
                case 49:
                    _7.sent();
                    _7.label = 50;
                case 50:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "google:default",
                        provider: "google",
                        mode: "api_key",
                    });
                    if (!params.setDefaultModel) return [3 /*break*/, 53];
                    applied = (0, google_gemini_model_default_js_1.applyGoogleGeminiModelDefault)(nextConfig);
                    nextConfig = applied.next;
                    if (!applied.changed) return [3 /*break*/, 52];
                    return [4 /*yield*/, params.prompter.note("Default model set to ".concat(google_gemini_model_default_js_1.GOOGLE_GEMINI_DEFAULT_MODEL), "Model configured")];
                case 51:
                    _7.sent();
                    _7.label = 52;
                case 52: return [3 /*break*/, 55];
                case 53:
                    agentModelOverride = google_gemini_model_default_js_1.GOOGLE_GEMINI_DEFAULT_MODEL;
                    return [4 /*yield*/, noteAgentModel(google_gemini_model_default_js_1.GOOGLE_GEMINI_DEFAULT_MODEL)];
                case 54:
                    _7.sent();
                    _7.label = 55;
                case 55: return [2 /*return*/, { config: nextConfig, agentModelOverride: agentModelOverride }];
                case 56:
                    if (!(authChoice === "zai-api-key")) return [3 /*break*/, 66];
                    hasCredential = false;
                    if (!(!hasCredential && ((_s = params.opts) === null || _s === void 0 ? void 0 : _s.token) && ((_t = params.opts) === null || _t === void 0 ? void 0 : _t.tokenProvider) === "zai")) return [3 /*break*/, 58];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setZaiApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(params.opts.token), params.agentDir)];
                case 57:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 58;
                case 58:
                    envKey = (0, model_auth_js_1.resolveEnvApiKey)("zai");
                    if (!envKey) return [3 /*break*/, 61];
                    return [4 /*yield*/, params.prompter.confirm({
                            message: "Use existing ZAI_API_KEY (".concat(envKey.source, ", ").concat((0, auth_choice_api_key_js_1.formatApiKeyPreview)(envKey.apiKey), ")?"),
                            initialValue: true,
                        })];
                case 59:
                    useExisting = _7.sent();
                    if (!useExisting) return [3 /*break*/, 61];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setZaiApiKey)(envKey.apiKey, params.agentDir)];
                case 60:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 61;
                case 61:
                    if (!!hasCredential) return [3 /*break*/, 64];
                    return [4 /*yield*/, params.prompter.text({
                            message: "Enter Z.AI API key",
                            validate: auth_choice_api_key_js_1.validateApiKeyInput,
                        })];
                case 62:
                    key = _7.sent();
                    return [4 /*yield*/, (0, onboard_auth_js_1.setZaiApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(String(key)), params.agentDir)];
                case 63:
                    _7.sent();
                    _7.label = 64;
                case 64:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "zai:default",
                        provider: "zai",
                        mode: "api_key",
                    });
                    return [4 /*yield*/, (0, auth_choice_default_model_js_1.applyDefaultModelChoice)({
                            config: nextConfig,
                            setDefaultModel: params.setDefaultModel,
                            defaultModel: onboard_auth_js_1.ZAI_DEFAULT_MODEL_REF,
                            applyDefaultConfig: onboard_auth_js_1.applyZaiConfig,
                            applyProviderConfig: function (config) {
                                var _a;
                                var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                                return (__assign(__assign({}, config), { agents: __assign(__assign({}, config.agents), { defaults: __assign(__assign({}, (_b = config.agents) === null || _b === void 0 ? void 0 : _b.defaults), { models: __assign(__assign({}, (_d = (_c = config.agents) === null || _c === void 0 ? void 0 : _c.defaults) === null || _d === void 0 ? void 0 : _d.models), (_a = {}, _a[onboard_auth_js_1.ZAI_DEFAULT_MODEL_REF] = __assign(__assign({}, (_g = (_f = (_e = config.agents) === null || _e === void 0 ? void 0 : _e.defaults) === null || _f === void 0 ? void 0 : _f.models) === null || _g === void 0 ? void 0 : _g[onboard_auth_js_1.ZAI_DEFAULT_MODEL_REF]), { alias: (_m = (_l = (_k = (_j = (_h = config.agents) === null || _h === void 0 ? void 0 : _h.defaults) === null || _j === void 0 ? void 0 : _j.models) === null || _k === void 0 ? void 0 : _k[onboard_auth_js_1.ZAI_DEFAULT_MODEL_REF]) === null || _l === void 0 ? void 0 : _l.alias) !== null && _m !== void 0 ? _m : "GLM" }), _a)) }) }) }));
                            },
                            noteDefault: onboard_auth_js_1.ZAI_DEFAULT_MODEL_REF,
                            noteAgentModel: noteAgentModel,
                            prompter: params.prompter,
                        })];
                case 65:
                    applied = _7.sent();
                    nextConfig = applied.config;
                    agentModelOverride = (_u = applied.agentModelOverride) !== null && _u !== void 0 ? _u : agentModelOverride;
                    return [2 /*return*/, { config: nextConfig, agentModelOverride: agentModelOverride }];
                case 66:
                    if (!(authChoice === "xiaomi-api-key")) return [3 /*break*/, 76];
                    hasCredential = false;
                    if (!(!hasCredential && ((_v = params.opts) === null || _v === void 0 ? void 0 : _v.token) && ((_w = params.opts) === null || _w === void 0 ? void 0 : _w.tokenProvider) === "xiaomi")) return [3 /*break*/, 68];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setXiaomiApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(params.opts.token), params.agentDir)];
                case 67:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 68;
                case 68:
                    envKey = (0, model_auth_js_1.resolveEnvApiKey)("xiaomi");
                    if (!envKey) return [3 /*break*/, 71];
                    return [4 /*yield*/, params.prompter.confirm({
                            message: "Use existing XIAOMI_API_KEY (".concat(envKey.source, ", ").concat((0, auth_choice_api_key_js_1.formatApiKeyPreview)(envKey.apiKey), ")?"),
                            initialValue: true,
                        })];
                case 69:
                    useExisting = _7.sent();
                    if (!useExisting) return [3 /*break*/, 71];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setXiaomiApiKey)(envKey.apiKey, params.agentDir)];
                case 70:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 71;
                case 71:
                    if (!!hasCredential) return [3 /*break*/, 74];
                    return [4 /*yield*/, params.prompter.text({
                            message: "Enter Xiaomi API key",
                            validate: auth_choice_api_key_js_1.validateApiKeyInput,
                        })];
                case 72:
                    key = _7.sent();
                    return [4 /*yield*/, (0, onboard_auth_js_1.setXiaomiApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(String(key)), params.agentDir)];
                case 73:
                    _7.sent();
                    _7.label = 74;
                case 74:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "xiaomi:default",
                        provider: "xiaomi",
                        mode: "api_key",
                    });
                    return [4 /*yield*/, (0, auth_choice_default_model_js_1.applyDefaultModelChoice)({
                            config: nextConfig,
                            setDefaultModel: params.setDefaultModel,
                            defaultModel: onboard_auth_js_1.XIAOMI_DEFAULT_MODEL_REF,
                            applyDefaultConfig: onboard_auth_js_1.applyXiaomiConfig,
                            applyProviderConfig: onboard_auth_js_1.applyXiaomiProviderConfig,
                            noteDefault: onboard_auth_js_1.XIAOMI_DEFAULT_MODEL_REF,
                            noteAgentModel: noteAgentModel,
                            prompter: params.prompter,
                        })];
                case 75:
                    applied = _7.sent();
                    nextConfig = applied.config;
                    agentModelOverride = (_x = applied.agentModelOverride) !== null && _x !== void 0 ? _x : agentModelOverride;
                    return [2 /*return*/, { config: nextConfig, agentModelOverride: agentModelOverride }];
                case 76:
                    if (!(authChoice === "synthetic-api-key")) return [3 /*break*/, 83];
                    if (!(((_y = params.opts) === null || _y === void 0 ? void 0 : _y.token) && ((_z = params.opts) === null || _z === void 0 ? void 0 : _z.tokenProvider) === "synthetic")) return [3 /*break*/, 78];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setSyntheticApiKey)(String(params.opts.token).trim(), params.agentDir)];
                case 77:
                    _7.sent();
                    return [3 /*break*/, 81];
                case 78: return [4 /*yield*/, params.prompter.text({
                        message: "Enter Synthetic API key",
                        validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                    })];
                case 79:
                    key = _7.sent();
                    return [4 /*yield*/, (0, onboard_auth_js_1.setSyntheticApiKey)(String(key).trim(), params.agentDir)];
                case 80:
                    _7.sent();
                    _7.label = 81;
                case 81:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "synthetic:default",
                        provider: "synthetic",
                        mode: "api_key",
                    });
                    return [4 /*yield*/, (0, auth_choice_default_model_js_1.applyDefaultModelChoice)({
                            config: nextConfig,
                            setDefaultModel: params.setDefaultModel,
                            defaultModel: onboard_auth_js_1.SYNTHETIC_DEFAULT_MODEL_REF,
                            applyDefaultConfig: onboard_auth_js_1.applySyntheticConfig,
                            applyProviderConfig: onboard_auth_js_1.applySyntheticProviderConfig,
                            noteDefault: onboard_auth_js_1.SYNTHETIC_DEFAULT_MODEL_REF,
                            noteAgentModel: noteAgentModel,
                            prompter: params.prompter,
                        })];
                case 82:
                    applied = _7.sent();
                    nextConfig = applied.config;
                    agentModelOverride = (_0 = applied.agentModelOverride) !== null && _0 !== void 0 ? _0 : agentModelOverride;
                    return [2 /*return*/, { config: nextConfig, agentModelOverride: agentModelOverride }];
                case 83:
                    if (!(authChoice === "venice-api-key")) return [3 /*break*/, 95];
                    hasCredential = false;
                    if (!(!hasCredential && ((_1 = params.opts) === null || _1 === void 0 ? void 0 : _1.token) && ((_2 = params.opts) === null || _2 === void 0 ? void 0 : _2.tokenProvider) === "venice")) return [3 /*break*/, 85];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setVeniceApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(params.opts.token), params.agentDir)];
                case 84:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 85;
                case 85:
                    if (!!hasCredential) return [3 /*break*/, 87];
                    return [4 /*yield*/, params.prompter.note([
                            "Venice AI provides privacy-focused inference with uncensored models.",
                            "Get your API key at: https://venice.ai/settings/api",
                            "Supports 'private' (fully private) and 'anonymized' (proxy) modes.",
                        ].join("\n"), "Venice AI")];
                case 86:
                    _7.sent();
                    _7.label = 87;
                case 87:
                    envKey = (0, model_auth_js_1.resolveEnvApiKey)("venice");
                    if (!envKey) return [3 /*break*/, 90];
                    return [4 /*yield*/, params.prompter.confirm({
                            message: "Use existing VENICE_API_KEY (".concat(envKey.source, ", ").concat((0, auth_choice_api_key_js_1.formatApiKeyPreview)(envKey.apiKey), ")?"),
                            initialValue: true,
                        })];
                case 88:
                    useExisting = _7.sent();
                    if (!useExisting) return [3 /*break*/, 90];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setVeniceApiKey)(envKey.apiKey, params.agentDir)];
                case 89:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 90;
                case 90:
                    if (!!hasCredential) return [3 /*break*/, 93];
                    return [4 /*yield*/, params.prompter.text({
                            message: "Enter Venice AI API key",
                            validate: auth_choice_api_key_js_1.validateApiKeyInput,
                        })];
                case 91:
                    key = _7.sent();
                    return [4 /*yield*/, (0, onboard_auth_js_1.setVeniceApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(String(key)), params.agentDir)];
                case 92:
                    _7.sent();
                    _7.label = 93;
                case 93:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "venice:default",
                        provider: "venice",
                        mode: "api_key",
                    });
                    return [4 /*yield*/, (0, auth_choice_default_model_js_1.applyDefaultModelChoice)({
                            config: nextConfig,
                            setDefaultModel: params.setDefaultModel,
                            defaultModel: onboard_auth_js_1.VENICE_DEFAULT_MODEL_REF,
                            applyDefaultConfig: onboard_auth_js_1.applyVeniceConfig,
                            applyProviderConfig: onboard_auth_js_1.applyVeniceProviderConfig,
                            noteDefault: onboard_auth_js_1.VENICE_DEFAULT_MODEL_REF,
                            noteAgentModel: noteAgentModel,
                            prompter: params.prompter,
                        })];
                case 94:
                    applied = _7.sent();
                    nextConfig = applied.config;
                    agentModelOverride = (_3 = applied.agentModelOverride) !== null && _3 !== void 0 ? _3 : agentModelOverride;
                    return [2 /*return*/, { config: nextConfig, agentModelOverride: agentModelOverride }];
                case 95:
                    if (!(authChoice === "opencode-zen")) return [3 /*break*/, 107];
                    hasCredential = false;
                    if (!(!hasCredential && ((_4 = params.opts) === null || _4 === void 0 ? void 0 : _4.token) && ((_5 = params.opts) === null || _5 === void 0 ? void 0 : _5.tokenProvider) === "opencode")) return [3 /*break*/, 97];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setOpencodeZenApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(params.opts.token), params.agentDir)];
                case 96:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 97;
                case 97:
                    if (!!hasCredential) return [3 /*break*/, 99];
                    return [4 /*yield*/, params.prompter.note([
                            "OpenCode Zen provides access to Claude, GPT, Gemini, and more models.",
                            "Get your API key at: https://opencode.ai/auth",
                            "Requires an active OpenCode Zen subscription.",
                        ].join("\n"), "OpenCode Zen")];
                case 98:
                    _7.sent();
                    _7.label = 99;
                case 99:
                    envKey = (0, model_auth_js_1.resolveEnvApiKey)("opencode");
                    if (!envKey) return [3 /*break*/, 102];
                    return [4 /*yield*/, params.prompter.confirm({
                            message: "Use existing OPENCODE_API_KEY (".concat(envKey.source, ", ").concat((0, auth_choice_api_key_js_1.formatApiKeyPreview)(envKey.apiKey), ")?"),
                            initialValue: true,
                        })];
                case 100:
                    useExisting = _7.sent();
                    if (!useExisting) return [3 /*break*/, 102];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setOpencodeZenApiKey)(envKey.apiKey, params.agentDir)];
                case 101:
                    _7.sent();
                    hasCredential = true;
                    _7.label = 102;
                case 102:
                    if (!!hasCredential) return [3 /*break*/, 105];
                    return [4 /*yield*/, params.prompter.text({
                            message: "Enter OpenCode Zen API key",
                            validate: auth_choice_api_key_js_1.validateApiKeyInput,
                        })];
                case 103:
                    key = _7.sent();
                    return [4 /*yield*/, (0, onboard_auth_js_1.setOpencodeZenApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(String(key)), params.agentDir)];
                case 104:
                    _7.sent();
                    _7.label = 105;
                case 105:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "opencode:default",
                        provider: "opencode",
                        mode: "api_key",
                    });
                    return [4 /*yield*/, (0, auth_choice_default_model_js_1.applyDefaultModelChoice)({
                            config: nextConfig,
                            setDefaultModel: params.setDefaultModel,
                            defaultModel: opencode_zen_model_default_js_1.OPENCODE_ZEN_DEFAULT_MODEL,
                            applyDefaultConfig: onboard_auth_js_1.applyOpencodeZenConfig,
                            applyProviderConfig: onboard_auth_js_1.applyOpencodeZenProviderConfig,
                            noteDefault: opencode_zen_model_default_js_1.OPENCODE_ZEN_DEFAULT_MODEL,
                            noteAgentModel: noteAgentModel,
                            prompter: params.prompter,
                        })];
                case 106:
                    applied = _7.sent();
                    nextConfig = applied.config;
                    agentModelOverride = (_6 = applied.agentModelOverride) !== null && _6 !== void 0 ? _6 : agentModelOverride;
                    return [2 /*return*/, { config: nextConfig, agentModelOverride: agentModelOverride }];
                case 107: return [2 /*return*/, null];
            }
        });
    });
}
