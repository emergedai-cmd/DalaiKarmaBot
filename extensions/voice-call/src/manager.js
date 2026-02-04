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
exports.CallManager = void 0;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var types_js_1 = require("./types.js");
var utils_js_1 = require("./utils.js");
var voice_mapping_js_1 = require("./voice-mapping.js");
function resolveDefaultStoreBase(config, storePath) {
    var _a, _b;
    var rawOverride = (storePath === null || storePath === void 0 ? void 0 : storePath.trim()) || ((_a = config.store) === null || _a === void 0 ? void 0 : _a.trim());
    if (rawOverride) {
        return (0, utils_js_1.resolveUserPath)(rawOverride);
    }
    var preferred = node_path_1.default.join(node_os_1.default.homedir(), ".openclaw", "voice-calls");
    var candidates = [preferred].map(function (dir) { return (0, utils_js_1.resolveUserPath)(dir); });
    var existing = (_b = candidates.find(function (dir) {
        try {
            return node_fs_1.default.existsSync(node_path_1.default.join(dir, "calls.jsonl")) || node_fs_1.default.existsSync(dir);
        }
        catch (_a) {
            return false;
        }
    })) !== null && _b !== void 0 ? _b : (0, utils_js_1.resolveUserPath)(preferred);
    return existing;
}
/**
 * Manages voice calls: state machine, persistence, and provider coordination.
 */
