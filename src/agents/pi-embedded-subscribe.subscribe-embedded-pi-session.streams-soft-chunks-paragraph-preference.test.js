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
    (0, vitest_1.it)("streams soft chunks with paragraph preference", function () {
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
            blockReplyBreak: "message_end",
            blockReplyChunking: {
                minChars: 5,
                maxChars: 25,
                breakPreference: "paragraph",
            },
        });
        var text = "First block line\n\nSecond block line";
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
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(onBlockReply.mock.calls[0][0].text).toBe("First block line");
        (0, vitest_1.expect)(onBlockReply.mock.calls[1][0].text).toBe("Second block line");
        (0, vitest_1.expect)(subscription.assistantTexts).toEqual(["First block line", "Second block line"]);
    });
    (0, vitest_1.it)("avoids splitting inside fenced code blocks", function () {
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
        var text = "Intro\n\n```bash\nline1\nline2\n```\n\nOutro";
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
        (0, vitest_1.expect)(onBlockReply.mock.calls[0][0].text).toBe("Intro");
        (0, vitest_1.expect)(onBlockReply.mock.calls[1][0].text).toBe("```bash\nline1\nline2\n```");
        (0, vitest_1.expect)(onBlockReply.mock.calls[2][0].text).toBe("Outro");
    });
});
