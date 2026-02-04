"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveBundledHooksDir = resolveBundledHooksDir;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
function resolveBundledHooksDir() {
    var _a;
    var override = (_a = process.env.OPENCLAW_BUNDLED_HOOKS_DIR) === null || _a === void 0 ? void 0 : _a.trim();
    if (override) {
        return override;
    }
    // bun --compile: ship a sibling `hooks/bundled/` next to the executable.
    try {
        var execDir = node_path_1.default.dirname(process.execPath);
        var sibling = node_path_1.default.join(execDir, "hooks", "bundled");
        if (node_fs_1.default.existsSync(sibling)) {
            return sibling;
        }
    }
    catch (_b) {
        // ignore
    }
    // npm: resolve `<packageRoot>/dist/hooks/bundled` relative to this module (compiled hooks).
    // This path works when installed via npm: node_modules/openclaw/dist/hooks/bundled-dir.js
    try {
        var moduleDir = node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url));
        var distBundled = node_path_1.default.join(moduleDir, "bundled");
        if (node_fs_1.default.existsSync(distBundled)) {
            return distBundled;
        }
    }
    catch (_c) {
        // ignore
    }
    // dev: resolve `<packageRoot>/src/hooks/bundled` relative to dist/hooks/bundled-dir.js
    // This path works in dev: dist/hooks/bundled-dir.js -> ../../src/hooks/bundled
    try {
        var moduleDir = node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url));
        var root = node_path_1.default.resolve(moduleDir, "..", "..");
        var srcBundled = node_path_1.default.join(root, "src", "hooks", "bundled");
        if (node_fs_1.default.existsSync(srcBundled)) {
            return srcBundled;
        }
    }
    catch (_d) {
        // ignore
    }
    return undefined;
}
