"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var defaults_js_1 = require("../agents/defaults.js");
var defaults_js_2 = require("./defaults.js");
(0, vitest_1.describe)("applyModelDefaults", function () {
    (0, vitest_1.it)("adds default aliases when models are present", function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var cfg = {
            agents: {
                defaults: {
                    models: {
                        "anthropic/claude-opus-4-5": {},
                        "openai/gpt-5.2": {},
                    },
                },
            },
        };
        var next = (0, defaults_js_2.applyModelDefaults)(cfg);
        (0, vitest_1.expect)((_d = (_c = (_b = (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models) === null || _c === void 0 ? void 0 : _c["anthropic/claude-opus-4-5"]) === null || _d === void 0 ? void 0 : _d.alias).toBe("opus");
        (0, vitest_1.expect)((_h = (_g = (_f = (_e = next.agents) === null || _e === void 0 ? void 0 : _e.defaults) === null || _f === void 0 ? void 0 : _f.models) === null || _g === void 0 ? void 0 : _g["openai/gpt-5.2"]) === null || _h === void 0 ? void 0 : _h.alias).toBe("gpt");
    });
    (0, vitest_1.it)("does not override existing aliases", function () {
        var _a, _b, _c, _d;
        var cfg = {
            agents: {
                defaults: {
                    models: {
                        "anthropic/claude-opus-4-5": { alias: "Opus" },
                    },
                },
            },
        };
        var next = (0, defaults_js_2.applyModelDefaults)(cfg);
        (0, vitest_1.expect)((_d = (_c = (_b = (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models) === null || _c === void 0 ? void 0 : _c["anthropic/claude-opus-4-5"]) === null || _d === void 0 ? void 0 : _d.alias).toBe("Opus");
    });
    (0, vitest_1.it)("respects explicit empty alias disables", function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var cfg = {
            agents: {
                defaults: {
                    models: {
                        "google/gemini-3-pro-preview": { alias: "" },
                        "google/gemini-3-flash-preview": {},
                    },
                },
            },
        };
        var next = (0, defaults_js_2.applyModelDefaults)(cfg);
        (0, vitest_1.expect)((_d = (_c = (_b = (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models) === null || _c === void 0 ? void 0 : _c["google/gemini-3-pro-preview"]) === null || _d === void 0 ? void 0 : _d.alias).toBe("");
        (0, vitest_1.expect)((_h = (_g = (_f = (_e = next.agents) === null || _e === void 0 ? void 0 : _e.defaults) === null || _f === void 0 ? void 0 : _f.models) === null || _g === void 0 ? void 0 : _g["google/gemini-3-flash-preview"]) === null || _h === void 0 ? void 0 : _h.alias).toBe("gemini-flash");
    });
    (0, vitest_1.it)("fills missing model provider defaults", function () {
        var _a, _b, _c, _d;
        var cfg = {
            models: {
                providers: {
                    myproxy: {
                        baseUrl: "https://proxy.example/v1",
                        apiKey: "sk-test",
                        api: "openai-completions",
                        models: [{ id: "gpt-5.2", name: "GPT-5.2" }],
                    },
                },
            },
        };
        var next = (0, defaults_js_2.applyModelDefaults)(cfg);
        var model = (_d = (_c = (_b = (_a = next.models) === null || _a === void 0 ? void 0 : _a.providers) === null || _b === void 0 ? void 0 : _b.myproxy) === null || _c === void 0 ? void 0 : _c.models) === null || _d === void 0 ? void 0 : _d[0];
        (0, vitest_1.expect)(model === null || model === void 0 ? void 0 : model.reasoning).toBe(false);
        (0, vitest_1.expect)(model === null || model === void 0 ? void 0 : model.input).toEqual(["text"]);
        (0, vitest_1.expect)(model === null || model === void 0 ? void 0 : model.cost).toEqual({ input: 0, output: 0, cacheRead: 0, cacheWrite: 0 });
        (0, vitest_1.expect)(model === null || model === void 0 ? void 0 : model.contextWindow).toBe(defaults_js_1.DEFAULT_CONTEXT_TOKENS);
        (0, vitest_1.expect)(model === null || model === void 0 ? void 0 : model.maxTokens).toBe(8192);
    });
});
