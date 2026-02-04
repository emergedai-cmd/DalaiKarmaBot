"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var model_picker_js_1 = require("./model-picker.js");
var test_utils_js_1 = require("./onboarding/__tests__/test-utils.js");
var loadModelCatalog = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
vitest_1.vi.mock("../agents/model-catalog.js", function () { return ({
    loadModelCatalog: loadModelCatalog,
}); });
var ensureAuthProfileStore = vitest_1.vi.hoisted(function () {
    return vitest_1.vi.fn(function () { return ({
        version: 1,
        profiles: {},
    }); });
});
var listProfilesForProvider = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(function () { return []; }); });
vitest_1.vi.mock("../agents/auth-profiles.js", function () { return ({
    ensureAuthProfileStore: ensureAuthProfileStore,
    listProfilesForProvider: listProfilesForProvider,
}); });
var resolveEnvApiKey = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(function () { return undefined; }); });
var getCustomProviderApiKey = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(function () { return undefined; }); });
vitest_1.vi.mock("../agents/model-auth.js", function () { return ({
    resolveEnvApiKey: resolveEnvApiKey,
    getCustomProviderApiKey: getCustomProviderApiKey,
}); });
(0, vitest_1.describe)("promptDefaultModel", function () {
    (0, vitest_1.it)("filters internal router models from the selection list", function () { return __awaiter(void 0, void 0, void 0, function () {
        var select, prompter, config, options;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    loadModelCatalog.mockResolvedValue([
                        {
                            provider: "openrouter",
                            id: "auto",
                            name: "OpenRouter Auto",
                        },
                        {
                            provider: "openrouter",
                            id: "meta-llama/llama-3.3-70b:free",
                            name: "Llama 3.3 70B",
                        },
                    ]);
                    select = vitest_1.vi.fn(function (params) { return __awaiter(void 0, void 0, void 0, function () {
                        var first;
                        var _a;
                        return __generator(this, function (_b) {
                            first = params.options[0];
                            return [2 /*return*/, (_a = first === null || first === void 0 ? void 0 : first.value) !== null && _a !== void 0 ? _a : ""];
                        });
                    }); });
                    prompter = (0, test_utils_js_1.makePrompter)({ select: select });
                    config = { agents: { defaults: {} } };
                    return [4 /*yield*/, (0, model_picker_js_1.promptDefaultModel)({
                            config: config,
                            prompter: prompter,
                            allowKeep: false,
                            includeManual: false,
                            ignoreAllowlist: true,
                        })];
                case 1:
                    _d.sent();
                    options = (_c = (_b = (_a = select.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.options) !== null && _c !== void 0 ? _c : [];
                    (0, vitest_1.expect)(options.some(function (opt) { return opt.value === "openrouter/auto"; })).toBe(false);
                    (0, vitest_1.expect)(options.some(function (opt) { return opt.value === "openrouter/meta-llama/llama-3.3-70b:free"; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("promptModelAllowlist", function () {
    (0, vitest_1.it)("filters internal router models from the selection list", function () { return __awaiter(void 0, void 0, void 0, function () {
        var multiselect, prompter, config, options;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    loadModelCatalog.mockResolvedValue([
                        {
                            provider: "openrouter",
                            id: "auto",
                            name: "OpenRouter Auto",
                        },
                        {
                            provider: "openrouter",
                            id: "meta-llama/llama-3.3-70b:free",
                            name: "Llama 3.3 70B",
                        },
                    ]);
                    multiselect = vitest_1.vi.fn(function (params) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, params.options.map(function (option) { return option.value; })];
                    }); }); });
                    prompter = (0, test_utils_js_1.makePrompter)({ multiselect: multiselect });
                    config = { agents: { defaults: {} } };
                    return [4 /*yield*/, (0, model_picker_js_1.promptModelAllowlist)({ config: config, prompter: prompter })];
                case 1:
                    _d.sent();
                    options = (_c = (_b = (_a = multiselect.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.options) !== null && _c !== void 0 ? _c : [];
                    (0, vitest_1.expect)(options.some(function (opt) { return opt.value === "openrouter/auto"; })).toBe(false);
                    (0, vitest_1.expect)(options.some(function (opt) { return opt.value === "openrouter/meta-llama/llama-3.3-70b:free"; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("filters to allowed keys when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var multiselect, prompter, config, options;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    loadModelCatalog.mockResolvedValue([
                        {
                            provider: "anthropic",
                            id: "claude-opus-4-5",
                            name: "Claude Opus 4.5",
                        },
                        {
                            provider: "anthropic",
                            id: "claude-sonnet-4-5",
                            name: "Claude Sonnet 4.5",
                        },
                        {
                            provider: "openai",
                            id: "gpt-5.2",
                            name: "GPT-5.2",
                        },
                    ]);
                    multiselect = vitest_1.vi.fn(function (params) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, params.options.map(function (option) { return option.value; })];
                    }); }); });
                    prompter = (0, test_utils_js_1.makePrompter)({ multiselect: multiselect });
                    config = { agents: { defaults: {} } };
                    return [4 /*yield*/, (0, model_picker_js_1.promptModelAllowlist)({
                            config: config,
                            prompter: prompter,
                            allowedKeys: ["anthropic/claude-opus-4-5"],
                        })];
                case 1:
                    _d.sent();
                    options = (_c = (_b = (_a = multiselect.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.options) !== null && _c !== void 0 ? _c : [];
                    (0, vitest_1.expect)(options.map(function (opt) { return opt.value; })).toEqual([
                        "anthropic/claude-opus-4-5",
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("applyModelAllowlist", function () {
    (0, vitest_1.it)("preserves existing entries for selected models", function () {
        var _a, _b;
        var config = {
            agents: {
                defaults: {
                    models: {
                        "openai/gpt-5.2": { alias: "gpt" },
                        "anthropic/claude-opus-4-5": { alias: "opus" },
                    },
                },
            },
        };
        var next = (0, model_picker_js_1.applyModelAllowlist)(config, ["openai/gpt-5.2"]);
        (0, vitest_1.expect)((_b = (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models).toEqual({
            "openai/gpt-5.2": { alias: "gpt" },
        });
    });
    (0, vitest_1.it)("clears the allowlist when no models remain", function () {
        var _a, _b;
        var config = {
            agents: {
                defaults: {
                    models: {
                        "openai/gpt-5.2": { alias: "gpt" },
                    },
                },
            },
        };
        var next = (0, model_picker_js_1.applyModelAllowlist)(config, []);
        (0, vitest_1.expect)((_b = (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models).toBeUndefined();
    });
});
(0, vitest_1.describe)("applyModelFallbacksFromSelection", function () {
    (0, vitest_1.it)("sets fallbacks from selection when the primary is included", function () {
        var _a, _b;
        var config = {
            agents: {
                defaults: {
                    model: { primary: "anthropic/claude-opus-4-5" },
                },
            },
        };
        var next = (0, model_picker_js_1.applyModelFallbacksFromSelection)(config, [
            "anthropic/claude-opus-4-5",
            "anthropic/claude-sonnet-4-5",
        ]);
        (0, vitest_1.expect)((_b = (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model).toEqual({
            primary: "anthropic/claude-opus-4-5",
            fallbacks: ["anthropic/claude-sonnet-4-5"],
        });
    });
    (0, vitest_1.it)("keeps existing fallbacks when the primary is not selected", function () {
        var _a, _b;
        var config = {
            agents: {
                defaults: {
                    model: { primary: "anthropic/claude-opus-4-5", fallbacks: ["openai/gpt-5.2"] },
                },
            },
        };
        var next = (0, model_picker_js_1.applyModelFallbacksFromSelection)(config, ["openai/gpt-5.2"]);
        (0, vitest_1.expect)((_b = (_a = next.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model).toEqual({
            primary: "anthropic/claude-opus-4-5",
            fallbacks: ["openai/gpt-5.2"],
        });
    });
});
