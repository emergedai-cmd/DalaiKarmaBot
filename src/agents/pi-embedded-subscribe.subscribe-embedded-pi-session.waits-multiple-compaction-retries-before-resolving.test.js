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
var agent_events_js_1 = require("../infra/agent-events.js");
var pi_embedded_subscribe_js_1 = require("./pi-embedded-subscribe.js");
(0, vitest_1.describe)("subscribeEmbeddedPiSession", function () {
    var _THINKING_TAG_CASES = [
        { tag: "think", open: "<think>", close: "</think>" },
        { tag: "thinking", open: "<thinking>", close: "</thinking>" },
        { tag: "thought", open: "<thought>", close: "</thought>" },
        { tag: "antthinking", open: "<antthinking>", close: "</antthinking>" },
    ];
    (0, vitest_1.it)("waits for multiple compaction retries before resolving", function () { return __awaiter(void 0, void 0, void 0, function () {
        var listeners, session, subscription, _i, listeners_1, listener, resolved, waitPromise, _a, listeners_2, listener, _b, listeners_3, listener;
        return __generator(this, function (_c) {
            switch (_c.label) {
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
                        runId: "run-3",
                    });
                    for (_i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
                        listener = listeners_1[_i];
                        listener({ type: "auto_compaction_end", willRetry: true });
                        listener({ type: "auto_compaction_end", willRetry: true });
                    }
                    resolved = false;
                    waitPromise = subscription.waitForCompactionRetry().then(function () {
                        resolved = true;
                    });
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(resolved).toBe(false);
                    for (_a = 0, listeners_2 = listeners; _a < listeners_2.length; _a++) {
                        listener = listeners_2[_a];
                        listener({ type: "agent_end" });
                    }
                    return [4 /*yield*/, Promise.resolve()];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(resolved).toBe(false);
                    for (_b = 0, listeners_3 = listeners; _b < listeners_3.length; _b++) {
                        listener = listeners_3[_b];
                        listener({ type: "agent_end" });
                    }
                    return [4 /*yield*/, waitPromise];
                case 3:
                    _c.sent();
                    (0, vitest_1.expect)(resolved).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("emits compaction events on the agent event bus", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler, session, events, stop;
        return __generator(this, function (_a) {
            session = {
                subscribe: function (fn) {
                    handler = fn;
                    return function () { };
                },
            };
            events = [];
            stop = (0, agent_events_js_1.onAgentEvent)(function (evt) {
                var _a, _b;
                if (evt.runId !== "run-compaction") {
                    return;
                }
                if (evt.stream !== "compaction") {
                    return;
                }
                var phase = typeof ((_a = evt.data) === null || _a === void 0 ? void 0 : _a.phase) === "string" ? evt.data.phase : "";
                events.push({
                    phase: phase,
                    willRetry: typeof ((_b = evt.data) === null || _b === void 0 ? void 0 : _b.willRetry) === "boolean" ? evt.data.willRetry : undefined,
                });
            });
            (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
                session: session,
                runId: "run-compaction",
            });
            handler === null || handler === void 0 ? void 0 : handler({ type: "auto_compaction_start" });
            handler === null || handler === void 0 ? void 0 : handler({ type: "auto_compaction_end", willRetry: true });
            handler === null || handler === void 0 ? void 0 : handler({ type: "auto_compaction_end", willRetry: false });
            stop();
            (0, vitest_1.expect)(events).toEqual([
                { phase: "start" },
                { phase: "end", willRetry: true },
                { phase: "end", willRetry: false },
            ]);
            return [2 /*return*/];
        });
    }); });
    (0, vitest_1.it)("emits tool summaries at tool start when verbose is on", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler, session, onToolResult, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    session = {
                        subscribe: function (fn) {
                            handler = fn;
                            return function () { };
                        },
                    };
                    onToolResult = vitest_1.vi.fn();
                    (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
                        session: session,
                        runId: "run-tool",
                        verboseLevel: "on",
                        onToolResult: onToolResult,
                    });
                    handler === null || handler === void 0 ? void 0 : handler({
                        type: "tool_execution_start",
                        toolName: "read",
                        toolCallId: "tool-1",
                        args: { path: "/tmp/a.txt" },
                    });
                    // Wait for async handler to complete
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    // Wait for async handler to complete
                    _a.sent();
                    (0, vitest_1.expect)(onToolResult).toHaveBeenCalledTimes(1);
                    payload = onToolResult.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.text).toContain("/tmp/a.txt");
                    handler === null || handler === void 0 ? void 0 : handler({
                        type: "tool_execution_end",
                        toolName: "read",
                        toolCallId: "tool-1",
                        isError: false,
                        result: "ok",
                    });
                    (0, vitest_1.expect)(onToolResult).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes browser action metadata in tool summaries", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler, session, onToolResult, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    session = {
                        subscribe: function (fn) {
                            handler = fn;
                            return function () { };
                        },
                    };
                    onToolResult = vitest_1.vi.fn();
                    (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
                        session: session,
                        runId: "run-browser-tool",
                        verboseLevel: "on",
                        onToolResult: onToolResult,
                    });
                    handler === null || handler === void 0 ? void 0 : handler({
                        type: "tool_execution_start",
                        toolName: "browser",
                        toolCallId: "tool-browser-1",
                        args: { action: "snapshot", targetUrl: "https://example.com" },
                    });
                    // Wait for async handler to complete
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    // Wait for async handler to complete
                    _a.sent();
                    (0, vitest_1.expect)(onToolResult).toHaveBeenCalledTimes(1);
                    payload = onToolResult.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.text).toContain("🌐");
                    (0, vitest_1.expect)(payload.text).toContain("Browser");
                    (0, vitest_1.expect)(payload.text).toContain("snapshot");
                    (0, vitest_1.expect)(payload.text).toContain("https://example.com");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("emits exec output in full verbose mode and includes PTY indicator", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler, session, onToolResult, summary, output, readOutput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    session = {
                        subscribe: function (fn) {
                            handler = fn;
                            return function () { };
                        },
                    };
                    onToolResult = vitest_1.vi.fn();
                    (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
                        session: session,
                        runId: "run-exec-full",
                        verboseLevel: "full",
                        onToolResult: onToolResult,
                    });
                    handler === null || handler === void 0 ? void 0 : handler({
                        type: "tool_execution_start",
                        toolName: "exec",
                        toolCallId: "tool-exec-1",
                        args: { command: "claude", pty: true },
                    });
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(onToolResult).toHaveBeenCalledTimes(1);
                    summary = onToolResult.mock.calls[0][0];
                    (0, vitest_1.expect)(summary.text).toContain("Exec");
                    (0, vitest_1.expect)(summary.text).toContain("pty");
                    handler === null || handler === void 0 ? void 0 : handler({
                        type: "tool_execution_end",
                        toolName: "exec",
                        toolCallId: "tool-exec-1",
                        isError: false,
                        result: { content: [{ type: "text", text: "hello\nworld" }] },
                    });
                    return [4 /*yield*/, Promise.resolve()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(onToolResult).toHaveBeenCalledTimes(2);
                    output = onToolResult.mock.calls[1][0];
                    (0, vitest_1.expect)(output.text).toContain("hello");
                    (0, vitest_1.expect)(output.text).toContain("```txt");
                    handler === null || handler === void 0 ? void 0 : handler({
                        type: "tool_execution_end",
                        toolName: "read",
                        toolCallId: "tool-read-1",
                        isError: false,
                        result: { content: [{ type: "text", text: "file data" }] },
                    });
                    return [4 /*yield*/, Promise.resolve()];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(onToolResult).toHaveBeenCalledTimes(3);
                    readOutput = onToolResult.mock.calls[2][0];
                    (0, vitest_1.expect)(readOutput.text).toContain("file data");
                    return [2 /*return*/];
            }
        });
    }); });
});
