"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTelegramToken = resolveTelegramToken;
var node_fs_1 = require("node:fs");
var session_key_js_1 = require("../routing/session-key.js");
function resolveTelegramToken(cfg, opts) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    if (opts === void 0) { opts = {}; }
    var accountId = (0, session_key_js_1.normalizeAccountId)(opts.accountId);
    var telegramCfg = (_a = cfg === null || cfg === void 0 ? void 0 : cfg.channels) === null || _a === void 0 ? void 0 : _a.telegram;
    // Account IDs are normalized for routing (e.g. lowercased). Config keys may not
    // be normalized, so resolve per-account config by matching normalized IDs.
    var resolveAccountCfg = function (id) {
        var accounts = telegramCfg === null || telegramCfg === void 0 ? void 0 : telegramCfg.accounts;
        if (!accounts || typeof accounts !== "object" || Array.isArray(accounts)) {
            return undefined;
        }
        // Direct hit (already normalized key)
        var direct = accounts[id];
        if (direct) {
            return direct;
        }
        // Fallback: match by normalized key
        var matchKey = Object.keys(accounts).find(function (key) { return (0, session_key_js_1.normalizeAccountId)(key) === id; });
        return matchKey ? accounts[matchKey] : undefined;
    };
    var accountCfg = resolveAccountCfg(accountId !== session_key_js_1.DEFAULT_ACCOUNT_ID ? accountId : session_key_js_1.DEFAULT_ACCOUNT_ID);
    var accountTokenFile = (_b = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.tokenFile) === null || _b === void 0 ? void 0 : _b.trim();
    if (accountTokenFile) {
        if (!node_fs_1.default.existsSync(accountTokenFile)) {
            (_c = opts.logMissingFile) === null || _c === void 0 ? void 0 : _c.call(opts, "channels.telegram.accounts.".concat(accountId, ".tokenFile not found: ").concat(accountTokenFile));
            return { token: "", source: "none" };
        }
        try {
            var token = node_fs_1.default.readFileSync(accountTokenFile, "utf-8").trim();
            if (token) {
                return { token: token, source: "tokenFile" };
            }
        }
        catch (err) {
            (_d = opts.logMissingFile) === null || _d === void 0 ? void 0 : _d.call(opts, "channels.telegram.accounts.".concat(accountId, ".tokenFile read failed: ").concat(String(err)));
            return { token: "", source: "none" };
        }
        return { token: "", source: "none" };
    }
    var accountToken = (_e = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.botToken) === null || _e === void 0 ? void 0 : _e.trim();
    if (accountToken) {
        return { token: accountToken, source: "config" };
    }
    var allowEnv = accountId === session_key_js_1.DEFAULT_ACCOUNT_ID;
    var tokenFile = (_f = telegramCfg === null || telegramCfg === void 0 ? void 0 : telegramCfg.tokenFile) === null || _f === void 0 ? void 0 : _f.trim();
    if (tokenFile && allowEnv) {
        if (!node_fs_1.default.existsSync(tokenFile)) {
            (_g = opts.logMissingFile) === null || _g === void 0 ? void 0 : _g.call(opts, "channels.telegram.tokenFile not found: ".concat(tokenFile));
            return { token: "", source: "none" };
        }
        try {
            var token = node_fs_1.default.readFileSync(tokenFile, "utf-8").trim();
            if (token) {
                return { token: token, source: "tokenFile" };
            }
        }
        catch (err) {
            (_h = opts.logMissingFile) === null || _h === void 0 ? void 0 : _h.call(opts, "channels.telegram.tokenFile read failed: ".concat(String(err)));
            return { token: "", source: "none" };
        }
    }
    var configToken = (_j = telegramCfg === null || telegramCfg === void 0 ? void 0 : telegramCfg.botToken) === null || _j === void 0 ? void 0 : _j.trim();
    if (configToken && allowEnv) {
        return { token: configToken, source: "config" };
    }
    var envToken = allowEnv ? (_l = ((_k = opts.envToken) !== null && _k !== void 0 ? _k : process.env.TELEGRAM_BOT_TOKEN)) === null || _l === void 0 ? void 0 : _l.trim() : "";
    if (envToken) {
        return { token: envToken, source: "env" };
    }
    return { token: "", source: "none" };
}
