"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var format_staged_js_1 = require("../scripts/format-staged.js");
var setup_git_hooks_js_1 = require("../scripts/setup-git-hooks.js");
function makeTempDir() {
    return node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hooks-"));
}
(0, vitest_1.describe)("format-staged helpers", function () {
    (0, vitest_1.it)("splits null-delimited output", function () {
        (0, vitest_1.expect)((0, format_staged_js_1.splitNullDelimited)("a\0b\0")).toEqual(["a", "b"]);
        (0, vitest_1.expect)((0, format_staged_js_1.splitNullDelimited)("")).toEqual([]);
    });
    (0, vitest_1.it)("filters oxfmt targets", function () {
        var targets = (0, format_staged_js_1.filterOxfmtTargets)([
            "src/app.ts",
            "src/app.md",
            "test/foo.tsx",
            "scripts/dev.ts",
            "test\\bar.js",
        ]);
        (0, vitest_1.expect)(targets).toEqual(["src/app.ts", "test/foo.tsx", "test/bar.js"]);
    });
    (0, vitest_1.it)("detects partially staged files", function () {
        var partial = (0, format_staged_js_1.findPartiallyStagedFiles)(["src/a.ts", "test/b.tsx"], ["src/a.ts", "docs/readme.md"]);
        (0, vitest_1.expect)(partial).toEqual(["src/a.ts"]);
    });
    (0, vitest_1.it)("filters out partial targets", function () {
        var filtered = (0, format_staged_js_1.filterOutPartialTargets)(["src/a.ts", "test/b.tsx", "test/c.ts"], ["test/b.tsx"]);
        (0, vitest_1.expect)(filtered).toEqual(["src/a.ts", "test/c.ts"]);
    });
});
(0, vitest_1.describe)("setupGitHooks", function () {
    (0, vitest_1.it)("returns git-missing when git is unavailable", function () {
        var runGit = vitest_1.vi.fn(function () { return ({ status: 1, stdout: "" }); });
        var result = (0, setup_git_hooks_js_1.setupGitHooks)({ repoRoot: "/tmp", runGit: runGit });
        (0, vitest_1.expect)(result).toEqual({ ok: false, reason: "git-missing" });
        (0, vitest_1.expect)(runGit).toHaveBeenCalled();
    });
    (0, vitest_1.it)("returns not-repo when not inside a work tree", function () {
        var runGit = vitest_1.vi.fn(function (args) {
            if (args[0] === "--version") {
                return { status: 0, stdout: "git version" };
            }
            if (args[0] === "rev-parse") {
                return { status: 0, stdout: "false" };
            }
            return { status: 1, stdout: "" };
        });
        var result = (0, setup_git_hooks_js_1.setupGitHooks)({ repoRoot: "/tmp", runGit: runGit });
        (0, vitest_1.expect)(result).toEqual({ ok: false, reason: "not-repo" });
    });
    (0, vitest_1.it)("configures hooks path when inside a repo", function () {
        var repoRoot = makeTempDir();
        var hooksDir = node_path_1.default.join(repoRoot, "git-hooks");
        node_fs_1.default.mkdirSync(hooksDir, { recursive: true });
        var hookPath = node_path_1.default.join(hooksDir, "pre-commit");
        node_fs_1.default.writeFileSync(hookPath, "#!/bin/sh\n", "utf-8");
        node_fs_1.default.chmodSync(hookPath, 420);
        var runGit = vitest_1.vi.fn(function (args) {
            if (args[0] === "--version") {
                return { status: 0, stdout: "git version" };
            }
            if (args[0] === "rev-parse") {
                return { status: 0, stdout: "true" };
            }
            if (args[0] === "config") {
                return { status: 0, stdout: "" };
            }
            return { status: 1, stdout: "" };
        });
        var result = (0, setup_git_hooks_js_1.setupGitHooks)({ repoRoot: repoRoot, runGit: runGit });
        (0, vitest_1.expect)(result).toEqual({ ok: true });
        (0, vitest_1.expect)(runGit.mock.calls.some(function (_a) {
            var args = _a[0];
            return args[0] === "config";
        })).toBe(true);
        if (process.platform !== "win32") {
            var mode = node_fs_1.default.statSync(hookPath).mode & 511;
            (0, vitest_1.expect)(mode & 64).toBeTruthy();
        }
        node_fs_1.default.rmSync(repoRoot, { recursive: true, force: true });
    });
});
