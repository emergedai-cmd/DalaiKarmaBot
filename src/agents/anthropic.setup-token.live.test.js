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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
var pi_ai_1 = require("@mariozechner/pi-ai");
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var auth_token_js_1 = require("../commands/auth-token.js");
var config_js_1 = require("../config/config.js");
var env_js_1 = require("../infra/env.js");
var agent_paths_js_1 = require("./agent-paths.js");
var auth_profiles_js_1 = require("./auth-profiles.js");
var model_auth_js_1 = require("./model-auth.js");
var model_selection_js_1 = require("./model-selection.js");
var models_config_js_1 = require("./models-config.js");
var pi_model_discovery_js_1 = require("./pi-model-discovery.js");
var LIVE = (0, env_js_1.isTruthyEnvValue)(process.env.LIVE) || (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_LIVE_TEST);
var SETUP_TOKEN_RAW = (_b = (_a = process.env.OPENCLAW_LIVE_SETUP_TOKEN) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
var SETUP_TOKEN_VALUE = (_d = (_c = process.env.OPENCLAW_LIVE_SETUP_TOKEN_VALUE) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : "";
var SETUP_TOKEN_PROFILE = (_f = (_e = process.env.OPENCLAW_LIVE_SETUP_TOKEN_PROFILE) === null || _e === void 0 ? void 0 : _e.trim()) !== null && _f !== void 0 ? _f : "";
var SETUP_TOKEN_MODEL = (_h = (_g = process.env.OPENCLAW_LIVE_SETUP_TOKEN_MODEL) === null || _g === void 0 ? void 0 : _g.trim()) !== null && _h !== void 0 ? _h : "";
var ENABLED = LIVE && Boolean(SETUP_TOKEN_RAW || SETUP_TOKEN_VALUE || SETUP_TOKEN_PROFILE);
var describeLive = ENABLED ? vitest_1.describe : vitest_1.describe.skip;
function isSetupToken(value) {
    return value.startsWith(auth_token_js_1.ANTHROPIC_SETUP_TOKEN_PREFIX);
}
function listSetupTokenProfiles(store) {
    return Object.entries(store.profiles)
        .filter(function (_a) {
        var cred = _a[1];
        if (cred.type !== "token") {
            return false;
        }
        if ((0, model_selection_js_1.normalizeProviderId)(cred.provider) !== "anthropic") {
            return false;
        }
        return isSetupToken(cred.token);
    })
        .map(function (_a) {
        var id = _a[0];
        return id;
    });
}
function pickSetupTokenProfile(candidates) {
    var _a;
    var preferred = ["anthropic:setup-token-test", "anthropic:setup-token", "anthropic:default"];
    for (var _i = 0, preferred_1 = preferred; _i < preferred_1.length; _i++) {
        var id = preferred_1[_i];
        if (candidates.includes(id)) {
            return id;
        }
    }
    return (_a = candidates[0]) !== null && _a !== void 0 ? _a : "";
}
function resolveTokenSource() {
    return __awaiter(this, void 0, void 0, function () {
        var explicitToken, error, tempDir_1, profileId, store_1, agentDir, store, candidates, available;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    explicitToken = (SETUP_TOKEN_RAW && isSetupToken(SETUP_TOKEN_RAW) ? SETUP_TOKEN_RAW : "") || SETUP_TOKEN_VALUE;
                    if (!explicitToken) return [3 /*break*/, 2];
                    error = (0, auth_token_js_1.validateAnthropicSetupToken)(explicitToken);
                    if (error) {
                        throw new Error("Invalid setup-token: ".concat(error));
                    }
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-setup-token-"))];
                case 1:
                    tempDir_1 = _a.sent();
                    profileId = "anthropic:setup-token-live-".concat((0, node_crypto_1.randomUUID)());
                    store_1 = (0, auth_profiles_js_1.ensureAuthProfileStore)(tempDir_1, {
                        allowKeychainPrompt: false,
                    });
                    store_1.profiles[profileId] = {
                        type: "token",
                        provider: "anthropic",
                        token: explicitToken,
                    };
                    (0, auth_profiles_js_1.saveAuthProfileStore)(store_1, tempDir_1);
                    return [2 /*return*/, {
                            agentDir: tempDir_1,
                            profileId: profileId,
                            cleanup: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, promises_1.default.rm(tempDir_1, { recursive: true, force: true })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                        }];
                case 2:
                    agentDir = (0, agent_paths_js_1.resolveOpenClawAgentDir)();
                    store = (0, auth_profiles_js_1.ensureAuthProfileStore)(agentDir, {
                        allowKeychainPrompt: false,
                    });
                    candidates = listSetupTokenProfiles(store);
                    if (SETUP_TOKEN_PROFILE) {
                        if (!candidates.includes(SETUP_TOKEN_PROFILE)) {
                            available = candidates.length > 0 ? candidates.join(", ") : "(none)";
                            throw new Error("Setup-token profile \"".concat(SETUP_TOKEN_PROFILE, "\" not found. Available: ").concat(available, "."));
                        }
                        return [2 /*return*/, { agentDir: agentDir, profileId: SETUP_TOKEN_PROFILE }];
                    }
                    if (SETUP_TOKEN_RAW && SETUP_TOKEN_RAW !== "1" && SETUP_TOKEN_RAW !== "auto") {
                        throw new Error("OPENCLAW_LIVE_SETUP_TOKEN did not look like a setup-token. Use OPENCLAW_LIVE_SETUP_TOKEN_VALUE for raw tokens.");
                    }
                    if (candidates.length === 0) {
                        throw new Error("No Anthropics setup-token profiles found. Set OPENCLAW_LIVE_SETUP_TOKEN_VALUE or OPENCLAW_LIVE_SETUP_TOKEN_PROFILE.");
                    }
                    return [2 /*return*/, { agentDir: agentDir, profileId: pickSetupTokenProfile(candidates) }];
            }
        });
    });
}
function pickModel(models, raw) {
    var _a, _b, _c;
    var normalized = (_a = raw === null || raw === void 0 ? void 0 : raw.trim()) !== null && _a !== void 0 ? _a : "";
    if (normalized) {
        var parsed_1 = (0, model_selection_js_1.parseModelRef)(normalized, "anthropic");
        if (!parsed_1) {
            return null;
        }
        return ((_b = models.find(function (model) {
            return (0, model_selection_js_1.normalizeProviderId)(model.provider) === parsed_1.provider && model.id === parsed_1.model;
        })) !== null && _b !== void 0 ? _b : null);
    }
    var preferred = [
        "claude-opus-4-5",
        "claude-sonnet-4-5",
        "claude-sonnet-4-0",
        "claude-haiku-3-5",
    ];
    var _loop_1 = function (id) {
        var match = models.find(function (model) { return model.id === id; });
        if (match) {
            return { value: match };
        }
    };
    for (var _i = 0, preferred_2 = preferred; _i < preferred_2.length; _i++) {
        var id = preferred_2[_i];
        var state_1 = _loop_1(id);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return (_c = models[0]) !== null && _c !== void 0 ? _c : null;
}
describeLive("live anthropic setup-token", function () {
    (0, vitest_1.it)("completes using a setup-token profile", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tokenSource, cfg, authStorage, modelRegistry, all, candidates, model, apiKeyInfo, apiKey, tokenError, res, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resolveTokenSource()];
                case 1:
                    tokenSource = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 6, 9]);
                    cfg = (0, config_js_1.loadConfig)();
                    return [4 /*yield*/, (0, models_config_js_1.ensureOpenClawModelsJson)(cfg, tokenSource.agentDir)];
                case 3:
                    _a.sent();
                    authStorage = (0, pi_model_discovery_js_1.discoverAuthStorage)(tokenSource.agentDir);
                    modelRegistry = (0, pi_model_discovery_js_1.discoverModels)(authStorage, tokenSource.agentDir);
                    all = Array.isArray(modelRegistry) ? modelRegistry : modelRegistry.getAll();
                    candidates = all.filter(function (model) { return (0, model_selection_js_1.normalizeProviderId)(model.provider) === "anthropic"; });
                    (0, vitest_1.expect)(candidates.length).toBeGreaterThan(0);
                    model = pickModel(candidates, SETUP_TOKEN_MODEL);
                    if (!model) {
                        throw new Error(SETUP_TOKEN_MODEL
                            ? "Model not found: ".concat(SETUP_TOKEN_MODEL)
                            : "No Anthropic models available.");
                    }
                    return [4 /*yield*/, (0, model_auth_js_1.getApiKeyForModel)({
                            model: model,
                            cfg: cfg,
                            profileId: tokenSource.profileId,
                            agentDir: tokenSource.agentDir,
                        })];
                case 4:
                    apiKeyInfo = _a.sent();
                    apiKey = (0, model_auth_js_1.requireApiKey)(apiKeyInfo, model.provider);
                    tokenError = (0, auth_token_js_1.validateAnthropicSetupToken)(apiKey);
                    if (tokenError) {
                        throw new Error("Resolved profile is not a setup-token: ".concat(tokenError));
                    }
                    return [4 /*yield*/, (0, pi_ai_1.completeSimple)(model, {
                            messages: [
                                {
                                    role: "user",
                                    content: "Reply with the word ok.",
                                    timestamp: Date.now(),
                                },
                            ],
                        }, {
                            apiKey: apiKey,
                            maxTokens: 64,
                            temperature: 0,
                        })];
                case 5:
                    res = _a.sent();
                    text = res.content
                        .filter(function (block) { return block.type === "text"; })
                        .map(function (block) { return block.text.trim(); })
                        .join(" ");
                    (0, vitest_1.expect)(text.toLowerCase()).toContain("ok");
                    return [3 /*break*/, 9];
                case 6:
                    if (!tokenSource.cleanup) return [3 /*break*/, 8];
                    return [4 /*yield*/, tokenSource.cleanup()];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); }, 5 * 60 * 1000);
});
