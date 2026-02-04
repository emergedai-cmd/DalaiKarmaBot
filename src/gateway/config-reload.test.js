"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var index_js_1 = require("../channels/plugins/index.js");
var runtime_js_1 = require("../plugins/runtime.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var config_reload_js_1 = require("./config-reload.js");
(0, vitest_1.describe)("diffConfigPaths", function () {
    (0, vitest_1.it)("captures nested config changes", function () {
        var prev = { hooks: { gmail: { account: "a" } } };
        var next = { hooks: { gmail: { account: "b" } } };
        var paths = (0, config_reload_js_1.diffConfigPaths)(prev, next);
        (0, vitest_1.expect)(paths).toContain("hooks.gmail.account");
    });
    (0, vitest_1.it)("captures array changes", function () {
        var prev = { messages: { groupChat: { mentionPatterns: ["a"] } } };
        var next = { messages: { groupChat: { mentionPatterns: ["b"] } } };
        var paths = (0, config_reload_js_1.diffConfigPaths)(prev, next);
        (0, vitest_1.expect)(paths).toContain("messages.groupChat.mentionPatterns");
    });
});
(0, vitest_1.describe)("buildGatewayReloadPlan", function () {
    var emptyRegistry = (0, channel_plugins_js_1.createTestRegistry)([]);
    var telegramPlugin = {
        id: "telegram",
        meta: {
            id: "telegram",
            label: "Telegram",
            selectionLabel: "Telegram",
            docsPath: "/channels/telegram",
            blurb: "test",
        },
        capabilities: { chatTypes: ["direct"] },
        config: {
            listAccountIds: function () { return []; },
            resolveAccount: function () { return ({}); },
        },
        reload: { configPrefixes: ["channels.telegram"] },
    };
    var whatsappPlugin = {
        id: "whatsapp",
        meta: {
            id: "whatsapp",
            label: "WhatsApp",
            selectionLabel: "WhatsApp",
            docsPath: "/channels/whatsapp",
            blurb: "test",
        },
        capabilities: { chatTypes: ["direct"] },
        config: {
            listAccountIds: function () { return []; },
            resolveAccount: function () { return ({}); },
        },
        reload: { configPrefixes: ["web"], noopPrefixes: ["channels.whatsapp"] },
    };
    var registry = (0, channel_plugins_js_1.createTestRegistry)([
        { pluginId: "telegram", plugin: telegramPlugin, source: "test" },
        { pluginId: "whatsapp", plugin: whatsappPlugin, source: "test" },
    ]);
    (0, vitest_1.beforeEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)(registry);
    });
    (0, vitest_1.afterEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)(emptyRegistry);
    });
    (0, vitest_1.it)("marks gateway changes as restart required", function () {
        var plan = (0, config_reload_js_1.buildGatewayReloadPlan)(["gateway.port"]);
        (0, vitest_1.expect)(plan.restartGateway).toBe(true);
        (0, vitest_1.expect)(plan.restartReasons).toContain("gateway.port");
    });
    (0, vitest_1.it)("restarts the Gmail watcher for hooks.gmail changes", function () {
        var plan = (0, config_reload_js_1.buildGatewayReloadPlan)(["hooks.gmail.account"]);
        (0, vitest_1.expect)(plan.restartGateway).toBe(false);
        (0, vitest_1.expect)(plan.restartGmailWatcher).toBe(true);
        (0, vitest_1.expect)(plan.reloadHooks).toBe(true);
    });
    (0, vitest_1.it)("restarts providers when provider config prefixes change", function () {
        var changedPaths = ["web.enabled", "channels.telegram.botToken"];
        var plan = (0, config_reload_js_1.buildGatewayReloadPlan)(changedPaths);
        (0, vitest_1.expect)(plan.restartGateway).toBe(false);
        var expected = new Set((0, index_js_1.listChannelPlugins)()
            .filter(function (plugin) {
            var _a, _b;
            return ((_b = (_a = plugin.reload) === null || _a === void 0 ? void 0 : _a.configPrefixes) !== null && _b !== void 0 ? _b : []).some(function (prefix) {
                return changedPaths.some(function (path) { return path === prefix || path.startsWith("".concat(prefix, ".")); });
            });
        })
            .map(function (plugin) { return plugin.id; }));
        (0, vitest_1.expect)(expected.size).toBeGreaterThan(0);
        (0, vitest_1.expect)(plan.restartChannels).toEqual(expected);
    });
    (0, vitest_1.it)("treats gateway.remote as no-op", function () {
        var plan = (0, config_reload_js_1.buildGatewayReloadPlan)(["gateway.remote.url"]);
        (0, vitest_1.expect)(plan.restartGateway).toBe(false);
        (0, vitest_1.expect)(plan.noopPaths).toContain("gateway.remote.url");
    });
    (0, vitest_1.it)("defaults unknown paths to restart", function () {
        var plan = (0, config_reload_js_1.buildGatewayReloadPlan)(["unknownField"]);
        (0, vitest_1.expect)(plan.restartGateway).toBe(true);
    });
});
(0, vitest_1.describe)("resolveGatewayReloadSettings", function () {
    (0, vitest_1.it)("uses defaults when unset", function () {
        var settings = (0, config_reload_js_1.resolveGatewayReloadSettings)({});
        (0, vitest_1.expect)(settings.mode).toBe("hybrid");
        (0, vitest_1.expect)(settings.debounceMs).toBe(300);
    });
});
