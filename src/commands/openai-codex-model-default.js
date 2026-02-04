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
exports.OPENAI_CODEX_DEFAULT_MODEL = void 0;
exports.applyOpenAICodexModelDefault = applyOpenAICodexModelDefault;
exports.OPENAI_CODEX_DEFAULT_MODEL = "openai-codex/gpt-5.2";
function shouldSetOpenAICodexModel(model) {
    var trimmed = model === null || model === void 0 ? void 0 : model.trim();
    if (!trimmed) {
        return true;
    }
    var normalized = trimmed.toLowerCase();
    if (normalized.startsWith("openai-codex/")) {
        return false;
    }
    if (normalized.startsWith("openai/")) {
        return true;
    }
    return normalized === "gpt" || normalized === "gpt-mini";
}
function resolvePrimaryModel(model) {
    if (typeof model === "string") {
        return model;
    }
    if (model && typeof model === "object" && typeof model.primary === "string") {
        return model.primary;
    }
    return undefined;
}
function applyOpenAICodexModelDefault(cfg) {
    var _a, _b, _c, _d, _e;
    var current = resolvePrimaryModel((_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model);
    if (!shouldSetOpenAICodexModel(current)) {
        return { next: cfg, changed: false };
    }
    return {
        next: __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_c = cfg.agents) === null || _c === void 0 ? void 0 : _c.defaults), { model: ((_e = (_d = cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults) === null || _e === void 0 ? void 0 : _e.model) && typeof cfg.agents.defaults.model === "object"
                        ? __assign(__assign({}, cfg.agents.defaults.model), { primary: exports.OPENAI_CODEX_DEFAULT_MODEL }) : { primary: exports.OPENAI_CODEX_DEFAULT_MODEL } }) }) }),
        changed: true,
    };
}
