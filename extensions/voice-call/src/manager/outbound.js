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
exports.initiateCall = initiateCall;
exports.speak = speak;
exports.speakInitialMessage = speakInitialMessage;
exports.continueCall = continueCall;
exports.endCall = endCall;
var node_crypto_1 = require("node:crypto");
var types_js_1 = require("../types.js");
var voice_mapping_js_1 = require("../voice-mapping.js");
var lookup_js_1 = require("./lookup.js");
var state_js_1 = require("./state.js");
var store_js_1 = require("./store.js");
var timers_js_1 = require("./timers.js");
var twiml_js_1 = require("./twiml.js");
function initiateCall(ctx, to, sessionKey, options) {
    return __awaiter(this, void 0, void 0, function () {
        var opts, initialMessage, mode, callId, from, callRecord, inlineTwiml, pollyVoice, result, err_1;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    opts = typeof options === "string" ? { message: options } : (options !== null && options !== void 0 ? options : {});
                    initialMessage = opts.message;
                    mode = (_a = opts.mode) !== null && _a !== void 0 ? _a : ctx.config.outbound.defaultMode;
                    if (!ctx.provider) {
                        return [2 /*return*/, { callId: "", success: false, error: "Provider not initialized" }];
                    }
                    if (!ctx.webhookUrl) {
                        return [2 /*return*/, { callId: "", success: false, error: "Webhook URL not configured" }];
                    }
                    if (ctx.activeCalls.size >= ctx.config.maxConcurrentCalls) {
                        return [2 /*return*/, {
                                callId: "",
                                success: false,
                                error: "Maximum concurrent calls (".concat(ctx.config.maxConcurrentCalls, ") reached"),
                            }];
                    }
                    callId = node_crypto_1.default.randomUUID();
                    from = ctx.config.fromNumber || (((_b = ctx.provider) === null || _b === void 0 ? void 0 : _b.name) === "mock" ? "+15550000000" : undefined);
                    if (!from) {
                        return [2 /*return*/, { callId: "", success: false, error: "fromNumber not configured" }];
                    }
                    callRecord = {
                        callId: callId,
                        provider: ctx.provider.name,
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
                    ctx.activeCalls.set(callId, callRecord);
                    (0, store_js_1.persistCallRecord)(ctx.storePath, callRecord);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    inlineTwiml = void 0;
                    if (mode === "notify" && initialMessage) {
                        pollyVoice = (0, voice_mapping_js_1.mapVoiceToPolly)((_d = (_c = ctx.config.tts) === null || _c === void 0 ? void 0 : _c.openai) === null || _d === void 0 ? void 0 : _d.voice);
                        inlineTwiml = (0, twiml_js_1.generateNotifyTwiml)(initialMessage, pollyVoice);
                        console.log("[voice-call] Using inline TwiML for notify mode (voice: ".concat(pollyVoice, ")"));
                    }
                    return [4 /*yield*/, ctx.provider.initiateCall({
                            callId: callId,
                            from: from,
                            to: to,
                            webhookUrl: ctx.webhookUrl,
                            inlineTwiml: inlineTwiml,
                        })];
                case 2:
                    result = _e.sent();
                    callRecord.providerCallId = result.providerCallId;
                    ctx.providerCallIdMap.set(result.providerCallId, callId);
                    (0, store_js_1.persistCallRecord)(ctx.storePath, callRecord);
                    return [2 /*return*/, { callId: callId, success: true }];
                case 3:
                    err_1 = _e.sent();
                    callRecord.state = "failed";
                    callRecord.endedAt = Date.now();
                    callRecord.endReason = "failed";
                    (0, store_js_1.persistCallRecord)(ctx.storePath, callRecord);
                    ctx.activeCalls.delete(callId);
                    if (callRecord.providerCallId) {
                        ctx.providerCallIdMap.delete(callRecord.providerCallId);
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
}
function speak(ctx, callId, text) {
    return __awaiter(this, void 0, void 0, function () {
        var call, voice, err_2;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    call = ctx.activeCalls.get(callId);
                    if (!call) {
                        return [2 /*return*/, { success: false, error: "Call not found" }];
                    }
                    if (!ctx.provider || !call.providerCallId) {
                        return [2 /*return*/, { success: false, error: "Call not connected" }];
                    }
                    if (types_js_1.TerminalStates.has(call.state)) {
                        return [2 /*return*/, { success: false, error: "Call has ended" }];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    (0, state_js_1.transitionState)(call, "speaking");
                    (0, store_js_1.persistCallRecord)(ctx.storePath, call);
                    (0, state_js_1.addTranscriptEntry)(call, "bot", text);
                    voice = ((_a = ctx.provider) === null || _a === void 0 ? void 0 : _a.name) === "twilio" ? (_c = (_b = ctx.config.tts) === null || _b === void 0 ? void 0 : _b.openai) === null || _c === void 0 ? void 0 : _c.voice : undefined;
                    return [4 /*yield*/, ctx.provider.playTts({
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
                    return [2 /*return*/, { success: false, error: err_2 instanceof Error ? err_2.message : String(err_2) }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function speakInitialMessage(ctx, providerCallId) {
    return __awaiter(this, void 0, void 0, function () {
        var call, initialMessage, mode, result, delaySec;
        var _this = this;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    call = (0, lookup_js_1.getCallByProviderCallId)({
                        activeCalls: ctx.activeCalls,
                        providerCallIdMap: ctx.providerCallIdMap,
                        providerCallId: providerCallId,
                    });
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
                    // Clear so we don't speak it again if the provider reconnects.
                    if (call.metadata) {
                        delete call.metadata.initialMessage;
                        (0, store_js_1.persistCallRecord)(ctx.storePath, call);
                    }
                    console.log("[voice-call] Speaking initial message for call ".concat(call.callId, " (mode: ").concat(mode, ")"));
                    return [4 /*yield*/, speak(ctx, call.callId, initialMessage)];
                case 1:
                    result = _d.sent();
                    if (!result.success) {
                        console.warn("[voice-call] Failed to speak initial message: ".concat(result.error));
                        return [2 /*return*/];
                    }
                    if (mode === "notify") {
                        delaySec = ctx.config.outbound.notifyHangupDelaySec;
                        console.log("[voice-call] Notify mode: auto-hangup in ".concat(delaySec, "s for call ").concat(call.callId));
                        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            var currentCall;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        currentCall = ctx.activeCalls.get(call.callId);
                                        if (!(currentCall && !types_js_1.TerminalStates.has(currentCall.state))) return [3 /*break*/, 2];
                                        console.log("[voice-call] Notify mode: hanging up call ".concat(call.callId));
                                        return [4 /*yield*/, endCall(ctx, call.callId)];
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
}
function continueCall(ctx, callId, prompt) {
    return __awaiter(this, void 0, void 0, function () {
        var call, transcript, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    call = ctx.activeCalls.get(callId);
                    if (!call) {
                        return [2 /*return*/, { success: false, error: "Call not found" }];
                    }
                    if (!ctx.provider || !call.providerCallId) {
                        return [2 /*return*/, { success: false, error: "Call not connected" }];
                    }
                    if (types_js_1.TerminalStates.has(call.state)) {
                        return [2 /*return*/, { success: false, error: "Call has ended" }];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, speak(ctx, callId, prompt)];
                case 2:
                    _a.sent();
                    (0, state_js_1.transitionState)(call, "listening");
                    (0, store_js_1.persistCallRecord)(ctx.storePath, call);
                    return [4 /*yield*/, ctx.provider.startListening({ callId: callId, providerCallId: call.providerCallId })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, timers_js_1.waitForFinalTranscript)(ctx, callId)];
                case 4:
                    transcript = _a.sent();
                    // Best-effort: stop listening after final transcript.
                    return [4 /*yield*/, ctx.provider.stopListening({ callId: callId, providerCallId: call.providerCallId })];
                case 5:
                    // Best-effort: stop listening after final transcript.
                    _a.sent();
                    return [2 /*return*/, { success: true, transcript: transcript }];
                case 6:
                    err_3 = _a.sent();
                    return [2 /*return*/, { success: false, error: err_3 instanceof Error ? err_3.message : String(err_3) }];
                case 7:
                    (0, timers_js_1.clearTranscriptWaiter)(ctx, callId);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function endCall(ctx, callId) {
    return __awaiter(this, void 0, void 0, function () {
        var call, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    call = ctx.activeCalls.get(callId);
                    if (!call) {
                        return [2 /*return*/, { success: false, error: "Call not found" }];
                    }
                    if (!ctx.provider || !call.providerCallId) {
                        return [2 /*return*/, { success: false, error: "Call not connected" }];
                    }
                    if (types_js_1.TerminalStates.has(call.state)) {
                        return [2 /*return*/, { success: true }];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ctx.provider.hangupCall({
                            callId: callId,
                            providerCallId: call.providerCallId,
                            reason: "hangup-bot",
                        })];
                case 2:
                    _a.sent();
                    call.state = "hangup-bot";
                    call.endedAt = Date.now();
                    call.endReason = "hangup-bot";
                    (0, store_js_1.persistCallRecord)(ctx.storePath, call);
                    (0, timers_js_1.clearMaxDurationTimer)(ctx, callId);
                    (0, timers_js_1.rejectTranscriptWaiter)(ctx, callId, "Call ended: hangup-bot");
                    ctx.activeCalls.delete(callId);
                    if (call.providerCallId) {
                        ctx.providerCallIdMap.delete(call.providerCallId);
                    }
                    return [2 /*return*/, { success: true }];
                case 3:
                    err_4 = _a.sent();
                    return [2 /*return*/, { success: false, error: err_4 instanceof Error ? err_4.message : String(err_4) }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
