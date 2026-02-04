"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var auth_choice_options_js_1 = require("./auth-choice-options.js");
(0, vitest_1.describe)("buildAuthChoiceOptions", function () {
    (0, vitest_1.it)("includes GitHub Copilot", function () {
        var store = { version: 1, profiles: {} };
        var options = (0, auth_choice_options_js_1.buildAuthChoiceOptions)({
            store: store,
            includeSkip: false,
        });
        (0, vitest_1.expect)(options.find(function (opt) { return opt.value === "github-copilot"; })).toBeDefined();
    });
    (0, vitest_1.it)("includes setup-token option for Anthropic", function () {
        var store = { version: 1, profiles: {} };
        var options = (0, auth_choice_options_js_1.buildAuthChoiceOptions)({
            store: store,
            includeSkip: false,
        });
        (0, vitest_1.expect)(options.some(function (opt) { return opt.value === "token"; })).toBe(true);
    });
    (0, vitest_1.it)("includes Z.AI (GLM) auth choice", function () {
        var store = { version: 1, profiles: {} };
        var options = (0, auth_choice_options_js_1.buildAuthChoiceOptions)({
            store: store,
            includeSkip: false,
        });
        (0, vitest_1.expect)(options.some(function (opt) { return opt.value === "zai-api-key"; })).toBe(true);
    });
    (0, vitest_1.it)("includes Xiaomi auth choice", function () {
        var store = { version: 1, profiles: {} };
        var options = (0, auth_choice_options_js_1.buildAuthChoiceOptions)({
            store: store,
            includeSkip: false,
        });
        (0, vitest_1.expect)(options.some(function (opt) { return opt.value === "xiaomi-api-key"; })).toBe(true);
    });
    (0, vitest_1.it)("includes MiniMax auth choice", function () {
        var store = { version: 1, profiles: {} };
        var options = (0, auth_choice_options_js_1.buildAuthChoiceOptions)({
            store: store,
            includeSkip: false,
        });
        (0, vitest_1.expect)(options.some(function (opt) { return opt.value === "minimax-api"; })).toBe(true);
        (0, vitest_1.expect)(options.some(function (opt) { return opt.value === "minimax-api-lightning"; })).toBe(true);
    });
    (0, vitest_1.it)("includes Moonshot auth choice", function () {
        var store = { version: 1, profiles: {} };
        var options = (0, auth_choice_options_js_1.buildAuthChoiceOptions)({
            store: store,
            includeSkip: false,
        });
        (0, vitest_1.expect)(options.some(function (opt) { return opt.value === "moonshot-api-key"; })).toBe(true);
        (0, vitest_1.expect)(options.some(function (opt) { return opt.value === "kimi-code-api-key"; })).toBe(true);
    });
    (0, vitest_1.it)("includes Vercel AI Gateway auth choice", function () {
        var store = { version: 1, profiles: {} };
        var options = (0, auth_choice_options_js_1.buildAuthChoiceOptions)({
            store: store,
            includeSkip: false,
        });
        (0, vitest_1.expect)(options.some(function (opt) { return opt.value === "ai-gateway-api-key"; })).toBe(true);
    });
    (0, vitest_1.it)("includes Synthetic auth choice", function () {
        var store = { version: 1, profiles: {} };
        var options = (0, auth_choice_options_js_1.buildAuthChoiceOptions)({
            store: store,
            includeSkip: false,
        });
        (0, vitest_1.expect)(options.some(function (opt) { return opt.value === "synthetic-api-key"; })).toBe(true);
    });
    (0, vitest_1.it)("includes Chutes OAuth auth choice", function () {
        var store = { version: 1, profiles: {} };
        var options = (0, auth_choice_options_js_1.buildAuthChoiceOptions)({
            store: store,
            includeSkip: false,
        });
        (0, vitest_1.expect)(options.some(function (opt) { return opt.value === "chutes"; })).toBe(true);
    });
    (0, vitest_1.it)("includes Qwen auth choice", function () {
        var store = { version: 1, profiles: {} };
        var options = (0, auth_choice_options_js_1.buildAuthChoiceOptions)({
            store: store,
            includeSkip: false,
        });
        (0, vitest_1.expect)(options.some(function (opt) { return opt.value === "qwen-portal"; })).toBe(true);
    });
});
