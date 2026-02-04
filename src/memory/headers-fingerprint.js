"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fingerprintHeaderNames = fingerprintHeaderNames;
function normalizeHeaderName(name) {
    return name.trim().toLowerCase();
}
function fingerprintHeaderNames(headers) {
    if (!headers) {
        return [];
    }
    var out = [];
    for (var _i = 0, _a = Object.keys(headers); _i < _a.length; _i++) {
        var key = _a[_i];
        var normalized = normalizeHeaderName(key);
        if (!normalized) {
            continue;
        }
        out.push(normalized);
    }
    out.sort(function (a, b) { return a.localeCompare(b); });
    return out;
}
