"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var channel_config_js_1 = require("./channel-config.js");
(0, vitest_1.describe)("resolveSlackChannelConfig", function () {
    (0, vitest_1.it)("uses defaultRequireMention when channels config is empty", function () {
        var res = (0, channel_config_js_1.resolveSlackChannelConfig)({
            channelId: "C1",
            channels: {},
            defaultRequireMention: false,
        });
        (0, vitest_1.expect)(res).toEqual({ allowed: true, requireMention: false });
    });
    (0, vitest_1.it)("defaults defaultRequireMention to true when not provided", function () {
        var res = (0, channel_config_js_1.resolveSlackChannelConfig)({
            channelId: "C1",
            channels: {},
        });
        (0, vitest_1.expect)(res).toEqual({ allowed: true, requireMention: true });
    });
    (0, vitest_1.it)("prefers explicit channel/fallback requireMention over defaultRequireMention", function () {
        var res = (0, channel_config_js_1.resolveSlackChannelConfig)({
            channelId: "C1",
            channels: { "*": { requireMention: true } },
            defaultRequireMention: false,
        });
        (0, vitest_1.expect)(res).toMatchObject({ requireMention: true });
    });
    (0, vitest_1.it)("uses wildcard entries when no direct channel config exists", function () {
        var res = (0, channel_config_js_1.resolveSlackChannelConfig)({
            channelId: "C1",
            channels: { "*": { allow: true, requireMention: false } },
            defaultRequireMention: true,
        });
        (0, vitest_1.expect)(res).toMatchObject({
            allowed: true,
            requireMention: false,
            matchKey: "*",
            matchSource: "wildcard",
        });
    });
    (0, vitest_1.it)("uses direct match metadata when channel config exists", function () {
        var res = (0, channel_config_js_1.resolveSlackChannelConfig)({
            channelId: "C1",
            channels: { C1: { allow: true, requireMention: false } },
            defaultRequireMention: true,
        });
        (0, vitest_1.expect)(res).toMatchObject({
            matchKey: "C1",
            matchSource: "direct",
        });
    });
});
