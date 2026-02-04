"use strict";
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
var lit_1 = require("lit");
var vitest_1 = require("vitest");
var config_1 = require("./config");
(0, vitest_1.describe)("config view", function () {
    var baseProps = function () { return ({
        raw: "{\n}\n",
        originalRaw: "{\n}\n",
        valid: true,
        issues: [],
        loading: false,
        saving: false,
        applying: false,
        updating: false,
        connected: true,
        schema: {
            type: "object",
            properties: {},
        },
        schemaLoading: false,
        uiHints: {},
        formMode: "form",
        formValue: {},
        originalValue: {},
        searchQuery: "",
        activeSection: null,
        activeSubsection: null,
        onRawChange: vitest_1.vi.fn(),
        onFormModeChange: vitest_1.vi.fn(),
        onFormPatch: vitest_1.vi.fn(),
        onSearchChange: vitest_1.vi.fn(),
        onSectionChange: vitest_1.vi.fn(),
        onReload: vitest_1.vi.fn(),
        onSave: vitest_1.vi.fn(),
        onApply: vitest_1.vi.fn(),
        onUpdate: vitest_1.vi.fn(),
        onSubsectionChange: vitest_1.vi.fn(),
    }); };
    (0, vitest_1.it)("allows save when form is unsafe", function () {
        var container = document.createElement("div");
        (0, lit_1.render)((0, config_1.renderConfig)(__assign(__assign({}, baseProps()), { schema: {
                type: "object",
                properties: {
                    mixed: {
                        anyOf: [{ type: "string" }, { type: "object", properties: {} }],
                    },
                },
            }, schemaLoading: false, uiHints: {}, formMode: "form", formValue: { mixed: "x" } })), container);
        var saveButton = Array.from(container.querySelectorAll("button")).find(function (btn) { var _a; return ((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "Save"; });
        (0, vitest_1.expect)(saveButton).not.toBeUndefined();
        (0, vitest_1.expect)(saveButton === null || saveButton === void 0 ? void 0 : saveButton.disabled).toBe(false);
    });
    (0, vitest_1.it)("disables save when schema is missing", function () {
        var container = document.createElement("div");
        (0, lit_1.render)((0, config_1.renderConfig)(__assign(__assign({}, baseProps()), { schema: null, formMode: "form", formValue: { gateway: { mode: "local" } }, originalValue: {} })), container);
        var saveButton = Array.from(container.querySelectorAll("button")).find(function (btn) { var _a; return ((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "Save"; });
        (0, vitest_1.expect)(saveButton).not.toBeUndefined();
        (0, vitest_1.expect)(saveButton === null || saveButton === void 0 ? void 0 : saveButton.disabled).toBe(true);
    });
    (0, vitest_1.it)("disables save and apply when raw is unchanged", function () {
        var container = document.createElement("div");
        (0, lit_1.render)((0, config_1.renderConfig)(__assign(__assign({}, baseProps()), { formMode: "raw", raw: "{\n}\n", originalRaw: "{\n}\n" })), container);
        var saveButton = Array.from(container.querySelectorAll("button")).find(function (btn) { var _a; return ((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "Save"; });
        var applyButton = Array.from(container.querySelectorAll("button")).find(function (btn) { var _a; return ((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "Apply"; });
        (0, vitest_1.expect)(saveButton).not.toBeUndefined();
        (0, vitest_1.expect)(applyButton).not.toBeUndefined();
        (0, vitest_1.expect)(saveButton === null || saveButton === void 0 ? void 0 : saveButton.disabled).toBe(true);
        (0, vitest_1.expect)(applyButton === null || applyButton === void 0 ? void 0 : applyButton.disabled).toBe(true);
    });
    (0, vitest_1.it)("enables save and apply when raw changes", function () {
        var container = document.createElement("div");
        (0, lit_1.render)((0, config_1.renderConfig)(__assign(__assign({}, baseProps()), { formMode: "raw", raw: '{\n  gateway: { mode: "local" }\n}\n', originalRaw: "{\n}\n" })), container);
        var saveButton = Array.from(container.querySelectorAll("button")).find(function (btn) { var _a; return ((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "Save"; });
        var applyButton = Array.from(container.querySelectorAll("button")).find(function (btn) { var _a; return ((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "Apply"; });
        (0, vitest_1.expect)(saveButton).not.toBeUndefined();
        (0, vitest_1.expect)(applyButton).not.toBeUndefined();
        (0, vitest_1.expect)(saveButton === null || saveButton === void 0 ? void 0 : saveButton.disabled).toBe(false);
        (0, vitest_1.expect)(applyButton === null || applyButton === void 0 ? void 0 : applyButton.disabled).toBe(false);
    });
    (0, vitest_1.it)("switches mode via the sidebar toggle", function () {
        var container = document.createElement("div");
        var onFormModeChange = vitest_1.vi.fn();
        (0, lit_1.render)((0, config_1.renderConfig)(__assign(__assign({}, baseProps()), { onFormModeChange: onFormModeChange })), container);
        var btn = Array.from(container.querySelectorAll("button")).find(function (b) { var _a; return ((_a = b.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "Raw"; });
        (0, vitest_1.expect)(btn).toBeTruthy();
        btn === null || btn === void 0 ? void 0 : btn.click();
        (0, vitest_1.expect)(onFormModeChange).toHaveBeenCalledWith("raw");
    });
    (0, vitest_1.it)("switches sections from the sidebar", function () {
        var container = document.createElement("div");
        var onSectionChange = vitest_1.vi.fn();
        (0, lit_1.render)((0, config_1.renderConfig)(__assign(__assign({}, baseProps()), { onSectionChange: onSectionChange, schema: {
                type: "object",
                properties: {
                    gateway: { type: "object", properties: {} },
                    agents: { type: "object", properties: {} },
                },
            } })), container);
        var btn = Array.from(container.querySelectorAll("button")).find(function (b) { var _a; return ((_a = b.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "Gateway"; });
        (0, vitest_1.expect)(btn).toBeTruthy();
        btn === null || btn === void 0 ? void 0 : btn.click();
        (0, vitest_1.expect)(onSectionChange).toHaveBeenCalledWith("gateway");
    });
    (0, vitest_1.it)("wires search input to onSearchChange", function () {
        var container = document.createElement("div");
        var onSearchChange = vitest_1.vi.fn();
        (0, lit_1.render)((0, config_1.renderConfig)(__assign(__assign({}, baseProps()), { onSearchChange: onSearchChange })), container);
        var input = container.querySelector(".config-search__input");
        (0, vitest_1.expect)(input).not.toBeNull();
        if (!input) {
            return;
        }
        input.value = "gateway";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        (0, vitest_1.expect)(onSearchChange).toHaveBeenCalledWith("gateway");
    });
});
