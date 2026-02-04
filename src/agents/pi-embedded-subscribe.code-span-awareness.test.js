"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_subscribe_js_1 = require("./pi-embedded-subscribe.js");
(0, vitest_1.describe)("subscribeEmbeddedPiSession thinking tag code span awareness", function () {
    (0, vitest_1.it)("does not strip thinking tags inside inline code backticks", function () {
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
                delta: "The fix strips leaked `<thinking>` tags from messages.",
            },
        });
        (0, vitest_1.expect)(onPartialReply).toHaveBeenCalled();
        var lastCall = onPartialReply.mock.calls[onPartialReply.mock.calls.length - 1];
        (0, vitest_1.expect)(lastCall[0].text).toContain("`<thinking>`");
    });
    (0, vitest_1.it)("does not strip thinking tags inside fenced code blocks", function () {
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
                delta: "Example:\n  ````\n<thinking>code example</thinking>\n  ````\nDone.",
            },
        });
        (0, vitest_1.expect)(onPartialReply).toHaveBeenCalled();
        var lastCall = onPartialReply.mock.calls[onPartialReply.mock.calls.length - 1];
        (0, vitest_1.expect)(lastCall[0].text).toContain("<thinking>code example</thinking>");
    });
    (0, vitest_1.it)("still strips actual thinking tags outside code spans", function () {
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
                delta: "Hello <thinking>internal thought</thinking> world",
            },
        });
        (0, vitest_1.expect)(onPartialReply).toHaveBeenCalled();
        var lastCall = onPartialReply.mock.calls[onPartialReply.mock.calls.length - 1];
        (0, vitest_1.expect)(lastCall[0].text).not.toContain("internal thought");
        (0, vitest_1.expect)(lastCall[0].text).toContain("Hello");
        (0, vitest_1.expect)(lastCall[0].text).toContain("world");
    });
});
