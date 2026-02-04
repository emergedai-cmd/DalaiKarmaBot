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
exports.modelsAliasesListCommand = modelsAliasesListCommand;
exports.modelsAliasesAddCommand = modelsAliasesAddCommand;
exports.modelsAliasesRemoveCommand = modelsAliasesRemoveCommand;
var config_js_1 = require("../../config/config.js");
var logging_js_1 = require("../../config/logging.js");
var shared_js_1 = require("./shared.js");
function modelsAliasesListCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, models, aliases, _i, _a, _b, alias, target, _c, _d, _e, alias, target;
        var _f, _g, _h;
        return __generator(this, function (_j) {
            (0, shared_js_1.ensureFlagCompatibility)(opts);
            cfg = (0, config_js_1.loadConfig)();
            models = (_h = (_g = (_f = cfg.agents) === null || _f === void 0 ? void 0 : _f.defaults) === null || _g === void 0 ? void 0 : _g.models) !== null && _h !== void 0 ? _h : {};
            aliases = Object.entries(models).reduce(function (acc, _a) {
                var _b;
                var modelKey = _a[0], entry = _a[1];
                var alias = (_b = entry === null || entry === void 0 ? void 0 : entry.alias) === null || _b === void 0 ? void 0 : _b.trim();
                if (alias) {
                    acc[alias] = modelKey;
                }
                return acc;
            }, {});
            if (opts.json) {
                runtime.log(JSON.stringify({ aliases: aliases }, null, 2));
                return [2 /*return*/];
            }
            if (opts.plain) {
                for (_i = 0, _a = Object.entries(aliases); _i < _a.length; _i++) {
                    _b = _a[_i], alias = _b[0], target = _b[1];
                    runtime.log("".concat(alias, " ").concat(target));
                }
                return [2 /*return*/];
            }
            runtime.log("Aliases (".concat(Object.keys(aliases).length, "):"));
            if (Object.keys(aliases).length === 0) {
                runtime.log("- none");
                return [2 /*return*/];
            }
            for (_c = 0, _d = Object.entries(aliases); _c < _d.length; _c++) {
                _e = _d[_c], alias = _e[0], target = _e[1];
                runtime.log("- ".concat(alias, " -> ").concat(target));
            }
            return [2 /*return*/];
        });
    });
}
function modelsAliasesAddCommand(aliasRaw, modelRaw, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var alias, resolved, _updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    alias = (0, shared_js_1.normalizeAlias)(aliasRaw);
                    resolved = (0, shared_js_1.resolveModelTarget)({ raw: modelRaw, cfg: (0, config_js_1.loadConfig)() });
                    return [4 /*yield*/, (0, shared_js_1.updateConfig)(function (cfg) {
                            var _a, _b, _c, _d, _e;
                            var modelKey = "".concat(resolved.provider, "/").concat(resolved.model);
                            var nextModels = __assign({}, (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models);
                            for (var _i = 0, _f = Object.entries(nextModels); _i < _f.length; _i++) {
                                var _g = _f[_i], key = _g[0], entry = _g[1];
                                var existing_1 = (_c = entry === null || entry === void 0 ? void 0 : entry.alias) === null || _c === void 0 ? void 0 : _c.trim();
                                if (existing_1 && existing_1 === alias && key !== modelKey) {
                                    throw new Error("Alias ".concat(alias, " already points to ").concat(key, "."));
                                }
                            }
                            var existing = (_d = nextModels[modelKey]) !== null && _d !== void 0 ? _d : {};
                            nextModels[modelKey] = __assign(__assign({}, existing), { alias: alias });
                            return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_e = cfg.agents) === null || _e === void 0 ? void 0 : _e.defaults), { models: nextModels }) }) });
                        })];
                case 1:
                    _updated = _a.sent();
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    runtime.log("Alias ".concat(alias, " -> ").concat(resolved.provider, "/").concat(resolved.model));
                    return [2 /*return*/];
            }
        });
    });
}
function modelsAliasesRemoveCommand(aliasRaw, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var alias, updated;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    alias = (0, shared_js_1.normalizeAlias)(aliasRaw);
                    return [4 /*yield*/, (0, shared_js_1.updateConfig)(function (cfg) {
                            var _a, _b, _c, _d;
                            var nextModels = __assign({}, (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models);
                            var found = false;
                            for (var _i = 0, _e = Object.entries(nextModels); _i < _e.length; _i++) {
                                var _f = _e[_i], key = _f[0], entry = _f[1];
                                if (((_c = entry === null || entry === void 0 ? void 0 : entry.alias) === null || _c === void 0 ? void 0 : _c.trim()) === alias) {
                                    nextModels[key] = __assign(__assign({}, entry), { alias: undefined });
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                throw new Error("Alias not found: ".concat(alias));
                            }
                            return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_d = cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults), { models: nextModels }) }) });
                        })];
                case 1:
                    updated = _c.sent();
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    if (!((_b = (_a = updated.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models) ||
                        Object.values(updated.agents.defaults.models).every(function (entry) { var _a; return !((_a = entry === null || entry === void 0 ? void 0 : entry.alias) === null || _a === void 0 ? void 0 : _a.trim()); })) {
                        runtime.log("No aliases configured.");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
