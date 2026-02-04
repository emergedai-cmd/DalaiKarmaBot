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
var ACCOUNT_ID = "default";
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
    (0, vitest_2.it)("streams inbound messages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onMessage = vitest_1.vi.fn(function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, msg.sendComposing()];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, msg.reply("pong")];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                            verbose: false,
                            onMessage: onMessage,
                            accountId: ACCOUNT_ID,
                            authDir: authDir,
                        })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    (0, vitest_2.expect)(sock.sendPresenceUpdate).toHaveBeenCalledWith("available");
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
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledWith(vitest_2.expect.objectContaining({ body: "ping", from: "+999", to: "+123" }));
                    (0, vitest_2.expect)(sock.readMessages).toHaveBeenCalledWith([
                        {
                            remoteJid: "999@s.whatsapp.net",
                            id: "abc",
                            participant: undefined,
                            fromMe: false,
                        },
                    ]);
                    (0, vitest_2.expect)(sock.sendPresenceUpdate).toHaveBeenCalledWith("available");
                    (0, vitest_2.expect)(sock.sendPresenceUpdate).toHaveBeenCalledWith("composing", "999@s.whatsapp.net");
                    (0, vitest_2.expect)(sock.sendMessage).toHaveBeenCalledWith("999@s.whatsapp.net", {
                        text: "pong",
                    });
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("deduplicates redelivered messages by id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onMessage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/];
                        });
                    }); });
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                            verbose: false,
                            onMessage: onMessage,
                            accountId: ACCOUNT_ID,
                            authDir: authDir,
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
                                key: { id: "abc", fromMe: false, remoteJid: "999@s.whatsapp.net" },
                                message: { conversation: "ping" },
                                messageTimestamp: 1700000000,
                                pushName: "Tester",
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledTimes(1);
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("resolves LID JIDs using Baileys LID mapping store", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, getPNForLID, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onMessage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/];
                        });
                    }); });
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                            verbose: false,
                            onMessage: onMessage,
                            accountId: ACCOUNT_ID,
                            authDir: authDir,
                        })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    getPNForLID = vitest_1.vi.spyOn(sock.signalRepository.lidMapping, "getPNForLID");
                    sock.signalRepository.lidMapping.getPNForLID.mockResolvedValueOnce("999:0@s.whatsapp.net");
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: { id: "abc", fromMe: false, remoteJid: "999@lid" },
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
                    (0, vitest_2.expect)(getPNForLID).toHaveBeenCalledWith("999@lid");
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledWith(vitest_2.expect.objectContaining({ body: "ping", from: "+999", to: "+123" }));
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("resolves LID JIDs via authDir mapping files", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, getPNForLID, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onMessage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/];
                        });
                    }); });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(authDir, "lid-mapping-555_reverse.json"), JSON.stringify("1555"));
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                            verbose: false,
                            onMessage: onMessage,
                            accountId: ACCOUNT_ID,
                            authDir: authDir,
                        })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    getPNForLID = vitest_1.vi.spyOn(sock.signalRepository.lidMapping, "getPNForLID");
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: { id: "abc", fromMe: false, remoteJid: "555@lid" },
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
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledWith(vitest_2.expect.objectContaining({ body: "ping", from: "+1555", to: "+123" }));
                    (0, vitest_2.expect)(getPNForLID).not.toHaveBeenCalled();
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("resolves group participant LID JIDs via Baileys mapping", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, getPNForLID, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onMessage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/];
                        });
                    }); });
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                            verbose: false,
                            onMessage: onMessage,
                            accountId: ACCOUNT_ID,
                            authDir: authDir,
                        })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, createWaSocket()];
                case 2:
                    sock = _a.sent();
                    getPNForLID = vitest_1.vi.spyOn(sock.signalRepository.lidMapping, "getPNForLID");
                    sock.signalRepository.lidMapping.getPNForLID.mockResolvedValueOnce("444:0@s.whatsapp.net");
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: {
                                    id: "abc",
                                    fromMe: false,
                                    remoteJid: "123@g.us",
                                    participant: "444@lid",
                                },
                                message: { conversation: "ping" },
                                messageTimestamp: 1700000000,
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    (0, vitest_2.expect)(getPNForLID).toHaveBeenCalledWith("444@lid");
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledWith(vitest_2.expect.objectContaining({
                        body: "ping",
                        from: "123@g.us",
                        senderE164: "+444",
                        chatType: "group",
                    }));
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("does not block follow-up messages when handler is pending", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveFirst, onMessage, listener, sock, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resolveFirst = null;
                    onMessage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!!resolveFirst) return [3 /*break*/, 2];
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            resolveFirst = resolve;
                                        })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                            verbose: false,
                            onMessage: onMessage,
                            accountId: ACCOUNT_ID,
                            authDir: authDir,
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
                                key: { id: "abc1", fromMe: false, remoteJid: "999@s.whatsapp.net" },
                                message: { conversation: "ping" },
                                messageTimestamp: 1700000000,
                            },
                            {
                                key: { id: "abc2", fromMe: false, remoteJid: "999@s.whatsapp.net" },
                                message: { conversation: "pong" },
                                messageTimestamp: 1700000001,
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledTimes(2);
                    resolveFirst === null || resolveFirst === void 0 ? void 0 : resolveFirst();
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("captures reply context from quoted messages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onMessage = vitest_1.vi.fn(function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, msg.reply("pong")];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
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
                                message: {
                                    extendedTextMessage: {
                                        text: "reply",
                                        contextInfo: {
                                            stanzaId: "q1",
                                            participant: "111@s.whatsapp.net",
                                            quotedMessage: { conversation: "original" },
                                        },
                                    },
                                },
                                messageTimestamp: 1700000000,
                                pushName: "Tester",
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledWith(vitest_2.expect.objectContaining({
                        replyToId: "q1",
                        replyToBody: "original",
                        replyToSender: "+111",
                    }));
                    (0, vitest_2.expect)(sock.sendMessage).toHaveBeenCalledWith("999@s.whatsapp.net", {
                        text: "pong",
                    });
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_2.it)("captures reply context from wrapped quoted messages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, sock, upsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onMessage = vitest_1.vi.fn(function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, msg.reply("pong")];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
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
                                message: {
                                    extendedTextMessage: {
                                        text: "reply",
                                        contextInfo: {
                                            stanzaId: "q1",
                                            participant: "111@s.whatsapp.net",
                                            quotedMessage: {
                                                viewOnceMessageV2Extension: {
                                                    message: { conversation: "original" },
                                                },
                                            },
                                        },
                                    },
                                },
                                messageTimestamp: 1700000000,
                                pushName: "Tester",
                            },
                        ],
                    };
                    sock.ev.emit("messages.upsert", upsert);
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    (0, vitest_2.expect)(onMessage).toHaveBeenCalledWith(vitest_2.expect.objectContaining({
                        replyToId: "q1",
                        replyToBody: "original",
                        replyToSender: "+111",
                    }));
                    (0, vitest_2.expect)(sock.sendMessage).toHaveBeenCalledWith("999@s.whatsapp.net", {
                        text: "pong",
                    });
                    return [4 /*yield*/, listener.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
