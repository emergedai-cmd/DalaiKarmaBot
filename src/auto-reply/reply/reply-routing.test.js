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
var tokens_js_1 = require("../tokens.js");
var reply_dispatcher_js_1 = require("./reply-dispatcher.js");
var reply_threading_js_1 = require("./reply-threading.js");
var emptyCfg = {};
(0, vitest_1.describe)("createReplyDispatcher", function () {
    (0, vitest_1.it)("drops empty payloads and silent tokens without media", function () { return __awaiter(void 0, void 0, void 0, function () {
        var deliver, dispatcher;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deliver = vitest_1.vi.fn().mockResolvedValue(undefined);
                    dispatcher = (0, reply_dispatcher_js_1.createReplyDispatcher)({ deliver: deliver });
                    (0, vitest_1.expect)(dispatcher.sendFinalReply({})).toBe(false);
                    (0, vitest_1.expect)(dispatcher.sendFinalReply({ text: " " })).toBe(false);
                    (0, vitest_1.expect)(dispatcher.sendFinalReply({ text: tokens_js_1.SILENT_REPLY_TOKEN })).toBe(false);
                    (0, vitest_1.expect)(dispatcher.sendFinalReply({ text: "".concat(tokens_js_1.SILENT_REPLY_TOKEN, " -- nope") })).toBe(false);
                    (0, vitest_1.expect)(dispatcher.sendFinalReply({ text: "interject.".concat(tokens_js_1.SILENT_REPLY_TOKEN) })).toBe(false);
                    return [4 /*yield*/, dispatcher.waitForIdle()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(deliver).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("strips heartbeat tokens and applies responsePrefix", function () { return __awaiter(void 0, void 0, void 0, function () {
        var deliver, onHeartbeatStrip, dispatcher;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deliver = vitest_1.vi.fn().mockResolvedValue(undefined);
                    onHeartbeatStrip = vitest_1.vi.fn();
                    dispatcher = (0, reply_dispatcher_js_1.createReplyDispatcher)({
                        deliver: deliver,
                        responsePrefix: "PFX",
                        onHeartbeatStrip: onHeartbeatStrip,
                    });
                    (0, vitest_1.expect)(dispatcher.sendFinalReply({ text: tokens_js_1.HEARTBEAT_TOKEN })).toBe(false);
                    (0, vitest_1.expect)(dispatcher.sendToolResult({ text: "".concat(tokens_js_1.HEARTBEAT_TOKEN, " hello") })).toBe(true);
                    return [4 /*yield*/, dispatcher.waitForIdle()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(deliver).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(deliver.mock.calls[0][0].text).toBe("PFX hello");
                    (0, vitest_1.expect)(onHeartbeatStrip).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("avoids double-prefixing and keeps media when heartbeat is the only text", function () { return __awaiter(void 0, void 0, void 0, function () {
        var deliver, dispatcher;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deliver = vitest_1.vi.fn().mockResolvedValue(undefined);
                    dispatcher = (0, reply_dispatcher_js_1.createReplyDispatcher)({
                        deliver: deliver,
                        responsePrefix: "PFX",
                    });
                    (0, vitest_1.expect)(dispatcher.sendFinalReply({
                        text: "PFX already",
                        mediaUrl: "file:///tmp/photo.jpg",
                    })).toBe(true);
                    (0, vitest_1.expect)(dispatcher.sendFinalReply({
                        text: tokens_js_1.HEARTBEAT_TOKEN,
                        mediaUrl: "file:///tmp/photo.jpg",
                    })).toBe(true);
                    (0, vitest_1.expect)(dispatcher.sendFinalReply({
                        text: "".concat(tokens_js_1.SILENT_REPLY_TOKEN, " -- explanation"),
                        mediaUrl: "file:///tmp/photo.jpg",
                    })).toBe(true);
                    return [4 /*yield*/, dispatcher.waitForIdle()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(deliver).toHaveBeenCalledTimes(3);
                    (0, vitest_1.expect)(deliver.mock.calls[0][0].text).toBe("PFX already");
                    (0, vitest_1.expect)(deliver.mock.calls[1][0].text).toBe("");
                    (0, vitest_1.expect)(deliver.mock.calls[2][0].text).toBe("");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("preserves ordering across tool, block, and final replies", function () { return __awaiter(void 0, void 0, void 0, function () {
        var delivered, deliver, dispatcher;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    delivered = [];
                    deliver = vitest_1.vi.fn(function (_payload, info) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    delivered.push(info.kind);
                                    if (!(info.kind === "tool")) return [3 /*break*/, 2];
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5); })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    dispatcher = (0, reply_dispatcher_js_1.createReplyDispatcher)({ deliver: deliver });
                    dispatcher.sendToolResult({ text: "tool" });
                    dispatcher.sendBlockReply({ text: "block" });
                    dispatcher.sendFinalReply({ text: "final" });
                    return [4 /*yield*/, dispatcher.waitForIdle()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(delivered).toEqual(["tool", "block", "final"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("fires onIdle when the queue drains", function () { return __awaiter(void 0, void 0, void 0, function () {
        var deliver, onIdle, dispatcher;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deliver = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5); })];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); });
                    onIdle = vitest_1.vi.fn();
                    dispatcher = (0, reply_dispatcher_js_1.createReplyDispatcher)({ deliver: deliver, onIdle: onIdle });
                    dispatcher.sendToolResult({ text: "one" });
                    dispatcher.sendFinalReply({ text: "two" });
                    return [4 /*yield*/, dispatcher.waitForIdle()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(onIdle).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("delays block replies after the first when humanDelay is natural", function () { return __awaiter(void 0, void 0, void 0, function () {
        var randomSpy, deliver, dispatcher;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    randomSpy = vitest_1.vi.spyOn(Math, "random").mockReturnValue(0);
                    deliver = vitest_1.vi.fn().mockResolvedValue(undefined);
                    dispatcher = (0, reply_dispatcher_js_1.createReplyDispatcher)({
                        deliver: deliver,
                        humanDelay: { mode: "natural" },
                    });
                    dispatcher.sendBlockReply({ text: "first" });
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(deliver).toHaveBeenCalledTimes(1);
                    dispatcher.sendBlockReply({ text: "second" });
                    return [4 /*yield*/, Promise.resolve()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(deliver).toHaveBeenCalledTimes(1);
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(799)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(deliver).toHaveBeenCalledTimes(1);
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(1)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, dispatcher.waitForIdle()];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(deliver).toHaveBeenCalledTimes(2);
                    randomSpy.mockRestore();
                    vitest_1.vi.useRealTimers();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses custom bounds for humanDelay and clamps when max <= min", function () { return __awaiter(void 0, void 0, void 0, function () {
        var deliver, dispatcher;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    deliver = vitest_1.vi.fn().mockResolvedValue(undefined);
                    dispatcher = (0, reply_dispatcher_js_1.createReplyDispatcher)({
                        deliver: deliver,
                        humanDelay: { mode: "custom", minMs: 1200, maxMs: 400 },
                    });
                    dispatcher.sendBlockReply({ text: "first" });
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(deliver).toHaveBeenCalledTimes(1);
                    dispatcher.sendBlockReply({ text: "second" });
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(1199)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(deliver).toHaveBeenCalledTimes(1);
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(1)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, dispatcher.waitForIdle()];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(deliver).toHaveBeenCalledTimes(2);
                    vitest_1.vi.useRealTimers();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("resolveReplyToMode", function () {
    (0, vitest_1.it)("defaults to first for Telegram", function () {
        (0, vitest_1.expect)((0, reply_threading_js_1.resolveReplyToMode)(emptyCfg, "telegram")).toBe("first");
    });
    (0, vitest_1.it)("defaults to off for Discord and Slack", function () {
        (0, vitest_1.expect)((0, reply_threading_js_1.resolveReplyToMode)(emptyCfg, "discord")).toBe("off");
        (0, vitest_1.expect)((0, reply_threading_js_1.resolveReplyToMode)(emptyCfg, "slack")).toBe("off");
    });
    (0, vitest_1.it)("defaults to all when channel is unknown", function () {
        (0, vitest_1.expect)((0, reply_threading_js_1.resolveReplyToMode)(emptyCfg, undefined)).toBe("all");
    });
    (0, vitest_1.it)("uses configured value when present", function () {
        var cfg = {
            channels: {
                telegram: { replyToMode: "all" },
                discord: { replyToMode: "first" },
                slack: { replyToMode: "all" },
            },
        };
        (0, vitest_1.expect)((0, reply_threading_js_1.resolveReplyToMode)(cfg, "telegram")).toBe("all");
        (0, vitest_1.expect)((0, reply_threading_js_1.resolveReplyToMode)(cfg, "discord")).toBe("first");
        (0, vitest_1.expect)((0, reply_threading_js_1.resolveReplyToMode)(cfg, "slack")).toBe("all");
    });
    (0, vitest_1.it)("uses chat-type replyToMode overrides for Slack when configured", function () {
        var cfg = {
            channels: {
                slack: {
                    replyToMode: "off",
                    replyToModeByChatType: { direct: "all", group: "first" },
                },
            },
        };
        (0, vitest_1.expect)((0, reply_threading_js_1.resolveReplyToMode)(cfg, "slack", null, "direct")).toBe("all");
        (0, vitest_1.expect)((0, reply_threading_js_1.resolveReplyToMode)(cfg, "slack", null, "group")).toBe("first");
        (0, vitest_1.expect)((0, reply_threading_js_1.resolveReplyToMode)(cfg, "slack", null, "channel")).toBe("off");
        (0, vitest_1.expect)((0, reply_threading_js_1.resolveReplyToMode)(cfg, "slack", null, undefined)).toBe("off");
    });
    (0, vitest_1.it)("falls back to top-level replyToMode when no chat-type override is set", function () {
        var cfg = {
            channels: {
                slack: {
                    replyToMode: "first",
                },
            },
        };
        (0, vitest_1.expect)((0, reply_threading_js_1.resolveReplyToMode)(cfg, "slack", null, "direct")).toBe("first");
        (0, vitest_1.expect)((0, reply_threading_js_1.resolveReplyToMode)(cfg, "slack", null, "channel")).toBe("first");
    });
    (0, vitest_1.it)("uses legacy dm.replyToMode for direct messages when no chat-type override exists", function () {
        var cfg = {
            channels: {
                slack: {
                    replyToMode: "off",
                    dm: { replyToMode: "all" },
                },
            },
        };
        (0, vitest_1.expect)((0, reply_threading_js_1.resolveReplyToMode)(cfg, "slack", null, "direct")).toBe("all");
        (0, vitest_1.expect)((0, reply_threading_js_1.resolveReplyToMode)(cfg, "slack", null, "channel")).toBe("off");
    });
});
(0, vitest_1.describe)("createReplyToModeFilter", function () {
    (0, vitest_1.it)("drops replyToId when mode is off", function () {
        var filter = (0, reply_threading_js_1.createReplyToModeFilter)("off");
        (0, vitest_1.expect)(filter({ text: "hi", replyToId: "1" }).replyToId).toBeUndefined();
    });
    (0, vitest_1.it)("keeps replyToId when mode is off and reply tags are allowed", function () {
        var filter = (0, reply_threading_js_1.createReplyToModeFilter)("off", { allowTagsWhenOff: true });
        (0, vitest_1.expect)(filter({ text: "hi", replyToId: "1", replyToTag: true }).replyToId).toBe("1");
    });
    (0, vitest_1.it)("keeps replyToId when mode is all", function () {
        var filter = (0, reply_threading_js_1.createReplyToModeFilter)("all");
        (0, vitest_1.expect)(filter({ text: "hi", replyToId: "1" }).replyToId).toBe("1");
    });
    (0, vitest_1.it)("keeps only the first replyToId when mode is first", function () {
        var filter = (0, reply_threading_js_1.createReplyToModeFilter)("first");
        (0, vitest_1.expect)(filter({ text: "hi", replyToId: "1" }).replyToId).toBe("1");
        (0, vitest_1.expect)(filter({ text: "next", replyToId: "1" }).replyToId).toBeUndefined();
    });
});
