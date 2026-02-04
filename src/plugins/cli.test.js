"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var vitest_1 = require("vitest");
var mocks = vitest_1.vi.hoisted(function () { return ({
    memoryRegister: vitest_1.vi.fn(),
    otherRegister: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./loader.js", function () { return ({
    loadOpenClawPlugins: function () { return ({
        cliRegistrars: [
            {
                pluginId: "memory-core",
                register: mocks.memoryRegister,
                commands: ["memory"],
                source: "bundled",
            },
            {
                pluginId: "other",
                register: mocks.otherRegister,
                commands: ["other"],
                source: "bundled",
            },
        ],
    }); },
}); });
var cli_js_1 = require("./cli.js");
(0, vitest_1.describe)("registerPluginCliCommands", function () {
    (0, vitest_1.beforeEach)(function () {
        mocks.memoryRegister.mockClear();
        mocks.otherRegister.mockClear();
    });
    (0, vitest_1.it)("skips plugin CLI registrars when commands already exist", function () {
        var program = new commander_1.Command();
        program.command("memory");
        // oxlint-disable-next-line typescript/no-explicit-any
        (0, cli_js_1.registerPluginCliCommands)(program, {});
        (0, vitest_1.expect)(mocks.memoryRegister).not.toHaveBeenCalled();
        (0, vitest_1.expect)(mocks.otherRegister).toHaveBeenCalledTimes(1);
    });
});
