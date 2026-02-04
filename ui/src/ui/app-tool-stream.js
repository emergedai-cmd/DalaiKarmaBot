"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flushToolStreamSync = flushToolStreamSync;
exports.scheduleToolStreamSync = scheduleToolStreamSync;
exports.resetToolStream = resetToolStream;
exports.handleCompactionEvent = handleCompactionEvent;
exports.handleAgentEvent = handleAgentEvent;
var format_1 = require("./format");
var TOOL_STREAM_LIMIT = 50;
var TOOL_STREAM_THROTTLE_MS = 80;
var TOOL_OUTPUT_CHAR_LIMIT = 120000;
function extractToolOutputText(value) {
    if (!value || typeof value !== "object") {
        return null;
    }
    var record = value;
    if (typeof record.text === "string") {
        return record.text;
    }
    var content = record.content;
    if (!Array.isArray(content)) {
        return null;
    }
    var parts = content
        .map(function (item) {
        if (!item || typeof item !== "object") {
            return null;
        }
        var entry = item;
        if (entry.type === "text" && typeof entry.text === "string") {
            return entry.text;
        }
        return null;
    })
        .filter(function (part) { return Boolean(part); });
    if (parts.length === 0) {
        return null;
    }
    return parts.join("\n");
}
function formatToolOutput(value) {
    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }
    var contentText = extractToolOutputText(value);
    var text;
    if (typeof value === "string") {
        text = value;
    }
    else if (contentText) {
        text = contentText;
    }
    else {
        try {
            text = JSON.stringify(value, null, 2);
        }
        catch (_a) {
            // oxlint-disable typescript/no-base-to-string
            text = String(value);
        }
    }
    var truncated = (0, format_1.truncateText)(text, TOOL_OUTPUT_CHAR_LIMIT);
    if (!truncated.truncated) {
        return truncated.text;
    }
    return "".concat(truncated.text, "\n\n\u2026 truncated (").concat(truncated.total, " chars, showing first ").concat(truncated.text.length, ").");
}
function buildToolStreamMessage(entry) {
    var _a;
    var content = [];
    content.push({
        type: "toolcall",
        name: entry.name,
        arguments: (_a = entry.args) !== null && _a !== void 0 ? _a : {},
    });
    if (entry.output) {
        content.push({
            type: "toolresult",
            name: entry.name,
            text: entry.output,
        });
    }
    return {
        role: "assistant",
        toolCallId: entry.toolCallId,
        runId: entry.runId,
        content: content,
        timestamp: entry.startedAt,
    };
}
function trimToolStream(host) {
    if (host.toolStreamOrder.length <= TOOL_STREAM_LIMIT) {
        return;
    }
    var overflow = host.toolStreamOrder.length - TOOL_STREAM_LIMIT;
    var removed = host.toolStreamOrder.splice(0, overflow);
    for (var _i = 0, removed_1 = removed; _i < removed_1.length; _i++) {
        var id = removed_1[_i];
        host.toolStreamById.delete(id);
    }
}
function syncToolStreamMessages(host) {
    host.chatToolMessages = host.toolStreamOrder
        .map(function (id) { var _a; return (_a = host.toolStreamById.get(id)) === null || _a === void 0 ? void 0 : _a.message; })
        .filter(function (msg) { return Boolean(msg); });
}
function flushToolStreamSync(host) {
    if (host.toolStreamSyncTimer != null) {
        clearTimeout(host.toolStreamSyncTimer);
        host.toolStreamSyncTimer = null;
    }
    syncToolStreamMessages(host);
}
function scheduleToolStreamSync(host, force) {
    if (force === void 0) { force = false; }
    if (force) {
        flushToolStreamSync(host);
        return;
    }
    if (host.toolStreamSyncTimer != null) {
        return;
    }
    host.toolStreamSyncTimer = window.setTimeout(function () { return flushToolStreamSync(host); }, TOOL_STREAM_THROTTLE_MS);
}
function resetToolStream(host) {
    host.toolStreamById.clear();
    host.toolStreamOrder = [];
    host.chatToolMessages = [];
    flushToolStreamSync(host);
}
var COMPACTION_TOAST_DURATION_MS = 5000;
function handleCompactionEvent(host, payload) {
    var _a, _b, _c;
    var data = (_a = payload.data) !== null && _a !== void 0 ? _a : {};
    var phase = typeof data.phase === "string" ? data.phase : "";
    // Clear any existing timer
    if (host.compactionClearTimer != null) {
        window.clearTimeout(host.compactionClearTimer);
        host.compactionClearTimer = null;
    }
    if (phase === "start") {
        host.compactionStatus = {
            active: true,
            startedAt: Date.now(),
            completedAt: null,
        };
    }
    else if (phase === "end") {
        host.compactionStatus = {
            active: false,
            startedAt: (_c = (_b = host.compactionStatus) === null || _b === void 0 ? void 0 : _b.startedAt) !== null && _c !== void 0 ? _c : null,
            completedAt: Date.now(),
        };
        // Auto-clear the toast after duration
        host.compactionClearTimer = window.setTimeout(function () {
            host.compactionStatus = null;
            host.compactionClearTimer = null;
        }, COMPACTION_TOAST_DURATION_MS);
    }
}
function handleAgentEvent(host, payload) {
    var _a;
    if (!payload) {
        return;
    }
    // Handle compaction events
    if (payload.stream === "compaction") {
        handleCompactionEvent(host, payload);
        return;
    }
    if (payload.stream !== "tool") {
        return;
    }
    var sessionKey = typeof payload.sessionKey === "string" ? payload.sessionKey : undefined;
    if (sessionKey && sessionKey !== host.sessionKey) {
        return;
    }
    // Fallback: only accept session-less events for the active run.
    if (!sessionKey && host.chatRunId && payload.runId !== host.chatRunId) {
        return;
    }
    if (host.chatRunId && payload.runId !== host.chatRunId) {
        return;
    }
    if (!host.chatRunId) {
        return;
    }
    var data = (_a = payload.data) !== null && _a !== void 0 ? _a : {};
    var toolCallId = typeof data.toolCallId === "string" ? data.toolCallId : "";
    if (!toolCallId) {
        return;
    }
    var name = typeof data.name === "string" ? data.name : "tool";
    var phase = typeof data.phase === "string" ? data.phase : "";
    var args = phase === "start" ? data.args : undefined;
    var output = phase === "update"
        ? formatToolOutput(data.partialResult)
        : phase === "result"
            ? formatToolOutput(data.result)
            : undefined;
    var now = Date.now();
    var entry = host.toolStreamById.get(toolCallId);
    if (!entry) {
        entry = {
            toolCallId: toolCallId,
            runId: payload.runId,
            sessionKey: sessionKey,
            name: name,
            args: args,
            output: output,
            startedAt: typeof payload.ts === "number" ? payload.ts : now,
            updatedAt: now,
            message: {},
        };
        host.toolStreamById.set(toolCallId, entry);
        host.toolStreamOrder.push(toolCallId);
    }
    else {
        entry.name = name;
        if (args !== undefined) {
            entry.args = args;
        }
        if (output !== undefined) {
            entry.output = output;
        }
        entry.updatedAt = now;
    }
    entry.message = buildToolStreamMessage(entry);
    trimToolStream(host);
    scheduleToolStreamSync(host, phase === "result");
}
