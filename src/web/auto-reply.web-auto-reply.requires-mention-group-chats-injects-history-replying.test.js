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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./test-helpers.js");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
vitest_1.vi.mock("../agents/pi-embedded.js", function () { return ({
    abortEmbeddedPiRun: vitest_1.vi.fn().mockReturnValue(false),
    isEmbeddedPiRunActive: vitest_1.vi.fn().mockReturnValue(false),
    isEmbeddedPiRunStreaming: vitest_1.vi.fn().mockReturnValue(false),
    runEmbeddedPiAgent: vitest_1.vi.fn(),
    queueEmbeddedPiMessage: vitest_1.vi.fn().mockReturnValue(false),
    resolveEmbeddedSessionLane: function (key) { return "session:".concat(key.trim() || "main"); },
}); });
var inbound_dedupe_js_1 = require("../auto-reply/reply/inbound-dedupe.js");
var logging_js_1 = require("../logging.js");
var auto_reply_js_1 = require("./auto-reply.js");
var test_helpers_js_1 = require("./test-helpers.js");
var previousHome;
var tempHome;
var rmDirWithRetries = function (dir) { return __awaiter(void 0, void 0, void 0, function () {
    var attempt, err_1, code;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                attempt = 0;
                _a.label = 1;
            case 1:
                if (!(attempt < 10)) return [3 /*break*/, 8];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 7]);
                return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
            case 3:
                _a.sent();
                return [2 /*return*/];
            case 4:
                err_1 = _a.sent();
                code = err_1 && typeof err_1 === "object" && "code" in err_1
                    ? String(err_1.code)
                    : null;
                if (!(code === "ENOTEMPTY" || code === "EBUSY" || code === "EPERM")) return [3 /*break*/, 6];
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 25); })];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6: throw err_1;
            case 7:
                attempt += 1;
                return [3 /*break*/, 1];
            case 8: return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
            case 9:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, inbound_dedupe_js_1.resetInboundDedupe)();
                previousHome = process.env.HOME;
                return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-web-home-"))];
            case 1:
                tempHome = _a.sent();
                process.env.HOME = tempHome;
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                process.env.HOME = previousHome;
                if (!tempHome) return [3 /*break*/, 2];
                return [4 /*yield*/, rmDirWithRetries(tempHome)];
            case 1:
                _a.sent();
                tempHome = undefined;
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
var _makeSessionStore = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (entries) {
        var dir, storePath, cleanup;
        if (entries === void 0) { entries = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-session-"))];
                case 1:
                    dir = _a.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify(entries))];
                case 2:
                    _a.sent();
                    cleanup = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var attempt, err_2, code;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    attempt = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(attempt < 10)) return [3 /*break*/, 8];
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, 4, , 7]);
                                    return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/];
                                case 4:
                                    err_2 = _a.sent();
                                    code = err_2 && typeof err_2 === "object" && "code" in err_2
                                        ? String(err_2.code)
                                        : null;
                                    if (!(code === "ENOTEMPTY" || code === "EBUSY" || code === "EPERM")) return [3 /*break*/, 6];
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 25); })];
                                case 5:
                                    _a.sent();
                                    return [3 /*break*/, 7];
                                case 6: throw err_2;
                                case 7:
                                    attempt += 1;
                                    return [3 /*break*/, 1];
                                case 8: return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                                case 9:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [2 /*return*/, {
                            storePath: storePath,
                            cleanup: cleanup,
                        }];
            }
        });
    });
};
(0, vitest_1.describe)("web auto-reply", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        (0, test_helpers_js_1.resetBaileysMocks)();
        (0, test_helpers_js_1.resetLoadConfigMock)();
    });
    (0, vitest_1.afterEach)(function () {
        (0, logging_js_1.resetLogger)();
        (0, logging_js_1.setLoggerOverride)(null);
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)("requires mention in group chats and injects history when replying", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendMedia, reply, sendComposing, resolver, capturedOnMessage, listenerFactory, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendMedia = vitest_1.vi.fn();
                    reply = vitest_1.vi.fn().mockResolvedValue(undefined);
                    sendComposing = vitest_1.vi.fn();
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "ok" });
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "hello group",
                            from: "123@g.us",
                            conversationId: "123@g.us",
                            chatId: "123@g.us",
                            chatType: "group",
                            to: "+2",
                            id: "g1",
                            senderE164: "+111",
                            senderName: "Alice",
                            selfE164: "+999",
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(resolver).not.toHaveBeenCalled();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "@bot ping",
                            from: "123@g.us",
                            conversationId: "123@g.us",
                            chatId: "123@g.us",
                            chatType: "group",
                            to: "+2",
                            id: "g2",
                            senderE164: "+222",
                            senderName: "Bob",
                            mentionedJids: ["999@s.whatsapp.net"],
                            selfE164: "+999",
                            selfJid: "999@s.whatsapp.net",
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(resolver).toHaveBeenCalledTimes(1);
                    payload = resolver.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.Body).toContain("Chat messages since your last reply");
                    (0, vitest_1.expect)(payload.Body).toContain("Alice (+111): hello group");
                    (0, vitest_1.expect)(payload.Body).toContain("[message_id: g1]");
                    (0, vitest_1.expect)(payload.Body).toContain("@bot ping");
                    (0, vitest_1.expect)(payload.SenderName).toBe("Bob");
                    (0, vitest_1.expect)(payload.SenderE164).toBe("+222");
                    (0, vitest_1.expect)(payload.SenderId).toBe("+222");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("bypasses mention gating for owner /new in group chats", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendMedia, reply, sendComposing, resolver, capturedOnMessage, listenerFactory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendMedia = vitest_1.vi.fn();
                    reply = vitest_1.vi.fn().mockResolvedValue(undefined);
                    sendComposing = vitest_1.vi.fn();
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "ok" });
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    (0, test_helpers_js_1.setLoadConfigMock)(function () { return ({
                        channels: {
                            whatsapp: {
                                allowFrom: ["+111"],
                            },
                        },
                    }); });
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "/new",
                            from: "123@g.us",
                            conversationId: "123@g.us",
                            chatId: "123@g.us",
                            chatType: "group",
                            to: "+2",
                            id: "g-new",
                            senderE164: "+111",
                            senderName: "Owner",
                            selfE164: "+999",
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(resolver).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not bypass mention gating for non-owner /new in group chats", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendMedia, reply, sendComposing, resolver, capturedOnMessage, listenerFactory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendMedia = vitest_1.vi.fn();
                    reply = vitest_1.vi.fn().mockResolvedValue(undefined);
                    sendComposing = vitest_1.vi.fn();
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "ok" });
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    (0, test_helpers_js_1.setLoadConfigMock)(function () { return ({
                        channels: {
                            whatsapp: {
                                allowFrom: ["+999"],
                            },
                        },
                    }); });
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "/new",
                            from: "123@g.us",
                            conversationId: "123@g.us",
                            chatId: "123@g.us",
                            chatType: "group",
                            to: "+2",
                            id: "g-new-unauth",
                            senderE164: "+111",
                            senderName: "NotOwner",
                            selfE164: "+999",
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(resolver).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("bypasses mention gating for owner /status in group chats", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendMedia, reply, sendComposing, resolver, capturedOnMessage, listenerFactory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendMedia = vitest_1.vi.fn();
                    reply = vitest_1.vi.fn().mockResolvedValue(undefined);
                    sendComposing = vitest_1.vi.fn();
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "ok" });
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    (0, test_helpers_js_1.setLoadConfigMock)(function () { return ({
                        channels: {
                            whatsapp: {
                                allowFrom: ["+111"],
                            },
                        },
                    }); });
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "/status",
                            from: "123@g.us",
                            conversationId: "123@g.us",
                            chatId: "123@g.us",
                            chatType: "group",
                            to: "+2",
                            id: "g-status",
                            senderE164: "+111",
                            senderName: "Owner",
                            selfE164: "+999",
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(resolver).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes conversation id through as From for group replies", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendMedia, reply, sendComposing, resolver, capturedOnMessage, listenerFactory, payload;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sendMedia = vitest_1.vi.fn();
                    reply = vitest_1.vi.fn().mockResolvedValue(undefined);
                    sendComposing = vitest_1.vi.fn();
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "ok" });
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "@bot ping",
                            from: "123@g.us",
                            conversationId: "123@g.us",
                            chatId: "123@g.us",
                            chatType: "group",
                            to: "+2",
                            id: "g1",
                            senderE164: "+222",
                            senderName: "Bob",
                            mentionedJids: ["999@s.whatsapp.net"],
                            selfE164: "+999",
                            selfJid: "999@s.whatsapp.net",
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 2:
                    _b.sent();
                    payload = (_a = resolver.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(payload.From).toBe("123@g.us");
                    (0, vitest_1.expect)(payload.To).toBe("+2");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("detects LID mentions using authDir mapping", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendMedia, reply, sendComposing, resolver, capturedOnMessage, listenerFactory, authDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendMedia = vitest_1.vi.fn();
                    reply = vitest_1.vi.fn().mockResolvedValue(undefined);
                    sendComposing = vitest_1.vi.fn();
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "ok" });
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-wa-auth-"))];
                case 1:
                    authDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 7, 9]);
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(authDir, "lid-mapping-555_reverse.json"), JSON.stringify("15551234"))];
                case 3:
                    _a.sent();
                    (0, test_helpers_js_1.setLoadConfigMock)(function () { return ({
                        channels: {
                            whatsapp: {
                                allowFrom: ["*"],
                                accounts: {
                                    default: { authDir: authDir },
                                },
                            },
                        },
                    }); });
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "hello group",
                            from: "123@g.us",
                            conversationId: "123@g.us",
                            chatId: "123@g.us",
                            chatType: "group",
                            to: "+2",
                            id: "g1",
                            senderE164: "+111",
                            senderName: "Alice",
                            selfE164: "+15551234",
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "@bot ping",
                            from: "123@g.us",
                            conversationId: "123@g.us",
                            chatId: "123@g.us",
                            chatType: "group",
                            to: "+2",
                            id: "g2",
                            senderE164: "+222",
                            senderName: "Bob",
                            mentionedJids: ["555@lid"],
                            selfE164: "+15551234",
                            selfJid: "15551234@s.whatsapp.net",
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 6:
                    _a.sent();
                    (0, vitest_1.expect)(resolver).toHaveBeenCalledTimes(1);
                    return [3 /*break*/, 9];
                case 7:
                    (0, test_helpers_js_1.resetLoadConfigMock)();
                    return [4 /*yield*/, rmDirWithRetries(authDir)];
                case 8:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("derives self E.164 from LID selfJid for mention gating", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendMedia, reply, sendComposing, resolver, capturedOnMessage, listenerFactory, authDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendMedia = vitest_1.vi.fn();
                    reply = vitest_1.vi.fn().mockResolvedValue(undefined);
                    sendComposing = vitest_1.vi.fn();
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "ok" });
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-wa-auth-"))];
                case 1:
                    authDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 6, 8]);
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(authDir, "lid-mapping-777_reverse.json"), JSON.stringify("15550077"))];
                case 3:
                    _a.sent();
                    (0, test_helpers_js_1.setLoadConfigMock)(function () { return ({
                        channels: {
                            whatsapp: {
                                allowFrom: ["*"],
                                accounts: {
                                    default: { authDir: authDir },
                                },
                            },
                        },
                    }); });
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "@bot ping",
                            from: "123@g.us",
                            conversationId: "123@g.us",
                            chatId: "123@g.us",
                            chatType: "group",
                            to: "+2",
                            id: "g3",
                            senderE164: "+333",
                            senderName: "Cara",
                            mentionedJids: ["777@lid"],
                            selfJid: "777@lid",
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(resolver).toHaveBeenCalledTimes(1);
                    return [3 /*break*/, 8];
                case 6:
                    (0, test_helpers_js_1.resetLoadConfigMock)();
                    return [4 /*yield*/, rmDirWithRetries(authDir)];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sets OriginatingTo to the sender for queued routing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendMedia, reply, sendComposing, resolver, capturedOnMessage, listenerFactory, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendMedia = vitest_1.vi.fn();
                    reply = vitest_1.vi.fn().mockResolvedValue(undefined);
                    sendComposing = vitest_1.vi.fn();
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "ok" });
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "hello",
                            from: "+15551234567",
                            to: "+19998887777",
                            id: "m-originating",
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(resolver).toHaveBeenCalledTimes(1);
                    payload = resolver.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.OriginatingChannel).toBe("whatsapp");
                    (0, vitest_1.expect)(payload.OriginatingTo).toBe("+15551234567");
                    (0, vitest_1.expect)(payload.To).toBe("+19998887777");
                    (0, vitest_1.expect)(payload.OriginatingTo).not.toBe(payload.To);
                    return [2 /*return*/];
            }
        });
    }); });
});
