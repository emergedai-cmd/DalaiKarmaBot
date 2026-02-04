"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderReadingIndicatorGroup = renderReadingIndicatorGroup;
exports.renderStreamingGroup = renderStreamingGroup;
exports.renderMessageGroup = renderMessageGroup;
var lit_1 = require("lit");
var unsafe_html_js_1 = require("lit/directives/unsafe-html.js");
var markdown_1 = require("../markdown");
var copy_as_markdown_1 = require("./copy-as-markdown");
var message_extract_1 = require("./message-extract");
var message_normalizer_1 = require("./message-normalizer");
var tool_cards_1 = require("./tool-cards");
function extractImages(message) {
    var m = message;
    var content = m.content;
    var images = [];
    if (Array.isArray(content)) {
        for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
            var block = content_1[_i];
            if (typeof block !== "object" || block === null) {
                continue;
            }
            var b = block;
            if (b.type === "image") {
                // Handle source object format (from sendChatMessage)
                var source = b.source;
                if ((source === null || source === void 0 ? void 0 : source.type) === "base64" && typeof source.data === "string") {
                    var data = source.data;
                    var mediaType = source.media_type || "image/png";
                    // If data is already a data URL, use it directly
                    var url = data.startsWith("data:") ? data : "data:".concat(mediaType, ";base64,").concat(data);
                    images.push({ url: url });
                }
                else if (typeof b.url === "string") {
                    images.push({ url: b.url });
                }
            }
            else if (b.type === "image_url") {
                // OpenAI format
                var imageUrl = b.image_url;
                if (typeof (imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.url) === "string") {
                    images.push({ url: imageUrl.url });
                }
            }
        }
    }
    return images;
}
function renderReadingIndicatorGroup(assistant) {
    return (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <div class=\"chat-group assistant\">\n      ", "\n      <div class=\"chat-group-messages\">\n        <div class=\"chat-bubble chat-reading-indicator\" aria-hidden=\"true\">\n          <span class=\"chat-reading-indicator__dots\">\n            <span></span><span></span><span></span>\n          </span>\n        </div>\n      </div>\n    </div>\n  "], ["\n    <div class=\"chat-group assistant\">\n      ", "\n      <div class=\"chat-group-messages\">\n        <div class=\"chat-bubble chat-reading-indicator\" aria-hidden=\"true\">\n          <span class=\"chat-reading-indicator__dots\">\n            <span></span><span></span><span></span>\n          </span>\n        </div>\n      </div>\n    </div>\n  "])), renderAvatar("assistant", assistant));
}
function renderStreamingGroup(text, startedAt, onOpenSidebar, assistant) {
    var _a;
    var timestamp = new Date(startedAt).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
    var name = (_a = assistant === null || assistant === void 0 ? void 0 : assistant.name) !== null && _a !== void 0 ? _a : "Assistant";
    return (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    <div class=\"chat-group assistant\">\n      ", "\n      <div class=\"chat-group-messages\">\n        ", "\n        <div class=\"chat-group-footer\">\n          <span class=\"chat-sender-name\">", "</span>\n          <span class=\"chat-group-timestamp\">", "</span>\n        </div>\n      </div>\n    </div>\n  "], ["\n    <div class=\"chat-group assistant\">\n      ", "\n      <div class=\"chat-group-messages\">\n        ", "\n        <div class=\"chat-group-footer\">\n          <span class=\"chat-sender-name\">", "</span>\n          <span class=\"chat-group-timestamp\">", "</span>\n        </div>\n      </div>\n    </div>\n  "])), renderAvatar("assistant", assistant), renderGroupedMessage({
        role: "assistant",
        content: [{ type: "text", text: text }],
        timestamp: startedAt,
    }, { isStreaming: true, showReasoning: false }, onOpenSidebar), name, timestamp);
}
function renderMessageGroup(group, opts) {
    var _a, _b;
    var normalizedRole = (0, message_normalizer_1.normalizeRoleForGrouping)(group.role);
    var assistantName = (_a = opts.assistantName) !== null && _a !== void 0 ? _a : "Assistant";
    var who = normalizedRole === "user"
        ? "You"
        : normalizedRole === "assistant"
            ? assistantName
            : normalizedRole;
    var roleClass = normalizedRole === "user" ? "user" : normalizedRole === "assistant" ? "assistant" : "other";
    var timestamp = new Date(group.timestamp).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
    return (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    <div class=\"chat-group ", "\">\n      ", "\n      <div class=\"chat-group-messages\">\n        ", "\n        <div class=\"chat-group-footer\">\n          <span class=\"chat-sender-name\">", "</span>\n          <span class=\"chat-group-timestamp\">", "</span>\n        </div>\n      </div>\n    </div>\n  "], ["\n    <div class=\"chat-group ", "\">\n      ", "\n      <div class=\"chat-group-messages\">\n        ", "\n        <div class=\"chat-group-footer\">\n          <span class=\"chat-sender-name\">", "</span>\n          <span class=\"chat-group-timestamp\">", "</span>\n        </div>\n      </div>\n    </div>\n  "])), roleClass, renderAvatar(group.role, {
        name: assistantName,
        avatar: (_b = opts.assistantAvatar) !== null && _b !== void 0 ? _b : null,
    }), group.messages.map(function (item, index) {
        return renderGroupedMessage(item.message, {
            isStreaming: group.isStreaming && index === group.messages.length - 1,
            showReasoning: opts.showReasoning,
        }, opts.onOpenSidebar);
    }), who, timestamp);
}
function renderAvatar(role, assistant) {
    var _a, _b;
    var normalized = (0, message_normalizer_1.normalizeRoleForGrouping)(role);
    var assistantName = ((_a = assistant === null || assistant === void 0 ? void 0 : assistant.name) === null || _a === void 0 ? void 0 : _a.trim()) || "Assistant";
    var assistantAvatar = ((_b = assistant === null || assistant === void 0 ? void 0 : assistant.avatar) === null || _b === void 0 ? void 0 : _b.trim()) || "";
    var initial = normalized === "user"
        ? "U"
        : normalized === "assistant"
            ? assistantName.charAt(0).toUpperCase() || "A"
            : normalized === "tool"
                ? "⚙"
                : "?";
    var className = normalized === "user"
        ? "user"
        : normalized === "assistant"
            ? "assistant"
            : normalized === "tool"
                ? "tool"
                : "other";
    if (assistantAvatar && normalized === "assistant") {
        if (isAvatarUrl(assistantAvatar)) {
            return (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["<img\n        class=\"chat-avatar ", "\"\n        src=\"", "\"\n        alt=\"", "\"\n      />"], ["<img\n        class=\"chat-avatar ", "\"\n        src=\"", "\"\n        alt=\"", "\"\n      />"])), className, assistantAvatar, assistantName);
        }
        return (0, lit_1.html)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["<div class=\"chat-avatar ", "\">", "</div>"], ["<div class=\"chat-avatar ", "\">", "</div>"])), className, assistantAvatar);
    }
    return (0, lit_1.html)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["<div class=\"chat-avatar ", "\">", "</div>"], ["<div class=\"chat-avatar ", "\">", "</div>"])), className, initial);
}
function isAvatarUrl(value) {
    return (/^https?:\/\//i.test(value) || /^data:image\//i.test(value) || value.startsWith("/") // Relative paths from avatar endpoint
    );
}
function renderMessageImages(images) {
    if (images.length === 0) {
        return lit_1.nothing;
    }
    return (0, lit_1.html)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n    <div class=\"chat-message-images\">\n      ", "\n    </div>\n  "], ["\n    <div class=\"chat-message-images\">\n      ", "\n    </div>\n  "])), images.map(function (img) {
        var _a;
        return (0, lit_1.html)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n          <img\n            src=", "\n            alt=", "\n            class=\"chat-message-image\"\n            @click=", "\n          />\n        "], ["\n          <img\n            src=", "\n            alt=", "\n            class=\"chat-message-image\"\n            @click=", "\n          />\n        "])), img.url, (_a = img.alt) !== null && _a !== void 0 ? _a : "Attached image", function () { return window.open(img.url, "_blank"); });
    }));
}
function renderGroupedMessage(message, opts, onOpenSidebar) {
    var m = message;
    var role = typeof m.role === "string" ? m.role : "unknown";
    var isToolResult = (0, message_normalizer_1.isToolResultMessage)(message) ||
        role.toLowerCase() === "toolresult" ||
        role.toLowerCase() === "tool_result" ||
        typeof m.toolCallId === "string" ||
        typeof m.tool_call_id === "string";
    var toolCards = (0, tool_cards_1.extractToolCards)(message);
    var hasToolCards = toolCards.length > 0;
    var images = extractImages(message);
    var hasImages = images.length > 0;
    var extractedText = (0, message_extract_1.extractTextCached)(message);
    var extractedThinking = opts.showReasoning && role === "assistant" ? (0, message_extract_1.extractThinkingCached)(message) : null;
    var markdownBase = (extractedText === null || extractedText === void 0 ? void 0 : extractedText.trim()) ? extractedText : null;
    var reasoningMarkdown = extractedThinking ? (0, message_extract_1.formatReasoningMarkdown)(extractedThinking) : null;
    var markdown = markdownBase;
    var canCopyMarkdown = role === "assistant" && Boolean(markdown === null || markdown === void 0 ? void 0 : markdown.trim());
    var bubbleClasses = [
        "chat-bubble",
        canCopyMarkdown ? "has-copy" : "",
        opts.isStreaming ? "streaming" : "",
        "fade-in",
    ]
        .filter(Boolean)
        .join(" ");
    if (!markdown && hasToolCards && isToolResult) {
        return (0, lit_1.html)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["", ""], ["", ""])), toolCards.map(function (card) { return (0, tool_cards_1.renderToolCardSidebar)(card, onOpenSidebar); }));
    }
    if (!markdown && !hasToolCards && !hasImages) {
        return lit_1.nothing;
    }
    return (0, lit_1.html)(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n    <div class=\"", "\">\n      ", "\n      ", "\n      ", "\n      ", "\n      ", "\n    </div>\n  "], ["\n    <div class=\"", "\">\n      ", "\n      ", "\n      ", "\n      ", "\n      ", "\n    </div>\n  "])), bubbleClasses, canCopyMarkdown ? (0, copy_as_markdown_1.renderCopyAsMarkdownButton)(markdown) : lit_1.nothing, renderMessageImages(images), reasoningMarkdown
        ? (0, lit_1.html)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["<div class=\"chat-thinking\">", "</div>"], ["<div class=\"chat-thinking\">", "</div>"])), (0, unsafe_html_js_1.unsafeHTML)((0, markdown_1.toSanitizedMarkdownHtml)(reasoningMarkdown))) : lit_1.nothing, markdown
        ? (0, lit_1.html)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["<div class=\"chat-text\">", "</div>"], ["<div class=\"chat-text\">", "</div>"])), (0, unsafe_html_js_1.unsafeHTML)((0, markdown_1.toSanitizedMarkdownHtml)(markdown))) : lit_1.nothing, toolCards.map(function (card) { return (0, tool_cards_1.renderToolCardSidebar)(card, onOpenSidebar); }));
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
