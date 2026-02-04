"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var shell_env_js_1 = require("./shell-env.js");
(0, vitest_1.describe)("getShellPathFromLoginShell", function () {
    (0, vitest_1.afterEach)(function () { return (0, shell_env_js_1.resetShellPathCacheForTests)(); });
    (0, vitest_1.it)("returns PATH from login shell env", function () {
        if (process.platform === "win32") {
            return;
        }
        var exec = vitest_1.vi
            .fn()
            .mockReturnValue(Buffer.from("PATH=/custom/bin\0HOME=/home/user\0", "utf-8"));
        var result = (0, shell_env_js_1.getShellPathFromLoginShell)({ env: { SHELL: "/bin/sh" }, exec: exec });
        (0, vitest_1.expect)(result).toBe("/custom/bin");
    });
    (0, vitest_1.it)("caches the value", function () {
        if (process.platform === "win32") {
            return;
        }
        var exec = vitest_1.vi.fn().mockReturnValue(Buffer.from("PATH=/custom/bin\0", "utf-8"));
        var env = { SHELL: "/bin/sh" };
        (0, vitest_1.expect)((0, shell_env_js_1.getShellPathFromLoginShell)({ env: env, exec: exec })).toBe("/custom/bin");
        (0, vitest_1.expect)((0, shell_env_js_1.getShellPathFromLoginShell)({ env: env, exec: exec })).toBe("/custom/bin");
        (0, vitest_1.expect)(exec).toHaveBeenCalledTimes(1);
    });
    (0, vitest_1.it)("returns null on exec failure", function () {
        if (process.platform === "win32") {
            return;
        }
        var exec = vitest_1.vi.fn(function () {
            throw new Error("boom");
        });
        var result = (0, shell_env_js_1.getShellPathFromLoginShell)({ env: { SHELL: "/bin/sh" }, exec: exec });
        (0, vitest_1.expect)(result).toBeNull();
    });
});
