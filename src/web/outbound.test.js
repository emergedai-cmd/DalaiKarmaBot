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
var logging_js_1 = require("../logging.js");
var active_listener_js_1 = require("./active-listener.js");
var loadWebMediaMock = vitest_1.vi.fn();
vitest_1.vi.mock("./media.js", function () { return ({
    loadWebMedia: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return loadWebMediaMock.apply(void 0, args);
    },
}); });
var outbound_js_1 = require("./outbound.js");
(0, vitest_1.describe)("web outbound", function () {
    var sendComposingTo = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); });
    var sendMessage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ messageId: "msg123" })];
    }); }); });
    var sendPoll = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ messageId: "poll123" })];
    }); }); });
    var sendReaction = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); });
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        (0, active_listener_js_1.setActiveWebListener)({
            sendComposingTo: sendComposingTo,
            sendMessage: sendMessage,
            sendPoll: sendPoll,
            sendReaction: sendReaction,
        });
    });
    (0, vitest_1.afterEach)(function () {
        (0, logging_js_1.resetLogger)();
        (0, logging_js_1.setLoggerOverride)(null);
        (0, active_listener_js_1.setActiveWebListener)(null);
    });
    (0, vitest_1.it)("sends message via active listener", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, outbound_js_1.sendMessageWhatsApp)("+1555", "hi", { verbose: false })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toEqual({
                        messageId: "msg123",
                        toJid: "1555@s.whatsapp.net",
                    });
                    (0, vitest_1.expect)(sendComposingTo).toHaveBeenCalledWith("+1555");
                    (0, vitest_1.expect)(sendMessage).toHaveBeenCalledWith("+1555", "hi", undefined, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws a helpful error when no active listener exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, active_listener_js_1.setActiveWebListener)(null);
                    return [4 /*yield*/, (0, vitest_1.expect)((0, outbound_js_1.sendMessageWhatsApp)("+1555", "hi", { verbose: false, accountId: "work" })).rejects.toThrow(/No active WhatsApp Web listener/)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, outbound_js_1.sendMessageWhatsApp)("+1555", "hi", { verbose: false, accountId: "work" })).rejects.toThrow(/channels login/)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, outbound_js_1.sendMessageWhatsApp)("+1555", "hi", { verbose: false, accountId: "work" })).rejects.toThrow(/account: work/)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("maps audio to PTT with opus mime when ogg", function () { return __awaiter(void 0, void 0, void 0, function () {
        var buf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = Buffer.from("audio");
                    loadWebMediaMock.mockResolvedValueOnce({
                        buffer: buf,
                        contentType: "audio/ogg",
                        kind: "audio",
                    });
                    return [4 /*yield*/, (0, outbound_js_1.sendMessageWhatsApp)("+1555", "voice note", {
                            verbose: false,
                            mediaUrl: "/tmp/voice.ogg",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenLastCalledWith("+1555", "voice note", buf, "audio/ogg; codecs=opus");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("maps video with caption", function () { return __awaiter(void 0, void 0, void 0, function () {
        var buf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = Buffer.from("video");
                    loadWebMediaMock.mockResolvedValueOnce({
                        buffer: buf,
                        contentType: "video/mp4",
                        kind: "video",
                    });
                    return [4 /*yield*/, (0, outbound_js_1.sendMessageWhatsApp)("+1555", "clip", {
                            verbose: false,
                            mediaUrl: "/tmp/video.mp4",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenLastCalledWith("+1555", "clip", buf, "video/mp4");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("marks gif playback for video when requested", function () { return __awaiter(void 0, void 0, void 0, function () {
        var buf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = Buffer.from("gifvid");
                    loadWebMediaMock.mockResolvedValueOnce({
                        buffer: buf,
                        contentType: "video/mp4",
                        kind: "video",
                    });
                    return [4 /*yield*/, (0, outbound_js_1.sendMessageWhatsApp)("+1555", "gif", {
                            verbose: false,
                            mediaUrl: "/tmp/anim.mp4",
                            gifPlayback: true,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenLastCalledWith("+1555", "gif", buf, "video/mp4", {
                        gifPlayback: true,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("maps image with caption", function () { return __awaiter(void 0, void 0, void 0, function () {
        var buf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = Buffer.from("img");
                    loadWebMediaMock.mockResolvedValueOnce({
                        buffer: buf,
                        contentType: "image/jpeg",
                        kind: "image",
                    });
                    return [4 /*yield*/, (0, outbound_js_1.sendMessageWhatsApp)("+1555", "pic", {
                            verbose: false,
                            mediaUrl: "/tmp/pic.jpg",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenLastCalledWith("+1555", "pic", buf, "image/jpeg");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("maps other kinds to document with filename", function () { return __awaiter(void 0, void 0, void 0, function () {
        var buf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = Buffer.from("pdf");
                    loadWebMediaMock.mockResolvedValueOnce({
                        buffer: buf,
                        contentType: "application/pdf",
                        kind: "document",
                        fileName: "file.pdf",
                    });
                    return [4 /*yield*/, (0, outbound_js_1.sendMessageWhatsApp)("+1555", "doc", {
                            verbose: false,
                            mediaUrl: "/tmp/file.pdf",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessage).toHaveBeenLastCalledWith("+1555", "doc", buf, "application/pdf");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends polls via active listener", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, outbound_js_1.sendPollWhatsApp)("+1555", { question: "Lunch?", options: ["Pizza", "Sushi"], maxSelections: 2 }, { verbose: false })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toEqual({
                        messageId: "poll123",
                        toJid: "1555@s.whatsapp.net",
                    });
                    (0, vitest_1.expect)(sendPoll).toHaveBeenCalledWith("+1555", {
                        question: "Lunch?",
                        options: ["Pizza", "Sushi"],
                        maxSelections: 2,
                        durationHours: undefined,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends reactions via active listener", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, outbound_js_1.sendReactionWhatsApp)("1555@s.whatsapp.net", "msg123", "✅", {
                        verbose: false,
                        fromMe: false,
                    })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendReaction).toHaveBeenCalledWith("1555@s.whatsapp.net", "msg123", "✅", false, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
});
