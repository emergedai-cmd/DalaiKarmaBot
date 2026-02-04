"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRelativeTime = formatRelativeTime;
function formatRelativeTime(timestamp) {
    var now = Date.now();
    var diff = now - timestamp;
    var seconds = Math.floor(diff / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    if (seconds < 60) {
        return "just now";
    }
    if (minutes < 60) {
        return "".concat(minutes, "m ago");
    }
    if (hours < 24) {
        return "".concat(hours, "h ago");
    }
    if (days === 1) {
        return "Yesterday";
    }
    if (days < 7) {
        return "".concat(days, "d ago");
    }
    return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
