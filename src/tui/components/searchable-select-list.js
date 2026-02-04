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
exports.SearchableSelectList = void 0;
var pi_tui_1 = require("@mariozechner/pi-tui");
var ansi_js_1 = require("../../terminal/ansi.js");
var fuzzy_filter_js_1 = require("./fuzzy-filter.js");
/**
 * A select list with a search input at the top for fuzzy filtering.
 */
var SearchableSelectList = /** @class */ (function () {
    function SearchableSelectList(items, maxVisible, theme) {
        var _this = this;
        this.selectedIndex = 0;
        this.regexCache = new Map();
        this.compareByScore = function (a, b) {
            if (a.tier !== b.tier) {
                return a.tier - b.tier;
            }
            if (a.score !== b.score) {
                return a.score - b.score;
            }
            return _this.getItemLabel(a.item).localeCompare(_this.getItemLabel(b.item));
        };
        this.items = items;
        this.filteredItems = items;
        this.maxVisible = maxVisible;
        this.theme = theme;
        this.searchInput = new pi_tui_1.Input();
    }
    SearchableSelectList.prototype.getCachedRegex = function (pattern) {
        var regex = this.regexCache.get(pattern);
        if (!regex) {
            regex = new RegExp(this.escapeRegex(pattern), "gi");
            this.regexCache.set(pattern, regex);
        }
        return regex;
    };
    SearchableSelectList.prototype.updateFilter = function () {
        var query = this.searchInput.getValue().trim();
        if (!query) {
            this.filteredItems = this.items;
        }
        else {
            this.filteredItems = this.smartFilter(query);
        }
        // Reset selection when filter changes
        this.selectedIndex = 0;
        this.notifySelectionChange();
    };
    /**
     * Smart filtering that prioritizes:
     * 1. Exact substring match in label (highest priority)
     * 2. Word-boundary prefix match in label
     * 3. Exact substring in description
     * 4. Fuzzy match (lowest priority)
     */
    SearchableSelectList.prototype.smartFilter = function (query) {
        var _a;
        var q = query.toLowerCase();
        var scoredItems = [];
        var fuzzyCandidates = [];
        for (var _i = 0, _b = this.items; _i < _b.length; _i++) {
            var item = _b[_i];
            var label = item.label.toLowerCase();
            var desc = ((_a = item.description) !== null && _a !== void 0 ? _a : "").toLowerCase();
            // Tier 1: Exact substring in label
            var labelIndex = label.indexOf(q);
            if (labelIndex !== -1) {
                scoredItems.push({ item: item, tier: 0, score: labelIndex });
                continue;
            }
            // Tier 2: Word-boundary prefix in label
            var wordBoundaryIndex = (0, fuzzy_filter_js_1.findWordBoundaryIndex)(label, q);
            if (wordBoundaryIndex !== null) {
                scoredItems.push({ item: item, tier: 1, score: wordBoundaryIndex });
                continue;
            }
            // Tier 3: Exact substring in description
            var descIndex = desc.indexOf(q);
            if (descIndex !== -1) {
                scoredItems.push({ item: item, tier: 2, score: descIndex });
                continue;
            }
            // Tier 4: Fuzzy match (score 300+)
            fuzzyCandidates.push(item);
        }
        scoredItems.sort(this.compareByScore);
        var preparedCandidates = (0, fuzzy_filter_js_1.prepareSearchItems)(fuzzyCandidates);
        var fuzzyMatches = (0, fuzzy_filter_js_1.fuzzyFilterLower)(preparedCandidates, q);
        return __spreadArray(__spreadArray([], scoredItems.map(function (s) { return s.item; }), true), fuzzyMatches, true);
    };
    SearchableSelectList.prototype.escapeRegex = function (str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };
    SearchableSelectList.prototype.getItemLabel = function (item) {
        return item.label || item.value;
    };
    SearchableSelectList.prototype.highlightMatch = function (text, query) {
        var _this = this;
        var tokens = query
            .trim()
            .split(/\s+/)
            .map(function (token) { return token.toLowerCase(); })
            .filter(function (token) { return token.length > 0; });
        if (tokens.length === 0) {
            return text;
        }
        var uniqueTokens = Array.from(new Set(tokens)).toSorted(function (a, b) { return b.length - a.length; });
        var result = text;
        for (var _i = 0, uniqueTokens_1 = uniqueTokens; _i < uniqueTokens_1.length; _i++) {
            var token = uniqueTokens_1[_i];
            var regex = this.getCachedRegex(token);
            result = result.replace(regex, function (match) { return _this.theme.matchHighlight(match); });
        }
        return result;
    };
    SearchableSelectList.prototype.setSelectedIndex = function (index) {
        this.selectedIndex = Math.max(0, Math.min(index, this.filteredItems.length - 1));
    };
    SearchableSelectList.prototype.invalidate = function () {
        this.searchInput.invalidate();
    };
    SearchableSelectList.prototype.render = function (width) {
        var _a;
        var lines = [];
        // Search input line
        var promptText = "search: ";
        var prompt = this.theme.searchPrompt(promptText);
        var inputWidth = Math.max(1, width - (0, ansi_js_1.visibleWidth)(prompt));
        var inputLines = this.searchInput.render(inputWidth);
        var inputText = (_a = inputLines[0]) !== null && _a !== void 0 ? _a : "";
        lines.push("".concat(prompt).concat(this.theme.searchInput(inputText)));
        lines.push(""); // Spacer
        var query = this.searchInput.getValue().trim();
        // If no items match filter, show message
        if (this.filteredItems.length === 0) {
            lines.push(this.theme.noMatch("  No matches"));
            return lines;
        }
        // Calculate visible range with scrolling
        var startIndex = Math.max(0, Math.min(this.selectedIndex - Math.floor(this.maxVisible / 2), this.filteredItems.length - this.maxVisible));
        var endIndex = Math.min(startIndex + this.maxVisible, this.filteredItems.length);
        // Render visible items
        for (var i = startIndex; i < endIndex; i++) {
            var item = this.filteredItems[i];
            if (!item) {
                continue;
            }
            var isSelected = i === this.selectedIndex;
            lines.push(this.renderItemLine(item, isSelected, width, query));
        }
        // Show scroll indicator if needed
        if (this.filteredItems.length > this.maxVisible) {
            var scrollInfo = "".concat(this.selectedIndex + 1, "/").concat(this.filteredItems.length);
            lines.push(this.theme.scrollInfo("  ".concat(scrollInfo)));
        }
        return lines;
    };
    SearchableSelectList.prototype.renderItemLine = function (item, isSelected, width, query) {
        var prefix = isSelected ? "→ " : "  ";
        var prefixWidth = prefix.length;
        var displayValue = this.getItemLabel(item);
        if (item.description && width > 40) {
            var maxValueWidth = Math.min(30, width - prefixWidth - 4);
            var truncatedValue_1 = (0, pi_tui_1.truncateToWidth)(displayValue, maxValueWidth, "");
            var valueText_1 = this.highlightMatch(truncatedValue_1, query);
            var spacingWidth = Math.max(1, 32 - (0, ansi_js_1.visibleWidth)(valueText_1));
            var spacing = " ".repeat(spacingWidth);
            var descriptionStart = prefixWidth + (0, ansi_js_1.visibleWidth)(valueText_1) + spacing.length;
            var remainingWidth = width - descriptionStart - 2;
            if (remainingWidth > 10) {
                var truncatedDesc = (0, pi_tui_1.truncateToWidth)(item.description, remainingWidth, "");
                // Highlight plain text first, then apply theme styling to avoid corrupting ANSI codes
                var highlightedDesc = this.highlightMatch(truncatedDesc, query);
                var descText = isSelected ? highlightedDesc : this.theme.description(highlightedDesc);
                var line_1 = "".concat(prefix).concat(valueText_1).concat(spacing).concat(descText);
                return isSelected ? this.theme.selectedText(line_1) : line_1;
            }
        }
        var maxWidth = width - prefixWidth - 2;
        var truncatedValue = (0, pi_tui_1.truncateToWidth)(displayValue, maxWidth, "");
        var valueText = this.highlightMatch(truncatedValue, query);
        var line = "".concat(prefix).concat(valueText);
        return isSelected ? this.theme.selectedText(line) : line;
    };
    SearchableSelectList.prototype.handleInput = function (keyData) {
        if ((0, pi_tui_1.isKeyRelease)(keyData)) {
            return;
        }
        var allowVimNav = !this.searchInput.getValue().trim();
        // Navigation keys
        if ((0, pi_tui_1.matchesKey)(keyData, "up") ||
            (0, pi_tui_1.matchesKey)(keyData, "ctrl+p") ||
            (allowVimNav && keyData === "k")) {
            this.selectedIndex = Math.max(0, this.selectedIndex - 1);
            this.notifySelectionChange();
            return;
        }
        if ((0, pi_tui_1.matchesKey)(keyData, "down") ||
            (0, pi_tui_1.matchesKey)(keyData, "ctrl+n") ||
            (allowVimNav && keyData === "j")) {
            this.selectedIndex = Math.min(this.filteredItems.length - 1, this.selectedIndex + 1);
            this.notifySelectionChange();
            return;
        }
        if ((0, pi_tui_1.matchesKey)(keyData, "enter")) {
            var item = this.filteredItems[this.selectedIndex];
            if (item && this.onSelect) {
                this.onSelect(item);
            }
            return;
        }
        var kb = (0, pi_tui_1.getEditorKeybindings)();
        if (kb.matches(keyData, "selectCancel")) {
            if (this.onCancel) {
                this.onCancel();
            }
            return;
        }
        // Pass other keys to search input
        var prevValue = this.searchInput.getValue();
        this.searchInput.handleInput(keyData);
        var newValue = this.searchInput.getValue();
        if (prevValue !== newValue) {
            this.updateFilter();
        }
    };
    SearchableSelectList.prototype.notifySelectionChange = function () {
        var item = this.filteredItems[this.selectedIndex];
        if (item && this.onSelectionChange) {
            this.onSelectionChange(item);
        }
    };
    SearchableSelectList.prototype.getSelectedItem = function () {
        var _a;
        return (_a = this.filteredItems[this.selectedIndex]) !== null && _a !== void 0 ? _a : null;
    };
    return SearchableSelectList;
}());
exports.SearchableSelectList = SearchableSelectList;
