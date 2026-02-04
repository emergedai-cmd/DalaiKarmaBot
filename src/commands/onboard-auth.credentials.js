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
exports.VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF = exports.OPENROUTER_DEFAULT_MODEL_REF = exports.XIAOMI_DEFAULT_MODEL_REF = exports.ZAI_DEFAULT_MODEL_REF = void 0;
exports.writeOAuthCredentials = writeOAuthCredentials;
exports.setAnthropicApiKey = setAnthropicApiKey;
exports.setGeminiApiKey = setGeminiApiKey;
exports.setMinimaxApiKey = setMinimaxApiKey;
exports.setMoonshotApiKey = setMoonshotApiKey;
exports.setKimiCodingApiKey = setKimiCodingApiKey;
exports.setSyntheticApiKey = setSyntheticApiKey;
exports.setVeniceApiKey = setVeniceApiKey;
exports.setZaiApiKey = setZaiApiKey;
exports.setXiaomiApiKey = setXiaomiApiKey;
exports.setOpenrouterApiKey = setOpenrouterApiKey;
exports.setVercelAiGatewayApiKey = setVercelAiGatewayApiKey;
exports.setOpencodeZenApiKey = setOpencodeZenApiKey;
var agent_paths_js_1 = require("../agents/agent-paths.js");
var auth_profiles_js_1 = require("../agents/auth-profiles.js");
var resolveAuthAgentDir = function (agentDir) { return agentDir !== null && agentDir !== void 0 ? agentDir : (0, agent_paths_js_1.resolveOpenClawAgentDir)(); };
function writeOAuthCredentials(provider, creds, agentDir) {
    return __awaiter(this, void 0, void 0, function () {
        var email;
        return __generator(this, function (_a) {
            email = typeof creds.email === "string" && creds.email.trim() ? creds.email.trim() : "default";
            (0, auth_profiles_js_1.upsertAuthProfile)({
                profileId: "".concat(provider, ":").concat(email),
                credential: __assign({ type: "oauth", provider: provider }, creds),
                agentDir: resolveAuthAgentDir(agentDir),
            });
            return [2 /*return*/];
        });
    });
}
function setAnthropicApiKey(key, agentDir) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Write to resolved agent dir so gateway finds credentials on startup.
            (0, auth_profiles_js_1.upsertAuthProfile)({
                profileId: "anthropic:default",
                credential: {
                    type: "api_key",
                    provider: "anthropic",
                    key: key,
                },
                agentDir: resolveAuthAgentDir(agentDir),
            });
            return [2 /*return*/];
        });
    });
}
function setGeminiApiKey(key, agentDir) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Write to resolved agent dir so gateway finds credentials on startup.
            (0, auth_profiles_js_1.upsertAuthProfile)({
                profileId: "google:default",
                credential: {
                    type: "api_key",
                    provider: "google",
                    key: key,
                },
                agentDir: resolveAuthAgentDir(agentDir),
            });
            return [2 /*return*/];
        });
    });
}
function setMinimaxApiKey(key, agentDir) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Write to resolved agent dir so gateway finds credentials on startup.
            (0, auth_profiles_js_1.upsertAuthProfile)({
                profileId: "minimax:default",
                credential: {
                    type: "api_key",
                    provider: "minimax",
                    key: key,
                },
                agentDir: resolveAuthAgentDir(agentDir),
            });
            return [2 /*return*/];
        });
    });
}
function setMoonshotApiKey(key, agentDir) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Write to resolved agent dir so gateway finds credentials on startup.
            (0, auth_profiles_js_1.upsertAuthProfile)({
                profileId: "moonshot:default",
                credential: {
                    type: "api_key",
                    provider: "moonshot",
                    key: key,
                },
                agentDir: resolveAuthAgentDir(agentDir),
            });
            return [2 /*return*/];
        });
    });
}
function setKimiCodingApiKey(key, agentDir) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Write to resolved agent dir so gateway finds credentials on startup.
            (0, auth_profiles_js_1.upsertAuthProfile)({
                profileId: "kimi-coding:default",
                credential: {
                    type: "api_key",
                    provider: "kimi-coding",
                    key: key,
                },
                agentDir: resolveAuthAgentDir(agentDir),
            });
            return [2 /*return*/];
        });
    });
}
function setSyntheticApiKey(key, agentDir) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Write to resolved agent dir so gateway finds credentials on startup.
            (0, auth_profiles_js_1.upsertAuthProfile)({
                profileId: "synthetic:default",
                credential: {
                    type: "api_key",
                    provider: "synthetic",
                    key: key,
                },
                agentDir: resolveAuthAgentDir(agentDir),
            });
            return [2 /*return*/];
        });
    });
}
function setVeniceApiKey(key, agentDir) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Write to resolved agent dir so gateway finds credentials on startup.
            (0, auth_profiles_js_1.upsertAuthProfile)({
                profileId: "venice:default",
                credential: {
                    type: "api_key",
                    provider: "venice",
                    key: key,
                },
                agentDir: resolveAuthAgentDir(agentDir),
            });
            return [2 /*return*/];
        });
    });
}
exports.ZAI_DEFAULT_MODEL_REF = "zai/glm-4.7";
exports.XIAOMI_DEFAULT_MODEL_REF = "xiaomi/mimo-v2-flash";
exports.OPENROUTER_DEFAULT_MODEL_REF = "openrouter/auto";
exports.VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF = "vercel-ai-gateway/anthropic/claude-opus-4.5";
function setZaiApiKey(key, agentDir) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Write to resolved agent dir so gateway finds credentials on startup.
            (0, auth_profiles_js_1.upsertAuthProfile)({
                profileId: "zai:default",
                credential: {
                    type: "api_key",
                    provider: "zai",
                    key: key,
                },
                agentDir: resolveAuthAgentDir(agentDir),
            });
            return [2 /*return*/];
        });
    });
}
function setXiaomiApiKey(key, agentDir) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            (0, auth_profiles_js_1.upsertAuthProfile)({
                profileId: "xiaomi:default",
                credential: {
                    type: "api_key",
                    provider: "xiaomi",
                    key: key,
                },
                agentDir: resolveAuthAgentDir(agentDir),
            });
            return [2 /*return*/];
        });
    });
}
function setOpenrouterApiKey(key, agentDir) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            (0, auth_profiles_js_1.upsertAuthProfile)({
                profileId: "openrouter:default",
                credential: {
                    type: "api_key",
                    provider: "openrouter",
                    key: key,
                },
                agentDir: resolveAuthAgentDir(agentDir),
            });
            return [2 /*return*/];
        });
    });
}
function setVercelAiGatewayApiKey(key, agentDir) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            (0, auth_profiles_js_1.upsertAuthProfile)({
                profileId: "vercel-ai-gateway:default",
                credential: {
                    type: "api_key",
                    provider: "vercel-ai-gateway",
                    key: key,
                },
                agentDir: resolveAuthAgentDir(agentDir),
            });
            return [2 /*return*/];
        });
    });
}
function setOpencodeZenApiKey(key, agentDir) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            (0, auth_profiles_js_1.upsertAuthProfile)({
                profileId: "opencode:default",
                credential: {
                    type: "api_key",
                    provider: "opencode",
                    key: key,
                },
                agentDir: resolveAuthAgentDir(agentDir),
            });
            return [2 /*return*/];
        });
    });
}
