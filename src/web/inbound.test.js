"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var inbound_js_1 = require("./inbound.js");
(0, vitest_1.describe)("web inbound helpers", function () {
    (0, vitest_1.it)("prefers the main conversation body", function () {
        var body = (0, inbound_js_1.extractText)({
            conversation: " hello ",
        });
        (0, vitest_1.expect)(body).toBe("hello");
    });
    (0, vitest_1.it)("falls back to captions when conversation text is missing", function () {
        var body = (0, inbound_js_1.extractText)({
            imageMessage: { caption: " caption " },
        });
        (0, vitest_1.expect)(body).toBe("caption");
    });
    (0, vitest_1.it)("handles document captions", function () {
        var body = (0, inbound_js_1.extractText)({
            documentMessage: { caption: " doc " },
        });
        (0, vitest_1.expect)(body).toBe("doc");
    });
    (0, vitest_1.it)("extracts WhatsApp contact cards", function () {
        var body = (0, inbound_js_1.extractText)({
            contactMessage: {
                displayName: "Ada Lovelace",
                vcard: [
                    "BEGIN:VCARD",
                    "VERSION:3.0",
                    "FN:Ada Lovelace",
                    "TEL;TYPE=CELL:+15555550123",
                    "END:VCARD",
                ].join("\n"),
            },
        });
        (0, vitest_1.expect)(body).toBe("<contact: Ada Lovelace, +15555550123>");
    });
    (0, vitest_1.it)("prefers FN over N in WhatsApp vcards", function () {
        var body = (0, inbound_js_1.extractText)({
            contactMessage: {
                vcard: [
                    "BEGIN:VCARD",
                    "VERSION:3.0",
                    "N:Lovelace;Ada;;;",
                    "FN:Ada Lovelace",
                    "TEL;TYPE=CELL:+15555550123",
                    "END:VCARD",
                ].join("\n"),
            },
        });
        (0, vitest_1.expect)(body).toBe("<contact: Ada Lovelace, +15555550123>");
    });
    (0, vitest_1.it)("normalizes tel: prefixes in WhatsApp vcards", function () {
        var body = (0, inbound_js_1.extractText)({
            contactMessage: {
                vcard: [
                    "BEGIN:VCARD",
                    "VERSION:3.0",
                    "FN:Ada Lovelace",
                    "TEL;TYPE=CELL:tel:+15555550123",
                    "END:VCARD",
                ].join("\n"),
            },
        });
        (0, vitest_1.expect)(body).toBe("<contact: Ada Lovelace, +15555550123>");
    });
    (0, vitest_1.it)("trims and skips empty WhatsApp vcard phones", function () {
        var body = (0, inbound_js_1.extractText)({
            contactMessage: {
                vcard: [
                    "BEGIN:VCARD",
                    "VERSION:3.0",
                    "FN:Ada Lovelace",
                    "TEL;TYPE=CELL:  +15555550123  ",
                    "TEL;TYPE=HOME:   ",
                    "TEL;TYPE=WORK:+15555550124",
                    "END:VCARD",
                ].join("\n"),
            },
        });
        (0, vitest_1.expect)(body).toBe("<contact: Ada Lovelace, +15555550123 (+1 more)>");
    });
    (0, vitest_1.it)("extracts multiple WhatsApp contact cards", function () {
        var body = (0, inbound_js_1.extractText)({
            contactsArrayMessage: {
                contacts: [
                    {
                        displayName: "Alice",
                        vcard: [
                            "BEGIN:VCARD",
                            "VERSION:3.0",
                            "FN:Alice",
                            "TEL;TYPE=CELL:+15555550101",
                            "END:VCARD",
                        ].join("\n"),
                    },
                    {
                        displayName: "Bob",
                        vcard: [
                            "BEGIN:VCARD",
                            "VERSION:3.0",
                            "FN:Bob",
                            "TEL;TYPE=CELL:+15555550102",
                            "END:VCARD",
                        ].join("\n"),
                    },
                    {
                        displayName: "Charlie",
                        vcard: [
                            "BEGIN:VCARD",
                            "VERSION:3.0",
                            "FN:Charlie",
                            "TEL;TYPE=CELL:+15555550103",
                            "TEL;TYPE=HOME:+15555550104",
                            "END:VCARD",
                        ].join("\n"),
                    },
                    {
                        displayName: "Dana",
                        vcard: [
                            "BEGIN:VCARD",
                            "VERSION:3.0",
                            "FN:Dana",
                            "TEL;TYPE=CELL:+15555550105",
                            "END:VCARD",
                        ].join("\n"),
                    },
                ],
            },
        });
        (0, vitest_1.expect)(body).toBe("<contacts: Alice, +15555550101, Bob, +15555550102, Charlie, +15555550103 (+1 more), Dana, +15555550105>");
    });
    (0, vitest_1.it)("counts empty WhatsApp contact cards in array summaries", function () {
        var body = (0, inbound_js_1.extractText)({
            contactsArrayMessage: {
                contacts: [
                    {
                        displayName: "Alice",
                        vcard: [
                            "BEGIN:VCARD",
                            "VERSION:3.0",
                            "FN:Alice",
                            "TEL;TYPE=CELL:+15555550101",
                            "END:VCARD",
                        ].join("\n"),
                    },
                    {},
                    {},
                ],
            },
        });
        (0, vitest_1.expect)(body).toBe("<contacts: Alice, +15555550101 +2 more>");
    });
    (0, vitest_1.it)("summarizes empty WhatsApp contact cards with a count", function () {
        var body = (0, inbound_js_1.extractText)({
            contactsArrayMessage: {
                contacts: [{}, {}],
            },
        });
        (0, vitest_1.expect)(body).toBe("<contacts: 2 contacts>");
    });
    (0, vitest_1.it)("unwraps view-once v2 extension messages", function () {
        var body = (0, inbound_js_1.extractText)({
            viewOnceMessageV2Extension: {
                message: { conversation: " hello " },
            },
        });
        (0, vitest_1.expect)(body).toBe("hello");
    });
    (0, vitest_1.it)("returns placeholders for media-only payloads", function () {
        (0, vitest_1.expect)((0, inbound_js_1.extractMediaPlaceholder)({
            imageMessage: {},
        })).toBe("<media:image>");
        (0, vitest_1.expect)((0, inbound_js_1.extractMediaPlaceholder)({
            audioMessage: {},
        })).toBe("<media:audio>");
    });
    (0, vitest_1.it)("extracts WhatsApp location messages", function () {
        var location = (0, inbound_js_1.extractLocationData)({
            locationMessage: {
                degreesLatitude: 48.858844,
                degreesLongitude: 2.294351,
                name: "Eiffel Tower",
                address: "Champ de Mars, Paris",
                accuracyInMeters: 12,
                comment: "Meet here",
            },
        });
        (0, vitest_1.expect)(location).toEqual({
            latitude: 48.858844,
            longitude: 2.294351,
            accuracy: 12,
            name: "Eiffel Tower",
            address: "Champ de Mars, Paris",
            caption: "Meet here",
            source: "place",
            isLive: false,
        });
    });
    (0, vitest_1.it)("extracts WhatsApp live location messages", function () {
        var location = (0, inbound_js_1.extractLocationData)({
            liveLocationMessage: {
                degreesLatitude: 37.819929,
                degreesLongitude: -122.478255,
                accuracyInMeters: 20,
                caption: "On the move",
            },
        });
        (0, vitest_1.expect)(location).toEqual({
            latitude: 37.819929,
            longitude: -122.478255,
            accuracy: 20,
            caption: "On the move",
            source: "live",
            isLive: true,
        });
    });
});
