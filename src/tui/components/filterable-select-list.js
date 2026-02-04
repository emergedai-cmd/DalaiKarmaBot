"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterableSelectList = void 0;
var pi_tui_1 = require("@mariozechner/pi-tui");
var chalk_1 = require("chalk");
var fuzzy_filter_js_1 = require("./fuzzy-filter.js");
/**
 * Combines text input filtering with a select list.
 * User types to filter, arrows/j/k to navigate, Enter to select, Escape to clear/cancel.
 */
var FilterableSelectList = /** @class */ (function () {
    function FilterableSelectList(items, maxVisible, theme) {
        this.filterText = "";
        this.allItems = (0, fuzzy_filter_js_1.prepareSearchItems)(items);
        this.maxVisible = maxVisible;
        this.theme = theme;
        this.input = new pi_tui_1.Input();
        this.selectList = new pi_tui_1.SelectList(this.allItems, maxVisible, theme);
    }
    FilterableSelectList.prototype.applyFilter = function () {
        var queryLower = this.filterText.toLowerCase();
        if (!queryLower.trim()) {
            this.selectList = new pi_tui_1.SelectList(this.allItems, this.maxVisible, this.theme);
            return;
        }
        var filtered = (0, fuzzy_filter_js_1.fuzzyFilterLower)(this.allItems, queryLower);
        this.selectList = new pi_tui_1.SelectList(filtered, this.maxVisible, this.theme);
    };
    FilterableSelectList.prototype.invalidate = function () {
        this.input.invalidate();
        this.selectList.invalidate();
    };
    FilterableSelectList.prototype.render = function (width) {
        var _a;
        var lines = [];
        // Filter input row
        var filterLabel = this.theme.filterLabel("Filter: ");
        var inputLines = this.input.render(width - 8);
        var inputText = (_a = inputLines[0]) !== null && _a !== void 0 ? _a : "";
        lines.push(filterLabel + inputText);
        // Separator
        lines.push(chalk_1.default.dim("─".repeat(Math.max(0, width))));
        // Select list
        var listLines = this.selectList.render(width);
        lines.push.apply(lines, listLines);
        return lines;
    };
    FilterableSelectList.prototype.handleInput = function (keyData) {
        var _a, _b;
        var allowVimNav = !this.filterText.trim();
        // Navigation: arrows, vim j/k, or ctrl+p/ctrl+n
        if ((0, pi_tui_1.matchesKey)(keyData, "up") ||
            (0, pi_tui_1.matchesKey)(keyData, "ctrl+p") ||
            (allowVimNav && keyData === "k")) {
            this.selectList.handleInput("\x1b[A");
            return;
        }
        if ((0, pi_tui_1.matchesKey)(keyData, "down") ||
            (0, pi_tui_1.matchesKey)(keyData, "ctrl+n") ||
            (allowVimNav && keyData === "j")) {
            this.selectList.handleInput("\x1b[B");
            return;
        }
        // Enter selects
        if ((0, pi_tui_1.matchesKey)(keyData, "enter")) {
            var selected = this.selectList.getSelectedItem();
            if (selected) {
                (_a = this.onSelect) === null || _a === void 0 ? void 0 : _a.call(this, selected);
            }
            return;
        }
        // Escape: clear filter or cancel
        var kb = (0, pi_tui_1.getEditorKeybindings)();
        if (kb.matches(keyData, "selectCancel")) {
            if (this.filterText) {
                this.filterText = "";
                this.input.setValue("");
                this.applyFilter();
            }
            else {
                (_b = this.onCancel) === null || _b === void 0 ? void 0 : _b.call(this);
            }
            return;
        }
        // All other input goes to filter
        var prevValue = this.input.getValue();
        this.input.handleInput(keyData);
        var newValue = this.input.getValue();
        if (newValue !== prevValue) {
            this.filterText = newValue;
            this.applyFilter();
        }
    };
    FilterableSelectList.prototype.getSelectedItem = function () {
        return this.selectList.getSelectedItem();
    };
    FilterableSelectList.prototype.getFilterText = function () {
        return this.filterText;
    };
    return FilterableSelectList;
}());
exports.FilterableSelectList = FilterableSelectList;
