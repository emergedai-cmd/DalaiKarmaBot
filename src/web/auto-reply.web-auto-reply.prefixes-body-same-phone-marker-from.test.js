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
    (0, vitest_1.it)("prefixes body with same-phone marker when from === to", function () { return __awaiter(void 0, void 0, void 0, function () {
        var capturedOnMessage, listenerFactory, resolver, callArg;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // Enable messagePrefix for same-phone mode testing
                    (0, test_helpers_js_1.setLoadConfigMock)(function () { return ({
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        messages: {
                            messagePrefix: "[same-phone]",
                            responsePrefix: undefined,
                        },
                    }); });
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "reply" });
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "hello",
                            from: "+1555",
                            to: "+1555", // Same phone!
                            id: "msg1",
                            sendComposing: vitest_1.vi.fn(),
                            reply: vitest_1.vi.fn(),
                            sendMedia: vitest_1.vi.fn(),
                        }))];
                case 2:
                    _b.sent();
                    callArg = (_a = resolver.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(callArg === null || callArg === void 0 ? void 0 : callArg.Body).toBeDefined();
                    (0, vitest_1.expect)(callArg === null || callArg === void 0 ? void 0 : callArg.Body).toContain("[WhatsApp +1555");
                    (0, vitest_1.expect)(callArg === null || callArg === void 0 ? void 0 : callArg.Body).toContain("[same-phone] hello");
                    (0, test_helpers_js_1.resetLoadConfigMock)();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not prefix body when from !== to", function () { return __awaiter(void 0, void 0, void 0, function () {
        var capturedOnMessage, listenerFactory, resolver, callArg;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "reply" });
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "hello",
                            from: "+1555",
                            to: "+2666", // Different phones
                            id: "msg1",
                            sendComposing: vitest_1.vi.fn(),
                            reply: vitest_1.vi.fn(),
                            sendMedia: vitest_1.vi.fn(),
                        }))];
                case 2:
                    _b.sent();
                    callArg = (_a = resolver.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(callArg === null || callArg === void 0 ? void 0 : callArg.Body).toContain("[WhatsApp +1555");
                    (0, vitest_1.expect)(callArg === null || callArg === void 0 ? void 0 : callArg.Body).toContain("hello");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("forwards reply-to context to resolver", function () { return __awaiter(void 0, void 0, void 0, function () {
        var capturedOnMessage, listenerFactory, resolver, callArg;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "reply" });
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "hello",
                            from: "+1555",
                            to: "+2666",
                            id: "msg1",
                            replyToId: "q1",
                            replyToBody: "original",
                            replyToSender: "+1999",
                            sendComposing: vitest_1.vi.fn(),
                            reply: vitest_1.vi.fn(),
                            sendMedia: vitest_1.vi.fn(),
                        }))];
                case 2:
                    _b.sent();
                    callArg = (_a = resolver.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(callArg.ReplyToId).toBe("q1");
                    (0, vitest_1.expect)(callArg.ReplyToBody).toBe("original");
                    (0, vitest_1.expect)(callArg.ReplyToSender).toBe("+1999");
                    (0, vitest_1.expect)(callArg.Body).toContain("[Replying to +1999 id:q1]");
                    (0, vitest_1.expect)(callArg.Body).toContain("original");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("applies responsePrefix to regular replies", function () { return __awaiter(void 0, void 0, void 0, function () {
        var capturedOnMessage, reply, listenerFactory, resolver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, test_helpers_js_1.setLoadConfigMock)(function () { return ({
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        messages: {
                            messagePrefix: undefined,
                            responsePrefix: "🦞",
                        },
                    }); });
                    reply = vitest_1.vi.fn();
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "hello there" });
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "hi",
                            from: "+1555",
                            to: "+2666",
                            id: "msg1",
                            sendComposing: vitest_1.vi.fn(),
                            reply: reply,
                            sendMedia: vitest_1.vi.fn(),
                        }))];
                case 2:
                    _a.sent();
                    // Reply should have responsePrefix prepended
                    (0, vitest_1.expect)(reply).toHaveBeenCalledWith("🦞 hello there");
                    (0, test_helpers_js_1.resetLoadConfigMock)();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults responsePrefix for self-chat replies when unset", function () { return __awaiter(void 0, void 0, void 0, function () {
        var capturedOnMessage, reply, listenerFactory, resolver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, test_helpers_js_1.setLoadConfigMock)(function () { return ({
                        agents: {
                            list: [
                                {
                                    id: "main",
                                    default: true,
                                    identity: { name: "Mainbot", emoji: "🦞", theme: "space lobster" },
                                },
                            ],
                        },
                        channels: { whatsapp: { allowFrom: ["+1555"] } },
                        messages: {
                            messagePrefix: undefined,
                            responsePrefix: undefined,
                        },
                    }); });
                    reply = vitest_1.vi.fn();
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "hello there" });
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "hi",
                            from: "+1555",
                            to: "+1555",
                            selfE164: "+1555",
                            chatType: "direct",
                            id: "msg1",
                            sendComposing: vitest_1.vi.fn(),
                            reply: reply,
                            sendMedia: vitest_1.vi.fn(),
                        }))];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(reply).toHaveBeenCalledWith("[Mainbot] hello there");
                    (0, test_helpers_js_1.resetLoadConfigMock)();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not deliver HEARTBEAT_OK responses", function () { return __awaiter(void 0, void 0, void 0, function () {
        var capturedOnMessage, reply, listenerFactory, resolver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, test_helpers_js_1.setLoadConfigMock)(function () { return ({
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        messages: {
                            messagePrefix: undefined,
                            responsePrefix: "🦞",
                        },
                    }); });
                    reply = vitest_1.vi.fn();
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: auto_reply_js_1.HEARTBEAT_TOKEN });
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "test",
                            from: "+1555",
                            to: "+2666",
                            id: "msg1",
                            sendComposing: vitest_1.vi.fn(),
                            reply: reply,
                            sendMedia: vitest_1.vi.fn(),
                        }))];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(reply).not.toHaveBeenCalled();
                    (0, test_helpers_js_1.resetLoadConfigMock)();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not double-prefix if responsePrefix already present", function () { return __awaiter(void 0, void 0, void 0, function () {
        var capturedOnMessage, reply, listenerFactory, resolver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, test_helpers_js_1.setLoadConfigMock)(function () { return ({
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        messages: {
                            messagePrefix: undefined,
                            responsePrefix: "🦞",
                        },
                    }); });
                    reply = vitest_1.vi.fn();
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "🦞 already prefixed" });
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(capturedOnMessage).toBeDefined();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "test",
                            from: "+1555",
                            to: "+2666",
                            id: "msg1",
                            sendComposing: vitest_1.vi.fn(),
                            reply: reply,
                            sendMedia: vitest_1.vi.fn(),
                        }))];
                case 2:
                    _a.sent();
                    // Should not double-prefix
                    (0, vitest_1.expect)(reply).toHaveBeenCalledWith("🦞 already prefixed");
                    (0, test_helpers_js_1.resetLoadConfigMock)();
                    return [2 /*return*/];
            }
        });
    }); });
});
