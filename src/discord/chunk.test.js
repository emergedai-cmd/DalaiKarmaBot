"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var chunk_js_1 = require("./chunk.js");
function countLines(text) {
    return text.split("\n").length;
}
function hasBalancedFences(chunk) {
    var open = null;
    for (var _i = 0, _a = chunk.split("\n"); _i < _a.length; _i++) {
        var line = _a[_i];
        var match = line.match(/^( {0,3})(`{3,}|~{3,})(.*)$/);
        if (!match) {
            continue;
        }
        var marker = match[2];
        if (!open) {
            open = { markerChar: marker[0], markerLen: marker.length };
            continue;
        }
        if (open.markerChar === marker[0] && marker.length >= open.markerLen) {
            open = null;
        }
    }
    return open === null;
}
(0, vitest_1.describe)("chunkDiscordText", function () {
    (0, vitest_1.it)("splits tall messages even when under 2000 chars", function () {
        var text = Array.from({ length: 45 }, function (_, i) { return "line-".concat(i + 1); }).join("\n");
        (0, vitest_1.expect)(text.length).toBeLessThan(2000);
        var chunks = (0, chunk_js_1.chunkDiscordText)(text, { maxChars: 2000, maxLines: 20 });
        (0, vitest_1.expect)(chunks.length).toBeGreaterThan(1);
        for (var _i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
            var chunk = chunks_1[_i];
            (0, vitest_1.expect)(countLines(chunk)).toBeLessThanOrEqual(20);
        }
    });
    (0, vitest_1.it)("keeps fenced code blocks balanced across chunks", function () {
        var body = Array.from({ length: 30 }, function (_, i) { return "console.log(".concat(i, ");"); }).join("\n");
        var text = "Here is code:\n\n```js\n".concat(body, "\n```\n\nDone.");
        var chunks = (0, chunk_js_1.chunkDiscordText)(text, { maxChars: 2000, maxLines: 10 });
        (0, vitest_1.expect)(chunks.length).toBeGreaterThan(1);
        for (var _i = 0, chunks_2 = chunks; _i < chunks_2.length; _i++) {
            var chunk = chunks_2[_i];
            (0, vitest_1.expect)(hasBalancedFences(chunk)).toBe(true);
            (0, vitest_1.expect)(chunk.length).toBeLessThanOrEqual(2000);
        }
        (0, vitest_1.expect)(chunks[0]).toContain("```js");
        (0, vitest_1.expect)(chunks.at(-1)).toContain("Done.");
    });
    (0, vitest_1.it)("keeps fenced blocks intact when chunkMode is newline", function () {
        var text = "```js\nconst a = 1;\nconst b = 2;\n```\nAfter";
        var chunks = (0, chunk_js_1.chunkDiscordTextWithMode)(text, {
            maxChars: 2000,
            maxLines: 50,
            chunkMode: "newline",
        });
        (0, vitest_1.expect)(chunks).toEqual([text]);
    });
    (0, vitest_1.it)("reserves space for closing fences when chunking", function () {
        var body = "a".repeat(120);
        var text = "```txt\n".concat(body, "\n```");
        var chunks = (0, chunk_js_1.chunkDiscordText)(text, { maxChars: 50, maxLines: 50 });
        (0, vitest_1.expect)(chunks.length).toBeGreaterThan(1);
        for (var _i = 0, chunks_3 = chunks; _i < chunks_3.length; _i++) {
            var chunk = chunks_3[_i];
            (0, vitest_1.expect)(chunk.length).toBeLessThanOrEqual(50);
            (0, vitest_1.expect)(hasBalancedFences(chunk)).toBe(true);
        }
    });
    (0, vitest_1.it)("preserves whitespace when splitting long lines", function () {
        var text = Array.from({ length: 40 }, function () { return "word"; }).join(" ");
        var chunks = (0, chunk_js_1.chunkDiscordText)(text, { maxChars: 20, maxLines: 50 });
        (0, vitest_1.expect)(chunks.length).toBeGreaterThan(1);
        (0, vitest_1.expect)(chunks.join("")).toBe(text);
    });
    (0, vitest_1.it)("preserves mixed whitespace across chunk boundaries", function () {
        var text = "alpha  beta\tgamma   delta epsilon  zeta";
        var chunks = (0, chunk_js_1.chunkDiscordText)(text, { maxChars: 12, maxLines: 50 });
        (0, vitest_1.expect)(chunks.length).toBeGreaterThan(1);
        (0, vitest_1.expect)(chunks.join("")).toBe(text);
    });
    (0, vitest_1.it)("keeps leading whitespace when splitting long lines", function () {
        var text = "    indented line with words that force splits";
        var chunks = (0, chunk_js_1.chunkDiscordText)(text, { maxChars: 14, maxLines: 50 });
        (0, vitest_1.expect)(chunks.length).toBeGreaterThan(1);
        (0, vitest_1.expect)(chunks.join("")).toBe(text);
    });
    (0, vitest_1.it)("keeps reasoning italics balanced across chunks", function () {
        var body = Array.from({ length: 25 }, function (_, i) { return "".concat(i + 1, ". line"); }).join("\n");
        var text = "Reasoning:\n_".concat(body, "_");
        var chunks = (0, chunk_js_1.chunkDiscordText)(text, { maxLines: 10, maxChars: 2000 });
        (0, vitest_1.expect)(chunks.length).toBeGreaterThan(1);
        for (var _i = 0, chunks_4 = chunks; _i < chunks_4.length; _i++) {
            var chunk = chunks_4[_i];
            // Each chunk should have balanced italics markers (even count).
            var count = (chunk.match(/_/g) || []).length;
            (0, vitest_1.expect)(count % 2).toBe(0);
        }
        // Ensure italics reopen on subsequent chunks
        (0, vitest_1.expect)(chunks[0]).toContain("_1. line");
        // Second chunk should reopen italics at the start
        (0, vitest_1.expect)(chunks[1].trimStart().startsWith("_")).toBe(true);
    });
    (0, vitest_1.it)("keeps reasoning italics balanced when chunks split by char limit", function () {
        var longLine = "This is a very long reasoning line that forces char splits.";
        var body = Array.from({ length: 5 }, function () { return longLine; }).join("\n");
        var text = "Reasoning:\n_".concat(body, "_");
        var chunks = (0, chunk_js_1.chunkDiscordText)(text, { maxChars: 80, maxLines: 50 });
        (0, vitest_1.expect)(chunks.length).toBeGreaterThan(1);
        for (var _i = 0, chunks_5 = chunks; _i < chunks_5.length; _i++) {
            var chunk = chunks_5[_i];
            var underscoreCount = (chunk.match(/_/g) || []).length;
            (0, vitest_1.expect)(underscoreCount % 2).toBe(0);
        }
    });
    (0, vitest_1.it)("reopens italics while preserving leading whitespace on following chunk", function () {
        var body = [
            "1. line",
            "2. line",
            "3. line",
            "4. line",
            "5. line",
            "6. line",
            "7. line",
            "8. line",
            "9. line",
            "10. line",
            "  11. indented line",
            "12. line",
        ].join("\n");
        var text = "Reasoning:\n_".concat(body, "_");
        var chunks = (0, chunk_js_1.chunkDiscordText)(text, { maxLines: 10, maxChars: 2000 });
        (0, vitest_1.expect)(chunks.length).toBeGreaterThan(1);
        var second = chunks[1];
        (0, vitest_1.expect)(second.startsWith("_")).toBe(true);
        (0, vitest_1.expect)(second).toContain("  11. indented line");
    });
});
