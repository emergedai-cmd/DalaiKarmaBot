"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_subscribe_js_1 = require("./pi-embedded-subscribe.js");
(0, vitest_1.describe)("subscribeEmbeddedPiSession", function () {
    var THINKING_TAG_CASES = [
        { tag: "think", open: "<think>", close: "</think>" },
        { tag: "thinking", open: "<thinking>", close: "</thinking>" },
        { tag: "thought", open: "<thought>", close: "</thought>" },
        { tag: "antthinking", open: "<antthinking>", close: "</antthinking>" },
    ];
    vitest_1.it.each(THINKING_TAG_CASES)("streams <%s> reasoning via onReasoningStream without leaking into final text", function (_a) {
        var open = _a.open, close = _a.close;
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var onReasoningStream = vitest_1.vi.fn();
        var onBlockReply = vitest_1.vi.fn();
        (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run",
            onReasoningStream: onReasoningStream,
            onBlockReply: onBlockReply,
            blockReplyBreak: "message_end",
            reasoningMode: "stream",
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: "".concat(open, "\nBecause"),
            },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: " it helps\n".concat(close, "\n\nFinal answer"),
            },
        });
        var assistantMessage = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "".concat(open, "\nBecause it helps\n").concat(close, "\n\nFinal answer"),
                },
            ],
        };
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(onBlockReply.mock.calls[0][0].text).toBe("Final answer");
        var streamTexts = onReasoningStream.mock.calls
            .map(function (call) { var _a; return (_a = call[0]) === null || _a === void 0 ? void 0 : _a.text; })
            .filter(function (value) { return typeof value === "string"; });
        (0, vitest_1.expect)(streamTexts.at(-1)).toBe("Reasoning:\n_Because it helps_");
        (0, vitest_1.expect)(assistantMessage.content).toEqual([
            { type: "thinking", thinking: "Because it helps" },
            { type: "text", text: "Final answer" },
        ]);
    });
    vitest_1.it.each(THINKING_TAG_CASES)("suppresses <%s> blocks across chunk boundaries", function (_a) {
        var open = _a.open, close = _a.close;
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
                maxChars: 50,
                breakPreference: "newline",
            },
        });
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_start", message: { role: "assistant" } });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: "".concat(open, "Reasoning chunk that should not leak"),
            },
        });
        (0, vitest_1.expect)(onBlockReply).not.toHaveBeenCalled();
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: "".concat(close, "\n\nFinal answer"),
            },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_end" },
        });
        var payloadTexts = onBlockReply.mock.calls
            .map(function (call) { var _a; return (_a = call[0]) === null || _a === void 0 ? void 0 : _a.text; })
            .filter(function (value) { return typeof value === "string"; });
        (0, vitest_1.expect)(payloadTexts.length).toBeGreaterThan(0);
        for (var _i = 0, payloadTexts_1 = payloadTexts; _i < payloadTexts_1.length; _i++) {
            var text = payloadTexts_1[_i];
            (0, vitest_1.expect)(text).not.toContain("Reasoning");
            (0, vitest_1.expect)(text).not.toContain(open);
        }
        var combined = payloadTexts.join(" ").replace(/\s+/g, " ").trim();
        (0, vitest_1.expect)(combined).toBe("Final answer");
    });
    (0, vitest_1.it)("emits delta chunks in agent events for streaming assistant text", function () {
        var _a, _b, _c, _d;
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var onAgentEvent = vitest_1.vi.fn();
        (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run",
            onAgentEvent: onAgentEvent,
        });
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_start", message: { role: "assistant" } });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_delta", delta: "Hello" },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_delta", delta: " world" },
        });
        var payloads = onAgentEvent.mock.calls
            .map(function (call) { var _a; return (_a = call[0]) === null || _a === void 0 ? void 0 : _a.data; })
            .filter(function (value) { return Boolean(value); });
        (0, vitest_1.expect)((_a = payloads[0]) === null || _a === void 0 ? void 0 : _a.text).toBe("Hello");
        (0, vitest_1.expect)((_b = payloads[0]) === null || _b === void 0 ? void 0 : _b.delta).toBe("Hello");
        (0, vitest_1.expect)((_c = payloads[1]) === null || _c === void 0 ? void 0 : _c.text).toBe("Hello world");
        (0, vitest_1.expect)((_d = payloads[1]) === null || _d === void 0 ? void 0 : _d.delta).toBe(" world");
    });
    (0, vitest_1.it)("skips agent events when cleaned text rewinds mid-stream", function () {
        var _a;
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var onAgentEvent = vitest_1.vi.fn();
        (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run",
            onAgentEvent: onAgentEvent,
        });
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_start", message: { role: "assistant" } });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_delta", delta: "MEDIA:" },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_delta", delta: " https://example.com/a.png\nCaption" },
        });
        var payloads = onAgentEvent.mock.calls
            .map(function (call) { var _a; return (_a = call[0]) === null || _a === void 0 ? void 0 : _a.data; })
            .filter(function (value) { return Boolean(value); });
        (0, vitest_1.expect)(payloads).toHaveLength(1);
        (0, vitest_1.expect)((_a = payloads[0]) === null || _a === void 0 ? void 0 : _a.text).toBe("MEDIA:");
    });
    (0, vitest_1.it)("emits agent events when media arrives without text", function () {
        var _a, _b;
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var onAgentEvent = vitest_1.vi.fn();
        (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run",
            onAgentEvent: onAgentEvent,
        });
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_start", message: { role: "assistant" } });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_delta", delta: "MEDIA: https://example.com/a.png" },
        });
        var payloads = onAgentEvent.mock.calls
            .map(function (call) { var _a; return (_a = call[0]) === null || _a === void 0 ? void 0 : _a.data; })
            .filter(function (value) { return Boolean(value); });
        (0, vitest_1.expect)(payloads).toHaveLength(1);
        (0, vitest_1.expect)((_a = payloads[0]) === null || _a === void 0 ? void 0 : _a.text).toBe("");
        (0, vitest_1.expect)((_b = payloads[0]) === null || _b === void 0 ? void 0 : _b.mediaUrls).toEqual(["https://example.com/a.png"]);
    });
});
