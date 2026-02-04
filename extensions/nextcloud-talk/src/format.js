"use strict";
/**
 * Format utilities for Nextcloud Talk messages.
 *
 * Nextcloud Talk supports markdown natively, so most formatting passes through.
 * This module handles any edge cases or transformations needed.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToNextcloudTalk = markdownToNextcloudTalk;
exports.escapeNextcloudTalkMarkdown = escapeNextcloudTalkMarkdown;
exports.formatNextcloudTalkMention = formatNextcloudTalkMention;
exports.formatNextcloudTalkCodeBlock = formatNextcloudTalkCodeBlock;
exports.formatNextcloudTalkInlineCode = formatNextcloudTalkInlineCode;
exports.stripNextcloudTalkFormatting = stripNextcloudTalkFormatting;
exports.truncateNextcloudTalkText = truncateNextcloudTalkText;
/**
 * Convert markdown to Nextcloud Talk compatible format.
 * Nextcloud Talk supports standard markdown, so minimal transformation needed.
 */
function markdownToNextcloudTalk(text) {
    return text.trim();
}
/**
 * Escape special characters in text to prevent markdown interpretation.
 */
function escapeNextcloudTalkMarkdown(text) {
    return text.replace(/([*_`~[\]()#>+\-=|{}!\\])/g, "\\$1");
}
/**
 * Format a mention for a Nextcloud user.
 * Nextcloud Talk uses @user format for mentions.
 */
function formatNextcloudTalkMention(userId) {
    return "@".concat(userId.replace(/^@/, ""));
}
/**
 * Format a code block for Nextcloud Talk.
 */
function formatNextcloudTalkCodeBlock(code, language) {
    var lang = language !== null && language !== void 0 ? language : "";
    return "```".concat(lang, "\n").concat(code, "\n```");
}
/**
 * Format inline code for Nextcloud Talk.
 */
function formatNextcloudTalkInlineCode(code) {
    if (code.includes("`")) {
        return "`` ".concat(code, " ``");
    }
    return "`".concat(code, "`");
}
/**
 * Strip Nextcloud Talk specific formatting from text.
 * Useful for extracting plain text content.
 */
function stripNextcloudTalkFormatting(text) {
    return text
        .replace(/```[\s\S]*?```/g, "")
        .replace(/`[^`]+`/g, "")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        .replace(/_([^_]+)_/g, "$1")
        .replace(/~~([^~]+)~~/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/\s+/g, " ")
        .trim();
}
/**
 * Truncate text to a maximum length, preserving word boundaries.
 */
function truncateNextcloudTalkText(text, maxLength, suffix) {
    if (suffix === void 0) { suffix = "..."; }
    if (text.length <= maxLength) {
        return text;
    }
    var truncated = text.slice(0, maxLength - suffix.length);
    var lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > maxLength * 0.7) {
        return truncated.slice(0, lastSpace) + suffix;
    }
    return truncated + suffix;
}
