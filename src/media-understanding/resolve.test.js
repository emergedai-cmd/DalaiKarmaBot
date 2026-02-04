"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var resolve_js_1 = require("./resolve.js");
var providerRegistry = new Map([
    ["openai", { capabilities: ["image"] }],
    ["groq", { capabilities: ["audio"] }],
]);
(0, vitest_1.describe)("resolveModelEntries", function () {
    (0, vitest_1.it)("uses provider capabilities for shared entries without explicit caps", function () {
        var cfg = {
            tools: {
                media: {
                    models: [{ provider: "openai", model: "gpt-5.2" }],
                },
            },
        };
        var imageEntries = (0, resolve_js_1.resolveModelEntries)({
            cfg: cfg,
            capability: "image",
            providerRegistry: providerRegistry,
        });
        (0, vitest_1.expect)(imageEntries).toHaveLength(1);
        var audioEntries = (0, resolve_js_1.resolveModelEntries)({
            cfg: cfg,
            capability: "audio",
            providerRegistry: providerRegistry,
        });
        (0, vitest_1.expect)(audioEntries).toHaveLength(0);
    });
    (0, vitest_1.it)("keeps per-capability entries even without explicit caps", function () {
        var _a, _b;
        var cfg = {
            tools: {
                media: {
                    image: {
                        models: [{ provider: "openai", model: "gpt-5.2" }],
                    },
                },
            },
        };
        var imageEntries = (0, resolve_js_1.resolveModelEntries)({
            cfg: cfg,
            capability: "image",
            config: (_b = (_a = cfg.tools) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b.image,
            providerRegistry: providerRegistry,
        });
        (0, vitest_1.expect)(imageEntries).toHaveLength(1);
    });
    (0, vitest_1.it)("skips shared CLI entries without capabilities", function () {
        var cfg = {
            tools: {
                media: {
                    models: [{ type: "cli", command: "gemini", args: ["--file", "{{MediaPath}}"] }],
                },
            },
        };
        var entries = (0, resolve_js_1.resolveModelEntries)({
            cfg: cfg,
            capability: "image",
            providerRegistry: providerRegistry,
        });
        (0, vitest_1.expect)(entries).toHaveLength(0);
    });
});
(0, vitest_1.describe)("resolveEntriesWithActiveFallback", function () {
    (0, vitest_1.it)("uses active model when enabled and no models are configured", function () {
        var _a, _b, _c;
        var cfg = {
            tools: {
                media: {
                    audio: { enabled: true },
                },
            },
        };
        var entries = (0, resolve_js_1.resolveEntriesWithActiveFallback)({
            cfg: cfg,
            capability: "audio",
            config: (_b = (_a = cfg.tools) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b.audio,
            providerRegistry: providerRegistry,
            activeModel: { provider: "groq", model: "whisper-large-v3" },
        });
        (0, vitest_1.expect)(entries).toHaveLength(1);
        (0, vitest_1.expect)((_c = entries[0]) === null || _c === void 0 ? void 0 : _c.provider).toBe("groq");
    });
    (0, vitest_1.it)("ignores active model when configured entries exist", function () {
        var _a, _b, _c;
        var cfg = {
            tools: {
                media: {
                    audio: { enabled: true, models: [{ provider: "openai", model: "whisper-1" }] },
                },
            },
        };
        var entries = (0, resolve_js_1.resolveEntriesWithActiveFallback)({
            cfg: cfg,
            capability: "audio",
            config: (_b = (_a = cfg.tools) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b.audio,
            providerRegistry: providerRegistry,
            activeModel: { provider: "groq", model: "whisper-large-v3" },
        });
        (0, vitest_1.expect)(entries).toHaveLength(1);
        (0, vitest_1.expect)((_c = entries[0]) === null || _c === void 0 ? void 0 : _c.provider).toBe("openai");
    });
    (0, vitest_1.it)("skips active model when provider lacks capability", function () {
        var _a, _b;
        var cfg = {
            tools: {
                media: {
                    video: { enabled: true },
                },
            },
        };
        var entries = (0, resolve_js_1.resolveEntriesWithActiveFallback)({
            cfg: cfg,
            capability: "video",
            config: (_b = (_a = cfg.tools) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b.video,
            providerRegistry: providerRegistry,
            activeModel: { provider: "groq", model: "whisper-large-v3" },
        });
        (0, vitest_1.expect)(entries).toHaveLength(0);
    });
});
