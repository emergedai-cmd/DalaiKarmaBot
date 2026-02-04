"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
(0, vitest_1.describe)("sanitizeToolCallId", function () {
    (0, vitest_1.describe)("strict mode (default)", function () {
        (0, vitest_1.it)("keeps valid alphanumeric tool call IDs", function () {
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeToolCallId)("callabc123")).toBe("callabc123");
        });
        (0, vitest_1.it)("strips underscores and hyphens", function () {
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeToolCallId)("call_abc-123")).toBe("callabc123");
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeToolCallId)("call_abc_def")).toBe("callabcdef");
        });
        (0, vitest_1.it)("strips invalid characters", function () {
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeToolCallId)("call_abc|item:456")).toBe("callabcitem456");
        });
        (0, vitest_1.it)("returns default for empty IDs", function () {
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeToolCallId)("")).toBe("defaulttoolid");
        });
    });
    (0, vitest_1.describe)("strict mode (alphanumeric only)", function () {
        (0, vitest_1.it)("strips all non-alphanumeric characters", function () {
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeToolCallId)("call_abc-123", "strict")).toBe("callabc123");
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeToolCallId)("call_abc|item:456", "strict")).toBe("callabcitem456");
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeToolCallId)("whatsapp_login_1768799841527_1", "strict")).toBe("whatsapplogin17687998415271");
        });
        (0, vitest_1.it)("returns default for empty IDs", function () {
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeToolCallId)("", "strict")).toBe("defaulttoolid");
        });
    });
    (0, vitest_1.describe)("strict9 mode (Mistral tool call IDs)", function () {
        (0, vitest_1.it)("returns alphanumeric IDs with length 9", function () {
            var out = (0, pi_embedded_helpers_js_1.sanitizeToolCallId)("call_abc|item:456", "strict9");
            (0, vitest_1.expect)(out).toMatch(/^[a-zA-Z0-9]{9}$/);
        });
        (0, vitest_1.it)("returns default for empty IDs", function () {
            (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.sanitizeToolCallId)("", "strict9")).toMatch(/^[a-zA-Z0-9]{9}$/);
        });
    });
});
