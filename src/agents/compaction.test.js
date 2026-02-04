"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var compaction_js_1 = require("./compaction.js");
function makeMessage(id, size) {
    return {
        role: "user",
        content: "x".repeat(size),
        timestamp: id,
    };
}
(0, vitest_1.describe)("splitMessagesByTokenShare", function () {
    (0, vitest_1.it)("splits messages into two non-empty parts", function () {
        var _a, _b;
        var messages = [
            makeMessage(1, 4000),
            makeMessage(2, 4000),
            makeMessage(3, 4000),
            makeMessage(4, 4000),
        ];
        var parts = (0, compaction_js_1.splitMessagesByTokenShare)(messages, 2);
        (0, vitest_1.expect)(parts.length).toBeGreaterThanOrEqual(2);
        (0, vitest_1.expect)((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.length).toBeGreaterThan(0);
        (0, vitest_1.expect)((_b = parts[1]) === null || _b === void 0 ? void 0 : _b.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(parts.flat().length).toBe(messages.length);
    });
    (0, vitest_1.it)("preserves message order across parts", function () {
        var messages = [
            makeMessage(1, 4000),
            makeMessage(2, 4000),
            makeMessage(3, 4000),
            makeMessage(4, 4000),
            makeMessage(5, 4000),
            makeMessage(6, 4000),
        ];
        var parts = (0, compaction_js_1.splitMessagesByTokenShare)(messages, 3);
        (0, vitest_1.expect)(parts.flat().map(function (msg) { return msg.timestamp; })).toEqual(messages.map(function (msg) { return msg.timestamp; }));
    });
});
(0, vitest_1.describe)("pruneHistoryForContextShare", function () {
    (0, vitest_1.it)("drops older chunks until the history budget is met", function () {
        var messages = [
            makeMessage(1, 4000),
            makeMessage(2, 4000),
            makeMessage(3, 4000),
            makeMessage(4, 4000),
        ];
        var maxContextTokens = 2000; // budget is 1000 tokens (50%)
        var pruned = (0, compaction_js_1.pruneHistoryForContextShare)({
            messages: messages,
            maxContextTokens: maxContextTokens,
            maxHistoryShare: 0.5,
            parts: 2,
        });
        (0, vitest_1.expect)(pruned.droppedChunks).toBeGreaterThan(0);
        (0, vitest_1.expect)(pruned.keptTokens).toBeLessThanOrEqual(Math.floor(maxContextTokens * 0.5));
        (0, vitest_1.expect)(pruned.messages.length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)("keeps the newest messages when pruning", function () {
        var messages = [
            makeMessage(1, 4000),
            makeMessage(2, 4000),
            makeMessage(3, 4000),
            makeMessage(4, 4000),
            makeMessage(5, 4000),
            makeMessage(6, 4000),
        ];
        var totalTokens = (0, compaction_js_1.estimateMessagesTokens)(messages);
        var maxContextTokens = Math.max(1, Math.floor(totalTokens * 0.5)); // budget = 25%
        var pruned = (0, compaction_js_1.pruneHistoryForContextShare)({
            messages: messages,
            maxContextTokens: maxContextTokens,
            maxHistoryShare: 0.5,
            parts: 2,
        });
        var keptIds = pruned.messages.map(function (msg) { return msg.timestamp; });
        var expectedSuffix = messages.slice(-keptIds.length).map(function (msg) { return msg.timestamp; });
        (0, vitest_1.expect)(keptIds).toEqual(expectedSuffix);
    });
    (0, vitest_1.it)("keeps history when already within budget", function () {
        var messages = [makeMessage(1, 1000)];
        var maxContextTokens = 2000;
        var pruned = (0, compaction_js_1.pruneHistoryForContextShare)({
            messages: messages,
            maxContextTokens: maxContextTokens,
            maxHistoryShare: 0.5,
            parts: 2,
        });
        (0, vitest_1.expect)(pruned.droppedChunks).toBe(0);
        (0, vitest_1.expect)(pruned.messages.length).toBe(messages.length);
        (0, vitest_1.expect)(pruned.keptTokens).toBe((0, compaction_js_1.estimateMessagesTokens)(messages));
        (0, vitest_1.expect)(pruned.droppedMessagesList).toEqual([]);
    });
    (0, vitest_1.it)("returns droppedMessagesList containing dropped messages", function () {
        var messages = [
            makeMessage(1, 4000),
            makeMessage(2, 4000),
            makeMessage(3, 4000),
            makeMessage(4, 4000),
        ];
        var maxContextTokens = 2000; // budget is 1000 tokens (50%)
        var pruned = (0, compaction_js_1.pruneHistoryForContextShare)({
            messages: messages,
            maxContextTokens: maxContextTokens,
            maxHistoryShare: 0.5,
            parts: 2,
        });
        (0, vitest_1.expect)(pruned.droppedChunks).toBeGreaterThan(0);
        (0, vitest_1.expect)(pruned.droppedMessagesList.length).toBe(pruned.droppedMessages);
        // All messages accounted for: kept + dropped = original
        var allIds = __spreadArray(__spreadArray([], pruned.droppedMessagesList.map(function (m) { return m.timestamp; }), true), pruned.messages.map(function (m) { return m.timestamp; }), true).toSorted(function (a, b) { return a - b; });
        var originalIds = messages.map(function (m) { return m.timestamp; }).toSorted(function (a, b) { return a - b; });
        (0, vitest_1.expect)(allIds).toEqual(originalIds);
    });
    (0, vitest_1.it)("returns empty droppedMessagesList when no pruning needed", function () {
        var messages = [makeMessage(1, 100)];
        var pruned = (0, compaction_js_1.pruneHistoryForContextShare)({
            messages: messages,
            maxContextTokens: 100000,
            maxHistoryShare: 0.5,
            parts: 2,
        });
        (0, vitest_1.expect)(pruned.droppedChunks).toBe(0);
        (0, vitest_1.expect)(pruned.droppedMessagesList).toEqual([]);
        (0, vitest_1.expect)(pruned.messages.length).toBe(1);
    });
});
