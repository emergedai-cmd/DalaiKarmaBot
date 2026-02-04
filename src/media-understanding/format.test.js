"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var format_js_1 = require("./format.js");
(0, vitest_1.describe)("formatMediaUnderstandingBody", function () {
    (0, vitest_1.it)("replaces placeholder body with transcript", function () {
        var body = (0, format_js_1.formatMediaUnderstandingBody)({
            body: "<media:audio>",
            outputs: [
                {
                    kind: "audio.transcription",
                    attachmentIndex: 0,
                    text: "hello world",
                    provider: "groq",
                },
            ],
        });
        (0, vitest_1.expect)(body).toBe("[Audio]\nTranscript:\nhello world");
    });
    (0, vitest_1.it)("includes user text when body is meaningful", function () {
        var body = (0, format_js_1.formatMediaUnderstandingBody)({
            body: "caption here",
            outputs: [
                {
                    kind: "audio.transcription",
                    attachmentIndex: 0,
                    text: "transcribed",
                    provider: "groq",
                },
            ],
        });
        (0, vitest_1.expect)(body).toBe("[Audio]\nUser text:\ncaption here\nTranscript:\ntranscribed");
    });
    (0, vitest_1.it)("strips leading media placeholders from user text", function () {
        var body = (0, format_js_1.formatMediaUnderstandingBody)({
            body: "<media:audio> caption here",
            outputs: [
                {
                    kind: "audio.transcription",
                    attachmentIndex: 0,
                    text: "transcribed",
                    provider: "groq",
                },
            ],
        });
        (0, vitest_1.expect)(body).toBe("[Audio]\nUser text:\ncaption here\nTranscript:\ntranscribed");
    });
    (0, vitest_1.it)("keeps user text once when multiple outputs exist", function () {
        var body = (0, format_js_1.formatMediaUnderstandingBody)({
            body: "caption here",
            outputs: [
                {
                    kind: "audio.transcription",
                    attachmentIndex: 0,
                    text: "audio text",
                    provider: "groq",
                },
                {
                    kind: "video.description",
                    attachmentIndex: 1,
                    text: "video text",
                    provider: "google",
                },
            ],
        });
        (0, vitest_1.expect)(body).toBe([
            "User text:\ncaption here",
            "[Audio]\nTranscript:\naudio text",
            "[Video]\nDescription:\nvideo text",
        ].join("\n\n"));
    });
    (0, vitest_1.it)("formats image outputs", function () {
        var body = (0, format_js_1.formatMediaUnderstandingBody)({
            body: "<media:image>",
            outputs: [
                {
                    kind: "image.description",
                    attachmentIndex: 0,
                    text: "a cat",
                    provider: "openai",
                },
            ],
        });
        (0, vitest_1.expect)(body).toBe("[Image]\nDescription:\na cat");
    });
});
