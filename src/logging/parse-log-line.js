"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLogLine = parseLogLine;
function extractMessage(value) {
    var parts = [];
    for (var _i = 0, _a = Object.keys(value); _i < _a.length; _i++) {
        var key = _a[_i];
        if (!/^\d+$/.test(key)) {
            continue;
        }
        var item = value[key];
        if (typeof item === "string") {
            parts.push(item);
        }
        else if (item != null) {
            parts.push(JSON.stringify(item));
        }
    }
    return parts.join(" ");
}
function parseMetaName(raw) {
    if (typeof raw !== "string") {
        return {};
    }
    try {
        var parsed = JSON.parse(raw);
        return {
            subsystem: typeof parsed.subsystem === "string" ? parsed.subsystem : undefined,
            module: typeof parsed.module === "string" ? parsed.module : undefined,
        };
    }
    catch (_a) {
        return {};
    }
}
function parseLogLine(raw) {
    try {
        var parsed = JSON.parse(raw);
        var meta = parsed._meta;
        var nameMeta = parseMetaName(meta === null || meta === void 0 ? void 0 : meta.name);
        var levelRaw = typeof (meta === null || meta === void 0 ? void 0 : meta.logLevelName) === "string" ? meta.logLevelName : undefined;
        return {
            time: typeof parsed.time === "string"
                ? parsed.time
                : typeof (meta === null || meta === void 0 ? void 0 : meta.date) === "string"
                    ? meta.date
                    : undefined,
            level: levelRaw ? levelRaw.toLowerCase() : undefined,
            subsystem: nameMeta.subsystem,
            module: nameMeta.module,
            message: extractMessage(parsed),
            raw: raw,
        };
    }
    catch (_a) {
        return null;
    }
}
