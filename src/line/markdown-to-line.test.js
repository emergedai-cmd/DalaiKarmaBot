"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var markdown_to_line_js_1 = require("./markdown-to-line.js");
(0, vitest_1.describe)("extractMarkdownTables", function () {
    (0, vitest_1.it)("extracts a simple 2-column table", function () {
        var text = "Here is a table:\n\n| Name | Value |\n|------|-------|\n| foo  | 123   |\n| bar  | 456   |\n\nAnd some more text.";
        var _a = (0, markdown_to_line_js_1.extractMarkdownTables)(text), tables = _a.tables, textWithoutTables = _a.textWithoutTables;
        (0, vitest_1.expect)(tables).toHaveLength(1);
        (0, vitest_1.expect)(tables[0].headers).toEqual(["Name", "Value"]);
        (0, vitest_1.expect)(tables[0].rows).toEqual([
            ["foo", "123"],
            ["bar", "456"],
        ]);
        (0, vitest_1.expect)(textWithoutTables).toContain("Here is a table:");
        (0, vitest_1.expect)(textWithoutTables).toContain("And some more text.");
        (0, vitest_1.expect)(textWithoutTables).not.toContain("|");
    });
    (0, vitest_1.it)("extracts a multi-column table", function () {
        var text = "| Col A | Col B | Col C |\n|-------|-------|-------|\n| 1     | 2     | 3     |\n| a     | b     | c     |";
        var tables = (0, markdown_to_line_js_1.extractMarkdownTables)(text).tables;
        (0, vitest_1.expect)(tables).toHaveLength(1);
        (0, vitest_1.expect)(tables[0].headers).toEqual(["Col A", "Col B", "Col C"]);
        (0, vitest_1.expect)(tables[0].rows).toHaveLength(2);
    });
    (0, vitest_1.it)("extracts multiple tables", function () {
        var text = "Table 1:\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\nTable 2:\n\n| X | Y |\n|---|---|\n| 3 | 4 |";
        var tables = (0, markdown_to_line_js_1.extractMarkdownTables)(text).tables;
        (0, vitest_1.expect)(tables).toHaveLength(2);
        (0, vitest_1.expect)(tables[0].headers).toEqual(["A", "B"]);
        (0, vitest_1.expect)(tables[1].headers).toEqual(["X", "Y"]);
    });
    (0, vitest_1.it)("handles tables with alignment markers", function () {
        var text = "| Left | Center | Right |\n|:-----|:------:|------:|\n| a    | b      | c     |";
        var tables = (0, markdown_to_line_js_1.extractMarkdownTables)(text).tables;
        (0, vitest_1.expect)(tables).toHaveLength(1);
        (0, vitest_1.expect)(tables[0].headers).toEqual(["Left", "Center", "Right"]);
        (0, vitest_1.expect)(tables[0].rows).toEqual([["a", "b", "c"]]);
    });
    (0, vitest_1.it)("returns empty when no tables present", function () {
        var text = "Just some plain text without tables.";
        var _a = (0, markdown_to_line_js_1.extractMarkdownTables)(text), tables = _a.tables, textWithoutTables = _a.textWithoutTables;
        (0, vitest_1.expect)(tables).toHaveLength(0);
        (0, vitest_1.expect)(textWithoutTables).toBe(text);
    });
});
(0, vitest_1.describe)("extractCodeBlocks", function () {
    (0, vitest_1.it)("extracts a code block with language", function () {
        var text = "Here is some code:\n\n```javascript\nconst x = 1;\nconsole.log(x);\n```\n\nAnd more text.";
        var _a = (0, markdown_to_line_js_1.extractCodeBlocks)(text), codeBlocks = _a.codeBlocks, textWithoutCode = _a.textWithoutCode;
        (0, vitest_1.expect)(codeBlocks).toHaveLength(1);
        (0, vitest_1.expect)(codeBlocks[0].language).toBe("javascript");
        (0, vitest_1.expect)(codeBlocks[0].code).toBe("const x = 1;\nconsole.log(x);");
        (0, vitest_1.expect)(textWithoutCode).toContain("Here is some code:");
        (0, vitest_1.expect)(textWithoutCode).toContain("And more text.");
        (0, vitest_1.expect)(textWithoutCode).not.toContain("```");
    });
    (0, vitest_1.it)("extracts a code block without language", function () {
        var text = "```\nplain code\n```";
        var codeBlocks = (0, markdown_to_line_js_1.extractCodeBlocks)(text).codeBlocks;
        (0, vitest_1.expect)(codeBlocks).toHaveLength(1);
        (0, vitest_1.expect)(codeBlocks[0].language).toBeUndefined();
        (0, vitest_1.expect)(codeBlocks[0].code).toBe("plain code");
    });
    (0, vitest_1.it)("extracts multiple code blocks", function () {
        var text = "```python\nprint(\"hello\")\n```\n\nSome text\n\n```bash\necho \"world\"\n```";
        var codeBlocks = (0, markdown_to_line_js_1.extractCodeBlocks)(text).codeBlocks;
        (0, vitest_1.expect)(codeBlocks).toHaveLength(2);
        (0, vitest_1.expect)(codeBlocks[0].language).toBe("python");
        (0, vitest_1.expect)(codeBlocks[1].language).toBe("bash");
    });
    (0, vitest_1.it)("returns empty when no code blocks present", function () {
        var text = "No code here, just text.";
        var _a = (0, markdown_to_line_js_1.extractCodeBlocks)(text), codeBlocks = _a.codeBlocks, textWithoutCode = _a.textWithoutCode;
        (0, vitest_1.expect)(codeBlocks).toHaveLength(0);
        (0, vitest_1.expect)(textWithoutCode).toBe(text);
    });
});
(0, vitest_1.describe)("extractLinks", function () {
    (0, vitest_1.it)("extracts markdown links", function () {
        var text = "Check out [Google](https://google.com) and [GitHub](https://github.com).";
        var _a = (0, markdown_to_line_js_1.extractLinks)(text), links = _a.links, textWithLinks = _a.textWithLinks;
        (0, vitest_1.expect)(links).toHaveLength(2);
        (0, vitest_1.expect)(links[0]).toEqual({ text: "Google", url: "https://google.com" });
        (0, vitest_1.expect)(links[1]).toEqual({ text: "GitHub", url: "https://github.com" });
        (0, vitest_1.expect)(textWithLinks).toBe("Check out Google and GitHub.");
    });
    (0, vitest_1.it)("handles text without links", function () {
        var text = "No links here.";
        var _a = (0, markdown_to_line_js_1.extractLinks)(text), links = _a.links, textWithLinks = _a.textWithLinks;
        (0, vitest_1.expect)(links).toHaveLength(0);
        (0, vitest_1.expect)(textWithLinks).toBe(text);
    });
});
(0, vitest_1.describe)("stripMarkdown", function () {
    (0, vitest_1.it)("strips bold markers", function () {
        (0, vitest_1.expect)((0, markdown_to_line_js_1.stripMarkdown)("This is **bold** text")).toBe("This is bold text");
        (0, vitest_1.expect)((0, markdown_to_line_js_1.stripMarkdown)("This is __bold__ text")).toBe("This is bold text");
    });
    (0, vitest_1.it)("strips italic markers", function () {
        (0, vitest_1.expect)((0, markdown_to_line_js_1.stripMarkdown)("This is *italic* text")).toBe("This is italic text");
        (0, vitest_1.expect)((0, markdown_to_line_js_1.stripMarkdown)("This is _italic_ text")).toBe("This is italic text");
    });
    (0, vitest_1.it)("strips strikethrough markers", function () {
        (0, vitest_1.expect)((0, markdown_to_line_js_1.stripMarkdown)("This is ~~deleted~~ text")).toBe("This is deleted text");
    });
    (0, vitest_1.it)("strips headers", function () {
        (0, vitest_1.expect)((0, markdown_to_line_js_1.stripMarkdown)("# Heading 1")).toBe("Heading 1");
        (0, vitest_1.expect)((0, markdown_to_line_js_1.stripMarkdown)("## Heading 2")).toBe("Heading 2");
        (0, vitest_1.expect)((0, markdown_to_line_js_1.stripMarkdown)("### Heading 3")).toBe("Heading 3");
    });
    (0, vitest_1.it)("strips blockquotes", function () {
        (0, vitest_1.expect)((0, markdown_to_line_js_1.stripMarkdown)("> This is a quote")).toBe("This is a quote");
        (0, vitest_1.expect)((0, markdown_to_line_js_1.stripMarkdown)(">This is also a quote")).toBe("This is also a quote");
    });
    (0, vitest_1.it)("removes horizontal rules", function () {
        (0, vitest_1.expect)((0, markdown_to_line_js_1.stripMarkdown)("Above\n---\nBelow")).toBe("Above\n\nBelow");
        (0, vitest_1.expect)((0, markdown_to_line_js_1.stripMarkdown)("Above\n***\nBelow")).toBe("Above\n\nBelow");
    });
    (0, vitest_1.it)("strips inline code markers", function () {
        (0, vitest_1.expect)((0, markdown_to_line_js_1.stripMarkdown)("Use `const` keyword")).toBe("Use const keyword");
    });
    (0, vitest_1.it)("handles complex markdown", function () {
        var input = "# Title\n\nThis is **bold** and *italic* text.\n\n> A quote\n\nSome ~~deleted~~ content.";
        var result = (0, markdown_to_line_js_1.stripMarkdown)(input);
        (0, vitest_1.expect)(result).toContain("Title");
        (0, vitest_1.expect)(result).toContain("This is bold and italic text.");
        (0, vitest_1.expect)(result).toContain("A quote");
        (0, vitest_1.expect)(result).toContain("Some deleted content.");
        (0, vitest_1.expect)(result).not.toContain("#");
        (0, vitest_1.expect)(result).not.toContain("**");
        (0, vitest_1.expect)(result).not.toContain("~~");
        (0, vitest_1.expect)(result).not.toContain(">");
    });
});
(0, vitest_1.describe)("convertTableToFlexBubble", function () {
    (0, vitest_1.it)("creates a receipt-style card for 2-column tables", function () {
        var table = {
            headers: ["Item", "Price"],
            rows: [
                ["Apple", "$1"],
                ["Banana", "$2"],
            ],
        };
        var bubble = (0, markdown_to_line_js_1.convertTableToFlexBubble)(table);
        (0, vitest_1.expect)(bubble.type).toBe("bubble");
        (0, vitest_1.expect)(bubble.body).toBeDefined();
    });
    (0, vitest_1.it)("creates a multi-column layout for 3+ column tables", function () {
        var table = {
            headers: ["A", "B", "C"],
            rows: [["1", "2", "3"]],
        };
        var bubble = (0, markdown_to_line_js_1.convertTableToFlexBubble)(table);
        (0, vitest_1.expect)(bubble.type).toBe("bubble");
        (0, vitest_1.expect)(bubble.body).toBeDefined();
    });
    (0, vitest_1.it)("replaces empty cells with placeholders", function () {
        var table = {
            headers: ["A", "B"],
            rows: [["", ""]],
        };
        var bubble = (0, markdown_to_line_js_1.convertTableToFlexBubble)(table);
        var body = bubble.body;
        var rowsBox = body.contents[2];
        (0, vitest_1.expect)(rowsBox.contents[0].contents[0].text).toBe("-");
        (0, vitest_1.expect)(rowsBox.contents[0].contents[1].text).toBe("-");
    });
    (0, vitest_1.it)("strips bold markers and applies weight for fully bold cells", function () {
        var table = {
            headers: ["**Name**", "Status"],
            rows: [["**Alpha**", "OK"]],
        };
        var bubble = (0, markdown_to_line_js_1.convertTableToFlexBubble)(table);
        var body = bubble.body;
        var headerRow = body.contents[0];
        var dataRow = body.contents[2];
        (0, vitest_1.expect)(headerRow.contents[0].text).toBe("Name");
        (0, vitest_1.expect)(headerRow.contents[0].weight).toBe("bold");
        (0, vitest_1.expect)(dataRow.contents[0].text).toBe("Alpha");
        (0, vitest_1.expect)(dataRow.contents[0].weight).toBe("bold");
    });
});
(0, vitest_1.describe)("convertCodeBlockToFlexBubble", function () {
    (0, vitest_1.it)("creates a code card with language label", function () {
        var block = { language: "typescript", code: "const x = 1;" };
        var bubble = (0, markdown_to_line_js_1.convertCodeBlockToFlexBubble)(block);
        (0, vitest_1.expect)(bubble.type).toBe("bubble");
        (0, vitest_1.expect)(bubble.body).toBeDefined();
        var body = bubble.body;
        (0, vitest_1.expect)(body.contents[0].text).toBe("Code (typescript)");
    });
    (0, vitest_1.it)("creates a code card without language", function () {
        var block = { code: "plain code" };
        var bubble = (0, markdown_to_line_js_1.convertCodeBlockToFlexBubble)(block);
        var body = bubble.body;
        (0, vitest_1.expect)(body.contents[0].text).toBe("Code");
    });
    (0, vitest_1.it)("truncates very long code", function () {
        var longCode = "x".repeat(3000);
        var block = { code: longCode };
        var bubble = (0, markdown_to_line_js_1.convertCodeBlockToFlexBubble)(block);
        var body = bubble.body;
        var codeText = body.contents[1].contents[0].text;
        (0, vitest_1.expect)(codeText.length).toBeLessThan(longCode.length);
        (0, vitest_1.expect)(codeText).toContain("...");
    });
});
(0, vitest_1.describe)("processLineMessage", function () {
    (0, vitest_1.it)("processes text with tables", function () {
        var text = "Here's the data:\n\n| Key | Value |\n|-----|-------|\n| a   | 1     |\n\nDone.";
        var result = (0, markdown_to_line_js_1.processLineMessage)(text);
        (0, vitest_1.expect)(result.flexMessages).toHaveLength(1);
        (0, vitest_1.expect)(result.flexMessages[0].type).toBe("flex");
        (0, vitest_1.expect)(result.text).toContain("Here's the data:");
        (0, vitest_1.expect)(result.text).toContain("Done.");
        (0, vitest_1.expect)(result.text).not.toContain("|");
    });
    (0, vitest_1.it)("processes text with code blocks", function () {
        var text = "Check this code:\n\n```js\nconsole.log(\"hi\");\n```\n\nThat's it.";
        var result = (0, markdown_to_line_js_1.processLineMessage)(text);
        (0, vitest_1.expect)(result.flexMessages).toHaveLength(1);
        (0, vitest_1.expect)(result.text).toContain("Check this code:");
        (0, vitest_1.expect)(result.text).toContain("That's it.");
        (0, vitest_1.expect)(result.text).not.toContain("```");
    });
    (0, vitest_1.it)("processes text with markdown formatting", function () {
        var text = "This is **bold** and *italic* text.";
        var result = (0, markdown_to_line_js_1.processLineMessage)(text);
        (0, vitest_1.expect)(result.text).toBe("This is bold and italic text.");
        (0, vitest_1.expect)(result.flexMessages).toHaveLength(0);
    });
    (0, vitest_1.it)("handles mixed content", function () {
        var text = "# Summary\n\nHere's **important** info:\n\n| Item | Count |\n|------|-------|\n| A    | 5     |\n\n```python\nprint(\"done\")\n```\n\n> Note: Check the link [here](https://example.com).";
        var result = (0, markdown_to_line_js_1.processLineMessage)(text);
        // Should have 2 flex messages (table + code)
        (0, vitest_1.expect)(result.flexMessages).toHaveLength(2);
        // Text should be cleaned
        (0, vitest_1.expect)(result.text).toContain("Summary");
        (0, vitest_1.expect)(result.text).toContain("important");
        (0, vitest_1.expect)(result.text).toContain("Note: Check the link here.");
        (0, vitest_1.expect)(result.text).not.toContain("#");
        (0, vitest_1.expect)(result.text).not.toContain("**");
        (0, vitest_1.expect)(result.text).not.toContain("|");
        (0, vitest_1.expect)(result.text).not.toContain("```");
        (0, vitest_1.expect)(result.text).not.toContain("[here]");
    });
    (0, vitest_1.it)("handles plain text unchanged", function () {
        var text = "Just plain text with no markdown.";
        var result = (0, markdown_to_line_js_1.processLineMessage)(text);
        (0, vitest_1.expect)(result.text).toBe(text);
        (0, vitest_1.expect)(result.flexMessages).toHaveLength(0);
    });
});
(0, vitest_1.describe)("hasMarkdownToConvert", function () {
    (0, vitest_1.it)("detects tables", function () {
        var text = "| A | B |\n|---|---|\n| 1 | 2 |";
        (0, vitest_1.expect)((0, markdown_to_line_js_1.hasMarkdownToConvert)(text)).toBe(true);
    });
    (0, vitest_1.it)("detects code blocks", function () {
        var text = "```js\ncode\n```";
        (0, vitest_1.expect)((0, markdown_to_line_js_1.hasMarkdownToConvert)(text)).toBe(true);
    });
    (0, vitest_1.it)("detects bold", function () {
        (0, vitest_1.expect)((0, markdown_to_line_js_1.hasMarkdownToConvert)("**bold**")).toBe(true);
    });
    (0, vitest_1.it)("detects strikethrough", function () {
        (0, vitest_1.expect)((0, markdown_to_line_js_1.hasMarkdownToConvert)("~~deleted~~")).toBe(true);
    });
    (0, vitest_1.it)("detects headers", function () {
        (0, vitest_1.expect)((0, markdown_to_line_js_1.hasMarkdownToConvert)("# Title")).toBe(true);
    });
    (0, vitest_1.it)("detects blockquotes", function () {
        (0, vitest_1.expect)((0, markdown_to_line_js_1.hasMarkdownToConvert)("> quote")).toBe(true);
    });
    (0, vitest_1.it)("returns false for plain text", function () {
        (0, vitest_1.expect)((0, markdown_to_line_js_1.hasMarkdownToConvert)("Just plain text.")).toBe(false);
    });
});
