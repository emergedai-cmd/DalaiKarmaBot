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
var test_helpers_js_1 = require("./test-helpers.js");
var typing_mode_js_1 = require("./typing-mode.js");
var typing_js_1 = require("./typing.js");
(0, vitest_1.describe)("typing controller", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)("stops after run completion and dispatcher idle", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onReplyStart, typing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    onReplyStart = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    typing = (0, typing_js_1.createTypingController)({
                        onReplyStart: onReplyStart,
                        typingIntervalSeconds: 1,
                        typingTtlMs: 30000,
                    });
                    return [4 /*yield*/, typing.startTypingLoop()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(onReplyStart).toHaveBeenCalledTimes(1);
                    vitest_1.vi.advanceTimersByTime(2000);
                    (0, vitest_1.expect)(onReplyStart).toHaveBeenCalledTimes(3);
                    typing.markRunComplete();
                    vitest_1.vi.advanceTimersByTime(1000);
                    (0, vitest_1.expect)(onReplyStart).toHaveBeenCalledTimes(4);
                    typing.markDispatchIdle();
                    vitest_1.vi.advanceTimersByTime(2000);
                    (0, vitest_1.expect)(onReplyStart).toHaveBeenCalledTimes(4);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps typing until both idle and run completion are set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onReplyStart, typing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    onReplyStart = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    typing = (0, typing_js_1.createTypingController)({
                        onReplyStart: onReplyStart,
                        typingIntervalSeconds: 1,
                        typingTtlMs: 30000,
                    });
                    return [4 /*yield*/, typing.startTypingLoop()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(onReplyStart).toHaveBeenCalledTimes(1);
                    typing.markDispatchIdle();
                    vitest_1.vi.advanceTimersByTime(2000);
                    (0, vitest_1.expect)(onReplyStart).toHaveBeenCalledTimes(3);
                    typing.markRunComplete();
                    vitest_1.vi.advanceTimersByTime(2000);
                    (0, vitest_1.expect)(onReplyStart).toHaveBeenCalledTimes(3);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not start typing after run completion", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onReplyStart, typing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    onReplyStart = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    typing = (0, typing_js_1.createTypingController)({
                        onReplyStart: onReplyStart,
                        typingIntervalSeconds: 1,
                        typingTtlMs: 30000,
                    });
                    typing.markRunComplete();
                    return [4 /*yield*/, typing.startTypingOnText("late text")];
                case 1:
                    _a.sent();
                    vitest_1.vi.advanceTimersByTime(2000);
                    (0, vitest_1.expect)(onReplyStart).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not restart typing after it has stopped", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onReplyStart, typing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    onReplyStart = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    typing = (0, typing_js_1.createTypingController)({
                        onReplyStart: onReplyStart,
                        typingIntervalSeconds: 1,
                        typingTtlMs: 30000,
                    });
                    return [4 /*yield*/, typing.startTypingLoop()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(onReplyStart).toHaveBeenCalledTimes(1);
                    typing.markRunComplete();
                    typing.markDispatchIdle();
                    vitest_1.vi.advanceTimersByTime(5000);
                    (0, vitest_1.expect)(onReplyStart).toHaveBeenCalledTimes(1);
                    // Late callbacks should be ignored and must not restart the interval.
                    return [4 /*yield*/, typing.startTypingOnText("late tool result")];
                case 2:
                    // Late callbacks should be ignored and must not restart the interval.
                    _a.sent();
                    vitest_1.vi.advanceTimersByTime(5000);
                    (0, vitest_1.expect)(onReplyStart).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("resolveTypingMode", function () {
    (0, vitest_1.it)("defaults to instant for direct chats", function () {
        (0, vitest_1.expect)((0, typing_mode_js_1.resolveTypingMode)({
            configured: undefined,
            isGroupChat: false,
            wasMentioned: false,
            isHeartbeat: false,
        })).toBe("instant");
    });
    (0, vitest_1.it)("defaults to message for group chats without mentions", function () {
        (0, vitest_1.expect)((0, typing_mode_js_1.resolveTypingMode)({
            configured: undefined,
            isGroupChat: true,
            wasMentioned: false,
            isHeartbeat: false,
        })).toBe("message");
    });
    (0, vitest_1.it)("defaults to instant for mentioned group chats", function () {
        (0, vitest_1.expect)((0, typing_mode_js_1.resolveTypingMode)({
            configured: undefined,
            isGroupChat: true,
            wasMentioned: true,
            isHeartbeat: false,
        })).toBe("instant");
    });
    (0, vitest_1.it)("honors configured mode across contexts", function () {
        (0, vitest_1.expect)((0, typing_mode_js_1.resolveTypingMode)({
            configured: "thinking",
            isGroupChat: false,
            wasMentioned: false,
            isHeartbeat: false,
        })).toBe("thinking");
        (0, vitest_1.expect)((0, typing_mode_js_1.resolveTypingMode)({
            configured: "message",
            isGroupChat: true,
            wasMentioned: true,
            isHeartbeat: false,
        })).toBe("message");
    });
    (0, vitest_1.it)("forces never for heartbeat runs", function () {
        (0, vitest_1.expect)((0, typing_mode_js_1.resolveTypingMode)({
            configured: "instant",
            isGroupChat: false,
            wasMentioned: false,
            isHeartbeat: true,
        })).toBe("never");
    });
});
(0, vitest_1.describe)("createTypingSignaler", function () {
    (0, vitest_1.it)("signals immediately for instant mode", function () { return __awaiter(void 0, void 0, void 0, function () {
        var typing, signaler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    typing = (0, test_helpers_js_1.createMockTypingController)();
                    signaler = (0, typing_mode_js_1.createTypingSignaler)({
                        typing: typing,
                        mode: "instant",
                        isHeartbeat: false,
                    });
                    return [4 /*yield*/, signaler.signalRunStart()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(typing.startTypingLoop).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("signals on text for message mode", function () { return __awaiter(void 0, void 0, void 0, function () {
        var typing, signaler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    typing = (0, test_helpers_js_1.createMockTypingController)();
                    signaler = (0, typing_mode_js_1.createTypingSignaler)({
                        typing: typing,
                        mode: "message",
                        isHeartbeat: false,
                    });
                    return [4 /*yield*/, signaler.signalTextDelta("hello")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(typing.startTypingOnText).toHaveBeenCalledWith("hello");
                    (0, vitest_1.expect)(typing.startTypingLoop).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("signals on message start for message mode", function () { return __awaiter(void 0, void 0, void 0, function () {
        var typing, signaler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    typing = (0, test_helpers_js_1.createMockTypingController)();
                    signaler = (0, typing_mode_js_1.createTypingSignaler)({
                        typing: typing,
                        mode: "message",
                        isHeartbeat: false,
                    });
                    return [4 /*yield*/, signaler.signalMessageStart()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(typing.startTypingLoop).not.toHaveBeenCalled();
                    return [4 /*yield*/, signaler.signalTextDelta("hello")];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(typing.startTypingOnText).toHaveBeenCalledWith("hello");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("signals on reasoning for thinking mode", function () { return __awaiter(void 0, void 0, void 0, function () {
        var typing, signaler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    typing = (0, test_helpers_js_1.createMockTypingController)();
                    signaler = (0, typing_mode_js_1.createTypingSignaler)({
                        typing: typing,
                        mode: "thinking",
                        isHeartbeat: false,
                    });
                    return [4 /*yield*/, signaler.signalReasoningDelta()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(typing.startTypingLoop).not.toHaveBeenCalled();
                    return [4 /*yield*/, signaler.signalTextDelta("hi")];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(typing.startTypingLoop).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("refreshes ttl on text for thinking mode", function () { return __awaiter(void 0, void 0, void 0, function () {
        var typing, signaler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    typing = (0, test_helpers_js_1.createMockTypingController)();
                    signaler = (0, typing_mode_js_1.createTypingSignaler)({
                        typing: typing,
                        mode: "thinking",
                        isHeartbeat: false,
                    });
                    return [4 /*yield*/, signaler.signalTextDelta("hi")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(typing.startTypingLoop).toHaveBeenCalled();
                    (0, vitest_1.expect)(typing.refreshTypingTtl).toHaveBeenCalled();
                    (0, vitest_1.expect)(typing.startTypingOnText).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("starts typing on tool start before text", function () { return __awaiter(void 0, void 0, void 0, function () {
        var typing, signaler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    typing = (0, test_helpers_js_1.createMockTypingController)();
                    signaler = (0, typing_mode_js_1.createTypingSignaler)({
                        typing: typing,
                        mode: "message",
                        isHeartbeat: false,
                    });
                    return [4 /*yield*/, signaler.signalToolStart()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(typing.startTypingLoop).toHaveBeenCalled();
                    (0, vitest_1.expect)(typing.refreshTypingTtl).toHaveBeenCalled();
                    (0, vitest_1.expect)(typing.startTypingOnText).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("refreshes ttl on tool start when active after text", function () { return __awaiter(void 0, void 0, void 0, function () {
        var typing, signaler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    typing = (0, test_helpers_js_1.createMockTypingController)({
                        isActive: vitest_1.vi.fn(function () { return true; }),
                    });
                    signaler = (0, typing_mode_js_1.createTypingSignaler)({
                        typing: typing,
                        mode: "message",
                        isHeartbeat: false,
                    });
                    return [4 /*yield*/, signaler.signalTextDelta("hello")];
                case 1:
                    _a.sent();
                    typing.startTypingLoop.mockClear();
                    typing.startTypingOnText.mockClear();
                    typing.refreshTypingTtl.mockClear();
                    return [4 /*yield*/, signaler.signalToolStart()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(typing.refreshTypingTtl).toHaveBeenCalled();
                    (0, vitest_1.expect)(typing.startTypingLoop).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("suppresses typing when disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var typing, signaler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    typing = (0, test_helpers_js_1.createMockTypingController)();
                    signaler = (0, typing_mode_js_1.createTypingSignaler)({
                        typing: typing,
                        mode: "instant",
                        isHeartbeat: true,
                    });
                    return [4 /*yield*/, signaler.signalRunStart()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, signaler.signalTextDelta("hi")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, signaler.signalReasoningDelta()];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(typing.startTypingLoop).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(typing.startTypingOnText).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
