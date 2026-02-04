"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeMSTeamsConversationId = normalizeMSTeamsConversationId;
exports.extractMSTeamsConversationMessageId = extractMSTeamsConversationMessageId;
exports.parseMSTeamsActivityTimestamp = parseMSTeamsActivityTimestamp;
exports.stripMSTeamsMentionTags = stripMSTeamsMentionTags;
exports.wasMSTeamsBotMentioned = wasMSTeamsBotMentioned;
function normalizeMSTeamsConversationId(raw) {
    var _a;
    return (_a = raw.split(";")[0]) !== null && _a !== void 0 ? _a : raw;
}
function extractMSTeamsConversationMessageId(raw) {
    var _a, _b;
    if (!raw) {
        return undefined;
    }
    var match = /(?:^|;)messageid=([^;]+)/i.exec(raw);
    var value = (_b = (_a = match === null || match === void 0 ? void 0 : match[1]) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
    return value || undefined;
}
function parseMSTeamsActivityTimestamp(value) {
    if (!value) {
        return undefined;
    }
    if (value instanceof Date) {
        return value;
    }
    if (typeof value !== "string") {
        return undefined;
    }
    var date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
}
function stripMSTeamsMentionTags(text) {
    // Teams wraps mentions in <at>...</at> tags
    return text.replace(/<at[^>]*>.*?<\/at>/gi, "").trim();
}
function wasMSTeamsBotMentioned(activity) {
    var _a, _b;
    var botId = (_a = activity.recipient) === null || _a === void 0 ? void 0 : _a.id;
    if (!botId) {
        return false;
    }
    var entities = (_b = activity.entities) !== null && _b !== void 0 ? _b : [];
    return entities.some(function (e) { var _a; return e.type === "mention" && ((_a = e.mentioned) === null || _a === void 0 ? void 0 : _a.id) === botId; });
}
