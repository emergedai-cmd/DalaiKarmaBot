"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveBrewPathDirs = resolveBrewPathDirs;
exports.resolveBrewExecutable = resolveBrewExecutable;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
function isExecutable(filePath) {
    try {
        node_fs_1.default.accessSync(filePath, node_fs_1.default.constants.X_OK);
        return true;
    }
    catch (_a) {
        return false;
    }
}
function normalizePathValue(value) {
    if (typeof value !== "string") {
        return undefined;
    }
    var trimmed = value.trim();
    return trimmed ? trimmed : undefined;
}
function resolveBrewPathDirs(opts) {
    var _a, _b;
    var homeDir = (_a = opts === null || opts === void 0 ? void 0 : opts.homeDir) !== null && _a !== void 0 ? _a : node_os_1.default.homedir();
    var env = (_b = opts === null || opts === void 0 ? void 0 : opts.env) !== null && _b !== void 0 ? _b : process.env;
    var dirs = [];
    var prefix = normalizePathValue(env.HOMEBREW_PREFIX);
    if (prefix) {
        dirs.push(node_path_1.default.join(prefix, "bin"), node_path_1.default.join(prefix, "sbin"));
    }
    // Linuxbrew defaults.
    dirs.push(node_path_1.default.join(homeDir, ".linuxbrew", "bin"));
    dirs.push(node_path_1.default.join(homeDir, ".linuxbrew", "sbin"));
    dirs.push("/home/linuxbrew/.linuxbrew/bin", "/home/linuxbrew/.linuxbrew/sbin");
    // macOS defaults (also used by some Linux setups).
    dirs.push("/opt/homebrew/bin", "/usr/local/bin");
    return dirs;
}
function resolveBrewExecutable(opts) {
    var _a, _b;
    var homeDir = (_a = opts === null || opts === void 0 ? void 0 : opts.homeDir) !== null && _a !== void 0 ? _a : node_os_1.default.homedir();
    var env = (_b = opts === null || opts === void 0 ? void 0 : opts.env) !== null && _b !== void 0 ? _b : process.env;
    var candidates = [];
    var brewFile = normalizePathValue(env.HOMEBREW_BREW_FILE);
    if (brewFile) {
        candidates.push(brewFile);
    }
    var prefix = normalizePathValue(env.HOMEBREW_PREFIX);
    if (prefix) {
        candidates.push(node_path_1.default.join(prefix, "bin", "brew"));
    }
    // Linuxbrew defaults.
    candidates.push(node_path_1.default.join(homeDir, ".linuxbrew", "bin", "brew"));
    candidates.push("/home/linuxbrew/.linuxbrew/bin/brew");
    // macOS defaults.
    candidates.push("/opt/homebrew/bin/brew", "/usr/local/bin/brew");
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var candidate = candidates_1[_i];
        if (isExecutable(candidate)) {
            return candidate;
        }
    }
    return undefined;
}
