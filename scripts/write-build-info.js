"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_child_process_1 = require("node:child_process");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var rootDir = node_path_1.default.resolve(node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url)), "..");
var distDir = node_path_1.default.join(rootDir, "dist");
var pkgPath = node_path_1.default.join(rootDir, "package.json");
var readPackageVersion = function () {
    var _a;
    try {
        var raw = node_fs_1.default.readFileSync(pkgPath, "utf8");
        var parsed = JSON.parse(raw);
        return (_a = parsed.version) !== null && _a !== void 0 ? _a : null;
    }
    catch (_b) {
        return null;
    }
};
var resolveCommit = function () {
    var _a, _b;
    var envCommit = ((_a = process.env.GIT_COMMIT) === null || _a === void 0 ? void 0 : _a.trim()) || ((_b = process.env.GIT_SHA) === null || _b === void 0 ? void 0 : _b.trim());
    if (envCommit) {
        return envCommit;
    }
    try {
        return (0, node_child_process_1.execSync)("git rev-parse HEAD", {
            cwd: rootDir,
            stdio: ["ignore", "pipe", "ignore"],
        })
            .toString()
            .trim();
    }
    catch (_c) {
        return null;
    }
};
var version = readPackageVersion();
var commit = resolveCommit();
var buildInfo = {
    version: version,
    commit: commit,
    builtAt: new Date().toISOString(),
};
node_fs_1.default.mkdirSync(distDir, { recursive: true });
node_fs_1.default.writeFileSync(node_path_1.default.join(distDir, "build-info.json"), "".concat(JSON.stringify(buildInfo, null, 2), "\n"));
