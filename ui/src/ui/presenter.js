"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPresenceSummary = formatPresenceSummary;
exports.formatPresenceAge = formatPresenceAge;
exports.formatNextRun = formatNextRun;
exports.formatSessionTokens = formatSessionTokens;
exports.formatEventPayload = formatEventPayload;
exports.formatCronState = formatCronState;
exports.formatCronSchedule = formatCronSchedule;
exports.formatCronPayload = formatCronPayload;
var format_1 = require("./format");
function formatPresenceSummary(entry) {
    var _a, _b, _c;
    var host = (_a = entry.host) !== null && _a !== void 0 ? _a : "unknown";
    var ip = entry.ip ? "(".concat(entry.ip, ")") : "";
    var mode = (_b = entry.mode) !== null && _b !== void 0 ? _b : "";
    var version = (_c = entry.version) !== null && _c !== void 0 ? _c : "";
    return "".concat(host, " ").concat(ip, " ").concat(mode, " ").concat(version).trim();
}
function formatPresenceAge(entry) {
    var _a;
    var ts = (_a = entry.ts) !== null && _a !== void 0 ? _a : null;
    return ts ? (0, format_1.formatAgo)(ts) : "n/a";
}
function formatNextRun(ms) {
    if (!ms) {
        return "n/a";
    }
    return "".concat((0, format_1.formatMs)(ms), " (").concat((0, format_1.formatAgo)(ms), ")");
}
function formatSessionTokens(row) {
    var _a, _b;
    if (row.totalTokens == null) {
        return "n/a";
    }
    var total = (_a = row.totalTokens) !== null && _a !== void 0 ? _a : 0;
    var ctx = (_b = row.contextTokens) !== null && _b !== void 0 ? _b : 0;
    return ctx ? "".concat(total, " / ").concat(ctx) : String(total);
}
function formatEventPayload(payload) {
    if (payload == null) {
        return "";
    }
    try {
        return JSON.stringify(payload, null, 2);
    }
    catch (_a) {
        // oxlint-disable typescript/no-base-to-string
        return String(payload);
    }
}
function formatCronState(job) {
    var _a, _b;
    var state = (_a = job.state) !== null && _a !== void 0 ? _a : {};
    var next = state.nextRunAtMs ? (0, format_1.formatMs)(state.nextRunAtMs) : "n/a";
    var last = state.lastRunAtMs ? (0, format_1.formatMs)(state.lastRunAtMs) : "n/a";
    var status = (_b = state.lastStatus) !== null && _b !== void 0 ? _b : "n/a";
    return "".concat(status, " \u00B7 next ").concat(next, " \u00B7 last ").concat(last);
}
function formatCronSchedule(job) {
    var s = job.schedule;
    if (s.kind === "at") {
        return "At ".concat((0, format_1.formatMs)(s.atMs));
    }
    if (s.kind === "every") {
        return "Every ".concat((0, format_1.formatDurationMs)(s.everyMs));
    }
    return "Cron ".concat(s.expr).concat(s.tz ? " (".concat(s.tz, ")") : "");
}
function formatCronPayload(job) {
    var p = job.payload;
    if (p.kind === "systemEvent") {
        return "System: ".concat(p.text);
    }
    return "Agent: ".concat(p.message);
}
