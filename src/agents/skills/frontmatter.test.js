"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var frontmatter_js_1 = require("./frontmatter.js");
(0, vitest_1.describe)("resolveSkillInvocationPolicy", function () {
    (0, vitest_1.it)("defaults to enabled behaviors", function () {
        var policy = (0, frontmatter_js_1.resolveSkillInvocationPolicy)({});
        (0, vitest_1.expect)(policy.userInvocable).toBe(true);
        (0, vitest_1.expect)(policy.disableModelInvocation).toBe(false);
    });
    (0, vitest_1.it)("parses frontmatter boolean strings", function () {
        var policy = (0, frontmatter_js_1.resolveSkillInvocationPolicy)({
            "user-invocable": "no",
            "disable-model-invocation": "yes",
        });
        (0, vitest_1.expect)(policy.userInvocable).toBe(false);
        (0, vitest_1.expect)(policy.disableModelInvocation).toBe(true);
    });
});
