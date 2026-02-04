"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var searchable_select_list_js_1 = require("./searchable-select-list.js");
var mockTheme = {
    selectedPrefix: function (t) { return "[".concat(t, "]"); },
    selectedText: function (t) { return "**".concat(t, "**"); },
    description: function (t) { return "(".concat(t, ")"); },
    scrollInfo: function (t) { return "~".concat(t, "~"); },
    noMatch: function (t) { return "!".concat(t, "!"); },
    searchPrompt: function (t) { return ">".concat(t, "<"); },
    searchInput: function (t) { return "|".concat(t, "|"); },
    matchHighlight: function (t) { return "*".concat(t, "*"); },
};
var testItems = [
    {
        value: "anthropic/claude-3-opus",
        label: "anthropic/claude-3-opus",
        description: "Claude 3 Opus",
    },
    {
        value: "anthropic/claude-3-sonnet",
        label: "anthropic/claude-3-sonnet",
        description: "Claude 3 Sonnet",
    },
    { value: "openai/gpt-4", label: "openai/gpt-4", description: "GPT-4" },
    { value: "openai/gpt-4-turbo", label: "openai/gpt-4-turbo", description: "GPT-4 Turbo" },
    { value: "google/gemini-pro", label: "google/gemini-pro", description: "Gemini Pro" },
];
(0, vitest_1.describe)("SearchableSelectList", function () {
    (0, vitest_1.it)("renders all items when no filter is applied", function () {
        var list = new searchable_select_list_js_1.SearchableSelectList(testItems, 5, mockTheme);
        var output = list.render(80);
        // Should have search prompt line, spacer, and items
        (0, vitest_1.expect)(output.length).toBeGreaterThanOrEqual(3);
        (0, vitest_1.expect)(output[0]).toContain("search");
    });
    (0, vitest_1.it)("filters items when typing", function () {
        var list = new searchable_select_list_js_1.SearchableSelectList(testItems, 5, mockTheme);
        // Simulate typing "gemini" - unique enough to narrow down
        list.handleInput("g");
        list.handleInput("e");
        list.handleInput("m");
        list.handleInput("i");
        list.handleInput("n");
        list.handleInput("i");
        var selected = list.getSelectedItem();
        (0, vitest_1.expect)(selected === null || selected === void 0 ? void 0 : selected.value).toBe("google/gemini-pro");
    });
    (0, vitest_1.it)("prioritizes exact substring matches over fuzzy matches", function () {
        // Add items where one has early exact match, others are fuzzy or late matches
        var items = [
            { value: "openrouter/auto", label: "openrouter/auto", description: "Routes to best" },
            { value: "opus-direct", label: "opus-direct", description: "Direct opus model" },
            {
                value: "anthropic/claude-3-opus",
                label: "anthropic/claude-3-opus",
                description: "Claude 3 Opus",
            },
        ];
        var list = new searchable_select_list_js_1.SearchableSelectList(items, 5, mockTheme);
        // Type "opus" - should match "opus-direct" first (earliest exact substring)
        for (var _i = 0, _a = "opus"; _i < _a.length; _i++) {
            var ch = _a[_i];
            list.handleInput(ch);
        }
        // First result should be "opus-direct" where "opus" appears at position 0
        var selected = list.getSelectedItem();
        (0, vitest_1.expect)(selected === null || selected === void 0 ? void 0 : selected.value).toBe("opus-direct");
    });
    (0, vitest_1.it)("keeps exact label matches ahead of description matches", function () {
        var longPrefix = "x".repeat(250);
        var items = [
            { value: "late-label", label: "".concat(longPrefix, "opus"), description: "late exact match" },
            { value: "desc-first", label: "provider/other", description: "opus in description" },
        ];
        var list = new searchable_select_list_js_1.SearchableSelectList(items, 5, mockTheme);
        for (var _i = 0, _a = "opus"; _i < _a.length; _i++) {
            var ch = _a[_i];
            list.handleInput(ch);
        }
        var selected = list.getSelectedItem();
        (0, vitest_1.expect)(selected === null || selected === void 0 ? void 0 : selected.value).toBe("late-label");
    });
    (0, vitest_1.it)("exact label match beats description match", function () {
        var items = [
            {
                value: "provider/other",
                label: "provider/other",
                description: "This mentions opus in description",
            },
            { value: "provider/opus-model", label: "provider/opus-model", description: "Something else" },
        ];
        var list = new searchable_select_list_js_1.SearchableSelectList(items, 5, mockTheme);
        for (var _i = 0, _a = "opus"; _i < _a.length; _i++) {
            var ch = _a[_i];
            list.handleInput(ch);
        }
        // Label match should win over description match
        var selected = list.getSelectedItem();
        (0, vitest_1.expect)(selected === null || selected === void 0 ? void 0 : selected.value).toBe("provider/opus-model");
    });
    (0, vitest_1.it)("orders description matches by earliest index", function () {
        var items = [
            { value: "first", label: "first", description: "prefix opus value" },
            { value: "second", label: "second", description: "opus suffix value" },
        ];
        var list = new searchable_select_list_js_1.SearchableSelectList(items, 5, mockTheme);
        for (var _i = 0, _a = "opus"; _i < _a.length; _i++) {
            var ch = _a[_i];
            list.handleInput(ch);
        }
        var selected = list.getSelectedItem();
        (0, vitest_1.expect)(selected === null || selected === void 0 ? void 0 : selected.value).toBe("second");
    });
    (0, vitest_1.it)("filters items with fuzzy matching", function () {
        var list = new searchable_select_list_js_1.SearchableSelectList(testItems, 5, mockTheme);
        // Simulate typing "gpt" which should match openai/gpt-4 models
        list.handleInput("g");
        list.handleInput("p");
        list.handleInput("t");
        var selected = list.getSelectedItem();
        (0, vitest_1.expect)(selected === null || selected === void 0 ? void 0 : selected.value).toContain("gpt");
    });
    (0, vitest_1.it)("preserves fuzzy ranking when only fuzzy matches exist", function () {
        var items = [
            { value: "xg---4", label: "xg---4", description: "Worse fuzzy match" },
            { value: "gpt-4", label: "gpt-4", description: "Better fuzzy match" },
        ];
        var list = new searchable_select_list_js_1.SearchableSelectList(items, 5, mockTheme);
        for (var _i = 0, _a = "g4"; _i < _a.length; _i++) {
            var ch = _a[_i];
            list.handleInput(ch);
        }
        var selected = list.getSelectedItem();
        (0, vitest_1.expect)(selected === null || selected === void 0 ? void 0 : selected.value).toBe("gpt-4");
    });
    (0, vitest_1.it)("highlights matches in rendered output", function () {
        var list = new searchable_select_list_js_1.SearchableSelectList(testItems, 5, mockTheme);
        for (var _i = 0, _a = "gpt"; _i < _a.length; _i++) {
            var ch = _a[_i];
            list.handleInput(ch);
        }
        var output = list.render(80).join("\n");
        (0, vitest_1.expect)(output).toContain("*gpt*");
    });
    (0, vitest_1.it)("shows no match message when filter yields no results", function () {
        var list = new searchable_select_list_js_1.SearchableSelectList(testItems, 5, mockTheme);
        // Type something that won't match
        list.handleInput("x");
        list.handleInput("y");
        list.handleInput("z");
        var output = list.render(80);
        (0, vitest_1.expect)(output.some(function (line) { return line.includes("No matches"); })).toBe(true);
    });
    (0, vitest_1.it)("navigates with arrow keys", function () {
        var _a, _b;
        var list = new searchable_select_list_js_1.SearchableSelectList(testItems, 5, mockTheme);
        // Initially first item is selected
        (0, vitest_1.expect)((_a = list.getSelectedItem()) === null || _a === void 0 ? void 0 : _a.value).toBe("anthropic/claude-3-opus");
        // Press down arrow (escape sequence for down arrow)
        list.handleInput("\x1b[B");
        (0, vitest_1.expect)((_b = list.getSelectedItem()) === null || _b === void 0 ? void 0 : _b.value).toBe("anthropic/claude-3-sonnet");
    });
    (0, vitest_1.it)("calls onSelect when enter is pressed", function () {
        var list = new searchable_select_list_js_1.SearchableSelectList(testItems, 5, mockTheme);
        var selectedValue;
        list.onSelect = function (item) {
            selectedValue = item.value;
        };
        // Press enter
        list.handleInput("\r");
        (0, vitest_1.expect)(selectedValue).toBe("anthropic/claude-3-opus");
    });
    (0, vitest_1.it)("calls onCancel when escape is pressed", function () {
        var list = new searchable_select_list_js_1.SearchableSelectList(testItems, 5, mockTheme);
        var cancelled = false;
        list.onCancel = function () {
            cancelled = true;
        };
        // Press escape
        list.handleInput("\x1b");
        (0, vitest_1.expect)(cancelled).toBe(true);
    });
});
