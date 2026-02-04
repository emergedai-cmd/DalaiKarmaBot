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
var channel_js_1 = require("./channel.js");
var runtime_js_1 = require("./runtime.js");
function createRuntime() {
    var _this = this;
    var pushMessageLine = vitest_1.vi.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ messageId: "m-text", chatId: "c1" })];
    }); }); });
    var pushMessagesLine = vitest_1.vi.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ messageId: "m-batch", chatId: "c1" })];
    }); }); });
    var pushFlexMessage = vitest_1.vi.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ messageId: "m-flex", chatId: "c1" })];
    }); }); });
    var pushTemplateMessage = vitest_1.vi.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ messageId: "m-template", chatId: "c1" })];
    }); }); });
    var pushLocationMessage = vitest_1.vi.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ messageId: "m-loc", chatId: "c1" })];
    }); }); });
    var pushTextMessageWithQuickReplies = vitest_1.vi.fn(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    messageId: "m-quick",
                    chatId: "c1",
                })];
        });
    }); });
    var createQuickReplyItems = vitest_1.vi.fn(function (labels) { return ({ items: labels }); });
    var buildTemplateMessageFromPayload = vitest_1.vi.fn(function () { return ({ type: "buttons" }); });
    var sendMessageLine = vitest_1.vi.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ messageId: "m-media", chatId: "c1" })];
    }); }); });
    var chunkMarkdownText = vitest_1.vi.fn(function (text) { return [text]; });
    var resolveTextChunkLimit = vitest_1.vi.fn(function () { return 123; });
    var resolveLineAccount = vitest_1.vi.fn(function (_a) {
        var _b, _c, _d, _e;
        var cfg = _a.cfg, accountId = _a.accountId;
        var resolved = accountId !== null && accountId !== void 0 ? accountId : "default";
        var lineConfig = ((_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.line) !== null && _c !== void 0 ? _c : {});
        var accountConfig = resolved !== "default" ? ((_e = (_d = lineConfig.accounts) === null || _d === void 0 ? void 0 : _d[resolved]) !== null && _e !== void 0 ? _e : {}) : {};
        return {
            accountId: resolved,
            config: __assign(__assign({}, lineConfig), accountConfig),
        };
    });
    var runtime = {
        channel: {
            line: {
                pushMessageLine: pushMessageLine,
                pushMessagesLine: pushMessagesLine,
                pushFlexMessage: pushFlexMessage,
                pushTemplateMessage: pushTemplateMessage,
                pushLocationMessage: pushLocationMessage,
                pushTextMessageWithQuickReplies: pushTextMessageWithQuickReplies,
                createQuickReplyItems: createQuickReplyItems,
                buildTemplateMessageFromPayload: buildTemplateMessageFromPayload,
                sendMessageLine: sendMessageLine,
                resolveLineAccount: resolveLineAccount,
            },
            text: {
                chunkMarkdownText: chunkMarkdownText,
                resolveTextChunkLimit: resolveTextChunkLimit,
            },
        },
    };
    return {
        runtime: runtime,
        mocks: {
            pushMessageLine: pushMessageLine,
            pushMessagesLine: pushMessagesLine,
            pushFlexMessage: pushFlexMessage,
            pushTemplateMessage: pushTemplateMessage,
            pushLocationMessage: pushLocationMessage,
            pushTextMessageWithQuickReplies: pushTextMessageWithQuickReplies,
            createQuickReplyItems: createQuickReplyItems,
            buildTemplateMessageFromPayload: buildTemplateMessageFromPayload,
            sendMessageLine: sendMessageLine,
            chunkMarkdownText: chunkMarkdownText,
            resolveLineAccount: resolveLineAccount,
            resolveTextChunkLimit: resolveTextChunkLimit,
        },
    };
}
(0, vitest_1.describe)("linePlugin outbound.sendPayload", function () {
    (0, vitest_1.it)("sends flex message without dropping text", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, runtime, mocks, cfg, payload;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createRuntime(), runtime = _a.runtime, mocks = _a.mocks;
                    (0, runtime_js_1.setLineRuntime)(runtime);
                    cfg = { channels: { line: {} } };
                    payload = {
                        text: "Now playing:",
                        channelData: {
                            line: {
                                flexMessage: {
                                    altText: "Now playing",
                                    contents: { type: "bubble" },
                                },
                            },
                        },
                    };
                    return [4 /*yield*/, channel_js_1.linePlugin.outbound.sendPayload({
                            to: "line:group:1",
                            payload: payload,
                            accountId: "default",
                            cfg: cfg,
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(mocks.pushFlexMessage).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(mocks.pushMessageLine).toHaveBeenCalledWith("line:group:1", "Now playing:", {
                        verbose: false,
                        accountId: "default",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends template message without dropping text", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, runtime, mocks, cfg, payload;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createRuntime(), runtime = _a.runtime, mocks = _a.mocks;
                    (0, runtime_js_1.setLineRuntime)(runtime);
                    cfg = { channels: { line: {} } };
                    payload = {
                        text: "Choose one:",
                        channelData: {
                            line: {
                                templateMessage: {
                                    type: "confirm",
                                    text: "Continue?",
                                    confirmLabel: "Yes",
                                    confirmData: "yes",
                                    cancelLabel: "No",
                                    cancelData: "no",
                                },
                            },
                        },
                    };
                    return [4 /*yield*/, channel_js_1.linePlugin.outbound.sendPayload({
                            to: "line:user:1",
                            payload: payload,
                            accountId: "default",
                            cfg: cfg,
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(mocks.buildTemplateMessageFromPayload).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(mocks.pushTemplateMessage).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(mocks.pushMessageLine).toHaveBeenCalledWith("line:user:1", "Choose one:", {
                        verbose: false,
                        accountId: "default",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("attaches quick replies when no text chunks are present", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, runtime, mocks, cfg, payload;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createRuntime(), runtime = _a.runtime, mocks = _a.mocks;
                    (0, runtime_js_1.setLineRuntime)(runtime);
                    cfg = { channels: { line: {} } };
                    payload = {
                        channelData: {
                            line: {
                                quickReplies: ["One", "Two"],
                                flexMessage: {
                                    altText: "Card",
                                    contents: { type: "bubble" },
                                },
                            },
                        },
                    };
                    return [4 /*yield*/, channel_js_1.linePlugin.outbound.sendPayload({
                            to: "line:user:2",
                            payload: payload,
                            accountId: "default",
                            cfg: cfg,
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(mocks.pushFlexMessage).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(mocks.pushMessagesLine).toHaveBeenCalledWith("line:user:2", [
                        {
                            type: "flex",
                            altText: "Card",
                            contents: { type: "bubble" },
                            quickReply: { items: ["One", "Two"] },
                        },
                    ], { verbose: false, accountId: "default" });
                    (0, vitest_1.expect)(mocks.createQuickReplyItems).toHaveBeenCalledWith(["One", "Two"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends media before quick-reply text so buttons stay visible", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, runtime, mocks, cfg, payload, mediaOrder, quickReplyOrder;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createRuntime(), runtime = _a.runtime, mocks = _a.mocks;
                    (0, runtime_js_1.setLineRuntime)(runtime);
                    cfg = { channels: { line: {} } };
                    payload = {
                        text: "Hello",
                        mediaUrl: "https://example.com/img.jpg",
                        channelData: {
                            line: {
                                quickReplies: ["One", "Two"],
                            },
                        },
                    };
                    return [4 /*yield*/, channel_js_1.linePlugin.outbound.sendPayload({
                            to: "line:user:3",
                            payload: payload,
                            accountId: "default",
                            cfg: cfg,
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(mocks.sendMessageLine).toHaveBeenCalledWith("line:user:3", "", {
                        verbose: false,
                        mediaUrl: "https://example.com/img.jpg",
                        accountId: "default",
                    });
                    (0, vitest_1.expect)(mocks.pushTextMessageWithQuickReplies).toHaveBeenCalledWith("line:user:3", "Hello", ["One", "Two"], { verbose: false, accountId: "default" });
                    mediaOrder = mocks.sendMessageLine.mock.invocationCallOrder[0];
                    quickReplyOrder = mocks.pushTextMessageWithQuickReplies.mock.invocationCallOrder[0];
                    (0, vitest_1.expect)(mediaOrder).toBeLessThan(quickReplyOrder);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses configured text chunk limit for payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, runtime, mocks, cfg, payload;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createRuntime(), runtime = _a.runtime, mocks = _a.mocks;
                    (0, runtime_js_1.setLineRuntime)(runtime);
                    cfg = { channels: { line: { textChunkLimit: 123 } } };
                    payload = {
                        text: "Hello world",
                        channelData: {
                            line: {
                                flexMessage: {
                                    altText: "Card",
                                    contents: { type: "bubble" },
                                },
                            },
                        },
                    };
                    return [4 /*yield*/, channel_js_1.linePlugin.outbound.sendPayload({
                            to: "line:user:3",
                            payload: payload,
                            accountId: "primary",
                            cfg: cfg,
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(mocks.resolveTextChunkLimit).toHaveBeenCalledWith(cfg, "line", "primary", {
                        fallbackLimit: 5000,
                    });
                    (0, vitest_1.expect)(mocks.chunkMarkdownText).toHaveBeenCalledWith("Hello world", 123);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("linePlugin config.formatAllowFrom", function () {
    (0, vitest_1.it)("strips line:user: prefixes without lowercasing", function () {
        var formatted = channel_js_1.linePlugin.config.formatAllowFrom({
            allowFrom: ["line:user:UABC", "line:UDEF"],
        });
        (0, vitest_1.expect)(formatted).toEqual(["UABC", "UDEF"]);
    });
});
(0, vitest_1.describe)("linePlugin groups.resolveRequireMention", function () {
    (0, vitest_1.it)("uses account-level group settings when provided", function () {
        var runtime = createRuntime().runtime;
        (0, runtime_js_1.setLineRuntime)(runtime);
        var cfg = {
            channels: {
                line: {
                    groups: {
                        "*": { requireMention: false },
                    },
                    accounts: {
                        primary: {
                            groups: {
                                "group-1": { requireMention: true },
                            },
                        },
                    },
                },
            },
        };
        var requireMention = channel_js_1.linePlugin.groups.resolveRequireMention({
            cfg: cfg,
            accountId: "primary",
            groupId: "group-1",
        });
        (0, vitest_1.expect)(requireMention).toBe(true);
    });
});
