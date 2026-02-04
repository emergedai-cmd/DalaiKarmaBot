"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var tool_call_id_js_1 = require("./tool-call-id.js");
(0, vitest_1.describe)("sanitizeToolCallIdsForCloudCodeAssist", function () {
    (0, vitest_1.describe)("strict mode (default)", function () {
        (0, vitest_1.it)("is a no-op for already-valid non-colliding IDs", function () {
            var input = [
                {
                    role: "assistant",
                    content: [{ type: "toolCall", id: "call1", name: "read", arguments: {} }],
                },
                {
                    role: "toolResult",
                    toolCallId: "call1",
                    toolName: "read",
                    content: [{ type: "text", text: "ok" }],
                },
            ];
            var out = (0, tool_call_id_js_1.sanitizeToolCallIdsForCloudCodeAssist)(input);
            (0, vitest_1.expect)(out).toBe(input);
        });
        (0, vitest_1.it)("strips non-alphanumeric characters from tool call IDs", function () {
            var _a;
            var input = [
                {
                    role: "assistant",
                    content: [{ type: "toolCall", id: "call|item:123", name: "read", arguments: {} }],
                },
                {
                    role: "toolResult",
                    toolCallId: "call|item:123",
                    toolName: "read",
                    content: [{ type: "text", text: "ok" }],
                },
            ];
            var out = (0, tool_call_id_js_1.sanitizeToolCallIdsForCloudCodeAssist)(input);
            (0, vitest_1.expect)(out).not.toBe(input);
            var assistant = out[0];
            var toolCall = (_a = assistant.content) === null || _a === void 0 ? void 0 : _a[0];
            // Strict mode strips all non-alphanumeric characters
            (0, vitest_1.expect)(toolCall.id).toBe("callitem123");
            (0, vitest_1.expect)((0, tool_call_id_js_1.isValidCloudCodeAssistToolId)(toolCall.id, "strict")).toBe(true);
            var result = out[1];
            (0, vitest_1.expect)(result.toolCallId).toBe(toolCall.id);
        });
        (0, vitest_1.it)("avoids collisions when sanitization would produce duplicate IDs", function () {
            var _a, _b;
            var input = [
                {
                    role: "assistant",
                    content: [
                        { type: "toolCall", id: "call_a|b", name: "read", arguments: {} },
                        { type: "toolCall", id: "call_a:b", name: "read", arguments: {} },
                    ],
                },
                {
                    role: "toolResult",
                    toolCallId: "call_a|b",
                    toolName: "read",
                    content: [{ type: "text", text: "one" }],
                },
                {
                    role: "toolResult",
                    toolCallId: "call_a:b",
                    toolName: "read",
                    content: [{ type: "text", text: "two" }],
                },
            ];
            var out = (0, tool_call_id_js_1.sanitizeToolCallIdsForCloudCodeAssist)(input);
            (0, vitest_1.expect)(out).not.toBe(input);
            var assistant = out[0];
            var a = (_a = assistant.content) === null || _a === void 0 ? void 0 : _a[0];
            var b = (_b = assistant.content) === null || _b === void 0 ? void 0 : _b[1];
            (0, vitest_1.expect)(typeof a.id).toBe("string");
            (0, vitest_1.expect)(typeof b.id).toBe("string");
            (0, vitest_1.expect)(a.id).not.toBe(b.id);
            (0, vitest_1.expect)((0, tool_call_id_js_1.isValidCloudCodeAssistToolId)(a.id, "strict")).toBe(true);
            (0, vitest_1.expect)((0, tool_call_id_js_1.isValidCloudCodeAssistToolId)(b.id, "strict")).toBe(true);
            var r1 = out[1];
            var r2 = out[2];
            (0, vitest_1.expect)(r1.toolCallId).toBe(a.id);
            (0, vitest_1.expect)(r2.toolCallId).toBe(b.id);
        });
        (0, vitest_1.it)("caps tool call IDs at 40 chars while preserving uniqueness", function () {
            var _a, _b, _c, _d;
            var longA = "call_".concat("a".repeat(60));
            var longB = "call_".concat("a".repeat(59), "b");
            var input = [
                {
                    role: "assistant",
                    content: [
                        { type: "toolCall", id: longA, name: "read", arguments: {} },
                        { type: "toolCall", id: longB, name: "read", arguments: {} },
                    ],
                },
                {
                    role: "toolResult",
                    toolCallId: longA,
                    toolName: "read",
                    content: [{ type: "text", text: "one" }],
                },
                {
                    role: "toolResult",
                    toolCallId: longB,
                    toolName: "read",
                    content: [{ type: "text", text: "two" }],
                },
            ];
            var out = (0, tool_call_id_js_1.sanitizeToolCallIdsForCloudCodeAssist)(input);
            var assistant = out[0];
            var a = (_a = assistant.content) === null || _a === void 0 ? void 0 : _a[0];
            var b = (_b = assistant.content) === null || _b === void 0 ? void 0 : _b[1];
            (0, vitest_1.expect)(typeof a.id).toBe("string");
            (0, vitest_1.expect)(typeof b.id).toBe("string");
            (0, vitest_1.expect)(a.id).not.toBe(b.id);
            (0, vitest_1.expect)((_c = a.id) === null || _c === void 0 ? void 0 : _c.length).toBeLessThanOrEqual(40);
            (0, vitest_1.expect)((_d = b.id) === null || _d === void 0 ? void 0 : _d.length).toBeLessThanOrEqual(40);
            (0, vitest_1.expect)((0, tool_call_id_js_1.isValidCloudCodeAssistToolId)(a.id, "strict")).toBe(true);
            (0, vitest_1.expect)((0, tool_call_id_js_1.isValidCloudCodeAssistToolId)(b.id, "strict")).toBe(true);
            var r1 = out[1];
            var r2 = out[2];
            (0, vitest_1.expect)(r1.toolCallId).toBe(a.id);
            (0, vitest_1.expect)(r2.toolCallId).toBe(b.id);
        });
    });
    (0, vitest_1.describe)("strict mode (alphanumeric only)", function () {
        (0, vitest_1.it)("strips underscores and hyphens from tool call IDs", function () {
            var _a;
            var input = [
                {
                    role: "assistant",
                    content: [
                        {
                            type: "toolCall",
                            id: "whatsapp_login_1768799841527_1",
                            name: "login",
                            arguments: {},
                        },
                    ],
                },
                {
                    role: "toolResult",
                    toolCallId: "whatsapp_login_1768799841527_1",
                    toolName: "login",
                    content: [{ type: "text", text: "ok" }],
                },
            ];
            var out = (0, tool_call_id_js_1.sanitizeToolCallIdsForCloudCodeAssist)(input, "strict");
            (0, vitest_1.expect)(out).not.toBe(input);
            var assistant = out[0];
            var toolCall = (_a = assistant.content) === null || _a === void 0 ? void 0 : _a[0];
            // Strict mode strips all non-alphanumeric characters
            (0, vitest_1.expect)(toolCall.id).toBe("whatsapplogin17687998415271");
            (0, vitest_1.expect)((0, tool_call_id_js_1.isValidCloudCodeAssistToolId)(toolCall.id, "strict")).toBe(true);
            var result = out[1];
            (0, vitest_1.expect)(result.toolCallId).toBe(toolCall.id);
        });
        (0, vitest_1.it)("avoids collisions with alphanumeric-only suffixes", function () {
            var _a, _b;
            var input = [
                {
                    role: "assistant",
                    content: [
                        { type: "toolCall", id: "call_a|b", name: "read", arguments: {} },
                        { type: "toolCall", id: "call_a:b", name: "read", arguments: {} },
                    ],
                },
                {
                    role: "toolResult",
                    toolCallId: "call_a|b",
                    toolName: "read",
                    content: [{ type: "text", text: "one" }],
                },
                {
                    role: "toolResult",
                    toolCallId: "call_a:b",
                    toolName: "read",
                    content: [{ type: "text", text: "two" }],
                },
            ];
            var out = (0, tool_call_id_js_1.sanitizeToolCallIdsForCloudCodeAssist)(input, "strict");
            (0, vitest_1.expect)(out).not.toBe(input);
            var assistant = out[0];
            var a = (_a = assistant.content) === null || _a === void 0 ? void 0 : _a[0];
            var b = (_b = assistant.content) === null || _b === void 0 ? void 0 : _b[1];
            (0, vitest_1.expect)(typeof a.id).toBe("string");
            (0, vitest_1.expect)(typeof b.id).toBe("string");
            (0, vitest_1.expect)(a.id).not.toBe(b.id);
            // Both should be strictly alphanumeric
            (0, vitest_1.expect)((0, tool_call_id_js_1.isValidCloudCodeAssistToolId)(a.id, "strict")).toBe(true);
            (0, vitest_1.expect)((0, tool_call_id_js_1.isValidCloudCodeAssistToolId)(b.id, "strict")).toBe(true);
            // Should not contain underscores or hyphens
            (0, vitest_1.expect)(a.id).not.toMatch(/[_-]/);
            (0, vitest_1.expect)(b.id).not.toMatch(/[_-]/);
            var r1 = out[1];
            var r2 = out[2];
            (0, vitest_1.expect)(r1.toolCallId).toBe(a.id);
            (0, vitest_1.expect)(r2.toolCallId).toBe(b.id);
        });
    });
    (0, vitest_1.describe)("strict9 mode (Mistral tool call IDs)", function () {
        (0, vitest_1.it)("enforces alphanumeric IDs with length 9", function () {
            var _a, _b, _c, _d;
            var input = [
                {
                    role: "assistant",
                    content: [
                        { type: "toolCall", id: "call_abc|item:123", name: "read", arguments: {} },
                        { type: "toolCall", id: "call_abc|item:456", name: "read", arguments: {} },
                    ],
                },
                {
                    role: "toolResult",
                    toolCallId: "call_abc|item:123",
                    toolName: "read",
                    content: [{ type: "text", text: "one" }],
                },
                {
                    role: "toolResult",
                    toolCallId: "call_abc|item:456",
                    toolName: "read",
                    content: [{ type: "text", text: "two" }],
                },
            ];
            var out = (0, tool_call_id_js_1.sanitizeToolCallIdsForCloudCodeAssist)(input, "strict9");
            (0, vitest_1.expect)(out).not.toBe(input);
            var assistant = out[0];
            var a = (_a = assistant.content) === null || _a === void 0 ? void 0 : _a[0];
            var b = (_b = assistant.content) === null || _b === void 0 ? void 0 : _b[1];
            (0, vitest_1.expect)(typeof a.id).toBe("string");
            (0, vitest_1.expect)(typeof b.id).toBe("string");
            (0, vitest_1.expect)(a.id).not.toBe(b.id);
            (0, vitest_1.expect)((_c = a.id) === null || _c === void 0 ? void 0 : _c.length).toBe(9);
            (0, vitest_1.expect)((_d = b.id) === null || _d === void 0 ? void 0 : _d.length).toBe(9);
            (0, vitest_1.expect)((0, tool_call_id_js_1.isValidCloudCodeAssistToolId)(a.id, "strict9")).toBe(true);
            (0, vitest_1.expect)((0, tool_call_id_js_1.isValidCloudCodeAssistToolId)(b.id, "strict9")).toBe(true);
            var r1 = out[1];
            var r2 = out[2];
            (0, vitest_1.expect)(r1.toolCallId).toBe(a.id);
            (0, vitest_1.expect)(r2.toolCallId).toBe(b.id);
        });
    });
});
