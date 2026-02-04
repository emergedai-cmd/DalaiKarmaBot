"use strict";
/**
 * Message normalization utilities for chat rendering.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeMessage = normalizeMessage;
exports.normalizeRoleForGrouping = normalizeRoleForGrouping;
exports.isToolResultMessage = isToolResultMessage;
/**
 * Normalize a raw message object into a consistent structure.
 */
function normalizeMessage(message) {
    var m = message;
    var role = typeof m.role === "string" ? m.role : "unknown";
    // Detect tool messages by common gateway shapes.
    // Some tool events come through as assistant role with tool_* items in the content array.
    var hasToolId = typeof m.toolCallId === "string" || typeof m.tool_call_id === "string";
    var contentRaw = m.content;
    var contentItems = Array.isArray(contentRaw) ? contentRaw : null;
    var hasToolContent = Array.isArray(contentItems) &&
        contentItems.some(function (item) {
            var x = item;
            var t = (typeof x.type === "string" ? x.type : "").toLowerCase();
            return t === "toolresult" || t === "tool_result";
        });
    var hasToolName = typeof m.toolName === "string" || typeof m.tool_name === "string";
    if (hasToolId || hasToolContent || hasToolName) {
        role = "toolResult";
    }
    // Extract content
    var content = [];
    if (typeof m.content === "string") {
        content = [{ type: "text", text: m.content }];
    }
    else if (Array.isArray(m.content)) {
        content = m.content.map(function (item) { return ({
            type: item.type || "text",
            text: item.text,
            name: item.name,
            args: item.args || item.arguments,
        }); });
    }
    else if (typeof m.text === "string") {
        content = [{ type: "text", text: m.text }];
    }
    var timestamp = typeof m.timestamp === "number" ? m.timestamp : Date.now();
    var id = typeof m.id === "string" ? m.id : undefined;
    return { role: role, content: content, timestamp: timestamp, id: id };
}
/**
 * Normalize role for grouping purposes.
 */
function normalizeRoleForGrouping(role) {
    var lower = role.toLowerCase();
    // Preserve original casing when it's already a core role.
    if (role === "user" || role === "User") {
        return role;
    }
    if (role === "assistant") {
        return "assistant";
    }
    if (role === "system") {
        return "system";
    }
    // Keep tool-related roles distinct so the UI can style/toggle them.
    if (lower === "toolresult" ||
        lower === "tool_result" ||
        lower === "tool" ||
        lower === "function") {
        return "tool";
    }
    return role;
}
/**
 * Check if a message is a tool result message based on its role.
 */
function isToolResultMessage(message) {
    var m = message;
    var role = typeof m.role === "string" ? m.role.toLowerCase() : "";
    return role === "toolresult" || role === "tool_result";
}
