"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_subscribe_js_1 = require("./pi-embedded-subscribe.js");
(0, vitest_1.describe)("subscribeEmbeddedPiSession", function () {
    var _THINKING_TAG_CASES = [
        { tag: "think", open: "<think>", close: "</think>" },
        { tag: "thinking", open: "<thinking>", close: "</thinking>" },
        { tag: "thought", open: "<thought>", close: "</thought>" },
        { tag: "antthinking", open: "<antthinking>", close: "</antthinking>" },
    ];
    (0, vitest_1.it)("does not call onBlockReplyFlush when callback is not provided", function () {
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var onBlockReply = vitest_1.vi.fn();
        // No onBlockReplyFlush provided
        (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run-no-flush",
            onBlockReply: onBlockReply,
            blockReplyBreak: "text_end",
        });
        // This should not throw even without onBlockReplyFlush
        (0, vitest_1.expect)(function () {
            handler === null || handler === void 0 ? void 0 : handler({
                type: "tool_execution_start",
                toolName: "bash",
                toolCallId: "tool-no-flush",
                args: { command: "echo test" },
            });
        }).not.toThrow();
    });
});
