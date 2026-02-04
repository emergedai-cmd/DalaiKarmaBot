"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var shell_utils_js_1 = require("./shell-utils.js");
var isWin = process.platform === "win32";
(0, vitest_1.describe)("getShellConfig", function () {
    var originalShell = process.env.SHELL;
    var originalPath = process.env.PATH;
    var tempDirs = [];
    var createTempBin = function (files) {
        var dir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-shell-"));
        tempDirs.push(dir);
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var name_1 = files_1[_i];
            var filePath = node_path_1.default.join(dir, name_1);
            node_fs_1.default.writeFileSync(filePath, "");
            node_fs_1.default.chmodSync(filePath, 493);
        }
        return dir;
    };
    (0, vitest_1.beforeEach)(function () {
        if (!isWin) {
            process.env.SHELL = "/usr/bin/fish";
        }
    });
    (0, vitest_1.afterEach)(function () {
        if (originalShell == null) {
            delete process.env.SHELL;
        }
        else {
            process.env.SHELL = originalShell;
        }
        if (originalPath == null) {
            delete process.env.PATH;
        }
        else {
            process.env.PATH = originalPath;
        }
        for (var _i = 0, _a = tempDirs.splice(0); _i < _a.length; _i++) {
            var dir = _a[_i];
            node_fs_1.default.rmSync(dir, { recursive: true, force: true });
        }
    });
    if (isWin) {
        (0, vitest_1.it)("uses PowerShell on Windows", function () {
            var shell = (0, shell_utils_js_1.getShellConfig)().shell;
            (0, vitest_1.expect)(shell.toLowerCase()).toContain("powershell");
        });
        return;
    }
    (0, vitest_1.it)("prefers bash when fish is default and bash is on PATH", function () {
        var binDir = createTempBin(["bash"]);
        process.env.PATH = binDir;
        var shell = (0, shell_utils_js_1.getShellConfig)().shell;
        (0, vitest_1.expect)(shell).toBe(node_path_1.default.join(binDir, "bash"));
    });
    (0, vitest_1.it)("falls back to sh when fish is default and bash is missing", function () {
        var binDir = createTempBin(["sh"]);
        process.env.PATH = binDir;
        var shell = (0, shell_utils_js_1.getShellConfig)().shell;
        (0, vitest_1.expect)(shell).toBe(node_path_1.default.join(binDir, "sh"));
    });
    (0, vitest_1.it)("falls back to env shell when fish is default and no sh is available", function () {
        process.env.PATH = "";
        var shell = (0, shell_utils_js_1.getShellConfig)().shell;
        (0, vitest_1.expect)(shell).toBe("/usr/bin/fish");
    });
    (0, vitest_1.it)("uses sh when SHELL is unset", function () {
        delete process.env.SHELL;
        process.env.PATH = "";
        var shell = (0, shell_utils_js_1.getShellConfig)().shell;
        (0, vitest_1.expect)(shell).toBe("sh");
    });
});
