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
exports.registerStatusHealthSessionsCommands = registerStatusHealthSessionsCommands;
var health_js_1 = require("../../commands/health.js");
var sessions_js_1 = require("../../commands/sessions.js");
var status_js_1 = require("../../commands/status.js");
var globals_js_1 = require("../../globals.js");
var runtime_js_1 = require("../../runtime.js");
var links_js_1 = require("../../terminal/links.js");
var theme_js_1 = require("../../terminal/theme.js");
var cli_utils_js_1 = require("../cli-utils.js");
var help_format_js_1 = require("../help-format.js");
var helpers_js_1 = require("./helpers.js");
function resolveVerbose(opts) {
    return Boolean(opts.verbose || opts.debug);
}
function parseTimeoutMs(timeout) {
    var parsed = (0, helpers_js_1.parsePositiveIntOrUndefined)(timeout);
    if (timeout !== undefined && parsed === undefined) {
        runtime_js_1.defaultRuntime.error("--timeout must be a positive integer (milliseconds)");
        runtime_js_1.defaultRuntime.exit(1);
        return null;
    }
    return parsed;
}
function registerStatusHealthSessionsCommands(program) {
    var _this = this;
    program
        .command("status")
        .description("Show channel health and recent session recipients")
        .option("--json", "Output JSON instead of text", false)
        .option("--all", "Full diagnosis (read-only, pasteable)", false)
        .option("--usage", "Show model provider usage/quota snapshots", false)
        .option("--deep", "Probe channels (WhatsApp Web + Telegram + Discord + Slack + Signal)", false)
        .option("--timeout <ms>", "Probe timeout in milliseconds", "10000")
        .option("--verbose", "Verbose logging", false)
        .option("--debug", "Alias for --verbose", false)
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.heading("Examples:"), "\n").concat((0, help_format_js_1.formatHelpExamples)([
            ["openclaw status", "Show channel health + session summary."],
            ["openclaw status --all", "Full diagnosis (read-only)."],
            ["openclaw status --json", "Machine-readable output."],
            ["openclaw status --usage", "Show model provider usage/quota snapshots."],
            [
                "openclaw status --deep",
                "Run channel probes (WA + Telegram + Discord + Slack + Signal).",
            ],
            ["openclaw status --deep --timeout 5000", "Tighten probe timeout."],
        ]));
    })
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/status", "docs.openclaw.ai/cli/status"), "\n");
    })
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var verbose, timeout;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    verbose = resolveVerbose(opts);
                    (0, globals_js_1.setVerbose)(verbose);
                    timeout = parseTimeoutMs(opts.timeout);
                    if (timeout === null) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, status_js_1.statusCommand)({
                                            json: Boolean(opts.json),
                                            all: Boolean(opts.all),
                                            deep: Boolean(opts.deep),
                                            usage: Boolean(opts.usage),
                                            timeoutMs: timeout,
                                            verbose: verbose,
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
    program
        .command("health")
        .description("Fetch health from the running gateway")
        .option("--json", "Output JSON instead of text", false)
        .option("--timeout <ms>", "Connection timeout in milliseconds", "10000")
        .option("--verbose", "Verbose logging", false)
        .option("--debug", "Alias for --verbose", false)
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/health", "docs.openclaw.ai/cli/health"), "\n");
    })
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var verbose, timeout;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    verbose = resolveVerbose(opts);
                    (0, globals_js_1.setVerbose)(verbose);
                    timeout = parseTimeoutMs(opts.timeout);
                    if (timeout === null) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, health_js_1.healthCommand)({
                                            json: Boolean(opts.json),
                                            timeoutMs: timeout,
                                            verbose: verbose,
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
    program
        .command("sessions")
        .description("List stored conversation sessions")
        .option("--json", "Output as JSON", false)
        .option("--verbose", "Verbose logging", false)
        .option("--store <path>", "Path to session store (default: resolved from config)")
        .option("--active <minutes>", "Only show sessions updated within the past N minutes")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.heading("Examples:"), "\n").concat((0, help_format_js_1.formatHelpExamples)([
            ["openclaw sessions", "List all sessions."],
            ["openclaw sessions --active 120", "Only last 2 hours."],
            ["openclaw sessions --json", "Machine-readable output."],
            ["openclaw sessions --store ./tmp/sessions.json", "Use a specific session store."],
        ]), "\n\n").concat(theme_js_1.theme.muted("Shows token usage per session when the agent reports it; set agents.defaults.contextTokens to cap the window and show %."));
    })
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/sessions", "docs.openclaw.ai/cli/sessions"), "\n");
    })
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, globals_js_1.setVerbose)(Boolean(opts.verbose));
                    return [4 /*yield*/, (0, sessions_js_1.sessionsCommand)({
                            json: Boolean(opts.json),
                            store: opts.store,
                            active: opts.active,
                        }, runtime_js_1.defaultRuntime)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
