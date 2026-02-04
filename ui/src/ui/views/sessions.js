"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderSessions = renderSessions;
var lit_1 = require("lit");
var format_1 = require("../format");
var navigation_1 = require("../navigation");
var presenter_1 = require("../presenter");
var THINK_LEVELS = ["", "off", "minimal", "low", "medium", "high"];
var BINARY_THINK_LEVELS = ["", "off", "on"];
var VERBOSE_LEVELS = [
    { value: "", label: "inherit" },
    { value: "off", label: "off (explicit)" },
    { value: "on", label: "on" },
];
var REASONING_LEVELS = ["", "off", "on", "stream"];
function normalizeProviderId(provider) {
    if (!provider) {
        return "";
    }
    var normalized = provider.trim().toLowerCase();
    if (normalized === "z.ai" || normalized === "z-ai") {
        return "zai";
    }
    return normalized;
}
function isBinaryThinkingProvider(provider) {
    return normalizeProviderId(provider) === "zai";
}
function resolveThinkLevelOptions(provider) {
    return isBinaryThinkingProvider(provider) ? BINARY_THINK_LEVELS : THINK_LEVELS;
}
function resolveThinkLevelDisplay(value, isBinary) {
    if (!isBinary) {
        return value;
    }
    if (!value || value === "off") {
        return value;
    }
    return "on";
}
function resolveThinkLevelPatchValue(value, isBinary) {
    if (!value) {
        return null;
    }
    if (!isBinary) {
        return value;
    }
    if (value === "on") {
        return "low";
    }
    return value;
}
function renderSessions(props) {
    var _a, _b;
    var rows = (_b = (_a = props.result) === null || _a === void 0 ? void 0 : _a.sessions) !== null && _b !== void 0 ? _b : [];
    return (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    <section class=\"card\">\n      <div class=\"row\" style=\"justify-content: space-between;\">\n        <div>\n          <div class=\"card-title\">Sessions</div>\n          <div class=\"card-sub\">Active session keys and per-session overrides.</div>\n        </div>\n        <button class=\"btn\" ?disabled=", " @click=", ">\n          ", "\n        </button>\n      </div>\n\n      <div class=\"filters\" style=\"margin-top: 14px;\">\n        <label class=\"field\">\n          <span>Active within (minutes)</span>\n          <input\n            .value=", "\n            @input=", "\n          />\n        </label>\n        <label class=\"field\">\n          <span>Limit</span>\n          <input\n            .value=", "\n            @input=", "\n          />\n        </label>\n        <label class=\"field checkbox\">\n          <span>Include global</span>\n          <input\n            type=\"checkbox\"\n            .checked=", "\n            @change=", "\n          />\n        </label>\n        <label class=\"field checkbox\">\n          <span>Include unknown</span>\n          <input\n            type=\"checkbox\"\n            .checked=", "\n            @change=", "\n          />\n        </label>\n      </div>\n\n      ", "\n\n      <div class=\"muted\" style=\"margin-top: 12px;\">\n        ", "\n      </div>\n\n      <div class=\"table\" style=\"margin-top: 16px;\">\n        <div class=\"table-head\">\n          <div>Key</div>\n          <div>Label</div>\n          <div>Kind</div>\n          <div>Updated</div>\n          <div>Tokens</div>\n          <div>Thinking</div>\n          <div>Verbose</div>\n          <div>Reasoning</div>\n          <div>Actions</div>\n        </div>\n        ", "\n      </div>\n    </section>\n  "], ["\n    <section class=\"card\">\n      <div class=\"row\" style=\"justify-content: space-between;\">\n        <div>\n          <div class=\"card-title\">Sessions</div>\n          <div class=\"card-sub\">Active session keys and per-session overrides.</div>\n        </div>\n        <button class=\"btn\" ?disabled=", " @click=", ">\n          ", "\n        </button>\n      </div>\n\n      <div class=\"filters\" style=\"margin-top: 14px;\">\n        <label class=\"field\">\n          <span>Active within (minutes)</span>\n          <input\n            .value=", "\n            @input=", "\n          />\n        </label>\n        <label class=\"field\">\n          <span>Limit</span>\n          <input\n            .value=", "\n            @input=", "\n          />\n        </label>\n        <label class=\"field checkbox\">\n          <span>Include global</span>\n          <input\n            type=\"checkbox\"\n            .checked=", "\n            @change=", "\n          />\n        </label>\n        <label class=\"field checkbox\">\n          <span>Include unknown</span>\n          <input\n            type=\"checkbox\"\n            .checked=", "\n            @change=", "\n          />\n        </label>\n      </div>\n\n      ", "\n\n      <div class=\"muted\" style=\"margin-top: 12px;\">\n        ", "\n      </div>\n\n      <div class=\"table\" style=\"margin-top: 16px;\">\n        <div class=\"table-head\">\n          <div>Key</div>\n          <div>Label</div>\n          <div>Kind</div>\n          <div>Updated</div>\n          <div>Tokens</div>\n          <div>Thinking</div>\n          <div>Verbose</div>\n          <div>Reasoning</div>\n          <div>Actions</div>\n        </div>\n        ", "\n      </div>\n    </section>\n  "])), props.loading, props.onRefresh, props.loading ? "Loading…" : "Refresh", props.activeMinutes, function (e) {
        return props.onFiltersChange({
            activeMinutes: e.target.value,
            limit: props.limit,
            includeGlobal: props.includeGlobal,
            includeUnknown: props.includeUnknown,
        });
    }, props.limit, function (e) {
        return props.onFiltersChange({
            activeMinutes: props.activeMinutes,
            limit: e.target.value,
            includeGlobal: props.includeGlobal,
            includeUnknown: props.includeUnknown,
        });
    }, props.includeGlobal, function (e) {
        return props.onFiltersChange({
            activeMinutes: props.activeMinutes,
            limit: props.limit,
            includeGlobal: e.target.checked,
            includeUnknown: props.includeUnknown,
        });
    }, props.includeUnknown, function (e) {
        return props.onFiltersChange({
            activeMinutes: props.activeMinutes,
            limit: props.limit,
            includeGlobal: props.includeGlobal,
            includeUnknown: e.target.checked,
        });
    }, props.error
        ? (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<div class=\"callout danger\" style=\"margin-top: 12px;\">", "</div>"], ["<div class=\"callout danger\" style=\"margin-top: 12px;\">", "</div>"])), props.error) : lit_1.nothing, props.result ? "Store: ".concat(props.result.path) : "", rows.length === 0
        ? (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n                <div class=\"muted\">No sessions found.</div>\n              "], ["\n                <div class=\"muted\">No sessions found.</div>\n              "]))) : rows.map(function (row) {
        return renderRow(row, props.basePath, props.onPatch, props.onDelete, props.loading);
    }));
}
function renderRow(row, basePath, onPatch, onDelete, disabled) {
    var _a, _b, _c, _d, _e;
    var updated = row.updatedAt ? (0, format_1.formatAgo)(row.updatedAt) : "n/a";
    var rawThinking = (_a = row.thinkingLevel) !== null && _a !== void 0 ? _a : "";
    var isBinaryThinking = isBinaryThinkingProvider(row.modelProvider);
    var thinking = resolveThinkLevelDisplay(rawThinking, isBinaryThinking);
    var thinkLevels = resolveThinkLevelOptions(row.modelProvider);
    var verbose = (_b = row.verboseLevel) !== null && _b !== void 0 ? _b : "";
    var reasoning = (_c = row.reasoningLevel) !== null && _c !== void 0 ? _c : "";
    var displayName = (_d = row.displayName) !== null && _d !== void 0 ? _d : row.key;
    var canLink = row.kind !== "global";
    var chatUrl = canLink
        ? "".concat((0, navigation_1.pathForTab)("chat", basePath), "?session=").concat(encodeURIComponent(row.key))
        : null;
    return (0, lit_1.html)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n    <div class=\"table-row\">\n      <div class=\"mono\">", "</div>\n      <div>\n        <input\n          .value=", "\n          ?disabled=", "\n          placeholder=\"(optional)\"\n          @change=", "\n        />\n      </div>\n      <div>", "</div>\n      <div>", "</div>\n      <div>", "</div>\n      <div>\n        <select\n          .value=", "\n          ?disabled=", "\n          @change=", "\n        >\n          ", "\n        </select>\n      </div>\n      <div>\n        <select\n          .value=", "\n          ?disabled=", "\n          @change=", "\n        >\n          ", "\n        </select>\n      </div>\n      <div>\n        <select\n          .value=", "\n          ?disabled=", "\n          @change=", "\n        >\n          ", "\n        </select>\n      </div>\n      <div>\n        <button class=\"btn danger\" ?disabled=", " @click=", ">\n          Delete\n        </button>\n      </div>\n    </div>\n  "], ["\n    <div class=\"table-row\">\n      <div class=\"mono\">", "</div>\n      <div>\n        <input\n          .value=", "\n          ?disabled=", "\n          placeholder=\"(optional)\"\n          @change=", "\n        />\n      </div>\n      <div>", "</div>\n      <div>", "</div>\n      <div>", "</div>\n      <div>\n        <select\n          .value=", "\n          ?disabled=", "\n          @change=", "\n        >\n          ", "\n        </select>\n      </div>\n      <div>\n        <select\n          .value=", "\n          ?disabled=", "\n          @change=", "\n        >\n          ", "\n        </select>\n      </div>\n      <div>\n        <select\n          .value=", "\n          ?disabled=", "\n          @change=", "\n        >\n          ", "\n        </select>\n      </div>\n      <div>\n        <button class=\"btn danger\" ?disabled=", " @click=", ">\n          Delete\n        </button>\n      </div>\n    </div>\n  "])), canLink ? (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["<a href=", " class=\"session-link\">", "</a>"], ["<a href=", " class=\"session-link\">", "</a>"])), chatUrl, displayName) : displayName, (_e = row.label) !== null && _e !== void 0 ? _e : "", disabled, function (e) {
        var value = e.target.value.trim();
        onPatch(row.key, { label: value || null });
    }, row.kind, updated, (0, presenter_1.formatSessionTokens)(row), thinking, disabled, function (e) {
        var value = e.target.value;
        onPatch(row.key, {
            thinkingLevel: resolveThinkLevelPatchValue(value, isBinaryThinking),
        });
    }, thinkLevels.map(function (level) { return (0, lit_1.html)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["<option value=", ">", "</option>"], ["<option value=", ">", "</option>"])), level, level || "inherit"); }), verbose, disabled, function (e) {
        var value = e.target.value;
        onPatch(row.key, { verboseLevel: value || null });
    }, VERBOSE_LEVELS.map(function (level) { return (0, lit_1.html)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["<option value=", ">", "</option>"], ["<option value=", ">", "</option>"])), level.value, level.label); }), reasoning, disabled, function (e) {
        var value = e.target.value;
        onPatch(row.key, { reasoningLevel: value || null });
    }, REASONING_LEVELS.map(function (level) { return (0, lit_1.html)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["<option value=", ">", "</option>"], ["<option value=", ">", "</option>"])), level, level || "inherit"); }), disabled, function () { return onDelete(row.key); });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
