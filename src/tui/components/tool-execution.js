"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolExecutionComponent = void 0;
var pi_tui_1 = require("@mariozechner/pi-tui");
var tool_display_js_1 = require("../../agents/tool-display.js");
var theme_js_1 = require("../theme/theme.js");
var PREVIEW_LINES = 12;
function formatArgs(toolName, args) {
    var display = (0, tool_display_js_1.resolveToolDisplay)({ name: toolName, args: args });
    var detail = (0, tool_display_js_1.formatToolDetail)(display);
    if (detail) {
        return detail;
    }
    if (!args || typeof args !== "object") {
        return "";
    }
    try {
        return JSON.stringify(args);
    }
    catch (_a) {
        return "";
    }
}
function extractText(result) {
    var _a;
    if (!(result === null || result === void 0 ? void 0 : result.content)) {
        return "";
    }
    var lines = [];
    for (var _i = 0, _b = result.content; _i < _b.length; _i++) {
        var entry = _b[_i];
        if (entry.type === "text" && entry.text) {
            lines.push(entry.text);
        }
        else if (entry.type === "image") {
            var mime = (_a = entry.mimeType) !== null && _a !== void 0 ? _a : "image";
            var size = entry.bytes ? " ".concat(Math.round(entry.bytes / 1024), "kb") : "";
            var omitted = entry.omitted ? " (omitted)" : "";
            lines.push("[".concat(mime).concat(size).concat(omitted, "]"));
        }
    }
    return lines.join("\n").trim();
}
var ToolExecutionComponent = /** @class */ (function (_super) {
    __extends(ToolExecutionComponent, _super);
    function ToolExecutionComponent(toolName, args) {
        var _this = _super.call(this) || this;
        _this.expanded = false;
        _this.isError = false;
        _this.isPartial = true;
        _this.toolName = toolName;
        _this.args = args;
        _this.box = new pi_tui_1.Box(1, 1, function (line) { return theme_js_1.theme.toolPendingBg(line); });
        _this.header = new pi_tui_1.Text("", 0, 0);
        _this.argsLine = new pi_tui_1.Text("", 0, 0);
        _this.output = new pi_tui_1.Markdown("", 0, 0, theme_js_1.markdownTheme, {
            color: function (line) { return theme_js_1.theme.toolOutput(line); },
        });
        _this.addChild(new pi_tui_1.Spacer(1));
        _this.addChild(_this.box);
        _this.box.addChild(_this.header);
        _this.box.addChild(_this.argsLine);
        _this.box.addChild(_this.output);
        _this.refresh();
        return _this;
    }
    ToolExecutionComponent.prototype.setArgs = function (args) {
        this.args = args;
        this.refresh();
    };
    ToolExecutionComponent.prototype.setExpanded = function (expanded) {
        this.expanded = expanded;
        this.refresh();
    };
    ToolExecutionComponent.prototype.setResult = function (result, opts) {
        this.result = result;
        this.isPartial = false;
        this.isError = Boolean(opts === null || opts === void 0 ? void 0 : opts.isError);
        this.refresh();
    };
    ToolExecutionComponent.prototype.setPartialResult = function (result) {
        this.result = result;
        this.isPartial = true;
        this.refresh();
    };
    ToolExecutionComponent.prototype.refresh = function () {
        var bg = this.isPartial
            ? theme_js_1.theme.toolPendingBg
            : this.isError
                ? theme_js_1.theme.toolErrorBg
                : theme_js_1.theme.toolSuccessBg;
        this.box.setBgFn(function (line) { return bg(line); });
        var display = (0, tool_display_js_1.resolveToolDisplay)({
            name: this.toolName,
            args: this.args,
        });
        var title = "".concat(display.emoji, " ").concat(display.label).concat(this.isPartial ? " (running)" : "");
        this.header.setText(theme_js_1.theme.toolTitle(theme_js_1.theme.bold(title)));
        var argLine = formatArgs(this.toolName, this.args);
        this.argsLine.setText(argLine ? theme_js_1.theme.dim(argLine) : theme_js_1.theme.dim(" "));
        var raw = extractText(this.result);
        var text = raw || (this.isPartial ? "…" : "");
        if (!this.expanded && text) {
            var lines = text.split("\n");
            var preview = lines.length > PREVIEW_LINES ? "".concat(lines.slice(0, PREVIEW_LINES).join("\n"), "\n\u2026") : text;
            this.output.setText(preview);
        }
        else {
            this.output.setText(text);
        }
    };
    return ToolExecutionComponent;
}(pi_tui_1.Container));
exports.ToolExecutionComponent = ToolExecutionComponent;
