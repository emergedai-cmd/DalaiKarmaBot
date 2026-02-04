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
exports.registerSandboxCli = registerSandboxCli;
var sandbox_explain_js_1 = require("../commands/sandbox-explain.js");
var sandbox_js_1 = require("../commands/sandbox.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var theme_js_1 = require("../terminal/theme.js");
var help_format_js_1 = require("./help-format.js");
// --- Helpers ---
var SANDBOX_EXAMPLES = {
    main: [
        ["openclaw sandbox list", "List all sandbox containers."],
        ["openclaw sandbox list --browser", "List only browser containers."],
        ["openclaw sandbox recreate --all", "Recreate all containers."],
        ["openclaw sandbox recreate --session main", "Recreate a specific session."],
        ["openclaw sandbox recreate --agent mybot", "Recreate agent containers."],
        ["openclaw sandbox explain", "Explain effective sandbox config."],
    ],
    list: [
        ["openclaw sandbox list", "List all sandbox containers."],
        ["openclaw sandbox list --browser", "List only browser containers."],
        ["openclaw sandbox list --json", "JSON output."],
    ],
    recreate: [
        ["openclaw sandbox recreate --all", "Recreate all containers."],
        ["openclaw sandbox recreate --session main", "Recreate a specific session."],
        ["openclaw sandbox recreate --agent mybot", "Recreate a specific agent (includes sub-agents)."],
        ["openclaw sandbox recreate --browser --all", "Recreate only browser containers."],
        ["openclaw sandbox recreate --all --force", "Skip confirmation."],
    ],
    explain: [
        ["openclaw sandbox explain", "Show effective sandbox config."],
        ["openclaw sandbox explain --session agent:main:main", "Explain a specific session."],
        ["openclaw sandbox explain --agent work", "Explain an agent sandbox."],
        ["openclaw sandbox explain --json", "JSON output."],
    ],
};
function createRunner(commandFn) {
    var _this = this;
    return function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, commandFn(opts, runtime_js_1.defaultRuntime)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    runtime_js_1.defaultRuntime.error(String(err_1));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
// --- Registration ---
function registerSandboxCli(program) {
    var sandbox = program
        .command("sandbox")
        .description("Manage sandbox containers (Docker-based agent isolation)")
        .addHelpText("after", function () { return "\n".concat(theme_js_1.theme.heading("Examples:"), "\n").concat((0, help_format_js_1.formatHelpExamples)(SANDBOX_EXAMPLES.main), "\n"); })
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/sandbox", "docs.openclaw.ai/cli/sandbox"), "\n");
    })
        .action(function () {
        sandbox.help({ error: true });
    });
    // --- List Command ---
    sandbox
        .command("list")
        .description("List sandbox containers and their status")
        .option("--json", "Output result as JSON", false)
        .option("--browser", "List browser containers only", false)
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.heading("Examples:"), "\n").concat((0, help_format_js_1.formatHelpExamples)(SANDBOX_EXAMPLES.list), "\n\n").concat(theme_js_1.theme.heading("Output includes:"), "\n").concat(theme_js_1.theme.muted("- Container name and status (running/stopped)"), "\n").concat(theme_js_1.theme.muted("- Docker image and whether it matches current config"), "\n").concat(theme_js_1.theme.muted("- Age (time since creation)"), "\n").concat(theme_js_1.theme.muted("- Idle time (time since last use)"), "\n").concat(theme_js_1.theme.muted("- Associated session/agent ID"));
    })
        .action(createRunner(function (opts) {
        return (0, sandbox_js_1.sandboxListCommand)({
            browser: Boolean(opts.browser),
            json: Boolean(opts.json),
        }, runtime_js_1.defaultRuntime);
    }));
    // --- Recreate Command ---
    sandbox
        .command("recreate")
        .description("Remove containers to force recreation with updated config")
        .option("--all", "Recreate all sandbox containers", false)
        .option("--session <key>", "Recreate container for specific session")
        .option("--agent <id>", "Recreate containers for specific agent")
        .option("--browser", "Only recreate browser containers", false)
        .option("--force", "Skip confirmation prompt", false)
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.heading("Examples:"), "\n").concat((0, help_format_js_1.formatHelpExamples)(SANDBOX_EXAMPLES.recreate), "\n\n").concat(theme_js_1.theme.heading("Why use this?"), "\n").concat(theme_js_1.theme.muted("After updating Docker images or sandbox configuration, existing containers continue running with old settings."), "\n").concat(theme_js_1.theme.muted("This command removes them so they'll be recreated automatically with current config when next needed."), "\n\n").concat(theme_js_1.theme.heading("Filter options:"), "\n").concat(theme_js_1.theme.muted("  --all          Remove all sandbox containers"), "\n").concat(theme_js_1.theme.muted("  --session      Remove container for specific session key"), "\n").concat(theme_js_1.theme.muted("  --agent        Remove containers for agent (includes agent:id:* variants)"), "\n\n").concat(theme_js_1.theme.heading("Modifiers:"), "\n").concat(theme_js_1.theme.muted("  --browser      Only affect browser containers (not regular sandbox)"), "\n").concat(theme_js_1.theme.muted("  --force        Skip confirmation prompt"));
    })
        .action(createRunner(function (opts) {
        return (0, sandbox_js_1.sandboxRecreateCommand)({
            all: Boolean(opts.all),
            session: opts.session,
            agent: opts.agent,
            browser: Boolean(opts.browser),
            force: Boolean(opts.force),
        }, runtime_js_1.defaultRuntime);
    }));
    // --- Explain Command ---
    sandbox
        .command("explain")
        .description("Explain effective sandbox/tool policy for a session/agent")
        .option("--session <key>", "Session key to inspect (defaults to agent main)")
        .option("--agent <id>", "Agent id to inspect (defaults to derived agent)")
        .option("--json", "Output result as JSON", false)
        .addHelpText("after", function () { return "\n".concat(theme_js_1.theme.heading("Examples:"), "\n").concat((0, help_format_js_1.formatHelpExamples)(SANDBOX_EXAMPLES.explain), "\n"); })
        .action(createRunner(function (opts) {
        return (0, sandbox_explain_js_1.sandboxExplainCommand)({
            session: opts.session,
            agent: opts.agent,
            json: Boolean(opts.json),
        }, runtime_js_1.defaultRuntime);
    }));
}
