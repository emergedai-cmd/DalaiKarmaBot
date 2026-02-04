"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var google_shared_js_1 = require("@mariozechner/pi-ai/dist/providers/google-shared.js");
var vitest_1 = require("vitest");
var asRecord = function (value) {
    (0, vitest_1.expect)(value).toBeTruthy();
    (0, vitest_1.expect)(typeof value).toBe("object");
    (0, vitest_1.expect)(Array.isArray(value)).toBe(false);
    return value;
};
var makeModel = function (id) {
    return ({
        id: id,
        name: id,
        api: "google-generative-ai",
        provider: "google",
        baseUrl: "https://example.invalid",
        reasoning: false,
        input: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1,
        maxTokens: 1,
    });
};
var makeGeminiCliModel = function (id) {
    return ({
        id: id,
        name: id,
        api: "google-gemini-cli",
        provider: "google-gemini-cli",
        baseUrl: "https://example.invalid",
        reasoning: false,
        input: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1,
        maxTokens: 1,
    });
};
(0, vitest_1.describe)("google-shared convertTools", function () {
    (0, vitest_1.it)("ensures function call comes after user turn, not after model turn", function () {
        var _a;
        var model = makeModel("gemini-1.5-pro");
        var context = {
            messages: [
                {
                    role: "user",
                    content: "Hello",
                },
                {
                    role: "assistant",
                    content: [{ type: "text", text: "Hi!" }],
                    api: "google-generative-ai",
                    provider: "google",
                    model: "gemini-1.5-pro",
                    usage: {
                        input: 0,
                        output: 0,
                        cacheRead: 0,
                        cacheWrite: 0,
                        totalTokens: 0,
                        cost: {
                            input: 0,
                            output: 0,
                            cacheRead: 0,
                            cacheWrite: 0,
                            total: 0,
                        },
                    },
                    stopReason: "stop",
                    timestamp: 0,
                },
                {
                    role: "assistant",
                    content: [
                        {
                            type: "toolCall",
                            id: "call_1",
                            name: "myTool",
                            arguments: {},
                        },
                    ],
                    api: "google-generative-ai",
                    provider: "google",
                    model: "gemini-1.5-pro",
                    usage: {
                        input: 0,
                        output: 0,
                        cacheRead: 0,
                        cacheWrite: 0,
                        totalTokens: 0,
                        cost: {
                            input: 0,
                            output: 0,
                            cacheRead: 0,
                            cacheWrite: 0,
                            total: 0,
                        },
                    },
                    stopReason: "stop",
                    timestamp: 0,
                },
            ],
        };
        var contents = (0, google_shared_js_1.convertMessages)(model, context);
        (0, vitest_1.expect)(contents).toHaveLength(3);
        (0, vitest_1.expect)(contents[0].role).toBe("user");
        (0, vitest_1.expect)(contents[1].role).toBe("model");
        (0, vitest_1.expect)(contents[2].role).toBe("model");
        var toolCallPart = (_a = contents[2].parts) === null || _a === void 0 ? void 0 : _a.find(function (part) { return typeof part === "object" && part !== null && "functionCall" in part; });
        var toolCall = asRecord(toolCallPart);
        (0, vitest_1.expect)(toolCall.functionCall).toBeTruthy();
    });
    (0, vitest_1.it)("strips tool call and response ids for google-gemini-cli", function () {
        var model = makeGeminiCliModel("gemini-3-flash");
        var context = {
            messages: [
                {
                    role: "user",
                    content: "Use a tool",
                },
                {
                    role: "assistant",
                    content: [
                        {
                            type: "toolCall",
                            id: "call_1",
                            name: "myTool",
                            arguments: { arg: "value" },
                            thoughtSignature: "dGVzdA==",
                        },
                    ],
                    api: "google-gemini-cli",
                    provider: "google-gemini-cli",
                    model: "gemini-3-flash",
                    usage: {
                        input: 0,
                        output: 0,
                        cacheRead: 0,
                        cacheWrite: 0,
                        totalTokens: 0,
                        cost: {
                            input: 0,
                            output: 0,
                            cacheRead: 0,
                            cacheWrite: 0,
                            total: 0,
                        },
                    },
                    stopReason: "stop",
                    timestamp: 0,
                },
                {
                    role: "toolResult",
                    toolCallId: "call_1",
                    toolName: "myTool",
                    content: [{ type: "text", text: "Tool result" }],
                    isError: false,
                    timestamp: 0,
                },
            ],
        };
        var contents = (0, google_shared_js_1.convertMessages)(model, context);
        var parts = contents.flatMap(function (content) { var _a; return (_a = content.parts) !== null && _a !== void 0 ? _a : []; });
        var toolCallPart = parts.find(function (part) { return typeof part === "object" && part !== null && "functionCall" in part; });
        var toolResponsePart = parts.find(function (part) { return typeof part === "object" && part !== null && "functionResponse" in part; });
        var toolCall = asRecord(toolCallPart);
        var toolResponse = asRecord(toolResponsePart);
        (0, vitest_1.expect)(asRecord(toolCall.functionCall).id).toBeUndefined();
        (0, vitest_1.expect)(asRecord(toolResponse.functionResponse).id).toBeUndefined();
    });
});
