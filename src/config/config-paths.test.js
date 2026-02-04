"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var config_paths_js_1 = require("./config-paths.js");
(0, vitest_1.describe)("config paths", function () {
    (0, vitest_1.it)("rejects empty and blocked paths", function () {
        (0, vitest_1.expect)((0, config_paths_js_1.parseConfigPath)("")).toEqual({
            ok: false,
            error: "Invalid path. Use dot notation (e.g. foo.bar).",
        });
        (0, vitest_1.expect)((0, config_paths_js_1.parseConfigPath)("__proto__.polluted").ok).toBe(false);
        (0, vitest_1.expect)((0, config_paths_js_1.parseConfigPath)("constructor.polluted").ok).toBe(false);
        (0, vitest_1.expect)((0, config_paths_js_1.parseConfigPath)("prototype.polluted").ok).toBe(false);
    });
    (0, vitest_1.it)("sets, gets, and unsets nested values", function () {
        var root = {};
        var parsed = (0, config_paths_js_1.parseConfigPath)("foo.bar");
        if (!parsed.ok || !parsed.path) {
            throw new Error("path parse failed");
        }
        (0, config_paths_js_1.setConfigValueAtPath)(root, parsed.path, 123);
        (0, vitest_1.expect)((0, config_paths_js_1.getConfigValueAtPath)(root, parsed.path)).toBe(123);
        (0, vitest_1.expect)((0, config_paths_js_1.unsetConfigValueAtPath)(root, parsed.path)).toBe(true);
        (0, vitest_1.expect)((0, config_paths_js_1.getConfigValueAtPath)(root, parsed.path)).toBeUndefined();
    });
});
