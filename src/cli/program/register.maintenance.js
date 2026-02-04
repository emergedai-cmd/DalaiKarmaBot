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
exports.registerMaintenanceCommands = registerMaintenanceCommands;
var dashboard_js_1 = require("../../commands/dashboard.js");
var doctor_js_1 = require("../../commands/doctor.js");
var reset_js_1 = require("../../commands/reset.js");
var uninstall_js_1 = require("../../commands/uninstall.js");
var runtime_js_1 = require("../../runtime.js");
var links_js_1 = require("../../terminal/links.js");
var theme_js_1 = require("../../terminal/theme.js");
var cli_utils_js_1 = require("../cli-utils.js");
function registerMaintenanceCommands(program) {
    var _this = this;
    program
        .command("doctor")
        .description("Health checks + quick fixes for the gateway and channels")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/doctor", "docs.openclaw.ai/cli/doctor"), "\n");
    })
        .option("--no-workspace-suggestions", "Disable workspace memory system suggestions", false)
        .option("--yes", "Accept defaults without prompting", false)
        .option("--repair", "Apply recommended repairs without prompting", false)
        .option("--fix", "Apply recommended repairs (alias for --repair)", false)
        .option("--force", "Apply aggressive repairs (overwrites custom service config)", false)
        .option("--non-interactive", "Run without prompts (safe migrations only)", false)
        .option("--generate-gateway-token", "Generate and configure a gateway token", false)
        .option("--deep", "Scan system services for extra gateway installs", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, doctor_js_1.doctorCommand)(runtime_js_1.defaultRuntime, {
                                        workspaceSuggestions: opts.workspaceSuggestions,
                                        yes: Boolean(opts.yes),
                                        repair: Boolean(opts.repair) || Boolean(opts.fix),
                                        force: Boolean(opts.force),
                                        nonInteractive: Boolean(opts.nonInteractive),
                                        generateGatewayToken: Boolean(opts.generateGatewayToken),
                                        deep: Boolean(opts.deep),
                                    })];
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
        .command("dashboard")
        .description("Open the Control UI with your current token")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/dashboard", "docs.openclaw.ai/cli/dashboard"), "\n");
    })
        .option("--no-open", "Print URL but do not launch a browser", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, dashboard_js_1.dashboardCommand)(runtime_js_1.defaultRuntime, {
                                        noOpen: Boolean(opts.noOpen),
                                    })];
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
        .command("reset")
        .description("Reset local config/state (keeps the CLI installed)")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/reset", "docs.openclaw.ai/cli/reset"), "\n");
    })
        .option("--scope <scope>", "config|config+creds+sessions|full (default: interactive prompt)")
        .option("--yes", "Skip confirmation prompts", false)
        .option("--non-interactive", "Disable prompts (requires --scope + --yes)", false)
        .option("--dry-run", "Print actions without removing files", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, reset_js_1.resetCommand)(runtime_js_1.defaultRuntime, {
                                        scope: opts.scope,
                                        yes: Boolean(opts.yes),
                                        nonInteractive: Boolean(opts.nonInteractive),
                                        dryRun: Boolean(opts.dryRun),
                                    })];
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
        .command("uninstall")
        .description("Uninstall the gateway service + local data (CLI remains)")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/uninstall", "docs.openclaw.ai/cli/uninstall"), "\n");
    })
        .option("--service", "Remove the gateway service", false)
        .option("--state", "Remove state + config", false)
        .option("--workspace", "Remove workspace dirs", false)
        .option("--app", "Remove the macOS app", false)
        .option("--all", "Remove service + state + workspace + app", false)
        .option("--yes", "Skip confirmation prompts", false)
        .option("--non-interactive", "Disable prompts (requires --yes)", false)
        .option("--dry-run", "Print actions without removing files", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, uninstall_js_1.uninstallCommand)(runtime_js_1.defaultRuntime, {
                                        service: Boolean(opts.service),
                                        state: Boolean(opts.state),
                                        workspace: Boolean(opts.workspace),
                                        app: Boolean(opts.app),
                                        all: Boolean(opts.all),
                                        yes: Boolean(opts.yes),
                                        nonInteractive: Boolean(opts.nonInteractive),
                                        dryRun: Boolean(opts.dryRun),
                                    })];
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
