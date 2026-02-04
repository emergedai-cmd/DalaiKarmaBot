"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var draft_chunking_js_1 = require("./draft-chunking.js");
(0, vitest_1.describe)("resolveTelegramDraftStreamingChunking", function () {
    (0, vitest_1.it)("uses smaller defaults than block streaming", function () {
        var chunking = (0, draft_chunking_js_1.resolveTelegramDraftStreamingChunking)(undefined, "default");
        (0, vitest_1.expect)(chunking).toEqual({
            minChars: 200,
            maxChars: 800,
            breakPreference: "paragraph",
        });
    });
    (0, vitest_1.it)("clamps to telegram.textChunkLimit", function () {
        var cfg = {
            channels: { telegram: { allowFrom: ["*"], textChunkLimit: 150 } },
        };
        var chunking = (0, draft_chunking_js_1.resolveTelegramDraftStreamingChunking)(cfg, "default");
        (0, vitest_1.expect)(chunking).toEqual({
            minChars: 150,
            maxChars: 150,
            breakPreference: "paragraph",
        });
    });
    (0, vitest_1.it)("supports per-account overrides", function () {
        var cfg = {
            channels: {
                telegram: {
                    allowFrom: ["*"],
                    accounts: {
                        default: {
                            allowFrom: ["*"],
                            draftChunk: {
                                minChars: 10,
                                maxChars: 20,
                                breakPreference: "sentence",
                            },
                        },
                    },
                },
            },
        };
        var chunking = (0, draft_chunking_js_1.resolveTelegramDraftStreamingChunking)(cfg, "default");
        (0, vitest_1.expect)(chunking).toEqual({
            minChars: 10,
            maxChars: 20,
            breakPreference: "sentence",
        });
    });
});
