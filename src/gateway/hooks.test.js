"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var runtime_js_1 = require("../plugins/runtime.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var hooks_js_1 = require("./hooks.js");
(0, vitest_1.describe)("gateway hooks helpers", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)(emptyRegistry);
    });
    (0, vitest_1.afterEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)(emptyRegistry);
    });
    (0, vitest_1.test)("resolveHooksConfig normalizes paths + requires token", function () {
        var base = {
            hooks: {
                enabled: true,
                token: "secret",
                path: "hooks///",
            },
        };
        var resolved = (0, hooks_js_1.resolveHooksConfig)(base);
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.basePath).toBe("/hooks");
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.token).toBe("secret");
    });
    (0, vitest_1.test)("resolveHooksConfig rejects root path", function () {
        var cfg = {
            hooks: { enabled: true, token: "x", path: "/" },
        };
        (0, vitest_1.expect)(function () { return (0, hooks_js_1.resolveHooksConfig)(cfg); }).toThrow("hooks.path may not be '/'");
    });
    (0, vitest_1.test)("extractHookToken prefers bearer > header > query", function () {
        var req = {
            headers: {
                authorization: "Bearer top",
                "x-openclaw-token": "header",
            },
        };
        var url = new URL("http://localhost/hooks/wake?token=query");
        var result1 = (0, hooks_js_1.extractHookToken)(req, url);
        (0, vitest_1.expect)(result1.token).toBe("top");
        (0, vitest_1.expect)(result1.fromQuery).toBe(false);
        var req2 = {
            headers: { "x-openclaw-token": "header" },
        };
        var result2 = (0, hooks_js_1.extractHookToken)(req2, url);
        (0, vitest_1.expect)(result2.token).toBe("header");
        (0, vitest_1.expect)(result2.fromQuery).toBe(false);
        var req3 = { headers: {} };
        var result3 = (0, hooks_js_1.extractHookToken)(req3, url);
        (0, vitest_1.expect)(result3.token).toBe("query");
        (0, vitest_1.expect)(result3.fromQuery).toBe(true);
    });
    (0, vitest_1.test)("normalizeWakePayload trims + validates", function () {
        (0, vitest_1.expect)((0, hooks_js_1.normalizeWakePayload)({ text: "  hi " })).toEqual({
            ok: true,
            value: { text: "hi", mode: "now" },
        });
        (0, vitest_1.expect)((0, hooks_js_1.normalizeWakePayload)({ text: "  ", mode: "now" }).ok).toBe(false);
    });
    (0, vitest_1.test)("normalizeAgentPayload defaults + validates channel", function () {
        var ok = (0, hooks_js_1.normalizeAgentPayload)({ message: "hello" }, { idFactory: function () { return "fixed"; } });
        (0, vitest_1.expect)(ok.ok).toBe(true);
        if (ok.ok) {
            (0, vitest_1.expect)(ok.value.sessionKey).toBe("hook:fixed");
            (0, vitest_1.expect)(ok.value.channel).toBe("last");
            (0, vitest_1.expect)(ok.value.name).toBe("Hook");
            (0, vitest_1.expect)(ok.value.deliver).toBe(true);
        }
        var explicitNoDeliver = (0, hooks_js_1.normalizeAgentPayload)({ message: "hello", deliver: false }, { idFactory: function () { return "fixed"; } });
        (0, vitest_1.expect)(explicitNoDeliver.ok).toBe(true);
        if (explicitNoDeliver.ok) {
            (0, vitest_1.expect)(explicitNoDeliver.value.deliver).toBe(false);
        }
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([
            {
                pluginId: "imessage",
                source: "test",
                plugin: (0, channel_plugins_js_1.createIMessageTestPlugin)(),
            },
        ]));
        var imsg = (0, hooks_js_1.normalizeAgentPayload)({ message: "yo", channel: "imsg" }, { idFactory: function () { return "x"; } });
        (0, vitest_1.expect)(imsg.ok).toBe(true);
        if (imsg.ok) {
            (0, vitest_1.expect)(imsg.value.channel).toBe("imessage");
        }
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([
            {
                pluginId: "msteams",
                source: "test",
                plugin: createMSTeamsPlugin({ aliases: ["teams"] }),
            },
        ]));
        var teams = (0, hooks_js_1.normalizeAgentPayload)({ message: "yo", channel: "teams" }, { idFactory: function () { return "x"; } });
        (0, vitest_1.expect)(teams.ok).toBe(true);
        if (teams.ok) {
            (0, vitest_1.expect)(teams.value.channel).toBe("msteams");
        }
        var bad = (0, hooks_js_1.normalizeAgentPayload)({ message: "yo", channel: "sms" });
        (0, vitest_1.expect)(bad.ok).toBe(false);
    });
});
var emptyRegistry = (0, channel_plugins_js_1.createTestRegistry)([]);
var createMSTeamsPlugin = function (params) { return ({
    id: "msteams",
    meta: {
        id: "msteams",
        label: "Microsoft Teams",
        selectionLabel: "Microsoft Teams (Bot Framework)",
        docsPath: "/channels/msteams",
        blurb: "Bot Framework; enterprise support.",
        aliases: params.aliases,
    },
    capabilities: { chatTypes: ["direct"] },
    config: {
        listAccountIds: function () { return []; },
        resolveAccount: function () { return ({}); },
    },
}); };
