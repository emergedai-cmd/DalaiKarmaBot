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
exports.applyAuthChoiceAnthropic = applyAuthChoiceAnthropic;
var auth_profiles_js_1 = require("../agents/auth-profiles.js");
var auth_choice_api_key_js_1 = require("./auth-choice.api-key.js");
var auth_token_js_1 = require("./auth-token.js");
var onboard_auth_js_1 = require("./onboard-auth.js");
function applyAuthChoiceAnthropic(params) {
    return __awaiter(this, void 0, void 0, function () {
        var nextConfig, tokenRaw, token, profileNameRaw, provider, namedProfileId, nextConfig, hasCredential, envKey, useExisting, key;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(params.authChoice === "setup-token" ||
                        params.authChoice === "oauth" ||
                        params.authChoice === "token")) return [3 /*break*/, 4];
                    nextConfig = params.config;
                    return [4 /*yield*/, params.prompter.note(["Run `claude setup-token` in your terminal.", "Then paste the generated token below."].join("\n"), "Anthropic setup-token")];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, params.prompter.text({
                            message: "Paste Anthropic setup-token",
                            validate: function (value) { return (0, auth_token_js_1.validateAnthropicSetupToken)(String(value !== null && value !== void 0 ? value : "")); },
                        })];
                case 2:
                    tokenRaw = _d.sent();
                    token = String(tokenRaw).trim();
                    return [4 /*yield*/, params.prompter.text({
                            message: "Token name (blank = default)",
                            placeholder: "default",
                        })];
                case 3:
                    profileNameRaw = _d.sent();
                    provider = "anthropic";
                    namedProfileId = (0, auth_token_js_1.buildTokenProfileId)({
                        provider: provider,
                        name: String(profileNameRaw !== null && profileNameRaw !== void 0 ? profileNameRaw : ""),
                    });
                    (0, auth_profiles_js_1.upsertAuthProfile)({
                        profileId: namedProfileId,
                        agentDir: params.agentDir,
                        credential: {
                            type: "token",
                            provider: provider,
                            token: token,
                        },
                    });
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: namedProfileId,
                        provider: provider,
                        mode: "token",
                    });
                    return [2 /*return*/, { config: nextConfig }];
                case 4:
                    if (!(params.authChoice === "apiKey")) return [3 /*break*/, 13];
                    if (((_a = params.opts) === null || _a === void 0 ? void 0 : _a.tokenProvider) && params.opts.tokenProvider !== "anthropic") {
                        return [2 /*return*/, null];
                    }
                    nextConfig = params.config;
                    hasCredential = false;
                    envKey = (_b = process.env.ANTHROPIC_API_KEY) === null || _b === void 0 ? void 0 : _b.trim();
                    if (!((_c = params.opts) === null || _c === void 0 ? void 0 : _c.token)) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setAnthropicApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(params.opts.token), params.agentDir)];
                case 5:
                    _d.sent();
                    hasCredential = true;
                    _d.label = 6;
                case 6:
                    if (!(!hasCredential && envKey)) return [3 /*break*/, 9];
                    return [4 /*yield*/, params.prompter.confirm({
                            message: "Use existing ANTHROPIC_API_KEY (env, ".concat((0, auth_choice_api_key_js_1.formatApiKeyPreview)(envKey), ")?"),
                            initialValue: true,
                        })];
                case 7:
                    useExisting = _d.sent();
                    if (!useExisting) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, onboard_auth_js_1.setAnthropicApiKey)(envKey, params.agentDir)];
                case 8:
                    _d.sent();
                    hasCredential = true;
                    _d.label = 9;
                case 9:
                    if (!!hasCredential) return [3 /*break*/, 12];
                    return [4 /*yield*/, params.prompter.text({
                            message: "Enter Anthropic API key",
                            validate: auth_choice_api_key_js_1.validateApiKeyInput,
                        })];
                case 10:
                    key = _d.sent();
                    return [4 /*yield*/, (0, onboard_auth_js_1.setAnthropicApiKey)((0, auth_choice_api_key_js_1.normalizeApiKeyInput)(String(key)), params.agentDir)];
                case 11:
                    _d.sent();
                    _d.label = 12;
                case 12:
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: "anthropic:default",
                        provider: "anthropic",
                        mode: "api_key",
                    });
                    return [2 /*return*/, { config: nextConfig }];
                case 13: return [2 /*return*/, null];
            }
        });
    });
}
