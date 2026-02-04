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
var pi_embedded_js_1 = require("../agents/pi-embedded.js");
var reply_js_1 = require("../auto-reply/reply.js");
var inbound_dedupe_js_1 = require("../auto-reply/reply/inbound-dedupe.js");
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
(0, vitest_1.describe)("partial reply gating", function () {
    (0, vitest_1.it)("does not send partial replies for WhatsApp provider", function () { return __awaiter(void 0, void 0, void 0, function () {
        var reply, sendComposing, sendMedia, replyResolver, mockConfig, resolverOptions;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    reply = vitest_1.vi.fn().mockResolvedValue(undefined);
                    sendComposing = vitest_1.vi.fn().mockResolvedValue(undefined);
                    sendMedia = vitest_1.vi.fn().mockResolvedValue(undefined);
                    replyResolver = vitest_1.vi.fn().mockResolvedValue({ text: "final reply" });
                    mockConfig = {
                        channels: { whatsapp: { allowFrom: ["*"] } },
                    };
                    (0, test_helpers_js_1.setLoadConfigMock)(mockConfig);
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                            var onMessage = _b.onMessage;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, onMessage({
                                            id: "m1",
                                            from: "+1000",
                                            conversationId: "+1000",
                                            to: "+2000",
                                            body: "hello",
                                            timestamp: Date.now(),
                                            chatType: "direct",
                                            chatId: "direct:+1000",
                                            sendComposing: sendComposing,
                                            reply: reply,
                                            sendMedia: sendMedia,
                                        })];
                                    case 1:
                                        _c.sent();
                                        return [2 /*return*/, { close: vitest_1.vi.fn().mockResolvedValue(undefined) }];
                                }
                            });
                        }); }, false, replyResolver)];
                case 1:
                    _c.sent();
                    (0, test_helpers_js_1.resetLoadConfigMock)();
                    (0, vitest_1.expect)(replyResolver).toHaveBeenCalledTimes(1);
                    resolverOptions = (_b = (_a = replyResolver.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : {};
                    (0, vitest_1.expect)("onPartialReply" in resolverOptions).toBe(false);
                    (0, vitest_1.expect)(reply).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(reply).toHaveBeenCalledWith("final reply");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back from empty senderJid to senderE164 for SenderId", function () { return __awaiter(void 0, void 0, void 0, function () {
        var reply, sendComposing, sendMedia, replyResolver, mockConfig, ctx;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    reply = vitest_1.vi.fn().mockResolvedValue(undefined);
                    sendComposing = vitest_1.vi.fn().mockResolvedValue(undefined);
                    sendMedia = vitest_1.vi.fn().mockResolvedValue(undefined);
                    replyResolver = vitest_1.vi.fn().mockResolvedValue({ text: "final reply" });
                    mockConfig = {
                        channels: {
                            whatsapp: {
                                allowFrom: ["*"],
                            },
                        },
                    };
                    (0, test_helpers_js_1.setLoadConfigMock)(mockConfig);
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                            var onMessage = _b.onMessage;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, onMessage({
                                            id: "m1",
                                            from: "+1000",
                                            conversationId: "+1000",
                                            to: "+2000",
                                            body: "hello",
                                            timestamp: Date.now(),
                                            chatType: "direct",
                                            chatId: "direct:+1000",
                                            senderJid: "",
                                            senderE164: "+1000",
                                            sendComposing: sendComposing,
                                            reply: reply,
                                            sendMedia: sendMedia,
                                        })];
                                    case 1:
                                        _c.sent();
                                        return [2 /*return*/, { close: vitest_1.vi.fn().mockResolvedValue(undefined) }];
                                }
                            });
                        }); }, false, replyResolver)];
                case 1:
                    _c.sent();
                    (0, test_helpers_js_1.resetLoadConfigMock)();
                    (0, vitest_1.expect)(replyResolver).toHaveBeenCalledTimes(1);
                    ctx = (_b = (_a = replyResolver.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : {};
                    (0, vitest_1.expect)(ctx.SenderE164).toBe("+1000");
                    (0, vitest_1.expect)(ctx.SenderId).toBe("+1000");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updates last-route for direct chats without senderE164", function () { return __awaiter(void 0, void 0, void 0, function () {
        var now, mainSessionKey, store, replyResolver, mockConfig, stored, attempt, _a, _b;
        var _c;
        var _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    now = Date.now();
                    mainSessionKey = "agent:main:main";
                    return [4 /*yield*/, makeSessionStore((_c = {},
                            _c[mainSessionKey] = { sessionId: "sid", updatedAt: now - 1 },
                            _c))];
                case 1:
                    store = _h.sent();
                    replyResolver = vitest_1.vi.fn().mockResolvedValue(undefined);
                    mockConfig = {
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { store: store.storePath },
                    };
                    (0, test_helpers_js_1.setLoadConfigMock)(mockConfig);
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                            var onMessage = _b.onMessage;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, onMessage({
                                            id: "m1",
                                            from: "+1000",
                                            conversationId: "+1000",
                                            to: "+2000",
                                            body: "hello",
                                            timestamp: now,
                                            chatType: "direct",
                                            chatId: "direct:+1000",
                                            sendComposing: vitest_1.vi.fn().mockResolvedValue(undefined),
                                            reply: vitest_1.vi.fn().mockResolvedValue(undefined),
                                            sendMedia: vitest_1.vi.fn().mockResolvedValue(undefined),
                                        })];
                                    case 1:
                                        _c.sent();
                                        return [2 /*return*/, { close: vitest_1.vi.fn().mockResolvedValue(undefined) }];
                                }
                            });
                        }); }, false, replyResolver)];
                case 2:
                    _h.sent();
                    stored = null;
                    attempt = 0;
                    _h.label = 3;
                case 3:
                    if (!(attempt < 50)) return [3 /*break*/, 7];
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(store.storePath, "utf8")];
                case 4:
                    stored = _b.apply(_a, [_h.sent()]);
                    if (((_d = stored[mainSessionKey]) === null || _d === void 0 ? void 0 : _d.lastChannel) && ((_e = stored[mainSessionKey]) === null || _e === void 0 ? void 0 : _e.lastTo)) {
                        return [3 /*break*/, 7];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5); })];
                case 5:
                    _h.sent();
                    _h.label = 6;
                case 6:
                    attempt += 1;
                    return [3 /*break*/, 3];
                case 7:
                    if (!stored) {
                        throw new Error("store not loaded");
                    }
                    (0, vitest_1.expect)((_f = stored[mainSessionKey]) === null || _f === void 0 ? void 0 : _f.lastChannel).toBe("whatsapp");
                    (0, vitest_1.expect)((_g = stored[mainSessionKey]) === null || _g === void 0 ? void 0 : _g.lastTo).toBe("+1000");
                    (0, test_helpers_js_1.resetLoadConfigMock)();
                    return [4 /*yield*/, store.cleanup()];
                case 8:
                    _h.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updates last-route for group chats with account id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var now, groupSessionKey, store, replyResolver, mockConfig, stored, attempt, _a, _b;
        var _c;
        var _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    now = Date.now();
                    groupSessionKey = "agent:main:whatsapp:group:123@g.us";
                    return [4 /*yield*/, makeSessionStore((_c = {},
                            _c[groupSessionKey] = { sessionId: "sid", updatedAt: now - 1 },
                            _c))];
                case 1:
                    store = _k.sent();
                    replyResolver = vitest_1.vi.fn().mockResolvedValue(undefined);
                    mockConfig = {
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { store: store.storePath },
                    };
                    (0, test_helpers_js_1.setLoadConfigMock)(mockConfig);
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                            var onMessage = _b.onMessage;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, onMessage({
                                            id: "g1",
                                            from: "123@g.us",
                                            conversationId: "123@g.us",
                                            to: "+2000",
                                            body: "hello",
                                            timestamp: now,
                                            chatType: "group",
                                            chatId: "123@g.us",
                                            accountId: "work",
                                            senderE164: "+1000",
                                            senderName: "Alice",
                                            selfE164: "+2000",
                                            sendComposing: vitest_1.vi.fn().mockResolvedValue(undefined),
                                            reply: vitest_1.vi.fn().mockResolvedValue(undefined),
                                            sendMedia: vitest_1.vi.fn().mockResolvedValue(undefined),
                                        })];
                                    case 1:
                                        _c.sent();
                                        return [2 /*return*/, { close: vitest_1.vi.fn().mockResolvedValue(undefined) }];
                                }
                            });
                        }); }, false, replyResolver)];
                case 2:
                    _k.sent();
                    stored = null;
                    attempt = 0;
                    _k.label = 3;
                case 3:
                    if (!(attempt < 50)) return [3 /*break*/, 7];
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(store.storePath, "utf8")];
                case 4:
                    stored = _b.apply(_a, [_k.sent()]);
                    if (((_d = stored[groupSessionKey]) === null || _d === void 0 ? void 0 : _d.lastChannel) &&
                        ((_e = stored[groupSessionKey]) === null || _e === void 0 ? void 0 : _e.lastTo) &&
                        ((_f = stored[groupSessionKey]) === null || _f === void 0 ? void 0 : _f.lastAccountId)) {
                        return [3 /*break*/, 7];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5); })];
                case 5:
                    _k.sent();
                    _k.label = 6;
                case 6:
                    attempt += 1;
                    return [3 /*break*/, 3];
                case 7:
                    if (!stored) {
                        throw new Error("store not loaded");
                    }
                    (0, vitest_1.expect)((_g = stored[groupSessionKey]) === null || _g === void 0 ? void 0 : _g.lastChannel).toBe("whatsapp");
                    (0, vitest_1.expect)((_h = stored[groupSessionKey]) === null || _h === void 0 ? void 0 : _h.lastTo).toBe("123@g.us");
                    (0, vitest_1.expect)((_j = stored[groupSessionKey]) === null || _j === void 0 ? void 0 : _j.lastAccountId).toBe("work");
                    (0, test_helpers_js_1.resetLoadConfigMock)();
                    return [4 /*yield*/, store.cleanup()];
                case 8:
                    _k.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults to self-only when no config is present", function () { return __awaiter(void 0, void 0, void 0, function () {
        var blocked, allowed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                        payloads: [{ text: "ok" }],
                        meta: {
                            durationMs: 1,
                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                        },
                    });
                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                            Body: "hi",
                            From: "whatsapp:+999",
                            To: "whatsapp:+123",
                        }, undefined, {})];
                case 1:
                    blocked = _a.sent();
                    (0, vitest_1.expect)(blocked).toBeUndefined();
                    (0, vitest_1.expect)(pi_embedded_js_1.runEmbeddedPiAgent).not.toHaveBeenCalled();
                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                            Body: "hi",
                            From: "whatsapp:+123",
                            To: "whatsapp:+123",
                        }, undefined, {})];
                case 2:
                    allowed = _a.sent();
                    (0, vitest_1.expect)(allowed).toMatchObject({ text: "ok", audioAsVoice: false });
                    (0, vitest_1.expect)(pi_embedded_js_1.runEmbeddedPiAgent).toHaveBeenCalledOnce();
                    return [2 /*return*/];
            }
        });
    }); });
});
