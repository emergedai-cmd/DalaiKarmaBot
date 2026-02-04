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
exports.ensureOpenClawCliOnPath = ensureOpenClawCliOnPath;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var brew_js_1 = require("./brew.js");
var env_js_1 = require("./env.js");
function isExecutable(filePath) {
    try {
        node_fs_1.default.accessSync(filePath, node_fs_1.default.constants.X_OK);
        return true;
    }
    catch (_a) {
        return false;
    }
}
function isDirectory(dirPath) {
    try {
        return node_fs_1.default.statSync(dirPath).isDirectory();
    }
    catch (_a) {
        return false;
    }
}
function mergePath(params) {
    var partsExisting = params.existing
        .split(node_path_1.default.delimiter)
        .map(function (part) { return part.trim(); })
        .filter(Boolean);
    var partsPrepend = params.prepend.map(function (part) { return part.trim(); }).filter(Boolean);
    var seen = new Set();
    var merged = [];
    for (var _i = 0, _a = __spreadArray(__spreadArray([], partsPrepend, true), partsExisting, true); _i < _a.length; _i++) {
        var part = _a[_i];
        if (!seen.has(part)) {
            seen.add(part);
            merged.push(part);
        }
    }
    return merged.join(node_path_1.default.delimiter);
}
function candidateBinDirs(opts) {
    var _a, _b, _c, _d, _e;
    var execPath = (_a = opts.execPath) !== null && _a !== void 0 ? _a : process.execPath;
    var cwd = (_b = opts.cwd) !== null && _b !== void 0 ? _b : process.cwd();
    var homeDir = (_c = opts.homeDir) !== null && _c !== void 0 ? _c : node_os_1.default.homedir();
    var platform = (_d = opts.platform) !== null && _d !== void 0 ? _d : process.platform;
    var candidates = [];
    // Bundled macOS app: `openclaw` lives next to the executable (process.execPath).
    try {
        var execDir = node_path_1.default.dirname(execPath);
        var siblingCli = node_path_1.default.join(execDir, "openclaw");
        if (isExecutable(siblingCli)) {
            candidates.push(execDir);
        }
    }
    catch (_f) {
        // ignore
    }
    // Project-local installs (best effort): if a `node_modules/.bin/openclaw` exists near cwd,
    // include it. This helps when running under launchd or other minimal PATH environments.
    var localBinDir = node_path_1.default.join(cwd, "node_modules", ".bin");
    if (isExecutable(node_path_1.default.join(localBinDir, "openclaw"))) {
        candidates.push(localBinDir);
    }
    var miseDataDir = (_e = process.env.MISE_DATA_DIR) !== null && _e !== void 0 ? _e : node_path_1.default.join(homeDir, ".local", "share", "mise");
    var miseShims = node_path_1.default.join(miseDataDir, "shims");
    if (isDirectory(miseShims)) {
        candidates.push(miseShims);
    }
    candidates.push.apply(candidates, (0, brew_js_1.resolveBrewPathDirs)({ homeDir: homeDir }));
    // Common global install locations (macOS first).
    if (platform === "darwin") {
        candidates.push(node_path_1.default.join(homeDir, "Library", "pnpm"));
    }
    if (process.env.XDG_BIN_HOME) {
        candidates.push(process.env.XDG_BIN_HOME);
    }
    candidates.push(node_path_1.default.join(homeDir, ".local", "bin"));
    candidates.push(node_path_1.default.join(homeDir, ".local", "share", "pnpm"));
    candidates.push(node_path_1.default.join(homeDir, ".bun", "bin"));
    candidates.push(node_path_1.default.join(homeDir, ".yarn", "bin"));
    candidates.push("/opt/homebrew/bin", "/usr/local/bin", "/usr/bin", "/bin");
    return candidates.filter(isDirectory);
}
/**
 * Best-effort PATH bootstrap so skills that require the `openclaw` CLI can run
 * under launchd/minimal environments (and inside the macOS app bundle).
 */
function ensureOpenClawCliOnPath(opts) {
    var _a, _b;
    if (opts === void 0) { opts = {}; }
    if ((0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_PATH_BOOTSTRAPPED)) {
        return;
    }
    process.env.OPENCLAW_PATH_BOOTSTRAPPED = "1";
    var existing = (_b = (_a = opts.pathEnv) !== null && _a !== void 0 ? _a : process.env.PATH) !== null && _b !== void 0 ? _b : "";
    var prepend = candidateBinDirs(opts);
    if (prepend.length === 0) {
        return;
    }
    var merged = mergePath({ existing: existing, prepend: prepend });
    if (merged) {
        process.env.PATH = merged;
    }
}
