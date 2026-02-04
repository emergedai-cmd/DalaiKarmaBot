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
    (0, vitest_1.it)("keeps indented fenced blocks intact", function () {
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
                maxChars: 30,
                breakPreference: "paragraph",
            },
        });
        var text = "Intro\n\n  ```js\n  const x = 1;\n  ```\n\nOutro";
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
        (0, vitest_1.expect)(onBlockReply.mock.calls[1][0].text).toBe("  ```js\n  const x = 1;\n  ```");
    });
    (0, vitest_1.it)("accepts longer fence markers for close", function () {
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
        var text = "Intro\n\n````md\nline1\nline2\n````\n\nOutro";
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
        var payloadTexts = onBlockReply.mock.calls
            .map(function (call) { var _a; return (_a = call[0]) === null || _a === void 0 ? void 0 : _a.text; })
            .filter(function (value) { return typeof value === "string"; });
        (0, vitest_1.expect)(payloadTexts.length).toBeGreaterThan(0);
        var combined = payloadTexts.join(" ").replace(/\s+/g, " ").trim();
        (0, vitest_1.expect)(combined).toContain("````md");
        (0, vitest_1.expect)(combined).toContain("line1");
        (0, vitest_1.expect)(combined).toContain("line2");
        (0, vitest_1.expect)(combined).toContain("````");
        (0, vitest_1.expect)(combined).toContain("Intro");
        (0, vitest_1.expect)(combined).toContain("Outro");
    });
});
