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
exports.registerAgentCommands = registerAgentCommands;
var registry_js_1 = require("../../channels/registry.js");
var agent_via_gateway_js_1 = require("../../commands/agent-via-gateway.js");
var agents_js_1 = require("../../commands/agents.js");
var globals_js_1 = require("../../globals.js");
var runtime_js_1 = require("../../runtime.js");
var links_js_1 = require("../../terminal/links.js");
var theme_js_1 = require("../../terminal/theme.js");
var cli_utils_js_1 = require("../cli-utils.js");
var command_options_js_1 = require("../command-options.js");
var deps_js_1 = require("../deps.js");
var help_format_js_1 = require("../help-format.js");
var helpers_js_1 = require("./helpers.js");
function registerAgentCommands(program, args) {
    var _this = this;
    program
        .command("agent")
        .description("Run an agent turn via the Gateway (use --local for embedded)")
        .requiredOption("-m, --message <text>", "Message body for the agent")
        .option("-t, --to <number>", "Recipient number in E.164 used to derive the session key")
        .option("--session-id <id>", "Use an explicit session id")
        .option("--agent <id>", "Agent id (overrides routing bindings)")
        .option("--thinking <level>", "Thinking level: off | minimal | low | medium | high")
        .option("--verbose <on|off>", "Persist agent verbose level for the session")
        .option("--channel <channel>", "Delivery channel: ".concat(args.agentChannelOptions, " (default: ").concat(registry_js_1.DEFAULT_CHAT_CHANNEL, ")"))
        .option("--reply-to <target>", "Delivery target override (separate from session routing)")
        .option("--reply-channel <channel>", "Delivery channel override (separate from routing)")
        .option("--reply-account <id>", "Delivery account id override")
        .option("--local", "Run the embedded agent locally (requires model provider API keys in your shell)", false)
        .option("--deliver", "Send the agent's reply back to the selected channel", false)
        .option("--json", "Output result as JSON", false)
        .option("--timeout <seconds>", "Override agent command timeout (seconds, default 600 or config value)")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.heading("Examples:"), "\n").concat((0, help_format_js_1.formatHelpExamples)([
            ['openclaw agent --to +15555550123 --message "status update"', "Start a new session."],
            ['openclaw agent --agent ops --message "Summarize logs"', "Use a specific agent."],
            [
                'openclaw agent --session-id 1234 --message "Summarize inbox" --thinking medium',
                "Target a session with explicit thinking level.",
            ],
            [
                'openclaw agent --to +15555550123 --message "Trace logs" --verbose on --json',
                "Enable verbose logging and JSON output.",
            ],
            ['openclaw agent --to +15555550123 --message "Summon reply" --deliver', "Deliver reply."],
            [
                'openclaw agent --agent ops --message "Generate report" --deliver --reply-channel slack --reply-to "#reports"',
                "Send reply to a different channel/target.",
            ],
        ]), "\n\n").concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/agent", "docs.openclaw.ai/cli/agent"));
    })
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var verboseLevel, deps;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    verboseLevel = typeof opts.verbose === "string" ? opts.verbose.toLowerCase() : "";
                    (0, globals_js_1.setVerbose)(verboseLevel === "on");
                    deps = (0, deps_js_1.createDefaultDeps)();
                    return [4 /*yield*/, (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, agent_via_gateway_js_1.agentCliCommand)(opts, runtime_js_1.defaultRuntime, deps)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var agents = program
        .command("agents")
        .description("Manage isolated agents (workspaces + auth + routing)")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/agents", "docs.openclaw.ai/cli/agents"), "\n");
    });
    agents
        .command("list")
        .description("List configured agents")
        .option("--json", "Output JSON instead of text", false)
        .option("--bindings", "Include routing bindings", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, agents_js_1.agentsListCommand)({ json: Boolean(opts.json), bindings: Boolean(opts.bindings) }, runtime_js_1.defaultRuntime)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    agents
        .command("add [name]")
        .description("Add a new isolated agent")
        .option("--workspace <dir>", "Workspace directory for the new agent")
        .option("--model <id>", "Model id for this agent")
        .option("--agent-dir <dir>", "Agent state directory for this agent")
        .option("--bind <channel[:accountId]>", "Route channel binding (repeatable)", helpers_js_1.collectOption, [])
        .option("--non-interactive", "Disable prompts; requires --workspace", false)
        .option("--json", "Output JSON summary", false)
        .action(function (name, opts, command) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, function () { return __awaiter(_this, void 0, void 0, function () {
                        var hasFlags;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    hasFlags = (0, command_options_js_1.hasExplicitOptions)(command, [
                                        "workspace",
                                        "model",
                                        "agentDir",
                                        "bind",
                                        "nonInteractive",
                                    ]);
                                    return [4 /*yield*/, (0, agents_js_1.agentsAddCommand)({
                                            name: typeof name === "string" ? name : undefined,
                                            workspace: opts.workspace,
                                            model: opts.model,
                                            agentDir: opts.agentDir,
                                            bind: Array.isArray(opts.bind) ? opts.bind : undefined,
                                            nonInteractive: Boolean(opts.nonInteractive),
                                            json: Boolean(opts.json),
                                        }, runtime_js_1.defaultRuntime, { hasFlags: hasFlags })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    agents
        .command("set-identity")
        .description("Update an agent identity (name/theme/emoji/avatar)")
        .option("--agent <id>", "Agent id to update")
        .option("--workspace <dir>", "Workspace directory used to locate the agent + IDENTITY.md")
        .option("--identity-file <path>", "Explicit IDENTITY.md path to read")
        .option("--from-identity", "Read values from IDENTITY.md", false)
        .option("--name <name>", "Identity name")
        .option("--theme <theme>", "Identity theme")
        .option("--emoji <emoji>", "Identity emoji")
        .option("--avatar <value>", "Identity avatar (workspace path, http(s) URL, or data URI)")
        .option("--json", "Output JSON summary", false)
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.heading("Examples:"), "\n").concat((0, help_format_js_1.formatHelpExamples)([
            ['openclaw agents set-identity --agent main --name "OpenClaw" --emoji "🦞"', "Set name + emoji."],
            ["openclaw agents set-identity --agent main --avatar avatars/openclaw.png", "Set avatar path."],
            [
                "openclaw agents set-identity --workspace ~/.openclaw/workspace --from-identity",
                "Load from IDENTITY.md.",
            ],
            [
                "openclaw agents set-identity --identity-file ~/.openclaw/workspace/IDENTITY.md --agent main",
                "Use a specific IDENTITY.md.",
            ],
        ]), "\n");
    })
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, agents_js_1.agentsSetIdentityCommand)({
                                        agent: opts.agent,
                                        workspace: opts.workspace,
                                        identityFile: opts.identityFile,
                                        fromIdentity: Boolean(opts.fromIdentity),
                                        name: opts.name,
                                        theme: opts.theme,
                                        emoji: opts.emoji,
                                        avatar: opts.avatar,
                                        json: Boolean(opts.json),
                                    }, runtime_js_1.defaultRuntime)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    agents
        .command("delete <id>")
        .description("Delete an agent and prune workspace/state")
        .option("--force", "Skip confirmation", false)
        .option("--json", "Output JSON summary", false)
        .action(function (id, opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, agents_js_1.agentsDeleteCommand)({
                                        id: String(id),
                                        force: Boolean(opts.force),
                                        json: Boolean(opts.json),
                                    }, runtime_js_1.defaultRuntime)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    agents.action(function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, agents_js_1.agentsListCommand)({}, runtime_js_1.defaultRuntime)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
