"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
(0, vitest_1.describe)("validateGeminiTurns", function () {
    (0, vitest_1.it)("should return empty array unchanged", function () {
        var result = (0, pi_embedded_helpers_js_1.validateGeminiTurns)([]);
        (0, vitest_1.expect)(result).toEqual([]);
    });
    (0, vitest_1.it)("should return single message unchanged", function () {
        var msgs = [
            {
                role: "user",
                content: "Hello",
            },
        ];
        var result = (0, pi_embedded_helpers_js_1.validateGeminiTurns)(msgs);
        (0, vitest_1.expect)(result).toEqual(msgs);
    });
    (0, vitest_1.it)("should leave alternating user/assistant unchanged", function () {
        var msgs = [
            { role: "user", content: "Hello" },
            { role: "assistant", content: [{ type: "text", text: "Hi" }] },
            { role: "user", content: "How are you?" },
            { role: "assistant", content: [{ type: "text", text: "Good!" }] },
        ];
        var result = (0, pi_embedded_helpers_js_1.validateGeminiTurns)(msgs);
        (0, vitest_1.expect)(result).toHaveLength(4);
        (0, vitest_1.expect)(result).toEqual(msgs);
    });
    (0, vitest_1.it)("should merge consecutive assistant messages", function () {
        var msgs = [
            { role: "user", content: "Hello" },
            {
                role: "assistant",
                content: [{ type: "text", text: "Part 1" }],
                stopReason: "end_turn",
            },
            {
                role: "assistant",
                content: [{ type: "text", text: "Part 2" }],
                stopReason: "end_turn",
            },
            { role: "user", content: "How are you?" },
        ];
        var result = (0, pi_embedded_helpers_js_1.validateGeminiTurns)(msgs);
        (0, vitest_1.expect)(result).toHaveLength(3);
        (0, vitest_1.expect)(result[0]).toEqual({ role: "user", content: "Hello" });
        (0, vitest_1.expect)(result[1].role).toBe("assistant");
        (0, vitest_1.expect)(result[1].content).toHaveLength(2);
        (0, vitest_1.expect)(result[2]).toEqual({ role: "user", content: "How are you?" });
    });
    (0, vitest_1.it)("should preserve metadata from later message when merging", function () {
        var msgs = [
            {
                role: "assistant",
                content: [{ type: "text", text: "Part 1" }],
                usage: { input: 10, output: 5 },
            },
            {
                role: "assistant",
                content: [{ type: "text", text: "Part 2" }],
                usage: { input: 10, output: 10 },
                stopReason: "end_turn",
            },
        ];
        var result = (0, pi_embedded_helpers_js_1.validateGeminiTurns)(msgs);
        (0, vitest_1.expect)(result).toHaveLength(1);
        var merged = result[0];
        (0, vitest_1.expect)(merged.usage).toEqual({ input: 10, output: 10 });
        (0, vitest_1.expect)(merged.stopReason).toBe("end_turn");
        (0, vitest_1.expect)(merged.content).toHaveLength(2);
    });
    (0, vitest_1.it)("should handle toolResult messages without merging", function () {
        var msgs = [
            { role: "user", content: "Use tool" },
            {
                role: "assistant",
                content: [{ type: "toolUse", id: "tool-1", name: "test", input: {} }],
            },
            {
                role: "toolResult",
                toolUseId: "tool-1",
                content: [{ type: "text", text: "Found data" }],
            },
            {
                role: "assistant",
                content: [{ type: "text", text: "Here's the answer" }],
            },
            {
                role: "assistant",
                content: [{ type: "text", text: "Extra thoughts" }],
            },
            { role: "user", content: "Request 2" },
        ];
        var result = (0, pi_embedded_helpers_js_1.validateGeminiTurns)(msgs);
        // Should merge the consecutive assistants
        (0, vitest_1.expect)(result[0].role).toBe("user");
        (0, vitest_1.expect)(result[1].role).toBe("assistant");
        (0, vitest_1.expect)(result[2].role).toBe("toolResult");
        (0, vitest_1.expect)(result[3].role).toBe("assistant");
        (0, vitest_1.expect)(result[4].role).toBe("user");
    });
});
(0, vitest_1.describe)("validateAnthropicTurns", function () {
    (0, vitest_1.it)("should return empty array unchanged", function () {
        var result = (0, pi_embedded_helpers_js_1.validateAnthropicTurns)([]);
        (0, vitest_1.expect)(result).toEqual([]);
    });
    (0, vitest_1.it)("should return single message unchanged", function () {
        var msgs = [
            {
                role: "user",
                content: [{ type: "text", text: "Hello" }],
            },
        ];
        var result = (0, pi_embedded_helpers_js_1.validateAnthropicTurns)(msgs);
        (0, vitest_1.expect)(result).toEqual(msgs);
    });
    (0, vitest_1.it)("should return alternating user/assistant unchanged", function () {
        var msgs = [
            { role: "user", content: [{ type: "text", text: "Question" }] },
            {
                role: "assistant",
                content: [{ type: "text", text: "Answer" }],
            },
            { role: "user", content: [{ type: "text", text: "Follow-up" }] },
        ];
        var result = (0, pi_embedded_helpers_js_1.validateAnthropicTurns)(msgs);
        (0, vitest_1.expect)(result).toEqual(msgs);
    });
    (0, vitest_1.it)("should merge consecutive user messages", function () {
        var msgs = [
            {
                role: "user",
                content: [{ type: "text", text: "First message" }],
                timestamp: 1000,
            },
            {
                role: "user",
                content: [{ type: "text", text: "Second message" }],
                timestamp: 2000,
            },
        ];
        var result = (0, pi_embedded_helpers_js_1.validateAnthropicTurns)(msgs);
        (0, vitest_1.expect)(result).toHaveLength(1);
        (0, vitest_1.expect)(result[0].role).toBe("user");
        var content = result[0].content;
        (0, vitest_1.expect)(content).toHaveLength(2);
        (0, vitest_1.expect)(content[0]).toEqual({ type: "text", text: "First message" });
        (0, vitest_1.expect)(content[1]).toEqual({ type: "text", text: "Second message" });
        // Should take timestamp from the newer message
        (0, vitest_1.expect)(result[0].timestamp).toBe(2000);
    });
    (0, vitest_1.it)("should merge three consecutive user messages", function () {
        var msgs = [
            { role: "user", content: [{ type: "text", text: "One" }] },
            { role: "user", content: [{ type: "text", text: "Two" }] },
            { role: "user", content: [{ type: "text", text: "Three" }] },
        ];
        var result = (0, pi_embedded_helpers_js_1.validateAnthropicTurns)(msgs);
        (0, vitest_1.expect)(result).toHaveLength(1);
        var content = result[0].content;
        (0, vitest_1.expect)(content).toHaveLength(3);
    });
    (0, vitest_1.it)("keeps newest metadata when merging consecutive users", function () {
        var msgs = [
            {
                role: "user",
                content: [{ type: "text", text: "Old" }],
                timestamp: 1000,
                attachments: [{ type: "image", url: "old.png" }],
            },
            {
                role: "user",
                content: [{ type: "text", text: "New" }],
                timestamp: 2000,
                attachments: [{ type: "image", url: "new.png" }],
                someCustomField: "keep-me",
            },
        ];
        var result = (0, pi_embedded_helpers_js_1.validateAnthropicTurns)(msgs);
        (0, vitest_1.expect)(result).toHaveLength(1);
        var merged = result[0];
        (0, vitest_1.expect)(merged.timestamp).toBe(2000);
        (0, vitest_1.expect)(merged.attachments).toEqual([
            { type: "image", url: "new.png" },
        ]);
        (0, vitest_1.expect)(merged.someCustomField).toBe("keep-me");
        (0, vitest_1.expect)(merged.content).toEqual([
            { type: "text", text: "Old" },
            { type: "text", text: "New" },
        ]);
    });
    (0, vitest_1.it)("merges consecutive users with images and preserves order", function () {
        var msgs = [
            {
                role: "user",
                content: [
                    { type: "text", text: "first" },
                    { type: "image", url: "img1" },
                ],
            },
            {
                role: "user",
                content: [
                    { type: "image", url: "img2" },
                    { type: "text", text: "second" },
                ],
            },
        ];
        var merged = (0, pi_embedded_helpers_js_1.validateAnthropicTurns)(msgs)[0];
        (0, vitest_1.expect)(merged.content).toEqual([
            { type: "text", text: "first" },
            { type: "image", url: "img1" },
            { type: "image", url: "img2" },
            { type: "text", text: "second" },
        ]);
    });
    (0, vitest_1.it)("should not merge consecutive assistant messages", function () {
        var msgs = [
            { role: "user", content: [{ type: "text", text: "Question" }] },
            {
                role: "assistant",
                content: [{ type: "text", text: "Answer 1" }],
            },
            {
                role: "assistant",
                content: [{ type: "text", text: "Answer 2" }],
            },
        ];
        var result = (0, pi_embedded_helpers_js_1.validateAnthropicTurns)(msgs);
        // validateAnthropicTurns only merges user messages, not assistant
        (0, vitest_1.expect)(result).toHaveLength(3);
    });
    (0, vitest_1.it)("should handle mixed scenario with steering messages", function () {
        // Simulates: user asks -> assistant errors -> steering user message injected
        var msgs = [
            { role: "user", content: [{ type: "text", text: "Original question" }] },
            {
                role: "assistant",
                content: [],
                stopReason: "error",
                errorMessage: "Overloaded",
            },
            {
                role: "user",
                content: [{ type: "text", text: "Steering: try again" }],
            },
            { role: "user", content: [{ type: "text", text: "Another follow-up" }] },
        ];
        var result = (0, pi_embedded_helpers_js_1.validateAnthropicTurns)(msgs);
        // The two consecutive user messages at the end should be merged
        (0, vitest_1.expect)(result).toHaveLength(3);
        (0, vitest_1.expect)(result[0].role).toBe("user");
        (0, vitest_1.expect)(result[1].role).toBe("assistant");
        (0, vitest_1.expect)(result[2].role).toBe("user");
        var lastContent = result[2].content;
        (0, vitest_1.expect)(lastContent).toHaveLength(2);
    });
});
(0, vitest_1.describe)("mergeConsecutiveUserTurns", function () {
    (0, vitest_1.it)("keeps newest metadata while merging content", function () {
        var previous = {
            role: "user",
            content: [{ type: "text", text: "before" }],
            timestamp: 1000,
            attachments: [{ type: "image", url: "old.png" }],
        };
        var current = {
            role: "user",
            content: [{ type: "text", text: "after" }],
            timestamp: 2000,
            attachments: [{ type: "image", url: "new.png" }],
            someCustomField: "keep-me",
        };
        var merged = (0, pi_embedded_helpers_js_1.mergeConsecutiveUserTurns)(previous, current);
        (0, vitest_1.expect)(merged.content).toEqual([
            { type: "text", text: "before" },
            { type: "text", text: "after" },
        ]);
        (0, vitest_1.expect)(merged.attachments).toEqual([
            { type: "image", url: "new.png" },
        ]);
        (0, vitest_1.expect)(merged.someCustomField).toBe("keep-me");
        (0, vitest_1.expect)(merged.timestamp).toBe(2000);
    });
    (0, vitest_1.it)("backfills timestamp from earlier message when missing", function () {
        var previous = {
            role: "user",
            content: [{ type: "text", text: "before" }],
            timestamp: 1000,
        };
        var current = {
            role: "user",
            content: [{ type: "text", text: "after" }],
        };
        var merged = (0, pi_embedded_helpers_js_1.mergeConsecutiveUserTurns)(previous, current);
        (0, vitest_1.expect)(merged.timestamp).toBe(1000);
    });
});
