"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var agents_js_1 = require("./agents.js");
(0, vitest_1.describe)("agents helpers", function () {
    (0, vitest_1.it)("buildAgentSummaries includes default + configured agents", function () {
        var cfg = {
            agents: {
                defaults: {
                    workspace: "/main-ws",
                    model: { primary: "anthropic/claude" },
                },
                list: [
                    { id: "main" },
                    {
                        id: "work",
                        default: true,
                        name: "Work",
                        workspace: "/work-ws",
                        agentDir: "/state/agents/work/agent",
                        model: "openai/gpt-4.1",
                    },
                ],
            },
            bindings: [
                {
                    agentId: "work",
                    match: { channel: "whatsapp", accountId: "biz" },
                },
                { agentId: "main", match: { channel: "telegram" } },
            ],
        };
        var summaries = (0, agents_js_1.buildAgentSummaries)(cfg);
        var main = summaries.find(function (summary) { return summary.id === "main"; });
        var work = summaries.find(function (summary) { return summary.id === "work"; });
        (0, vitest_1.expect)(main).toBeTruthy();
        (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.workspace).toBe(node_path_1.default.join(node_os_1.default.homedir(), ".openclaw", "workspace-main"));
        (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.bindings).toBe(1);
        (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.model).toBe("anthropic/claude");
        (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.agentDir.endsWith(node_path_1.default.join("agents", "main", "agent"))).toBe(true);
        (0, vitest_1.expect)(work).toBeTruthy();
        (0, vitest_1.expect)(work === null || work === void 0 ? void 0 : work.name).toBe("Work");
        (0, vitest_1.expect)(work === null || work === void 0 ? void 0 : work.workspace).toBe(node_path_1.default.resolve("/work-ws"));
        (0, vitest_1.expect)(work === null || work === void 0 ? void 0 : work.agentDir).toBe(node_path_1.default.resolve("/state/agents/work/agent"));
        (0, vitest_1.expect)(work === null || work === void 0 ? void 0 : work.bindings).toBe(1);
        (0, vitest_1.expect)(work === null || work === void 0 ? void 0 : work.isDefault).toBe(true);
    });
    (0, vitest_1.it)("applyAgentConfig merges updates", function () {
        var _a, _b;
        var cfg = {
            agents: {
                list: [{ id: "work", workspace: "/old-ws", model: "anthropic/claude" }],
            },
        };
        var next = (0, agents_js_1.applyAgentConfig)(cfg, {
            agentId: "work",
            name: "Work",
            workspace: "/new-ws",
            agentDir: "/state/work/agent",
        });
        var work = (_b = (_a = next.agents) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.find(function (agent) { return agent.id === "work"; });
        (0, vitest_1.expect)(work === null || work === void 0 ? void 0 : work.name).toBe("Work");
        (0, vitest_1.expect)(work === null || work === void 0 ? void 0 : work.workspace).toBe("/new-ws");
        (0, vitest_1.expect)(work === null || work === void 0 ? void 0 : work.agentDir).toBe("/state/work/agent");
        (0, vitest_1.expect)(work === null || work === void 0 ? void 0 : work.model).toBe("anthropic/claude");
    });
    (0, vitest_1.it)("applyAgentBindings skips duplicates and reports conflicts", function () {
        var cfg = {
            bindings: [
                {
                    agentId: "main",
                    match: { channel: "whatsapp", accountId: "default" },
                },
            ],
        };
        var result = (0, agents_js_1.applyAgentBindings)(cfg, [
            {
                agentId: "main",
                match: { channel: "whatsapp", accountId: "default" },
            },
            {
                agentId: "work",
                match: { channel: "whatsapp", accountId: "default" },
            },
            {
                agentId: "work",
                match: { channel: "telegram" },
            },
        ]);
        (0, vitest_1.expect)(result.added).toHaveLength(1);
        (0, vitest_1.expect)(result.skipped).toHaveLength(1);
        (0, vitest_1.expect)(result.conflicts).toHaveLength(1);
        (0, vitest_1.expect)(result.config.bindings).toHaveLength(2);
    });
    (0, vitest_1.it)("pruneAgentConfig removes agent, bindings, and allowlist entries", function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var cfg = {
            agents: {
                list: [
                    { id: "work", default: true, workspace: "/work-ws" },
                    { id: "home", workspace: "/home-ws" },
                ],
            },
            bindings: [
                { agentId: "work", match: { channel: "whatsapp" } },
                { agentId: "home", match: { channel: "telegram" } },
            ],
            tools: {
                agentToAgent: { enabled: true, allow: ["work", "home"] },
            },
        };
        var result = (0, agents_js_1.pruneAgentConfig)(cfg, "work");
        (0, vitest_1.expect)((_b = (_a = result.config.agents) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.some(function (agent) { return agent.id === "work"; })).toBe(false);
        (0, vitest_1.expect)((_d = (_c = result.config.agents) === null || _c === void 0 ? void 0 : _c.list) === null || _d === void 0 ? void 0 : _d.some(function (agent) { return agent.id === "home"; })).toBe(true);
        (0, vitest_1.expect)(result.config.bindings).toHaveLength(1);
        (0, vitest_1.expect)((_f = (_e = result.config.bindings) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.agentId).toBe("home");
        (0, vitest_1.expect)((_h = (_g = result.config.tools) === null || _g === void 0 ? void 0 : _g.agentToAgent) === null || _h === void 0 ? void 0 : _h.allow).toEqual(["home"]);
        (0, vitest_1.expect)(result.removedBindings).toBe(1);
        (0, vitest_1.expect)(result.removedAllow).toBe(1);
    });
});
