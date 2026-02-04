"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSelectList = createSelectList;
exports.createSearchableSelectList = createSearchableSelectList;
exports.createFilterableSelectList = createFilterableSelectList;
exports.createSettingsList = createSettingsList;
var pi_tui_1 = require("@mariozechner/pi-tui");
var theme_js_1 = require("../theme/theme.js");
var filterable_select_list_js_1 = require("./filterable-select-list.js");
var searchable_select_list_js_1 = require("./searchable-select-list.js");
function createSelectList(items, maxVisible) {
    if (maxVisible === void 0) { maxVisible = 7; }
    return new pi_tui_1.SelectList(items, maxVisible, theme_js_1.selectListTheme);
}
function createSearchableSelectList(items, maxVisible) {
    if (maxVisible === void 0) { maxVisible = 7; }
    return new searchable_select_list_js_1.SearchableSelectList(items, maxVisible, theme_js_1.searchableSelectListTheme);
}
function createFilterableSelectList(items, maxVisible) {
    if (maxVisible === void 0) { maxVisible = 7; }
    return new filterable_select_list_js_1.FilterableSelectList(items, maxVisible, theme_js_1.filterableSelectListTheme);
}
function createSettingsList(items, onChange, onCancel, maxVisible) {
    if (maxVisible === void 0) { maxVisible = 7; }
    return new pi_tui_1.SettingsList(items, maxVisible, theme_js_1.settingsListTheme, onChange, onCancel);
}
