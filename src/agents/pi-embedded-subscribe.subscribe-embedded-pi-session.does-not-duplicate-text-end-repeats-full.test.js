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
    (0, vitest_1.it)("does not duplicate when text_end repeats full content", function () {
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
                delta: "Good morning!",
            },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_end",
                content: "Good morning!",
            },
        });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(subscription.assistantTexts).toEqual(["Good morning!"]);
    });
    (0, vitest_1.it)("does not duplicate block chunks when text_end repeats full content", function () {
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
            blockReplyBreak: "text_end",
            blockReplyChunking: {
                minChars: 5,
                maxChars: 40,
                breakPreference: "newline",
            },
        });
        var fullText = "First line\nSecond line\nThird line\n";
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: fullText,
            },
        });
        var callsAfterDelta = onBlockReply.mock.calls.length;
        (0, vitest_1.expect)(callsAfterDelta).toBeGreaterThan(0);
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_end",
                content: fullText,
            },
        });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(callsAfterDelta);
    });
});
