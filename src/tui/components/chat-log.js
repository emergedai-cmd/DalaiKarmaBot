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
exports.ChatLog = void 0;
var pi_tui_1 = require("@mariozechner/pi-tui");
var theme_js_1 = require("../theme/theme.js");
var assistant_message_js_1 = require("./assistant-message.js");
var tool_execution_js_1 = require("./tool-execution.js");
var user_message_js_1 = require("./user-message.js");
var ChatLog = /** @class */ (function (_super) {
    __extends(ChatLog, _super);
    function ChatLog() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.toolById = new Map();
        _this.streamingRuns = new Map();
        _this.toolsExpanded = false;
        return _this;
    }
    ChatLog.prototype.clearAll = function () {
        this.clear();
        this.toolById.clear();
        this.streamingRuns.clear();
    };
    ChatLog.prototype.addSystem = function (text) {
        this.addChild(new pi_tui_1.Spacer(1));
        this.addChild(new pi_tui_1.Text(theme_js_1.theme.system(text), 1, 0));
    };
    ChatLog.prototype.addUser = function (text) {
        this.addChild(new user_message_js_1.UserMessageComponent(text));
    };
    ChatLog.prototype.resolveRunId = function (runId) {
        return runId !== null && runId !== void 0 ? runId : "default";
    };
    ChatLog.prototype.startAssistant = function (text, runId) {
        var component = new assistant_message_js_1.AssistantMessageComponent(text);
        this.streamingRuns.set(this.resolveRunId(runId), component);
        this.addChild(component);
        return component;
    };
    ChatLog.prototype.updateAssistant = function (text, runId) {
        var effectiveRunId = this.resolveRunId(runId);
        var existing = this.streamingRuns.get(effectiveRunId);
        if (!existing) {
            this.startAssistant(text, runId);
            return;
        }
        existing.setText(text);
    };
    ChatLog.prototype.finalizeAssistant = function (text, runId) {
        var effectiveRunId = this.resolveRunId(runId);
        var existing = this.streamingRuns.get(effectiveRunId);
        if (existing) {
            existing.setText(text);
            this.streamingRuns.delete(effectiveRunId);
            return;
        }
        this.addChild(new assistant_message_js_1.AssistantMessageComponent(text));
    };
    ChatLog.prototype.startTool = function (toolCallId, toolName, args) {
        var existing = this.toolById.get(toolCallId);
        if (existing) {
            existing.setArgs(args);
            return existing;
        }
        var component = new tool_execution_js_1.ToolExecutionComponent(toolName, args);
        component.setExpanded(this.toolsExpanded);
        this.toolById.set(toolCallId, component);
        this.addChild(component);
        return component;
    };
    ChatLog.prototype.updateToolArgs = function (toolCallId, args) {
        var existing = this.toolById.get(toolCallId);
        if (!existing) {
            return;
        }
        existing.setArgs(args);
    };
    ChatLog.prototype.updateToolResult = function (toolCallId, result, opts) {
        var existing = this.toolById.get(toolCallId);
        if (!existing) {
            return;
        }
        if (opts === null || opts === void 0 ? void 0 : opts.partial) {
            existing.setPartialResult(result);
            return;
        }
        existing.setResult(result, {
            isError: opts === null || opts === void 0 ? void 0 : opts.isError,
        });
    };
    ChatLog.prototype.setToolsExpanded = function (expanded) {
        this.toolsExpanded = expanded;
        for (var _i = 0, _a = this.toolById.values(); _i < _a.length; _i++) {
            var tool = _a[_i];
            tool.setExpanded(expanded);
        }
    };
    return ChatLog;
}(pi_tui_1.Container));
exports.ChatLog = ChatLog;
