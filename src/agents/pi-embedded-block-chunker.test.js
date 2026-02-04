"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_block_chunker_js_1 = require("./pi-embedded-block-chunker.js");
(0, vitest_1.describe)("EmbeddedBlockChunker", function () {
    (0, vitest_1.it)("breaks at paragraph boundary right after fence close", function () {
        var chunker = new pi_embedded_block_chunker_js_1.EmbeddedBlockChunker({
            minChars: 1,
            maxChars: 40,
            breakPreference: "paragraph",
        });
        var text = [
            "Intro",
            "```js",
            "console.log('x')",
            "```",
            "",
            "After first line",
            "After second line",
        ].join("\n");
        chunker.append(text);
        var chunks = [];
        chunker.drain({ force: false, emit: function (chunk) { return chunks.push(chunk); } });
        (0, vitest_1.expect)(chunks.length).toBe(1);
        (0, vitest_1.expect)(chunks[0]).toContain("console.log");
        (0, vitest_1.expect)(chunks[0]).toMatch(/```\n?$/);
        (0, vitest_1.expect)(chunks[0]).not.toContain("After");
        (0, vitest_1.expect)(chunker.bufferedText).toMatch(/^After/);
    });
    (0, vitest_1.it)("flushes paragraph boundaries before minChars when flushOnParagraph is set", function () {
        var chunker = new pi_embedded_block_chunker_js_1.EmbeddedBlockChunker({
            minChars: 100,
            maxChars: 200,
            breakPreference: "paragraph",
            flushOnParagraph: true,
        });
        chunker.append("First paragraph.\n\nSecond paragraph.");
        var chunks = [];
        chunker.drain({ force: false, emit: function (chunk) { return chunks.push(chunk); } });
        (0, vitest_1.expect)(chunks).toEqual(["First paragraph."]);
        (0, vitest_1.expect)(chunker.bufferedText).toBe("Second paragraph.");
    });
    (0, vitest_1.it)("treats blank lines with whitespace as paragraph boundaries when flushOnParagraph is set", function () {
        var chunker = new pi_embedded_block_chunker_js_1.EmbeddedBlockChunker({
            minChars: 100,
            maxChars: 200,
            breakPreference: "paragraph",
            flushOnParagraph: true,
        });
        chunker.append("First paragraph.\n \nSecond paragraph.");
        var chunks = [];
        chunker.drain({ force: false, emit: function (chunk) { return chunks.push(chunk); } });
        (0, vitest_1.expect)(chunks).toEqual(["First paragraph."]);
        (0, vitest_1.expect)(chunker.bufferedText).toBe("Second paragraph.");
    });
    (0, vitest_1.it)("falls back to maxChars when flushOnParagraph is set and no paragraph break exists", function () {
        var chunker = new pi_embedded_block_chunker_js_1.EmbeddedBlockChunker({
            minChars: 1,
            maxChars: 10,
            breakPreference: "paragraph",
            flushOnParagraph: true,
        });
        chunker.append("abcdefghijKLMNOP");
        var chunks = [];
        chunker.drain({ force: false, emit: function (chunk) { return chunks.push(chunk); } });
        (0, vitest_1.expect)(chunks).toEqual(["abcdefghij"]);
        (0, vitest_1.expect)(chunker.bufferedText).toBe("KLMNOP");
    });
    (0, vitest_1.it)("clamps long paragraphs to maxChars when flushOnParagraph is set", function () {
        var chunker = new pi_embedded_block_chunker_js_1.EmbeddedBlockChunker({
            minChars: 1,
            maxChars: 10,
            breakPreference: "paragraph",
            flushOnParagraph: true,
        });
        chunker.append("abcdefghijk\n\nRest");
        var chunks = [];
        chunker.drain({ force: false, emit: function (chunk) { return chunks.push(chunk); } });
        (0, vitest_1.expect)(chunks.every(function (chunk) { return chunk.length <= 10; })).toBe(true);
        (0, vitest_1.expect)(chunks).toEqual(["abcdefghij", "k"]);
        (0, vitest_1.expect)(chunker.bufferedText).toBe("Rest");
    });
    (0, vitest_1.it)("ignores paragraph breaks inside fences when flushOnParagraph is set", function () {
        var chunker = new pi_embedded_block_chunker_js_1.EmbeddedBlockChunker({
            minChars: 100,
            maxChars: 200,
            breakPreference: "paragraph",
            flushOnParagraph: true,
        });
        var text = [
            "Intro",
            "```js",
            "const a = 1;",
            "",
            "const b = 2;",
            "```",
            "",
            "After fence",
        ].join("\n");
        chunker.append(text);
        var chunks = [];
        chunker.drain({ force: false, emit: function (chunk) { return chunks.push(chunk); } });
        (0, vitest_1.expect)(chunks).toEqual(["Intro\n```js\nconst a = 1;\n\nconst b = 2;\n```"]);
        (0, vitest_1.expect)(chunker.bufferedText).toBe("After fence");
    });
});
