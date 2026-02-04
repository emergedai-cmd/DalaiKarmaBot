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
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var vitest_1 = require("vitest");
var google_js_1 = require("./pi-embedded-runner/google.js");
(0, vitest_1.describe)("sanitizeSessionHistory (google thinking)", function () {
    (0, vitest_1.it)("keeps thinking blocks without signatures for Google models", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionManager, input, out, assistant;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sessionManager = pi_coding_agent_1.SessionManager.inMemory();
                    input = [
                        {
                            role: "user",
                            content: "hi",
                        },
                        {
                            role: "assistant",
                            content: [{ type: "thinking", thinking: "reasoning" }],
                        },
                    ];
                    return [4 /*yield*/, (0, google_js_1.sanitizeSessionHistory)({
                            messages: input,
                            modelApi: "google-antigravity",
                            sessionManager: sessionManager,
                            sessionId: "session:google",
                        })];
                case 1:
                    out = _d.sent();
                    assistant = out.find(function (msg) { return msg.role === "assistant"; });
                    (0, vitest_1.expect)((_a = assistant.content) === null || _a === void 0 ? void 0 : _a.map(function (block) { return block.type; })).toEqual(["thinking"]);
                    (0, vitest_1.expect)((_c = (_b = assistant.content) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.thinking).toBe("reasoning");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps thinking blocks with signatures for Google models", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionManager, input, out, assistant;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    sessionManager = pi_coding_agent_1.SessionManager.inMemory();
                    input = [
                        {
                            role: "user",
                            content: "hi",
                        },
                        {
                            role: "assistant",
                            content: [{ type: "thinking", thinking: "reasoning", thinkingSignature: "sig" }],
                        },
                    ];
                    return [4 /*yield*/, (0, google_js_1.sanitizeSessionHistory)({
                            messages: input,
                            modelApi: "google-antigravity",
                            sessionManager: sessionManager,
                            sessionId: "session:google",
                        })];
                case 1:
                    out = _f.sent();
                    assistant = out.find(function (msg) { return msg.role === "assistant"; });
                    (0, vitest_1.expect)((_a = assistant.content) === null || _a === void 0 ? void 0 : _a.map(function (block) { return block.type; })).toEqual(["thinking"]);
                    (0, vitest_1.expect)((_c = (_b = assistant.content) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.thinking).toBe("reasoning");
                    (0, vitest_1.expect)((_e = (_d = assistant.content) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.thinkingSignature).toBe("sig");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps thinking blocks with Anthropic-style signatures for Google models", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionManager, input, out, assistant;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sessionManager = pi_coding_agent_1.SessionManager.inMemory();
                    input = [
                        {
                            role: "user",
                            content: "hi",
                        },
                        {
                            role: "assistant",
                            content: [{ type: "thinking", thinking: "reasoning", signature: "sig" }],
                        },
                    ];
                    return [4 /*yield*/, (0, google_js_1.sanitizeSessionHistory)({
                            messages: input,
                            modelApi: "google-antigravity",
                            sessionManager: sessionManager,
                            sessionId: "session:google",
                        })];
                case 1:
                    out = _d.sent();
                    assistant = out.find(function (msg) { return msg.role === "assistant"; });
                    (0, vitest_1.expect)((_a = assistant.content) === null || _a === void 0 ? void 0 : _a.map(function (block) { return block.type; })).toEqual(["thinking"]);
                    (0, vitest_1.expect)((_c = (_b = assistant.content) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.thinking).toBe("reasoning");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("drops unsigned thinking blocks for Antigravity Claude", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionManager, input, out, assistant;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionManager = pi_coding_agent_1.SessionManager.inMemory();
                    input = [
                        {
                            role: "user",
                            content: "hi",
                        },
                        {
                            role: "assistant",
                            content: [{ type: "thinking", thinking: "reasoning" }],
                        },
                    ];
                    return [4 /*yield*/, (0, google_js_1.sanitizeSessionHistory)({
                            messages: input,
                            modelApi: "google-antigravity",
                            modelId: "anthropic/claude-3.5-sonnet",
                            sessionManager: sessionManager,
                            sessionId: "session:antigravity-claude",
                        })];
                case 1:
                    out = _a.sent();
                    assistant = out.find(function (msg) { return msg.role === "assistant"; });
                    (0, vitest_1.expect)(assistant).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("maps base64 signatures to thinkingSignature for Antigravity Claude", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionManager, input, out, assistant;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    sessionManager = pi_coding_agent_1.SessionManager.inMemory();
                    input = [
                        {
                            role: "user",
                            content: "hi",
                        },
                        {
                            role: "assistant",
                            content: [{ type: "thinking", thinking: "reasoning", signature: "c2ln" }],
                        },
                    ];
                    return [4 /*yield*/, (0, google_js_1.sanitizeSessionHistory)({
                            messages: input,
                            modelApi: "google-antigravity",
                            modelId: "anthropic/claude-3.5-sonnet",
                            sessionManager: sessionManager,
                            sessionId: "session:antigravity-claude",
                        })];
                case 1:
                    out = _f.sent();
                    assistant = out.find(function (msg) { return msg.role === "assistant"; });
                    (0, vitest_1.expect)((_a = assistant.content) === null || _a === void 0 ? void 0 : _a.map(function (block) { return block.type; })).toEqual(["thinking"]);
                    (0, vitest_1.expect)((_c = (_b = assistant.content) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.thinking).toBe("reasoning");
                    (0, vitest_1.expect)((_e = (_d = assistant.content) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.thinkingSignature).toBe("c2ln");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("preserves order for mixed assistant content", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionManager, input, out, assistant;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sessionManager = pi_coding_agent_1.SessionManager.inMemory();
                    input = [
                        {
                            role: "user",
                            content: "hi",
                        },
                        {
                            role: "assistant",
                            content: [
                                { type: "text", text: "hello" },
                                { type: "thinking", thinking: "internal note" },
                                { type: "text", text: "world" },
                            ],
                        },
                    ];
                    return [4 /*yield*/, (0, google_js_1.sanitizeSessionHistory)({
                            messages: input,
                            modelApi: "google-antigravity",
                            sessionManager: sessionManager,
                            sessionId: "session:google-mixed",
                        })];
                case 1:
                    out = _d.sent();
                    assistant = out.find(function (msg) { return msg.role === "assistant"; });
                    (0, vitest_1.expect)((_a = assistant.content) === null || _a === void 0 ? void 0 : _a.map(function (block) { return block.type; })).toEqual(["text", "thinking", "text"]);
                    (0, vitest_1.expect)((_c = (_b = assistant.content) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.thinking).toBe("internal note");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("strips non-base64 thought signatures for OpenRouter Gemini", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionManager, input, out, assistant;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionManager = pi_coding_agent_1.SessionManager.inMemory();
                    input = [
                        {
                            role: "user",
                            content: "hi",
                        },
                        {
                            role: "assistant",
                            content: [
                                { type: "text", text: "hello", thought_signature: "msg_abc123" },
                                { type: "thinking", thinking: "ok", thought_signature: "c2ln" },
                                {
                                    type: "toolCall",
                                    id: "call_1",
                                    name: "read",
                                    arguments: { path: "/tmp/foo" },
                                    thoughtSignature: '{"id":1}',
                                },
                                {
                                    type: "toolCall",
                                    id: "call_2",
                                    name: "read",
                                    arguments: { path: "/tmp/bar" },
                                    thoughtSignature: "c2ln",
                                },
                            ],
                        },
                    ];
                    return [4 /*yield*/, (0, google_js_1.sanitizeSessionHistory)({
                            messages: input,
                            modelApi: "openrouter",
                            provider: "openrouter",
                            modelId: "google/gemini-1.5-pro",
                            sessionManager: sessionManager,
                            sessionId: "session:openrouter-gemini",
                        })];
                case 1:
                    out = _a.sent();
                    assistant = out.find(function (msg) { return msg.role === "assistant"; });
                    (0, vitest_1.expect)(assistant.content).toEqual([
                        { type: "text", text: "hello" },
                        { type: "thinking", thinking: "ok", thought_signature: "c2ln" },
                        {
                            type: "toolCall",
                            id: "call_1",
                            name: "read",
                            arguments: { path: "/tmp/foo" },
                        },
                        {
                            type: "toolCall",
                            id: "call_2",
                            name: "read",
                            arguments: { path: "/tmp/bar" },
                            thoughtSignature: "c2ln",
                        },
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps mixed signed/unsigned thinking blocks for Google models", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionManager, input, out, assistant;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    sessionManager = pi_coding_agent_1.SessionManager.inMemory();
                    input = [
                        {
                            role: "user",
                            content: "hi",
                        },
                        {
                            role: "assistant",
                            content: [
                                { type: "thinking", thinking: "signed", thinkingSignature: "sig" },
                                { type: "thinking", thinking: "unsigned" },
                            ],
                        },
                    ];
                    return [4 /*yield*/, (0, google_js_1.sanitizeSessionHistory)({
                            messages: input,
                            modelApi: "google-antigravity",
                            sessionManager: sessionManager,
                            sessionId: "session:google-mixed-signatures",
                        })];
                case 1:
                    out = _f.sent();
                    assistant = out.find(function (msg) { return msg.role === "assistant"; });
                    (0, vitest_1.expect)((_a = assistant.content) === null || _a === void 0 ? void 0 : _a.map(function (block) { return block.type; })).toEqual(["thinking", "thinking"]);
                    (0, vitest_1.expect)((_c = (_b = assistant.content) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.thinking).toBe("signed");
                    (0, vitest_1.expect)((_e = (_d = assistant.content) === null || _d === void 0 ? void 0 : _d[1]) === null || _e === void 0 ? void 0 : _e.thinking).toBe("unsigned");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps empty thinking blocks for Google models", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionManager, input, out, assistant;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sessionManager = pi_coding_agent_1.SessionManager.inMemory();
                    input = [
                        {
                            role: "user",
                            content: "hi",
                        },
                        {
                            role: "assistant",
                            content: [{ type: "thinking", thinking: "   " }],
                        },
                    ];
                    return [4 /*yield*/, (0, google_js_1.sanitizeSessionHistory)({
                            messages: input,
                            modelApi: "google-antigravity",
                            sessionManager: sessionManager,
                            sessionId: "session:google-empty",
                        })];
                case 1:
                    out = _b.sent();
                    assistant = out.find(function (msg) { return msg.role === "assistant"; });
                    (0, vitest_1.expect)((_a = assistant === null || assistant === void 0 ? void 0 : assistant.content) === null || _a === void 0 ? void 0 : _a.map(function (block) { return block.type; })).toEqual(["thinking"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps thinking blocks for non-Google models", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionManager, input, out, assistant;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sessionManager = pi_coding_agent_1.SessionManager.inMemory();
                    input = [
                        {
                            role: "user",
                            content: "hi",
                        },
                        {
                            role: "assistant",
                            content: [{ type: "thinking", thinking: "reasoning" }],
                        },
                    ];
                    return [4 /*yield*/, (0, google_js_1.sanitizeSessionHistory)({
                            messages: input,
                            modelApi: "openai",
                            sessionManager: sessionManager,
                            sessionId: "session:openai",
                        })];
                case 1:
                    out = _b.sent();
                    assistant = out.find(function (msg) { return msg.role === "assistant"; });
                    (0, vitest_1.expect)((_a = assistant.content) === null || _a === void 0 ? void 0 : _a.map(function (block) { return block.type; })).toEqual(["thinking"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sanitizes tool call ids for Google APIs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionManager, longId, input, out, assistant, toolCall, toolResult;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    sessionManager = pi_coding_agent_1.SessionManager.inMemory();
                    longId = "call_".concat("a".repeat(60));
                    input = [
                        {
                            role: "assistant",
                            content: [{ type: "toolCall", id: longId, name: "read", arguments: {} }],
                        },
                        {
                            role: "toolResult",
                            toolCallId: longId,
                            toolName: "read",
                            content: [{ type: "text", text: "ok" }],
                        },
                    ];
                    return [4 /*yield*/, (0, google_js_1.sanitizeSessionHistory)({
                            messages: input,
                            modelApi: "google-antigravity",
                            sessionManager: sessionManager,
                            sessionId: "session:google",
                        })];
                case 1:
                    out = _c.sent();
                    assistant = out.find(function (msg) { return msg.role === "assistant"; });
                    toolCall = (_a = assistant.content) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(toolCall.id).toBeDefined();
                    (0, vitest_1.expect)((_b = toolCall.id) === null || _b === void 0 ? void 0 : _b.length).toBeLessThanOrEqual(40);
                    toolResult = out.find(function (msg) { return msg.role === "toolResult"; });
                    (0, vitest_1.expect)(toolResult.toolCallId).toBe(toolCall.id);
                    return [2 /*return*/];
            }
        });
    }); });
});
