"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMatrixCredentialsDir = resolveMatrixCredentialsDir;
exports.resolveMatrixCredentialsPath = resolveMatrixCredentialsPath;
exports.loadMatrixCredentials = loadMatrixCredentials;
exports.saveMatrixCredentials = saveMatrixCredentials;
exports.touchMatrixCredentials = touchMatrixCredentials;
exports.clearMatrixCredentials = clearMatrixCredentials;
exports.credentialsMatchConfig = credentialsMatchConfig;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var runtime_js_1 = require("../runtime.js");
var CREDENTIALS_FILENAME = "credentials.json";
function resolveMatrixCredentialsDir(env, stateDir) {
    if (env === void 0) { env = process.env; }
    var resolvedStateDir = stateDir !== null && stateDir !== void 0 ? stateDir : (0, runtime_js_1.getMatrixRuntime)().state.resolveStateDir(env, node_os_1.default.homedir);
    return node_path_1.default.join(resolvedStateDir, "credentials", "matrix");
}
function resolveMatrixCredentialsPath(env) {
    if (env === void 0) { env = process.env; }
    var dir = resolveMatrixCredentialsDir(env);
    return node_path_1.default.join(dir, CREDENTIALS_FILENAME);
}
function loadMatrixCredentials(env) {
    if (env === void 0) { env = process.env; }
    var credPath = resolveMatrixCredentialsPath(env);
    try {
        if (!node_fs_1.default.existsSync(credPath)) {
            return null;
        }
        var raw = node_fs_1.default.readFileSync(credPath, "utf-8");
        var parsed = JSON.parse(raw);
        if (typeof parsed.homeserver !== "string" ||
            typeof parsed.userId !== "string" ||
            typeof parsed.accessToken !== "string") {
            return null;
        }
        return parsed;
    }
    catch (_a) {
        return null;
    }
}
function saveMatrixCredentials(credentials, env) {
    var _a;
    if (env === void 0) { env = process.env; }
    var dir = resolveMatrixCredentialsDir(env);
    node_fs_1.default.mkdirSync(dir, { recursive: true });
    var credPath = resolveMatrixCredentialsPath(env);
    var existing = loadMatrixCredentials(env);
    var now = new Date().toISOString();
    var toSave = __assign(__assign({}, credentials), { createdAt: (_a = existing === null || existing === void 0 ? void 0 : existing.createdAt) !== null && _a !== void 0 ? _a : now, lastUsedAt: now });
    node_fs_1.default.writeFileSync(credPath, JSON.stringify(toSave, null, 2), "utf-8");
}
function touchMatrixCredentials(env) {
    if (env === void 0) { env = process.env; }
    var existing = loadMatrixCredentials(env);
    if (!existing) {
        return;
    }
    existing.lastUsedAt = new Date().toISOString();
    var credPath = resolveMatrixCredentialsPath(env);
    node_fs_1.default.writeFileSync(credPath, JSON.stringify(existing, null, 2), "utf-8");
}
function clearMatrixCredentials(env) {
    if (env === void 0) { env = process.env; }
    var credPath = resolveMatrixCredentialsPath(env);
    try {
        if (node_fs_1.default.existsSync(credPath)) {
            node_fs_1.default.unlinkSync(credPath);
        }
    }
    catch (_a) {
        // ignore
    }
}
function credentialsMatchConfig(stored, config) {
    // If userId is empty (token-based auth), only match homeserver
    if (!config.userId) {
        return stored.homeserver === config.homeserver;
    }
    return stored.homeserver === config.homeserver && stored.userId === config.userId;
}
