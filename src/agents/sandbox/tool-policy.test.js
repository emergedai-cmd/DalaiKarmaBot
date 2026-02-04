"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var tool_policy_js_1 = require("./tool-policy.js");
(0, vitest_1.describe)("sandbox tool policy", function () {
    (0, vitest_1.it)("allows all tools with * allow", function () {
        var policy = { allow: ["*"], deny: [] };
        (0, vitest_1.expect)((0, tool_policy_js_1.isToolAllowed)(policy, "browser")).toBe(true);
    });
    (0, vitest_1.it)("denies all tools with * deny", function () {
        var policy = { allow: [], deny: ["*"] };
        (0, vitest_1.expect)((0, tool_policy_js_1.isToolAllowed)(policy, "read")).toBe(false);
    });
    (0, vitest_1.it)("supports wildcard patterns", function () {
        var policy = { allow: ["web_*"] };
        (0, vitest_1.expect)((0, tool_policy_js_1.isToolAllowed)(policy, "web_fetch")).toBe(true);
        (0, vitest_1.expect)((0, tool_policy_js_1.isToolAllowed)(policy, "read")).toBe(false);
    });
});
