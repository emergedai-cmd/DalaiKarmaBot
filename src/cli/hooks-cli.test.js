"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var hooks_cli_js_1 = require("./hooks-cli.js");
var report = {
    workspaceDir: "/tmp/workspace",
    managedHooksDir: "/tmp/hooks",
    hooks: [
        {
            name: "session-memory",
            description: "Save session context to memory",
            source: "openclaw-bundled",
            pluginId: undefined,
            filePath: "/tmp/hooks/session-memory/HOOK.md",
            baseDir: "/tmp/hooks/session-memory",
            handlerPath: "/tmp/hooks/session-memory/handler.js",
            hookKey: "session-memory",
            emoji: "💾",
            homepage: "https://docs.openclaw.ai/hooks#session-memory",
            events: ["command:new"],
            always: false,
            disabled: false,
            eligible: true,
            managedByPlugin: false,
            requirements: {
                bins: [],
                anyBins: [],
                env: [],
                config: [],
                os: [],
            },
            missing: {
                bins: [],
                anyBins: [],
                env: [],
                config: [],
                os: [],
            },
            configChecks: [],
            install: [],
        },
    ],
};
(0, vitest_1.describe)("hooks cli formatting", function () {
    (0, vitest_1.it)("labels hooks list output", function () {
        var output = (0, hooks_cli_js_1.formatHooksList)(report, {});
        (0, vitest_1.expect)(output).toContain("Hooks");
        (0, vitest_1.expect)(output).not.toContain("Internal Hooks");
    });
    (0, vitest_1.it)("labels hooks status output", function () {
        var output = (0, hooks_cli_js_1.formatHooksCheck)(report, {});
        (0, vitest_1.expect)(output).toContain("Hooks Status");
    });
    (0, vitest_1.it)("labels plugin-managed hooks with plugin id", function () {
        var pluginReport = {
            workspaceDir: "/tmp/workspace",
            managedHooksDir: "/tmp/hooks",
            hooks: [
                {
                    name: "plugin-hook",
                    description: "Hook from plugin",
                    source: "openclaw-plugin",
                    pluginId: "voice-call",
                    filePath: "/tmp/hooks/plugin-hook/HOOK.md",
                    baseDir: "/tmp/hooks/plugin-hook",
                    handlerPath: "/tmp/hooks/plugin-hook/handler.js",
                    hookKey: "plugin-hook",
                    emoji: "🔗",
                    homepage: undefined,
                    events: ["command:new"],
                    always: false,
                    disabled: false,
                    eligible: true,
                    managedByPlugin: true,
                    requirements: {
                        bins: [],
                        anyBins: [],
                        env: [],
                        config: [],
                        os: [],
                    },
                    missing: {
                        bins: [],
                        anyBins: [],
                        env: [],
                        config: [],
                        os: [],
                    },
                    configChecks: [],
                    install: [],
                },
            ],
        };
        var output = (0, hooks_cli_js_1.formatHooksList)(pluginReport, {});
        (0, vitest_1.expect)(output).toContain("plugin:voice-call");
    });
});
