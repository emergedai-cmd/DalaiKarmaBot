"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var processed_messages_js_1 = require("./processed-messages.js");
(0, vitest_1.describe)("createProcessedMessageTracker", function () {
    (0, vitest_1.it)("dedupes and evicts oldest entries", function () {
        var tracker = (0, processed_messages_js_1.createProcessedMessageTracker)(3);
        (0, vitest_1.expect)(tracker.mark("a")).toBe(true);
        (0, vitest_1.expect)(tracker.mark("a")).toBe(false);
        (0, vitest_1.expect)(tracker.has("a")).toBe(true);
        tracker.mark("b");
        tracker.mark("c");
        (0, vitest_1.expect)(tracker.size()).toBe(3);
        tracker.mark("d");
        (0, vitest_1.expect)(tracker.size()).toBe(3);
        (0, vitest_1.expect)(tracker.has("a")).toBe(false);
        (0, vitest_1.expect)(tracker.has("b")).toBe(true);
        (0, vitest_1.expect)(tracker.has("c")).toBe(true);
        (0, vitest_1.expect)(tracker.has("d")).toBe(true);
    });
});
