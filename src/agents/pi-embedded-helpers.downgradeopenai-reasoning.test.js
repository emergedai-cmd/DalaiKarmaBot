"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
(0, vitest_1.describe)("downgradeOpenAIReasoningBlocks", function () {
    (0, vitest_1.it)("keeps reasoning signatures when followed by content", function () {
        var input = [
            {
                role: "assistant",
                content: [
                    {
                        type: "thinking",
                        thinking: "internal reasoning",
                        thinkingSignature: JSON.stringify({ id: "rs_123", type: "reasoning" }),
                    },
                    { type: "text", text: "answer" },
                ],
            },
        ];
        // oxlint-disable-next-line typescript/no-explicit-any
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.downgradeOpenAIReasoningBlocks)(input)).toEqual(input);
    });
    (0, vitest_1.it)("drops orphaned reasoning blocks without following content", function () {
        var input = [
            {
                role: "assistant",
                content: [
                    {
                        type: "thinking",
                        thinkingSignature: JSON.stringify({ id: "rs_abc", type: "reasoning" }),
                    },
                ],
            },
            { role: "user", content: "next" },
        ];
        // oxlint-disable-next-line typescript/no-explicit-any
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.downgradeOpenAIReasoningBlocks)(input)).toEqual([
            { role: "user", content: "next" },
        ]);
    });
    (0, vitest_1.it)("drops object-form orphaned signatures", function () {
        var input = [
            {
                role: "assistant",
                content: [
                    {
                        type: "thinking",
                        thinkingSignature: { id: "rs_obj", type: "reasoning" },
                    },
                ],
            },
        ];
        // oxlint-disable-next-line typescript/no-explicit-any
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.downgradeOpenAIReasoningBlocks)(input)).toEqual([]);
    });
    (0, vitest_1.it)("keeps non-reasoning thinking signatures", function () {
        var input = [
            {
                role: "assistant",
                content: [
                    {
                        type: "thinking",
                        thinking: "t",
                        thinkingSignature: "reasoning_content",
                    },
                ],
            },
        ];
        // oxlint-disable-next-line typescript/no-explicit-any
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.downgradeOpenAIReasoningBlocks)(input)).toEqual(input);
    });
});
