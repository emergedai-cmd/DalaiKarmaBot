"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var channel_js_1 = require("../../../extensions/telegram/src/channel.js");
var channel_js_2 = require("../../../extensions/whatsapp/src/channel.js");
var runtime_js_1 = require("../../plugins/runtime.js");
var channel_plugins_js_1 = require("../../test-utils/channel-plugins.js");
var targets_js_1 = require("./targets.js");
(0, vitest_1.describe)("resolveOutboundTarget", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([
            { pluginId: "whatsapp", plugin: channel_js_2.whatsappPlugin, source: "test" },
            { pluginId: "telegram", plugin: channel_js_1.telegramPlugin, source: "test" },
        ]));
    });
    (0, vitest_1.it)("falls back to whatsapp allowFrom via config", function () {
        var cfg = {
            channels: { whatsapp: { allowFrom: ["+1555"] } },
        };
        var res = (0, targets_js_1.resolveOutboundTarget)({
            channel: "whatsapp",
            to: "",
            cfg: cfg,
            mode: "explicit",
        });
        (0, vitest_1.expect)(res).toEqual({ ok: true, to: "+1555" });
    });
    vitest_1.it.each([
        {
            name: "normalizes whatsapp target when provided",
            input: { channel: "whatsapp", to: " (555) 123-4567 " },
            expected: { ok: true, to: "+5551234567" },
        },
        {
            name: "keeps whatsapp group targets",
            input: { channel: "whatsapp", to: "120363401234567890@g.us" },
            expected: { ok: true, to: "120363401234567890@g.us" },
        },
        {
            name: "normalizes prefixed/uppercase whatsapp group targets",
            input: {
                channel: "whatsapp",
                to: " WhatsApp:120363401234567890@G.US ",
            },
            expected: { ok: true, to: "120363401234567890@g.us" },
        },
        {
            name: "falls back to whatsapp allowFrom",
            input: { channel: "whatsapp", to: "", allowFrom: ["+1555"] },
            expected: { ok: true, to: "+1555" },
        },
        {
            name: "normalizes whatsapp allowFrom fallback targets",
            input: {
                channel: "whatsapp",
                to: "",
                allowFrom: ["whatsapp:(555) 123-4567"],
            },
            expected: { ok: true, to: "+5551234567" },
        },
        {
            name: "rejects invalid whatsapp target",
            input: { channel: "whatsapp", to: "wat" },
            expectedErrorIncludes: "WhatsApp",
        },
        {
            name: "rejects whatsapp without to when allowFrom missing",
            input: { channel: "whatsapp", to: " " },
            expectedErrorIncludes: "WhatsApp",
        },
        {
            name: "rejects whatsapp allowFrom fallback when invalid",
            input: { channel: "whatsapp", to: "", allowFrom: ["wat"] },
            expectedErrorIncludes: "WhatsApp",
        },
    ])("$name", function (_a) {
        var input = _a.input, expected = _a.expected, expectedErrorIncludes = _a.expectedErrorIncludes;
        var res = (0, targets_js_1.resolveOutboundTarget)(input);
        if (expected) {
            (0, vitest_1.expect)(res).toEqual(expected);
            return;
        }
        (0, vitest_1.expect)(res.ok).toBe(false);
        if (!res.ok) {
            (0, vitest_1.expect)(res.error.message).toContain(expectedErrorIncludes);
        }
    });
    (0, vitest_1.it)("rejects telegram with missing target", function () {
        var res = (0, targets_js_1.resolveOutboundTarget)({ channel: "telegram", to: " " });
        (0, vitest_1.expect)(res.ok).toBe(false);
        if (!res.ok) {
            (0, vitest_1.expect)(res.error.message).toContain("Telegram");
        }
    });
    (0, vitest_1.it)("rejects webchat delivery", function () {
        var res = (0, targets_js_1.resolveOutboundTarget)({ channel: "webchat", to: "x" });
        (0, vitest_1.expect)(res.ok).toBe(false);
        if (!res.ok) {
            (0, vitest_1.expect)(res.error.message).toContain("WebChat");
        }
    });
});
(0, vitest_1.describe)("resolveSessionDeliveryTarget", function () {
    (0, vitest_1.it)("derives implicit delivery from the last route", function () {
        var resolved = (0, targets_js_1.resolveSessionDeliveryTarget)({
            entry: {
                sessionId: "sess-1",
                updatedAt: 1,
                lastChannel: " whatsapp ",
                lastTo: " +1555 ",
                lastAccountId: " acct-1 ",
            },
            requestedChannel: "last",
        });
        (0, vitest_1.expect)(resolved).toEqual({
            channel: "whatsapp",
            to: "+1555",
            accountId: "acct-1",
            threadId: undefined,
            mode: "implicit",
            lastChannel: "whatsapp",
            lastTo: "+1555",
            lastAccountId: "acct-1",
            lastThreadId: undefined,
        });
    });
    (0, vitest_1.it)("prefers explicit targets without reusing lastTo", function () {
        var resolved = (0, targets_js_1.resolveSessionDeliveryTarget)({
            entry: {
                sessionId: "sess-2",
                updatedAt: 1,
                lastChannel: "whatsapp",
                lastTo: "+1555",
            },
            requestedChannel: "telegram",
        });
        (0, vitest_1.expect)(resolved).toEqual({
            channel: "telegram",
            to: undefined,
            accountId: undefined,
            threadId: undefined,
            mode: "implicit",
            lastChannel: "whatsapp",
            lastTo: "+1555",
            lastAccountId: undefined,
            lastThreadId: undefined,
        });
    });
    (0, vitest_1.it)("allows mismatched lastTo when configured", function () {
        var resolved = (0, targets_js_1.resolveSessionDeliveryTarget)({
            entry: {
                sessionId: "sess-3",
                updatedAt: 1,
                lastChannel: "whatsapp",
                lastTo: "+1555",
            },
            requestedChannel: "telegram",
            allowMismatchedLastTo: true,
        });
        (0, vitest_1.expect)(resolved).toEqual({
            channel: "telegram",
            to: "+1555",
            accountId: undefined,
            threadId: undefined,
            mode: "implicit",
            lastChannel: "whatsapp",
            lastTo: "+1555",
            lastAccountId: undefined,
            lastThreadId: undefined,
        });
    });
    (0, vitest_1.it)("falls back to a provided channel when requested is unsupported", function () {
        var resolved = (0, targets_js_1.resolveSessionDeliveryTarget)({
            entry: {
                sessionId: "sess-4",
                updatedAt: 1,
                lastChannel: "whatsapp",
                lastTo: "+1555",
            },
            requestedChannel: "webchat",
            fallbackChannel: "slack",
        });
        (0, vitest_1.expect)(resolved).toEqual({
            channel: "slack",
            to: undefined,
            accountId: undefined,
            threadId: undefined,
            mode: "implicit",
            lastChannel: "whatsapp",
            lastTo: "+1555",
            lastAccountId: undefined,
            lastThreadId: undefined,
        });
    });
});
