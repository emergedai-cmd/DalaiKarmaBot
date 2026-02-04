"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var argv_js_1 = require("./argv.js");
(0, vitest_1.describe)("argv helpers", function () {
    (0, vitest_1.it)("detects help/version flags", function () {
        (0, vitest_1.expect)((0, argv_js_1.hasHelpOrVersion)(["node", "openclaw", "--help"])).toBe(true);
        (0, vitest_1.expect)((0, argv_js_1.hasHelpOrVersion)(["node", "openclaw", "-V"])).toBe(true);
        (0, vitest_1.expect)((0, argv_js_1.hasHelpOrVersion)(["node", "openclaw", "status"])).toBe(false);
    });
    (0, vitest_1.it)("extracts command path ignoring flags and terminator", function () {
        (0, vitest_1.expect)((0, argv_js_1.getCommandPath)(["node", "openclaw", "status", "--json"], 2)).toEqual(["status"]);
        (0, vitest_1.expect)((0, argv_js_1.getCommandPath)(["node", "openclaw", "agents", "list"], 2)).toEqual(["agents", "list"]);
        (0, vitest_1.expect)((0, argv_js_1.getCommandPath)(["node", "openclaw", "status", "--", "ignored"], 2)).toEqual(["status"]);
    });
    (0, vitest_1.it)("returns primary command", function () {
        (0, vitest_1.expect)((0, argv_js_1.getPrimaryCommand)(["node", "openclaw", "agents", "list"])).toBe("agents");
        (0, vitest_1.expect)((0, argv_js_1.getPrimaryCommand)(["node", "openclaw"])).toBeNull();
    });
    (0, vitest_1.it)("parses boolean flags and ignores terminator", function () {
        (0, vitest_1.expect)((0, argv_js_1.hasFlag)(["node", "openclaw", "status", "--json"], "--json")).toBe(true);
        (0, vitest_1.expect)((0, argv_js_1.hasFlag)(["node", "openclaw", "--", "--json"], "--json")).toBe(false);
    });
    (0, vitest_1.it)("extracts flag values with equals and missing values", function () {
        (0, vitest_1.expect)((0, argv_js_1.getFlagValue)(["node", "openclaw", "status", "--timeout", "5000"], "--timeout")).toBe("5000");
        (0, vitest_1.expect)((0, argv_js_1.getFlagValue)(["node", "openclaw", "status", "--timeout=2500"], "--timeout")).toBe("2500");
        (0, vitest_1.expect)((0, argv_js_1.getFlagValue)(["node", "openclaw", "status", "--timeout"], "--timeout")).toBeNull();
        (0, vitest_1.expect)((0, argv_js_1.getFlagValue)(["node", "openclaw", "status", "--timeout", "--json"], "--timeout")).toBe(null);
        (0, vitest_1.expect)((0, argv_js_1.getFlagValue)(["node", "openclaw", "--", "--timeout=99"], "--timeout")).toBeUndefined();
    });
    (0, vitest_1.it)("parses verbose flags", function () {
        (0, vitest_1.expect)((0, argv_js_1.getVerboseFlag)(["node", "openclaw", "status", "--verbose"])).toBe(true);
        (0, vitest_1.expect)((0, argv_js_1.getVerboseFlag)(["node", "openclaw", "status", "--debug"])).toBe(false);
        (0, vitest_1.expect)((0, argv_js_1.getVerboseFlag)(["node", "openclaw", "status", "--debug"], { includeDebug: true })).toBe(true);
    });
    (0, vitest_1.it)("parses positive integer flag values", function () {
        (0, vitest_1.expect)((0, argv_js_1.getPositiveIntFlagValue)(["node", "openclaw", "status"], "--timeout")).toBeUndefined();
        (0, vitest_1.expect)((0, argv_js_1.getPositiveIntFlagValue)(["node", "openclaw", "status", "--timeout"], "--timeout")).toBeNull();
        (0, vitest_1.expect)((0, argv_js_1.getPositiveIntFlagValue)(["node", "openclaw", "status", "--timeout", "5000"], "--timeout")).toBe(5000);
        (0, vitest_1.expect)((0, argv_js_1.getPositiveIntFlagValue)(["node", "openclaw", "status", "--timeout", "nope"], "--timeout")).toBeUndefined();
    });
    (0, vitest_1.it)("builds parse argv from raw args", function () {
        var nodeArgv = (0, argv_js_1.buildParseArgv)({
            programName: "openclaw",
            rawArgs: ["node", "openclaw", "status"],
        });
        (0, vitest_1.expect)(nodeArgv).toEqual(["node", "openclaw", "status"]);
        var versionedNodeArgv = (0, argv_js_1.buildParseArgv)({
            programName: "openclaw",
            rawArgs: ["node-22", "openclaw", "status"],
        });
        (0, vitest_1.expect)(versionedNodeArgv).toEqual(["node-22", "openclaw", "status"]);
        var versionedNodeWindowsArgv = (0, argv_js_1.buildParseArgv)({
            programName: "openclaw",
            rawArgs: ["node-22.2.0.exe", "openclaw", "status"],
        });
        (0, vitest_1.expect)(versionedNodeWindowsArgv).toEqual(["node-22.2.0.exe", "openclaw", "status"]);
        var versionedNodePatchlessArgv = (0, argv_js_1.buildParseArgv)({
            programName: "openclaw",
            rawArgs: ["node-22.2", "openclaw", "status"],
        });
        (0, vitest_1.expect)(versionedNodePatchlessArgv).toEqual(["node-22.2", "openclaw", "status"]);
        var versionedNodeWindowsPatchlessArgv = (0, argv_js_1.buildParseArgv)({
            programName: "openclaw",
            rawArgs: ["node-22.2.exe", "openclaw", "status"],
        });
        (0, vitest_1.expect)(versionedNodeWindowsPatchlessArgv).toEqual(["node-22.2.exe", "openclaw", "status"]);
        var versionedNodeWithPathArgv = (0, argv_js_1.buildParseArgv)({
            programName: "openclaw",
            rawArgs: ["/usr/bin/node-22.2.0", "openclaw", "status"],
        });
        (0, vitest_1.expect)(versionedNodeWithPathArgv).toEqual(["/usr/bin/node-22.2.0", "openclaw", "status"]);
        var nodejsArgv = (0, argv_js_1.buildParseArgv)({
            programName: "openclaw",
            rawArgs: ["nodejs", "openclaw", "status"],
        });
        (0, vitest_1.expect)(nodejsArgv).toEqual(["nodejs", "openclaw", "status"]);
        var nonVersionedNodeArgv = (0, argv_js_1.buildParseArgv)({
            programName: "openclaw",
            rawArgs: ["node-dev", "openclaw", "status"],
        });
        (0, vitest_1.expect)(nonVersionedNodeArgv).toEqual(["node", "openclaw", "node-dev", "openclaw", "status"]);
        var directArgv = (0, argv_js_1.buildParseArgv)({
            programName: "openclaw",
            rawArgs: ["openclaw", "status"],
        });
        (0, vitest_1.expect)(directArgv).toEqual(["node", "openclaw", "status"]);
        var bunArgv = (0, argv_js_1.buildParseArgv)({
            programName: "openclaw",
            rawArgs: ["bun", "src/entry.ts", "status"],
        });
        (0, vitest_1.expect)(bunArgv).toEqual(["bun", "src/entry.ts", "status"]);
    });
    (0, vitest_1.it)("builds parse argv from fallback args", function () {
        var fallbackArgv = (0, argv_js_1.buildParseArgv)({
            programName: "openclaw",
            fallbackArgv: ["status"],
        });
        (0, vitest_1.expect)(fallbackArgv).toEqual(["node", "openclaw", "status"]);
    });
    (0, vitest_1.it)("decides when to migrate state", function () {
        (0, vitest_1.expect)((0, argv_js_1.shouldMigrateState)(["node", "openclaw", "status"])).toBe(false);
        (0, vitest_1.expect)((0, argv_js_1.shouldMigrateState)(["node", "openclaw", "health"])).toBe(false);
        (0, vitest_1.expect)((0, argv_js_1.shouldMigrateState)(["node", "openclaw", "sessions"])).toBe(false);
        (0, vitest_1.expect)((0, argv_js_1.shouldMigrateState)(["node", "openclaw", "memory", "status"])).toBe(false);
        (0, vitest_1.expect)((0, argv_js_1.shouldMigrateState)(["node", "openclaw", "agent", "--message", "hi"])).toBe(false);
        (0, vitest_1.expect)((0, argv_js_1.shouldMigrateState)(["node", "openclaw", "agents", "list"])).toBe(true);
        (0, vitest_1.expect)((0, argv_js_1.shouldMigrateState)(["node", "openclaw", "message", "send"])).toBe(true);
    });
    (0, vitest_1.it)("reuses command path for migrate state decisions", function () {
        (0, vitest_1.expect)((0, argv_js_1.shouldMigrateStateFromPath)(["status"])).toBe(false);
        (0, vitest_1.expect)((0, argv_js_1.shouldMigrateStateFromPath)(["agents", "list"])).toBe(true);
    });
});
