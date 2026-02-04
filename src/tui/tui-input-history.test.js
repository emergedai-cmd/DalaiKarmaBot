"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var tui_js_1 = require("./tui.js");
(0, vitest_1.describe)("createEditorSubmitHandler", function () {
    (0, vitest_1.it)("adds submitted messages to editor history", function () {
        var editor = {
            setText: vitest_1.vi.fn(),
            addToHistory: vitest_1.vi.fn(),
        };
        var handler = (0, tui_js_1.createEditorSubmitHandler)({
            editor: editor,
            handleCommand: vitest_1.vi.fn(),
            sendMessage: vitest_1.vi.fn(),
            handleBangLine: vitest_1.vi.fn(),
        });
        handler("hello world");
        (0, vitest_1.expect)(editor.setText).toHaveBeenCalledWith("");
        (0, vitest_1.expect)(editor.addToHistory).toHaveBeenCalledWith("hello world");
    });
    (0, vitest_1.it)("trims input before adding to history", function () {
        var editor = {
            setText: vitest_1.vi.fn(),
            addToHistory: vitest_1.vi.fn(),
        };
        var handler = (0, tui_js_1.createEditorSubmitHandler)({
            editor: editor,
            handleCommand: vitest_1.vi.fn(),
            sendMessage: vitest_1.vi.fn(),
            handleBangLine: vitest_1.vi.fn(),
        });
        handler("   hi   ");
        (0, vitest_1.expect)(editor.addToHistory).toHaveBeenCalledWith("hi");
    });
    (0, vitest_1.it)("does not add empty-string submissions to history", function () {
        var editor = {
            setText: vitest_1.vi.fn(),
            addToHistory: vitest_1.vi.fn(),
        };
        var handler = (0, tui_js_1.createEditorSubmitHandler)({
            editor: editor,
            handleCommand: vitest_1.vi.fn(),
            sendMessage: vitest_1.vi.fn(),
            handleBangLine: vitest_1.vi.fn(),
        });
        handler("");
        (0, vitest_1.expect)(editor.addToHistory).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("does not add whitespace-only submissions to history", function () {
        var editor = {
            setText: vitest_1.vi.fn(),
            addToHistory: vitest_1.vi.fn(),
        };
        var handler = (0, tui_js_1.createEditorSubmitHandler)({
            editor: editor,
            handleCommand: vitest_1.vi.fn(),
            sendMessage: vitest_1.vi.fn(),
            handleBangLine: vitest_1.vi.fn(),
        });
        handler("   ");
        (0, vitest_1.expect)(editor.addToHistory).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("routes slash commands to handleCommand", function () {
        var editor = {
            setText: vitest_1.vi.fn(),
            addToHistory: vitest_1.vi.fn(),
        };
        var handleCommand = vitest_1.vi.fn();
        var sendMessage = vitest_1.vi.fn();
        var handler = (0, tui_js_1.createEditorSubmitHandler)({
            editor: editor,
            handleCommand: handleCommand,
            sendMessage: sendMessage,
            handleBangLine: vitest_1.vi.fn(),
        });
        handler("/models");
        (0, vitest_1.expect)(editor.addToHistory).toHaveBeenCalledWith("/models");
        (0, vitest_1.expect)(handleCommand).toHaveBeenCalledWith("/models");
        (0, vitest_1.expect)(sendMessage).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("routes normal messages to sendMessage", function () {
        var editor = {
            setText: vitest_1.vi.fn(),
            addToHistory: vitest_1.vi.fn(),
        };
        var handleCommand = vitest_1.vi.fn();
        var sendMessage = vitest_1.vi.fn();
        var handler = (0, tui_js_1.createEditorSubmitHandler)({
            editor: editor,
            handleCommand: handleCommand,
            sendMessage: sendMessage,
            handleBangLine: vitest_1.vi.fn(),
        });
        handler("hello");
        (0, vitest_1.expect)(editor.addToHistory).toHaveBeenCalledWith("hello");
        (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith("hello");
        (0, vitest_1.expect)(handleCommand).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("routes bang-prefixed lines to handleBangLine", function () {
        var editor = {
            setText: vitest_1.vi.fn(),
            addToHistory: vitest_1.vi.fn(),
        };
        var handleBangLine = vitest_1.vi.fn();
        var handler = (0, tui_js_1.createEditorSubmitHandler)({
            editor: editor,
            handleCommand: vitest_1.vi.fn(),
            sendMessage: vitest_1.vi.fn(),
            handleBangLine: handleBangLine,
        });
        handler("!ls");
        (0, vitest_1.expect)(handleBangLine).toHaveBeenCalledWith("!ls");
    });
    (0, vitest_1.it)("treats a lone ! as a normal message", function () {
        var editor = {
            setText: vitest_1.vi.fn(),
            addToHistory: vitest_1.vi.fn(),
        };
        var sendMessage = vitest_1.vi.fn();
        var handler = (0, tui_js_1.createEditorSubmitHandler)({
            editor: editor,
            handleCommand: vitest_1.vi.fn(),
            sendMessage: sendMessage,
            handleBangLine: vitest_1.vi.fn(),
        });
        handler("!");
        (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith("!");
    });
});
