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
var pi_embedded_subscribe_js_1 = require("./pi-embedded-subscribe.js");
(0, vitest_1.describe)("subscribeEmbeddedPiSession", function () {
    var _THINKING_TAG_CASES = [
        { tag: "think", open: "<think>", close: "</think>" },
        { tag: "thinking", open: "<thinking>", close: "</thinking>" },
        { tag: "thought", open: "<thought>", close: "</thought>" },
        { tag: "antthinking", open: "<antthinking>", close: "</antthinking>" },
    ];
    (0, vitest_1.it)("suppresses message_end block replies when the message tool already sent", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler, session, onBlockReply, messageText, assistantMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    session = {
                        subscribe: function (fn) {
                            handler = fn;
                            return function () { };
                        },
                    };
                    onBlockReply = vitest_1.vi.fn();
                    (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
                        session: session,
                        runId: "run",
                        onBlockReply: onBlockReply,
                        blockReplyBreak: "message_end",
                    });
                    messageText = "This is the answer.";
                    handler === null || handler === void 0 ? void 0 : handler({
                        type: "tool_execution_start",
                        toolName: "message",
                        toolCallId: "tool-message-1",
                        args: { action: "send", to: "+1555", message: messageText },
                    });
                    // Wait for async handler to complete
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    // Wait for async handler to complete
                    _a.sent();
                    handler === null || handler === void 0 ? void 0 : handler({
                        type: "tool_execution_end",
                        toolName: "message",
                        toolCallId: "tool-message-1",
                        isError: false,
                        result: "ok",
                    });
                    assistantMessage = {
                        role: "assistant",
                        content: [{ type: "text", text: messageText }],
                    };
                    handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
                    (0, vitest_1.expect)(onBlockReply).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not suppress message_end replies when message tool reports error", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler, session, onBlockReply, messageText, assistantMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    session = {
                        subscribe: function (fn) {
                            handler = fn;
                            return function () { };
                        },
                    };
                    onBlockReply = vitest_1.vi.fn();
                    (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
                        session: session,
                        runId: "run",
                        onBlockReply: onBlockReply,
                        blockReplyBreak: "message_end",
                    });
                    messageText = "Please retry the send.";
                    handler === null || handler === void 0 ? void 0 : handler({
                        type: "tool_execution_start",
                        toolName: "message",
                        toolCallId: "tool-message-err",
                        args: { action: "send", to: "+1555", message: messageText },
                    });
                    // Wait for async handler to complete
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    // Wait for async handler to complete
                    _a.sent();
                    handler === null || handler === void 0 ? void 0 : handler({
                        type: "tool_execution_end",
                        toolName: "message",
                        toolCallId: "tool-message-err",
                        isError: false,
                        result: { details: { status: "error" } },
                    });
                    assistantMessage = {
                        role: "assistant",
                        content: [{ type: "text", text: messageText }],
                    };
                    handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
                    (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("clears block reply state on message_start", function () {
        var handler;
        var session = {
            subscribe: function (fn) {
                handler = fn;
                return function () { };
            },
        };
        var onBlockReply = vitest_1.vi.fn();
        (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: session,
            runId: "run",
            onBlockReply: onBlockReply,
            blockReplyBreak: "text_end",
        });
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_start", message: { role: "assistant" } });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_delta", delta: "OK" },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_end" },
        });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
        // New assistant message with identical output should still emit.
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_start", message: { role: "assistant" } });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_delta", delta: "OK" },
        });
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: { type: "text_end" },
        });
        (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(2);
    });
});
