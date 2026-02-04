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
exports.GOOGLE_GEMINI_DEFAULT_MODEL = void 0;
exports.applyGoogleGeminiModelDefault = applyGoogleGeminiModelDefault;
exports.GOOGLE_GEMINI_DEFAULT_MODEL = "google/gemini-3-pro-preview";
function resolvePrimaryModel(model) {
    if (typeof model === "string") {
        return model;
    }
    if (model && typeof model === "object" && typeof model.primary === "string") {
        return model.primary;
    }
    return undefined;
}
function applyGoogleGeminiModelDefault(cfg) {
    var _a, _b, _c, _d, _e, _f;
    var current = (_c = resolvePrimaryModel((_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model)) === null || _c === void 0 ? void 0 : _c.trim();
    if (current === exports.GOOGLE_GEMINI_DEFAULT_MODEL) {
        return { next: cfg, changed: false };
    }
    return {
        next: __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_d = cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults), { model: ((_f = (_e = cfg.agents) === null || _e === void 0 ? void 0 : _e.defaults) === null || _f === void 0 ? void 0 : _f.model) && typeof cfg.agents.defaults.model === "object"
                        ? __assign(__assign({}, cfg.agents.defaults.model), { primary: exports.GOOGLE_GEMINI_DEFAULT_MODEL }) : { primary: exports.GOOGLE_GEMINI_DEFAULT_MODEL } }) }) }),
        changed: true,
    };
}
