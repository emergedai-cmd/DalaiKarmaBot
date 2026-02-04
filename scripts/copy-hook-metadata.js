#!/usr/bin/env tsx
"use strict";
/**
 * Copy HOOK.md files from src/hooks/bundled to dist/hooks/bundled
 */
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var __dirname = node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url));
var projectRoot = node_path_1.default.resolve(__dirname, "..");
var srcBundled = node_path_1.default.join(projectRoot, "src", "hooks", "bundled");
var distBundled = node_path_1.default.join(projectRoot, "dist", "hooks", "bundled");
function copyHookMetadata() {
    if (!node_fs_1.default.existsSync(srcBundled)) {
        console.warn("[copy-hook-metadata] Source directory not found:", srcBundled);
        return;
    }
    if (!node_fs_1.default.existsSync(distBundled)) {
        node_fs_1.default.mkdirSync(distBundled, { recursive: true });
    }
    var entries = node_fs_1.default.readdirSync(srcBundled, { withFileTypes: true });
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        if (!entry.isDirectory()) {
            continue;
        }
        var hookName = entry.name;
        var srcHookDir = node_path_1.default.join(srcBundled, hookName);
        var distHookDir = node_path_1.default.join(distBundled, hookName);
        var srcHookMd = node_path_1.default.join(srcHookDir, "HOOK.md");
        var distHookMd = node_path_1.default.join(distHookDir, "HOOK.md");
        if (!node_fs_1.default.existsSync(srcHookMd)) {
            console.warn("[copy-hook-metadata] No HOOK.md found for ".concat(hookName));
            continue;
        }
        if (!node_fs_1.default.existsSync(distHookDir)) {
            node_fs_1.default.mkdirSync(distHookDir, { recursive: true });
        }
        node_fs_1.default.copyFileSync(srcHookMd, distHookMd);
        console.log("[copy-hook-metadata] Copied ".concat(hookName, "/HOOK.md"));
    }
    console.log("[copy-hook-metadata] Done");
}
copyHookMetadata();
