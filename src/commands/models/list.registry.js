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
exports.loadModelRegistry = loadModelRegistry;
exports.toModelRow = toModelRow;
var agent_paths_js_1 = require("../../agents/agent-paths.js");
var auth_profiles_js_1 = require("../../agents/auth-profiles.js");
var model_auth_js_1 = require("../../agents/model-auth.js");
var models_config_js_1 = require("../../agents/models-config.js");
var pi_model_discovery_js_1 = require("../../agents/pi-model-discovery.js");
var shared_js_1 = require("./shared.js");
var isLocalBaseUrl = function (baseUrl) {
    try {
        var url = new URL(baseUrl);
        var host = url.hostname.toLowerCase();
        return (host === "localhost" ||
            host === "127.0.0.1" ||
            host === "0.0.0.0" ||
            host === "::1" ||
            host.endsWith(".local"));
    }
    catch (_a) {
        return false;
    }
};
var hasAuthForProvider = function (provider, cfg, authStore) {
    if ((0, auth_profiles_js_1.listProfilesForProvider)(authStore, provider).length > 0) {
        return true;
    }
    if (provider === "amazon-bedrock" && (0, model_auth_js_1.resolveAwsSdkEnvVarName)()) {
        return true;
    }
    if ((0, model_auth_js_1.resolveEnvApiKey)(provider)) {
        return true;
    }
    if ((0, model_auth_js_1.getCustomProviderApiKey)(cfg, provider)) {
        return true;
    }
    return false;
};
function loadModelRegistry(cfg) {
    return __awaiter(this, void 0, void 0, function () {
        var agentDir, authStorage, registry, models, availableModels, availableKeys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, models_config_js_1.ensureOpenClawModelsJson)(cfg)];
                case 1:
                    _a.sent();
                    agentDir = (0, agent_paths_js_1.resolveOpenClawAgentDir)();
                    authStorage = (0, pi_model_discovery_js_1.discoverAuthStorage)(agentDir);
                    registry = (0, pi_model_discovery_js_1.discoverModels)(authStorage, agentDir);
                    models = registry.getAll();
                    availableModels = registry.getAvailable();
                    availableKeys = new Set(availableModels.map(function (model) { return (0, shared_js_1.modelKey)(model.provider, model.id); }));
                    return [2 /*return*/, { registry: registry, models: models, availableKeys: availableKeys }];
            }
        });
    });
}
function toModelRow(params) {
    var _a, _b;
    var model = params.model, key = params.key, tags = params.tags, _c = params.aliases, aliases = _c === void 0 ? [] : _c, availableKeys = params.availableKeys, cfg = params.cfg, authStore = params.authStore;
    if (!model) {
        return {
            key: key,
            name: key,
            input: "-",
            contextWindow: null,
            local: null,
            available: null,
            tags: __spreadArray(__spreadArray([], tags, true), ["missing"], false),
            missing: true,
        };
    }
    var input = model.input.join("+") || "text";
    var local = isLocalBaseUrl(model.baseUrl);
    var available = cfg && authStore
        ? hasAuthForProvider(model.provider, cfg, authStore)
        : ((_a = availableKeys === null || availableKeys === void 0 ? void 0 : availableKeys.has((0, shared_js_1.modelKey)(model.provider, model.id))) !== null && _a !== void 0 ? _a : false);
    var aliasTags = aliases.length > 0 ? ["alias:".concat(aliases.join(","))] : [];
    var mergedTags = new Set(tags);
    if (aliasTags.length > 0) {
        for (var _i = 0, mergedTags_1 = mergedTags; _i < mergedTags_1.length; _i++) {
            var tag = mergedTags_1[_i];
            if (tag === "alias" || tag.startsWith("alias:")) {
                mergedTags.delete(tag);
            }
        }
        for (var _d = 0, aliasTags_1 = aliasTags; _d < aliasTags_1.length; _d++) {
            var tag = aliasTags_1[_d];
            mergedTags.add(tag);
        }
    }
    return {
        key: key,
        name: model.name || model.id,
        input: input,
        contextWindow: (_b = model.contextWindow) !== null && _b !== void 0 ? _b : null,
        local: local,
        available: available,
        tags: Array.from(mergedTags),
        missing: false,
    };
}
