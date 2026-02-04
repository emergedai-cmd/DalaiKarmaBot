"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var runtime_js_1 = require("../plugins/runtime.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var command_auth_js_1 = require("./command-auth.js");
var command_detection_js_1 = require("./command-detection.js");
var commands_registry_js_1 = require("./commands-registry.js");
var group_activation_js_1 = require("./group-activation.js");
var send_policy_js_1 = require("./send-policy.js");
(0, vitest_1.beforeEach)(function () {
    (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([]));
});
(0, vitest_1.afterEach)(function () {
    (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([]));
});
(0, vitest_1.describe)("resolveCommandAuthorization", function () {
    (0, vitest_1.it)("falls back from empty SenderId to SenderE164", function () {
        var cfg = {
            channels: { whatsapp: { allowFrom: ["+123"] } },
        };
        var ctx = {
            Provider: "whatsapp",
            Surface: "whatsapp",
            From: "whatsapp:+999",
            SenderId: "",
            SenderE164: "+123",
        };
        var auth = (0, command_auth_js_1.resolveCommandAuthorization)({
            ctx: ctx,
            cfg: cfg,
            commandAuthorized: true,
        });
        (0, vitest_1.expect)(auth.senderId).toBe("+123");
        (0, vitest_1.expect)(auth.isAuthorizedSender).toBe(true);
    });
    (0, vitest_1.it)("falls back from whitespace SenderId to SenderE164", function () {
        var cfg = {
            channels: { whatsapp: { allowFrom: ["+123"] } },
        };
        var ctx = {
            Provider: "whatsapp",
            Surface: "whatsapp",
            From: "whatsapp:+999",
            SenderId: "   ",
            SenderE164: "+123",
        };
        var auth = (0, command_auth_js_1.resolveCommandAuthorization)({
            ctx: ctx,
            cfg: cfg,
            commandAuthorized: true,
        });
        (0, vitest_1.expect)(auth.senderId).toBe("+123");
        (0, vitest_1.expect)(auth.isAuthorizedSender).toBe(true);
    });
    (0, vitest_1.it)("falls back to From when SenderId and SenderE164 are whitespace", function () {
        var cfg = {
            channels: { whatsapp: { allowFrom: ["+999"] } },
        };
        var ctx = {
            Provider: "whatsapp",
            Surface: "whatsapp",
            From: "whatsapp:+999",
            SenderId: "   ",
            SenderE164: "   ",
        };
        var auth = (0, command_auth_js_1.resolveCommandAuthorization)({
            ctx: ctx,
            cfg: cfg,
            commandAuthorized: true,
        });
        (0, vitest_1.expect)(auth.senderId).toBe("+999");
        (0, vitest_1.expect)(auth.isAuthorizedSender).toBe(true);
    });
    (0, vitest_1.it)("falls back from un-normalizable SenderId to SenderE164", function () {
        var cfg = {
            channels: { whatsapp: { allowFrom: ["+123"] } },
        };
        var ctx = {
            Provider: "whatsapp",
            Surface: "whatsapp",
            From: "whatsapp:+999",
            SenderId: "wat",
            SenderE164: "+123",
        };
        var auth = (0, command_auth_js_1.resolveCommandAuthorization)({
            ctx: ctx,
            cfg: cfg,
            commandAuthorized: true,
        });
        (0, vitest_1.expect)(auth.senderId).toBe("+123");
        (0, vitest_1.expect)(auth.isAuthorizedSender).toBe(true);
    });
    (0, vitest_1.it)("prefers SenderE164 when SenderId does not match allowFrom", function () {
        var cfg = {
            channels: { whatsapp: { allowFrom: ["+41796666864"] } },
        };
        var ctx = {
            Provider: "whatsapp",
            Surface: "whatsapp",
            From: "whatsapp:120363401234567890@g.us",
            SenderId: "123@lid",
            SenderE164: "+41796666864",
        };
        var auth = (0, command_auth_js_1.resolveCommandAuthorization)({
            ctx: ctx,
            cfg: cfg,
            commandAuthorized: true,
        });
        (0, vitest_1.expect)(auth.senderId).toBe("+41796666864");
        (0, vitest_1.expect)(auth.isAuthorizedSender).toBe(true);
    });
});
(0, vitest_1.describe)("control command parsing", function () {
    (0, vitest_1.it)("requires slash for send policy", function () {
        (0, vitest_1.expect)((0, send_policy_js_1.parseSendPolicyCommand)("/send on")).toEqual({
            hasCommand: true,
            mode: "allow",
        });
        (0, vitest_1.expect)((0, send_policy_js_1.parseSendPolicyCommand)("/send: on")).toEqual({
            hasCommand: true,
            mode: "allow",
        });
        (0, vitest_1.expect)((0, send_policy_js_1.parseSendPolicyCommand)("/send")).toEqual({ hasCommand: true });
        (0, vitest_1.expect)((0, send_policy_js_1.parseSendPolicyCommand)("/send:")).toEqual({ hasCommand: true });
        (0, vitest_1.expect)((0, send_policy_js_1.parseSendPolicyCommand)("send on")).toEqual({ hasCommand: false });
        (0, vitest_1.expect)((0, send_policy_js_1.parseSendPolicyCommand)("send")).toEqual({ hasCommand: false });
    });
    (0, vitest_1.it)("requires slash for activation", function () {
        (0, vitest_1.expect)((0, group_activation_js_1.parseActivationCommand)("/activation mention")).toEqual({
            hasCommand: true,
            mode: "mention",
        });
        (0, vitest_1.expect)((0, group_activation_js_1.parseActivationCommand)("/activation: mention")).toEqual({
            hasCommand: true,
            mode: "mention",
        });
        (0, vitest_1.expect)((0, group_activation_js_1.parseActivationCommand)("/activation:")).toEqual({
            hasCommand: true,
        });
        (0, vitest_1.expect)((0, group_activation_js_1.parseActivationCommand)("activation mention")).toEqual({
            hasCommand: false,
        });
    });
    (0, vitest_1.it)("treats bare commands as non-control", function () {
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("send")).toBe(false);
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("help")).toBe(false);
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("/commands")).toBe(true);
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("/commands:")).toBe(true);
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("commands")).toBe(false);
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("/status")).toBe(true);
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("/status:")).toBe(true);
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("status")).toBe(false);
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("usage")).toBe(false);
        for (var _i = 0, _a = (0, commands_registry_js_1.listChatCommands)(); _i < _a.length; _i++) {
            var command = _a[_i];
            for (var _b = 0, _c = command.textAliases; _b < _c.length; _b++) {
                var alias = _c[_b];
                (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)(alias)).toBe(true);
                (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("".concat(alias, ":"))).toBe(true);
            }
        }
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("/compact")).toBe(true);
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("/compact:")).toBe(true);
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("compact")).toBe(false);
    });
    (0, vitest_1.it)("respects disabled config/debug commands", function () {
        var cfg = { commands: { config: false, debug: false } };
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("/config show", cfg)).toBe(false);
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("/debug show", cfg)).toBe(false);
    });
    (0, vitest_1.it)("requires commands to be the full message", function () {
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("hello /status")).toBe(false);
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("/status please")).toBe(false);
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("prefix /send on")).toBe(false);
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("/send on")).toBe(true);
    });
    (0, vitest_1.it)("detects inline command tokens", function () {
        (0, vitest_1.expect)((0, command_detection_js_1.hasInlineCommandTokens)("hello /status")).toBe(true);
        (0, vitest_1.expect)((0, command_detection_js_1.hasInlineCommandTokens)("hey /think high")).toBe(true);
        (0, vitest_1.expect)((0, command_detection_js_1.hasInlineCommandTokens)("plain text")).toBe(false);
        (0, vitest_1.expect)((0, command_detection_js_1.hasInlineCommandTokens)("http://example.com/path")).toBe(false);
        (0, vitest_1.expect)((0, command_detection_js_1.hasInlineCommandTokens)("stop")).toBe(false);
    });
    (0, vitest_1.it)("ignores telegram commands addressed to other bots", function () {
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("/help@otherbot", undefined, {
            botUsername: "openclaw",
        })).toBe(false);
        (0, vitest_1.expect)((0, command_detection_js_1.hasControlCommand)("/help@openclaw", undefined, {
            botUsername: "openclaw",
        })).toBe(true);
    });
});
