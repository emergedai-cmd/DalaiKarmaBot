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
exports.modelsAuthOrderGetCommand = modelsAuthOrderGetCommand;
exports.modelsAuthOrderClearCommand = modelsAuthOrderClearCommand;
exports.modelsAuthOrderSetCommand = modelsAuthOrderSetCommand;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var auth_profiles_js_1 = require("../../agents/auth-profiles.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var config_js_1 = require("../../config/config.js");
var utils_js_1 = require("../../utils.js");
var shared_js_1 = require("./shared.js");
function resolveTargetAgent(cfg, raw) {
    var _a;
    var agentId = (_a = (0, shared_js_1.resolveKnownAgentId)({ cfg: cfg, rawAgentId: raw })) !== null && _a !== void 0 ? _a : (0, agent_scope_js_1.resolveDefaultAgentId)(cfg);
    var agentDir = (0, agent_scope_js_1.resolveAgentDir)(cfg, agentId);
    return { agentId: agentId, agentDir: agentDir };
}
function describeOrder(store, provider) {
    var _a;
    var providerKey = (0, model_selection_js_1.normalizeProviderId)(provider);
    var order = (_a = store.order) === null || _a === void 0 ? void 0 : _a[providerKey];
    return Array.isArray(order) ? order : [];
}
function modelsAuthOrderGetCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var rawProvider, provider, cfg, _a, agentId, agentDir, store, order;
        var _b;
        return __generator(this, function (_c) {
            rawProvider = (_b = opts.provider) === null || _b === void 0 ? void 0 : _b.trim();
            if (!rawProvider) {
                throw new Error("Missing --provider.");
            }
            provider = (0, model_selection_js_1.normalizeProviderId)(rawProvider);
            cfg = (0, config_js_1.loadConfig)();
            _a = resolveTargetAgent(cfg, opts.agent), agentId = _a.agentId, agentDir = _a.agentDir;
            store = (0, auth_profiles_js_1.ensureAuthProfileStore)(agentDir, {
                allowKeychainPrompt: false,
            });
            order = describeOrder(store, provider);
            if (opts.json) {
                runtime.log(JSON.stringify({
                    agentId: agentId,
                    agentDir: agentDir,
                    provider: provider,
                    authStorePath: (0, utils_js_1.shortenHomePath)("".concat(agentDir, "/auth-profiles.json")),
                    order: order.length > 0 ? order : null,
                }, null, 2));
                return [2 /*return*/];
            }
            runtime.log("Agent: ".concat(agentId));
            runtime.log("Provider: ".concat(provider));
            runtime.log("Auth file: ".concat((0, utils_js_1.shortenHomePath)("".concat(agentDir, "/auth-profiles.json"))));
            runtime.log(order.length > 0 ? "Order override: ".concat(order.join(", ")) : "Order override: (none)");
            return [2 /*return*/];
        });
    });
}
function modelsAuthOrderClearCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var rawProvider, provider, cfg, _a, agentId, agentDir, updated;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    rawProvider = (_b = opts.provider) === null || _b === void 0 ? void 0 : _b.trim();
                    if (!rawProvider) {
                        throw new Error("Missing --provider.");
                    }
                    provider = (0, model_selection_js_1.normalizeProviderId)(rawProvider);
                    cfg = (0, config_js_1.loadConfig)();
                    _a = resolveTargetAgent(cfg, opts.agent), agentId = _a.agentId, agentDir = _a.agentDir;
                    return [4 /*yield*/, (0, auth_profiles_js_1.setAuthProfileOrder)({
                            agentDir: agentDir,
                            provider: provider,
                            order: null,
                        })];
                case 1:
                    updated = _c.sent();
                    if (!updated) {
                        throw new Error("Failed to update auth-profiles.json (lock busy?).");
                    }
                    runtime.log("Agent: ".concat(agentId));
                    runtime.log("Provider: ".concat(provider));
                    runtime.log("Cleared per-agent order override.");
                    return [2 /*return*/];
            }
        });
    });
}
function modelsAuthOrderSetCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var rawProvider, provider, cfg, _a, agentId, agentDir, store, providerKey, requested, _i, requested_1, profileId, cred, updated;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    rawProvider = (_b = opts.provider) === null || _b === void 0 ? void 0 : _b.trim();
                    if (!rawProvider) {
                        throw new Error("Missing --provider.");
                    }
                    provider = (0, model_selection_js_1.normalizeProviderId)(rawProvider);
                    cfg = (0, config_js_1.loadConfig)();
                    _a = resolveTargetAgent(cfg, opts.agent), agentId = _a.agentId, agentDir = _a.agentDir;
                    store = (0, auth_profiles_js_1.ensureAuthProfileStore)(agentDir, {
                        allowKeychainPrompt: false,
                    });
                    providerKey = (0, model_selection_js_1.normalizeProviderId)(provider);
                    requested = ((_c = opts.order) !== null && _c !== void 0 ? _c : []).map(function (entry) { return String(entry).trim(); }).filter(Boolean);
                    if (requested.length === 0) {
                        throw new Error("Missing profile ids. Provide one or more profile ids.");
                    }
                    for (_i = 0, requested_1 = requested; _i < requested_1.length; _i++) {
                        profileId = requested_1[_i];
                        cred = store.profiles[profileId];
                        if (!cred) {
                            throw new Error("Auth profile \"".concat(profileId, "\" not found in ").concat(agentDir, "."));
                        }
                        if ((0, model_selection_js_1.normalizeProviderId)(cred.provider) !== providerKey) {
                            throw new Error("Auth profile \"".concat(profileId, "\" is for ").concat(cred.provider, ", not ").concat(provider, "."));
                        }
                    }
                    return [4 /*yield*/, (0, auth_profiles_js_1.setAuthProfileOrder)({
                            agentDir: agentDir,
                            provider: provider,
                            order: requested,
                        })];
                case 1:
                    updated = _d.sent();
                    if (!updated) {
                        throw new Error("Failed to update auth-profiles.json (lock busy?).");
                    }
                    runtime.log("Agent: ".concat(agentId));
                    runtime.log("Provider: ".concat(provider));
                    runtime.log("Order override: ".concat(describeOrder(updated, provider).join(", ")));
                    return [2 /*return*/];
            }
        });
    });
}
