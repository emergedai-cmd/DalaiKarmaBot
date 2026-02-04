"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var accounts_js_1 = require("./accounts.js");
(0, vitest_1.describe)("hasAnyWhatsAppAuth", function () {
    var previousOauthDir;
    var tempOauthDir;
    var writeCreds = function (dir) {
        node_fs_1.default.mkdirSync(dir, { recursive: true });
        node_fs_1.default.writeFileSync(node_path_1.default.join(dir, "creds.json"), JSON.stringify({ me: {} }));
    };
    (0, vitest_1.beforeEach)(function () {
        previousOauthDir = process.env.OPENCLAW_OAUTH_DIR;
        tempOauthDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-oauth-"));
        process.env.OPENCLAW_OAUTH_DIR = tempOauthDir;
    });
    (0, vitest_1.afterEach)(function () {
        if (previousOauthDir === undefined) {
            delete process.env.OPENCLAW_OAUTH_DIR;
        }
        else {
            process.env.OPENCLAW_OAUTH_DIR = previousOauthDir;
        }
        if (tempOauthDir) {
            node_fs_1.default.rmSync(tempOauthDir, { recursive: true, force: true });
            tempOauthDir = undefined;
        }
    });
    (0, vitest_1.it)("returns false when no auth exists", function () {
        (0, vitest_1.expect)((0, accounts_js_1.hasAnyWhatsAppAuth)({})).toBe(false);
    });
    (0, vitest_1.it)("returns true when legacy auth exists", function () {
        node_fs_1.default.writeFileSync(node_path_1.default.join(tempOauthDir !== null && tempOauthDir !== void 0 ? tempOauthDir : "", "creds.json"), JSON.stringify({ me: {} }));
        (0, vitest_1.expect)((0, accounts_js_1.hasAnyWhatsAppAuth)({})).toBe(true);
    });
    (0, vitest_1.it)("returns true when non-default auth exists", function () {
        writeCreds(node_path_1.default.join(tempOauthDir !== null && tempOauthDir !== void 0 ? tempOauthDir : "", "whatsapp", "work"));
        (0, vitest_1.expect)((0, accounts_js_1.hasAnyWhatsAppAuth)({})).toBe(true);
    });
    (0, vitest_1.it)("includes authDir overrides", function () {
        var customDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-wa-auth-"));
        try {
            writeCreds(customDir);
            var cfg = {
                channels: { whatsapp: { accounts: { work: { authDir: customDir } } } },
            };
            (0, vitest_1.expect)((0, accounts_js_1.listWhatsAppAuthDirs)(cfg)).toContain(customDir);
            (0, vitest_1.expect)((0, accounts_js_1.hasAnyWhatsAppAuth)(cfg)).toBe(true);
        }
        finally {
            node_fs_1.default.rmSync(customDir, { recursive: true, force: true });
        }
    });
});
