"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateApiKeyInput = void 0;
exports.normalizeApiKeyInput = normalizeApiKeyInput;
exports.formatApiKeyPreview = formatApiKeyPreview;
var DEFAULT_KEY_PREVIEW = { head: 4, tail: 4 };
function normalizeApiKeyInput(raw) {
    var trimmed = String(raw !== null && raw !== void 0 ? raw : "").trim();
    if (!trimmed) {
        return "";
    }
    // Handle shell-style assignments: export KEY="value" or KEY=value
    var assignmentMatch = trimmed.match(/^(?:export\s+)?[A-Za-z_][A-Za-z0-9_]*\s*=\s*(.+)$/);
    var valuePart = assignmentMatch ? assignmentMatch[1].trim() : trimmed;
    var unquoted = valuePart.length >= 2 &&
        ((valuePart.startsWith('"') && valuePart.endsWith('"')) ||
            (valuePart.startsWith("'") && valuePart.endsWith("'")) ||
            (valuePart.startsWith("`") && valuePart.endsWith("`")))
        ? valuePart.slice(1, -1)
        : valuePart;
    var withoutSemicolon = unquoted.endsWith(";") ? unquoted.slice(0, -1) : unquoted;
    return withoutSemicolon.trim();
}
var validateApiKeyInput = function (value) {
    return normalizeApiKeyInput(value).length > 0 ? undefined : "Required";
};
exports.validateApiKeyInput = validateApiKeyInput;
function formatApiKeyPreview(raw, opts) {
    var _a, _b;
    if (opts === void 0) { opts = {}; }
    var trimmed = raw.trim();
    if (!trimmed) {
        return "…";
    }
    var head = (_a = opts.head) !== null && _a !== void 0 ? _a : DEFAULT_KEY_PREVIEW.head;
    var tail = (_b = opts.tail) !== null && _b !== void 0 ? _b : DEFAULT_KEY_PREVIEW.tail;
    if (trimmed.length <= head + tail) {
        var shortHead = Math.min(2, trimmed.length);
        var shortTail = Math.min(2, trimmed.length - shortHead);
        if (shortTail <= 0) {
            return "".concat(trimmed.slice(0, shortHead), "\u2026");
        }
        return "".concat(trimmed.slice(0, shortHead), "\u2026").concat(trimmed.slice(-shortTail));
    }
    return "".concat(trimmed.slice(0, head), "\u2026").concat(trimmed.slice(-tail));
}
