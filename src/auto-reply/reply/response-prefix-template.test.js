"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var response_prefix_template_js_1 = require("./response-prefix-template.js");
(0, vitest_1.describe)("resolveResponsePrefixTemplate", function () {
    (0, vitest_1.it)("returns undefined for undefined template", function () {
        (0, vitest_1.expect)((0, response_prefix_template_js_1.resolveResponsePrefixTemplate)(undefined, {})).toBeUndefined();
    });
    (0, vitest_1.it)("returns template as-is when no variables present", function () {
        (0, vitest_1.expect)((0, response_prefix_template_js_1.resolveResponsePrefixTemplate)("[Claude]", {})).toBe("[Claude]");
    });
    (0, vitest_1.it)("resolves {model} variable", function () {
        var result = (0, response_prefix_template_js_1.resolveResponsePrefixTemplate)("[{model}]", {
            model: "gpt-5.2",
        });
        (0, vitest_1.expect)(result).toBe("[gpt-5.2]");
    });
    (0, vitest_1.it)("resolves {modelFull} variable", function () {
        var result = (0, response_prefix_template_js_1.resolveResponsePrefixTemplate)("[{modelFull}]", {
            modelFull: "openai-codex/gpt-5.2",
        });
        (0, vitest_1.expect)(result).toBe("[openai-codex/gpt-5.2]");
    });
    (0, vitest_1.it)("resolves {provider} variable", function () {
        var result = (0, response_prefix_template_js_1.resolveResponsePrefixTemplate)("[{provider}]", {
            provider: "anthropic",
        });
        (0, vitest_1.expect)(result).toBe("[anthropic]");
    });
    (0, vitest_1.it)("resolves {thinkingLevel} variable", function () {
        var result = (0, response_prefix_template_js_1.resolveResponsePrefixTemplate)("think:{thinkingLevel}", {
            thinkingLevel: "high",
        });
        (0, vitest_1.expect)(result).toBe("think:high");
    });
    (0, vitest_1.it)("resolves {think} as alias for thinkingLevel", function () {
        var result = (0, response_prefix_template_js_1.resolveResponsePrefixTemplate)("think:{think}", {
            thinkingLevel: "low",
        });
        (0, vitest_1.expect)(result).toBe("think:low");
    });
    (0, vitest_1.it)("resolves {identity.name} variable", function () {
        var result = (0, response_prefix_template_js_1.resolveResponsePrefixTemplate)("[{identity.name}]", {
            identityName: "OpenClaw",
        });
        (0, vitest_1.expect)(result).toBe("[OpenClaw]");
    });
    (0, vitest_1.it)("resolves {identityName} as alias", function () {
        var result = (0, response_prefix_template_js_1.resolveResponsePrefixTemplate)("[{identityName}]", {
            identityName: "OpenClaw",
        });
        (0, vitest_1.expect)(result).toBe("[OpenClaw]");
    });
    (0, vitest_1.it)("resolves multiple variables", function () {
        var result = (0, response_prefix_template_js_1.resolveResponsePrefixTemplate)("[{model} | think:{thinkingLevel}]", {
            model: "claude-opus-4-5",
            thinkingLevel: "high",
        });
        (0, vitest_1.expect)(result).toBe("[claude-opus-4-5 | think:high]");
    });
    (0, vitest_1.it)("leaves unresolved variables as-is", function () {
        var result = (0, response_prefix_template_js_1.resolveResponsePrefixTemplate)("[{model}]", {});
        (0, vitest_1.expect)(result).toBe("[{model}]");
    });
    (0, vitest_1.it)("leaves unrecognized variables as-is", function () {
        var result = (0, response_prefix_template_js_1.resolveResponsePrefixTemplate)("[{unknownVar}]", {
            model: "gpt-5.2",
        });
        (0, vitest_1.expect)(result).toBe("[{unknownVar}]");
    });
    (0, vitest_1.it)("handles case insensitivity", function () {
        var result = (0, response_prefix_template_js_1.resolveResponsePrefixTemplate)("[{MODEL} | {ThinkingLevel}]", {
            model: "gpt-5.2",
            thinkingLevel: "low",
        });
        (0, vitest_1.expect)(result).toBe("[gpt-5.2 | low]");
    });
    (0, vitest_1.it)("handles mixed resolved and unresolved variables", function () {
        var result = (0, response_prefix_template_js_1.resolveResponsePrefixTemplate)("[{model} | {provider}]", {
            model: "gpt-5.2",
            // provider not provided
        });
        (0, vitest_1.expect)(result).toBe("[gpt-5.2 | {provider}]");
    });
    (0, vitest_1.it)("handles complex template with all variables", function () {
        var result = (0, response_prefix_template_js_1.resolveResponsePrefixTemplate)("[{identity.name}] {provider}/{model} (think:{thinkingLevel})", {
            identityName: "OpenClaw",
            provider: "anthropic",
            model: "claude-opus-4-5",
            thinkingLevel: "high",
        });
        (0, vitest_1.expect)(result).toBe("[OpenClaw] anthropic/claude-opus-4-5 (think:high)");
    });
});
(0, vitest_1.describe)("extractShortModelName", function () {
    (0, vitest_1.it)("strips provider prefix", function () {
        (0, vitest_1.expect)((0, response_prefix_template_js_1.extractShortModelName)("openai/gpt-5.2")).toBe("gpt-5.2");
        (0, vitest_1.expect)((0, response_prefix_template_js_1.extractShortModelName)("anthropic/claude-opus-4-5")).toBe("claude-opus-4-5");
        (0, vitest_1.expect)((0, response_prefix_template_js_1.extractShortModelName)("openai-codex/gpt-5.2-codex")).toBe("gpt-5.2-codex");
    });
    (0, vitest_1.it)("strips date suffix", function () {
        (0, vitest_1.expect)((0, response_prefix_template_js_1.extractShortModelName)("claude-opus-4-5-20251101")).toBe("claude-opus-4-5");
        (0, vitest_1.expect)((0, response_prefix_template_js_1.extractShortModelName)("gpt-5.2-20250115")).toBe("gpt-5.2");
    });
    (0, vitest_1.it)("strips -latest suffix", function () {
        (0, vitest_1.expect)((0, response_prefix_template_js_1.extractShortModelName)("gpt-5.2-latest")).toBe("gpt-5.2");
        (0, vitest_1.expect)((0, response_prefix_template_js_1.extractShortModelName)("claude-sonnet-latest")).toBe("claude-sonnet");
    });
    (0, vitest_1.it)("handles model without provider", function () {
        (0, vitest_1.expect)((0, response_prefix_template_js_1.extractShortModelName)("gpt-5.2")).toBe("gpt-5.2");
        (0, vitest_1.expect)((0, response_prefix_template_js_1.extractShortModelName)("claude-opus-4-5")).toBe("claude-opus-4-5");
    });
    (0, vitest_1.it)("handles full path with provider and date suffix", function () {
        (0, vitest_1.expect)((0, response_prefix_template_js_1.extractShortModelName)("anthropic/claude-opus-4-5-20251101")).toBe("claude-opus-4-5");
    });
    (0, vitest_1.it)("preserves version numbers that look like dates but are not", function () {
        // Date suffix must be exactly 8 digits at the end
        (0, vitest_1.expect)((0, response_prefix_template_js_1.extractShortModelName)("model-v1234567")).toBe("model-v1234567");
        (0, vitest_1.expect)((0, response_prefix_template_js_1.extractShortModelName)("model-123456789")).toBe("model-123456789");
    });
});
(0, vitest_1.describe)("hasTemplateVariables", function () {
    (0, vitest_1.it)("returns false for undefined", function () {
        (0, vitest_1.expect)((0, response_prefix_template_js_1.hasTemplateVariables)(undefined)).toBe(false);
    });
    (0, vitest_1.it)("returns false for empty string", function () {
        (0, vitest_1.expect)((0, response_prefix_template_js_1.hasTemplateVariables)("")).toBe(false);
    });
    (0, vitest_1.it)("returns false for static prefix", function () {
        (0, vitest_1.expect)((0, response_prefix_template_js_1.hasTemplateVariables)("[Claude]")).toBe(false);
    });
    (0, vitest_1.it)("returns true when template variables present", function () {
        (0, vitest_1.expect)((0, response_prefix_template_js_1.hasTemplateVariables)("[{model}]")).toBe(true);
        (0, vitest_1.expect)((0, response_prefix_template_js_1.hasTemplateVariables)("{provider}")).toBe(true);
        (0, vitest_1.expect)((0, response_prefix_template_js_1.hasTemplateVariables)("prefix {thinkingLevel} suffix")).toBe(true);
    });
    (0, vitest_1.it)("returns true for multiple variables", function () {
        (0, vitest_1.expect)((0, response_prefix_template_js_1.hasTemplateVariables)("[{model} | {provider}]")).toBe(true);
    });
    (0, vitest_1.it)("handles consecutive calls correctly (regex lastIndex reset)", function () {
        // First call
        (0, vitest_1.expect)((0, response_prefix_template_js_1.hasTemplateVariables)("[{model}]")).toBe(true);
        // Second call should still work
        (0, vitest_1.expect)((0, response_prefix_template_js_1.hasTemplateVariables)("[{model}]")).toBe(true);
        // Static string should return false
        (0, vitest_1.expect)((0, response_prefix_template_js_1.hasTemplateVariables)("[Claude]")).toBe(false);
    });
});
