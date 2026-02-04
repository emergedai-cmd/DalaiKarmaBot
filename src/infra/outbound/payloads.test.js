"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var payloads_js_1 = require("./payloads.js");
(0, vitest_1.describe)("normalizeOutboundPayloadsForJson", function () {
    (0, vitest_1.it)("normalizes payloads with mediaUrl and mediaUrls", function () {
        (0, vitest_1.expect)((0, payloads_js_1.normalizeOutboundPayloadsForJson)([
            { text: "hi" },
            { text: "photo", mediaUrl: "https://x.test/a.jpg" },
            { text: "multi", mediaUrls: ["https://x.test/1.png"] },
        ])).toEqual([
            { text: "hi", mediaUrl: null, mediaUrls: undefined, channelData: undefined },
            {
                text: "photo",
                mediaUrl: "https://x.test/a.jpg",
                mediaUrls: ["https://x.test/a.jpg"],
                channelData: undefined,
            },
            {
                text: "multi",
                mediaUrl: null,
                mediaUrls: ["https://x.test/1.png"],
                channelData: undefined,
            },
        ]);
    });
    (0, vitest_1.it)("keeps mediaUrl null for multi MEDIA tags", function () {
        (0, vitest_1.expect)((0, payloads_js_1.normalizeOutboundPayloadsForJson)([
            {
                text: "MEDIA:https://x.test/a.png\nMEDIA:https://x.test/b.png",
            },
        ])).toEqual([
            {
                text: "",
                mediaUrl: null,
                mediaUrls: ["https://x.test/a.png", "https://x.test/b.png"],
                channelData: undefined,
            },
        ]);
    });
});
(0, vitest_1.describe)("normalizeOutboundPayloads", function () {
    (0, vitest_1.it)("keeps channelData-only payloads", function () {
        var channelData = { line: { flexMessage: { altText: "Card", contents: {} } } };
        var normalized = (0, payloads_js_1.normalizeOutboundPayloads)([{ channelData: channelData }]);
        (0, vitest_1.expect)(normalized).toEqual([{ text: "", mediaUrls: [], channelData: channelData }]);
    });
});
(0, vitest_1.describe)("formatOutboundPayloadLog", function () {
    (0, vitest_1.it)("trims trailing text and appends media lines", function () {
        (0, vitest_1.expect)((0, payloads_js_1.formatOutboundPayloadLog)({
            text: "hello  ",
            mediaUrls: ["https://x.test/a.png", "https://x.test/b.png"],
        })).toBe("hello\nMEDIA:https://x.test/a.png\nMEDIA:https://x.test/b.png");
    });
    (0, vitest_1.it)("logs media-only payloads", function () {
        (0, vitest_1.expect)((0, payloads_js_1.formatOutboundPayloadLog)({
            text: "",
            mediaUrls: ["https://x.test/a.png"],
        })).toBe("MEDIA:https://x.test/a.png");
    });
});
