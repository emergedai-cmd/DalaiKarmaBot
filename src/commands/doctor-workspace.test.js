"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var doctor_workspace_js_1 = require("./doctor-workspace.js");
(0, vitest_1.describe)("detectLegacyWorkspaceDirs", function () {
    (0, vitest_1.it)("returns active workspace and no legacy dirs", function () {
        var workspaceDir = "/home/user/openclaw";
        var detection = (0, doctor_workspace_js_1.detectLegacyWorkspaceDirs)({ workspaceDir: workspaceDir });
        (0, vitest_1.expect)(detection.activeWorkspace).toBe(node_path_1.default.resolve(workspaceDir));
        (0, vitest_1.expect)(detection.legacyDirs).toEqual([]);
    });
});
