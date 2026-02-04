"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractToolCards = extractToolCards;
exports.renderToolCardSidebar = renderToolCardSidebar;
var lit_1 = require("lit");
var icons_1 = require("../icons");
var tool_display_1 = require("../tool-display");
var constants_1 = require("./constants");
var message_extract_1 = require("./message-extract");
var message_normalizer_1 = require("./message-normalizer");
var tool_helpers_1 = require("./tool-helpers");
function extractToolCards(message) {
    var _a, _b, _c;
    var m = message;
    var content = normalizeContent(m.content);
    var cards = [];
    for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
        var item = content_1[_i];
        var kind = (typeof item.type === "string" ? item.type : "").toLowerCase();
        var isToolCall = ["toolcall", "tool_call", "tooluse", "tool_use"].includes(kind) ||
            (typeof item.name === "string" && item.arguments != null);
        if (isToolCall) {
            cards.push({
                kind: "call",
                name: (_a = item.name) !== null && _a !== void 0 ? _a : "tool",
                args: coerceArgs((_b = item.arguments) !== null && _b !== void 0 ? _b : item.args),
            });
        }
    }
    for (var _d = 0, content_2 = content; _d < content_2.length; _d++) {
        var item = content_2[_d];
        var kind = (typeof item.type === "string" ? item.type : "").toLowerCase();
        if (kind !== "toolresult" && kind !== "tool_result") {
            continue;
        }
        var text = extractToolText(item);
        var name_1 = typeof item.name === "string" ? item.name : "tool";
        cards.push({ kind: "result", name: name_1, text: text });
    }
    if ((0, message_normalizer_1.isToolResultMessage)(message) && !cards.some(function (card) { return card.kind === "result"; })) {
        var name_2 = (typeof m.toolName === "string" && m.toolName) ||
            (typeof m.tool_name === "string" && m.tool_name) ||
            "tool";
        var text = (_c = (0, message_extract_1.extractTextCached)(message)) !== null && _c !== void 0 ? _c : undefined;
        cards.push({ kind: "result", name: name_2, text: text });
    }
    return cards;
}
function renderToolCardSidebar(card, onOpenSidebar) {
    var _a, _b, _c;
    var display = (0, tool_display_1.resolveToolDisplay)({ name: card.name, args: card.args });
    var detail = (0, tool_display_1.formatToolDetail)(display);
    var hasText = Boolean((_a = card.text) === null || _a === void 0 ? void 0 : _a.trim());
    var canClick = Boolean(onOpenSidebar);
    var handleClick = canClick
        ? function () {
            if (hasText) {
                onOpenSidebar((0, tool_helpers_1.formatToolOutputForSidebar)(card.text));
                return;
            }
            var info = "## ".concat(display.label, "\n\n").concat(detail ? "**Command:** `".concat(detail, "`\n\n") : "", "*No output \u2014 tool completed successfully.*");
            onOpenSidebar(info);
        }
        : undefined;
    var isShort = hasText && ((_c = (_b = card.text) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) <= constants_1.TOOL_INLINE_THRESHOLD;
    var showCollapsed = hasText && !isShort;
    var showInline = hasText && isShort;
    var isEmpty = !hasText;
    return (0, lit_1.html)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    <div\n      class=\"chat-tool-card ", "\"\n      @click=", "\n      role=", "\n      tabindex=", "\n      @keydown=", "\n    >\n      <div class=\"chat-tool-card__header\">\n        <div class=\"chat-tool-card__title\">\n          <span class=\"chat-tool-card__icon\">", "</span>\n          <span>", "</span>\n        </div>\n        ", "\n        ", "\n      </div>\n      ", "\n      ", "\n      ", "\n      ", "\n    </div>\n  "], ["\n    <div\n      class=\"chat-tool-card ", "\"\n      @click=", "\n      role=", "\n      tabindex=", "\n      @keydown=", "\n    >\n      <div class=\"chat-tool-card__header\">\n        <div class=\"chat-tool-card__title\">\n          <span class=\"chat-tool-card__icon\">", "</span>\n          <span>", "</span>\n        </div>\n        ", "\n        ", "\n      </div>\n      ", "\n      ", "\n      ", "\n      ", "\n    </div>\n  "])), canClick ? "chat-tool-card--clickable" : "", handleClick, canClick ? "button" : lit_1.nothing, canClick ? "0" : lit_1.nothing, canClick
        ? function (e) {
            if (e.key !== "Enter" && e.key !== " ") {
                return;
            }
            e.preventDefault();
            handleClick === null || handleClick === void 0 ? void 0 : handleClick();
        }
        : lit_1.nothing, icons_1.icons[display.icon], display.label, canClick
        ? (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<span class=\"chat-tool-card__action\">", " ", "</span>"], ["<span class=\"chat-tool-card__action\">", " ", "</span>"])), hasText ? "View" : "", icons_1.icons.check) : lit_1.nothing, isEmpty && !canClick ? (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<span class=\"chat-tool-card__status\">", "</span>"], ["<span class=\"chat-tool-card__status\">", "</span>"])), icons_1.icons.check) : lit_1.nothing, detail ? (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["<div class=\"chat-tool-card__detail\">", "</div>"], ["<div class=\"chat-tool-card__detail\">", "</div>"])), detail) : lit_1.nothing, isEmpty
        ? (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n              <div class=\"chat-tool-card__status-text muted\">Completed</div>\n            "], ["\n              <div class=\"chat-tool-card__status-text muted\">Completed</div>\n            "]))) : lit_1.nothing, showCollapsed
        ? (0, lit_1.html)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["<div class=\"chat-tool-card__preview mono\">", "</div>"], ["<div class=\"chat-tool-card__preview mono\">", "</div>"])), (0, tool_helpers_1.getTruncatedPreview)(card.text)) : lit_1.nothing, showInline ? (0, lit_1.html)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["<div class=\"chat-tool-card__inline mono\">", "</div>"], ["<div class=\"chat-tool-card__inline mono\">", "</div>"])), card.text) : lit_1.nothing);
}
function normalizeContent(content) {
    if (!Array.isArray(content)) {
        return [];
    }
    return content.filter(Boolean);
}
function coerceArgs(value) {
    if (typeof value !== "string") {
        return value;
    }
    var trimmed = value.trim();
    if (!trimmed) {
        return value;
    }
    if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
        return value;
    }
    try {
        return JSON.parse(trimmed);
    }
    catch (_a) {
        return value;
    }
}
function extractToolText(item) {
    if (typeof item.text === "string") {
        return item.text;
    }
    if (typeof item.content === "string") {
        return item.content;
    }
    return undefined;
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
