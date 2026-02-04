"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveHomeDir = resolveHomeDir;
exports.resolveUserPathWithHome = resolveUserPathWithHome;
exports.resolveGatewayStateDir = resolveGatewayStateDir;
var node_path_1 = require("node:path");
var constants_js_1 = require("./constants.js");
var windowsAbsolutePath = /^[a-zA-Z]:[\\/]/;
var windowsUncPath = /^\\\\/;
function resolveHomeDir(env) {
    var _a, _b;
    var home = ((_a = env.HOME) === null || _a === void 0 ? void 0 : _a.trim()) || ((_b = env.USERPROFILE) === null || _b === void 0 ? void 0 : _b.trim());
    if (!home) {
        throw new Error("Missing HOME");
    }
    return home;
}
function resolveUserPathWithHome(input, home) {
    var trimmed = input.trim();
    if (!trimmed) {
        return trimmed;
    }
    if (trimmed.startsWith("~")) {
        if (!home) {
            throw new Error("Missing HOME");
        }
        var expanded = trimmed.replace(/^~(?=$|[\\/])/, home);
        return node_path_1.default.resolve(expanded);
    }
    if (windowsAbsolutePath.test(trimmed) || windowsUncPath.test(trimmed)) {
        return trimmed;
    }
    return node_path_1.default.resolve(trimmed);
}
function resolveGatewayStateDir(env) {
    var _a;
    var override = (_a = env.OPENCLAW_STATE_DIR) === null || _a === void 0 ? void 0 : _a.trim();
    if (override) {
        var home_1 = override.startsWith("~") ? resolveHomeDir(env) : undefined;
        return resolveUserPathWithHome(override, home_1);
    }
    var home = resolveHomeDir(env);
    var suffix = (0, constants_js_1.resolveGatewayProfileSuffix)(env.OPENCLAW_PROFILE);
    return node_path_1.default.join(home, ".openclaw".concat(suffix));
}
