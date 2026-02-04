"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMSTeamsRouteConfig = resolveMSTeamsRouteConfig;
exports.resolveMSTeamsGroupToolPolicy = resolveMSTeamsGroupToolPolicy;
exports.resolveMSTeamsAllowlistMatch = resolveMSTeamsAllowlistMatch;
exports.resolveMSTeamsReplyPolicy = resolveMSTeamsReplyPolicy;
exports.isMSTeamsGroupAllowed = isMSTeamsGroupAllowed;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
function resolveMSTeamsRouteConfig(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var teamId = (_a = params.teamId) === null || _a === void 0 ? void 0 : _a.trim();
    var teamName = (_b = params.teamName) === null || _b === void 0 ? void 0 : _b.trim();
    var conversationId = (_c = params.conversationId) === null || _c === void 0 ? void 0 : _c.trim();
    var channelName = (_d = params.channelName) === null || _d === void 0 ? void 0 : _d.trim();
    var teams = (_f = (_e = params.cfg) === null || _e === void 0 ? void 0 : _e.teams) !== null && _f !== void 0 ? _f : {};
    var allowlistConfigured = Object.keys(teams).length > 0;
    var teamCandidates = (0, plugin_sdk_1.buildChannelKeyCandidates)(teamId, teamName, teamName ? (0, plugin_sdk_1.normalizeChannelSlug)(teamName) : undefined);
    var teamMatch = (0, plugin_sdk_1.resolveChannelEntryMatchWithFallback)({
        entries: teams,
        keys: teamCandidates,
        wildcardKey: "*",
        normalizeKey: plugin_sdk_1.normalizeChannelSlug,
    });
    var teamConfig = teamMatch.entry;
    var channels = (_g = teamConfig === null || teamConfig === void 0 ? void 0 : teamConfig.channels) !== null && _g !== void 0 ? _g : {};
    var channelAllowlistConfigured = Object.keys(channels).length > 0;
    var channelCandidates = (0, plugin_sdk_1.buildChannelKeyCandidates)(conversationId, channelName, channelName ? (0, plugin_sdk_1.normalizeChannelSlug)(channelName) : undefined);
    var channelMatch = (0, plugin_sdk_1.resolveChannelEntryMatchWithFallback)({
        entries: channels,
        keys: channelCandidates,
        wildcardKey: "*",
        normalizeKey: plugin_sdk_1.normalizeChannelSlug,
    });
    var channelConfig = channelMatch.entry;
    var allowed = (0, plugin_sdk_1.resolveNestedAllowlistDecision)({
        outerConfigured: allowlistConfigured,
        outerMatched: Boolean(teamConfig),
        innerConfigured: channelAllowlistConfigured,
        innerMatched: Boolean(channelConfig),
    });
    return {
        teamConfig: teamConfig,
        channelConfig: channelConfig,
        allowlistConfigured: allowlistConfigured,
        allowed: allowed,
        teamKey: (_h = teamMatch.matchKey) !== null && _h !== void 0 ? _h : teamMatch.key,
        channelKey: (_j = channelMatch.matchKey) !== null && _j !== void 0 ? _j : channelMatch.key,
        channelMatchKey: channelMatch.matchKey,
        channelMatchSource: channelMatch.matchSource === "direct" || channelMatch.matchSource === "wildcard"
            ? channelMatch.matchSource
            : undefined,
    };
}
function resolveMSTeamsGroupToolPolicy(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var cfg = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.msteams;
    if (!cfg) {
        return undefined;
    }
    var groupId = (_b = params.groupId) === null || _b === void 0 ? void 0 : _b.trim();
    var groupChannel = (_c = params.groupChannel) === null || _c === void 0 ? void 0 : _c.trim();
    var groupSpace = (_d = params.groupSpace) === null || _d === void 0 ? void 0 : _d.trim();
    var resolved = resolveMSTeamsRouteConfig({
        cfg: cfg,
        teamId: groupSpace,
        teamName: groupSpace,
        conversationId: groupId,
        channelName: groupChannel,
    });
    if (resolved.channelConfig) {
        var senderPolicy = (0, plugin_sdk_1.resolveToolsBySender)({
            toolsBySender: resolved.channelConfig.toolsBySender,
            senderId: params.senderId,
            senderName: params.senderName,
            senderUsername: params.senderUsername,
            senderE164: params.senderE164,
        });
        if (senderPolicy) {
            return senderPolicy;
        }
        if (resolved.channelConfig.tools) {
            return resolved.channelConfig.tools;
        }
        var teamSenderPolicy = (0, plugin_sdk_1.resolveToolsBySender)({
            toolsBySender: (_e = resolved.teamConfig) === null || _e === void 0 ? void 0 : _e.toolsBySender,
            senderId: params.senderId,
            senderName: params.senderName,
            senderUsername: params.senderUsername,
            senderE164: params.senderE164,
        });
        if (teamSenderPolicy) {
            return teamSenderPolicy;
        }
        return (_f = resolved.teamConfig) === null || _f === void 0 ? void 0 : _f.tools;
    }
    if (resolved.teamConfig) {
        var teamSenderPolicy = (0, plugin_sdk_1.resolveToolsBySender)({
            toolsBySender: resolved.teamConfig.toolsBySender,
            senderId: params.senderId,
            senderName: params.senderName,
            senderUsername: params.senderUsername,
            senderE164: params.senderE164,
        });
        if (teamSenderPolicy) {
            return teamSenderPolicy;
        }
        if (resolved.teamConfig.tools) {
            return resolved.teamConfig.tools;
        }
    }
    if (!groupId) {
        return undefined;
    }
    var channelCandidates = (0, plugin_sdk_1.buildChannelKeyCandidates)(groupId, groupChannel, groupChannel ? (0, plugin_sdk_1.normalizeChannelSlug)(groupChannel) : undefined);
    for (var _i = 0, _j = Object.values((_g = cfg.teams) !== null && _g !== void 0 ? _g : {}); _i < _j.length; _i++) {
        var teamConfig = _j[_i];
        var match = (0, plugin_sdk_1.resolveChannelEntryMatchWithFallback)({
            entries: (_h = teamConfig === null || teamConfig === void 0 ? void 0 : teamConfig.channels) !== null && _h !== void 0 ? _h : {},
            keys: channelCandidates,
            wildcardKey: "*",
            normalizeKey: plugin_sdk_1.normalizeChannelSlug,
        });
        if (match.entry) {
            var senderPolicy = (0, plugin_sdk_1.resolveToolsBySender)({
                toolsBySender: match.entry.toolsBySender,
                senderId: params.senderId,
                senderName: params.senderName,
                senderUsername: params.senderUsername,
                senderE164: params.senderE164,
            });
            if (senderPolicy) {
                return senderPolicy;
            }
            if (match.entry.tools) {
                return match.entry.tools;
            }
            var teamSenderPolicy = (0, plugin_sdk_1.resolveToolsBySender)({
                toolsBySender: teamConfig === null || teamConfig === void 0 ? void 0 : teamConfig.toolsBySender,
                senderId: params.senderId,
                senderName: params.senderName,
                senderUsername: params.senderUsername,
                senderE164: params.senderE164,
            });
            if (teamSenderPolicy) {
                return teamSenderPolicy;
            }
            return teamConfig === null || teamConfig === void 0 ? void 0 : teamConfig.tools;
        }
    }
    return undefined;
}
function resolveMSTeamsAllowlistMatch(params) {
    var _a;
    var allowFrom = params.allowFrom
        .map(function (entry) { return String(entry).trim().toLowerCase(); })
        .filter(Boolean);
    if (allowFrom.length === 0) {
        return { allowed: false };
    }
    if (allowFrom.includes("*")) {
        return { allowed: true, matchKey: "*", matchSource: "wildcard" };
    }
    var senderId = params.senderId.toLowerCase();
    if (allowFrom.includes(senderId)) {
        return { allowed: true, matchKey: senderId, matchSource: "id" };
    }
    var senderName = (_a = params.senderName) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (senderName && allowFrom.includes(senderName)) {
        return { allowed: true, matchKey: senderName, matchSource: "name" };
    }
    return { allowed: false };
}
function resolveMSTeamsReplyPolicy(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    if (params.isDirectMessage) {
        return { requireMention: false, replyStyle: "thread" };
    }
    var requireMention = (_f = (_d = (_b = (_a = params.channelConfig) === null || _a === void 0 ? void 0 : _a.requireMention) !== null && _b !== void 0 ? _b : (_c = params.teamConfig) === null || _c === void 0 ? void 0 : _c.requireMention) !== null && _d !== void 0 ? _d : (_e = params.globalConfig) === null || _e === void 0 ? void 0 : _e.requireMention) !== null && _f !== void 0 ? _f : true;
    var explicitReplyStyle = (_k = (_h = (_g = params.channelConfig) === null || _g === void 0 ? void 0 : _g.replyStyle) !== null && _h !== void 0 ? _h : (_j = params.teamConfig) === null || _j === void 0 ? void 0 : _j.replyStyle) !== null && _k !== void 0 ? _k : (_l = params.globalConfig) === null || _l === void 0 ? void 0 : _l.replyStyle;
    var replyStyle = explicitReplyStyle !== null && explicitReplyStyle !== void 0 ? explicitReplyStyle : (requireMention ? "thread" : "top-level");
    return { requireMention: requireMention, replyStyle: replyStyle };
}
function isMSTeamsGroupAllowed(params) {
    var groupPolicy = params.groupPolicy;
    if (groupPolicy === "disabled") {
        return false;
    }
    if (groupPolicy === "open") {
        return true;
    }
    return resolveMSTeamsAllowlistMatch(params).allowed;
}
