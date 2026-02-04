"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var runtime_guard_js_1 = require("./runtime-guard.js");
(0, vitest_1.describe)("runtime-guard", function () {
    (0, vitest_1.it)("parses semver with or without leading v", function () {
        (0, vitest_1.expect)((0, runtime_guard_js_1.parseSemver)("v22.1.3")).toEqual({ major: 22, minor: 1, patch: 3 });
        (0, vitest_1.expect)((0, runtime_guard_js_1.parseSemver)("1.3.0")).toEqual({ major: 1, minor: 3, patch: 0 });
        (0, vitest_1.expect)((0, runtime_guard_js_1.parseSemver)("invalid")).toBeNull();
    });
    (0, vitest_1.it)("compares versions correctly", function () {
        (0, vitest_1.expect)((0, runtime_guard_js_1.isAtLeast)({ major: 22, minor: 0, patch: 0 }, { major: 22, minor: 0, patch: 0 })).toBe(true);
        (0, vitest_1.expect)((0, runtime_guard_js_1.isAtLeast)({ major: 22, minor: 1, patch: 0 }, { major: 22, minor: 0, patch: 0 })).toBe(true);
        (0, vitest_1.expect)((0, runtime_guard_js_1.isAtLeast)({ major: 21, minor: 9, patch: 0 }, { major: 22, minor: 0, patch: 0 })).toBe(false);
    });
    (0, vitest_1.it)("validates runtime thresholds", function () {
        var nodeOk = {
            kind: "node",
            version: "22.0.0",
            execPath: "/usr/bin/node",
            pathEnv: "/usr/bin",
        };
        var nodeOld = __assign(__assign({}, nodeOk), { version: "21.9.0" });
        var unknown = {
            kind: "unknown",
            version: null,
            execPath: null,
            pathEnv: "/usr/bin",
        };
        (0, vitest_1.expect)((0, runtime_guard_js_1.runtimeSatisfies)(nodeOk)).toBe(true);
        (0, vitest_1.expect)((0, runtime_guard_js_1.runtimeSatisfies)(nodeOld)).toBe(false);
        (0, vitest_1.expect)((0, runtime_guard_js_1.runtimeSatisfies)(unknown)).toBe(false);
    });
    (0, vitest_1.it)("throws via exit when runtime is too old", function () {
        var runtime = {
            log: vitest_1.vi.fn(),
            error: vitest_1.vi.fn(),
            exit: vitest_1.vi.fn(function () {
                throw new Error("exit");
            }),
        };
        var details = {
            kind: "node",
            version: "20.0.0",
            execPath: "/usr/bin/node",
            pathEnv: "/usr/bin",
        };
        (0, vitest_1.expect)(function () { return (0, runtime_guard_js_1.assertSupportedRuntime)(runtime, details); }).toThrow("exit");
        (0, vitest_1.expect)(runtime.error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("requires Node"));
    });
    (0, vitest_1.it)("returns silently when runtime meets requirements", function () {
        var runtime = {
            log: vitest_1.vi.fn(),
            error: vitest_1.vi.fn(),
            exit: vitest_1.vi.fn(),
        };
        var details = __assign(__assign({}, (0, runtime_guard_js_1.detectRuntime)()), { kind: "node", version: "22.0.0", execPath: "/usr/bin/node" });
        (0, vitest_1.expect)(function () { return (0, runtime_guard_js_1.assertSupportedRuntime)(runtime, details); }).not.toThrow();
        (0, vitest_1.expect)(runtime.exit).not.toHaveBeenCalled();
    });
});