var CallManager = /** @class */ (function () {
    function CallManager(config, storePath) {
        this.activeCalls = new Map();
        this.providerCallIdMap = new Map(); // providerCallId -> internal callId
        this.processedEventIds = new Set();
        this.provider = null;
        this.webhookUrl = null;
        this.transcriptWaiters = new Map();
        /** Max duration timers to auto-hangup calls after configured timeout */
        this.maxDurationTimers = new Map();
        this.config = config;
        // Resolve store path with tilde expansion (like other config values)
        this.storePath = resolveDefaultStoreBase(config, storePath);
    }
    /**
     * Initialize the call manager with a provider.
     */
    CallManager.prototype.initialize = function (provider, webhookUrl) {
        this.provider = provider;
        this.webhookUrl = webhookUrl;
        // Ensure store directory exists
        node_fs_1.default.mkdirSync(this.storePath, { recursive: true });
        // Load any persisted active calls
        this.loadActiveCalls();
    };
    /**
     * Get the current provider.
     */
    CallManager.prototype.getProvider = function () {
        return this.provider;
    };
    /**
     * Initiate an outbound call.
     * @param to - The phone number to call
     * @param sessionKey - Optional session key for context
     * @param options - Optional call options (message, mode)
     */
    CallManager.prototype.initiateCall = function (to, sessionKey, options) {
        return __awaiter(this, void 0, void 0, function () {
            var opts, initialMessage, mode, activeCalls, callId, from, callRecord, inlineTwiml, pollyVoice, result, err_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        opts = typeof options === "string" ? { message: options } : (options !== null && options !== void 0 ? options : {});
                        initialMessage = opts.message;
                        mode = (_a = opts.mode) !== null && _a !== void 0 ? _a : this.config.outbound.defaultMode;
                        if (!this.provider) {
                            return [2 /*return*/, { callId: "", success: false, error: "Provider not initialized" }];
                        }
                        if (!this.webhookUrl) {
                            return [2 /*return*/, {
                                    callId: "",
                                    success: false,
                                    error: "Webhook URL not configured",
                                }];
                        }
                        activeCalls = this.getActiveCalls();
                        if (activeCalls.length >= this.config.maxConcurrentCalls) {
                            return [2 /*return*/, {
                                    callId: "",
                                    success: false,
                                    error: "Maximum concurrent calls (".concat(this.config.maxConcurrentCalls, ") reached"),
                                }];
                        }
                        callId = node_crypto_1.default.randomUUID();
                        from = this.config.fromNumber || (((_b = this.provider) === null || _b === void 0 ? void 0 : _b.name) === "mock" ? "+15550000000" : undefined);
                        if (!from) {
                            return [2 /*return*/, { callId: "", success: false, error: "fromNumber not configured" }];
                        }
                        callRecord = {
                            callId: callId,
                            provider: this.provider.name,
                            direction: "outbound",
                            state: "initiated",
                            from: from,
                            to: to,
                            sessionKey: sessionKey,
                            startedAt: Date.now(),
                            transcript: [],
                            processedEventIds: [],
                            metadata: __assign(__assign({}, (initialMessage && { initialMessage: initialMessage })), { mode: mode }),
                        };
                        this.activeCalls.set(callId, callRecord);
                        this.persistCallRecord(callRecord);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        inlineTwiml = void 0;
                        if (mode === "notify" && initialMessage) {
                            pollyVoice = (0, voice_mapping_js_1.mapVoiceToPolly)((_d = (_c = this.config.tts) === null || _c === void 0 ? void 0 : _c.openai) === null || _d === void 0 ? void 0 : _d.voice);
                            inlineTwiml = this.generateNotifyTwiml(initialMessage, pollyVoice);
                            console.log("[voice-call] Using inline TwiML for notify mode (voice: ".concat(pollyVoice, ")"));
                        }
                        return [4 /*yield*/, this.provider.initiateCall({
                                callId: callId,
                                from: from,
                                to: to,
                                webhookUrl: this.webhookUrl,
                                inlineTwiml: inlineTwiml,
                            })];
                    case 2:
                        result = _e.sent();
                        callRecord.providerCallId = result.providerCallId;
                        this.providerCallIdMap.set(result.providerCallId, callId); // Map providerCallId to internal callId
                        this.persistCallRecord(callRecord);
                        return [2 /*return*/, { callId: callId, success: true }];
                    case 3:
                        err_1 = _e.sent();
                        callRecord.state = "failed";
                        callRecord.endedAt = Date.now();
                        callRecord.endReason = "failed";
                        this.persistCallRecord(callRecord);
                        this.activeCalls.delete(callId);
                        if (callRecord.providerCallId) {
                            this.providerCallIdMap.delete(callRecord.providerCallId);
                        }
                        return [2 /*return*/, {
                                callId: callId,
                                success: false,
                                error: err_1 instanceof Error ? err_1.message : String(err_1),
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Speak to user in an active call.
     */
    CallManager.prototype.speak = function (callId, text) {
        return __awaiter(this, void 0, void 0, function () {
            var call, voice, err_2;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        call = this.activeCalls.get(callId);
                        if (!call) {
                            return [2 /*return*/, { success: false, error: "Call not found" }];
                        }
                        if (!this.provider || !call.providerCallId) {
                            return [2 /*return*/, { success: false, error: "Call not connected" }];
                        }
                        if (types_js_1.TerminalStates.has(call.state)) {
                            return [2 /*return*/, { success: false, error: "Call has ended" }];
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        // Update state
                        call.state = "speaking";
                        this.persistCallRecord(call);
                        // Add to transcript
                        this.addTranscriptEntry(call, "bot", text);
                        voice = ((_a = this.provider) === null || _a === void 0 ? void 0 : _a.name) === "twilio" ? (_c = (_b = this.config.tts) === null || _b === void 0 ? void 0 : _b.openai) === null || _c === void 0 ? void 0 : _c.voice : undefined;
                        return [4 /*yield*/, this.provider.playTts({
                                callId: callId,
                                providerCallId: call.providerCallId,
                                text: text,
                                voice: voice,
                            })];
                    case 2:
                        _d.sent();
                        return [2 /*return*/, { success: true }];
                    case 3:
                        err_2 = _d.sent();
                        return [2 /*return*/, {
                                success: false,
                                error: err_2 instanceof Error ? err_2.message : String(err_2),
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Speak the initial message for a call (called when media stream connects).
     * This is used to auto-play the message passed to initiateCall.
     * In notify mode, auto-hangup after the message is delivered.
     */
    CallManager.prototype.speakInitialMessage = function (providerCallId) {
        return __awaiter(this, void 0, void 0, function () {
            var call, initialMessage, mode, result, delaySec;
            var _this = this;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        call = this.getCallByProviderCallId(providerCallId);
                        if (!call) {
                            console.warn("[voice-call] speakInitialMessage: no call found for ".concat(providerCallId));
                            return [2 /*return*/];
                        }
                        initialMessage = (_a = call.metadata) === null || _a === void 0 ? void 0 : _a.initialMessage;
                        mode = (_c = (_b = call.metadata) === null || _b === void 0 ? void 0 : _b.mode) !== null && _c !== void 0 ? _c : "conversation";
                        if (!initialMessage) {
                            console.log("[voice-call] speakInitialMessage: no initial message for ".concat(call.callId));
                            return [2 /*return*/];
                        }
                        // Clear the initial message so we don't speak it again
                        if (call.metadata) {
                            delete call.metadata.initialMessage;
                            this.persistCallRecord(call);
                        }
                        console.log("[voice-call] Speaking initial message for call ".concat(call.callId, " (mode: ").concat(mode, ")"));
                        return [4 /*yield*/, this.speak(call.callId, initialMessage)];
                    case 1:
                        result = _d.sent();
                        if (!result.success) {
                            console.warn("[voice-call] Failed to speak initial message: ".concat(result.error));
                            return [2 /*return*/];
                        }
                        // In notify mode, auto-hangup after delay
                        if (mode === "notify") {
                            delaySec = this.config.outbound.notifyHangupDelaySec;
                            console.log("[voice-call] Notify mode: auto-hangup in ".concat(delaySec, "s for call ").concat(call.callId));
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var currentCall;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            currentCall = this.getCall(call.callId);
                                            if (!(currentCall && !types_js_1.TerminalStates.has(currentCall.state))) return [3 /*break*/, 2];
                                            console.log("[voice-call] Notify mode: hanging up call ".concat(call.callId));
                                            return [4 /*yield*/, this.endCall(call.callId)];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); }, delaySec * 1000);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Start max duration timer for a call.
     * Auto-hangup when maxDurationSeconds is reached.
     */
    CallManager.prototype.startMaxDurationTimer = function (callId) {
        var _this = this;
        // Clear any existing timer
        this.clearMaxDurationTimer(callId);
        var maxDurationMs = this.config.maxDurationSeconds * 1000;
        console.log("[voice-call] Starting max duration timer (".concat(this.config.maxDurationSeconds, "s) for call ").concat(callId));
        var timer = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var call;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.maxDurationTimers.delete(callId);
                        call = this.getCall(callId);
                        if (!(call && !types_js_1.TerminalStates.has(call.state))) return [3 /*break*/, 2];
                        console.log("[voice-call] Max duration reached (".concat(this.config.maxDurationSeconds, "s), ending call ").concat(callId));
                        call.endReason = "timeout";
                        this.persistCallRecord(call);
                        return [4 /*yield*/, this.endCall(callId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); }, maxDurationMs);
        this.maxDurationTimers.set(callId, timer);
    };
    /**
     * Clear max duration timer for a call.
     */
    CallManager.prototype.clearMaxDurationTimer = function (callId) {
        var timer = this.maxDurationTimers.get(callId);
        if (timer) {
            clearTimeout(timer);
            this.maxDurationTimers.delete(callId);
        }
    };
    CallManager.prototype.clearTranscriptWaiter = function (callId) {
        var waiter = this.transcriptWaiters.get(callId);
        if (!waiter) {
            return;
        }
        clearTimeout(waiter.timeout);
        this.transcriptWaiters.delete(callId);
    };
    CallManager.prototype.rejectTranscriptWaiter = function (callId, reason) {
        var waiter = this.transcriptWaiters.get(callId);
        if (!waiter) {
            return;
        }
        this.clearTranscriptWaiter(callId);
        waiter.reject(new Error(reason));
    };
    CallManager.prototype.resolveTranscriptWaiter = function (callId, transcript) {
        var waiter = this.transcriptWaiters.get(callId);
        if (!waiter) {
            return;
        }
        this.clearTranscriptWaiter(callId);
        waiter.resolve(transcript);
    };
    CallManager.prototype.waitForFinalTranscript = function (callId) {
        var _this = this;
        // Only allow one in-flight waiter per call.
        this.rejectTranscriptWaiter(callId, "Transcript waiter replaced");
        var timeoutMs = this.config.transcriptTimeoutMs;
        return new Promise(function (resolve, reject) {
            var timeout = setTimeout(function () {
                _this.transcriptWaiters.delete(callId);
                reject(new Error("Timed out waiting for transcript after ".concat(timeoutMs, "ms")));
            }, timeoutMs);
            _this.transcriptWaiters.set(callId, { resolve: resolve, reject: reject, timeout: timeout });
        });
    };
    /**
     * Continue call: speak prompt, then wait for user's final transcript.
     */
    CallManager.prototype.continueCall = function (callId, prompt) {
        return __awaiter(this, void 0, void 0, function () {
            var call, transcript, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        call = this.activeCalls.get(callId);
                        if (!call) {
                            return [2 /*return*/, { success: false, error: "Call not found" }];
                        }
                        if (!this.provider || !call.providerCallId) {
                            return [2 /*return*/, { success: false, error: "Call not connected" }];
                        }
                        if (types_js_1.TerminalStates.has(call.state)) {
                            return [2 /*return*/, { success: false, error: "Call has ended" }];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 8]);
                        return [4 /*yield*/, this.speak(callId, prompt)];
                    case 2:
                        _a.sent();
                        call.state = "listening";
                        this.persistCallRecord(call);
                        return [4 /*yield*/, this.provider.startListening({
                                callId: callId,
                                providerCallId: call.providerCallId,
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.waitForFinalTranscript(callId)];
                    case 4:
                        transcript = _a.sent();
                        // Best-effort: stop listening after final transcript.
                        return [4 /*yield*/, this.provider.stopListening({
                                callId: callId,
                                providerCallId: call.providerCallId,
                            })];
                    case 5:
                        // Best-effort: stop listening after final transcript.
                        _a.sent();
                        return [2 /*return*/, { success: true, transcript: transcript }];
                    case 6:
                        err_3 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                error: err_3 instanceof Error ? err_3.message : String(err_3),
                            }];
                    case 7:
                        this.clearTranscriptWaiter(callId);
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * End an active call.
     */
    CallManager.prototype.endCall = function (callId) {
        return __awaiter(this, void 0, void 0, function () {
            var call, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        call = this.activeCalls.get(callId);
                        if (!call) {
                            return [2 /*return*/, { success: false, error: "Call not found" }];
                        }
                        if (!this.provider || !call.providerCallId) {
                            return [2 /*return*/, { success: false, error: "Call not connected" }];
                        }
                        if (types_js_1.TerminalStates.has(call.state)) {
                            return [2 /*return*/, { success: true }]; // Already ended
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.provider.hangupCall({
                                callId: callId,
                                providerCallId: call.providerCallId,
                                reason: "hangup-bot",
                            })];
                    case 2:
                        _a.sent();
                        call.state = "hangup-bot";
                        call.endedAt = Date.now();
                        call.endReason = "hangup-bot";
                        this.persistCallRecord(call);
                        this.clearMaxDurationTimer(callId);
                        this.rejectTranscriptWaiter(callId, "Call ended: hangup-bot");
                        this.activeCalls.delete(callId);
                        if (call.providerCallId) {
                            this.providerCallIdMap.delete(call.providerCallId);
                        }
                        return [2 /*return*/, { success: true }];
                    case 3:
                        err_4 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                error: err_4 instanceof Error ? err_4.message : String(err_4),
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if an inbound call should be accepted based on policy.
     */
    CallManager.prototype.shouldAcceptInbound = function (from) {
        var _a = this.config, policy = _a.inboundPolicy, allowFrom = _a.allowFrom;
        switch (policy) {
            case "disabled":
                console.log("[voice-call] Inbound call rejected: policy is disabled");
                return false;
            case "open":
                console.log("[voice-call] Inbound call accepted: policy is open");
                return true;
            case "allowlist":
            case "pairing": {
                var normalized_1 = (from === null || from === void 0 ? void 0 : from.replace(/\D/g, "")) || "";
                var allowed = (allowFrom || []).some(function (num) {
                    var normalizedAllow = num.replace(/\D/g, "");
                    return normalized_1.endsWith(normalizedAllow) || normalizedAllow.endsWith(normalized_1);
                });
                var status_1 = allowed ? "accepted" : "rejected";
                console.log("[voice-call] Inbound call ".concat(status_1, ": ").concat(from, " ").concat(allowed ? "is in" : "not in", " allowlist"));
                return allowed;
            }
            default:
                return false;
        }
    };
    /**
     * Create a call record for an inbound call.
     */
    CallManager.prototype.createInboundCall = function (providerCallId, from, to) {
        var _a;
        var callId = node_crypto_1.default.randomUUID();
        var callRecord = {
            callId: callId,
            providerCallId: providerCallId,
            provider: ((_a = this.provider) === null || _a === void 0 ? void 0 : _a.name) || "twilio",
            direction: "inbound",
            state: "ringing",
            from: from,
            to: to,
            startedAt: Date.now(),
            transcript: [],
            processedEventIds: [],
            metadata: {
                initialMessage: this.config.inboundGreeting || "Hello! How can I help you today?",
            },
        };
        this.activeCalls.set(callId, callRecord);
        this.providerCallIdMap.set(providerCallId, callId); // Map providerCallId to internal callId
        this.persistCallRecord(callRecord);
        console.log("[voice-call] Created inbound call record: ".concat(callId, " from ").concat(from));
        return callRecord;
    };
    /**
     * Look up a call by either internal callId or providerCallId.
     */
    CallManager.prototype.findCall = function (callIdOrProviderCallId) {
        // Try direct lookup by internal callId
        var directCall = this.activeCalls.get(callIdOrProviderCallId);
        if (directCall) {
            return directCall;
        }
        // Try lookup by providerCallId
        return this.getCallByProviderCallId(callIdOrProviderCallId);
    };
    /**
     * Process a webhook event.
     */
    CallManager.prototype.processEvent = function (event) {
        // Idempotency check
        if (this.processedEventIds.has(event.id)) {
            return;
        }
        this.processedEventIds.add(event.id);
        var call = this.findCall(event.callId);
        // Handle inbound calls - create record if it doesn't exist
        if (!call && event.direction === "inbound" && event.providerCallId) {
            // Check if we should accept this inbound call
            if (!this.shouldAcceptInbound(event.from)) {
                // TODO: Could hang up the call here
                return;
            }
            // Create a new call record for this inbound call
            call = this.createInboundCall(event.providerCallId, event.from || "unknown", event.to || this.config.fromNumber || "unknown");
            // Update the event's callId to use our internal ID
            event.callId = call.callId;
        }
        if (!call) {
            // Still no call record - ignore event
            return;
        }
        // Update provider call ID if we got it
        if (event.providerCallId && event.providerCallId !== call.providerCallId) {
            var previousProviderCallId = call.providerCallId;
            call.providerCallId = event.providerCallId;
            this.providerCallIdMap.set(event.providerCallId, call.callId);
            if (previousProviderCallId) {
                var mapped = this.providerCallIdMap.get(previousProviderCallId);
                if (mapped === call.callId) {
                    this.providerCallIdMap.delete(previousProviderCallId);
                }
            }
        }
        // Track processed event
        call.processedEventIds.push(event.id);
        // Process event based on type
        switch (event.type) {
            case "call.initiated":
                this.transitionState(call, "initiated");
                break;
            case "call.ringing":
                this.transitionState(call, "ringing");
                break;
            case "call.answered":
                call.answeredAt = event.timestamp;
                this.transitionState(call, "answered");
                // Start max duration timer when call is answered
                this.startMaxDurationTimer(call.callId);
                // Best-effort: speak initial message (for inbound greetings and outbound
                // conversation mode) once the call is answered.
                this.maybeSpeakInitialMessageOnAnswered(call);
                break;
            case "call.active":
                this.transitionState(call, "active");
                break;
            case "call.speaking":
                this.transitionState(call, "speaking");
                break;
            case "call.speech":
                if (event.isFinal) {
                    this.addTranscriptEntry(call, "user", event.transcript);
                    this.resolveTranscriptWaiter(call.callId, event.transcript);
                }
                this.transitionState(call, "listening");
                break;
            case "call.ended":
                call.endedAt = event.timestamp;
                call.endReason = event.reason;
                this.transitionState(call, event.reason);
                this.clearMaxDurationTimer(call.callId);
                this.rejectTranscriptWaiter(call.callId, "Call ended: ".concat(event.reason));
                this.activeCalls.delete(call.callId);
                if (call.providerCallId) {
                    this.providerCallIdMap.delete(call.providerCallId);
                }
                break;
            case "call.error":
                if (!event.retryable) {
                    call.endedAt = event.timestamp;
                    call.endReason = "error";
                    this.transitionState(call, "error");
                    this.clearMaxDurationTimer(call.callId);
                    this.rejectTranscriptWaiter(call.callId, "Call error: ".concat(event.error));
                    this.activeCalls.delete(call.callId);
                    if (call.providerCallId) {
                        this.providerCallIdMap.delete(call.providerCallId);
                    }
                }
                break;
        }
        this.persistCallRecord(call);
    };
    CallManager.prototype.maybeSpeakInitialMessageOnAnswered = function (call) {
        var _a;
        var initialMessage = typeof ((_a = call.metadata) === null || _a === void 0 ? void 0 : _a.initialMessage) === "string" ? call.metadata.initialMessage.trim() : "";
        if (!initialMessage) {
            return;
        }
        if (!this.provider || !call.providerCallId) {
            return;
        }
        // Twilio has provider-specific state for speaking (<Say> fallback) and can
        // fail for inbound calls; keep existing Twilio behavior unchanged.
        if (this.provider.name === "twilio") {
            return;
        }
        void this.speakInitialMessage(call.providerCallId);
    };
    /**
     * Get an active call by ID.
     */
    CallManager.prototype.getCall = function (callId) {
        return this.activeCalls.get(callId);
    };
    /**
     * Get an active call by provider call ID (e.g., Twilio CallSid).
     */
    CallManager.prototype.getCallByProviderCallId = function (providerCallId) {
        // Fast path: use the providerCallIdMap for O(1) lookup
        var callId = this.providerCallIdMap.get(providerCallId);
        if (callId) {
            return this.activeCalls.get(callId);
        }
        // Fallback: linear search for cases where map wasn't populated
        // (e.g., providerCallId set directly on call record)
        for (var _i = 0, _a = this.activeCalls.values(); _i < _a.length; _i++) {
            var call = _a[_i];
            if (call.providerCallId === providerCallId) {
                return call;
            }
        }
        return undefined;
    };
    /**
     * Get all active calls.
     */
    CallManager.prototype.getActiveCalls = function () {
        return Array.from(this.activeCalls.values());
    };
    /**
     * Get call history (from persisted logs).
     */
    CallManager.prototype.getCallHistory = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var logPath, _a, content, lines, calls, _i, _b, line, parsed;
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        logPath = node_path_1.default.join(this.storePath, "calls.jsonl");
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, promises_1.default.access(logPath)];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _c.sent();
                        return [2 /*return*/, []];
                    case 4: return [4 /*yield*/, promises_1.default.readFile(logPath, "utf-8")];
                    case 5:
                        content = _c.sent();
                        lines = content.trim().split("\n").filter(Boolean);
                        calls = [];
                        // Parse last N lines
                        for (_i = 0, _b = lines.slice(-limit); _i < _b.length; _i++) {
                            line = _b[_i];
                            try {
                                parsed = types_js_1.CallRecordSchema.parse(JSON.parse(line));
                                calls.push(parsed);
                            }
                            catch (_d) {
                                // Skip invalid lines
                            }
                        }
                        return [2 /*return*/, calls];
                }
            });
        });
    };
    /**
     * Transition call state with monotonic enforcement.
     */
    CallManager.prototype.transitionState = function (call, newState) {
        // No-op for same state or already terminal
        if (call.state === newState || types_js_1.TerminalStates.has(call.state)) {
            return;
        }
        // Terminal states can always be reached from non-terminal
        if (types_js_1.TerminalStates.has(newState)) {
            call.state = newState;
            return;
        }
        // Allow cycling between speaking and listening (multi-turn conversations)
        if (CallManager.ConversationStates.has(call.state) &&
            CallManager.ConversationStates.has(newState)) {
            call.state = newState;
            return;
        }
        // Only allow forward transitions in state order
        var currentIndex = CallManager.StateOrder.indexOf(call.state);
        var newIndex = CallManager.StateOrder.indexOf(newState);
        if (newIndex > currentIndex) {
            call.state = newState;
        }
    };
    /**
     * Add an entry to the call transcript.
     */
    CallManager.prototype.addTranscriptEntry = function (call, speaker, text) {
        var entry = {
            timestamp: Date.now(),
            speaker: speaker,
            text: text,
            isFinal: true,
        };
        call.transcript.push(entry);
    };
    /**
     * Persist a call record to disk (fire-and-forget async).
     */
    CallManager.prototype.persistCallRecord = function (call) {
        var logPath = node_path_1.default.join(this.storePath, "calls.jsonl");
        var line = "".concat(JSON.stringify(call), "\n");
        // Fire-and-forget async write to avoid blocking event loop
        promises_1.default.appendFile(logPath, line).catch(function (err) {
            console.error("[voice-call] Failed to persist call record:", err);
        });
    };
    /**
     * Load active calls from persistence (for crash recovery).
     * Uses streaming to handle large log files efficiently.
     */
    CallManager.prototype.loadActiveCalls = function () {
        var logPath = node_path_1.default.join(this.storePath, "calls.jsonl");
        if (!node_fs_1.default.existsSync(logPath)) {
            return;
        }
        // Read file synchronously and parse lines
        var content = node_fs_1.default.readFileSync(logPath, "utf-8");
        var lines = content.split("\n");
        // Build map of latest state per call
        var callMap = new Map();
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            if (!line.trim()) {
                continue;
            }
            try {
                var call = types_js_1.CallRecordSchema.parse(JSON.parse(line));
                callMap.set(call.callId, call);
            }
            catch (_a) {
                // Skip invalid lines
            }
        }
        // Only keep non-terminal calls
        for (var _b = 0, callMap_1 = callMap; _b < callMap_1.length; _b++) {
            var _c = callMap_1[_b], callId = _c[0], call = _c[1];
            if (!types_js_1.TerminalStates.has(call.state)) {
                this.activeCalls.set(callId, call);
                // Populate providerCallId mapping for lookups
                if (call.providerCallId) {
                    this.providerCallIdMap.set(call.providerCallId, callId);
                }
                // Populate processed event IDs
                for (var _d = 0, _e = call.processedEventIds; _d < _e.length; _d++) {
                    var eventId = _e[_d];
                    this.processedEventIds.add(eventId);
                }
            }
        }
    };
    /**
     * Generate TwiML for notify mode (speak message and hang up).
     */
    CallManager.prototype.generateNotifyTwiml = function (message, voice) {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response>\n  <Say voice=\"".concat(voice, "\">").concat((0, voice_mapping_js_1.escapeXml)(message), "</Say>\n  <Hangup/>\n</Response>");
    };
    // States that can cycle during multi-turn conversations
    CallManager.ConversationStates = new Set(["speaking", "listening"]);
    // Non-terminal state order for monotonic transitions
    CallManager.StateOrder = [
        "initiated",
        "ringing",
        "answered",
        "active",
        "speaking",
        "listening",
    ];
    return CallManager;
}());
exports.CallManager = CallManager;
