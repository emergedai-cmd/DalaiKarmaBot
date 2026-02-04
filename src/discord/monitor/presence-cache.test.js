"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var presence_cache_js_1 = require("./presence-cache.js");
(0, vitest_1.describe)("presence-cache", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, presence_cache_js_1.clearPresences)();
    });
    (0, vitest_1.it)("scopes presence entries by account", function () {
        var presenceA = { status: "online" };
        var presenceB = { status: "idle" };
        (0, presence_cache_js_1.setPresence)("account-a", "user-1", presenceA);
        (0, presence_cache_js_1.setPresence)("account-b", "user-1", presenceB);
        (0, vitest_1.expect)((0, presence_cache_js_1.getPresence)("account-a", "user-1")).toBe(presenceA);
        (0, vitest_1.expect)((0, presence_cache_js_1.getPresence)("account-b", "user-1")).toBe(presenceB);
        (0, vitest_1.expect)((0, presence_cache_js_1.getPresence)("account-a", "user-2")).toBeUndefined();
    });
    (0, vitest_1.it)("clears presence per account", function () {
        var presence = { status: "dnd" };
        (0, presence_cache_js_1.setPresence)("account-a", "user-1", presence);
        (0, presence_cache_js_1.setPresence)("account-b", "user-2", presence);
        (0, presence_cache_js_1.clearPresences)("account-a");
        (0, vitest_1.expect)((0, presence_cache_js_1.getPresence)("account-a", "user-1")).toBeUndefined();
        (0, vitest_1.expect)((0, presence_cache_js_1.getPresence)("account-b", "user-2")).toBe(presence);
        (0, vitest_1.expect)((0, presence_cache_js_1.presenceCacheSize)()).toBe(1);
    });
});
