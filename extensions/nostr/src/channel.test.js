"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var channel_js_1 = require("./channel.js");
(0, vitest_1.describe)("nostrPlugin", function () {
    (0, vitest_1.describe)("meta", function () {
        (0, vitest_1.it)("has correct id", function () {
            (0, vitest_1.expect)(channel_js_1.nostrPlugin.id).toBe("nostr");
        });
        (0, vitest_1.it)("has required meta fields", function () {
            (0, vitest_1.expect)(channel_js_1.nostrPlugin.meta.label).toBe("Nostr");
            (0, vitest_1.expect)(channel_js_1.nostrPlugin.meta.docsPath).toBe("/channels/nostr");
            (0, vitest_1.expect)(channel_js_1.nostrPlugin.meta.blurb).toContain("NIP-04");
        });
    });
    (0, vitest_1.describe)("capabilities", function () {
        (0, vitest_1.it)("supports direct messages", function () {
            (0, vitest_1.expect)(channel_js_1.nostrPlugin.capabilities.chatTypes).toContain("direct");
        });
        (0, vitest_1.it)("does not support groups (MVP)", function () {
            (0, vitest_1.expect)(channel_js_1.nostrPlugin.capabilities.chatTypes).not.toContain("group");
        });
        (0, vitest_1.it)("does not support media (MVP)", function () {
            (0, vitest_1.expect)(channel_js_1.nostrPlugin.capabilities.media).toBe(false);
        });
    });
    (0, vitest_1.describe)("config adapter", function () {
        (0, vitest_1.it)("has required config functions", function () {
            (0, vitest_1.expect)(channel_js_1.nostrPlugin.config.listAccountIds).toBeTypeOf("function");
            (0, vitest_1.expect)(channel_js_1.nostrPlugin.config.resolveAccount).toBeTypeOf("function");
            (0, vitest_1.expect)(channel_js_1.nostrPlugin.config.isConfigured).toBeTypeOf("function");
        });
        (0, vitest_1.it)("listAccountIds returns empty array for unconfigured", function () {
            var cfg = { channels: {} };
            var ids = channel_js_1.nostrPlugin.config.listAccountIds(cfg);
            (0, vitest_1.expect)(ids).toEqual([]);
        });
        (0, vitest_1.it)("listAccountIds returns default for configured", function () {
            var cfg = {
                channels: {
                    nostr: {
                        privateKey: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
                    },
                },
            };
            var ids = channel_js_1.nostrPlugin.config.listAccountIds(cfg);
            (0, vitest_1.expect)(ids).toContain("default");
        });
    });
    (0, vitest_1.describe)("messaging", function () {
        (0, vitest_1.it)("has target resolver", function () {
            var _a, _b;
            (0, vitest_1.expect)((_b = (_a = channel_js_1.nostrPlugin.messaging) === null || _a === void 0 ? void 0 : _a.targetResolver) === null || _b === void 0 ? void 0 : _b.looksLikeId).toBeTypeOf("function");
        });
        (0, vitest_1.it)("recognizes npub as valid target", function () {
            var _a, _b;
            var looksLikeId = (_b = (_a = channel_js_1.nostrPlugin.messaging) === null || _a === void 0 ? void 0 : _a.targetResolver) === null || _b === void 0 ? void 0 : _b.looksLikeId;
            if (!looksLikeId) {
                return;
            }
            (0, vitest_1.expect)(looksLikeId("npub1xyz123")).toBe(true);
        });
        (0, vitest_1.it)("recognizes hex pubkey as valid target", function () {
            var _a, _b;
            var looksLikeId = (_b = (_a = channel_js_1.nostrPlugin.messaging) === null || _a === void 0 ? void 0 : _a.targetResolver) === null || _b === void 0 ? void 0 : _b.looksLikeId;
            if (!looksLikeId) {
                return;
            }
            var hexPubkey = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
            (0, vitest_1.expect)(looksLikeId(hexPubkey)).toBe(true);
        });
        (0, vitest_1.it)("rejects invalid input", function () {
            var _a, _b;
            var looksLikeId = (_b = (_a = channel_js_1.nostrPlugin.messaging) === null || _a === void 0 ? void 0 : _a.targetResolver) === null || _b === void 0 ? void 0 : _b.looksLikeId;
            if (!looksLikeId) {
                return;
            }
            (0, vitest_1.expect)(looksLikeId("not-a-pubkey")).toBe(false);
            (0, vitest_1.expect)(looksLikeId("")).toBe(false);
        });
        (0, vitest_1.it)("normalizeTarget strips nostr: prefix", function () {
            var _a;
            var normalize = (_a = channel_js_1.nostrPlugin.messaging) === null || _a === void 0 ? void 0 : _a.normalizeTarget;
            if (!normalize) {
                return;
            }
            var hexPubkey = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
            (0, vitest_1.expect)(normalize("nostr:".concat(hexPubkey))).toBe(hexPubkey);
        });
    });
    (0, vitest_1.describe)("outbound", function () {
        (0, vitest_1.it)("has correct delivery mode", function () {
            var _a;
            (0, vitest_1.expect)((_a = channel_js_1.nostrPlugin.outbound) === null || _a === void 0 ? void 0 : _a.deliveryMode).toBe("direct");
        });
        (0, vitest_1.it)("has reasonable text chunk limit", function () {
            var _a;
            (0, vitest_1.expect)((_a = channel_js_1.nostrPlugin.outbound) === null || _a === void 0 ? void 0 : _a.textChunkLimit).toBe(4000);
        });
    });
    (0, vitest_1.describe)("pairing", function () {
        (0, vitest_1.it)("has id label for pairing", function () {
            var _a;
            (0, vitest_1.expect)((_a = channel_js_1.nostrPlugin.pairing) === null || _a === void 0 ? void 0 : _a.idLabel).toBe("nostrPubkey");
        });
        (0, vitest_1.it)("normalizes nostr: prefix in allow entries", function () {
            var _a;
            var normalize = (_a = channel_js_1.nostrPlugin.pairing) === null || _a === void 0 ? void 0 : _a.normalizeAllowEntry;
            if (!normalize) {
                return;
            }
            var hexPubkey = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
            (0, vitest_1.expect)(normalize("nostr:".concat(hexPubkey))).toBe(hexPubkey);
        });
    });
    (0, vitest_1.describe)("security", function () {
        (0, vitest_1.it)("has resolveDmPolicy function", function () {
            var _a;
            (0, vitest_1.expect)((_a = channel_js_1.nostrPlugin.security) === null || _a === void 0 ? void 0 : _a.resolveDmPolicy).toBeTypeOf("function");
        });
    });
    (0, vitest_1.describe)("gateway", function () {
        (0, vitest_1.it)("has startAccount function", function () {
            var _a;
            (0, vitest_1.expect)((_a = channel_js_1.nostrPlugin.gateway) === null || _a === void 0 ? void 0 : _a.startAccount).toBeTypeOf("function");
        });
    });
    (0, vitest_1.describe)("status", function () {
        (0, vitest_1.it)("has default runtime", function () {
            var _a, _b, _c, _d, _e;
            (0, vitest_1.expect)((_a = channel_js_1.nostrPlugin.status) === null || _a === void 0 ? void 0 : _a.defaultRuntime).toBeDefined();
            (0, vitest_1.expect)((_c = (_b = channel_js_1.nostrPlugin.status) === null || _b === void 0 ? void 0 : _b.defaultRuntime) === null || _c === void 0 ? void 0 : _c.accountId).toBe("default");
            (0, vitest_1.expect)((_e = (_d = channel_js_1.nostrPlugin.status) === null || _d === void 0 ? void 0 : _d.defaultRuntime) === null || _e === void 0 ? void 0 : _e.running).toBe(false);
        });
        (0, vitest_1.it)("has buildAccountSnapshot function", function () {
            var _a;
            (0, vitest_1.expect)((_a = channel_js_1.nostrPlugin.status) === null || _a === void 0 ? void 0 : _a.buildAccountSnapshot).toBeTypeOf("function");
        });
    });
});
