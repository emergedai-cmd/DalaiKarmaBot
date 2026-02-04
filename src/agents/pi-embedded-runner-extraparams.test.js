"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_runner_js_1 = require("./pi-embedded-runner.js");
(0, vitest_1.describe)("resolveExtraParams", function () {
    (0, vitest_1.it)("returns undefined with no model config", function () {
        var result = (0, pi_embedded_runner_js_1.resolveExtraParams)({
            cfg: undefined,
            provider: "zai",
            modelId: "glm-4.7",
        });
        (0, vitest_1.expect)(result).toBeUndefined();
    });
    (0, vitest_1.it)("returns params for exact provider/model key", function () {
        var result = (0, pi_embedded_runner_js_1.resolveExtraParams)({
            cfg: {
                agents: {
                    defaults: {
                        models: {
                            "openai/gpt-4": {
                                params: {
                                    temperature: 0.7,
                                    maxTokens: 2048,
                                },
                            },
                        },
                    },
                },
            },
            provider: "openai",
            modelId: "gpt-4",
        });
        (0, vitest_1.expect)(result).toEqual({
            temperature: 0.7,
            maxTokens: 2048,
        });
    });
    (0, vitest_1.it)("ignores unrelated model entries", function () {
        var result = (0, pi_embedded_runner_js_1.resolveExtraParams)({
            cfg: {
                agents: {
                    defaults: {
                        models: {
                            "openai/gpt-4": {
                                params: {
                                    temperature: 0.7,
                                },
                            },
                        },
                    },
                },
            },
            provider: "openai",
            modelId: "gpt-4.1-mini",
        });
        (0, vitest_1.expect)(result).toBeUndefined();
    });
});
(0, vitest_1.describe)("applyExtraParamsToAgent", function () {
    (0, vitest_1.it)("adds OpenRouter attribution headers to stream options", function () {
        var _a, _b;
        var calls = [];
        var baseStreamFn = function (_model, _context, options) {
            calls.push(options);
            return new AssistantMessageEventStream();
        };
        var agent = { streamFn: baseStreamFn };
        (0, pi_embedded_runner_js_1.applyExtraParamsToAgent)(agent, undefined, "openrouter", "openrouter/auto");
        var model = {
            api: "openai-completions",
            provider: "openrouter",
            id: "openrouter/auto",
        };
        var context = { messages: [] };
        void ((_a = agent.streamFn) === null || _a === void 0 ? void 0 : _a.call(agent, model, context, { headers: { "X-Custom": "1" } }));
        (0, vitest_1.expect)(calls).toHaveLength(1);
        (0, vitest_1.expect)((_b = calls[0]) === null || _b === void 0 ? void 0 : _b.headers).toEqual({
            "HTTP-Referer": "https://openclaw.ai",
            "X-Title": "OpenClaw",
            "X-Custom": "1",
        });
    });
});
