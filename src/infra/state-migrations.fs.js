"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeReadDir = safeReadDir;
exports.existsDir = existsDir;
exports.ensureDir = ensureDir;
exports.fileExists = fileExists;
exports.isLegacyWhatsAppAuthFile = isLegacyWhatsAppAuthFile;
exports.readSessionStoreJson5 = readSessionStoreJson5;
var json5_1 = require("json5");
var node_fs_1 = require("node:fs");
function safeReadDir(dir) {
    try {
        return node_fs_1.default.readdirSync(dir, { withFileTypes: true });
    }
    catch (_a) {
        return [];
    }
}
function existsDir(dir) {
    try {
        return node_fs_1.default.existsSync(dir) && node_fs_1.default.statSync(dir).isDirectory();
    }
    catch (_a) {
        return false;
    }
}
function ensureDir(dir) {
    node_fs_1.default.mkdirSync(dir, { recursive: true });
}
function fileExists(p) {
    try {
        return node_fs_1.default.existsSync(p) && node_fs_1.default.statSync(p).isFile();
    }
    catch (_a) {
        return false;
    }
}
function isLegacyWhatsAppAuthFile(name) {
    if (name === "creds.json" || name === "creds.json.bak") {
        return true;
    }
    if (!name.endsWith(".json")) {
        return false;
    }
    return /^(app-state-sync|session|sender-key|pre-key)-/.test(name);
}
function readSessionStoreJson5(storePath) {
    try {
        var raw = node_fs_1.default.readFileSync(storePath, "utf-8");
        var parsed = json5_1.default.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            return { store: parsed, ok: true };
        }
    }
    catch (_a) {
        // ignore
    }
    return { store: {}, ok: false };
}
