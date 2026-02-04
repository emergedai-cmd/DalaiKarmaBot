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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelsAuthSetupTokenCommand = modelsAuthSetupTokenCommand;
exports.modelsAuthPasteTokenCommand = modelsAuthPasteTokenCommand;
exports.modelsAuthAddCommand = modelsAuthAddCommand;
exports.modelsAuthLoginCommand = modelsAuthLoginCommand;
var prompts_1 = require("@clack/prompts");
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var auth_profiles_js_1 = require("../../agents/auth-profiles.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var workspace_js_1 = require("../../agents/workspace.js");
var command_format_js_1 = require("../../cli/command-format.js");
var parse_duration_js_1 = require("../../cli/parse-duration.js");
var config_js_1 = require("../../config/config.js");
var logging_js_1 = require("../../config/logging.js");
var providers_js_1 = require("../../plugins/providers.js");
var prompt_style_js_1 = require("../../terminal/prompt-style.js");
var clack_prompter_js_1 = require("../../wizard/clack-prompter.js");
var auth_token_js_1 = require("../auth-token.js");
var oauth_env_js_1 = require("../oauth-env.js");
var oauth_flow_js_1 = require("../oauth-flow.js");
var onboard_auth_js_1 = require("../onboard-auth.js");
var onboard_helpers_js_1 = require("../onboard-helpers.js");
var shared_js_1 = require("./shared.js");
var confirm = function (params) {
    return (0, prompts_1.confirm)(__assign(__assign({}, params), { message: (0, prompt_style_js_1.stylePromptMessage)(params.message) }));
};
var text = function (params) {
    return (0, prompts_1.text)(__assign(__assign({}, params), { message: (0, prompt_style_js_1.stylePromptMessage)(params.message) }));
};
var select = function (params) {
    return (0, prompts_1.select)(__assign(__assign({}, params), { message: (0, prompt_style_js_1.stylePromptMessage)(params.message), options: params.options.map(function (opt) {
            return opt.hint === undefined ? opt : __assign(__assign({}, opt), { hint: (0, prompt_style_js_1.stylePromptHint)(opt.hint) });
        }) }));
};
function resolveTokenProvider(raw) {
    var trimmed = raw === null || raw === void 0 ? void 0 : raw.trim();
    if (!trimmed) {
        return null;
    }
    var normalized = (0, model_selection_js_1.normalizeProviderId)(trimmed);
    if (normalized === "anthropic") {
        return "anthropic";
    }
    return "custom";
}
function resolveDefaultTokenProfileId(provider) {
    return "".concat((0, model_selection_js_1.normalizeProviderId)(provider), ":manual");
}
function modelsAuthSetupTokenCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var provider, proceed, tokenInput, token, profileId;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    provider = resolveTokenProvider((_a = opts.provider) !== null && _a !== void 0 ? _a : "anthropic");
                    if (provider !== "anthropic") {
                        throw new Error("Only --provider anthropic is supported for setup-token.");
                    }
                    if (!process.stdin.isTTY) {
                        throw new Error("setup-token requires an interactive TTY.");
                    }
                    if (!!opts.yes) return [3 /*break*/, 2];
                    return [4 /*yield*/, confirm({
                            message: "Have you run `claude setup-token` and copied the token?",
                            initialValue: true,
                        })];
                case 1:
                    proceed = _b.sent();
                    if (!proceed) {
                        return [2 /*return*/];
                    }
                    _b.label = 2;
                case 2: return [4 /*yield*/, text({
                        message: "Paste Anthropic setup-token",
                        validate: function (value) { return (0, auth_token_js_1.validateAnthropicSetupToken)(String(value !== null && value !== void 0 ? value : "")); },
                    })];
                case 3:
                    tokenInput = _b.sent();
                    token = String(tokenInput).trim();
                    profileId = resolveDefaultTokenProfileId(provider);
                    (0, auth_profiles_js_1.upsertAuthProfile)({
                        profileId: profileId,
                        credential: {
                            type: "token",
                            provider: provider,
                            token: token,
                        },
                    });
                    return [4 /*yield*/, (0, shared_js_1.updateConfig)(function (cfg) {
                            return (0, onboard_auth_js_1.applyAuthProfileConfig)(cfg, {
                                profileId: profileId,
                                provider: provider,
                                mode: "token",
                            });
                        })];
                case 4:
                    _b.sent();
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    runtime.log("Auth profile: ".concat(profileId, " (").concat(provider, "/token)"));
                    return [2 /*return*/];
            }
        });
    });
}
function modelsAuthPasteTokenCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var rawProvider, provider, profileId, tokenInput, token, expires;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    rawProvider = (_a = opts.provider) === null || _a === void 0 ? void 0 : _a.trim();
                    if (!rawProvider) {
                        throw new Error("Missing --provider.");
                    }
                    provider = (0, model_selection_js_1.normalizeProviderId)(rawProvider);
                    profileId = ((_b = opts.profileId) === null || _b === void 0 ? void 0 : _b.trim()) || resolveDefaultTokenProfileId(provider);
                    return [4 /*yield*/, text({
                            message: "Paste token for ".concat(provider),
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 1:
                    tokenInput = _d.sent();
                    token = String(tokenInput).trim();
                    expires = ((_c = opts.expiresIn) === null || _c === void 0 ? void 0 : _c.trim()) && opts.expiresIn.trim().length > 0
                        ? Date.now() + (0, parse_duration_js_1.parseDurationMs)(String(opts.expiresIn).trim(), { defaultUnit: "d" })
                        : undefined;
                    (0, auth_profiles_js_1.upsertAuthProfile)({
                        profileId: profileId,
                        credential: __assign({ type: "token", provider: provider, token: token }, (expires ? { expires: expires } : {})),
                    });
                    return [4 /*yield*/, (0, shared_js_1.updateConfig)(function (cfg) { return (0, onboard_auth_js_1.applyAuthProfileConfig)(cfg, { profileId: profileId, provider: provider, mode: "token" }); })];
                case 2:
                    _d.sent();
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    runtime.log("Auth profile: ".concat(profileId, " (").concat(provider, "/token)"));
                    return [2 /*return*/];
            }
        });
    });
}
function modelsAuthAddCommand(_opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var provider, providerId, _a, _b, _c, method, profileIdDefault, profileId, _d, wantsExpiry, expiresIn, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, select({
                        message: "Token provider",
                        options: [
                            { value: "anthropic", label: "anthropic" },
                            { value: "custom", label: "custom (type provider id)" },
                        ],
                    })];
                case 1:
                    provider = (_g.sent());
                    if (!(provider === "custom")) return [3 /*break*/, 3];
                    _b = model_selection_js_1.normalizeProviderId;
                    _c = String;
                    return [4 /*yield*/, text({
                            message: "Provider id",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 2:
                    _a = _b.apply(void 0, [_c.apply(void 0, [_g.sent()])]);
                    return [3 /*break*/, 4];
                case 3:
                    _a = provider;
                    _g.label = 4;
                case 4:
                    providerId = _a;
                    return [4 /*yield*/, select({
                            message: "Token method",
                            options: __spreadArray(__spreadArray([], (providerId === "anthropic"
                                ? [
                                    {
                                        value: "setup-token",
                                        label: "setup-token (claude)",
                                        hint: "Paste a setup-token from `claude setup-token`",
                                    },
                                ]
                                : []), true), [
                                { value: "paste", label: "paste token" },
                            ], false),
                        })];
                case 5:
                    method = (_g.sent());
                    if (!(method === "setup-token")) return [3 /*break*/, 7];
                    return [4 /*yield*/, modelsAuthSetupTokenCommand({ provider: providerId }, runtime)];
                case 6:
                    _g.sent();
                    return [2 /*return*/];
                case 7:
                    profileIdDefault = resolveDefaultTokenProfileId(providerId);
                    _d = String;
                    return [4 /*yield*/, text({
                            message: "Profile id",
                            initialValue: profileIdDefault,
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 8:
                    profileId = _d.apply(void 0, [_g.sent()]).trim();
                    return [4 /*yield*/, confirm({
                            message: "Does this token expire?",
                            initialValue: false,
                        })];
                case 9:
                    wantsExpiry = _g.sent();
                    if (!wantsExpiry) return [3 /*break*/, 11];
                    _f = String;
                    return [4 /*yield*/, text({
                            message: "Expires in (duration)",
                            initialValue: "365d",
                            validate: function (value) {
                                try {
                                    (0, parse_duration_js_1.parseDurationMs)(String(value !== null && value !== void 0 ? value : ""), { defaultUnit: "d" });
                                    return undefined;
                                }
                                catch (_a) {
                                    return "Invalid duration (e.g. 365d, 12h, 30m)";
                                }
                            },
                        })];
                case 10:
                    _e = _f.apply(void 0, [_g.sent()]).trim();
                    return [3 /*break*/, 12];
                case 11:
                    _e = undefined;
                    _g.label = 12;
                case 12:
                    expiresIn = _e;
                    return [4 /*yield*/, modelsAuthPasteTokenCommand({ provider: providerId, profileId: profileId, expiresIn: expiresIn }, runtime)];
                case 13:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function resolveProviderMatch(providers, rawProvider) {
    var _a, _b;
    var raw = rawProvider === null || rawProvider === void 0 ? void 0 : rawProvider.trim();
    if (!raw) {
        return null;
    }
    var normalized = (0, model_selection_js_1.normalizeProviderId)(raw);
    return ((_b = (_a = providers.find(function (provider) { return (0, model_selection_js_1.normalizeProviderId)(provider.id) === normalized; })) !== null && _a !== void 0 ? _a : providers.find(function (provider) { var _a, _b; return (_b = (_a = provider.aliases) === null || _a === void 0 ? void 0 : _a.some(function (alias) { return (0, model_selection_js_1.normalizeProviderId)(alias) === normalized; })) !== null && _b !== void 0 ? _b : false; })) !== null && _b !== void 0 ? _b : null);
}
function pickAuthMethod(provider, rawMethod) {
    var _a, _b;
    var raw = rawMethod === null || rawMethod === void 0 ? void 0 : rawMethod.trim();
    if (!raw) {
        return null;
    }
    var normalized = raw.toLowerCase();
    return ((_b = (_a = provider.auth.find(function (method) { return method.id.toLowerCase() === normalized; })) !== null && _a !== void 0 ? _a : provider.auth.find(function (method) { return method.label.toLowerCase() === normalized; })) !== null && _b !== void 0 ? _b : null);
}
function isPlainRecord(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function mergeConfigPatch(base, patch) {
    if (!isPlainRecord(base) || !isPlainRecord(patch)) {
        return patch;
    }
    var next = __assign({}, base);
    for (var _i = 0, _a = Object.entries(patch); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        var existing = next[key];
        if (isPlainRecord(existing) && isPlainRecord(value)) {
            next[key] = mergeConfigPatch(existing, value);
        }
        else {
            next[key] = value;
        }
    }
    return next;
}
function applyDefaultModel(cfg, model) {
    var _a, _b, _c, _d, _e, _f;
    var models = __assign({}, (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models);
    models[model] = (_c = models[model]) !== null && _c !== void 0 ? _c : {};
    var existingModel = (_e = (_d = cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults) === null || _e === void 0 ? void 0 : _e.model;
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_f = cfg.agents) === null || _f === void 0 ? void 0 : _f.defaults), { models: models, model: __assign(__assign({}, (existingModel && typeof existingModel === "object" && "fallbacks" in existingModel
                    ? { fallbacks: existingModel.fallbacks }
                    : undefined)), { primary: model }) }) }) });
}
function credentialMode(credential) {
    if (credential.type === "api_key") {
        return "api_key";
    }
    if (credential.type === "token") {
        return "token";
    }
    return "oauth";
}
function modelsAuthLoginCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var snapshot, issues, config, defaultAgentId, agentDir, workspaceDir, providers, prompter, selectedProvider, _a, chosenMethod, _b, _c, isRemote, result, _i, _d, profile, _e, _f, profile;
        var _this = this;
        var _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    if (!process.stdin.isTTY) {
                        throw new Error("models auth login requires an interactive TTY.");
                    }
                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 1:
                    snapshot = _k.sent();
                    if (!snapshot.valid) {
                        issues = snapshot.issues.map(function (issue) { return "- ".concat(issue.path, ": ").concat(issue.message); }).join("\n");
                        throw new Error("Invalid config at ".concat(snapshot.path, "\n").concat(issues));
                    }
                    config = snapshot.config;
                    defaultAgentId = (0, agent_scope_js_1.resolveDefaultAgentId)(config);
                    agentDir = (0, agent_scope_js_1.resolveAgentDir)(config, defaultAgentId);
                    workspaceDir = (_g = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(config, defaultAgentId)) !== null && _g !== void 0 ? _g : (0, workspace_js_1.resolveDefaultAgentWorkspaceDir)();
                    providers = (0, providers_js_1.resolvePluginProviders)({ config: config, workspaceDir: workspaceDir });
                    if (providers.length === 0) {
                        throw new Error("No provider plugins found. Install one via `".concat((0, command_format_js_1.formatCliCommand)("openclaw plugins install"), "`."));
                    }
                    prompter = (0, clack_prompter_js_1.createClackPrompter)();
                    if (!((_h = resolveProviderMatch(providers, opts.provider)) !== null && _h !== void 0)) return [3 /*break*/, 2];
                    _a = _h;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, prompter
                        .select({
                        message: "Select a provider",
                        options: providers.map(function (provider) { return ({
                            value: provider.id,
                            label: provider.label,
                            hint: provider.docsPath ? "Docs: ".concat(provider.docsPath) : undefined,
                        }); }),
                    })
                        .then(function (id) { return resolveProviderMatch(providers, String(id)); })];
                case 3:
                    _a = (_k.sent());
                    _k.label = 4;
                case 4:
                    selectedProvider = _a;
                    if (!selectedProvider) {
                        throw new Error("Unknown provider. Use --provider <id> to pick a provider plugin.");
                    }
                    if (!((_j = pickAuthMethod(selectedProvider, opts.method)) !== null && _j !== void 0)) return [3 /*break*/, 5];
                    _b = _j;
                    return [3 /*break*/, 9];
                case 5:
                    if (!(selectedProvider.auth.length === 1)) return [3 /*break*/, 6];
                    _c = selectedProvider.auth[0];
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, prompter
                        .select({
                        message: "Auth method for ".concat(selectedProvider.label),
                        options: selectedProvider.auth.map(function (method) { return ({
                            value: method.id,
                            label: method.label,
                            hint: method.hint,
                        }); }),
                    })
                        .then(function (id) { return selectedProvider.auth.find(function (method) { return method.id === String(id); }); })];
                case 7:
                    _c = _k.sent();
                    _k.label = 8;
                case 8:
                    _b = (_c);
                    _k.label = 9;
                case 9:
                    chosenMethod = _b;
                    if (!chosenMethod) {
                        throw new Error("Unknown auth method. Use --method <id> to select one.");
                    }
                    isRemote = (0, oauth_env_js_1.isRemoteEnvironment)();
                    return [4 /*yield*/, chosenMethod.run({
                            config: config,
                            agentDir: agentDir,
                            workspaceDir: workspaceDir,
                            prompter: prompter,
                            runtime: runtime,
                            isRemote: isRemote,
                            openUrl: function (url) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, (0, onboard_helpers_js_1.openUrl)(url)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                            oauth: {
                                createVpsAwareHandlers: function (params) { return (0, oauth_flow_js_1.createVpsAwareOAuthHandlers)(params); },
                            },
                        })];
                case 10:
                    result = _k.sent();
                    for (_i = 0, _d = result.profiles; _i < _d.length; _i++) {
                        profile = _d[_i];
                        (0, auth_profiles_js_1.upsertAuthProfile)({
                            profileId: profile.profileId,
                            credential: profile.credential,
                            agentDir: agentDir,
                        });
                    }
                    return [4 /*yield*/, (0, shared_js_1.updateConfig)(function (cfg) {
                            var next = cfg;
                            if (result.configPatch) {
                                next = mergeConfigPatch(next, result.configPatch);
                            }
                            for (var _i = 0, _a = result.profiles; _i < _a.length; _i++) {
                                var profile = _a[_i];
                                next = (0, onboard_auth_js_1.applyAuthProfileConfig)(next, {
                                    profileId: profile.profileId,
                                    provider: profile.credential.provider,
                                    mode: credentialMode(profile.credential),
                                });
                            }
                            if (opts.setDefault && result.defaultModel) {
                                next = applyDefaultModel(next, result.defaultModel);
                            }
                            return next;
                        })];
                case 11:
                    _k.sent();
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    for (_e = 0, _f = result.profiles; _e < _f.length; _e++) {
                        profile = _f[_e];
                        runtime.log("Auth profile: ".concat(profile.profileId, " (").concat(profile.credential.provider, "/").concat(credentialMode(profile.credential), ")"));
                    }
                    if (result.defaultModel) {
                        runtime.log(opts.setDefault
                            ? "Default model set to ".concat(result.defaultModel)
                            : "Default model available: ".concat(result.defaultModel, " (use --set-default to apply)"));
                    }
                    if (!(result.notes && result.notes.length > 0)) return [3 /*break*/, 13];
                    return [4 /*yield*/, prompter.note(result.notes.join("\n"), "Provider notes")];
                case 12:
                    _k.sent();
                    _k.label = 13;
                case 13: return [2 /*return*/];
            }
        });
    });
}
