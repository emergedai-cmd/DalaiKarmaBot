"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var channel_config_js_1 = require("./channel-config.js");
(0, vitest_1.describe)("buildChannelKeyCandidates", function () {
    (0, vitest_1.it)("dedupes and trims keys", function () {
        (0, vitest_1.expect)((0, channel_config_js_1.buildChannelKeyCandidates)(" a ", "a", "", "b", "b")).toEqual(["a", "b"]);
    });
});
(0, vitest_1.describe)("normalizeChannelSlug", function () {
    (0, vitest_1.it)("normalizes names into slugs", function () {
        (0, vitest_1.expect)((0, channel_config_js_1.normalizeChannelSlug)("My Team")).toBe("my-team");
        (0, vitest_1.expect)((0, channel_config_js_1.normalizeChannelSlug)("#General Chat")).toBe("general-chat");
        (0, vitest_1.expect)((0, channel_config_js_1.normalizeChannelSlug)(" Dev__Chat ")).toBe("dev-chat");
    });
});
(0, vitest_1.describe)("resolveChannelEntryMatch", function () {
    (0, vitest_1.it)("returns matched entry and wildcard metadata", function () {
        var entries = { a: { allow: true }, "*": { allow: false } };
        var match = (0, channel_config_js_1.resolveChannelEntryMatch)({
            entries: entries,
            keys: ["missing", "a"],
            wildcardKey: "*",
        });
        (0, vitest_1.expect)(match.entry).toBe(entries.a);
        (0, vitest_1.expect)(match.key).toBe("a");
        (0, vitest_1.expect)(match.wildcardEntry).toBe(entries["*"]);
        (0, vitest_1.expect)(match.wildcardKey).toBe("*");
    });
});
(0, vitest_1.describe)("resolveChannelEntryMatchWithFallback", function () {
    (0, vitest_1.it)("prefers direct matches over parent and wildcard", function () {
        var entries = { a: { allow: true }, parent: { allow: false }, "*": { allow: false } };
        var match = (0, channel_config_js_1.resolveChannelEntryMatchWithFallback)({
            entries: entries,
            keys: ["a"],
            parentKeys: ["parent"],
            wildcardKey: "*",
        });
        (0, vitest_1.expect)(match.entry).toBe(entries.a);
        (0, vitest_1.expect)(match.matchSource).toBe("direct");
        (0, vitest_1.expect)(match.matchKey).toBe("a");
    });
    (0, vitest_1.it)("falls back to parent when direct misses", function () {
        var entries = { parent: { allow: false }, "*": { allow: true } };
        var match = (0, channel_config_js_1.resolveChannelEntryMatchWithFallback)({
            entries: entries,
            keys: ["missing"],
            parentKeys: ["parent"],
            wildcardKey: "*",
        });
        (0, vitest_1.expect)(match.entry).toBe(entries.parent);
        (0, vitest_1.expect)(match.matchSource).toBe("parent");
        (0, vitest_1.expect)(match.matchKey).toBe("parent");
    });
    (0, vitest_1.it)("falls back to wildcard when no direct or parent match", function () {
        var entries = { "*": { allow: true } };
        var match = (0, channel_config_js_1.resolveChannelEntryMatchWithFallback)({
            entries: entries,
            keys: ["missing"],
            parentKeys: ["still-missing"],
            wildcardKey: "*",
        });
        (0, vitest_1.expect)(match.entry).toBe(entries["*"]);
        (0, vitest_1.expect)(match.matchSource).toBe("wildcard");
        (0, vitest_1.expect)(match.matchKey).toBe("*");
    });
    (0, vitest_1.it)("matches normalized keys when normalizeKey is provided", function () {
        var entries = { "My Team": { allow: true } };
        var match = (0, channel_config_js_1.resolveChannelEntryMatchWithFallback)({
            entries: entries,
            keys: ["my-team"],
            normalizeKey: channel_config_js_1.normalizeChannelSlug,
        });
        (0, vitest_1.expect)(match.entry).toBe(entries["My Team"]);
        (0, vitest_1.expect)(match.matchSource).toBe("direct");
        (0, vitest_1.expect)(match.matchKey).toBe("My Team");
    });
});
(0, vitest_1.describe)("applyChannelMatchMeta", function () {
    (0, vitest_1.it)("copies match metadata onto resolved configs", function () {
        var resolved = (0, channel_config_js_1.applyChannelMatchMeta)({ allowed: true }, { matchKey: "general", matchSource: "direct" });
        (0, vitest_1.expect)(resolved.matchKey).toBe("general");
        (0, vitest_1.expect)(resolved.matchSource).toBe("direct");
    });
});
(0, vitest_1.describe)("resolveChannelMatchConfig", function () {
    (0, vitest_1.it)("returns null when no entry is matched", function () {
        var resolved = (0, channel_config_js_1.resolveChannelMatchConfig)({ matchKey: "x" }, function () { return ({ allowed: true }); });
        (0, vitest_1.expect)(resolved).toBeNull();
    });
    (0, vitest_1.it)("resolves entry and applies match metadata", function () {
        var resolved = (0, channel_config_js_1.resolveChannelMatchConfig)({ entry: { allow: true }, matchKey: "*", matchSource: "wildcard" }, function () { return ({ allowed: true }); });
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.matchKey).toBe("*");
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.matchSource).toBe("wildcard");
    });
});
(0, vitest_1.describe)("resolveNestedAllowlistDecision", function () {
    (0, vitest_1.it)("allows when outer allowlist is disabled", function () {
        (0, vitest_1.expect)((0, channel_config_js_1.resolveNestedAllowlistDecision)({
            outerConfigured: false,
            outerMatched: false,
            innerConfigured: false,
            innerMatched: false,
        })).toBe(true);
    });
    (0, vitest_1.it)("blocks when outer allowlist is configured but missing match", function () {
        (0, vitest_1.expect)((0, channel_config_js_1.resolveNestedAllowlistDecision)({
            outerConfigured: true,
            outerMatched: false,
            innerConfigured: false,
            innerMatched: false,
        })).toBe(false);
    });
    (0, vitest_1.it)("requires inner match when inner allowlist is configured", function () {
        (0, vitest_1.expect)((0, channel_config_js_1.resolveNestedAllowlistDecision)({
            outerConfigured: true,
            outerMatched: true,
            innerConfigured: true,
            innerMatched: false,
        })).toBe(false);
        (0, vitest_1.expect)((0, channel_config_js_1.resolveNestedAllowlistDecision)({
            outerConfigured: true,
            outerMatched: true,
            innerConfigured: true,
            innerMatched: true,
        })).toBe(true);
    });
});
