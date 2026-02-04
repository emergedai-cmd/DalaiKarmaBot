"use strict";
/**
 * Helper functions for tool card rendering.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatToolOutputForSidebar = formatToolOutputForSidebar;
exports.getTruncatedPreview = getTruncatedPreview;
var constants_1 = require("./constants");
/**
 * Format tool output content for display in the sidebar.
 * Detects JSON and wraps it in a code block with formatting.
 */
function formatToolOutputForSidebar(text) {
    var trimmed = text.trim();
    // Try to detect and format JSON
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        try {
            var parsed = JSON.parse(trimmed);
            return "```json\n" + JSON.stringify(parsed, null, 2) + "\n```";
        }
        catch (_a) {
            // Not valid JSON, return as-is
        }
    }
    return text;
}
/**
 * Get a truncated preview of tool output text.
 * Truncates to first N lines or first N characters, whichever is shorter.
 */
function getTruncatedPreview(text) {
    var allLines = text.split("\n");
    var lines = allLines.slice(0, constants_1.PREVIEW_MAX_LINES);
    var preview = lines.join("\n");
    if (preview.length > constants_1.PREVIEW_MAX_CHARS) {
        return preview.slice(0, constants_1.PREVIEW_MAX_CHARS) + "…";
    }
    return lines.length < allLines.length ? preview + "…" : preview;
}
