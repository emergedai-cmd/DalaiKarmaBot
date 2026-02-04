"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatHelpExample = formatHelpExample;
exports.formatHelpExampleLine = formatHelpExampleLine;
exports.formatHelpExamples = formatHelpExamples;
exports.formatHelpExampleGroup = formatHelpExampleGroup;
var theme_js_1 = require("../terminal/theme.js");
function formatHelpExample(command, description) {
    return "  ".concat(theme_js_1.theme.command(command), "\n    ").concat(theme_js_1.theme.muted(description));
}
function formatHelpExampleLine(command, description) {
    if (!description) {
        return "  ".concat(theme_js_1.theme.command(command));
    }
    return "  ".concat(theme_js_1.theme.command(command), " ").concat(theme_js_1.theme.muted("# ".concat(description)));
}
function formatHelpExamples(examples, inline) {
    if (inline === void 0) { inline = false; }
    var formatter = inline ? formatHelpExampleLine : formatHelpExample;
    return examples.map(function (_a) {
        var command = _a[0], description = _a[1];
        return formatter(command, description);
    }).join("\n");
}
function formatHelpExampleGroup(label, examples, inline) {
    if (inline === void 0) { inline = false; }
    return "".concat(theme_js_1.theme.muted(label), "\n").concat(formatHelpExamples(examples, inline));
}
