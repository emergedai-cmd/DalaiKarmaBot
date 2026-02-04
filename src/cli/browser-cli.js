"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBrowserCli = registerBrowserCli;
var globals_js_1 = require("../globals.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var theme_js_1 = require("../terminal/theme.js");
var browser_cli_actions_input_js_1 = require("./browser-cli-actions-input.js");
var browser_cli_actions_observe_js_1 = require("./browser-cli-actions-observe.js");
var browser_cli_debug_js_1 = require("./browser-cli-debug.js");
var browser_cli_examples_js_1 = require("./browser-cli-examples.js");
var browser_cli_extension_js_1 = require("./browser-cli-extension.js");
var browser_cli_inspect_js_1 = require("./browser-cli-inspect.js");
var browser_cli_manage_js_1 = require("./browser-cli-manage.js");
var browser_cli_state_js_1 = require("./browser-cli-state.js");
var command_format_js_1 = require("./command-format.js");
var gateway_rpc_js_1 = require("./gateway-rpc.js");
var help_format_js_1 = require("./help-format.js");
function registerBrowserCli(program) {
    var browser = program
        .command("browser")
        .description("Manage OpenClaw's dedicated browser (Chrome/Chromium)")
        .option("--browser-profile <name>", "Browser profile name (default from config)")
        .option("--json", "Output machine-readable JSON", false)
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.heading("Examples:"), "\n").concat((0, help_format_js_1.formatHelpExamples)(__spreadArray(__spreadArray([], browser_cli_examples_js_1.browserCoreExamples, true), browser_cli_examples_js_1.browserActionExamples, true).map(function (cmd) { return [cmd, ""]; }), true), "\n\n").concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/browser", "docs.openclaw.ai/cli/browser"), "\n");
    })
        .action(function () {
        browser.outputHelp();
        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)("Missing subcommand. Try: \"".concat((0, command_format_js_1.formatCliCommand)("openclaw browser status"), "\"")));
        runtime_js_1.defaultRuntime.exit(1);
    });
    (0, gateway_rpc_js_1.addGatewayClientOptions)(browser);
    var parentOpts = function (cmd) { var _a, _b; return (_b = (_a = cmd.parent) === null || _a === void 0 ? void 0 : _a.opts) === null || _b === void 0 ? void 0 : _b.call(_a); };
    (0, browser_cli_manage_js_1.registerBrowserManageCommands)(browser, parentOpts);
    (0, browser_cli_extension_js_1.registerBrowserExtensionCommands)(browser, parentOpts);
    (0, browser_cli_inspect_js_1.registerBrowserInspectCommands)(browser, parentOpts);
    (0, browser_cli_actions_input_js_1.registerBrowserActionInputCommands)(browser, parentOpts);
    (0, browser_cli_actions_observe_js_1.registerBrowserActionObserveCommands)(browser, parentOpts);
    (0, browser_cli_debug_js_1.registerBrowserDebugCommands)(browser, parentOpts);
    (0, browser_cli_state_js_1.registerBrowserStateCommands)(browser, parentOpts);
}
