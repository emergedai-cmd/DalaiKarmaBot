"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveConfiguredEntries = resolveConfiguredEntries;
var model_selection_js_1 = require("../../agents/model-selection.js");
var shared_js_1 = require("./shared.js");
function resolveConfiguredEntries(cfg) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var resolvedDefault = (0, model_selection_js_1.resolveConfiguredModelRef)({
        cfg: cfg,
        defaultProvider: shared_js_1.DEFAULT_PROVIDER,
        defaultModel: shared_js_1.DEFAULT_MODEL,
    });
    var aliasIndex = (0, model_selection_js_1.buildModelAliasIndex)({
        cfg: cfg,
        defaultProvider: shared_js_1.DEFAULT_PROVIDER,
    });
    var order = [];
    var tagsByKey = new Map();
    var aliasesByKey = new Map();
    for (var _i = 0, _m = aliasIndex.byKey.entries(); _i < _m.length; _i++) {
        var _o = _m[_i], key = _o[0], aliases = _o[1];
        aliasesByKey.set(key, aliases);
    }
    var addEntry = function (ref, tag) {
        var _a;
        var key = (0, shared_js_1.modelKey)(ref.provider, ref.model);
        if (!tagsByKey.has(key)) {
            tagsByKey.set(key, new Set());
            order.push(key);
        }
        (_a = tagsByKey.get(key)) === null || _a === void 0 ? void 0 : _a.add(tag);
    };
    addEntry(resolvedDefault, "default");
    var modelConfig = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model;
    var imageModelConfig = (_d = (_c = cfg.agents) === null || _c === void 0 ? void 0 : _c.defaults) === null || _d === void 0 ? void 0 : _d.imageModel;
    var modelFallbacks = typeof modelConfig === "object" ? ((_e = modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.fallbacks) !== null && _e !== void 0 ? _e : []) : [];
    var imageFallbacks = typeof imageModelConfig === "object" ? ((_f = imageModelConfig === null || imageModelConfig === void 0 ? void 0 : imageModelConfig.fallbacks) !== null && _f !== void 0 ? _f : []) : [];
    var imagePrimary = (_h = (_g = imageModelConfig === null || imageModelConfig === void 0 ? void 0 : imageModelConfig.primary) === null || _g === void 0 ? void 0 : _g.trim()) !== null && _h !== void 0 ? _h : "";
    modelFallbacks.forEach(function (raw, idx) {
        var resolved = (0, model_selection_js_1.resolveModelRefFromString)({
            raw: String(raw !== null && raw !== void 0 ? raw : ""),
            defaultProvider: shared_js_1.DEFAULT_PROVIDER,
            aliasIndex: aliasIndex,
        });
        if (!resolved) {
            return;
        }
        addEntry(resolved.ref, "fallback#".concat(idx + 1));
    });
    if (imagePrimary) {
        var resolved = (0, model_selection_js_1.resolveModelRefFromString)({
            raw: imagePrimary,
            defaultProvider: shared_js_1.DEFAULT_PROVIDER,
            aliasIndex: aliasIndex,
        });
        if (resolved) {
            addEntry(resolved.ref, "image");
        }
    }
    imageFallbacks.forEach(function (raw, idx) {
        var resolved = (0, model_selection_js_1.resolveModelRefFromString)({
            raw: String(raw !== null && raw !== void 0 ? raw : ""),
            defaultProvider: shared_js_1.DEFAULT_PROVIDER,
            aliasIndex: aliasIndex,
        });
        if (!resolved) {
            return;
        }
        addEntry(resolved.ref, "img-fallback#".concat(idx + 1));
    });
    for (var _p = 0, _q = Object.keys((_l = (_k = (_j = cfg.agents) === null || _j === void 0 ? void 0 : _j.defaults) === null || _k === void 0 ? void 0 : _k.models) !== null && _l !== void 0 ? _l : {}); _p < _q.length; _p++) {
        var key = _q[_p];
        var parsed = (0, model_selection_js_1.parseModelRef)(String(key !== null && key !== void 0 ? key : ""), shared_js_1.DEFAULT_PROVIDER);
        if (!parsed) {
            continue;
        }
        addEntry(parsed, "configured");
    }
    var entries = order.map(function (key) {
        var _a, _b;
        var slash = key.indexOf("/");
        var provider = slash === -1 ? key : key.slice(0, slash);
        var model = slash === -1 ? "" : key.slice(slash + 1);
        return {
            key: key,
            ref: { provider: provider, model: model },
            tags: (_a = tagsByKey.get(key)) !== null && _a !== void 0 ? _a : new Set(),
            aliases: (_b = aliasesByKey.get(key)) !== null && _b !== void 0 ? _b : [],
        };
    });
    return { entries: entries };
}
