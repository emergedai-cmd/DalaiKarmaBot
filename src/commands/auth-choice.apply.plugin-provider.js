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
exports.applyAuthChoicePluginProvider = applyAuthChoicePluginProvider;
var agent_paths_js_1 = require("../agents/agent-paths.js");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var auth_profiles_js_1 = require("../agents/auth-profiles.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var workspace_js_1 = require("../agents/workspace.js");
var enable_js_1 = require("../plugins/enable.js");
var providers_js_1 = require("../plugins/providers.js");
var oauth_env_js_1 = require("./oauth-env.js");
var oauth_flow_js_1 = require("./oauth-flow.js");
var onboard_auth_js_1 = require("./onboard-auth.js");
var onboard_helpers_js_1 = require("./onboard-helpers.js");
function resolveProviderMatch(providers, rawProvider) {
    var _a, _b;
    var normalized = (0, model_selection_js_1.normalizeProviderId)(rawProvider);
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
function applyAuthChoicePluginProvider(params, options) {
    return __awaiter(this, void 0, void 0, function () {
        var enableResult, nextConfig, agentId, defaultAgentId, agentDir, workspaceDir, providers, provider, method, isRemote, result, _i, _a, profile, agentModelOverride;
        var _this = this;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (params.authChoice !== options.authChoice) {
                        return [2 /*return*/, null];
                    }
                    enableResult = (0, enable_js_1.enablePluginInConfig)(params.config, options.pluginId);
                    nextConfig = enableResult.config;
                    if (!!enableResult.enabled) return [3 /*break*/, 2];
                    return [4 /*yield*/, params.prompter.note("".concat(options.label, " plugin is disabled (").concat((_b = enableResult.reason) !== null && _b !== void 0 ? _b : "blocked", ")."), options.label)];
                case 1:
                    _g.sent();
                    return [2 /*return*/, { config: nextConfig }];
                case 2:
                    agentId = (_c = params.agentId) !== null && _c !== void 0 ? _c : (0, agent_scope_js_1.resolveDefaultAgentId)(nextConfig);
                    defaultAgentId = (0, agent_scope_js_1.resolveDefaultAgentId)(nextConfig);
                    agentDir = (_d = params.agentDir) !== null && _d !== void 0 ? _d : (agentId === defaultAgentId ? (0, agent_paths_js_1.resolveOpenClawAgentDir)() : (0, agent_scope_js_1.resolveAgentDir)(nextConfig, agentId));
                    workspaceDir = (_e = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(nextConfig, agentId)) !== null && _e !== void 0 ? _e : (0, workspace_js_1.resolveDefaultAgentWorkspaceDir)();
                    providers = (0, providers_js_1.resolvePluginProviders)({ config: nextConfig, workspaceDir: workspaceDir });
                    provider = resolveProviderMatch(providers, options.providerId);
                    if (!!provider) return [3 /*break*/, 4];
                    return [4 /*yield*/, params.prompter.note("".concat(options.label, " auth plugin is not available. Enable it and re-run the wizard."), options.label)];
                case 3:
                    _g.sent();
                    return [2 /*return*/, { config: nextConfig }];
                case 4:
                    method = (_f = pickAuthMethod(provider, options.methodId)) !== null && _f !== void 0 ? _f : provider.auth[0];
                    if (!!method) return [3 /*break*/, 6];
                    return [4 /*yield*/, params.prompter.note("".concat(options.label, " auth method missing."), options.label)];
                case 5:
                    _g.sent();
                    return [2 /*return*/, { config: nextConfig }];
                case 6:
                    isRemote = (0, oauth_env_js_1.isRemoteEnvironment)();
                    return [4 /*yield*/, method.run({
                            config: nextConfig,
                            agentDir: agentDir,
                            workspaceDir: workspaceDir,
                            prompter: params.prompter,
                            runtime: params.runtime,
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
                                createVpsAwareHandlers: function (opts) { return (0, oauth_flow_js_1.createVpsAwareOAuthHandlers)(opts); },
                            },
                        })];
                case 7:
                    result = _g.sent();
                    if (result.configPatch) {
                        nextConfig = mergeConfigPatch(nextConfig, result.configPatch);
                    }
                    for (_i = 0, _a = result.profiles; _i < _a.length; _i++) {
                        profile = _a[_i];
                        (0, auth_profiles_js_1.upsertAuthProfile)({
                            profileId: profile.profileId,
                            credential: profile.credential,
                            agentDir: agentDir,
                        });
                        nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, __assign({ profileId: profile.profileId, provider: profile.credential.provider, mode: profile.credential.type === "token" ? "token" : profile.credential.type }, ("email" in profile.credential && profile.credential.email
                            ? { email: profile.credential.email }
                            : {})));
                    }
                    if (!result.defaultModel) return [3 /*break*/, 11];
                    if (!params.setDefaultModel) return [3 /*break*/, 9];
                    nextConfig = applyDefaultModel(nextConfig, result.defaultModel);
                    return [4 /*yield*/, params.prompter.note("Default model set to ".concat(result.defaultModel), "Model configured")];
                case 8:
                    _g.sent();
                    return [3 /*break*/, 11];
                case 9:
                    if (!params.agentId) return [3 /*break*/, 11];
                    agentModelOverride = result.defaultModel;
                    return [4 /*yield*/, params.prompter.note("Default model set to ".concat(result.defaultModel, " for agent \"").concat(params.agentId, "\"."), "Model configured")];
                case 10:
                    _g.sent();
                    _g.label = 11;
                case 11:
                    if (!(result.notes && result.notes.length > 0)) return [3 /*break*/, 13];
                    return [4 /*yield*/, params.prompter.note(result.notes.join("\n"), "Provider notes")];
                case 12:
                    _g.sent();
                    _g.label = 13;
                case 13: return [2 /*return*/, { config: nextConfig, agentModelOverride: agentModelOverride }];
            }
        });
    });
}
