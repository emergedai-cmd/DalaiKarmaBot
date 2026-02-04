"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var web_search_js_1 = require("./web-search.js");
var inferPerplexityBaseUrlFromApiKey = web_search_js_1.__testing.inferPerplexityBaseUrlFromApiKey, resolvePerplexityBaseUrl = web_search_js_1.__testing.resolvePerplexityBaseUrl, normalizeFreshness = web_search_js_1.__testing.normalizeFreshness;
(0, vitest_1.describe)("web_search perplexity baseUrl defaults", function () {
    (0, vitest_1.it)("detects a Perplexity key prefix", function () {
        (0, vitest_1.expect)(inferPerplexityBaseUrlFromApiKey("pplx-123")).toBe("direct");
    });
    (0, vitest_1.it)("detects an OpenRouter key prefix", function () {
        (0, vitest_1.expect)(inferPerplexityBaseUrlFromApiKey("sk-or-v1-123")).toBe("openrouter");
    });
    (0, vitest_1.it)("returns undefined for unknown key formats", function () {
        (0, vitest_1.expect)(inferPerplexityBaseUrlFromApiKey("unknown-key")).toBeUndefined();
    });
    (0, vitest_1.it)("prefers explicit baseUrl over key-based defaults", function () {
        (0, vitest_1.expect)(resolvePerplexityBaseUrl({ baseUrl: "https://example.com" }, "config", "pplx-123")).toBe("https://example.com");
    });
    (0, vitest_1.it)("defaults to direct when using PERPLEXITY_API_KEY", function () {
        (0, vitest_1.expect)(resolvePerplexityBaseUrl(undefined, "perplexity_env")).toBe("https://api.perplexity.ai");
    });
    (0, vitest_1.it)("defaults to OpenRouter when using OPENROUTER_API_KEY", function () {
        (0, vitest_1.expect)(resolvePerplexityBaseUrl(undefined, "openrouter_env")).toBe("https://openrouter.ai/api/v1");
    });
    (0, vitest_1.it)("defaults to direct when config key looks like Perplexity", function () {
        (0, vitest_1.expect)(resolvePerplexityBaseUrl(undefined, "config", "pplx-123")).toBe("https://api.perplexity.ai");
    });
    (0, vitest_1.it)("defaults to OpenRouter when config key looks like OpenRouter", function () {
        (0, vitest_1.expect)(resolvePerplexityBaseUrl(undefined, "config", "sk-or-v1-123")).toBe("https://openrouter.ai/api/v1");
    });
    (0, vitest_1.it)("defaults to OpenRouter for unknown config key formats", function () {
        (0, vitest_1.expect)(resolvePerplexityBaseUrl(undefined, "config", "weird-key")).toBe("https://openrouter.ai/api/v1");
    });
});
(0, vitest_1.describe)("web_search freshness normalization", function () {
    (0, vitest_1.it)("accepts Brave shortcut values", function () {
        (0, vitest_1.expect)(normalizeFreshness("pd")).toBe("pd");
        (0, vitest_1.expect)(normalizeFreshness("PW")).toBe("pw");
    });
    (0, vitest_1.it)("accepts valid date ranges", function () {
        (0, vitest_1.expect)(normalizeFreshness("2024-01-01to2024-01-31")).toBe("2024-01-01to2024-01-31");
    });
    (0, vitest_1.it)("rejects invalid date ranges", function () {
        (0, vitest_1.expect)(normalizeFreshness("2024-13-01to2024-01-31")).toBeUndefined();
        (0, vitest_1.expect)(normalizeFreshness("2024-02-30to2024-03-01")).toBeUndefined();
        (0, vitest_1.expect)(normalizeFreshness("2024-03-10to2024-03-01")).toBeUndefined();
    });
});
