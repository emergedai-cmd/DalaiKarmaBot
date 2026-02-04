"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var tool_policy_js_1 = require("./tool-policy.js");
var pluginGroups = {
    all: ["lobster", "workflow_tool"],
    byPlugin: new Map([["lobster", ["lobster", "workflow_tool"]]]),
};
var coreTools = new Set(["read", "write", "exec", "session_status"]);
(0, vitest_1.describe)("stripPluginOnlyAllowlist", function () {
    (0, vitest_1.it)("strips allowlist when it only targets plugin tools", function () {
        var _a;
        var policy = (0, tool_policy_js_1.stripPluginOnlyAllowlist)({ allow: ["lobster"] }, pluginGroups, coreTools);
        (0, vitest_1.expect)((_a = policy.policy) === null || _a === void 0 ? void 0 : _a.allow).toBeUndefined();
        (0, vitest_1.expect)(policy.unknownAllowlist).toEqual([]);
    });
    (0, vitest_1.it)("strips allowlist when it only targets plugin groups", function () {
        var _a;
        var policy = (0, tool_policy_js_1.stripPluginOnlyAllowlist)({ allow: ["group:plugins"] }, pluginGroups, coreTools);
        (0, vitest_1.expect)((_a = policy.policy) === null || _a === void 0 ? void 0 : _a.allow).toBeUndefined();
        (0, vitest_1.expect)(policy.unknownAllowlist).toEqual([]);
    });
    (0, vitest_1.it)('keeps allowlist when it uses "*"', function () {
        var _a;
        var policy = (0, tool_policy_js_1.stripPluginOnlyAllowlist)({ allow: ["*"] }, pluginGroups, coreTools);
        (0, vitest_1.expect)((_a = policy.policy) === null || _a === void 0 ? void 0 : _a.allow).toEqual(["*"]);
        (0, vitest_1.expect)(policy.unknownAllowlist).toEqual([]);
    });
    (0, vitest_1.it)("keeps allowlist when it mixes plugin and core entries", function () {
        var _a;
        var policy = (0, tool_policy_js_1.stripPluginOnlyAllowlist)({ allow: ["lobster", "read"] }, pluginGroups, coreTools);
        (0, vitest_1.expect)((_a = policy.policy) === null || _a === void 0 ? void 0 : _a.allow).toEqual(["lobster", "read"]);
        (0, vitest_1.expect)(policy.unknownAllowlist).toEqual([]);
    });
    (0, vitest_1.it)("strips allowlist with unknown entries when no core tools match", function () {
        var _a;
        var emptyPlugins = { all: [], byPlugin: new Map() };
        var policy = (0, tool_policy_js_1.stripPluginOnlyAllowlist)({ allow: ["lobster"] }, emptyPlugins, coreTools);
        (0, vitest_1.expect)((_a = policy.policy) === null || _a === void 0 ? void 0 : _a.allow).toBeUndefined();
        (0, vitest_1.expect)(policy.unknownAllowlist).toEqual(["lobster"]);
    });
    (0, vitest_1.it)("keeps allowlist with core tools and reports unknown entries", function () {
        var _a;
        var emptyPlugins = { all: [], byPlugin: new Map() };
        var policy = (0, tool_policy_js_1.stripPluginOnlyAllowlist)({ allow: ["read", "lobster"] }, emptyPlugins, coreTools);
        (0, vitest_1.expect)((_a = policy.policy) === null || _a === void 0 ? void 0 : _a.allow).toEqual(["read", "lobster"]);
        (0, vitest_1.expect)(policy.unknownAllowlist).toEqual(["lobster"]);
    });
});
