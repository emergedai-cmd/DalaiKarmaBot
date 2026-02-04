"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
require("./test-helpers/fast-coding-tools.js");
var pi_tools_js_1 = require("./pi-tools.js");
(0, vitest_1.describe)("Agent-specific tool filtering", function () {
    (0, vitest_1.it)("should apply global tool policy when no agent-specific policy exists", function () {
        var cfg = {
            tools: {
                allow: ["read", "write"],
                deny: ["bash"],
            },
            agents: {
                list: [
                    {
                        id: "main",
                        workspace: "~/openclaw",
                    },
                ],
            },
        };
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:main:main",
            workspaceDir: "/tmp/test",
            agentDir: "/tmp/agent",
        });
        var toolNames = tools.map(function (t) { return t.name; });
        (0, vitest_1.expect)(toolNames).toContain("read");
        (0, vitest_1.expect)(toolNames).toContain("write");
        (0, vitest_1.expect)(toolNames).not.toContain("exec");
        (0, vitest_1.expect)(toolNames).not.toContain("apply_patch");
    });
    (0, vitest_1.it)("should keep global tool policy when agent only sets tools.elevated", function () {
        var cfg = {
            tools: {
                deny: ["write"],
            },
            agents: {
                list: [
                    {
                        id: "main",
                        workspace: "~/openclaw",
                        tools: {
                            elevated: {
                                enabled: true,
                                allowFrom: { whatsapp: ["+15555550123"] },
                            },
                        },
                    },
                ],
            },
        };
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:main:main",
            workspaceDir: "/tmp/test",
            agentDir: "/tmp/agent",
        });
        var toolNames = tools.map(function (t) { return t.name; });
        (0, vitest_1.expect)(toolNames).toContain("exec");
        (0, vitest_1.expect)(toolNames).toContain("read");
        (0, vitest_1.expect)(toolNames).not.toContain("write");
        (0, vitest_1.expect)(toolNames).not.toContain("apply_patch");
    });
    (0, vitest_1.it)("should allow apply_patch when exec is allow-listed and applyPatch is enabled", function () {
        var cfg = {
            tools: {
                allow: ["read", "exec"],
                exec: {
                    applyPatch: { enabled: true },
                },
            },
        };
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:main:main",
            workspaceDir: "/tmp/test",
            agentDir: "/tmp/agent",
            modelProvider: "openai",
            modelId: "gpt-5.2",
        });
        var toolNames = tools.map(function (t) { return t.name; });
        (0, vitest_1.expect)(toolNames).toContain("read");
        (0, vitest_1.expect)(toolNames).toContain("exec");
        (0, vitest_1.expect)(toolNames).toContain("apply_patch");
    });
    (0, vitest_1.it)("should apply agent-specific tool policy", function () {
        var cfg = {
            tools: {
                allow: ["read", "write", "exec"],
                deny: [],
            },
            agents: {
                list: [
                    {
                        id: "restricted",
                        workspace: "~/openclaw-restricted",
                        tools: {
                            allow: ["read"], // Agent override: only read
                            deny: ["exec", "write", "edit"],
                        },
                    },
                ],
            },
        };
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:restricted:main",
            workspaceDir: "/tmp/test-restricted",
            agentDir: "/tmp/agent-restricted",
        });
        var toolNames = tools.map(function (t) { return t.name; });
        (0, vitest_1.expect)(toolNames).toContain("read");
        (0, vitest_1.expect)(toolNames).not.toContain("exec");
        (0, vitest_1.expect)(toolNames).not.toContain("write");
        (0, vitest_1.expect)(toolNames).not.toContain("apply_patch");
        (0, vitest_1.expect)(toolNames).not.toContain("edit");
    });
    (0, vitest_1.it)("should apply provider-specific tool policy", function () {
        var cfg = {
            tools: {
                allow: ["read", "write", "exec"],
                byProvider: {
                    "google-antigravity": {
                        allow: ["read"],
                    },
                },
            },
        };
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:main:main",
            workspaceDir: "/tmp/test-provider",
            agentDir: "/tmp/agent-provider",
            modelProvider: "google-antigravity",
            modelId: "claude-opus-4-5-thinking",
        });
        var toolNames = tools.map(function (t) { return t.name; });
        (0, vitest_1.expect)(toolNames).toContain("read");
        (0, vitest_1.expect)(toolNames).not.toContain("exec");
        (0, vitest_1.expect)(toolNames).not.toContain("write");
        (0, vitest_1.expect)(toolNames).not.toContain("apply_patch");
    });
    (0, vitest_1.it)("should apply provider-specific tool profile overrides", function () {
        var cfg = {
            tools: {
                profile: "coding",
                byProvider: {
                    "google-antigravity": {
                        profile: "minimal",
                    },
                },
            },
        };
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:main:main",
            workspaceDir: "/tmp/test-provider-profile",
            agentDir: "/tmp/agent-provider-profile",
            modelProvider: "google-antigravity",
            modelId: "claude-opus-4-5-thinking",
        });
        var toolNames = tools.map(function (t) { return t.name; });
        (0, vitest_1.expect)(toolNames).toEqual(["session_status"]);
    });
    (0, vitest_1.it)("should allow different tool policies for different agents", function () {
        var cfg = {
            agents: {
                list: [
                    {
                        id: "main",
                        workspace: "~/openclaw",
                        // No tools restriction - all tools available
                    },
                    {
                        id: "family",
                        workspace: "~/openclaw-family",
                        tools: {
                            allow: ["read"],
                            deny: ["exec", "write", "edit", "process"],
                        },
                    },
                ],
            },
        };
        // main agent: all tools
        var mainTools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:main:main",
            workspaceDir: "/tmp/test-main",
            agentDir: "/tmp/agent-main",
        });
        var mainToolNames = mainTools.map(function (t) { return t.name; });
        (0, vitest_1.expect)(mainToolNames).toContain("exec");
        (0, vitest_1.expect)(mainToolNames).toContain("write");
        (0, vitest_1.expect)(mainToolNames).toContain("edit");
        (0, vitest_1.expect)(mainToolNames).not.toContain("apply_patch");
        // family agent: restricted
        var familyTools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:family:whatsapp:group:123",
            workspaceDir: "/tmp/test-family",
            agentDir: "/tmp/agent-family",
        });
        var familyToolNames = familyTools.map(function (t) { return t.name; });
        (0, vitest_1.expect)(familyToolNames).toContain("read");
        (0, vitest_1.expect)(familyToolNames).not.toContain("exec");
        (0, vitest_1.expect)(familyToolNames).not.toContain("write");
        (0, vitest_1.expect)(familyToolNames).not.toContain("edit");
        (0, vitest_1.expect)(familyToolNames).not.toContain("apply_patch");
    });
    (0, vitest_1.it)("should apply group tool policy overrides (group-specific beats wildcard)", function () {
        var cfg = {
            channels: {
                whatsapp: {
                    groups: {
                        "*": {
                            tools: { allow: ["read"] },
                        },
                        trusted: {
                            tools: { allow: ["read", "exec"] },
                        },
                    },
                },
            },
        };
        var trustedTools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:main:whatsapp:group:trusted",
            messageProvider: "whatsapp",
            workspaceDir: "/tmp/test-group-trusted",
            agentDir: "/tmp/agent-group",
        });
        var trustedNames = trustedTools.map(function (t) { return t.name; });
        (0, vitest_1.expect)(trustedNames).toContain("read");
        (0, vitest_1.expect)(trustedNames).toContain("exec");
        var defaultTools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:main:whatsapp:group:unknown",
            messageProvider: "whatsapp",
            workspaceDir: "/tmp/test-group-default",
            agentDir: "/tmp/agent-group",
        });
        var defaultNames = defaultTools.map(function (t) { return t.name; });
        (0, vitest_1.expect)(defaultNames).toContain("read");
        (0, vitest_1.expect)(defaultNames).not.toContain("exec");
    });
    (0, vitest_1.it)("should apply per-sender tool policies for group tools", function () {
        var cfg = {
            channels: {
                whatsapp: {
                    groups: {
                        "*": {
                            tools: { allow: ["read"] },
                            toolsBySender: {
                                alice: { allow: ["read", "exec"] },
                            },
                        },
                    },
                },
            },
        };
        var aliceTools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:main:whatsapp:group:family",
            senderId: "alice",
            workspaceDir: "/tmp/test-group-sender",
            agentDir: "/tmp/agent-group-sender",
        });
        var aliceNames = aliceTools.map(function (t) { return t.name; });
        (0, vitest_1.expect)(aliceNames).toContain("read");
        (0, vitest_1.expect)(aliceNames).toContain("exec");
        var bobTools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:main:whatsapp:group:family",
            senderId: "bob",
            workspaceDir: "/tmp/test-group-sender-bob",
            agentDir: "/tmp/agent-group-sender",
        });
        var bobNames = bobTools.map(function (t) { return t.name; });
        (0, vitest_1.expect)(bobNames).toContain("read");
        (0, vitest_1.expect)(bobNames).not.toContain("exec");
    });
    (0, vitest_1.it)("should not let default sender policy override group tools", function () {
        var cfg = {
            channels: {
                whatsapp: {
                    groups: {
                        "*": {
                            toolsBySender: {
                                admin: { allow: ["read", "exec"] },
                            },
                        },
                        locked: {
                            tools: { allow: ["read"] },
                        },
                    },
                },
            },
        };
        var adminTools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:main:whatsapp:group:locked",
            senderId: "admin",
            workspaceDir: "/tmp/test-group-default-override",
            agentDir: "/tmp/agent-group-default-override",
        });
        var adminNames = adminTools.map(function (t) { return t.name; });
        (0, vitest_1.expect)(adminNames).toContain("read");
        (0, vitest_1.expect)(adminNames).not.toContain("exec");
    });
    (0, vitest_1.it)("should resolve telegram group tool policy for topic session keys", function () {
        var cfg = {
            channels: {
                telegram: {
                    groups: {
                        "123": {
                            tools: { allow: ["read"] },
                        },
                    },
                },
            },
        };
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:main:telegram:group:123:topic:456",
            messageProvider: "telegram",
            workspaceDir: "/tmp/test-telegram-topic",
            agentDir: "/tmp/agent-telegram",
        });
        var names = tools.map(function (t) { return t.name; });
        (0, vitest_1.expect)(names).toContain("read");
        (0, vitest_1.expect)(names).not.toContain("exec");
    });
    (0, vitest_1.it)("should inherit group tool policy for subagents from spawnedBy session keys", function () {
        var cfg = {
            channels: {
                whatsapp: {
                    groups: {
                        trusted: {
                            tools: { allow: ["read"] },
                        },
                    },
                },
            },
        };
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:main:subagent:test",
            spawnedBy: "agent:main:whatsapp:group:trusted",
            workspaceDir: "/tmp/test-subagent-group",
            agentDir: "/tmp/agent-subagent",
        });
        var names = tools.map(function (t) { return t.name; });
        (0, vitest_1.expect)(names).toContain("read");
        (0, vitest_1.expect)(names).not.toContain("exec");
    });
    (0, vitest_1.it)("should apply global tool policy before agent-specific policy", function () {
        var cfg = {
            tools: {
                deny: ["browser"], // Global deny
            },
            agents: {
                list: [
                    {
                        id: "work",
                        workspace: "~/openclaw-work",
                        tools: {
                            deny: ["exec", "process"], // Agent deny (override)
                        },
                    },
                ],
            },
        };
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:work:slack:dm:user123",
            workspaceDir: "/tmp/test-work",
            agentDir: "/tmp/agent-work",
        });
        var toolNames = tools.map(function (t) { return t.name; });
        // Global policy still applies; agent policy further restricts
        (0, vitest_1.expect)(toolNames).not.toContain("browser");
        (0, vitest_1.expect)(toolNames).not.toContain("exec");
        (0, vitest_1.expect)(toolNames).not.toContain("process");
        (0, vitest_1.expect)(toolNames).not.toContain("apply_patch");
    });
    (0, vitest_1.it)("should work with sandbox tools filtering", function () {
        var cfg = {
            agents: {
                defaults: {
                    sandbox: {
                        mode: "all",
                        scope: "agent",
                    },
                },
                list: [
                    {
                        id: "restricted",
                        workspace: "~/openclaw-restricted",
                        sandbox: {
                            mode: "all",
                            scope: "agent",
                        },
                        tools: {
                            allow: ["read"], // Agent further restricts to only read
                            deny: ["exec", "write"],
                        },
                    },
                ],
            },
            tools: {
                sandbox: {
                    tools: {
                        allow: ["read", "write", "exec"], // Sandbox allows these
                        deny: [],
                    },
                },
            },
        };
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: cfg,
            sessionKey: "agent:restricted:main",
            workspaceDir: "/tmp/test-restricted",
            agentDir: "/tmp/agent-restricted",
            sandbox: {
                enabled: true,
                sessionKey: "agent:restricted:main",
                workspaceDir: "/tmp/sandbox",
                agentWorkspaceDir: "/tmp/test-restricted",
                workspaceAccess: "none",
                containerName: "test-container",
                containerWorkdir: "/workspace",
                docker: {
                    image: "test-image",
                    containerPrefix: "test-",
                    workdir: "/workspace",
                    readOnlyRoot: true,
                    tmpfs: [],
                    network: "none",
                    capDrop: [],
                },
                tools: {
                    allow: ["read", "write", "exec"],
                    deny: [],
                },
                browserAllowHostControl: false,
            },
        });
        var toolNames = tools.map(function (t) { return t.name; });
        // Agent policy should be applied first, then sandbox
        // Agent allows only "read", sandbox allows ["read", "write", "exec"]
        // Result: only "read" (most restrictive wins)
        (0, vitest_1.expect)(toolNames).toContain("read");
        (0, vitest_1.expect)(toolNames).not.toContain("exec");
        (0, vitest_1.expect)(toolNames).not.toContain("write");
    });
    (0, vitest_1.it)("should run exec synchronously when process is denied", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, tools, execTool, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        tools: {
                            deny: ["process"],
                        },
                    };
                    tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
                        config: cfg,
                        sessionKey: "agent:main:main",
                        workspaceDir: "/tmp/test-main",
                        agentDir: "/tmp/agent-main",
                    });
                    execTool = tools.find(function (tool) { return tool.name === "exec"; });
                    (0, vitest_1.expect)(execTool).toBeDefined();
                    return [4 /*yield*/, (execTool === null || execTool === void 0 ? void 0 : execTool.execute("call1", {
                            command: "echo done",
                            yieldMs: 10,
                        }))];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.details.status).toBe("completed");
                    return [2 /*return*/];
            }
        });
    }); });
});
