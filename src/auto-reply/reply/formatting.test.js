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
var audio_tags_js_1 = require("./audio-tags.js");
var block_reply_coalescer_js_1 = require("./block-reply-coalescer.js");
var reply_reference_js_1 = require("./reply-reference.js");
var streaming_directives_js_1 = require("./streaming-directives.js");
(0, vitest_1.describe)("parseAudioTag", function () {
    (0, vitest_1.it)("detects audio_as_voice and strips the tag", function () {
        var result = (0, audio_tags_js_1.parseAudioTag)("Hello [[audio_as_voice]] world");
        (0, vitest_1.expect)(result.audioAsVoice).toBe(true);
        (0, vitest_1.expect)(result.hadTag).toBe(true);
        (0, vitest_1.expect)(result.text).toBe("Hello world");
    });
    (0, vitest_1.it)("returns empty output for missing text", function () {
        var result = (0, audio_tags_js_1.parseAudioTag)(undefined);
        (0, vitest_1.expect)(result.audioAsVoice).toBe(false);
        (0, vitest_1.expect)(result.hadTag).toBe(false);
        (0, vitest_1.expect)(result.text).toBe("");
    });
    (0, vitest_1.it)("removes tag-only messages", function () {
        var result = (0, audio_tags_js_1.parseAudioTag)("[[audio_as_voice]]");
        (0, vitest_1.expect)(result.audioAsVoice).toBe(true);
        (0, vitest_1.expect)(result.text).toBe("");
    });
});
(0, vitest_1.describe)("block reply coalescer", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)("coalesces chunks within the idle window", function () { return __awaiter(void 0, void 0, void 0, function () {
        var flushes, coalescer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    flushes = [];
                    coalescer = (0, block_reply_coalescer_js_1.createBlockReplyCoalescer)({
                        config: { minChars: 1, maxChars: 200, idleMs: 100, joiner: " " },
                        shouldAbort: function () { return false; },
                        onFlush: function (payload) {
                            var _a;
                            flushes.push((_a = payload.text) !== null && _a !== void 0 ? _a : "");
                        },
                    });
                    coalescer.enqueue({ text: "Hello" });
                    coalescer.enqueue({ text: "world" });
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(100)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(flushes).toEqual(["Hello world"]);
                    coalescer.stop();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("waits until minChars before idle flush", function () { return __awaiter(void 0, void 0, void 0, function () {
        var flushes, coalescer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    flushes = [];
                    coalescer = (0, block_reply_coalescer_js_1.createBlockReplyCoalescer)({
                        config: { minChars: 10, maxChars: 200, idleMs: 50, joiner: " " },
                        shouldAbort: function () { return false; },
                        onFlush: function (payload) {
                            var _a;
                            flushes.push((_a = payload.text) !== null && _a !== void 0 ? _a : "");
                        },
                    });
                    coalescer.enqueue({ text: "short" });
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(50)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(flushes).toEqual([]);
                    coalescer.enqueue({ text: "message" });
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(50)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(flushes).toEqual(["short message"]);
                    coalescer.stop();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flushes each enqueued payload separately when flushOnEnqueue is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var flushes, coalescer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flushes = [];
                    coalescer = (0, block_reply_coalescer_js_1.createBlockReplyCoalescer)({
                        config: { minChars: 1, maxChars: 200, idleMs: 100, joiner: "\n\n", flushOnEnqueue: true },
                        shouldAbort: function () { return false; },
                        onFlush: function (payload) {
                            var _a;
                            flushes.push((_a = payload.text) !== null && _a !== void 0 ? _a : "");
                        },
                    });
                    coalescer.enqueue({ text: "First paragraph" });
                    coalescer.enqueue({ text: "Second paragraph" });
                    coalescer.enqueue({ text: "Third paragraph" });
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(flushes).toEqual(["First paragraph", "Second paragraph", "Third paragraph"]);
                    coalescer.stop();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("still accumulates when flushOnEnqueue is not set (default)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var flushes, coalescer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    flushes = [];
                    coalescer = (0, block_reply_coalescer_js_1.createBlockReplyCoalescer)({
                        config: { minChars: 1, maxChars: 2000, idleMs: 100, joiner: "\n\n" },
                        shouldAbort: function () { return false; },
                        onFlush: function (payload) {
                            var _a;
                            flushes.push((_a = payload.text) !== null && _a !== void 0 ? _a : "");
                        },
                    });
                    coalescer.enqueue({ text: "First paragraph" });
                    coalescer.enqueue({ text: "Second paragraph" });
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(100)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(flushes).toEqual(["First paragraph\n\nSecond paragraph"]);
                    coalescer.stop();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flushes short payloads immediately when flushOnEnqueue is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var flushes, coalescer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flushes = [];
                    coalescer = (0, block_reply_coalescer_js_1.createBlockReplyCoalescer)({
                        config: { minChars: 10, maxChars: 200, idleMs: 50, joiner: "\n\n", flushOnEnqueue: true },
                        shouldAbort: function () { return false; },
                        onFlush: function (payload) {
                            var _a;
                            flushes.push((_a = payload.text) !== null && _a !== void 0 ? _a : "");
                        },
                    });
                    coalescer.enqueue({ text: "Hi" });
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(flushes).toEqual(["Hi"]);
                    coalescer.stop();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("resets char budget per paragraph with flushOnEnqueue", function () { return __awaiter(void 0, void 0, void 0, function () {
        var flushes, coalescer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flushes = [];
                    coalescer = (0, block_reply_coalescer_js_1.createBlockReplyCoalescer)({
                        config: { minChars: 1, maxChars: 30, idleMs: 100, joiner: "\n\n", flushOnEnqueue: true },
                        shouldAbort: function () { return false; },
                        onFlush: function (payload) {
                            var _a;
                            flushes.push((_a = payload.text) !== null && _a !== void 0 ? _a : "");
                        },
                    });
                    // Each 20-char payload fits within maxChars=30 individually
                    coalescer.enqueue({ text: "12345678901234567890" });
                    coalescer.enqueue({ text: "abcdefghijklmnopqrst" });
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _a.sent();
                    // Without flushOnEnqueue, these would be joined to 40+ chars and trigger maxChars split.
                    // With flushOnEnqueue, each is sent independently within budget.
                    (0, vitest_1.expect)(flushes).toEqual(["12345678901234567890", "abcdefghijklmnopqrst"]);
                    coalescer.stop();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flushes buffered text before media payloads", function () {
        var flushes = [];
        var coalescer = (0, block_reply_coalescer_js_1.createBlockReplyCoalescer)({
            config: { minChars: 1, maxChars: 200, idleMs: 0, joiner: " " },
            shouldAbort: function () { return false; },
            onFlush: function (payload) {
                flushes.push({
                    text: payload.text,
                    mediaUrls: payload.mediaUrls,
                });
            },
        });
        coalescer.enqueue({ text: "Hello" });
        coalescer.enqueue({ text: "world" });
        coalescer.enqueue({ mediaUrls: ["https://example.com/a.png"] });
        void coalescer.flush({ force: true });
        (0, vitest_1.expect)(flushes[0].text).toBe("Hello world");
        (0, vitest_1.expect)(flushes[1].mediaUrls).toEqual(["https://example.com/a.png"]);
        coalescer.stop();
    });
});
(0, vitest_1.describe)("createReplyReferencePlanner", function () {
    (0, vitest_1.it)("disables references when mode is off", function () {
        var planner = (0, reply_reference_js_1.createReplyReferencePlanner)({
            replyToMode: "off",
            startId: "parent",
        });
        (0, vitest_1.expect)(planner.use()).toBeUndefined();
        (0, vitest_1.expect)(planner.hasReplied()).toBe(false);
    });
    (0, vitest_1.it)("uses startId once when mode is first", function () {
        var planner = (0, reply_reference_js_1.createReplyReferencePlanner)({
            replyToMode: "first",
            startId: "parent",
        });
        (0, vitest_1.expect)(planner.use()).toBe("parent");
        (0, vitest_1.expect)(planner.hasReplied()).toBe(true);
        planner.markSent();
        (0, vitest_1.expect)(planner.use()).toBeUndefined();
    });
    (0, vitest_1.it)("returns startId for every call when mode is all", function () {
        var planner = (0, reply_reference_js_1.createReplyReferencePlanner)({
            replyToMode: "all",
            startId: "parent",
        });
        (0, vitest_1.expect)(planner.use()).toBe("parent");
        (0, vitest_1.expect)(planner.use()).toBe("parent");
    });
    (0, vitest_1.it)("prefers existing thread id regardless of mode", function () {
        var planner = (0, reply_reference_js_1.createReplyReferencePlanner)({
            replyToMode: "off",
            existingId: "thread-1",
            startId: "parent",
        });
        (0, vitest_1.expect)(planner.use()).toBe("thread-1");
        (0, vitest_1.expect)(planner.hasReplied()).toBe(true);
    });
    (0, vitest_1.it)("honors allowReference=false", function () {
        var planner = (0, reply_reference_js_1.createReplyReferencePlanner)({
            replyToMode: "all",
            startId: "parent",
            allowReference: false,
        });
        (0, vitest_1.expect)(planner.use()).toBeUndefined();
        (0, vitest_1.expect)(planner.hasReplied()).toBe(false);
        planner.markSent();
        (0, vitest_1.expect)(planner.hasReplied()).toBe(true);
    });
});
(0, vitest_1.describe)("createStreamingDirectiveAccumulator", function () {
    (0, vitest_1.it)("stashes reply_to_current until a renderable chunk arrives", function () {
        var accumulator = (0, streaming_directives_js_1.createStreamingDirectiveAccumulator)();
        (0, vitest_1.expect)(accumulator.consume("[[reply_to_current]]")).toBeNull();
        var result = accumulator.consume("Hello");
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.text).toBe("Hello");
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.replyToCurrent).toBe(true);
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.replyToTag).toBe(true);
    });
    (0, vitest_1.it)("handles reply tags split across chunks", function () {
        var accumulator = (0, streaming_directives_js_1.createStreamingDirectiveAccumulator)();
        (0, vitest_1.expect)(accumulator.consume("[[reply_to_")).toBeNull();
        var result = accumulator.consume("current]] Yo");
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.text).toBe("Yo");
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.replyToCurrent).toBe(true);
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.replyToTag).toBe(true);
    });
    (0, vitest_1.it)("propagates explicit reply ids across chunks", function () {
        var accumulator = (0, streaming_directives_js_1.createStreamingDirectiveAccumulator)();
        (0, vitest_1.expect)(accumulator.consume("[[reply_to: abc-123]]")).toBeNull();
        var result = accumulator.consume("Hi");
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.text).toBe("Hi");
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.replyToId).toBe("abc-123");
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.replyToTag).toBe(true);
    });
});
