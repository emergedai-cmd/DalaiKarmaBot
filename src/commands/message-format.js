"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMessageCliJson = buildMessageCliJson;
exports.formatMessageCliText = formatMessageCliText;
var index_js_1 = require("../channels/plugins/index.js");
var format_js_1 = require("../infra/outbound/format.js");
var target_resolver_js_1 = require("../infra/outbound/target-resolver.js");
var table_js_1 = require("../terminal/table.js");
var theme_js_1 = require("../terminal/theme.js");
var shortenText = function (value, maxLen) {
    var chars = Array.from(value);
    if (chars.length <= maxLen) {
        return value;
    }
    return "".concat(chars.slice(0, Math.max(0, maxLen - 1)).join(""), "\u2026");
};
var resolveChannelLabel = function (channel) { var _a, _b; return (_b = (_a = (0, index_js_1.getChannelPlugin)(channel)) === null || _a === void 0 ? void 0 : _a.meta.label) !== null && _b !== void 0 ? _b : channel; };
function extractMessageId(payload) {
    if (!payload || typeof payload !== "object") {
        return null;
    }
    var direct = payload.messageId;
    if (typeof direct === "string" && direct.trim()) {
        return direct.trim();
    }
    var result = payload.result;
    if (result && typeof result === "object") {
        var nested = result.messageId;
        if (typeof nested === "string" && nested.trim()) {
            return nested.trim();
        }
    }
    return null;
}
function buildMessageCliJson(result) {
    return {
        action: result.action,
        channel: result.channel,
        dryRun: result.dryRun,
        handledBy: result.handledBy,
        payload: result.payload,
    };
}
function renderObjectSummary(payload, opts) {
    if (!payload || typeof payload !== "object") {
        return [String(payload)];
    }
    var obj = payload;
    var keys = Object.keys(obj);
    if (keys.length === 0) {
        return [theme_js_1.theme.muted("(empty)")];
    }
    var rows = keys.slice(0, 20).map(function (k) {
        var v = obj[k];
        var value = v == null
            ? "null"
            : Array.isArray(v)
                ? "".concat(v.length, " items")
                : typeof v === "object"
                    ? "object"
                    : typeof v === "string"
                        ? v
                        : typeof v === "number"
                            ? String(v)
                            : typeof v === "boolean"
                                ? v
                                    ? "true"
                                    : "false"
                                : typeof v === "bigint"
                                    ? v.toString()
                                    : typeof v === "symbol"
                                        ? v.toString()
                                        : typeof v === "function"
                                            ? "function"
                                            : "unknown";
        return { Key: k, Value: shortenText(value, 96) };
    });
    return [
        (0, table_js_1.renderTable)({
            width: opts.width,
            columns: [
                { key: "Key", header: "Key", minWidth: 16 },
                { key: "Value", header: "Value", flex: true, minWidth: 24 },
            ],
            rows: rows,
        }).trimEnd(),
    ];
}
function renderMessageList(messages, opts, emptyLabel) {
    var rows = messages.slice(0, 25).map(function (m) {
        var msg = m;
        var id = (typeof msg.id === "string" && msg.id) ||
            (typeof msg.ts === "string" && msg.ts) ||
            (typeof msg.messageId === "string" && msg.messageId) ||
            "";
        var authorObj = msg.author;
        var author = (typeof msg.authorTag === "string" && msg.authorTag) ||
            (typeof (authorObj === null || authorObj === void 0 ? void 0 : authorObj.username) === "string" && authorObj.username) ||
            (typeof msg.user === "string" && msg.user) ||
            "";
        var time = (typeof msg.timestamp === "string" && msg.timestamp) ||
            (typeof msg.ts === "string" && msg.ts) ||
            "";
        var text = (typeof msg.content === "string" && msg.content) ||
            (typeof msg.text === "string" && msg.text) ||
            "";
        return {
            Time: shortenText(time, 28),
            Author: shortenText(author, 22),
            Text: shortenText(text.replace(/\s+/g, " ").trim(), 90),
            Id: shortenText(id, 22),
        };
    });
    if (rows.length === 0) {
        return [theme_js_1.theme.muted(emptyLabel)];
    }
    return [
        (0, table_js_1.renderTable)({
            width: opts.width,
            columns: [
                { key: "Time", header: "Time", minWidth: 14 },
                { key: "Author", header: "Author", minWidth: 10 },
                { key: "Text", header: "Text", flex: true, minWidth: 24 },
                { key: "Id", header: "Id", minWidth: 10 },
            ],
            rows: rows,
        }).trimEnd(),
    ];
}
function renderMessagesFromPayload(payload, opts) {
    if (!payload || typeof payload !== "object") {
        return null;
    }
    var messages = payload.messages;
    if (!Array.isArray(messages)) {
        return null;
    }
    return renderMessageList(messages, opts, "No messages.");
}
function renderPinsFromPayload(payload, opts) {
    if (!payload || typeof payload !== "object") {
        return null;
    }
    var pins = payload.pins;
    if (!Array.isArray(pins)) {
        return null;
    }
    return renderMessageList(pins, opts, "No pins.");
}
function extractDiscordSearchResultsMessages(results) {
    if (!results || typeof results !== "object") {
        return null;
    }
    var raw = results.messages;
    if (!Array.isArray(raw)) {
        return null;
    }
    // Discord search returns messages as array-of-array; first element is the message.
    var flattened = [];
    for (var _i = 0, raw_1 = raw; _i < raw_1.length; _i++) {
        var entry = raw_1[_i];
        if (Array.isArray(entry) && entry.length > 0) {
            flattened.push(entry[0]);
        }
        else if (entry && typeof entry === "object") {
            flattened.push(entry);
        }
    }
    return flattened.length ? flattened : null;
}
function renderReactions(payload, opts) {
    if (!payload || typeof payload !== "object") {
        return null;
    }
    var reactions = payload.reactions;
    if (!Array.isArray(reactions)) {
        return null;
    }
    var rows = reactions.slice(0, 50).map(function (r) {
        var entry = r;
        var emojiObj = entry.emoji;
        var emoji = (typeof (emojiObj === null || emojiObj === void 0 ? void 0 : emojiObj.raw) === "string" && emojiObj.raw) ||
            (typeof entry.name === "string" && entry.name) ||
            (typeof entry.emoji === "string" && entry.emoji) ||
            "";
        var count = typeof entry.count === "number" ? String(entry.count) : "";
        var userList = Array.isArray(entry.users)
            ? entry.users
                .slice(0, 8)
                .map(function (u) {
                if (typeof u === "string") {
                    return u;
                }
                if (!u || typeof u !== "object") {
                    return "";
                }
                var user = u;
                return ((typeof user.tag === "string" && user.tag) ||
                    (typeof user.username === "string" && user.username) ||
                    (typeof user.id === "string" && user.id) ||
                    "");
            })
                .filter(Boolean)
            : [];
        return {
            Emoji: emoji,
            Count: count,
            Users: shortenText(userList.join(", "), 72),
        };
    });
    if (rows.length === 0) {
        return [theme_js_1.theme.muted("No reactions.")];
    }
    return [
        (0, table_js_1.renderTable)({
            width: opts.width,
            columns: [
                { key: "Emoji", header: "Emoji", minWidth: 8 },
                { key: "Count", header: "Count", align: "right", minWidth: 6 },
                { key: "Users", header: "Users", flex: true, minWidth: 20 },
            ],
            rows: rows,
        }).trimEnd(),
    ];
}
function formatMessageCliText(result) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var rich = (0, theme_js_1.isRich)();
    var ok = function (text) { return (rich ? theme_js_1.theme.success(text) : text); };
    var muted = function (text) { return (rich ? theme_js_1.theme.muted(text) : text); };
    var heading = function (text) { return (rich ? theme_js_1.theme.heading(text) : text); };
    var width = Math.max(60, ((_a = process.stdout.columns) !== null && _a !== void 0 ? _a : 120) - 1);
    var opts = { width: width };
    if (result.handledBy === "dry-run") {
        return [muted("[dry-run] would run ".concat(result.action, " via ").concat(result.channel))];
    }
    if (result.kind === "broadcast") {
        var results = (_b = result.payload.results) !== null && _b !== void 0 ? _b : [];
        var rows = results.map(function (entry) {
            var _a;
            return ({
                Channel: resolveChannelLabel(entry.channel),
                Target: shortenText((0, target_resolver_js_1.formatTargetDisplay)({ channel: entry.channel, target: entry.to }), 36),
                Status: entry.ok ? "ok" : "error",
                Error: entry.ok ? "" : shortenText((_a = entry.error) !== null && _a !== void 0 ? _a : "unknown error", 48),
            });
        });
        var okCount = results.filter(function (entry) { return entry.ok; }).length;
        var total = results.length;
        var headingLine = ok("\u2705 Broadcast complete (".concat(okCount, "/").concat(total, " succeeded, ").concat(total - okCount, " failed)"));
        return [
            headingLine,
            (0, table_js_1.renderTable)({
                width: opts.width,
                columns: [
                    { key: "Channel", header: "Channel", minWidth: 10 },
                    { key: "Target", header: "Target", minWidth: 12, flex: true },
                    { key: "Status", header: "Status", minWidth: 6 },
                    { key: "Error", header: "Error", minWidth: 20, flex: true },
                ],
                rows: rows.slice(0, 50),
            }).trimEnd(),
        ];
    }
    if (result.kind === "send") {
        if (result.handledBy === "core" && result.sendResult) {
            var send = result.sendResult;
            if (send.via === "direct") {
                var directResult = send.result;
                return [ok((0, format_js_1.formatOutboundDeliverySummary)(send.channel, directResult))];
            }
            var gatewayResult = send.result;
            return [
                ok((0, format_js_1.formatGatewaySummary)({
                    channel: send.channel,
                    messageId: (_c = gatewayResult === null || gatewayResult === void 0 ? void 0 : gatewayResult.messageId) !== null && _c !== void 0 ? _c : null,
                })),
            ];
        }
        var label = resolveChannelLabel(result.channel);
        var msgId = extractMessageId(result.payload);
        return [ok("\u2705 Sent via ".concat(label, ".").concat(msgId ? " Message ID: ".concat(msgId) : ""))];
    }
    if (result.kind === "poll") {
        if (result.handledBy === "core" && result.pollResult) {
            var poll = result.pollResult;
            var pollId = (_d = poll.result) === null || _d === void 0 ? void 0 : _d.pollId;
            var msgId_1 = (_f = (_e = poll.result) === null || _e === void 0 ? void 0 : _e.messageId) !== null && _f !== void 0 ? _f : null;
            var lines_1 = [
                ok((0, format_js_1.formatGatewaySummary)({
                    action: "Poll sent",
                    channel: poll.channel,
                    messageId: msgId_1,
                })),
            ];
            if (pollId) {
                lines_1.push(ok("Poll id: ".concat(pollId)));
            }
            return lines_1;
        }
        var label = resolveChannelLabel(result.channel);
        var msgId = extractMessageId(result.payload);
        return [ok("\u2705 Poll sent via ".concat(label, ".").concat(msgId ? " Message ID: ".concat(msgId) : ""))];
    }
    // channel actions (non-send/poll)
    var payload = result.payload;
    var lines = [];
    if (result.action === "react") {
        var added = payload.added;
        var removed = payload.removed;
        if (typeof added === "string" && added.trim()) {
            lines.push(ok("\u2705 Reaction added: ".concat(added.trim())));
            return lines;
        }
        if (typeof removed === "string" && removed.trim()) {
            lines.push(ok("\u2705 Reaction removed: ".concat(removed.trim())));
            return lines;
        }
        if (Array.isArray(removed)) {
            var list = removed
                .map(function (x) { return String(x).trim(); })
                .filter(Boolean)
                .join(", ");
            lines.push(ok("\u2705 Reactions removed".concat(list ? ": ".concat(list) : "")));
            return lines;
        }
        lines.push(ok("✅ Reaction updated."));
        return lines;
    }
    var reactionsTable = renderReactions(payload, opts);
    if (reactionsTable && result.action === "reactions") {
        lines.push(heading("Reactions"));
        lines.push((_g = reactionsTable[0]) !== null && _g !== void 0 ? _g : "");
        return lines;
    }
    if (result.action === "read") {
        var messagesTable = renderMessagesFromPayload(payload, opts);
        if (messagesTable) {
            lines.push(heading("Messages"));
            lines.push((_h = messagesTable[0]) !== null && _h !== void 0 ? _h : "");
            return lines;
        }
    }
    if (result.action === "list-pins") {
        var pinsTable = renderPinsFromPayload(payload, opts);
        if (pinsTable) {
            lines.push(heading("Pinned messages"));
            lines.push((_j = pinsTable[0]) !== null && _j !== void 0 ? _j : "");
            return lines;
        }
    }
    if (result.action === "search") {
        var results = payload.results;
        var list = extractDiscordSearchResultsMessages(results);
        if (list) {
            lines.push(heading("Search results"));
            lines.push((_k = renderMessageList(list, opts, "No results.")[0]) !== null && _k !== void 0 ? _k : "");
            return lines;
        }
    }
    // Generic success + compact details table.
    lines.push(ok("\u2705 ".concat(result.action, " via ").concat(resolveChannelLabel(result.channel), ".")));
    var summary = renderObjectSummary(payload, opts);
    if (summary.length) {
        lines.push("");
        lines.push.apply(lines, summary);
        lines.push("");
        lines.push(muted("Tip: use --json for full output."));
    }
    return lines;
}
