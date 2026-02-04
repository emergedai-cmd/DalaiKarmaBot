"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderLogs = renderLogs;
var lit_1 = require("lit");
var LEVELS = ["trace", "debug", "info", "warn", "error", "fatal"];
function formatTime(value) {
    if (!value) {
        return "";
    }
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleTimeString();
}
function matchesFilter(entry, needle) {
    if (!needle) {
        return true;
    }
    var haystack = [entry.message, entry.subsystem, entry.raw]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
    return haystack.includes(needle);
}
function renderLogs(props) {
    var needle = props.filterText.trim().toLowerCase();
    var levelFiltered = LEVELS.some(function (level) { return !props.levelFilters[level]; });
    var filtered = props.entries.filter(function (entry) {
        if (entry.level && !props.levelFilters[entry.level]) {
            return false;
        }
        return matchesFilter(entry, needle);
    });
    var exportLabel = needle || levelFiltered ? "filtered" : "visible";
    return (0, lit_1.html)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    <section class=\"card\">\n      <div class=\"row\" style=\"justify-content: space-between;\">\n        <div>\n          <div class=\"card-title\">Logs</div>\n          <div class=\"card-sub\">Gateway file logs (JSONL).</div>\n        </div>\n        <div class=\"row\" style=\"gap: 8px;\">\n          <button class=\"btn\" ?disabled=", " @click=", ">\n            ", "\n          </button>\n          <button\n            class=\"btn\"\n            ?disabled=", "\n            @click=", "\n          >\n            Export ", "\n          </button>\n        </div>\n      </div>\n\n      <div class=\"filters\" style=\"margin-top: 14px;\">\n        <label class=\"field\" style=\"min-width: 220px;\">\n          <span>Filter</span>\n          <input\n            .value=", "\n            @input=", "\n            placeholder=\"Search logs\"\n          />\n        </label>\n        <label class=\"field checkbox\">\n          <span>Auto-follow</span>\n          <input\n            type=\"checkbox\"\n            .checked=", "\n            @change=", "\n          />\n        </label>\n      </div>\n\n      <div class=\"chip-row\" style=\"margin-top: 12px;\">\n        ", "\n      </div>\n\n      ", "\n      ", "\n      ", "\n\n      <div class=\"log-stream\" style=\"margin-top: 12px;\" @scroll=", ">\n        ", "\n      </div>\n    </section>\n  "], ["\n    <section class=\"card\">\n      <div class=\"row\" style=\"justify-content: space-between;\">\n        <div>\n          <div class=\"card-title\">Logs</div>\n          <div class=\"card-sub\">Gateway file logs (JSONL).</div>\n        </div>\n        <div class=\"row\" style=\"gap: 8px;\">\n          <button class=\"btn\" ?disabled=", " @click=", ">\n            ", "\n          </button>\n          <button\n            class=\"btn\"\n            ?disabled=", "\n            @click=", "\n          >\n            Export ", "\n          </button>\n        </div>\n      </div>\n\n      <div class=\"filters\" style=\"margin-top: 14px;\">\n        <label class=\"field\" style=\"min-width: 220px;\">\n          <span>Filter</span>\n          <input\n            .value=", "\n            @input=", "\n            placeholder=\"Search logs\"\n          />\n        </label>\n        <label class=\"field checkbox\">\n          <span>Auto-follow</span>\n          <input\n            type=\"checkbox\"\n            .checked=", "\n            @change=", "\n          />\n        </label>\n      </div>\n\n      <div class=\"chip-row\" style=\"margin-top: 12px;\">\n        ", "\n      </div>\n\n      ", "\n      ", "\n      ", "\n\n      <div class=\"log-stream\" style=\"margin-top: 12px;\" @scroll=", ">\n        ", "\n      </div>\n    </section>\n  "])), props.loading, props.onRefresh, props.loading ? "Loading…" : "Refresh", filtered.length === 0, function () {
        return props.onExport(filtered.map(function (entry) { return entry.raw; }), exportLabel);
    }, exportLabel, props.filterText, function (e) { return props.onFilterTextChange(e.target.value); }, props.autoFollow, function (e) {
        return props.onToggleAutoFollow(e.target.checked);
    }, LEVELS.map(function (level) { return (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            <label class=\"chip log-chip ", "\">\n              <input\n                type=\"checkbox\"\n                .checked=", "\n                @change=", "\n              />\n              <span>", "</span>\n            </label>\n          "], ["\n            <label class=\"chip log-chip ", "\">\n              <input\n                type=\"checkbox\"\n                .checked=", "\n                @change=", "\n              />\n              <span>", "</span>\n            </label>\n          "])), level, props.levelFilters[level], function (e) {
        return props.onLevelToggle(level, e.target.checked);
    }, level); }), props.file
        ? (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<div class=\"muted\" style=\"margin-top: 10px;\">File: ", "</div>"], ["<div class=\"muted\" style=\"margin-top: 10px;\">File: ", "</div>"])), props.file) : lit_1.nothing, props.truncated
        ? (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n              <div class=\"callout\" style=\"margin-top: 10px\">Log output truncated; showing latest chunk.</div>\n            "], ["\n              <div class=\"callout\" style=\"margin-top: 10px\">Log output truncated; showing latest chunk.</div>\n            "]))) : lit_1.nothing, props.error
        ? (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["<div class=\"callout danger\" style=\"margin-top: 10px;\">", "</div>"], ["<div class=\"callout danger\" style=\"margin-top: 10px;\">", "</div>"])), props.error) : lit_1.nothing, props.onScroll, filtered.length === 0
        ? (0, lit_1.html)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n                <div class=\"muted\" style=\"padding: 12px\">No log entries.</div>\n              "], ["\n                <div class=\"muted\" style=\"padding: 12px\">No log entries.</div>\n              "]))) : filtered.map(function (entry) {
        var _a, _b, _c, _d;
        return (0, lit_1.html)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n                <div class=\"log-row\">\n                  <div class=\"log-time mono\">", "</div>\n                  <div class=\"log-level ", "\">", "</div>\n                  <div class=\"log-subsystem mono\">", "</div>\n                  <div class=\"log-message mono\">", "</div>\n                </div>\n              "], ["\n                <div class=\"log-row\">\n                  <div class=\"log-time mono\">", "</div>\n                  <div class=\"log-level ", "\">", "</div>\n                  <div class=\"log-subsystem mono\">", "</div>\n                  <div class=\"log-message mono\">", "</div>\n                </div>\n              "])), formatTime(entry.time), (_a = entry.level) !== null && _a !== void 0 ? _a : "", (_b = entry.level) !== null && _b !== void 0 ? _b : "", (_c = entry.subsystem) !== null && _c !== void 0 ? _c : "", (_d = entry.message) !== null && _d !== void 0 ? _d : entry.raw);
    }));
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
