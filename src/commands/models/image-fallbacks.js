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
exports.modelsImageFallbacksListCommand = modelsImageFallbacksListCommand;
exports.modelsImageFallbacksAddCommand = modelsImageFallbacksAddCommand;
exports.modelsImageFallbacksRemoveCommand = modelsImageFallbacksRemoveCommand;
exports.modelsImageFallbacksClearCommand = modelsImageFallbacksClearCommand;
var model_selection_js_1 = require("../../agents/model-selection.js");
var config_js_1 = require("../../config/config.js");
var logging_js_1 = require("../../config/logging.js");
var shared_js_1 = require("./shared.js");
function modelsImageFallbacksListCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, fallbacks, _i, fallbacks_1, entry, _a, fallbacks_2, entry;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            (0, shared_js_1.ensureFlagCompatibility)(opts);
            cfg = (0, config_js_1.loadConfig)();
            fallbacks = (_e = (_d = (_c = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.imageModel) === null || _d === void 0 ? void 0 : _d.fallbacks) !== null && _e !== void 0 ? _e : [];
            if (opts.json) {
                runtime.log(JSON.stringify({ fallbacks: fallbacks }, null, 2));
                return [2 /*return*/];
            }
            if (opts.plain) {
                for (_i = 0, fallbacks_1 = fallbacks; _i < fallbacks_1.length; _i++) {
                    entry = fallbacks_1[_i];
                    runtime.log(entry);
                }
                return [2 /*return*/];
            }
            runtime.log("Image fallbacks (".concat(fallbacks.length, "):"));
            if (fallbacks.length === 0) {
                runtime.log("- none");
                return [2 /*return*/];
            }
            for (_a = 0, fallbacks_2 = fallbacks; _a < fallbacks_2.length; _a++) {
                entry = fallbacks_2[_a];
                runtime.log("- ".concat(entry));
            }
            return [2 /*return*/];
        });
    });
}
function modelsImageFallbacksAddCommand(modelRaw, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var updated;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, shared_js_1.updateConfig)(function (cfg) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                        var resolved = (0, shared_js_1.resolveModelTarget)({ raw: modelRaw, cfg: cfg });
                        var targetKey = (0, shared_js_1.modelKey)(resolved.provider, resolved.model);
                        var nextModels = __assign({}, (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models);
                        if (!nextModels[targetKey]) {
                            nextModels[targetKey] = {};
                        }
                        var aliasIndex = (0, model_selection_js_1.buildModelAliasIndex)({
                            cfg: cfg,
                            defaultProvider: shared_js_1.DEFAULT_PROVIDER,
                        });
                        var existing = (_f = (_e = (_d = (_c = cfg.agents) === null || _c === void 0 ? void 0 : _c.defaults) === null || _d === void 0 ? void 0 : _d.imageModel) === null || _e === void 0 ? void 0 : _e.fallbacks) !== null && _f !== void 0 ? _f : [];
                        var existingKeys = existing
                            .map(function (entry) {
                            return (0, model_selection_js_1.resolveModelRefFromString)({
                                raw: String(entry !== null && entry !== void 0 ? entry : ""),
                                defaultProvider: shared_js_1.DEFAULT_PROVIDER,
                                aliasIndex: aliasIndex,
                            });
                        })
                            .filter(function (entry) { return Boolean(entry); })
                            .map(function (entry) { return (0, shared_js_1.modelKey)(entry.ref.provider, entry.ref.model); });
                        if (existingKeys.includes(targetKey)) {
                            return cfg;
                        }
                        var existingModel = (_h = (_g = cfg.agents) === null || _g === void 0 ? void 0 : _g.defaults) === null || _h === void 0 ? void 0 : _h.imageModel;
                        return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_j = cfg.agents) === null || _j === void 0 ? void 0 : _j.defaults), { imageModel: __assign(__assign({}, ((existingModel === null || existingModel === void 0 ? void 0 : existingModel.primary) ? { primary: existingModel.primary } : undefined)), { fallbacks: __spreadArray(__spreadArray([], existing, true), [targetKey], false) }), models: nextModels }) }) });
                    })];
                case 1:
                    updated = _e.sent();
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    runtime.log("Image fallbacks: ".concat(((_d = (_c = (_b = (_a = updated.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.imageModel) === null || _c === void 0 ? void 0 : _c.fallbacks) !== null && _d !== void 0 ? _d : []).join(", ")));
                    return [2 /*return*/];
            }
        });
    });
}
function modelsImageFallbacksRemoveCommand(modelRaw, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var updated;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, shared_js_1.updateConfig)(function (cfg) {
                        var _a, _b, _c, _d, _e, _f, _g;
                        var resolved = (0, shared_js_1.resolveModelTarget)({ raw: modelRaw, cfg: cfg });
                        var targetKey = (0, shared_js_1.modelKey)(resolved.provider, resolved.model);
                        var aliasIndex = (0, model_selection_js_1.buildModelAliasIndex)({
                            cfg: cfg,
                            defaultProvider: shared_js_1.DEFAULT_PROVIDER,
                        });
                        var existing = (_d = (_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.imageModel) === null || _c === void 0 ? void 0 : _c.fallbacks) !== null && _d !== void 0 ? _d : [];
                        var filtered = existing.filter(function (entry) {
                            var resolvedEntry = (0, model_selection_js_1.resolveModelRefFromString)({
                                raw: String(entry !== null && entry !== void 0 ? entry : ""),
                                defaultProvider: shared_js_1.DEFAULT_PROVIDER,
                                aliasIndex: aliasIndex,
                            });
                            if (!resolvedEntry) {
                                return true;
                            }
                            return (0, shared_js_1.modelKey)(resolvedEntry.ref.provider, resolvedEntry.ref.model) !== targetKey;
                        });
                        if (filtered.length === existing.length) {
                            throw new Error("Image fallback not found: ".concat(targetKey));
                        }
                        var existingModel = (_f = (_e = cfg.agents) === null || _e === void 0 ? void 0 : _e.defaults) === null || _f === void 0 ? void 0 : _f.imageModel;
                        return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_g = cfg.agents) === null || _g === void 0 ? void 0 : _g.defaults), { imageModel: __assign(__assign({}, ((existingModel === null || existingModel === void 0 ? void 0 : existingModel.primary) ? { primary: existingModel.primary } : undefined)), { fallbacks: filtered }) }) }) });
                    })];
                case 1:
                    updated = _e.sent();
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    runtime.log("Image fallbacks: ".concat(((_d = (_c = (_b = (_a = updated.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.imageModel) === null || _c === void 0 ? void 0 : _c.fallbacks) !== null && _d !== void 0 ? _d : []).join(", ")));
                    return [2 /*return*/];
            }
        });
    });
}
function modelsImageFallbacksClearCommand(runtime) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, shared_js_1.updateConfig)(function (cfg) {
                        var _a, _b, _c;
                        var existingModel = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.imageModel;
                        return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_c = cfg.agents) === null || _c === void 0 ? void 0 : _c.defaults), { imageModel: __assign(__assign({}, ((existingModel === null || existingModel === void 0 ? void 0 : existingModel.primary) ? { primary: existingModel.primary } : undefined)), { fallbacks: [] }) }) }) });
                    })];
                case 1:
                    _a.sent();
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    runtime.log("Image fallback list cleared.");
                    return [2 /*return*/];
            }
        });
    });
}
