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
    (0, vitest_1.it)("emits block replies on text_end and does not duplicate on message_end", function () {
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var onBlockReply = vitest_1.vi.fn();
        var subscription = (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run",
            onBlockReply: onBlockReply,
            blockReplyBreak: "text_end",
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: "Hello block",
            },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_end",
            },
        });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
        var payload = onBlockReply.mock.calls[0][0];
        (0, vitest_1.expect)(payload.text).toBe("Hello block");
        (0, vitest_1.expect)(subscription.assistantTexts).toEqual(["Hello block"]);
        var assistantMessage = {
            role: "assistant",
            content: [{ type: "text", text: "Hello block" }],
        };
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(subscription.assistantTexts).toEqual(["Hello block"]);
    });
    (0, vitest_1.it)("does not duplicate when message_end flushes and a late text_end arrives", function () {
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var onBlockReply = vitest_1.vi.fn();
        var subscription = (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run",
            onBlockReply: onBlockReply,
            blockReplyBreak: "text_end",
        });
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_start", message: { role: "assistant" } });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: "Hello block",
            },
        });
        var assistantMessage = {
            role: "assistant",
            content: [{ type: "text", text: "Hello block" }],
        };
        // Simulate a provider that ends the message without emitting text_end.
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(subscription.assistantTexts).toEqual(["Hello block"]);
        // Some providers can still emit a late text_end; this must not re-emit.
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_end",
                content: "Hello block",
            },
        });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(subscription.assistantTexts).toEqual(["Hello block"]);
    });
});
