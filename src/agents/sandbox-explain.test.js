"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var sandbox_js_1 = require("./sandbox.js");
(0, vitest_1.describe)("sandbox explain helpers", function () {
    (0, vitest_1.it)("prefers agent overrides > global > defaults (sandbox tool policy)", function () {
        var cfg = {
            agents: {
                defaults: {
                    sandbox: { mode: "all", scope: "agent" },
                },
                list: [
                    {
                        id: "work",
                        workspace: "~/openclaw-work",
                        tools: { sandbox: { tools: { allow: ["write"] } } },
                    },
                ],
            },
            tools: { sandbox: { tools: { allow: ["read"], deny: ["browser"] } } },
        };
        var resolved = (0, sandbox_js_1.resolveSandboxConfigForAgent)(cfg, "work");
        (0, vitest_1.expect)(resolved.tools.allow).toEqual(["write", "image"]);
        (0, vitest_1.expect)(resolved.tools.deny).toEqual(["browser"]);
        var policy = (0, sandbox_js_1.resolveSandboxToolPolicyForAgent)(cfg, "work");
        (0, vitest_1.expect)(policy.allow).toEqual(["write", "image"]);
        (0, vitest_1.expect)(policy.sources.allow.source).toBe("agent");
        (0, vitest_1.expect)(policy.deny).toEqual(["browser"]);
        (0, vitest_1.expect)(policy.sources.deny.source).toBe("global");
    });
    (0, vitest_1.it)("expands group tool shorthands inside sandbox tool policy", function () {
        var cfg = {
            agents: {
                defaults: {
                    sandbox: { mode: "all", scope: "agent" },
                },
                list: [
                    {
                        id: "work",
                        workspace: "~/openclaw-work",
                        tools: {
                            sandbox: { tools: { allow: ["group:memory", "group:fs"] } },
                        },
                    },
                ],
            },
        };
        var policy = (0, sandbox_js_1.resolveSandboxToolPolicyForAgent)(cfg, "work");
        (0, vitest_1.expect)(policy.allow).toEqual([
            "memory_search",
            "memory_get",
            "read",
            "write",
            "edit",
            "apply_patch",
            "image",
        ]);
    });
    (0, vitest_1.it)("denies still win after group expansion", function () {
        var cfg = {
            agents: {
                defaults: {
                    sandbox: { mode: "all", scope: "agent" },
                },
            },
            tools: {
                sandbox: {
                    tools: {
                        allow: ["group:memory"],
                        deny: ["memory_get"],
                    },
                },
            },
        };
        var policy = (0, sandbox_js_1.resolveSandboxToolPolicyForAgent)(cfg, "main");
        (0, vitest_1.expect)(policy.allow).toContain("memory_search");
        (0, vitest_1.expect)(policy.allow).toContain("memory_get");
        (0, vitest_1.expect)(policy.deny).toContain("memory_get");
    });
    (0, vitest_1.it)("includes config key paths + main-session hint for non-main mode", function () {
        var cfg = {
            agents: {
                defaults: {
                    sandbox: { mode: "non-main", scope: "agent" },
                },
            },
            tools: {
                sandbox: {
                    tools: {
                        deny: ["browser"],
                    },
                },
            },
        };
        var msg = (0, sandbox_js_1.formatSandboxToolPolicyBlockedMessage)({
            cfg: cfg,
            sessionKey: "agent:main:whatsapp:group:g1",
            toolName: "browser",
        });
        (0, vitest_1.expect)(msg).toBeTruthy();
        (0, vitest_1.expect)(msg).toContain('Tool "browser" blocked by sandbox tool policy');
        (0, vitest_1.expect)(msg).toContain("mode=non-main");
        (0, vitest_1.expect)(msg).toContain("tools.sandbox.tools.deny");
        (0, vitest_1.expect)(msg).toContain("agents.defaults.sandbox.mode=off");
        (0, vitest_1.expect)(msg).toContain("Use main session key (direct): agent:main:main");
    });
});
