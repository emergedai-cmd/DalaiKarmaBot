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
    (0, vitest_1.it)("does not append when text_end content is a prefix of deltas", function () {
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
                delta: "Hello world",
            },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_end",
                content: "Hello",
            },
        });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(subscription.assistantTexts).toEqual(["Hello world"]);
    });
    (0, vitest_1.it)("does not append when text_end content is already contained", function () {
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
                delta: "Hello world",
            },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_end",
                content: "world",
            },
        });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(subscription.assistantTexts).toEqual(["Hello world"]);
    });
    (0, vitest_1.it)("appends suffix when text_end content extends deltas", function () {
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
                delta: "Hello",
            },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_end",
                content: "Hello world",
            },
        });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(subscription.assistantTexts).toEqual(["Hello world"]);
    });
});
