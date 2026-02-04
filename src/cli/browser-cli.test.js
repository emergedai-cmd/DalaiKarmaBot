"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var vitest_1 = require("vitest");
(0, vitest_1.describe)("browser CLI --browser-profile flag", function () {
    (0, vitest_1.it)("parses --browser-profile from parent command options", function () {
        var program = new commander_1.Command();
        program.name("test");
        var browser = program
            .command("browser")
            .option("--browser-profile <name>", "Browser profile name");
        var capturedProfile;
        browser.command("status").action(function (_opts, cmd) {
            var _a, _b;
            var parent = (_b = (_a = cmd.parent) === null || _a === void 0 ? void 0 : _a.opts) === null || _b === void 0 ? void 0 : _b.call(_a);
            capturedProfile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
        });
        program.parse(["node", "test", "browser", "--browser-profile", "onasset", "status"]);
        (0, vitest_1.expect)(capturedProfile).toBe("onasset");
    });
    (0, vitest_1.it)("defaults to undefined when --browser-profile not provided", function () {
        var program = new commander_1.Command();
        program.name("test");
        var browser = program
            .command("browser")
            .option("--browser-profile <name>", "Browser profile name");
        var capturedProfile = "should-be-undefined";
        browser.command("status").action(function (_opts, cmd) {
            var _a, _b;
            var parent = (_b = (_a = cmd.parent) === null || _a === void 0 ? void 0 : _a.opts) === null || _b === void 0 ? void 0 : _b.call(_a);
            capturedProfile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
        });
        program.parse(["node", "test", "browser", "status"]);
        (0, vitest_1.expect)(capturedProfile).toBeUndefined();
    });
    (0, vitest_1.it)("does not conflict with global --profile flag", function () {
        // The global --profile flag is handled by /entry.js before Commander
        // This test verifies --browser-profile is a separate option
        var program = new commander_1.Command();
        program.name("test");
        program.option("--profile <name>", "Global config profile");
        var browser = program
            .command("browser")
            .option("--browser-profile <name>", "Browser profile name");
        var globalProfile;
        var browserProfile;
        browser.command("status").action(function (_opts, cmd) {
            var _a, _b;
            var parent = (_b = (_a = cmd.parent) === null || _a === void 0 ? void 0 : _a.opts) === null || _b === void 0 ? void 0 : _b.call(_a);
            browserProfile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
            globalProfile = program.opts().profile;
        });
        program.parse([
            "node",
            "test",
            "--profile",
            "dev",
            "browser",
            "--browser-profile",
            "onasset",
            "status",
        ]);
        (0, vitest_1.expect)(globalProfile).toBe("dev");
        (0, vitest_1.expect)(browserProfile).toBe("onasset");
    });
});
