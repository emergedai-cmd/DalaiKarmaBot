"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var google_gemini_model_default_js_1 = require("./google-gemini-model-default.js");
(0, vitest_1.describe)("applyGoogleGeminiModelDefault", function () {
    (0, vitest_1.it)("sets gemini default when model is unset", function () {
        var _a, _b;
        var cfg = { agents: { defaults: {} } };
        var applied = (0, google_gemini_model_default_js_1.applyGoogleGeminiModelDefault)(cfg);
        (0, vitest_1.expect)(applied.changed).toBe(true);
        (0, vitest_1.expect)((_b = (_a = applied.next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model).toEqual({
            primary: google_gemini_model_default_js_1.GOOGLE_GEMINI_DEFAULT_MODEL,
        });
    });
    (0, vitest_1.it)("overrides existing model", function () {
        var _a, _b;
        var cfg = {
            agents: { defaults: { model: "anthropic/claude-opus-4-5" } },
        };
        var applied = (0, google_gemini_model_default_js_1.applyGoogleGeminiModelDefault)(cfg);
        (0, vitest_1.expect)(applied.changed).toBe(true);
        (0, vitest_1.expect)((_b = (_a = applied.next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model).toEqual({
            primary: google_gemini_model_default_js_1.GOOGLE_GEMINI_DEFAULT_MODEL,
        });
    });
    (0, vitest_1.it)("no-ops when already gemini default", function () {
        var cfg = {
            agents: { defaults: { model: google_gemini_model_default_js_1.GOOGLE_GEMINI_DEFAULT_MODEL } },
        };
        var applied = (0, google_gemini_model_default_js_1.applyGoogleGeminiModelDefault)(cfg);
        (0, vitest_1.expect)(applied.changed).toBe(false);
        (0, vitest_1.expect)(applied.next).toEqual(cfg);
    });
});
