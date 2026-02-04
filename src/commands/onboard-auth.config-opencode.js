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
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyOpencodeZenProviderConfig = applyOpencodeZenProviderConfig;
exports.applyOpencodeZenConfig = applyOpencodeZenConfig;
var opencode_zen_models_js_1 = require("../agents/opencode-zen-models.js");
function applyOpencodeZenProviderConfig(cfg) {
    var _a, _b, _c, _d, _e;
    // Use the built-in opencode provider from pi-ai; only seed the allowlist alias.
    var models = __assign({}, (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models);
    models[opencode_zen_models_js_1.OPENCODE_ZEN_DEFAULT_MODEL_REF] = __assign(__assign({}, models[opencode_zen_models_js_1.OPENCODE_ZEN_DEFAULT_MODEL_REF]), { alias: (_d = (_c = models[opencode_zen_models_js_1.OPENCODE_ZEN_DEFAULT_MODEL_REF]) === null || _c === void 0 ? void 0 : _c.alias) !== null && _d !== void 0 ? _d : "Opus" });
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_e = cfg.agents) === null || _e === void 0 ? void 0 : _e.defaults), { models: models }) }) });
}
function applyOpencodeZenConfig(cfg) {
    var _a, _b, _c;
    var next = applyOpencodeZenProviderConfig(cfg);
    return __assign(__assign({}, next), { agents: __assign(__assign({}, next.agents), { defaults: __assign(__assign({}, (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults), { model: __assign(__assign({}, (((_c = (_b = next.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.model) &&
                    "fallbacks" in next.agents.defaults.model
                    ? {
                        fallbacks: next.agents.defaults.model.fallbacks,
                    }
                    : undefined)), { primary: opencode_zen_models_js_1.OPENCODE_ZEN_DEFAULT_MODEL_REF }) }) }) });
}
