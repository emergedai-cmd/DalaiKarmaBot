"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var tool_policy_js_1 = require("./tool-policy.js");
(0, vitest_1.describe)("tool-policy", function () {
    (0, vitest_1.it)("expands groups and normalizes aliases", function () {
        var expanded = (0, tool_policy_js_1.expandToolGroups)(["group:runtime", "BASH", "apply-patch", "group:fs"]);
        var set = new Set(expanded);
        (0, vitest_1.expect)(set.has("exec")).toBe(true);
        (0, vitest_1.expect)(set.has("process")).toBe(true);
        (0, vitest_1.expect)(set.has("bash")).toBe(false);
        (0, vitest_1.expect)(set.has("apply_patch")).toBe(true);
        (0, vitest_1.expect)(set.has("read")).toBe(true);
        (0, vitest_1.expect)(set.has("write")).toBe(true);
        (0, vitest_1.expect)(set.has("edit")).toBe(true);
    });
    (0, vitest_1.it)("resolves known profiles and ignores unknown ones", function () {
        var coding = (0, tool_policy_js_1.resolveToolProfilePolicy)("coding");
        (0, vitest_1.expect)(coding === null || coding === void 0 ? void 0 : coding.allow).toContain("group:fs");
        (0, vitest_1.expect)((0, tool_policy_js_1.resolveToolProfilePolicy)("nope")).toBeUndefined();
    });
    (0, vitest_1.it)("includes core tool groups in group:openclaw", function () {
        var group = tool_policy_js_1.TOOL_GROUPS["group:openclaw"];
        (0, vitest_1.expect)(group).toContain("browser");
        (0, vitest_1.expect)(group).toContain("message");
        (0, vitest_1.expect)(group).toContain("session_status");
    });
});
