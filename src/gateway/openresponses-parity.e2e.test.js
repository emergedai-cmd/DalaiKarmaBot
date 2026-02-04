"use strict";
/**
 * OpenResponses Feature Parity E2E Tests
 *
 * Tests for input_image, input_file, and client-side tools (Hosted Tools)
 * support in the OpenResponses `/v1/responses` endpoint.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
(0, vitest_1.describe)("OpenResponses Feature Parity", function () {
    (0, vitest_1.describe)("Schema Validation", function () {
        (0, vitest_1.it)("should validate input_image with url source", function () { return __awaiter(void 0, void 0, void 0, function () {
            var InputImageContentPartSchema, validImage, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./open-responses.schema.js"); })];
                    case 1:
                        InputImageContentPartSchema = (_a.sent()).InputImageContentPartSchema;
                        validImage = {
                            type: "input_image",
                            source: {
                                type: "url",
                                url: "https://example.com/image.png",
                            },
                        };
                        result = InputImageContentPartSchema.safeParse(validImage);
                        (0, vitest_1.expect)(result.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should validate input_image with base64 source", function () { return __awaiter(void 0, void 0, void 0, function () {
            var InputImageContentPartSchema, validImage, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./open-responses.schema.js"); })];
                    case 1:
                        InputImageContentPartSchema = (_a.sent()).InputImageContentPartSchema;
                        validImage = {
                            type: "input_image",
                            source: {
                                type: "base64",
                                media_type: "image/png",
                                data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
                            },
                        };
                        result = InputImageContentPartSchema.safeParse(validImage);
                        (0, vitest_1.expect)(result.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should reject input_image with invalid mime type", function () { return __awaiter(void 0, void 0, void 0, function () {
            var InputImageContentPartSchema, invalidImage, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./open-responses.schema.js"); })];
                    case 1:
                        InputImageContentPartSchema = (_a.sent()).InputImageContentPartSchema;
                        invalidImage = {
                            type: "input_image",
                            source: {
                                type: "base64",
                                media_type: "application/json", // Not an image
                                data: "SGVsbG8gV29ybGQh",
                            },
                        };
                        result = InputImageContentPartSchema.safeParse(invalidImage);
                        (0, vitest_1.expect)(result.success).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should validate input_file with url source", function () { return __awaiter(void 0, void 0, void 0, function () {
            var InputFileContentPartSchema, validFile, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./open-responses.schema.js"); })];
                    case 1:
                        InputFileContentPartSchema = (_a.sent()).InputFileContentPartSchema;
                        validFile = {
                            type: "input_file",
                            source: {
                                type: "url",
                                url: "https://example.com/document.txt",
                            },
                        };
                        result = InputFileContentPartSchema.safeParse(validFile);
                        (0, vitest_1.expect)(result.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should validate input_file with base64 source", function () { return __awaiter(void 0, void 0, void 0, function () {
            var InputFileContentPartSchema, validFile, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./open-responses.schema.js"); })];
                    case 1:
                        InputFileContentPartSchema = (_a.sent()).InputFileContentPartSchema;
                        validFile = {
                            type: "input_file",
                            source: {
                                type: "base64",
                                media_type: "text/plain",
                                data: "SGVsbG8gV29ybGQh",
                                filename: "hello.txt",
                            },
                        };
                        result = InputFileContentPartSchema.safeParse(validFile);
                        (0, vitest_1.expect)(result.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should validate tool definition", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ToolDefinitionSchema, validTool, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./open-responses.schema.js"); })];
                    case 1:
                        ToolDefinitionSchema = (_a.sent()).ToolDefinitionSchema;
                        validTool = {
                            type: "function",
                            function: {
                                name: "get_weather",
                                description: "Get the current weather",
                                parameters: {
                                    type: "object",
                                    properties: {
                                        location: { type: "string" },
                                    },
                                    required: ["location"],
                                },
                            },
                        };
                        result = ToolDefinitionSchema.safeParse(validTool);
                        (0, vitest_1.expect)(result.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should reject tool definition without name", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ToolDefinitionSchema, invalidTool, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./open-responses.schema.js"); })];
                    case 1:
                        ToolDefinitionSchema = (_a.sent()).ToolDefinitionSchema;
                        invalidTool = {
                            type: "function",
                            function: {
                                name: "", // Empty name
                                description: "Get the current weather",
                            },
                        };
                        result = ToolDefinitionSchema.safeParse(invalidTool);
                        (0, vitest_1.expect)(result.success).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("CreateResponseBody Schema", function () {
        (0, vitest_1.it)("should validate request with input_image", function () { return __awaiter(void 0, void 0, void 0, function () {
            var CreateResponseBodySchema, validRequest, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./open-responses.schema.js"); })];
                    case 1:
                        CreateResponseBodySchema = (_a.sent()).CreateResponseBodySchema;
                        validRequest = {
                            model: "claude-sonnet-4-20250514",
                            input: [
                                {
                                    type: "message",
                                    role: "user",
                                    content: [
                                        {
                                            type: "input_image",
                                            source: {
                                                type: "url",
                                                url: "https://example.com/photo.jpg",
                                            },
                                        },
                                        {
                                            type: "input_text",
                                            text: "What's in this image?",
                                        },
                                    ],
                                },
                            ],
                        };
                        result = CreateResponseBodySchema.safeParse(validRequest);
                        (0, vitest_1.expect)(result.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should validate request with client tools", function () { return __awaiter(void 0, void 0, void 0, function () {
            var CreateResponseBodySchema, validRequest, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./open-responses.schema.js"); })];
                    case 1:
                        CreateResponseBodySchema = (_a.sent()).CreateResponseBodySchema;
                        validRequest = {
                            model: "claude-sonnet-4-20250514",
                            input: [
                                {
                                    type: "message",
                                    role: "user",
                                    content: "What's the weather?",
                                },
                            ],
                            tools: [
                                {
                                    type: "function",
                                    function: {
                                        name: "get_weather",
                                        description: "Get weather for a location",
                                        parameters: {
                                            type: "object",
                                            properties: {
                                                location: { type: "string" },
                                            },
                                            required: ["location"],
                                        },
                                    },
                                },
                            ],
                        };
                        result = CreateResponseBodySchema.safeParse(validRequest);
                        (0, vitest_1.expect)(result.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should validate request with function_call_output for turn-based tools", function () { return __awaiter(void 0, void 0, void 0, function () {
            var CreateResponseBodySchema, validRequest, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./open-responses.schema.js"); })];
                    case 1:
                        CreateResponseBodySchema = (_a.sent()).CreateResponseBodySchema;
                        validRequest = {
                            model: "claude-sonnet-4-20250514",
                            input: [
                                {
                                    type: "function_call_output",
                                    call_id: "call_123",
                                    output: '{"temperature": "72°F", "condition": "sunny"}',
                                },
                            ],
                        };
                        result = CreateResponseBodySchema.safeParse(validRequest);
                        (0, vitest_1.expect)(result.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should validate complete turn-based tool flow", function () { return __awaiter(void 0, void 0, void 0, function () {
            var CreateResponseBodySchema, turn1Request, turn1Result, turn2Request, turn2Result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./open-responses.schema.js"); })];
                    case 1:
                        CreateResponseBodySchema = (_a.sent()).CreateResponseBodySchema;
                        turn1Request = {
                            model: "claude-sonnet-4-20250514",
                            input: [
                                {
                                    type: "message",
                                    role: "user",
                                    content: "What's the weather in San Francisco?",
                                },
                            ],
                            tools: [
                                {
                                    type: "function",
                                    function: {
                                        name: "get_weather",
                                        description: "Get weather for a location",
                                    },
                                },
                            ],
                        };
                        turn1Result = CreateResponseBodySchema.safeParse(turn1Request);
                        (0, vitest_1.expect)(turn1Result.success).toBe(true);
                        turn2Request = {
                            model: "claude-sonnet-4-20250514",
                            input: [
                                {
                                    type: "function_call_output",
                                    call_id: "call_123",
                                    output: '{"temperature": "72°F", "condition": "sunny"}',
                                },
                            ],
                        };
                        turn2Result = CreateResponseBodySchema.safeParse(turn2Request);
                        (0, vitest_1.expect)(turn2Result.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("Response Resource Schema", function () {
        (0, vitest_1.it)("should validate response with function_call output", function () { return __awaiter(void 0, void 0, void 0, function () {
            var OutputItemSchema, functionCallOutput, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./open-responses.schema.js"); })];
                    case 1:
                        OutputItemSchema = (_a.sent()).OutputItemSchema;
                        functionCallOutput = {
                            type: "function_call",
                            id: "msg_123",
                            call_id: "call_456",
                            name: "get_weather",
                            arguments: '{"location": "San Francisco"}',
                        };
                        result = OutputItemSchema.safeParse(functionCallOutput);
                        (0, vitest_1.expect)(result.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("buildAgentPrompt", function () {
        (0, vitest_1.it)("should convert function_call_output to tool entry", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildAgentPrompt, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./openresponses-http.js"); })];
                    case 1:
                        buildAgentPrompt = (_a.sent()).buildAgentPrompt;
                        result = buildAgentPrompt([
                            {
                                type: "function_call_output",
                                call_id: "call_123",
                                output: '{"temperature": "72°F"}',
                            },
                        ]);
                        // When there's only a tool output (no history), returns just the body
                        (0, vitest_1.expect)(result.message).toBe('{"temperature": "72°F"}');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle mixed message and function_call_output items", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildAgentPrompt, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./openresponses-http.js"); })];
                    case 1:
                        buildAgentPrompt = (_a.sent()).buildAgentPrompt;
                        result = buildAgentPrompt([
                            {
                                type: "message",
                                role: "user",
                                content: "What's the weather?",
                            },
                            {
                                type: "function_call_output",
                                call_id: "call_123",
                                output: '{"temperature": "72°F"}',
                            },
                            {
                                type: "message",
                                role: "user",
                                content: "Thanks!",
                            },
                        ]);
                        // Should include both user messages and tool output
                        (0, vitest_1.expect)(result.message).toContain("weather");
                        (0, vitest_1.expect)(result.message).toContain("72°F");
                        (0, vitest_1.expect)(result.message).toContain("Thanks");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
