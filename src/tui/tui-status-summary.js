"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatStatusSummary = formatStatusSummary;
var channel_summary_js_1 = require("../infra/channel-summary.js");
var usage_format_js_1 = require("../utils/usage-format.js");
var tui_formatters_js_1 = require("./tui-formatters.js");
function formatStatusSummary(summary) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    var lines = [];
    lines.push("Gateway status");
    if (!summary.linkChannel) {
        lines.push("Link channel: unknown");
    }
    else {
        var linkLabel = (_a = summary.linkChannel.label) !== null && _a !== void 0 ? _a : "Link channel";
        var linked = summary.linkChannel.linked === true;
        var authAge = linked && typeof summary.linkChannel.authAgeMs === "number"
            ? " (last refreshed ".concat((0, channel_summary_js_1.formatAge)(summary.linkChannel.authAgeMs), ")")
            : "";
        lines.push("".concat(linkLabel, ": ").concat(linked ? "linked" : "not linked").concat(authAge));
    }
    var providerSummary = Array.isArray(summary.providerSummary) ? summary.providerSummary : [];
    if (providerSummary.length > 0) {
        lines.push("");
        lines.push("System:");
        for (var _i = 0, providerSummary_1 = providerSummary; _i < providerSummary_1.length; _i++) {
            var line = providerSummary_1[_i];
            lines.push("  ".concat(line));
        }
    }
    var heartbeatAgents = (_c = (_b = summary.heartbeat) === null || _b === void 0 ? void 0 : _b.agents) !== null && _c !== void 0 ? _c : [];
    if (heartbeatAgents.length > 0) {
        var heartbeatParts = heartbeatAgents.map(function (agent) {
            var _a, _b;
            var agentId = (_a = agent.agentId) !== null && _a !== void 0 ? _a : "unknown";
            if (!agent.enabled || !agent.everyMs) {
                return "disabled (".concat(agentId, ")");
            }
            return "".concat((_b = agent.every) !== null && _b !== void 0 ? _b : "unknown", " (").concat(agentId, ")");
        });
        lines.push("");
        lines.push("Heartbeat: ".concat(heartbeatParts.join(", ")));
    }
    var sessionPaths = (_e = (_d = summary.sessions) === null || _d === void 0 ? void 0 : _d.paths) !== null && _e !== void 0 ? _e : [];
    if (sessionPaths.length === 1) {
        lines.push("Session store: ".concat(sessionPaths[0]));
    }
    else if (sessionPaths.length > 1) {
        lines.push("Session stores: ".concat(sessionPaths.length));
    }
    var defaults = (_f = summary.sessions) === null || _f === void 0 ? void 0 : _f.defaults;
    var defaultModel = (_g = defaults === null || defaults === void 0 ? void 0 : defaults.model) !== null && _g !== void 0 ? _g : "unknown";
    var defaultCtx = typeof (defaults === null || defaults === void 0 ? void 0 : defaults.contextTokens) === "number"
        ? " (".concat((0, usage_format_js_1.formatTokenCount)(defaults.contextTokens), " ctx)")
        : "";
    lines.push("Default model: ".concat(defaultModel).concat(defaultCtx));
    var sessionCount = (_j = (_h = summary.sessions) === null || _h === void 0 ? void 0 : _h.count) !== null && _j !== void 0 ? _j : 0;
    lines.push("Active sessions: ".concat(sessionCount));
    var recent = Array.isArray((_k = summary.sessions) === null || _k === void 0 ? void 0 : _k.recent) ? (_l = summary.sessions) === null || _l === void 0 ? void 0 : _l.recent : [];
    if (recent.length > 0) {
        lines.push("Recent sessions:");
        for (var _t = 0, recent_1 = recent; _t < recent_1.length; _t++) {
            var entry = recent_1[_t];
            var ageLabel = typeof entry.age === "number" ? (0, channel_summary_js_1.formatAge)(entry.age) : "no activity";
            var model = (_m = entry.model) !== null && _m !== void 0 ? _m : "unknown";
            var usage = (0, tui_formatters_js_1.formatContextUsageLine)({
                total: (_o = entry.totalTokens) !== null && _o !== void 0 ? _o : null,
                context: (_p = entry.contextTokens) !== null && _p !== void 0 ? _p : null,
                remaining: (_q = entry.remainingTokens) !== null && _q !== void 0 ? _q : null,
                percent: (_r = entry.percentUsed) !== null && _r !== void 0 ? _r : null,
            });
            var flags = ((_s = entry.flags) === null || _s === void 0 ? void 0 : _s.length) ? " | flags: ".concat(entry.flags.join(", ")) : "";
            lines.push("- ".concat(entry.key).concat(entry.kind ? " [".concat(entry.kind, "]") : "", " | ").concat(ageLabel, " | model ").concat(model, " | ").concat(usage).concat(flags));
        }
    }
    var queued = Array.isArray(summary.queuedSystemEvents) ? summary.queuedSystemEvents : [];
    if (queued.length > 0) {
        var preview = queued.slice(0, 3).join(" | ");
        lines.push("Queued system events (".concat(queued.length, "): ").concat(preview));
    }
    return lines;
}
