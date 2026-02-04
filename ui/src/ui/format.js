"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMs = formatMs;
exports.formatAgo = formatAgo;
exports.formatDurationMs = formatDurationMs;
exports.formatList = formatList;
exports.clampText = clampText;
exports.truncateText = truncateText;
exports.toNumber = toNumber;
exports.parseList = parseList;
exports.stripThinkingTags = stripThinkingTags;
var reasoning_tags_js_1 = require("../../../src/shared/text/reasoning-tags.js");
function formatMs(ms) {
    if (!ms && ms !== 0) {
        return "n/a";
    }
    return new Date(ms).toLocaleString();
}
function formatAgo(ms) {
    if (!ms && ms !== 0) {
        return "n/a";
    }
    var diff = Date.now() - ms;
    if (diff < 0) {
        return "just now";
    }
    var sec = Math.round(diff / 1000);
    if (sec < 60) {
        return "".concat(sec, "s ago");
    }
    var min = Math.round(sec / 60);
    if (min < 60) {
        return "".concat(min, "m ago");
    }
    var hr = Math.round(min / 60);
    if (hr < 48) {
        return "".concat(hr, "h ago");
    }
    var day = Math.round(hr / 24);
    return "".concat(day, "d ago");
}
function formatDurationMs(ms) {
    if (!ms && ms !== 0) {
        return "n/a";
    }
    if (ms < 1000) {
        return "".concat(ms, "ms");
    }
    var sec = Math.round(ms / 1000);
    if (sec < 60) {
        return "".concat(sec, "s");
    }
    var min = Math.round(sec / 60);
    if (min < 60) {
        return "".concat(min, "m");
    }
    var hr = Math.round(min / 60);
    if (hr < 48) {
        return "".concat(hr, "h");
    }
    var day = Math.round(hr / 24);
    return "".concat(day, "d");
}
function formatList(values) {
    if (!values || values.length === 0) {
        return "none";
    }
    return values.filter(function (v) { return Boolean(v && v.trim()); }).join(", ");
}
function clampText(value, max) {
    if (max === void 0) { max = 120; }
    if (value.length <= max) {
        return value;
    }
    return "".concat(value.slice(0, Math.max(0, max - 1)), "\u2026");
}
function truncateText(value, max) {
    if (value.length <= max) {
        return { text: value, truncated: false, total: value.length };
    }
    return {
        text: value.slice(0, Math.max(0, max)),
        truncated: true,
        total: value.length,
    };
}
function toNumber(value, fallback) {
    var n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}
function parseList(input) {
    return input
        .split(/[,\n]/)
        .map(function (v) { return v.trim(); })
        .filter(function (v) { return v.length > 0; });
}
function stripThinkingTags(value) {
    return (0, reasoning_tags_js_1.stripReasoningTagsFromText)(value, { mode: "preserve", trim: "start" });
}
