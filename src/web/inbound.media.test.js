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
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var readAllowFromStoreMock = vitest_1.vi.fn().mockResolvedValue([]);
var upsertPairingRequestMock = vitest_1.vi.fn().mockResolvedValue({ code: "PAIRCODE", created: true });
var saveMediaBufferSpy = vitest_1.vi.fn();
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: vitest_1.vi.fn().mockReturnValue({
                            channels: {
                                whatsapp: {
                                    allowFrom: ["*"], // Allow all in tests
                                },
                            },
                            messages: {
                                messagePrefix: undefined,
                                responsePrefix: undefined,
                            },
                        }) })];
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
vitest_1.vi.mock("../media/store.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { saveMediaBuffer: vitest_1.vi.fn(function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    saveMediaBufferSpy.apply(void 0, args);
                                    return [2 /*return*/, actual.saveMediaBuffer.apply(actual, args)];
                                });
                            });
                        }) })];
        }
    });
}); });
var HOME = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-inbound-media-".concat(node_crypto_1.default.randomUUID()));
process.env.HOME = HOME;
vitest_1.vi.mock("@whiskeysockets/baileys", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual, jpegBuffer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("@whiskeysockets/baileys")];
            case 1:
                actual = _a.sent();
                jpegBuffer = Buffer.from([
                    0xff, 0xd8, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x03, 0x02, 0x02, 0x02, 0x02, 0x02, 0x03, 0x02, 0x02,
                    0x02, 0x03, 0x03, 0x03, 0x03, 0x04, 0x06, 0x04, 0x04, 0x04, 0x04, 0x04, 0x08, 0x06, 0x06, 0x05,
                    0x06, 0x09, 0x08, 0x0a, 0x0a, 0x09, 0x08, 0x09, 0x09, 0x0a, 0x0c, 0x0f, 0x0c, 0x0a, 0x0b, 0x0e,
                    0x0b, 0x09, 0x09, 0x0d, 0x11, 0x0d, 0x0e, 0x0f, 0x10, 0x10, 0x11, 0x10, 0x0a, 0x0c, 0x12, 0x13,
                    0x12, 0x10, 0x13, 0x0f, 0x10, 0x10, 0x10, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x01, 0x00, 0x01,
                    0x03, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01, 0xff, 0xc4, 0x00, 0x14, 0x00, 0x01,
                    0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff,
                    0xc4, 0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0xff, 0xda, 0x00, 0x0c, 0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3f, 0x00,
                    0xff, 0xd9,
                ]);
                return [2 /*return*/, __assign(__assign({}, actual), { downloadMediaMessage: vitest_1.vi.fn().mockResolvedValue(jpegBuffer) })];
        }
    });
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
        user: { id: "me@s.whatsapp.net" },
    };
    return {
        createWaSocket: vitest_1.vi.fn().mockResolvedValue(sock),
        waitForWaConnection: vitest_1.vi.fn().mockResolvedValue(undefined),
        getStatusCode: vitest_1.vi.fn(function () { return 200; }),
    };
});
var inbound_js_1 = require("./inbound.js");
(0, vitest_1.describe)("web inbound media saves with extension", function () {
    (0, vitest_1.beforeEach)(function () {
        saveMediaBufferSpy.mockClear();
        (0, inbound_js_1.resetWebInboundDedupe)();
    });
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.rm(HOME, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.rm(HOME, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("stores inbound image with jpeg extension", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, createWaSocket, realSock, upsert, i, msg, mediaPath, stat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({ verbose: false, onMessage: onMessage })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./session.js"); })];
                case 2:
                    createWaSocket = (_a.sent()).createWaSocket;
                    return [4 /*yield*/, createWaSocket()];
                case 3:
                    realSock = _a.sent();
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: { id: "img1", fromMe: false, remoteJid: "111@s.whatsapp.net" },
                                message: { imageMessage: { mimetype: "image/jpeg" } },
                                messageTimestamp: 1700000001,
                            },
                        ],
                    };
                    realSock.ev.emit("messages.upsert", upsert);
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < 50)) return [3 /*break*/, 7];
                    if (onMessage.mock.calls.length > 0) {
                        return [3 /*break*/, 7];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7:
                    (0, vitest_1.expect)(onMessage).toHaveBeenCalledTimes(1);
                    msg = onMessage.mock.calls[0][0];
                    mediaPath = msg.mediaPath;
                    (0, vitest_1.expect)(mediaPath).toBeDefined();
                    (0, vitest_1.expect)(node_path_1.default.extname(mediaPath)).toBe(".jpg");
                    return [4 /*yield*/, promises_1.default.stat(mediaPath)];
                case 8:
                    stat = _a.sent();
                    (0, vitest_1.expect)(stat.size).toBeGreaterThan(0);
                    return [4 /*yield*/, listener.close()];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("extracts mentions from media captions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, createWaSocket, realSock, upsert, i, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({ verbose: false, onMessage: onMessage })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./session.js"); })];
                case 2:
                    createWaSocket = (_a.sent()).createWaSocket;
                    return [4 /*yield*/, createWaSocket()];
                case 3:
                    realSock = _a.sent();
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: {
                                    id: "img2",
                                    fromMe: false,
                                    remoteJid: "123@g.us",
                                    participant: "999@s.whatsapp.net",
                                },
                                message: {
                                    messageContextInfo: {},
                                    imageMessage: {
                                        caption: "@bot",
                                        contextInfo: { mentionedJid: ["999@s.whatsapp.net"] },
                                        mimetype: "image/jpeg",
                                    },
                                },
                                messageTimestamp: 1700000002,
                            },
                        ],
                    };
                    realSock.ev.emit("messages.upsert", upsert);
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < 50)) return [3 /*break*/, 7];
                    if (onMessage.mock.calls.length > 0) {
                        return [3 /*break*/, 7];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7:
                    (0, vitest_1.expect)(onMessage).toHaveBeenCalledTimes(1);
                    msg = onMessage.mock.calls[0][0];
                    (0, vitest_1.expect)(msg.chatType).toBe("group");
                    (0, vitest_1.expect)(msg.mentionedJids).toEqual(["999@s.whatsapp.net"]);
                    return [4 /*yield*/, listener.close()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes mediaMaxMb to saveMediaBuffer", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onMessage, listener, createWaSocket, realSock, upsert, i, lastCall;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onMessage = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, inbound_js_1.monitorWebInbox)({
                            verbose: false,
                            onMessage: onMessage,
                            mediaMaxMb: 1,
                        })];
                case 1:
                    listener = _a.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./session.js"); })];
                case 2:
                    createWaSocket = (_a.sent()).createWaSocket;
                    return [4 /*yield*/, createWaSocket()];
                case 3:
                    realSock = _a.sent();
                    upsert = {
                        type: "notify",
                        messages: [
                            {
                                key: { id: "img3", fromMe: false, remoteJid: "222@s.whatsapp.net" },
                                message: { imageMessage: { mimetype: "image/jpeg" } },
                                messageTimestamp: 1700000003,
                            },
                        ],
                    };
                    realSock.ev.emit("messages.upsert", upsert);
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < 50)) return [3 /*break*/, 7];
                    if (onMessage.mock.calls.length > 0) {
                        return [3 /*break*/, 7];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7:
                    (0, vitest_1.expect)(onMessage).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(saveMediaBufferSpy).toHaveBeenCalled();
                    lastCall = saveMediaBufferSpy.mock.calls.at(-1);
                    (0, vitest_1.expect)(lastCall === null || lastCall === void 0 ? void 0 : lastCall[3]).toBe(1 * 1024 * 1024);
                    return [4 /*yield*/, listener.close()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
