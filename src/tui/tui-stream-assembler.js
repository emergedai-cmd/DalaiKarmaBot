"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuiStreamAssembler = void 0;
var tui_formatters_js_1 = require("./tui-formatters.js");
var TuiStreamAssembler = /** @class */ (function () {
    function TuiStreamAssembler() {
        this.runs = new Map();
    }
    TuiStreamAssembler.prototype.getOrCreateRun = function (runId) {
        var state = this.runs.get(runId);
        if (!state) {
            state = {
                thinkingText: "",
                contentText: "",
                displayText: "",
            };
            this.runs.set(runId, state);
        }
        return state;
    };
    TuiStreamAssembler.prototype.updateRunState = function (state, message, showThinking) {
        var thinkingText = (0, tui_formatters_js_1.extractThinkingFromMessage)(message);
        var contentText = (0, tui_formatters_js_1.extractContentFromMessage)(message);
        if (thinkingText) {
            state.thinkingText = thinkingText;
        }
        if (contentText) {
            state.contentText = contentText;
        }
        var displayText = (0, tui_formatters_js_1.composeThinkingAndContent)({
            thinkingText: state.thinkingText,
            contentText: state.contentText,
            showThinking: showThinking,
        });
        state.displayText = displayText;
    };
    TuiStreamAssembler.prototype.ingestDelta = function (runId, message, showThinking) {
        var state = this.getOrCreateRun(runId);
        var previousDisplayText = state.displayText;
        this.updateRunState(state, message, showThinking);
        if (!state.displayText || state.displayText === previousDisplayText) {
            return null;
        }
        return state.displayText;
    };
    TuiStreamAssembler.prototype.finalize = function (runId, message, showThinking) {
        var state = this.getOrCreateRun(runId);
        this.updateRunState(state, message, showThinking);
        var finalComposed = state.displayText;
        var finalText = (0, tui_formatters_js_1.resolveFinalAssistantText)({
            finalText: finalComposed,
            streamedText: state.displayText,
        });
        this.runs.delete(runId);
        return finalText;
    };
    TuiStreamAssembler.prototype.drop = function (runId) {
        this.runs.delete(runId);
    };
    return TuiStreamAssembler;
}());
exports.TuiStreamAssembler = TuiStreamAssembler;
