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
var model_compat_js_1 = require("./model-compat.js");
var baseModel = function () {
    return ({
        id: "glm-4.7",
        name: "GLM-4.7",
        api: "openai-completions",
        provider: "zai",
        baseUrl: "https://api.z.ai/api/coding/paas/v4",
        reasoning: true,
        input: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 8192,
        maxTokens: 1024,
    });
};
(0, vitest_1.describe)("normalizeModelCompat", function () {
    (0, vitest_1.it)("forces supportsDeveloperRole off for z.ai models", function () {
        var _a;
        var model = baseModel();
        delete model.compat;
        var normalized = (0, model_compat_js_1.normalizeModelCompat)(model);
        (0, vitest_1.expect)((_a = normalized.compat) === null || _a === void 0 ? void 0 : _a.supportsDeveloperRole).toBe(false);
    });
    (0, vitest_1.it)("leaves non-zai models untouched", function () {
        var model = __assign(__assign({}, baseModel()), { provider: "openai", baseUrl: "https://api.openai.com/v1" });
        delete model.compat;
        var normalized = (0, model_compat_js_1.normalizeModelCompat)(model);
        (0, vitest_1.expect)(normalized.compat).toBeUndefined();
    });
    (0, vitest_1.it)("does not override explicit z.ai compat false", function () {
        var _a;
        var model = baseModel();
        model.compat = { supportsDeveloperRole: false };
        var normalized = (0, model_compat_js_1.normalizeModelCompat)(model);
        (0, vitest_1.expect)((_a = normalized.compat) === null || _a === void 0 ? void 0 : _a.supportsDeveloperRole).toBe(false);
    });
});
