"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pruneContextMessages = pruneContextMessages;
var tools_js_1 = require("./tools.js");
var CHARS_PER_TOKEN_ESTIMATE = 4;
// We currently skip pruning tool results that contain images. Still, we count them (approx.) so
// we start trimming prunable tool results earlier when image-heavy context is consuming the window.
var IMAGE_CHAR_ESTIMATE = 8000;
function asText(text) {
    return { type: "text", text: text };
}
function collectTextSegments(content) {
    var parts = [];
    for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
        var block = content_1[_i];
        if (block.type === "text") {
            parts.push(block.text);
        }
    }
    return parts;
}
function estimateJoinedTextLength(parts) {
    if (parts.length === 0) {
        return 0;
    }
    var len = 0;
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var p = parts_1[_i];
        len += p.length;
    }
    // Joined with "\n" separators between blocks.
    len += Math.max(0, parts.length - 1);
    return len;
}
function takeHeadFromJoinedText(parts, maxChars) {
    if (maxChars <= 0 || parts.length === 0) {
        return "";
    }
    var remaining = maxChars;
    var out = "";
    for (var i = 0; i < parts.length && remaining > 0; i++) {
        if (i > 0) {
            out += "\n";
            remaining -= 1;
            if (remaining <= 0) {
                break;
            }
        }
        var p = parts[i];
        if (p.length <= remaining) {
            out += p;
            remaining -= p.length;
        }
        else {
            out += p.slice(0, remaining);
            remaining = 0;
        }
    }
    return out;
}
function takeTailFromJoinedText(parts, maxChars) {
    if (maxChars <= 0 || parts.length === 0) {
        return "";
    }
    var remaining = maxChars;
    var out = [];
    for (var i = parts.length - 1; i >= 0 && remaining > 0; i--) {
        var p = parts[i];
        if (p.length <= remaining) {
            out.push(p);
            remaining -= p.length;
        }
        else {
            out.push(p.slice(p.length - remaining));
            remaining = 0;
            break;
        }
        if (remaining > 0 && i > 0) {
            out.push("\n");
            remaining -= 1;
        }
    }
    out.reverse();
    return out.join("");
}
function hasImageBlocks(content) {
    for (var _i = 0, content_2 = content; _i < content_2.length; _i++) {
        var block = content_2[_i];
        if (block.type === "image") {
            return true;
        }
    }
    return false;
}
function estimateMessageChars(message) {
    var _a;
    if (message.role === "user") {
        var content = message.content;
        if (typeof content === "string") {
            return content.length;
        }
        var chars = 0;
        for (var _i = 0, content_3 = content; _i < content_3.length; _i++) {
            var b = content_3[_i];
            if (b.type === "text") {
                chars += b.text.length;
            }
            if (b.type === "image") {
                chars += IMAGE_CHAR_ESTIMATE;
            }
        }
        return chars;
    }
    if (message.role === "assistant") {
        var chars = 0;
        for (var _b = 0, _c = message.content; _b < _c.length; _b++) {
            var b = _c[_b];
            if (b.type === "text") {
                chars += b.text.length;
            }
            if (b.type === "thinking") {
                chars += b.thinking.length;
            }
            if (b.type === "toolCall") {
                try {
                    chars += JSON.stringify((_a = b.arguments) !== null && _a !== void 0 ? _a : {}).length;
                }
                catch (_d) {
                    chars += 128;
                }
            }
        }
        return chars;
    }
    if (message.role === "toolResult") {
        var chars = 0;
        for (var _e = 0, _f = message.content; _e < _f.length; _e++) {
            var b = _f[_e];
            if (b.type === "text") {
                chars += b.text.length;
            }
            if (b.type === "image") {
                chars += IMAGE_CHAR_ESTIMATE;
            }
        }
        return chars;
    }
    return 256;
}
function estimateContextChars(messages) {
    return messages.reduce(function (sum, m) { return sum + estimateMessageChars(m); }, 0);
}
function findAssistantCutoffIndex(messages, keepLastAssistants) {
    var _a;
    // keepLastAssistants <= 0 => everything is potentially prunable.
    if (keepLastAssistants <= 0) {
        return messages.length;
    }
    var remaining = keepLastAssistants;
    for (var i = messages.length - 1; i >= 0; i--) {
        if (((_a = messages[i]) === null || _a === void 0 ? void 0 : _a.role) !== "assistant") {
            continue;
        }
        remaining--;
        if (remaining === 0) {
            return i;
        }
    }
    // Not enough assistant messages to establish a protected tail.
    return null;
}
function findFirstUserIndex(messages) {
    var _a;
    for (var i = 0; i < messages.length; i++) {
        if (((_a = messages[i]) === null || _a === void 0 ? void 0 : _a.role) === "user") {
            return i;
        }
    }
    return null;
}
function softTrimToolResultMessage(params) {
    var msg = params.msg, settings = params.settings;
    // Ignore image tool results for now: these are often directly relevant and hard to partially prune safely.
    if (hasImageBlocks(msg.content)) {
        return null;
    }
    var parts = collectTextSegments(msg.content);
    var rawLen = estimateJoinedTextLength(parts);
    if (rawLen <= settings.softTrim.maxChars) {
        return null;
    }
    var headChars = Math.max(0, settings.softTrim.headChars);
    var tailChars = Math.max(0, settings.softTrim.tailChars);
    if (headChars + tailChars >= rawLen) {
        return null;
    }
    var head = takeHeadFromJoinedText(parts, headChars);
    var tail = takeTailFromJoinedText(parts, tailChars);
    var trimmed = "".concat(head, "\n...\n").concat(tail);
    var note = "\n\n[Tool result trimmed: kept first ".concat(headChars, " chars and last ").concat(tailChars, " chars of ").concat(rawLen, " chars.]");
    return __assign(__assign({}, msg), { content: [asText(trimmed + note)] });
}
function pruneContextMessages(params) {
    var _a, _b;
    var messages = params.messages, settings = params.settings, ctx = params.ctx;
    var contextWindowTokens = typeof params.contextWindowTokensOverride === "number" &&
        Number.isFinite(params.contextWindowTokensOverride) &&
        params.contextWindowTokensOverride > 0
        ? params.contextWindowTokensOverride
        : (_a = ctx.model) === null || _a === void 0 ? void 0 : _a.contextWindow;
    if (!contextWindowTokens || contextWindowTokens <= 0) {
        return messages;
    }
    var charWindow = contextWindowTokens * CHARS_PER_TOKEN_ESTIMATE;
    if (charWindow <= 0) {
        return messages;
    }
    var cutoffIndex = findAssistantCutoffIndex(messages, settings.keepLastAssistants);
    if (cutoffIndex === null) {
        return messages;
    }
    // Bootstrap safety: never prune anything before the first user message. This protects initial
    // "identity" reads (SOUL.md, USER.md, etc.) which typically happen before the first inbound user
    // message exists in the session transcript.
    var firstUserIndex = findFirstUserIndex(messages);
    var pruneStartIndex = firstUserIndex === null ? messages.length : firstUserIndex;
    var isToolPrunable = (_b = params.isToolPrunable) !== null && _b !== void 0 ? _b : (0, tools_js_1.makeToolPrunablePredicate)(settings.tools);
    var totalCharsBefore = estimateContextChars(messages);
    var totalChars = totalCharsBefore;
    var ratio = totalChars / charWindow;
    if (ratio < settings.softTrimRatio) {
        return messages;
    }
    var prunableToolIndexes = [];
    var next = null;
    for (var i = pruneStartIndex; i < cutoffIndex; i++) {
        var msg = messages[i];
        if (!msg || msg.role !== "toolResult") {
            continue;
        }
        if (!isToolPrunable(msg.toolName)) {
            continue;
        }
        if (hasImageBlocks(msg.content)) {
            continue;
        }
        prunableToolIndexes.push(i);
        var updated = softTrimToolResultMessage({
            msg: msg,
            settings: settings,
        });
        if (!updated) {
            continue;
        }
        var beforeChars = estimateMessageChars(msg);
        var afterChars = estimateMessageChars(updated);
        totalChars += afterChars - beforeChars;
        if (!next) {
            next = messages.slice();
        }
        next[i] = updated;
    }
    var outputAfterSoftTrim = next !== null && next !== void 0 ? next : messages;
    ratio = totalChars / charWindow;
    if (ratio < settings.hardClearRatio) {
        return outputAfterSoftTrim;
    }
    if (!settings.hardClear.enabled) {
        return outputAfterSoftTrim;
    }
    var prunableToolChars = 0;
    for (var _i = 0, prunableToolIndexes_1 = prunableToolIndexes; _i < prunableToolIndexes_1.length; _i++) {
        var i = prunableToolIndexes_1[_i];
        var msg = outputAfterSoftTrim[i];
        if (!msg || msg.role !== "toolResult") {
            continue;
        }
        prunableToolChars += estimateMessageChars(msg);
    }
    if (prunableToolChars < settings.minPrunableToolChars) {
        return outputAfterSoftTrim;
    }
    for (var _c = 0, prunableToolIndexes_2 = prunableToolIndexes; _c < prunableToolIndexes_2.length; _c++) {
        var i = prunableToolIndexes_2[_c];
        if (ratio < settings.hardClearRatio) {
            break;
        }
        var msg = (next !== null && next !== void 0 ? next : messages)[i];
        if (!msg || msg.role !== "toolResult") {
            continue;
        }
        var beforeChars = estimateMessageChars(msg);
        var cleared = __assign(__assign({}, msg), { content: [asText(settings.hardClear.placeholder)] });
        if (!next) {
            next = messages.slice();
        }
        next[i] = cleared;
        var afterChars = estimateMessageChars(cleared);
        totalChars += afterChars - beforeChars;
        ratio = totalChars / charWindow;
    }
    return next !== null && next !== void 0 ? next : messages;
}
