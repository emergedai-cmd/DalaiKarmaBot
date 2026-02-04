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
exports.applyAuthChoiceMiniMax = applyAuthChoiceMiniMax;
var model_auth_js_1 = require("../agents/model-auth.js");
var auth_choice_api_key_js_1 = require("./auth-choice.api-key.js");
var auth_choice_apply_plugin_provider_js_1 = require("./auth-choice.apply.plugin-provider.js");
var auth_choice_default_model_js_1 = require("./auth-choice.default-model.js");
var onboard_auth_js_1 = require("./onboard-auth.js");
function applyAuthChoiceMiniMax(params) {
    return __awaiter(this, void 0, void 0, function () {
        var nextConfig, agentModelOverride, noteAgentModel, endpoint, modelId_1, hasCredential, envKey, useExisting, key, modelRef, applied, applied;
        var _this = this;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
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
                    if (!(params.authChoice === "minimax-portal")) return [3 /*break*/, 3];
                    return [4 /*yield*/, params.prompter.select({
                            message: "Select MiniMax endpoint",
                            options: [
                                { value: "oauth", label: "Global", hint: "OAuth for international users" },
                                { value: "oauth-cn", label: "CN", hint: "OAuth for users in China" },
                            ],
                        })];
                case 1:
                    endpoint = _c.sent();
                    return [4 /*yield*/, (0, auth_choice_apply_plugin_provider_js_1.applyAuthChoicePluginProvider)(params, {
                            authChoice: "minimax-portal",
                            pluginId: "minimax-portal-auth",
                            providerId: "minimax-portal",
                            methodId: endpoint,
                            label: "MiniMax",
                        })];
                case 2: return [2 /*return*/, _c.sent()];
                case 3:
                    if (!(params.authChoice === "minimax-cloud" ||
                        params.authChoice === "minimax-api" ||
                        params.authChoice === "minimax-api-lightning")) return [3 /*break*/, 11];
                    modelId_1 = params.authChoice === "minimax-api-lightning" ? "MiniMax-M2.1-lightning" : "MiniMax-M2.1";
                    hasCredential = false;
                    envKey = (0, model_auth_js_1.resolveEnvApiKey)("minimax");
                    if (!envKey) return [3 /*break*/, 6];
                    return [4 /*yield*/, params.prompter.confirm({
                            message: "Use existing MINIMAX_API_KEY (".concat(envKey.source, ", ").concat((0, auth_choice_api_key_js_1.formatApiKeyPreview)(envKey.apiKey), ")?"),
                            initialValue: true,
                        })];
                case 4:
                    useExisting = _c.sent();
                    if (!useExisting) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setMinimaxApiKey)(envKey.apiKey, params.agentDir)];
                case 5:
                    _c.sent();
                    hasCredential = true;
                    _c.label = 6;
                case 6:
                    if (!!hasCredential) return [3 /*break*/, 9];
                    return [4 /*yield*/, params.prompter.text({
                            message: "Enter MiniMax API key",
                            validate: auth_choice_api_key_js_1.validateApiKeyInput,
                        })];
                case 7:
                    key = _c.sent();
                    return [4 /*yield*/, (0, onboard_auth_js_1.setMinimaxApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(String(key)), params.agentDir)];
                case 8:
                    _c.sent();
                    _c.label = 9;
                case 9:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "minimax:default",
                        provider: "minimax",
                        mode: "api_key",
                    });
                    modelRef = "minimax/".concat(modelId_1);
                    return [4 /*yield*/, (0, auth_choice_default_model_js_1.applyDefaultModelChoice)({
                            config: nextConfig,
                            setDefaultModel: params.setDefaultModel,
                            defaultModel: modelRef,
                            applyDefaultConfig: function (config) { return (0, onboard_auth_js_1.applyMinimaxApiConfig)(config, modelId_1); },
                            applyProviderConfig: function (config) { return (0, onboard_auth_js_1.applyMinimaxApiProviderConfig)(config, modelId_1); },
                            noteAgentModel: noteAgentModel,
                            prompter: params.prompter,
                        })];
                case 10:
                    applied = _c.sent();
                    nextConfig = applied.config;
                    agentModelOverride = (_a = applied.agentModelOverride) !== null && _a !== void 0 ? _a : agentModelOverride;
                    return [2 /*return*/, { config: nextConfig, agentModelOverride: agentModelOverride }];
                case 11:
                    if (!(params.authChoice === "minimax")) return [3 /*break*/, 13];
                    return [4 /*yield*/, (0, auth_choice_default_model_js_1.applyDefaultModelChoice)({
                            config: nextConfig,
                            setDefaultModel: params.setDefaultModel,
                            defaultModel: "lmstudio/minimax-m2.1-gs32",
                            applyDefaultConfig: onboard_auth_js_1.applyMinimaxConfig,
                            applyProviderConfig: onboard_auth_js_1.applyMinimaxProviderConfig,
                            noteAgentModel: noteAgentModel,
                            prompter: params.prompter,
                        })];
                case 12:
                    applied = _c.sent();
                    nextConfig = applied.config;
                    agentModelOverride = (_b = applied.agentModelOverride) !== null && _b !== void 0 ? _b : agentModelOverride;
                    return [2 /*return*/, { config: nextConfig, agentModelOverride: agentModelOverride }];
                case 13: return [2 /*return*/, null];
            }
        });
    });
}
