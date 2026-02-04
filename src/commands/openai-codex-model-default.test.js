"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var openai_codex_model_default_js_1 = require("./openai-codex-model-default.js");
(0, vitest_1.describe)("applyOpenAICodexModelDefault", function () {
    (0, vitest_1.it)("sets openai-codex default when model is unset", function () {
        var _a, _b;
        var cfg = { agents: { defaults: {} } };
        var applied = (0, openai_codex_model_default_js_1.applyOpenAICodexModelDefault)(cfg);
        (0, vitest_1.expect)(applied.changed).toBe(true);
        (0, vitest_1.expect)((_b = (_a = applied.next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model).toEqual({
            primary: openai_codex_model_default_js_1.OPENAI_CODEX_DEFAULT_MODEL,
        });
    });
    (0, vitest_1.it)("sets openai-codex default when model is openai/*", function () {
        var _a, _b;
        var cfg = {
            agents: { defaults: { model: "openai/gpt-5.2" } },
        };
        var applied = (0, openai_codex_model_default_js_1.applyOpenAICodexModelDefault)(cfg);
        (0, vitest_1.expect)(applied.changed).toBe(true);
        (0, vitest_1.expect)((_b = (_a = applied.next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model).toEqual({
            primary: openai_codex_model_default_js_1.OPENAI_CODEX_DEFAULT_MODEL,
        });
    });
    (0, vitest_1.it)("does not override openai-codex/*", function () {
        var cfg = {
            agents: { defaults: { model: "openai-codex/gpt-5.2" } },
        };
        var applied = (0, openai_codex_model_default_js_1.applyOpenAICodexModelDefault)(cfg);
        (0, vitest_1.expect)(applied.changed).toBe(false);
        (0, vitest_1.expect)(applied.next).toEqual(cfg);
    });
    (0, vitest_1.it)("does not override non-openai models", function () {
        var cfg = {
            agents: { defaults: { model: "anthropic/claude-opus-4-5" } },
        };
        var applied = (0, openai_codex_model_default_js_1.applyOpenAICodexModelDefault)(cfg);
        (0, vitest_1.expect)(applied.changed).toBe(false);
        (0, vitest_1.expect)(applied.next).toEqual(cfg);
    });
});
