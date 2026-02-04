"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var mentions_js_1 = require("./mentions.js");
(0, vitest_1.describe)("matchesMentionWithExplicit", function () {
    var mentionRegexes = [/\bopenclaw\b/i];
    (0, vitest_1.it)("checks mentionPatterns even when explicit mention is available", function () {
        var result = (0, mentions_js_1.matchesMentionWithExplicit)({
            text: "@openclaw hello",
            mentionRegexes: mentionRegexes,
            explicit: {
                hasAnyMention: true,
                isExplicitlyMentioned: false,
                canResolveExplicit: true,
            },
        });
        (0, vitest_1.expect)(result).toBe(true);
    });
    (0, vitest_1.it)("returns false when explicit is false and no regex match", function () {
        var result = (0, mentions_js_1.matchesMentionWithExplicit)({
            text: "<@999999> hello",
            mentionRegexes: mentionRegexes,
            explicit: {
                hasAnyMention: true,
                isExplicitlyMentioned: false,
                canResolveExplicit: true,
            },
        });
        (0, vitest_1.expect)(result).toBe(false);
    });
    (0, vitest_1.it)("returns true when explicitly mentioned even if regexes do not match", function () {
        var result = (0, mentions_js_1.matchesMentionWithExplicit)({
            text: "<@123456>",
            mentionRegexes: [],
            explicit: {
                hasAnyMention: true,
                isExplicitlyMentioned: true,
                canResolveExplicit: true,
            },
        });
        (0, vitest_1.expect)(result).toBe(true);
    });
    (0, vitest_1.it)("falls back to regex matching when explicit mention cannot be resolved", function () {
        var result = (0, mentions_js_1.matchesMentionWithExplicit)({
            text: "openclaw please",
            mentionRegexes: mentionRegexes,
            explicit: {
                hasAnyMention: true,
                isExplicitlyMentioned: false,
                canResolveExplicit: false,
            },
        });
        (0, vitest_1.expect)(result).toBe(true);
    });
});
