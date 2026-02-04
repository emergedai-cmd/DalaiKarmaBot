"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var format_js_1 = require("./format.js");
(0, vitest_1.describe)("markdownToSignalText", function () {
    (0, vitest_1.it)("renders inline styles", function () {
        var res = (0, format_js_1.markdownToSignalText)("hi _there_ **boss** ~~nope~~ `code`");
        (0, vitest_1.expect)(res.text).toBe("hi there boss nope code");
        (0, vitest_1.expect)(res.styles).toEqual([
            { start: 3, length: 5, style: "ITALIC" },
            { start: 9, length: 4, style: "BOLD" },
            { start: 14, length: 4, style: "STRIKETHROUGH" },
            { start: 19, length: 4, style: "MONOSPACE" },
        ]);
    });
    (0, vitest_1.it)("renders links as label plus url when needed", function () {
        var res = (0, format_js_1.markdownToSignalText)("see [docs](https://example.com) and https://example.com");
        (0, vitest_1.expect)(res.text).toBe("see docs (https://example.com) and https://example.com");
        (0, vitest_1.expect)(res.styles).toEqual([]);
    });
    (0, vitest_1.it)("applies spoiler styling", function () {
        var res = (0, format_js_1.markdownToSignalText)("hello ||secret|| world");
        (0, vitest_1.expect)(res.text).toBe("hello secret world");
        (0, vitest_1.expect)(res.styles).toEqual([{ start: 6, length: 6, style: "SPOILER" }]);
    });
    (0, vitest_1.it)("renders fenced code blocks with monospaced styles", function () {
        var res = (0, format_js_1.markdownToSignalText)("before\n\n```\nconst x = 1;\n```\n\nafter");
        var prefix = "before\n\n";
        var code = "const x = 1;\n";
        var suffix = "\nafter";
        (0, vitest_1.expect)(res.text).toBe("".concat(prefix).concat(code).concat(suffix));
        (0, vitest_1.expect)(res.styles).toEqual([{ start: prefix.length, length: code.length, style: "MONOSPACE" }]);
    });
    (0, vitest_1.it)("renders lists without extra block markup", function () {
        var res = (0, format_js_1.markdownToSignalText)("- one\n- two");
        (0, vitest_1.expect)(res.text).toBe("• one\n• two");
        (0, vitest_1.expect)(res.styles).toEqual([]);
    });
    (0, vitest_1.it)("uses UTF-16 code units for offsets", function () {
        var res = (0, format_js_1.markdownToSignalText)("😀 **bold**");
        var prefix = "😀 ";
        (0, vitest_1.expect)(res.text).toBe("".concat(prefix, "bold"));
        (0, vitest_1.expect)(res.styles).toEqual([{ start: prefix.length, length: 4, style: "BOLD" }]);
    });
});
