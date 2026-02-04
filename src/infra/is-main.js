"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMainModule = isMainModule;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
function normalizePathCandidate(candidate, cwd) {
    if (!candidate) {
        return undefined;
    }
    var resolved = node_path_1.default.resolve(cwd, candidate);
    try {
        return node_fs_1.default.realpathSync.native(resolved);
    }
    catch (_a) {
        return resolved;
    }
}
function isMainModule(_a) {
    var currentFile = _a.currentFile, _b = _a.argv, argv = _b === void 0 ? process.argv : _b, _c = _a.env, env = _c === void 0 ? process.env : _c, _d = _a.cwd, cwd = _d === void 0 ? process.cwd() : _d;
    var normalizedCurrent = normalizePathCandidate(currentFile, cwd);
    var normalizedArgv1 = normalizePathCandidate(argv[1], cwd);
    if (normalizedCurrent && normalizedArgv1 && normalizedCurrent === normalizedArgv1) {
        return true;
    }
    // PM2 runs the script via an internal wrapper; `argv[1]` points at the wrapper.
    // PM2 exposes the actual script path in `pm_exec_path`.
    var normalizedPmExecPath = normalizePathCandidate(env.pm_exec_path, cwd);
    if (normalizedCurrent && normalizedPmExecPath && normalizedCurrent === normalizedPmExecPath) {
        return true;
    }
    // Fallback: basename match (relative paths, symlinked bins).
    if (normalizedCurrent &&
        normalizedArgv1 &&
        node_path_1.default.basename(normalizedCurrent) === node_path_1.default.basename(normalizedArgv1)) {
        return true;
    }
    return false;
}
