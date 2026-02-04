"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var reasoning_tags_js_1 = require("./reasoning-tags.js");
(0, vitest_1.describe)("stripReasoningTagsFromText", function () {
    (0, vitest_1.describe)("basic functionality", function () {
        (0, vitest_1.it)("returns text unchanged when no reasoning tags present", function () {
            var input = "Hello, this is a normal message.";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe(input);
        });
        (0, vitest_1.it)("strips proper think tags", function () {
            var input = "Hello <think>internal reasoning</think> world!";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("Hello  world!");
        });
        (0, vitest_1.it)("strips thinking tags", function () {
            var input = "Before <thinking>some thought</thinking> after";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("Before  after");
        });
        (0, vitest_1.it)("strips thought tags", function () {
            var input = "A <thought>hmm</thought> B";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("A  B");
        });
        (0, vitest_1.it)("strips antthinking tags", function () {
            var input = "X <antthinking>internal</antthinking> Y";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("X  Y");
        });
        (0, vitest_1.it)("strips multiple reasoning blocks", function () {
            var input = "<think>first</think>A<think>second</think>B";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("AB");
        });
    });
    (0, vitest_1.describe)("code block preservation (issue #3952)", function () {
        (0, vitest_1.it)("preserves think tags inside fenced code blocks", function () {
            var input = "Use the tag like this:\n```\n<think>reasoning</think>\n```\nThat's it!";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe(input);
        });
        (0, vitest_1.it)("preserves think tags inside inline code", function () {
            var input = "The `<think>` tag is used for reasoning. Don't forget the closing `</think>` tag.";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe(input);
        });
        (0, vitest_1.it)("preserves tags in fenced code blocks with language specifier", function () {
            var input = "Example:\n```xml\n<think>\n  <thought>nested</thought>\n</think>\n```\nDone!";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe(input);
        });
        (0, vitest_1.it)("handles mixed real tags and code tags", function () {
            var input = "<think>hidden</think>Visible text with `<think>` example.";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("Visible text with `<think>` example.");
        });
        (0, vitest_1.it)("preserves both opening and closing tags in backticks", function () {
            var input = "Use `<think>` to open and `</think>` to close.";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe(input);
        });
        (0, vitest_1.it)("preserves think tags in code block at EOF without trailing newline", function () {
            var input = "Example:\n```\n<think>reasoning</think>\n```";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe(input);
        });
        (0, vitest_1.it)("preserves final tags inside code blocks", function () {
            var input = "Use `<final>` for final answers in code: ```\n<final>42</final>\n```";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe(input);
        });
        (0, vitest_1.it)("handles code block followed by real tags", function () {
            var input = "```\n<think>code</think>\n```\n<think>real hidden</think>visible";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("```\n<think>code</think>\n```\nvisible");
        });
        (0, vitest_1.it)("handles multiple code blocks with tags", function () {
            var input = "First `<think>` then ```\n<thinking>block</thinking>\n``` then `<thought>`";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe(input);
        });
    });
    (0, vitest_1.describe)("edge cases", function () {
        (0, vitest_1.it)("preserves unclosed <think without angle bracket", function () {
            var input = "Here is how to use <think tags in your code";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe(input);
        });
        (0, vitest_1.it)("strips lone closing tag outside code", function () {
            var input = "You can start with <think and then close with </think>";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("You can start with <think and then close with");
        });
        (0, vitest_1.it)("handles tags with whitespace", function () {
            var input = "A < think >content< /think > B";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("A  B");
        });
        (0, vitest_1.it)("handles empty input", function () {
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)("")).toBe("");
        });
        (0, vitest_1.it)("handles null-ish input", function () {
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(null)).toBe(null);
        });
        (0, vitest_1.it)("preserves think tags inside tilde fenced code blocks", function () {
            var input = "Example:\n~~~\n<think>reasoning</think>\n~~~\nDone!";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe(input);
        });
        (0, vitest_1.it)("preserves tags in tilde block at EOF without trailing newline", function () {
            var input = "Example:\n~~~js\n<think>code</think>\n~~~";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe(input);
        });
        (0, vitest_1.it)("handles nested think patterns (first close ends block)", function () {
            var input = "<think>outer <think>inner</think> still outer</think>visible";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("still outervisible");
        });
        (0, vitest_1.it)("strips final tag markup but preserves content (by design)", function () {
            var input = "A<final>1</final>B<final>2</final>C";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("A1B2C");
        });
        (0, vitest_1.it)("preserves final tags in inline code (markup only stripped outside)", function () {
            var input = "`<final>` in code, <final>visible</final> outside";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("`<final>` in code, visible outside");
        });
        (0, vitest_1.it)("handles double backtick inline code with tags", function () {
            var input = "Use ``code`` with <think>hidden</think> text";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("Use ``code`` with  text");
        });
        (0, vitest_1.it)("handles fenced code blocks with content", function () {
            var input = "Before\n```\ncode\n```\nAfter with <think>hidden</think>";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("Before\n```\ncode\n```\nAfter with");
        });
        (0, vitest_1.it)("does not match mismatched fence types (``` vs ~~~)", function () {
            var input = "```\n<think>not protected\n~~~\n</think>text";
            var result = (0, reasoning_tags_js_1.stripReasoningTagsFromText)(input);
            (0, vitest_1.expect)(result).toBe(input);
        });
        (0, vitest_1.it)("handles unicode content inside and around tags", function () {
            var input = "你好 <think>思考 🤔</think> 世界";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("你好  世界");
        });
        (0, vitest_1.it)("handles very long content between tags efficiently", function () {
            var longContent = "x".repeat(10000);
            var input = "<think>".concat(longContent, "</think>visible");
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("visible");
        });
        (0, vitest_1.it)("handles tags with attributes", function () {
            var input = "A <think id='test' class=\"foo\">hidden</think> B";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("A  B");
        });
        (0, vitest_1.it)("is case-insensitive for tag names", function () {
            var input = "A <THINK>hidden</THINK> <Thinking>also hidden</Thinking> B";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("A   B");
        });
        (0, vitest_1.it)("handles pathological nested backtick patterns without hanging", function () {
            var input = "`".repeat(100) + "<think>test</think>" + "`".repeat(100);
            var start = Date.now();
            (0, reasoning_tags_js_1.stripReasoningTagsFromText)(input);
            var elapsed = Date.now() - start;
            (0, vitest_1.expect)(elapsed).toBeLessThan(1000);
        });
        (0, vitest_1.it)("handles unclosed inline code gracefully", function () {
            var input = "Start `unclosed <think>hidden</think> end";
            var result = (0, reasoning_tags_js_1.stripReasoningTagsFromText)(input);
            (0, vitest_1.expect)(result).toBe("Start `unclosed  end");
        });
    });
    (0, vitest_1.describe)("strict vs preserve mode", function () {
        (0, vitest_1.it)("strict mode truncates on unclosed tag", function () {
            var input = "Before <think>unclosed content after";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input, { mode: "strict" })).toBe("Before");
        });
        (0, vitest_1.it)("preserve mode keeps content after unclosed tag", function () {
            var input = "Before <think>unclosed content after";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input, { mode: "preserve" })).toBe("Before unclosed content after");
        });
    });
    (0, vitest_1.describe)("trim options", function () {
        (0, vitest_1.it)("trims both sides by default", function () {
            var input = "  <think>x</think>  result  <think>y</think>  ";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input)).toBe("result");
        });
        (0, vitest_1.it)("trim=none preserves whitespace", function () {
            var input = "  <think>x</think>  result  ";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input, { trim: "none" })).toBe("    result  ");
        });
        (0, vitest_1.it)("trim=start only trims start", function () {
            var input = "  <think>x</think>  result  ";
            (0, vitest_1.expect)((0, reasoning_tags_js_1.stripReasoningTagsFromText)(input, { trim: "start" })).toBe("result  ");
        });
    });
});
