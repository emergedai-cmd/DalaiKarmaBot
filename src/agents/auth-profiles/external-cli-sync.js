"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncExternalCliCredentials = syncExternalCliCredentials;
var cli_credentials_js_1 = require("../cli-credentials.js");
var constants_js_1 = require("./constants.js");
function shallowEqualOAuthCredentials(a, b) {
    if (!a) {
        return false;
    }
    if (a.type !== "oauth") {
        return false;
    }
    return (a.provider === b.provider &&
        a.access === b.access &&
        a.refresh === b.refresh &&
        a.expires === b.expires &&
        a.email === b.email &&
        a.enterpriseUrl === b.enterpriseUrl &&
        a.projectId === b.projectId &&
        a.accountId === b.accountId);
}
function isExternalProfileFresh(cred, now) {
    if (!cred) {
        return false;
    }
    if (cred.type !== "oauth" && cred.type !== "token") {
        return false;
    }
    if (cred.provider !== "qwen-portal" && cred.provider !== "minimax-portal") {
        return false;
    }
    if (typeof cred.expires !== "number") {
        return true;
    }
    return cred.expires > now + constants_js_1.EXTERNAL_CLI_NEAR_EXPIRY_MS;
}
/** Sync external CLI credentials into the store for a given provider. */
function syncExternalCliCredentialsForProvider(store, profileId, provider, readCredentials, now) {
    var existing = store.profiles[profileId];
    var shouldSync = !existing || existing.provider !== provider || !isExternalProfileFresh(existing, now);
    var creds = shouldSync ? readCredentials() : null;
    if (!creds) {
        return false;
    }
    var existingOAuth = (existing === null || existing === void 0 ? void 0 : existing.type) === "oauth" ? existing : undefined;
    var shouldUpdate = !existingOAuth ||
        existingOAuth.provider !== provider ||
        existingOAuth.expires <= now ||
        creds.expires > existingOAuth.expires;
    if (shouldUpdate && !shallowEqualOAuthCredentials(existingOAuth, creds)) {
        store.profiles[profileId] = creds;
        constants_js_1.log.info("synced ".concat(provider, " credentials from external cli"), {
            profileId: profileId,
            expires: new Date(creds.expires).toISOString(),
        });
        return true;
    }
    return false;
}
/**
 * Sync OAuth credentials from external CLI tools (Qwen Code CLI, MiniMax CLI) into the store.
 *
 * Returns true if any credentials were updated.
 */
function syncExternalCliCredentials(store) {
    var mutated = false;
    var now = Date.now();
    // Sync from Qwen Code CLI
    var existingQwen = store.profiles[constants_js_1.QWEN_CLI_PROFILE_ID];
    var shouldSyncQwen = !existingQwen ||
        existingQwen.provider !== "qwen-portal" ||
        !isExternalProfileFresh(existingQwen, now);
    var qwenCreds = shouldSyncQwen
        ? (0, cli_credentials_js_1.readQwenCliCredentialsCached)({ ttlMs: constants_js_1.EXTERNAL_CLI_SYNC_TTL_MS })
        : null;
    if (qwenCreds) {
        var existing = store.profiles[constants_js_1.QWEN_CLI_PROFILE_ID];
        var existingOAuth = (existing === null || existing === void 0 ? void 0 : existing.type) === "oauth" ? existing : undefined;
        var shouldUpdate = !existingOAuth ||
            existingOAuth.provider !== "qwen-portal" ||
            existingOAuth.expires <= now ||
            qwenCreds.expires > existingOAuth.expires;
        if (shouldUpdate && !shallowEqualOAuthCredentials(existingOAuth, qwenCreds)) {
            store.profiles[constants_js_1.QWEN_CLI_PROFILE_ID] = qwenCreds;
            mutated = true;
            constants_js_1.log.info("synced qwen credentials from qwen cli", {
                profileId: constants_js_1.QWEN_CLI_PROFILE_ID,
                expires: new Date(qwenCreds.expires).toISOString(),
            });
        }
    }
    // Sync from MiniMax Portal CLI
    if (syncExternalCliCredentialsForProvider(store, constants_js_1.MINIMAX_CLI_PROFILE_ID, "minimax-portal", function () { return (0, cli_credentials_js_1.readMiniMaxCliCredentialsCached)({ ttlMs: constants_js_1.EXTERNAL_CLI_SYNC_TTL_MS }); }, now)) {
        mutated = true;
    }
    return mutated;
}
