"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var format_js_1 = require("./format.js");
(0, vitest_1.describe)("markdownToTelegramHtml", function () {
    (0, vitest_1.it)("renders basic inline formatting", function () {
        var res = (0, format_js_1.markdownToTelegramHtml)("hi _there_ **boss** `code`");
        (0, vitest_1.expect)(res).toBe("hi <i>there</i> <b>boss</b> <code>code</code>");
    });
    (0, vitest_1.it)("renders links as Telegram-safe HTML", function () {
        var res = (0, format_js_1.markdownToTelegramHtml)("see [docs](https://example.com)");
        (0, vitest_1.expect)(res).toBe('see <a href="https://example.com">docs</a>');
    });
    (0, vitest_1.it)("escapes raw HTML", function () {
        var res = (0, format_js_1.markdownToTelegramHtml)("<b>nope</b>");
        (0, vitest_1.expect)(res).toBe("&lt;b&gt;nope&lt;/b&gt;");
    });
    (0, vitest_1.it)("escapes unsafe characters", function () {
        var res = (0, format_js_1.markdownToTelegramHtml)("a & b < c");
        (0, vitest_1.expect)(res).toBe("a &amp; b &lt; c");
    });
    (0, vitest_1.it)("renders paragraphs with blank lines", function () {
        var res = (0, format_js_1.markdownToTelegramHtml)("first\n\nsecond");
        (0, vitest_1.expect)(res).toBe("first\n\nsecond");
    });
    (0, vitest_1.it)("renders lists without block HTML", function () {
        var res = (0, format_js_1.markdownToTelegramHtml)("- one\n- two");
        (0, vitest_1.expect)(res).toBe("• one\n• two");
    });
    (0, vitest_1.it)("renders ordered lists with numbering", function () {
        var res = (0, format_js_1.markdownToTelegramHtml)("2. two\n3. three");
        (0, vitest_1.expect)(res).toBe("2. two\n3. three");
    });
    (0, vitest_1.it)("flattens headings and blockquotes", function () {
        var res = (0, format_js_1.markdownToTelegramHtml)("# Title\n\n> Quote");
        (0, vitest_1.expect)(res).toBe("Title\n\nQuote");
    });
    (0, vitest_1.it)("renders fenced code blocks", function () {
        var res = (0, format_js_1.markdownToTelegramHtml)("```js\nconst x = 1;\n```");
        (0, vitest_1.expect)(res).toBe("<pre><code>const x = 1;\n</code></pre>");
    });
    (0, vitest_1.it)("properly nests overlapping bold and autolink (#4071)", function () {
        var res = (0, format_js_1.markdownToTelegramHtml)("**start https://example.com** end");
        (0, vitest_1.expect)(res).toMatch(/<b>start <a href="https:\/\/example\.com">https:\/\/example\.com<\/a><\/b> end/);
    });
    (0, vitest_1.it)("properly nests link inside bold", function () {
        var res = (0, format_js_1.markdownToTelegramHtml)("**bold [link](https://example.com) text**");
        (0, vitest_1.expect)(res).toBe('<b>bold <a href="https://example.com">link</a> text</b>');
    });
    (0, vitest_1.it)("properly nests bold wrapping a link with trailing text", function () {
        var res = (0, format_js_1.markdownToTelegramHtml)("**[link](https://example.com) rest**");
        (0, vitest_1.expect)(res).toBe('<b><a href="https://example.com">link</a> rest</b>');
    });
    (0, vitest_1.it)("properly nests bold inside a link", function () {
        var res = (0, format_js_1.markdownToTelegramHtml)("[**bold**](https://example.com)");
        (0, vitest_1.expect)(res).toBe('<a href="https://example.com"><b>bold</b></a>');
    });
});
