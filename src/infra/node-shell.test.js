"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var node_shell_js_1 = require("./node-shell.js");
(0, vitest_1.describe)("buildNodeShellCommand", function () {
    (0, vitest_1.it)("uses cmd.exe for win32", function () {
        (0, vitest_1.expect)((0, node_shell_js_1.buildNodeShellCommand)("echo hi", "win32")).toEqual([
            "cmd.exe",
            "/d",
            "/s",
            "/c",
            "echo hi",
        ]);
    });
    (0, vitest_1.it)("uses cmd.exe for windows labels", function () {
        (0, vitest_1.expect)((0, node_shell_js_1.buildNodeShellCommand)("echo hi", "windows")).toEqual([
            "cmd.exe",
            "/d",
            "/s",
            "/c",
            "echo hi",
        ]);
        (0, vitest_1.expect)((0, node_shell_js_1.buildNodeShellCommand)("echo hi", "Windows 11")).toEqual([
            "cmd.exe",
            "/d",
            "/s",
            "/c",
            "echo hi",
        ]);
    });
    (0, vitest_1.it)("uses /bin/sh for darwin", function () {
        (0, vitest_1.expect)((0, node_shell_js_1.buildNodeShellCommand)("echo hi", "darwin")).toEqual(["/bin/sh", "-lc", "echo hi"]);
    });
    (0, vitest_1.it)("uses /bin/sh when platform missing", function () {
        (0, vitest_1.expect)((0, node_shell_js_1.buildNodeShellCommand)("echo hi")).toEqual(["/bin/sh", "-lc", "echo hi"]);
    });
});
