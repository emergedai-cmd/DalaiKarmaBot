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
exports.warnIfModelConfigLooksOff = warnIfModelConfigLooksOff;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var auth_profiles_js_1 = require("../agents/auth-profiles.js");
var defaults_js_1 = require("../agents/defaults.js");
var model_auth_js_1 = require("../agents/model-auth.js");
var model_catalog_js_1 = require("../agents/model-catalog.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var openai_codex_model_default_js_1 = require("./openai-codex-model-default.js");
function warnIfModelConfigLooksOff(config, prompter, options) {
    return __awaiter(this, void 0, void 0, function () {
        var agentModelOverride, configWithModel, ref, warnings, catalog, known, store, hasProfile, envKey, customKey, hasCodex;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    agentModelOverride = (options === null || options === void 0 ? void 0 : options.agentId)
                        ? (0, agent_scope_js_1.resolveAgentModelPrimary)(config, options.agentId)
                        : undefined;
                    configWithModel = agentModelOverride && agentModelOverride.length > 0
                        ? __assign(__assign({}, config), { agents: __assign(__assign({}, config.agents), { defaults: __assign(__assign({}, (_a = config.agents) === null || _a === void 0 ? void 0 : _a.defaults), { model: __assign(__assign({}, (typeof ((_c = (_b = config.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.model) === "object"
                                        ? config.agents.defaults.model
                                        : undefined)), { primary: agentModelOverride }) }) }) }) : config;
                    ref = (0, model_selection_js_1.resolveConfiguredModelRef)({
                        cfg: configWithModel,
                        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                        defaultModel: defaults_js_1.DEFAULT_MODEL,
                    });
                    warnings = [];
                    return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({
                            config: configWithModel,
                            useCache: false,
                        })];
                case 1:
                    catalog = _d.sent();
                    if (catalog.length > 0) {
                        known = catalog.some(function (entry) { return entry.provider === ref.provider && entry.id === ref.model; });
                        if (!known) {
                            warnings.push("Model not found: ".concat(ref.provider, "/").concat(ref.model, ". Update agents.defaults.model or run /models list."));
                        }
                    }
                    store = (0, auth_profiles_js_1.ensureAuthProfileStore)(options === null || options === void 0 ? void 0 : options.agentDir);
                    hasProfile = (0, auth_profiles_js_1.listProfilesForProvider)(store, ref.provider).length > 0;
                    envKey = (0, model_auth_js_1.resolveEnvApiKey)(ref.provider);
                    customKey = (0, model_auth_js_1.getCustomProviderApiKey)(config, ref.provider);
                    if (!hasProfile && !envKey && !customKey) {
                        warnings.push("No auth configured for provider \"".concat(ref.provider, "\". The agent may fail until credentials are added."));
                    }
                    if (ref.provider === "openai") {
                        hasCodex = (0, auth_profiles_js_1.listProfilesForProvider)(store, "openai-codex").length > 0;
                        if (hasCodex) {
                            warnings.push("Detected OpenAI Codex OAuth. Consider setting agents.defaults.model to ".concat(openai_codex_model_default_js_1.OPENAI_CODEX_DEFAULT_MODEL, "."));
                        }
                    }
                    if (!(warnings.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, prompter.note(warnings.join("\n"), "Model check")];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
