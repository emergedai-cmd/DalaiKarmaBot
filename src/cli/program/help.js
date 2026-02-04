"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureProgramHelp = configureProgramHelp;
var links_js_1 = require("../../terminal/links.js");
var theme_js_1 = require("../../terminal/theme.js");
var banner_js_1 = require("../banner.js");
var cli_name_js_1 = require("../cli-name.js");
var CLI_NAME = (0, cli_name_js_1.resolveCliName)();
var EXAMPLES = [
    [
        "openclaw channels login --verbose",
        "Link personal WhatsApp Web and show QR + connection logs.",
    ],
    [
        'openclaw message send --target +15555550123 --message "Hi" --json',
        "Send via your web session and print JSON result.",
    ],
    ["openclaw gateway --port 18789", "Run the WebSocket Gateway locally."],
    ["openclaw --dev gateway", "Run a dev Gateway (isolated state/config) on ws://127.0.0.1:19001."],
    ["openclaw gateway --force", "Kill anything bound to the default gateway port, then start it."],
    ["openclaw gateway ...", "Gateway control via WebSocket."],
    [
        'openclaw agent --to +15555550123 --message "Run summary" --deliver',
        "Talk directly to the agent using the Gateway; optionally send the WhatsApp reply.",
    ],
    [
        'openclaw message send --channel telegram --target @mychat --message "Hi"',
        "Send via your Telegram bot.",
    ],
];
function configureProgramHelp(program, ctx) {
    program
        .name(CLI_NAME)
        .description("")
        .version(ctx.programVersion)
        .option("--dev", "Dev profile: isolate state under ~/.openclaw-dev, default gateway port 19001, and shift derived ports (browser/canvas)")
        .option("--profile <name>", "Use a named profile (isolates OPENCLAW_STATE_DIR/OPENCLAW_CONFIG_PATH under ~/.openclaw-<name>)");
    program.option("--no-color", "Disable ANSI colors", false);
    program.configureHelp({
        optionTerm: function (option) { return theme_js_1.theme.option(option.flags); },
        subcommandTerm: function (cmd) { return theme_js_1.theme.command(cmd.name()); },
    });
    program.configureOutput({
        writeOut: function (str) {
            var colored = str
                .replace(/^Usage:/gm, theme_js_1.theme.heading("Usage:"))
                .replace(/^Options:/gm, theme_js_1.theme.heading("Options:"))
                .replace(/^Commands:/gm, theme_js_1.theme.heading("Commands:"));
            process.stdout.write(colored);
        },
        writeErr: function (str) { return process.stderr.write(str); },
        outputError: function (str, write) { return write(theme_js_1.theme.error(str)); },
    });
    if (process.argv.includes("-V") ||
        process.argv.includes("--version") ||
        process.argv.includes("-v")) {
        console.log(ctx.programVersion);
        process.exit(0);
    }
    program.addHelpText("beforeAll", function () {
        if ((0, banner_js_1.hasEmittedCliBanner)()) {
            return "";
        }
        var rich = (0, theme_js_1.isRich)();
        var line = (0, banner_js_1.formatCliBannerLine)(ctx.programVersion, { richTty: rich });
        return "\n".concat(line, "\n");
    });
    var fmtExamples = EXAMPLES.map(function (_a) {
        var cmd = _a[0], desc = _a[1];
        return "  ".concat(theme_js_1.theme.command((0, cli_name_js_1.replaceCliName)(cmd, CLI_NAME)), "\n    ").concat(theme_js_1.theme.muted(desc));
    }).join("\n");
    program.addHelpText("afterAll", function (_a) {
        var command = _a.command;
        if (command !== program) {
            return "";
        }
        var docs = (0, links_js_1.formatDocsLink)("/cli", "docs.openclaw.ai/cli");
        return "\n".concat(theme_js_1.theme.heading("Examples:"), "\n").concat(fmtExamples, "\n\n").concat(theme_js_1.theme.muted("Docs:"), " ").concat(docs, "\n");
    });
}
