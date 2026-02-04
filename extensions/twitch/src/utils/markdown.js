"use strict";
/**
 * Markdown utilities for Twitch chat
 *
 * Twitch chat doesn't support markdown formatting, so we strip it before sending.
 * Based on OpenClaw's markdownToText in src/agents/tools/web-fetch-utils.ts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripMarkdownForTwitch = stripMarkdownForTwitch;
exports.chunkTextForTwitch = chunkTextForTwitch;
/**
 * Strip markdown formatting from text for Twitch compatibility.
 *
 * Removes images, links, bold, italic, strikethrough, code blocks, inline code,
 * headers, and list formatting. Replaces newlines with spaces since Twitch
 * is a single-line chat medium.
 *
 * @param markdown - The markdown text to strip
 * @returns Plain text with markdown removed
 */
function stripMarkdownForTwitch(markdown) {
    return (markdown
        // Images
        .replace(/!\[[^\]]*]\([^)]+\)/g, "")
        // Links
        .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
        // Bold (**text**)
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        // Bold (__text__)
        .replace(/__([^_]+)__/g, "$1")
        // Italic (*text*)
        .replace(/\*([^*]+)\*/g, "$1")
        // Italic (_text_)
        .replace(/_([^_]+)_/g, "$1")
        // Strikethrough (~~text~~)
        .replace(/~~([^~]+)~~/g, "$1")
        // Code blocks
        .replace(/```[\s\S]*?```/g, function (block) { return block.replace(/```[^\n]*\n?/g, "").replace(/```/g, ""); })
        // Inline code
        .replace(/`([^`]+)`/g, "$1")
        // Headers
        .replace(/^#{1,6}\s+/gm, "")
        // Lists
        .replace(/^\s*[-*+]\s+/gm, "")
        .replace(/^\s*\d+\.\s+/gm, "")
        // Normalize whitespace
        .replace(/\r/g, "") // Remove carriage returns
        .replace(/[ \t]+\n/g, "\n") // Remove trailing spaces before newlines
        .replace(/\n/g, " ") // Replace newlines with spaces (for Twitch)
        .replace(/[ \t]{2,}/g, " ") // Reduce multiple spaces to single
        .trim());
}
/**
 * Simple word-boundary chunker for Twitch (500 char limit).
 * Strips markdown before chunking to avoid breaking markdown patterns.
 *
 * @param text - The text to chunk
 * @param limit - Maximum characters per chunk (Twitch limit is 500)
 * @returns Array of text chunks
 */
function chunkTextForTwitch(text, limit) {
    // First, strip markdown
    var cleaned = stripMarkdownForTwitch(text);
    if (!cleaned) {
        return [];
    }
    if (limit <= 0) {
        return [cleaned];
    }
    if (cleaned.length <= limit) {
        return [cleaned];
    }
    var chunks = [];
    var remaining = cleaned;
    while (remaining.length > limit) {
        // Find the last space before the limit
        var window_1 = remaining.slice(0, limit);
        var lastSpaceIndex = window_1.lastIndexOf(" ");
        if (lastSpaceIndex === -1) {
            // No space found, hard split at limit
            chunks.push(window_1);
            remaining = remaining.slice(limit);
        }
        else {
            // Split at the last space
            chunks.push(window_1.slice(0, lastSpaceIndex));
            remaining = remaining.slice(lastSpaceIndex + 1);
        }
    }
    if (remaining) {
        chunks.push(remaining);
    }
    return chunks;
}
