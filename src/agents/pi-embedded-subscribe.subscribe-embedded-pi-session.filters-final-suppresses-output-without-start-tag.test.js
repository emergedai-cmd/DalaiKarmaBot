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
    (0, vitest_1.it)("filters to <final> and suppresses output without a start tag", function () {
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var onPartialReply = vitest_1.vi.fn();
        var onAgentEvent = vitest_1.vi.fn();
        (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run",
            enforceFinalTag: true,
            onPartialReply: onPartialReply,
            onAgentEvent: onAgentEvent,
        });
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_start", message: { role: "assistant" } });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: "<final>Hi there</final>",
            },
        });
        (0, vitest_1.expect)(onPartialReply).toHaveBeenCalled();
        var firstPayload = onPartialReply.mock.calls[0][0];
        (0, vitest_1.expect)(firstPayload.text).toBe("Hi there");
        onPartialReply.mockReset();
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_start", message: { role: "assistant" } });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: "</final>Oops no start",
            },
        });
        (0, vitest_1.expect)(onPartialReply).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("does not require <final> when enforcement is off", function () {
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var onPartialReply = vitest_1.vi.fn();
        (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run",
            onPartialReply: onPartialReply,
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: "Hello world",
            },
        });
        var payload = onPartialReply.mock.calls[0][0];
        (0, vitest_1.expect)(payload.text).toBe("Hello world");
    });
    (0, vitest_1.it)("emits block replies on message_end", function () {
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
        });
        var assistantMessage = {
            role: "assistant",
            content: [{ type: "text", text: "Hello block" }],
        };
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalled();
        var payload = onBlockReply.mock.calls[0][0];
        (0, vitest_1.expect)(payload.text).toBe("Hello block");
    });
});
