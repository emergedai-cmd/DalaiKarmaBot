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
    (0, vitest_1.it)("reopens fenced blocks when splitting inside them", function () {
        var _a, _b;
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
            blockReplyChunking: {
                minChars: 10,
                maxChars: 30,
                breakPreference: "paragraph",
            },
        });
        var text = "```txt\n".concat("a".repeat(80), "\n```");
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: text,
            },
        });
        var assistantMessage = {
            role: "assistant",
            content: [{ type: "text", text: text }],
        };
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        (0, vitest_1.expect)(onBlockReply.mock.calls.length).toBeGreaterThan(1);
        for (var _i = 0, _c = onBlockReply.mock.calls; _i < _c.length; _i++) {
            var call = _c[_i];
            var chunk = call[0].text;
            (0, vitest_1.expect)(chunk.startsWith("```txt")).toBe(true);
            var fenceCount = (_b = (_a = chunk.match(/```/g)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
            (0, vitest_1.expect)(fenceCount).toBeGreaterThanOrEqual(2);
        }
    });
    (0, vitest_1.it)("avoids splitting inside tilde fences", function () {
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
            blockReplyChunking: {
                minChars: 5,
                maxChars: 25,
                breakPreference: "paragraph",
            },
        });
        var text = "Intro\n\n~~~sh\nline1\nline2\n~~~\n\nOutro";
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: text,
            },
        });
        var assistantMessage = {
            role: "assistant",
            content: [{ type: "text", text: text }],
        };
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(3);
        (0, vitest_1.expect)(onBlockReply.mock.calls[1][0].text).toBe("~~~sh\nline1\nline2\n~~~");
    });
});
