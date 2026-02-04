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
var _makeGeminiCliModel = function (id) {
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
    (0, vitest_1.it)("preserves parameters when type is missing", function () {
        var _a, _b, _c;
        var tools = [
            {
                name: "noType",
                description: "Tool with properties but no type",
                parameters: {
                    properties: {
                        action: { type: "string" },
                    },
                    required: ["action"],
                },
            },
        ];
        var converted = (0, google_shared_js_1.convertTools)(tools);
        var params = asRecord((_c = (_b = (_a = converted === null || converted === void 0 ? void 0 : converted[0]) === null || _a === void 0 ? void 0 : _a.functionDeclarations) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.parameters);
        (0, vitest_1.expect)(params.type).toBeUndefined();
        (0, vitest_1.expect)(params.properties).toBeDefined();
        (0, vitest_1.expect)(params.required).toEqual(["action"]);
    });
    (0, vitest_1.it)("keeps unsupported JSON Schema keywords intact", function () {
        var _a, _b, _c;
        var tools = [
            {
                name: "example",
                description: "Example tool",
                parameters: {
                    type: "object",
                    patternProperties: {
                        "^x-": { type: "string" },
                    },
                    additionalProperties: false,
                    properties: {
                        mode: {
                            type: "string",
                            const: "fast",
                        },
                        options: {
                            anyOf: [{ type: "string" }, { type: "number" }],
                        },
                        list: {
                            type: "array",
                            items: {
                                type: "string",
                                const: "item",
                            },
                        },
                    },
                    required: ["mode"],
                },
            },
        ];
        var converted = (0, google_shared_js_1.convertTools)(tools);
        var params = asRecord((_c = (_b = (_a = converted === null || converted === void 0 ? void 0 : converted[0]) === null || _a === void 0 ? void 0 : _a.functionDeclarations) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.parameters);
        var properties = asRecord(params.properties);
        var mode = asRecord(properties.mode);
        var options = asRecord(properties.options);
        var list = asRecord(properties.list);
        var items = asRecord(list.items);
        (0, vitest_1.expect)(params.patternProperties).toEqual({ "^x-": { type: "string" } });
        (0, vitest_1.expect)(params.additionalProperties).toBe(false);
        (0, vitest_1.expect)(mode.const).toBe("fast");
        (0, vitest_1.expect)(options.anyOf).toEqual([{ type: "string" }, { type: "number" }]);
        (0, vitest_1.expect)(items.const).toBe("item");
        (0, vitest_1.expect)(params.required).toEqual(["mode"]);
    });
    (0, vitest_1.it)("keeps supported schema fields", function () {
        var _a, _b, _c;
        var tools = [
            {
                name: "settings",
                description: "Settings tool",
                parameters: {
                    type: "object",
                    properties: {
                        config: {
                            type: "object",
                            properties: {
                                retries: { type: "number", minimum: 1 },
                                tags: {
                                    type: "array",
                                    items: { type: "string" },
                                },
                            },
                            required: ["retries"],
                        },
                    },
                    required: ["config"],
                },
            },
        ];
        var converted = (0, google_shared_js_1.convertTools)(tools);
        var params = asRecord((_c = (_b = (_a = converted === null || converted === void 0 ? void 0 : converted[0]) === null || _a === void 0 ? void 0 : _a.functionDeclarations) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.parameters);
        var config = asRecord(asRecord(params.properties).config);
        var configProps = asRecord(config.properties);
        var retries = asRecord(configProps.retries);
        var tags = asRecord(configProps.tags);
        var items = asRecord(tags.items);
        (0, vitest_1.expect)(params.type).toBe("object");
        (0, vitest_1.expect)(config.type).toBe("object");
        (0, vitest_1.expect)(retries.minimum).toBe(1);
        (0, vitest_1.expect)(tags.type).toBe("array");
        (0, vitest_1.expect)(items.type).toBe("string");
        (0, vitest_1.expect)(config.required).toEqual(["retries"]);
        (0, vitest_1.expect)(params.required).toEqual(["config"]);
    });
});
(0, vitest_1.describe)("google-shared convertMessages", function () {
    (0, vitest_1.it)("keeps thinking blocks when provider/model match", function () {
        var _a;
        var model = makeModel("gemini-1.5-pro");
        var context = {
            messages: [
                {
                    role: "assistant",
                    content: [
                        {
                            type: "thinking",
                            thinking: "hidden",
                            thinkingSignature: "c2ln",
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
        (0, vitest_1.expect)(contents).toHaveLength(1);
        (0, vitest_1.expect)(contents[0].role).toBe("model");
        (0, vitest_1.expect)((_a = contents[0].parts) === null || _a === void 0 ? void 0 : _a[0]).toMatchObject({
            thought: true,
            thoughtSignature: "c2ln",
        });
    });
    (0, vitest_1.it)("keeps thought signatures for Claude models", function () {
        var _a, _b;
        var model = makeModel("claude-3-opus");
        var context = {
            messages: [
                {
                    role: "assistant",
                    content: [
                        {
                            type: "thinking",
                            thinking: "structured",
                            thinkingSignature: "c2ln",
                        },
                    ],
                    api: "google-generative-ai",
                    provider: "google",
                    model: "claude-3-opus",
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
        var parts = (_b = (_a = contents === null || contents === void 0 ? void 0 : contents[0]) === null || _a === void 0 ? void 0 : _a.parts) !== null && _b !== void 0 ? _b : [];
        (0, vitest_1.expect)(parts).toHaveLength(1);
        (0, vitest_1.expect)(parts[0]).toMatchObject({
            thought: true,
            thoughtSignature: "c2ln",
        });
    });
    (0, vitest_1.it)("does not merge consecutive user messages for Gemini", function () {
        var model = makeModel("gemini-1.5-pro");
        var context = {
            messages: [
                {
                    role: "user",
                    content: "Hello",
                },
                {
                    role: "user",
                    content: "How are you?",
                },
            ],
        };
        var contents = (0, google_shared_js_1.convertMessages)(model, context);
        (0, vitest_1.expect)(contents).toHaveLength(2);
        (0, vitest_1.expect)(contents[0].role).toBe("user");
        (0, vitest_1.expect)(contents[1].role).toBe("user");
        (0, vitest_1.expect)(contents[0].parts).toHaveLength(1);
        (0, vitest_1.expect)(contents[1].parts).toHaveLength(1);
    });
    (0, vitest_1.it)("does not merge consecutive user messages for non-Gemini Google models", function () {
        var model = makeModel("claude-3-opus");
        var context = {
            messages: [
                {
                    role: "user",
                    content: "First",
                },
                {
                    role: "user",
                    content: "Second",
                },
            ],
        };
        var contents = (0, google_shared_js_1.convertMessages)(model, context);
        (0, vitest_1.expect)(contents).toHaveLength(2);
        (0, vitest_1.expect)(contents[0].role).toBe("user");
        (0, vitest_1.expect)(contents[1].role).toBe("user");
        (0, vitest_1.expect)(contents[0].parts).toHaveLength(1);
        (0, vitest_1.expect)(contents[1].parts).toHaveLength(1);
    });
    (0, vitest_1.it)("does not merge consecutive model messages for Gemini", function () {
        var model = makeModel("gemini-1.5-pro");
        var context = {
            messages: [
                {
                    role: "user",
                    content: "Hello",
                },
                {
                    role: "assistant",
                    content: [{ type: "text", text: "Hi there!" }],
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
                    content: [{ type: "text", text: "How can I help?" }],
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
        (0, vitest_1.expect)(contents[1].parts).toHaveLength(1);
        (0, vitest_1.expect)(contents[2].parts).toHaveLength(1);
    });
    (0, vitest_1.it)("handles user message after tool result without model response in between", function () {
        var _a;
        var model = makeModel("gemini-1.5-pro");
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
                {
                    role: "toolResult",
                    toolCallId: "call_1",
                    toolName: "myTool",
                    content: [{ type: "text", text: "Tool result" }],
                    isError: false,
                    timestamp: 0,
                },
                {
                    role: "user",
                    content: "Now do something else",
                },
            ],
        };
        var contents = (0, google_shared_js_1.convertMessages)(model, context);
        (0, vitest_1.expect)(contents).toHaveLength(4);
        (0, vitest_1.expect)(contents[0].role).toBe("user");
        (0, vitest_1.expect)(contents[1].role).toBe("model");
        (0, vitest_1.expect)(contents[2].role).toBe("user");
        (0, vitest_1.expect)(contents[3].role).toBe("user");
        var toolResponsePart = (_a = contents[2].parts) === null || _a === void 0 ? void 0 : _a.find(function (part) { return typeof part === "object" && part !== null && "functionResponse" in part; });
        var toolResponse = asRecord(toolResponsePart);
        (0, vitest_1.expect)(toolResponse.functionResponse).toBeTruthy();
        (0, vitest_1.expect)(contents[3].role).toBe("user");
    });
});
