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
var typebox_1 = require("@sinclair/typebox");
var cli_js_1 = require("./src/cli.js");
var config_js_1 = require("./src/config.js");
var runtime_js_1 = require("./src/runtime.js");
var voiceCallConfigSchema = {
    parse: function (value) {
        var _a;
        var raw = value && typeof value === "object" && !Array.isArray(value)
            ? value
            : {};
        var twilio = raw.twilio;
        var legacyFrom = typeof (twilio === null || twilio === void 0 ? void 0 : twilio.from) === "string" ? twilio.from : undefined;
        var enabled = typeof raw.enabled === "boolean" ? raw.enabled : true;
        var providerRaw = raw.provider === "log" ? "mock" : raw.provider;
        var provider = providerRaw !== null && providerRaw !== void 0 ? providerRaw : (enabled ? "mock" : undefined);
        return config_js_1.VoiceCallConfigSchema.parse(__assign(__assign({}, raw), { enabled: enabled, provider: provider, fromNumber: (_a = raw.fromNumber) !== null && _a !== void 0 ? _a : legacyFrom }));
    },
    uiHints: {
        provider: {
            label: "Provider",
            help: "Use twilio, telnyx, or mock for dev/no-network.",
        },
        fromNumber: { label: "From Number", placeholder: "+15550001234" },
        toNumber: { label: "Default To Number", placeholder: "+15550001234" },
        inboundPolicy: { label: "Inbound Policy" },
        allowFrom: { label: "Inbound Allowlist" },
        inboundGreeting: { label: "Inbound Greeting", advanced: true },
        "telnyx.apiKey": { label: "Telnyx API Key", sensitive: true },
        "telnyx.connectionId": { label: "Telnyx Connection ID" },
        "telnyx.publicKey": { label: "Telnyx Public Key", sensitive: true },
        "twilio.accountSid": { label: "Twilio Account SID" },
        "twilio.authToken": { label: "Twilio Auth Token", sensitive: true },
        "outbound.defaultMode": { label: "Default Call Mode" },
        "outbound.notifyHangupDelaySec": {
            label: "Notify Hangup Delay (sec)",
            advanced: true,
        },
        "serve.port": { label: "Webhook Port" },
        "serve.bind": { label: "Webhook Bind" },
        "serve.path": { label: "Webhook Path" },
        "tailscale.mode": { label: "Tailscale Mode", advanced: true },
        "tailscale.path": { label: "Tailscale Path", advanced: true },
        "tunnel.provider": { label: "Tunnel Provider", advanced: true },
        "tunnel.ngrokAuthToken": {
            label: "ngrok Auth Token",
            sensitive: true,
            advanced: true,
        },
        "tunnel.ngrokDomain": { label: "ngrok Domain", advanced: true },
        "tunnel.allowNgrokFreeTierLoopbackBypass": {
            label: "Allow ngrok Free Tier (Loopback Bypass)",
            advanced: true,
        },
        "streaming.enabled": { label: "Enable Streaming", advanced: true },
        "streaming.openaiApiKey": {
            label: "OpenAI Realtime API Key",
            sensitive: true,
            advanced: true,
        },
        "streaming.sttModel": { label: "Realtime STT Model", advanced: true },
        "streaming.streamPath": { label: "Media Stream Path", advanced: true },
        "tts.provider": {
            label: "TTS Provider Override",
            help: "Deep-merges with messages.tts (Edge is ignored for calls).",
            advanced: true,
        },
        "tts.openai.model": { label: "OpenAI TTS Model", advanced: true },
        "tts.openai.voice": { label: "OpenAI TTS Voice", advanced: true },
        "tts.openai.apiKey": {
            label: "OpenAI API Key",
            sensitive: true,
            advanced: true,
        },
        "tts.elevenlabs.modelId": { label: "ElevenLabs Model ID", advanced: true },
        "tts.elevenlabs.voiceId": { label: "ElevenLabs Voice ID", advanced: true },
        "tts.elevenlabs.apiKey": {
            label: "ElevenLabs API Key",
            sensitive: true,
            advanced: true,
        },
        "tts.elevenlabs.baseUrl": { label: "ElevenLabs Base URL", advanced: true },
        publicUrl: { label: "Public Webhook URL", advanced: true },
        skipSignatureVerification: {
            label: "Skip Signature Verification",
            advanced: true,
        },
        store: { label: "Call Log Store Path", advanced: true },
        responseModel: { label: "Response Model", advanced: true },
        responseSystemPrompt: { label: "Response System Prompt", advanced: true },
        responseTimeoutMs: { label: "Response Timeout (ms)", advanced: true },
    },
};
var VoiceCallToolSchema = typebox_1.Type.Union([
    typebox_1.Type.Object({
        action: typebox_1.Type.Literal("initiate_call"),
        to: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Call target" })),
        message: typebox_1.Type.String({ description: "Intro message" }),
        mode: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal("notify"), typebox_1.Type.Literal("conversation")])),
    }),
    typebox_1.Type.Object({
        action: typebox_1.Type.Literal("continue_call"),
        callId: typebox_1.Type.String({ description: "Call ID" }),
        message: typebox_1.Type.String({ description: "Follow-up message" }),
    }),
    typebox_1.Type.Object({
        action: typebox_1.Type.Literal("speak_to_user"),
        callId: typebox_1.Type.String({ description: "Call ID" }),
        message: typebox_1.Type.String({ description: "Message to speak" }),
    }),
    typebox_1.Type.Object({
        action: typebox_1.Type.Literal("end_call"),
        callId: typebox_1.Type.String({ description: "Call ID" }),
    }),
    typebox_1.Type.Object({
        action: typebox_1.Type.Literal("get_status"),
        callId: typebox_1.Type.String({ description: "Call ID" }),
    }),
    typebox_1.Type.Object({
        mode: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal("call"), typebox_1.Type.Literal("status")])),
        to: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Call target" })),
        sid: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Call SID" })),
        message: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Optional intro message" })),
    }),
]);
var voiceCallPlugin = {
    id: "voice-call",
    name: "Voice Call",
    description: "Voice-call plugin with Telnyx/Twilio/Plivo providers",
    configSchema: voiceCallConfigSchema,
    register: function (api) {
        var _this = this;
        var config = (0, config_js_1.resolveVoiceCallConfig)(voiceCallConfigSchema.parse(api.pluginConfig));
        var validation = (0, config_js_1.validateProviderConfig)(config);
        if (api.pluginConfig && typeof api.pluginConfig === "object") {
            var raw = api.pluginConfig;
            var twilio = raw.twilio;
            if (raw.provider === "log") {
                api.logger.warn('[voice-call] provider "log" is deprecated; use "mock" instead');
            }
            if (typeof (twilio === null || twilio === void 0 ? void 0 : twilio.from) === "string") {
                api.logger.warn("[voice-call] twilio.from is deprecated; use fromNumber instead");
            }
        }
        var runtimePromise = null;
        var runtime = null;
        var ensureRuntime = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!config.enabled) {
                            throw new Error("Voice call disabled in plugin config");
                        }
                        if (!validation.valid) {
                            throw new Error(validation.errors.join("; "));
                        }
                        if (runtime) {
                            return [2 /*return*/, runtime];
                        }
                        if (!runtimePromise) {
                            runtimePromise = (0, runtime_js_1.createVoiceCallRuntime)({
                                config: config,
                                coreConfig: api.config,
                                ttsRuntime: api.runtime.tts,
                                logger: api.logger,
                            });
                        }
                        return [4 /*yield*/, runtimePromise];
                    case 1:
                        runtime = _a.sent();
                        return [2 /*return*/, runtime];
                }
            });
        }); };
        var sendError = function (respond, err) {
            respond(false, { error: err instanceof Error ? err.message : String(err) });
        };
        api.registerGatewayMethod("voicecall.initiate", function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var message, rt, to, mode, result, err_1;
            var params = _b.params, respond = _b.respond;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        message = typeof (params === null || params === void 0 ? void 0 : params.message) === "string" ? params.message.trim() : "";
                        if (!message) {
                            respond(false, { error: "message required" });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, ensureRuntime()];
                    case 1:
                        rt = _c.sent();
                        to = typeof (params === null || params === void 0 ? void 0 : params.to) === "string" && params.to.trim()
                            ? params.to.trim()
                            : rt.config.toNumber;
                        if (!to) {
                            respond(false, { error: "to required" });
                            return [2 /*return*/];
                        }
                        mode = (params === null || params === void 0 ? void 0 : params.mode) === "notify" || (params === null || params === void 0 ? void 0 : params.mode) === "conversation" ? params.mode : undefined;
                        return [4 /*yield*/, rt.manager.initiateCall(to, undefined, {
                                message: message,
                                mode: mode,
                            })];
                    case 2:
                        result = _c.sent();
                        if (!result.success) {
                            respond(false, { error: result.error || "initiate failed" });
                            return [2 /*return*/];
                        }
                        respond(true, { callId: result.callId, initiated: true });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _c.sent();
                        sendError(respond, err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        api.registerGatewayMethod("voicecall.continue", function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var callId, message, rt, result, err_2;
            var params = _b.params, respond = _b.respond;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        callId = typeof (params === null || params === void 0 ? void 0 : params.callId) === "string" ? params.callId.trim() : "";
                        message = typeof (params === null || params === void 0 ? void 0 : params.message) === "string" ? params.message.trim() : "";
                        if (!callId || !message) {
                            respond(false, { error: "callId and message required" });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, ensureRuntime()];
                    case 1:
                        rt = _c.sent();
                        return [4 /*yield*/, rt.manager.continueCall(callId, message)];
                    case 2:
                        result = _c.sent();
                        if (!result.success) {
                            respond(false, { error: result.error || "continue failed" });
                            return [2 /*return*/];
                        }
                        respond(true, { success: true, transcript: result.transcript });
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _c.sent();
                        sendError(respond, err_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        api.registerGatewayMethod("voicecall.speak", function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var callId, message, rt, result, err_3;
            var params = _b.params, respond = _b.respond;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        callId = typeof (params === null || params === void 0 ? void 0 : params.callId) === "string" ? params.callId.trim() : "";
                        message = typeof (params === null || params === void 0 ? void 0 : params.message) === "string" ? params.message.trim() : "";
                        if (!callId || !message) {
                            respond(false, { error: "callId and message required" });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, ensureRuntime()];
                    case 1:
                        rt = _c.sent();
                        return [4 /*yield*/, rt.manager.speak(callId, message)];
                    case 2:
                        result = _c.sent();
                        if (!result.success) {
                            respond(false, { error: result.error || "speak failed" });
                            return [2 /*return*/];
                        }
                        respond(true, { success: true });
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _c.sent();
                        sendError(respond, err_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        api.registerGatewayMethod("voicecall.end", function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var callId, rt, result, err_4;
            var params = _b.params, respond = _b.respond;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        callId = typeof (params === null || params === void 0 ? void 0 : params.callId) === "string" ? params.callId.trim() : "";
                        if (!callId) {
                            respond(false, { error: "callId required" });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, ensureRuntime()];
                    case 1:
                        rt = _c.sent();
                        return [4 /*yield*/, rt.manager.endCall(callId)];
                    case 2:
                        result = _c.sent();
                        if (!result.success) {
                            respond(false, { error: result.error || "end failed" });
                            return [2 /*return*/];
                        }
                        respond(true, { success: true });
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _c.sent();
                        sendError(respond, err_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        api.registerGatewayMethod("voicecall.status", function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var raw, rt, call, err_5;
            var params = _b.params, respond = _b.respond;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        raw = typeof (params === null || params === void 0 ? void 0 : params.callId) === "string"
                            ? params.callId.trim()
                            : typeof (params === null || params === void 0 ? void 0 : params.sid) === "string"
                                ? params.sid.trim()
                                : "";
                        if (!raw) {
                            respond(false, { error: "callId required" });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, ensureRuntime()];
                    case 1:
                        rt = _c.sent();
                        call = rt.manager.getCall(raw) || rt.manager.getCallByProviderCallId(raw);
                        if (!call) {
                            respond(true, { found: false });
                            return [2 /*return*/];
                        }
                        respond(true, { found: true, call: call });
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _c.sent();
                        sendError(respond, err_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        api.registerGatewayMethod("voicecall.start", function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var to, message, rt, result, err_6;
            var params = _b.params, respond = _b.respond;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        to = typeof (params === null || params === void 0 ? void 0 : params.to) === "string" ? params.to.trim() : "";
                        message = typeof (params === null || params === void 0 ? void 0 : params.message) === "string" ? params.message.trim() : "";
                        if (!to) {
                            respond(false, { error: "to required" });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, ensureRuntime()];
                    case 1:
                        rt = _c.sent();
                        return [4 /*yield*/, rt.manager.initiateCall(to, undefined, {
                                message: message || undefined,
                            })];
                    case 2:
                        result = _c.sent();
                        if (!result.success) {
                            respond(false, { error: result.error || "initiate failed" });
                            return [2 /*return*/];
                        }
                        respond(true, { callId: result.callId, initiated: true });
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _c.sent();
                        sendError(respond, err_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        api.registerTool({
            name: "voice_call",
            label: "Voice Call",
            description: "Make phone calls and have voice conversations via the voice-call plugin.",
            parameters: VoiceCallToolSchema,
            execute: function (_toolCallId, params) {
                return __awaiter(this, void 0, void 0, function () {
                    var json, rt, _a, message, to_1, result_1, callId, message, result_2, callId, message, result_3, callId, result_4, callId, call, mode, sid, call, to, result, err_7;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                json = function (payload) { return ({
                                    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
                                    details: payload,
                                }); };
                                _c.label = 1;
                            case 1:
                                _c.trys.push([1, 14, , 15]);
                                return [4 /*yield*/, ensureRuntime()];
                            case 2:
                                rt = _c.sent();
                                if (!(typeof (params === null || params === void 0 ? void 0 : params.action) === "string")) return [3 /*break*/, 12];
                                _a = params.action;
                                switch (_a) {
                                    case "initiate_call": return [3 /*break*/, 3];
                                    case "continue_call": return [3 /*break*/, 5];
                                    case "speak_to_user": return [3 /*break*/, 7];
                                    case "end_call": return [3 /*break*/, 9];
                                    case "get_status": return [3 /*break*/, 11];
                                }
                                return [3 /*break*/, 12];
                            case 3:
                                message = String(params.message || "").trim();
                                if (!message) {
                                    throw new Error("message required");
                                }
                                to_1 = typeof params.to === "string" && params.to.trim()
                                    ? params.to.trim()
                                    : rt.config.toNumber;
                                if (!to_1) {
                                    throw new Error("to required");
                                }
                                return [4 /*yield*/, rt.manager.initiateCall(to_1, undefined, {
                                        message: message,
                                        mode: params.mode === "notify" || params.mode === "conversation"
                                            ? params.mode
                                            : undefined,
                                    })];
                            case 4:
                                result_1 = _c.sent();
                                if (!result_1.success) {
                                    throw new Error(result_1.error || "initiate failed");
                                }
                                return [2 /*return*/, json({ callId: result_1.callId, initiated: true })];
                            case 5:
                                callId = String(params.callId || "").trim();
                                message = String(params.message || "").trim();
                                if (!callId || !message) {
                                    throw new Error("callId and message required");
                                }
                                return [4 /*yield*/, rt.manager.continueCall(callId, message)];
                            case 6:
                                result_2 = _c.sent();
                                if (!result_2.success) {
                                    throw new Error(result_2.error || "continue failed");
                                }
                                return [2 /*return*/, json({ success: true, transcript: result_2.transcript })];
                            case 7:
                                callId = String(params.callId || "").trim();
                                message = String(params.message || "").trim();
                                if (!callId || !message) {
                                    throw new Error("callId and message required");
                                }
                                return [4 /*yield*/, rt.manager.speak(callId, message)];
                            case 8:
                                result_3 = _c.sent();
                                if (!result_3.success) {
                                    throw new Error(result_3.error || "speak failed");
                                }
                                return [2 /*return*/, json({ success: true })];
                            case 9:
                                callId = String(params.callId || "").trim();
                                if (!callId) {
                                    throw new Error("callId required");
                                }
                                return [4 /*yield*/, rt.manager.endCall(callId)];
                            case 10:
                                result_4 = _c.sent();
                                if (!result_4.success) {
                                    throw new Error(result_4.error || "end failed");
                                }
                                return [2 /*return*/, json({ success: true })];
                            case 11:
                                {
                                    callId = String(params.callId || "").trim();
                                    if (!callId) {
                                        throw new Error("callId required");
                                    }
                                    call = rt.manager.getCall(callId) || rt.manager.getCallByProviderCallId(callId);
                                    return [2 /*return*/, json(call ? { found: true, call: call } : { found: false })];
                                }
                                _c.label = 12;
                            case 12:
                                mode = (_b = params === null || params === void 0 ? void 0 : params.mode) !== null && _b !== void 0 ? _b : "call";
                                if (mode === "status") {
                                    sid = typeof params.sid === "string" ? params.sid.trim() : "";
                                    if (!sid) {
                                        throw new Error("sid required for status");
                                    }
                                    call = rt.manager.getCall(sid) || rt.manager.getCallByProviderCallId(sid);
                                    return [2 /*return*/, json(call ? { found: true, call: call } : { found: false })];
                                }
                                to = typeof params.to === "string" && params.to.trim()
                                    ? params.to.trim()
                                    : rt.config.toNumber;
                                if (!to) {
                                    throw new Error("to required for call");
                                }
                                return [4 /*yield*/, rt.manager.initiateCall(to, undefined, {
                                        message: typeof params.message === "string" && params.message.trim()
                                            ? params.message.trim()
                                            : undefined,
                                    })];
                            case 13:
                                result = _c.sent();
                                if (!result.success) {
                                    throw new Error(result.error || "initiate failed");
                                }
                                return [2 /*return*/, json({ callId: result.callId, initiated: true })];
                            case 14:
                                err_7 = _c.sent();
                                return [2 /*return*/, json({
                                        error: err_7 instanceof Error ? err_7.message : String(err_7),
                                    })];
                            case 15: return [2 /*return*/];
                        }
                    });
                });
            },
        });
        api.registerCli(function (_a) {
            var program = _a.program;
            return (0, cli_js_1.registerVoiceCallCli)({
                program: program,
                config: config,
                ensureRuntime: ensureRuntime,
                logger: api.logger,
            });
        }, { commands: ["voicecall"] });
        api.registerService({
            id: "voicecall",
            start: function () { return __awaiter(_this, void 0, void 0, function () {
                var err_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!config.enabled) {
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, ensureRuntime()];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            err_8 = _a.sent();
                            api.logger.error("[voice-call] Failed to start runtime: ".concat(err_8 instanceof Error ? err_8.message : String(err_8)));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); },
            stop: function () { return __awaiter(_this, void 0, void 0, function () {
                var rt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!runtimePromise) {
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, , 4, 5]);
                            return [4 /*yield*/, runtimePromise];
                        case 2:
                            rt = _a.sent();
                            return [4 /*yield*/, rt.stop()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            runtimePromise = null;
                            runtime = null;
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            }); },
        });
    },
};
exports.default = voiceCallPlugin;
