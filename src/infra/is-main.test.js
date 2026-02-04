"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var is_main_js_1 = require("./is-main.js");
(0, vitest_1.describe)("isMainModule", function () {
    (0, vitest_1.it)("returns true when argv[1] matches current file", function () {
        (0, vitest_1.expect)((0, is_main_js_1.isMainModule)({
            currentFile: "/repo/dist/index.js",
            argv: ["node", "/repo/dist/index.js"],
            cwd: "/repo",
            env: {},
        })).toBe(true);
    });
    (0, vitest_1.it)("returns true under PM2 when pm_exec_path matches current file", function () {
        (0, vitest_1.expect)((0, is_main_js_1.isMainModule)({
            currentFile: "/repo/dist/index.js",
            argv: ["node", "/pm2/lib/ProcessContainerFork.js"],
            cwd: "/repo",
            env: { pm_exec_path: "/repo/dist/index.js", pm_id: "0" },
        })).toBe(true);
    });
    (0, vitest_1.it)("returns false when running under PM2 but this module is imported", function () {
        (0, vitest_1.expect)((0, is_main_js_1.isMainModule)({
            currentFile: "/repo/node_modules/openclaw/dist/index.js",
            argv: ["node", "/repo/app.js"],
            cwd: "/repo",
            env: { pm_exec_path: "/repo/app.js", pm_id: "0" },
        })).toBe(false);
    });
});
