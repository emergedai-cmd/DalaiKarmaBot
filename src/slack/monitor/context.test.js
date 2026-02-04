"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var context_js_1 = require("./context.js");
var baseParams = function () { return ({
    cfg: {},
    accountId: "default",
    botToken: "token",
    app: { client: {} },
    runtime: {},
    botUserId: "B1",
    teamId: "T1",
    apiAppId: "A1",
    historyLimit: 0,
    sessionScope: "per-sender",
    mainKey: "main",
    dmEnabled: true,
    dmPolicy: "open",
    allowFrom: [],
    groupDmEnabled: true,
    groupDmChannels: [],
    defaultRequireMention: true,
    groupPolicy: "open",
    useAccessGroups: false,
    reactionMode: "off",
    reactionAllowlist: [],
    replyToMode: "off",
    slashCommand: {
        enabled: false,
        name: "openclaw",
        sessionPrefix: "slack:slash",
        ephemeral: true,
    },
    textLimit: 4000,
    ackReactionScope: "group-mentions",
    mediaMaxBytes: 1,
    removeAckAfterReply: false,
}); };
(0, vitest_1.describe)("normalizeSlackChannelType", function () {
    (0, vitest_1.it)("infers channel types from ids when missing", function () {
        (0, vitest_1.expect)((0, context_js_1.normalizeSlackChannelType)(undefined, "C123")).toBe("channel");
        (0, vitest_1.expect)((0, context_js_1.normalizeSlackChannelType)(undefined, "D123")).toBe("im");
        (0, vitest_1.expect)((0, context_js_1.normalizeSlackChannelType)(undefined, "G123")).toBe("group");
    });
    (0, vitest_1.it)("prefers explicit channel_type values", function () {
        (0, vitest_1.expect)((0, context_js_1.normalizeSlackChannelType)("mpim", "C123")).toBe("mpim");
    });
});
(0, vitest_1.describe)("resolveSlackSystemEventSessionKey", function () {
    (0, vitest_1.it)("defaults missing channel_type to channel sessions", function () {
        var ctx = (0, context_js_1.createSlackMonitorContext)(baseParams());
        (0, vitest_1.expect)(ctx.resolveSlackSystemEventSessionKey({ channelId: "C123" })).toBe("agent:main:slack:channel:c123");
    });
});
(0, vitest_1.describe)("isChannelAllowed with groupPolicy and channelsConfig", function () {
    (0, vitest_1.it)("allows unlisted channels when groupPolicy is open even with channelsConfig entries", function () {
        // Bug fix: when groupPolicy="open" and channels has some entries,
        // unlisted channels should still be allowed (not blocked)
        var ctx = (0, context_js_1.createSlackMonitorContext)(__assign(__assign({}, baseParams()), { groupPolicy: "open", channelsConfig: {
                C_LISTED: { requireMention: true },
            } }));
        // Listed channel should be allowed
        (0, vitest_1.expect)(ctx.isChannelAllowed({ channelId: "C_LISTED", channelType: "channel" })).toBe(true);
        // Unlisted channel should ALSO be allowed when policy is "open"
        (0, vitest_1.expect)(ctx.isChannelAllowed({ channelId: "C_UNLISTED", channelType: "channel" })).toBe(true);
    });
    (0, vitest_1.it)("blocks unlisted channels when groupPolicy is allowlist", function () {
        var ctx = (0, context_js_1.createSlackMonitorContext)(__assign(__assign({}, baseParams()), { groupPolicy: "allowlist", channelsConfig: {
                C_LISTED: { requireMention: true },
            } }));
        // Listed channel should be allowed
        (0, vitest_1.expect)(ctx.isChannelAllowed({ channelId: "C_LISTED", channelType: "channel" })).toBe(true);
        // Unlisted channel should be blocked when policy is "allowlist"
        (0, vitest_1.expect)(ctx.isChannelAllowed({ channelId: "C_UNLISTED", channelType: "channel" })).toBe(false);
    });
    (0, vitest_1.it)("blocks explicitly denied channels even when groupPolicy is open", function () {
        var ctx = (0, context_js_1.createSlackMonitorContext)(__assign(__assign({}, baseParams()), { groupPolicy: "open", channelsConfig: {
                C_ALLOWED: { allow: true },
                C_DENIED: { allow: false },
            } }));
        // Explicitly allowed channel
        (0, vitest_1.expect)(ctx.isChannelAllowed({ channelId: "C_ALLOWED", channelType: "channel" })).toBe(true);
        // Explicitly denied channel should be blocked even with open policy
        (0, vitest_1.expect)(ctx.isChannelAllowed({ channelId: "C_DENIED", channelType: "channel" })).toBe(false);
        // Unlisted channel should be allowed with open policy
        (0, vitest_1.expect)(ctx.isChannelAllowed({ channelId: "C_UNLISTED", channelType: "channel" })).toBe(true);
    });
    (0, vitest_1.it)("allows all channels when groupPolicy is open and channelsConfig is empty", function () {
        var ctx = (0, context_js_1.createSlackMonitorContext)(__assign(__assign({}, baseParams()), { groupPolicy: "open", channelsConfig: undefined }));
        (0, vitest_1.expect)(ctx.isChannelAllowed({ channelId: "C_ANY", channelType: "channel" })).toBe(true);
    });
});
