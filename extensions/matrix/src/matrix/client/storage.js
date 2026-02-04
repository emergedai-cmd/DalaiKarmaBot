"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ACCOUNT_KEY = void 0;
exports.resolveMatrixStoragePaths = resolveMatrixStoragePaths;
exports.maybeMigrateLegacyStorage = maybeMigrateLegacyStorage;
exports.writeStorageMeta = writeStorageMeta;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var runtime_js_1 = require("../../runtime.js");
exports.DEFAULT_ACCOUNT_KEY = "default";
var STORAGE_META_FILENAME = "storage-meta.json";
function sanitizePathSegment(value) {
    var cleaned = value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "_")
        .replace(/^_+|_+$/g, "");
    return cleaned || "unknown";
}
function resolveHomeserverKey(homeserver) {
    try {
        var url = new URL(homeserver);
        if (url.host) {
            return sanitizePathSegment(url.host);
        }
    }
    catch (_a) {
        // fall through
    }
    return sanitizePathSegment(homeserver);
}
function hashAccessToken(accessToken) {
    return node_crypto_1.default.createHash("sha256").update(accessToken).digest("hex").slice(0, 16);
}
function resolveLegacyStoragePaths(env) {
    if (env === void 0) { env = process.env; }
    var stateDir = (0, runtime_js_1.getMatrixRuntime)().state.resolveStateDir(env, node_os_1.default.homedir);
    return {
        storagePath: node_path_1.default.join(stateDir, "matrix", "bot-storage.json"),
        cryptoPath: node_path_1.default.join(stateDir, "matrix", "crypto"),
    };
}
function resolveMatrixStoragePaths(params) {
    var _a, _b;
    var env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
    var stateDir = (0, runtime_js_1.getMatrixRuntime)().state.resolveStateDir(env, node_os_1.default.homedir);
    var accountKey = sanitizePathSegment((_b = params.accountId) !== null && _b !== void 0 ? _b : exports.DEFAULT_ACCOUNT_KEY);
    var userKey = sanitizePathSegment(params.userId);
    var serverKey = resolveHomeserverKey(params.homeserver);
    var tokenHash = hashAccessToken(params.accessToken);
    var rootDir = node_path_1.default.join(stateDir, "matrix", "accounts", accountKey, "".concat(serverKey, "__").concat(userKey), tokenHash);
    return {
        rootDir: rootDir,
        storagePath: node_path_1.default.join(rootDir, "bot-storage.json"),
        cryptoPath: node_path_1.default.join(rootDir, "crypto"),
        metaPath: node_path_1.default.join(rootDir, STORAGE_META_FILENAME),
        accountKey: accountKey,
        tokenHash: tokenHash,
    };
}
function maybeMigrateLegacyStorage(params) {
    var legacy = resolveLegacyStoragePaths(params.env);
    var hasLegacyStorage = node_fs_1.default.existsSync(legacy.storagePath);
    var hasLegacyCrypto = node_fs_1.default.existsSync(legacy.cryptoPath);
    var hasNewStorage = node_fs_1.default.existsSync(params.storagePaths.storagePath) || node_fs_1.default.existsSync(params.storagePaths.cryptoPath);
    if (!hasLegacyStorage && !hasLegacyCrypto) {
        return;
    }
    if (hasNewStorage) {
        return;
    }
    node_fs_1.default.mkdirSync(params.storagePaths.rootDir, { recursive: true });
    if (hasLegacyStorage) {
        try {
            node_fs_1.default.renameSync(legacy.storagePath, params.storagePaths.storagePath);
        }
        catch (_a) {
            // Ignore migration failures; new store will be created.
        }
    }
    if (hasLegacyCrypto) {
        try {
            node_fs_1.default.renameSync(legacy.cryptoPath, params.storagePaths.cryptoPath);
        }
        catch (_b) {
            // Ignore migration failures; new store will be created.
        }
    }
}
function writeStorageMeta(params) {
    var _a;
    try {
        var payload = {
            homeserver: params.homeserver,
            userId: params.userId,
            accountId: (_a = params.accountId) !== null && _a !== void 0 ? _a : exports.DEFAULT_ACCOUNT_KEY,
            accessTokenHash: params.storagePaths.tokenHash,
            createdAt: new Date().toISOString(),
        };
        node_fs_1.default.mkdirSync(params.storagePaths.rootDir, { recursive: true });
        node_fs_1.default.writeFileSync(params.storagePaths.metaPath, JSON.stringify(payload, null, 2), "utf-8");
    }
    catch (_b) {
        // ignore meta write failures
    }
}
