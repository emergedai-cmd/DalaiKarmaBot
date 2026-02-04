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
exports.PlivoProvider = void 0;
var node_crypto_1 = require("node:crypto");
var voice_mapping_js_1 = require("../voice-mapping.js");
var webhook_security_js_1 = require("../webhook-security.js");
var PlivoProvider = /** @class */ (function () {
    function PlivoProvider(config, options) {
        if (options === void 0) { options = {}; }
        this.name = "plivo";
        // Best-effort mapping between create-call request UUID and call UUID.
        this.requestUuidToCallUuid = new Map();
        // Used for transfer URLs and GetInput action URLs.
        this.callIdToWebhookUrl = new Map();
        this.callUuidToWebhookUrl = new Map();
        this.pendingSpeakByCallId = new Map();
        this.pendingListenByCallId = new Map();
        if (!config.authId) {
            throw new Error("Plivo Auth ID is required");
        }
        if (!config.authToken) {
            throw new Error("Plivo Auth Token is required");
        }
        this.authId = config.authId;
        this.authToken = config.authToken;
        this.baseUrl = "https://api.plivo.com/v1/Account/".concat(this.authId);
        this.options = options;
    }
    PlivoProvider.prototype.apiRequest = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var method, endpoint, body, allowNotFound, response, errorText, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = params.method, endpoint = params.endpoint, body = params.body, allowNotFound = params.allowNotFound;
                        return [4 /*yield*/, fetch("".concat(this.baseUrl).concat(endpoint), {
                                method: method,
                                headers: {
                                    Authorization: "Basic ".concat(Buffer.from("".concat(this.authId, ":").concat(this.authToken)).toString("base64")),
                                    "Content-Type": "application/json",
                                },
                                body: body ? JSON.stringify(body) : undefined,
                            })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        if (allowNotFound && response.status === 404) {
                            return [2 /*return*/, undefined];
                        }
                        return [4 /*yield*/, response.text()];
                    case 2:
                        errorText = _a.sent();
                        throw new Error("Plivo API error: ".concat(response.status, " ").concat(errorText));
                    case 3: return [4 /*yield*/, response.text()];
                    case 4:
                        text = _a.sent();
                        return [2 /*return*/, text ? JSON.parse(text) : undefined];
                }
            });
        });
    };
    PlivoProvider.prototype.verifyWebhook = function (ctx) {
        var result = (0, webhook_security_js_1.verifyPlivoWebhook)(ctx, this.authToken, {
            publicUrl: this.options.publicUrl,
            skipVerification: this.options.skipVerification,
        });
        if (!result.ok) {
            console.warn("[plivo] Webhook verification failed: ".concat(result.reason));
        }
        return { ok: result.ok, reason: result.reason };
    };
    PlivoProvider.prototype.parseWebhookEvent = function (ctx) {
        var _a;
        var flow = typeof ((_a = ctx.query) === null || _a === void 0 ? void 0 : _a.flow) === "string" ? ctx.query.flow.trim() : "";
        var parsed = this.parseBody(ctx.rawBody);
        if (!parsed) {
            return { events: [], statusCode: 400 };
        }
        // Keep providerCallId mapping for later call control.
        var callUuid = parsed.get("CallUUID") || undefined;
        if (callUuid) {
            var webhookBase = PlivoProvider.baseWebhookUrlFromCtx(ctx);
            if (webhookBase) {
                this.callUuidToWebhookUrl.set(callUuid, webhookBase);
            }
        }
        // Special flows that exist only to return Plivo XML (no events).
        if (flow === "xml-speak") {
            var callId = this.getCallIdFromQuery(ctx);
            var pending = callId ? this.pendingSpeakByCallId.get(callId) : undefined;
            if (callId) {
                this.pendingSpeakByCallId.delete(callId);
            }
            var xml = pending
                ? PlivoProvider.xmlSpeak(pending.text, pending.locale)
                : PlivoProvider.xmlKeepAlive();
            return {
                events: [],
                providerResponseBody: xml,
                providerResponseHeaders: { "Content-Type": "text/xml" },
                statusCode: 200,
            };
        }
        if (flow === "xml-listen") {
            var callId = this.getCallIdFromQuery(ctx);
            var pending = callId ? this.pendingListenByCallId.get(callId) : undefined;
            if (callId) {
                this.pendingListenByCallId.delete(callId);
            }
            var actionUrl = this.buildActionUrl(ctx, {
                flow: "getinput",
                callId: callId,
            });
            var xml = actionUrl && callId
                ? PlivoProvider.xmlGetInputSpeech({
                    actionUrl: actionUrl,
                    language: pending === null || pending === void 0 ? void 0 : pending.language,
                })
                : PlivoProvider.xmlKeepAlive();
            return {
                events: [],
                providerResponseBody: xml,
                providerResponseHeaders: { "Content-Type": "text/xml" },
                statusCode: 200,
            };
        }
        // Normal events.
        var callIdFromQuery = this.getCallIdFromQuery(ctx);
        var event = this.normalizeEvent(parsed, callIdFromQuery);
        return {
            events: event ? [event] : [],
            providerResponseBody: flow === "answer" || flow === "getinput"
                ? PlivoProvider.xmlKeepAlive()
                : PlivoProvider.xmlEmpty(),
            providerResponseHeaders: { "Content-Type": "text/xml" },
            statusCode: 200,
        };
    };
    PlivoProvider.prototype.normalizeEvent = function (params, callIdOverride) {
        var callUuid = params.get("CallUUID") || "";
        var requestUuid = params.get("RequestUUID") || "";
        if (requestUuid && callUuid) {
            this.requestUuidToCallUuid.set(requestUuid, callUuid);
        }
        var direction = params.get("Direction");
        var from = params.get("From") || undefined;
        var to = params.get("To") || undefined;
        var callStatus = params.get("CallStatus");
        var baseEvent = {
            id: node_crypto_1.default.randomUUID(),
            callId: callIdOverride || callUuid || requestUuid,
            providerCallId: callUuid || requestUuid || undefined,
            timestamp: Date.now(),
            direction: direction === "inbound"
                ? "inbound"
                : direction === "outbound"
                    ? "outbound"
                    : undefined,
            from: from,
            to: to,
        };
        var digits = params.get("Digits");
        if (digits) {
            return __assign(__assign({}, baseEvent), { type: "call.dtmf", digits: digits });
        }
        var transcript = PlivoProvider.extractTranscript(params);
        if (transcript) {
            return __assign(__assign({}, baseEvent), { type: "call.speech", transcript: transcript, isFinal: true });
        }
        // Call lifecycle.
        if (callStatus === "ringing") {
            return __assign(__assign({}, baseEvent), { type: "call.ringing" });
        }
        if (callStatus === "in-progress") {
            return __assign(__assign({}, baseEvent), { type: "call.answered" });
        }
        if (callStatus === "completed" ||
            callStatus === "busy" ||
            callStatus === "no-answer" ||
            callStatus === "failed") {
            return __assign(__assign({}, baseEvent), { type: "call.ended", reason: callStatus === "completed"
                    ? "completed"
                    : callStatus === "busy"
                        ? "busy"
                        : callStatus === "no-answer"
                            ? "no-answer"
                            : "failed" });
        }
        // Plivo will call our answer_url when the call is answered; if we don't have
        // a CallStatus for some reason, treat it as answered so the call can proceed.
        if (params.get("Event") === "StartApp" && callUuid) {
            return __assign(__assign({}, baseEvent), { type: "call.answered" });
        }
        return null;
    };
    PlivoProvider.prototype.initiateCall = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var webhookUrl, answerUrl, hangupUrl, ringTimeoutSec, result, requestUuid;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        webhookUrl = new URL(input.webhookUrl);
                        webhookUrl.searchParams.set("provider", "plivo");
                        webhookUrl.searchParams.set("callId", input.callId);
                        answerUrl = new URL(webhookUrl);
                        answerUrl.searchParams.set("flow", "answer");
                        hangupUrl = new URL(webhookUrl);
                        hangupUrl.searchParams.set("flow", "hangup");
                        this.callIdToWebhookUrl.set(input.callId, input.webhookUrl);
                        ringTimeoutSec = (_a = this.options.ringTimeoutSec) !== null && _a !== void 0 ? _a : 30;
                        return [4 /*yield*/, this.apiRequest({
                                method: "POST",
                                endpoint: "/Call/",
                                body: {
                                    from: PlivoProvider.normalizeNumber(input.from),
                                    to: PlivoProvider.normalizeNumber(input.to),
                                    answer_url: answerUrl.toString(),
                                    answer_method: "POST",
                                    hangup_url: hangupUrl.toString(),
                                    hangup_method: "POST",
                                    // Plivo's API uses `hangup_on_ring` for outbound ring timeout.
                                    hangup_on_ring: ringTimeoutSec,
                                },
                            })];
                    case 1:
                        result = _b.sent();
                        requestUuid = Array.isArray(result.request_uuid)
                            ? result.request_uuid[0]
                            : result.request_uuid;
                        if (!requestUuid) {
                            throw new Error("Plivo call create returned no request_uuid");
                        }
                        return [2 /*return*/, { providerCallId: requestUuid, status: "initiated" }];
                }
            });
        });
    };
    PlivoProvider.prototype.hangupCall = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var callUuid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        callUuid = this.requestUuidToCallUuid.get(input.providerCallId);
                        if (!callUuid) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.apiRequest({
                                method: "DELETE",
                                endpoint: "/Call/".concat(callUuid, "/"),
                                allowNotFound: true,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2: 
                    // Best-effort: try hangup (call UUID), then cancel (request UUID).
                    return [4 /*yield*/, this.apiRequest({
                            method: "DELETE",
                            endpoint: "/Call/".concat(input.providerCallId, "/"),
                            allowNotFound: true,
                        })];
                    case 3:
                        // Best-effort: try hangup (call UUID), then cancel (request UUID).
                        _a.sent();
                        return [4 /*yield*/, this.apiRequest({
                                method: "DELETE",
                                endpoint: "/Request/".concat(input.providerCallId, "/"),
                                allowNotFound: true,
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PlivoProvider.prototype.playTts = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var callUuid, webhookBase, transferUrl;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        callUuid = (_a = this.requestUuidToCallUuid.get(input.providerCallId)) !== null && _a !== void 0 ? _a : input.providerCallId;
                        webhookBase = this.callUuidToWebhookUrl.get(callUuid) || this.callIdToWebhookUrl.get(input.callId);
                        if (!webhookBase) {
                            throw new Error("Missing webhook URL for this call (provider state missing)");
                        }
                        if (!callUuid) {
                            throw new Error("Missing Plivo CallUUID for playTts");
                        }
                        transferUrl = new URL(webhookBase);
                        transferUrl.searchParams.set("provider", "plivo");
                        transferUrl.searchParams.set("flow", "xml-speak");
                        transferUrl.searchParams.set("callId", input.callId);
                        this.pendingSpeakByCallId.set(input.callId, {
                            text: input.text,
                            locale: input.locale,
                        });
                        return [4 /*yield*/, this.apiRequest({
                                method: "POST",
                                endpoint: "/Call/".concat(callUuid, "/"),
                                body: {
                                    legs: "aleg",
                                    aleg_url: transferUrl.toString(),
                                    aleg_method: "POST",
                                },
                            })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PlivoProvider.prototype.startListening = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var callUuid, webhookBase, transferUrl;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        callUuid = (_a = this.requestUuidToCallUuid.get(input.providerCallId)) !== null && _a !== void 0 ? _a : input.providerCallId;
                        webhookBase = this.callUuidToWebhookUrl.get(callUuid) || this.callIdToWebhookUrl.get(input.callId);
                        if (!webhookBase) {
                            throw new Error("Missing webhook URL for this call (provider state missing)");
                        }
                        if (!callUuid) {
                            throw new Error("Missing Plivo CallUUID for startListening");
                        }
                        transferUrl = new URL(webhookBase);
                        transferUrl.searchParams.set("provider", "plivo");
                        transferUrl.searchParams.set("flow", "xml-listen");
                        transferUrl.searchParams.set("callId", input.callId);
                        this.pendingListenByCallId.set(input.callId, {
                            language: input.language,
                        });
                        return [4 /*yield*/, this.apiRequest({
                                method: "POST",
                                endpoint: "/Call/".concat(callUuid, "/"),
                                body: {
                                    legs: "aleg",
                                    aleg_url: transferUrl.toString(),
                                    aleg_method: "POST",
                                },
                            })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PlivoProvider.prototype.stopListening = function (_input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    PlivoProvider.normalizeNumber = function (numberOrSip) {
        var trimmed = numberOrSip.trim();
        if (trimmed.toLowerCase().startsWith("sip:")) {
            return trimmed;
        }
        return trimmed.replace(/[^\d+]/g, "");
    };
    PlivoProvider.xmlEmpty = function () {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>";
    };
    PlivoProvider.xmlKeepAlive = function () {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response>\n  <Wait length=\"300\" />\n</Response>";
    };
    PlivoProvider.xmlSpeak = function (text, locale) {
        var language = locale || "en-US";
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response>\n  <Speak language=\"".concat((0, voice_mapping_js_1.escapeXml)(language), "\">").concat((0, voice_mapping_js_1.escapeXml)(text), "</Speak>\n  <Wait length=\"300\" />\n</Response>");
    };
    PlivoProvider.xmlGetInputSpeech = function (params) {
        var language = params.language || "en-US";
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response>\n  <GetInput inputType=\"speech\" method=\"POST\" action=\"".concat((0, voice_mapping_js_1.escapeXml)(params.actionUrl), "\" language=\"").concat((0, voice_mapping_js_1.escapeXml)(language), "\" executionTimeout=\"30\" speechEndTimeout=\"1\" redirect=\"false\">\n  </GetInput>\n  <Wait length=\"300\" />\n</Response>");
    };
    PlivoProvider.prototype.getCallIdFromQuery = function (ctx) {
        var _a;
        var callId = typeof ((_a = ctx.query) === null || _a === void 0 ? void 0 : _a.callId) === "string" && ctx.query.callId.trim()
            ? ctx.query.callId.trim()
            : undefined;
        return callId || undefined;
    };
    PlivoProvider.prototype.buildActionUrl = function (ctx, opts) {
        var base = PlivoProvider.baseWebhookUrlFromCtx(ctx);
        if (!base) {
            return null;
        }
        var u = new URL(base);
        u.searchParams.set("provider", "plivo");
        u.searchParams.set("flow", opts.flow);
        if (opts.callId) {
            u.searchParams.set("callId", opts.callId);
        }
        return u.toString();
    };
    PlivoProvider.baseWebhookUrlFromCtx = function (ctx) {
        try {
            var u = new URL((0, webhook_security_js_1.reconstructWebhookUrl)(ctx));
            return "".concat(u.origin).concat(u.pathname);
        }
        catch (_a) {
            return null;
        }
    };
    PlivoProvider.prototype.parseBody = function (rawBody) {
        try {
            return new URLSearchParams(rawBody);
        }
        catch (_a) {
            return null;
        }
    };
    PlivoProvider.extractTranscript = function (params) {
        var candidates = [
            "Speech",
            "Transcription",
            "TranscriptionText",
            "SpeechResult",
            "RecognizedSpeech",
            "Text",
        ];
        for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
            var key = candidates_1[_i];
            var value = params.get(key);
            if (value && value.trim()) {
                return value.trim();
            }
        }
        return null;
    };
    return PlivoProvider;
}());
exports.PlivoProvider = PlivoProvider;
