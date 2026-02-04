"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.renderNode = renderNode;
var lit_1 = require("lit");
var config_form_shared_1 = require("./config-form.shared");
var META_KEYS = new Set(["title", "description", "default", "nullable"]);
function isAnySchema(schema) {
    var keys = Object.keys(schema !== null && schema !== void 0 ? schema : {}).filter(function (key) { return !META_KEYS.has(key); });
    return keys.length === 0;
}
function jsonValue(value) {
    var _a;
    if (value === undefined) {
        return "";
    }
    try {
        return (_a = JSON.stringify(value, null, 2)) !== null && _a !== void 0 ? _a : "";
    }
    catch (_b) {
        return "";
    }
}
// SVG Icons as template literals
var icons = {
    chevronDown: (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <svg\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      stroke-width=\"2\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <polyline points=\"6 9 12 15 18 9\"></polyline>\n    </svg>\n  "], ["\n    <svg\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      stroke-width=\"2\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <polyline points=\"6 9 12 15 18 9\"></polyline>\n    </svg>\n  "]))),
    plus: (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    <svg\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      stroke-width=\"2\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"></line>\n      <line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line>\n    </svg>\n  "], ["\n    <svg\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      stroke-width=\"2\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"></line>\n      <line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line>\n    </svg>\n  "]))),
    minus: (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    <svg\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      stroke-width=\"2\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line>\n    </svg>\n  "], ["\n    <svg\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      stroke-width=\"2\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line>\n    </svg>\n  "]))),
    trash: (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    <svg\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      stroke-width=\"2\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <polyline points=\"3 6 5 6 21 6\"></polyline>\n      <path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path>\n    </svg>\n  "], ["\n    <svg\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      stroke-width=\"2\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <polyline points=\"3 6 5 6 21 6\"></polyline>\n      <path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path>\n    </svg>\n  "]))),
    edit: (0, lit_1.html)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    <svg\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      stroke-width=\"2\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <path d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"></path>\n      <path d=\"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z\"></path>\n    </svg>\n  "], ["\n    <svg\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      stroke-width=\"2\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <path d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"></path>\n      <path d=\"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z\"></path>\n    </svg>\n  "]))),
};
function renderNode(params) {
    var _a, _b, _c, _d, _e, _f;
    var schema = params.schema, value = params.value, path = params.path, hints = params.hints, unsupported = params.unsupported, disabled = params.disabled, onPatch = params.onPatch;
    var showLabel = (_a = params.showLabel) !== null && _a !== void 0 ? _a : true;
    var type = (0, config_form_shared_1.schemaType)(schema);
    var hint = (0, config_form_shared_1.hintForPath)(path, hints);
    var label = (_c = (_b = hint === null || hint === void 0 ? void 0 : hint.label) !== null && _b !== void 0 ? _b : schema.title) !== null && _c !== void 0 ? _c : (0, config_form_shared_1.humanize)(String(path.at(-1)));
    var help = (_d = hint === null || hint === void 0 ? void 0 : hint.help) !== null && _d !== void 0 ? _d : schema.description;
    var key = (0, config_form_shared_1.pathKey)(path);
    if (unsupported.has(key)) {
        return (0, lit_1.html)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["<div class=\"cfg-field cfg-field--error\">\n      <div class=\"cfg-field__label\">", "</div>\n      <div class=\"cfg-field__error\">Unsupported schema node. Use Raw mode.</div>\n    </div>"], ["<div class=\"cfg-field cfg-field--error\">\n      <div class=\"cfg-field__label\">", "</div>\n      <div class=\"cfg-field__error\">Unsupported schema node. Use Raw mode.</div>\n    </div>"])), label);
    }
    // Handle anyOf/oneOf unions
    if (schema.anyOf || schema.oneOf) {
        var variants = (_f = (_e = schema.anyOf) !== null && _e !== void 0 ? _e : schema.oneOf) !== null && _f !== void 0 ? _f : [];
        var nonNull = variants.filter(function (v) { return !(v.type === "null" || (Array.isArray(v.type) && v.type.includes("null"))); });
        if (nonNull.length === 1) {
            return renderNode(__assign(__assign({}, params), { schema: nonNull[0] }));
        }
        // Check if it's a set of literal values (enum-like)
        var extractLiteral = function (v) {
            if (v.const !== undefined) {
                return v.const;
            }
            if (v.enum && v.enum.length === 1) {
                return v.enum[0];
            }
            return undefined;
        };
        var literals = nonNull.map(extractLiteral);
        var allLiterals = literals.every(function (v) { return v !== undefined; });
        if (allLiterals && literals.length > 0 && literals.length <= 5) {
            // Use segmented control for small sets
            var resolvedValue_1 = value !== null && value !== void 0 ? value : schema.default;
            return (0, lit_1.html)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n        <div class=\"cfg-field\">\n          ", "\n          ", "\n          <div class=\"cfg-segmented\">\n            ", "\n          </div>\n        </div>\n      "], ["\n        <div class=\"cfg-field\">\n          ", "\n          ", "\n          <div class=\"cfg-segmented\">\n            ", "\n          </div>\n        </div>\n      "])), showLabel ? (0, lit_1.html)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["<label class=\"cfg-field__label\">", "</label>"], ["<label class=\"cfg-field__label\">", "</label>"])), label) : lit_1.nothing, help ? (0, lit_1.html)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["<div class=\"cfg-field__help\">", "</div>"], ["<div class=\"cfg-field__help\">", "</div>"])), help) : lit_1.nothing, literals.map(function (lit) { return (0, lit_1.html)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n              <button\n                type=\"button\"\n                class=\"cfg-segmented__btn ", "\"\n                ?disabled=", "\n                @click=", "\n              >\n                ", "\n              </button>\n            "], ["\n              <button\n                type=\"button\"\n                class=\"cfg-segmented__btn "
                // oxlint-disable typescript/no-base-to-string
                , "\"\n                ?disabled=", "\n                @click=", "\n              >\n                "
                // oxlint-disable typescript/no-base-to-string
                , "\n              </button>\n            "])), 
            // oxlint-disable typescript/no-base-to-string
            lit === resolvedValue_1 || String(lit) === String(resolvedValue_1) ? "active" : "", disabled, function () { return onPatch(path, lit); }, 
            // oxlint-disable typescript/no-base-to-string
            String(lit)); }));
        }
        if (allLiterals && literals.length > 5) {
            // Use dropdown for larger sets
            return renderSelect(__assign(__assign({}, params), { options: literals, value: value !== null && value !== void 0 ? value : schema.default }));
        }
        // Handle mixed primitive types
        var primitiveTypes = new Set(nonNull.map(function (variant) { return (0, config_form_shared_1.schemaType)(variant); }).filter(Boolean));
        var normalizedTypes = new Set(__spreadArray([], primitiveTypes, true).map(function (v) { return (v === "integer" ? "number" : v); }));
        if (__spreadArray([], normalizedTypes, true).every(function (v) { return ["string", "number", "boolean"].includes(v); })) {
            var hasString = normalizedTypes.has("string");
            var hasNumber = normalizedTypes.has("number");
            var hasBoolean = normalizedTypes.has("boolean");
            if (hasBoolean && normalizedTypes.size === 1) {
                return renderNode(__assign(__assign({}, params), { schema: __assign(__assign({}, schema), { type: "boolean", anyOf: undefined, oneOf: undefined }) }));
            }
            if (hasString || hasNumber) {
                return renderTextInput(__assign(__assign({}, params), { inputType: hasNumber && !hasString ? "number" : "text" }));
            }
        }
    }
    // Enum - use segmented for small, dropdown for large
    if (schema.enum) {
        var options = schema.enum;
        if (options.length <= 5) {
            var resolvedValue_2 = value !== null && value !== void 0 ? value : schema.default;
            return (0, lit_1.html)(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n        <div class=\"cfg-field\">\n          ", "\n          ", "\n          <div class=\"cfg-segmented\">\n            ", "\n          </div>\n        </div>\n      "], ["\n        <div class=\"cfg-field\">\n          ", "\n          ", "\n          <div class=\"cfg-segmented\">\n            ", "\n          </div>\n        </div>\n      "])), showLabel ? (0, lit_1.html)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["<label class=\"cfg-field__label\">", "</label>"], ["<label class=\"cfg-field__label\">", "</label>"])), label) : lit_1.nothing, help ? (0, lit_1.html)(templateObject_12 || (templateObject_12 = __makeTemplateObject(["<div class=\"cfg-field__help\">", "</div>"], ["<div class=\"cfg-field__help\">", "</div>"])), help) : lit_1.nothing, options.map(function (opt) { return (0, lit_1.html)(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n              <button\n                type=\"button\"\n                class=\"cfg-segmented__btn ", "\"\n                ?disabled=", "\n                @click=", "\n              >\n                ", "\n              </button>\n            "], ["\n              <button\n                type=\"button\"\n                class=\"cfg-segmented__btn ", "\"\n                ?disabled=", "\n                @click=", "\n              >\n                ", "\n              </button>\n            "])), opt === resolvedValue_2 || String(opt) === String(resolvedValue_2) ? "active" : "", disabled, function () { return onPatch(path, opt); }, String(opt)); }));
        }
        return renderSelect(__assign(__assign({}, params), { options: options, value: value !== null && value !== void 0 ? value : schema.default }));
    }
    // Object type - collapsible section
    if (type === "object") {
        return renderObject(params);
    }
    // Array type
    if (type === "array") {
        return renderArray(params);
    }
    // Boolean - toggle row
    if (type === "boolean") {
        var displayValue = typeof value === "boolean"
            ? value
            : typeof schema.default === "boolean"
                ? schema.default
                : false;
        return (0, lit_1.html)(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n      <label class=\"cfg-toggle-row ", "\">\n        <div class=\"cfg-toggle-row__content\">\n          <span class=\"cfg-toggle-row__label\">", "</span>\n          ", "\n        </div>\n        <div class=\"cfg-toggle\">\n          <input\n            type=\"checkbox\"\n            .checked=", "\n            ?disabled=", "\n            @change=", "\n          />\n          <span class=\"cfg-toggle__track\"></span>\n        </div>\n      </label>\n    "], ["\n      <label class=\"cfg-toggle-row ", "\">\n        <div class=\"cfg-toggle-row__content\">\n          <span class=\"cfg-toggle-row__label\">", "</span>\n          ", "\n        </div>\n        <div class=\"cfg-toggle\">\n          <input\n            type=\"checkbox\"\n            .checked=", "\n            ?disabled=", "\n            @change=", "\n          />\n          <span class=\"cfg-toggle__track\"></span>\n        </div>\n      </label>\n    "])), disabled ? "disabled" : "", label, help ? (0, lit_1.html)(templateObject_15 || (templateObject_15 = __makeTemplateObject(["<span class=\"cfg-toggle-row__help\">", "</span>"], ["<span class=\"cfg-toggle-row__help\">", "</span>"])), help) : lit_1.nothing, displayValue, disabled, function (e) { return onPatch(path, e.target.checked); });
    }
    // Number/Integer
    if (type === "number" || type === "integer") {
        return renderNumberInput(params);
    }
    // String
    if (type === "string") {
        return renderTextInput(__assign(__assign({}, params), { inputType: "text" }));
    }
    // Fallback
    return (0, lit_1.html)(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n    <div class=\"cfg-field cfg-field--error\">\n      <div class=\"cfg-field__label\">", "</div>\n      <div class=\"cfg-field__error\">Unsupported type: ", ". Use Raw mode.</div>\n    </div>\n  "], ["\n    <div class=\"cfg-field cfg-field--error\">\n      <div class=\"cfg-field__label\">", "</div>\n      <div class=\"cfg-field__error\">Unsupported type: ", ". Use Raw mode.</div>\n    </div>\n  "])), label, type);
}
function renderTextInput(params) {
    var _a, _b, _c, _d, _e, _f;
    var schema = params.schema, value = params.value, path = params.path, hints = params.hints, disabled = params.disabled, onPatch = params.onPatch, inputType = params.inputType;
    var showLabel = (_a = params.showLabel) !== null && _a !== void 0 ? _a : true;
    var hint = (0, config_form_shared_1.hintForPath)(path, hints);
    var label = (_c = (_b = hint === null || hint === void 0 ? void 0 : hint.label) !== null && _b !== void 0 ? _b : schema.title) !== null && _c !== void 0 ? _c : (0, config_form_shared_1.humanize)(String(path.at(-1)));
    var help = (_d = hint === null || hint === void 0 ? void 0 : hint.help) !== null && _d !== void 0 ? _d : schema.description;
    var isSensitive = (_e = hint === null || hint === void 0 ? void 0 : hint.sensitive) !== null && _e !== void 0 ? _e : (0, config_form_shared_1.isSensitivePath)(path);
    var placeholder = (_f = hint === null || hint === void 0 ? void 0 : hint.placeholder) !== null && _f !== void 0 ? _f : 
    // oxlint-disable typescript/no-base-to-string
    (isSensitive
        ? "••••"
        : schema.default !== undefined
            ? "Default: ".concat(String(schema.default))
            : "");
    var displayValue = value !== null && value !== void 0 ? value : "";
    return (0, lit_1.html)(templateObject_21 || (templateObject_21 = __makeTemplateObject(["\n    <div class=\"cfg-field\">\n      ", "\n      ", "\n      <div class=\"cfg-input-wrap\">\n        <input\n          type=", "\n          class=\"cfg-input\"\n          placeholder=", "\n          .value=", "\n          ?disabled=", "\n          @input=", "\n          @change=", "\n        />\n        ", "\n      </div>\n    </div>\n  "], ["\n    <div class=\"cfg-field\">\n      ", "\n      ", "\n      <div class=\"cfg-input-wrap\">\n        <input\n          type=", "\n          class=\"cfg-input\"\n          placeholder=", "\n          .value=", "\n          ?disabled=", "\n          @input=", "\n          @change=", "\n        />\n        ", "\n      </div>\n    </div>\n  "])), showLabel ? (0, lit_1.html)(templateObject_18 || (templateObject_18 = __makeTemplateObject(["<label class=\"cfg-field__label\">", "</label>"], ["<label class=\"cfg-field__label\">", "</label>"])), label) : lit_1.nothing, help ? (0, lit_1.html)(templateObject_19 || (templateObject_19 = __makeTemplateObject(["<div class=\"cfg-field__help\">", "</div>"], ["<div class=\"cfg-field__help\">", "</div>"])), help) : lit_1.nothing, isSensitive ? "password" : inputType, placeholder, displayValue == null ? "" : String(displayValue), disabled, function (e) {
        var raw = e.target.value;
        if (inputType === "number") {
            if (raw.trim() === "") {
                onPatch(path, undefined);
                return;
            }
            var parsed = Number(raw);
            onPatch(path, Number.isNaN(parsed) ? raw : parsed);
            return;
        }
        onPatch(path, raw);
    }, function (e) {
        if (inputType === "number") {
            return;
        }
        var raw = e.target.value;
        onPatch(path, raw.trim());
    }, schema.default !== undefined
        ? (0, lit_1.html)(templateObject_20 || (templateObject_20 = __makeTemplateObject(["\n          <button\n            type=\"button\"\n            class=\"cfg-input__reset\"\n            title=\"Reset to default\"\n            ?disabled=", "\n            @click=", "\n          >\u21BA</button>\n        "], ["\n          <button\n            type=\"button\"\n            class=\"cfg-input__reset\"\n            title=\"Reset to default\"\n            ?disabled=", "\n            @click=", "\n          >\u21BA</button>\n        "])), disabled, function () { return onPatch(path, schema.default); }) : lit_1.nothing);
}
function renderNumberInput(params) {
    var _a, _b, _c, _d, _e;
    var schema = params.schema, value = params.value, path = params.path, hints = params.hints, disabled = params.disabled, onPatch = params.onPatch;
    var showLabel = (_a = params.showLabel) !== null && _a !== void 0 ? _a : true;
    var hint = (0, config_form_shared_1.hintForPath)(path, hints);
    var label = (_c = (_b = hint === null || hint === void 0 ? void 0 : hint.label) !== null && _b !== void 0 ? _b : schema.title) !== null && _c !== void 0 ? _c : (0, config_form_shared_1.humanize)(String(path.at(-1)));
    var help = (_d = hint === null || hint === void 0 ? void 0 : hint.help) !== null && _d !== void 0 ? _d : schema.description;
    var displayValue = (_e = value !== null && value !== void 0 ? value : schema.default) !== null && _e !== void 0 ? _e : "";
    var numValue = typeof displayValue === "number" ? displayValue : 0;
    return (0, lit_1.html)(templateObject_24 || (templateObject_24 = __makeTemplateObject(["\n    <div class=\"cfg-field\">\n      ", "\n      ", "\n      <div class=\"cfg-number\">\n        <button\n          type=\"button\"\n          class=\"cfg-number__btn\"\n          ?disabled=", "\n          @click=", "\n        >\u2212</button>\n        <input\n          type=\"number\"\n          class=\"cfg-number__input\"\n          .value=", "\n          ?disabled=", "\n          @input=", "\n        />\n        <button\n          type=\"button\"\n          class=\"cfg-number__btn\"\n          ?disabled=", "\n          @click=", "\n        >+</button>\n      </div>\n    </div>\n  "], ["\n    <div class=\"cfg-field\">\n      ", "\n      ", "\n      <div class=\"cfg-number\">\n        <button\n          type=\"button\"\n          class=\"cfg-number__btn\"\n          ?disabled=", "\n          @click=", "\n        >\u2212</button>\n        <input\n          type=\"number\"\n          class=\"cfg-number__input\"\n          .value=", "\n          ?disabled=", "\n          @input=", "\n        />\n        <button\n          type=\"button\"\n          class=\"cfg-number__btn\"\n          ?disabled=", "\n          @click=", "\n        >+</button>\n      </div>\n    </div>\n  "])), showLabel ? (0, lit_1.html)(templateObject_22 || (templateObject_22 = __makeTemplateObject(["<label class=\"cfg-field__label\">", "</label>"], ["<label class=\"cfg-field__label\">", "</label>"])), label) : lit_1.nothing, help ? (0, lit_1.html)(templateObject_23 || (templateObject_23 = __makeTemplateObject(["<div class=\"cfg-field__help\">", "</div>"], ["<div class=\"cfg-field__help\">", "</div>"])), help) : lit_1.nothing, disabled, function () { return onPatch(path, numValue - 1); }, displayValue == null ? "" : String(displayValue), disabled, function (e) {
        var raw = e.target.value;
        var parsed = raw === "" ? undefined : Number(raw);
        onPatch(path, parsed);
    }, disabled, function () { return onPatch(path, numValue + 1); });
}
function renderSelect(params) {
    var _a, _b, _c, _d;
    var schema = params.schema, value = params.value, path = params.path, hints = params.hints, disabled = params.disabled, options = params.options, onPatch = params.onPatch;
    var showLabel = (_a = params.showLabel) !== null && _a !== void 0 ? _a : true;
    var hint = (0, config_form_shared_1.hintForPath)(path, hints);
    var label = (_c = (_b = hint === null || hint === void 0 ? void 0 : hint.label) !== null && _b !== void 0 ? _b : schema.title) !== null && _c !== void 0 ? _c : (0, config_form_shared_1.humanize)(String(path.at(-1)));
    var help = (_d = hint === null || hint === void 0 ? void 0 : hint.help) !== null && _d !== void 0 ? _d : schema.description;
    var resolvedValue = value !== null && value !== void 0 ? value : schema.default;
    var currentIndex = options.findIndex(function (opt) { return opt === resolvedValue || String(opt) === String(resolvedValue); });
    var unset = "__unset__";
    return (0, lit_1.html)(templateObject_28 || (templateObject_28 = __makeTemplateObject(["\n    <div class=\"cfg-field\">\n      ", "\n      ", "\n      <select\n        class=\"cfg-select\"\n        ?disabled=", "\n        .value=", "\n        @change=", "\n      >\n        <option value=", ">Select...</option>\n        ", "\n      </select>\n    </div>\n  "], ["\n    <div class=\"cfg-field\">\n      ", "\n      ", "\n      <select\n        class=\"cfg-select\"\n        ?disabled=", "\n        .value=", "\n        @change=", "\n      >\n        <option value=", ">Select...</option>\n        ", "\n      </select>\n    </div>\n  "])), showLabel ? (0, lit_1.html)(templateObject_25 || (templateObject_25 = __makeTemplateObject(["<label class=\"cfg-field__label\">", "</label>"], ["<label class=\"cfg-field__label\">", "</label>"])), label) : lit_1.nothing, help ? (0, lit_1.html)(templateObject_26 || (templateObject_26 = __makeTemplateObject(["<div class=\"cfg-field__help\">", "</div>"], ["<div class=\"cfg-field__help\">", "</div>"])), help) : lit_1.nothing, disabled, currentIndex >= 0 ? String(currentIndex) : unset, function (e) {
        var val = e.target.value;
        onPatch(path, val === unset ? undefined : options[Number(val)]);
    }, unset, options.map(function (opt, idx) { return (0, lit_1.html)(templateObject_27 || (templateObject_27 = __makeTemplateObject(["\n          <option value=", ">", "</option>\n        "], ["\n          <option value=", ">", "</option>\n        "])), String(idx), String(opt)); }));
}
function renderObject(params) {
    var _a, _b, _c, _d;
    var schema = params.schema, value = params.value, path = params.path, hints = params.hints, unsupported = params.unsupported, disabled = params.disabled, onPatch = params.onPatch;
    var hint = (0, config_form_shared_1.hintForPath)(path, hints);
    var label = (_b = (_a = hint === null || hint === void 0 ? void 0 : hint.label) !== null && _a !== void 0 ? _a : schema.title) !== null && _b !== void 0 ? _b : (0, config_form_shared_1.humanize)(String(path.at(-1)));
    var help = (_c = hint === null || hint === void 0 ? void 0 : hint.help) !== null && _c !== void 0 ? _c : schema.description;
    var fallback = value !== null && value !== void 0 ? value : schema.default;
    var obj = fallback && typeof fallback === "object" && !Array.isArray(fallback)
        ? fallback
        : {};
    var props = (_d = schema.properties) !== null && _d !== void 0 ? _d : {};
    var entries = Object.entries(props);
    // Sort by hint order
    var sorted = entries.toSorted(function (a, b) {
        var _a, _b, _c, _d;
        var orderA = (_b = (_a = (0, config_form_shared_1.hintForPath)(__spreadArray(__spreadArray([], path, true), [a[0]], false), hints)) === null || _a === void 0 ? void 0 : _a.order) !== null && _b !== void 0 ? _b : 0;
        var orderB = (_d = (_c = (0, config_form_shared_1.hintForPath)(__spreadArray(__spreadArray([], path, true), [b[0]], false), hints)) === null || _c === void 0 ? void 0 : _c.order) !== null && _d !== void 0 ? _d : 0;
        if (orderA !== orderB) {
            return orderA - orderB;
        }
        return a[0].localeCompare(b[0]);
    });
    var reserved = new Set(Object.keys(props));
    var additional = schema.additionalProperties;
    var allowExtra = Boolean(additional) && typeof additional === "object";
    // For top-level, don't wrap in collapsible
    if (path.length === 1) {
        return (0, lit_1.html)(templateObject_29 || (templateObject_29 = __makeTemplateObject(["\n      <div class=\"cfg-fields\">\n        ", "\n        ", "\n      </div>\n    "], ["\n      <div class=\"cfg-fields\">\n        ", "\n        ", "\n      </div>\n    "])), sorted.map(function (_a) {
            var propKey = _a[0], node = _a[1];
            return renderNode({
                schema: node,
                value: obj[propKey],
                path: __spreadArray(__spreadArray([], path, true), [propKey], false),
                hints: hints,
                unsupported: unsupported,
                disabled: disabled,
                onPatch: onPatch,
            });
        }), allowExtra
            ? renderMapField({
                schema: additional,
                value: obj,
                path: path,
                hints: hints,
                unsupported: unsupported,
                disabled: disabled,
                reservedKeys: reserved,
                onPatch: onPatch,
            })
            : lit_1.nothing);
    }
    // Nested objects get collapsible treatment
    return (0, lit_1.html)(templateObject_31 || (templateObject_31 = __makeTemplateObject(["\n    <details class=\"cfg-object\" open>\n      <summary class=\"cfg-object__header\">\n        <span class=\"cfg-object__title\">", "</span>\n        <span class=\"cfg-object__chevron\">", "</span>\n      </summary>\n      ", "\n      <div class=\"cfg-object__content\">\n        ", "\n        ", "\n      </div>\n    </details>\n  "], ["\n    <details class=\"cfg-object\" open>\n      <summary class=\"cfg-object__header\">\n        <span class=\"cfg-object__title\">", "</span>\n        <span class=\"cfg-object__chevron\">", "</span>\n      </summary>\n      ", "\n      <div class=\"cfg-object__content\">\n        ", "\n        ", "\n      </div>\n    </details>\n  "])), label, icons.chevronDown, help ? (0, lit_1.html)(templateObject_30 || (templateObject_30 = __makeTemplateObject(["<div class=\"cfg-object__help\">", "</div>"], ["<div class=\"cfg-object__help\">", "</div>"])), help) : lit_1.nothing, sorted.map(function (_a) {
        var propKey = _a[0], node = _a[1];
        return renderNode({
            schema: node,
            value: obj[propKey],
            path: __spreadArray(__spreadArray([], path, true), [propKey], false),
            hints: hints,
            unsupported: unsupported,
            disabled: disabled,
            onPatch: onPatch,
        });
    }), allowExtra
        ? renderMapField({
            schema: additional,
            value: obj,
            path: path,
            hints: hints,
            unsupported: unsupported,
            disabled: disabled,
            reservedKeys: reserved,
            onPatch: onPatch,
        })
        : lit_1.nothing);
}
function renderArray(params) {
    var _a, _b, _c, _d;
    var schema = params.schema, value = params.value, path = params.path, hints = params.hints, unsupported = params.unsupported, disabled = params.disabled, onPatch = params.onPatch;
    var showLabel = (_a = params.showLabel) !== null && _a !== void 0 ? _a : true;
    var hint = (0, config_form_shared_1.hintForPath)(path, hints);
    var label = (_c = (_b = hint === null || hint === void 0 ? void 0 : hint.label) !== null && _b !== void 0 ? _b : schema.title) !== null && _c !== void 0 ? _c : (0, config_form_shared_1.humanize)(String(path.at(-1)));
    var help = (_d = hint === null || hint === void 0 ? void 0 : hint.help) !== null && _d !== void 0 ? _d : schema.description;
    var itemsSchema = Array.isArray(schema.items) ? schema.items[0] : schema.items;
    if (!itemsSchema) {
        return (0, lit_1.html)(templateObject_32 || (templateObject_32 = __makeTemplateObject(["\n      <div class=\"cfg-field cfg-field--error\">\n        <div class=\"cfg-field__label\">", "</div>\n        <div class=\"cfg-field__error\">Unsupported array schema. Use Raw mode.</div>\n      </div>\n    "], ["\n      <div class=\"cfg-field cfg-field--error\">\n        <div class=\"cfg-field__label\">", "</div>\n        <div class=\"cfg-field__error\">Unsupported array schema. Use Raw mode.</div>\n      </div>\n    "])), label);
    }
    var arr = Array.isArray(value) ? value : Array.isArray(schema.default) ? schema.default : [];
    return (0, lit_1.html)(templateObject_38 || (templateObject_38 = __makeTemplateObject(["\n    <div class=\"cfg-array\">\n      <div class=\"cfg-array__header\">\n        ", "\n        <span class=\"cfg-array__count\">", " item", "</span>\n        <button\n          type=\"button\"\n          class=\"cfg-array__add\"\n          ?disabled=", "\n          @click=", "\n        >\n          <span class=\"cfg-array__add-icon\">", "</span>\n          Add\n        </button>\n      </div>\n      ", "\n\n      ", "\n    </div>\n  "], ["\n    <div class=\"cfg-array\">\n      <div class=\"cfg-array__header\">\n        ", "\n        <span class=\"cfg-array__count\">", " item", "</span>\n        <button\n          type=\"button\"\n          class=\"cfg-array__add\"\n          ?disabled=", "\n          @click=", "\n        >\n          <span class=\"cfg-array__add-icon\">", "</span>\n          Add\n        </button>\n      </div>\n      ", "\n\n      ", "\n    </div>\n  "])), showLabel ? (0, lit_1.html)(templateObject_33 || (templateObject_33 = __makeTemplateObject(["<span class=\"cfg-array__label\">", "</span>"], ["<span class=\"cfg-array__label\">", "</span>"])), label) : lit_1.nothing, arr.length, arr.length !== 1 ? "s" : "", disabled, function () {
        var next = __spreadArray(__spreadArray([], arr, true), [(0, config_form_shared_1.defaultValue)(itemsSchema)], false);
        onPatch(path, next);
    }, icons.plus, help ? (0, lit_1.html)(templateObject_34 || (templateObject_34 = __makeTemplateObject(["<div class=\"cfg-array__help\">", "</div>"], ["<div class=\"cfg-array__help\">", "</div>"])), help) : lit_1.nothing, arr.length === 0
        ? (0, lit_1.html)(templateObject_35 || (templateObject_35 = __makeTemplateObject(["\n              <div class=\"cfg-array__empty\">No items yet. Click \"Add\" to create one.</div>\n            "], ["\n              <div class=\"cfg-array__empty\">No items yet. Click \"Add\" to create one.</div>\n            "]))) : (0, lit_1.html)(templateObject_37 || (templateObject_37 = __makeTemplateObject(["\n        <div class=\"cfg-array__items\">\n          ", "\n        </div>\n      "], ["\n        <div class=\"cfg-array__items\">\n          ", "\n        </div>\n      "])), arr.map(function (item, idx) { return (0, lit_1.html)(templateObject_36 || (templateObject_36 = __makeTemplateObject(["\n            <div class=\"cfg-array__item\">\n              <div class=\"cfg-array__item-header\">\n                <span class=\"cfg-array__item-index\">#", "</span>\n                <button\n                  type=\"button\"\n                  class=\"cfg-array__item-remove\"\n                  title=\"Remove item\"\n                  ?disabled=", "\n                  @click=", "\n                >\n                  ", "\n                </button>\n              </div>\n              <div class=\"cfg-array__item-content\">\n                ", "\n              </div>\n            </div>\n          "], ["\n            <div class=\"cfg-array__item\">\n              <div class=\"cfg-array__item-header\">\n                <span class=\"cfg-array__item-index\">#", "</span>\n                <button\n                  type=\"button\"\n                  class=\"cfg-array__item-remove\"\n                  title=\"Remove item\"\n                  ?disabled=", "\n                  @click=", "\n                >\n                  ", "\n                </button>\n              </div>\n              <div class=\"cfg-array__item-content\">\n                ", "\n              </div>\n            </div>\n          "])), idx + 1, disabled, function () {
        var next = __spreadArray([], arr, true);
        next.splice(idx, 1);
        onPatch(path, next);
    }, icons.trash, renderNode({
        schema: itemsSchema,
        value: item,
        path: __spreadArray(__spreadArray([], path, true), [idx], false),
        hints: hints,
        unsupported: unsupported,
        disabled: disabled,
        showLabel: false,
        onPatch: onPatch,
    })); })));
}
function renderMapField(params) {
    var schema = params.schema, value = params.value, path = params.path, hints = params.hints, unsupported = params.unsupported, disabled = params.disabled, reservedKeys = params.reservedKeys, onPatch = params.onPatch;
    var anySchema = isAnySchema(schema);
    var entries = Object.entries(value !== null && value !== void 0 ? value : {}).filter(function (_a) {
        var key = _a[0];
        return !reservedKeys.has(key);
    });
    return (0, lit_1.html)(templateObject_43 || (templateObject_43 = __makeTemplateObject(["\n    <div class=\"cfg-map\">\n      <div class=\"cfg-map__header\">\n        <span class=\"cfg-map__label\">Custom entries</span>\n        <button\n          type=\"button\"\n          class=\"cfg-map__add\"\n          ?disabled=", "\n          @click=", "\n        >\n          <span class=\"cfg-map__add-icon\">", "</span>\n          Add Entry\n        </button>\n      </div>\n\n      ", "\n    </div>\n  "], ["\n    <div class=\"cfg-map\">\n      <div class=\"cfg-map__header\">\n        <span class=\"cfg-map__label\">Custom entries</span>\n        <button\n          type=\"button\"\n          class=\"cfg-map__add\"\n          ?disabled=", "\n          @click=", "\n        >\n          <span class=\"cfg-map__add-icon\">", "</span>\n          Add Entry\n        </button>\n      </div>\n\n      ", "\n    </div>\n  "])), disabled, function () {
        var next = __assign({}, value);
        var index = 1;
        var key = "custom-".concat(index);
        while (key in next) {
            index += 1;
            key = "custom-".concat(index);
        }
        next[key] = anySchema ? {} : (0, config_form_shared_1.defaultValue)(schema);
        onPatch(path, next);
    }, icons.plus, entries.length === 0
        ? (0, lit_1.html)(templateObject_39 || (templateObject_39 = __makeTemplateObject(["\n              <div class=\"cfg-map__empty\">No custom entries.</div>\n            "], ["\n              <div class=\"cfg-map__empty\">No custom entries.</div>\n            "]))) : (0, lit_1.html)(templateObject_42 || (templateObject_42 = __makeTemplateObject(["\n        <div class=\"cfg-map__items\">\n          ", "\n        </div>\n      "], ["\n        <div class=\"cfg-map__items\">\n          ", "\n        </div>\n      "])), entries.map(function (_a) {
        var key = _a[0], entryValue = _a[1];
        var valuePath = __spreadArray(__spreadArray([], path, true), [key], false);
        var fallback = jsonValue(entryValue);
        return (0, lit_1.html)(templateObject_41 || (templateObject_41 = __makeTemplateObject(["\n              <div class=\"cfg-map__item\">\n                <div class=\"cfg-map__item-key\">\n                  <input\n                    type=\"text\"\n                    class=\"cfg-input cfg-input--sm\"\n                    placeholder=\"Key\"\n                    .value=", "\n                    ?disabled=", "\n                    @change=", "\n                  />\n                </div>\n                <div class=\"cfg-map__item-value\">\n                  ", "\n                </div>\n                <button\n                  type=\"button\"\n                  class=\"cfg-map__item-remove\"\n                  title=\"Remove entry\"\n                  ?disabled=", "\n                  @click=", "\n                >\n                  ", "\n                </button>\n              </div>\n            "], ["\n              <div class=\"cfg-map__item\">\n                <div class=\"cfg-map__item-key\">\n                  <input\n                    type=\"text\"\n                    class=\"cfg-input cfg-input--sm\"\n                    placeholder=\"Key\"\n                    .value=", "\n                    ?disabled=", "\n                    @change=", "\n                  />\n                </div>\n                <div class=\"cfg-map__item-value\">\n                  ", "\n                </div>\n                <button\n                  type=\"button\"\n                  class=\"cfg-map__item-remove\"\n                  title=\"Remove entry\"\n                  ?disabled=", "\n                  @click=", "\n                >\n                  ", "\n                </button>\n              </div>\n            "])), key, disabled, function (e) {
            var nextKey = e.target.value.trim();
            if (!nextKey || nextKey === key) {
                return;
            }
            var next = __assign({}, value);
            if (nextKey in next) {
                return;
            }
            next[nextKey] = next[key];
            delete next[key];
            onPatch(path, next);
        }, anySchema
            ? (0, lit_1.html)(templateObject_40 || (templateObject_40 = __makeTemplateObject(["\n                        <textarea\n                          class=\"cfg-textarea cfg-textarea--sm\"\n                          placeholder=\"JSON value\"\n                          rows=\"2\"\n                          .value=", "\n                          ?disabled=", "\n                          @change=", "\n                        ></textarea>\n                      "], ["\n                        <textarea\n                          class=\"cfg-textarea cfg-textarea--sm\"\n                          placeholder=\"JSON value\"\n                          rows=\"2\"\n                          .value=", "\n                          ?disabled=", "\n                          @change=", "\n                        ></textarea>\n                      "])), fallback, disabled, function (e) {
                var target = e.target;
                var raw = target.value.trim();
                if (!raw) {
                    onPatch(valuePath, undefined);
                    return;
                }
                try {
                    onPatch(valuePath, JSON.parse(raw));
                }
                catch (_a) {
                    target.value = fallback;
                }
            }) : renderNode({
            schema: schema,
            value: entryValue,
            path: valuePath,
            hints: hints,
            unsupported: unsupported,
            disabled: disabled,
            showLabel: false,
            onPatch: onPatch,
        }), disabled, function () {
            var next = __assign({}, value);
            delete next[key];
            onPatch(path, next);
        }, icons.trash);
    })));
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33, templateObject_34, templateObject_35, templateObject_36, templateObject_37, templateObject_38, templateObject_39, templateObject_40, templateObject_41, templateObject_42, templateObject_43;
