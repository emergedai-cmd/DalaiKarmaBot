"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var token_js_1 = require("./token.js");
function withTempDir() {
    return node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-telegram-token-"));
}
(0, vitest_1.describe)("resolveTelegramToken", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.unstubAllEnvs();
    });
    (0, vitest_1.it)("prefers config token over env", function () {
        vitest_1.vi.stubEnv("TELEGRAM_BOT_TOKEN", "env-token");
        var cfg = {
            channels: { telegram: { botToken: "cfg-token" } },
        };
        var res = (0, token_js_1.resolveTelegramToken)(cfg);
        (0, vitest_1.expect)(res.token).toBe("cfg-token");
        (0, vitest_1.expect)(res.source).toBe("config");
    });
    (0, vitest_1.it)("uses env token when config is missing", function () {
        vitest_1.vi.stubEnv("TELEGRAM_BOT_TOKEN", "env-token");
        var cfg = {
            channels: { telegram: {} },
        };
        var res = (0, token_js_1.resolveTelegramToken)(cfg);
        (0, vitest_1.expect)(res.token).toBe("env-token");
        (0, vitest_1.expect)(res.source).toBe("env");
    });
    (0, vitest_1.it)("uses tokenFile when configured", function () {
        vitest_1.vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
        var dir = withTempDir();
        var tokenFile = node_path_1.default.join(dir, "token.txt");
        node_fs_1.default.writeFileSync(tokenFile, "file-token\n", "utf-8");
        var cfg = { channels: { telegram: { tokenFile: tokenFile } } };
        var res = (0, token_js_1.resolveTelegramToken)(cfg);
        (0, vitest_1.expect)(res.token).toBe("file-token");
        (0, vitest_1.expect)(res.source).toBe("tokenFile");
        node_fs_1.default.rmSync(dir, { recursive: true, force: true });
    });
    (0, vitest_1.it)("falls back to config token when no env or tokenFile", function () {
        vitest_1.vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
        var cfg = {
            channels: { telegram: { botToken: "cfg-token" } },
        };
        var res = (0, token_js_1.resolveTelegramToken)(cfg);
        (0, vitest_1.expect)(res.token).toBe("cfg-token");
        (0, vitest_1.expect)(res.source).toBe("config");
    });
    (0, vitest_1.it)("does not fall back to config when tokenFile is missing", function () {
        vitest_1.vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
        var dir = withTempDir();
        var tokenFile = node_path_1.default.join(dir, "missing-token.txt");
        var cfg = {
            channels: { telegram: { tokenFile: tokenFile, botToken: "cfg-token" } },
        };
        var res = (0, token_js_1.resolveTelegramToken)(cfg);
        (0, vitest_1.expect)(res.token).toBe("");
        (0, vitest_1.expect)(res.source).toBe("none");
        node_fs_1.default.rmSync(dir, { recursive: true, force: true });
    });
    (0, vitest_1.it)("resolves per-account tokens when the config account key casing doesn't match routing normalization", function () {
        vitest_1.vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
        var cfg = {
            channels: {
                telegram: {
                    accounts: {
                        // Note the mixed-case key; runtime accountId is normalized.
                        careyNotifications: { botToken: "acct-token" },
                    },
                },
            },
        };
        var res = (0, token_js_1.resolveTelegramToken)(cfg, { accountId: "careynotifications" });
        (0, vitest_1.expect)(res.token).toBe("acct-token");
        (0, vitest_1.expect)(res.source).toBe("config");
    });
});
