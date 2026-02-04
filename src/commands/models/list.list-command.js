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
exports.modelsListCommand = modelsListCommand;
var auth_profiles_js_1 = require("../../agents/auth-profiles.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var config_js_1 = require("../../config/config.js");
var list_configured_js_1 = require("./list.configured.js");
var list_registry_js_1 = require("./list.registry.js");
var list_table_js_1 = require("./list.table.js");
var shared_js_1 = require("./shared.js");
function modelsListCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, authStore, providerFilter, models, availableKeys, loaded, err_1, modelByKey, entries, configuredByKey, rows, isLocalBaseUrl, sorted, _i, sorted_1, model, key, configured, _a, entries_1, entry, model;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, shared_js_1.ensureFlagCompatibility)(opts);
                    cfg = (0, config_js_1.loadConfig)();
                    authStore = (0, auth_profiles_js_1.ensureAuthProfileStore)();
                    providerFilter = (function () {
                        var _a, _b;
                        var raw = (_a = opts.provider) === null || _a === void 0 ? void 0 : _a.trim();
                        if (!raw) {
                            return undefined;
                        }
                        var parsed = (0, model_selection_js_1.parseModelRef)("".concat(raw, "/_"), shared_js_1.DEFAULT_PROVIDER);
                        return (_b = parsed === null || parsed === void 0 ? void 0 : parsed.provider) !== null && _b !== void 0 ? _b : raw.toLowerCase();
                    })();
                    models = [];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, list_registry_js_1.loadModelRegistry)(cfg)];
                case 2:
                    loaded = _c.sent();
                    models = loaded.models;
                    availableKeys = loaded.availableKeys;
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _c.sent();
                    runtime.error("Model registry unavailable: ".concat(String(err_1)));
                    return [3 /*break*/, 4];
                case 4:
                    modelByKey = new Map(models.map(function (model) { return [(0, shared_js_1.modelKey)(model.provider, model.id), model]; }));
                    entries = (0, list_configured_js_1.resolveConfiguredEntries)(cfg).entries;
                    configuredByKey = new Map(entries.map(function (entry) { return [entry.key, entry]; }));
                    rows = [];
                    isLocalBaseUrl = function (baseUrl) {
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
                    if (opts.all) {
                        sorted = __spreadArray([], models, true).toSorted(function (a, b) {
                            var p = a.provider.localeCompare(b.provider);
                            if (p !== 0) {
                                return p;
                            }
                            return a.id.localeCompare(b.id);
                        });
                        for (_i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
                            model = sorted_1[_i];
                            if (providerFilter && model.provider.toLowerCase() !== providerFilter) {
                                continue;
                            }
                            if (opts.local && !isLocalBaseUrl(model.baseUrl)) {
                                continue;
                            }
                            key = (0, shared_js_1.modelKey)(model.provider, model.id);
                            configured = configuredByKey.get(key);
                            rows.push((0, list_registry_js_1.toModelRow)({
                                model: model,
                                key: key,
                                tags: configured ? Array.from(configured.tags) : [],
                                aliases: (_b = configured === null || configured === void 0 ? void 0 : configured.aliases) !== null && _b !== void 0 ? _b : [],
                                availableKeys: availableKeys,
                                cfg: cfg,
                                authStore: authStore,
                            }));
                        }
                    }
                    else {
                        for (_a = 0, entries_1 = entries; _a < entries_1.length; _a++) {
                            entry = entries_1[_a];
                            if (providerFilter && entry.ref.provider.toLowerCase() !== providerFilter) {
                                continue;
                            }
                            model = modelByKey.get(entry.key);
                            if (opts.local && model && !isLocalBaseUrl(model.baseUrl)) {
                                continue;
                            }
                            if (opts.local && !model) {
                                continue;
                            }
                            rows.push((0, list_registry_js_1.toModelRow)({
                                model: model,
                                key: entry.key,
                                tags: Array.from(entry.tags),
                                aliases: entry.aliases,
                                availableKeys: availableKeys,
                                cfg: cfg,
                                authStore: authStore,
                            }));
                        }
                    }
                    if (rows.length === 0) {
                        runtime.log("No models found.");
                        return [2 /*return*/];
                    }
                    (0, list_table_js_1.printModelTable)(rows, runtime, opts);
                    return [2 /*return*/];
            }
        });
    });
}
