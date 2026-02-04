"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lit_1 = require("lit");
var vitest_1 = require("vitest");
var config_form_1 = require("./views/config-form");
var rootSchema = {
    type: "object",
    properties: {
        gateway: {
            type: "object",
            properties: {
                auth: {
                    type: "object",
                    properties: {
                        token: { type: "string" },
                    },
                },
            },
        },
        allowFrom: {
            type: "array",
            items: { type: "string" },
        },
        mode: {
            type: "string",
            enum: ["off", "token"],
        },
        enabled: {
            type: "boolean",
        },
        bind: {
            anyOf: [{ const: "auto" }, { const: "lan" }, { const: "tailnet" }, { const: "loopback" }],
        },
    },
};
(0, vitest_1.describe)("config form renderer", function () {
    (0, vitest_1.it)("renders inputs and patches values", function () {
        var onPatch = vitest_1.vi.fn();
        var container = document.createElement("div");
        var analysis = (0, config_form_1.analyzeConfigSchema)(rootSchema);
        (0, lit_1.render)((0, config_form_1.renderConfigForm)({
            schema: analysis.schema,
            uiHints: {
                "gateway.auth.token": { label: "Gateway Token", sensitive: true },
            },
            unsupportedPaths: analysis.unsupportedPaths,
            value: {},
            onPatch: onPatch,
        }), container);
        var tokenInput = container.querySelector("input[type='password']");
        (0, vitest_1.expect)(tokenInput).not.toBeNull();
        if (!tokenInput) {
            return;
        }
        tokenInput.value = "abc123";
        tokenInput.dispatchEvent(new Event("input", { bubbles: true }));
        (0, vitest_1.expect)(onPatch).toHaveBeenCalledWith(["gateway", "auth", "token"], "abc123");
        var tokenButton = Array.from(container.querySelectorAll(".cfg-segmented__btn")).find(function (btn) { var _a; return ((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "token"; });
        (0, vitest_1.expect)(tokenButton).not.toBeUndefined();
        tokenButton === null || tokenButton === void 0 ? void 0 : tokenButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        (0, vitest_1.expect)(onPatch).toHaveBeenCalledWith(["mode"], "token");
        var checkbox = container.querySelector("input[type='checkbox']");
        (0, vitest_1.expect)(checkbox).not.toBeNull();
        if (!checkbox) {
            return;
        }
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));
        (0, vitest_1.expect)(onPatch).toHaveBeenCalledWith(["enabled"], true);
    });
    (0, vitest_1.it)("adds and removes array entries", function () {
        var onPatch = vitest_1.vi.fn();
        var container = document.createElement("div");
        var analysis = (0, config_form_1.analyzeConfigSchema)(rootSchema);
        (0, lit_1.render)((0, config_form_1.renderConfigForm)({
            schema: analysis.schema,
            uiHints: {},
            unsupportedPaths: analysis.unsupportedPaths,
            value: { allowFrom: ["+1"] },
            onPatch: onPatch,
        }), container);
        var addButton = container.querySelector(".cfg-array__add");
        (0, vitest_1.expect)(addButton).not.toBeUndefined();
        addButton === null || addButton === void 0 ? void 0 : addButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        (0, vitest_1.expect)(onPatch).toHaveBeenCalledWith(["allowFrom"], ["+1", ""]);
        var removeButton = container.querySelector(".cfg-array__item-remove");
        (0, vitest_1.expect)(removeButton).not.toBeUndefined();
        removeButton === null || removeButton === void 0 ? void 0 : removeButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        (0, vitest_1.expect)(onPatch).toHaveBeenCalledWith(["allowFrom"], []);
    });
    (0, vitest_1.it)("renders union literals as select options", function () {
        var onPatch = vitest_1.vi.fn();
        var container = document.createElement("div");
        var analysis = (0, config_form_1.analyzeConfigSchema)(rootSchema);
        (0, lit_1.render)((0, config_form_1.renderConfigForm)({
            schema: analysis.schema,
            uiHints: {},
            unsupportedPaths: analysis.unsupportedPaths,
            value: { bind: "auto" },
            onPatch: onPatch,
        }), container);
        var tailnetButton = Array.from(container.querySelectorAll(".cfg-segmented__btn")).find(function (btn) { var _a; return ((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "tailnet"; });
        (0, vitest_1.expect)(tailnetButton).not.toBeUndefined();
        tailnetButton === null || tailnetButton === void 0 ? void 0 : tailnetButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        (0, vitest_1.expect)(onPatch).toHaveBeenCalledWith(["bind"], "tailnet");
    });
    (0, vitest_1.it)("renders map fields from additionalProperties", function () {
        var onPatch = vitest_1.vi.fn();
        var container = document.createElement("div");
        var schema = {
            type: "object",
            properties: {
                slack: {
                    type: "object",
                    additionalProperties: {
                        type: "string",
                    },
                },
            },
        };
        var analysis = (0, config_form_1.analyzeConfigSchema)(schema);
        (0, lit_1.render)((0, config_form_1.renderConfigForm)({
            schema: analysis.schema,
            uiHints: {},
            unsupportedPaths: analysis.unsupportedPaths,
            value: { slack: { channelA: "ok" } },
            onPatch: onPatch,
        }), container);
        var removeButton = container.querySelector(".cfg-map__item-remove");
        (0, vitest_1.expect)(removeButton).not.toBeUndefined();
        removeButton === null || removeButton === void 0 ? void 0 : removeButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        (0, vitest_1.expect)(onPatch).toHaveBeenCalledWith(["slack"], {});
    });
    (0, vitest_1.it)("supports wildcard uiHints for map entries", function () {
        var onPatch = vitest_1.vi.fn();
        var container = document.createElement("div");
        var schema = {
            type: "object",
            properties: {
                plugins: {
                    type: "object",
                    properties: {
                        entries: {
                            type: "object",
                            additionalProperties: {
                                type: "object",
                                properties: {
                                    enabled: { type: "boolean" },
                                },
                            },
                        },
                    },
                },
            },
        };
        var analysis = (0, config_form_1.analyzeConfigSchema)(schema);
        (0, lit_1.render)((0, config_form_1.renderConfigForm)({
            schema: analysis.schema,
            uiHints: {
                "plugins.entries.*.enabled": { label: "Plugin Enabled" },
            },
            unsupportedPaths: analysis.unsupportedPaths,
            value: { plugins: { entries: { "voice-call": { enabled: true } } } },
            onPatch: onPatch,
        }), container);
        (0, vitest_1.expect)(container.textContent).toContain("Plugin Enabled");
    });
    (0, vitest_1.it)("flags unsupported unions", function () {
        var schema = {
            type: "object",
            properties: {
                mixed: {
                    anyOf: [{ type: "string" }, { type: "object", properties: {} }],
                },
            },
        };
        var analysis = (0, config_form_1.analyzeConfigSchema)(schema);
        (0, vitest_1.expect)(analysis.unsupportedPaths).toContain("mixed");
    });
    (0, vitest_1.it)("supports nullable types", function () {
        var schema = {
            type: "object",
            properties: {
                note: { type: ["string", "null"] },
            },
        };
        var analysis = (0, config_form_1.analyzeConfigSchema)(schema);
        (0, vitest_1.expect)(analysis.unsupportedPaths).not.toContain("note");
    });
    (0, vitest_1.it)("ignores untyped additionalProperties schemas", function () {
        var schema = {
            type: "object",
            properties: {
                channels: {
                    type: "object",
                    properties: {
                        whatsapp: {
                            type: "object",
                            properties: {
                                enabled: { type: "boolean" },
                            },
                        },
                    },
                    additionalProperties: {},
                },
            },
        };
        var analysis = (0, config_form_1.analyzeConfigSchema)(schema);
        (0, vitest_1.expect)(analysis.unsupportedPaths).not.toContain("channels");
    });
    (0, vitest_1.it)("flags additionalProperties true", function () {
        var schema = {
            type: "object",
            properties: {
                extra: {
                    type: "object",
                    additionalProperties: true,
                },
            },
        };
        var analysis = (0, config_form_1.analyzeConfigSchema)(schema);
        (0, vitest_1.expect)(analysis.unsupportedPaths).toContain("extra");
    });
});
