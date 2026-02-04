"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TOKEN_PROFILE_NAME = exports.ANTHROPIC_SETUP_TOKEN_MIN_LENGTH = exports.ANTHROPIC_SETUP_TOKEN_PREFIX = void 0;
exports.normalizeTokenProfileName = normalizeTokenProfileName;
exports.buildTokenProfileId = buildTokenProfileId;
exports.validateAnthropicSetupToken = validateAnthropicSetupToken;
var model_selection_js_1 = require("../agents/model-selection.js");
exports.ANTHROPIC_SETUP_TOKEN_PREFIX = "sk-ant-oat01-";
exports.ANTHROPIC_SETUP_TOKEN_MIN_LENGTH = 80;
exports.DEFAULT_TOKEN_PROFILE_NAME = "default";
function normalizeTokenProfileName(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return exports.DEFAULT_TOKEN_PROFILE_NAME;
    }
    var slug = trimmed
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
    return slug || exports.DEFAULT_TOKEN_PROFILE_NAME;
}
function buildTokenProfileId(params) {
    var provider = (0, model_selection_js_1.normalizeProviderId)(params.provider);
    var name = normalizeTokenProfileName(params.name);
    return "".concat(provider, ":").concat(name);
}
function validateAnthropicSetupToken(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return "Required";
    }
    if (!trimmed.startsWith(exports.ANTHROPIC_SETUP_TOKEN_PREFIX)) {
        return "Expected token starting with ".concat(exports.ANTHROPIC_SETUP_TOKEN_PREFIX);
    }
    if (trimmed.length < exports.ANTHROPIC_SETUP_TOKEN_MIN_LENGTH) {
        return "Token looks too short; paste the full setup-token";
    }
    return undefined;
}
