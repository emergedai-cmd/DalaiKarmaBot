"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var hybrid_js_1 = require("./hybrid.js");
(0, vitest_1.describe)("memory hybrid helpers", function () {
    (0, vitest_1.it)("buildFtsQuery tokenizes and AND-joins", function () {
        (0, vitest_1.expect)((0, hybrid_js_1.buildFtsQuery)("hello world")).toBe('"hello" AND "world"');
        (0, vitest_1.expect)((0, hybrid_js_1.buildFtsQuery)("FOO_bar baz-1")).toBe('"FOO_bar" AND "baz" AND "1"');
        (0, vitest_1.expect)((0, hybrid_js_1.buildFtsQuery)("   ")).toBeNull();
    });
    (0, vitest_1.it)("bm25RankToScore is monotonic and clamped", function () {
        (0, vitest_1.expect)((0, hybrid_js_1.bm25RankToScore)(0)).toBeCloseTo(1);
        (0, vitest_1.expect)((0, hybrid_js_1.bm25RankToScore)(1)).toBeCloseTo(0.5);
        (0, vitest_1.expect)((0, hybrid_js_1.bm25RankToScore)(10)).toBeLessThan((0, hybrid_js_1.bm25RankToScore)(1));
        (0, vitest_1.expect)((0, hybrid_js_1.bm25RankToScore)(-100)).toBeCloseTo(1);
    });
    (0, vitest_1.it)("mergeHybridResults unions by id and combines weighted scores", function () {
        var merged = (0, hybrid_js_1.mergeHybridResults)({
            vectorWeight: 0.7,
            textWeight: 0.3,
            vector: [
                {
                    id: "a",
                    path: "memory/a.md",
                    startLine: 1,
                    endLine: 2,
                    source: "memory",
                    snippet: "vec-a",
                    vectorScore: 0.9,
                },
            ],
            keyword: [
                {
                    id: "b",
                    path: "memory/b.md",
                    startLine: 3,
                    endLine: 4,
                    source: "memory",
                    snippet: "kw-b",
                    textScore: 1.0,
                },
            ],
        });
        (0, vitest_1.expect)(merged).toHaveLength(2);
        var a = merged.find(function (r) { return r.path === "memory/a.md"; });
        var b = merged.find(function (r) { return r.path === "memory/b.md"; });
        (0, vitest_1.expect)(a === null || a === void 0 ? void 0 : a.score).toBeCloseTo(0.7 * 0.9);
        (0, vitest_1.expect)(b === null || b === void 0 ? void 0 : b.score).toBeCloseTo(0.3 * 1.0);
    });
    (0, vitest_1.it)("mergeHybridResults prefers keyword snippet when ids overlap", function () {
        var _a, _b;
        var merged = (0, hybrid_js_1.mergeHybridResults)({
            vectorWeight: 0.5,
            textWeight: 0.5,
            vector: [
                {
                    id: "a",
                    path: "memory/a.md",
                    startLine: 1,
                    endLine: 2,
                    source: "memory",
                    snippet: "vec-a",
                    vectorScore: 0.2,
                },
            ],
            keyword: [
                {
                    id: "a",
                    path: "memory/a.md",
                    startLine: 1,
                    endLine: 2,
                    source: "memory",
                    snippet: "kw-a",
                    textScore: 1.0,
                },
            ],
        });
        (0, vitest_1.expect)(merged).toHaveLength(1);
        (0, vitest_1.expect)((_a = merged[0]) === null || _a === void 0 ? void 0 : _a.snippet).toBe("kw-a");
        (0, vitest_1.expect)((_b = merged[0]) === null || _b === void 0 ? void 0 : _b.score).toBeCloseTo(0.5 * 0.2 + 0.5 * 1.0);
    });
});
