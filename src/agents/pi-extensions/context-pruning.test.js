"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var context_pruning_js_1 = require("./context-pruning.js");
var runtime_js_1 = require("./context-pruning/runtime.js");
function toolText(msg) {
    if (msg.role !== "toolResult") {
        throw new Error("expected toolResult");
    }
    var first = msg.content.find(function (b) { return b.type === "text"; });
    if (!first || first.type !== "text") {
        return "";
    }
    return first.text;
}
function findToolResult(messages, toolCallId) {
    var msg = messages.find(function (m) { return m.role === "toolResult" && m.toolCallId === toolCallId; });
    if (!msg) {
        throw new Error("missing toolResult: ".concat(toolCallId));
    }
    return msg;
}
function makeToolResult(params) {
    return {
        role: "toolResult",
        toolCallId: params.toolCallId,
        toolName: params.toolName,
        content: [{ type: "text", text: params.text }],
        isError: false,
        timestamp: Date.now(),
    };
}
function makeImageToolResult(params) {
    return {
        role: "toolResult",
        toolCallId: params.toolCallId,
        toolName: params.toolName,
        content: [
            { type: "image", data: "AA==", mimeType: "image/png" },
            { type: "text", text: params.text },
        ],
        isError: false,
        timestamp: Date.now(),
    };
}
function makeAssistant(text) {
    return {
        role: "assistant",
        content: [{ type: "text", text: text }],
        api: "openai-responses",
        provider: "openai",
        model: "fake",
        usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, total: 2 },
        stopReason: "stop",
        timestamp: Date.now(),
    };
}
function makeUser(text) {
    return { role: "user", content: text, timestamp: Date.now() };
}
(0, vitest_1.describe)("context-pruning", function () {
    (0, vitest_1.it)("mode off disables pruning", function () {
        (0, vitest_1.expect)((0, context_pruning_js_1.computeEffectiveSettings)({ mode: "off" })).toBeNull();
        (0, vitest_1.expect)((0, context_pruning_js_1.computeEffectiveSettings)({})).toBeNull();
    });
    (0, vitest_1.it)("does not touch tool results after the last N assistants", function () {
        var messages = [
            makeUser("u1"),
            makeAssistant("a1"),
            makeToolResult({
                toolCallId: "t1",
                toolName: "exec",
                text: "x".repeat(20000),
            }),
            makeUser("u2"),
            makeAssistant("a2"),
            makeToolResult({
                toolCallId: "t2",
                toolName: "exec",
                text: "y".repeat(20000),
            }),
            makeUser("u3"),
            makeAssistant("a3"),
            makeToolResult({
                toolCallId: "t3",
                toolName: "exec",
                text: "z".repeat(20000),
            }),
            makeUser("u4"),
            makeAssistant("a4"),
            makeToolResult({
                toolCallId: "t4",
                toolName: "exec",
                text: "w".repeat(20000),
            }),
        ];
        var settings = __assign(__assign({}, context_pruning_js_1.DEFAULT_CONTEXT_PRUNING_SETTINGS), { keepLastAssistants: 3, softTrimRatio: 0.0, hardClearRatio: 0.0, minPrunableToolChars: 0, hardClear: { enabled: true, placeholder: "[cleared]" }, softTrim: { maxChars: 10, headChars: 3, tailChars: 3 } });
        var ctx = {
            model: { contextWindow: 1000 },
        };
        var next = (0, context_pruning_js_1.pruneContextMessages)({ messages: messages, settings: settings, ctx: ctx });
        (0, vitest_1.expect)(toolText(findToolResult(next, "t2"))).toContain("y".repeat(20000));
        (0, vitest_1.expect)(toolText(findToolResult(next, "t3"))).toContain("z".repeat(20000));
        (0, vitest_1.expect)(toolText(findToolResult(next, "t4"))).toContain("w".repeat(20000));
        (0, vitest_1.expect)(toolText(findToolResult(next, "t1"))).toBe("[cleared]");
    });
    (0, vitest_1.it)("never prunes tool results before the first user message", function () {
        var settings = __assign(__assign({}, context_pruning_js_1.DEFAULT_CONTEXT_PRUNING_SETTINGS), { keepLastAssistants: 0, softTrimRatio: 0.0, hardClearRatio: 0.0, minPrunableToolChars: 0, hardClear: { enabled: true, placeholder: "[cleared]" }, softTrim: { maxChars: 10, headChars: 3, tailChars: 3 } });
        var messages = [
            makeAssistant("bootstrap tool calls"),
            makeToolResult({
                toolCallId: "t0",
                toolName: "read",
                text: "x".repeat(20000),
            }),
            makeAssistant("greeting"),
            makeUser("u1"),
            makeToolResult({
                toolCallId: "t1",
                toolName: "exec",
                text: "y".repeat(20000),
            }),
        ];
        var next = (0, context_pruning_js_1.pruneContextMessages)({
            messages: messages,
            settings: settings,
            ctx: { model: { contextWindow: 1000 } },
            isToolPrunable: function () { return true; },
            contextWindowTokensOverride: 1000,
        });
        (0, vitest_1.expect)(toolText(findToolResult(next, "t0"))).toBe("x".repeat(20000));
        (0, vitest_1.expect)(toolText(findToolResult(next, "t1"))).toBe("[cleared]");
    });
    (0, vitest_1.it)("hard-clear removes eligible tool results before cutoff", function () {
        var messages = [
            makeUser("u1"),
            makeAssistant("a1"),
            makeToolResult({
                toolCallId: "t1",
                toolName: "exec",
                text: "x".repeat(20000),
            }),
            makeToolResult({
                toolCallId: "t2",
                toolName: "exec",
                text: "y".repeat(20000),
            }),
            makeUser("u2"),
            makeAssistant("a2"),
            makeToolResult({
                toolCallId: "t3",
                toolName: "exec",
                text: "z".repeat(20000),
            }),
        ];
        var settings = __assign(__assign({}, context_pruning_js_1.DEFAULT_CONTEXT_PRUNING_SETTINGS), { keepLastAssistants: 1, softTrimRatio: 10.0, hardClearRatio: 0.0, minPrunableToolChars: 0, hardClear: { enabled: true, placeholder: "[cleared]" } });
        var ctx = {
            model: { contextWindow: 1000 },
        };
        var next = (0, context_pruning_js_1.pruneContextMessages)({ messages: messages, settings: settings, ctx: ctx });
        (0, vitest_1.expect)(toolText(findToolResult(next, "t1"))).toBe("[cleared]");
        (0, vitest_1.expect)(toolText(findToolResult(next, "t2"))).toBe("[cleared]");
        // Tool results after the last assistant are protected.
        (0, vitest_1.expect)(toolText(findToolResult(next, "t3"))).toContain("z".repeat(20000));
    });
    (0, vitest_1.it)("uses contextWindow override when ctx.model is missing", function () {
        var messages = [
            makeUser("u1"),
            makeAssistant("a1"),
            makeToolResult({
                toolCallId: "t1",
                toolName: "exec",
                text: "x".repeat(20000),
            }),
            makeAssistant("a2"),
        ];
        var settings = __assign(__assign({}, context_pruning_js_1.DEFAULT_CONTEXT_PRUNING_SETTINGS), { keepLastAssistants: 0, softTrimRatio: 0, hardClearRatio: 0, minPrunableToolChars: 0, hardClear: { enabled: true, placeholder: "[cleared]" }, softTrim: { maxChars: 10, headChars: 3, tailChars: 3 } });
        var next = (0, context_pruning_js_1.pruneContextMessages)({
            messages: messages,
            settings: settings,
            ctx: { model: undefined },
            contextWindowTokensOverride: 1000,
        });
        (0, vitest_1.expect)(toolText(findToolResult(next, "t1"))).toBe("[cleared]");
    });
    (0, vitest_1.it)("reads per-session settings from registry", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionManager, messages, handler, api, result;
        return __generator(this, function (_a) {
            sessionManager = {};
            (0, runtime_js_1.setContextPruningRuntime)(sessionManager, {
                settings: __assign(__assign({}, context_pruning_js_1.DEFAULT_CONTEXT_PRUNING_SETTINGS), { keepLastAssistants: 0, softTrimRatio: 0, hardClearRatio: 0, minPrunableToolChars: 0, hardClear: { enabled: true, placeholder: "[cleared]" }, softTrim: { maxChars: 10, headChars: 3, tailChars: 3 } }),
                contextWindowTokens: 1000,
                isToolPrunable: function () { return true; },
                lastCacheTouchAt: Date.now() - context_pruning_js_1.DEFAULT_CONTEXT_PRUNING_SETTINGS.ttlMs - 1000,
            });
            messages = [
                makeUser("u1"),
                makeAssistant("a1"),
                makeToolResult({
                    toolCallId: "t1",
                    toolName: "exec",
                    text: "x".repeat(20000),
                }),
                makeAssistant("a2"),
            ];
            api = {
                on: function (name, fn) {
                    if (name === "context") {
                        handler = fn;
                    }
                },
                appendEntry: function (_type, _data) { },
            };
            (0, context_pruning_js_1.default)(api);
            if (!handler) {
                throw new Error("missing context handler");
            }
            result = handler({ messages: messages }, {
                model: undefined,
                sessionManager: sessionManager,
            });
            if (!result) {
                throw new Error("expected handler to return messages");
            }
            (0, vitest_1.expect)(toolText(findToolResult(result.messages, "t1"))).toBe("[cleared]");
            return [2 /*return*/];
        });
    }); });
    (0, vitest_1.it)("cache-ttl prunes once and resets the ttl window", function () {
        var sessionManager = {};
        var lastTouch = Date.now() - context_pruning_js_1.DEFAULT_CONTEXT_PRUNING_SETTINGS.ttlMs - 1000;
        (0, runtime_js_1.setContextPruningRuntime)(sessionManager, {
            settings: __assign(__assign({}, context_pruning_js_1.DEFAULT_CONTEXT_PRUNING_SETTINGS), { keepLastAssistants: 0, softTrimRatio: 0, hardClearRatio: 0, minPrunableToolChars: 0, hardClear: { enabled: true, placeholder: "[cleared]" }, softTrim: { maxChars: 10, headChars: 3, tailChars: 3 } }),
            contextWindowTokens: 1000,
            isToolPrunable: function () { return true; },
            lastCacheTouchAt: lastTouch,
        });
        var messages = [
            makeUser("u1"),
            makeAssistant("a1"),
            makeToolResult({
                toolCallId: "t1",
                toolName: "exec",
                text: "x".repeat(20000),
            }),
        ];
        var handler;
        var api = {
            on: function (name, fn) {
                if (name === "context") {
                    handler = fn;
                }
            },
            appendEntry: function (_type, _data) { },
        };
        (0, context_pruning_js_1.default)(api);
        if (!handler) {
            throw new Error("missing context handler");
        }
        var first = handler({ messages: messages }, {
            model: undefined,
            sessionManager: sessionManager,
        });
        if (!first) {
            throw new Error("expected first prune");
        }
        (0, vitest_1.expect)(toolText(findToolResult(first.messages, "t1"))).toBe("[cleared]");
        var runtime = (0, runtime_js_1.getContextPruningRuntime)(sessionManager);
        if (!(runtime === null || runtime === void 0 ? void 0 : runtime.lastCacheTouchAt)) {
            throw new Error("expected lastCacheTouchAt");
        }
        (0, vitest_1.expect)(runtime.lastCacheTouchAt).toBeGreaterThan(lastTouch);
        var second = handler({ messages: messages }, {
            model: undefined,
            sessionManager: sessionManager,
        });
        (0, vitest_1.expect)(second).toBeUndefined();
    });
    (0, vitest_1.it)("respects tools allow/deny (deny wins; wildcards supported)", function () {
        var messages = [
            makeUser("u1"),
            makeToolResult({
                toolCallId: "t1",
                toolName: "Exec",
                text: "x".repeat(20000),
            }),
            makeToolResult({
                toolCallId: "t2",
                toolName: "Browser",
                text: "y".repeat(20000),
            }),
        ];
        var settings = __assign(__assign({}, context_pruning_js_1.DEFAULT_CONTEXT_PRUNING_SETTINGS), { keepLastAssistants: 0, softTrimRatio: 0.0, hardClearRatio: 0.0, minPrunableToolChars: 0, tools: { allow: ["ex*"], deny: ["exec"] }, hardClear: { enabled: true, placeholder: "[cleared]" }, softTrim: { maxChars: 10, headChars: 3, tailChars: 3 } });
        var ctx = {
            model: { contextWindow: 1000 },
        };
        var next = (0, context_pruning_js_1.pruneContextMessages)({ messages: messages, settings: settings, ctx: ctx });
        // Deny wins => exec is not pruned, even though allow matches.
        (0, vitest_1.expect)(toolText(findToolResult(next, "t1"))).toContain("x".repeat(20000));
        // allow is non-empty and browser is not allowed => never pruned.
        (0, vitest_1.expect)(toolText(findToolResult(next, "t2"))).toContain("y".repeat(20000));
    });
    (0, vitest_1.it)("skips tool results that contain images (no soft trim, no hard clear)", function () {
        var messages = [
            makeUser("u1"),
            makeImageToolResult({
                toolCallId: "t1",
                toolName: "exec",
                text: "x".repeat(20000),
            }),
        ];
        var settings = __assign(__assign({}, context_pruning_js_1.DEFAULT_CONTEXT_PRUNING_SETTINGS), { keepLastAssistants: 0, softTrimRatio: 0.0, hardClearRatio: 0.0, minPrunableToolChars: 0, hardClear: { enabled: true, placeholder: "[cleared]" }, softTrim: { maxChars: 10, headChars: 3, tailChars: 3 } });
        var ctx = {
            model: { contextWindow: 1000 },
        };
        var next = (0, context_pruning_js_1.pruneContextMessages)({ messages: messages, settings: settings, ctx: ctx });
        var tool = findToolResult(next, "t1");
        if (!tool || tool.role !== "toolResult") {
            throw new Error("unexpected pruned message list shape");
        }
        (0, vitest_1.expect)(tool.content.some(function (b) { return b.type === "image"; })).toBe(true);
        (0, vitest_1.expect)(toolText(tool)).toContain("x".repeat(20000));
    });
    (0, vitest_1.it)("soft-trims across block boundaries", function () {
        var messages = [
            makeUser("u1"),
            {
                role: "toolResult",
                toolCallId: "t1",
                toolName: "exec",
                content: [
                    { type: "text", text: "AAAAA" },
                    { type: "text", text: "BBBBB" },
                ],
                isError: false,
                timestamp: Date.now(),
            },
        ];
        var settings = __assign(__assign({}, context_pruning_js_1.DEFAULT_CONTEXT_PRUNING_SETTINGS), { keepLastAssistants: 0, softTrimRatio: 0.0, hardClearRatio: 10.0, softTrim: { maxChars: 5, headChars: 7, tailChars: 3 } });
        var ctx = {
            model: { contextWindow: 1000 },
        };
        var next = (0, context_pruning_js_1.pruneContextMessages)({ messages: messages, settings: settings, ctx: ctx });
        var text = toolText(findToolResult(next, "t1"));
        (0, vitest_1.expect)(text).toContain("AAAAA\nB");
        (0, vitest_1.expect)(text).toContain("BBB");
        (0, vitest_1.expect)(text).toContain("[Tool result trimmed:");
    });
    (0, vitest_1.it)("soft-trims oversized tool results and preserves head/tail with a note", function () {
        var messages = [
            makeUser("u1"),
            makeToolResult({
                toolCallId: "t1",
                toolName: "exec",
                text: "abcdefghij".repeat(1000),
            }),
        ];
        var settings = __assign(__assign({}, context_pruning_js_1.DEFAULT_CONTEXT_PRUNING_SETTINGS), { keepLastAssistants: 0, softTrimRatio: 0.0, hardClearRatio: 10.0, minPrunableToolChars: 0, hardClear: { enabled: true, placeholder: "[cleared]" }, softTrim: { maxChars: 10, headChars: 6, tailChars: 6 } });
        var ctx = {
            model: { contextWindow: 1000 },
        };
        var next = (0, context_pruning_js_1.pruneContextMessages)({ messages: messages, settings: settings, ctx: ctx });
        var tool = findToolResult(next, "t1");
        var text = toolText(tool);
        (0, vitest_1.expect)(text).toContain("abcdef");
        (0, vitest_1.expect)(text).toContain("efghij");
        (0, vitest_1.expect)(text).toContain("[Tool result trimmed:");
    });
});
