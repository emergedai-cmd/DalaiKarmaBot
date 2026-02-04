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
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_2 = require("vitest");
var logging_js_1 = require("../logging.js");
var inbound_js_1 = require("./inbound.js");
var _ACCOUNT_ID = "default";
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
    (0, vitest_2.it)("captures media path for image messages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({ verbose: false, onMessage: onMessage })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: { id: "med1", fromMe: false, remoteJid: "888@s.whatsapp.net" },
                                message: { imageMessage: { mimetype: "image/jpeg" } },
                                messageTimestamp: 1700000100,
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledWith(vitest_2.expect.objectContaining({
                        body: "<media:image>",
                    }));
                    (0, vitest_2.expect)(sock.readMessages).toHaveBeenCalledWith([
                        {
                            remoteJid: "888@s.whatsapp.net",
                            id: "med1",
                            participant: undefined,
                            fromMe: false,
                        },
                    ]);
                    (0, vitest_2.expect)(sock.sendPresenceUpdate).toHaveBeenCalledWith("available");
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("sets gifPlayback on outbound video payloads when requested", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, buf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({ verbose: false, onMessage: onMessage })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    buf = Buffer.from("gifvid");
                    return [4 /*yield*/, listener.sendMessage("+1555", "gif", buf, "video/mp4", {
                            gifPlayback: true,
                        })];
                case 3:
                    _a.sent();
                    (0, vitest_2.expect)(sock.sendMessage).toHaveBeenCalledWith("1555@s.whatsapp.net", {
                        video: buf,
                        caption: "gif",
                        mimetype: "video/mp4",
                        gifPlayback: true,
                    });
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("resolves onClose when the socket closes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var listener, sock, reasonPromise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                        verbose: false,
                        onMessage: vitest_1.vi.fn(),
                    })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    reasonPromise = listener.onClose;
                    sock.ev.emit("connection.update", {
                        connection: "close",
                        lastDisconnect: { error: { output: { statusCode: 500 } } },
                    });
                    return [4 /*yield*/, (0, vitest_2.expect)(reasonPromise).resolves.toEqual(vitest_2.expect.objectContaining({ status: 500, isLoggedOut: false }))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("logs inbound bodies to file", function () { return __awaiter(void 0, void 0, void 0, function () {
        var logPath, onMessage, listener, sock, upsert, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logPath = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-log-test-".concat(node_crypto_1.default.randomUUID(), ".log"));
                    (0, logging_js_1.setLoggerOverride)({ level: "trace", file: logPath });
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({ verbose: false, onMessage: onMessage })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: { id: "abc", fromMe: false, remoteJid: "999@s.whatsapp.net" },
                                message: { conversation: "ping" },
                                messageTimestamp: 1700000000,
                                pushName: "Tester",
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    content = node_fs_1.default.readFileSync(logPath, "utf-8");
                    (0, vitest_2.expect)(content).toMatch(/web-inbound/);
                    (0, vitest_2.expect)(content).toMatch(/ping/);
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("includes participant when marking group messages read", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({ verbose: false, onMessage: onMessage })];
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
                                    id: "grp1",
                                    fromMe: false,
                                    remoteJid: "12345-67890@g.us",
                                    participant: "111@s.whatsapp.net",
                                },
                                message: { conversation: "group ping" },
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    (0, vitest_2.expect)(sock.readMessages).toHaveBeenCalledWith([
                        {
                            remoteJid: "12345-67890@g.us",
                            id: "grp1",
                            participant: "111@s.whatsapp.net",
                            fromMe: false,
                        },
                    ]);
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("passes through group messages with participant metadata", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({ verbose: false, onMessage: onMessage })];
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
                                    id: "grp2",
                                    fromMe: false,
                                    remoteJid: "99999@g.us",
                                    participant: "777@s.whatsapp.net",
                                },
                                pushName: "Alice",
                                message: {
                                    extendedTextMessage: {
                                        text: "@bot ping",
                                        contextInfo: { mentionedJid: ["123@s.whatsapp.net"] },
                                    },
                                },
                                messageTimestamp: 1700000000,
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledWith(vitest_2.expect.objectContaining({
                        chatType: "group",
                        conversationId: "99999@g.us",
                        senderE164: "+777",
                        mentionedJids: ["123@s.whatsapp.net"],
                    }));
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("unwraps ephemeral messages, preserves mentions, and still delivers group pings", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({ verbose: false, onMessage: onMessage })];
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
                                    id: "grp-ephem",
                                    fromMe: false,
                                    remoteJid: "424242@g.us",
                                    participant: "888@s.whatsapp.net",
                                },
                                message: {
                                    ephemeralMessage: {
                                        message: {
                                            extendedTextMessage: {
                                                text: "oh hey @Clawd UK !",
                                                contextInfo: { mentionedJid: ["123@s.whatsapp.net"] },
                                            },
                                        },
                                    },
                                },
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledTimes(1);
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledWith(vitest_2.expect.objectContaining({
                        chatType: "group",
                        conversationId: "424242@g.us",
                        body: "oh hey @Clawd UK !",
                        mentionedJids: ["123@s.whatsapp.net"],
                        senderE164: "+888",
                    }));
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("still forwards group messages (with sender info) even when allowFrom is restrictive", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockLoadConfig.mockReturnValue({
                        channels: {
                            whatsapp: {
                                // does not include +777
                                allowFrom: ["+111"],
                                groupPolicy: "open",
                            },
                        },
                        messages: {
                            messagePrefix: undefined,
                            responsePrefix: undefined,
                        },
                    });
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({ verbose: false, onMessage: onMessage })];
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
                                    id: "grp-allow",
                                    fromMe: false,
                                    remoteJid: "55555@g.us",
                                    participant: "777@s.whatsapp.net",
                                },
                                message: {
                                    extendedTextMessage: {
                                        text: "@bot hi",
                                        contextInfo: { mentionedJid: ["123@s.whatsapp.net"] },
                                    },
                                },
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledTimes(1);
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledWith(vitest_2.expect.objectContaining({
                        chatType: "group",
                        from: "55555@g.us",
                        senderE164: "+777",
                        senderJid: "777@s.whatsapp.net",
                        mentionedJids: ["123@s.whatsapp.net"],
                        selfE164: "+123",
                        selfJid: "123@s.whatsapp.net",
                    }));
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
