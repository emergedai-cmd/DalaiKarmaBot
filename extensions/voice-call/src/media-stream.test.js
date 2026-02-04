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
var media_stream_js_1 = require("./media-stream.js");
var createStubSession = function () { return ({
    connect: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    sendAudio: function () { },
    waitForTranscript: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ""];
    }); }); },
    onPartial: function () { },
    onTranscript: function () { },
    onSpeechStart: function () { },
    close: function () { },
    isConnected: function () { return true; },
}); };
var createStubSttProvider = function () {
    return ({
        createSession: function () { return createStubSession(); },
    });
};
var flush = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 0); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var waitForAbort = function (signal) {
    return new Promise(function (resolve) {
        if (signal.aborted) {
            resolve();
            return;
        }
        signal.addEventListener("abort", function () { return resolve(); }, { once: true });
    });
};
(0, vitest_1.describe)("MediaStreamHandler TTS queue", function () {
    (0, vitest_1.it)("serializes TTS playback and resolves in order", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler, started, finished, resolveFirst, firstGate, first, second;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handler = new media_stream_js_1.MediaStreamHandler({
                        sttProvider: createStubSttProvider(),
                    });
                    started = [];
                    finished = [];
                    firstGate = new Promise(function (resolve) {
                        resolveFirst = resolve;
                    });
                    first = handler.queueTts("stream-1", function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    started.push(1);
                                    return [4 /*yield*/, firstGate];
                                case 1:
                                    _a.sent();
                                    finished.push(1);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    second = handler.queueTts("stream-1", function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            started.push(2);
                            finished.push(2);
                            return [2 /*return*/];
                        });
                    }); });
                    return [4 /*yield*/, flush()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(started).toEqual([1]);
                    resolveFirst();
                    return [4 /*yield*/, first];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, second];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(started).toEqual([1, 2]);
                    (0, vitest_1.expect)(finished).toEqual([1, 2]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("cancels active playback and clears queued items", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler, queuedRan, started, active;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handler = new media_stream_js_1.MediaStreamHandler({
                        sttProvider: createStubSttProvider(),
                    });
                    queuedRan = false;
                    started = [];
                    active = handler.queueTts("stream-1", function (signal) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    started.push("active");
                                    return [4 /*yield*/, waitForAbort(signal)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    void handler.queueTts("stream-1", function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            queuedRan = true;
                            return [2 /*return*/];
                        });
                    }); });
                    return [4 /*yield*/, flush()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(started).toEqual(["active"]);
                    handler.clearTtsQueue("stream-1");
                    return [4 /*yield*/, active];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, flush()];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(queuedRan).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
