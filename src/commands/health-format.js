"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatHealthCheckFailure = formatHealthCheckFailure;
var theme_js_1 = require("../terminal/theme.js");
var formatKv = function (line, rich) {
    var idx = line.indexOf(": ");
    if (idx <= 0) {
        return (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, line);
    }
    var key = line.slice(0, idx);
    var value = line.slice(idx + 2);
    var valueColor = key === "Gateway target" || key === "Config"
        ? theme_js_1.theme.command
        : key === "Source"
            ? theme_js_1.theme.muted
            : theme_js_1.theme.info;
    return "".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "".concat(key, ":")), " ").concat((0, theme_js_1.colorize)(rich, valueColor, value));
};
function formatHealthCheckFailure(err, opts) {
    var _a;
    if (opts === void 0) { opts = {}; }
    var rich = (_a = opts.rich) !== null && _a !== void 0 ? _a : (0, theme_js_1.isRich)();
    var raw = String(err);
    var message = err instanceof Error ? err.message : raw;
    if (!rich) {
        return "Health check failed: ".concat(raw);
    }
    var lines = message
        .split("\n")
        .map(function (l) { return l.trimEnd(); })
        .filter(Boolean);
    var detailsIdx = lines.findIndex(function (l) { return l.startsWith("Gateway target: "); });
    var summaryLines = (detailsIdx >= 0 ? lines.slice(0, detailsIdx) : lines)
        .map(function (l) { return l.trim(); })
        .filter(Boolean);
    var detailLines = detailsIdx >= 0 ? lines.slice(detailsIdx) : [];
    var summary = summaryLines.length > 0 ? summaryLines.join(" ") : message;
    var header = (0, theme_js_1.colorize)(rich, theme_js_1.theme.error.bold, "Health check failed");
    var out = ["".concat(header, ": ").concat(summary)];
    for (var _i = 0, detailLines_1 = detailLines; _i < detailLines_1.length; _i++) {
        var line = detailLines_1[_i];
        out.push("  ".concat(formatKv(line, rich)));
    }
    return out.join("\n");
}
