"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteSourceInstallIssues = noteSourceInstallIssues;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var note_js_1 = require("../terminal/note.js");
function noteSourceInstallIssues(root) {
    if (!root) {
        return;
    }
    var workspaceMarker = node_path_1.default.join(root, "pnpm-workspace.yaml");
    if (!node_fs_1.default.existsSync(workspaceMarker)) {
        return;
    }
    var warnings = [];
    var nodeModules = node_path_1.default.join(root, "node_modules");
    var pnpmStore = node_path_1.default.join(nodeModules, ".pnpm");
    var tsxBin = node_path_1.default.join(nodeModules, ".bin", "tsx");
    var srcEntry = node_path_1.default.join(root, "src", "entry.ts");
    if (node_fs_1.default.existsSync(nodeModules) && !node_fs_1.default.existsSync(pnpmStore)) {
        warnings.push("- node_modules was not installed by pnpm (missing node_modules/.pnpm). Run: pnpm install");
    }
    if (node_fs_1.default.existsSync(node_path_1.default.join(root, "package-lock.json"))) {
        warnings.push("- package-lock.json present in a pnpm workspace. If you ran npm install, remove it and reinstall with pnpm.");
    }
    if (node_fs_1.default.existsSync(srcEntry) && !node_fs_1.default.existsSync(tsxBin)) {
        warnings.push("- tsx binary is missing for source runs. Run: pnpm install");
    }
    if (warnings.length > 0) {
        (0, note_js_1.note)(warnings.join("\n"), "Install");
    }
}
