"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapNoteMessage = wrapNoteMessage;
exports.note = note;
var prompts_1 = require("@clack/prompts");
var ansi_js_1 = require("./ansi.js");
var prompt_style_js_1 = require("./prompt-style.js");
function splitLongWord(word, maxLen) {
    if (maxLen <= 0) {
        return [word];
    }
    var chars = Array.from(word);
    var parts = [];
    for (var i = 0; i < chars.length; i += maxLen) {
        parts.push(chars.slice(i, i + maxLen).join(""));
    }
    return parts.length > 0 ? parts : [word];
}
function wrapLine(line, maxWidth) {
    var _a, _b, _c, _d, _e;
    if (line.trim().length === 0) {
        return [line];
    }
    var match = line.match(/^(\s*)([-*\u2022]\s+)?(.*)$/);
    var indent = (_a = match === null || match === void 0 ? void 0 : match[1]) !== null && _a !== void 0 ? _a : "";
    var bullet = (_b = match === null || match === void 0 ? void 0 : match[2]) !== null && _b !== void 0 ? _b : "";
    var content = (_c = match === null || match === void 0 ? void 0 : match[3]) !== null && _c !== void 0 ? _c : "";
    var firstPrefix = "".concat(indent).concat(bullet);
    var nextPrefix = "".concat(indent).concat(bullet ? " ".repeat(bullet.length) : "");
    var firstWidth = Math.max(10, maxWidth - (0, ansi_js_1.visibleWidth)(firstPrefix));
    var nextWidth = Math.max(10, maxWidth - (0, ansi_js_1.visibleWidth)(nextPrefix));
    var words = content.split(/\s+/).filter(Boolean);
    var lines = [];
    var current = "";
    var prefix = firstPrefix;
    var available = firstWidth;
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var word = words_1[_i];
        if (!current) {
            if ((0, ansi_js_1.visibleWidth)(word) > available) {
                var parts = splitLongWord(word, available);
                var first = (_d = parts.shift()) !== null && _d !== void 0 ? _d : "";
                lines.push(prefix + first);
                prefix = nextPrefix;
                available = nextWidth;
                for (var _f = 0, parts_1 = parts; _f < parts_1.length; _f++) {
                    var part = parts_1[_f];
                    lines.push(prefix + part);
                }
                continue;
            }
            current = word;
            continue;
        }
        var candidate = "".concat(current, " ").concat(word);
        if ((0, ansi_js_1.visibleWidth)(candidate) <= available) {
            current = candidate;
            continue;
        }
        lines.push(prefix + current);
        prefix = nextPrefix;
        available = nextWidth;
        if ((0, ansi_js_1.visibleWidth)(word) > available) {
            var parts = splitLongWord(word, available);
            var first = (_e = parts.shift()) !== null && _e !== void 0 ? _e : "";
            lines.push(prefix + first);
            for (var _g = 0, parts_2 = parts; _g < parts_2.length; _g++) {
                var part = parts_2[_g];
                lines.push(prefix + part);
            }
            current = "";
            continue;
        }
        current = word;
    }
    if (current || words.length === 0) {
        lines.push(prefix + current);
    }
    return lines;
}
function wrapNoteMessage(message, options) {
    var _a, _b, _c;
    if (options === void 0) { options = {}; }
    var columns = (_b = (_a = options.columns) !== null && _a !== void 0 ? _a : process.stdout.columns) !== null && _b !== void 0 ? _b : 80;
    var maxWidth = (_c = options.maxWidth) !== null && _c !== void 0 ? _c : Math.max(40, Math.min(88, columns - 10));
    return message
        .split("\n")
        .flatMap(function (line) { return wrapLine(line, maxWidth); })
        .join("\n");
}
function note(message, title) {
    (0, prompts_1.note)(wrapNoteMessage(message), (0, prompt_style_js_1.stylePromptTitle)(title));
}
