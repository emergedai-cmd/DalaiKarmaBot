"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var shell_env_js_1 = require("./shell-env.js");
(0, vitest_1.describe)("shell env fallback", function () {
    (0, vitest_1.it)("is disabled by default", function () {
        (0, vitest_1.expect)((0, shell_env_js_1.shouldEnableShellEnvFallback)({})).toBe(false);
        (0, vitest_1.expect)((0, shell_env_js_1.shouldEnableShellEnvFallback)({ OPENCLAW_LOAD_SHELL_ENV: "0" })).toBe(false);
        (0, vitest_1.expect)((0, shell_env_js_1.shouldEnableShellEnvFallback)({ OPENCLAW_LOAD_SHELL_ENV: "1" })).toBe(true);
    });
    (0, vitest_1.it)("resolves timeout from env with default fallback", function () {
        (0, vitest_1.expect)((0, shell_env_js_1.resolveShellEnvFallbackTimeoutMs)({})).toBe(15000);
        (0, vitest_1.expect)((0, shell_env_js_1.resolveShellEnvFallbackTimeoutMs)({ OPENCLAW_SHELL_ENV_TIMEOUT_MS: "42" })).toBe(42);
        (0, vitest_1.expect)((0, shell_env_js_1.resolveShellEnvFallbackTimeoutMs)({
            OPENCLAW_SHELL_ENV_TIMEOUT_MS: "nope",
        })).toBe(15000);
    });
    (0, vitest_1.it)("skips when already has an expected key", function () {
        var env = { OPENAI_API_KEY: "set" };
        var exec = vitest_1.vi.fn(function () { return Buffer.from(""); });
        var res = (0, shell_env_js_1.loadShellEnvFallback)({
            enabled: true,
            env: env,
            expectedKeys: ["OPENAI_API_KEY", "DISCORD_BOT_TOKEN"],
            exec: exec,
        });
        (0, vitest_1.expect)(res.ok).toBe(true);
        (0, vitest_1.expect)(res.applied).toEqual([]);
        (0, vitest_1.expect)(res.ok && res.skippedReason).toBe("already-has-keys");
        (0, vitest_1.expect)(exec).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("imports expected keys without overriding existing env", function () {
        var env = {};
        var exec = vitest_1.vi.fn(function () { return Buffer.from("OPENAI_API_KEY=from-shell\0DISCORD_BOT_TOKEN=discord\0"); });
        var res1 = (0, shell_env_js_1.loadShellEnvFallback)({
            enabled: true,
            env: env,
            expectedKeys: ["OPENAI_API_KEY", "DISCORD_BOT_TOKEN"],
            exec: exec,
        });
        (0, vitest_1.expect)(res1.ok).toBe(true);
        (0, vitest_1.expect)(env.OPENAI_API_KEY).toBe("from-shell");
        (0, vitest_1.expect)(env.DISCORD_BOT_TOKEN).toBe("discord");
        (0, vitest_1.expect)(exec).toHaveBeenCalledTimes(1);
        env.OPENAI_API_KEY = "from-parent";
        var exec2 = vitest_1.vi.fn(function () {
            return Buffer.from("OPENAI_API_KEY=from-shell\0DISCORD_BOT_TOKEN=discord2\0");
        });
        var res2 = (0, shell_env_js_1.loadShellEnvFallback)({
            enabled: true,
            env: env,
            expectedKeys: ["OPENAI_API_KEY", "DISCORD_BOT_TOKEN"],
            exec: exec2,
        });
        (0, vitest_1.expect)(res2.ok).toBe(true);
        (0, vitest_1.expect)(env.OPENAI_API_KEY).toBe("from-parent");
        (0, vitest_1.expect)(env.DISCORD_BOT_TOKEN).toBe("discord");
        (0, vitest_1.expect)(exec2).not.toHaveBeenCalled();
    });
});
