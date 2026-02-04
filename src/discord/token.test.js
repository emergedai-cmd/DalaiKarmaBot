"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var token_js_1 = require("./token.js");
(0, vitest_1.describe)("resolveDiscordToken", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.unstubAllEnvs();
    });
    (0, vitest_1.it)("prefers config token over env", function () {
        vitest_1.vi.stubEnv("DISCORD_BOT_TOKEN", "env-token");
        var cfg = {
            channels: { discord: { token: "cfg-token" } },
        };
        var res = (0, token_js_1.resolveDiscordToken)(cfg);
        (0, vitest_1.expect)(res.token).toBe("cfg-token");
        (0, vitest_1.expect)(res.source).toBe("config");
    });
    (0, vitest_1.it)("uses env token when config is missing", function () {
        vitest_1.vi.stubEnv("DISCORD_BOT_TOKEN", "env-token");
        var cfg = {
            channels: { discord: {} },
        };
        var res = (0, token_js_1.resolveDiscordToken)(cfg);
        (0, vitest_1.expect)(res.token).toBe("env-token");
        (0, vitest_1.expect)(res.source).toBe("env");
    });
    (0, vitest_1.it)("prefers account token for non-default accounts", function () {
        vitest_1.vi.stubEnv("DISCORD_BOT_TOKEN", "env-token");
        var cfg = {
            channels: {
                discord: {
                    token: "base-token",
                    accounts: {
                        work: { token: "acct-token" },
                    },
                },
            },
        };
        var res = (0, token_js_1.resolveDiscordToken)(cfg, { accountId: "work" });
        (0, vitest_1.expect)(res.token).toBe("acct-token");
        (0, vitest_1.expect)(res.source).toBe("config");
    });
});
