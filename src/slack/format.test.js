"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var format_js_1 = require("./format.js");
(0, vitest_1.describe)("markdownToSlackMrkdwn", function () {
    (0, vitest_1.it)("converts bold from double asterisks to single", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("**bold text**");
        (0, vitest_1.expect)(res).toBe("*bold text*");
    });
    (0, vitest_1.it)("preserves italic underscore format", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("_italic text_");
        (0, vitest_1.expect)(res).toBe("_italic text_");
    });
    (0, vitest_1.it)("converts strikethrough from double tilde to single", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("~~strikethrough~~");
        (0, vitest_1.expect)(res).toBe("~strikethrough~");
    });
    (0, vitest_1.it)("renders basic inline formatting together", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("hi _there_ **boss** `code`");
        (0, vitest_1.expect)(res).toBe("hi _there_ *boss* `code`");
    });
    (0, vitest_1.it)("renders inline code", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("use `npm install`");
        (0, vitest_1.expect)(res).toBe("use `npm install`");
    });
    (0, vitest_1.it)("renders fenced code blocks", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("```js\nconst x = 1;\n```");
        (0, vitest_1.expect)(res).toBe("```\nconst x = 1;\n```");
    });
    (0, vitest_1.it)("renders links with Slack mrkdwn syntax", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("see [docs](https://example.com)");
        (0, vitest_1.expect)(res).toBe("see <https://example.com|docs>");
    });
    (0, vitest_1.it)("does not duplicate bare URLs", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("see https://example.com");
        (0, vitest_1.expect)(res).toBe("see https://example.com");
    });
    (0, vitest_1.it)("escapes unsafe characters", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("a & b < c > d");
        (0, vitest_1.expect)(res).toBe("a &amp; b &lt; c &gt; d");
    });
    (0, vitest_1.it)("preserves Slack angle-bracket markup (mentions/links)", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("hi <@U123> see <https://example.com|docs> and <!here>");
        (0, vitest_1.expect)(res).toBe("hi <@U123> see <https://example.com|docs> and <!here>");
    });
    (0, vitest_1.it)("escapes raw HTML", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("<b>nope</b>");
        (0, vitest_1.expect)(res).toBe("&lt;b&gt;nope&lt;/b&gt;");
    });
    (0, vitest_1.it)("renders paragraphs with blank lines", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("first\n\nsecond");
        (0, vitest_1.expect)(res).toBe("first\n\nsecond");
    });
    (0, vitest_1.it)("renders bullet lists", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("- one\n- two");
        (0, vitest_1.expect)(res).toBe("• one\n• two");
    });
    (0, vitest_1.it)("renders ordered lists with numbering", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("2. two\n3. three");
        (0, vitest_1.expect)(res).toBe("2. two\n3. three");
    });
    (0, vitest_1.it)("renders headings as bold text", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("# Title");
        (0, vitest_1.expect)(res).toBe("*Title*");
    });
    (0, vitest_1.it)("renders blockquotes", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("> Quote");
        (0, vitest_1.expect)(res).toBe("> Quote");
    });
    (0, vitest_1.it)("handles adjacent list items", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("- item\n  - nested");
        // markdown-it treats indented items as continuation, not nesting
        (0, vitest_1.expect)(res).toBe("• item  • nested");
    });
    (0, vitest_1.it)("handles complex message with multiple elements", function () {
        var res = (0, format_js_1.markdownToSlackMrkdwn)("**Important:** Check the _docs_ at [link](https://example.com)\n\n- first\n- second");
        (0, vitest_1.expect)(res).toBe("*Important:* Check the _docs_ at <https://example.com|link>\n\n• first\n• second");
    });
});
