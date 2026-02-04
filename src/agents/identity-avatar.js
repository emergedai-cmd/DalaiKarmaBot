"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAgentAvatar = resolveAgentAvatar;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var utils_js_1 = require("../utils.js");
var agent_scope_js_1 = require("./agent-scope.js");
var identity_file_js_1 = require("./identity-file.js");
var identity_js_1 = require("./identity.js");
var ALLOWED_AVATAR_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);
function normalizeAvatarValue(value) {
    var trimmed = value === null || value === void 0 ? void 0 : value.trim();
    return trimmed ? trimmed : null;
}
function resolveAvatarSource(cfg, agentId) {
    var _a, _b;
    var fromConfig = normalizeAvatarValue((_a = (0, identity_js_1.resolveAgentIdentity)(cfg, agentId)) === null || _a === void 0 ? void 0 : _a.avatar);
    if (fromConfig) {
        return fromConfig;
    }
    var workspace = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, agentId);
    var fromIdentity = normalizeAvatarValue((_b = (0, identity_file_js_1.loadAgentIdentityFromWorkspace)(workspace)) === null || _b === void 0 ? void 0 : _b.avatar);
    return fromIdentity;
}
function isRemoteAvatar(value) {
    var lower = value.toLowerCase();
    return lower.startsWith("http://") || lower.startsWith("https://");
}
function isDataAvatar(value) {
    return value.toLowerCase().startsWith("data:");
}
function resolveExistingPath(value) {
    try {
        return node_fs_1.default.realpathSync(value);
    }
    catch (_a) {
        return node_path_1.default.resolve(value);
    }
}
function isPathWithin(root, target) {
    var relative = node_path_1.default.relative(root, target);
    if (!relative) {
        return true;
    }
    return !relative.startsWith("..") && !node_path_1.default.isAbsolute(relative);
}
function resolveLocalAvatarPath(params) {
    var workspaceRoot = resolveExistingPath(params.workspaceDir);
    var raw = params.raw;
    var resolved = raw.startsWith("~") || node_path_1.default.isAbsolute(raw)
        ? (0, utils_js_1.resolveUserPath)(raw)
        : node_path_1.default.resolve(workspaceRoot, raw);
    var realPath = resolveExistingPath(resolved);
    if (!isPathWithin(workspaceRoot, realPath)) {
        return { ok: false, reason: "outside_workspace" };
    }
    var ext = node_path_1.default.extname(realPath).toLowerCase();
    if (!ALLOWED_AVATAR_EXTS.has(ext)) {
        return { ok: false, reason: "unsupported_extension" };
    }
    try {
        if (!node_fs_1.default.statSync(realPath).isFile()) {
            return { ok: false, reason: "missing" };
        }
    }
    catch (_a) {
        return { ok: false, reason: "missing" };
    }
    return { ok: true, filePath: realPath };
}
function resolveAgentAvatar(cfg, agentId) {
    var source = resolveAvatarSource(cfg, agentId);
    if (!source) {
        return { kind: "none", reason: "missing" };
    }
    if (isRemoteAvatar(source)) {
        return { kind: "remote", url: source };
    }
    if (isDataAvatar(source)) {
        return { kind: "data", url: source };
    }
    var workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, agentId);
    var resolved = resolveLocalAvatarPath({ raw: source, workspaceDir: workspaceDir });
    if (!resolved.ok) {
        return { kind: "none", reason: resolved.reason };
    }
    return { kind: "local", filePath: resolved.filePath };
}
