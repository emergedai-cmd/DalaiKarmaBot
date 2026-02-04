"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNostrAccountIds = listNostrAccountIds;
exports.resolveDefaultNostrAccountId = resolveDefaultNostrAccountId;
exports.resolveNostrAccount = resolveNostrAccount;
var nostr_bus_js_1 = require("./nostr-bus.js");
var nostr_bus_js_2 = require("./nostr-bus.js");
var DEFAULT_ACCOUNT_ID = "default";
/**
 * List all configured Nostr account IDs
 */
function listNostrAccountIds(cfg) {
    var _a;
    var nostrCfg = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.nostr;
    // If privateKey is configured at top level, we have a default account
    if (nostrCfg === null || nostrCfg === void 0 ? void 0 : nostrCfg.privateKey) {
        return [DEFAULT_ACCOUNT_ID];
    }
    return [];
}
/**
 * Get the default account ID
 */
function resolveDefaultNostrAccountId(cfg) {
    var _a;
    var ids = listNostrAccountIds(cfg);
    if (ids.includes(DEFAULT_ACCOUNT_ID)) {
        return DEFAULT_ACCOUNT_ID;
    }
    return (_a = ids[0]) !== null && _a !== void 0 ? _a : DEFAULT_ACCOUNT_ID;
}
/**
 * Resolve a Nostr account from config
 */
function resolveNostrAccount(opts) {
    var _a, _b, _c, _d, _e;
    var accountId = (_a = opts.accountId) !== null && _a !== void 0 ? _a : DEFAULT_ACCOUNT_ID;
    var nostrCfg = (_b = opts.cfg.channels) === null || _b === void 0 ? void 0 : _b.nostr;
    var baseEnabled = (nostrCfg === null || nostrCfg === void 0 ? void 0 : nostrCfg.enabled) !== false;
    var privateKey = (_c = nostrCfg === null || nostrCfg === void 0 ? void 0 : nostrCfg.privateKey) !== null && _c !== void 0 ? _c : "";
    var configured = Boolean(privateKey.trim());
    var publicKey = "";
    if (configured) {
        try {
            publicKey = (0, nostr_bus_js_1.getPublicKeyFromPrivate)(privateKey);
        }
        catch (_f) {
            // Invalid key - leave publicKey empty, configured will indicate issues
        }
    }
    return {
        accountId: accountId,
        name: ((_d = nostrCfg === null || nostrCfg === void 0 ? void 0 : nostrCfg.name) === null || _d === void 0 ? void 0 : _d.trim()) || undefined,
        enabled: baseEnabled,
        configured: configured,
        privateKey: privateKey,
        publicKey: publicKey,
        relays: (_e = nostrCfg === null || nostrCfg === void 0 ? void 0 : nostrCfg.relays) !== null && _e !== void 0 ? _e : nostr_bus_js_2.DEFAULT_RELAYS,
        profile: nostrCfg === null || nostrCfg === void 0 ? void 0 : nostrCfg.profile,
        config: {
            enabled: nostrCfg === null || nostrCfg === void 0 ? void 0 : nostrCfg.enabled,
            name: nostrCfg === null || nostrCfg === void 0 ? void 0 : nostrCfg.name,
            privateKey: nostrCfg === null || nostrCfg === void 0 ? void 0 : nostrCfg.privateKey,
            relays: nostrCfg === null || nostrCfg === void 0 ? void 0 : nostrCfg.relays,
            dmPolicy: nostrCfg === null || nostrCfg === void 0 ? void 0 : nostrCfg.dmPolicy,
            allowFrom: nostrCfg === null || nostrCfg === void 0 ? void 0 : nostrCfg.allowFrom,
            profile: nostrCfg === null || nostrCfg === void 0 ? void 0 : nostrCfg.profile,
        },
    };
}
