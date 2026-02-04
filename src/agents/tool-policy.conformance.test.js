"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var tool_policy_conformance_js_1 = require("./tool-policy.conformance.js");
var tool_policy_js_1 = require("./tool-policy.js");
(0, vitest_1.describe)("TOOL_POLICY_CONFORMANCE", function () {
    (0, vitest_1.test)("matches exported TOOL_GROUPS exactly", function () {
        (0, vitest_1.expect)(tool_policy_conformance_js_1.TOOL_POLICY_CONFORMANCE.toolGroups).toEqual(tool_policy_js_1.TOOL_GROUPS);
    });
    (0, vitest_1.test)("is JSON-serializable", function () {
        (0, vitest_1.expect)(function () { return JSON.stringify(tool_policy_conformance_js_1.TOOL_POLICY_CONFORMANCE); }).not.toThrow();
    });
});
