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
var vitest_1 = require("vitest");
var runtime_js_1 = require("../runtime.js");
vitest_1.vi.mock("@vector-im/matrix-bot-sdk", function () { return ({
    ConsoleLogger: /** @class */ (function () {
        function class_1() {
            this.trace = vitest_1.vi.fn();
            this.debug = vitest_1.vi.fn();
            this.info = vitest_1.vi.fn();
            this.warn = vitest_1.vi.fn();
            this.error = vitest_1.vi.fn();
        }
        return class_1;
    }()),
    LogService: {
        setLogger: vitest_1.vi.fn(),
    },
    MatrixClient: vitest_1.vi.fn(),
    SimpleFsStorageProvider: vitest_1.vi.fn(),
    RustSdkCryptoStorageProvider: vitest_1.vi.fn(),
}); });
var loadWebMediaMock = vitest_1.vi.fn().mockResolvedValue({
    buffer: Buffer.from("media"),
    fileName: "photo.png",
    contentType: "image/png",
    kind: "image",
});
var getImageMetadataMock = vitest_1.vi.fn().mockResolvedValue(null);
var resizeToJpegMock = vitest_1.vi.fn();
var runtimeStub = {
    config: {
        loadConfig: function () { return ({}); },
    },
    media: {
        loadWebMedia: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return loadWebMediaMock.apply(void 0, args);
        },
        mediaKindFromMime: function () { return "image"; },
        isVoiceCompatibleAudio: function () { return false; },
        getImageMetadata: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return getImageMetadataMock.apply(void 0, args);
        },
        resizeToJpeg: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return resizeToJpegMock.apply(void 0, args);
        },
    },
    channel: {
        text: {
            resolveTextChunkLimit: function () { return 4000; },
            resolveChunkMode: function () { return "length"; },
            chunkMarkdownText: function (text) { return (text ? [text] : []); },
            chunkMarkdownTextWithMode: function (text) { return (text ? [text] : []); },
            resolveMarkdownTableMode: function () { return "code"; },
            convertMarkdownTables: function (text) { return text; },
        },
    },
};
var sendMessageMatrix;
var makeClient = function () {
    var sendMessage = vitest_1.vi.fn().mockResolvedValue("evt1");
    var uploadContent = vitest_1.vi.fn().mockResolvedValue("mxc://example/file");
    var client = {
        sendMessage: sendMessage,
        uploadContent: uploadContent,
        getUserId: vitest_1.vi.fn().mockResolvedValue("@bot:example.org"),
    };
    return { client: client, sendMessage: sendMessage, uploadContent: uploadContent };
};
(0, vitest_1.describe)("sendMessageMatrix media", function () {
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, runtime_js_1.setMatrixRuntime)(runtimeStub);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./send.js"); })];
                case 1:
                    (sendMessageMatrix = (_a.sent()).sendMessageMatrix);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        (0, runtime_js_1.setMatrixRuntime)(runtimeStub);
    });
    (0, vitest_1.it)("uploads media with url payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, client, sendMessage, uploadContent, uploadArg, content;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = makeClient(), client = _a.client, sendMessage = _a.sendMessage, uploadContent = _a.uploadContent;
                    return [4 /*yield*/, sendMessageMatrix("room:!room:example", "caption", {
                            client: client,
                            mediaUrl: "file:///tmp/photo.png",
                        })];
                case 1:
                    _d.sent();
                    uploadArg = (_b = uploadContent.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[0];
                    (0, vitest_1.expect)(Buffer.isBuffer(uploadArg)).toBe(true);
                    content = (_c = sendMessage.mock.calls[0]) === null || _c === void 0 ? void 0 : _c[1];
                    (0, vitest_1.expect)(content.msgtype).toBe("m.image");
                    (0, vitest_1.expect)(content.format).toBe("org.matrix.custom.html");
                    (0, vitest_1.expect)(content.formatted_body).toContain("caption");
                    (0, vitest_1.expect)(content.url).toBe("mxc://example/file");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uploads encrypted media with file payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, client, sendMessage, uploadContent, uploadArg, content;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = makeClient(), client = _a.client, sendMessage = _a.sendMessage, uploadContent = _a.uploadContent;
                    client.crypto = {
                        isRoomEncrypted: vitest_1.vi.fn().mockResolvedValue(true),
                        encryptMedia: vitest_1.vi.fn().mockResolvedValue({
                            buffer: Buffer.from("encrypted"),
                            file: {
                                key: {
                                    kty: "oct",
                                    key_ops: ["encrypt", "decrypt"],
                                    alg: "A256CTR",
                                    k: "secret",
                                    ext: true,
                                },
                                iv: "iv",
                                hashes: { sha256: "hash" },
                                v: "v2",
                            },
                        }),
                    };
                    return [4 /*yield*/, sendMessageMatrix("room:!room:example", "caption", {
                            client: client,
                            mediaUrl: "file:///tmp/photo.png",
                        })];
                case 1:
                    _e.sent();
                    uploadArg = (_b = uploadContent.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[0];
                    (0, vitest_1.expect)(uploadArg === null || uploadArg === void 0 ? void 0 : uploadArg.toString()).toBe("encrypted");
                    content = (_c = sendMessage.mock.calls[0]) === null || _c === void 0 ? void 0 : _c[1];
                    (0, vitest_1.expect)(content.url).toBeUndefined();
                    (0, vitest_1.expect)((_d = content.file) === null || _d === void 0 ? void 0 : _d.url).toBe("mxc://example/file");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("sendMessageMatrix threads", function () {
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, runtime_js_1.setMatrixRuntime)(runtimeStub);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./send.js"); })];
                case 1:
                    (sendMessageMatrix = (_a.sent()).sendMessageMatrix);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        (0, runtime_js_1.setMatrixRuntime)(runtimeStub);
    });
    (0, vitest_1.it)("includes thread relation metadata when threadId is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, client, sendMessage, content;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = makeClient(), client = _a.client, sendMessage = _a.sendMessage;
                    return [4 /*yield*/, sendMessageMatrix("room:!room:example", "hello thread", {
                            client: client,
                            threadId: "$thread",
                        })];
                case 1:
                    _c.sent();
                    content = (_b = sendMessage.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[1];
                    (0, vitest_1.expect)(content["m.relates_to"]).toMatchObject({
                        rel_type: "m.thread",
                        event_id: "$thread",
                        "m.in_reply_to": { event_id: "$thread" },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
