"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
(0, vitest_1.describe)("formatAssistantErrorText", function () {
    var makeAssistantError = function (errorMessage) {
        return ({
            stopReason: "error",
            errorMessage: errorMessage,
        });
    };
    (0, vitest_1.it)("returns a friendly message for context overflow", function () {
        var msg = makeAssistantError("request_too_large");
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.formatAssistantErrorText)(msg)).toContain("Context overflow");
    });
    (0, vitest_1.it)("returns context overflow for Anthropic 'Request size exceeds model context window'", function () {
        // This is the new Anthropic error format that wasn't being detected.
        // Without the fix, this falls through to the invalidRequest regex and returns
        // "LLM request rejected: Request size exceeds model context window"
        // instead of the context overflow message, preventing auto-compaction.
        var msg = makeAssistantError('{"type":"error","error":{"type":"invalid_request_error","message":"Request size exceeds model context window"}}');
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.formatAssistantErrorText)(msg)).toContain("Context overflow");
    });
    (0, vitest_1.it)("returns a friendly message for Anthropic role ordering", function () {
        var msg = makeAssistantError('messages: roles must alternate between "user" and "assistant"');
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.formatAssistantErrorText)(msg)).toContain("Message ordering conflict");
    });
    (0, vitest_1.it)("returns a friendly message for Anthropic overload errors", function () {
        var msg = makeAssistantError('{"type":"error","error":{"details":null,"type":"overloaded_error","message":"Overloaded"},"request_id":"req_123"}');
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.formatAssistantErrorText)(msg)).toBe("The AI service is temporarily overloaded. Please try again in a moment.");
    });
    (0, vitest_1.it)("handles JSON-wrapped role errors", function () {
        var msg = makeAssistantError('{"error":{"message":"400 Incorrect role information"}}');
        var result = (0, pi_embedded_helpers_js_1.formatAssistantErrorText)(msg);
        (0, vitest_1.expect)(result).toContain("Message ordering conflict");
        (0, vitest_1.expect)(result).not.toContain("400");
    });
    (0, vitest_1.it)("suppresses raw error JSON payloads that are not otherwise classified", function () {
        var msg = makeAssistantError('{"type":"error","error":{"message":"Something exploded","type":"server_error"}}');
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.formatAssistantErrorText)(msg)).toBe("LLM error server_error: Something exploded");
    });
});
