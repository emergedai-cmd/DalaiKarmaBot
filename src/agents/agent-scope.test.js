"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var agent_scope_js_1 = require("./agent-scope.js");
(0, vitest_1.describe)("resolveAgentConfig", function () {
    (0, vitest_1.it)("should return undefined when no agents config exists", function () {
        var cfg = {};
        var result = (0, agent_scope_js_1.resolveAgentConfig)(cfg, "main");
        (0, vitest_1.expect)(result).toBeUndefined();
    });
    (0, vitest_1.it)("should return undefined when agent id does not exist", function () {
        var cfg = {
            agents: {
                list: [{ id: "main", workspace: "~/openclaw" }],
            },
        };
        var result = (0, agent_scope_js_1.resolveAgentConfig)(cfg, "nonexistent");
        (0, vitest_1.expect)(result).toBeUndefined();
    });
    (0, vitest_1.it)("should return basic agent config", function () {
        var cfg = {
            agents: {
                list: [
                    {
                        id: "main",
                        name: "Main Agent",
                        workspace: "~/openclaw",
                        agentDir: "~/.openclaw/agents/main",
                        model: "anthropic/claude-opus-4",
                    },
                ],
            },
        };
        var result = (0, agent_scope_js_1.resolveAgentConfig)(cfg, "main");
        (0, vitest_1.expect)(result).toEqual({
            name: "Main Agent",
            workspace: "~/openclaw",
            agentDir: "~/.openclaw/agents/main",
            model: "anthropic/claude-opus-4",
            identity: undefined,
            groupChat: undefined,
            subagents: undefined,
            sandbox: undefined,
            tools: undefined,
        });
    });
    (0, vitest_1.it)("supports per-agent model primary+fallbacks", function () {
        var cfg = {
            agents: {
                defaults: {
                    model: {
                        primary: "anthropic/claude-sonnet-4",
                        fallbacks: ["openai/gpt-4.1"],
                    },
                },
                list: [
                    {
                        id: "linus",
                        model: {
                            primary: "anthropic/claude-opus-4",
                            fallbacks: ["openai/gpt-5.2"],
                        },
                    },
                ],
            },
        };
        (0, vitest_1.expect)((0, agent_scope_js_1.resolveAgentModelPrimary)(cfg, "linus")).toBe("anthropic/claude-opus-4");
        (0, vitest_1.expect)((0, agent_scope_js_1.resolveAgentModelFallbacksOverride)(cfg, "linus")).toEqual(["openai/gpt-5.2"]);
        // If fallbacks isn't present, we don't override the global fallbacks.
        var cfgNoOverride = {
            agents: {
                list: [
                    {
                        id: "linus",
                        model: {
                            primary: "anthropic/claude-opus-4",
                        },
                    },
                ],
            },
        };
        (0, vitest_1.expect)((0, agent_scope_js_1.resolveAgentModelFallbacksOverride)(cfgNoOverride, "linus")).toBe(undefined);
        // Explicit empty list disables global fallbacks for that agent.
        var cfgDisable = {
            agents: {
                list: [
                    {
                        id: "linus",
                        model: {
                            primary: "anthropic/claude-opus-4",
                            fallbacks: [],
                        },
                    },
                ],
            },
        };
        (0, vitest_1.expect)((0, agent_scope_js_1.resolveAgentModelFallbacksOverride)(cfgDisable, "linus")).toEqual([]);
    });
    (0, vitest_1.it)("should return agent-specific sandbox config", function () {
        var cfg = {
            agents: {
                list: [
                    {
                        id: "work",
                        workspace: "~/openclaw-work",
                        sandbox: {
                            mode: "all",
                            scope: "agent",
                            perSession: false,
                            workspaceAccess: "ro",
                            workspaceRoot: "~/sandboxes",
                        },
                    },
                ],
            },
        };
        var result = (0, agent_scope_js_1.resolveAgentConfig)(cfg, "work");
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.sandbox).toEqual({
            mode: "all",
            scope: "agent",
            perSession: false,
            workspaceAccess: "ro",
            workspaceRoot: "~/sandboxes",
        });
    });
    (0, vitest_1.it)("should return agent-specific tools config", function () {
        var cfg = {
            agents: {
                list: [
                    {
                        id: "restricted",
                        workspace: "~/openclaw-restricted",
                        tools: {
                            allow: ["read"],
                            deny: ["exec", "write", "edit"],
                            elevated: {
                                enabled: false,
                                allowFrom: { whatsapp: ["+15555550123"] },
                            },
                        },
                    },
                ],
            },
        };
        var result = (0, agent_scope_js_1.resolveAgentConfig)(cfg, "restricted");
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.tools).toEqual({
            allow: ["read"],
            deny: ["exec", "write", "edit"],
            elevated: {
                enabled: false,
                allowFrom: { whatsapp: ["+15555550123"] },
            },
        });
    });
    (0, vitest_1.it)("should return both sandbox and tools config", function () {
        var _a, _b;
        var cfg = {
            agents: {
                list: [
                    {
                        id: "family",
                        workspace: "~/openclaw-family",
                        sandbox: {
                            mode: "all",
                            scope: "agent",
                        },
                        tools: {
                            allow: ["read"],
                            deny: ["exec"],
                        },
                    },
                ],
            },
        };
        var result = (0, agent_scope_js_1.resolveAgentConfig)(cfg, "family");
        (0, vitest_1.expect)((_a = result === null || result === void 0 ? void 0 : result.sandbox) === null || _a === void 0 ? void 0 : _a.mode).toBe("all");
        (0, vitest_1.expect)((_b = result === null || result === void 0 ? void 0 : result.tools) === null || _b === void 0 ? void 0 : _b.allow).toEqual(["read"]);
    });
    (0, vitest_1.it)("should normalize agent id", function () {
        var cfg = {
            agents: {
                list: [{ id: "main", workspace: "~/openclaw" }],
            },
        };
        // Should normalize to "main" (default)
        var result = (0, agent_scope_js_1.resolveAgentConfig)(cfg, "");
        (0, vitest_1.expect)(result).toBeDefined();
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.workspace).toBe("~/openclaw");
    });
});
