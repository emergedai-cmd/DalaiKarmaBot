"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var redact_js_1 = require("./redact.js");
var defaults = (0, redact_js_1.getDefaultRedactPatterns)();
(0, vitest_1.describe)("redactSensitiveText", function () {
    (0, vitest_1.it)("masks env assignments while keeping the key", function () {
        var input = "OPENAI_API_KEY=sk-1234567890abcdef";
        var output = (0, redact_js_1.redactSensitiveText)(input, {
            mode: "tools",
            patterns: defaults,
        });
        (0, vitest_1.expect)(output).toBe("OPENAI_API_KEY=sk-123…cdef");
    });
    (0, vitest_1.it)("masks CLI flags", function () {
        var input = "curl --token abcdef1234567890ghij https://api.test";
        var output = (0, redact_js_1.redactSensitiveText)(input, {
            mode: "tools",
            patterns: defaults,
        });
        (0, vitest_1.expect)(output).toBe("curl --token abcdef…ghij https://api.test");
    });
    (0, vitest_1.it)("masks JSON fields", function () {
        var input = '{"token":"abcdef1234567890ghij"}';
        var output = (0, redact_js_1.redactSensitiveText)(input, {
            mode: "tools",
            patterns: defaults,
        });
        (0, vitest_1.expect)(output).toBe('{"token":"abcdef…ghij"}');
    });
    (0, vitest_1.it)("masks bearer tokens", function () {
        var input = "Authorization: Bearer abcdef1234567890ghij";
        var output = (0, redact_js_1.redactSensitiveText)(input, {
            mode: "tools",
            patterns: defaults,
        });
        (0, vitest_1.expect)(output).toBe("Authorization: Bearer abcdef…ghij");
    });
    (0, vitest_1.it)("masks Telegram-style tokens", function () {
        var input = "123456:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef";
        var output = (0, redact_js_1.redactSensitiveText)(input, {
            mode: "tools",
            patterns: defaults,
        });
        (0, vitest_1.expect)(output).toBe("123456…cdef");
    });
    (0, vitest_1.it)("redacts short tokens fully", function () {
        var input = "TOKEN=shortvalue";
        var output = (0, redact_js_1.redactSensitiveText)(input, {
            mode: "tools",
            patterns: defaults,
        });
        (0, vitest_1.expect)(output).toBe("TOKEN=***");
    });
    (0, vitest_1.it)("redacts private key blocks", function () {
        var input = [
            "-----BEGIN PRIVATE KEY-----",
            "ABCDEF1234567890",
            "ZYXWVUT987654321",
            "-----END PRIVATE KEY-----",
        ].join("\n");
        var output = (0, redact_js_1.redactSensitiveText)(input, {
            mode: "tools",
            patterns: defaults,
        });
        (0, vitest_1.expect)(output).toBe(["-----BEGIN PRIVATE KEY-----", "…redacted…", "-----END PRIVATE KEY-----"].join("\n"));
    });
    (0, vitest_1.it)("honors custom patterns with flags", function () {
        var input = "token=abcdef1234567890ghij";
        var output = (0, redact_js_1.redactSensitiveText)(input, {
            mode: "tools",
            patterns: ["/token=([A-Za-z0-9]+)/i"],
        });
        (0, vitest_1.expect)(output).toBe("token=abcdef…ghij");
    });
    (0, vitest_1.it)("skips redaction when mode is off", function () {
        var input = "OPENAI_API_KEY=sk-1234567890abcdef";
        var output = (0, redact_js_1.redactSensitiveText)(input, {
            mode: "off",
            patterns: defaults,
        });
        (0, vitest_1.expect)(output).toBe(input);
    });
});
