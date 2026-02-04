"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCronCli = registerCronCli;
var links_js_1 = require("../../terminal/links.js");
var theme_js_1 = require("../../terminal/theme.js");
var register_cron_add_js_1 = require("./register.cron-add.js");
var register_cron_edit_js_1 = require("./register.cron-edit.js");
var register_cron_simple_js_1 = require("./register.cron-simple.js");
function registerCronCli(program) {
    var cron = program
        .command("cron")
        .description("Manage cron jobs (via Gateway)")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/cron", "docs.openclaw.ai/cli/cron"), "\n");
    });
    (0, register_cron_add_js_1.registerCronStatusCommand)(cron);
    (0, register_cron_add_js_1.registerCronListCommand)(cron);
    (0, register_cron_add_js_1.registerCronAddCommand)(cron);
    (0, register_cron_simple_js_1.registerCronSimpleCommands)(cron);
    (0, register_cron_edit_js_1.registerCronEditCommand)(cron);
}
