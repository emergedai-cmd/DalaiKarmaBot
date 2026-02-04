"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCommand = parseCommand;
exports.getSlashCommands = getSlashCommands;
exports.helpText = helpText;
var commands_registry_js_1 = require("../auto-reply/commands-registry.js");
var thinking_js_1 = require("../auto-reply/thinking.js");
var VERBOSE_LEVELS = ["on", "off"];
var REASONING_LEVELS = ["on", "off"];
var ELEVATED_LEVELS = ["on", "off", "ask", "full"];
var ACTIVATION_LEVELS = ["mention", "always"];
var USAGE_FOOTER_LEVELS = ["off", "tokens", "full"];
var COMMAND_ALIASES = {
    elev: "elevated",
};
function parseCommand(input) {
    var _a;
    var trimmed = input.replace(/^\//, "").trim();
    if (!trimmed) {
        return { name: "", args: "" };
    }
    var _b = trimmed.split(/\s+/), name = _b[0], rest = _b.slice(1);
    var normalized = name.toLowerCase();
    return {
        name: (_a = COMMAND_ALIASES[normalized]) !== null && _a !== void 0 ? _a : normalized,
        args: rest.join(" ").trim(),
    };
}
function getSlashCommands(options) {
    if (options === void 0) { options = {}; }
    var thinkLevels = (0, thinking_js_1.listThinkingLevelLabels)(options.provider, options.model);
    var commands = [
        { name: "help", description: "Show slash command help" },
        { name: "status", description: "Show gateway status summary" },
        { name: "agent", description: "Switch agent (or open picker)" },
        { name: "agents", description: "Open agent picker" },
        { name: "session", description: "Switch session (or open picker)" },
        { name: "sessions", description: "Open session picker" },
        {
            name: "model",
            description: "Set model (or open picker)",
        },
        { name: "models", description: "Open model picker" },
        {
            name: "think",
            description: "Set thinking level",
            getArgumentCompletions: function (prefix) {
                return thinkLevels
                    .filter(function (v) { return v.startsWith(prefix.toLowerCase()); })
                    .map(function (value) { return ({ value: value, label: value }); });
            },
        },
        {
            name: "verbose",
            description: "Set verbose on/off",
            getArgumentCompletions: function (prefix) {
                return VERBOSE_LEVELS.filter(function (v) { return v.startsWith(prefix.toLowerCase()); }).map(function (value) { return ({
                    value: value,
                    label: value,
                }); });
            },
        },
        {
            name: "reasoning",
            description: "Set reasoning on/off",
            getArgumentCompletions: function (prefix) {
                return REASONING_LEVELS.filter(function (v) { return v.startsWith(prefix.toLowerCase()); }).map(function (value) { return ({
                    value: value,
                    label: value,
                }); });
            },
        },
        {
            name: "usage",
            description: "Toggle per-response usage line",
            getArgumentCompletions: function (prefix) {
                return USAGE_FOOTER_LEVELS.filter(function (v) { return v.startsWith(prefix.toLowerCase()); }).map(function (value) { return ({
                    value: value,
                    label: value,
                }); });
            },
        },
        {
            name: "elevated",
            description: "Set elevated on/off/ask/full",
            getArgumentCompletions: function (prefix) {
                return ELEVATED_LEVELS.filter(function (v) { return v.startsWith(prefix.toLowerCase()); }).map(function (value) { return ({
                    value: value,
                    label: value,
                }); });
            },
        },
        {
            name: "elev",
            description: "Alias for /elevated",
            getArgumentCompletions: function (prefix) {
                return ELEVATED_LEVELS.filter(function (v) { return v.startsWith(prefix.toLowerCase()); }).map(function (value) { return ({
                    value: value,
                    label: value,
                }); });
            },
        },
        {
            name: "activation",
            description: "Set group activation",
            getArgumentCompletions: function (prefix) {
                return ACTIVATION_LEVELS.filter(function (v) { return v.startsWith(prefix.toLowerCase()); }).map(function (value) { return ({
                    value: value,
                    label: value,
                }); });
            },
        },
        { name: "abort", description: "Abort active run" },
        { name: "new", description: "Reset the session" },
        { name: "reset", description: "Reset the session" },
        { name: "settings", description: "Open settings" },
        { name: "exit", description: "Exit the TUI" },
        { name: "quit", description: "Exit the TUI" },
    ];
    var seen = new Set(commands.map(function (command) { return command.name; }));
    var gatewayCommands = options.cfg ? (0, commands_registry_js_1.listChatCommandsForConfig)(options.cfg) : (0, commands_registry_js_1.listChatCommands)();
    for (var _i = 0, gatewayCommands_1 = gatewayCommands; _i < gatewayCommands_1.length; _i++) {
        var command = gatewayCommands_1[_i];
        var aliases = command.textAliases.length > 0 ? command.textAliases : ["/".concat(command.key)];
        for (var _a = 0, aliases_1 = aliases; _a < aliases_1.length; _a++) {
            var alias = aliases_1[_a];
            var name_1 = alias.replace(/^\//, "").trim();
            if (!name_1 || seen.has(name_1)) {
                continue;
            }
            seen.add(name_1);
            commands.push({ name: name_1, description: command.description });
        }
    }
    return commands;
}
function helpText(options) {
    if (options === void 0) { options = {}; }
    var thinkLevels = (0, thinking_js_1.formatThinkingLevels)(options.provider, options.model, "|");
    return [
        "Slash commands:",
        "/help",
        "/commands",
        "/status",
        "/agent <id> (or /agents)",
        "/session <key> (or /sessions)",
        "/model <provider/model> (or /models)",
        "/think <".concat(thinkLevels, ">"),
        "/verbose <on|off>",
        "/reasoning <on|off>",
        "/usage <off|tokens|full>",
        "/elevated <on|off|ask|full>",
        "/elev <on|off|ask|full>",
        "/activation <mention|always>",
        "/new or /reset",
        "/abort",
        "/settings",
        "/exit",
    ].join("\n");
}
