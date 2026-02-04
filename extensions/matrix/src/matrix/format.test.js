"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var format_js_1 = require("./format.js");
(0, vitest_1.describe)("markdownToMatrixHtml", function () {
    (0, vitest_1.it)("renders basic inline formatting", function () {
        var html = (0, format_js_1.markdownToMatrixHtml)("hi _there_ **boss** `code`");
        (0, vitest_1.expect)(html).toContain("<em>there</em>");
        (0, vitest_1.expect)(html).toContain("<strong>boss</strong>");
        (0, vitest_1.expect)(html).toContain("<code>code</code>");
    });
    (0, vitest_1.it)("renders links as HTML", function () {
        var html = (0, format_js_1.markdownToMatrixHtml)("see [docs](https://example.com)");
        (0, vitest_1.expect)(html).toContain('<a href="https://example.com">docs</a>');
    });
    (0, vitest_1.it)("escapes raw HTML", function () {
        var html = (0, format_js_1.markdownToMatrixHtml)("<b>nope</b>");
        (0, vitest_1.expect)(html).toContain("&lt;b&gt;nope&lt;/b&gt;");
        (0, vitest_1.expect)(html).not.toContain("<b>nope</b>");
    });
    (0, vitest_1.it)("flattens images into alt text", function () {
        var html = (0, format_js_1.markdownToMatrixHtml)("![alt](https://example.com/img.png)");
        (0, vitest_1.expect)(html).toContain("alt");
        (0, vitest_1.expect)(html).not.toContain("<img");
    });
    (0, vitest_1.it)("preserves line breaks", function () {
        var html = (0, format_js_1.markdownToMatrixHtml)("line1\nline2");
        (0, vitest_1.expect)(html).toContain("<br");
    });
});
