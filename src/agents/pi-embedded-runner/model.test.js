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
var vitest_1 = require("vitest");
vitest_1.vi.mock("../pi-model-discovery.js", function () { return ({
    discoverAuthStorage: vitest_1.vi.fn(function () { return ({ mocked: true }); }),
    discoverModels: vitest_1.vi.fn(function () { return ({ find: vitest_1.vi.fn(function () { return null; }) }); }),
}); });
var model_js_1 = require("./model.js");
var makeModel = function (id) { return ({
    id: id,
    name: id,
    reasoning: false,
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 1,
    maxTokens: 1,
}); };
(0, vitest_1.describe)("buildInlineProviderModels", function () {
    (0, vitest_1.it)("attaches provider ids to inline models", function () {
        var providers = {
            " alpha ": { baseUrl: "http://alpha.local", models: [makeModel("alpha-model")] },
            beta: { baseUrl: "http://beta.local", models: [makeModel("beta-model")] },
        };
        var result = (0, model_js_1.buildInlineProviderModels)(providers);
        (0, vitest_1.expect)(result).toEqual([
            __assign(__assign({}, makeModel("alpha-model")), { provider: "alpha", baseUrl: "http://alpha.local", api: undefined }),
            __assign(__assign({}, makeModel("beta-model")), { provider: "beta", baseUrl: "http://beta.local", api: undefined }),
        ]);
    });
    (0, vitest_1.it)("inherits baseUrl from provider when model does not specify it", function () {
        var providers = {
            custom: {
                baseUrl: "http://localhost:8000",
                models: [makeModel("custom-model")],
            },
        };
        var result = (0, model_js_1.buildInlineProviderModels)(providers);
        (0, vitest_1.expect)(result).toHaveLength(1);
        (0, vitest_1.expect)(result[0].baseUrl).toBe("http://localhost:8000");
    });
    (0, vitest_1.it)("inherits api from provider when model does not specify it", function () {
        var providers = {
            custom: {
                baseUrl: "http://localhost:8000",
                api: "anthropic-messages",
                models: [makeModel("custom-model")],
            },
        };
        var result = (0, model_js_1.buildInlineProviderModels)(providers);
        (0, vitest_1.expect)(result).toHaveLength(1);
        (0, vitest_1.expect)(result[0].api).toBe("anthropic-messages");
    });
    (0, vitest_1.it)("model-level api takes precedence over provider-level api", function () {
        var providers = {
            custom: {
                baseUrl: "http://localhost:8000",
                api: "openai-responses",
                models: [__assign(__assign({}, makeModel("custom-model")), { api: "anthropic-messages" })],
            },
        };
        var result = (0, model_js_1.buildInlineProviderModels)(providers);
        (0, vitest_1.expect)(result).toHaveLength(1);
        (0, vitest_1.expect)(result[0].api).toBe("anthropic-messages");
    });
    (0, vitest_1.it)("inherits both baseUrl and api from provider config", function () {
        var providers = {
            custom: {
                baseUrl: "http://localhost:10000",
                api: "anthropic-messages",
                models: [makeModel("claude-opus-4.5")],
            },
        };
        var result = (0, model_js_1.buildInlineProviderModels)(providers);
        (0, vitest_1.expect)(result).toHaveLength(1);
        (0, vitest_1.expect)(result[0]).toMatchObject({
            provider: "custom",
            baseUrl: "http://localhost:10000",
            api: "anthropic-messages",
            name: "claude-opus-4.5",
        });
    });
});
(0, vitest_1.describe)("resolveModel", function () {
    (0, vitest_1.it)("includes provider baseUrl in fallback model", function () {
        var _a, _b, _c;
        var cfg = {
            models: {
                providers: {
                    custom: {
                        baseUrl: "http://localhost:9000",
                        models: [],
                    },
                },
            },
        };
        var result = (0, model_js_1.resolveModel)("custom", "missing-model", "/tmp/agent", cfg);
        (0, vitest_1.expect)((_a = result.model) === null || _a === void 0 ? void 0 : _a.baseUrl).toBe("http://localhost:9000");
        (0, vitest_1.expect)((_b = result.model) === null || _b === void 0 ? void 0 : _b.provider).toBe("custom");
        (0, vitest_1.expect)((_c = result.model) === null || _c === void 0 ? void 0 : _c.id).toBe("missing-model");
    });
});
