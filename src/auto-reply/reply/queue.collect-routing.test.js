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
var queue_js_1 = require("./queue.js");
function createRun(params) {
    return {
        prompt: params.prompt,
        messageId: params.messageId,
        enqueuedAt: Date.now(),
        originatingChannel: params.originatingChannel,
        originatingTo: params.originatingTo,
        originatingAccountId: params.originatingAccountId,
        originatingThreadId: params.originatingThreadId,
        run: {
            agentId: "agent",
            agentDir: "/tmp",
            sessionId: "sess",
            sessionFile: "/tmp/session.json",
            workspaceDir: "/tmp",
            config: {},
            provider: "openai",
            model: "gpt-test",
            timeoutMs: 10000,
            blockReplyBreak: "text_end",
        },
    };
}
(0, vitest_1.describe)("followup queue deduplication", function () {
    (0, vitest_1.it)("deduplicates messages with same Discord message_id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var key, calls, runFollowup, settings, first, second, third;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    key = "test-dedup-message-id-".concat(Date.now());
                    calls = [];
                    runFollowup = function (run) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            calls.push(run);
                            return [2 /*return*/];
                        });
                    }); };
                    settings = {
                        mode: "collect",
                        debounceMs: 0,
                        cap: 50,
                        dropPolicy: "summarize",
                    };
                    first = (0, queue_js_1.enqueueFollowupRun)(key, createRun({
                        prompt: "[Discord Guild #test channel id:123] Hello",
                        messageId: "m1",
                        originatingChannel: "discord",
                        originatingTo: "channel:123",
                    }), settings);
                    (0, vitest_1.expect)(first).toBe(true);
                    second = (0, queue_js_1.enqueueFollowupRun)(key, createRun({
                        prompt: "[Discord Guild #test channel id:123] Hello (dupe)",
                        messageId: "m1",
                        originatingChannel: "discord",
                        originatingTo: "channel:123",
                    }), settings);
                    (0, vitest_1.expect)(second).toBe(false);
                    third = (0, queue_js_1.enqueueFollowupRun)(key, createRun({
                        prompt: "[Discord Guild #test channel id:123] World",
                        messageId: "m2",
                        originatingChannel: "discord",
                        originatingTo: "channel:123",
                    }), settings);
                    (0, vitest_1.expect)(third).toBe(true);
                    (0, queue_js_1.scheduleFollowupDrain)(key, runFollowup);
                    return [4 /*yield*/, vitest_1.expect.poll(function () { return calls.length; }).toBe(1)];
                case 1:
                    _b.sent();
                    // Should collect both unique messages
                    (0, vitest_1.expect)((_a = calls[0]) === null || _a === void 0 ? void 0 : _a.prompt).toContain("[Queued messages while agent was busy]");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("deduplicates exact prompt when routing matches and no message id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var key, settings, first, second, third;
        return __generator(this, function (_a) {
            key = "test-dedup-whatsapp-".concat(Date.now());
            settings = {
                mode: "collect",
                debounceMs: 0,
                cap: 50,
                dropPolicy: "summarize",
            };
            first = (0, queue_js_1.enqueueFollowupRun)(key, createRun({
                prompt: "Hello world",
                originatingChannel: "whatsapp",
                originatingTo: "+1234567890",
            }), settings);
            (0, vitest_1.expect)(first).toBe(true);
            second = (0, queue_js_1.enqueueFollowupRun)(key, createRun({
                prompt: "Hello world",
                originatingChannel: "whatsapp",
                originatingTo: "+1234567890",
            }), settings);
            (0, vitest_1.expect)(second).toBe(true);
            third = (0, queue_js_1.enqueueFollowupRun)(key, createRun({
                prompt: "Hello world 2",
                originatingChannel: "whatsapp",
                originatingTo: "+1234567890",
            }), settings);
            (0, vitest_1.expect)(third).toBe(true);
            return [2 /*return*/];
        });
    }); });
    (0, vitest_1.it)("does not deduplicate across different providers without message id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var key, settings, first, second;
        return __generator(this, function (_a) {
            key = "test-dedup-cross-provider-".concat(Date.now());
            settings = {
                mode: "collect",
                debounceMs: 0,
                cap: 50,
                dropPolicy: "summarize",
            };
            first = (0, queue_js_1.enqueueFollowupRun)(key, createRun({
                prompt: "Same text",
                originatingChannel: "whatsapp",
                originatingTo: "+1234567890",
            }), settings);
            (0, vitest_1.expect)(first).toBe(true);
            second = (0, queue_js_1.enqueueFollowupRun)(key, createRun({
                prompt: "Same text",
                originatingChannel: "discord",
                originatingTo: "channel:123",
            }), settings);
            (0, vitest_1.expect)(second).toBe(true);
            return [2 /*return*/];
        });
    }); });
    (0, vitest_1.it)("can opt-in to prompt-based dedupe when message id is absent", function () { return __awaiter(void 0, void 0, void 0, function () {
        var key, settings, first, second;
        return __generator(this, function (_a) {
            key = "test-dedup-prompt-mode-".concat(Date.now());
            settings = {
                mode: "collect",
                debounceMs: 0,
                cap: 50,
                dropPolicy: "summarize",
            };
            first = (0, queue_js_1.enqueueFollowupRun)(key, createRun({
                prompt: "Hello world",
                originatingChannel: "whatsapp",
                originatingTo: "+1234567890",
            }), settings, "prompt");
            (0, vitest_1.expect)(first).toBe(true);
            second = (0, queue_js_1.enqueueFollowupRun)(key, createRun({
                prompt: "Hello world",
                originatingChannel: "whatsapp",
                originatingTo: "+1234567890",
            }), settings, "prompt");
            (0, vitest_1.expect)(second).toBe(false);
            return [2 /*return*/];
        });
    }); });
});
(0, vitest_1.describe)("followup queue collect routing", function () {
    (0, vitest_1.it)("does not collect when destinations differ", function () { return __awaiter(void 0, void 0, void 0, function () {
        var key, calls, runFollowup, settings;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    key = "test-collect-diff-to-".concat(Date.now());
                    calls = [];
                    runFollowup = function (run) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            calls.push(run);
                            return [2 /*return*/];
                        });
                    }); };
                    settings = {
                        mode: "collect",
                        debounceMs: 0,
                        cap: 50,
                        dropPolicy: "summarize",
                    };
                    (0, queue_js_1.enqueueFollowupRun)(key, createRun({
                        prompt: "one",
                        originatingChannel: "slack",
                        originatingTo: "channel:A",
                    }), settings);
                    (0, queue_js_1.enqueueFollowupRun)(key, createRun({
                        prompt: "two",
                        originatingChannel: "slack",
                        originatingTo: "channel:B",
                    }), settings);
                    (0, queue_js_1.scheduleFollowupDrain)(key, runFollowup);
                    return [4 /*yield*/, vitest_1.expect.poll(function () { return calls.length; }).toBe(2)];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)((_a = calls[0]) === null || _a === void 0 ? void 0 : _a.prompt).toBe("one");
                    (0, vitest_1.expect)((_b = calls[1]) === null || _b === void 0 ? void 0 : _b.prompt).toBe("two");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("collects when channel+destination match", function () { return __awaiter(void 0, void 0, void 0, function () {
        var key, calls, runFollowup, settings;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    key = "test-collect-same-to-".concat(Date.now());
                    calls = [];
                    runFollowup = function (run) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            calls.push(run);
                            return [2 /*return*/];
                        });
                    }); };
                    settings = {
                        mode: "collect",
                        debounceMs: 0,
                        cap: 50,
                        dropPolicy: "summarize",
                    };
                    (0, queue_js_1.enqueueFollowupRun)(key, createRun({
                        prompt: "one",
                        originatingChannel: "slack",
                        originatingTo: "channel:A",
                    }), settings);
                    (0, queue_js_1.enqueueFollowupRun)(key, createRun({
                        prompt: "two",
                        originatingChannel: "slack",
                        originatingTo: "channel:A",
                    }), settings);
                    (0, queue_js_1.scheduleFollowupDrain)(key, runFollowup);
                    return [4 /*yield*/, vitest_1.expect.poll(function () { return calls.length; }).toBe(1)];
                case 1:
                    _d.sent();
                    (0, vitest_1.expect)((_a = calls[0]) === null || _a === void 0 ? void 0 : _a.prompt).toContain("[Queued messages while agent was busy]");
                    (0, vitest_1.expect)((_b = calls[0]) === null || _b === void 0 ? void 0 : _b.originatingChannel).toBe("slack");
                    (0, vitest_1.expect)((_c = calls[0]) === null || _c === void 0 ? void 0 : _c.originatingTo).toBe("channel:A");
                    return [2 /*return*/];
            }
        });
    }); });
});
