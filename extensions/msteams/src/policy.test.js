"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var policy_js_1 = require("./policy.js");
(0, vitest_1.describe)("msteams policy", function () {
    (0, vitest_1.describe)("resolveMSTeamsRouteConfig", function () {
        (0, vitest_1.it)("returns team and channel config when present", function () {
            var _a, _b;
            var cfg = {
                teams: {
                    team123: {
                        requireMention: false,
                        channels: {
                            chan456: { requireMention: true },
                        },
                    },
                },
            };
            var res = (0, policy_js_1.resolveMSTeamsRouteConfig)({
                cfg: cfg,
                teamId: "team123",
                conversationId: "chan456",
            });
            (0, vitest_1.expect)((_a = res.teamConfig) === null || _a === void 0 ? void 0 : _a.requireMention).toBe(false);
            (0, vitest_1.expect)((_b = res.channelConfig) === null || _b === void 0 ? void 0 : _b.requireMention).toBe(true);
            (0, vitest_1.expect)(res.allowlistConfigured).toBe(true);
            (0, vitest_1.expect)(res.allowed).toBe(true);
            (0, vitest_1.expect)(res.channelMatchKey).toBe("chan456");
            (0, vitest_1.expect)(res.channelMatchSource).toBe("direct");
        });
        (0, vitest_1.it)("returns undefined configs when teamId is missing", function () {
            var cfg = {
                teams: { team123: { requireMention: false } },
            };
            var res = (0, policy_js_1.resolveMSTeamsRouteConfig)({
                cfg: cfg,
                teamId: undefined,
                conversationId: "chan",
            });
            (0, vitest_1.expect)(res.teamConfig).toBeUndefined();
            (0, vitest_1.expect)(res.channelConfig).toBeUndefined();
            (0, vitest_1.expect)(res.allowlistConfigured).toBe(true);
            (0, vitest_1.expect)(res.allowed).toBe(false);
        });
        (0, vitest_1.it)("matches team and channel by name", function () {
            var _a, _b;
            var cfg = {
                teams: {
                    "My Team": {
                        requireMention: true,
                        channels: {
                            "General Chat": { requireMention: false },
                        },
                    },
                },
            };
            var res = (0, policy_js_1.resolveMSTeamsRouteConfig)({
                cfg: cfg,
                teamName: "My Team",
                channelName: "General Chat",
                conversationId: "ignored",
            });
            (0, vitest_1.expect)((_a = res.teamConfig) === null || _a === void 0 ? void 0 : _a.requireMention).toBe(true);
            (0, vitest_1.expect)((_b = res.channelConfig) === null || _b === void 0 ? void 0 : _b.requireMention).toBe(false);
            (0, vitest_1.expect)(res.allowed).toBe(true);
        });
    });
    (0, vitest_1.describe)("resolveMSTeamsReplyPolicy", function () {
        (0, vitest_1.it)("forces thread replies for direct messages", function () {
            var policy = (0, policy_js_1.resolveMSTeamsReplyPolicy)({
                isDirectMessage: true,
                globalConfig: { replyStyle: "top-level", requireMention: false },
            });
            (0, vitest_1.expect)(policy).toEqual({ requireMention: false, replyStyle: "thread" });
        });
        (0, vitest_1.it)("defaults to requireMention=true and replyStyle=thread", function () {
            var policy = (0, policy_js_1.resolveMSTeamsReplyPolicy)({
                isDirectMessage: false,
                globalConfig: {},
            });
            (0, vitest_1.expect)(policy).toEqual({ requireMention: true, replyStyle: "thread" });
        });
        (0, vitest_1.it)("defaults replyStyle to top-level when requireMention=false", function () {
            var policy = (0, policy_js_1.resolveMSTeamsReplyPolicy)({
                isDirectMessage: false,
                globalConfig: { requireMention: false },
            });
            (0, vitest_1.expect)(policy).toEqual({
                requireMention: false,
                replyStyle: "top-level",
            });
        });
        (0, vitest_1.it)("prefers channel overrides over team and global defaults", function () {
            var policy = (0, policy_js_1.resolveMSTeamsReplyPolicy)({
                isDirectMessage: false,
                globalConfig: { requireMention: true },
                teamConfig: { requireMention: true },
                channelConfig: { requireMention: false },
            });
            // requireMention from channel -> false, and replyStyle defaults from requireMention -> top-level
            (0, vitest_1.expect)(policy).toEqual({
                requireMention: false,
                replyStyle: "top-level",
            });
        });
        (0, vitest_1.it)("inherits team mention settings when channel config is missing", function () {
            var policy = (0, policy_js_1.resolveMSTeamsReplyPolicy)({
                isDirectMessage: false,
                globalConfig: { requireMention: true },
                teamConfig: { requireMention: false },
            });
            (0, vitest_1.expect)(policy).toEqual({
                requireMention: false,
                replyStyle: "top-level",
            });
        });
        (0, vitest_1.it)("uses explicit replyStyle even when requireMention defaults would differ", function () {
            var policy = (0, policy_js_1.resolveMSTeamsReplyPolicy)({
                isDirectMessage: false,
                globalConfig: { requireMention: false, replyStyle: "thread" },
            });
            (0, vitest_1.expect)(policy).toEqual({ requireMention: false, replyStyle: "thread" });
        });
    });
    (0, vitest_1.describe)("isMSTeamsGroupAllowed", function () {
        (0, vitest_1.it)("allows when policy is open", function () {
            (0, vitest_1.expect)((0, policy_js_1.isMSTeamsGroupAllowed)({
                groupPolicy: "open",
                allowFrom: [],
                senderId: "user-id",
                senderName: "User",
            })).toBe(true);
        });
        (0, vitest_1.it)("blocks when policy is disabled", function () {
            (0, vitest_1.expect)((0, policy_js_1.isMSTeamsGroupAllowed)({
                groupPolicy: "disabled",
                allowFrom: ["user-id"],
                senderId: "user-id",
                senderName: "User",
            })).toBe(false);
        });
        (0, vitest_1.it)("blocks allowlist when empty", function () {
            (0, vitest_1.expect)((0, policy_js_1.isMSTeamsGroupAllowed)({
                groupPolicy: "allowlist",
                allowFrom: [],
                senderId: "user-id",
                senderName: "User",
            })).toBe(false);
        });
        (0, vitest_1.it)("allows allowlist when sender matches", function () {
            (0, vitest_1.expect)((0, policy_js_1.isMSTeamsGroupAllowed)({
                groupPolicy: "allowlist",
                allowFrom: ["User-Id"],
                senderId: "user-id",
                senderName: "User",
            })).toBe(true);
        });
        (0, vitest_1.it)("allows allowlist when sender name matches", function () {
            (0, vitest_1.expect)((0, policy_js_1.isMSTeamsGroupAllowed)({
                groupPolicy: "allowlist",
                allowFrom: ["user"],
                senderId: "other",
                senderName: "User",
            })).toBe(true);
        });
        (0, vitest_1.it)("allows allowlist wildcard", function () {
            (0, vitest_1.expect)((0, policy_js_1.isMSTeamsGroupAllowed)({
                groupPolicy: "allowlist",
                allowFrom: ["*"],
                senderId: "other",
                senderName: "User",
            })).toBe(true);
        });
    });
});
