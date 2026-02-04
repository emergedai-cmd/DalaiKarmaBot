"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var chat_sanitize_js_1 = require("./chat-sanitize.js");
(0, vitest_1.describe)("stripEnvelopeFromMessage", function () {
    (0, vitest_1.test)("removes message_id hint lines from user messages", function () {
        var input = {
            role: "user",
            content: "[WhatsApp 2026-01-24 13:36] yolo\n[message_id: 7b8b]",
        };
        var result = (0, chat_sanitize_js_1.stripEnvelopeFromMessage)(input);
        (0, vitest_1.expect)(result.content).toBe("yolo");
    });
    (0, vitest_1.test)("removes message_id hint lines from text content arrays", function () {
        var _a, _b;
        var input = {
            role: "user",
            content: [{ type: "text", text: "hi\n[message_id: abc123]" }],
        };
        var result = (0, chat_sanitize_js_1.stripEnvelopeFromMessage)(input);
        (0, vitest_1.expect)((_b = (_a = result.content) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text).toBe("hi");
    });
    (0, vitest_1.test)("does not strip inline message_id text that is part of a line", function () {
        var input = {
            role: "user",
            content: "I typed [message_id: 123] on purpose",
        };
        var result = (0, chat_sanitize_js_1.stripEnvelopeFromMessage)(input);
        (0, vitest_1.expect)(result.content).toBe("I typed [message_id: 123] on purpose");
    });
    (0, vitest_1.test)("does not strip assistant messages", function () {
        var input = {
            role: "assistant",
            content: "note\n[message_id: 123]",
        };
        var result = (0, chat_sanitize_js_1.stripEnvelopeFromMessage)(input);
        (0, vitest_1.expect)(result.content).toBe("note\n[message_id: 123]");
    });
});
