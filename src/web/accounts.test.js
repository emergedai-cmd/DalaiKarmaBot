"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var accounts_js_1 = require("./accounts.js");
(0, vitest_1.describe)("resolveWhatsAppAuthDir", function () {
    var stubCfg = { channels: { whatsapp: { accounts: {} } } };
    (0, vitest_1.it)("sanitizes path traversal sequences in accountId", function () {
        var authDir = (0, accounts_js_1.resolveWhatsAppAuthDir)({
            cfg: stubCfg,
            accountId: "../../../etc/passwd",
        }).authDir;
        // Sanitized accountId must not escape the whatsapp auth directory.
        (0, vitest_1.expect)(authDir).not.toContain("..");
        (0, vitest_1.expect)(node_path_1.default.basename(authDir)).not.toContain("/");
    });
    (0, vitest_1.it)("sanitizes special characters in accountId", function () {
        var authDir = (0, accounts_js_1.resolveWhatsAppAuthDir)({
            cfg: stubCfg,
            accountId: "foo/bar\\baz",
        }).authDir;
        // Sprawdzaj sanityzacje na segmencie accountId, nie na calej sciezce
        // (Windows uzywa backslash jako separator katalogow).
        var segment = node_path_1.default.basename(authDir);
        (0, vitest_1.expect)(segment).not.toContain("/");
        (0, vitest_1.expect)(segment).not.toContain("\\");
    });
    (0, vitest_1.it)("returns default directory for empty accountId", function () {
        var authDir = (0, accounts_js_1.resolveWhatsAppAuthDir)({
            cfg: stubCfg,
            accountId: "",
        }).authDir;
        (0, vitest_1.expect)(authDir).toMatch(/whatsapp[/\\]default$/);
    });
    (0, vitest_1.it)("preserves valid accountId unchanged", function () {
        var authDir = (0, accounts_js_1.resolveWhatsAppAuthDir)({
            cfg: stubCfg,
            accountId: "my-account-1",
        }).authDir;
        (0, vitest_1.expect)(authDir).toMatch(/whatsapp[/\\]my-account-1$/);
    });
});
