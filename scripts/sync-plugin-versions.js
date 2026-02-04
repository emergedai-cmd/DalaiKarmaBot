"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var rootPackagePath = (0, node_path_1.resolve)("package.json");
var rootPackage = JSON.parse((0, node_fs_1.readFileSync)(rootPackagePath, "utf8"));
var targetVersion = rootPackage.version;
if (!targetVersion) {
    throw new Error("Root package.json missing version.");
}
var extensionsDir = (0, node_path_1.resolve)("extensions");
var dirs = (0, node_fs_1.readdirSync)(extensionsDir, { withFileTypes: true }).filter(function (entry) {
    return entry.isDirectory();
});
var updated = [];
var changelogged = [];
var skipped = [];
function ensureChangelogEntry(changelogPath, version) {
    if (!(0, node_fs_1.existsSync)(changelogPath)) {
        return false;
    }
    var content = (0, node_fs_1.readFileSync)(changelogPath, "utf8");
    if (content.includes("## ".concat(version))) {
        return false;
    }
    var entry = "## ".concat(version, "\n\n### Changes\n- Version alignment with core OpenClaw release numbers.\n\n");
    if (content.startsWith("# Changelog\n\n")) {
        var next_1 = content.replace("# Changelog\n\n", "# Changelog\n\n".concat(entry));
        (0, node_fs_1.writeFileSync)(changelogPath, next_1);
        return true;
    }
    var next = "# Changelog\n\n".concat(entry).concat(content.trimStart());
    (0, node_fs_1.writeFileSync)(changelogPath, "".concat(next, "\n"));
    return true;
}
for (var _i = 0, dirs_1 = dirs; _i < dirs_1.length; _i++) {
    var dir = dirs_1[_i];
    var packagePath = (0, node_path_1.join)(extensionsDir, dir.name, "package.json");
    var pkg = void 0;
    try {
        pkg = JSON.parse((0, node_fs_1.readFileSync)(packagePath, "utf8"));
    }
    catch (_a) {
        continue;
    }
    if (!pkg.name) {
        skipped.push(dir.name);
        continue;
    }
    var changelogPath = (0, node_path_1.join)(extensionsDir, dir.name, "CHANGELOG.md");
    if (ensureChangelogEntry(changelogPath, targetVersion)) {
        changelogged.push(pkg.name);
    }
    if (pkg.version === targetVersion) {
        skipped.push(pkg.name);
        continue;
    }
    pkg.version = targetVersion;
    (0, node_fs_1.writeFileSync)(packagePath, "".concat(JSON.stringify(pkg, null, 2), "\n"));
    updated.push(pkg.name);
}
console.log("Synced plugin versions to ".concat(targetVersion, ". Updated: ").concat(updated.length, ". Changelogged: ").concat(changelogged.length, ". Skipped: ").concat(skipped.length, "."));
