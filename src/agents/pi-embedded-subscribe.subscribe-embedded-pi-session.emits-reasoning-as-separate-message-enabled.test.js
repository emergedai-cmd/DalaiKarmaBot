"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_subscribe_js_1 = require("./pi-embedded-subscribe.js");
(0, vitest_1.describe)("subscribeEmbeddedPiSession", function () {
    var THINKING_TAG_CASES = [
        { tag: "think", open: "<think>", close: "</think>" },
        { tag: "thinking", open: "<thinking>", close: "</thinking>" },
        { tag: "thought", open: "<thought>", close: "</thought>" },
        { tag: "antthinking", open: "<antthinking>", close: "</antthinking>" },
    ];
    (0, vitest_1.it)("emits reasoning as a separate message when enabled", function () {
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var onBlockReply = vitest_1.vi.fn();
        (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run",
            onBlockReply: onBlockReply,
            blockReplyBreak: "message_end",
            reasoningMode: "on",
        });
        var assistantMessage = {
            role: "assistant",
            content: [
                { type: "thinking", thinking: "Because it helps" },
                { type: "text", text: "Final answer" },
            ],
        };
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(onBlockReply.mock.calls[0][0].text).toBe("Reasoning:\n_Because it helps_");
        (0, vitest_1.expect)(onBlockReply.mock.calls[1][0].text).toBe("Final answer");
    });
    vitest_1.it.each(THINKING_TAG_CASES)("promotes <%s> tags to thinking blocks at write-time", function (_a) {
        var open = _a.open, close = _a.close;
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var onBlockReply = vitest_1.vi.fn();
        (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run",
            onBlockReply: onBlockReply,
            blockReplyBreak: "message_end",
            reasoningMode: "on",
        });
        var assistantMessage = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "".concat(open, "\nBecause it helps\n").concat(close, "\n\nFinal answer"),
                },
            ],
        };
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(onBlockReply.mock.calls[0][0].text).toBe("Reasoning:\n_Because it helps_");
        (0, vitest_1.expect)(onBlockReply.mock.calls[1][0].text).toBe("Final answer");
        (0, vitest_1.expect)(assistantMessage.content).toEqual([
            { type: "thinking", thinking: "Because it helps" },
            { type: "text", text: "Final answer" },
        ]);
    });
});
