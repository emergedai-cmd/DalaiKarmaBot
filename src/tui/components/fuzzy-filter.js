"use strict";
/**
 * Shared fuzzy filtering utilities for select list components.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWordBoundary = isWordBoundary;
exports.findWordBoundaryIndex = findWordBoundaryIndex;
exports.fuzzyMatchLower = fuzzyMatchLower;
exports.fuzzyFilterLower = fuzzyFilterLower;
exports.prepareSearchItems = prepareSearchItems;
/**
 * Word boundary characters for matching.
 */
var WORD_BOUNDARY_CHARS = /[\s\-_./:#@]/;
/**
 * Check if position is at a word boundary.
 */
function isWordBoundary(text, index) {
    var _a;
    return index === 0 || WORD_BOUNDARY_CHARS.test((_a = text[index - 1]) !== null && _a !== void 0 ? _a : "");
}
/**
 * Find index where query matches at a word boundary in text.
 * Returns null if no match.
 */
function findWordBoundaryIndex(text, query) {
    if (!query) {
        return null;
    }
    var textLower = text.toLowerCase();
    var queryLower = query.toLowerCase();
    var maxIndex = textLower.length - queryLower.length;
    if (maxIndex < 0) {
        return null;
    }
    for (var i = 0; i <= maxIndex; i++) {
        if (textLower.startsWith(queryLower, i) && isWordBoundary(textLower, i)) {
            return i;
        }
    }
    return null;
}
/**
 * Fuzzy match with pre-lowercased inputs (avoids toLowerCase on every keystroke).
 * Returns score (lower = better) or null if no match.
 */
function fuzzyMatchLower(queryLower, textLower) {
    if (queryLower.length === 0) {
        return 0;
    }
    if (queryLower.length > textLower.length) {
        return null;
    }
    var queryIndex = 0;
    var score = 0;
    var lastMatchIndex = -1;
    var consecutiveMatches = 0;
    for (var i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
        if (textLower[i] === queryLower[queryIndex]) {
            var isAtWordBoundary = isWordBoundary(textLower, i);
            if (lastMatchIndex === i - 1) {
                consecutiveMatches++;
                score -= consecutiveMatches * 5; // Reward consecutive matches
            }
            else {
                consecutiveMatches = 0;
                if (lastMatchIndex >= 0) {
                    score += (i - lastMatchIndex - 1) * 2;
                } // Penalize gaps
            }
            if (isAtWordBoundary) {
                score -= 10;
            } // Reward word boundary matches
            score += i * 0.1; // Slight penalty for later matches
            lastMatchIndex = i;
            queryIndex++;
        }
    }
    return queryIndex < queryLower.length ? null : score;
}
/**
 * Filter items using pre-lowercased searchTextLower field.
 * Supports space-separated tokens (all must match).
 */
function fuzzyFilterLower(items, queryLower) {
    var _a;
    var trimmed = queryLower.trim();
    if (!trimmed) {
        return items;
    }
    var tokens = trimmed.split(/\s+/).filter(function (t) { return t.length > 0; });
    if (tokens.length === 0) {
        return items;
    }
    var results = [];
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        var text = (_a = item.searchTextLower) !== null && _a !== void 0 ? _a : "";
        var totalScore = 0;
        var allMatch = true;
        for (var _b = 0, tokens_1 = tokens; _b < tokens_1.length; _b++) {
            var token = tokens_1[_b];
            var score = fuzzyMatchLower(token, text);
            if (score !== null) {
                totalScore += score;
            }
            else {
                allMatch = false;
                break;
            }
        }
        if (allMatch) {
            results.push({ item: item, score: totalScore });
        }
    }
    results.sort(function (a, b) { return a.score - b.score; });
    return results.map(function (r) { return r.item; });
}
/**
 * Prepare items for fuzzy filtering by pre-computing lowercase search text.
 */
function prepareSearchItems(items) {
    return items.map(function (item) {
        var parts = [];
        if (item.label) {
            parts.push(item.label);
        }
        if (item.description) {
            parts.push(item.description);
        }
        if (item.searchText) {
            parts.push(item.searchText);
        }
        return __assign(__assign({}, item), { searchTextLower: parts.join(" ").toLowerCase() });
    });
}
