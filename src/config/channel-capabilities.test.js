"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var runtime_js_1 = require("../plugins/runtime.js");
var channel_capabilities_js_1 = require("./channel-capabilities.js");
(0, vitest_1.describe)("resolveChannelCapabilities", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)(baseRegistry);
    });
    (0, vitest_1.afterEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)(baseRegistry);
    });
    (0, vitest_1.it)("returns undefined for missing inputs", function () {
        (0, vitest_1.expect)((0, channel_capabilities_js_1.resolveChannelCapabilities)({})).toBeUndefined();
        (0, vitest_1.expect)((0, channel_capabilities_js_1.resolveChannelCapabilities)({ cfg: {} })).toBeUndefined();
        (0, vitest_1.expect)((0, channel_capabilities_js_1.resolveChannelCapabilities)({ cfg: {}, channel: "" })).toBeUndefined();
    });
    (0, vitest_1.it)("normalizes and prefers per-account capabilities", function () {
        var cfg = {
            channels: {
                telegram: {
                    capabilities: [" inlineButtons ", ""],
                    accounts: {
                        default: {
                            capabilities: [" perAccount ", "  "],
                        },
                    },
                },
            },
        };
        (0, vitest_1.expect)((0, channel_capabilities_js_1.resolveChannelCapabilities)({
            cfg: cfg,
            channel: "telegram",
            accountId: "default",
        })).toEqual(["perAccount"]);
    });
    (0, vitest_1.it)("falls back to provider capabilities when account capabilities are missing", function () {
        var cfg = {
            channels: {
                telegram: {
                    capabilities: ["inlineButtons"],
                    accounts: {
                        default: {},
                    },
                },
            },
        };
        (0, vitest_1.expect)((0, channel_capabilities_js_1.resolveChannelCapabilities)({
            cfg: cfg,
            channel: "telegram",
            accountId: "default",
        })).toEqual(["inlineButtons"]);
    });
    (0, vitest_1.it)("matches account keys case-insensitively", function () {
        var cfg = {
            channels: {
                slack: {
                    accounts: {
                        Family: { capabilities: ["threads"] },
                    },
                },
            },
        };
        (0, vitest_1.expect)((0, channel_capabilities_js_1.resolveChannelCapabilities)({
            cfg: cfg,
            channel: "slack",
            accountId: "family",
        })).toEqual(["threads"]);
    });
    (0, vitest_1.it)("supports msteams capabilities", function () {
        (0, runtime_js_1.setActivePluginRegistry)(createRegistry([
            {
                pluginId: "msteams",
                source: "test",
                plugin: createMSTeamsPlugin(),
            },
        ]));
        var cfg = {
            channels: { msteams: { capabilities: [" polls ", ""] } },
        };
        (0, vitest_1.expect)((0, channel_capabilities_js_1.resolveChannelCapabilities)({
            cfg: cfg,
            channel: "msteams",
        })).toEqual(["polls"]);
    });
    (0, vitest_1.it)("handles object-format capabilities gracefully (e.g., { inlineButtons: 'dm' })", function () {
        var cfg = {
            channels: {
                telegram: {
                    // Object format - used for granular control like inlineButtons scope.
                    // Channel-specific handlers (resolveTelegramInlineButtonsScope) process these.
                    capabilities: { inlineButtons: "dm" },
                },
            },
        };
        // Should return undefined (not crash), allowing channel-specific handlers to process it.
        (0, vitest_1.expect)((0, channel_capabilities_js_1.resolveChannelCapabilities)({
            cfg: cfg,
            channel: "telegram",
        })).toBeUndefined();
    });
});
var createRegistry = function (channels) { return ({
    plugins: [],
    tools: [],
    channels: channels,
    providers: [],
    gatewayHandlers: {},
    httpHandlers: [],
    httpRoutes: [],
    cliRegistrars: [],
    services: [],
    diagnostics: [],
}); };
var createStubPlugin = function (id) { return ({
    id: id,
    meta: {
        id: id,
        label: id,
        selectionLabel: id,
        docsPath: "/channels/".concat(id),
        blurb: "test stub.",
    },
    capabilities: { chatTypes: ["direct"] },
    config: {
        listAccountIds: function () { return []; },
        resolveAccount: function () { return ({}); },
    },
}); };
var baseRegistry = createRegistry([
    { pluginId: "telegram", source: "test", plugin: createStubPlugin("telegram") },
    { pluginId: "slack", source: "test", plugin: createStubPlugin("slack") },
]);
var createMSTeamsPlugin = function () { return ({
    id: "msteams",
    meta: {
        id: "msteams",
        label: "Microsoft Teams",
        selectionLabel: "Microsoft Teams (Bot Framework)",
        docsPath: "/channels/msteams",
        blurb: "Bot Framework; enterprise support.",
    },
    capabilities: { chatTypes: ["direct"] },
    config: {
        listAccountIds: function () { return []; },
        resolveAccount: function () { return ({}); },
    },
}); };
