"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var auth_profiles_js_1 = require("./auth-profiles.js");
var constants_js_1 = require("./auth-profiles/constants.js");
(0, vitest_1.describe)("ensureAuthProfileStore", function () {
    (0, vitest_1.it)("migrates legacy auth.json and deletes it (PR #368)", function () {
        var agentDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-profiles-"));
        try {
            var legacyPath = node_path_1.default.join(agentDir, "auth.json");
            node_fs_1.default.writeFileSync(legacyPath, "".concat(JSON.stringify({
                anthropic: {
                    type: "oauth",
                    provider: "anthropic",
                    access: "access-token",
                    refresh: "refresh-token",
                    expires: Date.now() + 60000,
                },
            }, null, 2), "\n"), "utf8");
            var store = (0, auth_profiles_js_1.ensureAuthProfileStore)(agentDir);
            (0, vitest_1.expect)(store.profiles["anthropic:default"]).toMatchObject({
                type: "oauth",
                provider: "anthropic",
            });
            var migratedPath = node_path_1.default.join(agentDir, "auth-profiles.json");
            (0, vitest_1.expect)(node_fs_1.default.existsSync(migratedPath)).toBe(true);
            (0, vitest_1.expect)(node_fs_1.default.existsSync(legacyPath)).toBe(false);
            // idempotent
            var store2 = (0, auth_profiles_js_1.ensureAuthProfileStore)(agentDir);
            (0, vitest_1.expect)(store2.profiles["anthropic:default"]).toBeDefined();
            (0, vitest_1.expect)(node_fs_1.default.existsSync(legacyPath)).toBe(false);
        }
        finally {
            node_fs_1.default.rmSync(agentDir, { recursive: true, force: true });
        }
    });
    (0, vitest_1.it)("merges main auth profiles into agent store and keeps agent overrides", function () {
        var root = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-merge-"));
        var previousAgentDir = process.env.OPENCLAW_AGENT_DIR;
        var previousPiAgentDir = process.env.PI_CODING_AGENT_DIR;
        try {
            var mainDir = node_path_1.default.join(root, "main-agent");
            var agentDir = node_path_1.default.join(root, "agent-x");
            node_fs_1.default.mkdirSync(mainDir, { recursive: true });
            node_fs_1.default.mkdirSync(agentDir, { recursive: true });
            process.env.OPENCLAW_AGENT_DIR = mainDir;
            process.env.PI_CODING_AGENT_DIR = mainDir;
            var mainStore = {
                version: constants_js_1.AUTH_STORE_VERSION,
                profiles: {
                    "openai:default": {
                        type: "api_key",
                        provider: "openai",
                        key: "main-key",
                    },
                    "anthropic:default": {
                        type: "api_key",
                        provider: "anthropic",
                        key: "main-anthropic-key",
                    },
                },
            };
            node_fs_1.default.writeFileSync(node_path_1.default.join(mainDir, "auth-profiles.json"), "".concat(JSON.stringify(mainStore, null, 2), "\n"), "utf8");
            var agentStore = {
                version: constants_js_1.AUTH_STORE_VERSION,
                profiles: {
                    "openai:default": {
                        type: "api_key",
                        provider: "openai",
                        key: "agent-key",
                    },
                },
            };
            node_fs_1.default.writeFileSync(node_path_1.default.join(agentDir, "auth-profiles.json"), "".concat(JSON.stringify(agentStore, null, 2), "\n"), "utf8");
            var store = (0, auth_profiles_js_1.ensureAuthProfileStore)(agentDir);
            (0, vitest_1.expect)(store.profiles["anthropic:default"]).toMatchObject({
                type: "api_key",
                provider: "anthropic",
                key: "main-anthropic-key",
            });
            (0, vitest_1.expect)(store.profiles["openai:default"]).toMatchObject({
                type: "api_key",
                provider: "openai",
                key: "agent-key",
            });
        }
        finally {
            if (previousAgentDir === undefined) {
                delete process.env.OPENCLAW_AGENT_DIR;
            }
            else {
                process.env.OPENCLAW_AGENT_DIR = previousAgentDir;
            }
            if (previousPiAgentDir === undefined) {
                delete process.env.PI_CODING_AGENT_DIR;
            }
            else {
                process.env.PI_CODING_AGENT_DIR = previousPiAgentDir;
            }
            node_fs_1.default.rmSync(root, { recursive: true, force: true });
        }
    });
});
