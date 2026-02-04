"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatModelName = formatModelName;
exports.isBotMentioned = isBotMentioned;
exports.isDmAllowed = isDmAllowed;
exports.extractMessageText = extractMessageText;
exports.isSummarizationRequest = isSummarizationRequest;
exports.formatChangesDate = formatChangesDate;
var targets_js_1 = require("../targets.js");
function formatModelName(modelString) {
    if (!modelString) {
        return "AI";
    }
    var modelName = modelString.includes("/") ? modelString.split("/")[1] : modelString;
    var modelMappings = {
        "claude-opus-4-5": "Claude Opus 4.5",
        "claude-sonnet-4-5": "Claude Sonnet 4.5",
        "claude-sonnet-3-5": "Claude Sonnet 3.5",
        "gpt-4o": "GPT-4o",
        "gpt-4-turbo": "GPT-4 Turbo",
        "gpt-4": "GPT-4",
        "gemini-2.0-flash": "Gemini 2.0 Flash",
        "gemini-pro": "Gemini Pro",
    };
    if (modelMappings[modelName]) {
        return modelMappings[modelName];
    }
    return modelName
        .replace(/-/g, " ")
        .split(" ")
        .map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1); })
        .join(" ");
}
function isBotMentioned(messageText, botShipName) {
    if (!messageText || !botShipName) {
        return false;
    }
    var normalizedBotShip = (0, targets_js_1.normalizeShip)(botShipName);
    var escapedShip = normalizedBotShip.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var mentionPattern = new RegExp("(^|\\s)".concat(escapedShip, "(?=\\s|$)"), "i");
    return mentionPattern.test(messageText);
}
function isDmAllowed(senderShip, allowlist) {
    if (!allowlist || allowlist.length === 0) {
        return true;
    }
    var normalizedSender = (0, targets_js_1.normalizeShip)(senderShip);
    return allowlist.map(function (ship) { return (0, targets_js_1.normalizeShip)(ship); }).some(function (ship) { return ship === normalizedSender; });
}
function extractMessageText(content) {
    if (!content || !Array.isArray(content)) {
        return "";
    }
    return (content
        // oxlint-disable-next-line typescript/no-explicit-any
        .map(function (block) {
        if (block.inline && Array.isArray(block.inline)) {
            return (block.inline
                // oxlint-disable-next-line typescript/no-explicit-any
                .map(function (item) {
                if (typeof item === "string") {
                    return item;
                }
                if (item && typeof item === "object") {
                    if (item.ship) {
                        return item.ship;
                    }
                    if (item.break !== undefined) {
                        return "\n";
                    }
                    if (item.link && item.link.href) {
                        return item.link.href;
                    }
                }
                return "";
            })
                .join(""));
        }
        return "";
    })
        .join("\n")
        .trim());
}
function isSummarizationRequest(messageText) {
    var patterns = [
        /summarize\s+(this\s+)?(channel|chat|conversation)/i,
        /what\s+did\s+i\s+miss/i,
        /catch\s+me\s+up/i,
        /channel\s+summary/i,
        /tldr/i,
    ];
    return patterns.some(function (pattern) { return pattern.test(messageText); });
}
function formatChangesDate(daysAgo) {
    if (daysAgo === void 0) { daysAgo = 5; }
    var now = new Date();
    var targetDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    var year = targetDate.getFullYear();
    var month = targetDate.getMonth() + 1;
    var day = targetDate.getDate();
    return "~".concat(year, ".").concat(month, ".").concat(day, "..20.19.51..9b9d");
}
