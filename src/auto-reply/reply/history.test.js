"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var history_js_1 = require("./history.js");
var mentions_js_1 = require("./mentions.js");
(0, vitest_1.describe)("history helpers", function () {
    (0, vitest_1.it)("returns current message when history is empty", function () {
        var result = (0, history_js_1.buildHistoryContext)({
            historyText: "  ",
            currentMessage: "hello",
        });
        (0, vitest_1.expect)(result).toBe("hello");
    });
    (0, vitest_1.it)("wraps history entries and excludes current by default", function () {
        var result = (0, history_js_1.buildHistoryContextFromEntries)({
            entries: [
                { sender: "A", body: "one" },
                { sender: "B", body: "two" },
            ],
            currentMessage: "current",
            formatEntry: function (entry) { return "".concat(entry.sender, ": ").concat(entry.body); },
        });
        (0, vitest_1.expect)(result).toContain(history_js_1.HISTORY_CONTEXT_MARKER);
        (0, vitest_1.expect)(result).toContain("A: one");
        (0, vitest_1.expect)(result).not.toContain("B: two");
        (0, vitest_1.expect)(result).toContain(mentions_js_1.CURRENT_MESSAGE_MARKER);
        (0, vitest_1.expect)(result).toContain("current");
    });
    (0, vitest_1.it)("trims history to configured limit", function () {
        var _a;
        var historyMap = new Map();
        (0, history_js_1.appendHistoryEntry)({
            historyMap: historyMap,
            historyKey: "group",
            limit: 2,
            entry: { sender: "A", body: "one" },
        });
        (0, history_js_1.appendHistoryEntry)({
            historyMap: historyMap,
            historyKey: "group",
            limit: 2,
            entry: { sender: "B", body: "two" },
        });
        (0, history_js_1.appendHistoryEntry)({
            historyMap: historyMap,
            historyKey: "group",
            limit: 2,
            entry: { sender: "C", body: "three" },
        });
        (0, vitest_1.expect)((_a = historyMap.get("group")) === null || _a === void 0 ? void 0 : _a.map(function (entry) { return entry.body; })).toEqual(["two", "three"]);
    });
    (0, vitest_1.it)("builds context from map and appends entry", function () {
        var _a;
        var historyMap = new Map();
        historyMap.set("group", [
            { sender: "A", body: "one" },
            { sender: "B", body: "two" },
        ]);
        var result = (0, history_js_1.buildHistoryContextFromMap)({
            historyMap: historyMap,
            historyKey: "group",
            limit: 3,
            entry: { sender: "C", body: "three" },
            currentMessage: "current",
            formatEntry: function (entry) { return "".concat(entry.sender, ": ").concat(entry.body); },
        });
        (0, vitest_1.expect)((_a = historyMap.get("group")) === null || _a === void 0 ? void 0 : _a.map(function (entry) { return entry.body; })).toEqual(["one", "two", "three"]);
        (0, vitest_1.expect)(result).toContain(history_js_1.HISTORY_CONTEXT_MARKER);
        (0, vitest_1.expect)(result).toContain("A: one");
        (0, vitest_1.expect)(result).toContain("B: two");
        (0, vitest_1.expect)(result).not.toContain("C: three");
    });
    (0, vitest_1.it)("builds context from pending map without appending", function () {
        var _a;
        var historyMap = new Map();
        historyMap.set("group", [
            { sender: "A", body: "one" },
            { sender: "B", body: "two" },
        ]);
        var result = (0, history_js_1.buildPendingHistoryContextFromMap)({
            historyMap: historyMap,
            historyKey: "group",
            limit: 3,
            currentMessage: "current",
            formatEntry: function (entry) { return "".concat(entry.sender, ": ").concat(entry.body); },
        });
        (0, vitest_1.expect)((_a = historyMap.get("group")) === null || _a === void 0 ? void 0 : _a.map(function (entry) { return entry.body; })).toEqual(["one", "two"]);
        (0, vitest_1.expect)(result).toContain(history_js_1.HISTORY_CONTEXT_MARKER);
        (0, vitest_1.expect)(result).toContain("A: one");
        (0, vitest_1.expect)(result).toContain("B: two");
        (0, vitest_1.expect)(result).toContain(mentions_js_1.CURRENT_MESSAGE_MARKER);
        (0, vitest_1.expect)(result).toContain("current");
    });
    (0, vitest_1.it)("records pending entries only when enabled", function () {
        var _a;
        var historyMap = new Map();
        (0, history_js_1.recordPendingHistoryEntryIfEnabled)({
            historyMap: historyMap,
            historyKey: "group",
            limit: 0,
            entry: { sender: "A", body: "one" },
        });
        (0, vitest_1.expect)(historyMap.get("group")).toEqual(undefined);
        (0, history_js_1.recordPendingHistoryEntryIfEnabled)({
            historyMap: historyMap,
            historyKey: "group",
            limit: 2,
            entry: null,
        });
        (0, vitest_1.expect)(historyMap.get("group")).toEqual(undefined);
        (0, history_js_1.recordPendingHistoryEntryIfEnabled)({
            historyMap: historyMap,
            historyKey: "group",
            limit: 2,
            entry: { sender: "B", body: "two" },
        });
        (0, vitest_1.expect)((_a = historyMap.get("group")) === null || _a === void 0 ? void 0 : _a.map(function (entry) { return entry.body; })).toEqual(["two"]);
    });
    (0, vitest_1.it)("clears history entries only when enabled", function () {
        var _a;
        var historyMap = new Map();
        historyMap.set("group", [
            { sender: "A", body: "one" },
            { sender: "B", body: "two" },
        ]);
        (0, history_js_1.clearHistoryEntriesIfEnabled)({ historyMap: historyMap, historyKey: "group", limit: 0 });
        (0, vitest_1.expect)((_a = historyMap.get("group")) === null || _a === void 0 ? void 0 : _a.map(function (entry) { return entry.body; })).toEqual(["one", "two"]);
        (0, history_js_1.clearHistoryEntriesIfEnabled)({ historyMap: historyMap, historyKey: "group", limit: 2 });
        (0, vitest_1.expect)(historyMap.get("group")).toEqual([]);
    });
});
