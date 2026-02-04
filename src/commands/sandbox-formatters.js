"use strict";
/**
 * Formatting utilities for sandbox CLI output
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatStatus = formatStatus;
exports.formatSimpleStatus = formatSimpleStatus;
exports.formatImageMatch = formatImageMatch;
exports.formatAge = formatAge;
exports.countRunning = countRunning;
exports.countMismatches = countMismatches;
function formatStatus(running) {
    return running ? "🟢 running" : "⚫ stopped";
}
function formatSimpleStatus(running) {
    return running ? "running" : "stopped";
}
function formatImageMatch(matches) {
    return matches ? "✓" : "⚠️  mismatch";
}
function formatAge(ms) {
    var seconds = Math.floor(ms / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    if (days > 0) {
        return "".concat(days, "d ").concat(hours % 24, "h");
    }
    if (hours > 0) {
        return "".concat(hours, "h ").concat(minutes % 60, "m");
    }
    if (minutes > 0) {
        return "".concat(minutes, "m");
    }
    return "".concat(seconds, "s");
}
function countRunning(items) {
    return items.filter(function (item) { return item.running; }).length;
}
function countMismatches(items) {
    return items.filter(function (item) { return !item.imageMatch; }).length;
}
