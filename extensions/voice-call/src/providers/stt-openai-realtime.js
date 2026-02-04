"use strict";
/**
 * OpenAI Realtime STT Provider
 *
 * Uses the OpenAI Realtime API for streaming transcription with:
 * - Direct mu-law audio support (no conversion needed)
 * - Built-in server-side VAD for turn detection
 * - Low-latency streaming transcription
 * - Partial transcript callbacks for real-time UI updates
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIRealtimeSTTProvider = void 0;
var ws_1 = require("ws");
/**
 * Provider factory for OpenAI Realtime STT sessions.
 */
var OpenAIRealtimeSTTProvider = /** @class */ (function () {
    function OpenAIRealtimeSTTProvider(config) {
        this.name = "openai-realtime";
        if (!config.apiKey) {
            throw new Error("OpenAI API key required for Realtime STT");
        }
        this.apiKey = config.apiKey;
        this.model = config.model || "gpt-4o-transcribe";
        this.silenceDurationMs = config.silenceDurationMs || 800;
        this.vadThreshold = config.vadThreshold || 0.5;
    }
    /**
     * Create a new realtime transcription session.
     */
    OpenAIRealtimeSTTProvider.prototype.createSession = function () {
        return new OpenAIRealtimeSTTSession(this.apiKey, this.model, this.silenceDurationMs, this.vadThreshold);
    };
    return OpenAIRealtimeSTTProvider;
}());
exports.OpenAIRealtimeSTTProvider = OpenAIRealtimeSTTProvider;
/**
 * WebSocket-based session for real-time speech-to-text.
 */
