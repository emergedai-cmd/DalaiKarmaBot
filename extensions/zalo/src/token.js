"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveZaloToken = resolveZaloToken;
var node_fs_1 = require("node:fs");
var plugin_sdk_1 = require("openclaw/plugin-sdk");
function resolveZaloToken(config, accountId) {
    var _a, _b, _c, _d, _e, _f;
    var resolvedAccountId = accountId !== null && accountId !== void 0 ? accountId : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
    var isDefaultAccount = resolvedAccountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID;
    var baseConfig = config;
    var accountConfig = resolvedAccountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID
        ? (_a = baseConfig === null || baseConfig === void 0 ? void 0 : baseConfig.accounts) === null || _a === void 0 ? void 0 : _a[resolvedAccountId]
        : undefined;
    if (accountConfig) {
        var token = (_b = accountConfig.botToken) === null || _b === void 0 ? void 0 : _b.trim();
        if (token) {
            return { token: token, source: "config" };
        }
        var tokenFile = (_c = accountConfig.tokenFile) === null || _c === void 0 ? void 0 : _c.trim();
        if (tokenFile) {
            try {
                var fileToken = (0, node_fs_1.readFileSync)(tokenFile, "utf8").trim();
                if (fileToken) {
                    return { token: fileToken, source: "configFile" };
                }
            }
            catch (_g) {
                // ignore read failures
            }
        }
    }
    if (isDefaultAccount) {
        var token = (_d = baseConfig === null || baseConfig === void 0 ? void 0 : baseConfig.botToken) === null || _d === void 0 ? void 0 : _d.trim();
        if (token) {
            return { token: token, source: "config" };
        }
        var tokenFile = (_e = baseConfig === null || baseConfig === void 0 ? void 0 : baseConfig.tokenFile) === null || _e === void 0 ? void 0 : _e.trim();
        if (tokenFile) {
            try {
                var fileToken = (0, node_fs_1.readFileSync)(tokenFile, "utf8").trim();
                if (fileToken) {
                    return { token: fileToken, source: "configFile" };
                }
            }
            catch (_h) {
                // ignore read failures
            }
        }
        var envToken = (_f = process.env.ZALO_BOT_TOKEN) === null || _f === void 0 ? void 0 : _f.trim();
        if (envToken) {
            return { token: envToken, source: "env" };
        }
    }
    return { token: "", source: "none" };
}
