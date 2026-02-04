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
exports.registerModelsCli = registerModelsCli;
var models_js_1 = require("../commands/models.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var theme_js_1 = require("../terminal/theme.js");
var cli_utils_js_1 = require("./cli-utils.js");
function runModelsCommand(action) {
    return (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, action);
}
function registerModelsCli(program) {
    var _this = this;
    var models = program
        .command("models")
        .description("Model discovery, scanning, and configuration")
        .option("--status-json", "Output JSON (alias for `models status --json`)", false)
        .option("--status-plain", "Plain output (alias for `models status --plain`)", false)
        .option("--agent <id>", "Agent id to inspect (overrides OPENCLAW_AGENT_DIR/PI_CODING_AGENT_DIR)")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/models", "docs.openclaw.ai/cli/models"), "\n");
    });
    models
        .command("list")
        .description("List models (configured by default)")
        .option("--all", "Show full model catalog", false)
        .option("--local", "Filter to local models", false)
        .option("--provider <name>", "Filter by provider")
        .option("--json", "Output JSON", false)
        .option("--plain", "Plain line output", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsListCommand)(opts, runtime_js_1.defaultRuntime)];
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
    models
        .command("status")
        .description("Show configured model state")
        .option("--json", "Output JSON", false)
        .option("--plain", "Plain output", false)
        .option("--check", "Exit non-zero if auth is expiring/expired (1=expired/missing, 2=expiring)", false)
        .option("--probe", "Probe configured provider auth (live)", false)
        .option("--probe-provider <name>", "Only probe a single provider")
        .option("--probe-profile <id>", "Only probe specific auth profile ids (repeat or comma-separated)", function (value, previous) {
        var next = Array.isArray(previous) ? previous : previous ? [previous] : [];
        next.push(value);
        return next;
    })
        .option("--probe-timeout <ms>", "Per-probe timeout in ms")
        .option("--probe-concurrency <n>", "Concurrent probes")
        .option("--probe-max-tokens <n>", "Probe max tokens (best-effort)")
        .option("--agent <id>", "Agent id to inspect (overrides OPENCLAW_AGENT_DIR/PI_CODING_AGENT_DIR)")
        .action(function (opts, command) { return __awaiter(_this, void 0, void 0, function () {
        var agent;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    agent = (_a = (0, cli_utils_js_1.resolveOptionFromCommand)(command, "agent")) !== null && _a !== void 0 ? _a : opts.agent;
                    return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, models_js_1.modelsStatusCommand)({
                                            json: Boolean(opts.json),
                                            plain: Boolean(opts.plain),
                                            check: Boolean(opts.check),
                                            probe: Boolean(opts.probe),
                                            probeProvider: opts.probeProvider,
                                            probeProfile: opts.probeProfile,
                                            probeTimeout: opts.probeTimeout,
                                            probeConcurrency: opts.probeConcurrency,
                                            probeMaxTokens: opts.probeMaxTokens,
                                            agent: agent,
                                        }, runtime_js_1.defaultRuntime)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    models
        .command("set")
        .description("Set the default model")
        .argument("<model>", "Model id or alias")
        .action(function (model) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsSetCommand)(model, runtime_js_1.defaultRuntime)];
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
    models
        .command("set-image")
        .description("Set the image model")
        .argument("<model>", "Model id or alias")
        .action(function (model) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsSetImageCommand)(model, runtime_js_1.defaultRuntime)];
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
    var aliases = models.command("aliases").description("Manage model aliases");
    aliases
        .command("list")
        .description("List model aliases")
        .option("--json", "Output JSON", false)
        .option("--plain", "Plain output", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsAliasesListCommand)(opts, runtime_js_1.defaultRuntime)];
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
    aliases
        .command("add")
        .description("Add or update a model alias")
        .argument("<alias>", "Alias name")
        .argument("<model>", "Model id or alias")
        .action(function (alias, model) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsAliasesAddCommand)(alias, model, runtime_js_1.defaultRuntime)];
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
    aliases
        .command("remove")
        .description("Remove a model alias")
        .argument("<alias>", "Alias name")
        .action(function (alias) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsAliasesRemoveCommand)(alias, runtime_js_1.defaultRuntime)];
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
    var fallbacks = models.command("fallbacks").description("Manage model fallback list");
    fallbacks
        .command("list")
        .description("List fallback models")
        .option("--json", "Output JSON", false)
        .option("--plain", "Plain output", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsFallbacksListCommand)(opts, runtime_js_1.defaultRuntime)];
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
    fallbacks
        .command("add")
        .description("Add a fallback model")
        .argument("<model>", "Model id or alias")
        .action(function (model) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsFallbacksAddCommand)(model, runtime_js_1.defaultRuntime)];
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
    fallbacks
        .command("remove")
        .description("Remove a fallback model")
        .argument("<model>", "Model id or alias")
        .action(function (model) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsFallbacksRemoveCommand)(model, runtime_js_1.defaultRuntime)];
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
    fallbacks
        .command("clear")
        .description("Clear all fallback models")
        .action(function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsFallbacksClearCommand)(runtime_js_1.defaultRuntime)];
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
    var imageFallbacks = models
        .command("image-fallbacks")
        .description("Manage image model fallback list");
    imageFallbacks
        .command("list")
        .description("List image fallback models")
        .option("--json", "Output JSON", false)
        .option("--plain", "Plain output", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsImageFallbacksListCommand)(opts, runtime_js_1.defaultRuntime)];
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
    imageFallbacks
        .command("add")
        .description("Add an image fallback model")
        .argument("<model>", "Model id or alias")
        .action(function (model) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsImageFallbacksAddCommand)(model, runtime_js_1.defaultRuntime)];
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
    imageFallbacks
        .command("remove")
        .description("Remove an image fallback model")
        .argument("<model>", "Model id or alias")
        .action(function (model) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsImageFallbacksRemoveCommand)(model, runtime_js_1.defaultRuntime)];
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
    imageFallbacks
        .command("clear")
        .description("Clear all image fallback models")
        .action(function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsImageFallbacksClearCommand)(runtime_js_1.defaultRuntime)];
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
    models
        .command("scan")
        .description("Scan OpenRouter free models for tools + images")
        .option("--min-params <b>", "Minimum parameter size (billions)")
        .option("--max-age-days <days>", "Skip models older than N days")
        .option("--provider <name>", "Filter by provider prefix")
        .option("--max-candidates <n>", "Max fallback candidates", "6")
        .option("--timeout <ms>", "Per-probe timeout in ms")
        .option("--concurrency <n>", "Probe concurrency")
        .option("--no-probe", "Skip live probes; list free candidates only")
        .option("--yes", "Accept defaults without prompting", false)
        .option("--no-input", "Disable prompts (use defaults)")
        .option("--set-default", "Set agents.defaults.model to the first selection", false)
        .option("--set-image", "Set agents.defaults.imageModel to the first image selection", false)
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsScanCommand)(opts, runtime_js_1.defaultRuntime)];
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
    models.action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsStatusCommand)({
                                        json: Boolean(opts === null || opts === void 0 ? void 0 : opts.statusJson),
                                        plain: Boolean(opts === null || opts === void 0 ? void 0 : opts.statusPlain),
                                        agent: opts === null || opts === void 0 ? void 0 : opts.agent,
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
    var auth = models.command("auth").description("Manage model auth profiles");
    auth.option("--agent <id>", "Agent id for auth order get/set/clear");
    auth.action(function () {
        auth.help();
    });
    auth
        .command("add")
        .description("Interactive auth helper (setup-token or paste token)")
        .action(function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsAuthAddCommand)({}, runtime_js_1.defaultRuntime)];
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
    auth
        .command("login")
        .description("Run a provider plugin auth flow (OAuth/API key)")
        .option("--provider <id>", "Provider id registered by a plugin")
        .option("--method <id>", "Provider auth method id")
        .option("--set-default", "Apply the provider's default model recommendation", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsAuthLoginCommand)({
                                        provider: opts.provider,
                                        method: opts.method,
                                        setDefault: Boolean(opts.setDefault),
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
    auth
        .command("setup-token")
        .description("Run a provider CLI to create/sync a token (TTY required)")
        .option("--provider <name>", "Provider id (default: anthropic)")
        .option("--yes", "Skip confirmation", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsAuthSetupTokenCommand)({
                                        provider: opts.provider,
                                        yes: Boolean(opts.yes),
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
    auth
        .command("paste-token")
        .description("Paste a token into auth-profiles.json and update config")
        .requiredOption("--provider <name>", "Provider id (e.g. anthropic)")
        .option("--profile-id <id>", "Auth profile id (default: <provider>:manual)")
        .option("--expires-in <duration>", "Optional expiry duration (e.g. 365d, 12h). Stored as absolute expiresAt.")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.modelsAuthPasteTokenCommand)({
                                        provider: opts.provider,
                                        profileId: opts.profileId,
                                        expiresIn: opts.expiresIn,
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
    auth
        .command("login-github-copilot")
        .description("Login to GitHub Copilot via GitHub device flow (TTY required)")
        .option("--profile-id <id>", "Auth profile id (default: github-copilot:github)")
        .option("--yes", "Overwrite existing profile without prompting", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, models_js_1.githubCopilotLoginCommand)({
                                        profileId: opts.profileId,
                                        yes: Boolean(opts.yes),
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
    var order = auth.command("order").description("Manage per-agent auth profile order overrides");
    order
        .command("get")
        .description("Show per-agent auth order override (from auth-profiles.json)")
        .requiredOption("--provider <name>", "Provider id (e.g. anthropic)")
        .option("--agent <id>", "Agent id (default: configured default agent)")
        .option("--json", "Output JSON", false)
        .action(function (opts, command) { return __awaiter(_this, void 0, void 0, function () {
        var agent;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    agent = (_a = (0, cli_utils_js_1.resolveOptionFromCommand)(command, "agent")) !== null && _a !== void 0 ? _a : opts.agent;
                    return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, models_js_1.modelsAuthOrderGetCommand)({
                                            provider: opts.provider,
                                            agent: agent,
                                            json: Boolean(opts.json),
                                        }, runtime_js_1.defaultRuntime)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    order
        .command("set")
        .description("Set per-agent auth order override (locks rotation to this list)")
        .requiredOption("--provider <name>", "Provider id (e.g. anthropic)")
        .option("--agent <id>", "Agent id (default: configured default agent)")
        .argument("<profileIds...>", "Auth profile ids (e.g. anthropic:default)")
        .action(function (profileIds, opts, command) { return __awaiter(_this, void 0, void 0, function () {
        var agent;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    agent = (_a = (0, cli_utils_js_1.resolveOptionFromCommand)(command, "agent")) !== null && _a !== void 0 ? _a : opts.agent;
                    return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, models_js_1.modelsAuthOrderSetCommand)({
                                            provider: opts.provider,
                                            agent: agent,
                                            order: profileIds,
                                        }, runtime_js_1.defaultRuntime)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    order
        .command("clear")
        .description("Clear per-agent auth order override (fall back to config/round-robin)")
        .requiredOption("--provider <name>", "Provider id (e.g. anthropic)")
        .option("--agent <id>", "Agent id (default: configured default agent)")
        .action(function (opts, command) { return __awaiter(_this, void 0, void 0, function () {
        var agent;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    agent = (_a = (0, cli_utils_js_1.resolveOptionFromCommand)(command, "agent")) !== null && _a !== void 0 ? _a : opts.agent;
                    return [4 /*yield*/, runModelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, models_js_1.modelsAuthOrderClearCommand)({
                                            provider: opts.provider,
                                            agent: agent,
                                        }, runtime_js_1.defaultRuntime)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
