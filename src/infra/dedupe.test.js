"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var dedupe_js_1 = require("./dedupe.js");
(0, vitest_1.describe)("createDedupeCache", function () {
    (0, vitest_1.it)("marks duplicates within TTL", function () {
        var cache = (0, dedupe_js_1.createDedupeCache)({ ttlMs: 1000, maxSize: 10 });
        (0, vitest_1.expect)(cache.check("a", 100)).toBe(false);
        (0, vitest_1.expect)(cache.check("a", 500)).toBe(true);
    });
    (0, vitest_1.it)("expires entries after TTL", function () {
        var cache = (0, dedupe_js_1.createDedupeCache)({ ttlMs: 1000, maxSize: 10 });
        (0, vitest_1.expect)(cache.check("a", 100)).toBe(false);
        (0, vitest_1.expect)(cache.check("a", 1501)).toBe(false);
    });
    (0, vitest_1.it)("evicts oldest entries when over max size", function () {
        var cache = (0, dedupe_js_1.createDedupeCache)({ ttlMs: 10000, maxSize: 2 });
        (0, vitest_1.expect)(cache.check("a", 100)).toBe(false);
        (0, vitest_1.expect)(cache.check("b", 200)).toBe(false);
        (0, vitest_1.expect)(cache.check("c", 300)).toBe(false);
        (0, vitest_1.expect)(cache.check("a", 400)).toBe(false);
    });
    (0, vitest_1.it)("prunes expired entries even when refreshed keys are older in insertion order", function () {
        var cache = (0, dedupe_js_1.createDedupeCache)({ ttlMs: 100, maxSize: 10 });
        (0, vitest_1.expect)(cache.check("a", 0)).toBe(false);
        (0, vitest_1.expect)(cache.check("b", 50)).toBe(false);
        (0, vitest_1.expect)(cache.check("a", 120)).toBe(false);
        (0, vitest_1.expect)(cache.check("c", 200)).toBe(false);
        (0, vitest_1.expect)(cache.size()).toBe(2);
    });
});
