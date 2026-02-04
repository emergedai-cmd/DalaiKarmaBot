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
exports.searchableSelectListTheme = exports.editorTheme = exports.settingsListTheme = exports.filterableSelectListTheme = exports.selectListTheme = exports.markdownTheme = exports.theme = void 0;
var chalk_1 = require("chalk");
var cli_highlight_1 = require("cli-highlight");
var syntax_theme_js_1 = require("./syntax-theme.js");
var palette = {
    text: "#E8E3D5",
    dim: "#7B7F87",
    accent: "#F6C453",
    accentSoft: "#F2A65A",
    border: "#3C414B",
    userBg: "#2B2F36",
    userText: "#F3EEE0",
    systemText: "#9BA3B2",
    toolPendingBg: "#1F2A2F",
    toolSuccessBg: "#1E2D23",
    toolErrorBg: "#2F1F1F",
    toolTitle: "#F6C453",
    toolOutput: "#E1DACB",
    quote: "#8CC8FF",
    quoteBorder: "#3B4D6B",
    code: "#F0C987",
    codeBlock: "#1E232A",
    codeBorder: "#343A45",
    link: "#7DD3A5",
    error: "#F97066",
    success: "#7DD3A5",
};
var fg = function (hex) { return function (text) { return chalk_1.default.hex(hex)(text); }; };
var bg = function (hex) { return function (text) { return chalk_1.default.bgHex(hex)(text); }; };
var syntaxTheme = (0, syntax_theme_js_1.createSyntaxTheme)(fg(palette.code));
/**
 * Highlight code with syntax coloring.
 * Returns an array of lines with ANSI escape codes.
 */
function highlightCode(code, lang) {
    try {
        // Auto-detect can be slow for very large blocks; prefer explicit language when available.
        // Check if language is supported, fall back to auto-detect
        var language = lang && (0, cli_highlight_1.supportsLanguage)(lang) ? lang : undefined;
        var highlighted = (0, cli_highlight_1.highlight)(code, {
            language: language,
            theme: syntaxTheme,
            ignoreIllegals: true,
        });
        return highlighted.split("\n");
    }
    catch (_a) {
        // If highlighting fails, return plain code
        return code.split("\n").map(function (line) { return fg(palette.code)(line); });
    }
}
exports.theme = {
    fg: fg(palette.text),
    dim: fg(palette.dim),
    accent: fg(palette.accent),
    accentSoft: fg(palette.accentSoft),
    success: fg(palette.success),
    error: fg(palette.error),
    header: function (text) { return chalk_1.default.bold(fg(palette.accent)(text)); },
    system: fg(palette.systemText),
    userBg: bg(palette.userBg),
    userText: fg(palette.userText),
    toolTitle: fg(palette.toolTitle),
    toolOutput: fg(palette.toolOutput),
    toolPendingBg: bg(palette.toolPendingBg),
    toolSuccessBg: bg(palette.toolSuccessBg),
    toolErrorBg: bg(palette.toolErrorBg),
    border: fg(palette.border),
    bold: function (text) { return chalk_1.default.bold(text); },
    italic: function (text) { return chalk_1.default.italic(text); },
};
exports.markdownTheme = {
    heading: function (text) { return chalk_1.default.bold(fg(palette.accent)(text)); },
    link: function (text) { return fg(palette.link)(text); },
    linkUrl: function (text) { return chalk_1.default.dim(text); },
    code: function (text) { return fg(palette.code)(text); },
    codeBlock: function (text) { return fg(palette.code)(text); },
    codeBlockBorder: function (text) { return fg(palette.codeBorder)(text); },
    quote: function (text) { return fg(palette.quote)(text); },
    quoteBorder: function (text) { return fg(palette.quoteBorder)(text); },
    hr: function (text) { return fg(palette.border)(text); },
    listBullet: function (text) { return fg(palette.accentSoft)(text); },
    bold: function (text) { return chalk_1.default.bold(text); },
    italic: function (text) { return chalk_1.default.italic(text); },
    strikethrough: function (text) { return chalk_1.default.strikethrough(text); },
    underline: function (text) { return chalk_1.default.underline(text); },
    highlightCode: highlightCode,
};
exports.selectListTheme = {
    selectedPrefix: function (text) { return fg(palette.accent)(text); },
    selectedText: function (text) { return chalk_1.default.bold(fg(palette.accent)(text)); },
    description: function (text) { return fg(palette.dim)(text); },
    scrollInfo: function (text) { return fg(palette.dim)(text); },
    noMatch: function (text) { return fg(palette.dim)(text); },
};
exports.filterableSelectListTheme = __assign(__assign({}, exports.selectListTheme), { filterLabel: function (text) { return fg(palette.dim)(text); } });
exports.settingsListTheme = {
    label: function (text, selected) {
        return selected ? chalk_1.default.bold(fg(palette.accent)(text)) : fg(palette.text)(text);
    },
    value: function (text, selected) { return (selected ? fg(palette.accentSoft)(text) : fg(palette.dim)(text)); },
    description: function (text) { return fg(palette.systemText)(text); },
    cursor: fg(palette.accent)("→ "),
    hint: function (text) { return fg(palette.dim)(text); },
};
exports.editorTheme = {
    borderColor: function (text) { return fg(palette.border)(text); },
    selectList: exports.selectListTheme,
};
exports.searchableSelectListTheme = {
    selectedPrefix: function (text) { return fg(palette.accent)(text); },
    selectedText: function (text) { return chalk_1.default.bold(fg(palette.accent)(text)); },
    description: function (text) { return fg(palette.dim)(text); },
    scrollInfo: function (text) { return fg(palette.dim)(text); },
    noMatch: function (text) { return fg(palette.dim)(text); },
    searchPrompt: function (text) { return fg(palette.accentSoft)(text); },
    searchInput: function (text) { return fg(palette.text)(text); },
    matchHighlight: function (text) { return chalk_1.default.bold(fg(palette.accent)(text)); },
};
