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
exports.TwilioProvider = void 0;
var node_crypto_1 = require("node:crypto");
var telephony_audio_js_1 = require("../telephony-audio.js");
var voice_mapping_js_1 = require("../voice-mapping.js");
var api_js_1 = require("./twilio/api.js");
var webhook_js_1 = require("./twilio/webhook.js");
var TwilioProvider = /** @class */ (function () {
    function TwilioProvider(config, options) {
        if (options === void 0) { options = {}; }
        this.name = "twilio";
        this.callWebhookUrls = new Map();
        /** Current public webhook URL (set when tunnel starts or from config) */
        this.currentPublicUrl = null;
        /** Optional telephony TTS provider for streaming TTS */
        this.ttsProvider = null;
        /** Optional media stream handler for sending audio */
        this.mediaStreamHandler = null;
        /** Map of call SID to stream SID for media streams */
        this.callStreamMap = new Map();
        /** Storage for TwiML content (for notify mode with URL-based TwiML) */
        this.twimlStorage = new Map();
        /** Track notify-mode calls to avoid streaming on follow-up callbacks */
        this.notifyCalls = new Set();
        if (!config.accountSid) {
            throw new Error("Twilio Account SID is required");
        }
        if (!config.authToken) {
            throw new Error("Twilio Auth Token is required");
        }
        this.accountSid = config.accountSid;
        this.authToken = config.authToken;
        this.baseUrl = "https://api.twilio.com/2010-04-01/Accounts/".concat(this.accountSid);
        this.options = options;
        if (options.publicUrl) {
            this.currentPublicUrl = options.publicUrl;
        }
    }
    /**
     * Delete stored TwiML for a given `callId`.
     *
     * We keep TwiML in-memory only long enough to satisfy the initial Twilio
     * webhook request (notify mode). Subsequent webhooks should not reuse it.
     */
    TwilioProvider.prototype.deleteStoredTwiml = function (callId) {
        this.twimlStorage.delete(callId);
        this.notifyCalls.delete(callId);
    };
    /**
     * Delete stored TwiML for a call, addressed by Twilio's provider call SID.
     *
     * This is used when we only have `providerCallId` (e.g. hangup).
     */
    TwilioProvider.prototype.deleteStoredTwimlForProviderCall = function (providerCallId) {
        var webhookUrl = this.callWebhookUrls.get(providerCallId);
        if (!webhookUrl) {
            return;
        }
        var callIdMatch = webhookUrl.match(/callId=([^&]+)/);
        if (!callIdMatch) {
            return;
        }
        this.deleteStoredTwiml(callIdMatch[1]);
    };
    TwilioProvider.prototype.setPublicUrl = function (url) {
        this.currentPublicUrl = url;
    };
    TwilioProvider.prototype.getPublicUrl = function () {
        return this.currentPublicUrl;
    };
    TwilioProvider.prototype.setTTSProvider = function (provider) {
        this.ttsProvider = provider;
    };
    TwilioProvider.prototype.setMediaStreamHandler = function (handler) {
        this.mediaStreamHandler = handler;
    };
    TwilioProvider.prototype.registerCallStream = function (callSid, streamSid) {
        this.callStreamMap.set(callSid, streamSid);
    };
    TwilioProvider.prototype.unregisterCallStream = function (callSid) {
        this.callStreamMap.delete(callSid);
    };
    /**
     * Clear TTS queue for a call (barge-in).
     * Used when user starts speaking to interrupt current TTS playback.
     */
    TwilioProvider.prototype.clearTtsQueue = function (callSid) {
        var streamSid = this.callStreamMap.get(callSid);
        if (streamSid && this.mediaStreamHandler) {
            this.mediaStreamHandler.clearTtsQueue(streamSid);
        }
    };
    /**
     * Make an authenticated request to the Twilio API.
     */
    TwilioProvider.prototype.apiRequest = function (endpoint, params, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, api_js_1.twilioApiRequest)({
                            baseUrl: this.baseUrl,
                            accountSid: this.accountSid,
                            authToken: this.authToken,
                            endpoint: endpoint,
                            body: params,
                            allowNotFound: options === null || options === void 0 ? void 0 : options.allowNotFound,
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Verify Twilio webhook signature using HMAC-SHA1.
     *
     * Handles reverse proxy scenarios (Tailscale, nginx, ngrok) by reconstructing
     * the public URL from forwarding headers.
     *
     * @see https://www.twilio.com/docs/usage/webhooks/webhooks-security
     */
    TwilioProvider.prototype.verifyWebhook = function (ctx) {
        return (0, webhook_js_1.verifyTwilioProviderWebhook)({
            ctx: ctx,
            authToken: this.authToken,
            currentPublicUrl: this.currentPublicUrl,
            options: this.options,
        });
    };
    /**
     * Parse Twilio webhook event into normalized format.
     */
    TwilioProvider.prototype.parseWebhookEvent = function (ctx) {
        var _a;
        try {
            var params = new URLSearchParams(ctx.rawBody);
            var callIdFromQuery = typeof ((_a = ctx.query) === null || _a === void 0 ? void 0 : _a.callId) === "string" && ctx.query.callId.trim()
                ? ctx.query.callId.trim()
                : undefined;
            var event_1 = this.normalizeEvent(params, callIdFromQuery);
            // For Twilio, we must return TwiML. Most actions are driven by Calls API updates,
            // so the webhook response is typically a pause to keep the call alive.
            var twiml = this.generateTwimlResponse(ctx);
            return {
                events: event_1 ? [event_1] : [],
                providerResponseBody: twiml,
                providerResponseHeaders: { "Content-Type": "application/xml" },
                statusCode: 200,
            };
        }
        catch (_b) {
            return { events: [], statusCode: 400 };
        }
    };
    /**
     * Parse Twilio direction to normalized format.
     */
    TwilioProvider.parseDirection = function (direction) {
        if (direction === "inbound") {
            return "inbound";
        }
        if (direction === "outbound-api" || direction === "outbound-dial") {
            return "outbound";
        }
        return undefined;
    };
    /**
     * Convert Twilio webhook params to normalized event format.
     */
    TwilioProvider.prototype.normalizeEvent = function (params, callIdOverride) {
        var callSid = params.get("CallSid") || "";
        var baseEvent = {
            id: node_crypto_1.default.randomUUID(),
            callId: callIdOverride || callSid,
            providerCallId: callSid,
            timestamp: Date.now(),
            direction: TwilioProvider.parseDirection(params.get("Direction")),
            from: params.get("From") || undefined,
            to: params.get("To") || undefined,
        };
        // Handle speech result (from <Gather>)
        var speechResult = params.get("SpeechResult");
        if (speechResult) {
            return __assign(__assign({}, baseEvent), { type: "call.speech", transcript: speechResult, isFinal: true, confidence: parseFloat(params.get("Confidence") || "0.9") });
        }
        // Handle DTMF
        var digits = params.get("Digits");
        if (digits) {
            return __assign(__assign({}, baseEvent), { type: "call.dtmf", digits: digits });
        }
        // Handle call status changes
        var callStatus = params.get("CallStatus");
        switch (callStatus) {
            case "initiated":
                return __assign(__assign({}, baseEvent), { type: "call.initiated" });
            case "ringing":
                return __assign(__assign({}, baseEvent), { type: "call.ringing" });
            case "in-progress":
                return __assign(__assign({}, baseEvent), { type: "call.answered" });
            case "completed":
            case "busy":
            case "no-answer":
            case "failed":
                if (callIdOverride) {
                    this.deleteStoredTwiml(callIdOverride);
                }
                return __assign(__assign({}, baseEvent), { type: "call.ended", reason: callStatus });
            case "canceled":
                if (callIdOverride) {
                    this.deleteStoredTwiml(callIdOverride);
                }
                return __assign(__assign({}, baseEvent), { type: "call.ended", reason: "hangup-bot" });
            default:
                return null;
        }
    };
    /**
     * Generate TwiML response for webhook.
     * When a call is answered, connects to media stream for bidirectional audio.
     */
    TwilioProvider.prototype.generateTwimlResponse = function (ctx) {
        var _a, _b, _c;
        if (!ctx) {
            return TwilioProvider.EMPTY_TWIML;
        }
        var params = new URLSearchParams(ctx.rawBody);
        var type = typeof ((_a = ctx.query) === null || _a === void 0 ? void 0 : _a.type) === "string" ? ctx.query.type.trim() : undefined;
        var isStatusCallback = type === "status";
        var callStatus = params.get("CallStatus");
        var direction = params.get("Direction");
        var isOutbound = (_b = direction === null || direction === void 0 ? void 0 : direction.startsWith("outbound")) !== null && _b !== void 0 ? _b : false;
        var callIdFromQuery = typeof ((_c = ctx.query) === null || _c === void 0 ? void 0 : _c.callId) === "string" && ctx.query.callId.trim()
            ? ctx.query.callId.trim()
            : undefined;
        // Avoid logging webhook params/TwiML (may contain PII).
        // Handle initial TwiML request (when Twilio first initiates the call)
        // Check if we have stored TwiML for this call (notify mode)
        if (callIdFromQuery && !isStatusCallback) {
            var storedTwiml = this.twimlStorage.get(callIdFromQuery);
            if (storedTwiml) {
                // Clean up after serving (one-time use)
                this.deleteStoredTwiml(callIdFromQuery);
                return storedTwiml;
            }
            if (this.notifyCalls.has(callIdFromQuery)) {
                return TwilioProvider.EMPTY_TWIML;
            }
            // Conversation mode: return streaming TwiML immediately for outbound calls.
            if (isOutbound) {
                var streamUrl_1 = this.getStreamUrl();
                return streamUrl_1 ? this.getStreamConnectXml(streamUrl_1) : TwilioProvider.PAUSE_TWIML;
            }
        }
        // Status callbacks should not receive TwiML.
        if (isStatusCallback) {
            return TwilioProvider.EMPTY_TWIML;
        }
        // Handle subsequent webhook requests (status callbacks, etc.)
        // For inbound calls, answer immediately with stream
        if (direction === "inbound") {
            var streamUrl_2 = this.getStreamUrl();
            return streamUrl_2 ? this.getStreamConnectXml(streamUrl_2) : TwilioProvider.PAUSE_TWIML;
        }
        // For outbound calls, only connect to stream when call is in-progress
        if (callStatus !== "in-progress") {
            return TwilioProvider.EMPTY_TWIML;
        }
        var streamUrl = this.getStreamUrl();
        return streamUrl ? this.getStreamConnectXml(streamUrl) : TwilioProvider.PAUSE_TWIML;
    };
    /**
     * Get the WebSocket URL for media streaming.
     * Derives from the public URL origin + stream path.
     */
    TwilioProvider.prototype.getStreamUrl = function () {
        if (!this.currentPublicUrl || !this.options.streamPath) {
            return null;
        }
        // Extract just the origin (host) from the public URL, ignoring any path
        var url = new URL(this.currentPublicUrl);
        var origin = url.origin;
        // Convert https:// to wss:// for WebSocket
        var wsOrigin = origin.replace(/^https:\/\//, "wss://").replace(/^http:\/\//, "ws://");
        // Append the stream path
        var path = this.options.streamPath.startsWith("/")
            ? this.options.streamPath
            : "/".concat(this.options.streamPath);
        return "".concat(wsOrigin).concat(path);
    };
    /**
     * Generate TwiML to connect a call to a WebSocket media stream.
     * This enables bidirectional audio streaming for real-time STT/TTS.
     *
     * @param streamUrl - WebSocket URL (wss://...) for the media stream
     */
    TwilioProvider.prototype.getStreamConnectXml = function (streamUrl) {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response>\n  <Connect>\n    <Stream url=\"".concat((0, voice_mapping_js_1.escapeXml)(streamUrl), "\" />\n  </Connect>\n</Response>");
    };
    /**
     * Initiate an outbound call via Twilio API.
     * If inlineTwiml is provided, uses that directly (for notify mode).
     * Otherwise, uses webhook URL for dynamic TwiML.
     */
    TwilioProvider.prototype.initiateCall = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var url, statusUrl, params, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = new URL(input.webhookUrl);
                        url.searchParams.set("callId", input.callId);
                        statusUrl = new URL(input.webhookUrl);
                        statusUrl.searchParams.set("callId", input.callId);
                        statusUrl.searchParams.set("type", "status"); // Differentiate from TwiML requests
                        // Store TwiML content if provided (for notify mode)
                        // We now serve it from the webhook endpoint instead of sending inline
                        if (input.inlineTwiml) {
                            this.twimlStorage.set(input.callId, input.inlineTwiml);
                            this.notifyCalls.add(input.callId);
                        }
                        params = {
                            To: input.to,
                            From: input.from,
                            Url: url.toString(), // TwiML serving endpoint
                            StatusCallback: statusUrl.toString(), // Separate status callback endpoint
                            StatusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
                            Timeout: "30",
                        };
                        return [4 /*yield*/, this.apiRequest("/Calls.json", params)];
                    case 1:
                        result = _a.sent();
                        this.callWebhookUrls.set(result.sid, url.toString());
                        return [2 /*return*/, {
                                providerCallId: result.sid,
                                status: result.status === "queued" ? "queued" : "initiated",
                            }];
                }
            });
        });
    };
    /**
     * Hang up a call via Twilio API.
     */
    TwilioProvider.prototype.hangupCall = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.deleteStoredTwimlForProviderCall(input.providerCallId);
                        this.callWebhookUrls.delete(input.providerCallId);
                        return [4 /*yield*/, this.apiRequest("/Calls/".concat(input.providerCallId, ".json"), { Status: "completed" }, { allowNotFound: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Play TTS audio via Twilio.
     *
     * Two modes:
     * 1. Core TTS + Media Streams: If TTS provider and media stream are available,
     *    generates audio via core TTS and streams it through WebSocket (preferred).
     * 2. TwiML <Say>: Falls back to Twilio's native TTS with Polly voices.
     *    Note: This may not work on all Twilio accounts.
     */
    TwilioProvider.prototype.playTts = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var streamSid, err_1, webhookUrl, pollyVoice, twiml;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        streamSid = this.callStreamMap.get(input.providerCallId);
                        if (!(this.ttsProvider && this.mediaStreamHandler && streamSid)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.playTtsViaStream(input.text, streamSid)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                    case 3:
                        err_1 = _a.sent();
                        console.warn("[voice-call] Telephony TTS failed, falling back to Twilio <Say>:", err_1 instanceof Error ? err_1.message : err_1);
                        return [3 /*break*/, 4];
                    case 4:
                        webhookUrl = this.callWebhookUrls.get(input.providerCallId);
                        if (!webhookUrl) {
                            throw new Error("Missing webhook URL for this call (provider state not initialized)");
                        }
                        console.warn("[voice-call] Using TwiML <Say> fallback - telephony TTS not configured or media stream not active");
                        pollyVoice = (0, voice_mapping_js_1.mapVoiceToPolly)(input.voice);
                        twiml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response>\n  <Say voice=\"".concat(pollyVoice, "\" language=\"").concat(input.locale || "en-US", "\">").concat((0, voice_mapping_js_1.escapeXml)(input.text), "</Say>\n  <Gather input=\"speech\" speechTimeout=\"auto\" action=\"").concat((0, voice_mapping_js_1.escapeXml)(webhookUrl), "\" method=\"POST\">\n    <Say>.</Say>\n  </Gather>\n</Response>");
                        return [4 /*yield*/, this.apiRequest("/Calls/".concat(input.providerCallId, ".json"), {
                                Twiml: twiml,
                            })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Play TTS via core TTS and Twilio Media Streams.
     * Generates audio with core TTS, converts to mu-law, and streams via WebSocket.
     * Uses a queue to serialize playback and prevent overlapping audio.
     */
    TwilioProvider.prototype.playTtsViaStream = function (text, streamSid) {
        return __awaiter(this, void 0, void 0, function () {
            var CHUNK_SIZE, CHUNK_DELAY_MS, handler, ttsProvider;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.ttsProvider || !this.mediaStreamHandler) {
                            throw new Error("TTS provider and media stream handler required");
                        }
                        CHUNK_SIZE = 160;
                        CHUNK_DELAY_MS = 20;
                        handler = this.mediaStreamHandler;
                        ttsProvider = this.ttsProvider;
                        return [4 /*yield*/, handler.queueTts(streamSid, function (signal) { return __awaiter(_this, void 0, void 0, function () {
                                var muLawAudio, _i, _a, chunk;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, ttsProvider.synthesizeForTelephony(text)];
                                        case 1:
                                            muLawAudio = _b.sent();
                                            _i = 0, _a = (0, telephony_audio_js_1.chunkAudio)(muLawAudio, CHUNK_SIZE);
                                            _b.label = 2;
                                        case 2:
                                            if (!(_i < _a.length)) return [3 /*break*/, 5];
                                            chunk = _a[_i];
                                            if (signal.aborted) {
                                                return [3 /*break*/, 5];
                                            }
                                            handler.sendAudio(streamSid, chunk);
                                            // Pace the audio to match real-time playback
                                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, CHUNK_DELAY_MS); })];
                                        case 3:
                                            // Pace the audio to match real-time playback
                                            _b.sent();
                                            if (signal.aborted) {
                                                return [3 /*break*/, 5];
                                            }
                                            _b.label = 4;
                                        case 4:
                                            _i++;
                                            return [3 /*break*/, 2];
                                        case 5:
                                            if (!signal.aborted) {
                                                // Send a mark to track when audio finishes
                                                handler.sendMark(streamSid, "tts-".concat(Date.now()));
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Start listening for speech via Twilio <Gather>.
     */
    TwilioProvider.prototype.startListening = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var webhookUrl, twiml;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        webhookUrl = this.callWebhookUrls.get(input.providerCallId);
                        if (!webhookUrl) {
                            throw new Error("Missing webhook URL for this call (provider state not initialized)");
                        }
                        twiml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response>\n  <Gather input=\"speech\" speechTimeout=\"auto\" language=\"".concat(input.language || "en-US", "\" action=\"").concat((0, voice_mapping_js_1.escapeXml)(webhookUrl), "\" method=\"POST\">\n  </Gather>\n</Response>");
                        return [4 /*yield*/, this.apiRequest("/Calls/".concat(input.providerCallId, ".json"), {
                                Twiml: twiml,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Stop listening - for Twilio this is a no-op as <Gather> auto-ends.
     */
    TwilioProvider.prototype.stopListening = function (_input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    TwilioProvider.EMPTY_TWIML = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
    TwilioProvider.PAUSE_TWIML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response>\n  <Pause length=\"30\"/>\n</Response>";
    return TwilioProvider;
}());
exports.TwilioProvider = TwilioProvider;
