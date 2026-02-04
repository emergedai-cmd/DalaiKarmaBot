"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var chunk_js_1 = require("./chunk.js");
function expectFencesBalanced(chunks) {
    for (var _i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
        var chunk = chunks_1[_i];
        var open_1 = null;
        for (var _a = 0, _b = chunk.split("\n"); _a < _b.length; _a++) {
            var line = _b[_a];
            var match = line.match(/^( {0,3})(`{3,}|~{3,})(.*)$/);
            if (!match) {
                continue;
            }
            var marker = match[2];
            if (!open_1) {
                open_1 = { markerChar: marker[0], markerLen: marker.length };
                continue;
            }
            if (open_1.markerChar === marker[0] && marker.length >= open_1.markerLen) {
                open_1 = null;
            }
        }
        (0, vitest_1.expect)(open_1).toBe(null);
    }
}
function runChunkCases(chunker, cases) {
    var _loop_1 = function (name_1, text, limit, expected) {
        (0, vitest_1.it)(name_1, function () {
            (0, vitest_1.expect)(chunker(text, limit)).toEqual(expected);
        });
    };
    for (var _i = 0, cases_1 = cases; _i < cases_1.length; _i++) {
        var _a = cases_1[_i], name_1 = _a.name, text = _a.text, limit = _a.limit, expected = _a.expected;
        _loop_1(name_1, text, limit, expected);
    }
}
var parentheticalCases = [
    {
        name: "keeps parenthetical phrases together",
        text: "Heads up now (Though now I'm curious)ok",
        limit: 35,
        expected: ["Heads up now", "(Though now I'm curious)ok"],
    },
    {
        name: "handles nested parentheses",
        text: "Hello (outer (inner) end) world",
        limit: 26,
        expected: ["Hello (outer (inner) end)", "world"],
    },
    {
        name: "ignores unmatched closing parentheses",
        text: "Hello) world (ok)",
        limit: 12,
        expected: ["Hello)", "world (ok)"],
    },
];
(0, vitest_1.describe)("chunkText", function () {
    (0, vitest_1.it)("keeps multi-line text in one chunk when under limit", function () {
        var text = "Line one\n\nLine two\n\nLine three";
        var chunks = (0, chunk_js_1.chunkText)(text, 1600);
        (0, vitest_1.expect)(chunks).toEqual([text]);
    });
    (0, vitest_1.it)("splits only when text exceeds the limit", function () {
        var part = "a".repeat(20);
        var text = part.repeat(5); // 100 chars
        var chunks = (0, chunk_js_1.chunkText)(text, 60);
        (0, vitest_1.expect)(chunks.length).toBe(2);
        (0, vitest_1.expect)(chunks[0].length).toBe(60);
        (0, vitest_1.expect)(chunks[1].length).toBe(40);
        (0, vitest_1.expect)(chunks.join("")).toBe(text);
    });
    (0, vitest_1.it)("prefers breaking at a newline before the limit", function () {
        var text = "paragraph one line\n\nparagraph two starts here and continues";
        var chunks = (0, chunk_js_1.chunkText)(text, 40);
        (0, vitest_1.expect)(chunks).toEqual(["paragraph one line", "paragraph two starts here and continues"]);
    });
    (0, vitest_1.it)("otherwise breaks at the last whitespace under the limit", function () {
        var text = "This is a message that should break nicely near a word boundary.";
        var chunks = (0, chunk_js_1.chunkText)(text, 30);
        (0, vitest_1.expect)(chunks[0].length).toBeLessThanOrEqual(30);
        (0, vitest_1.expect)(chunks[1].length).toBeLessThanOrEqual(30);
        (0, vitest_1.expect)(chunks.join(" ").replace(/\s+/g, " ").trim()).toBe(text.replace(/\s+/g, " ").trim());
    });
    (0, vitest_1.it)("falls back to a hard break when no whitespace is present", function () {
        var text = "Supercalifragilisticexpialidocious"; // 34 chars
        var chunks = (0, chunk_js_1.chunkText)(text, 10);
        (0, vitest_1.expect)(chunks).toEqual(["Supercalif", "ragilistic", "expialidoc", "ious"]);
    });
    runChunkCases(chunk_js_1.chunkText, [parentheticalCases[0]]);
});
(0, vitest_1.describe)("resolveTextChunkLimit", function () {
    (0, vitest_1.it)("uses per-provider defaults", function () {
        (0, vitest_1.expect)((0, chunk_js_1.resolveTextChunkLimit)(undefined, "whatsapp")).toBe(4000);
        (0, vitest_1.expect)((0, chunk_js_1.resolveTextChunkLimit)(undefined, "telegram")).toBe(4000);
        (0, vitest_1.expect)((0, chunk_js_1.resolveTextChunkLimit)(undefined, "slack")).toBe(4000);
        (0, vitest_1.expect)((0, chunk_js_1.resolveTextChunkLimit)(undefined, "signal")).toBe(4000);
        (0, vitest_1.expect)((0, chunk_js_1.resolveTextChunkLimit)(undefined, "imessage")).toBe(4000);
        (0, vitest_1.expect)((0, chunk_js_1.resolveTextChunkLimit)(undefined, "discord")).toBe(4000);
        (0, vitest_1.expect)((0, chunk_js_1.resolveTextChunkLimit)(undefined, "discord", undefined, {
            fallbackLimit: 2000,
        })).toBe(2000);
    });
    (0, vitest_1.it)("supports provider overrides", function () {
        var cfg = { channels: { telegram: { textChunkLimit: 1234 } } };
        (0, vitest_1.expect)((0, chunk_js_1.resolveTextChunkLimit)(cfg, "whatsapp")).toBe(4000);
        (0, vitest_1.expect)((0, chunk_js_1.resolveTextChunkLimit)(cfg, "telegram")).toBe(1234);
    });
    (0, vitest_1.it)("prefers account overrides when provided", function () {
        var cfg = {
            channels: {
                telegram: {
                    textChunkLimit: 2000,
                    accounts: {
                        default: { textChunkLimit: 1234 },
                        primary: { textChunkLimit: 777 },
                    },
                },
            },
        };
        (0, vitest_1.expect)((0, chunk_js_1.resolveTextChunkLimit)(cfg, "telegram", "primary")).toBe(777);
        (0, vitest_1.expect)((0, chunk_js_1.resolveTextChunkLimit)(cfg, "telegram", "default")).toBe(1234);
    });
    (0, vitest_1.it)("uses the matching provider override", function () {
        var cfg = {
            channels: {
                discord: { textChunkLimit: 111 },
                slack: { textChunkLimit: 222 },
            },
        };
        (0, vitest_1.expect)((0, chunk_js_1.resolveTextChunkLimit)(cfg, "discord")).toBe(111);
        (0, vitest_1.expect)((0, chunk_js_1.resolveTextChunkLimit)(cfg, "slack")).toBe(222);
        (0, vitest_1.expect)((0, chunk_js_1.resolveTextChunkLimit)(cfg, "telegram")).toBe(4000);
    });
});
(0, vitest_1.describe)("chunkMarkdownText", function () {
    (0, vitest_1.it)("keeps fenced blocks intact when a safe break exists", function () {
        var prefix = "p".repeat(60);
        var fence = "```bash\nline1\nline2\n```";
        var suffix = "s".repeat(60);
        var text = "".concat(prefix, "\n\n").concat(fence, "\n\n").concat(suffix);
        var chunks = (0, chunk_js_1.chunkMarkdownText)(text, 40);
        (0, vitest_1.expect)(chunks.some(function (chunk) { return chunk.trimEnd() === fence; })).toBe(true);
        expectFencesBalanced(chunks);
    });
    (0, vitest_1.it)("reopens fenced blocks when forced to split inside them", function () {
        var text = "```txt\n".concat("a".repeat(500), "\n```");
        var limit = 120;
        var chunks = (0, chunk_js_1.chunkMarkdownText)(text, limit);
        (0, vitest_1.expect)(chunks.length).toBeGreaterThan(1);
        for (var _i = 0, chunks_2 = chunks; _i < chunks_2.length; _i++) {
            var chunk = chunks_2[_i];
            (0, vitest_1.expect)(chunk.length).toBeLessThanOrEqual(limit);
            (0, vitest_1.expect)(chunk.startsWith("```txt\n")).toBe(true);
            (0, vitest_1.expect)(chunk.trimEnd().endsWith("```")).toBe(true);
        }
        expectFencesBalanced(chunks);
    });
    (0, vitest_1.it)("supports tilde fences", function () {
        var text = "~~~sh\n".concat("x".repeat(600), "\n~~~");
        var limit = 140;
        var chunks = (0, chunk_js_1.chunkMarkdownText)(text, limit);
        (0, vitest_1.expect)(chunks.length).toBeGreaterThan(1);
        for (var _i = 0, chunks_3 = chunks; _i < chunks_3.length; _i++) {
            var chunk = chunks_3[_i];
            (0, vitest_1.expect)(chunk.length).toBeLessThanOrEqual(limit);
            (0, vitest_1.expect)(chunk.startsWith("~~~sh\n")).toBe(true);
            (0, vitest_1.expect)(chunk.trimEnd().endsWith("~~~")).toBe(true);
        }
        expectFencesBalanced(chunks);
    });
    (0, vitest_1.it)("supports longer fence markers for close", function () {
        var text = "````md\n".concat("y".repeat(600), "\n````");
        var limit = 140;
        var chunks = (0, chunk_js_1.chunkMarkdownText)(text, limit);
        (0, vitest_1.expect)(chunks.length).toBeGreaterThan(1);
        for (var _i = 0, chunks_4 = chunks; _i < chunks_4.length; _i++) {
            var chunk = chunks_4[_i];
            (0, vitest_1.expect)(chunk.length).toBeLessThanOrEqual(limit);
            (0, vitest_1.expect)(chunk.startsWith("````md\n")).toBe(true);
            (0, vitest_1.expect)(chunk.trimEnd().endsWith("````")).toBe(true);
        }
        expectFencesBalanced(chunks);
    });
    (0, vitest_1.it)("preserves indentation for indented fences", function () {
        var text = "  ```js\n  ".concat("z".repeat(600), "\n  ```");
        var limit = 160;
        var chunks = (0, chunk_js_1.chunkMarkdownText)(text, limit);
        (0, vitest_1.expect)(chunks.length).toBeGreaterThan(1);
        for (var _i = 0, chunks_5 = chunks; _i < chunks_5.length; _i++) {
            var chunk = chunks_5[_i];
            (0, vitest_1.expect)(chunk.length).toBeLessThanOrEqual(limit);
            (0, vitest_1.expect)(chunk.startsWith("  ```js\n")).toBe(true);
            (0, vitest_1.expect)(chunk.trimEnd().endsWith("  ```")).toBe(true);
        }
        expectFencesBalanced(chunks);
    });
    (0, vitest_1.it)("never produces an empty fenced chunk when splitting", function () {
        var text = "```txt\n".concat("a".repeat(300), "\n```");
        var chunks = (0, chunk_js_1.chunkMarkdownText)(text, 60);
        for (var _i = 0, chunks_6 = chunks; _i < chunks_6.length; _i++) {
            var chunk = chunks_6[_i];
            var nonFenceLines = chunk
                .split("\n")
                .filter(function (line) { return !/^( {0,3})(`{3,}|~{3,})(.*)$/.test(line); });
            (0, vitest_1.expect)(nonFenceLines.join("\n").trim()).not.toBe("");
        }
    });
    runChunkCases(chunk_js_1.chunkMarkdownText, parentheticalCases);
    (0, vitest_1.it)("hard-breaks when a parenthetical exceeds the limit", function () {
        var _a;
        var text = "(".concat("a".repeat(80), ")");
        var chunks = (0, chunk_js_1.chunkMarkdownText)(text, 20);
        (0, vitest_1.expect)((_a = chunks[0]) === null || _a === void 0 ? void 0 : _a.length).toBe(20);
        (0, vitest_1.expect)(chunks.join("")).toBe(text);
    });
});
(0, vitest_1.describe)("chunkByNewline", function () {
    (0, vitest_1.it)("splits text on newlines", function () {
        var text = "Line one\nLine two\nLine three";
        var chunks = (0, chunk_js_1.chunkByNewline)(text, 1000);
        (0, vitest_1.expect)(chunks).toEqual(["Line one", "Line two", "Line three"]);
    });
    (0, vitest_1.it)("preserves blank lines by folding into the next chunk", function () {
        var text = "Line one\n\n\nLine two\n\nLine three";
        var chunks = (0, chunk_js_1.chunkByNewline)(text, 1000);
        (0, vitest_1.expect)(chunks).toEqual(["Line one", "\n\nLine two", "\nLine three"]);
    });
    (0, vitest_1.it)("trims whitespace from lines", function () {
        var text = "  Line one  \n  Line two  ";
        var chunks = (0, chunk_js_1.chunkByNewline)(text, 1000);
        (0, vitest_1.expect)(chunks).toEqual(["Line one", "Line two"]);
    });
    (0, vitest_1.it)("preserves leading blank lines on the first chunk", function () {
        var text = "\n\nLine one\nLine two";
        var chunks = (0, chunk_js_1.chunkByNewline)(text, 1000);
        (0, vitest_1.expect)(chunks).toEqual(["\n\nLine one", "Line two"]);
    });
    (0, vitest_1.it)("falls back to length-based for long lines", function () {
        var text = "Short line\n" + "a".repeat(50) + "\nAnother short";
        var chunks = (0, chunk_js_1.chunkByNewline)(text, 20);
        (0, vitest_1.expect)(chunks[0]).toBe("Short line");
        // Long line gets split into multiple chunks
        (0, vitest_1.expect)(chunks[1].length).toBe(20);
        (0, vitest_1.expect)(chunks[2].length).toBe(20);
        (0, vitest_1.expect)(chunks[3].length).toBe(10);
        (0, vitest_1.expect)(chunks[4]).toBe("Another short");
    });
    (0, vitest_1.it)("does not split long lines when splitLongLines is false", function () {
        var text = "a".repeat(50);
        var chunks = (0, chunk_js_1.chunkByNewline)(text, 20, { splitLongLines: false });
        (0, vitest_1.expect)(chunks).toEqual([text]);
    });
    (0, vitest_1.it)("returns empty array for empty input", function () {
        (0, vitest_1.expect)((0, chunk_js_1.chunkByNewline)("", 100)).toEqual([]);
    });
    (0, vitest_1.it)("returns empty array for whitespace-only input", function () {
        (0, vitest_1.expect)((0, chunk_js_1.chunkByNewline)("   \n\n   ", 100)).toEqual([]);
    });
    (0, vitest_1.it)("preserves trailing blank lines on the last chunk", function () {
        var text = "Line one\n\n";
        var chunks = (0, chunk_js_1.chunkByNewline)(text, 1000);
        (0, vitest_1.expect)(chunks).toEqual(["Line one\n\n"]);
    });
    (0, vitest_1.it)("keeps whitespace when trimLines is false", function () {
        var text = "  indented line  \nNext";
        var chunks = (0, chunk_js_1.chunkByNewline)(text, 1000, { trimLines: false });
        (0, vitest_1.expect)(chunks).toEqual(["  indented line  ", "Next"]);
    });
});
(0, vitest_1.describe)("chunkTextWithMode", function () {
    (0, vitest_1.it)("uses length-based chunking for length mode", function () {
        var text = "Line one\nLine two";
        var chunks = (0, chunk_js_1.chunkTextWithMode)(text, 1000, "length");
        (0, vitest_1.expect)(chunks).toEqual(["Line one\nLine two"]);
    });
    (0, vitest_1.it)("uses paragraph-based chunking for newline mode", function () {
        var text = "Line one\nLine two";
        var chunks = (0, chunk_js_1.chunkTextWithMode)(text, 1000, "newline");
        (0, vitest_1.expect)(chunks).toEqual(["Line one\nLine two"]);
    });
    (0, vitest_1.it)("splits on blank lines for newline mode", function () {
        var text = "Para one\n\nPara two";
        var chunks = (0, chunk_js_1.chunkTextWithMode)(text, 1000, "newline");
        (0, vitest_1.expect)(chunks).toEqual(["Para one", "Para two"]);
    });
});
(0, vitest_1.describe)("chunkMarkdownTextWithMode", function () {
    (0, vitest_1.it)("uses markdown-aware chunking for length mode", function () {
        var text = "Line one\nLine two";
        (0, vitest_1.expect)((0, chunk_js_1.chunkMarkdownTextWithMode)(text, 1000, "length")).toEqual((0, chunk_js_1.chunkMarkdownText)(text, 1000));
    });
    (0, vitest_1.it)("uses paragraph-based chunking for newline mode", function () {
        var text = "Line one\nLine two";
        (0, vitest_1.expect)((0, chunk_js_1.chunkMarkdownTextWithMode)(text, 1000, "newline")).toEqual(["Line one\nLine two"]);
    });
    (0, vitest_1.it)("splits on blank lines for newline mode", function () {
        var text = "Para one\n\nPara two";
        (0, vitest_1.expect)((0, chunk_js_1.chunkMarkdownTextWithMode)(text, 1000, "newline")).toEqual(["Para one", "Para two"]);
    });
    (0, vitest_1.it)("does not split single-newline code fences in newline mode", function () {
        var text = "```js\nconst a = 1;\nconst b = 2;\n```\nAfter";
        (0, vitest_1.expect)((0, chunk_js_1.chunkMarkdownTextWithMode)(text, 1000, "newline")).toEqual([text]);
    });
    (0, vitest_1.it)("defers long markdown paragraphs to markdown chunking in newline mode", function () {
        var text = "```js\n".concat("const a = 1;\n".repeat(20), "```");
        (0, vitest_1.expect)((0, chunk_js_1.chunkMarkdownTextWithMode)(text, 40, "newline")).toEqual((0, chunk_js_1.chunkMarkdownText)(text, 40));
    });
    (0, vitest_1.it)("does not split on blank lines inside a fenced code block", function () {
        var text = "```python\ndef my_function():\n    x = 1\n\n    y = 2\n    return x + y\n```";
        (0, vitest_1.expect)((0, chunk_js_1.chunkMarkdownTextWithMode)(text, 1000, "newline")).toEqual([text]);
    });
    (0, vitest_1.it)("splits on blank lines between a code fence and following paragraph", function () {
        var fence = "```python\ndef my_function():\n    x = 1\n\n    y = 2\n    return x + y\n```";
        var text = "".concat(fence, "\n\nAfter");
        (0, vitest_1.expect)((0, chunk_js_1.chunkMarkdownTextWithMode)(text, 1000, "newline")).toEqual([fence, "After"]);
    });
});
(0, vitest_1.describe)("resolveChunkMode", function () {
    (0, vitest_1.it)("returns length as default", function () {
        (0, vitest_1.expect)((0, chunk_js_1.resolveChunkMode)(undefined, "telegram")).toBe("length");
        (0, vitest_1.expect)((0, chunk_js_1.resolveChunkMode)({}, "discord")).toBe("length");
        (0, vitest_1.expect)((0, chunk_js_1.resolveChunkMode)(undefined, "bluebubbles")).toBe("length");
    });
    (0, vitest_1.it)("returns length for internal channel", function () {
        var cfg = { channels: { bluebubbles: { chunkMode: "newline" } } };
        (0, vitest_1.expect)((0, chunk_js_1.resolveChunkMode)(cfg, "__internal__")).toBe("length");
    });
    (0, vitest_1.it)("supports provider-level overrides for slack", function () {
        var cfg = { channels: { slack: { chunkMode: "newline" } } };
        (0, vitest_1.expect)((0, chunk_js_1.resolveChunkMode)(cfg, "slack")).toBe("newline");
        (0, vitest_1.expect)((0, chunk_js_1.resolveChunkMode)(cfg, "discord")).toBe("length");
    });
    (0, vitest_1.it)("supports account-level overrides for slack", function () {
        var cfg = {
            channels: {
                slack: {
                    chunkMode: "length",
                    accounts: {
                        primary: { chunkMode: "newline" },
                    },
                },
            },
        };
        (0, vitest_1.expect)((0, chunk_js_1.resolveChunkMode)(cfg, "slack", "primary")).toBe("newline");
        (0, vitest_1.expect)((0, chunk_js_1.resolveChunkMode)(cfg, "slack", "other")).toBe("length");
    });
});
