"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var runtime_js_1 = require("../plugins/runtime.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var commands_registry_js_1 = require("./commands-registry.js");
(0, vitest_1.beforeEach)(function () {
    (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([]));
});
(0, vitest_1.afterEach)(function () {
    (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([]));
});
(0, vitest_1.describe)("commands registry", function () {
    (0, vitest_1.it)("builds command text with args", function () {
        (0, vitest_1.expect)((0, commands_registry_js_1.buildCommandText)("status")).toBe("/status");
        (0, vitest_1.expect)((0, commands_registry_js_1.buildCommandText)("model", "gpt-5")).toBe("/model gpt-5");
        (0, vitest_1.expect)((0, commands_registry_js_1.buildCommandText)("models")).toBe("/models");
    });
    (0, vitest_1.it)("exposes native specs", function () {
        var specs = (0, commands_registry_js_1.listNativeCommandSpecs)();
        (0, vitest_1.expect)(specs.find(function (spec) { return spec.name === "help"; })).toBeTruthy();
        (0, vitest_1.expect)(specs.find(function (spec) { return spec.name === "stop"; })).toBeTruthy();
        (0, vitest_1.expect)(specs.find(function (spec) { return spec.name === "skill"; })).toBeTruthy();
        (0, vitest_1.expect)(specs.find(function (spec) { return spec.name === "whoami"; })).toBeTruthy();
        (0, vitest_1.expect)(specs.find(function (spec) { return spec.name === "compact"; })).toBeFalsy();
    });
    (0, vitest_1.it)("filters commands based on config flags", function () {
        var disabled = (0, commands_registry_js_1.listChatCommandsForConfig)({
            commands: { config: false, debug: false },
        });
        (0, vitest_1.expect)(disabled.find(function (spec) { return spec.key === "config"; })).toBeFalsy();
        (0, vitest_1.expect)(disabled.find(function (spec) { return spec.key === "debug"; })).toBeFalsy();
        var enabled = (0, commands_registry_js_1.listChatCommandsForConfig)({
            commands: { config: true, debug: true },
        });
        (0, vitest_1.expect)(enabled.find(function (spec) { return spec.key === "config"; })).toBeTruthy();
        (0, vitest_1.expect)(enabled.find(function (spec) { return spec.key === "debug"; })).toBeTruthy();
        var nativeDisabled = (0, commands_registry_js_1.listNativeCommandSpecsForConfig)({
            commands: { config: false, debug: false, native: true },
        });
        (0, vitest_1.expect)(nativeDisabled.find(function (spec) { return spec.name === "config"; })).toBeFalsy();
        (0, vitest_1.expect)(nativeDisabled.find(function (spec) { return spec.name === "debug"; })).toBeFalsy();
    });
    (0, vitest_1.it)("appends skill commands when provided", function () {
        var skillCommands = [
            {
                name: "demo_skill",
                skillName: "demo-skill",
                description: "Demo skill",
            },
        ];
        var commands = (0, commands_registry_js_1.listChatCommandsForConfig)({
            commands: { config: false, debug: false },
        }, { skillCommands: skillCommands });
        (0, vitest_1.expect)(commands.find(function (spec) { return spec.nativeName === "demo_skill"; })).toBeTruthy();
        var native = (0, commands_registry_js_1.listNativeCommandSpecsForConfig)({ commands: { config: false, debug: false, native: true } }, { skillCommands: skillCommands });
        (0, vitest_1.expect)(native.find(function (spec) { return spec.name === "demo_skill"; })).toBeTruthy();
    });
    (0, vitest_1.it)("applies provider-specific native names", function () {
        var _a;
        var native = (0, commands_registry_js_1.listNativeCommandSpecsForConfig)({ commands: { native: true } }, { provider: "discord" });
        (0, vitest_1.expect)(native.find(function (spec) { return spec.name === "voice"; })).toBeTruthy();
        (0, vitest_1.expect)((_a = (0, commands_registry_js_1.findCommandByNativeName)("voice", "discord")) === null || _a === void 0 ? void 0 : _a.key).toBe("tts");
        (0, vitest_1.expect)((0, commands_registry_js_1.findCommandByNativeName)("tts", "discord")).toBeUndefined();
    });
    (0, vitest_1.it)("detects known text commands", function () {
        var detection = (0, commands_registry_js_1.getCommandDetection)();
        (0, vitest_1.expect)(detection.exact.has("/commands")).toBe(true);
        (0, vitest_1.expect)(detection.exact.has("/skill")).toBe(true);
        (0, vitest_1.expect)(detection.exact.has("/compact")).toBe(true);
        (0, vitest_1.expect)(detection.exact.has("/whoami")).toBe(true);
        (0, vitest_1.expect)(detection.exact.has("/id")).toBe(true);
        for (var _i = 0, _a = (0, commands_registry_js_1.listChatCommands)(); _i < _a.length; _i++) {
            var command = _a[_i];
            for (var _b = 0, _c = command.textAliases; _b < _c.length; _b++) {
                var alias = _c[_b];
                (0, vitest_1.expect)(detection.exact.has(alias.toLowerCase())).toBe(true);
                (0, vitest_1.expect)(detection.regex.test(alias)).toBe(true);
                (0, vitest_1.expect)(detection.regex.test("".concat(alias, ":"))).toBe(true);
                if (command.acceptsArgs) {
                    (0, vitest_1.expect)(detection.regex.test("".concat(alias, " list"))).toBe(true);
                    (0, vitest_1.expect)(detection.regex.test("".concat(alias, ": list"))).toBe(true);
                }
                else {
                    (0, vitest_1.expect)(detection.regex.test("".concat(alias, " list"))).toBe(false);
                    (0, vitest_1.expect)(detection.regex.test("".concat(alias, ": list"))).toBe(false);
                }
            }
        }
        (0, vitest_1.expect)(detection.regex.test("try /status")).toBe(false);
    });
    (0, vitest_1.it)("respects text command gating", function () {
        var cfg = { commands: { text: false } };
        (0, vitest_1.expect)((0, commands_registry_js_1.shouldHandleTextCommands)({
            cfg: cfg,
            surface: "discord",
            commandSource: "text",
        })).toBe(false);
        (0, vitest_1.expect)((0, commands_registry_js_1.shouldHandleTextCommands)({
            cfg: cfg,
            surface: "whatsapp",
            commandSource: "text",
        })).toBe(true);
        (0, vitest_1.expect)((0, commands_registry_js_1.shouldHandleTextCommands)({
            cfg: cfg,
            surface: "discord",
            commandSource: "native",
        })).toBe(true);
    });
    (0, vitest_1.it)("normalizes telegram-style command mentions for the current bot", function () {
        (0, vitest_1.expect)((0, commands_registry_js_1.normalizeCommandBody)("/help@openclaw", { botUsername: "openclaw" })).toBe("/help");
        (0, vitest_1.expect)((0, commands_registry_js_1.normalizeCommandBody)("/help@openclaw args", {
            botUsername: "openclaw",
        })).toBe("/help args");
        (0, vitest_1.expect)((0, commands_registry_js_1.normalizeCommandBody)("/help@openclaw: args", {
            botUsername: "openclaw",
        })).toBe("/help args");
    });
    (0, vitest_1.it)("keeps telegram-style command mentions for other bots", function () {
        (0, vitest_1.expect)((0, commands_registry_js_1.normalizeCommandBody)("/help@otherbot", { botUsername: "openclaw" })).toBe("/help@otherbot");
    });
    (0, vitest_1.it)("normalizes dock command aliases", function () {
        (0, vitest_1.expect)((0, commands_registry_js_1.normalizeCommandBody)("/dock_telegram")).toBe("/dock-telegram");
    });
});
(0, vitest_1.describe)("commands registry args", function () {
    (0, vitest_1.it)("parses positional args and captureRemaining", function () {
        var command = {
            key: "debug",
            description: "debug",
            textAliases: [],
            scope: "both",
            argsParsing: "positional",
            args: [
                { name: "action", description: "action", type: "string" },
                { name: "path", description: "path", type: "string" },
                { name: "value", description: "value", type: "string", captureRemaining: true },
            ],
        };
        var args = (0, commands_registry_js_1.parseCommandArgs)(command, "set foo bar baz");
        (0, vitest_1.expect)(args === null || args === void 0 ? void 0 : args.values).toEqual({ action: "set", path: "foo", value: "bar baz" });
    });
    (0, vitest_1.it)("serializes args via raw first, then values", function () {
        var command = {
            key: "model",
            description: "model",
            textAliases: [],
            scope: "both",
            argsParsing: "positional",
            args: [{ name: "model", description: "model", type: "string", captureRemaining: true }],
        };
        (0, vitest_1.expect)((0, commands_registry_js_1.serializeCommandArgs)(command, { raw: "gpt-5.2-codex" })).toBe("gpt-5.2-codex");
        (0, vitest_1.expect)((0, commands_registry_js_1.serializeCommandArgs)(command, { values: { model: "gpt-5.2-codex" } })).toBe("gpt-5.2-codex");
        (0, vitest_1.expect)((0, commands_registry_js_1.buildCommandTextFromArgs)(command, { values: { model: "gpt-5.2-codex" } })).toBe("/model gpt-5.2-codex");
    });
    (0, vitest_1.it)("resolves auto arg menus when missing a choice arg", function () {
        var command = {
            key: "usage",
            description: "usage",
            textAliases: [],
            scope: "both",
            argsMenu: "auto",
            argsParsing: "positional",
            args: [
                {
                    name: "mode",
                    description: "mode",
                    type: "string",
                    choices: ["off", "tokens", "full", "cost"],
                },
            ],
        };
        var menu = (0, commands_registry_js_1.resolveCommandArgMenu)({ command: command, args: undefined, cfg: {} });
        (0, vitest_1.expect)(menu === null || menu === void 0 ? void 0 : menu.arg.name).toBe("mode");
        (0, vitest_1.expect)(menu === null || menu === void 0 ? void 0 : menu.choices).toEqual([
            { label: "off", value: "off" },
            { label: "tokens", value: "tokens" },
            { label: "full", value: "full" },
            { label: "cost", value: "cost" },
        ]);
    });
    (0, vitest_1.it)("does not show menus when arg already provided", function () {
        var command = {
            key: "usage",
            description: "usage",
            textAliases: [],
            scope: "both",
            argsMenu: "auto",
            argsParsing: "positional",
            args: [
                {
                    name: "mode",
                    description: "mode",
                    type: "string",
                    choices: ["off", "tokens", "full", "cost"],
                },
            ],
        };
        var menu = (0, commands_registry_js_1.resolveCommandArgMenu)({
            command: command,
            args: { values: { mode: "tokens" } },
            cfg: {},
        });
        (0, vitest_1.expect)(menu).toBeNull();
    });
    (0, vitest_1.it)("resolves function-based choices with a default provider/model context", function () {
        var seen = null;
        var command = {
            key: "think",
            description: "think",
            textAliases: [],
            scope: "both",
            argsMenu: "auto",
            argsParsing: "positional",
            args: [
                {
                    name: "level",
                    description: "level",
                    type: "string",
                    choices: function (_a) {
                        var provider = _a.provider, model = _a.model, command = _a.command, arg = _a.arg;
                        seen = { provider: provider, model: model, commandKey: command.key, argName: arg.name };
                        return ["low", "high"];
                    },
                },
            ],
        };
        var menu = (0, commands_registry_js_1.resolveCommandArgMenu)({ command: command, args: undefined, cfg: {} });
        (0, vitest_1.expect)(menu === null || menu === void 0 ? void 0 : menu.arg.name).toBe("level");
        (0, vitest_1.expect)(menu === null || menu === void 0 ? void 0 : menu.choices).toEqual([
            { label: "low", value: "low" },
            { label: "high", value: "high" },
        ]);
        (0, vitest_1.expect)(seen === null || seen === void 0 ? void 0 : seen.commandKey).toBe("think");
        (0, vitest_1.expect)(seen === null || seen === void 0 ? void 0 : seen.argName).toBe("level");
        (0, vitest_1.expect)(seen === null || seen === void 0 ? void 0 : seen.provider).toBeTruthy();
        (0, vitest_1.expect)(seen === null || seen === void 0 ? void 0 : seen.model).toBeTruthy();
    });
    (0, vitest_1.it)("does not show menus when args were provided as raw text only", function () {
        var command = {
            key: "usage",
            description: "usage",
            textAliases: [],
            scope: "both",
            argsMenu: "auto",
            argsParsing: "none",
            args: [
                {
                    name: "mode",
                    description: "on or off",
                    type: "string",
                    choices: ["off", "tokens", "full", "cost"],
                },
            ],
        };
        var menu = (0, commands_registry_js_1.resolveCommandArgMenu)({
            command: command,
            args: { raw: "on" },
            cfg: {},
        });
        (0, vitest_1.expect)(menu).toBeNull();
    });
});
