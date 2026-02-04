"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var format_js_1 = require("./format.js");
(0, vitest_1.describe)("formatOutboundDeliverySummary", function () {
    (0, vitest_1.it)("falls back when result is missing", function () {
        (0, vitest_1.expect)((0, format_js_1.formatOutboundDeliverySummary)("telegram")).toBe("✅ Sent via Telegram. Message ID: unknown");
        (0, vitest_1.expect)((0, format_js_1.formatOutboundDeliverySummary)("imessage")).toBe("✅ Sent via iMessage. Message ID: unknown");
    });
    (0, vitest_1.it)("adds chat or channel details", function () {
        (0, vitest_1.expect)((0, format_js_1.formatOutboundDeliverySummary)("telegram", {
            channel: "telegram",
            messageId: "m1",
            chatId: "c1",
        })).toBe("✅ Sent via Telegram. Message ID: m1 (chat c1)");
        (0, vitest_1.expect)((0, format_js_1.formatOutboundDeliverySummary)("discord", {
            channel: "discord",
            messageId: "d1",
            channelId: "chan",
        })).toBe("✅ Sent via Discord. Message ID: d1 (channel chan)");
    });
});
(0, vitest_1.describe)("buildOutboundDeliveryJson", function () {
    (0, vitest_1.it)("builds direct delivery payloads", function () {
        (0, vitest_1.expect)((0, format_js_1.buildOutboundDeliveryJson)({
            channel: "telegram",
            to: "123",
            result: { channel: "telegram", messageId: "m1", chatId: "c1" },
            mediaUrl: "https://example.com/a.png",
        })).toEqual({
            channel: "telegram",
            via: "direct",
            to: "123",
            messageId: "m1",
            mediaUrl: "https://example.com/a.png",
            chatId: "c1",
        });
    });
    (0, vitest_1.it)("supports whatsapp metadata when present", function () {
        (0, vitest_1.expect)((0, format_js_1.buildOutboundDeliveryJson)({
            channel: "whatsapp",
            to: "+1",
            result: { channel: "whatsapp", messageId: "w1", toJid: "jid" },
        })).toEqual({
            channel: "whatsapp",
            via: "direct",
            to: "+1",
            messageId: "w1",
            mediaUrl: null,
            toJid: "jid",
        });
    });
    (0, vitest_1.it)("keeps timestamp for signal", function () {
        (0, vitest_1.expect)((0, format_js_1.buildOutboundDeliveryJson)({
            channel: "signal",
            to: "+1",
            result: { channel: "signal", messageId: "s1", timestamp: 123 },
        })).toEqual({
            channel: "signal",
            via: "direct",
            to: "+1",
            messageId: "s1",
            mediaUrl: null,
            timestamp: 123,
        });
    });
});
(0, vitest_1.describe)("formatGatewaySummary", function () {
    (0, vitest_1.it)("formats gateway summaries with channel", function () {
        (0, vitest_1.expect)((0, format_js_1.formatGatewaySummary)({ channel: "whatsapp", messageId: "m1" })).toBe("✅ Sent via gateway (whatsapp). Message ID: m1");
    });
    (0, vitest_1.it)("supports custom actions", function () {
        (0, vitest_1.expect)((0, format_js_1.formatGatewaySummary)({
            action: "Poll sent",
            channel: "discord",
            messageId: "p1",
        })).toBe("✅ Poll sent via gateway (discord). Message ID: p1");
    });
});
