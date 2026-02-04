"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var tui_js_1 = require("./tui.js");
(0, vitest_1.describe)("createEditorSubmitHandler", function () {
    (0, vitest_1.it)("routes lines starting with ! to handleBangLine", function () {
        var editor = {
            setText: vitest_1.vi.fn(),
            addToHistory: vitest_1.vi.fn(),
        };
        var handleCommand = vitest_1.vi.fn();
        var sendMessage = vitest_1.vi.fn();
        var handleBangLine = vitest_1.vi.fn();
        var onSubmit = (0, tui_js_1.createEditorSubmitHandler)({
            editor: editor,
            handleCommand: handleCommand,
            sendMessage: sendMessage,
            handleBangLine: handleBangLine,
        });
        onSubmit("!ls");
        (0, vitest_1.expect)(handleBangLine).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(handleBangLine).toHaveBeenCalledWith("!ls");
        (0, vitest_1.expect)(sendMessage).not.toHaveBeenCalled();
        (0, vitest_1.expect)(handleCommand).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("treats a lone ! as a normal message", function () {
        var editor = {
            setText: vitest_1.vi.fn(),
            addToHistory: vitest_1.vi.fn(),
        };
        var handleCommand = vitest_1.vi.fn();
        var sendMessage = vitest_1.vi.fn();
        var handleBangLine = vitest_1.vi.fn();
        var onSubmit = (0, tui_js_1.createEditorSubmitHandler)({
            editor: editor,
            handleCommand: handleCommand,
            sendMessage: sendMessage,
            handleBangLine: handleBangLine,
        });
        onSubmit("!");
        (0, vitest_1.expect)(handleBangLine).not.toHaveBeenCalled();
        (0, vitest_1.expect)(sendMessage).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith("!");
    });
    (0, vitest_1.it)("does not treat leading whitespace before ! as a bang command", function () {
        var editor = {
            setText: vitest_1.vi.fn(),
            addToHistory: vitest_1.vi.fn(),
        };
        var handleCommand = vitest_1.vi.fn();
        var sendMessage = vitest_1.vi.fn();
        var handleBangLine = vitest_1.vi.fn();
        var onSubmit = (0, tui_js_1.createEditorSubmitHandler)({
            editor: editor,
            handleCommand: handleCommand,
            sendMessage: sendMessage,
            handleBangLine: handleBangLine,
        });
        onSubmit("  !ls");
        (0, vitest_1.expect)(handleBangLine).not.toHaveBeenCalled();
        (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith("!ls");
        (0, vitest_1.expect)(editor.addToHistory).toHaveBeenCalledWith("!ls");
    });
    (0, vitest_1.it)("trims normal messages before sending and adding to history", function () {
        var editor = {
            setText: vitest_1.vi.fn(),
            addToHistory: vitest_1.vi.fn(),
        };
        var handleCommand = vitest_1.vi.fn();
        var sendMessage = vitest_1.vi.fn();
        var handleBangLine = vitest_1.vi.fn();
        var onSubmit = (0, tui_js_1.createEditorSubmitHandler)({
            editor: editor,
            handleCommand: handleCommand,
            sendMessage: sendMessage,
            handleBangLine: handleBangLine,
        });
        onSubmit("  hello  ");
        (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith("hello");
        (0, vitest_1.expect)(editor.addToHistory).toHaveBeenCalledWith("hello");
    });
});
