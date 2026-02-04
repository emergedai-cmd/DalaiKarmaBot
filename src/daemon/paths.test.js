"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var paths_js_1 = require("./paths.js");
(0, vitest_1.describe)("resolveGatewayStateDir", function () {
    (0, vitest_1.it)("uses the default state dir when no overrides are set", function () {
        var env = { HOME: "/Users/test" };
        (0, vitest_1.expect)((0, paths_js_1.resolveGatewayStateDir)(env)).toBe(node_path_1.default.join("/Users/test", ".openclaw"));
    });
    (0, vitest_1.it)("appends the profile suffix when set", function () {
        var env = { HOME: "/Users/test", OPENCLAW_PROFILE: "rescue" };
        (0, vitest_1.expect)((0, paths_js_1.resolveGatewayStateDir)(env)).toBe(node_path_1.default.join("/Users/test", ".openclaw-rescue"));
    });
    (0, vitest_1.it)("treats default profiles as the base state dir", function () {
        var env = { HOME: "/Users/test", OPENCLAW_PROFILE: "Default" };
        (0, vitest_1.expect)((0, paths_js_1.resolveGatewayStateDir)(env)).toBe(node_path_1.default.join("/Users/test", ".openclaw"));
    });
    (0, vitest_1.it)("uses OPENCLAW_STATE_DIR when provided", function () {
        var env = { HOME: "/Users/test", OPENCLAW_STATE_DIR: "/var/lib/openclaw" };
        (0, vitest_1.expect)((0, paths_js_1.resolveGatewayStateDir)(env)).toBe(node_path_1.default.resolve("/var/lib/openclaw"));
    });
    (0, vitest_1.it)("expands ~ in OPENCLAW_STATE_DIR", function () {
        var env = { HOME: "/Users/test", OPENCLAW_STATE_DIR: "~/openclaw-state" };
        (0, vitest_1.expect)((0, paths_js_1.resolveGatewayStateDir)(env)).toBe(node_path_1.default.resolve("/Users/test/openclaw-state"));
    });
    (0, vitest_1.it)("preserves Windows absolute paths without HOME", function () {
        var env = { OPENCLAW_STATE_DIR: "C:\\State\\openclaw" };
        (0, vitest_1.expect)((0, paths_js_1.resolveGatewayStateDir)(env)).toBe("C:\\State\\openclaw");
    });
});
