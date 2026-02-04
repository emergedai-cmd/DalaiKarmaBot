#!/usr/bin/env -S node --import tsx
"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_child_process_1 = require("node:child_process");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var requiredPaths = ["dist/discord/send.js", "dist/hooks/gmail.js", "dist/whatsapp/normalize.js"];
var forbiddenPrefixes = ["dist/OpenClaw.app/"];
function runPackDry() {
    var raw = (0, node_child_process_1.execSync)("npm pack --dry-run --json --ignore-scripts", {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        maxBuffer: 1024 * 1024 * 100,
    });
    return JSON.parse(raw);
}
function checkPluginVersions() {
    var rootPackagePath = (0, node_path_1.resolve)("package.json");
    var rootPackage = JSON.parse((0, node_fs_1.readFileSync)(rootPackagePath, "utf8"));
    var targetVersion = rootPackage.version;
    if (!targetVersion) {
        console.error("release-check: root package.json missing version.");
        process.exit(1);
    }
    var extensionsDir = (0, node_path_1.resolve)("extensions");
    var entries = (0, node_fs_1.readdirSync)(extensionsDir, { withFileTypes: true }).filter(function (entry) {
        return entry.isDirectory();
    });
    var mismatches = [];
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var packagePath = (0, node_path_1.join)(extensionsDir, entry.name, "package.json");
        var pkg = void 0;
        try {
            pkg = JSON.parse((0, node_fs_1.readFileSync)(packagePath, "utf8"));
        }
        catch (_a) {
            continue;
        }
        if (!pkg.name || !pkg.version) {
            continue;
        }
        if (pkg.version !== targetVersion) {
            mismatches.push("".concat(pkg.name, " (").concat(pkg.version, ")"));
        }
    }
    if (mismatches.length > 0) {
        console.error("release-check: plugin versions must match ".concat(targetVersion, ":"));
        for (var _b = 0, mismatches_1 = mismatches; _b < mismatches_1.length; _b++) {
            var item = mismatches_1[_b];
            console.error("  - ".concat(item));
        }
        console.error("release-check: run `pnpm plugins:sync` to align plugin versions.");
        process.exit(1);
    }
}
function main() {
    checkPluginVersions();
    var results = runPackDry();
    var files = results.flatMap(function (entry) { var _a; return (_a = entry.files) !== null && _a !== void 0 ? _a : []; });
    var paths = new Set(files.map(function (file) { return file.path; }));
    var missing = requiredPaths.filter(function (path) { return !paths.has(path); });
    var forbidden = __spreadArray([], paths, true).filter(function (path) {
        return forbiddenPrefixes.some(function (prefix) { return path.startsWith(prefix); });
    });
    if (missing.length > 0 || forbidden.length > 0) {
        if (missing.length > 0) {
            console.error("release-check: missing files in npm pack:");
            for (var _i = 0, missing_1 = missing; _i < missing_1.length; _i++) {
                var path = missing_1[_i];
                console.error("  - ".concat(path));
            }
        }
        if (forbidden.length > 0) {
            console.error("release-check: forbidden files in npm pack:");
            for (var _a = 0, forbidden_1 = forbidden; _a < forbidden_1.length; _a++) {
                var path = forbidden_1[_a];
                console.error("  - ".concat(path));
            }
        }
        process.exit(1);
    }
    console.log("release-check: npm pack contents look OK.");
}
main();
