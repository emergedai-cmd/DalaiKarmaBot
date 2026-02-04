"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAge = formatAge;
exports.parsePairingList = parsePairingList;
exports.parseNodeList = parseNodeList;
exports.formatPermissions = formatPermissions;
function formatAge(msAgo) {
    var s = Math.max(0, Math.floor(msAgo / 1000));
    if (s < 60) {
        return "".concat(s, "s");
    }
    var m = Math.floor(s / 60);
    if (m < 60) {
        return "".concat(m, "m");
    }
    var h = Math.floor(m / 60);
    if (h < 24) {
        return "".concat(h, "h");
    }
    var d = Math.floor(h / 24);
    return "".concat(d, "d");
}
function parsePairingList(value) {
    var obj = typeof value === "object" && value !== null ? value : {};
    var pending = Array.isArray(obj.pending) ? obj.pending : [];
    var paired = Array.isArray(obj.paired) ? obj.paired : [];
    return { pending: pending, paired: paired };
}
function parseNodeList(value) {
    var obj = typeof value === "object" && value !== null ? value : {};
    return Array.isArray(obj.nodes) ? obj.nodes : [];
}
function formatPermissions(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
        return null;
    }
    var entries = Object.entries(raw)
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        return [String(key).trim(), value === true];
    })
        .filter(function (_a) {
        var key = _a[0];
        return key.length > 0;
    })
        .toSorted(function (a, b) { return a[0].localeCompare(b[0]); });
    if (entries.length === 0) {
        return null;
    }
    var parts = entries.map(function (_a) {
        var key = _a[0], granted = _a[1];
        return "".concat(key, "=").concat(granted ? "yes" : "no");
    });
    return "[".concat(parts.join(", "), "]");
}
