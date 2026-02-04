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
exports.registerOnboardCommand = registerOnboardCommand;
var onboard_js_1 = require("../../commands/onboard.js");
var runtime_js_1 = require("../../runtime.js");
var links_js_1 = require("../../terminal/links.js");
var theme_js_1 = require("../../terminal/theme.js");
var cli_utils_js_1 = require("../cli-utils.js");
function resolveInstallDaemonFlag(command, opts) {
    if (!command || typeof command !== "object") {
        return undefined;
    }
    var getOptionValueSource = "getOptionValueSource" in command ? command.getOptionValueSource : undefined;
    if (typeof getOptionValueSource !== "function") {
        return undefined;
    }
    // Commander doesn't support option conflicts natively; keep original behavior.
    // If --skip-daemon is explicitly passed, it wins.
    if (getOptionValueSource.call(command, "skipDaemon") === "cli") {
        return false;
    }
    if (getOptionValueSource.call(command, "installDaemon") === "cli") {
        return Boolean(opts.installDaemon);
    }
    return undefined;
}
function registerOnboardCommand(program) {
    var _this = this;
    program
        .command("onboard")
        .description("Interactive wizard to set up the gateway, workspace, and skills")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/onboard", "docs.openclaw.ai/cli/onboard"), "\n");
    })
        .option("--workspace <dir>", "Agent workspace directory (default: ~/.openclaw/workspace)")
        .option("--reset", "Reset config + credentials + sessions + workspace before running wizard")
        .option("--non-interactive", "Run without prompts", false)
        .option("--accept-risk", "Acknowledge that agents are powerful and full system access is risky (required for --non-interactive)", false)
        .option("--flow <flow>", "Wizard flow: quickstart|advanced|manual")
        .option("--mode <mode>", "Wizard mode: local|remote")
        .option("--auth-choice <choice>", "Auth: setup-token|token|chutes|openai-codex|openai-api-key|openrouter-api-key|ai-gateway-api-key|moonshot-api-key|kimi-code-api-key|synthetic-api-key|venice-api-key|gemini-api-key|zai-api-key|xiaomi-api-key|apiKey|minimax-api|minimax-api-lightning|opencode-zen|skip")
        .option("--token-provider <id>", "Token provider id (non-interactive; used with --auth-choice token)")
        .option("--token <token>", "Token value (non-interactive; used with --auth-choice token)")
        .option("--token-profile-id <id>", "Auth profile id (non-interactive; default: <provider>:manual)")
        .option("--token-expires-in <duration>", "Optional token expiry duration (e.g. 365d, 12h)")
        .option("--anthropic-api-key <key>", "Anthropic API key")
        .option("--openai-api-key <key>", "OpenAI API key")
        .option("--openrouter-api-key <key>", "OpenRouter API key")
        .option("--ai-gateway-api-key <key>", "Vercel AI Gateway API key")
        .option("--moonshot-api-key <key>", "Moonshot API key")
        .option("--kimi-code-api-key <key>", "Kimi Coding API key")
        .option("--gemini-api-key <key>", "Gemini API key")
        .option("--zai-api-key <key>", "Z.AI API key")
        .option("--xiaomi-api-key <key>", "Xiaomi API key")
        .option("--minimax-api-key <key>", "MiniMax API key")
        .option("--synthetic-api-key <key>", "Synthetic API key")
        .option("--venice-api-key <key>", "Venice API key")
        .option("--opencode-zen-api-key <key>", "OpenCode Zen API key")
        .option("--gateway-port <port>", "Gateway port")
        .option("--gateway-bind <mode>", "Gateway bind: loopback|tailnet|lan|auto|custom")
        .option("--gateway-auth <mode>", "Gateway auth: token|password")
        .option("--gateway-token <token>", "Gateway token (token auth)")
        .option("--gateway-password <password>", "Gateway password (password auth)")
        .option("--remote-url <url>", "Remote Gateway WebSocket URL")
        .option("--remote-token <token>", "Remote Gateway token (optional)")
        .option("--tailscale <mode>", "Tailscale: off|serve|funnel")
        .option("--tailscale-reset-on-exit", "Reset tailscale serve/funnel on exit")
        .option("--install-daemon", "Install gateway service")
        .option("--no-install-daemon", "Skip gateway service install")
        .option("--skip-daemon", "Skip gateway service install")
        .option("--daemon-runtime <runtime>", "Daemon runtime: node|bun")
        .option("--skip-channels", "Skip channel setup")
        .option("--skip-skills", "Skip skills setup")
        .option("--skip-health", "Skip health check")
        .option("--skip-ui", "Skip Control UI/TUI prompts")
        .option("--node-manager <name>", "Node manager for skills: npm|pnpm|bun")
        .option("--json", "Output JSON summary", false)
        .action(function (opts, command) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, function () { return __awaiter(_this, void 0, void 0, function () {
                        var installDaemon, gatewayPort;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    installDaemon = resolveInstallDaemonFlag(command, {
                                        installDaemon: Boolean(opts.installDaemon),
                                    });
                                    gatewayPort = typeof opts.gatewayPort === "string" ? Number.parseInt(opts.gatewayPort, 10) : undefined;
                                    return [4 /*yield*/, (0, onboard_js_1.onboardCommand)({
                                            workspace: opts.workspace,
                                            nonInteractive: Boolean(opts.nonInteractive),
                                            acceptRisk: Boolean(opts.acceptRisk),
                                            flow: opts.flow,
                                            mode: opts.mode,
                                            authChoice: opts.authChoice,
                                            tokenProvider: opts.tokenProvider,
                                            token: opts.token,
                                            tokenProfileId: opts.tokenProfileId,
                                            tokenExpiresIn: opts.tokenExpiresIn,
                                            anthropicApiKey: opts.anthropicApiKey,
                                            openaiApiKey: opts.openaiApiKey,
                                            openrouterApiKey: opts.openrouterApiKey,
                                            aiGatewayApiKey: opts.aiGatewayApiKey,
                                            moonshotApiKey: opts.moonshotApiKey,
                                            kimiCodeApiKey: opts.kimiCodeApiKey,
                                            geminiApiKey: opts.geminiApiKey,
                                            zaiApiKey: opts.zaiApiKey,
                                            xiaomiApiKey: opts.xiaomiApiKey,
                                            minimaxApiKey: opts.minimaxApiKey,
                                            syntheticApiKey: opts.syntheticApiKey,
                                            veniceApiKey: opts.veniceApiKey,
                                            opencodeZenApiKey: opts.opencodeZenApiKey,
                                            gatewayPort: typeof gatewayPort === "number" && Number.isFinite(gatewayPort)
                                                ? gatewayPort
                                                : undefined,
                                            gatewayBind: opts.gatewayBind,
                                            gatewayAuth: opts.gatewayAuth,
                                            gatewayToken: opts.gatewayToken,
                                            gatewayPassword: opts.gatewayPassword,
                                            remoteUrl: opts.remoteUrl,
                                            remoteToken: opts.remoteToken,
                                            tailscale: opts.tailscale,
                                            tailscaleResetOnExit: Boolean(opts.tailscaleResetOnExit),
                                            reset: Boolean(opts.reset),
                                            installDaemon: installDaemon,
                                            daemonRuntime: opts.daemonRuntime,
                                            skipChannels: Boolean(opts.skipChannels),
                                            skipSkills: Boolean(opts.skipSkills),
                                            skipHealth: Boolean(opts.skipHealth),
                                            skipUi: Boolean(opts.skipUi),
                                            nodeManager: opts.nodeManager,
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
}
