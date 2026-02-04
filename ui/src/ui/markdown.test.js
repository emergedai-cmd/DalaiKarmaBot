"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var markdown_1 = require("./markdown");
(0, vitest_1.describe)("toSanitizedMarkdownHtml", function () {
    (0, vitest_1.it)("renders basic markdown", function () {
        var html = (0, markdown_1.toSanitizedMarkdownHtml)("Hello **world**");
        (0, vitest_1.expect)(html).toContain("<strong>world</strong>");
    });
    (0, vitest_1.it)("strips scripts and unsafe links", function () {
        var html = (0, markdown_1.toSanitizedMarkdownHtml)([
            "<script>alert(1)</script>",
            "",
            "[x](javascript:alert(1))",
            "",
            "[ok](https://example.com)",
        ].join("\n"));
        (0, vitest_1.expect)(html).not.toContain("<script");
        (0, vitest_1.expect)(html).not.toContain("javascript:");
        (0, vitest_1.expect)(html).toContain("https://example.com");
    });
    (0, vitest_1.it)("renders fenced code blocks", function () {
        var html = (0, markdown_1.toSanitizedMarkdownHtml)(["```ts", "console.log(1)", "```"].join("\n"));
        (0, vitest_1.expect)(html).toContain("<pre>");
        (0, vitest_1.expect)(html).toContain("<code");
        (0, vitest_1.expect)(html).toContain("console.log(1)");
    });
});
