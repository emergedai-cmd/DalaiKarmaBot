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
var node_crypto_1 = require("node:crypto");
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
var inbound_contract_js_1 = require("../../test/helpers/inbound-contract.js");
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
var makeSessionStore = function () {
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
    (0, vitest_1.it)("supports always-on group activation with silent token and clears pending history", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendMedia, reply, sendComposing, resolver, _a, storePath, cleanup, capturedOnMessage, listenerFactory, payload;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sendMedia = vitest_1.vi.fn();
                    reply = vitest_1.vi.fn().mockResolvedValue(undefined);
                    sendComposing = vitest_1.vi.fn();
                    resolver = vitest_1.vi
                        .fn()
                        .mockResolvedValueOnce({ text: auto_reply_js_1.SILENT_REPLY_TOKEN })
                        .mockResolvedValueOnce({ text: "ok" });
                    return [4 /*yield*/, makeSessionStore({
                            "agent:main:whatsapp:group:123@g.us": {
                                sessionId: "g-1",
                                updatedAt: Date.now(),
                                groupActivation: "always",
                            },
                        })];
                case 1:
                    _a = _b.sent(), storePath = _a.storePath, cleanup = _a.cleanup;
                    (0, test_helpers_js_1.setLoadConfigMock)(function () { return ({
                        messages: {
                            groupChat: { mentionPatterns: ["@openclaw"] },
                        },
                        session: { store: storePath },
                    }); });
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "first",
                            from: "123@g.us",
                            conversationId: "123@g.us",
                            chatId: "123@g.us",
                            chatType: "group",
                            to: "+2",
                            id: "g-always-1",
                            senderE164: "+111",
                            senderName: "Alice",
                            selfE164: "+999",
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(resolver).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(reply).not.toHaveBeenCalled();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "second",
                            from: "123@g.us",
                            conversationId: "123@g.us",
                            chatId: "123@g.us",
                            chatType: "group",
                            to: "+2",
                            id: "g-always-2",
                            senderE164: "+222",
                            senderName: "Bob",
                            selfE164: "+999",
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(resolver).toHaveBeenCalledTimes(2);
                    payload = resolver.mock.calls[1][0];
                    (0, vitest_1.expect)(payload.Body).not.toContain("Chat messages since your last reply");
                    (0, vitest_1.expect)(payload.Body).not.toContain("Alice (+111): first");
                    (0, vitest_1.expect)(payload.Body).not.toContain("[message_id: g-always-1]");
                    (0, vitest_1.expect)(payload.Body).toContain("second");
                    (0, inbound_contract_js_1.expectInboundContextContract)(payload);
                    (0, vitest_1.expect)(payload.SenderName).toBe("Bob");
                    (0, vitest_1.expect)(payload.SenderE164).toBe("+222");
                    (0, vitest_1.expect)(reply).toHaveBeenCalledTimes(1);
                    return [4 /*yield*/, cleanup()];
                case 5:
                    _b.sent();
                    (0, test_helpers_js_1.resetLoadConfigMock)();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("ignores JID mentions in self-chat mode (group chats)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendMedia, reply, sendComposing, resolver, capturedOnMessage, listenerFactory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendMedia = vitest_1.vi.fn();
                    reply = vitest_1.vi.fn().mockResolvedValue(undefined);
                    sendComposing = vitest_1.vi.fn();
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "ok" });
                    (0, test_helpers_js_1.setLoadConfigMock)(function () { return ({
                        channels: {
                            whatsapp: {
                                // Self-chat heuristic: allowFrom includes selfE164.
                                allowFrom: ["+999"],
                                groups: { "*": { requireMention: true } },
                            },
                        },
                        messages: {
                            groupChat: {
                                mentionPatterns: ["\\bopenclaw\\b"],
                            },
                        },
                    }); });
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
                    // WhatsApp @mention of the owner should NOT trigger the bot in self-chat mode.
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "@owner ping",
                            from: "123@g.us",
                            conversationId: "123@g.us",
                            chatId: "123@g.us",
                            chatType: "group",
                            to: "+2",
                            id: "g-self-1",
                            senderE164: "+111",
                            senderName: "Alice",
                            mentionedJids: ["999@s.whatsapp.net"],
                            selfE164: "+999",
                            selfJid: "999@s.whatsapp.net",
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 2:
                    // WhatsApp @mention of the owner should NOT trigger the bot in self-chat mode.
                    _a.sent();
                    (0, vitest_1.expect)(resolver).not.toHaveBeenCalled();
                    // Text-based mentionPatterns still work (user can type "openclaw" explicitly).
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "openclaw ping",
                            from: "123@g.us",
                            conversationId: "123@g.us",
                            chatId: "123@g.us",
                            chatType: "group",
                            to: "+2",
                            id: "g-self-2",
                            senderE164: "+222",
                            senderName: "Bob",
                            selfE164: "+999",
                            selfJid: "999@s.whatsapp.net",
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 3:
                    // Text-based mentionPatterns still work (user can type "openclaw" explicitly).
                    _a.sent();
                    (0, vitest_1.expect)(resolver).toHaveBeenCalledTimes(1);
                    (0, test_helpers_js_1.resetLoadConfigMock)();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("emits heartbeat logs with connection metadata", function () { return __awaiter(void 0, void 0, void 0, function () {
        var logPath, runtime, controller, listenerFactory, run, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    logPath = "/tmp/openclaw-heartbeat-".concat(node_crypto_1.default.randomUUID(), ".log");
                    (0, logging_js_1.setLoggerOverride)({ level: "trace", file: logPath });
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(),
                    };
                    controller = new AbortController();
                    listenerFactory = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var onClose;
                        return __generator(this, function (_a) {
                            onClose = new Promise(function () {
                                // never resolves; abort will short-circuit
                            });
                            return [2 /*return*/, { close: vitest_1.vi.fn(), onClose: onClose }];
                        });
                    }); });
                    run = (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, true, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ text: "ok" })];
                    }); }); }, runtime, controller.signal, {
                        heartbeatSeconds: 1,
                        reconnect: { initialMs: 5, maxMs: 5, maxAttempts: 1, factor: 1.1 },
                    });
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(1000)];
                case 1:
                    _a.sent();
                    controller.abort();
                    return [4 /*yield*/, vitest_1.vi.runAllTimersAsync()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, run.catch(function () { })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.readFile(logPath, "utf-8")];
                case 4:
                    content = _a.sent();
                    (0, vitest_1.expect)(content).toMatch(/web-heartbeat/);
                    (0, vitest_1.expect)(content).toMatch(/connectionId/);
                    (0, vitest_1.expect)(content).toMatch(/messagesHandled/);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("logs outbound replies to file", function () { return __awaiter(void 0, void 0, void 0, function () {
        var logPath, capturedOnMessage, listenerFactory, resolver, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logPath = "/tmp/openclaw-log-test-".concat(node_crypto_1.default.randomUUID(), ".log");
                    (0, logging_js_1.setLoggerOverride)({ level: "trace", file: logPath });
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "auto" });
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "hello",
                            from: "+1",
                            to: "+2",
                            id: "msg1",
                            sendComposing: vitest_1.vi.fn(),
                            reply: vitest_1.vi.fn(),
                            sendMedia: vitest_1.vi.fn(),
                        }))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.readFile(logPath, "utf-8")];
                case 3:
                    content = _a.sent();
                    (0, vitest_1.expect)(content).toMatch(/web-auto-reply/);
                    (0, vitest_1.expect)(content).toMatch(/auto/);
                    return [2 /*return*/];
            }
        });
    }); });
});
