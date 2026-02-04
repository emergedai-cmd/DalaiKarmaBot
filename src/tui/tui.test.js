"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var tui_js_1 = require("./tui.js");
(0, vitest_1.describe)("resolveFinalAssistantText", function () {
    (0, vitest_1.it)("falls back to streamed text when final text is empty", function () {
        (0, vitest_1.expect)((0, tui_js_1.resolveFinalAssistantText)({ finalText: "", streamedText: "Hello" })).toBe("Hello");
    });
    (0, vitest_1.it)("prefers the final text when present", function () {
        (0, vitest_1.expect)((0, tui_js_1.resolveFinalAssistantText)({
            finalText: "All done",
            streamedText: "partial",
        })).toBe("All done");
    });
});
