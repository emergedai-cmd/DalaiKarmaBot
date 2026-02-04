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
    (0, vitest_1.it)("keeps assistantTexts to the final answer when block replies are disabled", function () {
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
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_start", message: { role: "assistant" } });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: "Final ",
            },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: "answer",
            },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_end",
            },
        });
        var assistantMessage = {
            role: "assistant",
            content: [
                { type: "thinking", thinking: "Because it helps" },
                { type: "text", text: "Final answer" },
            ],
        };
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        (0, vitest_1.expect)(subscription.assistantTexts).toEqual(["Final answer"]);
    });
    (0, vitest_1.it)("suppresses partial replies when reasoning is enabled and block replies are disabled", function () {
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var onPartialReply = vitest_1.vi.fn();
        var subscription = (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run",
            reasoningMode: "on",
            onPartialReply: onPartialReply,
        });
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_start", message: { role: "assistant" } });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: "Draft ",
            },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: "reply",
            },
        });
        (0, vitest_1.expect)(onPartialReply).not.toHaveBeenCalled();
        var assistantMessage = {
            role: "assistant",
            content: [
                { type: "thinking", thinking: "Because it helps" },
                { type: "text", text: "Final answer" },
            ],
        };
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_end",
                content: "Draft reply",
            },
        });
        (0, vitest_1.expect)(onPartialReply).not.toHaveBeenCalled();
        (0, vitest_1.expect)(subscription.assistantTexts).toEqual(["Final answer"]);
    });
});
