"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var thinking_js_1 = require("./thinking.js");
(0, vitest_1.describe)("normalizeThinkLevel", function () {
    (0, vitest_1.it)("accepts mid as medium", function () {
        (0, vitest_1.expect)((0, thinking_js_1.normalizeThinkLevel)("mid")).toBe("medium");
    });
    (0, vitest_1.it)("accepts xhigh", function () {
        (0, vitest_1.expect)((0, thinking_js_1.normalizeThinkLevel)("xhigh")).toBe("xhigh");
    });
    (0, vitest_1.it)("accepts on as low", function () {
        (0, vitest_1.expect)((0, thinking_js_1.normalizeThinkLevel)("on")).toBe("low");
    });
});
(0, vitest_1.describe)("listThinkingLevels", function () {
    (0, vitest_1.it)("includes xhigh for codex models", function () {
        (0, vitest_1.expect)((0, thinking_js_1.listThinkingLevels)(undefined, "gpt-5.2-codex")).toContain("xhigh");
    });
    (0, vitest_1.it)("includes xhigh for openai gpt-5.2", function () {
        (0, vitest_1.expect)((0, thinking_js_1.listThinkingLevels)("openai", "gpt-5.2")).toContain("xhigh");
    });
    (0, vitest_1.it)("excludes xhigh for non-codex models", function () {
        (0, vitest_1.expect)((0, thinking_js_1.listThinkingLevels)(undefined, "gpt-4.1-mini")).not.toContain("xhigh");
    });
});
(0, vitest_1.describe)("listThinkingLevelLabels", function () {
    (0, vitest_1.it)("returns on/off for ZAI", function () {
        (0, vitest_1.expect)((0, thinking_js_1.listThinkingLevelLabels)("zai", "glm-4.7")).toEqual(["off", "on"]);
    });
    (0, vitest_1.it)("returns full levels for non-ZAI", function () {
        (0, vitest_1.expect)((0, thinking_js_1.listThinkingLevelLabels)("openai", "gpt-4.1-mini")).toContain("low");
        (0, vitest_1.expect)((0, thinking_js_1.listThinkingLevelLabels)("openai", "gpt-4.1-mini")).not.toContain("on");
    });
});
(0, vitest_1.describe)("normalizeReasoningLevel", function () {
    (0, vitest_1.it)("accepts on/off", function () {
        (0, vitest_1.expect)((0, thinking_js_1.normalizeReasoningLevel)("on")).toBe("on");
        (0, vitest_1.expect)((0, thinking_js_1.normalizeReasoningLevel)("off")).toBe("off");
    });
    (0, vitest_1.it)("accepts show/hide", function () {
        (0, vitest_1.expect)((0, thinking_js_1.normalizeReasoningLevel)("show")).toBe("on");
        (0, vitest_1.expect)((0, thinking_js_1.normalizeReasoningLevel)("hide")).toBe("off");
    });
    (0, vitest_1.it)("accepts stream", function () {
        (0, vitest_1.expect)((0, thinking_js_1.normalizeReasoningLevel)("stream")).toBe("stream");
        (0, vitest_1.expect)((0, thinking_js_1.normalizeReasoningLevel)("streaming")).toBe("stream");
    });
});
