"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var ws_log_js_1 = require("./ws-log.js");
(0, vitest_1.describe)("gateway ws log helpers", function () {
    (0, vitest_1.test)("shortId compacts uuids and long strings", function () {
        (0, vitest_1.expect)((0, ws_log_js_1.shortId)("12345678-1234-1234-1234-123456789abc")).toBe("12345678…9abc");
        (0, vitest_1.expect)((0, ws_log_js_1.shortId)("a".repeat(30))).toBe("aaaaaaaaaaaa…aaaa");
        (0, vitest_1.expect)((0, ws_log_js_1.shortId)("short")).toBe("short");
    });
    (0, vitest_1.test)("formatForLog formats errors and messages", function () {
        var err = new Error("boom");
        err.name = "TestError";
        (0, vitest_1.expect)((0, ws_log_js_1.formatForLog)(err)).toContain("TestError");
        (0, vitest_1.expect)((0, ws_log_js_1.formatForLog)(err)).toContain("boom");
        var obj = { name: "Oops", message: "failed", code: "E1" };
        (0, vitest_1.expect)((0, ws_log_js_1.formatForLog)(obj)).toBe("Oops: failed: code=E1");
    });
    (0, vitest_1.test)("formatForLog redacts obvious secrets", function () {
        var token = "sk-abcdefghijklmnopqrstuvwxyz123456";
        var out = (0, ws_log_js_1.formatForLog)({ token: token });
        (0, vitest_1.expect)(out).toContain("token");
        (0, vitest_1.expect)(out).not.toContain(token);
        (0, vitest_1.expect)(out).toContain("…");
    });
    (0, vitest_1.test)("summarizeAgentEventForWsLog extracts useful fields", function () {
        var summary = (0, ws_log_js_1.summarizeAgentEventForWsLog)({
            runId: "12345678-1234-1234-1234-123456789abc",
            sessionKey: "agent:main:main",
            stream: "assistant",
            seq: 2,
            data: { text: "hello world", mediaUrls: ["a", "b"] },
        });
        (0, vitest_1.expect)(summary).toMatchObject({
            agent: "main",
            run: "12345678…9abc",
            session: "main",
            stream: "assistant",
            aseq: 2,
            text: "hello world",
            media: 2,
        });
        var tool = (0, ws_log_js_1.summarizeAgentEventForWsLog)({
            runId: "run-1",
            stream: "tool",
            data: { phase: "start", name: "fetch", toolCallId: "call-1" },
        });
        (0, vitest_1.expect)(tool).toMatchObject({
            stream: "tool",
            tool: "start:fetch",
            call: "call-1",
        });
    });
});
