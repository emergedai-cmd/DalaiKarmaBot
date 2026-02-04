"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortId = shortId;
exports.formatForLog = formatForLog;
exports.summarizeAgentEventForWsLog = summarizeAgentEventForWsLog;
exports.logWs = logWs;
var chalk_1 = require("chalk");
var globals_js_1 = require("../globals.js");
var console_js_1 = require("../logging/console.js");
var redact_js_1 = require("../logging/redact.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var session_key_js_1 = require("../routing/session-key.js");
var ws_logging_js_1 = require("./ws-logging.js");
var LOG_VALUE_LIMIT = 240;
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var WS_LOG_REDACT_OPTIONS = {
    mode: "tools",
    patterns: (0, redact_js_1.getDefaultRedactPatterns)(),
};
var wsInflightCompact = new Map();
var wsLastCompactConnId;
var wsInflightOptimized = new Map();
var wsInflightSince = new Map();
var wsLog = (0, subsystem_js_1.createSubsystemLogger)("gateway/ws");
function shortId(value) {
    var s = value.trim();
    if (UUID_RE.test(s)) {
        return "".concat(s.slice(0, 8), "\u2026").concat(s.slice(-4));
    }
    if (s.length <= 24) {
        return s;
    }
    return "".concat(s.slice(0, 12), "\u2026").concat(s.slice(-4));
}
function formatForLog(value) {
    try {
        if (value instanceof Error) {
            var parts = [];
            if (value.name) {
                parts.push(value.name);
            }
            if (value.message) {
                parts.push(value.message);
            }
            var code = "code" in value && (typeof value.code === "string" || typeof value.code === "number")
                ? String(value.code)
                : "";
            if (code) {
                parts.push("code=".concat(code));
            }
            var combined = parts.filter(Boolean).join(": ").trim();
            if (combined) {
                return combined.length > LOG_VALUE_LIMIT
                    ? "".concat(combined.slice(0, LOG_VALUE_LIMIT), "...")
                    : combined;
            }
        }
        if (value && typeof value === "object") {
            var rec = value;
            if (typeof rec.message === "string" && rec.message.trim()) {
                var name_1 = typeof rec.name === "string" ? rec.name.trim() : "";
                var code = typeof rec.code === "string" || typeof rec.code === "number" ? String(rec.code) : "";
                var parts = [name_1, rec.message.trim()].filter(Boolean);
                if (code) {
                    parts.push("code=".concat(code));
                }
                var combined = parts.join(": ").trim();
                return combined.length > LOG_VALUE_LIMIT
                    ? "".concat(combined.slice(0, LOG_VALUE_LIMIT), "...")
                    : combined;
            }
        }
        var str = typeof value === "string" || typeof value === "number"
            ? String(value)
            : JSON.stringify(value);
        if (!str) {
            return "";
        }
        var redacted = (0, redact_js_1.redactSensitiveText)(str, WS_LOG_REDACT_OPTIONS);
        return redacted.length > LOG_VALUE_LIMIT
            ? "".concat(redacted.slice(0, LOG_VALUE_LIMIT), "...")
            : redacted;
    }
    catch (_a) {
        return String(value);
    }
}
function compactPreview(input, maxLen) {
    if (maxLen === void 0) { maxLen = 160; }
    var oneLine = input.replace(/\s+/g, " ").trim();
    if (oneLine.length <= maxLen) {
        return oneLine;
    }
    return "".concat(oneLine.slice(0, Math.max(0, maxLen - 1)), "\u2026");
}
function summarizeAgentEventForWsLog(payload) {
    if (!payload || typeof payload !== "object") {
        return {};
    }
    var rec = payload;
    var runId = typeof rec.runId === "string" ? rec.runId : undefined;
    var stream = typeof rec.stream === "string" ? rec.stream : undefined;
    var seq = typeof rec.seq === "number" ? rec.seq : undefined;
    var sessionKey = typeof rec.sessionKey === "string" ? rec.sessionKey : undefined;
    var data = rec.data && typeof rec.data === "object" ? rec.data : undefined;
    var extra = {};
    if (runId) {
        extra.run = shortId(runId);
    }
    if (sessionKey) {
        var parsed = (0, session_key_js_1.parseAgentSessionKey)(sessionKey);
        if (parsed) {
            extra.agent = parsed.agentId;
            extra.session = parsed.rest;
        }
        else {
            extra.session = sessionKey;
        }
    }
    if (stream) {
        extra.stream = stream;
    }
    if (seq !== undefined) {
        extra.aseq = seq;
    }
    if (!data) {
        return extra;
    }
    if (stream === "assistant") {
        var text = typeof data.text === "string" ? data.text : undefined;
        if (text === null || text === void 0 ? void 0 : text.trim()) {
            extra.text = compactPreview(text);
        }
        var mediaUrls = Array.isArray(data.mediaUrls) ? data.mediaUrls : undefined;
        if (mediaUrls && mediaUrls.length > 0) {
            extra.media = mediaUrls.length;
        }
        return extra;
    }
    if (stream === "tool") {
        var phase = typeof data.phase === "string" ? data.phase : undefined;
        var name_2 = typeof data.name === "string" ? data.name : undefined;
        if (phase || name_2) {
            extra.tool = "".concat(phase !== null && phase !== void 0 ? phase : "?", ":").concat(name_2 !== null && name_2 !== void 0 ? name_2 : "?");
        }
        var toolCallId = typeof data.toolCallId === "string" ? data.toolCallId : undefined;
        if (toolCallId) {
            extra.call = shortId(toolCallId);
        }
        var meta = typeof data.meta === "string" ? data.meta : undefined;
        if (meta === null || meta === void 0 ? void 0 : meta.trim()) {
            extra.meta = meta;
        }
        if (typeof data.isError === "boolean") {
            extra.err = data.isError;
        }
        return extra;
    }
    if (stream === "lifecycle") {
        var phase = typeof data.phase === "string" ? data.phase : undefined;
        if (phase) {
            extra.phase = phase;
        }
        if (typeof data.aborted === "boolean") {
            extra.aborted = data.aborted;
        }
        var error = typeof data.error === "string" ? data.error : undefined;
        if (error === null || error === void 0 ? void 0 : error.trim()) {
            extra.error = compactPreview(error, 120);
        }
        return extra;
    }
    var reason = typeof data.reason === "string" ? data.reason : undefined;
    if (reason === null || reason === void 0 ? void 0 : reason.trim()) {
        extra.reason = reason;
    }
    return extra;
}
function logWs(direction, kind, meta) {
    if (!(0, console_js_1.shouldLogSubsystemToConsole)("gateway/ws")) {
        return;
    }
    var style = (0, ws_logging_js_1.getGatewayWsLogStyle)();
    if (!(0, globals_js_1.isVerbose)()) {
        logWsOptimized(direction, kind, meta);
        return;
    }
    if (style === "compact" || style === "auto") {
        logWsCompact(direction, kind, meta);
        return;
    }
    var now = Date.now();
    var connId = typeof (meta === null || meta === void 0 ? void 0 : meta.connId) === "string" ? meta.connId : undefined;
    var id = typeof (meta === null || meta === void 0 ? void 0 : meta.id) === "string" ? meta.id : undefined;
    var method = typeof (meta === null || meta === void 0 ? void 0 : meta.method) === "string" ? meta.method : undefined;
    var ok = typeof (meta === null || meta === void 0 ? void 0 : meta.ok) === "boolean" ? meta.ok : undefined;
    var event = typeof (meta === null || meta === void 0 ? void 0 : meta.event) === "string" ? meta.event : undefined;
    var inflightKey = connId && id ? "".concat(connId, ":").concat(id) : undefined;
    if (direction === "in" && kind === "req" && inflightKey) {
        wsInflightSince.set(inflightKey, now);
    }
    var durationMs = direction === "out" && kind === "res" && inflightKey
        ? (function () {
            var startedAt = wsInflightSince.get(inflightKey);
            if (startedAt === undefined) {
                return undefined;
            }
            wsInflightSince.delete(inflightKey);
            return now - startedAt;
        })()
        : undefined;
    var dirArrow = direction === "in" ? "←" : "→";
    var dirColor = direction === "in" ? chalk_1.default.greenBright : chalk_1.default.cyanBright;
    var prefix = "".concat(dirColor(dirArrow), " ").concat(chalk_1.default.bold(kind));
    var headline = (kind === "req" || kind === "res") && method
        ? chalk_1.default.bold(method)
        : kind === "event" && event
            ? chalk_1.default.bold(event)
            : undefined;
    var statusToken = kind === "res" && ok !== undefined
        ? ok
            ? chalk_1.default.greenBright("✓")
            : chalk_1.default.redBright("✗")
        : undefined;
    var durationToken = typeof durationMs === "number" ? chalk_1.default.dim("".concat(durationMs, "ms")) : undefined;
    var restMeta = [];
    if (meta) {
        for (var _i = 0, _a = Object.entries(meta); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (value === undefined) {
                continue;
            }
            if (key === "connId" || key === "id") {
                continue;
            }
            if (key === "method" || key === "ok") {
                continue;
            }
            if (key === "event") {
                continue;
            }
            restMeta.push("".concat(chalk_1.default.dim(key), "=").concat(formatForLog(value)));
        }
    }
    var trailing = [];
    if (connId) {
        trailing.push("".concat(chalk_1.default.dim("conn"), "=").concat(chalk_1.default.gray(shortId(connId))));
    }
    if (id) {
        trailing.push("".concat(chalk_1.default.dim("id"), "=").concat(chalk_1.default.gray(shortId(id))));
    }
    var tokens = __spreadArray(__spreadArray([prefix, statusToken, headline, durationToken], restMeta, true), trailing, true).filter(function (t) { return Boolean(t); });
    wsLog.info(tokens.join(" "));
}
function logWsOptimized(direction, kind, meta) {
    var connId = typeof (meta === null || meta === void 0 ? void 0 : meta.connId) === "string" ? meta.connId : undefined;
    var id = typeof (meta === null || meta === void 0 ? void 0 : meta.id) === "string" ? meta.id : undefined;
    var ok = typeof (meta === null || meta === void 0 ? void 0 : meta.ok) === "boolean" ? meta.ok : undefined;
    var method = typeof (meta === null || meta === void 0 ? void 0 : meta.method) === "string" ? meta.method : undefined;
    var inflightKey = connId && id ? "".concat(connId, ":").concat(id) : undefined;
    if (direction === "in" && kind === "req" && inflightKey) {
        wsInflightOptimized.set(inflightKey, Date.now());
        if (wsInflightOptimized.size > 2000) {
            wsInflightOptimized.clear();
        }
        return;
    }
    if (kind === "parse-error") {
        var errorMsg = typeof (meta === null || meta === void 0 ? void 0 : meta.error) === "string" ? formatForLog(meta.error) : undefined;
        wsLog.warn([
            "".concat(chalk_1.default.redBright("✗"), " ").concat(chalk_1.default.bold("parse-error")),
            errorMsg ? "".concat(chalk_1.default.dim("error"), "=").concat(errorMsg) : undefined,
            "".concat(chalk_1.default.dim("conn"), "=").concat(chalk_1.default.gray(shortId(connId !== null && connId !== void 0 ? connId : "?"))),
        ]
            .filter(function (t) { return Boolean(t); })
            .join(" "));
        return;
    }
    if (direction !== "out" || kind !== "res") {
        return;
    }
    var startedAt = inflightKey ? wsInflightOptimized.get(inflightKey) : undefined;
    if (inflightKey) {
        wsInflightOptimized.delete(inflightKey);
    }
    var durationMs = typeof startedAt === "number" ? Date.now() - startedAt : undefined;
    var shouldLog = ok === false || (typeof durationMs === "number" && durationMs >= ws_logging_js_1.DEFAULT_WS_SLOW_MS);
    if (!shouldLog) {
        return;
    }
    var statusToken = ok === undefined ? undefined : ok ? chalk_1.default.greenBright("✓") : chalk_1.default.redBright("✗");
    var durationToken = typeof durationMs === "number" ? chalk_1.default.dim("".concat(durationMs, "ms")) : undefined;
    var restMeta = [];
    if (meta) {
        for (var _i = 0, _a = Object.entries(meta); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (value === undefined) {
                continue;
            }
            if (key === "connId" || key === "id") {
                continue;
            }
            if (key === "method" || key === "ok") {
                continue;
            }
            restMeta.push("".concat(chalk_1.default.dim(key), "=").concat(formatForLog(value)));
        }
    }
    var tokens = __spreadArray(__spreadArray([
        "".concat(chalk_1.default.yellowBright("⇄"), " ").concat(chalk_1.default.bold("res")),
        statusToken,
        method ? chalk_1.default.bold(method) : undefined,
        durationToken
    ], restMeta, true), [
        connId ? "".concat(chalk_1.default.dim("conn"), "=").concat(chalk_1.default.gray(shortId(connId))) : undefined,
        id ? "".concat(chalk_1.default.dim("id"), "=").concat(chalk_1.default.gray(shortId(id))) : undefined,
    ], false).filter(function (t) { return Boolean(t); });
    wsLog.info(tokens.join(" "));
}
function logWsCompact(direction, kind, meta) {
    var _a;
    var now = Date.now();
    var connId = typeof (meta === null || meta === void 0 ? void 0 : meta.connId) === "string" ? meta.connId : undefined;
    var id = typeof (meta === null || meta === void 0 ? void 0 : meta.id) === "string" ? meta.id : undefined;
    var method = typeof (meta === null || meta === void 0 ? void 0 : meta.method) === "string" ? meta.method : undefined;
    var ok = typeof (meta === null || meta === void 0 ? void 0 : meta.ok) === "boolean" ? meta.ok : undefined;
    var inflightKey = connId && id ? "".concat(connId, ":").concat(id) : undefined;
    if (kind === "req" && direction === "in" && inflightKey) {
        wsInflightCompact.set(inflightKey, { ts: now, method: method, meta: meta });
        return;
    }
    var compactArrow = (function () {
        if (kind === "req" || kind === "res") {
            return "⇄";
        }
        return direction === "in" ? "←" : "→";
    })();
    var arrowColor = kind === "req" || kind === "res"
        ? chalk_1.default.yellowBright
        : direction === "in"
            ? chalk_1.default.greenBright
            : chalk_1.default.cyanBright;
    var prefix = "".concat(arrowColor(compactArrow), " ").concat(chalk_1.default.bold(kind));
    var statusToken = kind === "res" && ok !== undefined
        ? ok
            ? chalk_1.default.greenBright("✓")
            : chalk_1.default.redBright("✗")
        : undefined;
    var startedAt = kind === "res" && direction === "out" && inflightKey
        ? (_a = wsInflightCompact.get(inflightKey)) === null || _a === void 0 ? void 0 : _a.ts
        : undefined;
    if (kind === "res" && direction === "out" && inflightKey) {
        wsInflightCompact.delete(inflightKey);
    }
    var durationToken = typeof startedAt === "number" ? chalk_1.default.dim("".concat(now - startedAt, "ms")) : undefined;
    var headline = (kind === "req" || kind === "res") && method
        ? chalk_1.default.bold(method)
        : kind === "event" && typeof (meta === null || meta === void 0 ? void 0 : meta.event) === "string"
            ? chalk_1.default.bold(meta.event)
            : undefined;
    var restMeta = [];
    if (meta) {
        for (var _i = 0, _b = Object.entries(meta); _i < _b.length; _i++) {
            var _c = _b[_i], key = _c[0], value = _c[1];
            if (value === undefined) {
                continue;
            }
            if (key === "connId" || key === "id") {
                continue;
            }
            if (key === "method" || key === "ok") {
                continue;
            }
            if (key === "event") {
                continue;
            }
            restMeta.push("".concat(chalk_1.default.dim(key), "=").concat(formatForLog(value)));
        }
    }
    var trailing = [];
    if (connId && connId !== wsLastCompactConnId) {
        trailing.push("".concat(chalk_1.default.dim("conn"), "=").concat(chalk_1.default.gray(shortId(connId))));
        wsLastCompactConnId = connId;
    }
    if (id) {
        trailing.push("".concat(chalk_1.default.dim("id"), "=").concat(chalk_1.default.gray(shortId(id))));
    }
    var tokens = __spreadArray(__spreadArray([prefix, statusToken, headline, durationToken], restMeta, true), trailing, true).filter(function (t) { return Boolean(t); });
    wsLog.info(tokens.join(" "));
}