var OpenAIRealtimeSTTSession = /** @class */ (function () {
    function OpenAIRealtimeSTTSession(apiKey, model, silenceDurationMs, vadThreshold) {
        this.apiKey = apiKey;
        this.model = model;
        this.silenceDurationMs = silenceDurationMs;
        this.vadThreshold = vadThreshold;
        this.ws = null;
        this.connected = false;
        this.closed = false;
        this.reconnectAttempts = 0;
        this.pendingTranscript = "";
        this.onTranscriptCallback = null;
        this.onPartialCallback = null;
        this.onSpeechStartCallback = null;
    }
    OpenAIRealtimeSTTSession.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.closed = false;
                this.reconnectAttempts = 0;
                return [2 /*return*/, this.doConnect()];
            });
        });
    };
    OpenAIRealtimeSTTSession.prototype.doConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var url = "wss://api.openai.com/v1/realtime?intent=transcription";
                        _this.ws = new ws_1.default(url, {
                            headers: {
                                Authorization: "Bearer ".concat(_this.apiKey),
                                "OpenAI-Beta": "realtime=v1",
                            },
                        });
                        _this.ws.on("open", function () {
                            console.log("[RealtimeSTT] WebSocket connected");
                            _this.connected = true;
                            _this.reconnectAttempts = 0;
                            // Configure the transcription session
                            _this.sendEvent({
                                type: "transcription_session.update",
                                session: {
                                    input_audio_format: "g711_ulaw",
                                    input_audio_transcription: {
                                        model: _this.model,
                                    },
                                    turn_detection: {
                                        type: "server_vad",
                                        threshold: _this.vadThreshold,
                                        prefix_padding_ms: 300,
                                        silence_duration_ms: _this.silenceDurationMs,
                                    },
                                },
                            });
                            resolve();
                        });
                        _this.ws.on("message", function (data) {
                            try {
                                var event_1 = JSON.parse(data.toString());
                                _this.handleEvent(event_1);
                            }
                            catch (e) {
                                console.error("[RealtimeSTT] Failed to parse event:", e);
                            }
                        });
                        _this.ws.on("error", function (error) {
                            console.error("[RealtimeSTT] WebSocket error:", error);
                            if (!_this.connected) {
                                reject(error);
                            }
                        });
                        _this.ws.on("close", function (code, reason) {
                            console.log("[RealtimeSTT] WebSocket closed (code: ".concat(code, ", reason: ").concat((reason === null || reason === void 0 ? void 0 : reason.toString()) || "none", ")"));
                            _this.connected = false;
                            // Attempt reconnection if not intentionally closed
                            if (!_this.closed) {
                                void _this.attemptReconnect();
                            }
                        });
                        setTimeout(function () {
                            if (!_this.connected) {
                                reject(new Error("Realtime STT connection timeout"));
                            }
                        }, 10000);
                    })];
            });
        });
    };
    OpenAIRealtimeSTTSession.prototype.attemptReconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var delay, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.closed) {
                            return [2 /*return*/];
                        }
                        if (this.reconnectAttempts >= OpenAIRealtimeSTTSession.MAX_RECONNECT_ATTEMPTS) {
                            console.error("[RealtimeSTT] Max reconnect attempts (".concat(OpenAIRealtimeSTTSession.MAX_RECONNECT_ATTEMPTS, ") reached"));
                            return [2 /*return*/];
                        }
                        this.reconnectAttempts++;
                        delay = OpenAIRealtimeSTTSession.RECONNECT_DELAY_MS * Math.pow(2, (this.reconnectAttempts - 1));
                        console.log("[RealtimeSTT] Reconnecting ".concat(this.reconnectAttempts, "/").concat(OpenAIRealtimeSTTSession.MAX_RECONNECT_ATTEMPTS, " in ").concat(delay, "ms..."));
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay); })];
                    case 1:
                        _a.sent();
                        if (this.closed) {
                            return [2 /*return*/];
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.doConnect()];
                    case 3:
                        _a.sent();
                        console.log("[RealtimeSTT] Reconnected successfully");
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error("[RealtimeSTT] Reconnect failed:", error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OpenAIRealtimeSTTSession.prototype.handleEvent = function (event) {
        var _a, _b, _c;
        switch (event.type) {
            case "transcription_session.created":
            case "transcription_session.updated":
            case "input_audio_buffer.speech_stopped":
            case "input_audio_buffer.committed":
                console.log("[RealtimeSTT] ".concat(event.type));
                break;
            case "conversation.item.input_audio_transcription.delta":
                if (event.delta) {
                    this.pendingTranscript += event.delta;
                    (_a = this.onPartialCallback) === null || _a === void 0 ? void 0 : _a.call(this, this.pendingTranscript);
                }
                break;
            case "conversation.item.input_audio_transcription.completed":
                if (event.transcript) {
                    console.log("[RealtimeSTT] Transcript: ".concat(event.transcript));
                    (_b = this.onTranscriptCallback) === null || _b === void 0 ? void 0 : _b.call(this, event.transcript);
                }
                this.pendingTranscript = "";
                break;
            case "input_audio_buffer.speech_started":
                console.log("[RealtimeSTT] Speech started");
                this.pendingTranscript = "";
                (_c = this.onSpeechStartCallback) === null || _c === void 0 ? void 0 : _c.call(this);
                break;
            case "error":
                console.error("[RealtimeSTT] Error:", event.error);
                break;
        }
    };
    OpenAIRealtimeSTTSession.prototype.sendEvent = function (event) {
        var _a;
        if (((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === ws_1.default.OPEN) {
            this.ws.send(JSON.stringify(event));
        }
    };
    OpenAIRealtimeSTTSession.prototype.sendAudio = function (muLawData) {
        if (!this.connected) {
            return;
        }
        this.sendEvent({
            type: "input_audio_buffer.append",
            audio: muLawData.toString("base64"),
        });
    };
    OpenAIRealtimeSTTSession.prototype.onPartial = function (callback) {
        this.onPartialCallback = callback;
    };
    OpenAIRealtimeSTTSession.prototype.onTranscript = function (callback) {
        this.onTranscriptCallback = callback;
    };
    OpenAIRealtimeSTTSession.prototype.onSpeechStart = function (callback) {
        this.onSpeechStartCallback = callback;
    };
    OpenAIRealtimeSTTSession.prototype.waitForTranscript = function () {
        return __awaiter(this, arguments, void 0, function (timeoutMs) {
            var _this = this;
            if (timeoutMs === void 0) { timeoutMs = 30000; }
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var timeout = setTimeout(function () {
                            _this.onTranscriptCallback = null;
                            reject(new Error("Transcript timeout"));
                        }, timeoutMs);
                        _this.onTranscriptCallback = function (transcript) {
                            clearTimeout(timeout);
                            _this.onTranscriptCallback = null;
                            resolve(transcript);
                        };
                    })];
            });
        });
    };
    OpenAIRealtimeSTTSession.prototype.close = function () {
        this.closed = true;
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.connected = false;
    };
    OpenAIRealtimeSTTSession.prototype.isConnected = function () {
        return this.connected;
    };
    OpenAIRealtimeSTTSession.MAX_RECONNECT_ATTEMPTS = 5;
    OpenAIRealtimeSTTSession.RECONNECT_DELAY_MS = 1000;
    return OpenAIRealtimeSTTSession;
}());
