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
    (0, vitest_1.it)("splits long single-line fenced blocks with reopen/close", function () {
        var _a, _b;
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
            blockReplyBreak: "message_end",
            blockReplyChunking: {
                minChars: 10,
                maxChars: 40,
                breakPreference: "paragraph",
            },
        });
        var text = "```json\n".concat("x".repeat(120), "\n```");
        handler === null || handler === void 0 ? void 0 : handler({
            type: "message_update",
            message: { role: "assistant" },
            assistantMessageEvent: {
                type: "text_delta",
                delta: text,
            },
        });
        var assistantMessage = {
            role: "assistant",
            content: [{ type: "text", text: text }],
        };
        handler === null || handler === void 0 ? void 0 : handler({ type: "message_end", message: assistantMessage });
        (0, vitest_1.expect)(onBlockReply.mock.calls.length).toBeGreaterThan(1);
        for (var _i = 0, _c = onBlockReply.mock.calls; _i < _c.length; _i++) {
            var call = _c[_i];
            var chunk = call[0].text;
            (0, vitest_1.expect)(chunk.startsWith("```json")).toBe(true);
            var fenceCount = (_b = (_a = chunk.match(/```/g)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
            (0, vitest_1.expect)(fenceCount).toBeGreaterThanOrEqual(2);
        }
    });
    (0, vitest_1.it)("waits for auto-compaction retry and clears buffered text", function () { return __awaiter(void 0, void 0, void 0, function () {
        var listeners, session, subscription, assistantMessage, _i, listeners_1, listener, _a, listeners_2, listener, resolved, waitPromise, _b, listeners_3, listener;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    listeners = [];
                    session = {
                        subscribe: function (listener) {
                            listeners.push(listener);
                            return function () {
                                var index = listeners.indexOf(listener);
                                if (index !== -1) {
                                    listeners.splice(index, 1);
                                }
                            };
                        },
                    };
                    subscription = (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
                        session: session,
                        runId: "run-1",
                    });
                    assistantMessage = {
                        role: "assistant",
                        content: [{ type: "text", text: "oops" }],
                    };
                    for (_i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
                        listener = listeners_1[_i];
                        listener({ type: "message_end", message: assistantMessage });
                    }
                    (0, vitest_1.expect)(subscription.assistantTexts.length).toBe(1);
                    for (_a = 0, listeners_2 = listeners; _a < listeners_2.length; _a++) {
                        listener = listeners_2[_a];
                        listener({
                            type: "auto_compaction_end",
                            willRetry: true,
                        });
                    }
                    (0, vitest_1.expect)(subscription.isCompacting()).toBe(true);
                    (0, vitest_1.expect)(subscription.assistantTexts.length).toBe(0);
                    resolved = false;
                    waitPromise = subscription.waitForCompactionRetry().then(function () {
                        resolved = true;
                    });
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(resolved).toBe(false);
                    for (_b = 0, listeners_3 = listeners; _b < listeners_3.length; _b++) {
                        listener = listeners_3[_b];
                        listener({ type: "agent_end" });
                    }
                    return [4 /*yield*/, waitPromise];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(resolved).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("resolves after compaction ends without retry", function () { return __awaiter(void 0, void 0, void 0, function () {
        var listeners, session, subscription, _i, listeners_4, listener, resolved, waitPromise, _a, listeners_5, listener;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    listeners = [];
                    session = {
                        subscribe: function (listener) {
                            listeners.push(listener);
                            return function () { };
                        },
                    };
                    subscription = (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
                        session: session,
                        runId: "run-2",
                    });
                    for (_i = 0, listeners_4 = listeners; _i < listeners_4.length; _i++) {
                        listener = listeners_4[_i];
                        listener({ type: "auto_compaction_start" });
                    }
                    (0, vitest_1.expect)(subscription.isCompacting()).toBe(true);
                    resolved = false;
                    waitPromise = subscription.waitForCompactionRetry().then(function () {
                        resolved = true;
                    });
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(resolved).toBe(false);
                    for (_a = 0, listeners_5 = listeners; _a < listeners_5.length; _a++) {
                        listener = listeners_5[_a];
                        listener({ type: "auto_compaction_end", willRetry: false });
                    }
                    return [4 /*yield*/, waitPromise];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(resolved).toBe(true);
                    (0, vitest_1.expect)(subscription.isCompacting()).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
