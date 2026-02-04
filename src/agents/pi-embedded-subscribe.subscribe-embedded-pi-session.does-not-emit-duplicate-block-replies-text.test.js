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
    (0, vitest_1.it)("does not emit duplicate block replies when text_end repeats", function () {
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
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_end",
            },
        });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(subscription.assistantTexts).toEqual(["Hello block"]);
    });
    (0, vitest_1.it)("does not duplicate assistantTexts when message_end repeats", function () {
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var subscription = (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run",
        });
        var assistantMessage = {
            role: "assistant",
            content: [{ type: "text", text: "Hello world" }],
        };
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        (0, vitest_1.expect)(subscription.assistantTexts).toEqual(["Hello world"]);
    });
    (0, vitest_1.it)("does not duplicate assistantTexts when message_end repeats with trailing whitespace changes", function () {
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var subscription = (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run",
        });
        var assistantMessageWithNewline = {
            role: "assistant",
            content: [{ type: "text", text: "Hello world\n" }],
        };
        var assistantMessageTrimmed = {
            role: "assistant",
            content: [{ type: "text", text: "Hello world" }],
        };
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessageWithNewline });
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessageTrimmed });
        (0, vitest_1.expect)(subscription.assistantTexts).toEqual(["Hello world"]);
    });
    (0, vitest_1.it)("does not duplicate assistantTexts when message_end repeats with reasoning blocks", function () {
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var subscription = (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run",
            reasoningMode: "on",
        });
        var assistantMessage = {
            role: "assistant",
            content: [
                { type: "thinking", thinking: "Because" },
                { type: "text", text: "Hello world" },
            ],
        };
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        (0, vitest_1.expect)(subscription.assistantTexts).toEqual(["Hello world"]);
    });
    (0, vitest_1.it)("populates assistantTexts for non-streaming models with chunking enabled", function () {
        // Non-streaming models (e.g. zai/glm-4.7): no text_delta events; message_end
        // must still populate assistantTexts so providers can deliver a final reply.
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var subscription = (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run",
            blockReplyChunking: { minChars: 50, maxChars: 200 }, // Chunking enabled
        });
        // Simulate non-streaming model: only message_start and message_end, no text_delta
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_start", message: { role: "assistant" } });
        var assistantMessage = {
            role: "assistant",
            content: [{ type: "text", text: "Response from non-streaming model" }],
        };
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        (0, vitest_1.expect)(subscription.assistantTexts).toEqual(["Response from non-streaming model"]);
    });
});
