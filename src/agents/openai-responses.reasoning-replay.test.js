"use strict";
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
var pi_ai_1 = require("@mariozechner/pi-ai");
var typebox_1 = require("@sinclair/typebox");
var vitest_1 = require("vitest");
function buildModel() {
    return {
        id: "gpt-5.2",
        name: "gpt-5.2",
        api: "openai-responses",
        provider: "openai",
        baseUrl: "https://api.openai.com/v1",
        reasoning: true,
        input: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 128000,
        maxTokens: 4096,
    };
}
function installFailingFetchCapture() {
    var _this = this;
    var originalFetch = globalThis.fetch;
    var lastBody;
    var fetchImpl = function (_input, init) { return __awaiter(_this, void 0, void 0, function () {
        var rawBody, bodyText;
        return __generator(this, function (_a) {
            rawBody = init === null || init === void 0 ? void 0 : init.body;
            bodyText = (function () {
                if (!rawBody) {
                    return "";
                }
                if (typeof rawBody === "string") {
                    return rawBody;
                }
                if (rawBody instanceof Uint8Array) {
                    return Buffer.from(rawBody).toString("utf8");
                }
                if (rawBody instanceof ArrayBuffer) {
                    return Buffer.from(new Uint8Array(rawBody)).toString("utf8");
                }
                return String(rawBody);
            })();
            lastBody = bodyText ? JSON.parse(bodyText) : undefined;
            throw new Error("intentional fetch abort (test)");
        });
    }); };
    globalThis.fetch = fetchImpl;
    return {
        getLastBody: function () { return lastBody; },
        restore: function () {
            globalThis.fetch = originalFetch;
        },
    };
}
(0, vitest_1.describe)("openai-responses reasoning replay", function () {
    (0, vitest_1.it)("replays reasoning for tool-call-only turns (OpenAI requires it)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cap, model, assistantToolOnly, toolResult, stream, body, input, types;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cap = installFailingFetchCapture();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    model = buildModel();
                    assistantToolOnly = {
                        role: "assistant",
                        api: "openai-responses",
                        provider: "openai",
                        model: "gpt-5.2",
                        usage: {
                            input: 0,
                            output: 0,
                            cacheRead: 0,
                            cacheWrite: 0,
                            totalTokens: 0,
                            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
                        },
                        stopReason: "toolUse",
                        timestamp: Date.now(),
                        content: [
                            {
                                type: "thinking",
                                thinking: "internal",
                                thinkingSignature: JSON.stringify({
                                    type: "reasoning",
                                    id: "rs_test",
                                    summary: [],
                                }),
                            },
                            {
                                type: "toolCall",
                                id: "call_123|fc_123",
                                name: "noop",
                                arguments: {},
                            },
                        ],
                    };
                    toolResult = {
                        role: "toolResult",
                        toolCallId: "call_123|fc_123",
                        toolName: "noop",
                        content: [{ type: "text", text: "ok" }],
                        isError: false,
                        timestamp: Date.now(),
                    };
                    stream = (0, pi_ai_1.streamOpenAIResponses)(model, {
                        systemPrompt: "system",
                        messages: [
                            {
                                role: "user",
                                content: "Call noop.",
                                timestamp: Date.now(),
                            },
                            assistantToolOnly,
                            toolResult,
                            {
                                role: "user",
                                content: "Now reply with ok.",
                                timestamp: Date.now(),
                            },
                        ],
                        tools: [
                            {
                                name: "noop",
                                description: "no-op",
                                parameters: typebox_1.Type.Object({}, { additionalProperties: false }),
                            },
                        ],
                    }, { apiKey: "test" });
                    return [4 /*yield*/, stream.result()];
                case 2:
                    _a.sent();
                    body = cap.getLastBody();
                    input = Array.isArray(body === null || body === void 0 ? void 0 : body.input) ? body === null || body === void 0 ? void 0 : body.input : [];
                    types = input
                        .map(function (item) {
                        return item && typeof item === "object" ? item.type : undefined;
                    })
                        .filter(function (t) { return typeof t === "string"; });
                    (0, vitest_1.expect)(types).toContain("reasoning");
                    (0, vitest_1.expect)(types).toContain("function_call");
                    (0, vitest_1.expect)(types.indexOf("reasoning")).toBeLessThan(types.indexOf("function_call"));
                    return [3 /*break*/, 4];
                case 3:
                    cap.restore();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("still replays reasoning when paired with an assistant message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cap, model, assistantWithText, stream, body, input, types;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cap = installFailingFetchCapture();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    model = buildModel();
                    assistantWithText = {
                        role: "assistant",
                        api: "openai-responses",
                        provider: "openai",
                        model: "gpt-5.2",
                        usage: {
                            input: 0,
                            output: 0,
                            cacheRead: 0,
                            cacheWrite: 0,
                            totalTokens: 0,
                            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
                        },
                        stopReason: "stop",
                        timestamp: Date.now(),
                        content: [
                            {
                                type: "thinking",
                                thinking: "internal",
                                thinkingSignature: JSON.stringify({
                                    type: "reasoning",
                                    id: "rs_test",
                                    summary: [],
                                }),
                            },
                            { type: "text", text: "hello", textSignature: "msg_test" },
                        ],
                    };
                    stream = (0, pi_ai_1.streamOpenAIResponses)(model, {
                        systemPrompt: "system",
                        messages: [
                            { role: "user", content: "Hi", timestamp: Date.now() },
                            assistantWithText,
                            { role: "user", content: "Ok", timestamp: Date.now() },
                        ],
                    }, { apiKey: "test" });
                    return [4 /*yield*/, stream.result()];
                case 2:
                    _a.sent();
                    body = cap.getLastBody();
                    input = Array.isArray(body === null || body === void 0 ? void 0 : body.input) ? body === null || body === void 0 ? void 0 : body.input : [];
                    types = input
                        .map(function (item) {
                        return item && typeof item === "object" ? item.type : undefined;
                    })
                        .filter(function (t) { return typeof t === "string"; });
                    (0, vitest_1.expect)(types).toContain("reasoning");
                    (0, vitest_1.expect)(types).toContain("message");
                    return [3 /*break*/, 4];
                case 3:
                    cap.restore();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
