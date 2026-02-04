"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var media_note_js_1 = require("./media-note.js");
(0, vitest_1.describe)("buildInboundMediaNote", function () {
    (0, vitest_1.it)("formats single MediaPath as a media note", function () {
        var note = (0, media_note_js_1.buildInboundMediaNote)({
            MediaPath: "/tmp/a.png",
            MediaType: "image/png",
            MediaUrl: "/tmp/a.png",
        });
        (0, vitest_1.expect)(note).toBe("[media attached: /tmp/a.png (image/png) | /tmp/a.png]");
    });
    (0, vitest_1.it)("formats multiple MediaPaths as numbered media notes", function () {
        var note = (0, media_note_js_1.buildInboundMediaNote)({
            MediaPaths: ["/tmp/a.png", "/tmp/b.png", "/tmp/c.png"],
            MediaUrls: ["/tmp/a.png", "/tmp/b.png", "/tmp/c.png"],
        });
        (0, vitest_1.expect)(note).toBe([
            "[media attached: 3 files]",
            "[media attached 1/3: /tmp/a.png | /tmp/a.png]",
            "[media attached 2/3: /tmp/b.png | /tmp/b.png]",
            "[media attached 3/3: /tmp/c.png | /tmp/c.png]",
        ].join("\n"));
    });
    (0, vitest_1.it)("skips media notes for attachments with understanding output", function () {
        var note = (0, media_note_js_1.buildInboundMediaNote)({
            MediaPaths: ["/tmp/a.png", "/tmp/b.png"],
            MediaUrls: ["https://example.com/a.png", "https://example.com/b.png"],
            MediaUnderstanding: [
                {
                    kind: "audio.transcription",
                    attachmentIndex: 0,
                    text: "hello",
                    provider: "groq",
                },
            ],
        });
        (0, vitest_1.expect)(note).toBe("[media attached: /tmp/b.png | https://example.com/b.png]");
    });
    (0, vitest_1.it)("only suppresses attachments when media understanding succeeded", function () {
        var note = (0, media_note_js_1.buildInboundMediaNote)({
            MediaPaths: ["/tmp/a.png", "/tmp/b.png"],
            MediaUrls: ["https://example.com/a.png", "https://example.com/b.png"],
            MediaUnderstandingDecisions: [
                {
                    capability: "image",
                    outcome: "skipped",
                    attachments: [
                        {
                            attachmentIndex: 0,
                            attempts: [
                                {
                                    type: "provider",
                                    outcome: "skipped",
                                    reason: "maxBytes: too large",
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        (0, vitest_1.expect)(note).toBe([
            "[media attached: 2 files]",
            "[media attached 1/2: /tmp/a.png | https://example.com/a.png]",
            "[media attached 2/2: /tmp/b.png | https://example.com/b.png]",
        ].join("\n"));
    });
    (0, vitest_1.it)("suppresses attachments when media understanding succeeds via decisions", function () {
        var note = (0, media_note_js_1.buildInboundMediaNote)({
            MediaPaths: ["/tmp/a.png", "/tmp/b.png"],
            MediaUrls: ["https://example.com/a.png", "https://example.com/b.png"],
            MediaUnderstandingDecisions: [
                {
                    capability: "image",
                    outcome: "success",
                    attachments: [
                        {
                            attachmentIndex: 0,
                            attempts: [
                                {
                                    type: "provider",
                                    outcome: "success",
                                    provider: "openai",
                                    model: "gpt-5.2",
                                },
                            ],
                            chosen: {
                                type: "provider",
                                outcome: "success",
                                provider: "openai",
                                model: "gpt-5.2",
                            },
                        },
                    ],
                },
            ],
        });
        (0, vitest_1.expect)(note).toBe("[media attached: /tmp/b.png | https://example.com/b.png]");
    });
});
