"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var sticker_cache_js_1 = require("./sticker-cache.js");
// Mock the state directory to use a temp location
vitest_1.vi.mock("../config/paths.js", function () { return ({
    STATE_DIR: "/tmp/openclaw-test-sticker-cache",
}); });
var TEST_CACHE_DIR = "/tmp/openclaw-test-sticker-cache/telegram";
var TEST_CACHE_FILE = node_path_1.default.join(TEST_CACHE_DIR, "sticker-cache.json");
(0, vitest_1.describe)("sticker-cache", function () {
    (0, vitest_1.beforeEach)(function () {
        // Clean up before each test
        if (node_fs_1.default.existsSync(TEST_CACHE_FILE)) {
            node_fs_1.default.unlinkSync(TEST_CACHE_FILE);
        }
    });
    (0, vitest_1.afterEach)(function () {
        // Clean up after each test
        if (node_fs_1.default.existsSync(TEST_CACHE_FILE)) {
            node_fs_1.default.unlinkSync(TEST_CACHE_FILE);
        }
    });
    (0, vitest_1.describe)("getCachedSticker", function () {
        (0, vitest_1.it)("returns null for unknown ID", function () {
            var result = (0, sticker_cache_js_1.getCachedSticker)("unknown-id");
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)("returns cached sticker after cacheSticker", function () {
            var sticker = {
                fileId: "file123",
                fileUniqueId: "unique123",
                emoji: "🎉",
                setName: "TestPack",
                description: "A party popper emoji sticker",
                cachedAt: "2026-01-26T12:00:00.000Z",
            };
            (0, sticker_cache_js_1.cacheSticker)(sticker);
            var result = (0, sticker_cache_js_1.getCachedSticker)("unique123");
            (0, vitest_1.expect)(result).toEqual(sticker);
        });
        (0, vitest_1.it)("returns null after cache is cleared", function () {
            var sticker = {
                fileId: "file123",
                fileUniqueId: "unique123",
                description: "test",
                cachedAt: "2026-01-26T12:00:00.000Z",
            };
            (0, sticker_cache_js_1.cacheSticker)(sticker);
            (0, vitest_1.expect)((0, sticker_cache_js_1.getCachedSticker)("unique123")).not.toBeNull();
            // Manually clear the cache file
            node_fs_1.default.unlinkSync(TEST_CACHE_FILE);
            (0, vitest_1.expect)((0, sticker_cache_js_1.getCachedSticker)("unique123")).toBeNull();
        });
    });
    (0, vitest_1.describe)("cacheSticker", function () {
        (0, vitest_1.it)("adds entry to cache", function () {
            var sticker = {
                fileId: "file456",
                fileUniqueId: "unique456",
                description: "A cute fox waving",
                cachedAt: "2026-01-26T12:00:00.000Z",
            };
            (0, sticker_cache_js_1.cacheSticker)(sticker);
            var all = (0, sticker_cache_js_1.getAllCachedStickers)();
            (0, vitest_1.expect)(all).toHaveLength(1);
            (0, vitest_1.expect)(all[0]).toEqual(sticker);
        });
        (0, vitest_1.it)("updates existing entry", function () {
            var original = {
                fileId: "file789",
                fileUniqueId: "unique789",
                description: "Original description",
                cachedAt: "2026-01-26T12:00:00.000Z",
            };
            var updated = {
                fileId: "file789-new",
                fileUniqueId: "unique789",
                description: "Updated description",
                cachedAt: "2026-01-26T13:00:00.000Z",
            };
            (0, sticker_cache_js_1.cacheSticker)(original);
            (0, sticker_cache_js_1.cacheSticker)(updated);
            var result = (0, sticker_cache_js_1.getCachedSticker)("unique789");
            (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.description).toBe("Updated description");
            (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.fileId).toBe("file789-new");
        });
    });
    (0, vitest_1.describe)("searchStickers", function () {
        (0, vitest_1.beforeEach)(function () {
            // Seed cache with test stickers
            (0, sticker_cache_js_1.cacheSticker)({
                fileId: "fox1",
                fileUniqueId: "fox-unique-1",
                emoji: "🦊",
                setName: "CuteFoxes",
                description: "A cute orange fox waving hello",
                cachedAt: "2026-01-26T10:00:00.000Z",
            });
            (0, sticker_cache_js_1.cacheSticker)({
                fileId: "fox2",
                fileUniqueId: "fox-unique-2",
                emoji: "🦊",
                setName: "CuteFoxes",
                description: "A fox sleeping peacefully",
                cachedAt: "2026-01-26T11:00:00.000Z",
            });
            (0, sticker_cache_js_1.cacheSticker)({
                fileId: "cat1",
                fileUniqueId: "cat-unique-1",
                emoji: "🐱",
                setName: "FunnyCats",
                description: "A cat sitting on a keyboard",
                cachedAt: "2026-01-26T12:00:00.000Z",
            });
            (0, sticker_cache_js_1.cacheSticker)({
                fileId: "dog1",
                fileUniqueId: "dog-unique-1",
                emoji: "🐶",
                setName: "GoodBoys",
                description: "A golden retriever playing fetch",
                cachedAt: "2026-01-26T13:00:00.000Z",
            });
        });
        (0, vitest_1.it)("finds stickers by description substring", function () {
            var results = (0, sticker_cache_js_1.searchStickers)("fox");
            (0, vitest_1.expect)(results).toHaveLength(2);
            (0, vitest_1.expect)(results.every(function (s) { return s.description.toLowerCase().includes("fox"); })).toBe(true);
        });
        (0, vitest_1.it)("finds stickers by emoji", function () {
            var results = (0, sticker_cache_js_1.searchStickers)("🦊");
            (0, vitest_1.expect)(results).toHaveLength(2);
            (0, vitest_1.expect)(results.every(function (s) { return s.emoji === "🦊"; })).toBe(true);
        });
        (0, vitest_1.it)("finds stickers by set name", function () {
            var results = (0, sticker_cache_js_1.searchStickers)("CuteFoxes");
            (0, vitest_1.expect)(results).toHaveLength(2);
            (0, vitest_1.expect)(results.every(function (s) { return s.setName === "CuteFoxes"; })).toBe(true);
        });
        (0, vitest_1.it)("respects limit parameter", function () {
            var results = (0, sticker_cache_js_1.searchStickers)("fox", 1);
            (0, vitest_1.expect)(results).toHaveLength(1);
        });
        (0, vitest_1.it)("ranks exact matches higher", function () {
            var _a;
            // "waving" appears in "fox waving hello" - should be ranked first
            var results = (0, sticker_cache_js_1.searchStickers)("waving");
            (0, vitest_1.expect)(results).toHaveLength(1);
            (0, vitest_1.expect)((_a = results[0]) === null || _a === void 0 ? void 0 : _a.fileUniqueId).toBe("fox-unique-1");
        });
        (0, vitest_1.it)("returns empty array for no matches", function () {
            var results = (0, sticker_cache_js_1.searchStickers)("elephant");
            (0, vitest_1.expect)(results).toHaveLength(0);
        });
        (0, vitest_1.it)("is case insensitive", function () {
            var results = (0, sticker_cache_js_1.searchStickers)("FOX");
            (0, vitest_1.expect)(results).toHaveLength(2);
        });
        (0, vitest_1.it)("matches multiple words", function () {
            var _a;
            var results = (0, sticker_cache_js_1.searchStickers)("cat keyboard");
            (0, vitest_1.expect)(results).toHaveLength(1);
            (0, vitest_1.expect)((_a = results[0]) === null || _a === void 0 ? void 0 : _a.fileUniqueId).toBe("cat-unique-1");
        });
    });
    (0, vitest_1.describe)("getAllCachedStickers", function () {
        (0, vitest_1.it)("returns empty array when cache is empty", function () {
            var result = (0, sticker_cache_js_1.getAllCachedStickers)();
            (0, vitest_1.expect)(result).toEqual([]);
        });
        (0, vitest_1.it)("returns all cached stickers", function () {
            (0, sticker_cache_js_1.cacheSticker)({
                fileId: "a",
                fileUniqueId: "a-unique",
                description: "Sticker A",
                cachedAt: "2026-01-26T10:00:00.000Z",
            });
            (0, sticker_cache_js_1.cacheSticker)({
                fileId: "b",
                fileUniqueId: "b-unique",
                description: "Sticker B",
                cachedAt: "2026-01-26T11:00:00.000Z",
            });
            var result = (0, sticker_cache_js_1.getAllCachedStickers)();
            (0, vitest_1.expect)(result).toHaveLength(2);
        });
    });
    (0, vitest_1.describe)("getCacheStats", function () {
        (0, vitest_1.it)("returns count 0 when cache is empty", function () {
            var stats = (0, sticker_cache_js_1.getCacheStats)();
            (0, vitest_1.expect)(stats.count).toBe(0);
            (0, vitest_1.expect)(stats.oldestAt).toBeUndefined();
            (0, vitest_1.expect)(stats.newestAt).toBeUndefined();
        });
        (0, vitest_1.it)("returns correct stats with cached stickers", function () {
            (0, sticker_cache_js_1.cacheSticker)({
                fileId: "old",
                fileUniqueId: "old-unique",
                description: "Old sticker",
                cachedAt: "2026-01-20T10:00:00.000Z",
            });
            (0, sticker_cache_js_1.cacheSticker)({
                fileId: "new",
                fileUniqueId: "new-unique",
                description: "New sticker",
                cachedAt: "2026-01-26T10:00:00.000Z",
            });
            (0, sticker_cache_js_1.cacheSticker)({
                fileId: "mid",
                fileUniqueId: "mid-unique",
                description: "Middle sticker",
                cachedAt: "2026-01-23T10:00:00.000Z",
            });
            var stats = (0, sticker_cache_js_1.getCacheStats)();
            (0, vitest_1.expect)(stats.count).toBe(3);
            (0, vitest_1.expect)(stats.oldestAt).toBe("2026-01-20T10:00:00.000Z");
            (0, vitest_1.expect)(stats.newestAt).toBe("2026-01-26T10:00:00.000Z");
        });
    });
});
