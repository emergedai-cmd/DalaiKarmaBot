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
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var vitest_1 = require("vitest");
var messenger_js_1 = require("./messenger.js");
var runtime_js_1 = require("./runtime.js");
var chunkMarkdownText = function (text, limit) {
    if (!text) {
        return [];
    }
    if (limit <= 0 || text.length <= limit) {
        return [text];
    }
    var chunks = [];
    for (var index = 0; index < text.length; index += limit) {
        chunks.push(text.slice(index, index + limit));
    }
    return chunks;
};
var runtimeStub = {
    channel: {
        text: {
            chunkMarkdownText: chunkMarkdownText,
            chunkMarkdownTextWithMode: chunkMarkdownText,
            resolveMarkdownTableMode: function () { return "code"; },
            convertMarkdownTables: function (text) { return text; },
        },
    },
};
(0, vitest_1.describe)("msteams messenger", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, runtime_js_1.setMSTeamsRuntime)(runtimeStub);
    });
    (0, vitest_1.describe)("renderReplyPayloadsToMessages", function () {
        (0, vitest_1.it)("filters silent replies", function () {
            var messages = (0, messenger_js_1.renderReplyPayloadsToMessages)([{ text: plugin_sdk_1.SILENT_REPLY_TOKEN }], {
                textChunkLimit: 4000,
                tableMode: "code",
            });
            (0, vitest_1.expect)(messages).toEqual([]);
        });
        (0, vitest_1.it)("filters silent reply prefixes", function () {
            var messages = (0, messenger_js_1.renderReplyPayloadsToMessages)([{ text: "".concat(plugin_sdk_1.SILENT_REPLY_TOKEN, " -- ignored") }], { textChunkLimit: 4000, tableMode: "code" });
            (0, vitest_1.expect)(messages).toEqual([]);
        });
        (0, vitest_1.it)("splits media into separate messages by default", function () {
            var messages = (0, messenger_js_1.renderReplyPayloadsToMessages)([{ text: "hi", mediaUrl: "https://example.com/a.png" }], { textChunkLimit: 4000, tableMode: "code" });
            (0, vitest_1.expect)(messages).toEqual([{ text: "hi" }, { mediaUrl: "https://example.com/a.png" }]);
        });
        (0, vitest_1.it)("supports inline media mode", function () {
            var messages = (0, messenger_js_1.renderReplyPayloadsToMessages)([{ text: "hi", mediaUrl: "https://example.com/a.png" }], { textChunkLimit: 4000, mediaMode: "inline", tableMode: "code" });
            (0, vitest_1.expect)(messages).toEqual([{ text: "hi", mediaUrl: "https://example.com/a.png" }]);
        });
        (0, vitest_1.it)("chunks long text when enabled", function () {
            var long = "hello ".repeat(200);
            var messages = (0, messenger_js_1.renderReplyPayloadsToMessages)([{ text: long }], {
                textChunkLimit: 50,
                tableMode: "code",
            });
            (0, vitest_1.expect)(messages.length).toBeGreaterThan(1);
        });
    });
    (0, vitest_1.describe)("sendMSTeamsMessages", function () {
        var baseRef = {
            activityId: "activity123",
            user: { id: "user123", name: "User" },
            agent: { id: "bot123", name: "Bot" },
            conversation: { id: "19:abc@thread.tacv2;messageid=deadbeef" },
            channelId: "msteams",
            serviceUrl: "https://service.example.com",
        };
        (0, vitest_1.it)("sends thread messages via the provided context", function () { return __awaiter(void 0, void 0, void 0, function () {
            var sent, ctx, adapter, ids;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sent = [];
                        ctx = {
                            sendActivity: function (activity) { return __awaiter(void 0, void 0, void 0, function () {
                                var text;
                                return __generator(this, function (_a) {
                                    text = activity.text;
                                    sent.push(text !== null && text !== void 0 ? text : "");
                                    return [2 /*return*/, { id: "id:".concat(text !== null && text !== void 0 ? text : "") }];
                                });
                            }); },
                        };
                        adapter = {
                            continueConversation: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/];
                            }); }); },
                        };
                        return [4 /*yield*/, (0, messenger_js_1.sendMSTeamsMessages)({
                                replyStyle: "thread",
                                adapter: adapter,
                                appId: "app123",
                                conversationRef: baseRef,
                                context: ctx,
                                messages: [{ text: "one" }, { text: "two" }],
                            })];
                    case 1:
                        ids = _a.sent();
                        (0, vitest_1.expect)(sent).toEqual(["one", "two"]);
                        (0, vitest_1.expect)(ids).toEqual(["id:one", "id:two"]);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("sends top-level messages via continueConversation and strips activityId", function () { return __awaiter(void 0, void 0, void 0, function () {
            var seen, adapter, ids, ref;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        seen = { texts: [] };
                        adapter = {
                            continueConversation: function (_appId, reference, logic) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            seen.reference = reference;
                                            return [4 /*yield*/, logic({
                                                    sendActivity: function (activity) { return __awaiter(void 0, void 0, void 0, function () {
                                                        var text;
                                                        return __generator(this, function (_a) {
                                                            text = activity.text;
                                                            seen.texts.push(text !== null && text !== void 0 ? text : "");
                                                            return [2 /*return*/, { id: "id:".concat(text !== null && text !== void 0 ? text : "") }];
                                                        });
                                                    }); },
                                                })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                        };
                        return [4 /*yield*/, (0, messenger_js_1.sendMSTeamsMessages)({
                                replyStyle: "top-level",
                                adapter: adapter,
                                appId: "app123",
                                conversationRef: baseRef,
                                messages: [{ text: "hello" }],
                            })];
                    case 1:
                        ids = _b.sent();
                        (0, vitest_1.expect)(seen.texts).toEqual(["hello"]);
                        (0, vitest_1.expect)(ids).toEqual(["id:hello"]);
                        ref = seen.reference;
                        (0, vitest_1.expect)(ref.activityId).toBeUndefined();
                        (0, vitest_1.expect)((_a = ref.conversation) === null || _a === void 0 ? void 0 : _a.id).toBe("19:abc@thread.tacv2");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("retries thread sends on throttling (429)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var attempts, retryEvents, ctx, adapter, ids;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        attempts = [];
                        retryEvents = [];
                        ctx = {
                            sendActivity: function (activity) { return __awaiter(void 0, void 0, void 0, function () {
                                var text;
                                return __generator(this, function (_a) {
                                    text = activity.text;
                                    attempts.push(text !== null && text !== void 0 ? text : "");
                                    if (attempts.length === 1) {
                                        throw Object.assign(new Error("throttled"), { statusCode: 429 });
                                    }
                                    return [2 /*return*/, { id: "id:".concat(text !== null && text !== void 0 ? text : "") }];
                                });
                            }); },
                        };
                        adapter = {
                            continueConversation: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/];
                            }); }); },
                        };
                        return [4 /*yield*/, (0, messenger_js_1.sendMSTeamsMessages)({
                                replyStyle: "thread",
                                adapter: adapter,
                                appId: "app123",
                                conversationRef: baseRef,
                                context: ctx,
                                messages: [{ text: "one" }],
                                retry: { maxAttempts: 2, baseDelayMs: 0, maxDelayMs: 0 },
                                onRetry: function (e) { return retryEvents.push({ nextAttempt: e.nextAttempt, delayMs: e.delayMs }); },
                            })];
                    case 1:
                        ids = _a.sent();
                        (0, vitest_1.expect)(attempts).toEqual(["one", "one"]);
                        (0, vitest_1.expect)(ids).toEqual(["id:one"]);
                        (0, vitest_1.expect)(retryEvents).toEqual([{ nextAttempt: 2, delayMs: 0 }]);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("does not retry thread sends on client errors (4xx)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ctx, adapter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx = {
                            sendActivity: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    throw Object.assign(new Error("bad request"), { statusCode: 400 });
                                });
                            }); },
                        };
                        adapter = {
                            continueConversation: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/];
                            }); }); },
                        };
                        return [4 /*yield*/, (0, vitest_1.expect)((0, messenger_js_1.sendMSTeamsMessages)({
                                replyStyle: "thread",
                                adapter: adapter,
                                appId: "app123",
                                conversationRef: baseRef,
                                context: ctx,
                                messages: [{ text: "one" }],
                                retry: { maxAttempts: 3, baseDelayMs: 0, maxDelayMs: 0 },
                            })).rejects.toMatchObject({ statusCode: 400 })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("retries top-level sends on transient (5xx)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var attempts, adapter, ids;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        attempts = [];
                        adapter = {
                            continueConversation: function (_appId, _reference, logic) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, logic({
                                                sendActivity: function (activity) { return __awaiter(void 0, void 0, void 0, function () {
                                                    var text;
                                                    return __generator(this, function (_a) {
                                                        text = activity.text;
                                                        attempts.push(text !== null && text !== void 0 ? text : "");
                                                        if (attempts.length === 1) {
                                                            throw Object.assign(new Error("server error"), {
                                                                statusCode: 503,
                                                            });
                                                        }
                                                        return [2 /*return*/, { id: "id:".concat(text !== null && text !== void 0 ? text : "") }];
                                                    });
                                                }); },
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                        };
                        return [4 /*yield*/, (0, messenger_js_1.sendMSTeamsMessages)({
                                replyStyle: "top-level",
                                adapter: adapter,
                                appId: "app123",
                                conversationRef: baseRef,
                                messages: [{ text: "hello" }],
                                retry: { maxAttempts: 2, baseDelayMs: 0, maxDelayMs: 0 },
                            })];
                    case 1:
                        ids = _a.sent();
                        (0, vitest_1.expect)(attempts).toEqual(["hello", "hello"]);
                        (0, vitest_1.expect)(ids).toEqual(["id:hello"]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
