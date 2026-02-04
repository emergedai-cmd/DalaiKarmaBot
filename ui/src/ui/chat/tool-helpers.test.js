"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var tool_helpers_1 = require("./tool-helpers");
(0, vitest_1.describe)("tool-helpers", function () {
    (0, vitest_1.describe)("formatToolOutputForSidebar", function () {
        (0, vitest_1.it)("formats valid JSON object as code block", function () {
            var input = '{"name":"test","value":123}';
            var result = (0, tool_helpers_1.formatToolOutputForSidebar)(input);
            (0, vitest_1.expect)(result).toBe("```json\n{\n  \"name\": \"test\",\n  \"value\": 123\n}\n```");
        });
        (0, vitest_1.it)("formats valid JSON array as code block", function () {
            var input = "[1, 2, 3]";
            var result = (0, tool_helpers_1.formatToolOutputForSidebar)(input);
            (0, vitest_1.expect)(result).toBe("```json\n[\n  1,\n  2,\n  3\n]\n```");
        });
        (0, vitest_1.it)("handles nested JSON objects", function () {
            var input = '{"outer":{"inner":"value"}}';
            var result = (0, tool_helpers_1.formatToolOutputForSidebar)(input);
            (0, vitest_1.expect)(result).toContain("```json");
            (0, vitest_1.expect)(result).toContain('"outer"');
            (0, vitest_1.expect)(result).toContain('"inner"');
        });
        (0, vitest_1.it)("returns plain text for non-JSON content", function () {
            var input = "This is plain text output";
            var result = (0, tool_helpers_1.formatToolOutputForSidebar)(input);
            (0, vitest_1.expect)(result).toBe("This is plain text output");
        });
        (0, vitest_1.it)("returns as-is for invalid JSON starting with {", function () {
            var input = "{not valid json";
            var result = (0, tool_helpers_1.formatToolOutputForSidebar)(input);
            (0, vitest_1.expect)(result).toBe("{not valid json");
        });
        (0, vitest_1.it)("returns as-is for invalid JSON starting with [", function () {
            var input = "[not valid json";
            var result = (0, tool_helpers_1.formatToolOutputForSidebar)(input);
            (0, vitest_1.expect)(result).toBe("[not valid json");
        });
        (0, vitest_1.it)("trims whitespace before detecting JSON", function () {
            var input = '   {"trimmed": true}   ';
            var result = (0, tool_helpers_1.formatToolOutputForSidebar)(input);
            (0, vitest_1.expect)(result).toContain("```json");
            (0, vitest_1.expect)(result).toContain('"trimmed"');
        });
        (0, vitest_1.it)("handles empty string", function () {
            var result = (0, tool_helpers_1.formatToolOutputForSidebar)("");
            (0, vitest_1.expect)(result).toBe("");
        });
        (0, vitest_1.it)("handles whitespace-only string", function () {
            var result = (0, tool_helpers_1.formatToolOutputForSidebar)("   ");
            (0, vitest_1.expect)(result).toBe("   ");
        });
    });
    (0, vitest_1.describe)("getTruncatedPreview", function () {
        (0, vitest_1.it)("returns short text unchanged", function () {
            var input = "Short text";
            var result = (0, tool_helpers_1.getTruncatedPreview)(input);
            (0, vitest_1.expect)(result).toBe("Short text");
        });
        (0, vitest_1.it)("truncates text longer than max chars", function () {
            var input = "a".repeat(150);
            var result = (0, tool_helpers_1.getTruncatedPreview)(input);
            (0, vitest_1.expect)(result.length).toBe(101); // 100 chars + ellipsis
            (0, vitest_1.expect)(result.endsWith("…")).toBe(true);
        });
        (0, vitest_1.it)("truncates to max lines", function () {
            var input = "Line 1\nLine 2\nLine 3\nLine 4\nLine 5";
            var result = (0, tool_helpers_1.getTruncatedPreview)(input);
            // Should only show first 2 lines (PREVIEW_MAX_LINES = 2)
            (0, vitest_1.expect)(result).toBe("Line 1\nLine 2…");
        });
        (0, vitest_1.it)("adds ellipsis when lines are truncated", function () {
            var input = "Line 1\nLine 2\nLine 3";
            var result = (0, tool_helpers_1.getTruncatedPreview)(input);
            (0, vitest_1.expect)(result.endsWith("…")).toBe(true);
        });
        (0, vitest_1.it)("does not add ellipsis when all lines fit", function () {
            var input = "Line 1\nLine 2";
            var result = (0, tool_helpers_1.getTruncatedPreview)(input);
            (0, vitest_1.expect)(result).toBe("Line 1\nLine 2");
            (0, vitest_1.expect)(result.endsWith("…")).toBe(false);
        });
        (0, vitest_1.it)("handles single line within limits", function () {
            var input = "Single line";
            var result = (0, tool_helpers_1.getTruncatedPreview)(input);
            (0, vitest_1.expect)(result).toBe("Single line");
        });
        (0, vitest_1.it)("handles empty string", function () {
            var result = (0, tool_helpers_1.getTruncatedPreview)("");
            (0, vitest_1.expect)(result).toBe("");
        });
        (0, vitest_1.it)("truncates by chars even within line limit", function () {
            // Two lines but very long content
            var longLine = "x".repeat(80);
            var input = "".concat(longLine, "\n").concat(longLine);
            var result = (0, tool_helpers_1.getTruncatedPreview)(input);
            (0, vitest_1.expect)(result.length).toBe(101); // 100 + ellipsis
            (0, vitest_1.expect)(result.endsWith("…")).toBe(true);
        });
    });
});
