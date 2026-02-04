"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var tool_display_js_1 = require("./tool-display.js");
(0, vitest_1.describe)("tool display details", function () {
    (0, vitest_1.it)("skips zero/false values for optional detail fields", function () {
        var detail = (0, tool_display_js_1.formatToolDetail)((0, tool_display_js_1.resolveToolDisplay)({
            name: "sessions_spawn",
            args: {
                task: "double-message-bug-gpt",
                label: 0,
                runTimeoutSeconds: 0,
                timeoutSeconds: 0,
            },
        }));
        (0, vitest_1.expect)(detail).toBe("double-message-bug-gpt");
    });
    (0, vitest_1.it)("includes only truthy boolean details", function () {
        var detail = (0, tool_display_js_1.formatToolDetail)((0, tool_display_js_1.resolveToolDisplay)({
            name: "message",
            args: {
                action: "react",
                provider: "discord",
                to: "chan-1",
                remove: false,
            },
        }));
        (0, vitest_1.expect)(detail).toContain("provider discord");
        (0, vitest_1.expect)(detail).toContain("to chan-1");
        (0, vitest_1.expect)(detail).not.toContain("remove");
    });
    (0, vitest_1.it)("keeps positive numbers and true booleans", function () {
        var detail = (0, tool_display_js_1.formatToolDetail)((0, tool_display_js_1.resolveToolDisplay)({
            name: "sessions_history",
            args: {
                sessionKey: "agent:main:main",
                limit: 20,
                includeTools: true,
            },
        }));
        (0, vitest_1.expect)(detail).toContain("session agent:main:main");
        (0, vitest_1.expect)(detail).toContain("limit 20");
        (0, vitest_1.expect)(detail).toContain("tools true");
    });
});
