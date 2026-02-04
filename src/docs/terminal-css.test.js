"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
function readTerminalCss() {
    // This test is intentionally simple: it guards against regressions where the
    // docs header stops being sticky because sticky elements live inside an
    // overflow-clipped container.
    var path = (0, node_path_1.join)(process.cwd(), "docs", "assets", "terminal.css");
    return (0, node_fs_1.readFileSync)(path, "utf8");
}
(0, vitest_1.describe)("docs terminal.css", function () {
    (0, vitest_1.test)("keeps the docs header sticky (shell is sticky)", function () {
        var css = readTerminalCss();
        (0, vitest_1.expect)(css).toMatch(/\.shell\s*\{[^}]*position:\s*sticky;[^}]*top:\s*0;[^}]*\}/s);
    });
    (0, vitest_1.test)("does not rely on making body overflow visible", function () {
        var css = readTerminalCss();
        (0, vitest_1.expect)(css).not.toMatch(/body\s*\{[^}]*overflow-x:\s*visible;[^}]*\}/s);
    });
    (0, vitest_1.test)("does not make the terminal frame overflow visible (can break layout)", function () {
        var css = readTerminalCss();
        (0, vitest_1.expect)(css).not.toMatch(/\.shell__frame\s*\{[^}]*overflow:\s*visible;[^}]*\}/s);
    });
});
