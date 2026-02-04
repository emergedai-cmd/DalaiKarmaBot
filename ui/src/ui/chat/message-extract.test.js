"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var message_extract_1 = require("./message-extract");
(0, vitest_1.describe)("extractTextCached", function () {
    (0, vitest_1.it)("matches extractText output", function () {
        var message = {
            role: "assistant",
            content: [{ type: "text", text: "Hello there" }],
        };
        (0, vitest_1.expect)((0, message_extract_1.extractTextCached)(message)).toBe((0, message_extract_1.extractText)(message));
    });
    (0, vitest_1.it)("returns consistent output for repeated calls", function () {
        var message = {
            role: "user",
            content: "plain text",
        };
        (0, vitest_1.expect)((0, message_extract_1.extractTextCached)(message)).toBe("plain text");
        (0, vitest_1.expect)((0, message_extract_1.extractTextCached)(message)).toBe("plain text");
    });
});
(0, vitest_1.describe)("extractThinkingCached", function () {
    (0, vitest_1.it)("matches extractThinking output", function () {
        var message = {
            role: "assistant",
            content: [{ type: "thinking", thinking: "Plan A" }],
        };
        (0, vitest_1.expect)((0, message_extract_1.extractThinkingCached)(message)).toBe((0, message_extract_1.extractThinking)(message));
    });
    (0, vitest_1.it)("returns consistent output for repeated calls", function () {
        var message = {
            role: "assistant",
            content: [{ type: "thinking", thinking: "Plan A" }],
        };
        (0, vitest_1.expect)((0, message_extract_1.extractThinkingCached)(message)).toBe("Plan A");
        (0, vitest_1.expect)((0, message_extract_1.extractThinkingCached)(message)).toBe("Plan A");
    });
});
