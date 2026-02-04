"use strict";
/**
 * Media Stream Handler
 *
 * Handles bidirectional audio streaming between Twilio and the AI services.
 * - Receives mu-law audio from Twilio via WebSocket
 * - Forwards to OpenAI Realtime STT for transcription
 * - Sends TTS audio back to Twilio
 */
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
exports.MediaStreamHandler = void 0;
var ws_1 = require("ws");
/**
 * Manages WebSocket connections for Twilio media streams.
 */
var MediaStreamHandler = /** @class */ (function () {
    function MediaStreamHandler(config) {
        this.wss = null;
        this.sessions = new Map();
        /** TTS playback queues per stream (serialize audio to prevent overlap) */
        this.ttsQueues = new Map();
        /** Whether TTS is currently playing per stream */
        this.ttsPlaying = new Map();
        /** Active TTS playback controllers per stream */
        this.ttsActiveControllers = new Map();
        this.config = config;
    }
    /**
     * Handle WebSocket upgrade for media stream connections.
     */
    MediaStreamHandler.prototype.handleUpgrade = function (request, socket, head) {
        var _this = this;
        if (!this.wss) {
            this.wss = new ws_1.WebSocketServer({ noServer: true });
            this.wss.on("connection", function (ws, req) { return _this.handleConnection(ws, req); });
        }
        this.wss.handleUpgrade(request, socket, head, function (ws) {
            var _a;
            (_a = _this.wss) === null || _a === void 0 ? void 0 : _a.emit("connection", ws, request);
        });
    };
    /**
     * Handle new WebSocket connection from Twilio.
     */
    MediaStreamHandler.prototype.handleConnection = function (ws, _request) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            var _this = this;
            return __generator(this, function (_a) {
                session = null;
                ws.on("message", function (data) { return __awaiter(_this, void 0, void 0, function () {
                    var message, _a, audioBuffer, error_1;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _c.trys.push([0, 7, , 8]);
                                message = JSON.parse(data.toString());
                                _a = message.event;
                                switch (_a) {
                                    case "connected": return [3 /*break*/, 1];
                                    case "start": return [3 /*break*/, 2];
                                    case "media": return [3 /*break*/, 4];
                                    case "stop": return [3 /*break*/, 5];
                                }
                                return [3 /*break*/, 6];
                            case 1:
                                console.log("[MediaStream] Twilio connected");
                                return [3 /*break*/, 6];
                            case 2: return [4 /*yield*/, this.handleStart(ws, message)];
                            case 3:
                                session = _c.sent();
                                return [3 /*break*/, 6];
                            case 4:
                                if (session && ((_b = message.media) === null || _b === void 0 ? void 0 : _b.payload)) {
                                    audioBuffer = Buffer.from(message.media.payload, "base64");
                                    session.sttSession.sendAudio(audioBuffer);
                                }
                                return [3 /*break*/, 6];
                            case 5:
                                if (session) {
                                    this.handleStop(session);
                                    session = null;
                                }
                                return [3 /*break*/, 6];
                            case 6: return [3 /*break*/, 8];
                            case 7:
                                error_1 = _c.sent();
                                console.error("[MediaStream] Error processing message:", error_1);
                                return [3 /*break*/, 8];
                            case 8: return [2 /*return*/];
                        }
                    });
                }); });
                ws.on("close", function () {
                    if (session) {
                        _this.handleStop(session);
                    }
                });
                ws.on("error", function (error) {
                    console.error("[MediaStream] WebSocket error:", error);
                });
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handle stream start event.
     */
    MediaStreamHandler.prototype.handleStart = function (ws, message) {
        return __awaiter(this, void 0, void 0, function () {
            var streamSid, callSid, sttSession, session;
            var _this = this;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                streamSid = message.streamSid || "";
                callSid = ((_a = message.start) === null || _a === void 0 ? void 0 : _a.callSid) || "";
                console.log("[MediaStream] Stream started: ".concat(streamSid, " (call: ").concat(callSid, ")"));
                sttSession = this.config.sttProvider.createSession();
                // Set up transcript callbacks
                sttSession.onPartial(function (partial) {
                    var _a, _b;
                    (_b = (_a = _this.config).onPartialTranscript) === null || _b === void 0 ? void 0 : _b.call(_a, callSid, partial);
                });
                sttSession.onTranscript(function (transcript) {
                    var _a, _b;
                    (_b = (_a = _this.config).onTranscript) === null || _b === void 0 ? void 0 : _b.call(_a, callSid, transcript);
                });
                sttSession.onSpeechStart(function () {
                    var _a, _b;
                    (_b = (_a = _this.config).onSpeechStart) === null || _b === void 0 ? void 0 : _b.call(_a, callSid);
                });
                session = {
                    callId: callSid,
                    streamSid: streamSid,
                    ws: ws,
                    sttSession: sttSession,
                };
                this.sessions.set(streamSid, session);
                // Notify connection BEFORE STT connect so TTS can work even if STT fails
                (_c = (_b = this.config).onConnect) === null || _c === void 0 ? void 0 : _c.call(_b, callSid, streamSid);
                // Connect to OpenAI STT (non-blocking, log errors but don't fail the call)
                sttSession.connect().catch(function (err) {
                    console.warn("[MediaStream] STT connection failed (TTS still works):", err.message);
                });
                return [2 /*return*/, session];
            });
        });
    };
    /**
     * Handle stream stop event.
     */
    MediaStreamHandler.prototype.handleStop = function (session) {
        var _a, _b;
        console.log("[MediaStream] Stream stopped: ".concat(session.streamSid));
        this.clearTtsState(session.streamSid);
        session.sttSession.close();
        this.sessions.delete(session.streamSid);
        (_b = (_a = this.config).onDisconnect) === null || _b === void 0 ? void 0 : _b.call(_a, session.callId);
    };
    /**
     * Get an active session with an open WebSocket, or undefined if unavailable.
     */
    MediaStreamHandler.prototype.getOpenSession = function (streamSid) {
        var session = this.sessions.get(streamSid);
        return (session === null || session === void 0 ? void 0 : session.ws.readyState) === ws_1.WebSocket.OPEN ? session : undefined;
    };
    /**
     * Send a message to a stream's WebSocket if available.
     */
    MediaStreamHandler.prototype.sendToStream = function (streamSid, message) {
        var session = this.getOpenSession(streamSid);
        session === null || session === void 0 ? void 0 : session.ws.send(JSON.stringify(message));
    };
    /**
     * Send audio to a specific stream (for TTS playback).
     * Audio should be mu-law encoded at 8kHz mono.
     */
    MediaStreamHandler.prototype.sendAudio = function (streamSid, muLawAudio) {
        this.sendToStream(streamSid, {
            event: "media",
            streamSid: streamSid,
            media: { payload: muLawAudio.toString("base64") },
        });
    };
    /**
     * Send a mark event to track audio playback position.
     */
    MediaStreamHandler.prototype.sendMark = function (streamSid, name) {
        this.sendToStream(streamSid, {
            event: "mark",
            streamSid: streamSid,
            mark: { name: name },
        });
    };
    /**
     * Clear audio buffer (interrupt playback).
     */
    MediaStreamHandler.prototype.clearAudio = function (streamSid) {
        this.sendToStream(streamSid, { event: "clear", streamSid: streamSid });
    };
    /**
     * Queue a TTS operation for sequential playback.
     * Only one TTS operation plays at a time per stream to prevent overlap.
     */
    MediaStreamHandler.prototype.queueTts = function (streamSid, playFn) {
        return __awaiter(this, void 0, void 0, function () {
            var queue, resolveEntry, rejectEntry, promise;
            return __generator(this, function (_a) {
                queue = this.getTtsQueue(streamSid);
                promise = new Promise(function (resolve, reject) {
                    resolveEntry = resolve;
                    rejectEntry = reject;
                });
                queue.push({
                    playFn: playFn,
                    controller: new AbortController(),
                    resolve: resolveEntry,
                    reject: rejectEntry,
                });
                if (!this.ttsPlaying.get(streamSid)) {
                    void this.processQueue(streamSid);
                }
                return [2 /*return*/, promise];
            });
        });
    };
    /**
     * Clear TTS queue and interrupt current playback (barge-in).
     */
    MediaStreamHandler.prototype.clearTtsQueue = function (streamSid) {
        var _a;
        var queue = this.getTtsQueue(streamSid);
        queue.length = 0;
        (_a = this.ttsActiveControllers.get(streamSid)) === null || _a === void 0 ? void 0 : _a.abort();
        this.clearAudio(streamSid);
    };
    /**
     * Get active session by call ID.
     */
    MediaStreamHandler.prototype.getSessionByCallId = function (callId) {
        return __spreadArray([], this.sessions.values(), true).find(function (session) { return session.callId === callId; });
    };
    /**
     * Close all sessions.
     */
    MediaStreamHandler.prototype.closeAll = function () {
        for (var _i = 0, _a = this.sessions.values(); _i < _a.length; _i++) {
            var session = _a[_i];
            this.clearTtsState(session.streamSid);
            session.sttSession.close();
            session.ws.close();
        }
        this.sessions.clear();
    };
    MediaStreamHandler.prototype.getTtsQueue = function (streamSid) {
        var existing = this.ttsQueues.get(streamSid);
        if (existing) {
            return existing;
        }
        var queue = [];
        this.ttsQueues.set(streamSid, queue);
        return queue;
    };
    /**
     * Process the TTS queue for a stream.
     * Uses iterative approach to avoid stack accumulation from recursion.
     */
    MediaStreamHandler.prototype.processQueue = function (streamSid) {
        return __awaiter(this, void 0, void 0, function () {
            var queue, entry, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ttsPlaying.set(streamSid, true);
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 7];
                        queue = this.ttsQueues.get(streamSid);
                        if (!queue || queue.length === 0) {
                            this.ttsPlaying.set(streamSid, false);
                            this.ttsActiveControllers.delete(streamSid);
                            return [2 /*return*/];
                        }
                        entry = queue.shift();
                        this.ttsActiveControllers.set(streamSid, entry.controller);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, 5, 6]);
                        return [4 /*yield*/, entry.playFn(entry.controller.signal)];
                    case 3:
                        _a.sent();
                        entry.resolve();
                        return [3 /*break*/, 6];
                    case 4:
                        error_2 = _a.sent();
                        if (entry.controller.signal.aborted) {
                            entry.resolve();
                        }
                        else {
                            console.error("[MediaStream] TTS playback error:", error_2);
                            entry.reject(error_2);
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        if (this.ttsActiveControllers.get(streamSid) === entry.controller) {
                            this.ttsActiveControllers.delete(streamSid);
                        }
                        return [7 /*endfinally*/];
                    case 6: return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MediaStreamHandler.prototype.clearTtsState = function (streamSid) {
        var _a;
        var queue = this.ttsQueues.get(streamSid);
        if (queue) {
            queue.length = 0;
        }
        (_a = this.ttsActiveControllers.get(streamSid)) === null || _a === void 0 ? void 0 : _a.abort();
        this.ttsActiveControllers.delete(streamSid);
        this.ttsPlaying.delete(streamSid);
        this.ttsQueues.delete(streamSid);
    };
    return MediaStreamHandler;
}());
exports.MediaStreamHandler = MediaStreamHandler;
