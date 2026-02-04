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
vitest_1.vi.mock("../media/store.js", function () { return ({
    saveMediaBuffer: vitest_1.vi.fn().mockResolvedValue({
        id: "mid",
        path: "/tmp/mid",
        size: 1,
        contentType: "image/jpeg",
    }),
}); });
var mockLoadConfig = vitest_1.vi.fn().mockReturnValue({
    channels: {
        whatsapp: {
            // Allow all in tests by default
            allowFrom: ["*"],
        },
    },
    messages: {
        messagePrefix: undefined,
        responsePrefix: undefined,
    },
});
var readAllowFromStoreMock = vitest_1.vi.fn().mockResolvedValue([]);
var upsertPairingRequestMock = vitest_1.vi.fn().mockResolvedValue({ code: "PAIRCODE", created: true });
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: function () { return mockLoadConfig(); } })];
        }
    });
}); });
vitest_1.vi.mock("../pairing/pairing-store.js", function () { return ({
    readChannelAllowFromStore: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return readAllowFromStoreMock.apply(void 0, args);
    },
    upsertChannelPairingRequest: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return upsertPairingRequestMock.apply(void 0, args);
    },
}); });
vitest_1.vi.mock("./session.js", function () {
    var EventEmitter = require("node:events").EventEmitter;
    var ev = new EventEmitter();
    var sock = {
        ev: ev,
        ws: { close: vitest_1.vi.fn() },
        sendPresenceUpdate: vitest_1.vi.fn().mockResolvedValue(undefined),
        sendMessage: vitest_1.vi.fn().mockResolvedValue(undefined),
        readMessages: vitest_1.vi.fn().mockResolvedValue(undefined),
        updateMediaMessage: vitest_1.vi.fn(),
        logger: {},
        signalRepository: {
            lidMapping: {
                getPNForLID: vitest_1.vi.fn().mockResolvedValue(null),
            },
        },
        user: { id: "123@s.whatsapp.net" },
    };
    return {
        createWaSocket: vitest_1.vi.fn().mockResolvedValue(sock),
        waitForWaConnection: vitest_1.vi.fn().mockResolvedValue(undefined),
        getStatusCode: vitest_1.vi.fn(function () { return 500; }),
    };
});
var createWaSocket = (await Promise.resolve().then(function () { return require("./session.js"); })).createWaSocket;
var _getSock = function () { return createWaSocket(); };
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_2 = require("vitest");
var logging_js_1 = require("../logging.js");
var inbound_js_1 = require("./inbound.js");
var _ACCOUNT_ID = "default";
var nowSeconds = function (offsetMs) {
    if (offsetMs === void 0) { offsetMs = 0; }
    return Math.floor((Date.now() + offsetMs) / 1000);
};
var authDir;
(0, vitest_2.describe)("web monitor inbox", function () {
    (0, vitest_2.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        readAllowFromStoreMock.mockResolvedValue([]);
        upsertPairingRequestMock.mockResolvedValue({
            code: "PAIRCODE",
            created: true,
        });
        (0, inbound_js_1.resetWebInboundDedupe)();
        authDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"));
    });
    (0, vitest_2.afterEach)(function () {
        (0, logging_js_1.resetLogger)();
        (0, logging_js_1.setLoggerOverride)(null);
        vitest_1.vi.useRealTimers();
        node_fs_1.default.rmSync(authDir, { recursive: true, force: true });
    });
    (0, vitest_2.it)("blocks messages from unauthorized senders not in allowFrom", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Test for auto-recovery fix: early allowFrom filtering prevents Bad MAC errors
                    // from unauthorized senders corrupting sessions
                    mockLoadConfig.mockReturnValue({
                        channels: {
                            whatsapp: {
                                // Only allow +111
                                allowFrom: ["+111"],
                            },
                        },
                        messages: {
                            messagePrefix: undefined,
                            responsePrefix: undefined,
                        },
                    });
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                            verbose: false,
                            accountId: _ACCOUNT_ID,
                            authDir: authDir,
                            onMessage: onMessage,
                        })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: {
                                    id: "unauth1",
                                    fromMe: false,
                                    remoteJid: "999@s.whatsapp.net",
                                },
                                message: { conversation: "unauthorized message" },
                                messageTimestamp: nowSeconds(),
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    // Should NOT call onMessage for unauthorized senders
                    (0, vitest_2.expect)(onMessage).not.toHaveBeenCalled();
                    // Should NOT send read receipts for blocked senders (privacy + avoids Baileys Bad MAC churn).
                    (0, vitest_2.expect)(sock.readMessages).not.toHaveBeenCalled();
                    (0, vitest_2.expect)(sock.sendMessage).toHaveBeenCalledTimes(1);
                    (0, vitest_2.expect)(sock.sendMessage).toHaveBeenCalledWith("999@s.whatsapp.net", {
                        text: vitest_2.expect.stringContaining("Your WhatsApp phone number: +999"),
                    });
                    (0, vitest_2.expect)(sock.sendMessage).toHaveBeenCalledWith("999@s.whatsapp.net", {
                        text: vitest_2.expect.stringContaining("Pairing code: PAIRCODE"),
                    });
                    // Reset mock for other tests
                    mockLoadConfig.mockReturnValue({
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        messages: {
                            messagePrefix: undefined,
                            responsePrefix: undefined,
                        },
                    });
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("skips read receipts in self-chat mode", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockLoadConfig.mockReturnValue({
                        channels: {
                            whatsapp: {
                                // Self-chat heuristic: allowFrom includes selfE164 (+123).
                                allowFrom: ["+123"],
                            },
                        },
                        messages: {
                            messagePrefix: undefined,
                            responsePrefix: undefined,
                        },
                    });
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                            verbose: false,
                            accountId: _ACCOUNT_ID,
                            authDir: authDir,
                            onMessage: onMessage,
                        })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: { id: "self1", fromMe: false, remoteJid: "123@s.whatsapp.net" },
                                message: { conversation: "self ping" },
                                messageTimestamp: nowSeconds(),
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledTimes(1);
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledWith(vitest_2.expect.objectContaining({ from: "+123", to: "+123", body: "self ping" }));
                    (0, vitest_2.expect)(sock.readMessages).not.toHaveBeenCalled();
                    // Reset mock for other tests
                    mockLoadConfig.mockReturnValue({
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        messages: {
                            messagePrefix: undefined,
                            responsePrefix: undefined,
                        },
                    });
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("skips read receipts when disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                            verbose: false,
                            accountId: _ACCOUNT_ID,
                            authDir: authDir,
                            onMessage: onMessage,
                            sendReadReceipts: false,
                        })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: { id: "rr-off-1", fromMe: false, remoteJid: "222@s.whatsapp.net" },
                                message: { conversation: "read receipts off" },
                                messageTimestamp: nowSeconds(),
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledTimes(1);
                    (0, vitest_2.expect)(sock.readMessages).not.toHaveBeenCalled();
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("lets group messages through even when sender not in allowFrom", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockLoadConfig.mockReturnValue({
                        channels: { whatsapp: { allowFrom: ["+1234"], groupPolicy: "open" } },
                        messages: {
                            messagePrefix: undefined,
                            responsePrefix: undefined,
                        },
                    });
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                            verbose: false,
                            accountId: _ACCOUNT_ID,
                            authDir: authDir,
                            onMessage: onMessage,
                        })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: {
                                    id: "grp3",
                                    fromMe: false,
                                    remoteJid: "11111@g.us",
                                    participant: "999@s.whatsapp.net",
                                },
                                message: { conversation: "unauthorized group message" },
                                messageTimestamp: nowSeconds(),
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledTimes(1);
                    payload = onMessage.mock.calls[0][0];
                    (0, vitest_2.expect)(payload.chatType).toBe("group");
                    (0, vitest_2.expect)(payload.senderE164).toBe("+999");
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("blocks all group messages when groupPolicy is 'disabled'", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockLoadConfig.mockReturnValue({
                        channels: { whatsapp: { allowFrom: ["+1234"], groupPolicy: "disabled" } },
                        messages: {
                            messagePrefix: undefined,
                            responsePrefix: undefined,
                            timestampPrefix: false,
                        },
                    });
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                            verbose: false,
                            accountId: _ACCOUNT_ID,
                            authDir: authDir,
                            onMessage: onMessage,
                        })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: {
                                    id: "grp-disabled",
                                    fromMe: false,
                                    remoteJid: "11111@g.us",
                                    participant: "999@s.whatsapp.net",
                                },
                                message: { conversation: "group message should be blocked" },
                                messageTimestamp: nowSeconds(),
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    // Should NOT call onMessage because groupPolicy is disabled
                    (0, vitest_2.expect)(onMessage).not.toHaveBeenCalled();
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("blocks group messages from senders not in groupAllowFrom when groupPolicy is 'allowlist'", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockLoadConfig.mockReturnValue({
                        channels: {
                            whatsapp: {
                                groupAllowFrom: ["+1234"], // Does not include +999
                                groupPolicy: "allowlist",
                            },
                        },
                        messages: {
                            messagePrefix: undefined,
                            responsePrefix: undefined,
                            timestampPrefix: false,
                        },
                    });
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                            verbose: false,
                            accountId: _ACCOUNT_ID,
                            authDir: authDir,
                            onMessage: onMessage,
                        })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: {
                                    id: "grp-allowlist-blocked",
                                    fromMe: false,
                                    remoteJid: "11111@g.us",
                                    participant: "999@s.whatsapp.net",
                                },
                                message: { conversation: "unauthorized group sender" },
                                messageTimestamp: nowSeconds(),
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    // Should NOT call onMessage because sender +999 not in groupAllowFrom
                    (0, vitest_2.expect)(onMessage).not.toHaveBeenCalled();
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("allows group messages from senders in groupAllowFrom when groupPolicy is 'allowlist'", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockLoadConfig.mockReturnValue({
                        channels: {
                            whatsapp: {
                                groupAllowFrom: ["+15551234567"], // Includes the sender
                                groupPolicy: "allowlist",
                            },
                        },
                        messages: {
                            messagePrefix: undefined,
                            responsePrefix: undefined,
                            timestampPrefix: false,
                        },
                    });
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                            verbose: false,
                            accountId: _ACCOUNT_ID,
                            authDir: authDir,
                            onMessage: onMessage,
                        })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: {
                                    id: "grp-allowlist-allowed",
                                    fromMe: false,
                                    remoteJid: "11111@g.us",
                                    participant: "15551234567@s.whatsapp.net",
                                },
                                message: { conversation: "authorized group sender" },
                                messageTimestamp: nowSeconds(),
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    // Should call onMessage because sender is in groupAllowFrom
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledTimes(1);
                    payload = onMessage.mock.calls[0][0];
                    (0, vitest_2.expect)(payload.chatType).toBe("group");
                    (0, vitest_2.expect)(payload.senderE164).toBe("+15551234567");
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("allows all group senders with wildcard in groupPolicy allowlist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockLoadConfig.mockReturnValue({
                        channels: {
                            whatsapp: {
                                groupAllowFrom: ["*"], // Wildcard allows everyone
                                groupPolicy: "allowlist",
                            },
                        },
                        messages: {
                            messagePrefix: undefined,
                            responsePrefix: undefined,
                            timestampPrefix: false,
                        },
                    });
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                            verbose: false,
                            accountId: _ACCOUNT_ID,
                            authDir: authDir,
                            onMessage: onMessage,
                        })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: {
                                    id: "grp-wildcard-test",
                                    fromMe: false,
                                    remoteJid: "22222@g.us",
                                    participant: "9999999999@s.whatsapp.net", // Random sender
                                },
                                message: { conversation: "wildcard group sender" },
                                messageTimestamp: nowSeconds(),
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    // Should call onMessage because wildcard allows all senders
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledTimes(1);
                    payload = onMessage.mock.calls[0][0];
                    (0, vitest_2.expect)(payload.chatType).toBe("group");
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("blocks group messages when groupPolicy allowlist has no groupAllowFrom", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockLoadConfig.mockReturnValue({
                        channels: {
                            whatsapp: {
                                groupPolicy: "allowlist",
                            },
                        },
                        messages: {
                            messagePrefix: undefined,
                            responsePrefix: undefined,
                            timestampPrefix: false,
                        },
                    });
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                            verbose: false,
                            accountId: _ACCOUNT_ID,
                            authDir: authDir,
                            onMessage: onMessage,
                        })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: {
                                    id: "grp-allowlist-empty",
                                    fromMe: false,
                                    remoteJid: "11111@g.us",
                                    participant: "999@s.whatsapp.net",
                                },
                                message: { conversation: "blocked by empty allowlist" },
                                messageTimestamp: nowSeconds(),
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    (0, vitest_2.expect)(onMessage).not.toHaveBeenCalled();
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
