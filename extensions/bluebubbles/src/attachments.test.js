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
var attachments_js_1 = require("./attachments.js");
vitest_1.vi.mock("./accounts.js", function () { return ({
    resolveBlueBubblesAccount: vitest_1.vi.fn(function (_a) {
        var _b, _c;
        var cfg = _a.cfg, accountId = _a.accountId;
        var config = (_c = (_b = cfg === null || cfg === void 0 ? void 0 : cfg.channels) === null || _b === void 0 ? void 0 : _b.bluebubbles) !== null && _c !== void 0 ? _c : {};
        return {
            accountId: accountId !== null && accountId !== void 0 ? accountId : "default",
            enabled: config.enabled !== false,
            configured: Boolean(config.serverUrl && config.password),
            config: config,
        };
    }),
}); });
var mockFetch = vitest_1.vi.fn();
(0, vitest_1.describe)("downloadBlueBubblesAttachment", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.stubGlobal("fetch", mockFetch);
        mockFetch.mockReset();
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.unstubAllGlobals();
    });
    (0, vitest_1.it)("throws when guid is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var attachment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attachment = {};
                    return [4 /*yield*/, (0, vitest_1.expect)((0, attachments_js_1.downloadBlueBubblesAttachment)(attachment, {
                            serverUrl: "http://localhost:1234",
                            password: "test-password",
                        })).rejects.toThrow("guid is required")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws when guid is empty string", function () { return __awaiter(void 0, void 0, void 0, function () {
        var attachment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attachment = { guid: "  " };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, attachments_js_1.downloadBlueBubblesAttachment)(attachment, {
                            serverUrl: "http://localhost:1234",
                            password: "test-password",
                        })).rejects.toThrow("guid is required")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws when serverUrl is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var attachment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attachment = { guid: "att-123" };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, attachments_js_1.downloadBlueBubblesAttachment)(attachment, {})).rejects.toThrow("serverUrl is required")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws when password is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var attachment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attachment = { guid: "att-123" };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, attachments_js_1.downloadBlueBubblesAttachment)(attachment, {
                            serverUrl: "http://localhost:1234",
                        })).rejects.toThrow("password is required")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("downloads attachment successfully", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockBuffer, attachment, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockBuffer = new Uint8Array([1, 2, 3, 4]);
                    mockFetch.mockResolvedValueOnce({
                        ok: true,
                        headers: new Headers({ "content-type": "image/png" }),
                        arrayBuffer: function () { return Promise.resolve(mockBuffer.buffer); },
                    });
                    attachment = { guid: "att-123" };
                    return [4 /*yield*/, (0, attachments_js_1.downloadBlueBubblesAttachment)(attachment, {
                            serverUrl: "http://localhost:1234",
                            password: "test-password",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.buffer).toEqual(mockBuffer);
                    (0, vitest_1.expect)(result.contentType).toBe("image/png");
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalledWith(vitest_1.expect.stringContaining("/api/v1/attachment/att-123/download"), vitest_1.expect.objectContaining({ method: "GET" }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes password in URL query", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockBuffer, attachment, calledUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockBuffer = new Uint8Array([1, 2, 3, 4]);
                    mockFetch.mockResolvedValueOnce({
                        ok: true,
                        headers: new Headers({ "content-type": "image/jpeg" }),
                        arrayBuffer: function () { return Promise.resolve(mockBuffer.buffer); },
                    });
                    attachment = { guid: "att-456" };
                    return [4 /*yield*/, (0, attachments_js_1.downloadBlueBubblesAttachment)(attachment, {
                            serverUrl: "http://localhost:1234",
                            password: "my-secret-password",
                        })];
                case 1:
                    _a.sent();
                    calledUrl = mockFetch.mock.calls[0][0];
                    (0, vitest_1.expect)(calledUrl).toContain("password=my-secret-password");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("encodes guid in URL", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockBuffer, attachment, calledUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockBuffer = new Uint8Array([1]);
                    mockFetch.mockResolvedValueOnce({
                        ok: true,
                        headers: new Headers(),
                        arrayBuffer: function () { return Promise.resolve(mockBuffer.buffer); },
                    });
                    attachment = { guid: "att/with/special chars" };
                    return [4 /*yield*/, (0, attachments_js_1.downloadBlueBubblesAttachment)(attachment, {
                            serverUrl: "http://localhost:1234",
                            password: "test",
                        })];
                case 1:
                    _a.sent();
                    calledUrl = mockFetch.mock.calls[0][0];
                    (0, vitest_1.expect)(calledUrl).toContain("att%2Fwith%2Fspecial%20chars");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws on non-ok response", function () { return __awaiter(void 0, void 0, void 0, function () {
        var attachment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch.mockResolvedValueOnce({
                        ok: false,
                        status: 404,
                        text: function () { return Promise.resolve("Attachment not found"); },
                    });
                    attachment = { guid: "att-missing" };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, attachments_js_1.downloadBlueBubblesAttachment)(attachment, {
                            serverUrl: "http://localhost:1234",
                            password: "test",
                        })).rejects.toThrow("download failed (404): Attachment not found")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws when attachment exceeds max bytes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var largeBuffer, attachment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    largeBuffer = new Uint8Array(10 * 1024 * 1024);
                    mockFetch.mockResolvedValueOnce({
                        ok: true,
                        headers: new Headers(),
                        arrayBuffer: function () { return Promise.resolve(largeBuffer.buffer); },
                    });
                    attachment = { guid: "att-large" };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, attachments_js_1.downloadBlueBubblesAttachment)(attachment, {
                            serverUrl: "http://localhost:1234",
                            password: "test",
                            maxBytes: 5 * 1024 * 1024,
                        })).rejects.toThrow("too large")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses default max bytes when not specified", function () { return __awaiter(void 0, void 0, void 0, function () {
        var largeBuffer, attachment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    largeBuffer = new Uint8Array(9 * 1024 * 1024);
                    mockFetch.mockResolvedValueOnce({
                        ok: true,
                        headers: new Headers(),
                        arrayBuffer: function () { return Promise.resolve(largeBuffer.buffer); },
                    });
                    attachment = { guid: "att-large" };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, attachments_js_1.downloadBlueBubblesAttachment)(attachment, {
                            serverUrl: "http://localhost:1234",
                            password: "test",
                        })).rejects.toThrow("too large")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses attachment mimeType as fallback when response has no content-type", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockBuffer, attachment, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockBuffer = new Uint8Array([1, 2, 3]);
                    mockFetch.mockResolvedValueOnce({
                        ok: true,
                        headers: new Headers(),
                        arrayBuffer: function () { return Promise.resolve(mockBuffer.buffer); },
                    });
                    attachment = {
                        guid: "att-789",
                        mimeType: "video/mp4",
                    };
                    return [4 /*yield*/, (0, attachments_js_1.downloadBlueBubblesAttachment)(attachment, {
                            serverUrl: "http://localhost:1234",
                            password: "test",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.contentType).toBe("video/mp4");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers response content-type over attachment mimeType", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockBuffer, attachment, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockBuffer = new Uint8Array([1, 2, 3]);
                    mockFetch.mockResolvedValueOnce({
                        ok: true,
                        headers: new Headers({ "content-type": "image/webp" }),
                        arrayBuffer: function () { return Promise.resolve(mockBuffer.buffer); },
                    });
                    attachment = {
                        guid: "att-xyz",
                        mimeType: "image/png",
                    };
                    return [4 /*yield*/, (0, attachments_js_1.downloadBlueBubblesAttachment)(attachment, {
                            serverUrl: "http://localhost:1234",
                            password: "test",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.contentType).toBe("image/webp");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("resolves credentials from config when opts not provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockBuffer, attachment, result, calledUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockBuffer = new Uint8Array([1]);
                    mockFetch.mockResolvedValueOnce({
                        ok: true,
                        headers: new Headers(),
                        arrayBuffer: function () { return Promise.resolve(mockBuffer.buffer); },
                    });
                    attachment = { guid: "att-config" };
                    return [4 /*yield*/, (0, attachments_js_1.downloadBlueBubblesAttachment)(attachment, {
                            cfg: {
                                channels: {
                                    bluebubbles: {
                                        serverUrl: "http://config-server:5678",
                                        password: "config-password",
                                    },
                                },
                            },
                        })];
                case 1:
                    result = _a.sent();
                    calledUrl = mockFetch.mock.calls[0][0];
                    (0, vitest_1.expect)(calledUrl).toContain("config-server:5678");
                    (0, vitest_1.expect)(calledUrl).toContain("password=config-password");
                    (0, vitest_1.expect)(result.buffer).toEqual(new Uint8Array([1]));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("sendBlueBubblesAttachment", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.stubGlobal("fetch", mockFetch);
        mockFetch.mockReset();
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.unstubAllGlobals();
    });
    function decodeBody(body) {
        return Buffer.from(body).toString("utf8");
    }
    (0, vitest_1.it)("marks voice memos when asVoice is true and mp3 is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var body, bodyText;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    mockFetch.mockResolvedValueOnce({
                        ok: true,
                        text: function () { return Promise.resolve(JSON.stringify({ messageId: "msg-1" })); },
                    });
                    return [4 /*yield*/, (0, attachments_js_1.sendBlueBubblesAttachment)({
                            to: "chat_guid:iMessage;-;+15551234567",
                            buffer: new Uint8Array([1, 2, 3]),
                            filename: "voice.mp3",
                            contentType: "audio/mpeg",
                            asVoice: true,
                            opts: { serverUrl: "http://localhost:1234", password: "test" },
                        })];
                case 1:
                    _b.sent();
                    body = (_a = mockFetch.mock.calls[0][1]) === null || _a === void 0 ? void 0 : _a.body;
                    bodyText = decodeBody(body);
                    (0, vitest_1.expect)(bodyText).toContain('name="isAudioMessage"');
                    (0, vitest_1.expect)(bodyText).toContain("true");
                    (0, vitest_1.expect)(bodyText).toContain('filename="voice.mp3"');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("normalizes mp3 filenames for voice memos", function () { return __awaiter(void 0, void 0, void 0, function () {
        var body, bodyText;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    mockFetch.mockResolvedValueOnce({
                        ok: true,
                        text: function () { return Promise.resolve(JSON.stringify({ messageId: "msg-2" })); },
                    });
                    return [4 /*yield*/, (0, attachments_js_1.sendBlueBubblesAttachment)({
                            to: "chat_guid:iMessage;-;+15551234567",
                            buffer: new Uint8Array([1, 2, 3]),
                            filename: "voice",
                            contentType: "audio/mpeg",
                            asVoice: true,
                            opts: { serverUrl: "http://localhost:1234", password: "test" },
                        })];
                case 1:
                    _b.sent();
                    body = (_a = mockFetch.mock.calls[0][1]) === null || _a === void 0 ? void 0 : _a.body;
                    bodyText = decodeBody(body);
                    (0, vitest_1.expect)(bodyText).toContain('filename="voice.mp3"');
                    (0, vitest_1.expect)(bodyText).toContain('name="voice.mp3"');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws when asVoice is true but media is not audio", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, attachments_js_1.sendBlueBubblesAttachment)({
                        to: "chat_guid:iMessage;-;+15551234567",
                        buffer: new Uint8Array([1, 2, 3]),
                        filename: "image.png",
                        contentType: "image/png",
                        asVoice: true,
                        opts: { serverUrl: "http://localhost:1234", password: "test" },
                    })).rejects.toThrow("voice messages require audio")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mockFetch).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws when asVoice is true but audio is not mp3 or caf", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, attachments_js_1.sendBlueBubblesAttachment)({
                        to: "chat_guid:iMessage;-;+15551234567",
                        buffer: new Uint8Array([1, 2, 3]),
                        filename: "voice.wav",
                        contentType: "audio/wav",
                        asVoice: true,
                        opts: { serverUrl: "http://localhost:1234", password: "test" },
                    })).rejects.toThrow("require mp3 or caf")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mockFetch).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sanitizes filenames before sending", function () { return __awaiter(void 0, void 0, void 0, function () {
        var body, bodyText;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    mockFetch.mockResolvedValueOnce({
                        ok: true,
                        text: function () { return Promise.resolve(JSON.stringify({ messageId: "msg-3" })); },
                    });
                    return [4 /*yield*/, (0, attachments_js_1.sendBlueBubblesAttachment)({
                            to: "chat_guid:iMessage;-;+15551234567",
                            buffer: new Uint8Array([1, 2, 3]),
                            filename: "../evil.mp3",
                            contentType: "audio/mpeg",
                            opts: { serverUrl: "http://localhost:1234", password: "test" },
                        })];
                case 1:
                    _b.sent();
                    body = (_a = mockFetch.mock.calls[0][1]) === null || _a === void 0 ? void 0 : _a.body;
                    bodyText = decodeBody(body);
                    (0, vitest_1.expect)(bodyText).toContain('filename="evil.mp3"');
                    (0, vitest_1.expect)(bodyText).toContain('name="evil.mp3"');
                    return [2 /*return*/];
            }
        });
    }); });
});
