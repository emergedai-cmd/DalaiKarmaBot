"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installTestEnv = installTestEnv;
exports.withIsolatedTestHome = withIsolatedTestHome;
var node_child_process_1 = require("node:child_process");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
function restoreEnv(entries) {
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var _a = entries_1[_i], key = _a.key, value = _a.value;
        if (value === undefined) {
            delete process.env[key];
        }
        else {
            process.env[key] = value;
        }
    }
}
function loadProfileEnv() {
    var _a;
    var profilePath = node_path_1.default.join(node_os_1.default.homedir(), ".profile");
    if (!node_fs_1.default.existsSync(profilePath)) {
        return;
    }
    try {
        var output = (0, node_child_process_1.execFileSync)("/bin/bash", ["-lc", "set -a; source \"".concat(profilePath, "\" >/dev/null 2>&1; env -0")], { encoding: "utf8" });
        var entries = output.split("\0");
        var applied = 0;
        for (var _i = 0, entries_2 = entries; _i < entries_2.length; _i++) {
            var entry = entries_2[_i];
            if (!entry) {
                continue;
            }
            var idx = entry.indexOf("=");
            if (idx <= 0) {
                continue;
            }
            var key = entry.slice(0, idx);
            if (!key || ((_a = process.env[key]) !== null && _a !== void 0 ? _a : "") !== "") {
                continue;
            }
            process.env[key] = entry.slice(idx + 1);
            applied += 1;
        }
        if (applied > 0) {
            console.log("[live] loaded ".concat(applied, " env vars from ~/.profile"));
        }
    }
    catch (_b) {
        // ignore profile load failures
    }
}
function installTestEnv() {
    var _a;
    var live = process.env.LIVE === "1" ||
        process.env.OPENCLAW_LIVE_TEST === "1" ||
        process.env.OPENCLAW_LIVE_GATEWAY === "1";
    // Live tests must use the real user environment (keys, profiles, config).
    // The default test env isolates HOME to avoid touching real state.
    if (live) {
        loadProfileEnv();
        return { cleanup: function () { }, tempHome: (_a = process.env.HOME) !== null && _a !== void 0 ? _a : "" };
    }
    var restore = [
        { key: "OPENCLAW_TEST_FAST", value: process.env.OPENCLAW_TEST_FAST },
        { key: "HOME", value: process.env.HOME },
        { key: "USERPROFILE", value: process.env.USERPROFILE },
        { key: "XDG_CONFIG_HOME", value: process.env.XDG_CONFIG_HOME },
        { key: "XDG_DATA_HOME", value: process.env.XDG_DATA_HOME },
        { key: "XDG_STATE_HOME", value: process.env.XDG_STATE_HOME },
        { key: "XDG_CACHE_HOME", value: process.env.XDG_CACHE_HOME },
        { key: "OPENCLAW_STATE_DIR", value: process.env.OPENCLAW_STATE_DIR },
        { key: "OPENCLAW_CONFIG_PATH", value: process.env.OPENCLAW_CONFIG_PATH },
        { key: "OPENCLAW_GATEWAY_PORT", value: process.env.OPENCLAW_GATEWAY_PORT },
        { key: "OPENCLAW_BRIDGE_ENABLED", value: process.env.OPENCLAW_BRIDGE_ENABLED },
        { key: "OPENCLAW_BRIDGE_HOST", value: process.env.OPENCLAW_BRIDGE_HOST },
        { key: "OPENCLAW_BRIDGE_PORT", value: process.env.OPENCLAW_BRIDGE_PORT },
        { key: "OPENCLAW_CANVAS_HOST_PORT", value: process.env.OPENCLAW_CANVAS_HOST_PORT },
        { key: "OPENCLAW_TEST_HOME", value: process.env.OPENCLAW_TEST_HOME },
        { key: "TELEGRAM_BOT_TOKEN", value: process.env.TELEGRAM_BOT_TOKEN },
        { key: "DISCORD_BOT_TOKEN", value: process.env.DISCORD_BOT_TOKEN },
        { key: "SLACK_BOT_TOKEN", value: process.env.SLACK_BOT_TOKEN },
        { key: "SLACK_APP_TOKEN", value: process.env.SLACK_APP_TOKEN },
        { key: "SLACK_USER_TOKEN", value: process.env.SLACK_USER_TOKEN },
        { key: "COPILOT_GITHUB_TOKEN", value: process.env.COPILOT_GITHUB_TOKEN },
        { key: "GH_TOKEN", value: process.env.GH_TOKEN },
        { key: "GITHUB_TOKEN", value: process.env.GITHUB_TOKEN },
        { key: "NODE_OPTIONS", value: process.env.NODE_OPTIONS },
    ];
    var tempHome = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-test-home-"));
    process.env.HOME = tempHome;
    process.env.USERPROFILE = tempHome;
    process.env.OPENCLAW_TEST_HOME = tempHome;
    process.env.OPENCLAW_TEST_FAST = "1";
    // Ensure test runs never touch the developer's real config/state, even if they have overrides set.
    delete process.env.OPENCLAW_CONFIG_PATH;
    // Prefer deriving state dir from HOME so nested tests that change HOME also isolate correctly.
    delete process.env.OPENCLAW_STATE_DIR;
    // Prefer test-controlled ports over developer overrides (avoid port collisions across tests/workers).
    delete process.env.OPENCLAW_GATEWAY_PORT;
    delete process.env.OPENCLAW_BRIDGE_ENABLED;
    delete process.env.OPENCLAW_BRIDGE_HOST;
    delete process.env.OPENCLAW_BRIDGE_PORT;
    delete process.env.OPENCLAW_CANVAS_HOST_PORT;
    // Avoid leaking real GitHub/Copilot tokens into non-live test runs.
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.DISCORD_BOT_TOKEN;
    delete process.env.SLACK_BOT_TOKEN;
    delete process.env.SLACK_APP_TOKEN;
    delete process.env.SLACK_USER_TOKEN;
    delete process.env.COPILOT_GITHUB_TOKEN;
    delete process.env.GH_TOKEN;
    delete process.env.GITHUB_TOKEN;
    // Avoid leaking local dev tooling flags into tests (e.g. --inspect).
    delete process.env.NODE_OPTIONS;
    // Windows: prefer the default state dir so auth/profile tests match real paths.
    if (process.platform === "win32") {
        process.env.OPENCLAW_STATE_DIR = node_path_1.default.join(tempHome, ".openclaw");
    }
    process.env.XDG_CONFIG_HOME = node_path_1.default.join(tempHome, ".config");
    process.env.XDG_DATA_HOME = node_path_1.default.join(tempHome, ".local", "share");
    process.env.XDG_STATE_HOME = node_path_1.default.join(tempHome, ".local", "state");
    process.env.XDG_CACHE_HOME = node_path_1.default.join(tempHome, ".cache");
    var cleanup = function () {
        restoreEnv(restore);
        try {
            node_fs_1.default.rmSync(tempHome, { recursive: true, force: true });
        }
        catch (_a) {
            // ignore cleanup errors
        }
    };
    return { cleanup: cleanup, tempHome: tempHome };
}
function withIsolatedTestHome() {
    return installTestEnv();
}
