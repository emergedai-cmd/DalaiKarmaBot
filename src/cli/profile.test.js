"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var command_format_js_1 = require("./command-format.js");
var profile_js_1 = require("./profile.js");
(0, vitest_1.describe)("parseCliProfileArgs", function () {
    (0, vitest_1.it)("leaves gateway --dev for subcommands", function () {
        var res = (0, profile_js_1.parseCliProfileArgs)([
            "node",
            "openclaw",
            "gateway",
            "--dev",
            "--allow-unconfigured",
        ]);
        if (!res.ok) {
            throw new Error(res.error);
        }
        (0, vitest_1.expect)(res.profile).toBeNull();
        (0, vitest_1.expect)(res.argv).toEqual(["node", "openclaw", "gateway", "--dev", "--allow-unconfigured"]);
    });
    (0, vitest_1.it)("still accepts global --dev before subcommand", function () {
        var res = (0, profile_js_1.parseCliProfileArgs)(["node", "openclaw", "--dev", "gateway"]);
        if (!res.ok) {
            throw new Error(res.error);
        }
        (0, vitest_1.expect)(res.profile).toBe("dev");
        (0, vitest_1.expect)(res.argv).toEqual(["node", "openclaw", "gateway"]);
    });
    (0, vitest_1.it)("parses --profile value and strips it", function () {
        var res = (0, profile_js_1.parseCliProfileArgs)(["node", "openclaw", "--profile", "work", "status"]);
        if (!res.ok) {
            throw new Error(res.error);
        }
        (0, vitest_1.expect)(res.profile).toBe("work");
        (0, vitest_1.expect)(res.argv).toEqual(["node", "openclaw", "status"]);
    });
    (0, vitest_1.it)("rejects missing profile value", function () {
        var res = (0, profile_js_1.parseCliProfileArgs)(["node", "openclaw", "--profile"]);
        (0, vitest_1.expect)(res.ok).toBe(false);
    });
    (0, vitest_1.it)("rejects combining --dev with --profile (dev first)", function () {
        var res = (0, profile_js_1.parseCliProfileArgs)(["node", "openclaw", "--dev", "--profile", "work", "status"]);
        (0, vitest_1.expect)(res.ok).toBe(false);
    });
    (0, vitest_1.it)("rejects combining --dev with --profile (profile first)", function () {
        var res = (0, profile_js_1.parseCliProfileArgs)(["node", "openclaw", "--profile", "work", "--dev", "status"]);
        (0, vitest_1.expect)(res.ok).toBe(false);
    });
});
(0, vitest_1.describe)("applyCliProfileEnv", function () {
    (0, vitest_1.it)("fills env defaults for dev profile", function () {
        var env = {};
        (0, profile_js_1.applyCliProfileEnv)({
            profile: "dev",
            env: env,
            homedir: function () { return "/home/peter"; },
        });
        var expectedStateDir = node_path_1.default.join("/home/peter", ".openclaw-dev");
        (0, vitest_1.expect)(env.OPENCLAW_PROFILE).toBe("dev");
        (0, vitest_1.expect)(env.OPENCLAW_STATE_DIR).toBe(expectedStateDir);
        (0, vitest_1.expect)(env.OPENCLAW_CONFIG_PATH).toBe(node_path_1.default.join(expectedStateDir, "openclaw.json"));
        (0, vitest_1.expect)(env.OPENCLAW_GATEWAY_PORT).toBe("19001");
    });
    (0, vitest_1.it)("does not override explicit env values", function () {
        var env = {
            OPENCLAW_STATE_DIR: "/custom",
            OPENCLAW_GATEWAY_PORT: "19099",
        };
        (0, profile_js_1.applyCliProfileEnv)({
            profile: "dev",
            env: env,
            homedir: function () { return "/home/peter"; },
        });
        (0, vitest_1.expect)(env.OPENCLAW_STATE_DIR).toBe("/custom");
        (0, vitest_1.expect)(env.OPENCLAW_GATEWAY_PORT).toBe("19099");
        (0, vitest_1.expect)(env.OPENCLAW_CONFIG_PATH).toBe(node_path_1.default.join("/custom", "openclaw.json"));
    });
});
(0, vitest_1.describe)("formatCliCommand", function () {
    (0, vitest_1.it)("returns command unchanged when no profile is set", function () {
        (0, vitest_1.expect)((0, command_format_js_1.formatCliCommand)("openclaw doctor --fix", {})).toBe("openclaw doctor --fix");
    });
    (0, vitest_1.it)("returns command unchanged when profile is default", function () {
        (0, vitest_1.expect)((0, command_format_js_1.formatCliCommand)("openclaw doctor --fix", { OPENCLAW_PROFILE: "default" })).toBe("openclaw doctor --fix");
    });
    (0, vitest_1.it)("returns command unchanged when profile is Default (case-insensitive)", function () {
        (0, vitest_1.expect)((0, command_format_js_1.formatCliCommand)("openclaw doctor --fix", { OPENCLAW_PROFILE: "Default" })).toBe("openclaw doctor --fix");
    });
    (0, vitest_1.it)("returns command unchanged when profile is invalid", function () {
        (0, vitest_1.expect)((0, command_format_js_1.formatCliCommand)("openclaw doctor --fix", { OPENCLAW_PROFILE: "bad profile" })).toBe("openclaw doctor --fix");
    });
    (0, vitest_1.it)("returns command unchanged when --profile is already present", function () {
        (0, vitest_1.expect)((0, command_format_js_1.formatCliCommand)("openclaw --profile work doctor --fix", { OPENCLAW_PROFILE: "work" })).toBe("openclaw --profile work doctor --fix");
    });
    (0, vitest_1.it)("returns command unchanged when --dev is already present", function () {
        (0, vitest_1.expect)((0, command_format_js_1.formatCliCommand)("openclaw --dev doctor", { OPENCLAW_PROFILE: "dev" })).toBe("openclaw --dev doctor");
    });
    (0, vitest_1.it)("inserts --profile flag when profile is set", function () {
        (0, vitest_1.expect)((0, command_format_js_1.formatCliCommand)("openclaw doctor --fix", { OPENCLAW_PROFILE: "work" })).toBe("openclaw --profile work doctor --fix");
    });
    (0, vitest_1.it)("trims whitespace from profile", function () {
        (0, vitest_1.expect)((0, command_format_js_1.formatCliCommand)("openclaw doctor --fix", { OPENCLAW_PROFILE: "  jbopenclaw  " })).toBe("openclaw --profile jbopenclaw doctor --fix");
    });
    (0, vitest_1.it)("handles command with no args after openclaw", function () {
        (0, vitest_1.expect)((0, command_format_js_1.formatCliCommand)("openclaw", { OPENCLAW_PROFILE: "test" })).toBe("openclaw --profile test");
    });
    (0, vitest_1.it)("handles pnpm wrapper", function () {
        (0, vitest_1.expect)((0, command_format_js_1.formatCliCommand)("pnpm openclaw doctor", { OPENCLAW_PROFILE: "work" })).toBe("pnpm openclaw --profile work doctor");
    });
});
