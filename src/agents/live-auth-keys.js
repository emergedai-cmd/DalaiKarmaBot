"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectAnthropicApiKeys = collectAnthropicApiKeys;
exports.isAnthropicRateLimitError = isAnthropicRateLimitError;
exports.isAnthropicBillingError = isAnthropicBillingError;
var KEY_SPLIT_RE = /[\s,;]+/g;
function parseKeyList(raw) {
    if (!raw) {
        return [];
    }
    return raw
        .split(KEY_SPLIT_RE)
        .map(function (value) { return value.trim(); })
        .filter(Boolean);
}
function collectEnvPrefixedKeys(prefix) {
    var keys = [];
    for (var _i = 0, _a = Object.entries(process.env); _i < _a.length; _i++) {
        var _b = _a[_i], name_1 = _b[0], value = _b[1];
        if (!name_1.startsWith(prefix)) {
            continue;
        }
        var trimmed = value === null || value === void 0 ? void 0 : value.trim();
        if (!trimmed) {
            continue;
        }
        keys.push(trimmed);
    }
    return keys;
}
function collectAnthropicApiKeys() {
    var _a, _b;
    var forcedSingle = (_a = process.env.OPENCLAW_LIVE_ANTHROPIC_KEY) === null || _a === void 0 ? void 0 : _a.trim();
    if (forcedSingle) {
        return [forcedSingle];
    }
    var fromList = parseKeyList(process.env.OPENCLAW_LIVE_ANTHROPIC_KEYS);
    var fromEnv = collectEnvPrefixedKeys("ANTHROPIC_API_KEY");
    var primary = (_b = process.env.ANTHROPIC_API_KEY) === null || _b === void 0 ? void 0 : _b.trim();
    var seen = new Set();
    var add = function (value) {
        if (!value) {
            return;
        }
        if (seen.has(value)) {
            return;
        }
        seen.add(value);
    };
    for (var _i = 0, fromList_1 = fromList; _i < fromList_1.length; _i++) {
        var value = fromList_1[_i];
        add(value);
    }
    if (primary) {
        add(primary);
    }
    for (var _c = 0, fromEnv_1 = fromEnv; _c < fromEnv_1.length; _c++) {
        var value = fromEnv_1[_c];
        add(value);
    }
    return Array.from(seen);
}
function isAnthropicRateLimitError(message) {
    var lower = message.toLowerCase();
    if (lower.includes("rate_limit")) {
        return true;
    }
    if (lower.includes("rate limit")) {
        return true;
    }
    if (lower.includes("429")) {
        return true;
    }
    return false;
}
function isAnthropicBillingError(message) {
    var lower = message.toLowerCase();
    if (lower.includes("credit balance")) {
        return true;
    }
    if (lower.includes("insufficient credit")) {
        return true;
    }
    if (lower.includes("insufficient credits")) {
        return true;
    }
    if (lower.includes("payment required")) {
        return true;
    }
    if (lower.includes("billing") && lower.includes("disabled")) {
        return true;
    }
    if (lower.includes("402")) {
        return true;
    }
    return false;
}
