"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodesTheme = getNodesTheme;
exports.runNodesCommand = runNodesCommand;
var runtime_js_1 = require("../../runtime.js");
var theme_js_1 = require("../../terminal/theme.js");
var cli_utils_js_1 = require("../cli-utils.js");
var rpc_js_1 = require("./rpc.js");
function getNodesTheme() {
    var rich = (0, theme_js_1.isRich)();
    var color = function (fn) { return function (value) { return (rich ? fn(value) : value); }; };
    return {
        rich: rich,
        heading: color(theme_js_1.theme.heading),
        ok: color(theme_js_1.theme.success),
        warn: color(theme_js_1.theme.warn),
        muted: color(theme_js_1.theme.muted),
        error: color(theme_js_1.theme.error),
    };
}
function runNodesCommand(label, action) {
    return (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, action, function (err) {
        var message = String(err);
        var _a = getNodesTheme(), error = _a.error, warn = _a.warn;
        runtime_js_1.defaultRuntime.error(error("nodes ".concat(label, " failed: ").concat(message)));
        var hint = (0, rpc_js_1.unauthorizedHintForMessage)(message);
        if (hint) {
            runtime_js_1.defaultRuntime.error(warn(hint));
        }
        runtime_js_1.defaultRuntime.exit(1);
    });
}
