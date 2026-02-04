"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var commands_js_1 = require("./commands.js");
(0, vitest_1.describe)("tui slash commands", function () {
    (0, vitest_1.it)("treats /elev as an alias for /elevated", function () {
        (0, vitest_1.expect)((0, commands_js_1.parseCommand)("/elev on")).toEqual({ name: "elevated", args: "on" });
    });
    (0, vitest_1.it)("normalizes alias case", function () {
        (0, vitest_1.expect)((0, commands_js_1.parseCommand)("/ELEV off")).toEqual({
            name: "elevated",
            args: "off",
        });
    });
    (0, vitest_1.it)("includes gateway text commands", function () {
        var commands = (0, commands_js_1.getSlashCommands)({});
        (0, vitest_1.expect)(commands.some(function (command) { return command.name === "context"; })).toBe(true);
        (0, vitest_1.expect)(commands.some(function (command) { return command.name === "commands"; })).toBe(true);
    });
});
