"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_utils_js_1 = require("./pi-embedded-utils.js");
(0, vitest_1.describe)("extractAssistantText", function () {
    (0, vitest_1.it)("strips Minimax tool invocation XML from text", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "<invoke name=\"Bash\">\n<parameter name=\"command\">netstat -tlnp | grep 18789</parameter>\n</invoke>\n</minimax:tool_call>",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("");
    });
    (0, vitest_1.it)("strips multiple tool invocations", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "Let me check that.<invoke name=\"Read\">\n<parameter name=\"path\">/home/admin/test.txt</parameter>\n</invoke>\n</minimax:tool_call>",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("Let me check that.");
    });
    (0, vitest_1.it)("keeps invoke snippets without Minimax markers", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "Example:\n<invoke name=\"Bash\">\n<parameter name=\"command\">ls</parameter>\n</invoke>",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("Example:\n<invoke name=\"Bash\">\n<parameter name=\"command\">ls</parameter>\n</invoke>");
    });
    (0, vitest_1.it)("preserves normal text without tool invocations", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "This is a normal response without any tool calls.",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("This is a normal response without any tool calls.");
    });
    (0, vitest_1.it)("strips Minimax tool invocations with extra attributes", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "Before<invoke name='Bash' data-foo=\"bar\">\n<parameter name=\"command\">ls</parameter>\n</invoke>\n</minimax:tool_call>After",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("Before\nAfter");
    });
    (0, vitest_1.it)("strips minimax tool_call open and close tags", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "Start<minimax:tool_call>Inner</minimax:tool_call>End",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("StartInnerEnd");
    });
    (0, vitest_1.it)("ignores invoke blocks without minimax markers", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "Before<invoke>Keep</invoke>After",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("Before<invoke>Keep</invoke>After");
    });
    (0, vitest_1.it)("strips invoke blocks when minimax markers are present elsewhere", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "Before<invoke>Drop</invoke><minimax:tool_call>After",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("BeforeAfter");
    });
    (0, vitest_1.it)("strips invoke blocks with nested tags", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "A<invoke name=\"Bash\"><param><deep>1</deep></param></invoke></minimax:tool_call>B",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("AB");
    });
    (0, vitest_1.it)("strips tool XML mixed with regular content", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "I'll help you with that.<invoke name=\"Bash\">\n<parameter name=\"command\">ls -la</parameter>\n</invoke>\n</minimax:tool_call>Here are the results.",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("I'll help you with that.\nHere are the results.");
    });
    (0, vitest_1.it)("handles multiple invoke blocks in one message", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "First check.<invoke name=\"Read\">\n<parameter name=\"path\">file1.txt</parameter>\n</invoke>\n</minimax:tool_call>Second check.<invoke name=\"Bash\">\n<parameter name=\"command\">pwd</parameter>\n</invoke>\n</minimax:tool_call>Done.",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("First check.\nSecond check.\nDone.");
    });
    (0, vitest_1.it)("handles stray closing tags without opening tags", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "Some text here.</minimax:tool_call>More text.",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("Some text here.More text.");
    });
    (0, vitest_1.it)("returns empty string when message is only tool invocations", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "<invoke name=\"Bash\">\n<parameter name=\"command\">test</parameter>\n</invoke>\n</minimax:tool_call>",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("");
    });
    (0, vitest_1.it)("handles multiple text blocks", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "First block.",
                },
                {
                    type: "text",
                    text: "<invoke name=\"Bash\">\n<parameter name=\"command\">ls</parameter>\n</invoke>\n</minimax:tool_call>",
                },
                {
                    type: "text",
                    text: "Third block.",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("First block.\nThird block.");
    });
    (0, vitest_1.it)("strips downgraded Gemini tool call text representations", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "[Tool Call: exec (ID: toolu_vrtx_014w1P6B6w4V92v4VzG7Qk12)]\nArguments: { \"command\": \"git status\", \"timeout\": 120000 }",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("");
    });
    (0, vitest_1.it)("strips multiple downgraded tool calls", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "[Tool Call: read (ID: toolu_1)]\nArguments: { \"path\": \"/some/file.txt\" }\n[Tool Call: exec (ID: toolu_2)]\nArguments: { \"command\": \"ls -la\" }",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("");
    });
    (0, vitest_1.it)("strips tool results for downgraded calls", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "[Tool Result for ID toolu_123]\n{\"status\": \"ok\", \"data\": \"some result\"}",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("");
    });
    (0, vitest_1.it)("preserves text around downgraded tool calls", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "Let me check that for you.\n[Tool Call: browser (ID: toolu_abc)]\nArguments: { \"action\": \"act\", \"request\": \"click button\" }",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("Let me check that for you.");
    });
    (0, vitest_1.it)("preserves trailing text after downgraded tool call blocks", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "Intro text.\n[Tool Call: read (ID: toolu_1)]\nArguments: {\n  \"path\": \"/tmp/file.txt\"\n}\nBack to the user.",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("Intro text.\nBack to the user.");
    });
    (0, vitest_1.it)("handles multiple text blocks with tool calls and results", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "Here's what I found:",
                },
                {
                    type: "text",
                    text: "[Tool Call: read (ID: toolu_1)]\nArguments: { \"path\": \"/test.txt\" }",
                },
                {
                    type: "text",
                    text: "[Tool Result for ID toolu_1]\nFile contents here",
                },
                {
                    type: "text",
                    text: "Done checking.",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("Here's what I found:\nDone checking.");
    });
    (0, vitest_1.it)("strips thinking tags from text content", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "<think>El usuario quiere retomar una tarea...</think>Aquí está tu respuesta.",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("Aquí está tu respuesta.");
    });
    (0, vitest_1.it)("strips thinking tags with attributes", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "<think reason=\"deliberate\">Hidden</think>Visible",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("Visible");
    });
    (0, vitest_1.it)("strips thinking tags without closing tag", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "<think>Pensando sobre el problema...",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("");
    });
    (0, vitest_1.it)("strips thinking tags with various formats", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "Before<thinking>internal reasoning</thinking>After",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("BeforeAfter");
    });
    (0, vitest_1.it)("strips antthinking tags", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "<antthinking>Some reasoning</antthinking>The actual answer.",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("The actual answer.");
    });
    (0, vitest_1.it)("strips final tags while keeping content", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "<final>\nAnswer\n</final>",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("Answer");
    });
    (0, vitest_1.it)("strips thought tags", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "<thought>Internal deliberation</thought>Final response.",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("Final response.");
    });
    (0, vitest_1.it)("handles nested or multiple thinking blocks", function () {
        var msg = {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "Start<think>first thought</think>Middle<think>second thought</think>End",
                },
            ],
            timestamp: Date.now(),
        };
        var result = (0, pi_embedded_utils_js_1.extractAssistantText)(msg);
        (0, vitest_1.expect)(result).toBe("StartMiddleEnd");
    });
});
(0, vitest_1.describe)("formatReasoningMessage", function () {
    (0, vitest_1.it)("returns empty string for empty input", function () {
        (0, vitest_1.expect)((0, pi_embedded_utils_js_1.formatReasoningMessage)("")).toBe("");
    });
    (0, vitest_1.it)("returns empty string for whitespace-only input", function () {
        (0, vitest_1.expect)((0, pi_embedded_utils_js_1.formatReasoningMessage)("   \n  \t  ")).toBe("");
    });
    (0, vitest_1.it)("wraps single line in italics", function () {
        (0, vitest_1.expect)((0, pi_embedded_utils_js_1.formatReasoningMessage)("Single line of reasoning")).toBe("Reasoning:\n_Single line of reasoning_");
    });
    (0, vitest_1.it)("wraps each line separately for multiline text (Telegram fix)", function () {
        (0, vitest_1.expect)((0, pi_embedded_utils_js_1.formatReasoningMessage)("Line one\nLine two\nLine three")).toBe("Reasoning:\n_Line one_\n_Line two_\n_Line three_");
    });
    (0, vitest_1.it)("preserves empty lines between reasoning text", function () {
        (0, vitest_1.expect)((0, pi_embedded_utils_js_1.formatReasoningMessage)("First block\n\nSecond block")).toBe("Reasoning:\n_First block_\n\n_Second block_");
    });
    (0, vitest_1.it)("handles mixed empty and non-empty lines", function () {
        (0, vitest_1.expect)((0, pi_embedded_utils_js_1.formatReasoningMessage)("A\n\nB\nC")).toBe("Reasoning:\n_A_\n\n_B_\n_C_");
    });
    (0, vitest_1.it)("trims leading/trailing whitespace", function () {
        (0, vitest_1.expect)((0, pi_embedded_utils_js_1.formatReasoningMessage)("  \n  Reasoning here  \n  ")).toBe("Reasoning:\n_Reasoning here_");
    });
});
