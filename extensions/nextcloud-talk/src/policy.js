"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeNextcloudTalkAllowlist = normalizeNextcloudTalkAllowlist;
exports.resolveNextcloudTalkAllowlistMatch = resolveNextcloudTalkAllowlistMatch;
exports.resolveNextcloudTalkRoomMatch = resolveNextcloudTalkRoomMatch;
exports.resolveNextcloudTalkGroupToolPolicy = resolveNextcloudTalkGroupToolPolicy;
exports.resolveNextcloudTalkRequireMention = resolveNextcloudTalkRequireMention;
exports.resolveNextcloudTalkGroupAllow = resolveNextcloudTalkGroupAllow;
exports.resolveNextcloudTalkMentionGate = resolveNextcloudTalkMentionGate;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
function normalizeAllowEntry(raw) {
    return raw
        .trim()
        .toLowerCase()
        .replace(/^(nextcloud-talk|nc-talk|nc):/i, "");
}
function normalizeNextcloudTalkAllowlist(values) {
    return (values !== null && values !== void 0 ? values : []).map(function (value) { return normalizeAllowEntry(String(value)); }).filter(Boolean);
}
function resolveNextcloudTalkAllowlistMatch(params) {
    var allowFrom = normalizeNextcloudTalkAllowlist(params.allowFrom);
    if (allowFrom.length === 0) {
        return { allowed: false };
    }
    if (allowFrom.includes("*")) {
        return { allowed: true, matchKey: "*", matchSource: "wildcard" };
    }
    var senderId = normalizeAllowEntry(params.senderId);
    if (allowFrom.includes(senderId)) {
        return { allowed: true, matchKey: senderId, matchSource: "id" };
    }
    var senderName = params.senderName ? normalizeAllowEntry(params.senderName) : "";
    if (senderName && allowFrom.includes(senderName)) {
        return { allowed: true, matchKey: senderName, matchSource: "name" };
    }
    return { allowed: false };
}
function resolveNextcloudTalkRoomMatch(params) {
    var _a, _b, _c;
    var rooms = (_a = params.rooms) !== null && _a !== void 0 ? _a : {};
    var allowlistConfigured = Object.keys(rooms).length > 0;
    var roomName = ((_b = params.roomName) === null || _b === void 0 ? void 0 : _b.trim()) || undefined;
    var roomCandidates = (0, plugin_sdk_1.buildChannelKeyCandidates)(params.roomToken, roomName, roomName ? (0, plugin_sdk_1.normalizeChannelSlug)(roomName) : undefined);
    var match = (0, plugin_sdk_1.resolveChannelEntryMatchWithFallback)({
        entries: rooms,
        keys: roomCandidates,
        wildcardKey: "*",
        normalizeKey: plugin_sdk_1.normalizeChannelSlug,
    });
    var roomConfig = match.entry;
    var allowed = (0, plugin_sdk_1.resolveNestedAllowlistDecision)({
        outerConfigured: allowlistConfigured,
        outerMatched: Boolean(roomConfig),
        innerConfigured: false,
        innerMatched: false,
    });
    return {
        roomConfig: roomConfig,
        wildcardConfig: match.wildcardEntry,
        roomKey: (_c = match.matchKey) !== null && _c !== void 0 ? _c : match.key,
        matchSource: match.matchSource,
        allowed: allowed,
        allowlistConfigured: allowlistConfigured,
    };
}
function resolveNextcloudTalkGroupToolPolicy(params) {
    var _a, _b, _c, _d, _e, _f, _g;
    var cfg = params.cfg;
    var roomToken = (_a = params.groupId) === null || _a === void 0 ? void 0 : _a.trim();
    if (!roomToken) {
        return undefined;
    }
    var roomName = ((_b = params.groupChannel) === null || _b === void 0 ? void 0 : _b.trim()) || undefined;
    var match = resolveNextcloudTalkRoomMatch({
        rooms: (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c["nextcloud-talk"]) === null || _d === void 0 ? void 0 : _d.rooms,
        roomToken: roomToken,
        roomName: roomName,
    });
    return (_f = (_e = match.roomConfig) === null || _e === void 0 ? void 0 : _e.tools) !== null && _f !== void 0 ? _f : (_g = match.wildcardConfig) === null || _g === void 0 ? void 0 : _g.tools;
}
function resolveNextcloudTalkRequireMention(params) {
    var _a, _b;
    if (typeof ((_a = params.roomConfig) === null || _a === void 0 ? void 0 : _a.requireMention) === "boolean") {
        return params.roomConfig.requireMention;
    }
    if (typeof ((_b = params.wildcardConfig) === null || _b === void 0 ? void 0 : _b.requireMention) === "boolean") {
        return params.wildcardConfig.requireMention;
    }
    return true;
}
function resolveNextcloudTalkGroupAllow(params) {
    if (params.groupPolicy === "disabled") {
        return { allowed: false, outerMatch: { allowed: false }, innerMatch: { allowed: false } };
    }
    if (params.groupPolicy === "open") {
        return { allowed: true, outerMatch: { allowed: true }, innerMatch: { allowed: true } };
    }
    var outerAllow = normalizeNextcloudTalkAllowlist(params.outerAllowFrom);
    var innerAllow = normalizeNextcloudTalkAllowlist(params.innerAllowFrom);
    if (outerAllow.length === 0 && innerAllow.length === 0) {
        return { allowed: false, outerMatch: { allowed: false }, innerMatch: { allowed: false } };
    }
    var outerMatch = resolveNextcloudTalkAllowlistMatch({
        allowFrom: params.outerAllowFrom,
        senderId: params.senderId,
        senderName: params.senderName,
    });
    var innerMatch = resolveNextcloudTalkAllowlistMatch({
        allowFrom: params.innerAllowFrom,
        senderId: params.senderId,
        senderName: params.senderName,
    });
    var allowed = (0, plugin_sdk_1.resolveNestedAllowlistDecision)({
        outerConfigured: outerAllow.length > 0 || innerAllow.length > 0,
        outerMatched: outerAllow.length > 0 ? outerMatch.allowed : true,
        innerConfigured: innerAllow.length > 0,
        innerMatched: innerMatch.allowed,
    });
    return { allowed: allowed, outerMatch: outerMatch, innerMatch: innerMatch };
}
function resolveNextcloudTalkMentionGate(params) {
    var result = (0, plugin_sdk_1.resolveMentionGatingWithBypass)({
        isGroup: params.isGroup,
        requireMention: params.requireMention,
        canDetectMention: true,
        wasMentioned: params.wasMentioned,
        allowTextCommands: params.allowTextCommands,
        hasControlCommand: params.hasControlCommand,
        commandAuthorized: params.commandAuthorized,
    });
    return { shouldSkip: result.shouldSkip, shouldBypassMention: result.shouldBypassMention };
}
