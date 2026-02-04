"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProgram = buildProgram;
var commander_1 = require("commander");
var command_registry_js_1 = require("./command-registry.js");
var context_js_1 = require("./context.js");
var help_js_1 = require("./help.js");
var preaction_js_1 = require("./preaction.js");
function buildProgram() {
    var program = new commander_1.Command();
    var ctx = (0, context_js_1.createProgramContext)();
    var argv = process.argv;
    (0, help_js_1.configureProgramHelp)(program, ctx);
    (0, preaction_js_1.registerPreActionHooks)(program, ctx.programVersion);
    (0, command_registry_js_1.registerProgramCommands)(program, ctx, argv);
    return program;
}
