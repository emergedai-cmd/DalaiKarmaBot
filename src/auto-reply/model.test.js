"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var model_js_1 = require("./model.js");
(0, vitest_1.describe)("extractModelDirective", function () {
    (0, vitest_1.describe)("basic /model command", function () {
        (0, vitest_1.it)("extracts /model with argument", function () {
            var result = (0, model_js_1.extractModelDirective)("/model gpt-5");
            (0, vitest_1.expect)(result.hasDirective).toBe(true);
            (0, vitest_1.expect)(result.rawModel).toBe("gpt-5");
            (0, vitest_1.expect)(result.cleaned).toBe("");
        });
        (0, vitest_1.it)("does not treat /models as a /model directive", function () {
            var result = (0, model_js_1.extractModelDirective)("/models gpt-5");
            (0, vitest_1.expect)(result.hasDirective).toBe(false);
            (0, vitest_1.expect)(result.rawModel).toBeUndefined();
            (0, vitest_1.expect)(result.cleaned).toBe("/models gpt-5");
        });
        (0, vitest_1.it)("does not parse /models as a /model directive (no args)", function () {
            var result = (0, model_js_1.extractModelDirective)("/models");
            (0, vitest_1.expect)(result.hasDirective).toBe(false);
            (0, vitest_1.expect)(result.cleaned).toBe("/models");
        });
        (0, vitest_1.it)("extracts /model with provider/model format", function () {
            var result = (0, model_js_1.extractModelDirective)("/model anthropic/claude-opus-4-5");
            (0, vitest_1.expect)(result.hasDirective).toBe(true);
            (0, vitest_1.expect)(result.rawModel).toBe("anthropic/claude-opus-4-5");
        });
        (0, vitest_1.it)("extracts /model with profile override", function () {
            var result = (0, model_js_1.extractModelDirective)("/model gpt-5@myprofile");
            (0, vitest_1.expect)(result.hasDirective).toBe(true);
            (0, vitest_1.expect)(result.rawModel).toBe("gpt-5");
            (0, vitest_1.expect)(result.rawProfile).toBe("myprofile");
        });
        (0, vitest_1.it)("returns no directive for plain text", function () {
            var result = (0, model_js_1.extractModelDirective)("hello world");
            (0, vitest_1.expect)(result.hasDirective).toBe(false);
            (0, vitest_1.expect)(result.cleaned).toBe("hello world");
        });
    });
    (0, vitest_1.describe)("alias shortcuts", function () {
        (0, vitest_1.it)("recognizes /gpt as model directive when alias is configured", function () {
            var result = (0, model_js_1.extractModelDirective)("/gpt", {
                aliases: ["gpt", "sonnet", "opus"],
            });
            (0, vitest_1.expect)(result.hasDirective).toBe(true);
            (0, vitest_1.expect)(result.rawModel).toBe("gpt");
            (0, vitest_1.expect)(result.cleaned).toBe("");
        });
        (0, vitest_1.it)("recognizes /gpt: as model directive when alias is configured", function () {
            var result = (0, model_js_1.extractModelDirective)("/gpt:", {
                aliases: ["gpt", "sonnet", "opus"],
            });
            (0, vitest_1.expect)(result.hasDirective).toBe(true);
            (0, vitest_1.expect)(result.rawModel).toBe("gpt");
            (0, vitest_1.expect)(result.cleaned).toBe("");
        });
        (0, vitest_1.it)("recognizes /sonnet as model directive", function () {
            var result = (0, model_js_1.extractModelDirective)("/sonnet", {
                aliases: ["gpt", "sonnet", "opus"],
            });
            (0, vitest_1.expect)(result.hasDirective).toBe(true);
            (0, vitest_1.expect)(result.rawModel).toBe("sonnet");
        });
        (0, vitest_1.it)("recognizes alias mid-message", function () {
            var result = (0, model_js_1.extractModelDirective)("switch to /opus please", {
                aliases: ["opus"],
            });
            (0, vitest_1.expect)(result.hasDirective).toBe(true);
            (0, vitest_1.expect)(result.rawModel).toBe("opus");
            (0, vitest_1.expect)(result.cleaned).toBe("switch to please");
        });
        (0, vitest_1.it)("is case-insensitive for aliases", function () {
            var result = (0, model_js_1.extractModelDirective)("/GPT", { aliases: ["gpt"] });
            (0, vitest_1.expect)(result.hasDirective).toBe(true);
            (0, vitest_1.expect)(result.rawModel).toBe("GPT");
        });
        (0, vitest_1.it)("does not match alias without leading slash", function () {
            var result = (0, model_js_1.extractModelDirective)("gpt is great", {
                aliases: ["gpt"],
            });
            (0, vitest_1.expect)(result.hasDirective).toBe(false);
        });
        (0, vitest_1.it)("does not match unknown aliases", function () {
            var result = (0, model_js_1.extractModelDirective)("/unknown", {
                aliases: ["gpt", "sonnet"],
            });
            (0, vitest_1.expect)(result.hasDirective).toBe(false);
            (0, vitest_1.expect)(result.cleaned).toBe("/unknown");
        });
        (0, vitest_1.it)("prefers /model over alias when both present", function () {
            var result = (0, model_js_1.extractModelDirective)("/model haiku", {
                aliases: ["gpt"],
            });
            (0, vitest_1.expect)(result.hasDirective).toBe(true);
            (0, vitest_1.expect)(result.rawModel).toBe("haiku");
        });
        (0, vitest_1.it)("handles empty aliases array", function () {
            var result = (0, model_js_1.extractModelDirective)("/gpt", { aliases: [] });
            (0, vitest_1.expect)(result.hasDirective).toBe(false);
        });
        (0, vitest_1.it)("handles undefined aliases", function () {
            var result = (0, model_js_1.extractModelDirective)("/gpt");
            (0, vitest_1.expect)(result.hasDirective).toBe(false);
        });
    });
    (0, vitest_1.describe)("edge cases", function () {
        (0, vitest_1.it)("absorbs path-like segments when /model includes extra slashes", function () {
            var result = (0, model_js_1.extractModelDirective)("thats not /model gpt-5/tmp/hello");
            (0, vitest_1.expect)(result.hasDirective).toBe(true);
            (0, vitest_1.expect)(result.cleaned).toBe("thats not");
        });
        (0, vitest_1.it)("handles alias with special regex characters", function () {
            var result = (0, model_js_1.extractModelDirective)("/test.alias", {
                aliases: ["test.alias"],
            });
            (0, vitest_1.expect)(result.hasDirective).toBe(true);
            (0, vitest_1.expect)(result.rawModel).toBe("test.alias");
        });
        (0, vitest_1.it)("does not match partial alias", function () {
            var result = (0, model_js_1.extractModelDirective)("/gpt-turbo", { aliases: ["gpt"] });
            (0, vitest_1.expect)(result.hasDirective).toBe(false);
        });
        (0, vitest_1.it)("handles empty body", function () {
            var result = (0, model_js_1.extractModelDirective)("", { aliases: ["gpt"] });
            (0, vitest_1.expect)(result.hasDirective).toBe(false);
            (0, vitest_1.expect)(result.cleaned).toBe("");
        });
        (0, vitest_1.it)("handles undefined body", function () {
            var result = (0, model_js_1.extractModelDirective)(undefined, { aliases: ["gpt"] });
            (0, vitest_1.expect)(result.hasDirective).toBe(false);
        });
    });
});
