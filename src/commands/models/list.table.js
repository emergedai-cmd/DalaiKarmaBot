"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printModelTable = printModelTable;
var theme_js_1 = require("../../terminal/theme.js");
var list_format_js_1 = require("./list.format.js");
var shared_js_1 = require("./shared.js");
var MODEL_PAD = 42;
var INPUT_PAD = 10;
var CTX_PAD = 8;
var LOCAL_PAD = 5;
var AUTH_PAD = 5;
function printModelTable(rows, runtime, opts) {
    if (opts === void 0) { opts = {}; }
    if (opts.json) {
        runtime.log(JSON.stringify({
            count: rows.length,
            models: rows,
        }, null, 2));
        return;
    }
    if (opts.plain) {
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            runtime.log(row.key);
        }
        return;
    }
    var rich = (0, list_format_js_1.isRich)(opts);
    var header = [
        (0, list_format_js_1.pad)("Model", MODEL_PAD),
        (0, list_format_js_1.pad)("Input", INPUT_PAD),
        (0, list_format_js_1.pad)("Ctx", CTX_PAD),
        (0, list_format_js_1.pad)("Local", LOCAL_PAD),
        (0, list_format_js_1.pad)("Auth", AUTH_PAD),
        "Tags",
    ].join(" ");
    runtime.log(rich ? theme_js_1.theme.heading(header) : header);
    for (var _a = 0, rows_2 = rows; _a < rows_2.length; _a++) {
        var row = rows_2[_a];
        var keyLabel = (0, list_format_js_1.pad)((0, list_format_js_1.truncate)(row.key, MODEL_PAD), MODEL_PAD);
        var inputLabel = (0, list_format_js_1.pad)(row.input || "-", INPUT_PAD);
        var ctxLabel = (0, list_format_js_1.pad)((0, shared_js_1.formatTokenK)(row.contextWindow), CTX_PAD);
        var localText = row.local === null ? "-" : row.local ? "yes" : "no";
        var localLabel = (0, list_format_js_1.pad)(localText, LOCAL_PAD);
        var authText = row.available === null ? "-" : row.available ? "yes" : "no";
        var authLabel = (0, list_format_js_1.pad)(authText, AUTH_PAD);
        var tagsLabel = row.tags.length > 0
            ? rich
                ? row.tags.map(function (tag) { return (0, list_format_js_1.formatTag)(tag, rich); }).join(",")
                : row.tags.join(",")
            : "";
        var coloredInput = (0, theme_js_1.colorize)(rich, row.input.includes("image") ? theme_js_1.theme.accentBright : theme_js_1.theme.info, inputLabel);
        var coloredLocal = (0, theme_js_1.colorize)(rich, row.local === null ? theme_js_1.theme.muted : row.local ? theme_js_1.theme.success : theme_js_1.theme.muted, localLabel);
        var coloredAuth = (0, theme_js_1.colorize)(rich, row.available === null ? theme_js_1.theme.muted : row.available ? theme_js_1.theme.success : theme_js_1.theme.error, authLabel);
        var line = [
            rich ? theme_js_1.theme.accent(keyLabel) : keyLabel,
            coloredInput,
            ctxLabel,
            coloredLocal,
            coloredAuth,
            tagsLabel,
        ].join(" ");
        runtime.log(line);
    }
}
