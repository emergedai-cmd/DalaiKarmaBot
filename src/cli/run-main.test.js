"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var run_main_js_1 = require("./run-main.js");
(0, vitest_1.describe)("rewriteUpdateFlagArgv", function () {
    (0, vitest_1.it)("leaves argv unchanged when --update is absent", function () {
        var argv = ["node", "entry.js", "status"];
        (0, vitest_1.expect)((0, run_main_js_1.rewriteUpdateFlagArgv)(argv)).toBe(argv);
    });
    (0, vitest_1.it)("rewrites --update into the update command", function () {
        (0, vitest_1.expect)((0, run_main_js_1.rewriteUpdateFlagArgv)(["node", "entry.js", "--update"])).toEqual([
            "node",
            "entry.js",
            "update",
        ]);
    });
    (0, vitest_1.it)("preserves global flags that appear before --update", function () {
        (0, vitest_1.expect)((0, run_main_js_1.rewriteUpdateFlagArgv)(["node", "entry.js", "--profile", "p", "--update"])).toEqual([
            "node",
            "entry.js",
            "--profile",
            "p",
            "update",
        ]);
    });
    (0, vitest_1.it)("keeps update options after the rewritten command", function () {
        (0, vitest_1.expect)((0, run_main_js_1.rewriteUpdateFlagArgv)(["node", "entry.js", "--update", "--json"])).toEqual([
            "node",
            "entry.js",
            "update",
            "--json",
        ]);
    });
});
