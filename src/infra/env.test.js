"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var env_js_1 = require("./env.js");
(0, vitest_1.describe)("normalizeZaiEnv", function () {
    (0, vitest_1.it)("copies Z_AI_API_KEY to ZAI_API_KEY when missing", function () {
        var prevZai = process.env.ZAI_API_KEY;
        var prevZAi = process.env.Z_AI_API_KEY;
        process.env.ZAI_API_KEY = "";
        process.env.Z_AI_API_KEY = "zai-legacy";
        (0, env_js_1.normalizeZaiEnv)();
        (0, vitest_1.expect)(process.env.ZAI_API_KEY).toBe("zai-legacy");
        if (prevZai === undefined) {
            delete process.env.ZAI_API_KEY;
        }
        else {
            process.env.ZAI_API_KEY = prevZai;
        }
        if (prevZAi === undefined) {
            delete process.env.Z_AI_API_KEY;
        }
        else {
            process.env.Z_AI_API_KEY = prevZAi;
        }
    });
    (0, vitest_1.it)("does not override existing ZAI_API_KEY", function () {
        var prevZai = process.env.ZAI_API_KEY;
        var prevZAi = process.env.Z_AI_API_KEY;
        process.env.ZAI_API_KEY = "zai-current";
        process.env.Z_AI_API_KEY = "zai-legacy";
        (0, env_js_1.normalizeZaiEnv)();
        (0, vitest_1.expect)(process.env.ZAI_API_KEY).toBe("zai-current");
        if (prevZai === undefined) {
            delete process.env.ZAI_API_KEY;
        }
        else {
            process.env.ZAI_API_KEY = prevZai;
        }
        if (prevZAi === undefined) {
            delete process.env.Z_AI_API_KEY;
        }
        else {
            process.env.Z_AI_API_KEY = prevZAi;
        }
    });
});
(0, vitest_1.describe)("isTruthyEnvValue", function () {
    (0, vitest_1.it)("accepts common truthy values", function () {
        (0, vitest_1.expect)((0, env_js_1.isTruthyEnvValue)("1")).toBe(true);
        (0, vitest_1.expect)((0, env_js_1.isTruthyEnvValue)("true")).toBe(true);
        (0, vitest_1.expect)((0, env_js_1.isTruthyEnvValue)(" yes ")).toBe(true);
        (0, vitest_1.expect)((0, env_js_1.isTruthyEnvValue)("ON")).toBe(true);
    });
    (0, vitest_1.it)("rejects other values", function () {
        (0, vitest_1.expect)((0, env_js_1.isTruthyEnvValue)("0")).toBe(false);
        (0, vitest_1.expect)((0, env_js_1.isTruthyEnvValue)("false")).toBe(false);
        (0, vitest_1.expect)((0, env_js_1.isTruthyEnvValue)("")).toBe(false);
        (0, vitest_1.expect)((0, env_js_1.isTruthyEnvValue)(undefined)).toBe(false);
    });
});
