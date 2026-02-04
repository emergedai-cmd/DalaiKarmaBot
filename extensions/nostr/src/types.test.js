"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var types_js_1 = require("./types.js");
var TEST_PRIVATE_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
(0, vitest_1.describe)("listNostrAccountIds", function () {
    (0, vitest_1.it)("returns empty array when not configured", function () {
        var cfg = { channels: {} };
        (0, vitest_1.expect)((0, types_js_1.listNostrAccountIds)(cfg)).toEqual([]);
    });
    (0, vitest_1.it)("returns empty array when nostr section exists but no privateKey", function () {
        var cfg = { channels: { nostr: { enabled: true } } };
        (0, vitest_1.expect)((0, types_js_1.listNostrAccountIds)(cfg)).toEqual([]);
    });
    (0, vitest_1.it)("returns default when privateKey is configured", function () {
        var cfg = {
            channels: {
                nostr: { privateKey: TEST_PRIVATE_KEY },
            },
        };
        (0, vitest_1.expect)((0, types_js_1.listNostrAccountIds)(cfg)).toEqual(["default"]);
    });
});
(0, vitest_1.describe)("resolveDefaultNostrAccountId", function () {
    (0, vitest_1.it)("returns default when configured", function () {
        var cfg = {
            channels: {
                nostr: { privateKey: TEST_PRIVATE_KEY },
            },
        };
        (0, vitest_1.expect)((0, types_js_1.resolveDefaultNostrAccountId)(cfg)).toBe("default");
    });
    (0, vitest_1.it)("returns default when not configured", function () {
        var cfg = { channels: {} };
        (0, vitest_1.expect)((0, types_js_1.resolveDefaultNostrAccountId)(cfg)).toBe("default");
    });
});
(0, vitest_1.describe)("resolveNostrAccount", function () {
    (0, vitest_1.it)("resolves configured account", function () {
        var cfg = {
            channels: {
                nostr: {
                    privateKey: TEST_PRIVATE_KEY,
                    name: "Test Bot",
                    relays: ["wss://test.relay"],
                    dmPolicy: "pairing",
                },
            },
        };
        var account = (0, types_js_1.resolveNostrAccount)({ cfg: cfg });
        (0, vitest_1.expect)(account.accountId).toBe("default");
        (0, vitest_1.expect)(account.name).toBe("Test Bot");
        (0, vitest_1.expect)(account.enabled).toBe(true);
        (0, vitest_1.expect)(account.configured).toBe(true);
        (0, vitest_1.expect)(account.privateKey).toBe(TEST_PRIVATE_KEY);
        (0, vitest_1.expect)(account.publicKey).toMatch(/^[0-9a-f]{64}$/);
        (0, vitest_1.expect)(account.relays).toEqual(["wss://test.relay"]);
    });
    (0, vitest_1.it)("resolves unconfigured account with defaults", function () {
        var cfg = { channels: {} };
        var account = (0, types_js_1.resolveNostrAccount)({ cfg: cfg });
        (0, vitest_1.expect)(account.accountId).toBe("default");
        (0, vitest_1.expect)(account.enabled).toBe(true);
        (0, vitest_1.expect)(account.configured).toBe(false);
        (0, vitest_1.expect)(account.privateKey).toBe("");
        (0, vitest_1.expect)(account.publicKey).toBe("");
        (0, vitest_1.expect)(account.relays).toContain("wss://relay.damus.io");
        (0, vitest_1.expect)(account.relays).toContain("wss://nos.lol");
    });
    (0, vitest_1.it)("handles disabled channel", function () {
        var cfg = {
            channels: {
                nostr: {
                    enabled: false,
                    privateKey: TEST_PRIVATE_KEY,
                },
            },
        };
        var account = (0, types_js_1.resolveNostrAccount)({ cfg: cfg });
        (0, vitest_1.expect)(account.enabled).toBe(false);
        (0, vitest_1.expect)(account.configured).toBe(true);
    });
    (0, vitest_1.it)("handles custom accountId parameter", function () {
        var cfg = {
            channels: {
                nostr: { privateKey: TEST_PRIVATE_KEY },
            },
        };
        var account = (0, types_js_1.resolveNostrAccount)({ cfg: cfg, accountId: "custom" });
        (0, vitest_1.expect)(account.accountId).toBe("custom");
    });
    (0, vitest_1.it)("handles allowFrom config", function () {
        var cfg = {
            channels: {
                nostr: {
                    privateKey: TEST_PRIVATE_KEY,
                    allowFrom: ["npub1test", "0123456789abcdef"],
                },
            },
        };
        var account = (0, types_js_1.resolveNostrAccount)({ cfg: cfg });
        (0, vitest_1.expect)(account.config.allowFrom).toEqual(["npub1test", "0123456789abcdef"]);
    });
    (0, vitest_1.it)("handles invalid private key gracefully", function () {
        var cfg = {
            channels: {
                nostr: {
                    privateKey: "invalid-key",
                },
            },
        };
        var account = (0, types_js_1.resolveNostrAccount)({ cfg: cfg });
        (0, vitest_1.expect)(account.configured).toBe(true); // key is present
        (0, vitest_1.expect)(account.publicKey).toBe(""); // but can't derive pubkey
    });
    (0, vitest_1.it)("preserves all config options", function () {
        var cfg = {
            channels: {
                nostr: {
                    privateKey: TEST_PRIVATE_KEY,
                    name: "Bot",
                    enabled: true,
                    relays: ["wss://relay1", "wss://relay2"],
                    dmPolicy: "allowlist",
                    allowFrom: ["pubkey1", "pubkey2"],
                },
            },
        };
        var account = (0, types_js_1.resolveNostrAccount)({ cfg: cfg });
        (0, vitest_1.expect)(account.config).toEqual({
            privateKey: TEST_PRIVATE_KEY,
            name: "Bot",
            enabled: true,
            relays: ["wss://relay1", "wss://relay2"],
            dmPolicy: "allowlist",
            allowFrom: ["pubkey1", "pubkey2"],
        });
    });
});
