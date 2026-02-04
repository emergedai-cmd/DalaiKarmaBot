"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var envelope_js_1 = require("./envelope.js");
(0, vitest_1.describe)("buildOutboundResultEnvelope", function () {
    (0, vitest_1.it)("flattens delivery-only payloads by default", function () {
        var delivery = {
            provider: "whatsapp",
            via: "gateway",
            to: "+1",
            messageId: "m1",
            mediaUrl: null,
        };
        (0, vitest_1.expect)((0, envelope_js_1.buildOutboundResultEnvelope)({ delivery: delivery })).toEqual(delivery);
    });
    (0, vitest_1.it)("keeps payloads and meta in the envelope", function () {
        var envelope = (0, envelope_js_1.buildOutboundResultEnvelope)({
            payloads: [{ text: "hi", mediaUrl: null, mediaUrls: undefined }],
            meta: { foo: "bar" },
        });
        (0, vitest_1.expect)(envelope).toEqual({
            payloads: [{ text: "hi", mediaUrl: null, mediaUrls: undefined }],
            meta: { foo: "bar" },
        });
    });
    (0, vitest_1.it)("includes delivery when payloads are present", function () {
        var delivery = {
            provider: "telegram",
            via: "direct",
            to: "123",
            messageId: "m2",
            mediaUrl: null,
            chatId: "c1",
        };
        var envelope = (0, envelope_js_1.buildOutboundResultEnvelope)({
            payloads: [],
            delivery: delivery,
            meta: { ok: true },
        });
        (0, vitest_1.expect)(envelope).toEqual({
            payloads: [],
            meta: { ok: true },
            delivery: delivery,
        });
    });
    (0, vitest_1.it)("can keep delivery wrapped when requested", function () {
        var delivery = {
            provider: "discord",
            via: "gateway",
            to: "channel:C1",
            messageId: "m3",
            mediaUrl: null,
            channelId: "C1",
        };
        var envelope = (0, envelope_js_1.buildOutboundResultEnvelope)({
            delivery: delivery,
            flattenDelivery: false,
        });
        (0, vitest_1.expect)(envelope).toEqual({ delivery: delivery });
    });
});
