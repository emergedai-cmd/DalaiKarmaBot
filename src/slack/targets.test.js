"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var slack_js_1 = require("../channels/plugins/normalize/slack.js");
var targets_js_1 = require("./targets.js");
(0, vitest_1.describe)("parseSlackTarget", function () {
    (0, vitest_1.it)("parses user mentions and prefixes", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseSlackTarget)("<@U123>")).toMatchObject({
            kind: "user",
            id: "U123",
            normalized: "user:u123",
        });
        (0, vitest_1.expect)((0, targets_js_1.parseSlackTarget)("user:U456")).toMatchObject({
            kind: "user",
            id: "U456",
            normalized: "user:u456",
        });
        (0, vitest_1.expect)((0, targets_js_1.parseSlackTarget)("slack:U789")).toMatchObject({
            kind: "user",
            id: "U789",
            normalized: "user:u789",
        });
    });
    (0, vitest_1.it)("parses channel targets", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseSlackTarget)("channel:C123")).toMatchObject({
            kind: "channel",
            id: "C123",
            normalized: "channel:c123",
        });
        (0, vitest_1.expect)((0, targets_js_1.parseSlackTarget)("#C999")).toMatchObject({
            kind: "channel",
            id: "C999",
            normalized: "channel:c999",
        });
    });
    (0, vitest_1.it)("rejects invalid @ and # targets", function () {
        (0, vitest_1.expect)(function () { return (0, targets_js_1.parseSlackTarget)("@bob-1"); }).toThrow(/Slack DMs require a user id/);
        (0, vitest_1.expect)(function () { return (0, targets_js_1.parseSlackTarget)("#general-1"); }).toThrow(/Slack channels require a channel id/);
    });
});
(0, vitest_1.describe)("resolveSlackChannelId", function () {
    (0, vitest_1.it)("strips channel: prefix and accepts raw ids", function () {
        (0, vitest_1.expect)((0, targets_js_1.resolveSlackChannelId)("channel:C123")).toBe("C123");
        (0, vitest_1.expect)((0, targets_js_1.resolveSlackChannelId)("C123")).toBe("C123");
    });
    (0, vitest_1.it)("rejects user targets", function () {
        (0, vitest_1.expect)(function () { return (0, targets_js_1.resolveSlackChannelId)("user:U123"); }).toThrow(/channel id is required/i);
    });
});
(0, vitest_1.describe)("normalizeSlackMessagingTarget", function () {
    (0, vitest_1.it)("defaults raw ids to channels", function () {
        (0, vitest_1.expect)((0, slack_js_1.normalizeSlackMessagingTarget)("C123")).toBe("channel:c123");
    });
});
