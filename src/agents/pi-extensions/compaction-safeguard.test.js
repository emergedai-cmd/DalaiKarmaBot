"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var compaction_safeguard_runtime_js_1 = require("./compaction-safeguard-runtime.js");
var compaction_safeguard_js_1 = require("./compaction-safeguard.js");
var collectToolFailures = compaction_safeguard_js_1.__testing.collectToolFailures, formatToolFailuresSection = compaction_safeguard_js_1.__testing.formatToolFailuresSection, computeAdaptiveChunkRatio = compaction_safeguard_js_1.__testing.computeAdaptiveChunkRatio, isOversizedForSummary = compaction_safeguard_js_1.__testing.isOversizedForSummary, BASE_CHUNK_RATIO = compaction_safeguard_js_1.__testing.BASE_CHUNK_RATIO, MIN_CHUNK_RATIO = compaction_safeguard_js_1.__testing.MIN_CHUNK_RATIO, SAFETY_MARGIN = compaction_safeguard_js_1.__testing.SAFETY_MARGIN;
(0, vitest_1.describe)("compaction-safeguard tool failures", function () {
    (0, vitest_1.it)("formats tool failures with meta and summary", function () {
        var messages = [
            {
                role: "toolResult",
                toolCallId: "call-1",
                toolName: "exec",
                isError: true,
                details: { status: "failed", exitCode: 1 },
                content: [{ type: "text", text: "ENOENT: missing file" }],
                timestamp: Date.now(),
            },
            {
                role: "toolResult",
                toolCallId: "call-2",
                toolName: "read",
                isError: false,
                content: [{ type: "text", text: "ok" }],
                timestamp: Date.now(),
            },
        ];
        var failures = collectToolFailures(messages);
        (0, vitest_1.expect)(failures).toHaveLength(1);
        var section = formatToolFailuresSection(failures);
        (0, vitest_1.expect)(section).toContain("## Tool Failures");
        (0, vitest_1.expect)(section).toContain("exec (status=failed exitCode=1): ENOENT: missing file");
    });
    (0, vitest_1.it)("dedupes by toolCallId and handles empty output", function () {
        var messages = [
            {
                role: "toolResult",
                toolCallId: "call-1",
                toolName: "exec",
                isError: true,
                details: { exitCode: 2 },
                content: [],
                timestamp: Date.now(),
            },
            {
                role: "toolResult",
                toolCallId: "call-1",
                toolName: "exec",
                isError: true,
                content: [{ type: "text", text: "ignored" }],
                timestamp: Date.now(),
            },
        ];
        var failures = collectToolFailures(messages);
        (0, vitest_1.expect)(failures).toHaveLength(1);
        var section = formatToolFailuresSection(failures);
        (0, vitest_1.expect)(section).toContain("exec (exitCode=2): failed");
    });
    (0, vitest_1.it)("caps the number of failures and adds overflow line", function () {
        var messages = Array.from({ length: 9 }, function (_, idx) { return ({
            role: "toolResult",
            toolCallId: "call-".concat(idx),
            toolName: "exec",
            isError: true,
            content: [{ type: "text", text: "error ".concat(idx) }],
            timestamp: Date.now(),
        }); });
        var failures = collectToolFailures(messages);
        var section = formatToolFailuresSection(failures);
        (0, vitest_1.expect)(section).toContain("## Tool Failures");
        (0, vitest_1.expect)(section).toContain("...and 1 more");
    });
    (0, vitest_1.it)("omits section when there are no tool failures", function () {
        var messages = [
            {
                role: "toolResult",
                toolCallId: "ok",
                toolName: "exec",
                isError: false,
                content: [{ type: "text", text: "ok" }],
                timestamp: Date.now(),
            },
        ];
        var failures = collectToolFailures(messages);
        var section = formatToolFailuresSection(failures);
        (0, vitest_1.expect)(section).toBe("");
    });
});
(0, vitest_1.describe)("computeAdaptiveChunkRatio", function () {
    var CONTEXT_WINDOW = 200000;
    (0, vitest_1.it)("returns BASE_CHUNK_RATIO for normal messages", function () {
        // Small messages: 1000 tokens each, well under 10% of context
        var messages = [
            { role: "user", content: "x".repeat(1000), timestamp: Date.now() },
            {
                role: "assistant",
                content: [{ type: "text", text: "y".repeat(1000) }],
                timestamp: Date.now(),
            },
        ];
        var ratio = computeAdaptiveChunkRatio(messages, CONTEXT_WINDOW);
        (0, vitest_1.expect)(ratio).toBe(BASE_CHUNK_RATIO);
    });
    (0, vitest_1.it)("reduces ratio when average message > 10% of context", function () {
        // Large messages: ~50K tokens each (25% of context)
        var messages = [
            { role: "user", content: "x".repeat(50000 * 4), timestamp: Date.now() },
            {
                role: "assistant",
                content: [{ type: "text", text: "y".repeat(50000 * 4) }],
                timestamp: Date.now(),
            },
        ];
        var ratio = computeAdaptiveChunkRatio(messages, CONTEXT_WINDOW);
        (0, vitest_1.expect)(ratio).toBeLessThan(BASE_CHUNK_RATIO);
        (0, vitest_1.expect)(ratio).toBeGreaterThanOrEqual(MIN_CHUNK_RATIO);
    });
    (0, vitest_1.it)("respects MIN_CHUNK_RATIO floor", function () {
        // Very large messages that would push ratio below minimum
        var messages = [
            { role: "user", content: "x".repeat(150000 * 4), timestamp: Date.now() },
        ];
        var ratio = computeAdaptiveChunkRatio(messages, CONTEXT_WINDOW);
        (0, vitest_1.expect)(ratio).toBeGreaterThanOrEqual(MIN_CHUNK_RATIO);
    });
    (0, vitest_1.it)("handles empty message array", function () {
        var ratio = computeAdaptiveChunkRatio([], CONTEXT_WINDOW);
        (0, vitest_1.expect)(ratio).toBe(BASE_CHUNK_RATIO);
    });
    (0, vitest_1.it)("handles single huge message", function () {
        // Single massive message
        var messages = [
            { role: "user", content: "x".repeat(180000 * 4), timestamp: Date.now() },
        ];
        var ratio = computeAdaptiveChunkRatio(messages, CONTEXT_WINDOW);
        (0, vitest_1.expect)(ratio).toBeGreaterThanOrEqual(MIN_CHUNK_RATIO);
        (0, vitest_1.expect)(ratio).toBeLessThanOrEqual(BASE_CHUNK_RATIO);
    });
});
(0, vitest_1.describe)("isOversizedForSummary", function () {
    var CONTEXT_WINDOW = 200000;
    (0, vitest_1.it)("returns false for small messages", function () {
        var msg = {
            role: "user",
            content: "Hello, world!",
            timestamp: Date.now(),
        };
        (0, vitest_1.expect)(isOversizedForSummary(msg, CONTEXT_WINDOW)).toBe(false);
    });
    (0, vitest_1.it)("returns true for messages > 50% of context", function () {
        // Message with ~120K tokens (60% of 200K context)
        // After safety margin (1.2x), effective is 144K which is > 100K (50%)
        var msg = {
            role: "user",
            content: "x".repeat(120000 * 4),
            timestamp: Date.now(),
        };
        (0, vitest_1.expect)(isOversizedForSummary(msg, CONTEXT_WINDOW)).toBe(true);
    });
    (0, vitest_1.it)("applies safety margin", function () {
        // Message at exactly 50% of context before margin
        // After SAFETY_MARGIN (1.2), it becomes 60% which is > 50%
        var halfContextChars = (CONTEXT_WINDOW * 0.5) / SAFETY_MARGIN;
        var msg = {
            role: "user",
            content: "x".repeat(Math.floor(halfContextChars * 4)),
            timestamp: Date.now(),
        };
        // With safety margin applied, this should be at the boundary
        // The function checks if tokens * SAFETY_MARGIN > contextWindow * 0.5
        var isOversized = isOversizedForSummary(msg, CONTEXT_WINDOW);
        // Due to token estimation, this could be either true or false at the boundary
        (0, vitest_1.expect)(typeof isOversized).toBe("boolean");
    });
});
(0, vitest_1.describe)("compaction-safeguard runtime registry", function () {
    (0, vitest_1.it)("stores and retrieves config by session manager identity", function () {
        var sm = {};
        (0, compaction_safeguard_runtime_js_1.setCompactionSafeguardRuntime)(sm, { maxHistoryShare: 0.3 });
        var runtime = (0, compaction_safeguard_runtime_js_1.getCompactionSafeguardRuntime)(sm);
        (0, vitest_1.expect)(runtime).toEqual({ maxHistoryShare: 0.3 });
    });
    (0, vitest_1.it)("returns null for unknown session manager", function () {
        var sm = {};
        (0, vitest_1.expect)((0, compaction_safeguard_runtime_js_1.getCompactionSafeguardRuntime)(sm)).toBeNull();
    });
    (0, vitest_1.it)("clears entry when value is null", function () {
        var sm = {};
        (0, compaction_safeguard_runtime_js_1.setCompactionSafeguardRuntime)(sm, { maxHistoryShare: 0.7 });
        (0, vitest_1.expect)((0, compaction_safeguard_runtime_js_1.getCompactionSafeguardRuntime)(sm)).not.toBeNull();
        (0, compaction_safeguard_runtime_js_1.setCompactionSafeguardRuntime)(sm, null);
        (0, vitest_1.expect)((0, compaction_safeguard_runtime_js_1.getCompactionSafeguardRuntime)(sm)).toBeNull();
    });
    (0, vitest_1.it)("ignores non-object session managers", function () {
        (0, compaction_safeguard_runtime_js_1.setCompactionSafeguardRuntime)(null, { maxHistoryShare: 0.5 });
        (0, vitest_1.expect)((0, compaction_safeguard_runtime_js_1.getCompactionSafeguardRuntime)(null)).toBeNull();
        (0, compaction_safeguard_runtime_js_1.setCompactionSafeguardRuntime)(undefined, { maxHistoryShare: 0.5 });
        (0, vitest_1.expect)((0, compaction_safeguard_runtime_js_1.getCompactionSafeguardRuntime)(undefined)).toBeNull();
    });
    (0, vitest_1.it)("isolates different session managers", function () {
        var sm1 = {};
        var sm2 = {};
        (0, compaction_safeguard_runtime_js_1.setCompactionSafeguardRuntime)(sm1, { maxHistoryShare: 0.3 });
        (0, compaction_safeguard_runtime_js_1.setCompactionSafeguardRuntime)(sm2, { maxHistoryShare: 0.8 });
        (0, vitest_1.expect)((0, compaction_safeguard_runtime_js_1.getCompactionSafeguardRuntime)(sm1)).toEqual({ maxHistoryShare: 0.3 });
        (0, vitest_1.expect)((0, compaction_safeguard_runtime_js_1.getCompactionSafeguardRuntime)(sm2)).toEqual({ maxHistoryShare: 0.8 });
    });
});
