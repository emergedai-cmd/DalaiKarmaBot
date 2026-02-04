"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var subagent_registry_js_1 = require("../../agents/subagent-registry.js");
var internalHooks = require("../../hooks/internal-hooks.js");
var commands_js_1 = require("../../plugins/commands.js");
var bash_command_js_1 = require("./bash-command.js");
var commands_js_2 = require("./commands.js");
var directive_handling_js_1 = require("./directive-handling.js");
// Avoid expensive workspace scans during /context tests.
vitest_1.vi.mock("./commands-context-report.js", function () { return ({
    buildContextReply: function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var normalized;
        return __generator(this, function (_a) {
            normalized = params.command.commandBodyNormalized;
            if (normalized === "/context list") {
                return [2 /*return*/, { text: "Injected workspace files:\n- AGENTS.md" }];
            }
            if (normalized === "/context detail") {
                return [2 /*return*/, { text: "Context breakdown (detailed)\nTop tools (schema size):" }];
            }
            return [2 /*return*/, { text: "/context\n- /context list\nInline shortcut" }];
        });
    }); },
}); });
var testWorkspaceDir = node_os_1.default.tmpdir();
(0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-commands-"))];
            case 1:
                testWorkspaceDir = _a.sent();
                return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(testWorkspaceDir, "AGENTS.md"), "# Agents\n", "utf-8")];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, promises_1.default.rm(testWorkspaceDir, { recursive: true, force: true })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function buildParams(commandBody, cfg, ctxOverrides) {
    var _this = this;
    var ctx = __assign({ Body: commandBody, CommandBody: commandBody, CommandSource: "text", CommandAuthorized: true, Provider: "whatsapp", Surface: "whatsapp" }, ctxOverrides);
    var command = (0, commands_js_2.buildCommandContext)({
        ctx: ctx,
        cfg: cfg,
        isGroup: false,
        triggerBodyNormalized: commandBody.trim().toLowerCase(),
        commandAuthorized: true,
    });
    return {
        ctx: ctx,
        cfg: cfg,
        command: command,
        directives: (0, directive_handling_js_1.parseInlineDirectives)(commandBody),
        elevated: { enabled: true, allowed: true, failures: [] },
        sessionKey: "agent:main:main",
        workspaceDir: testWorkspaceDir,
        defaultGroupActivation: function () { return "mention"; },
        resolvedVerboseLevel: "off",
        resolvedReasoningLevel: "off",
        resolveDefaultThinkingLevel: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, undefined];
        }); }); },
        provider: "whatsapp",
        model: "test-model",
        contextTokens: 0,
        isGroup: false,
    };
}
(0, vitest_1.describe)("handleCommands gating", function () {
    (0, vitest_1.it)("blocks /bash when disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, bash_command_js_1.resetBashChatCommandForTests)();
                    cfg = {
                        commands: { bash: false, text: true },
                        whatsapp: { allowFrom: ["*"] },
                    };
                    params = buildParams("/bash echo hi", cfg);
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("bash is disabled");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks /bash when elevated is not allowlisted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, bash_command_js_1.resetBashChatCommandForTests)();
                    cfg = {
                        commands: { bash: true, text: true },
                        whatsapp: { allowFrom: ["*"] },
                    };
                    params = buildParams("/bash echo hi", cfg);
                    params.elevated = {
                        enabled: true,
                        allowed: false,
                        failures: [{ gate: "allowFrom", key: "tools.elevated.allowFrom.whatsapp" }],
                    };
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("elevated is not available");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks /config when disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = {
                        commands: { config: false, debug: false, text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                    };
                    params = buildParams("/config show", cfg);
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("/config is disabled");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks /debug when disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = {
                        commands: { config: false, debug: false, text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                    };
                    params = buildParams("/debug show", cfg);
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("/debug is disabled");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("handleCommands bash alias", function () {
    (0, vitest_1.it)("routes !poll through the /bash handler", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, bash_command_js_1.resetBashChatCommandForTests)();
                    cfg = {
                        commands: { bash: true, text: true },
                        whatsapp: { allowFrom: ["*"] },
                    };
                    params = buildParams("!poll", cfg);
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("No active bash job");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("routes !stop through the /bash handler", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, bash_command_js_1.resetBashChatCommandForTests)();
                    cfg = {
                        commands: { bash: true, text: true },
                        whatsapp: { allowFrom: ["*"] },
                    };
                    params = buildParams("!stop", cfg);
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("No active bash job");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("handleCommands plugin commands", function () {
    (0, vitest_1.it)("dispatches registered plugin commands", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, cfg, params, commandResult;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, commands_js_1.clearPluginCommands)();
                    result = (0, commands_js_1.registerPluginCommand)("test-plugin", {
                        name: "card",
                        description: "Test card",
                        handler: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ text: "from plugin" })];
                        }); }); },
                    });
                    (0, vitest_1.expect)(result.ok).toBe(true);
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                    };
                    params = buildParams("/card", cfg);
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    commandResult = _b.sent();
                    (0, vitest_1.expect)(commandResult.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = commandResult.reply) === null || _a === void 0 ? void 0 : _a.text).toBe("from plugin");
                    (0, commands_js_1.clearPluginCommands)();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("handleCommands identity", function () {
    (0, vitest_1.it)("returns sender details for /whoami", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                    };
                    params = buildParams("/whoami", cfg, {
                        SenderId: "12345",
                        SenderUsername: "TestUser",
                        ChatType: "direct",
                    });
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _e.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("Channel: whatsapp");
                    (0, vitest_1.expect)((_b = result.reply) === null || _b === void 0 ? void 0 : _b.text).toContain("User id: 12345");
                    (0, vitest_1.expect)((_c = result.reply) === null || _c === void 0 ? void 0 : _c.text).toContain("Username: @TestUser");
                    (0, vitest_1.expect)((_d = result.reply) === null || _d === void 0 ? void 0 : _d.text).toContain("AllowFrom: 12345");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("handleCommands hooks", function () {
    (0, vitest_1.it)("triggers hooks for /new with arguments", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, spy;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                    };
                    params = buildParams("/new take notes", cfg);
                    spy = vitest_1.vi.spyOn(internalHooks, "triggerInternalHook").mockResolvedValue();
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(spy).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ type: "command", action: "new" }));
                    spy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("handleCommands context", function () {
    (0, vitest_1.it)("returns context help for /context", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                    };
                    params = buildParams("/context", cfg);
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("/context list");
                    (0, vitest_1.expect)((_b = result.reply) === null || _b === void 0 ? void 0 : _b.text).toContain("Inline shortcut");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns a per-file breakdown for /context list", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                    };
                    params = buildParams("/context list", cfg);
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("Injected workspace files:");
                    (0, vitest_1.expect)((_b = result.reply) === null || _b === void 0 ? void 0 : _b.text).toContain("AGENTS.md");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns a detailed breakdown for /context detail", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                    };
                    params = buildParams("/context detail", cfg);
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("Context breakdown (detailed)");
                    (0, vitest_1.expect)((_b = result.reply) === null || _b === void 0 ? void 0 : _b.text).toContain("Top tools (schema size):");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("handleCommands subagents", function () {
    (0, vitest_1.it)("lists subagents when none exist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                    };
                    params = buildParams("/subagents list", cfg);
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("Subagents: none");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("lists subagents for the current command session over the target session", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    (0, subagent_registry_js_1.addSubagentRunForTests)({
                        runId: "run-1",
                        childSessionKey: "agent:main:subagent:abc",
                        requesterSessionKey: "agent:main:slack:slash:u1",
                        requesterDisplayKey: "agent:main:slack:slash:u1",
                        task: "do thing",
                        cleanup: "keep",
                        createdAt: 1000,
                        startedAt: 1000,
                    });
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                    };
                    params = buildParams("/subagents list", cfg, {
                        CommandSource: "native",
                        CommandTargetSessionKey: "agent:main:main",
                    });
                    params.sessionKey = "agent:main:slack:slash:u1";
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("Subagents (current session)");
                    (0, vitest_1.expect)((_b = result.reply) === null || _b === void 0 ? void 0 : _b.text).toContain("agent:main:subagent:abc");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("omits subagent status line when none exist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { mainKey: "main", scope: "per-sender" },
                    };
                    params = buildParams("/status", cfg);
                    params.resolvedVerboseLevel = "on";
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).not.toContain("Subagents:");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns help for unknown subagents action", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                    };
                    params = buildParams("/subagents foo", cfg);
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("/subagents");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns usage for subagents info without target", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                    };
                    params = buildParams("/subagents info", cfg);
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("/subagents info");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes subagent count in /status when active", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    (0, subagent_registry_js_1.addSubagentRunForTests)({
                        runId: "run-1",
                        childSessionKey: "agent:main:subagent:abc",
                        requesterSessionKey: "agent:main:main",
                        requesterDisplayKey: "main",
                        task: "do thing",
                        cleanup: "keep",
                        createdAt: 1000,
                        startedAt: 1000,
                    });
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { mainKey: "main", scope: "per-sender" },
                    };
                    params = buildParams("/status", cfg);
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("🤖 Subagents: 1 active");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes subagent details in /status when verbose", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    (0, subagent_registry_js_1.addSubagentRunForTests)({
                        runId: "run-1",
                        childSessionKey: "agent:main:subagent:abc",
                        requesterSessionKey: "agent:main:main",
                        requesterDisplayKey: "main",
                        task: "do thing",
                        cleanup: "keep",
                        createdAt: 1000,
                        startedAt: 1000,
                    });
                    (0, subagent_registry_js_1.addSubagentRunForTests)({
                        runId: "run-2",
                        childSessionKey: "agent:main:subagent:def",
                        requesterSessionKey: "agent:main:main",
                        requesterDisplayKey: "main",
                        task: "finished task",
                        cleanup: "keep",
                        createdAt: 900,
                        startedAt: 900,
                        endedAt: 1200,
                        outcome: { status: "ok" },
                    });
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { mainKey: "main", scope: "per-sender" },
                    };
                    params = buildParams("/status", cfg);
                    params.resolvedVerboseLevel = "on";
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("🤖 Subagents: 1 active");
                    (0, vitest_1.expect)((_b = result.reply) === null || _b === void 0 ? void 0 : _b.text).toContain("· 1 done");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns info for a subagent", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    (0, subagent_registry_js_1.addSubagentRunForTests)({
                        runId: "run-1",
                        childSessionKey: "agent:main:subagent:abc",
                        requesterSessionKey: "agent:main:main",
                        requesterDisplayKey: "main",
                        task: "do thing",
                        cleanup: "keep",
                        createdAt: 1000,
                        startedAt: 1000,
                        endedAt: 2000,
                        outcome: { status: "ok" },
                    });
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { mainKey: "main", scope: "per-sender" },
                    };
                    params = buildParams("/subagents info 1", cfg);
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _d.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("Subagent info");
                    (0, vitest_1.expect)((_b = result.reply) === null || _b === void 0 ? void 0 : _b.text).toContain("Run: run-1");
                    (0, vitest_1.expect)((_c = result.reply) === null || _c === void 0 ? void 0 : _c.text).toContain("Status: done");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("handleCommands /tts", function () {
    (0, vitest_1.it)("returns status for bare /tts on text command surfaces", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        messages: { tts: { prefsPath: node_path_1.default.join(testWorkspaceDir, "tts.json") } },
                    };
                    params = buildParams("/tts", cfg);
                    return [4 /*yield*/, (0, commands_js_2.handleCommands)(params)];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("TTS status");
                    return [2 /*return*/];
            }
        });
    }); });
});
