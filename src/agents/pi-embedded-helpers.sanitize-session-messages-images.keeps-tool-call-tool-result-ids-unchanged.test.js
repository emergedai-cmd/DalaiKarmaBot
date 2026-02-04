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
var vitest_1 = require("vitest");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
(0, vitest_1.describe)("sanitizeSessionMessagesImages", function () {
    (0, vitest_1.it)("keeps tool call + tool result IDs unchanged by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var input, out, assistant, toolCall, toolResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = [
                        {
                            role: "assistant",
                            content: [
                                {
                                    type: "toolCall",
                                    id: "call_123|fc_456",
                                    name: "read",
                                    arguments: { path: "package.json" },
                                },
                            ],
                        },
                        {
                            role: "toolResult",
                            toolCallId: "call_123|fc_456",
                            toolName: "read",
                            content: [{ type: "text", text: "ok" }],
                            isError: false,
                        },
                    ];
                    return [4 /*yield*/, (0, pi_embedded_helpers_js_1.sanitizeSessionMessagesImages)(input, "test")];
                case 1:
                    out = _a.sent();
                    assistant = out[0];
                    (0, vitest_1.expect)(assistant.role).toBe("assistant");
                    (0, vitest_1.expect)(Array.isArray(assistant.content)).toBe(true);
                    toolCall = assistant.content.find(function (b) { return b.type === "toolCall"; });
                    (0, vitest_1.expect)(toolCall === null || toolCall === void 0 ? void 0 : toolCall.id).toBe("call_123|fc_456");
                    toolResult = out[1];
                    (0, vitest_1.expect)(toolResult.role).toBe("toolResult");
                    (0, vitest_1.expect)(toolResult.toolCallId).toBe("call_123|fc_456");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sanitizes tool call + tool result IDs in strict mode (alphanumeric only)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var input, out, assistant, toolCall, toolResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = [
                        {
                            role: "assistant",
                            content: [
                                {
                                    type: "toolCall",
                                    id: "call_123|fc_456",
                                    name: "read",
                                    arguments: { path: "package.json" },
                                },
                            ],
                        },
                        {
                            role: "toolResult",
                            toolCallId: "call_123|fc_456",
                            toolName: "read",
                            content: [{ type: "text", text: "ok" }],
                            isError: false,
                        },
                    ];
                    return [4 /*yield*/, (0, pi_embedded_helpers_js_1.sanitizeSessionMessagesImages)(input, "test", {
                            sanitizeToolCallIds: true,
                            toolCallIdMode: "strict",
                        })];
                case 1:
                    out = _a.sent();
                    assistant = out[0];
                    (0, vitest_1.expect)(assistant.role).toBe("assistant");
                    (0, vitest_1.expect)(Array.isArray(assistant.content)).toBe(true);
                    toolCall = assistant.content.find(function (b) { return b.type === "toolCall"; });
                    // Strict mode strips all non-alphanumeric characters
                    (0, vitest_1.expect)(toolCall === null || toolCall === void 0 ? void 0 : toolCall.id).toBe("call123fc456");
                    toolResult = out[1];
                    (0, vitest_1.expect)(toolResult.role).toBe("toolResult");
                    (0, vitest_1.expect)(toolResult.toolCallId).toBe("call123fc456");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not synthesize tool call input when missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var input, out, assistant, toolCall;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    input = [
                        {
                            role: "assistant",
                            content: [{ type: "toolCall", id: "call_1", name: "read" }],
                        },
                    ];
                    return [4 /*yield*/, (0, pi_embedded_helpers_js_1.sanitizeSessionMessagesImages)(input, "test")];
                case 1:
                    out = _b.sent();
                    assistant = out[0];
                    toolCall = (_a = assistant.content) === null || _a === void 0 ? void 0 : _a.find(function (b) { return b.type === "toolCall"; });
                    (0, vitest_1.expect)(toolCall).toBeTruthy();
                    (0, vitest_1.expect)("input" in (toolCall !== null && toolCall !== void 0 ? toolCall : {})).toBe(false);
                    (0, vitest_1.expect)("arguments" in (toolCall !== null && toolCall !== void 0 ? toolCall : {})).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
