"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asString = asString;
exports.isRecord = isRecord;
exports.formatMatchMetadata = formatMatchMetadata;
exports.appendMatchMetadata = appendMatchMetadata;
function asString(value) {
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}
function isRecord(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function formatMatchMetadata(params) {
    var matchKey = typeof params.matchKey === "string"
        ? params.matchKey
        : typeof params.matchKey === "number"
            ? String(params.matchKey)
            : undefined;
    var matchSource = asString(params.matchSource);
    var parts = [
        matchKey ? "matchKey=".concat(matchKey) : null,
        matchSource ? "matchSource=".concat(matchSource) : null,
    ].filter(function (entry) { return Boolean(entry); });
    return parts.length > 0 ? parts.join(" ") : undefined;
}
function appendMatchMetadata(message, params) {
    var meta = formatMatchMetadata(params);
    return meta ? "".concat(message, " (").concat(meta, ")") : message;
}
