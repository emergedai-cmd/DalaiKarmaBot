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
exports.stripEnvelope = stripEnvelope;
exports.extractText = extractText;
exports.extractTextCached = extractTextCached;
exports.extractThinking = extractThinking;
exports.extractThinkingCached = extractThinkingCached;
exports.extractRawText = extractRawText;
exports.formatReasoningMarkdown = formatReasoningMarkdown;
var format_1 = require("../format");
var ENVELOPE_PREFIX = /^\[([^\]]+)\]\s*/;
var ENVELOPE_CHANNELS = [
    "WebChat",
    "WhatsApp",
    "Telegram",
    "Signal",
    "Slack",
    "Discord",
    "iMessage",
    "Teams",
    "Matrix",
    "Zalo",
    "Zalo Personal",
    "BlueBubbles",
];
var textCache = new WeakMap();
var thinkingCache = new WeakMap();
function looksLikeEnvelopeHeader(header) {
    if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(header)) {
        return true;
    }
    if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(header)) {
        return true;
    }
    return ENVELOPE_CHANNELS.some(function (label) { return header.startsWith("".concat(label, " ")); });
}
function stripEnvelope(text) {
    var _a;
    var match = text.match(ENVELOPE_PREFIX);
    if (!match) {
        return text;
    }
    var header = (_a = match[1]) !== null && _a !== void 0 ? _a : "";
    if (!looksLikeEnvelopeHeader(header)) {
        return text;
    }
    return text.slice(match[0].length);
}
function extractText(message) {
    var m = message;
    var role = typeof m.role === "string" ? m.role : "";
    var content = m.content;
    if (typeof content === "string") {
        var processed = role === "assistant" ? (0, format_1.stripThinkingTags)(content) : stripEnvelope(content);
        return processed;
    }
    if (Array.isArray(content)) {
        var parts = content
            .map(function (p) {
            var item = p;
            if (item.type === "text" && typeof item.text === "string") {
                return item.text;
            }
            return null;
        })
            .filter(function (v) { return typeof v === "string"; });
        if (parts.length > 0) {
            var joined = parts.join("\n");
            var processed = role === "assistant" ? (0, format_1.stripThinkingTags)(joined) : stripEnvelope(joined);
            return processed;
        }
    }
    if (typeof m.text === "string") {
        var processed = role === "assistant" ? (0, format_1.stripThinkingTags)(m.text) : stripEnvelope(m.text);
        return processed;
    }
    return null;
}
function extractTextCached(message) {
    var _a;
    if (!message || typeof message !== "object") {
        return extractText(message);
    }
    var obj = message;
    if (textCache.has(obj)) {
        return (_a = textCache.get(obj)) !== null && _a !== void 0 ? _a : null;
    }
    var value = extractText(message);
    textCache.set(obj, value);
    return value;
}
function extractThinking(message) {
    var m = message;
    var content = m.content;
    var parts = [];
    if (Array.isArray(content)) {
        for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
            var p = content_1[_i];
            var item = p;
            if (item.type === "thinking" && typeof item.thinking === "string") {
                var cleaned = item.thinking.trim();
                if (cleaned) {
                    parts.push(cleaned);
                }
            }
        }
    }
    if (parts.length > 0) {
        return parts.join("\n");
    }
    // Back-compat: older logs may still have <think> tags inside text blocks.
    var rawText = extractRawText(message);
    if (!rawText) {
        return null;
    }
    var matches = __spreadArray([], rawText.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi), true);
    var extracted = matches.map(function (m) { var _a; return ((_a = m[1]) !== null && _a !== void 0 ? _a : "").trim(); }).filter(Boolean);
    return extracted.length > 0 ? extracted.join("\n") : null;
}
function extractThinkingCached(message) {
    var _a;
    if (!message || typeof message !== "object") {
        return extractThinking(message);
    }
    var obj = message;
    if (thinkingCache.has(obj)) {
        return (_a = thinkingCache.get(obj)) !== null && _a !== void 0 ? _a : null;
    }
    var value = extractThinking(message);
    thinkingCache.set(obj, value);
    return value;
}
function extractRawText(message) {
    var m = message;
    var content = m.content;
    if (typeof content === "string") {
        return content;
    }
    if (Array.isArray(content)) {
        var parts = content
            .map(function (p) {
            var item = p;
            if (item.type === "text" && typeof item.text === "string") {
                return item.text;
            }
            return null;
        })
            .filter(function (v) { return typeof v === "string"; });
        if (parts.length > 0) {
            return parts.join("\n");
        }
    }
    if (typeof m.text === "string") {
        return m.text;
    }
    return null;
}
function formatReasoningMarkdown(text) {
    var trimmed = text.trim();
    if (!trimmed) {
        return "";
    }
    var lines = trimmed
        .split(/\r?\n/)
        .map(function (line) { return line.trim(); })
        .filter(Boolean)
        .map(function (line) { return "_".concat(line, "_"); });
    return lines.length ? __spreadArray(["_Reasoning:_"], lines, true).join("\n") : "";
}
