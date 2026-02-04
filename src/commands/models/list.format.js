"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskApiKey = exports.truncate = exports.formatTag = exports.formatSeparator = exports.formatKeyValue = exports.formatValue = exports.formatKey = exports.pad = exports.isRich = void 0;
var theme_js_1 = require("../../terminal/theme.js");
var isRich = function (opts) {
    return Boolean((0, theme_js_1.isRich)() && !(opts === null || opts === void 0 ? void 0 : opts.json) && !(opts === null || opts === void 0 ? void 0 : opts.plain));
};
exports.isRich = isRich;
var pad = function (value, size) { return value.padEnd(size); };
exports.pad = pad;
var formatKey = function (key, rich) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.warn, key); };
exports.formatKey = formatKey;
var formatValue = function (value, rich) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.info, value); };
exports.formatValue = formatValue;
var formatKeyValue = function (key, value, rich, valueColor) {
    if (valueColor === void 0) { valueColor = theme_js_1.theme.info; }
    return "".concat((0, exports.formatKey)(key, rich), "=").concat((0, theme_js_1.colorize)(rich, valueColor, value));
};
exports.formatKeyValue = formatKeyValue;
var formatSeparator = function (rich) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, " | "); };
exports.formatSeparator = formatSeparator;
var formatTag = function (tag, rich) {
    if (!rich) {
        return tag;
    }
    if (tag === "default") {
        return theme_js_1.theme.success(tag);
    }
    if (tag === "image") {
        return theme_js_1.theme.accentBright(tag);
    }
    if (tag === "configured") {
        return theme_js_1.theme.accent(tag);
    }
    if (tag === "missing") {
        return theme_js_1.theme.error(tag);
    }
    if (tag.startsWith("fallback#")) {
        return theme_js_1.theme.warn(tag);
    }
    if (tag.startsWith("img-fallback#")) {
        return theme_js_1.theme.warn(tag);
    }
    if (tag.startsWith("alias:")) {
        return theme_js_1.theme.accentDim(tag);
    }
    return theme_js_1.theme.muted(tag);
};
exports.formatTag = formatTag;
var truncate = function (value, max) {
    if (value.length <= max) {
        return value;
    }
    if (max <= 3) {
        return value.slice(0, max);
    }
    return "".concat(value.slice(0, max - 3), "...");
};
exports.truncate = truncate;
var maskApiKey = function (value) {
    var trimmed = value.trim();
    if (!trimmed) {
        return "missing";
    }
    if (trimmed.length <= 16) {
        return trimmed;
    }
    return "".concat(trimmed.slice(0, 8), "...").concat(trimmed.slice(-8));
};
exports.maskApiKey = maskApiKey;
