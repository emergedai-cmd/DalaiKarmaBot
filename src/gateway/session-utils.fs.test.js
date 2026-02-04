"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var session_utils_fs_js_1 = require("./session-utils.fs.js");
(0, vitest_1.describe)("readFirstUserMessageFromTranscript", function () {
    var tmpDir;
    var storePath;
    (0, vitest_1.beforeEach)(function () {
        tmpDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-session-fs-test-"));
        storePath = node_path_1.default.join(tmpDir, "sessions.json");
    });
    (0, vitest_1.afterEach)(function () {
        node_fs_1.default.rmSync(tmpDir, { recursive: true, force: true });
    });
    (0, vitest_1.test)("returns null when transcript file does not exist", function () {
        var result = (0, session_utils_fs_js_1.readFirstUserMessageFromTranscript)("nonexistent-session", storePath);
        (0, vitest_1.expect)(result).toBeNull();
    });
    (0, vitest_1.test)("returns first user message from transcript with string content", function () {
        var sessionId = "test-session-1";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            JSON.stringify({ type: "session", version: 1, id: sessionId }),
            JSON.stringify({ message: { role: "user", content: "Hello world" } }),
            JSON.stringify({ message: { role: "assistant", content: "Hi there" } }),
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readFirstUserMessageFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("Hello world");
    });
    (0, vitest_1.test)("returns first user message from transcript with array content", function () {
        var sessionId = "test-session-2";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            JSON.stringify({ type: "session", version: 1, id: sessionId }),
            JSON.stringify({
                message: {
                    role: "user",
                    content: [{ type: "text", text: "Array message content" }],
                },
            }),
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readFirstUserMessageFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("Array message content");
    });
    (0, vitest_1.test)("returns first user message from transcript with input_text content", function () {
        var sessionId = "test-session-2b";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            JSON.stringify({ type: "session", version: 1, id: sessionId }),
            JSON.stringify({
                message: {
                    role: "user",
                    content: [{ type: "input_text", text: "Input text content" }],
                },
            }),
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readFirstUserMessageFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("Input text content");
    });
    (0, vitest_1.test)("skips non-user messages to find first user message", function () {
        var sessionId = "test-session-3";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            JSON.stringify({ type: "session", version: 1, id: sessionId }),
            JSON.stringify({ message: { role: "system", content: "System prompt" } }),
            JSON.stringify({ message: { role: "assistant", content: "Greeting" } }),
            JSON.stringify({ message: { role: "user", content: "First user question" } }),
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readFirstUserMessageFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("First user question");
    });
    (0, vitest_1.test)("returns null when no user messages exist", function () {
        var sessionId = "test-session-4";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            JSON.stringify({ type: "session", version: 1, id: sessionId }),
            JSON.stringify({ message: { role: "system", content: "System prompt" } }),
            JSON.stringify({ message: { role: "assistant", content: "Greeting" } }),
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readFirstUserMessageFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBeNull();
    });
    (0, vitest_1.test)("handles malformed JSON lines gracefully", function () {
        var sessionId = "test-session-5";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            "not valid json",
            JSON.stringify({ message: { role: "user", content: "Valid message" } }),
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readFirstUserMessageFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("Valid message");
    });
    (0, vitest_1.test)("uses sessionFile parameter when provided", function () {
        var sessionId = "test-session-6";
        var customPath = node_path_1.default.join(tmpDir, "custom-transcript.jsonl");
        var lines = [
            JSON.stringify({ type: "session", version: 1, id: sessionId }),
            JSON.stringify({ message: { role: "user", content: "Custom file message" } }),
        ];
        node_fs_1.default.writeFileSync(customPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readFirstUserMessageFromTranscript)(sessionId, storePath, customPath);
        (0, vitest_1.expect)(result).toBe("Custom file message");
    });
    (0, vitest_1.test)("trims whitespace from message content", function () {
        var sessionId = "test-session-7";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [JSON.stringify({ message: { role: "user", content: "  Padded message  " } })];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readFirstUserMessageFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("Padded message");
    });
    (0, vitest_1.test)("returns null for empty content", function () {
        var sessionId = "test-session-8";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            JSON.stringify({ message: { role: "user", content: "" } }),
            JSON.stringify({ message: { role: "user", content: "Second message" } }),
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readFirstUserMessageFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("Second message");
    });
});
(0, vitest_1.describe)("readLastMessagePreviewFromTranscript", function () {
    var tmpDir;
    var storePath;
    (0, vitest_1.beforeEach)(function () {
        tmpDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-session-fs-test-"));
        storePath = node_path_1.default.join(tmpDir, "sessions.json");
    });
    (0, vitest_1.afterEach)(function () {
        node_fs_1.default.rmSync(tmpDir, { recursive: true, force: true });
    });
    (0, vitest_1.test)("returns null when transcript file does not exist", function () {
        var result = (0, session_utils_fs_js_1.readLastMessagePreviewFromTranscript)("nonexistent-session", storePath);
        (0, vitest_1.expect)(result).toBeNull();
    });
    (0, vitest_1.test)("returns null for empty file", function () {
        var sessionId = "test-last-empty";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        node_fs_1.default.writeFileSync(transcriptPath, "", "utf-8");
        var result = (0, session_utils_fs_js_1.readLastMessagePreviewFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBeNull();
    });
    (0, vitest_1.test)("returns last user message from transcript", function () {
        var sessionId = "test-last-user";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            JSON.stringify({ message: { role: "user", content: "First user" } }),
            JSON.stringify({ message: { role: "assistant", content: "First assistant" } }),
            JSON.stringify({ message: { role: "user", content: "Last user message" } }),
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readLastMessagePreviewFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("Last user message");
    });
    (0, vitest_1.test)("returns last assistant message from transcript", function () {
        var sessionId = "test-last-assistant";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            JSON.stringify({ message: { role: "user", content: "User question" } }),
            JSON.stringify({ message: { role: "assistant", content: "Final assistant reply" } }),
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readLastMessagePreviewFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("Final assistant reply");
    });
    (0, vitest_1.test)("skips system messages to find last user/assistant", function () {
        var sessionId = "test-last-skip-system";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            JSON.stringify({ message: { role: "user", content: "Real last" } }),
            JSON.stringify({ message: { role: "system", content: "System at end" } }),
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readLastMessagePreviewFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("Real last");
    });
    (0, vitest_1.test)("returns null when no user/assistant messages exist", function () {
        var sessionId = "test-last-no-match";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            JSON.stringify({ type: "session", version: 1, id: sessionId }),
            JSON.stringify({ message: { role: "system", content: "Only system" } }),
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readLastMessagePreviewFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBeNull();
    });
    (0, vitest_1.test)("handles malformed JSON lines gracefully", function () {
        var sessionId = "test-last-malformed";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            JSON.stringify({ message: { role: "user", content: "Valid first" } }),
            "not valid json at end",
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readLastMessagePreviewFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("Valid first");
    });
    (0, vitest_1.test)("handles array content format", function () {
        var sessionId = "test-last-array";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            JSON.stringify({
                message: {
                    role: "assistant",
                    content: [{ type: "text", text: "Array content response" }],
                },
            }),
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readLastMessagePreviewFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("Array content response");
    });
    (0, vitest_1.test)("handles output_text content format", function () {
        var sessionId = "test-last-output-text";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            JSON.stringify({
                message: {
                    role: "assistant",
                    content: [{ type: "output_text", text: "Output text response" }],
                },
            }),
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readLastMessagePreviewFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("Output text response");
    });
    (0, vitest_1.test)("uses sessionFile parameter when provided", function () {
        var sessionId = "test-last-custom";
        var customPath = node_path_1.default.join(tmpDir, "custom-last.jsonl");
        var lines = [JSON.stringify({ message: { role: "user", content: "Custom file last" } })];
        node_fs_1.default.writeFileSync(customPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readLastMessagePreviewFromTranscript)(sessionId, storePath, customPath);
        (0, vitest_1.expect)(result).toBe("Custom file last");
    });
    (0, vitest_1.test)("trims whitespace from message content", function () {
        var sessionId = "test-last-trim";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            JSON.stringify({ message: { role: "assistant", content: "  Padded response  " } }),
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readLastMessagePreviewFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("Padded response");
    });
    (0, vitest_1.test)("skips empty content to find previous message", function () {
        var sessionId = "test-last-skip-empty";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            JSON.stringify({ message: { role: "assistant", content: "Has content" } }),
            JSON.stringify({ message: { role: "user", content: "" } }),
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readLastMessagePreviewFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("Has content");
    });
    (0, vitest_1.test)("reads from end of large file (16KB window)", function () {
        var sessionId = "test-last-large";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var padding = JSON.stringify({ message: { role: "user", content: "x".repeat(500) } });
        var lines = [];
        for (var i = 0; i < 50; i++) {
            lines.push(padding);
        }
        lines.push(JSON.stringify({ message: { role: "assistant", content: "Last in large file" } }));
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readLastMessagePreviewFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("Last in large file");
    });
    (0, vitest_1.test)("handles valid UTF-8 content", function () {
        var sessionId = "test-last-utf8";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var validLine = JSON.stringify({
            message: { role: "user", content: "Valid UTF-8: 你好世界 🌍" },
        });
        node_fs_1.default.writeFileSync(transcriptPath, validLine, "utf-8");
        var result = (0, session_utils_fs_js_1.readLastMessagePreviewFromTranscript)(sessionId, storePath);
        (0, vitest_1.expect)(result).toBe("Valid UTF-8: 你好世界 🌍");
    });
});
(0, vitest_1.describe)("readSessionPreviewItemsFromTranscript", function () {
    var tmpDir;
    var storePath;
    (0, vitest_1.beforeEach)(function () {
        tmpDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-session-preview-test-"));
        storePath = node_path_1.default.join(tmpDir, "sessions.json");
    });
    (0, vitest_1.afterEach)(function () {
        node_fs_1.default.rmSync(tmpDir, { recursive: true, force: true });
    });
    (0, vitest_1.test)("returns recent preview items with tool summary", function () {
        var _a;
        var sessionId = "preview-session";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var lines = [
            JSON.stringify({ type: "session", version: 1, id: sessionId }),
            JSON.stringify({ message: { role: "user", content: "Hello" } }),
            JSON.stringify({ message: { role: "assistant", content: "Hi" } }),
            JSON.stringify({
                message: { role: "assistant", content: [{ type: "toolcall", name: "weather" }] },
            }),
            JSON.stringify({ message: { role: "assistant", content: "Forecast ready" } }),
        ];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readSessionPreviewItemsFromTranscript)(sessionId, storePath, undefined, undefined, 3, 120);
        (0, vitest_1.expect)(result.map(function (item) { return item.role; })).toEqual(["assistant", "tool", "assistant"]);
        (0, vitest_1.expect)((_a = result[1]) === null || _a === void 0 ? void 0 : _a.text).toContain("call weather");
    });
    (0, vitest_1.test)("truncates preview text to max chars", function () {
        var _a, _b;
        var sessionId = "preview-truncate";
        var transcriptPath = node_path_1.default.join(tmpDir, "".concat(sessionId, ".jsonl"));
        var longText = "a".repeat(60);
        var lines = [JSON.stringify({ message: { role: "assistant", content: longText } })];
        node_fs_1.default.writeFileSync(transcriptPath, lines.join("\n"), "utf-8");
        var result = (0, session_utils_fs_js_1.readSessionPreviewItemsFromTranscript)(sessionId, storePath, undefined, undefined, 1, 24);
        (0, vitest_1.expect)(result).toHaveLength(1);
        (0, vitest_1.expect)((_a = result[0]) === null || _a === void 0 ? void 0 : _a.text.length).toBe(24);
        (0, vitest_1.expect)((_b = result[0]) === null || _b === void 0 ? void 0 : _b.text.endsWith("...")).toBe(true);
    });
});
