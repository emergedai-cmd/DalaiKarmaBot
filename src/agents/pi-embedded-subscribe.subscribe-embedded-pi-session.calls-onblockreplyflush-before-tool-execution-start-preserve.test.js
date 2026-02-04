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
    (0, vitest_1.it)("calls onBlockReplyFlush before tool_execution_start to preserve message boundaries", function () {
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var onBlockReplyFlush = vitest_1.vi.fn();
        var onBlockReply = vitest_1.vi.fn();
        (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run-flush-test",
            onBlockReply: onBlockReply,
            onBlockReplyFlush: onBlockReplyFlush,
            blockReplyBreak: "text_end",
        });
        // Simulate text arriving before tool
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_start",
            message: { role: "assistant" },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: "First message before tool.",
            },
        });
        (0, vitest_1.expect)(onBlockReplyFlush).not.toHaveBeenCalled();
        // Tool execution starts - should trigger flush
        handler === null || handler === void 0 ? void 0 : handler({
            type: "tool_execution_start",
            toolName: "bash",
            toolCallId: "tool-flush-1",
            args: { command: "echo hello" },
        });
        (0, vitest_1.expect)(onBlockReplyFlush).toHaveBeenCalledTimes(1);
        // Another tool - should flush again
        handler === null || handler === void 0 ? void 0 : handler({
            type: "tool_execution_start",
            toolName: "read",
            toolCallId: "tool-flush-2",
            args: { path: "/tmp/test.txt" },
        });
        (0, vitest_1.expect)(onBlockReplyFlush).toHaveBeenCalledTimes(2);
    });
    (0, vitest_1.it)("flushes buffered block chunks before tool execution", function () {
        var _a, _b;
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var onBlockReply = vitest_1.vi.fn();
        var onBlockReplyFlush = vitest_1.vi.fn();
        (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run-flush-buffer",
            onBlockReply: onBlockReply,
            onBlockReplyFlush: onBlockReplyFlush,
            blockReplyBreak: "text_end",
            blockReplyChunking: { minChars: 50, maxChars: 200 },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_start",
            message: { role: "assistant" },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: "Short chunk.",
            },
        });
        (0, vitest_1.expect)(onBlockReply).not.toHaveBeenCalled();
        handler === null || handler === void 0 ? void 0 : handler({
            type: "tool_execution_start",
            toolName: "bash",
            toolCallId: "tool-flush-buffer-1",
            args: { command: "echo flush" },
        });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)((_b = (_a = onBlockReply.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text).toBe("Short chunk.");
        (0, vitest_1.expect)(onBlockReplyFlush).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(onBlockReply.mock.invocationCallOrder[0]).toBeLessThan(onBlockReplyFlush.mock.invocationCallOrder[0]);
    });
});
