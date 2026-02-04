"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDaemonRuntimeShort = exports.formatTokensCompact = exports.shortenText = exports.formatDuration = exports.formatAge = exports.formatKTokens = void 0;
var formatKTokens = function (value) {
    return "".concat((value / 1000).toFixed(value >= 10000 ? 0 : 1), "k");
};
exports.formatKTokens = formatKTokens;
var formatAge = function (ms) {
    if (!ms || ms < 0) {
        return "unknown";
    }
    var minutes = Math.round(ms / 60000);
    if (minutes < 1) {
        return "just now";
    }
    if (minutes < 60) {
        return "".concat(minutes, "m ago");
    }
    var hours = Math.round(minutes / 60);
    if (hours < 48) {
        return "".concat(hours, "h ago");
    }
    var days = Math.round(hours / 24);
    return "".concat(days, "d ago");
};
exports.formatAge = formatAge;
var formatDuration = function (ms) {
    if (ms == null || !Number.isFinite(ms)) {
        return "unknown";
    }
    if (ms < 1000) {
        return "".concat(Math.round(ms), "ms");
    }
    return "".concat((ms / 1000).toFixed(1), "s");
};
exports.formatDuration = formatDuration;
var shortenText = function (value, maxLen) {
    var chars = Array.from(value);
    if (chars.length <= maxLen) {
        return value;
    }
    return "".concat(chars.slice(0, Math.max(0, maxLen - 1)).join(""), "\u2026");
};
exports.shortenText = shortenText;
var formatTokensCompact = function (sess) {
    var _a;
    var used = (_a = sess.totalTokens) !== null && _a !== void 0 ? _a : 0;
    var ctx = sess.contextTokens;
    if (!ctx) {
        return "".concat((0, exports.formatKTokens)(used), " used");
    }
    var pctLabel = sess.percentUsed != null ? "".concat(sess.percentUsed, "%") : "?%";
    return "".concat((0, exports.formatKTokens)(used), "/").concat((0, exports.formatKTokens)(ctx), " (").concat(pctLabel, ")");
};
exports.formatTokensCompact = formatTokensCompact;
var formatDaemonRuntimeShort = function (runtime) {
    var _a, _b;
    if (!runtime) {
        return null;
    }
    var status = (_a = runtime.status) !== null && _a !== void 0 ? _a : "unknown";
    var details = [];
    if (runtime.pid) {
        details.push("pid ".concat(runtime.pid));
    }
    if (runtime.state && runtime.state.toLowerCase() !== status) {
        details.push("state ".concat(runtime.state));
    }
    var detail = ((_b = runtime.detail) === null || _b === void 0 ? void 0 : _b.replace(/\s+/g, " ").trim()) || "";
    var noisyLaunchctlDetail = runtime.missingUnit === true && detail.toLowerCase().includes("could not find service");
    if (detail && !noisyLaunchctlDetail) {
        details.push(detail);
    }
    return details.length > 0 ? "".concat(status, " (").concat(details.join(", "), ")") : status;
};
exports.formatDaemonRuntimeShort = formatDaemonRuntimeShort;
