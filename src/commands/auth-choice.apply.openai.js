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
exports.applyAuthChoiceOpenAI = applyAuthChoiceOpenAI;
var pi_ai_1 = require("@mariozechner/pi-ai");
var model_auth_js_1 = require("../agents/model-auth.js");
var env_file_js_1 = require("../infra/env-file.js");
var auth_choice_api_key_js_1 = require("./auth-choice.api-key.js");
var oauth_env_js_1 = require("./oauth-env.js");
var oauth_flow_js_1 = require("./oauth-flow.js");
var onboard_auth_js_1 = require("./onboard-auth.js");
var onboard_helpers_js_1 = require("./onboard-helpers.js");
var openai_codex_model_default_js_1 = require("./openai-codex-model-default.js");
function applyAuthChoiceOpenAI(params) {
    return __awaiter(this, void 0, void 0, function () {
        var authChoice, envKey, useExisting, result_1, key, trimmed, result, nextConfig, agentModelOverride, noteAgentModel, isRemote, spin_1, _a, onAuth, onPrompt, creds, applied, err_1;
        var _this = this;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    authChoice = params.authChoice;
                    if (authChoice === "apiKey" && ((_b = params.opts) === null || _b === void 0 ? void 0 : _b.tokenProvider) === "openai") {
                        authChoice = "openai-api-key";
                    }
                    if (!(authChoice === "openai-api-key")) return [3 /*break*/, 8];
                    envKey = (0, model_auth_js_1.resolveEnvApiKey)("openai");
                    if (!envKey) return [3 /*break*/, 3];
                    return [4 /*yield*/, params.prompter.confirm({
                            message: "Use existing OPENAI_API_KEY (".concat(envKey.source, ", ").concat((0, auth_choice_api_key_js_1.formatApiKeyPreview)(envKey.apiKey), ")?"),
                            initialValue: true,
                        })];
                case 1:
                    useExisting = _e.sent();
                    if (!useExisting) return [3 /*break*/, 3];
                    result_1 = (0, env_file_js_1.upsertSharedEnvVar)({
                        key: "OPENAI_API_KEY",
                        value: envKey.apiKey,
                    });
                    if (!process.env.OPENAI_API_KEY) {
                        process.env.OPENAI_API_KEY = envKey.apiKey;
                    }
                    return [4 /*yield*/, params.prompter.note("Copied OPENAI_API_KEY to ".concat(result_1.path, " for launchd compatibility."), "OpenAI API key")];
                case 2:
                    _e.sent();
                    return [2 /*return*/, { config: params.config }];
                case 3:
                    key = void 0;
                    if (!(((_c = params.opts) === null || _c === void 0 ? void 0 : _c.token) && ((_d = params.opts) === null || _d === void 0 ? void 0 : _d.tokenProvider) === "openai")) return [3 /*break*/, 4];
                    key = params.opts.token;
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, params.prompter.text({
                        message: "Enter OpenAI API key",
                        validate: auth_choice_api_key_js_1.validateApiKeyInput,
                    })];
                case 5:
                    key = _e.sent();
                    _e.label = 6;
                case 6:
                    trimmed = (0, auth_choice_api_key_js_1.normalizeApiKeyInput)(String(key));
                    result = (0, env_file_js_1.upsertSharedEnvVar)({
                        key: "OPENAI_API_KEY",
                        value: trimmed,
                    });
                    process.env.OPENAI_API_KEY = trimmed;
                    return [4 /*yield*/, params.prompter.note("Saved OPENAI_API_KEY to ".concat(result.path, " for launchd compatibility."), "OpenAI API key")];
                case 7:
                    _e.sent();
                    return [2 /*return*/, { config: params.config }];
                case 8:
                    if (!(params.authChoice === "openai-codex")) return [3 /*break*/, 21];
                    nextConfig = params.config;
                    agentModelOverride = void 0;
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
                    isRemote = (0, oauth_env_js_1.isRemoteEnvironment)();
                    return [4 /*yield*/, params.prompter.note(isRemote
                            ? [
                                "You are running in a remote/VPS environment.",
                                "A URL will be shown for you to open in your LOCAL browser.",
                                "After signing in, paste the redirect URL back here.",
                            ].join("\n")
                            : [
                                "Browser will open for OpenAI authentication.",
                                "If the callback doesn't auto-complete, paste the redirect URL.",
                                "OpenAI OAuth uses localhost:1455 for the callback.",
                            ].join("\n"), "OpenAI Codex OAuth")];
                case 9:
                    _e.sent();
                    spin_1 = params.prompter.progress("Starting OAuth flow…");
                    _e.label = 10;
                case 10:
                    _e.trys.push([10, 18, , 20]);
                    _a = (0, oauth_flow_js_1.createVpsAwareOAuthHandlers)({
                        isRemote: isRemote,
                        prompter: params.prompter,
                        runtime: params.runtime,
                        spin: spin_1,
                        openUrl: onboard_helpers_js_1.openUrl,
                        localBrowserMessage: "Complete sign-in in browser…",
                    }), onAuth = _a.onAuth, onPrompt = _a.onPrompt;
                    return [4 /*yield*/, (0, pi_ai_1.loginOpenAICodex)({
                            onAuth: onAuth,
                            onPrompt: onPrompt,
                            onProgress: function (msg) { return spin_1.update(msg); },
                        })];
                case 11:
                    creds = _e.sent();
                    spin_1.stop("OpenAI OAuth complete");
                    if (!creds) return [3 /*break*/, 17];
                    return [4 /*yield*/, (0, onboard_auth_js_1.writeOAuthCredentials)("openai-codex", creds, params.agentDir)];
                case 12:
                    _e.sent();
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "openai-codex:default",
                        provider: "openai-codex",
                        mode: "oauth",
                    });
                    if (!params.setDefaultModel) return [3 /*break*/, 15];
                    applied = (0, openai_codex_model_default_js_1.applyOpenAICodexModelDefault)(nextConfig);
                    nextConfig = applied.next;
                    if (!applied.changed) return [3 /*break*/, 14];
                    return [4 /*yield*/, params.prompter.note("Default model set to ".concat(openai_codex_model_default_js_1.OPENAI_CODEX_DEFAULT_MODEL), "Model configured")];
                case 13:
                    _e.sent();
                    _e.label = 14;
                case 14: return [3 /*break*/, 17];
                case 15:
                    agentModelOverride = openai_codex_model_default_js_1.OPENAI_CODEX_DEFAULT_MODEL;
                    return [4 /*yield*/, noteAgentModel(openai_codex_model_default_js_1.OPENAI_CODEX_DEFAULT_MODEL)];
                case 16:
                    _e.sent();
                    _e.label = 17;
                case 17: return [3 /*break*/, 20];
                case 18:
                    err_1 = _e.sent();
                    spin_1.stop("OpenAI OAuth failed");
                    params.runtime.error(String(err_1));
                    return [4 /*yield*/, params.prompter.note("Trouble with OAuth? See https://docs.openclaw.ai/start/faq", "OAuth help")];
                case 19:
                    _e.sent();
                    return [3 /*break*/, 20];
                case 20: return [2 /*return*/, { config: nextConfig, agentModelOverride: agentModelOverride }];
                case 21: return [2 /*return*/, null];
            }
        });
    });
}
