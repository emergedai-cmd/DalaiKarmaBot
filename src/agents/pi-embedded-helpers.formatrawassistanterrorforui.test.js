"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
(0, vitest_1.describe)("formatRawAssistantErrorForUi", function () {
    (0, vitest_1.it)("renders HTTP code + type + message from Anthropic payloads", function () {
        var text = (0, pi_embedded_helpers_js_1.formatRawAssistantErrorForUi)('429 {"type":"error","error":{"type":"rate_limit_error","message":"Rate limited."},"request_id":"req_123"}');
        (0, vitest_1.expect)(text).toContain("HTTP 429");
        (0, vitest_1.expect)(text).toContain("rate_limit_error");
        (0, vitest_1.expect)(text).toContain("Rate limited.");
        (0, vitest_1.expect)(text).toContain("req_123");
    });
    (0, vitest_1.it)("renders a generic unknown error message when raw is empty", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.formatRawAssistantErrorForUi)("")).toContain("unknown error");
    });
    (0, vitest_1.it)("formats plain HTTP status lines", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.formatRawAssistantErrorForUi)("500 Internal Server Error")).toBe("HTTP 500: Internal Server Error");
    });
});
