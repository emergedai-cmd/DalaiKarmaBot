"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var tui_stream_assembler_js_1 = require("./tui-stream-assembler.js");
(0, vitest_1.describe)("TuiStreamAssembler", function () {
    (0, vitest_1.it)("keeps thinking before content even when thinking arrives later", function () {
        var assembler = new tui_stream_assembler_js_1.TuiStreamAssembler();
        var first = assembler.ingestDelta("run-1", {
            role: "assistant",
            content: [{ type: "text", text: "Hello" }],
        }, true);
        (0, vitest_1.expect)(first).toBe("Hello");
        var second = assembler.ingestDelta("run-1", {
            role: "assistant",
            content: [{ type: "thinking", thinking: "Brain" }],
        }, true);
        (0, vitest_1.expect)(second).toBe("[thinking]\nBrain\n\nHello");
    });
    (0, vitest_1.it)("omits thinking when showThinking is false", function () {
        var assembler = new tui_stream_assembler_js_1.TuiStreamAssembler();
        var text = assembler.ingestDelta("run-2", {
            role: "assistant",
            content: [
                { type: "thinking", thinking: "Hidden" },
                { type: "text", text: "Visible" },
            ],
        }, false);
        (0, vitest_1.expect)(text).toBe("Visible");
    });
    (0, vitest_1.it)("falls back to streamed text on empty final payload", function () {
        var assembler = new tui_stream_assembler_js_1.TuiStreamAssembler();
        assembler.ingestDelta("run-3", {
            role: "assistant",
            content: [{ type: "text", text: "Streamed" }],
        }, false);
        var finalText = assembler.finalize("run-3", {
            role: "assistant",
            content: [],
        }, false);
        (0, vitest_1.expect)(finalText).toBe("Streamed");
    });
    (0, vitest_1.it)("returns null when delta text is unchanged", function () {
        var assembler = new tui_stream_assembler_js_1.TuiStreamAssembler();
        var first = assembler.ingestDelta("run-4", {
            role: "assistant",
            content: [{ type: "text", text: "Repeat" }],
        }, false);
        (0, vitest_1.expect)(first).toBe("Repeat");
        var second = assembler.ingestDelta("run-4", {
            role: "assistant",
            content: [{ type: "text", text: "Repeat" }],
        }, false);
        (0, vitest_1.expect)(second).toBeNull();
    });
});
