"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
(0, vitest_1.describe)("sanitizeUserFacingText", function () {
    (0, vitest_1.it)("strips final tags", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeUserFacingText)("<final>Hello</final>")).toBe("Hello");
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeUserFacingText)("Hi <final>there</final>!")).toBe("Hi there!");
    });
    (0, vitest_1.it)("does not clobber normal numeric prefixes", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeUserFacingText)("202 results found")).toBe("202 results found");
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeUserFacingText)("400 days left")).toBe("400 days left");
    });
    (0, vitest_1.it)("sanitizes role ordering errors", function () {
        var result = (0, pi_embedded_helpers_js_1.sanitizeUserFacingText)("400 Incorrect role information");
        (0, vitest_1.expect)(result).toContain("Message ordering conflict");
    });
    (0, vitest_1.it)("sanitizes HTTP status errors with error hints", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeUserFacingText)("500 Internal Server Error")).toBe("HTTP 500: Internal Server Error");
    });
    (0, vitest_1.it)("sanitizes raw API error payloads", function () {
        var raw = '{"type":"error","error":{"message":"Something exploded","type":"server_error"}}';
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeUserFacingText)(raw)).toBe("LLM error server_error: Something exploded");
    });
    (0, vitest_1.it)("collapses consecutive duplicate paragraphs", function () {
        var text = "Hello there!\n\nHello there!";
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeUserFacingText)(text)).toBe("Hello there!");
    });
    (0, vitest_1.it)("does not collapse distinct paragraphs", function () {
        var text = "Hello there!\n\nDifferent line.";
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeUserFacingText)(text)).toBe(text);
    });
});
