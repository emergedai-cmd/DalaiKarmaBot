"use strict";
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
exports.isModernModelRef = isModernModelRef;
var ANTHROPIC_PREFIXES = ["claude-opus-4-5", "claude-sonnet-4-5", "claude-haiku-4-5"];
var OPENAI_MODELS = ["gpt-5.2", "gpt-5.0"];
var CODEX_MODELS = [
    "gpt-5.2",
    "gpt-5.2-codex",
    "gpt-5.1-codex",
    "gpt-5.1-codex-mini",
    "gpt-5.1-codex-max",
];
var GOOGLE_PREFIXES = ["gemini-3"];
var ZAI_PREFIXES = ["glm-4.7"];
var MINIMAX_PREFIXES = ["minimax-m2.1"];
var XAI_PREFIXES = ["grok-4"];
function matchesPrefix(id, prefixes) {
    return prefixes.some(function (prefix) { return id.startsWith(prefix); });
}
function matchesExactOrPrefix(id, values) {
    return values.some(function (value) { return id === value || id.startsWith(value); });
}
function matchesAny(id, values) {
    return values.some(function (value) { return id.includes(value); });
}
function isModernModelRef(ref) {
    var _a, _b, _c, _d;
    var provider = (_b = (_a = ref.provider) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) !== null && _b !== void 0 ? _b : "";
    var id = (_d = (_c = ref.id) === null || _c === void 0 ? void 0 : _c.trim().toLowerCase()) !== null && _d !== void 0 ? _d : "";
    if (!provider || !id) {
        return false;
    }
    if (provider === "anthropic") {
        return matchesPrefix(id, ANTHROPIC_PREFIXES);
    }
    if (provider === "openai") {
        return matchesExactOrPrefix(id, OPENAI_MODELS);
    }
    if (provider === "openai-codex") {
        return matchesExactOrPrefix(id, CODEX_MODELS);
    }
    if (provider === "google" || provider === "google-gemini-cli") {
        return matchesPrefix(id, GOOGLE_PREFIXES);
    }
    if (provider === "google-antigravity") {
        return matchesPrefix(id, GOOGLE_PREFIXES) || matchesPrefix(id, ANTHROPIC_PREFIXES);
    }
    if (provider === "zai") {
        return matchesPrefix(id, ZAI_PREFIXES);
    }
    if (provider === "minimax") {
        return matchesPrefix(id, MINIMAX_PREFIXES);
    }
    if (provider === "xai") {
        return matchesPrefix(id, XAI_PREFIXES);
    }
    if (provider === "opencode" && id.endsWith("-free")) {
        return false;
    }
    if (provider === "opencode" && id === "alpha-glm-4.7") {
        return false;
    }
    if (provider === "openrouter" || provider === "opencode") {
        return matchesAny(id, __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], ANTHROPIC_PREFIXES, true), OPENAI_MODELS, true), CODEX_MODELS, true), GOOGLE_PREFIXES, true), ZAI_PREFIXES, true), MINIMAX_PREFIXES, true), XAI_PREFIXES, true));
    }
    return false;
}
