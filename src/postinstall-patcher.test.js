"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var postinstall_js_1 = require("../scripts/postinstall.js");
function makeTempDir() {
    return node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-patch-"));
}
(0, vitest_1.describe)("postinstall patcher", function () {
    (0, vitest_1.it)("detects package manager from user agent", function () {
        (0, vitest_1.expect)((0, postinstall_js_1.detectPackageManager)("pnpm/10.0.0 npm/? node/v22.0.0")).toBe("pnpm");
        (0, vitest_1.expect)((0, postinstall_js_1.detectPackageManager)("npm/10.9.0 node/v22.0.0")).toBe("npm");
        (0, vitest_1.expect)((0, postinstall_js_1.detectPackageManager)("bun/1.2.2")).toBe("bun");
        (0, vitest_1.expect)((0, postinstall_js_1.detectPackageManager)("yarn/4.0.0 npm/? node/v22.0.0")).toBe("yarn");
        (0, vitest_1.expect)((0, postinstall_js_1.detectPackageManager)("")).toBe("unknown");
    });
    (0, vitest_1.it)("skips pnpm.patchedDependencies fallback for pnpm", function () {
        (0, vitest_1.expect)((0, postinstall_js_1.shouldApplyPnpmPatchedDependenciesFallback)("pnpm")).toBe(false);
        (0, vitest_1.expect)((0, postinstall_js_1.shouldApplyPnpmPatchedDependenciesFallback)("npm")).toBe(true);
        (0, vitest_1.expect)((0, postinstall_js_1.shouldApplyPnpmPatchedDependenciesFallback)("bun")).toBe(true);
        (0, vitest_1.expect)((0, postinstall_js_1.shouldApplyPnpmPatchedDependenciesFallback)("unknown")).toBe(true);
    });
    (0, vitest_1.it)("applies a simple patch", function () {
        var dir = makeTempDir();
        var target = node_path_1.default.join(dir, "lib");
        node_fs_1.default.mkdirSync(target);
        var filePath = node_path_1.default.join(target, "main.js");
        var original = "".concat([
            "var QRCode = require('./../vendor/QRCode'),",
            "    QRErrorCorrectLevel = require('./../vendor/QRCode/QRErrorCorrectLevel'),",
            '    black = "\\033[40m  \\033[0m",',
            '    white = "\\033[47m  \\033[0m",',
            "    toCell = function (isBlack) {",
        ].join("\n"), "\n");
        node_fs_1.default.writeFileSync(filePath, original, "utf-8");
        var patchText = "diff --git a/lib/main.js b/lib/main.js\nindex 0000000..1111111 100644\n--- a/lib/main.js\n+++ b/lib/main.js\n@@ -1,5 +1,5 @@\n-var QRCode = require('./../vendor/QRCode'),\n-    QRErrorCorrectLevel = require('./../vendor/QRCode/QRErrorCorrectLevel'),\n+var QRCode = require('./../vendor/QRCode/index.js'),\n+    QRErrorCorrectLevel = require('./../vendor/QRCode/QRErrorCorrectLevel.js'),\n     black = \"\\033[40m  \\033[0m\",\n     white = \"\\033[47m  \\033[0m\",\n     toCell = function (isBlack) {\n";
        (0, postinstall_js_1.applyPatchSet)({ patchText: patchText, targetDir: dir });
        var updated = node_fs_1.default.readFileSync(filePath, "utf-8");
        (0, vitest_1.expect)(updated).toBe("".concat([
            "var QRCode = require('./../vendor/QRCode/index.js'),",
            "    QRErrorCorrectLevel = require('./../vendor/QRCode/QRErrorCorrectLevel.js'),",
            '    black = "\\033[40m  \\033[0m",',
            '    white = "\\033[47m  \\033[0m",',
            "    toCell = function (isBlack) {",
        ].join("\n"), "\n"));
        node_fs_1.default.rmSync(dir, { recursive: true, force: true });
    });
    (0, vitest_1.it)("treats already-applied hunks as no-ops", function () {
        var dir = makeTempDir();
        var target = node_path_1.default.join(dir, "lib");
        node_fs_1.default.mkdirSync(target);
        var filePath = node_path_1.default.join(target, "main.js");
        var original = "".concat([
            "var QRCode = require('./../vendor/QRCode'),",
            "    QRErrorCorrectLevel = require('./../vendor/QRCode/QRErrorCorrectLevel'),",
            '    black = "\\033[40m  \\033[0m",',
            '    white = "\\033[47m  \\033[0m",',
            "    toCell = function (isBlack) {",
        ].join("\n"), "\n");
        node_fs_1.default.writeFileSync(filePath, original, "utf-8");
        var patchText = "diff --git a/lib/main.js b/lib/main.js\nindex 0000000..1111111 100644\n--- a/lib/main.js\n+++ b/lib/main.js\n@@ -1,5 +1,5 @@\n-var QRCode = require('./../vendor/QRCode'),\n-    QRErrorCorrectLevel = require('./../vendor/QRCode/QRErrorCorrectLevel'),\n+var QRCode = require('./../vendor/QRCode/index.js'),\n+    QRErrorCorrectLevel = require('./../vendor/QRCode/QRErrorCorrectLevel.js'),\n     black = \"\\033[40m  \\033[0m\",\n     white = \"\\033[47m  \\033[0m\",\n     toCell = function (isBlack) {\n";
        (0, postinstall_js_1.applyPatchSet)({ patchText: patchText, targetDir: dir });
        (0, postinstall_js_1.applyPatchSet)({ patchText: patchText, targetDir: dir });
        var updated = node_fs_1.default.readFileSync(filePath, "utf-8");
        (0, vitest_1.expect)(updated).toBe("".concat([
            "var QRCode = require('./../vendor/QRCode/index.js'),",
            "    QRErrorCorrectLevel = require('./../vendor/QRCode/QRErrorCorrectLevel.js'),",
            '    black = "\\033[40m  \\033[0m",',
            '    white = "\\033[47m  \\033[0m",',
            "    toCell = function (isBlack) {",
        ].join("\n"), "\n"));
        node_fs_1.default.rmSync(dir, { recursive: true, force: true });
    });
    (0, vitest_1.it)("handles multiple hunks with offsets", function () {
        var dir = makeTempDir();
        var filePath = node_path_1.default.join(dir, "file.txt");
        node_fs_1.default.writeFileSync(filePath, "".concat(["alpha", "beta", "gamma", "delta", "epsilon"].join("\n"), "\n"), "utf-8");
        var patchText = "diff --git a/file.txt b/file.txt\n--- a/file.txt\n+++ b/file.txt\n@@ -1,3 +1,4 @@\n alpha\n beta\n+beta2\n gamma\n@@ -3,3 +4,4 @@\n gamma\n-delta\n+DELTA\n epsilon\n+zeta\n";
        (0, postinstall_js_1.applyPatchSet)({ patchText: patchText, targetDir: dir });
        var updated = node_fs_1.default.readFileSync(filePath, "utf-8").trim().split("\n");
        (0, vitest_1.expect)(updated).toEqual(["alpha", "beta", "beta2", "gamma", "DELTA", "epsilon", "zeta"]);
        node_fs_1.default.rmSync(dir, { recursive: true, force: true });
    });
    (0, vitest_1.it)("throws on context mismatch", function () {
        var dir = makeTempDir();
        var filePath = node_path_1.default.join(dir, "file.txt");
        node_fs_1.default.writeFileSync(filePath, "hello\nworld\n", "utf-8");
        var patchText = "diff --git a/file.txt b/file.txt\n--- a/file.txt\n+++ b/file.txt\n@@ -1,2 +1,2 @@\n-hola\n+hi\n world\n";
        (0, vitest_1.expect)(function () { return (0, postinstall_js_1.applyPatchSet)({ patchText: patchText, targetDir: dir }); }).toThrow();
        node_fs_1.default.rmSync(dir, { recursive: true, force: true });
    });
});
