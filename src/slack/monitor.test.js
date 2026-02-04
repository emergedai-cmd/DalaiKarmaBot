"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var monitor_js_1 = require("./monitor.js");
(0, vitest_1.describe)("slack groupPolicy gating", function () {
    (0, vitest_1.it)("allows when policy is open", function () {
        (0, vitest_1.expect)((0, monitor_js_1.isSlackChannelAllowedByPolicy)({
            groupPolicy: "open",
            channelAllowlistConfigured: false,
            channelAllowed: false,
        })).toBe(true);
    });
    (0, vitest_1.it)("blocks when policy is disabled", function () {
        (0, vitest_1.expect)((0, monitor_js_1.isSlackChannelAllowedByPolicy)({
            groupPolicy: "disabled",
            channelAllowlistConfigured: true,
            channelAllowed: true,
        })).toBe(false);
    });
    (0, vitest_1.it)("blocks allowlist when no channel allowlist configured", function () {
        (0, vitest_1.expect)((0, monitor_js_1.isSlackChannelAllowedByPolicy)({
            groupPolicy: "allowlist",
            channelAllowlistConfigured: false,
            channelAllowed: true,
        })).toBe(false);
    });
    (0, vitest_1.it)("allows allowlist when channel is allowed", function () {
        (0, vitest_1.expect)((0, monitor_js_1.isSlackChannelAllowedByPolicy)({
            groupPolicy: "allowlist",
            channelAllowlistConfigured: true,
            channelAllowed: true,
        })).toBe(true);
    });
    (0, vitest_1.it)("blocks allowlist when channel is not allowed", function () {
        (0, vitest_1.expect)((0, monitor_js_1.isSlackChannelAllowedByPolicy)({
            groupPolicy: "allowlist",
            channelAllowlistConfigured: true,
            channelAllowed: false,
        })).toBe(false);
    });
});
(0, vitest_1.describe)("resolveSlackThreadTs", function () {
    var threadTs = "1234567890.123456";
    var messageTs = "9999999999.999999";
    (0, vitest_1.describe)("replyToMode=off", function () {
        (0, vitest_1.it)("returns incomingThreadTs when in a thread", function () {
            (0, vitest_1.expect)((0, monitor_js_1.resolveSlackThreadTs)({
                replyToMode: "off",
                incomingThreadTs: threadTs,
                messageTs: messageTs,
                hasReplied: false,
            })).toBe(threadTs);
        });
        (0, vitest_1.it)("returns incomingThreadTs even after replies (stays in thread)", function () {
            (0, vitest_1.expect)((0, monitor_js_1.resolveSlackThreadTs)({
                replyToMode: "off",
                incomingThreadTs: threadTs,
                messageTs: messageTs,
                hasReplied: true,
            })).toBe(threadTs);
        });
        (0, vitest_1.it)("returns undefined when not in a thread", function () {
            (0, vitest_1.expect)((0, monitor_js_1.resolveSlackThreadTs)({
                replyToMode: "off",
                incomingThreadTs: undefined,
                messageTs: messageTs,
                hasReplied: false,
            })).toBeUndefined();
        });
    });
    (0, vitest_1.describe)("replyToMode=first", function () {
        (0, vitest_1.it)("returns incomingThreadTs when in a thread (always stays threaded)", function () {
            (0, vitest_1.expect)((0, monitor_js_1.resolveSlackThreadTs)({
                replyToMode: "first",
                incomingThreadTs: threadTs,
                messageTs: messageTs,
                hasReplied: false,
            })).toBe(threadTs);
        });
        (0, vitest_1.it)("returns messageTs for first reply when not in a thread", function () {
            (0, vitest_1.expect)((0, monitor_js_1.resolveSlackThreadTs)({
                replyToMode: "first",
                incomingThreadTs: undefined,
                messageTs: messageTs,
                hasReplied: false,
            })).toBe(messageTs);
        });
        (0, vitest_1.it)("returns undefined for subsequent replies when not in a thread (goes to main channel)", function () {
            (0, vitest_1.expect)((0, monitor_js_1.resolveSlackThreadTs)({
                replyToMode: "first",
                incomingThreadTs: undefined,
                messageTs: messageTs,
                hasReplied: true,
            })).toBeUndefined();
        });
    });
    (0, vitest_1.describe)("replyToMode=all", function () {
        (0, vitest_1.it)("returns incomingThreadTs when in a thread", function () {
            (0, vitest_1.expect)((0, monitor_js_1.resolveSlackThreadTs)({
                replyToMode: "all",
                incomingThreadTs: threadTs,
                messageTs: messageTs,
                hasReplied: false,
            })).toBe(threadTs);
        });
        (0, vitest_1.it)("returns messageTs when not in a thread (starts thread)", function () {
            (0, vitest_1.expect)((0, monitor_js_1.resolveSlackThreadTs)({
                replyToMode: "all",
                incomingThreadTs: undefined,
                messageTs: messageTs,
                hasReplied: true,
            })).toBe(messageTs);
        });
    });
});
(0, vitest_1.describe)("buildSlackSlashCommandMatcher", function () {
    (0, vitest_1.it)("matches with or without a leading slash", function () {
        var matcher = (0, monitor_js_1.buildSlackSlashCommandMatcher)("openclaw");
        (0, vitest_1.expect)(matcher.test("openclaw")).toBe(true);
        (0, vitest_1.expect)(matcher.test("/openclaw")).toBe(true);
    });
    (0, vitest_1.it)("does not match similar names", function () {
        var matcher = (0, monitor_js_1.buildSlackSlashCommandMatcher)("openclaw");
        (0, vitest_1.expect)(matcher.test("/openclaw-bot")).toBe(false);
        (0, vitest_1.expect)(matcher.test("openclaw-bot")).toBe(false);
    });
});
