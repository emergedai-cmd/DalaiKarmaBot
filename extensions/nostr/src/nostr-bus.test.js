"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var nostr_bus_js_1 = require("./nostr-bus.js");
// Test private key (DO NOT use in production - this is a known test key)
var TEST_HEX_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
var TEST_NSEC = "nsec1qypqxpq9qtpqscx7peytzfwtdjmcv0mrz5rjpej8vjppfkqfqy8skqfv3l";
(0, vitest_1.describe)("validatePrivateKey", function () {
    (0, vitest_1.describe)("hex format", function () {
        (0, vitest_1.it)("accepts valid 64-char hex key", function () {
            var result = (0, nostr_bus_js_1.validatePrivateKey)(TEST_HEX_KEY);
            (0, vitest_1.expect)(result).toBeInstanceOf(Uint8Array);
            (0, vitest_1.expect)(result.length).toBe(32);
        });
        (0, vitest_1.it)("accepts lowercase hex", function () {
            var result = (0, nostr_bus_js_1.validatePrivateKey)(TEST_HEX_KEY.toLowerCase());
            (0, vitest_1.expect)(result).toBeInstanceOf(Uint8Array);
        });
        (0, vitest_1.it)("accepts uppercase hex", function () {
            var result = (0, nostr_bus_js_1.validatePrivateKey)(TEST_HEX_KEY.toUpperCase());
            (0, vitest_1.expect)(result).toBeInstanceOf(Uint8Array);
        });
        (0, vitest_1.it)("accepts mixed case hex", function () {
            var mixed = "0123456789ABCdef0123456789abcDEF0123456789abcdef0123456789ABCDEF";
            var result = (0, nostr_bus_js_1.validatePrivateKey)(mixed);
            (0, vitest_1.expect)(result).toBeInstanceOf(Uint8Array);
        });
        (0, vitest_1.it)("trims whitespace", function () {
            var result = (0, nostr_bus_js_1.validatePrivateKey)("  ".concat(TEST_HEX_KEY, "  "));
            (0, vitest_1.expect)(result).toBeInstanceOf(Uint8Array);
        });
        (0, vitest_1.it)("trims newlines", function () {
            var result = (0, nostr_bus_js_1.validatePrivateKey)("".concat(TEST_HEX_KEY, "\n"));
            (0, vitest_1.expect)(result).toBeInstanceOf(Uint8Array);
        });
        (0, vitest_1.it)("rejects 63-char hex (too short)", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(TEST_HEX_KEY.slice(0, 63)); }).toThrow("Private key must be 64 hex characters");
        });
        (0, vitest_1.it)("rejects 65-char hex (too long)", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(TEST_HEX_KEY + "0"); }).toThrow("Private key must be 64 hex characters");
        });
        (0, vitest_1.it)("rejects non-hex characters", function () {
            var invalid = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdeg"; // 'g' at end
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(invalid); }).toThrow("Private key must be 64 hex characters");
        });
        (0, vitest_1.it)("rejects empty string", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(""); }).toThrow("Private key must be 64 hex characters");
        });
        (0, vitest_1.it)("rejects whitespace-only string", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)("   "); }).toThrow("Private key must be 64 hex characters");
        });
        (0, vitest_1.it)("rejects key with 0x prefix", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)("0x" + TEST_HEX_KEY); }).toThrow("Private key must be 64 hex characters");
        });
    });
    (0, vitest_1.describe)("nsec format", function () {
        (0, vitest_1.it)("rejects invalid nsec (wrong checksum)", function () {
            var badNsec = "nsec1invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalid";
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(badNsec); }).toThrow();
        });
        (0, vitest_1.it)("rejects npub (wrong type)", function () {
            var npub = "npub1qypqxpq9qtpqscx7peytzfwtdjmcv0mrz5rjpej8vjppfkqfqy8s5epk55";
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(npub); }).toThrow();
        });
    });
});
(0, vitest_1.describe)("isValidPubkey", function () {
    (0, vitest_1.describe)("hex format", function () {
        (0, vitest_1.it)("accepts valid 64-char hex pubkey", function () {
            var validHex = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
            (0, vitest_1.expect)((0, nostr_bus_js_1.isValidPubkey)(validHex)).toBe(true);
        });
        (0, vitest_1.it)("accepts uppercase hex", function () {
            var validHex = "0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF";
            (0, vitest_1.expect)((0, nostr_bus_js_1.isValidPubkey)(validHex)).toBe(true);
        });
        (0, vitest_1.it)("rejects 63-char hex", function () {
            var shortHex = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde";
            (0, vitest_1.expect)((0, nostr_bus_js_1.isValidPubkey)(shortHex)).toBe(false);
        });
        (0, vitest_1.it)("rejects 65-char hex", function () {
            var longHex = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0";
            (0, vitest_1.expect)((0, nostr_bus_js_1.isValidPubkey)(longHex)).toBe(false);
        });
        (0, vitest_1.it)("rejects non-hex characters", function () {
            var invalid = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdeg";
            (0, vitest_1.expect)((0, nostr_bus_js_1.isValidPubkey)(invalid)).toBe(false);
        });
    });
    (0, vitest_1.describe)("npub format", function () {
        (0, vitest_1.it)("rejects invalid npub", function () {
            (0, vitest_1.expect)((0, nostr_bus_js_1.isValidPubkey)("npub1invalid")).toBe(false);
        });
        (0, vitest_1.it)("rejects nsec (wrong type)", function () {
            (0, vitest_1.expect)((0, nostr_bus_js_1.isValidPubkey)(TEST_NSEC)).toBe(false);
        });
    });
    (0, vitest_1.describe)("edge cases", function () {
        (0, vitest_1.it)("rejects empty string", function () {
            (0, vitest_1.expect)((0, nostr_bus_js_1.isValidPubkey)("")).toBe(false);
        });
        (0, vitest_1.it)("handles whitespace-padded input", function () {
            var validHex = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
            (0, vitest_1.expect)((0, nostr_bus_js_1.isValidPubkey)("  ".concat(validHex, "  "))).toBe(true);
        });
    });
});
(0, vitest_1.describe)("normalizePubkey", function () {
    (0, vitest_1.describe)("hex format", function () {
        (0, vitest_1.it)("lowercases hex pubkey", function () {
            var upper = "0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF";
            var result = (0, nostr_bus_js_1.normalizePubkey)(upper);
            (0, vitest_1.expect)(result).toBe(upper.toLowerCase());
        });
        (0, vitest_1.it)("trims whitespace", function () {
            var hex = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
            (0, vitest_1.expect)((0, nostr_bus_js_1.normalizePubkey)("  ".concat(hex, "  "))).toBe(hex);
        });
        (0, vitest_1.it)("rejects invalid hex", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.normalizePubkey)("invalid"); }).toThrow("Pubkey must be 64 hex characters");
        });
    });
});
(0, vitest_1.describe)("getPublicKeyFromPrivate", function () {
    (0, vitest_1.it)("derives public key from hex private key", function () {
        var pubkey = (0, nostr_bus_js_1.getPublicKeyFromPrivate)(TEST_HEX_KEY);
        (0, vitest_1.expect)(pubkey).toMatch(/^[0-9a-f]{64}$/);
        (0, vitest_1.expect)(pubkey.length).toBe(64);
    });
    (0, vitest_1.it)("derives consistent public key", function () {
        var pubkey1 = (0, nostr_bus_js_1.getPublicKeyFromPrivate)(TEST_HEX_KEY);
        var pubkey2 = (0, nostr_bus_js_1.getPublicKeyFromPrivate)(TEST_HEX_KEY);
        (0, vitest_1.expect)(pubkey1).toBe(pubkey2);
    });
    (0, vitest_1.it)("throws for invalid private key", function () {
        (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.getPublicKeyFromPrivate)("invalid"); }).toThrow();
    });
});
(0, vitest_1.describe)("pubkeyToNpub", function () {
    (0, vitest_1.it)("converts hex pubkey to npub format", function () {
        var hex = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
        var npub = (0, nostr_bus_js_1.pubkeyToNpub)(hex);
        (0, vitest_1.expect)(npub).toMatch(/^npub1[a-z0-9]+$/);
    });
    (0, vitest_1.it)("produces consistent output", function () {
        var hex = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
        var npub1 = (0, nostr_bus_js_1.pubkeyToNpub)(hex);
        var npub2 = (0, nostr_bus_js_1.pubkeyToNpub)(hex);
        (0, vitest_1.expect)(npub1).toBe(npub2);
    });
    (0, vitest_1.it)("normalizes uppercase hex first", function () {
        var lower = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
        var upper = lower.toUpperCase();
        (0, vitest_1.expect)((0, nostr_bus_js_1.pubkeyToNpub)(lower)).toBe((0, nostr_bus_js_1.pubkeyToNpub)(upper));
    });
});
