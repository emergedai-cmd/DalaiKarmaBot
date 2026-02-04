"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseIdentityMarkdown = parseIdentityMarkdown;
exports.identityHasValues = identityHasValues;
exports.loadIdentityFromFile = loadIdentityFromFile;
exports.loadAgentIdentityFromWorkspace = loadAgentIdentityFromWorkspace;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var workspace_js_1 = require("./workspace.js");
var IDENTITY_PLACEHOLDER_VALUES = new Set([
    "pick something you like",
    "ai? robot? familiar? ghost in the machine? something weirder?",
    "how do you come across? sharp? warm? chaotic? calm?",
    "your signature - pick one that feels right",
    "workspace-relative path, http(s) url, or data uri",
]);
function normalizeIdentityValue(value) {
    var normalized = value.trim();
    normalized = normalized.replace(/^[*_]+|[*_]+$/g, "").trim();
    if (normalized.startsWith("(") && normalized.endsWith(")")) {
        normalized = normalized.slice(1, -1).trim();
    }
    normalized = normalized.replace(/[\u2013\u2014]/g, "-");
    normalized = normalized.replace(/\s+/g, " ").toLowerCase();
    return normalized;
}
function isIdentityPlaceholder(value) {
    var normalized = normalizeIdentityValue(value);
    return IDENTITY_PLACEHOLDER_VALUES.has(normalized);
}
function parseIdentityMarkdown(content) {
    var identity = {};
    var lines = content.split(/\r?\n/);
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var cleaned = line.trim().replace(/^\s*-\s*/, "");
        var colonIndex = cleaned.indexOf(":");
        if (colonIndex === -1) {
            continue;
        }
        var label = cleaned.slice(0, colonIndex).replace(/[*_]/g, "").trim().toLowerCase();
        var value = cleaned
            .slice(colonIndex + 1)
            .replace(/^[*_]+|[*_]+$/g, "")
            .trim();
        if (!value) {
            continue;
        }
        if (isIdentityPlaceholder(value)) {
            continue;
        }
        if (label === "name") {
            identity.name = value;
        }
        if (label === "emoji") {
            identity.emoji = value;
        }
        if (label === "creature") {
            identity.creature = value;
        }
        if (label === "vibe") {
            identity.vibe = value;
        }
        if (label === "theme") {
            identity.theme = value;
        }
        if (label === "avatar") {
            identity.avatar = value;
        }
    }
    return identity;
}
function identityHasValues(identity) {
    return Boolean(identity.name ||
        identity.emoji ||
        identity.theme ||
        identity.creature ||
        identity.vibe ||
        identity.avatar);
}
function loadIdentityFromFile(identityPath) {
    try {
        var content = node_fs_1.default.readFileSync(identityPath, "utf-8");
        var parsed = parseIdentityMarkdown(content);
        if (!identityHasValues(parsed)) {
            return null;
        }
        return parsed;
    }
    catch (_a) {
        return null;
    }
}
function loadAgentIdentityFromWorkspace(workspace) {
    var identityPath = node_path_1.default.join(workspace, workspace_js_1.DEFAULT_IDENTITY_FILENAME);
    return loadIdentityFromFile(identityPath);
}
