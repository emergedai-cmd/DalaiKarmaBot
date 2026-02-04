"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMatrixAccountIds = listMatrixAccountIds;
exports.resolveDefaultMatrixAccountId = resolveDefaultMatrixAccountId;
exports.resolveMatrixAccount = resolveMatrixAccount;
exports.listEnabledMatrixAccounts = listEnabledMatrixAccounts;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var client_js_1 = require("./client.js");
var credentials_js_1 = require("./credentials.js");
function listMatrixAccountIds(_cfg) {
    return [plugin_sdk_1.DEFAULT_ACCOUNT_ID];
}
function resolveDefaultMatrixAccountId(cfg) {
    var _a;
    var ids = listMatrixAccountIds(cfg);
    if (ids.includes(plugin_sdk_1.DEFAULT_ACCOUNT_ID)) {
        return plugin_sdk_1.DEFAULT_ACCOUNT_ID;
    }
    return (_a = ids[0]) !== null && _a !== void 0 ? _a : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
}
function resolveMatrixAccount(params) {
    var _a, _b, _c;
    var accountId = (0, plugin_sdk_1.normalizeAccountId)(params.accountId);
    var base = (_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.matrix) !== null && _b !== void 0 ? _b : {};
    var enabled = base.enabled !== false;
    var resolved = (0, client_js_1.resolveMatrixConfig)(params.cfg, process.env);
    var hasHomeserver = Boolean(resolved.homeserver);
    var hasUserId = Boolean(resolved.userId);
    var hasAccessToken = Boolean(resolved.accessToken);
    var hasPassword = Boolean(resolved.password);
    var hasPasswordAuth = hasUserId && hasPassword;
    var stored = (0, credentials_js_1.loadMatrixCredentials)(process.env);
    var hasStored = stored && resolved.homeserver
        ? (0, credentials_js_1.credentialsMatchConfig)(stored, {
            homeserver: resolved.homeserver,
            userId: resolved.userId || "",
        })
        : false;
    var configured = hasHomeserver && (hasAccessToken || hasPasswordAuth || Boolean(hasStored));
    return {
        accountId: accountId,
        enabled: enabled,
        name: ((_c = base.name) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
        configured: configured,
        homeserver: resolved.homeserver || undefined,
        userId: resolved.userId || undefined,
        config: base,
    };
}
function listEnabledMatrixAccounts(cfg) {
    return listMatrixAccountIds(cfg)
        .map(function (accountId) { return resolveMatrixAccount({ cfg: cfg, accountId: accountId }); })
        .filter(function (account) { return account.enabled; });
}
