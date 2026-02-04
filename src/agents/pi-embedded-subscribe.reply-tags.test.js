"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_subscribe_js_1 = require("./pi-embedded-subscribe.js");
(0, vitest_1.describe)("subscribeEmbeddedPiSession reply tags", function () {
    (0, vitest_1.it)("carries reply_to_current across tag-only block chunks", function () {
        var _a;
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
                minChars: 1,
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
                delta: "[[reply_to_current]]\nHello",
            },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_end" },
        });
        var assistantMessage = {
            role: "assistant",
            content: [{ type: "text", text: "[[reply_to_current]]\nHello" }],
        };
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
        var payload = (_a = onBlockReply.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
        (0, vitest_1.expect)(payload === null || payload === void 0 ? void 0 : payload.text).toBe("Hello");
        (0, vitest_1.expect)(payload === null || payload === void 0 ? void 0 : payload.replyToCurrent).toBe(true);
        (0, vitest_1.expect)(payload === null || payload === void 0 ? void 0 : payload.replyToTag).toBe(true);
    });
    (0, vitest_1.it)("flushes trailing directive tails on stream end", function () {
        var _a, _b, _c, _d;
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
                minChars: 1,
                maxChars: 50,
                breakPreference: "newline",
            },
        });
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_start", message: { role: "assistant" } });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_delta", delta: "Hello [[" },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_end" },
        });
        var assistantMessage = {
            role: "assistant",
            content: [{ type: "text", text: "Hello [[" }],
        };
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)((_b = (_a = onBlockReply.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text).toBe("Hello");
        (0, vitest_1.expect)((_d = (_c = onBlockReply.mock.calls[1]) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.text).toBe("[[");
    });
    (0, vitest_1.it)("streams partial replies past reply_to tags split across chunks", function () {
        var _a, _b, _c;
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
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_start", message: { role: "assistant" } });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_delta", delta: "[[reply_to:1897" },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_delta", delta: "]] Hello" },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_delta", delta: " world" },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_end" },
        });
        var lastPayload = (_a = onPartialReply.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
        (0, vitest_1.expect)(lastPayload === null || lastPayload === void 0 ? void 0 : lastPayload.text).toBe("Hello world");
        for (var _i = 0, _d = onPartialReply.mock.calls; _i < _d.length; _i++) {
            var call = _d[_i];
            (0, vitest_1.expect)((_c = (_b = call[0]) === null || _b === void 0 ? void 0 : _b.text) === null || _c === void 0 ? void 0 : _c.includes("[[reply_to")).toBe(false);
        }
    });
});
