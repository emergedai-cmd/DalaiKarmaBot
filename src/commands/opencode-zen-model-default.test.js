"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var opencode_zen_model_default_js_1 = require("./opencode-zen-model-default.js");
(0, vitest_1.describe)("applyOpencodeZenModelDefault", function () {
    (0, vitest_1.it)("sets opencode default when model is unset", function () {
        var _a, _b;
        var cfg = { agents: { defaults: {} } };
        var applied = (0, opencode_zen_model_default_js_1.applyOpencodeZenModelDefault)(cfg);
        (0, vitest_1.expect)(applied.changed).toBe(true);
        (0, vitest_1.expect)((_b = (_a = applied.next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model).toEqual({
            primary: opencode_zen_model_default_js_1.OPENCODE_ZEN_DEFAULT_MODEL,
        });
    });
    (0, vitest_1.it)("overrides existing model", function () {
        var _a, _b;
        var cfg = {
            agents: { defaults: { model: "anthropic/claude-opus-4-5" } },
        };
        var applied = (0, opencode_zen_model_default_js_1.applyOpencodeZenModelDefault)(cfg);
        (0, vitest_1.expect)(applied.changed).toBe(true);
        (0, vitest_1.expect)((_b = (_a = applied.next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model).toEqual({
            primary: opencode_zen_model_default_js_1.OPENCODE_ZEN_DEFAULT_MODEL,
        });
    });
    (0, vitest_1.it)("no-ops when already opencode-zen default", function () {
        var cfg = {
            agents: { defaults: { model: opencode_zen_model_default_js_1.OPENCODE_ZEN_DEFAULT_MODEL } },
        };
        var applied = (0, opencode_zen_model_default_js_1.applyOpencodeZenModelDefault)(cfg);
        (0, vitest_1.expect)(applied.changed).toBe(false);
        (0, vitest_1.expect)(applied.next).toEqual(cfg);
    });
    (0, vitest_1.it)("no-ops when already legacy opencode-zen default", function () {
        var cfg = {
            agents: { defaults: { model: "opencode-zen/claude-opus-4-5" } },
        };
        var applied = (0, opencode_zen_model_default_js_1.applyOpencodeZenModelDefault)(cfg);
        (0, vitest_1.expect)(applied.changed).toBe(false);
        (0, vitest_1.expect)(applied.next).toEqual(cfg);
    });
    (0, vitest_1.it)("preserves fallbacks when setting primary", function () {
        var _a, _b;
        var cfg = {
            agents: {
                defaults: {
                    model: {
                        primary: "anthropic/claude-opus-4-5",
                        fallbacks: ["google/gemini-3-pro"],
                    },
                },
            },
        };
        var applied = (0, opencode_zen_model_default_js_1.applyOpencodeZenModelDefault)(cfg);
        (0, vitest_1.expect)(applied.changed).toBe(true);
        (0, vitest_1.expect)((_b = (_a = applied.next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model).toEqual({
            primary: opencode_zen_model_default_js_1.OPENCODE_ZEN_DEFAULT_MODEL,
            fallbacks: ["google/gemini-3-pro"],
        });
    });
});
